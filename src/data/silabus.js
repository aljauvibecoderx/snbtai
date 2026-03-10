// SNBT Silabus Data - Complete Integration with Progress Tracker
// Generated from silabus.js with 147 subtopics across 7 subjects

const generateMaterialsFromSilabus = () => {
  const materials = [];
  let materialId = 1;

  // Penalaran Umum (PU)
  const puTopics = [
    { title: "Logika Dasar", subtopics: ["Logika Matematika (Dasar)", "Proposisi, Kalimat Terbuka/Tertutup", "Logika Kuantor", "Operasi Logika"] },
    { title: "Penalaran Deduktif", subtopics: ["Silogisme", "Modus Ponens", "Modus Tollens", "Memperkuat/Memperlemah Argumen", "Evaluasi Bukti", "Simpulan"] },
    { title: "Penalaran Induktif", subtopics: ["Generalisasi", "Analogi", "Hubungan Kausalitas"] },
    { title: "Penalaran Kuantitatif", subtopics: ["Teori dan Jenis Bilangan", "Sifat-sifat Bilangan", "Statistik Dasar", "Grafik/Tabel", "Soal Cerita", "Peluang Dasar dan Pencacahan", "Barisan dan Deret", "Persentase", "Diskon dan Bunga Bank"] }
  ];

  puTopics.forEach(topic => {
    topic.subtopics.forEach(subtopic => {
      materials.push({
        id: `pu_${String(materialId).padStart(3, '0')}`,
        subject: "penalaran_umum",
        topic: topic.title,
        subtopic: subtopic
      });
      materialId++;
    });
  });

  // Pemahaman Bacaan & Menulis (PBM)
  const pbmTopics = [
    { title: "Ejaan", subtopics: ["Huruf Kapital dan Ejaan (EYD V)", "Tanda Baca", "Makna Imbuhan", "Konjungsi dan Partikel"] },
    { title: "Preposisi", subtopics: ["Kata hubung/Konjungsi", "Partikel dan Bentuk Terikat"] },
    { title: "Pembentukan Kata", subtopics: ["Bentuk/Jenis Kata", "Kata Baku dan Tidak Baku"] },
    { title: "Frasa dan Klausa", subtopics: ["Frasa/Kelompok Kata", "Klausa"] },
    { title: "Struktur Kalimat", subtopics: ["Struktur Kalimat/Tata Kalimat", "Jenis Kalimat", "Hubungan Antar Kalimat"] },
    { title: "Kalimat Efektif", subtopics: ["Kalimat Efektif/Tidak Efektif", "Kalimat Sumbang"] },
    { title: "Paragraf", subtopics: ["Kelogisan Kalimat", "Hubungan Antar Kalimat", "Kepaduan paragraf", "Kalimat Utama dalam Teks"] },
    { title: "Bacaan", subtopics: ["Tema dan Topik", "Gagasan/Ide Pokok", "Ungkapan", "Bahasa Panda", "Bahasa Hipotesis"] }
  ];

  pbmTopics.forEach(topic => {
    topic.subtopics.forEach(subtopic => {
      materials.push({
        id: `pbm_${String(materialId).padStart(3, '0')}`,
        subject: "pemahaman_bacaan_menulis",
        topic: topic.title,
        subtopic: subtopic
      });
      materialId++;
    });
  });

  // Pengetahuan & Pemahaman Umum (PPU)
  const ppuTopics = [
    { title: "Makna Kata (PPU)", subtopics: ["Penggunaan Istilah/Kata", "Perubahan Makna Kata", "Makna Bertingkat/Hierarkis", "Frasa dan Klausa", "Kata Berpasangan"] },
    { title: "Aplikasi Kalimat (PPU)", subtopics: ["Semantik/Tata Makna", "Kalimat Majemuk", "Transformasi Kalimat", "Inti Kalimat"] }
  ];

  ppuTopics.forEach(topic => {
    topic.subtopics.forEach(subtopic => {
      materials.push({
        id: `ppu_${String(materialId).padStart(3, '0')}`,
        subject: "pengetahuan_pemahaman_umum",
        topic: topic.title,
        subtopic: subtopic
      });
      materialId++;
    });
  });

  // Pengetahuan Kuantitatif (PK)
  const pkTopics = [
    { title: "Operasi Matematika Dasar", subtopics: ["Operasi MTK Dasar (PEMDAS)", "Operasi Pecahan, Desimal, Persentase", "Sistem Koordinat"] },
    { title: "Bilangan", subtopics: ["Teori dan Jenis Bilangan", "Sifat-sifat Bilangan", "KPK, FPB dan Aplikasinya"] },
    { title: "Aljabar Dasar", subtopics: ["Operasi Aljabar Sederhana", "Penyederhanaan, Faktorisasi, Distribusi Aljabar", "Persamaan Aljabar", "Pertidaksamaan Aljabar", "Perbandingan", "Konsep Perbandingan"] },
    { title: "Akar, Pangkat, Logaritma", subtopics: ["Akar dan Eksponen", "Logaritma"] },
    { title: "Himpunan, Fungsi dan Persamaan Garis", subtopics: ["Himpunan", "Persamaan Garis Lurus", "Fungsi, Relasi, Komposisi, Invers", "Persamaan dan Fungsi Kuadrat"] },
    { title: "Sistem Persamaan", subtopics: ["SPLDV/SPLTV", "Persamaan Berbentuk Flowchart"] },
    { title: "Geometri", subtopics: ["Kesebangunan dan Bangun Datar Kompleks", "Sudut dan Operasi Sudut", "Sifat Bangun Datar dan Ruang", "Trigonometri Dasar", "Dimensi Tiga", "Jarak Titik, Garis dan Bidang", "Bangun Datar, Luas dan Keliling", "Bangun Ruang, Luas dan Volume"] },
    { title: "Statistika dan Peluang", subtopics: ["Statistik Dasar dan Penyajian Data", "Penyebaran Data/Tendensi Sentral", "Peluang Dasar dan Pencacahan", "Peluang Kejadian, Kombinasi, Permutasi"] },
    { title: "Barisan dan Deret", subtopics: ["Barisan-Deret Aritmatika", "Barisan-Deret Geometri", "Deret Tak Hingga"] },
    { title: "Aritmatika Sosial", subtopics: ["Bunga dan Diskon", "Aritmatika Sosial"] },
    { title: "Lanjutan (PK)", subtopics: ["Matriks", "Transformasi Geometri", "Limit/Turunan Dasar"] }
  ];

  pkTopics.forEach(topic => {
    topic.subtopics.forEach(subtopic => {
      materials.push({
        id: `pk_${String(materialId).padStart(3, '0')}`,
        subject: "pengetahuan_kuantitatif",
        topic: topic.title,
        subtopic: subtopic
      });
      materialId++;
    });
  });

  // Penalaran Matematika (PM)
  const pmTopics = [
    { title: "Operasi Matematika Dasar", subtopics: ["Operasi MTK Dasar (PEMDAS)", "Operasi Pecahan, Desimal, Persentase", "Sistem Koordinat"] },
    { title: "Bilangan", subtopics: ["Teori dan Jenis Bilangan", "Sifat-sifat Bilangan", "KPK, FPB dan Aplikasinya"] },
    { title: "Aljabar Dasar", subtopics: ["Operasi Aljabar Sederhana", "Penyederhanaan, Faktorisasi, Distribusi Aljabar", "Persamaan Aljabar", "Pertidaksamaan Aljabar", "Perbandingan", "Konsep Perbandingan"] },
    { title: "Akar, Pangkat, Logaritma", subtopics: ["Akar dan Eksponen", "Logaritma"] },
    { title: "Himpunan, Fungsi dan Persamaan Garis", subtopics: ["Himpunan", "Persamaan Garis Lurus", "Fungsi, Relasi, Komposisi, Invers", "Persamaan dan Fungsi Kuadrat"] },
    { title: "Sistem Persamaan", subtopics: ["SPLDV/SPLTV", "Persamaan Berbentuk Flowchart"] },
    { title: "Geometri", subtopics: ["Kesebangunan dan Bangun Datar Kompleks", "Sudut dan Operasi Sudut", "Sifat Bangun Datar dan Ruang", "Trigonometri Dasar", "Dimensi Tiga", "Jarak Titik, Garis dan Bidang", "Bangun Datar, Luas dan Keliling", "Bangun Ruang, Luas dan Volume"] },
    { title: "Statistika dan Peluang", subtopics: ["Statistik Dasar dan Penyajian Data", "Penyebaran Data/Tendensi Sentral", "Peluang Dasar dan Pencacahan", "Peluang Kejadian, Kombinasi, Permutasi"] },
    { title: "Barisan dan Deret", subtopics: ["Barisan-Deret Aritmatika", "Barisan-Deret Geometri", "Deret Tak Hingga"] },
    { title: "Aritmatika Sosial", subtopics: ["Bunga dan Diskon", "Aritmatika Sosial"] },
    { title: "Lanjutan (PM)", subtopics: ["Matriks", "Transformasi Geometri", "Limit/Turunan Dasar"] }
  ];

  pmTopics.forEach(topic => {
    topic.subtopics.forEach(subtopic => {
      materials.push({
        id: `pm_${String(materialId).padStart(3, '0')}`,
        subject: "penalaran_matematika",
        topic: topic.title,
        subtopic: subtopic
      });
      materialId++;
    });
  });

  // Literasi dalam Bahasa Inggris (LBE)
  const lbeTopics = [
    { title: "Reading Comprehension", subtopics: ["Topic and Main Idea", "Conclusion", "Summary of Passage", "Specific Information", "Finding Detail Info", "Purpose of the Text", "Author's Tone/Attitude", "Writer's motive"] },
    { title: "Vocabulary & Language Use", subtopics: ["Synonym and Antonym", "Word's meaning", "Contextual Meaning", "Reference and Inference"] },
    { title: "Text Analysis", subtopics: ["Restating sentences/phrases", "True/false statement", "Detailing Facts", "Comparing two texts", "Text structure"] }
  ];

  lbeTopics.forEach(topic => {
    topic.subtopics.forEach(subtopic => {
      materials.push({
        id: `lbe_${String(materialId).padStart(3, '0')}`,
        subject: "literasi_bahasa_inggris",
        topic: topic.title,
        subtopic: subtopic
      });
      materialId++;
    });
  });

  // Literasi dalam Bahasa Indonesia (LBI)
  const lbiTopics = [
    { title: "Pemahaman Teks", subtopics: ["Menentukan tema dan unsur teks", "Struktur Teks", "Makna Implisit dan Eksplisit", "Mencari Info Relevan"] },
    { title: "Analisis Bacaan", subtopics: ["Menyimpulkan Isi bacaan", "Unsur Teks Eksplanatif", "Tema dan Nilai Teks Sastra"] },
    { title: "Evaluasi Informasi", subtopics: ["Menilai dan Menghubungkan Informasi"] }
  ];

  lbiTopics.forEach(topic => {
    topic.subtopics.forEach(subtopic => {
      materials.push({
        id: `lbi_${String(materialId).padStart(3, '0')}`,
        subject: "literasi_bahasa_indonesia",
        topic: topic.title,
        subtopic: subtopic
      });
      materialId++;
    });
  });

  return materials;
};

