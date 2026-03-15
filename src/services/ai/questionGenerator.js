/**
 * AI Question Generation Integration Layer
 * 
 * File: src/services/ai/questionGenerator.js
 * Created: 2026-03-12
 * Purpose: Bridge between App.js and new generalized template system
 * Reference: Fixed.md, promptTemplates.js
 */

import { 
  selectTemplate, 
  getAllPatterns, 
  getPatternById 
} from '../../utils/questionPatterns';

import { 
  generatePromptFromPattern, 
  SYSTEM_PROMPT,
  SUBTEST_INSTRUCTIONS,
  evaluateQuestionQuality 
} from './promptTemplates';

/**
 * Generate enhanced prompt using new generalized templates
 * This function replaces the legacy prompt generation in App.js
 * 
 * @param {string} subtestId - Subtest ID (tps_pu, tps_pk, pm, etc.)
 * @param {number} complexity - Complexity level (0-5)
 * @param {string} context - Context/input text for question generation
 * @param {string} subtestLabel - Human-readable subtest label
 * @param {string} specificInstructions - Optional specific instructions from user
 * @returns {Object} Generation result with prompt and metadata
 */
export const generateEnhancedPrompt = (
  subtestId, 
  complexity, 
  context, 
  subtestLabel, 
  specificInstructions = ''
) => {
  // Get all patterns for this subtest
  const allPatterns = getAllPatterns(subtestId);
  
  // Filter patterns by complexity level
  const suitablePatterns = complexity === 0 
    ? allPatterns 
    : allPatterns.filter(p => p.level.includes(complexity));
  
  // Select pattern (random from suitable ones)
  const selectedPattern = suitablePatterns.length > 0 
    ? suitablePatterns[Math.floor(Math.random() * suitablePatterns.length)]
    : null;
  
  // Generate pattern list for prompt
  const patternList = suitablePatterns
    .map(p => `- "${p.pattern}" (Tipe: ${p.type}, Level: ${p.level.join('-')})`)
    .join('\n');
  
  // Generate base prompt using new template system
  const basePrompt = selectedPattern 
    ? generatePromptFromPattern(selectedPattern, {
        context: context?.substring(0, 500) || 'Not provided',
        subtestLabel,
        complexity
      })
    : '';
  
  // Build enhanced prompt with legacy compatibility
  const enhancedPrompt = buildEnhancedPrompt(
    basePrompt,
    selectedPattern,
    patternList,
    context,
    subtestLabel,
    complexity,
    specificInstructions
  );
  
  return {
    prompt: enhancedPrompt,
    systemPrompt: SYSTEM_PROMPT,
    selectedPattern,
    patternCount: suitablePatterns.length,
    allPatterns: suitablePatterns
  };
};

/**
 * Build enhanced prompt combining new and legacy systems
 */
function buildEnhancedPrompt(
  basePrompt,
  selectedPattern,
  patternList,
  context,
  subtestLabel,
  complexity,
  specificInstructions
) {
  const subtestInfo = SUBTEST_INSTRUCTIONS[selectedPattern?.subtest || 'tps_pu'] || {};
  
  let prompt = `
=== SYSTEM: ENHANCED SNBT 2025 QUESTION GENERATOR ===
Using Generalized Template System v2025.1

${specificInstructions ? `=== USER SPECIFIC INSTRUCTIONS ===
${specificInstructions}

` : ''}
=== SUBTEST INFORMATION ===
Subtest: ${subtestLabel}
Level: ${complexity === 0 ? 'Adaptive (AI chooses)' : getLevelLabel(complexity)}
Focus: ${subtestInfo.focus || 'General SNBT competency'}

=== SELECTED PATTERN ===
${selectedPattern ? `
Pattern ID: ${selectedPattern.id}
Pattern Name: ${selectedPattern.pattern}
Concept Tested: ${selectedPattern.konsep || 'Not specified'}
Question Type: ${selectedPattern.type}
Context Variations: ${selectedPattern.contextVariations?.join(', ') || 'Multiple'}
` : 'No specific pattern selected (using general generation)'}

=== AVAILABLE PATTERNS FOR THIS LEVEL ===
${patternList}

${basePrompt}

=== CONTEXT INPUT ===
${context?.substring(0, 2000) || 'No context provided'}

=== GENERATION REQUIREMENTS ===
1. Follow the template structure from the selected pattern
2. Ensure difficulty matches level ${complexity === 0 ? '(adaptive)' : complexity}
3. Create ${selectedPattern?.template?.options?.length || 5} answer options
4. Include clear explanation with LaTeX if needed
5. Use proper escaping for JSON output

${getSpecialTypeInstructions(selectedPattern?.type)}

=== OUTPUT FORMAT ===
Return valid JSON with structure:
{
  "stimulus": "...",
  "representation": { "type": "...", "data": {...} },
  "text": "...",
  "options": ["A", "B", "C", "D", "E"],
  "correctIndex": 0,
  "explanation": "..."
}
`;

  return prompt;
}

