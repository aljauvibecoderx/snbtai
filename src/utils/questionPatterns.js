/**
 * BANK POLA SOAL SNBT 2025 - GENERALIZED TEMPLATES
 * 
 * File: src/utils/questionPatterns.js
 * Updated: 2026-03-12
 * Reference: Fixed.md, questiontype.md, SNBT 2025 PDF Analysis
 * 
 * This file contains generalized question patterns extracted from SNBT 2025 analysis.
 * Each pattern is reusable across multiple contexts.
 */

export const QUESTION_PATTERNS = {
  // ============================================================================
  // 1. PENALARAN UMUM (PU) - 14 Pola
  // ============================================================================
  tps_pu: [
    {
      id: 'pu_inference_direct',
      pattern: 'Inferensi langsung dari teks pendek',
      level: [1, 2],
      type: 'text',
      template: {
        stimulus: '{{context}}',
        text: 'Berdasarkan informasi tersebut, manakah simpulan yang PASTI BENAR?',
        options: [
          '{{correct_inference}}',
          '{{plausible_but_wrong}}',
          '{{contradicts_text}}',
          '{{irrelevant}}',
          '{{extreme_statement}}'
        ]
      },
      contextVariations: ['FENOMENA_SOSIAL', 'KEGIATAN_SEHARI_HARI', 'INFORMASI_FACTUAL'],
      konsep: 'Pemahaman literal, identifikasi fakta eksplisit'
    },
    {
      id: 'pu_inference_likely',
      pattern: 'Inferensi paling mungkin benar',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{complex_text}}',
        text: 'Berdasarkan paragraf di atas, simpulan di bawah ini yang PALING MUNGKIN benar adalah...',
        options: [
          '{{most_likely_inference}}',
          '{{possible_but_less_likely}}',
          '{{contradicts_evidence}}',
          '{{not_supported_by_text}}',
          '{{too_extreme}}'
        ]
      },
      contextVariations: ['PENELITIAN', 'OBSERVASI', 'STUDI_KASUS'],
      konsep: 'Inferensi berlapis, eliminasi logis'
    },
    {
      id: 'pu_causation_single',
      pattern: 'Hubungan sebab-akibat tunggal',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{cause_statement}} menyebabkan {{effect_statement}}',
        text: 'Manakah yang PALING MUNGKIN menjadi penyebab {{phenomenon}}?',
        options: [
          '{{most_likely_cause}}',
          '{{possible_but_unlikely}}',
          '{{correlation_not_causation}}',
          '{{reverse_causation}}',
          '{{irrelevant_factor}}'
        ]
      },
      contextVariations: ['MASALAH_LINGKUNGAN', 'FENOMENA_EKONOMI', 'KEJADIAN_SEHARI_HARI'],
      konsep: 'Logika kausalitas, inferensi satu langkah'
    },
    {
      id: 'pu_argument_strength',
      pattern: 'Memperkuat/melemahkan argumen',
      level: [4, 5],
      type: 'text',
      template: {
        stimulus: '{{argument_A}} menyatakan {{claim}}. {{argument_B}} menyatakan {{response}}',
        text: 'Informasi tambahan manakah yang paling {{strengthen_or_weaken}} argumen {{party}}?',
        options: [
          '{{strongest_support}}',
          '{{weak_support}}',
          '{{irrelevant_to_argument}}',
          '{{slightly_weakens}}',
          '{{strongly_undermines}}'
        ]
      },
      contextVariations: ['DEBAT_PUBLIK', 'PENELITIAN_ILMIAH', 'KEBIJAKAN'],
      konsep: 'Evaluasi bukti, validitas argumen'
    },
    {
      id: 'pu_data_interpretation',
      pattern: 'Interpretasi data (tabel/grafik)',
      level: [2, 3],
      type: 'table',
      template: {
        stimulus: '{{data_statistic}}',
        representation: {
          type: '{{representation_type}}',
          data: '{{data_content}}'
        },
        text: '{{quantitative_question}} berdasarkan data tersebut?',
        options: '{{numeric_options}}'
      },
      contextVariations: ['DATA_EKONOMI', 'STATISTIK_PENDUDUK', 'DATA_PRODUKSI'],
      konsep: 'Literasi data, perbandingan nilai'
    },
    {
      id: 'pu_generalization',
      pattern: 'Generalisasi dari observasi',
      level: [4, 5],
      type: 'text',
      template: {
        stimulus: '{{observation_data}}',
        text: 'Berdasarkan observasi tersebut, manakah generalisasi yang PALING MUNGKIN BENAR tentang pola {{pattern_type}}?',
        options: [
          '{{valid_generalization}}',
          '{{hasty_generalization}}',
          '{{too_broad}}',
          '{{too_narrow}}',
          '{{contradicts_data}}'
        ]
      },
      contextVariations: ['POLA_SOSIAL', 'TREN_EKONOMI', 'FENOMENA_ALAM'],
      konsep: 'Induksi, generalisasi logis'
    },
    {
      id: 'pu_prediction',
      pattern: 'Prediksi berdasarkan pola',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{scenario_description}}',
        text: 'Apa yang PALING MUNGKIN terjadi jika {{condition}} diterapkan?',
        options: [
          '{{most_likely_outcome}}',
          '{{possible_outcome}}',
          '{{unlikely_outcome}}',
          '{{opposite_outcome}}',
          '{{irrelevant_outcome}}'
        ]
      },
      contextVariations: ['KEBIJAKAN_PUBLIK', 'EKSPERIMEN', 'SITUASI_HIPOTETIS'],
      konsep: 'Prediksi logis, proyeksi'
    },
    {
      id: 'pu_inference_negative',
      pattern: 'Menentukan pernyataan yang PASTI SALAH',
      level: [4, 5],
      type: 'text',
      template: {
        stimulus: '{{information_text}}',
        text: 'Berdasarkan informasi tersebut, manakah pernyataan berikut yang PASTI SALAH?',
        options: [
          '{{definitely_false}}',
          '{{possibly_true}}',
          '{{cannot_be_determined}}',
          '{{partially_true}}',
          '{{misleading}}'
        ]
      },
      contextVariations: ['TEKS_ARGUMENTATIF', 'DATA_KONTRADIKTIF', 'LOGIKA_FORMAL'],
      konsep: 'Negasi, identifikasi kontradiksi'
    },
    {
      id: 'pu_data_trend',
      pattern: 'Analisis tren data',
      level: [2, 3],
      type: 'chart',
      template: {
        stimulus: '{{data_description}}',
        representation: {
          type: 'chart',
          data: '{{chart_data}}'
        },
        text: '{{trend_question}}',
        options: '{{trend_options}}'
      },
      contextVariations: ['DATA_TIME_SERIES', 'PERBANDINGAN_KATEGORI', 'DISTRIBUSI'],
      konsep: 'Analisis tren, interpretasi grafik'
    },
    {
      id: 'pu_comparison',
      pattern: 'Perbandingan kuantitas',
      level: [2, 3],
      type: 'table',
      template: {
        stimulus: '{{comparison_context}}',
        representation: {
          type: 'table',
          data: '{{comparison_table}}'
        },
        text: '{{comparison_question}}',
        options: '{{comparison_options}}'
      },
      contextVariations: ['PERBANDINGAN_PRODUKSI', 'STATISTIK_KOMPARATIF', 'RANKING'],
      konsep: 'Perbandingan nilai, ranking'
    },
    {
      id: 'pu_approximation',
      pattern: 'Nilai yang paling mendekati',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{data_with_numbers}}',
        text: 'Nilai yang PALING MENDEKATI {{target_value}} adalah',
        options: '{{approximate_options}}'
      },
      contextVariations: ['ESTIMASI', 'PERHITUNGAN_CEPAT', 'PEMBULATAN'],
      konsep: 'Estimasi, aproksimasi'
    },
    {
      id: 'pu_explanation',
      pattern: 'Menjelaskan fenomena ganda',
      level: [4, 5],
      type: 'text',
      template: {
        stimulus: '{{phenomenon_A}} dan {{phenomenon_B}} terjadi secara bersamaan',
        text: 'Pernyataan manakah yang paling mungkin menjelaskan kedua fenomena tersebut secara bersamaan?',
        options: [
          '{{common_cause}}',
          '{{coincidental}}',
          '{{one_causes_other}}',
          '{{reverse_causation}}',
          '{{unrelated}}'
        ]
      },
      contextVariations: ['FENOMENA_SOSIAL', 'EVENT_KORELASI', 'OBSERVASI_GANDA'],
      konsep: 'Penjelasan kausal, abduksi'
    },
    {
      id: 'pu_best_conclusion',
      pattern: 'Simpulan paling tepat',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{information_set}}',
        text: 'Berdasarkan informasi itu, manakah simpulan yang PALING TEPAT?',
        options: [
          '{{best_conclusion}}',
          '{{acceptable_conclusion}}',
          '{{weak_conclusion}}',
          '{{overgeneralization}}',
          '{{irrelevant_conclusion}}'
        ]
      },
      contextVariations: ['KASUS_KOMPLEKS', 'DATA_MULTISUMBER', 'SITUASI_AMBIGU'],
      konsep: 'Sintesis, evaluasi kesimpulan'
    },
    {
      id: 'pu_extreme_max_min',
      pattern: 'Nilai ekstrem (terbesar/terkecil)',
      level: [2, 3],
      type: 'table',
      template: {
        stimulus: '{{data_set}}',
        representation: {
          type: 'table',
          data: '{{data_table}}'
        },
        text: '{{extremum_question}}',
        options: '{{extremum_options}}'
      },
      contextVariations: ['DATA_STATISTIK', 'PERBANDINGAN_KUANTITAS', 'RANKING'],
      konsep: 'Identifikasi nilai ekstrem'
    }
  ],

  // ============================================================================
  // 2. PENGETAHUAN & PEMAHAMAN UMUM (PPU) - 19 Pola
  // ============================================================================
  tps_ppu: [
    {
      id: 'ppu_affix_meaning',
      pattern: 'Makna imbuhan/kata',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{text_with_affix}}',
        text: 'Makna imbuhan {{affix}} dalam kata {{target_word}} memiliki makna yang sama dengan imbuhan {{affix}} dalam kalimat...',
        options: [
          '{{correct_parallel}}',
          '{{same_affix_different_meaning}}',
          '{{different_affix}}',
          '{{unrelated_word}}',
          '{{opposite_meaning}}'
        ]
      },
      contextVariations: ['TEKS_AKADEMIK', 'ARTIKEL_BERITA', 'TEKS_SASTRA'],
      konsep: 'Morfologi, semantik kata'
    },
    {
      id: 'ppu_conjunction',
      pattern: 'Konjungsi yang tepat',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{sentence_A}} [...] {{sentence_B}}',
        text: 'Konjungsi yang tepat untuk menghubungkan kalimat {{num_A}} dan {{num_B}} adalah...',
        options: '{{conjunction_options}}'
      },
      contextVariations: ['HUBUNGAN_SEBAB_AKIBAT', 'HUBUNGAN_KONTRAS', 'HUBUNGAN_ADITIF'],
      konsep: 'Kohesi teks, kata hubung'
    },
    {
      id: 'ppu_word_choice',
      pattern: 'Kata yang paling cocok',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{sentence_with_blank}}',
        text: 'Kata {{word_type}} yang paling cocok digunakan untuk mengisi [...] di kalimat itu?',
        options: '{{word_options}}'
      },
      contextVariations: ['KATA_KERJA', 'KATA_SIFAT', 'KATA_BENDA'],
      konsep: 'Semantik, pemilihan kata'
    },
    {
      id: 'ppu_different_meaning',
      pattern: 'Kata/frasa bermakna lain',
      level: [3],
      type: 'text',
      template: {
        stimulus: '{{paragraph_with_words}}',
        text: 'Kata atau frasa yang memiliki makna lain terdapat pada kalimat...',
        options: '{{sentence_options}}'
      },
      contextVariations: ['KATA_POLISEMI', 'FRASA_IDIOMATIK', 'KONTEKS_SPESIFIK'],
      konsep: 'Polisemi, homonimi'
    },
    {
      id: 'ppu_synonym',
      pattern: 'Kesamaan makna kata',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{text_with_target_word}}',
        text: 'Kata {{target_word}} pada kalimat {{num}} memiliki kesamaan makna dengan kata...',
        options: '{{synonym_options}}'
      },
      contextVariations: ['SINONIM_KONTEKSTUAL', 'PADANAN_KATA', 'VARIASI_LEKSIKAL'],
      konsep: 'Sinonimi, relasi makna'
    },
    {
      id: 'ppu_associative_meaning',
      pattern: 'Makna asosiatif frasa',
      level: [3],
      type: 'text',
      template: {
        stimulus: '{{text_with_phrase}}',
        text: 'Frasa {{phrase}} memiliki makna yang berasosiasi dengan kata...',
        options: '{{association_options}}'
      },
      contextVariations: ['ASOSIASI_BUDAYA', 'KONOTASI', 'SIMBOLISME'],
      konsep: 'Makna asosiatif, konotasi'
    },
    {
      id: 'ppu_affix_parallel',
      pattern: 'Imbuhan bermakna sama',
      level: [3],
      type: 'text',
      template: {
        stimulus: '{{text_with_ke_an}}',
        text: 'Imbuhan ke-an pada kata {{word}} bermakna sama dengan kalimat di bawah ini yaitu...',
        options: '{{parallel_sentence_options}}'
      },
      contextVariations: ['KEADAAN', 'PROSES', 'HASIL'],
      konsep: 'Morfologi derivasional'
    },
    {
      id: 'ppu_problem_analysis',
      pattern: 'Analisis masalah paragraf',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{paragraph_1}}',
        text: 'Masalah yang disampaikan dalam paragraf 1 adalah masalah yang sama dengan...',
        options: '{{parallel_problem_options}}'
      },
      contextVariations: ['MASALAH_SOSIAL', 'ISU_LINGKUNGAN', 'FENOMENA_EKONOMI'],
      konsep: 'Analisis paralelisme masalah'
    },
    {
      id: 'ppu_information_match',
      pattern: 'Informasi sesuai teks',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{informative_text}}',
        text: 'Informasi berikut sesuai dengan apa yang disampaikan teks, kecuali...',
        options: '{{information_options}}'
      },
      contextVariations: ['TEKS_EKSPOSISI', 'TEKS_DESKRIPSI', 'TEKS_NARASI'],
      konsep: 'Pemahaman eksplisit'
    },
    {
      id: 'ppu_statement_accuracy',
      pattern: 'Pernyataan sesuai teks',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{text}}',
        text: 'Pernyataan berikut yang sesuai dengan teks adalah...',
        options: '{{statement_options}}'
      },
      contextVariations: ['FAKTA_EKSPLISIT', 'INFERENSI_SEDERHANA', 'DETAIL_SPESIFIK'],
      konsep: 'Akurasi pemahaman'
    },
    {
      id: 'ppu_explanation_parallel',
      pattern: 'Penjelasan memiliki persamaan',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{explanation_text}}',
        text: 'Penjelasan tersebut memiliki persamaan dengan...',
        options: '{{parallel_explanation_options}}'
      },
      contextVariations: ['KONSEP_ABSTRAK', 'PROSES_KOMPLEKS', 'FENOMENA'],
      konsep: 'Paralelisme konseptual'
    },
    {
      id: 'ppu_main_idea',
      pattern: 'Gagasan utama teks',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{paragraph}}',
        text: 'Gagasan utama yang dapat disimpulkan dari teks di atas adalah...',
        options: '{{main_idea_options}}'
      },
      contextVariations: ['PARAGRAF_DEDUKTIF', 'PARAGRAF_INDUKTIF', 'PARAGRAF_CAMPURAN'],
      konsep: 'Identifikasi ide pokok'
    },
    {
      id: 'ppu_register',
      pattern: 'Ragam bahasa',
      level: [2],
      type: 'text',
      template: {
        stimulus: '{{sentence_with_word}}',
        text: 'Kata {{word}} adalah ... (ragam baku/sastra/santai)',
        options: '{{register_options}}'
      },
      contextVariations: ['RAGAM_BAKU', 'RAGAM_SASTRA', 'RAGAM_SANTAI'],
      konsep: 'Sosiolinguistik, register'
    },
    {
      id: 'ppu_figure_of_speech',
      pattern: 'Gaya bahasa',
      level: [3],
      type: 'text',
      template: {
        stimulus: '{{text_with_figures}}',
        text: 'Kalimat yang mengandung gaya bahasa {{figure_type}} adalah...',
        options: '{{sentence_options}}'
      },
      contextVariations: ['PERSONIFIKASI', 'METAFORA', 'HIPERBOLA'],
      konsep: 'Gaya bahasa, majas'
    },
    {
      id: 'ppu_word_purpose',
      pattern: 'Tujuan penggunaan kata',
      level: [3],
      type: 'text',
      template: {
        stimulus: '{{text_with_target_word}}',
        text: 'Tujuan penggunaan kata {{word}} pada kalimat {{num}} adalah...',
        options: '{{purpose_options}}'
      },
      contextVariations: ['EFEK_EMOSIONAL', 'PENEKANAN', 'KEHALUSAN_BAHASA'],
      konsep: 'Pragmatik, fungsi bahasa'
    },
    {
      id: 'ppu_text_continuation',
      pattern: 'Prediksi kelanjutan teks',
      level: [4, 5],
      type: 'text',
      template: {
        stimulus: '{{incomplete_text}}',
        text: 'Jika teks tersebut dilanjutkan, kemungkinan besar paragraf setelahnya tidak akan berfokus pada pembahasan tentang...',
        options: '{{continuation_options}}'
      },
      contextVariations: ['STRUKTUR_TEKS', 'KOHESI_PARAGRAF', 'ALUR_LOGIKA'],
      konsep: 'Prediksi struktural'
    },
    {
      id: 'ppu_sentence_reformulation',
      pattern: 'Pengungkapan ulang kalimat',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{original_sentence}}',
        text: 'Kalimat {{num}} dapat diungkapkan ulang melalui kalimat...',
        options: '{{reformulation_options}}'
      },
      contextVariations: ['PARAFRASE', 'SINTESIS', 'RESTRUKTURISASI'],
      konsep: 'Reformulasi, parafrase'
    },
    {
      id: 'ppu_sentence_pattern',
      pattern: 'Pola kalimat sama',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{reference_sentence}}',
        text: 'Manakah bentuk kalimat yang memiliki pola yang sama dengan kalimat {{num}}?',
        options: '{{pattern_options}}'
      },
      contextVariations: ['STRUKTUR_SPO', 'KALIMAT_PASIF', 'KALIMAT_MAJEMUK'],
      konsep: 'Pola kalimat, sintaksis'
    },
    {
      id: 'ppu_illogical_sentence',
      pattern: 'Kalimat tidak logis',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{text_with_sentences}}',
        text: 'Kalimat yang tidak logis dalam bacaan di atas adalah...',
        options: '{{sentence_options}}'
      },
      contextVariations: ['KONTRADIKSI', 'KESALAHAN_LOGIKA', 'INKONSISTENSI'],
      konsep: 'Logika bahasa'
    }
  ],

  // ============================================================================
  // 3. PEMAHAMAN BACAAN & MENULIS (PBM) - 19 Pola
  // ============================================================================
  tps_pbm: [
    {
      id: 'pbm_spelling_correct',
      pattern: 'Penulisan ejaan yang benar',
      level: [1, 2],
      type: 'text',
      template: {
        stimulus: '{{text_with_bold_words}}',
        text: 'Penulisan kata bercetak tebal pada teks tersebut yang benar terdapat pada kalimat...',
        options: '{{sentence_options}}'
      },
      contextVariations: ['TEKS_ILMIAH', 'TEKS_RESMI', 'ARTIKEL'],
      konsep: 'Ejaan bahasa Indonesia (PUEBI)'
    },
    {
      id: 'pbm_punctuation_correct',
      pattern: 'Kesalahan tanda baca tidak ditemukan',
      level: [1, 2],
      type: 'text',
      template: {
        stimulus: '{{text_with_sentences}}',
        text: 'Kesalahan penggunaan tanda baca tidak ditemukan dalam kalimat...',
        options: '{{sentence_options}}'
      },
      contextVariations: ['TANDA_KOMA', 'TANDA_TITIK', 'TANDA_TITIK_KOMA'],
      konsep: 'Penggunaan tanda baca'
    },
    {
      id: 'pbm_punctuation_add',
      pattern: 'Tanda baca yang perlu ditambahkan',
      level: [2],
      type: 'text',
      template: {
        stimulus: '{{sentence_without_punctuation}}',
        text: 'Tanda baca manakah yang perlu ditambahkan agar kalimat tersebut lebih tepat?',
        options: '{{punctuation_options}}'
      },
      contextVariations: ['KOMA', 'TITIK', 'TITIK_DUA', 'TANDA_PETIK'],
      konsep: 'Kelengkapan tanda baca'
    },
    {
      id: 'pbm_spelling_fix',
      pattern: 'Perbaikan ejaan yang tepat',
      level: [1, 2],
      type: 'text',
      template: {
        stimulus: '{{text_with_errors}}',
        text: 'Perbaikan ejaan yang tepat dari teks di atas adalah...',
        options: '{{correction_options}}'
      },
      contextVariations: ['KATA_TIDAK_BAKU', 'GABUNGAN_KATA', 'KATA_SERAPAN'],
      konsep: 'Koreksi ejaan'
    },
    {
      id: 'pbm_completion',
      pattern: 'Melengkapi kalimat rumpang',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{text_with_gap}}',
        text: 'Pernyataan yang paling tepat untuk melengkapi kalimat {{num}} adalah...',
        options: '{{completion_options}}'
      },
      contextVariations: ['KALIMAT_RUMPANG', 'PARAGRAF_TIDAK_LENGKAP', 'INFORMASI_HILANG'],
      konsep: 'Koherensi teks, kelengkapan informasi'
    },
    {
      id: 'pbm_conjunction',
      pattern: 'Kata hubung yang tepat',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{sentence_with_blank}}',
        text: 'Kata hubung yang paling tepat untuk melengkapi kalimat {{num}} adalah...',
        options: '{{conjunction_options}}'
      },
      contextVariations: ['KATA_HUBUNG_SEBAB', 'KATA_HUBUNG_KONTRAS', 'KATA_HUBUNG_WAKTU'],
      konsep: 'Kohesi, konjungsi'
    },
    {
      id: 'pbm_word_completion',
      pattern: 'Kata untuk melengkapi rumpang',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{paragraph_with_blanks}}',
        text: 'Kata yang paling tepat untuk melengkapi [...] pada paragraf {{num}} adalah...',
        options: '{{word_options}}'
      },
      contextVariations: ['KATA_KUNCI', 'ISTILAH_TEKNIS', 'KATA_TRANSISI'],
      konsep: 'Pemilihan leksikal'
    },
    {
      id: 'pbm_information_addition',
      pattern: 'Penambahan informasi',
      level: [3],
      type: 'text',
      template: {
        stimulus: '{{text_with_incomplete_sentence}}',
        text: 'Penambahan informasi untuk kalimat {{num}} teks di atas yang tepat adalah...',
        options: '{{addition_options}}'
      },
      contextVariations: ['DETAIL_PENDUKUNG', 'CONTOH_ILUSTRASI', 'EKSPLANASI'],
      konsep: 'Kelengkapan paragraf'
    },
    {
      id: 'pbm_sentence_improvement',
      pattern: 'Penyempurnaan kalimat',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{text_with_numbered_sentences}}',
        text: 'Kalimat {{num}} perlu disempurnakan dengan cara...',
        options: '{{improvement_options}}'
      },
      contextVariations: ['STRUKTUR_TIDAK_LENGKAP', 'KATA_TIDAK_TEPAT', 'URUTAN_SALAH'],
      konsep: 'Efektivitas kalimat'
    },
    {
      id: 'pbm_ineffective_sentence',
      pattern: 'Kalimat tidak efektif',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{text_with_sentences}}',
        text: 'Kalimat tidak efektif yang terdapat pada teks di atas adalah...',
        options: '{{sentence_options}}'
      },
      contextVariations: ['REDUNDANSI', 'STRUKTUR_SALAH', 'AMBIGUITAS'],
      konsep: 'Efektivitas kalimat'
    },
    {
      id: 'pbm_sentence_combination',
      pattern: 'Gabungan kalimat efektif',
      level: [3],
      type: 'text',
      template: {
        stimulus: '{{two_sentences}}',
        text: 'Gabungan yang efektif dari kalimat satu dan dua teks tersebut adalah...',
        options: '{{combination_options}}'
      },
      contextVariations: ['KALIMAT_MAJEMUK', 'KONJUNGSI_KOORDINATIF', 'SUBORDINASI'],
      konsep: 'Penggabungan kalimat'
    },
    {
      id: 'pbm_conjunction_error',
      pattern: 'Penggunaan konjungsi salah',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{text_with_conjunctions}}',
        text: 'Penggunaan konjungsi (kata hubung) yang salah terdapat pada kalimat...',
        options: '{{sentence_options}}'
      },
      contextVariations: ['KONJUNGSI_SALAH', 'KONJUNGSI_TIDAK_TEPAT', 'KONJUNGSI_BERLEBIH'],
      konsep: 'Penggunaan konjungsi'
    },
    {
      id: 'pbm_redundancy_fix',
      pattern: 'Perbaikan kalimat redundan',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{redundant_sentence}}',
        text: 'Agar lebih efektif dan tidak redundan, bentuk yang tepat dari kalimat tersebut adalah...',
        options: '{{concise_options}}'
      },
      contextVariations: ['PLEONASME', 'REPETISI_TIDAK_PERLU', 'KATA_SINONIM_BERLEBIH'],
      konsep: 'Keringkasan, efisiensi bahasa'
    },
    {
      id: 'pbm_missing_subject',
      pattern: 'Kalimat tidak memiliki subjek',
      level: [3],
      type: 'text',
      template: {
        stimulus: '{{text_with_sentences}}',
        text: 'Kalimat tidak efektif karena tidak terpenuhinya unsur subjek yang jelas terdapat pada kalimat...',
        options: '{{sentence_options}}'
      },
      contextVariations: ['KALIMAT_PASIF_TANPA_SUBJEK', 'STRUKTUR_TIDAK_LENGKAP', 'ELIPS_BERLEBIH'],
      konsep: 'Unsur kalimat minimal'
    },
    {
      id: 'pbm_semantic_equivalence',
      pattern: 'Makna sama dengan kata',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{text_with_target_word}}',
        text: 'Kata \'{{word}}\' pada paragraf {{num}} memiliki makna yang sama dengan kata...',
        options: '{{synonym_options}}'
      },
      contextVariations: ['SINONIM', 'PADANAN', 'EQUIVALEN'],
      konsep: 'Semantik, sinonimi'
    },
    {
      id: 'pbm_antonym',
      pattern: 'Lawan kata',
      level: [2],
      type: 'text',
      template: {
        stimulus: '{{text_with_target_word}}',
        text: 'Lawan kata \'{{word}}\' pada paragraf {{num}} adalah...',
        options: '{{antonym_options}}'
      },
      contextVariations: ['ANTONIM_LANGSUNG', 'ANTONIM_KONTEKSTUAL', 'KUTUB_BERLAWANAN'],
      konsep: 'Antonimi'
    },
    {
      id: 'pbm_word_substitution',
      pattern: 'Kata pengganti yang sesuai',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{text_with_target_word}}',
        text: 'Jika kata \'{{word}}\' pada kalimat tersebut diganti, kata pengganti yang sesuai adalah...',
        options: '{{substitution_options}}'
      },
      contextVariations: ['SINONIM_KONTEKSTUAL', 'VARIASI_LEKSIKAL', 'PARAFRASE'],
      konsep: 'Substitusi leksikal'
    },
    {
      id: 'pbm_reference',
      pattern: 'Rujukan kata ganti',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{text_with_pronoun}}',
        text: 'Kata {{pronoun}} pada kalimat {{num}} merujuk pada informasi...',
        options: '{{reference_options}}'
      },
      contextVariations: ['KATA_GANTI_ORANG', 'KATA_GANTI_PENUNJUK', 'KATA_GANTI_KEPEMILIKAN'],
      konsep: 'Referensi, kohesi'
    },
    {
      id: 'pbm_sentence_core',
      pattern: 'Inti kalimat',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{complex_sentence}}',
        text: 'Manakah inti kalimat dari pernyataan tersebut?',
        options: '{{core_options}}'
      },
      contextVariations: ['KALIMAT_PANJANG', 'STRUKTUR_HIERARKI', 'IDE_UTAMA'],
      konsep: 'Struktur inti kalimat'
    }
  ],

  // ============================================================================
  // 4. PENGETAHUAN KUANTITATIF (PK) - 16 Pola
  // ============================================================================
  tps_pk: [
    {
      id: 'pk_geometry_distance',
      pattern: 'Geometri - Jarak titik ke bidang',
      level: [3, 4, 5],
      type: 'shape',
      template: {
        stimulus: '{{geometry_context}}',
        representation: {
          type: 'shape',
          data: '{{shape_data}}'
        },
        text: 'Maka, jarak {{point_P}} ke {{plane_or_line}} adalah...',
        options: '{{numeric_options}}'
      },
      contextVariations: ['KUBUS', 'BALOK', 'LIMAS', 'PRISMA'],
      konsep: 'Geometri ruang, jarak titik-bidang'
    },
    {
      id: 'pk_geometry_ordinate_sum',
      pattern: 'Geometri - Penjumlahan ordinat',
      level: [3, 4],
      type: 'shape',
      template: {
        stimulus: '{{coordinate_geometry}}',
        representation: {
          type: 'shape',
          data: '{{coordinate_data}}'
        },
        text: 'Penjumlahan dari ordinat masing-masing titik ujung pada bangun datar tersebut adalah...',
        options: '{{numeric_options}}'
      },
      contextVariations: ['SEGI_EMPAT', 'SEGITIGA', 'SEGI_BANYAK'],
      konsep: 'Geometri koordinat'
    },
    {
      id: 'pk_statistics_true_statements',
      pattern: 'Statistika - Banyak pernyataan benar',
      level: [3, 4],
      type: 'grid_boolean',
      template: {
        stimulus: '{{statistics_context}}',
        representation: {
          type: 'grid_boolean',
          data: '{{statements}}'
        },
        text: 'Banyaknya pernyataan yang benar adalah sebanyak...',
        options: ['0', '1', '2', '3', '4']
      },
      contextVariations: ['MEAN_MEDIAN_MODE', 'STANDAR_DEVIASI', 'DISTRIBUSI'],
      konsep: 'Statistika deskriptif'
    },
    {
      id: 'pk_combinatorics',
      pattern: 'Statistika - Banyaknya nilai mungkin',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{combinatorics_context}}',
        text: 'Banyaknya nilai {{expression}} yang mungkin adalah...',
        options: '{{numeric_options}}'
      },
      contextVariations: ['PERMUTASI', 'KOMBINASI', 'PELUANG'],
      konsep: 'Kombinatorika'
    },
    {
      id: 'pk_quantity_comparison',
      pattern: 'Hubungan kuantitas P dan Q',
      level: [2, 3, 4],
      type: 'pq_comparison',
      template: {
        stimulus: '{{math_context}}',
        representation: {
          type: 'function',
          data: {
            function: '{{expression_P}}\\n{{expression_Q}}',
            variables: '{{variables}}'
          }
        },
        text: 'Tentukan hubungan kuantitas P dan Q berikut.',
        options: [
          'P > Q',
          'Q > P',
          'P = Q',
          'Tidak dapat ditentukan'
        ]
      },
      contextVariations: ['ALJABAR', 'PERTIDAKSAMAAN', 'GEOMETRI', 'FUNGSI'],
      konsep: 'Perbandingan kuantitas'
    },
    {
      id: 'pk_quantity_comparison_formal',
      pattern: 'Hubungan kuantitas P dan Q (formal)',
      level: [2, 3, 4],
      type: 'pq_comparison',
      template: {
        stimulus: '{{math_context}}',
        representation: {
          type: 'function',
          data: {
            function: '{{expression_P}}\\n{{expression_Q}}',
            variables: '{{variables}}'
          }
        },
        text: 'Berdasarkan informasi yang diberikan, maka hubungan antara kuantitas P dan Q berikut yang benar?',
        options: [
          'P > Q',
          'Q > P',
          'P = Q',
          'Tidak dapat ditentukan'
        ]
      },
      contextVariations: ['SISTEM_PERSAMAAN', 'FUNGSI_KUADRAT', 'TRIGONOMETRI'],
      konsep: 'Analisis perbandingan'
    },
    {
      id: 'pk_data_sufficiency',
      pattern: 'Kecukupan data',
      level: [3, 4, 5],
      type: 'data_sufficiency',
      template: {
        stimulus: '{{question}}\\n\\n(1) {{statement_1}}\\n(2) {{statement_2}}',
        text: 'Putuskan apakah pernyataan (1) dan (2) berikut cukup untuk menjawab pertanyaan tersebut.',
        options: [
          'Pernyataan (1) saja cukup, tetapi pernyataan (2) saja tidak cukup',
          'Pernyataan (2) saja cukup, tetapi pernyataan (1) saja tidak cukup',
          'Kedua pernyataan bersama-sama cukup, tetapi masing-masing saja tidak cukup',
          'Setiap pernyataan saja cukup',
          'Kedua pernyataan tidak cukup'
        ]
      },
      contextVariations: ['ALJABAR', 'GEOMETRI', 'STATISTIKA', 'TEORI_BILANGAN'],
      konsep: 'Logika kecukupan data'
    },
    {
      id: 'pk_data_sufficiency_yes_no',
      pattern: 'Kecukupan data (Ya/Tidak)',
      level: [4, 5],
      type: 'data_sufficiency',
      template: {
        stimulus: '{{yes_no_question}}\\n\\n(1) {{statement_1}}\\n(2) {{statement_2}}',
        text: 'Apakah {{condition}}? Putuskan apakah pernyataan (1) dan (2) berikut cukup...',
        options: [
          'Pernyataan (1) saja cukup, tetapi pernyataan (2) saja tidak cukup',
          'Pernyataan (2) saja cukup, tetapi pernyataan (1) saja tidak cukup',
          'Kedua pernyataan bersama-sama cukup, tetapi masing-masing saja tidak cukup',
          'Setiap pernyataan saja cukup',
          'Kedua pernyataan tidak cukup'
        ]
      },
      contextVariations: ['SIFAT_BILANGAN', 'PERTIDAKSAMAAN', 'KEBERLANGSUNGAN'],
      konsep: 'Data sufficiency binary'
    },
    {
      id: 'pk_statement_analysis',
      pattern: 'Analisis pernyataan',
      level: [3, 4, 5],
      type: 'grid_boolean',
      template: {
        stimulus: '{{math_context}}',
        representation: {
          type: 'grid_boolean',
          data: '{{statements}}'
        },
        text: 'Berapa banyak pernyataan di atas yang benar?',
        options: ['0', '1', '2', '3', '4']
      },
      contextVariations: ['FUNGSI', 'PERSAMAAN', 'SIFAT_BILANGAN'],
      konsep: 'Verifikasi multiple pernyataan'
    },
    {
      id: 'pk_which_statements_true',
      pattern: 'Pernyataan mana yang benar',
      level: [3, 4],
      type: 'multiple_select',
      template: {
        stimulus: '{{math_context}}',
        text: 'Pernyataan mana saja yang benar?',
        options: '{{statement_combinations}}'
      },
      contextVariations: ['LOGIKA_MATEMATIKA', 'HIMPUNAN', 'FUNGSI'],
      konsep: 'Seleksi pernyataan benar'
    },
    {
      id: 'pk_number_sum',
      pattern: 'Nilai penjumlahan variabel',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{equation_system}}',
        text: 'Nilai {{variable_A}}+{{variable_B}} yang mungkin adalah...',
        options: '{{numeric_options}}'
      },
      contextVariations: ['SISTEM_PERSAMAAN', 'PERSAMAAN_DIOPHANTINE', 'KENDALA'],
      konsep: 'Aljabar, sistem persamaan'
    },
    {
      id: 'pk_correct_statement',
      pattern: 'Pernyataan yang benar',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{math_context}}',
        text: 'Maka, pernyataan berikut yang benar adalah...',
        options: '{{statement_options}}'
      },
      contextVariations: ['SIFAT_FUNGSI', 'INEQUALITAS', 'HIMPUNAN'],
      konsep: 'Identifikasi pernyataan benar'
    },
    {
      id: 'pk_estimation_range',
      pattern: 'Rentang nilai kira-kira',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{real_world_context}}',
        text: '{{target_value}} kira-kira ada di rentang...',
        options: '{{range_options}}'
      },
      contextVariations: ['KONVERSI_MATA_UANG', 'ESTIMASI_PENGUKURAN', 'PEMBULATAN'],
      konsep: 'Estimasi, aproksimasi'
    },
    {
      id: 'pk_set_sum',
      pattern: 'Jumlahan elemen himpunan',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{set_definitions}}',
        text: 'Jumlahan dari elemen-elemen himpunan {{sets}} adalah...',
        options: '{{numeric_options}}'
      },
      contextVariations: ['OPERASI_HIMPUNAN', 'IRISAN_UNION', 'KOMPLEMENTER'],
      konsep: 'Teori himpunan'
    },
    {
      id: 'pk_factor_identification',
      pattern: 'Faktor dari bilangan',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{number_context}}',
        text: 'Di antara pilihan berikut, yang merupakan faktor dari {{number}} adalah...',
        options: '{{factor_options}}'
      },
      contextVariations: ['FAKTORISASI', 'BILANGAN_PRIMA', 'FPB_KPK'],
      konsep: 'Teori bilangan'
    },
    {
      id: 'pk_minimum_sum',
      pattern: 'Jumlah terkecil yang memungkinkan',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{constraint_context}}',
        text: 'Jumlah terkecil {{objects}} yang memungkinkan adalah?',
        options: '{{numeric_options}}'
      },
      contextVariations: ['OPTIMASI_DASAR', 'KENDALA_MINIMUM', 'PRINSIP_SARANG_MERPATI'],
      konsep: 'Optimasi, prinsip ekstremal'
    }
  ],

  // ============================================================================
  // 5. PENALARAN MATEMATIKA (PM) - 12 Pola
  // ============================================================================
  pm: [
    {
      id: 'pm_optimization_max',
      pattern: 'Optimasi - Nilai maksimum',
      level: [3, 4],
      type: 'function',
      template: {
        stimulus: '{{business_context}}',
        representation: {
          type: 'function',
          data: {
            function: 'Maksimumkan: Z = {{objective_function}}\\nConstraint:\\n{{constraint_1}}\\n{{constraint_2}}',
            variables: '{{variables}}'
          }
        },
        text: 'Berapa maksimal {{target}} yang bisa dicapai?',
        options: '{{numeric_options}}'
      },
      contextVariations: ['PRODUKSI', 'KEUNTUNGAN', 'DISTRIBUSI_SUMBER_DAYA'],
      konsep: 'Program linear, optimasi'
    },
    {
      id: 'pm_optimization_distance',
      pattern: 'Optimasi - Jarak maksimum',
      level: [3, 4],
      type: 'function',
      template: {
        stimulus: '{{geometry_motion_context}}',
        representation: {
          type: 'function',
          data: {
            function: '{{distance_function}}',
            variables: '{{variables}}'
          }
        },
        text: 'Berapa jarak maksimum {{object}} terhadap {{reference}}?',
        options: '{{numeric_options}}'
      },
      contextVariations: ['GERAK_PARABOLA', 'KAPAL_DAN_TALI', 'PROYEKSI'],
      konsep: 'Optimasi geometri'
    },
    {
      id: 'pm_optimization_allocation',
      pattern: 'Optimasi - Alokasi biaya minimal',
      level: [4, 5],
      type: 'function',
      template: {
        stimulus: '{{resource_allocation_context}}',
        representation: {
          type: 'function',
          data: {
            function: 'Minimumkan: C = {{cost_function}}\\nSubject to: {{constraints}}',
            variables: '{{variables}}'
          }
        },
        text: 'Berapa alokasi {{resources}} agar target terpenuhi dengan biaya seminimal mungkin?',
        options: '{{allocation_options}}'
      },
      contextVariations: ['ALOKASI_ANGGARAN', 'DISTRIBUSI_LOGISTIK', 'PENJADWALAN'],
      konsep: 'Optimasi biaya'
    },
    {
      id: 'pm_conditional_time',
      pattern: 'Perhitungan kondisional - Waktu',
      level: [3, 4],
      type: 'function',
      template: {
        stimulus: '{{time_critical_scenario}}',
        representation: {
          type: 'function',
          data: {
            function: '{{time_equation}}',
            variables: '{{variables}}'
          }
        },
        text: 'Berapa detik waktu yang tersisa agar {{subject}} bisa {{action}}?',
        options: '{{time_options}}'
      },
      contextVariations: ['KECELAKAAN', 'PENYELAMATAN', 'DEADLINE'],
      konsep: 'Kinematika, waktu kritis'
    },
    {
      id: 'pm_conditional_remaining',
      pattern: 'Perhitungan kondisional - Sisa',
      level: [3, 4],
      type: 'function',
      template: {
        stimulus: '{{scenario_with_constraints}}',
        representation: {
          type: 'function',
          data: {
            function: '{{remaining_equation}}',
            variables: '{{variables}}'
          }
        },
        text: 'Berapa {{quantity}} tersisa dengan pertimbangan {{conditions}}?',
        options: '{{numeric_options}}'
      },
      contextVariations: ['TALE_TERBATAS', 'BAHAN_BAKU', 'WAKTU_SISA'],
      konsep: 'Perhitungan bersyarat'
    },
    {
      id: 'pm_conditional_maximum',
      pattern: 'Perhitungan kondisional - Kondisi maksimum',
      level: [3, 4],
      type: 'function',
      template: {
        stimulus: '{{maximum_condition_scenario}}',
        representation: {
          type: 'function',
          data: {
            function: '{{constraint_equation}}',
            variables: '{{variables}}'
          }
        },
        text: 'Tentukan {{target}} ketika {{condition}} maksimum!',
        options: '{{numeric_options}}'
      },
      contextVariations: ['TALI_MAKSIMUM', 'KAPASITAS_PENUH', 'BATAS_TERCAPAI'],
      konsep: 'Kondisi ekstrem'
    },
    {
      id: 'pm_pattern_sequence',
      pattern: 'Pola bilangan - Barisan',
      level: [3, 4, 5],
      type: 'function',
      template: {
        stimulus: '{{number_pattern_context}}',
        representation: {
          type: 'function',
          data: {
            function: '{{sequence_rule}}',
            variables: '{{variables}}'
          }
        },
        text: 'Jika {{sequence_definition}}, maka {{target_expression}}=',
        options: '{{expression_options}}'
      },
      contextVariations: ['BARISAN_ARITMATIKA', 'BARISAN_GEOMETRI', 'POLA_KUSTOM'],
      konsep: 'Pola bilangan, barisan'
    },
    {
      id: 'pm_pattern_quotient',
      pattern: 'Pola bilangan - Hasil bagi',
      level: [3, 4],
      type: 'function',
      template: {
        stimulus: '{{grid_pattern}}',
        representation: {
          type: 'table',
          data: '{{grid_data}}'
        },
        text: 'Hasil bagi bilangan pada petak {{position_A}} dengan bilangan pada petak {{position_B}} adalah...',
        options: '{{numeric_options}}'
      },
      contextVariations: ['GRID_BILANGAN', 'POLA_KOTAK', 'ARRAY'],
      konsep: 'Pola dalam grid'
    },
    {
      id: 'pm_function_model',
      pattern: 'Fungsi sebagai model',
      level: [3, 4],
      type: 'function',
      template: {
        stimulus: '{{real_world_scenario}}',
        representation: {
          type: 'function',
          data: {
            function: '{{function_definition}}',
            variables: '{{variables}}'
          }
        },
        text: 'Jika f adalah fungsi yang menyatakan {{phenomenon}}, maka...',
        options: '{{function_options}}'
      },
      contextVariations: ['PERTUMBUHAN', 'PELURUHAN', 'HUBUNGAN_LINEAR'],
      konsep: 'Pemodelan fungsi'
    },
    {
      id: 'pm_truth_value',
      pattern: 'Nilai kebenaran pernyataan',
      level: [3, 4],
      type: 'grid_boolean',
      template: {
        stimulus: '{{math_scenario}}',
        representation: {
          type: 'grid_boolean',
          data: '{{statements}}'
        },
        text: 'Tentukan nilai kebenaran dari pernyataan-pernyataan di bawah ini!',
        options: '{{truth_table_options}}'
      },
      contextVariations: ['LOGIKA', 'SIFAT_BILANGAN', 'GEOMETRI'],
      konsep: 'Evaluasi kebenaran'
    },
    {
      id: 'pm_story_area',
      pattern: 'Soal cerita - Luas',
      level: [2, 3],
      type: 'shape',
      template: {
        stimulus: '{{land_context}}',
        representation: {
          type: 'shape',
          data: '{{shape_dimensions}}'
        },
        text: 'Maka, luas {{object}} adalah ... m²',
        options: '{{area_options}}'
      },
      contextVariations: ['LAHAN_PERKEBUNAN', 'KOLAM', 'BANGUNAN'],
      konsep: 'Geometri terapan'
    },
    {
      id: 'pm_story_duration',
      pattern: 'Soal cerita - Durasi',
      level: [2, 3],
      type: 'function',
      template: {
        stimulus: '{{resource_consumption_context}}',
        representation: {
          type: 'function',
          data: {
            function: '{{consumption_rate}}',
            variables: '{{variables}}'
          }
        },
        text: '{{resource}} bertahan lebih lama ... {{time_unit}} dari pada yang direncanakan.',
        options: '{{duration_options}}'
      },
      contextVariations: ['PAKAN_AYAM', 'BAHAN_BAKAR', 'PERSEDIAAN'],
      konsep: 'Aritmatika terapan'
    }
  ],

  // ============================================================================
  // 6. LITERASI INDONESIA (LBI) - 13 Pola
  // ============================================================================
  lit_ind: [
    {
      id: 'lbi_explicit_mismatch',
      pattern: 'Pernyataan tidak sesuai bacaan',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{informative_text}}',
        text: 'Pernyataan yang TIDAK sesuai dengan bacaan di atas adalah...',
        options: '{{statement_options}}'
      },
      contextVariations: ['TEKS_EKSPOSISI', 'TEKS_ARGUMENTASI', 'TEKS_DESKRIPSI'],
      konsep: 'Pemahaman eksplisit'
    },
    {
      id: 'lbi_unexplained_info',
      pattern: 'Informasi tidak dijelaskan',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{explanatory_text}}',
        text: 'Informasi yang tidak dijelaskan oleh teks adalah...',
        options: '{{info_options}}'
      },
      contextVariations: ['PROSES', 'MEKANISME', 'FENOMENA'],
      konsep: 'Identifikasi informasi hilang'
    },
    {
      id: 'lbi_motivation',
      pattern: 'Mengapa subjek melakukan tindakan',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{narrative_text}}',
        text: 'Berdasarkan teks, mengapa {{subject}} melakukan {{action}}?',
        options: '{{motivation_options}}'
      },
      contextVariations: ['MOTIVASI_PRIBADI', 'KEPUTUSAN_STRATEGIS', 'RESPONS_EMOSIONAL'],
      konsep: 'Inferensi motivasi'
    },
    {
      id: 'lbi_sequence',
      pattern: 'Apa terjadi setelah peristiwa',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{chronological_text}}',
        text: 'Apa yang terjadi tepat setelah {{event_X}}?',
        options: '{{sequence_options}}'
      },
      contextVariations: ['URUTAN_WAKTU', 'SEKUENS_KEJADIAN', 'NARASI_KRONOLOGIS'],
      konsep: 'Pemahaman sekuensial'
    },
    {
      id: 'lbi_comparison',
      pattern: 'Perbedaan kondisi',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{comparative_text}}',
        text: 'Manakah pernyataan yang menunjukkan perbedaan kondisi antara {{X}} dan {{Y}}?',
        options: '{{difference_options}}'
      },
      contextVariations: ['PERBANDINGAN_WAKTU', 'PERBANDINGAN_TEMPAT', 'PERBANDINGAN_KONDISI'],
      konsep: 'Analisis komparatif'
    },
    {
      id: 'lbi_word_meaning',
      pattern: 'Makna kata/frasa',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{text_with_target}}',
        text: 'Makna dari \'{{word_or_phrase}}\' berdasarkan bacaan adalah...',
        options: '{{meaning_options}}'
      },
      contextVariations: ['KATA_TEKNIS', 'ISTILAH_SPESIFIK', 'FRASA_KONTEKSTUAL'],
      konsep: 'Semantik kontekstual'
    },
    {
      id: 'lbi_sentence_meaning',
      pattern: 'Makna kata pada kalimat',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{text_with_sentences}}',
        text: 'Kata \'{{word}}\' pada kalimat {{num}} bermakna...',
        options: '{{meaning_options}}'
      },
      contextVariations: ['KATA_POLISEMI', 'KATA_KONTEKSTUAL', 'NUANSA_MAKNA'],
      konsep: 'Makna kontekstual'
    },
    {
      id: 'lbi_idiom_meaning',
      pattern: 'Maksud ungkapan',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{text_with_idiom}}',
        text: 'Maksud dari ungkapan \'{{idiom}}\' adalah...',
        options: '{{interpretation_options}}'
      },
      contextVariations: ['UNGKAPAN_TRADISIONAL', 'IDIOM_BUDAYA', 'PERIBAHASA'],
      konsep: 'Makna idiomatik'
    },
    {
      id: 'lbi_reference',
      pattern: 'Pernyataan merujuk pada',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{text_with_statement}}',
        text: 'Pernyataan \'{{quote}}\' dalam paragraf {{num}} merujuk pada...',
        options: '{{reference_options}}'
      },
      contextVariations: ['RUJUKAN_ORANG', 'RUJUKAN_PERISTIWA', 'RUJUKAN_KONSEP'],
      konsep: 'Referensi teks'
    },
    {
      id: 'lbi_causal_explanation',
      pattern: 'Mengapa fenomena menyebabkan fenomena',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{causal_text}}',
        text: 'Mengapa {{phenomenon_A}} dapat menyebabkan {{phenomenon_B}}?',
        options: '{{explanation_options}}'
      },
      contextVariations: ['HUBUNGAN_KAUSAL', 'MEKANISME', 'PROSES'],
      konsep: 'Penjelasan kausal'
    },
    {
      id: 'lbi_party_motivation',
      pattern: 'Mengapa pihak mempersoalkan kasus',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{conflict_text}}',
        text: 'Berdasarkan teks di atas, mengapa {{party_A}} mempersoalkan kasus {{X}}?',
        options: '{{motivation_options}}'
      },
      contextVariations: ['KONFLIK', 'DEBAT', 'KONTROVERSI'],
      konsep: 'Motivasi pihak'
    },
    {
      id: 'lbi_solution',
      pattern: 'Langkah antisipasi',
      level: [4, 5],
      type: 'text',
      template: {
        stimulus: '{{problem_text}}',
        text: 'Apa langkah yang dapat dilakukan {{authority}} sebagai langkah mengantisipasi {{problem}}?',
        options: '{{solution_options}}'
      },
      contextVariations: ['KEBIJAKAN_PUBLIK', 'MANAJEMEN_KRISIS', 'PENCEGAHAN'],
      konsep: 'Rekomendasi solusi'
    },
    {
      id: 'lbi_illustration',
      pattern: 'Ilustrasi dalam bacaan',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{descriptive_text}}',
        text: 'Ilustrasi dalam bacaan tersebut berisi tentang...',
        options: '{{content_options}}'
      },
      contextVariations: ['GAMBARAN_VISUAL', 'ANALOGI', 'CONTOH'],
      konsep: 'Identifikasi ilustrasi'
    }
  ],

  // ============================================================================
  // 7. LITERASI INGGRIS (LBE) - 16 Pola
  // ============================================================================
  lit_ing: [
    {
      id: 'lbe_thread_inference',
      pattern: 'Thread analysis - Author stance',
      level: [2, 3],
      type: 'thread',
      template: {
        stimulus: {
          type: 'thread',
          data: {
            posts: [
              {author: '{{author_1}}', date: '{{date_1}}', content: '{{opinion_1}}'},
              {author: '{{author_2}}', date: '{{date_2}}', content: '{{opinion_2}}'},
              {author: '{{author_3}}', date: '{{date_3}}', content: '{{opinion_3}}'},
              {author: '{{author_4}}', date: '{{date_4}}', content: '{{opinion_4}}'}
            ]
          }
        },
        text: 'What can be inferred about {{target_author}}\'s stance on {{topic}}?',
        options: [
          '{{extreme_position_1}}',
          '{{extreme_position_2}}',
          '{{balanced_position}}',
          '{{irrelevant_position}}',
          '{{contradictory_position}}'
        ]
      },
      contextVariations: ['EDUCATION_DEBATE', 'POLICY_DISCUSSION', 'SOCIAL_ISSUE', 'TECHNOLOGY_DEBATE'],
      konsep: 'Inferensi sikap penulis'
    },
    {
      id: 'lbe_detail_exception',
      pattern: 'Detail - NOT the reason',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{passage}}',
        text: 'Which of the following is NOT the reason why...',
        options: '{{reason_options}}'
      },
      contextVariations: ['EXPLANATION', 'ARGUMENTATION', 'DESCRIPTION'],
      konsep: 'Identifikasi pengecualian'
    },
    {
      id: 'lbe_detail_false',
      pattern: 'Detail - False statement',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{passage}}',
        text: 'Which one of these following statements is false about...',
        options: '{{statement_options}}'
      },
      contextVariations: ['FACTUAL_DETAIL', 'CHARACTER_DESCRIPTION', 'EVENT_SEQUENCE'],
      konsep: 'Identifikasi informasi salah'
    },
    {
      id: 'lbe_main_idea_text1',
      pattern: 'Main idea - Text 1',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{text_1}}',
        text: 'Which of the following is the best main idea of Text 1?',
        options: '{{main_idea_options}}'
      },
      contextVariations: ['EXPOSITORY_TEXT', 'ARGUMENTATIVE_TEXT', 'NARRATIVE_TEXT'],
      konsep: 'Identifikasi ide pokok'
    },
    {
      id: 'lbe_title',
      pattern: 'Title - Most suitable',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{passage}}',
        text: 'What is the most suitable title for the passage above?',
        options: '{{title_options}}'
      },
      contextVariations: ['GENERAL_CONTENT', 'SPECIFIC_THEME', 'METAPHORICAL'],
      konsep: 'Sintesis judul'
    },
    {
      id: 'lbe_summary',
      pattern: 'Summary - Best restatement',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{passage}}',
        text: 'Which of the following best summarizes the passage above?',
        options: '{{summary_options}}'
      },
      contextVariations: ['FULL_PASSAGE', 'SPECIFIC_PARAGRAPH', 'KEY_ARGUMENT'],
      konsep: 'Ringkasan'
    },
    {
      id: 'lbe_paragraph_main_idea',
      pattern: 'Main idea - Paragraph 3',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{multi_paragraph_text}}',
        text: 'What is the main idea of paragraph {{num}}?',
        options: '{{paragraph_idea_options}}'
      },
      contextVariations: ['TOPIC_SENTENCE', 'IMPLIED_MAIN_IDEA', 'SUPPORTING_DETAILS'],
      konsep: 'Ide pokok paragraf'
    },
    {
      id: 'lbe_phrase_meaning',
      pattern: 'Vocabulary - Phrase closest meaning',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{passage_with_phrase}}',
        text: 'The phrase ... is closest in meaning to ...',
        options: '{{meaning_options}}'
      },
      contextVariations: ['IDIOMATIC_EXPRESSION', 'TECHNICAL_TERM', 'CONTEXTUAL_PHRASE'],
      konsep: 'Makna frasa'
    },
    {
      id: 'lbe_word_synonym',
      pattern: 'Vocabulary - Word synonym',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{passage_with_word}}',
        text: 'The word \'...\' has the closest meaning to which of the following?',
        options: '{{synonym_options}}'
      },
      contextVariations: ['ACADEMIC_VOCABULARY', 'GENERAL_VOCABULARY', 'CONTEXT_DEPENDENT'],
      konsep: 'Sinonim'
    },
    {
      id: 'lbe_sentence_restate',
      pattern: 'Vocabulary - Sentence restatement',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{passage_with_sentence}}',
        text: 'The underlined sentence is best restated...',
        options: '{{restate_options}}'
      },
      contextVariations: ['COMPLEX_SENTENCE', 'KEY_ARGUMENT', 'IMPLICIT_MEANING'],
      konsep: 'Parafrase kalimat'
    },
    {
      id: 'lbe_word_replace',
      pattern: 'Vocabulary - Word replacement',
      level: [2, 3],
      type: 'text',
      template: {
        stimulus: '{{passage_with_word}}',
        text: 'The word ... can be replaced with...',
        options: '{{replacement_options}}'
      },
      contextVariations: ['SYNONYM', 'NEAR_SYNONYM', 'CONTEXTUAL_EQUIVALENT'],
      konsep: 'Substitusi kata'
    },
    {
      id: 'lbe_statement_restate',
      pattern: 'Vocabulary - Statement restatement',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{passage_with_statement}}',
        text: 'Which of the following best restates the statement...',
        options: '{{restate_options}}'
      },
      contextVariations: ['ARGUMENT', 'CONCLUSION', 'CLAIM'],
      konsep: 'Reformulasi pernyataan'
    },
    {
      id: 'lbe_purpose',
      pattern: 'Inference - Purpose',
      level: [3, 4],
      type: 'text',
      template: {
        stimulus: '{{text_2}}',
        text: 'According to Text 2, the purpose of providing ... is to',
        options: '{{purpose_options}}'
      },
      contextVariations: ['AUTHOR_INTENT', 'RHETORICAL_PURPOSE', 'FUNCTIONAL_PURPOSE'],
      konsep: 'Tujuan penulis'
    },
    {
      id: 'lbe_implies',
      pattern: 'Inference - Who implies',
      level: [4, 5],
      type: 'text',
      template: {
        stimulus: '{{multi_author_text}}',
        text: 'Who implies that {{implication}}?',
        options: '{{author_options}}'
      },
      contextVariations: ['MULTIPLE_PERSPECTIVES', 'DEBATE', 'COMMENTARY'],
      konsep: 'Inferensi implikasi'
    },
    {
      id: 'lbe_tone',
      pattern: 'Inference - Author tone',
      level: [4, 5],
      type: 'text',
      template: {
        stimulus: '{{passage}}',
        text: 'Which tone best describes the author...?',
        options: '{{tone_options}}'
      },
      contextVariations: ['CRITICAL', 'SUPPORTIVE', 'NEUTRAL', 'SARCASTIC'],
      konsep: 'Nada penulis'
    },
    {
      id: 'lbe_writer_motivation',
      pattern: 'Inference - Writer motivation',
      level: [4, 5],
      type: 'text',
      template: {
        stimulus: '{{argumentative_passage}}',
        text: 'What could possibly motivate the writer in writing the passage?',
        options: '{{motivation_options}}'
      },
      contextVariations: ['ADVOCACY', 'CRITICISM', 'INFORMATION', 'PERSUASION'],
      konsep: 'Motivasi penulis'
    }
  ]
};

