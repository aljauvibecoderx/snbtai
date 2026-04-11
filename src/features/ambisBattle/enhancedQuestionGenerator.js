/**
 * Enhanced Question Generator for AmbisBattle
 * Integrates with the main App.js question generation system
 * 
 * File: src/features/ambisBattle/enhancedQuestionGenerator.js
 * Purpose: Provide robust question generation with stimulus support for AmbisBattle
 * Reference: App.js generateQuestions function, promptTemplates.js
 */

import { generateEnhancedPrompt } from '../../services/ai/questionGenerator';
import { selectTemplate, getAllPatterns } from '../../utils/questionTemplates';
import { GEMINI_KEYS } from '../../config/config';

const GEMINI_KEY_INDEX = 'gemini_key_index';

const getGeminiKey = () => {
  const index = parseInt(localStorage.getItem(GEMINI_KEY_INDEX) || '0');
  return GEMINI_KEYS[index % GEMINI_KEYS.length];
};

const switchGeminiKey = () => {
  const currentIndex = parseInt(localStorage.getItem(GEMINI_KEY_INDEX) || '0');
  const nextIndex = (currentIndex + 1) % GEMINI_KEYS.length;
  localStorage.setItem(GEMINI_KEY_INDEX, nextIndex.toString());
  return GEMINI_KEYS[nextIndex];
};

/**
 * Fix unescaped quotes in JSON string
 * This is the CRITICAL FIX for: Unterminated string error
 */
function fixUnescapedQuotes(text) {
  let result = '';
  let inString = false;
  let escaped = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const prevChar = i > 0 ? text[i - 1] : '';
    
    if (char === '\\' && !escaped) {
      escaped = true;
      result += char;
      continue;
    }
    
    if (char === '"' && !escaped) {
      inString = !inString;
      result += char;
    } else if (char === '"' && escaped) {
      result += char;
      escaped = false;
    } else if (char === '"' && !inString && prevChar !== ':' && prevChar !== '[' && prevChar !== '{' && prevChar !== ',') {
      result += char;
    } else {
      result += char;
      escaped = false;
    }
  }
  
  return result;
}

/**
 * Try to repair broken JSON and parse it
 * Returns null if all repair attempts fail
 */
function tryRepairAndParse(text) {
  // Attempt 1: Direct parse
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.log('Direct parse failed:', e.message);
  }
  
  // Attempt 2: Fix common issues
  let repaired = text;
  
  // Fix over-escaped quotes: \\\\" → \\"
  repaired = repaired.replace(/\\{3,}"/g, '\\"');
  
  // Fix trailing commas
  repaired = repaired.replace(/,\s*([\]}])/g, '$1');
  
  // Fix newlines in strings
  repaired = repaired.replace(/"([^"]*)\n([^"]*)"/g, '"$1\\n$2"');
  
  try {
    const parsed = JSON.parse(repaired);
    console.log('Repair successful!');
    return parsed;
  } catch (e) {
    console.log('Repair parse failed:', e.message);
  }
  
  // Attempt 3: Extract with regex (last resort)
  console.log('Attempting regex extraction...');
  return extractQuestionsWithRegex(text);
}

/**
 * Extract questions from broken JSON using regex patterns
 */
function extractQuestionsWithRegex(text) {
  const questions = [];
  
  // Extract text fields
  const textPattern = /"text":\s*"((?:[^"\\]|\\.)*)"/g;
  const texts = Array.from(text.matchAll(textPattern), m => m[1]);
  
  // Extract options arrays
  const optionsPattern = /"options":\s*\[((?:[^\[\]]|\[(?:[^\[\]]|\[[^\[\]]*\])*\])*)\]/g;
  const optionsArrays = Array.from(text.matchAll(optionsPattern), m => {
    const inner = m[1];
    const optionMatches = inner.match(/"((?:[^"\\]|\\.)*)"/g);
    return optionMatches ? optionMatches.map(s => s.slice(1, -1)) : [];
  });
  
  // Extract correctIndex
  const indexPattern = /"correctIndex":\s*(\d+)/g;
  const indices = Array.from(text.matchAll(indexPattern), m => parseInt(m[1]));
  
  // Extract explanation
  const explanationPattern = /"explanation":\s*"((?:[^"\\]|\\.)*)"/g;
  const explanations = Array.from(text.matchAll(explanationPattern), m => m[1]);
  
  // Extract subtest
  const subtestPattern = /"subtest":\s*"([^"]+)"/g;
  const subtests = Array.from(text.matchAll(subtestPattern), m => m[1]);
  
  // Extract topic
  const topicPattern = /"topic":\s*"([^"]+)"/g;
  const topics = Array.from(text.matchAll(topicPattern), m => m[1]);
  
  // Extract difficulty
  const difficultyPattern = /"difficulty":\s*"([^"]+)"/g;
  const difficulties = Array.from(text.matchAll(difficultyPattern), m => m[1]);
  
  // Build questions array
  const count = Math.min(texts.length, optionsArrays.length, indices.length);
  
  for (let i = 0; i < count; i++) {
    questions.push({
      text: texts[i],
      options: optionsArrays[i],
      correctIndex: indices[i],
      explanation: explanations[i] || '',
      subtest: subtests[i] || '',
      topic: topics[i] || '',
      difficulty: difficulties[i] || ''
    });
  }
  
  return questions.length > 0 ? questions : null;
}

