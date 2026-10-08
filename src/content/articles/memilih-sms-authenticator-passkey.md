---
title: "SMS, Authenticator, atau Passkey: Pilih Cara Masuk yang Tepat"
seoTitle: Memilih SMS, Authenticator, atau Passkey untuk Akun
description: Bandingkan risiko phishing, kemudahan penggunaan, dan pemulihan
  akun sebelum memilih SMS, aplikasi authenticator, atau passkey.
slug: memilih-sms-authenticator-passkey
category: Keamanan Digital
categorySlug: keamanan-digital
contentType: decision-guide
featuredImage: /images/articles/memilih-sms-authenticator-passkey.webp
featuredImageAlt: "Ilustrasi editorial premium tentang SMS, Authenticator, atau
  Passkey: Pilih Cara Masuk yang Tepat dengan visual yang relevan pada topik
  Keamanan Digital."
socialImage: /images/articles/memilih-sms-authenticator-passkey.webp
imageStyle: premium-v1
imageTagline: Pilih perlindungan yang bisa Anda pulihkan
tags:
  - keamanan digital
  - autentikasi dua faktor
  - passkey
  - authenticator
  - SMS
publishedAt: 2026-10-08
author: Redaksi TeknoPraktis
sources:
  - title: "NIST SP 800-63B-4: Authentication and Authenticator Management"
    url: https://pages.nist.gov/800-63-4/sp800-63b.html
  - title: "CISA: Implementing Phishing-Resistant MFA"
    url: https://www.cisa.gov/sites/default/files/2023-01/fact-sheet-implementing-phishing-resistant-mfa-508c.pdf
  - title: "Google Account Help: Get verification codes with Google Authenticator"
    url: https://support.google.com/accounts/answer/1066447
  - title: "Google Account Help: Sign in with a passkey"
    url: https://support.google.com/accounts/answer/13548313
  - title: "Google Account Help: Sign in with backup codes"
    url: https://support.google.com/accounts/answer/1187538
aiAssisted: true
editorialNote: AI membantu riset dan drafting. GPT-6 Sol melakukan fact/source
  review dan final copy edit profesional. Artikel dipublikasikan otomatis selama
  fase bootstrap editorial sampai target 20 artikel.
featured: false
sponsored: false
draft: false
---

Kode verifikasi yang Anda ketik di situs palsu bisa diteruskan penyerang, meski Anda sudah mengaktifkan perlindungan tambahan. Karena itu, memilih SMS, aplikasi authenticator, atau passkey bukan cuma soal kemudahan, tetapi juga ketahanan terhadap phishing dan cara memulihkan akses saat perangkat hilang.

Patokan awalnya: gunakan passkey jika layanan mendukungnya dan Anda siap mengatur pemulihan. Jika belum tersedia, pilih authenticator. Bila hanya ada SMS, aktifkan daripada mengandalkan kata sandi saja. Apa pun pilihannya, periksa cara masuk lain yang masih diizinkan layanan.

## Apa yang sebenarnya dibandingkan?

“Login kedua” biasanya berarti verifikasi tambahan setelah kata sandi. Passkey tidak selalu berperan seperti itu. Pada sebagian layanan, passkey dapat menggantikan kata sandi atau sekaligus membuktikan bahwa Anda memiliki dan dapat membuka perangkat. Google, misalnya, menyatakan passkey pada Akun Google dapat melewati verifikasi dua tahap karena membuktikan kepemilikan perangkat. Cara kerjanya bergantung pada layanan dan pengaturan akun.

