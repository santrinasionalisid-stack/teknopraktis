import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, stringify } from 'yaml';
import { createEditorialImage } from './editorial-image.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const queuePath = join(root, 'automation', 'topics.json');
const articlesDir = join(root, 'src', 'content', 'articles');

const apiKey = process.env.OPENAI_API_KEY;
const draftModel = process.env.OPENAI_DRAFT_MODEL || process.env.OPENAI_MODEL || 'gpt-6-luna';
const editorModel = process.env.OPENAI_EDITOR_MODEL || 'gpt-6-sol';
const imageModel = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2.5-sunburst';
const requestedTopicId = (process.env.TOPIC_ID || '').trim();
const autoPublishUntil = Number.parseInt(process.env.AUTO_PUBLISH_UNTIL || '0', 10);

if (!apiKey) throw new Error('OPENAI_API_KEY belum tersedia.');
if (!Number.isInteger(autoPublishUntil) || autoPublishUntil < 0) {
  throw new Error('AUTO_PUBLISH_UNTIL harus berupa bilangan bulat >= 0.');
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
      return {
        title: data.title,
        slug: data.slug,
        categorySlug: data.categorySlug,
        draft: data.draft === true
      };
    } catch {
      return null;
    }
  })
  .filter(Boolean);

const publishedCountBefore = existing.filter((item) => item.draft !== true).length;
const autoPublish =
  autoPublishUntil > 0 &&
  publishedCountBefore < autoPublishUntil;

const articleSchema = {
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

const reviewSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    decision: { type: 'string', enum: ['pass', 'revise', 'reject'] },
    score: { type: 'integer', minimum: 0, maximum: 100 },
    projectedScore: { type: 'integer', minimum: 0, maximum: 100 },
    repairability: { type: 'string', enum: ['none', 'local', 'substantive', 'fundamental'] },
    summary: { type: 'string' },
    issues: {
      type: 'array',
      maxItems: 12,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          severity: { type: 'string', enum: ['critical', 'major', 'minor'] },
          area: { type: 'string' },
          finding: { type: 'string' },
          recommendation: { type: 'string' }
        },
        required: ['severity', 'area', 'finding', 'recommendation']
      }
    },
    metadataPatches: {
      type: 'array',
      maxItems: 6,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          field: { type: 'string', enum: ['title', 'seoTitle', 'description'] },
          value: { type: 'string' }
        },
        required: ['field', 'value']
      }
    },
    bodyPatches: {
      type: 'array',
      maxItems: 12,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          find: { type: 'string' },
          replace: { type: 'string' }
        },
        required: ['find', 'replace']
      }
    },
    sourceAdditions: {
      type: 'array',
      maxItems: 5,
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
    sourceRemovals: {
      type: 'array',
      maxItems: 5,
      items: { type: 'string' }
    }
  },
  required: [
    'decision', 'score', 'projectedScore', 'repairability', 'summary', 'issues',
    'metadataPatches', 'bodyPatches', 'sourceAdditions', 'sourceRemovals'
  ]
};

const finalCopySchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: { type: 'string' },
    seoTitle: { type: 'string' },
    description: { type: 'string' },
    body: { type: 'string' },
    hookScore: { type: 'integer', minimum: 0, maximum: 100 },
    flowScore: { type: 'integer', minimum: 0, maximum: 100 },
    concisionScore: { type: 'integer', minimum: 0, maximum: 100 },
    imageTagline: { type: 'string' },
    summary: { type: 'string' }
  },
  required: ['title', 'seoTitle', 'description', 'body', 'hookScore', 'flowScore', 'concisionScore', 'imageTagline', 'summary']
};