/**
 * Generate questions with full stimulus support using the App.js system
 * @param {string} subtest - Subtest ID (tps_pu, tps_ppu, tps_pbm, tps_pk, lit_ind, lit_ing, pm)
 * @param {string} topic - Topic description
 * @param {number} level - Difficulty level (1-5, where 1=Easiest, 5=Hardest)
 * @param {number} count - Number of questions to generate
 * @param {string} context - Optional context/reference material
 * @param {string} specificInstructions - Optional specific instructions
 * @returns {Promise<Array>} Array of question objects with stimulus
 */
export const generateEnhancedBattleQuestions = async (
  subtest,
  topic,
  level,
  count,
  context = '',
  specificInstructions = ''
) => {
  const apiKey = getGeminiKey();
  if (!apiKey) throw new Error('API key tidak tersedia. Silakan cek pengaturan API Key.');

  // Map subtest to full label for compatibility with App.js system
  // Using exact same IDs as main system to ensure pattern consistency
  const subtestLabels = {
    'tps_pu': 'TPS - Penalaran Umum',
    'tps_ppu': 'TPS - Pengetahuan & Pemahaman Umum', 
    'tps_pbm': 'TPS - Pemahaman Bacaan & Menulis',
    'tps_pk': 'TPS - Pengetahuan Kuantitatif',
    'lit_ind': 'Literasi Bahasa Indonesia',
    'lit_ing': 'Literasi Bahasa Inggris',
    'pm': 'Penalaran Matematika'
  };

  const subtestLabel = subtestLabels[subtest] || 'Penalaran Umum';
  const levelParam = level; // Use level directly (1-5)

  // Use the enhanced prompt system from App.js
  const { prompt, systemPrompt, selectedPattern } = generateEnhancedPrompt(
    subtest,
    levelParam,
    context,
    subtestLabel,
    specificInstructions
  );

  // Build the complete prompt with AmbisBattle specific requirements
  const completePrompt = buildAmbisBattlePrompt(
    prompt,
    subtestLabel,
    level,
    topic,
    count,
    context,
    specificInstructions,
    selectedPattern
  );

  // Retry mechanism with API key rotation
  let attempts = 0;
  const maxAttempts = GEMINI_KEYS.length;

  while (attempts < maxAttempts) {
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");

      const currentKey = getGeminiKey();
      const genAI = new GoogleGenerativeAI(currentKey.key);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        }
      });

      const result = await model.generateContent(completePrompt);
      const response = await result.response;
      let text = response.text().trim();

      // Multi-layer cleaning (enhanced with quote normalization)
      text = text.replace(/```(?:json)?\s*/gi, '').replace(/```\s*/g, '');
      text = text.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
      
      // Layer 3: Normalize escaped quotes - CRITICAL FIX
      text = text.replace(/\\{3,}"/g, '\\"');
      text = fixUnescapedQuotes(text);
      
      text = text.replace(/,\s*([\]}])/g, '$1').trim();

      // Extract JSON array if wrapped in text
      const match = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (match) {
        text = match[0];
      }

      // Parse with repair fallback
      const parsed = tryRepairAndParse(text);
      
      if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('No valid questions extracted after repair attempts');
      }

      // Validate correct number of questions
      if (parsed.length !== count) {
        console.warn(`Expected ${count} questions, got ${parsed.length}`);
        // If we got fewer questions, still return what we have but log the issue
        // If we got more questions, take only the requested amount
        const finalQuestions = parsed.slice(0, count);
        if (finalQuestions.length < count) {
          console.warn(`Only ${finalQuestions.length} questions generated out of ${count} requested`);
        }
        
        // Validate and enhance questions
        const validatedQuestions = finalQuestions.map(q => validateAndEnhanceQuestion(q, subtest, level, topic));
        return validatedQuestions;
      }

      // Validate and enhance questions
      const validatedQuestions = parsed.map(q => validateAndEnhanceQuestion(q, subtest, level, topic));
      return validatedQuestions;

    } catch (error) {
      // Check for quota/limit errors
      if (error.message?.includes('quota') || error.message?.includes('limit') || error.message?.includes('429')) {
        switchGeminiKey();
        attempts++;
        if (attempts >= maxAttempts) {
          throw new Error('Semua API key exhausted (limit habis). Silakan coba lagi nanti.');
        }
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        throw error;
      }
    }
  }

  throw new Error('Gagal generate soal setelah multi-retries.');
};

