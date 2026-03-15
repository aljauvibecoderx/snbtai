/**
 * AI PROMPT TEMPLATES FOR QUESTION GENERATION
 * 
 * File: src/services/ai/promptTemplates.js
 * Created: 2026-03-12
 * Reference: Fixed.md, questionPatterns.js
 * 
 * These templates are used to generate prompts for AI question generation
 * based on the generalized question patterns.
 */

import { QUESTION_PATTERNS, getPatternById } from '../../utils/questionPatterns';

/**
 * System prompt for AI question generation
 */
export const SYSTEM_PROMPT = `You are an expert SNBT 2025 question generator. Your task is to create high-quality questions based on the given template and context.

IMPORTANT GUIDELINES:
1. Follow the template structure exactly
2. Use appropriate difficulty level (1-5) as specified
3. Ensure all options are plausible and well-distributed
4. Include clear, educational explanations
5. Use LaTeX for mathematical notation: $x^2$ for inline, $$\\frac{a}{b}$$ for display
6. Maintain consistency with SNBT 2025 standards
7. Avoid cultural, gender, or regional bias
8. Ensure Indonesian language uses proper PUEBI ejaan
9. For English literacy, use standard academic English
10. Make sure the correct answer is unambiguous

RESPONSE FORMAT:
You must return a JSON object with the following structure:
{
  "stimulus": "...",
  "representation": { "type": "...", "data": {...} },
  "text": "...",
  "options": ["A", "B", "C", "D", "E"],
  "correctIndex": 0,
  "explanation": "..."
}`;

/**
 * Subtest-specific instruction templates
 */
