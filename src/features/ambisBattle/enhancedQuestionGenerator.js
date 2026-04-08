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
 * Generate questions with full stimulus support using the App.js system
 * @param {string} subtest - Subtest ID (pu, ppu, pbm, pk, lbind, lbing, pm)
 * @param {string} topic - Topic description
 * @param {string} difficulty - Difficulty level (Mudah, Sedang, Sulit)
 * @param {number} count - Number of questions to generate
 * @param {string} context - Optional context/reference material
 * @param {string} specificInstructions - Optional specific instructions
 * @returns {Promise<Array>} Array of question objects with stimulus
 */
export const generateEnhancedBattleQuestions = async (
  subtest,
  topic,
  difficulty,
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
  const levelParam = difficulty === 'Mudah' ? 1 : difficulty === 'Sedang' ? 3 : 5;

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
    difficulty,
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

      // Multi-layer cleaning (same as App.js)
      text = text.replace(/```(?:json)?\s*/gi, '').replace(/```\s*/g, '');
      text = text.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
      text = text.replace(/\\\\\\"/g, '\\"');
      text = text.replace(/,\s*([\]}])/g, '$1').trim();

      // Extract JSON array if wrapped in text
      const match = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (match) {
        text = match[0];
      }

      // Parse JSON
      try {
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          throw new Error('JSON array kosong atau tidak valid');
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
          const validatedQuestions = finalQuestions.map(q => validateAndEnhanceQuestion(q, subtest, difficulty, topic));
          return validatedQuestions;
        }

        // Validate and enhance questions
        const validatedQuestions = parsed.map(q => validateAndEnhanceQuestion(q, subtest, difficulty, topic));
        return validatedQuestions;

      } catch (parseError) {
        console.error('JSON Parse Error:', parseError.message);
        console.error('Raw text:', text);
        throw new Error('AI gagal mengikuti format JSON. Silakan diregenerate.');
      }

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
  difficulty,
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
4. Difficulty: ${difficulty}
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
  "difficulty": "${difficulty}"
}

CRITICAL: Output must be a JSON ARRAY with exactly ${count} objects. Do NOT output a single object.

=== VALIDATION ===
✓ Generate exactly ${count} questions in array format
✓ Setiap soal memiliki stimulus yang jelas
✓ Format JSON valid dengan escaping benar
✓ LaTeX menggunakan dua backslash: \\\\frac, \\\\sqrt
✓ Tidak ada teks di luar JSON array
✓ Array length must be exactly ${count}`;
}

/**
 * Validate and enhance question with required fields
 */
function validateAndEnhanceQuestion(question, subtest, difficulty, topic) {
  const enhanced = {
    ...question,
    subtest: question.subtest || subtest,
    topic: question.topic || topic,
    difficulty: question.difficulty || difficulty,
    representation: question.representation || { type: 'text', data: null }
  };

  // Ensure stimulus exists (create from text if missing)
  if (!enhanced.stimulus || enhanced.stimulus.trim() === '') {
    enhanced.stimulus = `Perhatikan pertanyaan berikut dengan seksama.`;
  }

  // Validate required fields
  if (!enhanced.text || !enhanced.options || enhanced.correctIndex === undefined) {
    throw new Error('Question missing required fields (text, options, or correctIndex)');
  }

  // Ensure options are properly formatted
  if (!enhanced.options[0].match(/^[A-E]\.\s/)) {
    enhanced.options = enhanced.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`);
  }

  return enhanced;
}

export default {
  generateEnhancedBattleQuestions
};
