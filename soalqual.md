Saat ini, beberapa tipe soal seperti boolean, thread, tabel, pernyataan (Q dan P), gambar atau diagram alir, serta soal yang meminta penentuan kualitas pernyataan tidak ditampilkan dengan lengkap. Sistem hanya menampilkan stimulus dan pertanyaan utama, tanpa menampilkan struktur atau format khusus dari tipe soal tersebut.

Hal ini kemungkinan terjadi karena model atau struktur data untuk tipe soal tersebut belum di-handle dengan baik di sisi UI. Padahal, elemen-elemen tersebut merupakan konteks penting yang sangat memengaruhi pemahaman dan cara menjawab soal.

Perlu dilakukan analisis terhadap tipe-tipe soal yang membutuhkan representasi khusus di UI, kemudian diimplementasikan dengan komponen yang sesuai pada fitur Ambis Battle.

Cakupan analisis:

Identifikasi tipe soal yang memerlukan tampilan khusus (boolean, tabel, relasi pernyataan, diagram, dll)
Tentukan kebutuhan struktur data dan cara rendering masing-masing tipe
Pastikan setiap tipe memiliki representasi UI yang jelas dan tidak menghilangkan konteks soal

Rules:

Jika diperlukan, buat folder atau file baru untuk menangani tipe soal ini secara terpisah
Jangan mengganggu atau mengubah fungsionalitas fitur lain yang sudah berjalan
Pastikan integrasi dilakukan secara modular dan aman

Bertindaklah sebagai developer yang mampu membaca edge case, bukan sekadar menampilkan teks soal seadanya.