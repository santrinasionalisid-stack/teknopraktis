# TeknoPraktis — Editorial Automation & Quality Gate V1.1

Status: **ACTIVE / SOURCE OF TRUTH**

## Tujuan

Otomasi boleh mempercepat riset, drafting, dan publikasi, tetapi tidak boleh menghasilkan artikel tipis, duplikat, placeholder, atau metadata yang rusak.

## Kontrak publikasi

1. Artikel baru dibuat di `src/content/articles/`.
2. Draft otomatis **harus mulai dengan `draft: true`**.
3. Pipeline riset wajib mencatat sumber untuk klaim yang berubah cepat, sensitif, atau membutuhkan verifikasi.
4. Hanya artikel yang sudah siap publikasi yang diubah menjadi `draft: false`.
5. `npm run quality` wajib PASS sebelum build produksi.
6. Cloudflare Pages menjalankan `npm run build`, dan build sekarang otomatis memanggil quality gate terlebih dahulu.

## Hard gate yang memblokir publikasi

- Frontmatter harus valid.
- Title 35–85 karakter.
- Meta description 100–180 karakter.
- Slug lowercase-kebab-case dan unik.
- Taxonomy kategori harus terdaftar.
- Tags 2–8.
- Artikel terbit minimal 120 kata dan minimal 2 heading H2.
- Tidak boleh mengandung placeholder editorial.
- URL sumber yang dicantumkan harus valid dan HTTPS.
- `updatedAt` tidak boleh mendahului `publishedAt`.

## Warning non-blocking

Artikel terbit di bawah ±500 kata akan diberi warning. Ini bukan aturan SEO Google dan bukan target mekanis; artikel harus sepanjang yang dibutuhkan untuk menjawab intent pembaca secara tuntas.

## Quality principles

- Tidak memproduksi artikel hanya untuk mengejar jumlah.
- Tidak mengarang fakta, kutipan, hasil tes, harga, spesifikasi, atau sumber.
- Informasi berubah cepat harus diverifikasi mendekati waktu publikasi.
- Untuk YMYL atau topik berisiko tinggi, otomasi penuh tidak boleh menjadi satu-satunya lapisan review.
- Internal link harus relevan dengan konteks; sistem related-articles memakai kategori dan tag sebagai sinyal awal.
- Sponsor/afiliasi harus diungkapkan lewat metadata `sponsored` dan disclosure pada artikel.

## Tahap otomatisasi berikutnya

Scheduler -> topic queue -> research -> draft -> fact/quality validation -> approval policy -> commit ke GitHub -> Cloudflare Pages deploy -> post-publish validation.
