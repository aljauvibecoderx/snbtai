/**
 * QUESTION TEMPLATES - SNBT 2025 GENERALIZED TEMPLATES
 * 
 * This file now re-exports from the new generalized pattern library.
 * Legacy QUESTION_TEMPLATES structure maintained for backward compatibility.
 * 
 * @deprecated Use import from './questionPatterns' instead
 * 
 * File: src/utils/questionTemplates.js
 * Updated: 2026-03-12
 * Reference: Fixed.md, questionPatterns.js
 */

// Import new generalized patterns
import QUESTION_PATTERNS, { 
  getAllPatterns as getAllNewPatterns, 
  selectTemplate as selectNewTemplate,
  getPatternById as getNewPatternById
} from './questionPatterns';

// Re-export for backward compatibility with App.js
export const getAllPatterns = getAllNewPatterns;
export const selectTemplate = selectNewTemplate;
export const getPatternById = getNewPatternById;

// Legacy structure mapping (for backward compatibility)
export const QUESTION_TEMPLATES = {
  // 1. PEMAHAMAN BACAAN & MENULIS (PBM)
  tps_pbm: {
    patterns: getAllNewPatterns('tps_pbm').map(p => ({
      id: p.id,
      pattern: p.pattern,
      level: p.level,
      type: p.type
    }))
  },

  // 2. PENGETAHUAN & PEMAHAMAN UMUM (PPU)
  tps_ppu: {
    patterns: getAllNewPatterns('tps_ppu').map(p => ({
      id: p.id,
      pattern: p.pattern,
      level: p.level,
      type: p.type
    }))
  },

  // 3. PENALARAN UMUM (PU)
  tps_pu: {
    patterns: getAllNewPatterns('tps_pu').map(p => ({
      id: p.id,
      pattern: p.pattern,
      level: p.level,
      type: p.type
    }))
  },

  // 4. PENALARAN MATEMATIKA (PM)
  pm: {
    patterns: getAllNewPatterns('pm').map(p => ({
      id: p.id,
      pattern: p.pattern,
      level: p.level,
      type: p.type
    }))
  },

  // 5. LITERASI BAHASA INGGRIS (LBE)
  lit_ing: {
    patterns: getAllNewPatterns('lit_ing').map(p => ({
      id: p.id,
      pattern: p.pattern,
      level: p.level,
      type: p.type
    }))
  },

  // 6. PENGETAHUAN KUANTITATIF (PK)
  tps_pk: {
    patterns: getAllNewPatterns('tps_pk').map(p => ({
      id: p.id,
      pattern: p.pattern,
      level: p.level,
      type: p.type
    }))
  },

  // 7. LITERASI BAHASA INDONESIA (LBI)
  lit_ind: {
    patterns: getAllNewPatterns('lit_ind').map(p => ({
      id: p.id,
      pattern: p.pattern,
      level: p.level,
      type: p.type
    }))
  }
};

/**
 * @deprecated Use import from './questionPatterns' instead
 * Legacy selectTemplate function - now wraps new implementation
 */
export function selectTemplateLegacy(subtestId, complexityLevel) {
  return selectNewTemplate(subtestId, complexityLevel);
}

/**
 * @deprecated Use import from './questionPatterns' instead
 * Legacy getAllPatterns function - now wraps new implementation
 */
export function getAllPatternsLegacy(subtestId) {
  return getAllNewPatterns(subtestId);
}

/**
 * Generate prompt using template - wraps new implementation
 * @param {Object} template - Template pattern object
 * @param {Object} variables - Variables to fill in template
 * @returns {string} Generated prompt
 */
export function generatePromptWithTemplate(template, variables = {}) {
  if (!template) return '';
  
  // Import from new service (correct relative path)
  import('../services/ai/promptTemplates').then(({ generatePromptFromPattern }) => {
    return generatePromptFromPattern(template, variables);
  }).catch(() => {
    // Fallback to simple template filling
    return fillTemplateSimple(template, variables);
  });
}

/**
 * Simple template filling fallback
 * @param {Object} template - Template pattern
 * @param {Object} variables - Variables
 * @returns {string} Filled template
 */
function fillTemplateSimple(template, variables) {
  let prompt = '';
  
  if (template.template?.stimulus) {
    prompt += `Stimulus: ${fillTemplateString(template.template.stimulus, variables)}\n\n`;
  }
  
  if (template.template?.text) {
    prompt += `Question: ${fillTemplateString(template.template.text, variables)}\n\n`;
  }
  
  if (template.template?.options) {
    prompt += `Options:\n`;
    template.template.options.forEach((opt, i) => {
      prompt += `${String.fromCharCode(65 + i)}. ${fillTemplateString(opt, variables)}\n`;
    });
  }
  
  return prompt;
}

/**
 * Fill template string placeholders
 * @param {string} template - Template string with {{placeholders}}
 * @param {Object} variables - Variables object
 * @returns {string} Filled template
 */
function fillTemplateString(template, variables) {
  if (!template) return '';
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] || match;
  });
}

export default QUESTION_TEMPLATES;
