import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const outDir = join(root, 'public', 'images', 'articles');

export const THUMBNAIL_STYLE_VERSION = 'premium-v1';
export const DEFAULT_IMAGE_MODEL = 'gpt-image-2.5-sunburst';

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrapTitle(title, max = 20) {
  const words = String(title).trim().split(/\s+/);
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

  // Keep the title inside the locked three-line safe area.
  if (lines.length <= 3) return lines;
  return [lines[0], lines[1], lines.slice(2).join(' ')];
}

function contentTypeLabel(type) {
  return ({
    tutorial: 'TUTORIAL',
    checklist: 'CHECKLIST',
    explainer: 'PENJELASAN',
    'decision-guide': 'PANDUAN KEPUTUSAN',
  })[type] || 'PANDUAN';
}

function visualBrief(kind) {
  const briefs = {
    'browser-permissions': 'A premium browser site-permissions panel with camera, microphone, and location controls, security shield, permission toggles, and polished browser chrome.',
    'cloud-backup': 'A premium cloud-sync and backup scene with cloud storage, a separate external backup drive, directional sync arrows, file layers, and a clear separation between sync and backup.',
    'backup-321': 'A premium visual explanation of 3-2-1 backup using three file copies, two storage media types, one off-site cloud copy, and subtle recovery arrows.',
    'file-scan': 'A premium file-security scene with a downloaded file card, magnifying glass, antivirus scan status, verified source indicators, and a protective shield.',
    'ai-privacy': 'A premium AI meeting-notes interface with transcript cards, privacy shield, consent indicator, retention controls, and protected data symbols.',
    'wifi-diagnostics': 'A premium Wi-Fi diagnostic dashboard with router, signal strength, device connection path, DNS/network checks, and status indicators.',
    'password-manager': 'A premium password-vault interface with secure credential cards, strong master-lock symbol, passkey/key iconography, and protected login fields.',
    'auth-methods': 'A premium authentication comparison interface showing SMS, authenticator app, and passkey as three clear secure login methods with security-level indicators.',
    'android-storage': 'A premium Android storage dashboard with storage categories, cleanup recommendations, protected files, and a phone device mockup.',
    'phishing-email': 'A premium suspicious-email inspection interface with sender identity, link warning, domain verification, red-flag markers, and a protective shield.',
    'app-permissions': 'A premium mobile app-permission management interface with permission rows, toggles, app icon, privacy indicators, and audit status.',
    'ai-verification': 'A premium AI answer-verification interface showing claims, confidence indicators, source checks, assumptions, and verified/unverified states.',
    'browser-cache': 'A premium browser storage settings interface with cache, cookies, and site-data controls, reset arrows, and clearly separated data categories.',
    'windows-startup': 'A premium Windows startup-app management dashboard with app rows, enable/disable controls, startup impact indicators, and boot-performance gauge.',
    'file-compression': 'A premium document and image compression interface showing PDF/image cards, before-vs-after file sizes, compression slider, and readable-quality indicator.',
    'browser-profiles': 'A premium browser profile interface with clearly separated work and personal profiles, account cards, bookmarks, and profile switching.',
    'app-update': 'A premium official software-update interface with verified publisher badge, version details, secure download source, update action, and trust indicators.',
    generic: 'A premium topic-relevant technology interface with clean UI cards, subtle security/productivity cues, and a strong central hero object.',
  };
  return briefs[kind] || briefs.generic;
}

