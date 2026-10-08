import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, stringify } from 'yaml';
import { createEditorialImage } from './editorial-image.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const topicsPath = join(root, 'automation', 'topics.json');
const refreshPath = join(root, 'automation', 'image-refresh.json');
const articlesDir = join(root, 'src', 'content', 'articles');

const apiKey = process.env.OPENAI_API_KEY;
const imageModel = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2.5-sunburst';
if (!apiKey) throw new Error('OPENAI_API_KEY belum tersedia.');

const queue = JSON.parse(readFileSync(topicsPath, 'utf8'));
const refresh = JSON.parse(readFileSync(refreshPath, 'utf8'));
const topicId = (process.env.REFRESH_TOPIC_ID || refresh.topicId || '').trim();
if (!topicId) throw new Error('Topic ID untuk refresh gambar belum ditentukan.');

const topic = queue.topics.find((item) => item.id === topicId);
if (!topic) throw new Error(`Topic ${topicId} tidak ditemukan.`);

const slug = topic.generatedSlug || topic.suggestedSlug;
const articlePath = join(articlesDir, `${slug}.md`);
const raw = readFileSync(articlePath, 'utf8');
const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n([\s\S]*)$/);
if (!match) throw new Error(`Frontmatter artikel ${slug} tidak valid.`);

const data = parse(match[1]) || {};
const body = match[2].trim();
const tagline =
  topic.imageTagline ||
  topic.copyEdit?.imageTagline ||
  refresh.tagline ||
  'Panduan praktis untuk keputusan teknologi yang lebih aman';

const media = await createEditorialImage({
  slug,
  title: data.title,
  category: data.category,
  contentType: data.contentType,
  visualKind: topic.visualKind || 'generic',
  tagline,
  apiKey,
  imageModel,
});

data.featuredImage = media.path;
data.featuredImageAlt = media.alt;
data.socialImage = media.socialPath;
data.imageStyle = media.styleVersion;

topic.imageTagline = tagline;
topic.image = {
  styleVersion: media.styleVersion,
  model: media.model,
  visualKind: topic.visualKind || 'generic',
  featuredImage: media.path,
  socialImage: media.socialPath,
  usage: media.usage,
  refreshedAt: new Date().toISOString(),
};

writeFileSync(articlePath, `---\n${stringify(data).trim()}\n---\n\n${body}\n`, 'utf8');
writeFileSync(topicsPath, JSON.stringify(queue, null, 2) + '\n', 'utf8');

console.log(`Premium image refreshed: ${slug}`);
console.log(`Style: ${media.styleVersion}; model: ${media.model}; visual: ${topic.visualKind || 'generic'}`);
console.log(`Usage: ${JSON.stringify(media.usage)}`);