/**
 * Get all patterns for a subtest
 * @param {string} subtestId - ID subtest (tps_pu, tps_pk, pm, etc.)
 * @returns {Array} Array of patterns
 */
export function getAllPatterns(subtestId) {
  return QUESTION_PATTERNS[subtestId] || [];
}

/**
 * Select a random pattern from a subtest filtered by level
 * @param {string} subtestId - ID subtest
 * @param {number} complexityLevel - Level 0-5 (0 = adaptive/AI choice)
 * @returns {Object|null} Selected pattern or null
 */
export function selectTemplate(subtestId, complexityLevel) {
  const patterns = QUESTION_PATTERNS[subtestId];
  if (!patterns) return null;

  // Level 0: Let AI choose based on context
  if (complexityLevel === 0) return null;

  // Filter patterns by level
  const suitablePatterns = patterns.filter(p => p.level.includes(complexityLevel));
  
  if (suitablePatterns.length === 0) {
    // Fallback to any pattern in subtest
    return patterns[Math.floor(Math.random() * patterns.length)];
  }
  
  return suitablePatterns[Math.floor(Math.random() * suitablePatterns.length)];
}

/**
 * Get pattern by ID
 * @param {string} patternId - Pattern ID (e.g., 'pu_inference_direct')
 * @returns {Object|null} Pattern object or null
 */
