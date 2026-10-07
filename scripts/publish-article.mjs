import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, stringify } from 'yaml';

const root = fileURLToPath(new URL('../', import.meta.url));
const slug = (process.env.ARTICLE_SLUG || '').trim();

if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  throw new Error('ARTICLE_SLUG wajib diisi dalam format lowercase-kebab-case.');
}

const articlePath = join(root, 'src', 'content', 'articles', `${slug}.md`);
if (!existsSync(articlePath)) throw new Error(`Artikel tidak ditemukan: ${slug}.md`);

const raw = readFileSync(articlePath, 'utf8');
const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n([\s\S]*)$/);
if (!match) throw new Error('Frontmatter artikel tidak valid.');

const metadata = parse(match[1]) || {};
if (metadata.draft !== true) throw new Error('Artikel bukan draft; publikasi dibatalkan untuk mencegah publish ganda.');

const today = new Date().toISOString().slice(0, 10);
metadata.draft = false;
metadata.reviewedAt = today;
metadata.reviewedBy = 'Redaksi TeknoPraktis';

writeFileSync(articlePath, `---\n${stringify(metadata).trim()}\n---\n\n${match[2].trim()}\n`, 'utf8');

const queuePath = join(root, 'automation', 'topics.json');
if (existsSync(queuePath)) {
  const queue = JSON.parse(readFileSync(queuePath, 'utf8'));
  const topic = queue.topics.find((item) => item.generatedSlug === slug || item.suggestedSlug === slug);
  if (topic) {
    topic.status = 'published';
    topic.publishedAt = new Date().toISOString();
    writeFileSync(queuePath, JSON.stringify(queue, null, 2) + '\n', 'utf8');
  }
}

console.log(`Artikel siap terbit: ${slug}`);