const draftInstructions = `
Anda adalah penulis riset TeknoPraktis. Tugas Anda menghasilkan draft people-first yang kuat dan hemat, bukan halaman SEO massal.

Aturan:
- Gunakan web search untuk riset faktual sebelum menulis.
- Prioritaskan dokumentasi resmi, pusat bantuan resmi, standar, atau sumber primer.
- Jangan mengarang pengujian, pengalaman langsung, harga, statistik, kutipan, fitur, atau sumber.
- Jika informasi bergantung versi/produk/waktu, jelaskan batasnya.
- Jangan menulis seolah Redaksi sudah menguji perangkat/layanan jika tidak ada bukti.
- Artikel 800–1.400 kata tanpa filler.
- Bahasa Indonesia natural, jelas, ringkas, profesional, dan terasa ditulis untuk pembaca Indonesia.
- Hindari terjemahan kaku dan jargon yang tidak perlu. Bila istilah teknis diperlukan, jelaskan dengan kata sehari-hari.
- Pembukaan harus cepat menjelaskan masalah, akibat, dan manfaat artikel; hindari intro generik.
- Heading harus natural dan membantu pembaca memindai isi, bukan terdengar seperti dokumen teknis internal.
- Untuk tutorial/checklist, gunakan urutan tindakan yang jelas dan keputusan praktis.
- Tanpa H1 di body. Minimal 4 heading H2.
- Sertakan langkah/checklist, kesalahan umum, batasan/risiko, dan kesimpulan praktis bila relevan.
- Hindari clickbait, keyword stuffing, pembukaan generik, dan pengulangan.
- Title 35–85 karakter.
- seoTitle 35–65 karakter.
- Description 110–170 karakter.
- Sumber minimum 3 URL HTTPS yang benar-benar dipakai.
- Setiap URL sumber eksternal yang ditautkan di body wajib juga tercantum di array sources.
- Jangan sertakan parameter tracking seperti utm_source, utm_medium, utm_campaign, gclid, fbclid, atau sejenisnya.
- Output hanya JSON sesuai schema.
`;

const draftPrompt = `
Topik:
${JSON.stringify(topic, null, 2)}

Artikel yang sudah ada, hindari duplikasi sudut bahasan:
${JSON.stringify(existing, null, 2)}

Slug terkunci: ${topic.suggestedSlug}
Kategori terkunci: ${topic.category} / ${topic.categorySlug}
Jenis konten terkunci: ${topic.contentType}

Tulis sintesis yang membantu pembaca mengambil tindakan atau keputusan, bukan sekadar merangkum sumber.
`;

async function createResponse({ model, instructions, input, schema, schemaName, tools = [], maxToolCalls, maxOutputTokens }) {
  const payload = {
    model,
    instructions,
    input,
    max_output_tokens: maxOutputTokens,
    text: {
      format: {
        type: 'json_schema',
        name: schemaName,
        strict: true,
        schema
      }
    }
  };
  if (tools.length) payload.tools = tools;
  if (Number.isInteger(maxToolCalls)) payload.max_tool_calls = maxToolCalls;

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`OpenAI Responses API gagal untuk ${model}: HTTP ${response.status} — ${message}`);
  }

  const data = await response.json();
  const outputText = (data.output || [])
    .flatMap((item) => item.content || [])
    .filter((part) => part.type === 'output_text')
    .map((part) => part.text)
    .join('')
    .trim();

  if (!outputText) throw new Error(`Model ${model} tidak mengembalikan output_text.`);

  return { data, parsed: JSON.parse(outputText) };
}

function usageSummary(data) {
  const usage = data.usage || {};
  const webSearchCalls = (data.output || []).filter((item) => item.type === 'web_search_call').length;
  return {
    inputTokens: usage.input_tokens ?? null,
    outputTokens: usage.output_tokens ?? null,
    totalTokens: usage.total_tokens ?? null,
    webSearchCalls
  };
}

const trackingParams = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'gclid', 'fbclid', 'mc_cid', 'mc_eid'
];

function canonicalSourceUrl(value) {
  const url = new URL(value);
  for (const key of trackingParams) url.searchParams.delete(key);

  // Locale/display parameters do not identify a different source document.
  // Remove them so a citation such as ?hl=en_1 matches the same declared source page.
  for (const key of ['hl', 'language', 'locale']) url.searchParams.delete(key);

  url.hash = '';
  return url.toString();
}

function sourceIdentity(value) {
  const url = new URL(value);
  const pathname = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, '') : '/';
  return `${url.origin.toLowerCase()}${pathname}`;
}

function normalizeCandidate(candidate) {
  candidate.sources = candidate.sources.map((source) => ({
    ...source,
    url: canonicalSourceUrl(source.url)
  }));

  const declaredByIdentity = new Map(
    candidate.sources.map((source) => [sourceIdentity(source.url), source.url])
  );

  candidate.body = candidate.body.replace(
    /https:\/\/[^\s)\]>"]+/g,
    (value) => {
      try {
        const cleaned = canonicalSourceUrl(value);
        return declaredByIdentity.get(sourceIdentity(cleaned)) || cleaned;
      } catch {
        return value;
      }
    }
  );

  return candidate;
}