export const SUBTEST_INSTRUCTIONS = {
  tps_pu: {
    name: 'Penalaran Umum (Logical Reasoning)',
    instruction: 'Generate a Penalaran Umum question that tests logical inference, causation analysis, or data interpretation.',
    focus: 'Test ability to draw conclusions, identify cause-effect relationships, and interpret data',
    stimulusLength: {
      basic: '2-4 sentences for level 1-2',
      advanced: '4-6 sentences for level 3-5'
    },
    keySkills: [
      'Direct inference from text',
      'Causal reasoning',
      'Data interpretation from tables/charts',
      'Argument evaluation',
      'Generalization and prediction'
    ],
    commonContexts: [
      'Social phenomena',
      'Everyday situations',
      'Research findings',
      'Economic data',
      'Environmental issues'
    ]
  },
  
  tps_ppu: {
    name: 'Pengetahuan & Pemahaman Umum (General Knowledge & Understanding)',
    instruction: 'Generate a PPU question that tests understanding of word meanings, text structure, and logical relationships.',
    focus: 'Test morphological understanding, semantic relationships, and text analysis',
    stimulusLength: {
      basic: '1-3 sentences for vocabulary items',
      advanced: '1-2 paragraphs for analysis items'
    },
    keySkills: [
      'Affix meaning and usage',
      'Word choice in context',
      'Main idea identification',
      'Paragraph relationship analysis',
      'Figure of speech recognition'
    ],
    commonContexts: [
      'Academic texts',
      'News articles',
      'Literary texts',
      'Expository paragraphs'
    ]
  },
  
  tps_pbm: {
    name: 'Pemahaman Bacaan & Menulis (Reading Comprehension & Writing)',
    instruction: 'Generate a PBM question that tests editing skills, sentence effectiveness, and text coherence.',
    focus: 'Test knowledge of Indonesian spelling (PUEBI), punctuation, and effective sentence structure',
    stimulusLength: {
      basic: '2-5 sentences for spelling/punctuation',
      advanced: '1-2 paragraphs for text completion'
    },
    keySkills: [
      'Correct spelling (PUEBI)',
      'Punctuation usage',
      'Sentence effectiveness',
      'Text completion',
      'Conjunction usage'
    ],
    commonContexts: [
      'Scientific texts',
      'Formal documents',
      'Articles',
      'Academic writing'
    ]
  },
  
  tps_pk: {
    name: 'Pengetahuan Kuantitatif (Quantitative Knowledge)',
    instruction: 'Generate a PK question that tests mathematical reasoning, quantity comparison, or data sufficiency analysis.',
    focus: 'Test pure mathematical knowledge, logical reasoning, and data analysis',
    stimulusLength: {
      basic: 'Mathematical context with given conditions',
      advanced: 'Multi-step reasoning required'
    },
    keySkills: [
      'P vs Q comparison',
      'Data sufficiency evaluation',
      'Geometry (distance, area, volume)',
      'Number theory',
      'Statistics and probability',
      'Boolean statement verification'
    ],
    commonContexts: [
      'Algebra',
      'Geometry',
      'Number properties',
      'Functions',
      'Statistics'
    ],
    representationTypes: ['function', 'shape', 'table', 'grid_boolean']
  },
  
  pm: {
    name: 'Penalaran Matematika (Mathematical Reasoning)',
    instruction: 'Generate a PM question that applies mathematical concepts to real-world contexts.',
    focus: 'Test ability to model real situations mathematically and solve practical problems',
    stimulusLength: {
      basic: 'Short story context with numerical data',
      advanced: 'Complex scenario with multiple constraints'
    },
    keySkills: [
      'Linear optimization',
      'Arithmetic sequences',
      'Applied geometry',
      'Function modeling',
      'Conditional calculations',
      'Pattern recognition'
    ],
    commonContexts: [
      'Business and production',
      'Finance and savings',
      'Motion and time',
      'Resource allocation',
      'Population growth'
    ],
    representationTypes: ['function', 'table', 'chart', 'shape'],
    requirement: 'Always include mathematical representation (function, table, chart, or shape)'
  },
  
  lit_ind: {
    name: 'Literasi Bahasa Indonesia (Indonesian Literacy)',
    instruction: 'Generate a Literasi Indonesia question that tests deep comprehension and evaluation of Indonesian texts.',
    focus: 'Test ability to analyze implicit meanings, evaluate arguments, and understand author intent',
    stimulusLength: {
      basic: '1-2 paragraphs for explicit questions',
      advanced: '2-4 paragraphs for inference questions'
    },
    keySkills: [
      'Explicit information retrieval',
      'Implicit meaning inference',
      'Causal relationship analysis',
      'Solution recommendation',
      'Contextual word meaning'
    ],
    commonContexts: [
      'Expository texts',
      'Argumentative texts',
      'Problem-solution texts',
      'Comparative analyses'
    ]
  },
  
  lit_ing: {
    name: 'Literasi Bahasa Inggris (English Literacy)',
    instruction: 'Generate a Literasi Inggris question that tests comprehension of academic English texts.',
    focus: 'Test ability to understand main ideas, details, inferences, and vocabulary in context',
    stimulusLength: {
      basic: '1-2 paragraphs for detail questions',
      advanced: '2-4 paragraphs for inference questions'
    },
    keySkills: [
      'Main idea identification',
      'Detail retrieval',
      'Inference making',
      'Vocabulary in context',
      'Author purpose and tone',
      'Thread/discussion analysis'
    ],
    commonContexts: [
      'Academic passages',
      'Forum discussions',
      'Opinion essays',
      'News articles'
    ],
    languageRequirement: 'All content must be in standard academic English'
  }
};

/**
 * Generate AI prompt from pattern template
 * @param {Object} pattern - Pattern object from QUESTION_PATTERNS
 * @param {Object} context - Additional context variables
 * @returns {string} Complete prompt for AI
 */
