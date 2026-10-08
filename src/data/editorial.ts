export const CONTENT_TYPES = {
  tutorial: {
    label: 'Tutorial',
    description: 'Langkah terurut untuk menyelesaikan tugas teknologi dengan aman.',
  },
  checklist: {
    label: 'Checklist',
    description: 'Daftar pemeriksaan ringkas agar langkah penting tidak terlewat.',
  },
  explainer: {
    label: 'Penjelasan',
    description: 'Memahami konsep, fungsi, dan batas teknologi dengan bahasa yang jelas.',
  },
  'decision-guide': {
    label: 'Panduan keputusan',
    description: 'Membandingkan pilihan dan trade-off sebelum menentukan tindakan.',
  },
} as const;

export type ContentType = keyof typeof CONTENT_TYPES;

export const GUIDE_CONTENT_TYPES: ContentType[] = ['tutorial', 'checklist', 'decision-guide'];

export const CATEGORIES = [
  {
    slug: 'ai',
    name: 'AI & Otomasi',
    navLabel: 'AI',
    description: 'Panduan memakai AI dan otomasi secara praktis, terukur, dan tetap kritis.',
  },
  {
    slug: 'aplikasi',
    name: 'Aplikasi & Produktivitas',
    navLabel: 'Aplikasi',
    description: 'Memilih dan memakai aplikasi dengan workflow yang lebih sederhana dan efektif.',
  },
  {
    slug: 'keamanan-digital',
    name: 'Keamanan Digital',
    navLabel: 'Keamanan',
    description: 'Langkah praktis menjaga akun, file, perangkat, dan kebiasaan digital.',
  },
  {
    slug: 'internet',
    name: 'Internet',
    navLabel: 'Internet',
    description: 'Panduan koneksi, cloud, browser, dan layanan internet untuk penggunaan sehari-hari.',
  },
  {
    slug: 'perangkat',
    name: 'Perangkat',
    navLabel: 'Perangkat',
    description: 'Panduan merawat, mengatur, dan memecahkan masalah perangkat secara aman.',
  },
] as const;

export function contentTypeLabel(type: string) {
  return CONTENT_TYPES[type as ContentType]?.label ?? 'Panduan';
}

export function categoryBySlug(slug: string) {
  return CATEGORIES.find((category) => category.slug === slug);
}
