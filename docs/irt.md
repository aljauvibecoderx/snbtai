Product Requirements Document (PRD)
Nama Fitur: Simulasi SNBT Score & IRT Matrix
Produk: Polos PTN
Status: Draft / Rencana Pengembangan Utama

1. Ringkasan Eksekutif (Executive Summary)
Fitur "Simulasi SNBT Score & IRT Matrix" adalah alat simulasi ujian strategis yang dirancang untuk mengatasi kecemasan siswa terkait sistem penilaian Item Response Theory (IRT) yang selama ini terasa seperti "kotak hitam". Alih-alih hanya memberikan skor prediksi akhir yang tidak berdasar, fitur ini memberikan transparansi, membedah bagaimana sebuah skor terbentuk, dan menyajikan strategi actionable (seperti target benar/salah dan peran tiap subtes) berdasarkan data probabilitas. Tujuannya adalah menggeser mindset pengguna dari sekadar "mengerjakan soal" menjadi "bermain strategi".

2. Tujuan & Metrik Keberhasilan
Tujuan Pengguna: Mendapatkan kepastian (peace of mind), memahami cara kerja pembobotan soal, dan memiliki target spesifik per subtes untuk jurusan impian mereka.

Tujuan Bisnis: Menciptakan nilai jual unik (Unique Selling Proposition) yang membedakan platform dari kompetitor, meningkatkan konversi pengguna berbayar, dan membangun tingkat kepercayaan (validitas) yang tinggi.

Metrik Kesuksesan (KPIs):

Tingkat penyelesaian simulasi (Completion Rate) > 85%.

Time on Task yang tinggi pada halaman "Output & Analysis".

Persentase pengguna yang membagikan hasil Matrix Target mereka ke media sosial.

3. Alur Pengguna (User Journey)
3.1. Konfigurasi Simulasi (Entry Point)
Pemilihan Skala Populasi: Pengguna memilih skala kompetisi (misal: "Lawan 100.000 peserta" atau "Lawan 500.000 peserta"). Sistem akan menyesuaikan parameter distribusi nilai.

Input Data Strategis:

Pengguna memilih maksimal 4 pilihan Jurusan & PTN (terintegrasi dengan database scraping keketatan dan rata-rata historis).

Pengguna memasukkan skor Try Out (TO) terakhir mereka sebagai titik awal (baseline).

3.2. Pelaksanaan Simulasi
UI/UX Ujian Realistis: Tampilan antarmuka dibuat semirip mungkin dengan aplikasi UTBK asli untuk pembiasaan psikologis.

Jeda Transisi: Sistem secara otomatis memberlakukan jeda 30 detik setiap perpindahan subtes.

3.3. Output & Analisis Akhir
Setelah ujian selesai, pengguna dialihkan ke dasbor hasil komprehensif yang menampilkan tiga komponen utama:

Matrix Target IRT: Tabel kuota pengerjaan.

Peran Subtes di Sistem (Role Strategy): Klasifikasi gaya bermain (RPG style).

IRT Logic Breakdown: Analisis logis perolehan poin.

4. Spesifikasi Fungsional & Mekanisme (Core Logic)
4.1. Matrix Target IRT
Tabel yang menampilkan rincian target spesifik untuk mengamankan kursi di pilihan PTN.

Komponen Tabel: Nama Subtes, Total Soal, Target Benar, dan Jatah Salah/Kosong.

Mekanisme: Sistem menghitung mundur dari rata-rata skor aman jurusan yang dipilih, mendistribusikannya ke dalam persentase kebenaran per subtes berdasarkan kekuatan pengguna (dari baseline TO awal).

4.2. Peran di Sistem (Role Assignment Logic)
Mengkategorikan setiap subtes ke dalam "Peran" strategis agar pengguna tahu di mana harus fokus.

Mekanisme Penentuan:

Main Carry (Pendongkrak): Subtes dengan gap positif tertinggi antara kemampuan pengguna (skor tinggi) dan bobot subtes tersebut untuk jurusan pilihan. (Target: Maksimalkan skor).

Secondary Carry: Subtes pendukung di mana pengguna memiliki performa di atas rata-rata populasi.

Stabilizer: Subtes di mana pengguna berada di batas aman (rata-rata). (Target: Bertahan, jangan blunder).

Damage Control (Tembak): Subtes terlemah pengguna. (Target: Amankan soal mudah, minimalkan waktu terbuang, damage control untuk soal sulit).

4.3. IRT Logic Breakdown
Penjelasan transparan mengenai fluktuasi skor berdasarkan simulasi respons populasi.

Mekanisme: Menampilkan daftar soal kunci (soal yang sangat mudah atau sangat sulit).

Contoh Output Teks: "Skor PU kamu naik drastis karena kamu menjawab benar Soal No. 12 (opsi B), di mana 70% populasi simulasi terjebak pada opsi C. Pembobotan poinmu untuk soal ini dimaksimalkan."

5. Kebutuhan Teknis & UX
Perhitungan Dinamis: Sistem backend harus mampu melakukan kalkulasi pembobotan IRT semu secara real-time setelah ujian selesai, dengan mengomparasi jawaban pengguna terhadap dummy data respons populasi (atau data respons agregat dari pengguna platform lainnya).

Desain Responsif: Memastikan tabel Matrix Target dan Role Assignment dapat dibaca dengan mudah pada perangkat seluler tanpa terpotong (horizontal scroll atau perubahan layout menjadi card).

Disclaimer Legal/Validitas: Wajib menyertakan banner atau teks tooltip pada halaman hasil: "Matrix ini adalah simulasi strategis berbasis data probabilitas historis. Dirancang untuk memandu fokus dan strategi belajarmu, bukan jaminan mutlak kelulusan seleksi resmi."