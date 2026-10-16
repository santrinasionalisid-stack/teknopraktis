---
title: Cara Meminta AI Menandai Fakta, Asumsi, dan Hal yang Perlu Dicek
seoTitle: Prompt AI untuk Menandai Asumsi dan Klaim yang Perlu Dicek
description: Gunakan pola prompt untuk memisahkan fakta, kesimpulan, asumsi, dan
  hal yang belum pasti, lalu periksa klaim penting pada sumbernya.
slug: prompt-ai-batas-kepastian-verifikasi
category: AI & Otomasi
categorySlug: ai
contentType: tutorial
featuredImage: /images/articles/prompt-ai-batas-kepastian-verifikasi.webp
featuredImageAlt: Ilustrasi editorial premium tentang Cara Meminta AI Menandai
  Fakta, Asumsi, dan Hal yang Perlu Dicek dengan visual yang relevan pada topik
  AI & Otomasi.
socialImage: /images/articles/prompt-ai-batas-kepastian-verifikasi.webp
imageStyle: premium-v1
imageTagline: Pisahkan dugaan sebelum memakai jawaban AI
tags:
  - AI
  - prompt AI
  - verifikasi fakta
  - literasi digital
publishedAt: 2026-10-16
author: Redaksi TeknoPraktis
sources:
  - title: Does ChatGPT tell the truth?
    url: https://help.openai.com/en/articles/8313428-chatgpt-accuracy-and-limitations
  - title: ChatGPT Enterprise Prompting Guide
    url: https://developers.openai.com/cookbook/examples/chatgpt/chatgpt_prompt_guide/chatgpt_prompt_guide
  - title: "NIST AI 600-1: Generative Artificial Intelligence Profile"
    url: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf
aiAssisted: true
editorialNote: AI membantu riset dan drafting. GPT-6 Sol melakukan fact/source
  review dan final copy edit profesional. Artikel dipublikasikan otomatis selama
  fase bootstrap editorial sampai target 20 artikel.
featured: false
sponsored: false
draft: false
---

Jawaban AI yang terdengar meyakinkan bisa membuat dugaan tampak seperti fakta. Jika jawaban itu dipakai untuk mengambil keputusan, menulis laporan, atau membagikan informasi, kekeliruannya bisa ikut terbawa. Prompt tidak membuat AI selalu benar, tetapi dapat membantu Anda melihat klaim mana yang harus diperiksa lebih dulu.

Caranya: minta AI memisahkan fakta yang didukung bukti, kesimpulan dari bukti tersebut, asumsi, dan hal yang belum diketahui. Setelah itu, periksa klaim penting langsung pada sumbernya. Pola ini dapat dipakai di berbagai layanan AI, meski fitur pencarian dan cara menampilkan sumbernya mungkin berbeda.

## Mengapa batas kepastian perlu ditunjukkan?

Model generatif dapat menghasilkan informasi yang salah dengan bahasa yang lancar dan yakin. OpenAI mengingatkan bahwa fakta, tanggal, kutipan, atau referensi dalam jawaban bisa keliru dan informasi penting perlu diperiksa melalui sumber tepercaya. NIST juga menjelaskan risiko keluaran yang salah atau tidak konsisten, yang kerap disebut halusinasi atau fabrikasi.

Karena itu, penanda ketidakpastian berfungsi sebagai **alat penyaring**, bukan jaminan bahwa klaim lain benar. Label “fakta” dari AI bukan pengesahan: AI bisa tidak menyadari bahwa ia sedang menebak atau menyebut sumber yang tidak mendukung klaimnya. Tujuan prompt ini adalah memperjelas apa yang perlu Anda periksa, bukan menggantikan pemeriksaan tersebut.

## Mulai dengan pola prompt ini

Salin templat berikut, lalu ganti bagian dalam kurung siku:

> Jawab pertanyaan ini: **[tulis pertanyaan]**.
>
> Pisahkan jawaban menjadi empat bagian:
> 1. **Fakta dari bahan atau sumber** — sertakan bukti yang mendukung setiap klaim.
> 2. **Kesimpulan atau interpretasi** — jelaskan fakta mana yang menjadi dasar kesimpulan.
> 3. **Asumsi** — tandai informasi yang Anda anggap benar tetapi belum diberikan atau dibuktikan.
> 4. **Belum diketahui/perlu verifikasi** — tulis hal yang tidak dapat dipastikan, informasi yang mungkin sudah berubah, atau klaim yang memerlukan sumber tambahan.
>
> Jangan mengisi kekosongan informasi dengan tebakan. Jika bukti tidak cukup, katakan bahwa Anda belum dapat memastikan. Untuk setiap klaim faktual, sebutkan sumber spesifik dan bagian yang mendukungnya. Jika saya tidak memberikan bahan dan Anda tidak dapat mengakses atau memeriksa sumber, pindahkan klaim tersebut ke bagian “perlu verifikasi”, bukan “fakta”. Jangan membuat kutipan atau referensi.
>
> Akhiri dengan daftar klaim yang sebaiknya saya cek sendiri, diurutkan dari yang paling penting.