function renderOverlaySvg({ slug, title, category, contentType, tagline, visualDataUrl }) {
  const lines = wrapTitle(title);
  const fontSize = lines.length <= 2 ? 68 : 58;
  const lineHeight = fontSize * 1.10;
  const firstY = lines.length <= 2 ? 365 : 330;
  const titleLines = lines.map((line, index) =>
    `<text x="74" y="${firstY + index * lineHeight}" font-family="Inter, Arial, sans-serif" font-size="${fontSize}" font-weight="800" letter-spacing="-2.2" fill="#ffffff">${esc(line)}</text>`
  ).join('\n');

  const categoryWidth = Math.min(390, Math.max(240, 125 + category.length * 12));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="864" viewBox="0 0 1536 864" role="img" aria-label="${esc(title)}">
  <defs>
    <linearGradient id="leftFade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#07111f" stop-opacity=".98"/>
      <stop offset=".38" stop-color="#0b1424" stop-opacity=".92"/>
      <stop offset=".56" stop-color="#0d1726" stop-opacity=".38"/>
      <stop offset=".72" stop-color="#0d1726" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="pill" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#3b2418" stop-opacity=".96"/>
      <stop offset="1" stop-color="#6b371c" stop-opacity=".88"/>
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="18" flood-color="#000000" flood-opacity=".30"/>
    </filter>
  </defs>

  <image href="${visualDataUrl}" x="0" y="0" width="1536" height="864" preserveAspectRatio="xMidYMid slice"/>
  <rect x="0" y="0" width="1536" height="864" fill="url(#leftFade)"/>

  <g transform="translate(74 98)" filter="url(#softShadow)">
    <rect x="0" y="0" width="${categoryWidth}" height="68" rx="34" fill="url(#pill)" stroke="#9a4d1f" stroke-opacity=".75"/>
    <path d="M38 18l15 6v13c0 13-7 23-15 29-9-6-16-16-16-29V24l16-6z" fill="none" stroke="#ffb454" stroke-width="4"/>
    <path d="M30 38l7 7 12-15" fill="none" stroke="#ffb454" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="76" y="44" font-family="Inter, Arial, sans-serif" font-size="27" font-weight="750" fill="#ffd19c">${esc(category)}</text>
  </g>

  <text x="74" y="260" font-family="Inter, Arial, sans-serif" font-size="25" font-weight="700" letter-spacing="5" fill="#9fb4d4">TEKNOPRAKTIS · ${esc(contentTypeLabel(contentType))}</text>
  ${titleLines}

  <rect x="74" y="690" width="112" height="5" rx="3" fill="#f97316"/>
  <text x="74" y="756" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="500" fill="#b8c8df">${esc(tagline)}</text>
</svg>`;
}

export async function createEditorialImage({
  slug,
  title,
  category,
  contentType,
  visualKind,
  tagline,
  apiKey,
  imageModel = DEFAULT_IMAGE_MODEL,
}) {
  if (!apiKey) throw new Error('OPENAI_API_KEY wajib tersedia untuk premium thumbnail generation.');

  mkdirSync(outDir, { recursive: true });

  const prompt = `
Create a premium 16:9 editorial hero background for TeknoPraktis, an Indonesian professional technology publication.

LOCKED VISUAL STYLE:
- sophisticated dark navy / charcoal palette with controlled warm orange glow across the ENTIRE canvas; never use a white, light-gray, or washed-out background;
- high-end editorial technology aesthetic, modern and expensive, never cartoonish or template-like;
- polished 3D + realistic UI hybrid illustration;
- cinematic but restrained lighting, soft depth, subtle reflections, rounded premium interface cards;
- composition must reserve the LEFT 55% as a clean, dark, low-detail text-safe zone;
- place ONE coherent main topic-relevant hero object on the RIGHT 45%, large and visually strong; it should occupy roughly 75–90% of the right-side height without crossing into the left text-safe zone;
- illustration should feel integrated into the environment, not pasted on;
- balanced negative space, professional proportions, no clutter; the left text-safe zone must remain dark and quiet, while the right hero must be the dominant visual object;
- no stock-photo look, no people unless absolutely necessary;
- no logos, no watermarks, no branding marks;
- IMPORTANT: render NO WORDS, NO LETTERS, NO NUMBERS, NO READABLE UI TEXT anywhere. Use abstract bars/icons/status dots only. Exact typography will be overlaid later by the publishing system.

TOPIC:
${visualBrief(visualKind)}

The image must communicate this article visually:
"${title}"

Category context: ${category}.
Content format: ${contentType}.
Keep all important illustration details inside the right-side safe area. The left side must stay sufficiently dark and simple for large white editorial typography.
`.trim();

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: imageModel,
      prompt,
      n: 1,
      size: '1536x864',
      quality: 'high',
      output_format: 'webp',
      output_compression: 88,
      background: 'opaque',
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`OpenAI Images API gagal untuk ${imageModel}: HTTP ${response.status} — ${message}`);
  }

  const data = await response.json();
  const encoded = data.data?.[0]?.b64_json;
  if (!encoded) throw new Error(`Model gambar ${imageModel} tidak mengembalikan b64_json.`);

  const visualFilename = `${slug}-visual.webp`;
  const visualRelativePath = `/images/articles/${visualFilename}`;
  const visualBuffer = Buffer.from(encoded, 'base64');
  writeFileSync(join(outDir, visualFilename), visualBuffer);
  const visualDataUrl = `data:image/webp;base64,${encoded}`;

  const overlayFilename = `${slug}.svg`;
  const overlayRelativePath = `/images/articles/${overlayFilename}`;
  writeFileSync(
    join(outDir, overlayFilename),
    renderOverlaySvg({
      slug,
      title,
      category,
      contentType,
      tagline,
      visualDataUrl,
    }),
    'utf8'
  );

  return {
    path: overlayRelativePath,
    socialPath: visualRelativePath,
    alt: `Ilustrasi editorial premium tentang ${title} dengan visual yang relevan pada topik ${category}.`,
    styleVersion: THUMBNAIL_STYLE_VERSION,
    model: imageModel,
    usage: data.usage || null,
  };
}
