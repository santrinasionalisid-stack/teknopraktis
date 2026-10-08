import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const outDir = join(root, 'public', 'images', 'articles');

function esc(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function wrapTitle(title, max = 31) {
  const words = title.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function motif(contentType) {
  if (contentType === 'checklist') {
    return `<g transform="translate(820 195)">
      <rect x="0" y="0" width="250" height="300" rx="32" fill="#fff" opacity=".96"/>
      <rect x="38" y="52" width="34" height="34" rx="8" fill="#f97316"/><path d="M47 69l8 8 15-18" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="92" y="57" width="112" height="12" rx="6" fill="#cbd5e1"/>
      <rect x="38" y="124" width="34" height="34" rx="8" fill="#f97316"/><path d="M47 141l8 8 15-18" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="92" y="129" width="128" height="12" rx="6" fill="#cbd5e1"/>
      <rect x="38" y="196" width="34" height="34" rx="8" fill="#fff" stroke="#cbd5e1" stroke-width="5"/>
      <rect x="92" y="201" width="94" height="12" rx="6" fill="#cbd5e1"/>
    </g>`;
  }
  if (contentType === 'decision-guide') {
    return `<g transform="translate(830 210)" fill="none" stroke-linecap="round">
      <circle cx="45" cy="120" r="34" fill="#fff"/>
      <circle cx="190" cy="40" r="34" fill="#f97316"/>
      <circle cx="190" cy="200" r="34" fill="#fff"/>
      <path d="M80 120h48c32 0 28-80 62-80" stroke="#fdba74" stroke-width="14"/>
      <path d="M80 120h48c32 0 28 80 62 80" stroke="#fff" stroke-opacity=".75" stroke-width="14"/>
    </g>`;
  }
  if (contentType === 'explainer') {
    return `<g transform="translate(830 205)">
      <circle cx="120" cy="120" r="112" fill="#fff" opacity=".95"/>
      <circle cx="120" cy="120" r="54" fill="#f97316"/>
      <circle cx="120" cy="72" r="9" fill="#fff"/>
      <rect x="111" y="96" width="18" height="76" rx="9" fill="#fff"/>
    </g>`;
  }
  return `<g transform="translate(825 190)">
    <rect x="0" y="0" width="270" height="310" rx="34" fill="#fff" opacity=".96"/>
    <circle cx="62" cy="70" r="27" fill="#f97316"/><text x="62" y="80" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="800" fill="#fff">1</text>
    <circle cx="62" cy="155" r="27" fill="#f97316"/><text x="62" y="165" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="800" fill="#fff">2</text>
    <circle cx="62" cy="240" r="27" fill="#f97316"/><text x="62" y="250" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="800" fill="#fff">3</text>
    <rect x="108" y="61" width="112" height="15" rx="7" fill="#cbd5e1"/>
    <rect x="108" y="146" width="126" height="15" rx="7" fill="#cbd5e1"/>
    <rect x="108" y="231" width="96" height="15" rx="7" fill="#cbd5e1"/>
  </g>`;
}

export function renderEditorialSvg({ title, category, contentType }) {
  const lines = wrapTitle(title);
  const titleLines = lines.map((line, index) =>
    `<text x="86" y="${250 + index * 66}" font-family="Arial,sans-serif" font-size="54" font-weight="800" letter-spacing="-1.5" fill="#fff">${esc(line)}</text>`
  ).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-label="${esc(title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b1220"/>
      <stop offset=".58" stop-color="#172033"/>
      <stop offset="1" stop-color="#263244"/>
    </linearGradient>
    <radialGradient id="glow" cx=".75" cy=".18" r=".75">
      <stop offset="0" stop-color="#f97316" stop-opacity=".38"/>
      <stop offset="1" stop-color="#f97316" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="675" rx="0" fill="url(#bg)"/>
  <rect width="1200" height="675" fill="url(#glow)"/>
  <circle cx="1105" cy="50" r="220" fill="#f97316" opacity=".08"/>
  <circle cx="760" cy="690" r="260" fill="#fff" opacity=".035"/>
  <rect x="86" y="86" width="260" height="48" rx="24" fill="#f97316" opacity=".16" stroke="#fb923c" stroke-opacity=".55"/>
  <text x="110" y="118" font-family="Arial,sans-serif" font-size="21" font-weight="700" fill="#fed7aa">${esc(category)}</text>
  <text x="86" y="194" font-family="Arial,sans-serif" font-size="20" font-weight="700" letter-spacing="2" fill="#94a3b8">TEKNOPRAKTIS · ${esc(contentType.toUpperCase())}</text>
  ${titleLines}
  <text x="86" y="596" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="#fdba74">Panduan praktis untuk pengguna Indonesia</text>
  ${motif(contentType)}
  </svg>`;
}

export function createEditorialImage({ slug, title, category, contentType }) {
  mkdirSync(outDir, { recursive: true });
  const relativePath = `/images/articles/${slug}.svg`;
  writeFileSync(join(outDir, `${slug}.svg`), renderEditorialSvg({ title, category, contentType }), 'utf8');
  const typeAlt = contentType === 'checklist' ? 'checklist' : contentType === 'decision-guide' ? 'alur pilihan' : contentType === 'explainer' ? 'diagram penjelasan' : 'langkah tutorial';
  return {
    path: relativePath,
    alt: `Ilustrasi editorial ${category} dengan ${typeAlt} untuk artikel “${title}”.`,
  };
}
