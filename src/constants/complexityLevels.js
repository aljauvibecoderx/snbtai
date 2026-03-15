/**
 * Complexity levels for question generation
 * Each level represents increasing difficulty and cognitive demand
 */
export const COMPLEXITY_LEVELS = [
  { 
    level: 0, 
    label: 'Level 0: Adaptive', 
    desc: 'AI memilih pola paling sesuai permintaan.' 
  },
  { 
    level: 1, 
    label: 'Level 1: Dasar', 
    desc: 'Pemahaman literal.' 
  },
  { 
    level: 2, 
    label: 'Level 2: Sederhana', 
    desc: 'Satu langkah logika.' 
  },
  { 
    level: 3, 
    label: 'Level 3: Menengah', 
    desc: 'Inferensi multi-langkah.' 
  },
  { 
    level: 4, 
    label: 'Level 4: Sulit', 
    desc: 'Abstraksi tinggi.' 
  },
  { 
    level: 5, 
    label: 'Level 5: Pakar (HOTS)', 
    desc: 'Analisis kompleks.' 
  }
];

/**
 * Get complexity level by level number
 * @param {number} level - The complexity level (0-5)
 * @returns {Object} Complexity level object
 */
export const getComplexityLevel = (level) => {
  return COMPLEXITY_LEVELS.find(cl => cl.level === level) || COMPLEXITY_LEVELS[0];
};
