import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (path) => readFileSync(join(root, path), 'utf8');
const layout = read('src/layouts/ArticleLayout.astro');
const card = read('src/components/ArticleCard.astro');
const css = read('src/styles/global.css');

const checks = [
  ['editorial disclosure hidden', !layout.includes('Proses editorial:')],
  ['featured figure hard 16:9', layout.includes('aspect-ratio: 16 / 9; overflow: hidden;')],
  ['featured image cannot crop', layout.includes('object-fit:contain')],
  ['article body has no forced justify inline', !/class="article-body container prose-width"[^>]*text-align:\s*justify/.test(layout)],
  ['deck has no forced justify inline', !/class="article-deck"[^>]*text-align:\s*justify/.test(layout)],
  ['runtime justify script removed', !layout.includes("setProperty('text-align', 'justify'")],
  ['card media 16:9', /\.article-card__media\s*\{[\s\S]*?aspect-ratio:\s*16\s*\/\s*9/.test(css)],
  ['body paragraph left-aligned CSS', /\.article-body p,[\s\S]*?text-align:\s*left/.test(css)],
  ['article body reading width capped', /\.article-body\s*\{[\s\S]*?width:\s*min\(740px/.test(css)],
  ['card uses final featuredImage', card.includes('src={article.data.featuredImage}')],
];

const failed = checks.filter(([, ok]) => !ok);
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} — ${name}`);
}
if (failed.length) {
  throw new Error(`UI regression gate failed: ${failed.map(([name]) => name).join(', ')}`);
}
console.log('UI REGRESSION GATE PASS');
