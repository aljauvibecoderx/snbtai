/**
 * Question Patterns Data for UI
 * Extracted from src/utils/questionPatterns.js
 * 
 * This file provides structured data for the SNBT Question Patterns page
 */

import { QUESTION_PATTERNS, getPatternMetadata } from '../utils/questionPatterns';

// ============================================================================
// QUESTION TYPES DEFINITIONS
// ============================================================================

export const QUESTION_TYPES = [
  {
    id: 'multiple_choice',
    name: 'Pilihan Ganda',
    code: 'PG',
    description: 'Pilih satu jawaban benar dari 5 opsi (A, B, C, D, E)',
    icon: '📝',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    mechanism: {
      type: 'single_select',
      options: 5,
      labels: ['A', 'B', 'C', 'D', 'E'],
      instruction: 'Pilih satu jawaban yang paling tepat'
    },
    example: {
      stimulus: 'Jika 2x + 3 = 11, maka nilai x adalah...',
      options: ['3', '4', '5', '6', '7'],
      correctIndex: 1
    }
  },
  {
    id: 'multiple_select',
    name: 'Pilihan Ganda Kompleks',
    code: 'PGK',
    description: 'Pilih semua jawaban yang benar (bisa lebih dari satu)',
    icon: '✅',
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
    mechanism: {
      type: 'multiple_select',
      options: 'variable',
      labels: ['1', '2', '3', '4', '5'],
      instruction: 'Pilih semua pernyataan yang benar'
    },
    example: {
      stimulus: 'Manakah dari bilangan berikut yang merupakan bilangan prima?',
      options: ['4', '5', '6', '7', '9'],
      correctIndexes: [1, 3]
    }
  },
  {
    id: 'grid_boolean',
    name: 'Benar/Salah Grid',
    code: 'BSG',
    description: 'Tentukan kebenaran setiap pernyataan dengan memilih Ya atau Tidak',
    icon: '⊞',
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-600',
    borderColor: 'border-violet-200',
    mechanism: {
      type: 'grid_boolean',
      format: 'table',
      columns: ['Pernyataan', 'Ya', 'Tidak'],
      instruction: 'Pilih Ya atau Tidak untuk setiap pernyataan'
    },
    example: {
      stimulus: 'Tentukan kebenaran pernyataan berikut:',
      statements: [
        '2 + 2 = 4',
        '5 × 3 = 20',
        '10 ÷ 2 = 5'
      ],
      correctAnswers: [true, false, true]
    }
  },
  {
    id: 'pq_comparison',
    name: 'Perbandingan Kuantitas',
    code: 'PK',
    description: 'Bandingkan dua kuantitas (P dan Q) dan tentukan hubungannya',
    icon: '⚖️',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    borderColor: 'border-amber-200',
    mechanism: {
      type: 'comparison',
      options: 4,
      labels: ['A', 'B', 'C', 'D'],
      standardOptions: [
        'P > Q',
        'Q > P',
        'P = Q',
        'Tidak dapat ditentukan'
      ],
      instruction: 'Bandingkan kuantitas P dan Q'
    },
    example: {
      stimulus: '',
      p_value: 'x = 3',
      q_value: 'y = 2x + 1',
      options: [
        'P > Q',
        'Q > P',
        'P = Q',
        'Tidak dapat ditentukan'
      ],
      correctIndex: 1
    }
  },
  {
    id: 'data_sufficiency',
    name: 'Kecukupan Data',
    code: 'KD',
    description: 'Evaluasi apakah data yang diberikan cukup untuk menjawab pertanyaan',
    icon: '📊',
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-600',
    borderColor: 'border-rose-200',
    mechanism: {
      type: 'sufficiency',
      options: 5,
      labels: ['A', 'B', 'C', 'D', 'E'],
      standardOptions: [
        'Pernyataan (1) saja cukup, tetapi pernyataan (2) saja tidak cukup',
        'Pernyataan (2) saja cukup, tetapi pernyataan (1) saja tidak cukup',
        'Kedua pernyataan bersama-sama cukup, tetapi masing-masing saja tidak cukup',
        'Setiap pernyataan saja cukup',
        'Kedua pernyataan tidak cukup'
      ],
      instruction: 'Putuskan apakah pernyataan (1) dan (2) cukup untuk menjawab pertanyaan'
    },
    example: {
      question: 'Berapakah nilai x?',
      statements: [
        'x + y = 10',
        'y = 4'
      ],
      correctIndex: 2
    }
  }
];

// ============================================================================
// SUBTEST CONFIGURATION
// ============================================================================