export function generatePromptFromPattern(pattern, context = {}) {
  if (!pattern) {
    return SYSTEM_PROMPT;
  }
  
  const subtestInstruction = SUBTEST_INSTRUCTIONS[pattern.subtest || 'tps_pu'];
  
  let prompt = `### TASK\n`;
  prompt += `${subtestInstruction?.instruction || 'Generate a high-quality SNBT question.'}\n\n`;
  
  prompt += `### PATTERN INFORMATION\n`;
  prompt += `- **Pattern ID:** ${pattern.id}\n`;
  prompt += `- **Pattern Name:** ${pattern.pattern}\n`;
  prompt += `- **Level:** ${pattern.level.join('-')} (${getLevelLabel(pattern.level[0])})\n`;
  prompt += `- **Concept Tested:** ${pattern.konsep || 'Not specified'}\n`;
  prompt += `- **Question Type:** ${pattern.type}\n\n`;
  
  prompt += `### TEMPLATE STRUCTURE\n`;
  prompt += `Stimulus Template: ${pattern.template.stimulus || 'Not specified'}\n`;
  prompt += `Question Template: ${pattern.template.text || 'Not specified'}\n`;
  
  if (pattern.template.representation) {
    prompt += `\nRepresentation Type: ${pattern.template.representation.type}\n`;
  }
  
  prompt += `\n### CONTEXT VARIATIONS\n`;
  prompt += `Available contexts: ${pattern.contextVariations?.join(', ') || 'Not specified'}\n\n`;
  
  if (context && Object.keys(context).length > 0) {
    prompt += `### SPECIFIC CONTEXT\n`;
    for (const [key, value] of Object.entries(context)) {
      prompt += `- ${key}: ${value}\n`;
    }
    prompt += '\n';
  }
  
  prompt += `### REQUIREMENTS\n`;
  prompt += `1. Generate a complete question following the template above\n`;
  prompt += `2. Ensure the difficulty matches level ${pattern.level[0]}-${pattern.level[pattern.level.length - 1]}\n`;
  prompt += `3. Create ${pattern.template.options?.length || 5} answer options\n`;
  prompt += `4. Include a clear explanation for the correct answer\n`;
  
  if (pattern.type === 'pq_comparison') {
    prompt += `5. Use the standard P vs Q options: P > Q, Q > P, P = Q, Tidak dapat ditentukan\n`;
  } else if (pattern.type === 'data_sufficiency') {
    prompt += `5. Use the standard data sufficiency options (A-E)\n`;
  } else if (pattern.type === 'grid_boolean') {
    prompt += `5. Create exactly 4 statements for the boolean grid\n`;
  }
  
  if (pattern.type === 'function' || pattern.type === 'shape' || pattern.type === 'chart' || pattern.type === 'table') {
    prompt += `6. Include appropriate mathematical representation using LaTeX notation\n`;
  }
  
  prompt += `\n### OUTPUT FORMAT\n`;
  prompt += `Return your response as a valid JSON object with this structure:\n`;
  prompt += `\`\`\`json\n`;
  prompt += `{
  "stimulus": "...",
  "representation": {
    "type": "...",
    "data": {...}
  },
  "text": "...",
  "options": ["Option A", "Option B", "Option C", "Option D", "Option E"],
  "correctIndex": 0,
  "explanation": "Detailed explanation with LaTeX if needed: $x^2$"
}\n`;
  prompt += `\`\`\`\n`;
  
  return prompt;
}

/**
 * Get level label from level number
 * @param {number} level - Level 1-5
 * @returns {string} Level label
 */
function getLevelLabel(level) {
  const labels = {
    1: 'Dasar (Basic)',
    2: 'Sederhana (Simple)',
    3: 'Menengah (Intermediate)',
    4: 'Sulit (Advanced)',
    5: 'Pakar/HOTS (Expert)'
  };
  return labels[level] || 'Unknown';
}

/**
 * Quality checklist for generated questions
 */
