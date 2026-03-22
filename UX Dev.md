1. Implementasi Pagination (UI/UX)
Masalah: Semua paket dirender dalam satu halaman memanjang ke bawah.
Solusi:

Limit Data: Batasi tampilan maksimal 9 atau 12 kartu per halaman (grid 3x3 atau 3x4 di desktop).

Komponen Pagination: Tambahkan kontrol navigasi di bagian paling bawah tengah (contoh: < Prev | 1 | 2 | 3 | ... | Next >).

Styling Pagination: Gunakan gaya minimalis. Angka halaman aktif diberi background ungu muda dengan teks ungu tua, sedangkan halaman tidak aktif menggunakan latar putih/transparan.

2. Redesain Kartu Paket (Opsional namun Sangat Direkomendasikan)
Saat ini, kartu paket menggunakan warna latar ungu solid sepenuhnya. Jika dijajarkan banyak, ini membuat mata cepat lelah dan kehilangan kesan "SaaS Profesional".
Saran Redesain:

Ubah latar belakang kartu menjadi Putih dengan border tipis abu-abu muda (border-gray-200) dan soft shadow (shadow-sm hover:shadow-md).

Gunakan warna Ungu hanya sebagai aksen. Misalnya, pada badge "L3", teks Kode Soal, atau garis tebal di sisi kiri kartu (border-l-4 border-purple-600).

3. Bug Fix Data "0 Soal" di Bank Soal
Masalah: Data "Soal Saya" berhasil membaca "5 soal", namun di "Bank Soal" terdeteksi sebagai "0 soal".
Penyebab (Diagnosis Teknis):

Saat melakukan fetching (pengambilan data) ke koleksi "Bank Soal" (atau filter public), properti yang menyimpan jumlah soal tidak ikut terpanggil, atau nama propertinya berbeda (misal: di "Soal Saya" membaca paket.questions.length, tapi di "Bank Soal" array questions tidak di-fetch secara mendalam untuk menghemat bandwidth).
Solusi:

Pastikan ada field statis di dokumen Firestore bernama questionCount (misal nilainya 5) yang di-update setiap kali ada soal yang ditambahkan, sehingga sistem tidak perlu menghitung manual panjang array .length pada halaman list.