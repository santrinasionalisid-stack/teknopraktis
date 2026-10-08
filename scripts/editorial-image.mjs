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

function iconCamera(x, y) {
  return `<g transform="translate(${x} ${y})">
    <rect x="0" y="10" width="74" height="52" rx="12" fill="#fff"/>
    <rect x="18" y="0" width="28" height="16" rx="6" fill="#fff"/>
    <circle cx="37" cy="36" r="15" fill="#f97316"/>
  </g>`;
}

function iconMic(x, y) {
  return `<g transform="translate(${x} ${y})" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round">
    <rect x="22" y="0" width="32" height="62" rx="16" fill="#f97316" stroke="none"/>
    <path d="M12 38c0 24 52 24 52 0"/>
    <path d="M38 62v20"/>
    <path d="M22 82h32"/>
  </g>`;
}

function iconPin(x, y) {
  return `<g transform="translate(${x} ${y})">
    <path d="M38 0c-21 0-38 17-38 38 0 27 38 72 38 72s38-45 38-72C76 17 59 0 38 0z" fill="#fff"/>
    <circle cx="38" cy="38" r="13" fill="#f97316"/>
  </g>`;
}

function iconCloud(x, y) {
  return `<g transform="translate(${x} ${y})">
    <path d="M28 78h142c25 0 44-18 44-41 0-22-18-40-40-41-10-28-36-47-67-47-37 0-68 28-72 64-20 2-35 18-35 38 0 15 9 27 28 27z" fill="#fff"/>
  </g>`;
}

function iconShield(x, y) {
  return `<g transform="translate(${x} ${y})">
    <path d="M70 0l58 22v48c0 45-24 80-58 100C36 150 12 115 12 70V22L70 0z" fill="#fff"/>
    <path d="M42 80l18 18 38-44" fill="none" stroke="#f97316" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`;
}

function iconFile(x, y) {
  return `<g transform="translate(${x} ${y})">
    <path d="M0 0h88l34 34v126H0z" fill="#fff"/>
    <path d="M88 0v34h34" fill="#e5e7eb"/>
    <rect x="22" y="62" width="78" height="12" rx="6" fill="#cbd5e1"/>
    <rect x="22" y="90" width="64" height="12" rx="6" fill="#cbd5e1"/>
  </g>`;
}

