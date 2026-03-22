/**
 * Placeholder Replacer Utility
 * 
 * Converts template placeholders like {{strengthen_or_weaken}} into readable text
 * for display in the UI without exposing template syntax to users.
 * 
 * File: src/utils/placeholderReplacer.js
 * Created: 2026-03-14
 */

/**
 * Dictionary of placeholder replacements
 * Maps template variables to readable example text
 */
const PLACEHOLDER_REPLACEMENTS = {
  // Argument strength placeholders
  strengthen_or_weaken: 'memperkuat atau melemahkan',
  party: 'pihak terkait',
  argument_A: 'Pihak A',
  argument_B: 'Pihak B',
  claim: 'klaim tertentu',
  response: 'tanggapan',
  strongest_support: 'Bukti kuat yang mendukung argumen',
  weak_support: 'Bukti lemah yang mendukung argumen',
  irrelevant_to_argument: 'Informasi yang tidak relevan dengan argumen',
  slightly_weakens: 'Informasi yang sedikit melemahkan argumen',
  strongly_undermines: 'Informasi yang sangat melemahkan argumen',
  
  // Inference placeholders
  context: 'Konteks situasi atau fenomena',
  correct_inference: 'Simpulan yang langsung didukung oleh teks',
  plausible_but_wrong: 'Simpulan yang masuk akal tetapi tidak didukung teks',
  contradicts_text: 'Simpulan yang bertentangan dengan teks',
  irrelevant: 'Simpulan yang tidak relevan',
  extreme_statement: 'Simpulan yang terlalu ekstrem',
  complex_text: 'Teks yang kompleks dengan informasi berlapis',
  most_likely_inference: 'Simpulan yang paling mungkin benar',
  possible_but_less_likely: 'Simpulan yang mungkin tetapi kurang kuat',
  contradicts_evidence: 'Simpulan yang bertentangan dengan bukti',
  not_supported_by_text: 'Simpulan yang tidak didukung oleh teks',
  too_extreme: 'Simpulan yang terlalu luas atau ekstrem',
  
  // Causation placeholders
  cause_statement: 'Pernyataan penyebab',
  effect_statement: 'Pernyataan akibat',
  phenomenon: 'fenomena tersebut',
  most_likely_cause: 'Penyebab yang paling mungkin',
  possible_but_unlikely: 'Penyebab yang mungkin tetapi kurang tepat',
  correlation_not_causation: 'Korelasi yang bukan sebab-akibat',
  reverse_causation: 'Hubungan sebab-akibat terbalik',
  irrelevant_factor: 'Faktor yang tidak relevan',
  
  // Data placeholders
  data_statistic: 'Data statistik atau informasi numerik',
  representation_type: 'jenis representasi',
  data_content: 'isi data',
  quantitative_question: 'Pertanyaan kuantitatif',
  numeric_options: 'Opsi numerik',
  observation_data: 'Data hasil observasi',
  pattern_type: 'jenis pola',
  valid_generalization: 'Generalisasi yang valid berdasarkan data',
  hasty_generalization: 'Generalisasi yang terburu-buru',
  too_broad: 'Generalisasi yang terlalu luas',
  too_narrow: 'Generalisasi yang terlalu sempit',
  contradicts_data: 'Pernyataan yang bertentangan dengan data',
  scenario_description: 'Deskripsi skenario',
  condition: 'kondisi tertentu',
  most_likely_outcome: 'Hasil yang paling mungkin terjadi',
  possible_outcome: 'Hasil yang mungkin terjadi',
  unlikely_outcome: 'Hasil yang tidak mungkin terjadi',
  opposite_outcome: 'Hasil yang berlawanan',
  irrelevant_outcome: 'Hasil yang tidak relevan',
  information_text: 'Teks informasi',
  definitely_false: 'Pernyataan yang pasti salah',
  possibly_true: 'Pernyataan yang mungkin benar',
  cannot_be_determined: 'Pernyataan yang tidak dapat ditentukan',
  partially_true: 'Pernyataan yang sebagian benar',
  misleading: 'Pernyataan yang menyesatkan',
  data_description: 'Deskripsi data',
  chart_data: 'Data grafik',
  trend_question: 'Pertanyaan tentang tren',
  trend_options: 'Opsi tren',
  comparison_context: 'Konteks perbandingan',
  comparison_table: 'Tabel perbandingan',
  comparison_question: 'Pertanyaan perbandingan',
  comparison_options: 'Opsi perbandingan',
  data_with_numbers: 'Data dengan angka',
  target_value: 'nilai target',
  approximate_options: 'Opsi pendekatan',
  phenomenon_A: 'Fenomena A',
  phenomenon_B: 'Fenomena B',
  common_cause: 'Penyebab bersama yang menjelaskan kedua fenomena',
  coincidental: 'Kebetulan yang tidak berkaitan',
  one_causes_other: 'Satu fenomena menyebabkan fenomena lain',
  reverse_causation: 'Hubungan sebab-akibat terbalik',
  unrelated: 'Faktor yang tidak berkaitan',
  information_set: 'Set informasi',
  best_conclusion: 'Kesimpulan yang paling tepat',
  acceptable_conclusion: 'Kesimpulan yang dapat diterima',
  weak_conclusion: 'Kesimpulan yang lemah',
  overgeneralization: 'Generalisasi yang berlebihan',
  irrelevant_conclusion: 'Kesimpulan yang tidak relevan',
  data_set: 'Set data',
  data_table: 'Tabel data',
  extremum_question: 'Pertanyaan tentang nilai ekstrem',
  extremum_options: 'Opsi nilai ekstrem',
  
  // PPU placeholders
  text_with_affix: 'Teks dengan imbuhan tertentu',
  affix: 'imbuhan',
  target_word: 'kata target',
  correct_parallel: 'Kalimat paralel dengan makna yang sama',
  same_affix_different_meaning: 'Imbuhan sama dengan makna berbeda',
  different_affix: 'Imbuhan yang berbeda',
  unrelated_word: 'Kata yang tidak berkaitan',
  opposite_meaning: 'Makna yang berlawanan',
  sentence_A: 'Kalimat A',
  sentence_B: 'Kalimat B',
  num_A: 'A',
  num_B: 'B',
  conjunction_options: 'Opsi konjungsi',
  sentence_with_blank: 'Kalimat dengan bagian rumpang',
  word_type: 'jenis kata',
  word_options: 'Opsi kata',
  paragraph_with_words: 'Paragraf dengan beberapa kata',
  sentence_options: 'Opsi kalimat',
  text_with_target_word: 'Teks dengan kata target',
  synonym_options: 'Opsi sinonim',
  text_with_phrase: 'Teks dengan frasa',
  association_options: 'Opsi asosiasi',
  text_with_ke_an: 'Teks dengan kata berimbuhan ke-an',
  word: 'kata',
  parallel_sentence_options: 'Opsi kalimat paralel',
  paragraph_1: 'Paragraf 1',
  parallel_problem_options: 'Opsi masalah paralel',
  informative_text: 'Teks informatif',
  information_options: 'Opsi informasi',
  text: 'Teks',
  statement_options: 'Opsi pernyataan',
  explanation_text: 'Teks penjelasan',
  parallel_explanation_options: 'Opsi penjelasan paralel',
  paragraph: 'Paragraf',
  main_idea_options: 'Opsi gagasan utama',
  sentence_with_word: 'Kalimat dengan kata',
  register_options: 'Opsi ragam bahasa',
  text_with_figures: 'Teks dengan gaya bahasa',
  figure_type: 'jenis gaya bahasa',
  incomplete_text: 'Teks yang tidak lengkap',
  continuation_options: 'Opsi kelanjutan',
  original_sentence: 'Kalimat asli',
  reformulation_options: 'Opsi reformulasi',
  reference_sentence: 'Kalimat referensi',
  pattern_options: 'Opsi pola',
  text_with_sentences: 'Teks dengan beberapa kalimat',
  
  // PBM placeholders
  text_with_bold_words: 'Teks dengan kata-kata bercetak tebal',
  text_with_errors: 'Teks dengan kesalahan',
  correction_options: 'Opsi perbaikan',
  text_with_gap: 'Teks dengan bagian rumpang',
  num: 'nomor',
  completion_options: 'Opsi pelengkap',
  paragraph_with_blanks: 'Paragraf dengan bagian rumpang',
  addition_options: 'Opsi penambahan',
  text_with_numbered_sentences: 'Teks dengan kalimat bernomor',
  improvement_options: 'Opsi perbaikan',
  two_sentences: 'Dua kalimat',
  combination_options: 'Opsi gabungan',
  text_with_conjunctions: 'Teks dengan konjungsi',
  redundant_sentence: 'Kalimat redundan',
  concise_options: 'Opsi ringkas',
  
  // PM (Penalaran Matematika) placeholders
  function_definition: 'Definisi fungsi',
  input_value: 'Nilai input',
  function_options: 'Opsi fungsi',
  geometric_context: 'Konteks geometri',
  measurement_question: 'Pertanyaan pengukuran',
  numeric_answer_options: 'Opsi jawaban numerik',
  optimization_context: 'Konteks optimasi',
  objective_function: 'Fungsi tujuan',
  constraint: 'Kendala',
  maximum_or_minimum: 'nilai maksimum atau minimum',
  optimization_options: 'Opsi optimasi',
  sequence_context: 'Konteks barisan/deret',
  sequence_question: 'Pertanyaan tentang barisan',
  sequence_options: 'Opsi barisan',
  probability_context: 'Konteks peluang',
  probability_question: 'Pertanyaan peluang',
  probability_options: 'Opsi peluang',
  statistical_context: 'Konteks statistika',
  statistical_question: 'Pertanyaan statistika',
  statistical_options: 'Opsi statistika',
  algebraic_context: 'Konteks aljabar',
  algebraic_equation: 'Persamaan aljabar',
  algebraic_options: 'Opsi aljabar',
  
  // PK (Pengetahuan Kuantitatif) placeholders
  quantity_context: 'Konteks kuantitas',
  p_expression: 'Ekspresi untuk P',
  q_expression: 'Ekspresi untuk Q',
  comparison_options: 'Opsi perbandingan',
  sufficiency_context: 'Konteks kecukupan data',
  question_to_answer: 'Pertanyaan yang harus dijawab',
  statement_1: 'Pernyataan (1)',
  statement_2: 'Pernyataan (2)',
  sufficiency_options: 'Opsi kecukupan',
  grid_context: 'Konteks grid',
  grid_statements: 'Pernyataan-pernyataan',
  boolean_question: 'Pertanyaan benar/salah',
  
  // Literasi placeholders
  passage: 'Teks bacaan',
  passage_with_sentence: 'Teks dengan kalimat tertentu',
  restate_options: 'Opsi pernyataan ulang',
  passage_with_word: 'Teks dengan kata tertentu',
  replacement_options: 'Opsi penggantian',
  passage_with_statement: 'Teks dengan pernyataan',
  text_2: 'Teks 2',
  purpose_options: 'Opsi tujuan',
  multi_author_text: 'Teks dengan beberapa penulis',
  implication: 'implikasi',
  author_options: 'Opsi penulis',
  tone_options: 'Opsi nada',
  argumentative_passage: 'Teks argumentatif',
  motivation_options: 'Opsi motivasi',
  text_with_question: 'Teks dengan pertanyaan',
  explicit_options: 'Opsi informasi eksplisit',
  word_in_context: 'Kata dalam konteks',
  meaning_options: 'Opsi makna',
  causal_question: 'Pertanyaan sebab-akibat',
  causal_options: 'Opsi sebab-akibat',
  english_passage: 'Teks bahasa Inggris',
  detail_options: 'Opsi detail',
  main_idea_question: 'Pertanyaan gagasan utama',
  inference_options: 'Opsi inferensi',
  vocabulary_context: 'Kata dalam konteks',
  vocabulary_options: 'Opsi kosakata'
};

