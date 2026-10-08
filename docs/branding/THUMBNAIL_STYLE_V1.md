# TeknoPraktis — THUMBNAIL STYLE V1

Status: **LOCKED**

## Visual identity
Semua featured image artikel baru wajib memakai gaya premium yang telah disetujui:

- rasio 16:9;
- palet utama dark navy / charcoal dengan warm orange glow;
- high-end editorial technology aesthetic;
- ilustrasi utama berupa 3D + realistic UI hybrid;
- komposisi kiri = ruang editorial untuk teks, kanan = hero illustration;
- objek kanan harus besar, relevan dengan topik, dan menyatu dengan lingkungan;
- tipografi bersih, tegas, proporsional, dengan safe margin yang disiplin;
- badge kategori di kiri atas;
- label kecil `TEKNOPRAKTIS · <CONTENT TYPE>`;
- title maksimal tiga baris dengan auto line balancing;
- tagline pendek di bawah title;
- tidak boleh memakai ilustrasi generik yang hanya berbeda ikon;
- tidak boleh terlihat seperti template gratis, clipart, atau elemen tempelan.

## Pipeline
1. GPT Image membuat background premium 1536×864 tanpa teks dan menyisakan text-safe zone di kiri.
2. Sistem overlay SVG menambahkan category badge, label, title, dan tagline secara deterministik agar ejaan selalu tepat.
3. Wrapper SVG dipakai untuk card dan hero artikel.
4. Raster WebP hasil GPT Image dipakai untuk social/structured-data image.
5. Artikel `premium-v1` gagal quality gate jika raster social image tidak tersedia.

## Model
Default production image model: `gpt-image-2.5-sunburst` dengan quality `high`.
Model dapat dioverride melalui GitHub variable `OPENAI_IMAGE_MODEL`.

## Locked rule
Perubahan style dasar membutuhkan keputusan eksplisit. Topik, objek hero, UI mockup, dan visual metaphor boleh berubah sesuai judul; identitas komposisi, palet, kualitas, dan hierarchy tidak boleh berubah.