function semanticMotif(visualKind, contentType) {
  switch (visualKind) {
    case 'browser-permissions':
      return `<g transform="translate(785 165)">
        <rect x="0" y="0" width="330" height="350" rx="30" fill="#111827" stroke="#475569" stroke-width="3"/>
        <rect x="24" y="24" width="282" height="46" rx="14" fill="#1f2937"/>
        <circle cx="48" cy="47" r="7" fill="#f97316"/><circle cx="70" cy="47" r="7" fill="#64748b"/><circle cx="92" cy="47" r="7" fill="#64748b"/>
        <rect x="116" y="37" width="164" height="20" rx="10" fill="#334155"/>
        ${iconCamera(42,108)}
        ${iconMic(132,104)}
        ${iconPin(226,104)}
        <rect x="40" y="250" width="250" height="58" rx="18" fill="#fff" opacity=".96"/>
        <circle cx="78" cy="279" r="16" fill="#f97316"/>
        <path d="M70 279l7 7 13-16" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="106" y="268" width="140" height="12" rx="6" fill="#cbd5e1"/>
        <rect x="106" y="288" width="94" height="10" rx="5" fill="#e2e8f0"/>
      </g>`;
    case 'cloud-backup':
    case 'backup-321':
      return `<g transform="translate(790 190)">
        ${iconCloud(20,40)}
        <path d="M135 150v80" stroke="#fdba74" stroke-width="12" stroke-linecap="round"/>
        <path d="M112 210l23 23 23-23" fill="none" stroke="#fdba74" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="65" y="245" width="150" height="72" rx="20" fill="#fff"/>
        <rect x="95" y="270" width="90" height="16" rx="8" fill="#f97316"/>
      </g>`;
    case 'file-scan':
      return `<g transform="translate(820 190)">
        ${iconFile(25,35)}
        <circle cx="205" cy="210" r="72" fill="#fff"/>
        <circle cx="205" cy="210" r="46" fill="#111827"/>
        <path d="M242 247l58 58" stroke="#f97316" stroke-width="18" stroke-linecap="round"/>
        <path d="M185 210l16 16 30-38" fill="none" stroke="#f97316" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
      </g>`;
    case 'ai-privacy':
      return `<g transform="translate(805 190)">
        <rect x="10" y="20" width="250" height="190" rx="28" fill="#fff"/>
        <circle cx="82" cy="96" r="34" fill="#111827"/>
        <circle cx="70" cy="90" r="5" fill="#f97316"/><circle cx="94" cy="90" r="5" fill="#f97316"/>
        <path d="M68 110h28" stroke="#f97316" stroke-width="7" stroke-linecap="round"/>
        <path d="M138 80h82M138 112h66M48 160h170" stroke="#cbd5e1" stroke-width="14" stroke-linecap="round"/>
        ${iconShield(150,155)}
      </g>`;
    case 'wifi-diagnostics':
      return `<g transform="translate(815 210)" fill="none" stroke="#fff" stroke-width="18" stroke-linecap="round">
        <path d="M20 80c75-70 175-70 250 0"/>
        <path d="M62 126c52-48 114-48 166 0"/>
        <path d="M107 172c24-23 52-23 76 0"/>
        <circle cx="145" cy="216" r="16" fill="#f97316" stroke="none"/>
        <path d="M260 205h70" stroke="#f97316"/><path d="M295 170v70" stroke="#f97316"/>
      </g>`;
    case 'password-manager':
    case 'auth-methods':
      return `<g transform="translate(820 185)">
        <rect x="30" y="70" width="240" height="210" rx="28" fill="#fff"/>
        <path d="M88 70V42c0-42 124-42 124 0v28" fill="none" stroke="#fff" stroke-width="18"/>
        <circle cx="150" cy="155" r="34" fill="#f97316"/>
        <rect x="141" y="182" width="18" height="54" rx="9" fill="#f97316"/>
      </g>`;
    case 'android-storage':
    case 'file-compression':
      return `<g transform="translate(825 178)">
        <rect x="55" y="0" width="185" height="340" rx="32" fill="#fff"/>
        <rect x="76" y="42" width="143" height="210" rx="18" fill="#111827"/>
        <rect x="96" y="74" width="104" height="18" rx="9" fill="#f97316"/>
        <rect x="96" y="112" width="78" height="12" rx="6" fill="#475569"/>
        <rect x="96" y="140" width="92" height="12" rx="6" fill="#475569"/>
        <circle cx="148" cy="296" r="15" fill="#cbd5e1"/>
      </g>`;
    case 'phishing-email':
      return `<g transform="translate(790 205)">
        <rect x="15" y="25" width="290" height="190" rx="26" fill="#fff"/>
        <path d="M32 60l128 90L288 60" fill="none" stroke="#f97316" stroke-width="14" stroke-linejoin="round"/>
        <path d="M160 110v80" stroke="#111827" stroke-width="16" stroke-linecap="round"/>
        <circle cx="160" cy="214" r="10" fill="#111827"/>
      </g>`;
    case 'app-permissions':
    case 'app-update':
      return `<g transform="translate(805 188)">
        <rect x="0" y="0" width="300" height="300" rx="34" fill="#fff"/>
        <rect x="38" y="42" width="72" height="72" rx="20" fill="#f97316"/>
        <circle cx="74" cy="78" r="16" fill="#fff"/>
        <rect x="138" y="52" width="120" height="16" rx="8" fill="#cbd5e1"/>
        <rect x="138" y="82" width="90" height="12" rx="6" fill="#e2e8f0"/>
        <rect x="38" y="152" width="220" height="78" rx="20" fill="#111827"/>
        <circle cx="82" cy="191" r="17" fill="#f97316"/>
        <path d="M74 191l7 7 14-17" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="112" y="181" width="108" height="13" rx="6" fill="#64748b"/>
      </g>`;
    case 'ai-verification':
      return `<g transform="translate(805 190)">
        <rect x="20" y="30" width="260" height="230" rx="30" fill="#fff"/>
        <circle cx="95" cy="112" r="48" fill="#111827"/>
        <path d="M74 110h42M95 89v42" stroke="#f97316" stroke-width="10" stroke-linecap="round"/>
        <circle cx="205" cy="112" r="48" fill="#f97316"/>
        <path d="M184 112l15 15 28-36" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="65" y="190" width="170" height="14" rx="7" fill="#cbd5e1"/>
      </g>`;
    case 'browser-cache':
      return `<g transform="translate(800 185)">
        <rect x="0" y="0" width="300" height="280" rx="30" fill="#fff"/>
        <rect x="24" y="24" width="252" height="42" rx="13" fill="#111827"/>
        <circle cx="50" cy="45" r="7" fill="#f97316"/>
        <path d="M102 150a58 58 0 1 1 15 40" fill="none" stroke="#f97316" stroke-width="16" stroke-linecap="round"/>
        <path d="M105 195l14-35 31 20" fill="none" stroke="#f97316" stroke-width="12" stroke-linejoin="round"/>
      </g>`;
    case 'windows-startup':
      return `<g transform="translate(810 190)">
        <rect x="18" y="10" width="270" height="220" rx="28" fill="#fff"/>
        <rect x="48" y="45" width="90" height="65" rx="12" fill="#f97316"/>
        <rect x="150" y="45" width="108" height="16" rx="8" fill="#cbd5e1"/>
        <rect x="150" y="75" width="84" height="12" rx="6" fill="#e2e8f0"/>
        <path d="M90 155h126" stroke="#111827" stroke-width="18" stroke-linecap="round"/>
        <path d="M185 125l34 30-34 30" fill="none" stroke="#f97316" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
      </g>`;
    case 'browser-profiles':
      return `<g transform="translate(810 190)">
        <rect x="0" y="0" width="300" height="275" rx="30" fill="#fff"/>
        <circle cx="95" cy="95" r="48" fill="#111827"/>
        <circle cx="95" cy="82" r="18" fill="#f97316"/>
        <path d="M56 132c16-30 62-30 78 0" fill="#f97316"/>
        <circle cx="215" cy="95" r="48" fill="#f97316"/>
        <circle cx="215" cy="82" r="18" fill="#fff"/>
        <path d="M176 132c16-30 62-30 78 0" fill="#fff"/>
        <path d="M150 58v95" stroke="#cbd5e1" stroke-width="8" stroke-dasharray="10 10"/>
      </g>`;
    default:
      return motif(contentType);
  }
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

export function renderEditorialSvg({ title, category, contentType, visualKind }) {
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
  ${semanticMotif(visualKind, contentType)}
  </svg>`;
}

export function createEditorialImage({ slug, title, category, contentType, visualKind }) {
  mkdirSync(outDir, { recursive: true });
  const relativePath = `/images/articles/${slug}.svg`;
  writeFileSync(join(outDir, `${slug}.svg`), renderEditorialSvg({ title, category, contentType, visualKind }), 'utf8');
  const typeAlt = contentType === 'checklist' ? 'checklist' : contentType === 'decision-guide' ? 'alur pilihan' : contentType === 'explainer' ? 'diagram penjelasan' : 'langkah tutorial';
  return {
    path: relativePath,
    alt: `Ilustrasi editorial relevan tentang ${title}, kategori ${category}, dalam format ${typeAlt}.`,
  };
}