/**
 * Replace placeholders in a string with readable text
 * @param {string} text - Text containing placeholders like {{placeholder}}
 * @param {Object} customReplacements - Optional custom replacements
 * @returns {string} Text with placeholders replaced
 */
export function replacePlaceholders(text, customReplacements = {}) {
  if (!text || typeof text !== 'string') {
    return text || '';
  }

  // Merge default and custom replacements
  const replacements = { ...PLACEHOLDER_REPLACEMENTS, ...customReplacements };

  // Replace all {{placeholder}} patterns
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return replacements[key] || formatKeyAsText(key);
  });
}

/**
 * Format a placeholder key as readable text
 * e.g., "strengthen_or_weaken" -> "strengthen or weaken"
 * @param {string} key - Placeholder key
 * @returns {string} Formatted text
 */
function formatKeyAsText(key) {
  return key.replace(/_/g, ' ');
}

/**
 * Replace placeholders in a template object (recursive)
 * @param {Object|string} template - Template object or string
 * @param {Object} customReplacements - Custom replacements
 * @returns {Object|string} Processed template
 */
export function replacePlaceholdersInTemplate(template, customReplacements = {}) {
  if (!template) {
    return template;
  }

  if (typeof template === 'string') {
    return replacePlaceholders(template, customReplacements);
  }

  if (Array.isArray(template)) {
    return template.map(item => replacePlaceholdersInTemplate(item, customReplacements));
  }

  if (typeof template === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(template)) {
      result[key] = replacePlaceholdersInTemplate(value, customReplacements);
    }
    return result;
  }

  return template;
}

/**
 * Process pattern for display - removes placeholders from examples
 * @param {Object} pattern - Pattern object from questionPatterns
 * @returns {Object} Processed pattern with readable text
 */
export function processPatternForDisplay(pattern) {
  if (!pattern) return null;

  const processed = { ...pattern };

  // Process template if exists
  if (pattern.template) {
    processed.displayTemplate = replacePlaceholdersInTemplate(pattern.template);
  }

  // Process example if exists
  if (pattern.example) {
    processed.displayExample = replacePlaceholdersInTemplate(pattern.example);
  }

  return processed;
}

export default {
  replacePlaceholders,
  replacePlaceholdersInTemplate,
  processPatternForDisplay,
  PLACEHOLDER_REPLACEMENTS
};
