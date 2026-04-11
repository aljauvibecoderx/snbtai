🎨 UI/UX Improvement — Layout AmbisBattle Live
Masalah Saat Ini
Layout sekarang menggunakan full-width single column (atau 2 kolom tapi tidak optimal), sehingga:

User harus scroll jauh ke bawah melewati teks Stimulus & Relasi Pernyataan yang panjang untuk menemukan pertanyaan dan opsi jawaban
Pertanyaan dan opsi jawaban tertimbun di bawah konten panjang
Pengalaman battle jadi terganggu karena fokus user terpecah antara baca teks vs cari soal


Solusi yang Diusulkan: Split-Panel Fixed Layout
Ubah layout menjadi 2 panel fixed (tidak ikut scroll bersama):
┌─────────────────────────┬──────────────────────────┐
│  PANEL KIRI (scrollable)│  PANEL KANAN (fixed)     │
│                         │                          │
│  🏷 SNBT                │  ❓ PERTANYAAN           │
│                         │  "Based on post X..."    │
│  📄 STIMULUS            │                          │
│  [teks panjang...]      │  📋 PILIHAN JAWABAN      │
│                         │  ○ Opsi A                │
│  💬 RELASI PERNYATAAN   │  ○ Opsi B                │
│  [post 1...]            │  ○ Opsi C                │
│  [post 2...]            │  ○ Opsi D                │
│  [post 3...]            │  ○ Opsi E                │
│  [dst...]               │                          │
│                         │  [JAWAB]                 │
└─────────────────────────┴──────────────────────────┘
Behavior:

Panel kiri → scrollable, user bisa baca stimulus & relasi pernyataan sepuasnya
Panel kanan → sticky/fixed, pertanyaan + opsi jawaban selalu terlihat tanpa perlu scroll
Timer tetap di top bar yang juga fixed


Kenapa Layout Ini Lebih Baik
AspekSekarangUsulanAkses pertanyaanHarus scrollSelalu visibleBaca stimulusTidak nyamanScroll bebas di panel kiriFokus userTerpecahTerstruktur jelasKecepatan jawabLambatLebih cepat, cocok untuk battle

🎨 UI/UX Issue — Halaman "Buat Soal Battle" (Desktop Layout)
Masalah Saat Ini
Halaman ini menggunakan layout mobile-first yang tidak di-adapt untuk desktop. Gejalanya:

Konten terpusat di tengah dengan max-width sempit (terlihat seperti ~600px)
Sisi kiri dan kanan layar kosong/wasted space yang sangat besar
Form input, dropdown, dan tombol terasa kecil dan tidak proporsional di layar lebar
Secara keseluruhan terasa seperti melihat tampilan HP di monitor


Plan Perbaikan: Desktop-Optimized Layout
Solusi: manfaatkan lebar layar dengan 2-column layout seperti ini:
┌─────────────────────────────────────────────────────────────────┐
│  ← Buat Soal Battle  Room: 44FR93                    0 soal    │
├──────────────────────────────┬──────────────────────────────────┤
│                              │                                  │
│  ✨ Generate Soal dengan AI  │  📋 Soal yang Sudah Ditambahkan  │
│                              │                                  │
│  Subtes    [dropdown    ▾]   │  ┌──────────────────────────┐   │
│  Level     [dropdown    ▾]   │  │ (empty state / list soal)│   │
│  Topik     [dropdown    ▾]   │  └──────────────────────────┘   │
│  Jumlah    [dropdown    ▾]   │                                  │
│                              │  Total: 0 soal                  │
│  Konteks (opsional)          │  [Mulai Battle →]               │
│  [textarea                ]  │                                  │
│                              │                                  │
│  [Generate 5 Soal AI     ]   │                                  │
│                              │                                  │
│  🔀 Ambil dari Bank Soal     │                                  │
│  [Grup Cepat] [Filter Lanjut]│                                  │
│                              │                                  │
└──────────────────────────────┴──────────────────────────────────┘

Detail Perubahan yang Diperlukan
ElemenSekarangUsulanMax-width container~600px centeredFull width, padding 48px kiri-kananLayout formSingle column2 kolom: form kiri, preview soal kananPanel kananTidak adaSticky panel daftar soal + tombol mulai battleDropdown barisStack vertikalGrid 2 kolom (Subtes & Level sejajar, Topik & Jumlah sejajar)Tombol GenerateFull width sempitFull width di panel kiriBreakpointTidak adaResponsive: 2 col di ≥1024px, 1 col di mobile

Manfaat

Panel kanan menampilkan preview soal yang sudah ditambahkan secara real-time — user tidak perlu scroll untuk cek progres
Form lebih efisien — semua input visible sekaligus tanpa scroll
Tombol "Mulai Battle" selalu terlihat di panel kanan, tidak perlu cari-cari