/**
 * Build AmbisBattle-specific prompt with full stimulus support
 */
function buildAmbisBattlePrompt(
  basePrompt,
  subtestLabel,
  level,
  topic,
  count,
  context,
  specificInstructions,
  selectedPattern
) {
  const contextPrompt = context.trim()
    ? `\n\n=== KONTEKS MATERI ACUAN (WAJIB DIGUNAKAN) ===\n"${context}"\nBuatlah soal yang relevan, menantang, dan terhubung ERAT dengan konteks di atas!`
    : '';

  return `${basePrompt}

=== AMBISBATTLE OVERRIDE: MULTI-QUESTION GENERATION ===
IMPORTANT: Ignore previous single-question format. Generate EXACTLY ${count} questions.

=== AMBISBATTLE REQUIREMENTS ===
1. Generate EXACTLY ${count} questions for real-time battle
2. Each question MUST include a proper stimulus field
3. Questions should be engaging and suitable for competitive environment
4. Level: ${level} (1=Easiest, 5=Hardest)
5. Topic: ${topic}${contextPrompt}

${specificInstructions ? `\n=== USER SPECIFIC INSTRUCTIONS ===\n${specificInstructions}\n` : ''}

=== CRITICAL: STIMULUS REQUIREMENT ===
EVERY question must include:
- "stimulus": Supporting text, data, or context (2-5 sentences for most questions)
- "representation": Visual/mathematical representation if needed
- "text": The actual question
- "options": 5 answer options (unless special type)
- "correctIndex": Index of correct answer
- "explanation": Comprehensive, detailed explanation

=== EXPLANATION REQUIREMENTS ===
Setiap explanation harus:
1. Jelas dan mudah dipahami
2. Jelaskan mengapa jawaban benar
3. Berikan langkah penyelesaian singkat
4. 2-4 kalimat yang padat dan jelas

=== FINAL OUTPUT FORMAT (JSON ARRAY - EXACTLY ${count} QUESTIONS) ===
Generate a JSON ARRAY with EXACTLY ${count} question objects. Each object must have:
{
  "stimulus": "Teks stimulus pendukung yang membuat soal lengkap dan dapat dimengerti...",
  "representation": {"type": "text", "data": null},
  "text": "Pertanyaan utama berdasarkan stimulus...",
  "options": ["A. Opsi pertama", "B. Opsi kedua", "C. Opsi ketiga", "D. Opsi keempat", "E. Opsi kelima"],
  "correctIndex": 0,
  "explanation": "Jawaban A benar karena [alasan singkat]. Langkah penyelesaian: [proses singkat]. Konsep yang digunakan adalah [konsep dasar].",
  "subtest": "${subtestLabel}",
  "topic": "${topic}",
  "level": ${level}
}

CRITICAL: Output must be a JSON ARRAY with exactly ${count} objects. Do NOT output a single object.

=== VALIDATION ===
✓ Generate exactly ${count} questions in array format
✓ Setiap soal memiliki stimulus yang jelas
✓ Format JSON valid dengan escaping benar
✓ LaTeX menggunakan TEPAT EMPAT backslash: \\\\\\\\frac, \\\\\\\\sqrt, \\\\\\\\circ
✓ Tidak ada teks di luar JSON array
✓ Array length must be exactly ${count}

=== CRITICAL LATEX FORMATTING ===
- LaTeX commands MUST use exactly 4 backslashes: \\\\\\\\frac{a}{b}, \\\\\\\\sqrt{x}, \\\\\\\\circ
- Variables MUST be wrapped in $: $x$, $y$, $P$, $Q$
- Examples: $\\\\\\\\frac{1}{2}$, $\\\\\\\\sqrt{16}$, $\\\\\\\\approx$`;
}

/**
 * Fix LaTeX formatting to match main App.js system
 * Converts double backslashes to quadruple backslashes for JSON compatibility
 */
