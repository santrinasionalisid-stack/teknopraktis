# TeknoPraktis — EDITORIAL UI V2

Status: PASS / PRODUCTION VERIFIED

## Tujuan
Menyatukan kualitas editorial, navigasi, visual artikel, dan otomasi sehingga artikel tutorial tidak tampil seperti posting blog generik.

## Keputusan V2
- Category = topik: AI, Aplikasi, Keamanan Digital, Internet, Perangkat.
- Content type = format: tutorial, checklist, explainer, decision-guide.
- "Tutorial" tidak lagi menjadi category.
- Menu "Panduan" menjadi hub untuk tutorial, checklist, dan panduan keputusan.
- Setiap artikel wajib memiliki featured image dan alt text.
- Card artikel memakai featured image 16:9, bukan placeholder TP generik.
- Halaman artikel memakai featured image besar, content-type badge, metadata panduan, dan daftar isi berbasis H2.
- BlogPosting schema dan social metadata memakai featured image artikel.

## Otomasi gambar
Generator membuat SVG editorial 1200×675 secara deterministik dari judul, kategori, dan content type.
Tidak ada API image tambahan sehingga biaya generation tidak bertambah.
Asset ditulis ke `public/images/articles/<slug>.svg`.

## Copywriting gate Sol
Sol wajib menilai:
- pembukaan langsung ke masalah/manfaat;
- Bahasa Indonesia natural, bukan terjemahan kaku;
- jargon hanya bila perlu dan dijelaskan;
- heading mudah dipindai;
- urutan tutorial/checklist jelas;
- kalimat tidak bertele-tele;
- tidak clickbait dan tidak overclaim.

Sol tetap repair-first: bila masalah masih dapat diperbaiki, pilih revise dan berikan patch kecil, bukan reject.

## Verification
- Commit: `f3cd159a0e41c4be66e13c70287582d279f2e1c2`
- GitHub Quality Gate: PASS
- Production build: PASS (19 pages)
- Live Panduan hub: PASS
- Live article featured image / content type / table of contents metadata: PASS
- Internet category route without published article: PASS