export function getPatternById(patternId) {
  for (const subtest of Object.values(QUESTION_PATTERNS)) {
    const pattern = subtest.find(p => p.id === patternId);
    if (pattern) return pattern;
  }
  return null;
}

/**
 * Get patterns by level range
 * @param {string} subtestId - ID subtest
 * @param {number} minLevel - Minimum level
 * @param {number} maxLevel - Maximum level
 * @returns {Array} Filtered patterns
 */
export function getPatternsByLevelRange(subtestId, minLevel, maxLevel) {
  const patterns = QUESTION_PATTERNS[subtestId];
  if (!patterns) return [];
  
  return patterns.filter(p => {
    return p.level.some(l => l >= minLevel && l <= maxLevel);
  });
}

/**
 * Get patterns by type
 * @param {string} subtestId - ID subtest
 * @param {string} type - Pattern type (text, function, table, etc.)
 * @returns {Array} Filtered patterns
 */
export function getPatternsByType(subtestId, type) {
  const patterns = QUESTION_PATTERNS[subtestId];
  if (!patterns) return [];
  
  return patterns.filter(p => p.type === type);
}

/**
 * Get pattern metadata summary
 * @returns {Object} Metadata about all patterns
 */
export function getPatternMetadata() {
  const metadata = {
    version: '2025.1',
    lastUpdated: '2026-03-12',
    totalPatterns: 0,
    distribution: {},
    levelDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  };
  
  for (const [subtest, patterns] of Object.entries(QUESTION_PATTERNS)) {
    metadata.distribution[subtest] = patterns.length;
    metadata.totalPatterns += patterns.length;
    
    for (const pattern of patterns) {
      for (const level of pattern.level) {
        metadata.levelDistribution[level]++;
      }
    }
  }
  
  return metadata;
}

export default QUESTION_PATTERNS;