export const QUALITY_CHECKLIST = [
  {
    id: 'template_compliance',
    criterion: 'Question follows template structure',
    weight: 0.15
  },
  {
    id: 'difficulty_match',
    criterion: 'Difficulty matches specified level',
    weight: 0.15
  },
  {
    id: 'plausible_options',
    criterion: 'All options are plausible',
    weight: 0.10
  },
  {
    id: 'unambiguous_answer',
    criterion: 'Correct answer is unambiguous',
    weight: 0.15
  },
  {
    id: 'clear_explanation',
    criterion: 'Explanation is clear and educational',
    weight: 0.10
  },
  {
    id: 'no_bias',
    criterion: 'No cultural or gender bias',
    weight: 0.10
  },
  {
    id: 'latex_format',
    criterion: 'Mathematical notation uses LaTeX format',
    weight: 0.10
  },
  {
    id: 'language_quality',
    criterion: 'Language quality (PUEBI for Indonesian, academic for English)',
    weight: 0.15
  }
];

/**
 * Evaluate generated question quality
 * @param {Object} question - Generated question object
 * @param {Object} pattern - Pattern used
 * @returns {Object} Quality evaluation result
 */
export function evaluateQuestionQuality(question, pattern) {
  const evaluation = {
    score: 0,
    maxScore: 1,
    criteria: [],
    passed: true,
    issues: []
  };
  
  let totalWeightedScore = 0;
  
  for (const item of QUALITY_CHECKLIST) {
    const passed = checkCriterion(question, pattern, item.id);
    const weightedScore = passed ? item.weight : 0;
    totalWeightedScore += weightedScore;
    
    evaluation.criteria.push({
      id: item.id,
      criterion: item.criterion,
      passed,
      weight: item.weight
    });
    
    if (!passed) {
      evaluation.passed = false;
      evaluation.issues.push(item.criterion);
    }
  }
  
  evaluation.score = totalWeightedScore;
  return evaluation;
}

/**
 * Check individual quality criterion
 * @param {Object} question - Question object
 * @param {Object} pattern - Pattern object
 * @param {string} criterionId - Criterion ID
 * @returns {boolean} Passed or not
 */
function checkCriterion(question, pattern, criterionId) {
  switch (criterionId) {
    case 'template_compliance':
      return question.stimulus && question.text && question.options && question.correctIndex !== undefined;
    
    case 'difficulty_match':
      // This would require more sophisticated analysis
      return true;
    
    case 'plausible_options':
      return question.options && question.options.length >= 4;
    
    case 'unambiguous_answer':
      return question.correctIndex >= 0 && question.correctIndex < question.options.length;
    
    case 'clear_explanation':
      return question.explanation && question.explanation.length > 20;
    
    case 'no_bias':
      // Simplified check - would need NLP for real detection
      return true;
    
    case 'latex_format':
      if (pattern.type === 'function' || pattern.type === 'shape') {
        return question.representation?.data?.function?.includes('$') || 
               question.explanation?.includes('$');
      }
      return true;
    
    case 'language_quality':
      // Simplified check
      return question.text && question.text.length > 10;
    
    default:
      return true;
  }
}

/**
 * Generate batch prompt for multiple questions
 * @param {Array} patterns - Array of patterns
 * @param {Object} context - Common context
 * @returns {string} Batch prompt
 */
export function generateBatchPrompt(patterns, context = {}) {
  let prompt = `You are an expert SNBT 2025 question generator. Generate ${patterns.length} questions based on the following patterns.\n\n`;
  
  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i];
    prompt += `## Question ${i + 1}\n`;
    prompt += generatePromptFromPattern(pattern, context);
    prompt += '\n\n---\n\n';
  }
  
  prompt += `Return all ${patterns.length} questions as a JSON array.`;
  
  return prompt;
}

export default {
  SYSTEM_PROMPT,
  SUBTEST_INSTRUCTIONS,
  generatePromptFromPattern,
  evaluateQuestionQuality,
  QUALITY_CHECKLIST,
  generateBatchPrompt
};