Dengan format ini, Anda dapat melihat klaim, dasar kesimpulan, dan bagian yang kekurangan bukti secara terpisah. OpenAI juga menyarankan pengguna meminta sumber, menandai hal yang tidak pasti, dan meminta AI menyebut asumsinya. Namun, hasilnya tetap bergantung pada model, bahan yang tersedia, dan apakah fitur pencarian benar-benar digunakan.

Misalnya, untuk pertanyaan “Apakah jadwal layanan X besok berubah?”, anggapan bahwa jadwal biasanya tetap sama adalah **asumsi**. Jadwal besok tetap **perlu diverifikasi** melalui pengumuman terbaru penyedia layanan.

## Sesuaikan dengan jenis pertanyaan

**Untuk informasi terbaru**, tentukan waktu dan jenis sumber yang diutamakan:

> Informasi ini dapat berubah. Cari sumber resmi yang masih berlaku pada [tanggal]. Cantumkan tanggal publikasi atau pembaruan jika tersedia. Jika tidak dapat memeriksa sumber terbaru, jangan menyajikan jawaban sebagai kondisi terkini.

Tambahan ini berguna untuk aturan, jadwal, spesifikasi, atau kebijakan. Jika layanan AI tidak memiliki akses pencarian web, prompt tidak dapat memberinya akses baru. Minta AI menyatakan keterbatasan tersebut.

**Untuk dokumen yang Anda berikan**, batasi jawaban pada isi dokumen:

> Gunakan hanya dokumen yang saya lampirkan. Untuk setiap klaim, tunjukkan judul bagian atau kutipan pendek yang menjadi dasar. Pisahkan isi dokumen dari pengetahuan atau interpretasi Anda. Jika jawabannya tidak tercantum, katakan “tidak ditemukan di dokumen”.

Dengan begitu, Anda lebih mudah melihat apakah ringkasan atau analisis melampaui materi yang tersedia. Tetap buka bagian yang dirujuk untuk memastikan konteksnya tidak berubah.

**Untuk membandingkan beberapa klaim**, gunakan format yang memperlihatkan perbedaan statusnya:

> Buat tabel berisi klaim, status (didukung, bertentangan, belum cukup bukti), bukti atau sumber, dan langkah verifikasi berikutnya. Jangan menyamakan “tidak ditemukan bukti” dengan “terbukti salah”.

Perbedaan itu penting: klaim yang belum terverifikasi belum tentu salah, tetapi belum layak diperlakukan sebagai fakta.

## Periksa hasil sebelum digunakan

1. **Pilih klaim yang berdampak.** Dahulukan angka, tanggal, nama, kutipan, aturan, dan pernyataan yang bisa memengaruhi keputusan atau merugikan orang jika salah.
2. **Buka sumbernya sendiri.** Jangan hanya membaca judul, cuplikan, atau ringkasan AI. Pastikan sumber memuat informasi yang diklaim.
3. **Cocokkan klaim dengan sumber.** Apakah sumber mendukung pernyataan persis seperti ditulis, atau hanya membahas topik serupa? Perhatikan tanggal dan konteksnya.
4. **Cari konfirmasi yang layak.** Untuk klaim penting, bandingkan dengan sumber primer atau sumber independen yang tepercaya. Satu tautan yang terlihat resmi belum membuktikan seluruh jawaban.
5. **Pertahankan tanda “perlu dicek” jika belum tuntas.** Misalnya, ketika sumber tidak dapat dibuka, saling bertentangan, atau terlalu lama untuk informasi yang dapat berubah.

Periksa juga kutipan, angka, dan daftar bacaan satu per satu. ChatGPT mengingatkan bahwa kutipan dan referensi dapat direkayasa atau keliru; panduan prompt-nya menyarankan meminta bukti dari bahan yang diberikan serta menandai asumsi.

## Hindari kepastian semu

Kalimat “pastikan jawaban 100% akurat” tidak membuktikan bahwa jawaban benar. Begitu pula angka tingkat keyakinan dari AI: jangan perlakukan angka itu seolah-olah telah dikalibrasi. Untuk kebutuhan sehari-hari, label seperti “ada sumber yang mendukung”, “kesimpulan”, dan “belum diverifikasi” lebih membantu karena menunjukkan apa yang harus dilakukan berikutnya.

Sumber yang dicantumkan AI pun bisa tidak ada, tidak relevan, usang, atau tidak mendukung pernyataan. Untuk informasi terbaru, gunakan pencarian jika tersedia, lalu buka hasilnya sendiri. Hasil pencarian dan sitasi tetap bisa tidak lengkap atau keliru; panduan resmi ChatGPT menyarankan pemeriksaan langsung terhadap sumber dan tanggalnya.

Untuk keputusan medis, hukum, keuangan, atau keselamatan, gunakan AI untuk menyusun pertanyaan atau memahami istilah, bukan sebagai penentu akhir. Periksa sumber resmi dan, bila perlu, konsultasikan dengan tenaga profesional yang sesuai.

## Intinya: gunakan prompt untuk menyusun daftar cek

Jangan berhenti pada permintaan agar AI “jujur jika tidak tahu”. Minta dasar setiap klaim, pisahkan fakta dari asumsi, dan tandai bagian yang belum dapat dipastikan. Lalu buka sumber dan periksa klaim yang paling berisiko. AI membantu menyusun daftar cek; Anda tetap perlu memeriksanya.
