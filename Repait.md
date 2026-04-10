🐛 Bug Report — Relasi Pernyataan (Lanjutan Isu 3)
Isu 3a: Metadata Post (Author & Date) Tidak Tampil
Masalah:
Di bagian Relasi Pernyataan, setiap post hanya menampilkan konten teksnya saja — tanpa keterangan:

Nama author (contoh: Dr. Anya Sharma (Geneticist))
Tanggal & waktu post (contoh: January 15, 2024, 10:30 AM GMT)

Yang seharusnya:
Setiap post card di Relasi Pernyataan harus menampilkan header berisi author + date, sama seperti yang tertulis di Stimulus.

Isu 3b: Jumlah Post di Relasi Pernyataan Tidak Lengkap
Masalah:
Post yang ditampilkan di Relasi Pernyataan lebih sedikit dari yang ada di Stimulus. Contoh: Stimulus punya 5 post thread, tapi Relasi Pernyataan hanya render 4.
Kemungkinan root cause:

Ada off-by-one error saat mapping array post ke komponen
Post terakhir terpotong karena limit hardcoded
Kondisi render yang salah (misal filter yang tidak sengaja exclude satu item)