/**
 * Get level label from number
 */
function getLevelLabel(level) {
  const labels = {
    0: 'Adaptive',
    1: 'Dasar (Basic)',
    2: 'Sederhana (Simple)',
    3: 'Menengah (Intermediate)',
    4: 'Sulit (Advanced)',
    5: 'Pakar/HOTS (Expert)'
  };
  return labels[level] || 'Unknown';
}

/**
 * Get special instructions for specific question types
 */
function getSpecialTypeInstructions(type) {
  const instructions = {
    'pq_comparison': `
⚠️ SPECIAL: P vs Q Comparison Question
- Use exactly these options: ["P > Q", "Q > P", "P = Q", "Tidak dapat ditentukan"]
- Include mathematical expressions in LaTeX: $P = x^2$, $Q = y^2$`,
    
    'data_sufficiency': `
⚠️ SPECIAL: Data Sufficiency Question
- Include two statements (1) and (2)
- Use standard DS options (A-E)
- Test whether each statement alone or together is sufficient`,
    
    'grid_boolean': `
⚠️ SPECIAL: Grid Boolean Question
- Create 3-5 statements to evaluate
- Use field "grid_data" with structure: [{"statement": "...", "correct_answer": true/false}]
- Set "options": [] and "correctIndex": -1`,
    
    'flowchart': `
⚠️ SPECIAL: Flowchart Algorithm Question
- Define nodes with id, type, label, row, col
- Define edges with from, to, and optional label
- Use LaTeX in labels: $x = a + 5$`,
    
    'thread': `
⚠️ SPECIAL: Thread Discussion (English Literacy)
- Create 3-4 posts with different authors and opinions
- Structure: {type: "thread", data: {posts: [...]}}
- All content in English`
  };
  
  return instructions[type] || '';
}

/**
 * Validate generated question against pattern requirements
 * @param {Object} question - Generated question
 * @param {Object} pattern - Pattern used
 * @returns {Object} Validation result
 */
export const validateQuestion = (question, pattern) => {
  const evaluation = evaluateQuestionQuality(question, pattern);
  
  // Additional type-specific validations
  const typeValidations = {
    'pq_comparison': () => {
      return question.options?.length === 4 &&
             question.options.includes('P > Q') &&
             question.options.includes('P = Q');
    },
    
    'data_sufficiency': () => {
      return question.statements?.length === 2 &&
             question.options?.length === 5;
    },
    
    'grid_boolean': () => {
      return question.grid_data?.length >= 3 &&
             question.grid_data?.length <= 5 &&
             question.correctIndex === -1;
    }
  };
  
  const typeValidation = typeValidations[question.type || pattern?.type];
  if (typeValidation && !typeValidation()) {
    evaluation.passed = false;
    evaluation.issues.push(`Type-specific validation failed for ${question.type || pattern?.type}`);
  }
  
  return evaluation;
};

/**
 * Get pattern statistics for UI display
 * @param {string} subtestId
 * @returns {Object} Pattern statistics
 */
export const getPatternStats = (subtestId) => {
  const patterns = getAllPatterns(subtestId);
  
  const stats = {
    total: patterns.length,
    byLevel: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    byType: {},
    levels: []
  };
  
  patterns.forEach(p => {
    p.level.forEach(l => {
      if (stats.byLevel[l] !== undefined) {
        stats.byLevel[l]++;
      }
    });
    
    stats.byType[p.type] = (stats.byType[p.type] || 0) + 1;
  });
  
  stats.levels = Object.entries(stats.byLevel)
    .filter(([_, count]) => count > 0)
    .map(([level, count]) => ({
      level: parseInt(level),
      count,
      label: getLevelLabel(parseInt(level))
    }));
  
  return stats;
};

export default {
  generateEnhancedPrompt,
  validateQuestion,
  getPatternStats,
  selectTemplate,
  getAllPatterns,
  getPatternById
};
