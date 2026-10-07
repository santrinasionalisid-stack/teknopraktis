# TeknoPraktis — Automated Publishing V1

Status: **FOUNDATION PASS / SAFE MODE**

## Prinsip

Otomasi tidak boleh mengubah TeknoPraktis menjadi pabrik halaman pencarian. Google secara eksplisit memperingatkan bahwa penggunaan generative AI untuk membuat banyak halaman tanpa nilai tambah dapat termasuk scaled content abuse. Pipeline V1 karena itu memakai **scheduled draft + explicit publish approval** sebagai default.

## Jadwal

Workflow `.github/workflows/scheduled-article-draft.yml` berjalan:

- Senin 09:15 WIB
- Rabu 09:15 WIB
- Jumat 09:15 WIB

Cron GitHub Actions disimpan dalam UTC: `15 2 * * 1,3,5`.

## Alur

1. Pilih topic `pending` pertama dari `automation/topics.json`.
2. Panggil OpenAI Responses API.
3. Model melakukan web search dan wajib menghasilkan minimal 3 sumber HTTPS.
4. Generator memeriksa panjang metadata, minimal 700 kata, minimal 4 H2, dan sumber.
5. Artikel ditulis dengan `draft: true`.
6. `npm run quality` dan production build harus PASS.
7. Draft dikomit otomatis ke `main`.
8. Draft tidak muncul di website.
9. Setelah review, jalankan workflow **Publish Approved Article** dengan slug terkait.
10. Workflow mengubah `draft: false`, mencatat review, menjalankan quality gate lagi, lalu push ke main.
11. Cloudflare Pages deploy dan sitemap/internal linking otomatis mengikuti konten terbit.

## Secrets / variables

Wajib:
- GitHub Actions secret: `OPENAI_API_KEY`

Opsional:
- GitHub Actions variable: `OPENAI_MODEL`
- Default kode: `gpt-6-sol`

Jangan pernah menaruh API key di repository, workflow YAML, artikel, issue, log, atau chat publik.

## Policy

- Tidak ada auto-publish pada V1.
- Tidak ada YMYL, politik, kesehatan, investasi, atau topik legal otomatis pada queue default.
- Tidak boleh mengarang pengalaman penggunaan atau pengujian.
- Sumber diprioritaskan dari dokumentasi resmi/primer.
- AI assistance diungkapkan pada halaman artikel.
- Jika source atau quality gate gagal, workflow harus gagal dan tidak boleh publish.

## Aktivasi

Automation akan tetap dorman tanpa `OPENAI_API_KEY`. Setelah secret tersedia, jalankan workflow manual satu kali sebelum mengandalkan schedule.
