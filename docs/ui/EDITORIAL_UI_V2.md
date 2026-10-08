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

## Otomasi gambar — THUMBNAIL STYLE V1 LOCKED
Generator memakai GPT Image untuk membuat background premium 1536×864 yang relevan dengan topik, lalu sistem menambahkan typography overlay secara deterministik.
- Style: dark navy/charcoal + warm orange glow.
- Komposisi: text-safe zone kiri + hero illustration besar di kanan.
- Visual: premium 3D + realistic UI hybrid.
- Title, category badge, content label, dan tagline ditulis oleh sistem agar ejaan konsisten.
- Wrapper SVG: `public/images/articles/<slug>.svg`.
- Raster source/social image: `public/images/articles/<slug>-visual.webp`.
- Quality gate memblokir artikel premium-v1 bila raster source tidak tersedia.
- Default image model: `gpt-image-2.5-sunburst`, quality high.

## Copywriting gate Sol
Sol wajib melakukan final professional copy edit dengan standar:
- paragraf pertama memiliki **hook informatif**: masalah, konsekuensi, kontras, atau manfaat konkret langsung terasa;
- 1–2 kalimat pertama menjawab alasan pembaca perlu melanjutkan;
- Bahasa Indonesia natural, bukan terjemahan kaku;
- jargon hanya bila perlu dan dijelaskan;
- kesinambungan antar paragraf terjaga; tidak ada lompatan topik;
- hubungan masalah→solusi, sebab→akibat, atau langkah→langkah terasa jelas;
- heading mudah dipindai;
- kalimat aktif, konkret, tidak melingkar, tidak bertele-tele;
- pengulangan dan filler dipangkas;
- ritme kalimat bervariasi tetapi tetap ringkas;
- tidak clickbait dan tidak overclaim;
- hookScore, flowScore, dan concisionScore minimum 90.

Sol tetap repair-first: bila masalah masih dapat diperbaiki, pilih revise dan berikan patch kecil, bukan reject.

## Verification
- Commit: `f3cd159a0e41c4be66e13c70287582d279f2e1c2`
- GitHub Quality Gate: PASS
- Production build: PASS (19 pages)
- Live Panduan hub: PASS
- Live article featured image / content type / table of contents metadata: PASS
- Internet category route without published article: PASS

## Final Copy Desk V2.1
- Model: GPT-6 Sol
- Posisi: tahap terakhir setelah fact/source review dan recovery
- Web search: OFF
- Boleh menulis ulang kalimat/paragraf untuk memperbaiki alur
- Dilarang menambah fakta, klaim, contoh, angka, atau sumber baru
- Daftar URL eksternal sebelum/sesudah harus identik
- Panjang artikel maksimum bertambah 8%
- Target utama: hook, flow, concision, continuity
