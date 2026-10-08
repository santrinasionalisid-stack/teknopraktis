# TeknoPraktis — Automated Publishing V2

Status: **HYBRID LUNA → SOL / SAFE MODE**

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
2. **GPT-6 Luna** melakukan web research dan menyusun draft awal dengan maksimal 3 web-search call.
3. Generator menjalankan hard gate metadata, struktur, sumber, dan source hygiene.
4. **GPT-6 Sol** bertindak sebagai editor senior: memeriksa logika, kegunaan, akurasi istilah, kekuatan sumber, klaim berisiko, struktur, dan gaya.
5. Sol dapat memakai maksimal 2 web-search call hanya ketika verifikasi tambahan memang diperlukan.
6. Sol harus memberi keputusan `pass`, `revise`, atau `reject`, score saat ini, projected score setelah koreksi, dan tingkat repairability.
7. Sol memakai prinsip **repair-first**: masalah yang masih dapat diperbaiki wajib masuk `revise`, bukan langsung `reject`.
8. `reject` hanya sah untuk masalah **fundamental + critical** yang tidak dapat diperbaiki secara bertanggung jawab dengan patch terbatas.
9. Bila `revise`, Sol memberi patch exact-match sekecil mungkin; script menerapkannya lalu menjalankan hard gate ulang.
10. Jika revisi bersifat substantif, menyentuh sumber, atau projected score masih di bawah 85, sistem memberi Sol satu putaran **recovery review** tanpa web search untuk memperbaiki sisa masalah secara efisien.
11. Draft hanya berhenti setelah dua putaran jika masalah material tetap tidak dapat diselesaikan; draft yang gagal tidak dikomit dan topic tetap pending.
12. Artikel lolos ditulis sebagai `draft: true`.
10. `npm run quality` dan production build harus PASS.
11. Draft dikomit otomatis ke `main` dan tidak muncul di website.
12. Setelah approval, workflow **Publish Approved Article** mengubah `draft: false`, mencatat review, menjalankan quality gate lagi, lalu push ke main.
13. Cloudflare Pages deploy dan sitemap/internal linking otomatis mengikuti konten terbit.

## Secrets / variables

Wajib:
- GitHub Actions secret: `OPENAI_API_KEY`

Opsional:
- GitHub Actions variable: `OPENAI_DRAFT_MODEL` — default `gpt-6-luna`
- GitHub Actions variable: `OPENAI_EDITOR_MODEL` — default `gpt-6-sol`

Arsitektur biaya/kualitas:
- Luna = riset + produksi draft.
- Sol = editor profesional penjaga kualitas.
- Script = auditor mekanis tanpa biaya model.
- Token usage dan jumlah web-search call untuk kedua tahap dicatat di `automation/topics.json` agar biaya aktual dapat dievaluasi.

Jangan pernah menaruh API key di repository, workflow YAML, artikel, issue, log, atau chat publik.

## Policy

- Tidak ada auto-publish pada V1.
- Tidak ada YMYL, politik, kesehatan, investasi, atau topik legal otomatis pada queue default.
- Tidak boleh mengarang pengalaman penggunaan atau pengujian.
- Sumber diprioritaskan dari dokumentasi resmi/primer.
- AI assistance diungkapkan pada halaman artikel.
- Jika source, hard gate, atau review Sol gagal, workflow harus gagal dan tidak boleh menyimpan draft baru.
- Sol tidak menulis ulang seluruh artikel secara default; perubahan dilakukan lewat patch kecil untuk menjaga efisiensi token.
- Score rendah bukan alasan otomatis untuk menolak. Selama masalah masih repairable, Sol wajib mencoba memperbaikinya terlebih dahulu.
- Recovery Sol dibatasi satu putaran tambahan dan tanpa web search agar tetap hemat biaya.

## Aktivasi

Automation akan tetap dorman tanpa `OPENAI_API_KEY`. Setelah secret tersedia, jalankan workflow manual satu kali sebelum mengandalkan schedule.
