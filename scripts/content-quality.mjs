import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const root = fileURLToPath(new URL('../', import.meta.url));
const articlesDir = join(root, 'src', 'content', 'articles');
const publicDir = join(root, 'public');
const allowedCategories = new Set(['ai', 'aplikasi', 'keamanan-digital', 'internet', 'perangkat']);
const allowedContentTypes = new Set(['tutorial', 'checklist', 'explainer', 'decision-guide']);

const errors = [];
const warnings = [];
const slugs = new Map();
const titles = new Map();

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return ['.md', '.mdx'].includes(extname(entry.name)) ? [full] : [];
  });
}
function addError(file, message) { errors.push(`${file}: ${message}`); }
function addWarning(file, message) { warnings.push(`${file}: ${message}`); }
function wordCount(body) {
  return body.replace(/\`\`\`[\s\S]*?\`\`\`/g, ' ').replace(/<[^>]+>/g, ' ').replace(/[#>*_\`\[\]()!-]/g, ' ').trim().split(/\s+/).filter(Boolean).length;
}

for (const file of walk(articlesDir)) {
  const short = file.replace(articlesDir, '').replaceAll('\\', '/');
  const raw = readFileSync(file, 'utf8');
  const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n([\s\S]*)$/);
  if (!match) { addError(short, 'frontmatter YAML tidak ditemukan atau formatnya tidak valid.'); continue; }

  let data;
  try { data = parse(match[1]) ?? {}; }
  catch (error) { addError(short, `YAML tidak dapat dibaca: ${error.message}`); continue; }

  const body = match[2];
  const published = data.draft !== true;
  const title = String(data.title ?? '').trim();
  const description = String(data.description ?? '').trim();
  const slug = String(data.slug ?? '').trim();
  const categorySlug = String(data.categorySlug ?? '').trim();
  const contentType = String(data.contentType ?? '').trim();
  const featuredImage = String(data.featuredImage ?? '').trim();
  const featuredImageAlt = String(data.featuredImageAlt ?? '').trim();
  const socialImage = String(data.socialImage ?? '').trim();
  const imageStyle = String(data.imageStyle ?? '').trim();
  const tags = Array.isArray(data.tags) ? data.tags : [];

  if (title.length < 35 || title.length > 85) addError(short, `panjang title harus 35–85 karakter (sekarang ${title.length}).`);
  if (description.length < 100 || description.length > 180) addError(short, `description harus 100–180 karakter (sekarang ${description.length}).`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) addError(short, 'slug harus lowercase-kebab-case.');
  if (!allowedCategories.has(categorySlug)) addError(short, `categorySlug "${categorySlug}" belum terdaftar dalam taxonomy TeknoPraktis.`);
  if (!allowedContentTypes.has(contentType)) addError(short, `contentType "${contentType}" tidak valid.`);
  if (tags.length < 2 || tags.length > 8) addError(short, 'tags harus berisi 2–8 item.');

  if (!featuredImage.startsWith('/images/articles/')) {
    addError(short, 'featuredImage wajib berada di /images/articles/.');
  } else {
    const assetPath = join(publicDir, featuredImage.replace(/^\//, ''));
    if (!existsSync(assetPath)) addError(short, `featuredImage tidak ditemukan: ${featuredImage}`);
  }
  if (featuredImageAlt.length < 20 || featuredImageAlt.length > 180) {
    addError(short, `featuredImageAlt harus 20–180 karakter (sekarang ${featuredImageAlt.length}).`);
  }
  if (imageStyle === 'premium-v1') {
    if (!featuredImage.endsWith('.webp')) {
      addError(short, 'premium-v1 wajib memakai featuredImage WebP final 16:9.');
    }
    if (!socialImage.startsWith('/images/articles/') || !socialImage.endsWith('.webp')) {
      addError(short, 'premium-v1 wajib memiliki socialImage WebP di /images/articles/.');
    } else {
      const socialAssetPath = join(publicDir, socialImage.replace(/^\//, ''));
      if (!existsSync(socialAssetPath)) addError(short, `socialImage tidak ditemukan: ${socialImage}`);
    }
  }

  if (slugs.has(slug)) addError(short, `slug duplikat dengan ${slugs.get(slug)}.`);
  else slugs.set(slug, short);

  const titleKey = title.toLocaleLowerCase('id-ID');
  if (titles.has(titleKey)) addError(short, `title duplikat dengan ${titles.get(titleKey)}.`);
  else titles.set(titleKey, short);

  if (data.updatedAt && data.publishedAt) {
    const publishedAt = new Date(data.publishedAt);
    const updatedAt = new Date(data.updatedAt);
    if (updatedAt < publishedAt) addError(short, 'updatedAt tidak boleh lebih awal dari publishedAt.');
  }

  if (Array.isArray(data.sources)) {
    for (const [index, source] of data.sources.entries()) {
      if (!source?.title || !source?.url) { addError(short, `sources[${index}] wajib memiliki title dan url.`); continue; }
      try {
        const url = new URL(source.url);
        if (url.protocol !== 'https:') addError(short, `sources[${index}].url wajib HTTPS.`);
      } catch { addError(short, `sources[${index}].url bukan URL valid.`); }
    }
  }

  if (published) {
    const words = wordCount(body);
    const h2Count = (body.match(/^##\s+/gm) ?? []).length;
    if (words < 120) addError(short, `artikel terbit terlalu tipis: ${words} kata; minimum struktural 120 kata.`);
    if (h2Count < 2) addError(short, 'artikel terbit harus memiliki minimal 2 heading H2.');
    if (words < 500) addWarning(short, `hanya ${words} kata; untuk artikel substantif targetkan ±500–1.500 kata sesuai kebutuhan topik.`);
    if (/\b(TODO|TBD|lorem ipsum|placeholder)\b/i.test(body)) addError(short, 'masih mengandung placeholder editorial.');
  }
}

if (warnings.length) {
  console.warn('\nCONTENT QUALITY WARNINGS');
  for (const warning of warnings) console.warn(`- ${warning}`);
}
if (errors.length) {
  console.error('\nCONTENT QUALITY FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`\nCONTENT QUALITY PASS — ${slugs.size} artikel tervalidasi, ${warnings.length} peringatan non-blocking.\n`);
