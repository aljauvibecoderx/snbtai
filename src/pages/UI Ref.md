💻 Prompt untuk AI Coder: Final UI Standardization (Vocab & Progress)
ROLE & OBJECTIVE:
Bertindaklah sebagai Senior UI Engineer. Lanjutkan standardisasi desain "Soft & Minimalist SaaS" ke halaman Vocab.jsx dan Progress.jsx. Hapus semua warna latar belakang solid yang mencolok (merah terang, hijau tua, biru pekat, dll) dan ganti dengan pendekatan soft background yang elegan.

1. PERBAIKAN HALAMAN VOCAB (Vocab.jsx):

Top Stats Cards: Ubah background 4 kartu statistik di atas (yang saat ini berwarna biru solid, kuning solid, merah solid, hijau solid) menjadi latar belakang putih (bg-white) dengan ikon atau garis aksen (border-left) tipis sesuai warnanya (misal: ungu, amber, rose, emerald). Gunakan soft shadow (shadow-sm).

Vocab List Cards: Border warna hijau tosca/cyan pada setiap card kosakata (seperti kata "in addition", "therefore") terlihat out of place. Ubah border menjadi abu-abu tipis (border-gray-200) atau ungu sangat muda (border-purple-100).

Badges & Labels: Label "SNBT" yang berwarna hijau tosca ubah menjadi ungu soft (bg-purple-50 text-purple-600). Label poin "+5 XP" ubah menjadi warna amber lembut (text-amber-500 font-semibold).

2. PERBAIKAN HALAMAN PROGRESS (Progress.jsx):

Subject Icons (Sebelah Kiri): Kotak ikon di sebelah kiri nama subtes (Penalaran Umum, PBM, dll) terlalu mencolok karena menggunakan warna solid penuh (biru, kuning, merah, pink, dll). Ubah menjadi versi soft:

Gunakan bg-{color}-50 untuk latar belakang kotaknya.

Gunakan ikon atau inisial teks dengan warna solid text-{color}-600 di dalamnya. (Contoh: Latar biru muda bg-blue-50, teks 'PU' biru tua text-blue-600).

Progress Bars: Pastikan warna bar kemajuan (progress bar) selaras dengan warna soft icon di sebelahnya. Gunakan tinggi bar yang lebih ramping (misal h-2 atau h-1.5) dengan sudut membulat (rounded-full) agar terlihat lebih modern.

Layout Header: Rapikan header "SNBT Progress Tracker" beserta komponen donat chart-nya. Pastikan padding dalam kartu utama cukup lega (p-6 atau p-8).

3. ATURAN UMUM KONSISTENSI:

Seluruh card wrapper harus menggunakan bg-white, border border-gray-100 (atau transparan), dan shadow-sm.

Seluruh latar belakang halaman (di luar card) wajib menggunakan bg-[#F8F9FA] atau bg-slate-50.

Pastikan jenis dan ukuran font (Typography) sama persis dengan halaman "Overview" dan "Bank Soal".