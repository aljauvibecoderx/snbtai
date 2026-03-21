Issue yang Terjadi Saat Ini:

Terdapat beberapa error pada fitur Ambis Battle, khususnya pada proses generate soal dan sesi live battle:

1. Error saat Generate Soal dengan AI

Deskripsi:

Proses pembuatan soal menggunakan AI mengalami kegagalan dengan error berikut:

Failed to parse JSON array from AI response
AI Generation Error: Error: AI gagal mengikuti format JSON. Silakan coba lagi.

Indikasi:

Response dari AI tidak sesuai dengan format JSON yang diharapkan
JSON terpotong atau tidak valid (kemungkinan string tidak tertutup / format tidak lengkap)

Kemungkinan Penyebab:

Prompt ke AI belum cukup ketat dalam mendefinisikan format output
Tidak ada validasi atau sanitasi response sebelum parsing
AI menghasilkan format campuran (teks + JSON)

Catatan:
Sebagai referensi, format soal dan struktur prompt dapat mengacu pada implementasi yang sudah ada di app.js (termasuk dukungan format seperti LaTeX) agar lebih konsisten dan mudah diproses.

2. Sinkronisasi Waktu pada Live Battle

Deskripsi:

Pada sesi live battle, waktu (timer) antar user tidak sinkron.
Contoh kasus:

Salah satu user sudah menyelesaikan soal
User lain masih berada di pertanyaan sebelumnya

Dampak:

Penentuan menang/kalah menjadi tidak akurat
Mengganggu fairness, karena sistem penilaian berbasis:
kecepatan menjawab
ketepatan jawaban

Kemungkinan Penyebab:

Timer berjalan di sisi client, bukan server
Tidak ada sinkronisasi waktu global antar user
Delay jaringan menyebabkan state antar client tidak konsisten