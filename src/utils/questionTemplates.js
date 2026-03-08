// Question Pattern Templates - PERSIS dari questiontype.md

export const QUESTION_TEMPLATES = {
  // 1. PEMAHAMAN BACAAN & MENULIS (PBM)
  tps_pbm: {
    patterns: [
      { id: 'pbm_ejaan_1', pattern: 'Penulisan kata bercetak tebal pada teks tersebut yang benar terdapat pada kalimat...', level: [1, 2], type: 'ejaan' },
      { id: 'pbm_ejaan_2', pattern: 'Kesalahan penggunaan tanda baca tidak ditemukan dalam kalimat ....', level: [1, 2], type: 'ejaan' },
      { id: 'pbm_ejaan_3', pattern: 'Tanda baca manakah yang perlu ditambahkan agar kalimat tersebut lebih tepat?', level: [2], type: 'ejaan' },
      { id: 'pbm_ejaan_4', pattern: 'Perbaikan ejaan yang tepat dari teks di atas adalah...', level: [1, 2], type: 'ejaan' },
      { id: 'pbm_rumpang_1', pattern: 'Pernyataan yang paling tepat untuk melengkapi kalimat (3) adalah', level: [2, 3], type: 'rumpang' },
      { id: 'pbm_rumpang_2', pattern: 'Kata hubung yang paling tepat untuk melengkapi kalimat (7) adalah', level: [2, 3], type: 'rumpang' },
      { id: 'pbm_rumpang_3', pattern: 'Kata yang paling tepat untuk melengkapi [...] pada paragraf 2 adalah ...', level: [2, 3], type: 'rumpang' },
      { id: 'pbm_rumpang_4', pattern: 'Penambahan informasi untuk kalimat 5 teks di atas yang tepat adalah...', level: [3], type: 'rumpang' },
      { id: 'pbm_efektif_1', pattern: 'Kalimat (1) perlu disempurnakan dengan cara', level: [2, 3], type: 'efektivitas' },
      { id: 'pbm_efektif_2', pattern: 'Kalimat tidak efektif yang terdapat pada teks di atas adalah', level: [2, 3], type: 'efektivitas' },
      { id: 'pbm_efektif_3', pattern: 'Gabungan yang efektif dari kalimat satu dan dua teks tersebut ... adalah ...', level: [3], type: 'efektivitas' },
      { id: 'pbm_efektif_4', pattern: 'Penggunaan konjungsi (kata hubung) yang salah terdapat pada kalimat...', level: [2, 3], type: 'efektivitas' },
      { id: 'pbm_efektif_5', pattern: 'Agar lebih efektif dan tidak redundan, bentuk yang tepat dari kalimat tersebut adalah...', level: [3, 4], type: 'efektivitas' },
      { id: 'pbm_efektif_6', pattern: 'Kalimat tidak efektif karena tidak terpenuhinya unsur subjek yang jelas terdapat pada kalimat ...', level: [3], type: 'efektivitas' },
      { id: 'pbm_semantik_1', pattern: "Kata 'simbol' pada paragraf 1 memiliki makna yang sama dengan kata", level: [2, 3], type: 'semantik' },
      { id: 'pbm_semantik_2', pattern: "Lawan kata 'diperkenalkan' pada paragraf 2 adalah", level: [2], type: 'semantik' },
      { id: 'pbm_semantik_3', pattern: "Jika kata 'tekanan' pada kalimat tersebut diganti ... kata pengganti yang sesuai adalah", level: [2, 3], type: 'semantik' },
      { id: 'pbm_semantik_4', pattern: 'Kata itu pada kalimat 6 merujuk pada informasi...', level: [2, 3], type: 'semantik' },
      { id: 'pbm_semantik_5', pattern: 'Manakah inti kalimat dari pernyataan tersebut?', level: [3, 4], type: 'semantik' },
      { id: 'pbm_koherensi', pattern: 'Kalimat di bawah ini tepat diletakkan sesudah kalimat...', level: [3, 4], type: 'koherensi' }
    ]
  },

  // 2. PENGETAHUAN & PEMAHAMAN UMUM (PPU)
  tps_ppu: {
    patterns: [
      { id: 'ppu_makna_1', pattern: 'Makna imbuhan ber- dalam kata ... memiliki makna imbuhan yang sama dengan imbuhan ber- dalam kalimat ...', level: [2, 3], type: 'makna' },
      { id: 'ppu_makna_2', pattern: 'Konjungsi yang tepat untuk menghubungkan kalimat (2) dan (3) adalah ....', level: [2, 3], type: 'makna' },
      { id: 'ppu_makna_3', pattern: 'Kata ... yang paling cocok digunakan untuk mengisi [...] di kalimat itu?', level: [2, 3], type: 'makna' },
      { id: 'ppu_makna_4', pattern: 'Kata atau frasa yang memiliki makna lain terdapat pada kalimat....', level: [3], type: 'makna' },
      { id: 'ppu_makna_5', pattern: 'Kata pasien pada kalimat (10) memiliki kesamaan makna dengan kata', level: [2, 3], type: 'makna' },
      { id: 'ppu_makna_6', pattern: 'Frasa ... memiliki makna yang berasosiasi dengan kata', level: [3], type: 'makna' },
      { id: 'ppu_makna_7', pattern: 'Imbuhan ke-an pada kata ... bermakna sama dengan kalimat di bawah ini yaitu...', level: [3], type: 'makna' },
      { id: 'ppu_analisis_1', pattern: 'Masalah yang disampaikan dalam paragraf 1 adalah masalah yang sama dengan ....', level: [3, 4], type: 'analisis' },
      { id: 'ppu_analisis_2', pattern: 'Informasi berikut sesuai dengan apa yang disampaikan teks, kecuali ...', level: [2, 3], type: 'analisis' },
      { id: 'ppu_analisis_3', pattern: 'Pernyataan berikut yang sesuai dengan teks adalah', level: [2, 3], type: 'analisis' },
      { id: 'ppu_analisis_4', pattern: 'Penjelasan tersebut memiliki persamaan dengan', level: [3, 4], type: 'analisis' },
      { id: 'ppu_analisis_5', pattern: 'Gagasan utama yang dapat disimpulkan dari teks di atas adalah', level: [3, 4], type: 'analisis' },
      { id: 'ppu_ragam_1', pattern: 'Kata melainkan adalah ... (ragam baku/sastra/santai)', level: [2], type: 'ragam' },
      { id: 'ppu_ragam_2', pattern: 'Kalimat yang mengandung gaya bahasa personifikasi adalah', level: [3], type: 'ragam' },
      { id: 'ppu_ragam_3', pattern: 'Tujuan penggunaan kata dapat pada kalimat (4) adalah', level: [3], type: 'ragam' },
      { id: 'ppu_logika_1', pattern: 'Jika teks tersebut dilanjutkan, kemungkinan besar paragraf setelahnya tidak akan berfokus pada pembahasan tentang', level: [4, 5], type: 'logika' },
      { id: 'ppu_logika_2', pattern: 'Kalimat (8) dapat diungkapkan ulang melalui kalimat', level: [3, 4], type: 'logika' },
      { id: 'ppu_logika_3', pattern: 'Manakah bentuk kalimat yang memiliki pola yang sama dengan kalimat (2)?', level: [3, 4], type: 'logika' },
      { id: 'ppu_logika_4', pattern: 'Kalimat yang tidak logis dalam bacaan di atas adalah', level: [3, 4], type: 'logika' },
      { id: 'ppu_bahasa_buatan', pattern: 'Bagaimana mengatakan ... dengan Bahasa tersebut?', level: [2, 3], type: 'bahasa_buatan' }
    ]
  },

  // 3. PENALARAN UMUM (PU)
  tps_pu: {
    patterns: [
      { id: 'pu_simpulan_1', pattern: 'Berdasarkan text diatas, simpulan yang PALING MUNGKIN benar adalah?', level: [3, 4], type: 'simpulan' },
      { id: 'pu_simpulan_2', pattern: 'Berdasarkan paragraf diatas ... simpulan dibawah ini yang PALING MUNGKIN benar adalah', level: [3, 4], type: 'simpulan' },
      { id: 'pu_simpulan_3', pattern: 'Berdasarkan informasi tersebut, manakah simpulan yang PASTI BENAR?', level: [4, 5], type: 'simpulan' },
      { id: 'pu_simpulan_4', pattern: 'Berdasarkan informasi tersebut, manakah pernyataan berikut yang PASTI SALAH?', level: [4, 5], type: 'simpulan' },
      { id: 'pu_simpulan_5', pattern: 'Berdasarkan informasi itu, manakah simpulan yang PALING TEPAT?', level: [3, 4], type: 'simpulan' },
      { id: 'pu_argumen_1', pattern: 'Informasi tambahan manakah yang paling memperkuat argumen peneliti tersebut?', level: [4, 5], type: 'argumen' },
      { id: 'pu_argumen_2', pattern: 'Pernyataan manakah yang paling mungkin menjelaskan kedua fenomena tersebut secara bersamaan?', level: [4, 5], type: 'argumen' },
      { id: 'pu_kausalitas', pattern: 'Manakah yang PALING MUNGKIN menjadi penyebab utama penurunan pelanggan...?', level: [3, 4], type: 'kausalitas' },
      { id: 'pu_generalisasi', pattern: 'Berdasarkan observasi tersebut, manakah generalisasi yang PALING MUNGKIN BENAR tentang pola...', level: [4, 5], type: 'generalisasi' },
      { id: 'pu_prediksi', pattern: 'Apa yang PALING MUNGKIN terjadi jika Kota Sejahtera menerapkan kebijakan serupa?', level: [3, 4], type: 'prediksi' },
      { id: 'pu_data_1', pattern: 'Berapa persentase pertumbuhan produksi listrik ...?', level: [2, 3], type: 'data' },
      { id: 'pu_data_2', pattern: 'Di tahun mana jumlah orang yang diterima paling sedikit?', level: [2, 3], type: 'data' },
      { id: 'pu_data_3', pattern: 'Toko dengan keuntungan TERBESAR adalah ...', level: [2, 3], type: 'data' },
      { id: 'pu_data_4', pattern: 'Nilai yang PALING MENDEKATI ... adalah', level: [3, 4], type: 'data' }
    ]
  },

  // 4. PENALARAN MATEMATIKA (PM)
  pm: {
    patterns: [
      { id: 'pm_optimasi_1', pattern: 'Berapa maksimal box yang bisa dibawa Anwar?', level: [3, 4], type: 'optimasi' },
      { id: 'pm_optimasi_2', pattern: 'Berapa jarak maksimum kapal terhadap pelabuhan...', level: [3, 4], type: 'optimasi' },
      { id: 'pm_optimasi_3', pattern: 'Berapa alokasi ... agar target terpenuhi dengan biaya seminimal mungkin?', level: [4, 5], type: 'optimasi' },
      { id: 'pm_kondisional_1', pattern: 'Berapa detik waktu yang tersisa agar Anwar bisa menyelamatkan kapalnya?', level: [3, 4], type: 'kondisional' },
      { id: 'pm_kondisional_2', pattern: 'Berapa panjang tali tersisa dengan pertimbangan...', level: [3, 4], type: 'kondisional' },
      { id: 'pm_kondisional_3', pattern: 'Tentukan jarak kapal dari pelabuhan ketika tali kapal maksimum!', level: [3, 4], type: 'kondisional' },
      { id: 'pm_pola_1', pattern: 'Jika Kn menyatakan bilangan pada petak pertama baris ke-n, maka Kn=...', level: [3, 4, 5], type: 'pola' },
      { id: 'pm_pola_2', pattern: 'Hasil bagi bilangan pada petak ... dengan bilangan pada petak ... adalah...', level: [3, 4], type: 'pola' },
      { id: 'pm_pola_3', pattern: 'Jika f adalah fungsi yang menyatakan lahan perkebunan tersebut ... maka...', level: [3, 4], type: 'pola' },
      { id: 'pm_pernyataan', pattern: 'Tentukan nilai kebenaran dari pernyataan-pernyataan di bawah ini!', level: [3, 4], type: 'pernyataan' },
      { id: 'pm_cerita_1', pattern: 'Maka, luas lahan perkebunan beserta parit yang ada di dalamnya adalah ... m²', level: [2, 3], type: 'cerita' },
      { id: 'pm_cerita_2', pattern: 'Pakan ayam bertahan lebih lama... hari dari pada yang ia rencanakan.', level: [2, 3], type: 'cerita' }
    ]
  },

  // 5. LITERASI BAHASA INGGRIS (LBE)
  lit_ing: {
    patterns: [
      { id: 'lbe_thread', pattern: 'What can be inferred about [Author]\'s stance on [Topic]?', level: [2], type: 'thread' },
      { id: 'lbe_detail_1', pattern: 'Which of the following is NOT the reason why...', level: [2, 3], type: 'detail' },
      { id: 'lbe_detail_2', pattern: 'Which one of these following statements is false about...', level: [2, 3], type: 'detail' },
      { id: 'lbe_ide_1', pattern: 'Which of the following is the best main idea of Text 1?', level: [3, 4], type: 'main_idea' },
      { id: 'lbe_ide_2', pattern: 'What is the most suitable title for the passage above', level: [3, 4], type: 'main_idea' },
      { id: 'lbe_ide_3', pattern: 'Which of the following best summarizes the passage above?', level: [3, 4], type: 'main_idea' },
      { id: 'lbe_ide_4', pattern: 'What is the main idea of paragraph 3?', level: [3, 4], type: 'main_idea' },
      { id: 'lbe_sinonim_1', pattern: 'The phrase ... is closest in meaning to ...', level: [2, 3], type: 'vocabulary' },
      { id: 'lbe_sinonim_2', pattern: "The word '...' has the closest meaning to which of the following?", level: [2, 3], type: 'vocabulary' },
      { id: 'lbe_sinonim_3', pattern: 'The underlined sentence is best restated...', level: [3, 4], type: 'vocabulary' },
      { id: 'lbe_sinonim_4', pattern: 'The word ... can be replaced with...', level: [2, 3], type: 'vocabulary' },
      { id: 'lbe_sinonim_5', pattern: 'Which of the following best restates the statement...', level: [3, 4], type: 'vocabulary' },
      { id: 'lbe_inference_1', pattern: 'According to Text 2, the purpose of providing ... is to', level: [3, 4], type: 'inference' },
      { id: 'lbe_inference_2', pattern: 'Who implies that forced military service risks...', level: [4, 5], type: 'inference' },
      { id: 'lbe_inference_3', pattern: 'Which tone best describes the author...', level: [4, 5], type: 'inference' },
      { id: 'lbe_inference_4', pattern: 'What could possibly motivate the writer in writing the passage?', level: [4, 5], type: 'inference' },
      { id: 'lbe_inference_5', pattern: 'What can we infer from the passage?', level: [3, 4, 5], type: 'inference' },
      { id: 'lbe_struktur', pattern: 'Where would it best fit into which sentence in paragraph 2?', level: [3, 4], type: 'struktur' }
    ]
  },

  // 6. PENGETAHUAN KUANTITATIF (PK)
  tps_pk: {
    patterns: [
      { id: 'pk_geometri_1', pattern: 'Maka, jarak P ke bidang BCGF adalah....', level: [3, 4, 5], type: 'geometri' },
      { id: 'pk_geometri_2', pattern: 'Penjumlahan dari ordinat masing-masing titik ujung pada bangun datar tersebut adalah...', level: [3, 4], type: 'geometri' },
      { id: 'pk_statistika_1', pattern: 'Banyaknya pernyataan yang benar adalah sebanyak....', level: [3, 4], type: 'statistika' },
      { id: 'pk_statistika_2', pattern: 'Banyaknya nilai p+q yang mungkin adalah...', level: [3, 4], type: 'statistika' },
      { id: 'pk_hubungan_1', pattern: 'Tentukan hubungan kuantitas P dan Q berikut.', level: [2, 3, 4], type: 'hubungan' },
      { id: 'pk_hubungan_2', pattern: 'Berdasarkan informasi yang diberikan, maka hubungan antara kuantitas P dan Q berikut yang benar?', level: [2, 3, 4], type: 'hubungan' },
      { id: 'pk_kecukupan_1', pattern: 'Putuskan apakah pernyataan (1) dan (2) berikut cukup untuk menjawab pertanyaan tersebut.', level: [3, 4, 5], type: 'kecukupan' },
      { id: 'pk_kecukupan_2', pattern: 'Apakah perkalian dari p, q selalu ganjil? Putuskan apakah pernyataan (1) dan (2) berikut cukup...', level: [4, 5], type: 'kecukupan' },
      { id: 'pk_analisis_1', pattern: 'Berapa banyak pernyataan di atas yang benar?', level: [3, 4, 5], type: 'analisis_pernyataan' },
      { id: 'pk_analisis_2', pattern: 'Pernyataan mana saja yang benar?', level: [3, 4, 5], type: 'analisis_pernyataan' },
      { id: 'pk_bilangan_1', pattern: 'Nilai A+B yang mungkin adalah....', level: [2, 3], type: 'bilangan' },
      { id: 'pk_bilangan_2', pattern: 'Maka, pernyataan berikut yang benar adalah', level: [3, 4], type: 'bilangan' },
      { id: 'pk_bilangan_3', pattern: 'Sisa uang yang Turis itu miliki ... kira-kira ada di rentang.... Ringgit', level: [2, 3], type: 'bilangan' },
      { id: 'pk_bilangan_4', pattern: 'Jumlahan dari elemen-elemen himpunan A, B, C, dan D adalah', level: [3, 4], type: 'bilangan' },
      { id: 'pk_bilangan_5', pattern: 'Di antara pilihan berikut, yang merupakan faktor dari ... adalah...', level: [2, 3], type: 'bilangan' },
      { id: 'pk_bilangan_6', pattern: 'Jumlah terkecil seluruh bola di kotak tersebut yang memungkinkan adalah?', level: [3, 4], type: 'bilangan' }
    ]
  },

  // 7. LITERASI BAHASA INDONESIA (LBI)
  lit_ind: {
    patterns: [
      { id: 'lbi_analisis_1', pattern: 'Pernyataan yang TIDAK sesuai dengan bacaan di atas adalah ....', level: [2, 3], type: 'analisis' },
      { id: 'lbi_analisis_2', pattern: 'Informasi yang tidak dijelaskan oleh teks adalah ...', level: [2, 3], type: 'analisis' },
      { id: 'lbi_analisis_3', pattern: 'Berdasarkan teks, mengapa [Subjek] melakukan [Tindakan]?', level: [3, 4], type: 'analisis' },
      { id: 'lbi_analisis_4', pattern: 'Apa yang terjadi tepat setelah [Peristiwa X]?', level: [2, 3], type: 'analisis' },
      { id: 'lbi_analisis_5', pattern: 'Manakah pernyataan yang menunjukkan perbedaan kondisi antara [X] dan [Y]?', level: [3, 4], type: 'analisis' },
      { id: 'lbi_makna_1', pattern: "Makna dari '[Kata/Frasa]' berdasarkan bacaan adalah ....", level: [2, 3], type: 'semantik' },
      { id: 'lbi_makna_2', pattern: "Kata '[Kata]' pada kalimat (x) bermakna ....", level: [2, 3], type: 'semantik' },
      { id: 'lbi_makna_3', pattern: "Maksud dari ungkapan '[Ungkapan]' adalah ....", level: [3, 4], type: 'semantik' },
      { id: 'lbi_makna_4', pattern: "Pernyataan '...' dalam paragraf X merujuk pada ....", level: [3, 4], type: 'semantik' },
      { id: 'lbi_kausalitas_1', pattern: 'Mengapa [Fenomena A] dapat menyebabkan [Fenomena B]?', level: [3, 4], type: 'kausalitas' },
      { id: 'lbi_kausalitas_2', pattern: 'Berdasarkan teks di atas, mengapa [Pihak A] mempersoalkan kasus [X]?', level: [3, 4], type: 'kausalitas' },
      { id: 'lbi_implikasi', pattern: 'Apa langkah yang dapat dilakukan pemerintah sebagai langkah mengantisipasi [Masalah]?', level: [4, 5], type: 'implikasi' }
    ]
  }
};

export function selectTemplate(subtestId, complexityLevel) {
  const templates = QUESTION_TEMPLATES[subtestId];
  if (!templates) return null;
  
  // Level 0 (Adaptive): Return null to let AI choose based on context
  if (complexityLevel === 0) return null;
  
  const suitablePatterns = templates.patterns.filter(p => p.level.includes(complexityLevel));
  if (suitablePatterns.length === 0) return templates.patterns[Math.floor(Math.random() * templates.patterns.length)];
  return suitablePatterns[Math.floor(Math.random() * suitablePatterns.length)];
}

export function getAllPatterns(subtestId) {
  const templates = QUESTION_TEMPLATES[subtestId];
  return templates ? templates.patterns : [];
}