export const silabusData = generateMaterialsFromSilabus();

// Subject metadata for UI display
export const subjectMetadata = {
  "penalaran_umum": {
    name: "Penalaran Umum",
    code: "PU",
    icon: "fas fa-brain",
    color: "#3B82F6",
    description: "Kemampuan berpikir logis dan analitis"
  },
  "pemahaman_bacaan_menulis": {
    name: "Pemahaman Bacaan & Menulis",
    code: "PBM",
    icon: "fas fa-book",
    color: "#F59E0B",
    description: "Kemampuan memahami dan menggunakan bahasa Indonesia"
  },
  "pengetahuan_pemahaman_umum": {
    name: "Pengetahuan & Pemahaman Umum",
    code: "PPU",
    icon: "fas fa-lightbulb",
    color: "#8B5CF6",
    description: "Pengetahuan faktual dan pemahaman konsep umum"
  },
  "pengetahuan_kuantitatif": {
    name: "Pengetahuan Kuantitatif",
    code: "PK",
    icon: "fas fa-calculator",
    color: "#10B981",
    description: "Kemampuan matematika dan numerik"
  },
  "penalaran_matematika": {
    name: "Penalaran Matematika",
    code: "PM",
    icon: "fas fa-square-root-alt",
    color: "#EC4899",
    description: "Penerapan konsep matematika dalam pemecahan masalah"
  },
  "literasi_bahasa_inggris": {
    name: "Literasi dalam Bahasa Inggris",
    code: "LBE",
    icon: "fas fa-globe",
    color: "#EF4444",
    description: "Kemampuan memahami dan menggunakan bahasa Inggris"
  },
  "literasi_bahasa_indonesia": {
    name: "Literasi dalam Bahasa Indonesia",
    code: "LBI",
    icon: "fas fa-book-reader",
    color: "#06B6D4",
    description: "Kemampuan memahami dan menganalisis teks bacaan"
  }
};

// Helper functions
export const getSubjects = () => {
  return [...new Set(silabusData.map(item => item.subject))];
};

export const getMaterialsBySubject = (subject) => {
  return silabusData.filter(item => item.subject === subject);
};

export const getTotalMaterialsCount = () => {
  return silabusData.length;
};

export const getSubjectStats = () => {
  const stats = {};
  getSubjects().forEach(subject => {
    const materials = getMaterialsBySubject(subject);
    stats[subject] = {
      ...subjectMetadata[subject],
      totalMaterials: materials.length,
      topics: [...new Set(materials.map(m => m.topic))]
    };
  });
  return stats;
};