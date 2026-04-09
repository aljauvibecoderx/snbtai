Product Requirements Document (PRD): Ambis Battle Desktop Redesign

Versi: 1.0
Tanggal: 09 April 2026
Status: Draft untuk Implementasi

1. Latar Belakang & Tujuan
Saat ini, antarmuka Ambis Battle menggunakan pendekatan Mobile-First yang bekerja dengan baik di layar ponsel. Namun, saat diakses melalui Desktop/Laptop, tampilan hanya memanjang ke tengah (seperti tampilan HP di tengah layar monitor), menyisakan banyak ruang kosong (whitespace) yang tidak terpakai di kiri-kanan. Hal ini membuat pengalaman pengguna (UX) terasa kurang "penuh" dan kurang optimal untuk layar lebar.
Tujuan Utama:
Mengubah tampilan Desktop menjadi Full Width / Responsive Layout yang memanfaatkan lebar layar monitor.
Menjaga tampilan Mobile tetap 100% sama (tidak ada perubahan pada versi mobile).
Menciptakan tampilan yang Proporsional, Minimalis, dan Elegan pada layar besar.

2. Prinsip Desain (Design System Desktop)
Responsiveness: Menggunakan Breakpoint md: (min-width: 768px) atau lg: (min-width: 1024px) sebagai trigger perubahan layout.
Minimalis: Hindari elemen yang terlalu padat. Gunakan whitespace yang lega agar mata tidak lelah.
Proporsional: Ukuran font, padding, dan tombol (button) harus sedikit lebih besar atau lebih "bernapas" di desktop agar tidak terlihat kekecilan di layar 27 inch.
Split Layout: Mengubah susunan vertikal (tumpuk ke bawah) menjadi horizontal (kiri-kanan) di layar lebar.

3. Detail Spesifikasi Per Halaman
3.1. Halaman Lobby (Main Menu)
Referensi Gambar 2
Komponen
Tampilan Mobile (Tetap)
Tampilan Desktop (Baru)
Layout Utama
Single Column (Vertikal)
Centered Container atau Split Layout
Header
Judul di tengah atas
Judul tetap di tengah atas, ukuran font H1 diperbesar.
Menu Cards
"Buat Room" & "Masuk Room" bertumpuk ke bawah.
Side-by-Side (Horizontal). Dua kartu berdampingan dengan jarak (gap) yang elegan. Lebar kartu menyesuaikan agar tidak terlalu gepeng.
Info "Cara Bermain"
List vertikal (1, 2, 3) di bawah menu.
Sidebar Kanan. Pindahkan info cara bermain ke sisi kanan layar sebagai panel info statis, atau buat menjadi 3 kolom horizontal di bawah menu utama.
Background
Putih polos
Bisa ditambahkan elemen dekoratif halus (gradient tipis) di sisi kiri-kanan agar tidak terlalu hampa.
3.2. Halaman Waiting Room
Referensi Gambar 1
Komponen
Tampilan Mobile (Tetap)
Tampilan Desktop (Baru)
Container
Kartu sempit di tengah.
Wide Card. Kartu utama melebar maksimal 800px atau 1000px di tengah layar.
Room Code
Kotak kode di atas list pemain.
Split Header. Bagian atas kartu dibagi dua: Kiri untuk "Kode Room" (Font sangat besar & jelas), Kanan untuk tombol "Copy" & Status.
Player List
List vertikal (Host di atas, slot kosong di bawah).
Versus Layout. Tampilkan Host di sisi Kiri dan Slot Kosong di sisi Kanan dengan ikon "VS" di tengah. Ini memberikan nuansa "Duel" yang lebih kuat.
Footer Button
Tombol ungu lebar penuh di bawah.
Tombol tetap lebar penuh di dalam container, atau dibuat Sticky di bagian bawah layar jika konten sedikit.
3.3. Halaman Gameplay (Duel Soal) - Prioritas Utama
Referensi Gambar 3
Komponen
Tampilan Mobile (Tetap)
Tampilan Desktop (Baru)
Layout
Vertikal (Stimulus di atas, Jawaban di bawah). User harus scroll bolak-balik.
Split Screen (Kiri-Kanan).
Panel Kiri (Stimulus)
Scrollable.
Fixed / Sticky Left Panel (60% Lebar). Area baca soal dibuat diam (tidak ikut scroll) atau scroll terpisah, sehingga user bisa membaca teks panjang tanpa kehilangan konteks. Font diperbesar agar nyaman dibaca.
Panel Kanan (Jawaban)
Tombol jawaban bertumpuk.
Sticky Right Panel (40% Lebar). Area tombol jawaban A-E. Tombol dibuat lebih besar (tinggi minimal 60px) agar mudah diklik mouse.
Header (Timer/Skor)
Baris kecil di atas.
Full Width Header. Header melebar penuh di atas kedua panel. Timer dan Skor Host vs Lawan ditampilkan lebih jelas.
3.4. Halaman Hasil (Result)
Referensi Gambar 4
Komponen
Tampilan Mobile (Tetap)
Tampilan Desktop (Baru)
Winner Card
Di tengah atas.
Tetap di tengah atas, tapi dibuat lebih megah (lebih besar).
Statistik
3 kotak kecil berjajar.
3 kotak diperlebar dan diberi jarak (gap) lebih besar. Angka statistik (40%, 2/5, 3s) diperbesar font-nya.
Evaluasi (List Soal)
List vertikal panjang (1-5).
Grid Layout (2 atau 3 Kolom). Daftar evaluasi soal ditampilkan dalam bentuk Grid. Contoh: Soal 1 & 2 di kiri, Soal 3 & 4 di tengah, Soal 5 di kanan. Ini mempersingkat scroll ke bawah.
Tombol Main Lagi
Di paling bawah.
Tetap di bawah, di tengah.

4. Contoh Implementasi CSS (Tailwind Logic)
Untuk developer, berikut adalah logika class yang perlu diterapkan:
Container Utama:
css
12
Gameplay Page (Split Screen):
html
1234567891011
Lobby Page (Side by Side Cards):
html
123456
