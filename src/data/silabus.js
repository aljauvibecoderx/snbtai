// Sample data structure for silabus.js
export const silabusData = [
  // Penalaran Umum
  {
    id: "pu_001",
    subject: "penalaran_umum",
    topic: "Logika Matematika",
    subtopic: "Proposisi dan Operasi Logika"
  },
  {
    id: "pu_002", 
    subject: "penalaran_umum",
    topic: "Logika Matematika",
    subtopic: "Tautologi dan Kontradiksi"
  },
  {
    id: "pu_003",
    subject: "penalaran_umum", 
    topic: "Analisis Kuantitatif",
    subtopic: "Perbandingan dan Proporsi"
  },
  {
    id: "pu_004",
    subject: "penalaran_umum",
    topic: "Analisis Kuantitatif", 
    subtopic: "Interpretasi Data dan Grafik"
  },

  // Pengetahuan dan Pemahaman Umum
  {
    id: "ppu_001",
    subject: "pengetahuan_pemahaman_umum",
    topic: "Sejarah Indonesia",
    subtopic: "Masa Pra-Aksara hingga Hindu-Buddha"
  },
  {
    id: "ppu_002",
    subject: "pengetahuan_pemahaman_umum", 
    topic: "Sejarah Indonesia",
    subtopic: "Masa Islam dan Kolonial"
  },
  {
    id: "ppu_003",
    subject: "pengetahuan_pemahaman_umum",
    topic: "Geografi Indonesia", 
    subtopic: "Kondisi Fisik dan Iklim"
  },

  // Pemahaman Bacaan dan Menulis
  {
    id: "pbm_001",
    subject: "pemahaman_bacaan_menulis",
    topic: "Struktur Teks",
    subtopic: "Ide Pokok dan Ide Pendukung"
  },
  {
    id: "pbm_002", 
    subject: "pemahaman_bacaan_menulis",
    topic: "Struktur Teks",
    subtopic: "Kohesi dan Koherensi"
  },
  {
    id: "pbm_003",
    subject: "pemahaman_bacaan_menulis",
    topic: "Kaidah Kebahasaan",
    subtopic: "Ejaan dan Tanda Baca"
  },

  // Pengetahuan Kuantitatif
  {
    id: "pk_001",
    subject: "pengetahuan_kuantitatif", 
    topic: "Aljabar",
    subtopic: "Persamaan dan Pertidaksamaan Linear"
  },
  {
    id: "pk_002",
    subject: "pengetahuan_kuantitatif",
    topic: "Aljabar", 
    subtopic: "Sistem Persamaan Linear"
  },
  {
    id: "pk_003",
    subject: "pengetahuan_kuantitatif",
    topic: "Geometri",
    subtopic: "Bangun Datar dan Ruang"
  },
  {
    id: "pk_004",
    subject: "pengetahuan_kuantitatif",
    topic: "Statistika",
    subtopic: "Ukuran Pemusatan Data"
  },

  // Literasi Bahasa Indonesia
  {
    id: "lbi_001",
    subject: "literasi_bahasa_indonesia",
    topic: "Pemahaman Bacaan",
    subtopic: "Teks Eksposisi"
  },
  {
    id: "lbi_002",
    subject: "literasi_bahasa_indonesia", 
    topic: "Pemahaman Bacaan",
    subtopic: "Teks Argumentasi"
  },
  {
    id: "lbi_003",
    subject: "literasi_bahasa_indonesia",
    topic: "Kebahasaan",
    subtopic: "Makna Kata dan Istilah"
  },

  // Literasi Bahasa Inggris  
  {
    id: "lbing_001",
    subject: "literasi_bahasa_inggris",
    topic: "Reading Comprehension", 
    subtopic: "Main Ideas and Supporting Details"
  },
  {
    id: "lbing_002",
    subject: "literasi_bahasa_inggris",
    topic: "Reading Comprehension",
    subtopic: "Inference and Conclusion"
  },
  {
    id: "lbing_003", 
    subject: "literasi_bahasa_inggris",
    topic: "Vocabulary",
    subtopic: "Context Clues and Word Formation"
  },

  // Penalaran Matematika
  {
    id: "pm_001",
    subject: "penalaran_matematika",
    topic: "Fungsi dan Persamaan",
    subtopic: "Fungsi Linear dan Kuadrat"
  },
  {
    id: "pm_002",
    subject: "penalaran_matematika", 
    topic: "Fungsi dan Persamaan",
    subtopic: "Fungsi Eksponen dan Logaritma"
  },
  {
    id: "pm_003",
    subject: "penalaran_matematika",
    topic: "Geometri dan Trigonometri",
    subtopic: "Identitas Trigonometri"
  },
  {
    id: "pm_004",
    subject: "penalaran_matematika",
    topic: "Kombinatorika dan Peluang", 
    subtopic: "Permutasi dan Kombinasi"
  }
];

// Helper function to get subjects
export const getSubjects = () => {
  return [...new Set(silabusData.map(item => item.subject))];
};

// Helper function to get materials by subject
export const getMaterialsBySubject = (subject) => {
  return silabusData.filter(item => item.subject === subject);
};

// Helper function to get total materials count
export const getTotalMaterialsCount = () => {
  return silabusData.length;
};