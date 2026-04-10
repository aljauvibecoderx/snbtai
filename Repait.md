🐛 Bug Report — AmbisBattle Live (Tambahan)
Isu 3: Relasi Pernyataan Kosong (Blank)
Konteks:
Soal tipe Relasi Pernyataan di subtes LBE — tampilan desktop (gambar baru).
Masalah:
Bagian "RELASI PERNYATAAN" tampil sebagai kotak kosong — konten/teks pernyataannya tidak muncul sama sekali.
Yang seharusnya:
Kotak Relasi Pernyataan harus menampilkan daftar pernyataan-pernyataan yang perlu dievaluasi oleh user.
Kemungkinan root cause:

Data pernyataan gagal di-fetch / tidak ter-render ke komponen
Komponen Relasi Pernyataan tidak membaca field yang benar dari response soal
Bisa juga konten soal memang kosong di database (data issue)


Isu 4: Soal Boolean — Tabel Ya/Tidak Tidak Muncul, Teks Pernyataan Hilang
Konteks:
Soal tipe boolean/hitung benar di AmbisBattle Live (konfirmasi dari isu 1 sebelumnya).
Masalah yang terkonfirmasi ada 2 lapis:

Teks pernyataan tidak muncul — list pernyataan (1), (2), (3), dst. tidak ter-render
Format tabel Ya/Tidak tidak muncul — UI tetap menampilkan pilihan ganda 0–4 alih-alih tabel evaluasi per pernyataan

Soal jenis Literasi bahasa inggris timernya belum 1 menit

Yang seharusnya:

Teks setiap pernyataan harus tampil
Format jawaban harus berupa tabel Benar/Salah per pernyataan, bukan opsi angka