function fixLatexFormatting(text) {
  if (!text || typeof text !== 'string') return text;
  
  // Convert LaTeX commands from double to quadruple backslashes
  // Common LaTeX commands that need fixing
  return text
    .replace(/\\frac/g, '\\\\\\\\frac')
    .replace(/\\sqrt/g, '\\\\\\\\sqrt')
    .replace(/\\circ/g, '\\\\\\\\circ')
    .replace(/\\approx/g, '\\\\\\\\approx')
    .replace(/\\rightarrow/g, '\\\\\\\\rightarrow')
    .replace(/\\leftarrow/g, '\\\\\\\\leftarrow')
    .replace(/\\leftrightarrow/g, '\\\\\\\\leftrightarrow')
    .replace(/\\leq/g, '\\\\\\\\leq')
    .replace(/\\geq/g, '\\\\\\\\geq')
    .replace(/\\neq/g, '\\\\\\\\neq')
    .replace(/\\in/g, '\\\\\\\\in')
    .replace(/\\subset/g, '\\\\\\\\subset')
    .replace(/\\cup/g, '\\\\\\\\cup')
    .replace(/\\cap/g, '\\\\\\\\cap')
    .replace(/\\emptyset/g, '\\\\\\\\emptyset')
    .replace(/\\infty/g, '\\\\\\\\infty')
    .replace(/\\sum/g, '\\\\\\\\sum')
    .replace(/\\prod/g, '\\\\\\\\prod')
    .replace(/\\int/g, '\\\\\\\\int')
    .replace(/\\partial/g, '\\\\\\\\partial')
    .replace(/\\nabla/g, '\\\\\\\\nabla')
    .replace(/\\pm/g, '\\\\\\\\pm')
    .replace(/\\mp/g, '\\\\\\\\mp')
    .replace(/\\times/g, '\\\\\\\\times')
    .replace(/\\div/g, '\\\\\\\\div')
    .replace(/\\cdot/g, '\\\\\\\\cdot')
    .replace(/\\not</g, '\\\\\\\\not<')
    .replace(/\\not>/g, '\\\\\\\\not>')
    .replace(/\\not=/g, '\\\\\\\\not=')
    .replace(/\\not\\in/g, '\\\\\\\\not\\in')
    .replace(/\\not\\subset/g, '\\\\\\\\not\\subset');
}

/**
 * Validate and enhance question with required fields
 */
function validateAndEnhanceQuestion(question, subtest, level, topic) {
  const enhanced = {
    ...question,
    subtest: question.subtest || subtest,
    topic: question.topic || topic,
    level: question.level || level,
    difficulty: question.difficulty || level, // Keep for backward compatibility
    representation: question.representation || { type: 'text', data: null }
  };

  // Ensure stimulus exists (create from text if missing)
  if (!enhanced.stimulus || enhanced.stimulus.trim() === '') {
    enhanced.stimulus = `Perhatikan pertanyaan berikut dengan seksama.`;
  }

  // Validate required fields - also check for empty options array
  if (!enhanced.text || !enhanced.options || !Array.isArray(enhanced.options) || enhanced.options.length === 0 || enhanced.correctIndex === undefined) {
    console.error('Question validation failed:', {
      hasText: !!enhanced.text,
      hasOptions: !!enhanced.options,
      isOptionsArray: Array.isArray(enhanced.options),
      optionsLength: enhanced.options?.length,
      hasCorrectIndex: enhanced.correctIndex !== undefined,
      question: enhanced
    });
    throw new Error(`Question missing required fields: ${!enhanced.text ? 'text' : ''} ${!enhanced.options || enhanced.options.length === 0 ? 'options (empty or missing)' : ''} ${enhanced.correctIndex === undefined ? 'correctIndex' : ''}`);
  }

  // Fix LaTeX formatting in all text fields
  enhanced.stimulus = fixLatexFormatting(enhanced.stimulus);
  enhanced.text = fixLatexFormatting(enhanced.text);
  enhanced.explanation = fixLatexFormatting(enhanced.explanation);
  
  // Fix LaTeX in options
  enhanced.options = enhanced.options.map(option => fixLatexFormatting(option));

  // Ensure options are properly formatted (only if options exist and have content)
  if (enhanced.options.length > 0 && enhanced.options[0] && !enhanced.options[0].match(/^[A-E]\.\s/)) {
    enhanced.options = enhanced.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`);
  }

  return enhanced;
}

export default {
  generateEnhancedBattleQuestions
};
