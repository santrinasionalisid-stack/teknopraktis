import { CATEGORIES } from './editorial';

export const SITE = {
  name: 'TeknoPraktis',
  url: 'https://teknopraktis.my.id',
  description: 'Panduan teknologi praktis, AI, aplikasi, keamanan digital, internet, dan perangkat untuk pengguna Indonesia.',
  locale: 'id_ID',
  language: 'id-ID',
  author: 'Redaksi TeknoPraktis',
};

export const NAV = [
  { label: 'Beranda', href: '/' },
  { label: 'Panduan', href: '/panduan/' },
  ...CATEGORIES.map((category) => ({
    label: category.navLabel,
    href: `/kategori/${category.slug}/`,
  })),
];