Jadi, bandingkan fungsi setiap metode, bukan hanya namanya. Menurut NIST, SMS dan kode sekali pakai dari aplikasi tidak tahan terhadap phishing: situs palsu dapat meminta kode yang Anda ketik lalu meneruskannya kepada penyerang. Passkey berbasis WebAuthn mengikat autentikasi pada identitas situs, sehingga lebih sulit dipakai untuk masuk ke situs tiruan. ([NIST SP 800-63B-4](https://pages.nist.gov/800-63-4/sp800-63b.html); [CISA tentang MFA tahan phishing](https://www.cisa.gov/sites/default/files/2023-01/fact-sheet-implementing-phishing-resistant-mfa-508c.pdf))

| Metode | Kelebihan praktis | Risiko atau batasan utama |
|---|---|---|
| SMS | Familiar dan tidak perlu memasang aplikasi kode | Bergantung pada nomor telepon dan jaringan; kode bisa dicuri lewat phishing atau pengambilalihan nomor |
| Authenticator (TOTP) | Kode dibuat di aplikasi dan bisa tersedia tanpa layanan seluler | Kode tetap bisa dicuri lewat phishing; kehilangan ponsel tanpa cadangan atau akses pemulihan bisa menyulitkan |
| Passkey | Lebih tahan terhadap situs palsu dan biasanya cukup dibuka dengan PIN, sidik jari, atau wajah | Dukungan layanan dan cara sinkronisasi berbeda; keamanan juga bergantung pada perangkat dan pemulihan akun |

## Kapan memilih SMS?

SMS cocok sebagai langkah awal jika layanan tidak menyediakan pilihan lain atau Anda belum bisa memakai metode yang lebih kuat. Namun, jangan menganggapnya perlindungan terbaik untuk email utama, akun kerja, penyimpanan cloud, atau akun yang dapat mereset kata sandi layanan lain.

Selain bisa terlambat atau tidak sampai, SMS bergantung pada nomor telepon, operator, dan kondisi jaringan. Jika nomor berpindah tangan atau diambil alih, kode berpotensi diterima orang lain. NIST menyebut SMS tidak tahan terhadap phishing, sementara panduan CISA menempatkan kode SMS di bawah metode tahan phishing.

Jika memakai SMS, jangan berikan kodenya kepada siapa pun, termasuk orang yang mengaku sebagai petugas layanan. Pertimbangkan metode lebih kuat bila tersedia, dan periksa apakah nomor lama masih terdaftar sebagai jalur pemulihan.

## Kapan aplikasi authenticator lebih masuk akal?

Aplikasi authenticator membuat kode sekali pakai yang biasanya berubah berkala. Kode dapat dibuat tanpa koneksi internet atau layanan seluler, sehingga Anda tidak perlu menunggu SMS. Ini pilihan praktis untuk akun yang belum mendukung passkey, asalkan Anda menyiapkan pemulihan sebelum berganti atau kehilangan ponsel. ([Google Authenticator](https://support.google.com/accounts/answer/1066447))

Namun, kode yang berubah tidak berarti kebal phishing. Penyerang bisa mencoba meneruskan kode yang Anda ketik di halaman palsu ke layanan asli. NIST menggolongkan kode sekali pakai yang dimasukkan secara manual sebagai metode yang tidak tahan phishing. Periksa nama domain sebelum memasukkan kode, dan jangan menyetujui permintaan login yang tidak Anda mulai.

Sebelum mengandalkan authenticator:

1. Aktifkan pada layanan, lalu ikuti proses uji masuk yang disediakan.
2. Simpan kode pemulihan jika tersedia, di tempat aman yang tetap dapat dijangkau saat ponsel hilang.
3. Cari tahu cara memindahkan atau memulihkan kode ketika berganti perangkat. Jangan berasumsi semua aplikasi menyinkronkannya dengan cara yang sama.
4. Setelah metode baru berfungsi, tinjau metode lama dan nomor telepon yang masih terhubung.

Google Authenticator, misalnya, dapat menyinkronkan kode melalui Akun Google atau memindahkannya secara manual. Panduan resmi Google menjelaskan kedua cara tersebut; pilihan dan pengaturannya bergantung pada pengguna. Jika memakai sinkronisasi, lindungi juga akun tempat kode disimpan.

## Kapan passkey menjadi pilihan utama?

Pilih passkey jika layanan mendukungnya dan perangkat Anda memiliki kunci layar yang aman. Anda membuktikan akses dengan membuka perangkat, misalnya memakai PIN, sidik jari, atau pengenalan wajah. Menurut Google, data biometrik untuk membuka perangkat tetap berada di perangkat saat Anda memakai passkey Akun Google. Passkey juga dirancang agar autentikasi terikat pada situs yang benar, bukan pada kode yang bisa disalin ke halaman tiruan. ([Google: masuk dengan passkey](https://support.google.com/accounts/answer/13548313))

Keunggulan itu tetap perlu diimbangi rencana pemulihan. Passkey dapat tersimpan atau tersinkron melalui ekosistem tertentu, sementara prosedur pemulihan akun berbeda antarpenyedia. Siapa pun yang dapat membuka perangkat dengan passkey mungkin dapat mengakses akun terkait. Gunakan kunci layar yang kuat dan jangan membuat passkey pada perangkat bersama.

Cari tahu pula cara masuk jika perangkat utama hilang, misalnya melalui perangkat lain, kunci keamanan, atau opsi pemulihan layanan. Menambahkan passkey tidak otomatis menonaktifkan kata sandi, SMS, atau jalur pemulihan lain. Setelah menguji passkey dan cadangannya, tinjau jalur yang masih aktif. Nonaktifkan yang tidak diperlukan hanya jika layanan mengizinkan dan Anda sudah memastikan akun tetap dapat dipulihkan.

Passkey paling sesuai jika Anda mengutamakan ketahanan terhadap phishing dan memiliki rencana cadangan yang bisa dijalankan. Jika layanan menyediakan kunci keamanan fisik, itu bisa menjadi opsi tambahan untuk akun penting, terutama bila Anda tidak ingin bergantung pada satu ponsel.

## Tentukan pilihan, lalu periksa pemulihannya

Gunakan urutan ini untuk mengambil keputusan:

- **Ada passkey dan Anda bisa mengelola pemulihannya:** pilih passkey, lalu daftarkan perangkat atau metode cadangan yang tersedia.
- **Belum ada passkey:** pilih authenticator, simpan kode pemulihan, dan siapkan cara pindah perangkat.
- **Hanya ada SMS:** aktifkan daripada hanya memakai kata sandi. Jaga kerahasiaan kode dan beralih ke metode lebih kuat jika tersedia.
- **Akun sangat penting:** periksa juga email pemulihan, nomor telepon, perangkat tepercaya, dan siapa yang dapat memulihkan akun.

Jangan berganti ponsel sebelum memastikan authenticator baru berfungsi, atau menyimpan kode pemulihan hanya di perangkat yang sama tanpa perlindungan. Jangan pula menganggap passkey selalu merupakan faktor kedua. Uji metode baru dan pahami aturan pemulihan layanan sebelum menghapus metode lama.

**Intinya:** passkey biasanya paling baik untuk mengurangi risiko phishing, authenticator menjadi pilihan praktis saat passkey belum tersedia, dan SMS tetap berguna jika hanya itu opsinya. Pilih metode yang bukan hanya bisa Anda gunakan, tetapi juga bisa Anda pulihkan dengan aman.