function bodyExternalUrls(body) {
  return [...new Set(
    [...body.matchAll(/https:\/\/[^\s)\]>"]+/g)]
      .map((match) => {
        try {
          return canonicalSourceUrl(match[0]);
        } catch {
          return match[0];
        }
      })
  )].sort();
}

function assertSameExternalUrls(beforeBody, afterBody, phase) {
  const before = bodyExternalUrls(beforeBody);
  const after = bodyExternalUrls(afterBody);
  if (JSON.stringify(before) !== JSON.stringify(after)) {
    throw new Error(
      `${phase}: final copy edit mengubah daftar URL eksternal. Sebelum=${JSON.stringify(before)} Sesudah=${JSON.stringify(after)}`
    );
  }
}

function articleStats(candidate) {
  const words = candidate.body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`\[\]()!-]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const h2Count = (candidate.body.match(/^##\s+/gm) || []).length;
  return { words, h2Count };
}

function validateCandidate(candidate, phase) {
  const { words, h2Count } = articleStats(candidate);

  if (candidate.title.length < 35 || candidate.title.length > 85) {
    throw new Error(`${phase}: title di luar gate 35–85 karakter: ${candidate.title.length}.`);
  }
  if (candidate.seoTitle.length < 35 || candidate.seoTitle.length > 65) {
    throw new Error(`${phase}: seoTitle di luar gate 35–65 karakter: ${candidate.seoTitle.length}.`);
  }
  if (candidate.description.length < 110 || candidate.description.length > 170) {
    throw new Error(`${phase}: description di luar gate 110–170 karakter: ${candidate.description.length}.`);
  }
  if (words < 700) {
    throw new Error(`${phase}: artikel hanya ${words} kata; minimum generator 700 kata.`);
  }
  if (h2Count < 4) {
    throw new Error(`${phase}: artikel hanya memiliki ${h2Count} H2; minimum 4.`);
  }
  if (!Array.isArray(candidate.sources) || candidate.sources.length < 3) {
    throw new Error(`${phase}: minimal 3 sumber wajib tersedia.`);
  }

  const declaredSources = new Set(candidate.sources.map((source) => canonicalSourceUrl(source.url)));
  const bodySourceUrls = [...candidate.body.matchAll(/\[[^\]]+\]\((https:\/\/[^)]+)\)/g)]
    .map((match) => canonicalSourceUrl(match[1]));

  for (const url of bodySourceUrls) {
    if (!declaredSources.has(url)) {
      throw new Error(`${phase}: URL sumber di body belum tercantum di sources: ${url}`);
    }
  }

  for (const source of candidate.sources) {
    const url = new URL(source.url);
    if (url.protocol !== 'https:') throw new Error(`${phase}: sumber wajib HTTPS: ${source.url}`);
  }

  return { words, h2Count };
}

function applyEditorPatches(candidate, review) {
  for (const patch of review.metadataPatches) {
    candidate[patch.field] = patch.value;
  }

  for (const patch of review.bodyPatches) {
    const occurrences = candidate.body.split(patch.find).length - 1;
    if (occurrences !== 1) {
      throw new Error(`Patch editor tidak aman: teks target harus muncul tepat 1 kali, ditemukan ${occurrences}.`);
    }
    candidate.body = candidate.body.replace(patch.find, patch.replace);
  }

  if (review.sourceRemovals.length) {
    const removals = new Set(review.sourceRemovals.map(canonicalSourceUrl));
    candidate.sources = candidate.sources.filter((source) => !removals.has(canonicalSourceUrl(source.url)));
  }

  for (const source of review.sourceAdditions) {
    const normalized = { ...source, url: canonicalSourceUrl(source.url) };
    if (!candidate.sources.some((item) => canonicalSourceUrl(item.url) === normalized.url)) {
      candidate.sources.push(normalized);
    }
  }

  return normalizeCandidate(candidate);
}

const draftResult = await createResponse({
  model: draftModel,
  instructions: draftInstructions,
  input: draftPrompt,
  schema: articleSchema,
  schemaName: 'teknopraktis_luna_draft',
  tools: [{ type: 'web_search' }],
  maxToolCalls: 3,
  maxOutputTokens: 6500
});

let candidate = normalizeCandidate(draftResult.parsed);
const draftStats = validateCandidate(candidate, 'Draft Luna');

const editorInstructions = `
Anda adalah editor senior TeknoPraktis dan penjaga mutu profesional. Anda BUKAN hakim yang mencari alasan untuk menolak. Tugas utama Anda adalah MENYELAMATKAN draft yang secara fundamental layak dengan koreksi paling kecil, tepat, dan efisien.

Filosofi keputusan:
- PASS: draft sudah layak tanpa koreksi material.
- REVISE: pilihan DEFAULT bila ada masalah yang masih dapat diperbaiki secara aman melalui patch lokal, penajaman kalimat, koreksi struktur kecil, atau penambahan/penggantian sumber yang dapat diverifikasi.
- REJECT: hanya untuk masalah FUNDAMENTAL yang tidak dapat diperbaiki secara bertanggung jawab dengan patch terbatas, misalnya intent artikel salah total, tesis inti tidak didukung fakta, fabrikasi inti, atau perlu penulisan ulang besar.
- Jangan pernah memilih REJECT hanya karena score di bawah 85 apabila masalahnya masih bisa diperbaiki.
- Jangan pernah memilih REJECT hanya karena ada beberapa koreksi minor/major yang jelas solusinya.

Standar editor:
- Nilai apakah artikel benar-benar membantu intent pembaca dan tidak generik.
- Cek logika, ketepatan istilah, konsistensi, kehati-hatian klaim, struktur, keterbacaan, dan kualitas sumber.
- Gunakan web search hanya bila benar-benar perlu memverifikasi klaim meragukan/berubah cepat atau mencari sumber primer pengganti.
- Jangan mengarang pengalaman langsung, hasil tes, kredensial, angka, atau sumber.
- Jangan memperpanjang artikel tanpa alasan.
- Pertahankan suara TeknoPraktis: praktis, tenang, presisi, tanpa clickbait.
- Lakukan copy-editing: hilangkan frasa kaku/terjemahan literal, jargon yang tidak perlu, heading yang terlalu akademis, pengulangan, dan kalimat yang terlalu panjang.
- Pastikan judul/heading menjanjikan isi secara akurat dan terasa natural bagi pembaca Indonesia.
- Untuk tutorial/checklist, pastikan urutan langkah, label tindakan, risiko, dan hasil yang diharapkan mudah dipindai.
- Untuk REVISE, berikan patch exact-match sekecil mungkin dan selesaikan sebanyak mungkin masalah dalam satu putaran.
- Jika sumber perlu diperbaiki dan Anda dapat memverifikasinya, gunakan sourceAdditions/sourceRemovals daripada menolak draft.
- score = kualitas draft SAAT INI sebelum patch.
- projectedScore = estimasi kualitas SETELAH semua patch yang Anda berikan diterapkan.
- repairability = none/local/substantive/fundamental.
- Jika keputusan REVISE, targetkan projectedScore minimal 85. Jika belum 85 tetapi masih repairable, tetap beri patch terbaik dan tandai substantive; sistem akan memberi satu putaran recovery editor tambahan.
- Jangan menambahkan link/sumber baru kecuali diperlukan.
- Output hanya JSON sesuai schema.
`;

const editorPrompt = `
TOPIK:
${JSON.stringify(topic, null, 2)}

DRAFT UNTUK DIREVIEW:
${JSON.stringify(candidate, null, 2)}

Review sebagai editor profesional penjaga kualitas. Jangan menulis ulang seluruh artikel jika tidak perlu.
`;

const editorResult = await createResponse({
  model: editorModel,
  instructions: editorInstructions,
  input: editorPrompt,
  schema: reviewSchema,
  schemaName: 'teknopraktis_sol_editor_review',
  tools: [{ type: 'web_search' }],
  maxToolCalls: 2,
  maxOutputTokens: 3500
});

const review = editorResult.parsed;
let finalEditorResult = null;
let finalReview = review;
let effectiveInitialDecision = review.decision;

function hasEditorPatches(value) {
  return (
    value.metadataPatches.length > 0 ||
    value.bodyPatches.length > 0 ||
    value.sourceAdditions.length > 0 ||
    value.sourceRemovals.length > 0
  );
}

function hasSeriousIssue(value) {
  return value.issues.some((issue) => issue.severity === 'major' || issue.severity === 'critical');
}

function normalizeEditorDecision(value, phase) {
  const hasPatches = hasEditorPatches(value);
  const hasCritical = value.issues.some((issue) => issue.severity === 'critical');

  // Defensive fallback: a fixable draft should be revised, not rejected.
  if (value.decision === 'reject' && value.repairability !== 'fundamental' && hasPatches) {
    console.warn(`${phase}: keputusan reject dikonversi menjadi revise karena editor menyediakan perbaikan dan masalah bukan fundamental.`);
    return 'revise';
  }

  if (value.decision === 'reject') {
    if (value.repairability !== 'fundamental' || !hasCritical) {
      throw new Error(
        `${phase}: editor memilih REJECT tanpa dasar fundamental+critical. Draft tidak dihapus, tetapi workflow dihentikan untuk mencegah penolakan berlebihan.`
      );
    }
    return 'reject';
  }

  if (value.decision === 'pass' && value.score < 85) {
    if (hasPatches) {
      console.warn(`${phase}: PASS score <85 dikonversi menjadi REVISE karena patch tersedia.`);
      return 'revise';
    }
    throw new Error(`${phase}: PASS dengan score ${value.score} tetapi tanpa patch perbaikan.`);
  }

  if (value.decision === 'revise' && !hasPatches) {
    throw new Error(`${phase}: editor meminta REVISE tetapi tidak memberikan patch.`);
  }

  return value.decision;
}

effectiveInitialDecision = normalizeEditorDecision(review, 'Review awal Sol');

if (effectiveInitialDecision === 'reject') {
  throw new Error(`Editor Sol menolak draft secara fundamental (score ${review.score}): ${review.summary}`);
}

if (effectiveInitialDecision === 'revise') {
  candidate = applyEditorPatches(candidate, review);
  validateCandidate(candidate, 'Setelah patch editor Sol');
}

const needsRecoveryPass =
  effectiveInitialDecision === 'revise' &&
  (
    review.projectedScore < 85 ||
    hasSeriousIssue(review) ||
    review.sourceAdditions.length > 0 ||
    review.sourceRemovals.length > 0
  );

if (needsRecoveryPass) {
  const recoveryInstructions = `
Anda adalah editor senior TeknoPraktis pada putaran RECOVERY FINAL. Draft sudah menerima koreksi dari review pertama.

Tujuan Anda tetap solutif:
- PASS jika draft sekarang sudah layak dengan score minimal 85.
- REVISE jika masih ada masalah yang bisa diselesaikan dengan patch kecil/terbatas.
- REJECT hanya bila setelah satu putaran perbaikan masih ada masalah FUNDAMENTAL dan CRITICAL yang tidak dapat diperbaiki tanpa penulisan ulang besar.
- Jangan menolak karena perfeksionisme, preferensi gaya, atau detail minor yang tidak memengaruhi akurasi/manfaat.
- Tidak ada web search pada putaran ini. Jangan menambahkan fakta atau sumber baru.
- sourceAdditions dan sourceRemovals harus kosong.
- score = kualitas saat ini; projectedScore = kualitas setelah patch recovery.
- Jika REVISE, selesaikan semua isu tersisa yang material dalam patch exact-match sekecil mungkin.
- Output hanya JSON sesuai schema.
`;

  const recoveryPrompt = `
TOPIK:
${JSON.stringify(topic, null, 2)}

HASIL REVIEW AWAL:
${JSON.stringify({
    decision: review.decision,
    effectiveDecision: effectiveInitialDecision,
    score: review.score,
    projectedScore: review.projectedScore,
    repairability: review.repairability,
    summary: review.summary,
    issues: review.issues
  }, null, 2)}

DRAFT SETELAH PATCH PERTAMA:
${JSON.stringify(candidate, null, 2)}

Lakukan recovery review yang ringkas, profesional, dan berorientasi solusi.
`;

  finalEditorResult = await createResponse({
    model: editorModel,
    instructions: recoveryInstructions,
    input: recoveryPrompt,
    schema: reviewSchema,
    schemaName: 'teknopraktis_sol_recovery_review',
    maxOutputTokens: 2200
  });

  finalReview = finalEditorResult.parsed;

  if (finalReview.sourceAdditions.length > 0 || finalReview.sourceRemovals.length > 0) {
    throw new Error('Recovery Sol mencoba mengubah sumber tanpa web search; perubahan sumber ditolak.');
  }

  const recoveryDecision = normalizeEditorDecision(finalReview, 'Recovery Sol');

  if (recoveryDecision === 'reject') {
    throw new Error(`Recovery Sol menemukan masalah fundamental (score ${finalReview.score}): ${finalReview.summary}`);
  }

  if (recoveryDecision === 'revise') {
    candidate = applyEditorPatches(candidate, finalReview);
    validateCandidate(candidate, 'Setelah patch recovery Sol');

    if (finalReview.projectedScore < 85) {
      throw new Error(
        `Recovery Sol sudah memberi solusi tetapi projectedScore masih ${finalReview.projectedScore}. Draft dipertahankan sebagai pending topic dan tidak dikomit.`
      );
    }
  } else if (finalReview.score < 85) {
    throw new Error(`Recovery Sol PASS tetapi score akhir masih ${finalReview.score}.`);
  }
} else if (effectiveInitialDecision === 'revise' && review.projectedScore < 85) {
  throw new Error(`Review Sol memproyeksikan score ${review.projectedScore}; recovery seharusnya dijalankan.`);
}

const preCopyCandidate = structuredClone(candidate);
const preCopyStats = articleStats(preCopyCandidate);

const finalCopyInstructions = `
Anda adalah PENULIS PROFESIONAL sekaligus FINAL COPY EDITOR TeknoPraktis. Ini adalah tahap editorial terakhir setelah fakta, sumber, dan risiko sudah diperiksa. Tugas Anda bukan menambah riset, tetapi membuat tulisan terasa matang, mengalir, ringkas, dan enak dibaca.

PRIORITAS MUTLAK:
1. HOOK PARAGRAF PERTAMA
   - Paragraf pertama harus langsung menarik pembaca dengan masalah nyata, konsekuensi, kontras, atau manfaat konkret yang relevan dengan intent artikel.
   - Hook harus informatif, bukan clickbait.
   - Hindari pembukaan generik seperti "Di era digital...", "Teknologi berkembang pesat...", atau pertanyaan retoris kosong.
   - Dalam 1–2 kalimat pertama pembaca harus memahami mengapa artikel ini layak diteruskan.

2. ALIRAN ANTAR PARAGRAF
   - Setiap paragraf harus meneruskan gagasan sebelumnya secara logis.
   - Jaga kesinambungan sebab-akibat, masalah-solusi, atau langkah-ke-langkah.
   - Hindari paragraf yang terasa berdiri sendiri, lompatan topik, dan transisi mendadak.
   - Gunakan transisi natural seperlunya; jangan memenuhi artikel dengan kata penghubung mekanis.

3. RINGKAS TANPA KEHILANGAN MAKNA
   - Pangkas pengulangan, filler, kalimat melingkar, tautologi, dan penjelasan yang sudah jelas dari konteks.
   - Utamakan kalimat aktif dan konkret.
   - Satu paragraf idealnya membawa satu ide utama.
   - Variasikan panjang kalimat agar ritmenya natural, tetapi hindari kalimat yang terlalu panjang.
   - Hasil akhir sebaiknya sama panjang atau lebih pendek dari draft, kecuali sedikit tambahan benar-benar diperlukan untuk memperbaiki hook/transisi.

4. SUARA TEKNOPRAKTIS
   - Bahasa Indonesia natural, modern, profesional, mudah dipahami pembaca umum.
   - Jangan terdengar seperti terjemahan literal, laporan akademik, atau teks AI generik.
   - Istilah teknis hanya dipakai bila perlu; jelaskan dengan bahasa sehari-hari.
   - Heading harus membantu navigasi pembaca dan terasa natural.
   - Tetap tenang, presisi, praktis, dan tidak hiperbolis.

BATAS KETAT:
- JANGAN menambah fakta, angka, klaim, contoh, produk, pengalaman, atau sumber baru.
- JANGAN mengubah makna faktual yang sudah ada.
- JANGAN menghapus, menambah, atau mengubah URL eksternal/citation yang ada di body.
- Pertahankan struktur Markdown yang valid.
- Boleh merapikan judul H2 bila maknanya tetap sama dan alur menjadi lebih baik.
- Title, seoTitle, dan description boleh diperhalus bila lebih natural tetapi harus tetap akurat terhadap isi.
- Jangan mengubah artikel menjadi gaya promosi atau clickbait.
- Output hanya JSON sesuai schema.

Penilaian:
- hookScore: kekuatan pembukaan sebagai hook informatif.
- flowScore: kesinambungan antar kalimat, paragraf, dan bagian.
- concisionScore: ketepatan, keringkasan, dan bebas pengulangan.
Targetkan ketiganya minimal 90.
- imageTagline = satu kalimat sangat pendek 28–64 karakter untuk teks pendamping thumbnail. Harus natural, relevan, informatif, tanpa clickbait, dan tidak mengulang judul.
`;

const finalCopyPrompt = `
TOPIK:
${JSON.stringify(topic, null, 2)}

DRAFT YANG SUDAH LOLOS FACT/SOURCE EDIT:
${JSON.stringify({
  title: candidate.title,
  seoTitle: candidate.seoTitle,
  description: candidate.description,
  body: candidate.body
}, null, 2)}

Lakukan final professional copy edit secara menyeluruh. Anda boleh menulis ulang kalimat/paragraf untuk memperbaiki hook, ritme, kesinambungan, dan keringkasan, tetapi tidak boleh mengubah substansi faktual atau daftar URL eksternal.
`;

const finalCopyResult = await createResponse({
  model: editorModel,
  instructions: finalCopyInstructions,
  input: finalCopyPrompt,
  schema: finalCopySchema,
  schemaName: 'teknopraktis_sol_final_copy_edit',
  maxOutputTokens: 5200
});

const copyEdit = finalCopyResult.parsed;

candidate = normalizeCandidate({
  ...candidate,
  title: copyEdit.title,
  seoTitle: copyEdit.seoTitle,
  description: copyEdit.description,
  body: copyEdit.body
});

assertSameExternalUrls(preCopyCandidate.body, candidate.body, 'Final copy edit Sol');
const postCopyStats = validateCandidate(candidate, 'Final copy edit Sol');

if (postCopyStats.words > Math.ceil(preCopyStats.words * 1.08)) {
  throw new Error(
    `Final copy edit Sol terlalu memanjang: ${preCopyStats.words} → ${postCopyStats.words} kata (maks +8%).`
  );
}

if (copyEdit.hookScore < 90 || copyEdit.flowScore < 90 || copyEdit.concisionScore < 90) {
  throw new Error(
    `Final copy edit Sol belum memenuhi standar: hook=${copyEdit.hookScore}, flow=${copyEdit.flowScore}, concision=${copyEdit.concisionScore} (minimum 90).`
  );
}

const finalStats = validateCandidate(candidate, 'Final setelah copy editor Sol');
const contentType = topic.contentType || 'explainer';
if (copyEdit.imageTagline.length < 28 || copyEdit.imageTagline.length > 64) {
  throw new Error(`imageTagline harus 28–64 karakter, sekarang ${copyEdit.imageTagline.length}.`);
}

const media = await createEditorialImage({
  slug: topic.suggestedSlug,
  title: candidate.title,
  category: topic.category,
  contentType,
  visualKind: topic.visualKind || 'generic',
  tagline: copyEdit.imageTagline,
  apiKey,
  imageModel,
});

const today = new Date().toISOString().slice(0, 10);
const metadata = {
  title: candidate.title,
  seoTitle: candidate.seoTitle,
  description: candidate.description,
  slug: topic.suggestedSlug,
  category: topic.category,
  categorySlug: topic.categorySlug,
  contentType,
  featuredImage: media.path,
  featuredImageAlt: media.alt,
  socialImage: media.socialPath,
  imageStyle: media.styleVersion,
  tags: candidate.tags,
  publishedAt: today,
  author: 'Redaksi TeknoPraktis',
  sources: candidate.sources,
  aiAssisted: true,
  editorialNote: autoPublish
    ? 'AI membantu riset dan drafting. GPT-6 Sol melakukan fact/source review dan final copy edit profesional. Artikel dipublikasikan otomatis selama fase bootstrap editorial sampai target 20 artikel.'
    : 'AI membantu riset dan drafting. GPT-6 Sol melakukan fact/source review dan final copy edit profesional sebelum artikel masuk antrean review publikasi.',
  featured: false,
  sponsored: false,
  draft: !autoPublish
};

const articlePath = join(articlesDir, `${topic.suggestedSlug}.md`);
const article = `---\n${stringify(metadata).trim()}\n---\n\n${candidate.body.trim()}\n`;
writeFileSync(articlePath, article, 'utf8');

topic.status = autoPublish ? 'published' : 'draft';
topic.generatedAt = new Date().toISOString();
topic.generatedSlug = topic.suggestedSlug;
topic.models = { draft: draftModel, editor: editorModel };
topic.publishPolicy = autoPublish ? `auto-until-${autoPublishUntil}` : 'manual-approval';
topic.autoPublished = autoPublish;
if (autoPublish) {
  topic.publishedAt = today;
} else {
  delete topic.publishedAt;
}
const finalEffectiveScore =
  finalReview.decision === 'revise' ? finalReview.projectedScore : finalReview.score;

topic.editorial = {
  initial: {
    decision: review.decision,
    effectiveDecision: effectiveInitialDecision,
    score: review.score,
    projectedScore: review.projectedScore,
    repairability: review.repairability,
    summary: review.summary,
    issueCount: review.issues.length
  },
  final: {
    decision: finalReview.decision,
    score: finalEffectiveScore,
    repairability: finalReview.repairability,
    summary: finalReview.summary,
    issueCount: finalReview.issues.length,
    recoveryUsed: Boolean(finalEditorResult)
  }
};
topic.copyEdit = {
  model: editorModel,
  imageTagline: copyEdit.imageTagline,
  hookScore: copyEdit.hookScore,
  flowScore: copyEdit.flowScore,
  concisionScore: copyEdit.concisionScore,
  summary: copyEdit.summary,
  wordsBefore: preCopyStats.words,
  wordsAfter: postCopyStats.words
};
topic.image = {
  styleVersion: media.styleVersion,
  model: media.model,
  visualKind: topic.visualKind || 'generic',
  featuredImage: media.path,
  socialImage: media.socialPath,
  usage: media.usage
};
topic.usage = {
  draft: usageSummary(draftResult.data),
  editorInitial: usageSummary(editorResult.data),
  editorFinal: finalEditorResult ? usageSummary(finalEditorResult.data) : null,
  copyDesk: usageSummary(finalCopyResult.data),
  imageGeneration: media.usage
};
writeFileSync(queuePath, JSON.stringify(queue, null, 2) + '\n', 'utf8');

console.log(
  autoPublish
    ? `Artikel otomatis diterbitkan: src/content/articles/${topic.suggestedSlug}.md (artikel terbit sebelum run: ${publishedCountBefore}; target: ${autoPublishUntil})`
    : `Draft dibuat: src/content/articles/${topic.suggestedSlug}.md (auto-publish nonaktif/target sudah tercapai)`
);
console.log(`Draft model: ${draftModel}; kata: ${draftStats.words}; H2: ${draftStats.h2Count}`);
console.log(`Editor model: ${editorModel}; initial decision: ${review.decision}; effective: ${effectiveInitialDecision}; score: ${review.score}; projected: ${review.projectedScore}; issues: ${review.issues.length}`);
if (finalEditorResult) {
  console.log(`Recovery Sol: decision ${finalReview.decision}; score ${finalReview.score}; projected ${finalReview.projectedScore}; issues ${finalReview.issues.length}`);
}
console.log(`Final copy Sol: hook ${copyEdit.hookScore}; flow ${copyEdit.flowScore}; concision ${copyEdit.concisionScore}; kata ${preCopyStats.words}→${postCopyStats.words}`);
console.log(`Final: kata ${finalStats.words}; H2 ${finalStats.h2Count}; sumber ${candidate.sources.length}`);
console.log(`Usage draft: ${JSON.stringify(topic.usage.draft)}`);
console.log(`Usage editor initial: ${JSON.stringify(topic.usage.editorInitial)}`);
console.log(`Usage editor final: ${JSON.stringify(topic.usage.editorFinal)}`);
console.log(`Image: style ${media.styleVersion}; model ${media.model}; visual ${topic.visualKind || 'generic'}`);
console.log(`Usage copy desk: ${JSON.stringify(topic.usage.copyDesk)}`);
console.log(`Usage image: ${JSON.stringify(topic.usage.imageGeneration)}`);
