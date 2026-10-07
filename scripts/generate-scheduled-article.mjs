import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, stringify } from 'yaml';

const root = fileURLToPath(new URL('../', import.meta.url));
const queuePath = join(root, 'automation', 'topics.json');
const articlesDir = join(root, 'src', 'content', 'articles');
const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || 'gpt-6-sol';
const requestedTopicId = (process.env.TOPIC_ID || '').trim();

if (!apiKey) {
  throw new Error('OPENAI_API_KEY belum tersedia.');
}

const queue = JSON.parse(readFileSync(queuePath, 'utf8'));
const topic = requestedTopicId
  ? queue.topics.find((item) => item.id === requestedTopicId)
  : queue.topics.find((item) => item.status === 'pending');

if (!topic) {
  console.log('Tidak ada topic pending yang perlu dibuat.');
  process.exit(0);
}

if (topic.status !== 'pending') {
  throw new Error(`Topic ${topic.id} berstatus "${topic.status}", bukan pending.`);
}

const existing = readdirSync(articlesDir)
  .filter((name) => name.endsWith('.md') || name.endsWith('.mdx'))
  .map((name) => {
    const raw = readFileSync(join(articlesDir, name), 'utf8');
    const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return null;
    try {
      const data = parse(match[1]);
      return { title: data.title, slug: data.slug };
    } catch {
      return null;
    }
  })
  .filter(Boolean);

const outputSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: { type: 'string' },
    seoTitle: { type: 'string' },
    description: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 8 },
    sources: {
      type: 'array',
      minItems: 3,
      maxItems: 8,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          title: { type: 'string' },
          url: { type: 'string' }
        },
        required: ['title', 'url']
      }
    },
    body: { type: 'string' }
  },
  required: ['title', 'seoTitle', 'description', 'tags', 'sources', 'body']
};

const instructions = `
Anda adalah redaksi TeknoPraktis, media teknologi praktis berbahasa Indonesia.

Tujuan: menghasilkan artikel people-first yang benar-benar membantu pembaca Indonesia, bukan halaman SEO massal.

Aturan wajib:
- Gunakan web search untuk riset faktual sebelum menulis.
- Prioritaskan dokumentasi resmi, pusat bantuan resmi, standar, atau sumber primer. Gunakan sumber sekunder bereputasi hanya jika berguna.
- Jangan mengarang hasil pengujian, pengalaman langsung, harga, statistik, kutipan, fitur, atau sumber.
- Jika fakta berubah menurut versi/produk, jelaskan batas tersebut.
- Jangan menulis seolah-olah Redaksi telah menguji perangkat atau layanan bila tidak ada bukti.
- Artikel 800–1.400 kata, tetapi jangan menambah filler hanya demi panjang.
- Gunakan Bahasa Indonesia natural, ringkas, teknis secukupnya.
- Tanpa H1 di body. Gunakan minimal 4 heading H2.
- Sertakan langkah/checklist yang bisa dilakukan, kesalahan umum, batasan/risiko, dan kesimpulan praktis.
- Hindari clickbait, keyword stuffing, dan paragraf generik yang tidak menambah nilai.
- Title 35–85 karakter.
- seoTitle 35–65 karakter.
- Description 110–170 karakter.
- Sumber minimum 3 URL HTTPS yang benar-benar dipakai dalam riset.
- Output harus sesuai JSON schema, tanpa teks di luar JSON.
`;

const prompt = `
Topik terjadwal:
${JSON.stringify(topic, null, 2)}

Artikel yang sudah ada (hindari duplikasi sudut bahasan):
${JSON.stringify(existing, null, 2)}

Gunakan slug yang sudah ditetapkan sistem: ${topic.suggestedSlug}
Kategori yang sudah ditetapkan sistem: ${topic.category} / ${topic.categorySlug}

Tulis artikel yang memberikan sintesis dan keputusan praktis, bukan sekadar merangkum halaman sumber.
`;

const response = await fetch('https://api.openai.com/v1/responses', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model,
    instructions,
    input: prompt,
    tools: [{ type: 'web_search' }],
    max_tool_calls: 5,
    max_output_tokens: 7000,
    text: {
      format: {
        type: 'json_schema',
        name: 'teknopraktis_article_candidate',
        strict: true,
        schema: outputSchema
      }
    }
  })
});

if (!response.ok) {
  const message = await response.text();
  throw new Error(`OpenAI Responses API gagal: HTTP ${response.status} — ${message}`);
}

const data = await response.json();
const outputText = (data.output || [])
  .flatMap((item) => item.content || [])
  .filter((part) => part.type === 'output_text')
  .map((part) => part.text)
  .join('')
  .trim();

if (!outputText) {
  throw new Error('Model tidak mengembalikan output_text.');
}

const candidate = JSON.parse(outputText);
const words = candidate.body
  .replace(/\`\`\`[\s\S]*?\`\`\`/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/[#>*_\`\[\]()!-]/g, ' ')
  .trim()
  .split(/\s+/)
  .filter(Boolean).length;
const h2Count = (candidate.body.match(/^##\s+/gm) || []).length;

if (candidate.title.length < 35 || candidate.title.length > 85) {
  throw new Error(`Title di luar gate 35–85 karakter: ${candidate.title.length}.`);
}
if (candidate.seoTitle.length < 35 || candidate.seoTitle.length > 65) {
  throw new Error(`seoTitle di luar gate 35–65 karakter: ${candidate.seoTitle.length}.`);
}
if (candidate.description.length < 110 || candidate.description.length > 170) {
  throw new Error(`Description di luar gate 110–170 karakter: ${candidate.description.length}.`);
}
if (words < 700) {
  throw new Error(`Draft hanya ${words} kata; minimum generator 700 kata.`);
}
if (h2Count < 4) {
  throw new Error(`Draft hanya memiliki ${h2Count} H2; minimum generator 4.`);
}
if (!Array.isArray(candidate.sources) || candidate.sources.length < 3) {
  throw new Error('Generator wajib menghasilkan minimal 3 sumber.');
}
for (const source of candidate.sources) {
  const url = new URL(source.url);
  if (url.protocol !== 'https:') throw new Error(`Sumber wajib HTTPS: ${source.url}`);
}

const today = new Date().toISOString().slice(0, 10);
const metadata = {
  title: candidate.title,
  seoTitle: candidate.seoTitle,
  description: candidate.description,
  slug: topic.suggestedSlug,
  category: topic.category,
  categorySlug: topic.categorySlug,
  tags: candidate.tags,
  publishedAt: today,
  author: 'Redaksi TeknoPraktis',
  sources: candidate.sources,
  aiAssisted: true,
  editorialNote: 'AI membantu riset dan drafting. Publikasi tetap mengikuti quality gate, sumber, dan kebijakan editorial TeknoPraktis.',
  featured: false,
  sponsored: false,
  draft: true
};

const articlePath = join(articlesDir, `${topic.suggestedSlug}.md`);
const article = `---\n${stringify(metadata).trim()}\n---\n\n${candidate.body.trim()}\n`;
writeFileSync(articlePath, article, 'utf8');

topic.status = 'draft';
topic.generatedAt = new Date().toISOString();
topic.generatedSlug = topic.suggestedSlug;
topic.model = model;
writeFileSync(queuePath, JSON.stringify(queue, null, 2) + '\n', 'utf8');

console.log(`Draft dibuat: src/content/articles/${topic.suggestedSlug}.md`);
console.log(`Model: ${model}; kata: ${words}; H2: ${h2Count}; sumber: ${candidate.sources.length}`);
