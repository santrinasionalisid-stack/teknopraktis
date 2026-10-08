import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, stringify } from 'yaml';
import { createEditorialImage } from './editorial-image.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const configPath = join(root, 'automation', 'thumbnail-remediation.json');
const articlesDir = join(root, 'src', 'content', 'articles');
const apiKey = process.env.OPENAI_API_KEY;
const imageModel = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2.5-sunburst';

if (!apiKey) throw new Error('OPENAI_API_KEY belum tersedia.');

const config = JSON.parse(readFileSync(configPath, 'utf8'));
if (config.generationPausedRequired !== true) {
  throw new Error('Remediation hanya boleh berjalan saat content generation dipause.');
}

for (const item of config.articles) {
  const articlePath = join(articlesDir, `${item.slug}.md`);
  const raw = readFileSync(articlePath, 'utf8');
  const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`Frontmatter tidak valid: ${item.slug}`);

  const data = parse(match[1]) || {};
  const body = match[2].trim();

  console.log(`Regenerating relevant thumbnail: ${item.slug} -> ${item.visualKind}`);
  const media = await createEditorialImage({
    slug: item.slug,
    title: data.title,
    category: data.category,
    contentType: data.contentType,
    visualKind: item.visualKind,
    tagline: item.tagline,
    apiKey,
    imageModel,
  });

  data.featuredImage = media.path;
  data.featuredImageAlt = media.alt;
  data.socialImage = media.socialPath;
  data.imageStyle = media.styleVersion;
  data.imageTagline = item.tagline;

  writeFileSync(
    articlePath,
    `---\n${stringify(data).trim()}\n---\n\n${body}\n`,
    'utf8'
  );
}

config.status = 'DONE';
config.completedAt = new Date().toISOString();
writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
console.log(`Thumbnail remediation complete: ${config.articles.length} articles.`);