export const SUBTEST_CONFIG = {
  tps_pu: {
    id: 'tps_pu',
    name: 'Penalaran Umum',
    code: 'PU',
    icon: '🧠',
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-600',
    borderColor: 'border-violet-200',
    description: 'Menguji kemampuan logika, inferensi, dan analisis sebab-akibat',
    timeAllocation: '15 menit',
    totalQuestions: '~12 soal'
  },
  tps_ppu: {
    id: 'tps_ppu',
    name: 'Pengetahuan & Pemahaman Umum',
    code: 'PPU',
    icon: '📖',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    description: 'Menguji pemahaman kosakata, ide pokok, dan hubungan gagasan',
    timeAllocation: '20 menit',
    totalQuestions: '~14 soal'
  },
  tps_pbm: {
    id: 'tps_pbm',
    name: 'Pemahaman Bacaan & Menulis',
    code: 'PBM',
    icon: '✍️',
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
    description: 'Menguji ejaan, tanda baca, dan efektivitas kalimat',
    timeAllocation: '20 menit',
    totalQuestions: '~14 soal'
  },
  tps_pk: {
    id: 'tps_pk',
    name: 'Pengetahuan Kuantitatif',
    code: 'PK',
    icon: '🔢',
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    borderColor: 'border-orange-200',
    description: 'Menguji logika matematika, perbandingan kuantitas, dan kecukupan data',
    timeAllocation: '20 menit',
    totalQuestions: '~12 soal'
  },
  pm: {
    id: 'pm',
    name: 'Penalaran Matematika',
    code: 'PM',
    icon: '📈',
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-600',
    borderColor: 'border-rose-200',
    description: 'Menguji aplikasi matematika dalam konteks kehidupan nyata',
    timeAllocation: '20 menit',
    totalQuestions: '~10 soal'
  },
  lit_ind: {
    id: 'lit_ind',
    name: 'Literasi Bahasa Indonesia',
    code: 'LBI',
    icon: '📚',
    color: 'from-amber-500 to-yellow-600',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    borderColor: 'border-amber-200',
    description: 'Menguji pemahaman dan analisis teks Bahasa Indonesia',
    timeAllocation: '20 menit',
    totalQuestions: '~12 soal'
  },
  lit_ing: {
    id: 'lit_ing',
    name: 'Literasi Bahasa Inggris',
    code: 'LBE',
    icon: '🌐',
    color: 'from-indigo-500 to-blue-600',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    borderColor: 'border-indigo-200',
    description: 'Menguji pemahaman dan analisis teks Bahasa Inggris',
    timeAllocation: '20 menit',
    totalQuestions: '~12 soal'
  }
};

// ============================================================================
// LEVEL CONFIGURATION
// ============================================================================

export const LEVEL_CONFIG = [
  { 
    level: 0, 
    label: 'Adaptive', 
    difficulty: 'AI Choice',
    description: 'AI memilih tingkat kesulitan berdasarkan performa',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  { 
    level: 1, 
    label: 'Dasar', 
    difficulty: 'Mudah',
    description: 'Pemahaman literal dan ingatan',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  { 
    level: 2, 
    label: 'Sederhana', 
    difficulty: 'Menengah Bawah',
    description: 'Satu langkah logika',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200'
  },
  { 
    level: 3, 
    label: 'Menengah', 
    difficulty: 'Menengah Atas',
    description: 'Inferensi berlapis',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  { 
    level: 4, 
    label: 'Sulit', 
    difficulty: 'Sulit',
    description: 'Abstraksi dan analisis kompleks',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  { 
    level: 5, 
    label: 'Pakar (HOTS)', 
    difficulty: 'Sangat Sulit',
    description: 'Evaluasi dan kreasi',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200'
  }
];

// ============================================================================
// EXTRACTED PATTERNS FOR UI
// ============================================================================

/**
 * Transform patterns for UI consumption
 * @returns {Object} Transformed patterns by subtest
 */
export function getTransformedPatterns() {
  const transformed = {};
  
  for (const [subtestId, patterns] of Object.entries(QUESTION_PATTERNS)) {
    transformed[subtestId] = patterns.map((pattern, index) => ({
      id: pattern.id,
      name: pattern.pattern,
      description: pattern.konsep,
      levels: pattern.level,
      type: pattern.type,
      template: pattern.template,
      contextVariations: pattern.contextVariations || [],
      example: generateExampleFromTemplate(pattern)
    }));
  }
  
  return transformed;
}

/**
 * Generate example question from pattern template
 * @param {Object} pattern - Pattern object
 * @returns {Object} Example question
 */
function generateExampleFromTemplate(pattern) {
  const template = pattern.template;
  
  // Create placeholder examples based on template structure
  const example = {
    stimulus: template.stimulus || 'Contoh stimulus',
    text: template.text || 'Contoh pertanyaan',
    options: template.options || ['Opsi A', 'Opsi B', 'Opsi C', 'Opsi D', 'Opsi E'],
    type: pattern.type
  };
  
  // Add representation if exists
  if (template.representation) {
    example.representation = template.representation;
  }
  
  return example;
}

// ============================================================================
// PATTERN STATISTICS
// ============================================================================

export const PATTERN_STATS = {
  totalPatterns: 109,
  distribution: {
    tps_pu: 14,
    tps_ppu: 19,
    tps_pbm: 19,
    tps_pk: 16,
    pm: 12,
    lit_ind: 13,
    lit_ing: 20
  },
  levelDistribution: {
    1: 45,
    2: 67,
    3: 78,
    4: 52,
    5: 23
  },
  typeDistribution: {
    text: 65,
    table: 12,
    chart: 8,
    function: 10,
    grid_boolean: 6,
    pq_comparison: 4,
    data_sufficiency: 4
  }
};

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  QUESTION_TYPES,
  SUBTEST_CONFIG,
  LEVEL_CONFIG,
  PATTERN_STATS,
  getTransformedPatterns
};
