// Silabus SNBT - Data Kurikulum dan Materi (Enhanced Version)
const silabusData = {
    "Penalaran Umum": {
        icon: "fas fa-brain",
        color: "#3B82F6",
        description: "Kemampuan berpikir logis dan analitis",
        code: "PU",
        topics: [
            {
                id: "pu_1",
                title: "Logika Dasar",
                subtopics: [
                    "Logika Matematika (Dasar)",
                    "Proposisi, Kalimat Terbuka/Tertutup",
                    "Logika Kuantor",
                    "Operasi Logika"
                ]
            },
            {
                id: "pu_2",
                title: "Penalaran Deduktif",
                subtopics: [
                    "Silogisme",
                    "Modus Ponens",
                    "Modus Tollens",
                    "Memperkuat/Memperlemah Argumen",
                    "Evaluasi Bukti",
                    "Simpulan"
                ]
            },
            {
                id: "pu_3",
                title: "Penalaran Induktif",
                subtopics: [
                    "Generalisasi",
                    "Analogi",
                    "Hubungan Kausalitas"
                ]
            },
            {
                id: "pu_4",
                title: "Penalaran Kuantitatif",
                subtopics: [
                    "Teori dan Jenis Bilangan",
                    "Sifat-sifat Bilangan",
                    "Statistik Dasar",
                    "Grafik/Tabel",
                    "Soal Cerita",
                    "Peluang Dasar dan Pencacahan",
                    "Barisan dan Deret",
                    "Persentase",
                    "Diskon dan Bunga Bank"
                ]
            }
        ]
    },
    "Pemahaman Bacaan & Menulis": {
        icon: "fas fa-book",
        color: "#F59E0B",
        description: "Kemampuan memahami dan menggunakan bahasa Indonesia",
        code: "PBM_PPU",
        topics: [
            {
                id: "pbm_1",
                title: "Ejaan",
                subtopics: [
                    "Huruf Kapital dan Ejaan (EYD V)",
                    "Tanda Baca",
                    "Makna Imbuhan",
                    "Konjungsi dan Partikel"
                ]
            },
            {
                id: "pbm_2",
                title: "Preposisi",
                subtopics: [
                    "Kata hubung/Konjungsi",
                    "Partikel dan Bentuk Terikat"
                ]
            },
            {
                id: "pbm_3",
                title: "Pembentukan Kata",
                subtopics: [
                    "Bentuk/Jenis Kata",
                    "Kata Baku dan Tidak Baku"
                ]
            },
            {
                id: "pbm_4",
                title: "Frasa dan Klausa",
                subtopics: [
                    "Frasa/Kelompok Kata",
                    "Klausa"
                ]
            },
            {
                id: "pbm_5",
                title: "Struktur Kalimat",
                subtopics: [
                    "Struktur Kalimat/Tata Kalimat",
                    "Jenis Kalimat",
                    "Hubungan Antar Kalimat"
                ]
            },
            {
                id: "pbm_6",
                title: "Kalimat Efektif",
                subtopics: [
                    "Kalimat Efektif/Tidak Efektif",
                    "Kalimat Sumbang"
                ]
            },
            {
                id: "pbm_7",
                title: "Paragraf",
                subtopics: [
                    "Kelogisan Kalimat",
                    "Hubungan Antar Kalimat",
                    "Kepaduan paragraf",
                    "Kalimat Utama dalam Teks"
                ]
            },
            {
                id: "pbm_8",
                title: "Bacaan",
                subtopics: [
                    "Tema dan Topik",
                    "Gagasan/Ide Pokok",
                    "Ungkapan",
                    "Bahasa Panda",
                    "Bahasa Hipotesis"
                ]
            }
        ]
    },
    "Pengetahuan & Pemahaman Umum": {
        icon: "fas fa-lightbulb",
        color: "#8B5CF6",
        description: "Pengetahuan faktual dan pemahaman konsep umum",
        code: "PPU",
        topics: [
            {
                id: "ppu_1",
                title: "Makna Kata (PPU)",
                subtopics: [
                    "Penggunaan Istilah/Kata",
                    "Perubahan Makna Kata",
                    "Makna Bertingkat/Hierarkis",
                    "Frasa dan Klausa",
                    "Kata Berpasangan"
                ]
            },
            {
                id: "ppu_2",
                title: "Aplikasi Kalimat (PPU)",
                subtopics: [
                    "Semantik/Tata Makna",
                    "Kalimat Majemuk",
                    "Transformasi Kalimat",
                    "Inti Kalimat"
                ]
            }
        ]
    },
    "Pengetahuan Kuantitatif": {
        icon: "fas fa-calculator",
        color: "#10B981",
        description: "Kemampuan matematika dan numerik",
        code: "PK",
        topics: [
            {
                id: "pk_1",
                title: "Operasi Matematika Dasar",
                subtopics: [
                    "Operasi MTK Dasar (PEMDAS)",
                    "Operasi Pecahan, Desimal, Persentase",
                    "Sistem Koordinat"
                ]
            },
            {
                id: "pk_2",
                title: "Bilangan",
                subtopics: [
                    "Teori dan Jenis Bilangan",
                    "Sifat-sifat Bilangan",
                    "KPK, FPB dan Aplikasinya"
                ]
            },
            {
                id: "pk_3",
                title: "Aljabar Dasar",
                subtopics: [
                    "Operasi Aljabar Sederhana",
                    "Penyederhanaan, Faktorisasi, Distribusi Aljabar",
                    "Persamaan Aljabar",
                    "Pertidaksamaan Aljabar",
                    "Perbandingan",
                    "Konsep Perbandingan"
                ]
            },
            {
                id: "pk_4",
                title: "Akar, Pangkat, Logaritma",
                subtopics: [
                    "Akar dan Eksponen",
                    "Logaritma"
                ]
            },
            {
                id: "pk_5",
                title: "Himpunan, Fungsi dan Persamaan Garis",
                subtopics: [
                    "Himpunan",
                    "Persamaan Garis Lurus",
                    "Fungsi, Relasi, Komposisi, Invers",
                    "Persamaan dan Fungsi Kuadrat"
                ]
            },
            {
                id: "pk_6",
                title: "Sistem Persamaan",
                subtopics: [
                    "SPLDV/SPLTV",
                    "Persamaan Berbentuk Flowchart"
                ]
            },
            {
                id: "pk_7",
                title: "Geometri",
                subtopics: [
                    "Kesebangunan dan Bangun Datar Kompleks",
                    "Sudut dan Operasi Sudut",
                    "Sifat Bangun Datar dan Ruang",
                    "Trigonometri Dasar",
                    "Dimensi Tiga",
                    "Jarak Titik, Garis dan Bidang",
                    "Bangun Datar, Luas dan Keliling",
                    "Bangun Ruang, Luas dan Volume"
                ]
            },
            {
                id: "pk_8",
                title: "Statistika dan Peluang",
                subtopics: [
                    "Statistik Dasar dan Penyajian Data",
                    "Penyebaran Data/Tendensi Sentral",
                    "Peluang Dasar dan Pencacahan",
                    "Peluang Kejadian, Kombinasi, Permutasi"
                ]
            },
            {
                id: "pk_9",
                title: "Barisan dan Deret",
                subtopics: [
                    "Barisan-Deret Aritmatika",
                    "Barisan-Deret Geometri",
                    "Deret Tak Hingga"
                ]
            },
            {
                id: "pk_10",
                title: "Aritmatika Sosial",
                subtopics: [
                    "Bunga dan Diskon",
                    "Aritmatika Sosial"
                ]
            },
            {
                id: "pk_11",
                title: "Lanjutan (PK)",
                subtopics: [
                    "Matriks",
                    "Transformasi Geometri",
                    "Limit/Turunan Dasar"
                ]
            }
        ]
    },
    "Penalaran Matematika": {
        icon: "fas fa-square-root-alt",
        color: "#EC4899",
        description: "Penerapan konsep matematika dalam pemecahan masalah",
        code: "PM",
        topics: [
            {
                id: "pm_1",
                title: "Operasi Matematika Dasar",
                subtopics: [
                    "Operasi MTK Dasar (PEMDAS)",
                    "Operasi Pecahan, Desimal, Persentase",
                    "Sistem Koordinat"
                ]
            },
            {
                id: "pm_2",
                title: "Bilangan",
                subtopics: [
                    "Teori dan Jenis Bilangan",
                    "Sifat-sifat Bilangan",
                    "KPK, FPB dan Aplikasinya"
                ]
            },
            {
                id: "pm_3",
                title: "Aljabar Dasar",
                subtopics: [
                    "Operasi Aljabar Sederhana",
                    "Penyederhanaan, Faktorisasi, Distribusi Aljabar",
                    "Persamaan Aljabar",
                    "Pertidaksamaan Aljabar",
                    "Perbandingan",
                    "Konsep Perbandingan"
                ]
            },
            {
                id: "pm_4",
                title: "Akar, Pangkat, Logaritma",
                subtopics: [
                    "Akar dan Eksponen",
                    "Logaritma"
                ]
            },
            {
                id: "pm_5",
                title: "Himpunan, Fungsi dan Persamaan Garis",
                subtopics: [
                    "Himpunan",
                    "Persamaan Garis Lurus",
                    "Fungsi, Relasi, Komposisi, Invers",
                    "Persamaan dan Fungsi Kuadrat"
                ]
            },
            {
                id: "pm_6",
                title: "Sistem Persamaan",
                subtopics: [
                    "SPLDV/SPLTV",
                    "Persamaan Berbentuk Flowchart"
                ]
            },
            {
                id: "pm_7",
                title: "Geometri",
                subtopics: [
                    "Kesebangunan dan Bangun Datar Kompleks",
                    "Sudut dan Operasi Sudut",
                    "Sifat Bangun Datar dan Ruang",
                    "Trigonometri Dasar",
                    "Dimensi Tiga",
                    "Jarak Titik, Garis dan Bidang",
                    "Bangun Datar, Luas dan Keliling",
                    "Bangun Ruang, Luas dan Volume"
                ]
            },
            {
                id: "pm_8",
                title: "Statistika dan Peluang",
                subtopics: [
                    "Statistik Dasar dan Penyajian Data",
                    "Penyebaran Data/Tendensi Sentral",
                    "Peluang Dasar dan Pencacahan",
                    "Peluang Kejadian, Kombinasi, Permutasi"
                ]
            },
            {
                id: "pm_9",
                title: "Barisan dan Deret",
                subtopics: [
                    "Barisan-Deret Aritmatika",
                    "Barisan-Deret Geometri",
                    "Deret Tak Hingga"
                ]
            },
            {
                id: "pm_10",
                title: "Aritmatika Sosial",
                subtopics: [
                    "Bunga dan Diskon",
                    "Aritmatika Sosial"
                ]
            },
            {
                id: "pm_11",
                title: "Lanjutan (PM)",
                subtopics: [
                    "Matriks",
                    "Transformasi Geometri",
                    "Limit/Turunan Dasar"
                ]
            }
        ]
    },
    "Literasi dalam Bahasa Inggris": {
        icon: "fas fa-globe",
        color: "#EF4444",
        description: "Kemampuan memahami dan menggunakan bahasa Inggris",
        code: "LBE",
        topics: [
            {
                id: "lbe_1",
                title: "Reading Comprehension",
                subtopics: [
                    "Topic and Main Idea",
                    "Conclusion",
                    "Summary of Passage",
                    "Specific Information",
                    "Finding Detail Info",
                    "Purpose of the Text",
                    "Author's Tone/Attitude",
                    "Writer's motive"
                ]
            },
            {
                id: "lbe_2",
                title: "Vocabulary & Language Use",
                subtopics: [
                    "Synonym and Antonym",
                    "Word's meaning",
                    "Contextual Meaning",
                    "Reference and Inference"
                ]
            },
            {
                id: "lbe_3",
                title: "Text Analysis",
                subtopics: [
                    "Restating sentences/phrases",
                    "True/false statement",
                    "Detailing Facts",
                    "Comparing two texts",
                    "Text structure"
                ]
            }
        ]
    },
    "Literasi dalam Bahasa Indonesia": {
        icon: "fas fa-book-reader",
        color: "#06B6D4",
        description: "Kemampuan memahami dan menganalisis teks bacaan",
        code: "LBI",
        topics: [
            {
                id: "lbi_1",
                title: "Pemahaman Teks",
                subtopics: [
                    "Menentukan tema dan unsur teks",
                    "Struktur Teks",
                    "Makna Implisit dan Eksplisit",
                    "Mencari Info Relevan"
                ]
            },
            {
                id: "lbi_2",
                title: "Analisis Bacaan",
                subtopics: [
                    "Menyimpulkan Isi bacaan",
                    "Unsur Teks Eksplanatif",
                    "Tema dan Nilai Teks Sastra"
                ]
            },
            {
                id: "lbi_3",
                title: "Evaluasi Informasi",
                subtopics: [
                    "Menilai dan Menghubungkan Informasi"
                ]
            }
        ]
    }
};

// Export untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = silabusData;
}
