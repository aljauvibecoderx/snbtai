/**
 * Question Generator Service with AbortController Support
 * 
 * This module provides question generation functionality with proper
 * cancellation support using AbortController.
 * 
 * Usage:
 * const abortController = new AbortController();
 * try {
 *   const questions = await generateQuestionsWithContext(context, subtest, complexity, apiKey, modelType, abortController);
 * } catch (error) {
 *   if (error.name === 'AbortError') {
 *     // User cancelled generation
 *   }
 * }
 */

import { selectTemplate, getAllPatterns } from '../../utils/questionTemplates';
import { SUBTESTS } from '../../constants/subtestHelper';

// Mock questions fallback
const MOCK_QUESTIONS = [
  {
    id: 1,
    stimulus: "Dalam studi meteorologi, durasi suatu peristiwa presipitasi (hujan) dapat dimodelkan berdasarkan volume air yang tersimpan.",
    representation: { type: "text", data: null },
    text: "Jika volume air $V=500\\ m^3$ dan laju presipitasi $R=50\\ m^3$/menit, berapakah durasi hujan ($T$)?",
    options: ["10 menit", "12.5 menit", "15 menit", "20 menit", "25 menit"],
    correctIndex: 0,
    explanation: "Substitusi: $T = \\frac{500}{50} = 10$ menit"
  }
];

/**
 * Generate questions with abort controller support
 * @param {string} context - The context/story for question generation
 * @param {string} subtestLabel - Subtest label
 * @param {number} complexity - Complexity level (0-5)
 * @param {string} apiKey - API key for the AI service
 * @param {string} modelType - Model type ('gemini' or 'huggingface')
 * @param {AbortController} abortController - AbortController for cancellation
 * @param {string} instruksiSpesifik - Optional specific instructions
 * @returns {Promise<Array>} Generated questions
 */
export const generateQuestionsWithContext = async (
  context,
  subtestLabel,
  complexity,
  apiKey,
  modelType,
  abortController = null,
  instruksiSpesifik = ''
) => {
  if (!apiKey) {
    await new Promise(resolve => setTimeout(resolve, 2500));
    return MOCK_QUESTIONS;
  }

  const subtestId = SUBTESTS.find(s => s.label === subtestLabel)?.id;
  const selectedTemplate = selectTemplate(subtestId, complexity);
  const allPatterns = getAllPatterns(subtestId);

  const patternList = allPatterns
    .filter(p => p.level.includes(complexity))
    .map(p => `- "${p.pattern}" (Tipe: ${p.type})`)
    .join('\n');

  const prompt = buildGenerationPrompt(context, subtestLabel, complexity, patternList, instruksiSpesifik);

  if (modelType === 'gemini') {
    return generateWithGemini(prompt, abortController);
  }

  // Fallback to mock questions for other model types
  await new Promise(resolve => setTimeout(resolve, 2500));
  return MOCK_QUESTIONS;
};

/**
 * Generate questions from image with abort controller support
 * @param {Array|string} filesOrImageBase64 - Array of files or single base64 string
 * @param {string} subtestLabel - Subtest label
 * @param {number} complexity - Complexity level
 * @param {string} modelType - Model type
 * @param {string} apiKey - API key
 * @param {AbortController} abortController - AbortController for cancellation
 * @returns {Promise<Array>} Generated questions
 */
export const generateQuestionsFromImageWithAbort = async (
  filesOrImageBase64,
  subtestLabel,
  complexity,
  modelType,
  apiKey,
  abortController = null
) => {
  if (!apiKey) {
    await new Promise(resolve => setTimeout(resolve, 2500));
    return MOCK_QUESTIONS;
  }

  const subtestId = SUBTESTS.find(s => s.label === subtestLabel)?.id;
  const selectedTemplate = selectTemplate(subtestId, complexity);
  const allPatterns = getAllPatterns(subtestId);
  const patternList = allPatterns
    .filter(p => p.level.includes(complexity))
    .map(p => `- "${p.pattern}" (Tipe: ${p.type})`)
    .join('\n');

  try {
    const { processMultipleFiles, generateMultiSourcePrompt } = await import('./multi-source-processor');

    let combinedText = '';
    let sourceCount = 1;

    if (Array.isArray(filesOrImageBase64)) {
      combinedText = await processMultipleFiles(filesOrImageBase64, (current, total) => {
        console.log(`Processing ${current}/${total} files...`);
      });
      sourceCount = filesOrImageBase64.length;
    } else {
      const Tesseract = await import('tesseract.js');
      const { data: { text: rawText } } = await Tesseract.recognize(
        filesOrImageBase64,
        'ind+eng',
        { logger: () => {} }
      );
      combinedText = rawText || '';
    }

    if (!combinedText || combinedText.length < 20) {
      return MOCK_QUESTIONS;
    }

    const truncatedText = combinedText.slice(0, 8000);
    const multiSourceInstruction = sourceCount > 1 ? generateMultiSourcePrompt(truncatedText, sourceCount) : '';
    const cleanupPrompt = buildImageCleanupPrompt(truncatedText, multiSourceInstruction, subtestLabel, complexity, patternList);

    if (modelType === 'gemini') {
      return generateWithGemini(cleanupPrompt, abortController);
    }
  } catch (error) {
    if (error.name === 'AbortError' || error.message?.includes('cancelled')) {
      throw error;
    }
    console.error("Vision Service Error:", error);
    return MOCK_QUESTIONS;
  }
};

/**
 * Generate content using Gemini API with abort support
 */
const generateWithGemini = async (prompt, abortController = null) => {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const { GEMINI_KEYS } = await import('../../config/config');

  const getGeminiKey = () => {
    const GEMINI_KEY_INDEX = 'gemini_key_index';
    const index = parseInt(localStorage.getItem(GEMINI_KEY_INDEX) || '0');
    return GEMINI_KEYS[index % GEMINI_KEYS.length];
  };

  const switchGeminiKey = () => {
    const GEMINI_KEY_INDEX = 'gemini_key_index';
    const currentIndex = parseInt(localStorage.getItem(GEMINI_KEY_INDEX) || '0');
    const nextIndex = (currentIndex + 1) % GEMINI_KEYS.length;
    localStorage.setItem(GEMINI_KEY_INDEX, nextIndex.toString());
    return GEMINI_KEYS[nextIndex];
  };

  let attempts = 0;
  const maxAttempts = GEMINI_KEYS.length;

  while (attempts < maxAttempts) {
    // Check if aborted before each attempt
    if (abortController && abortController.signal.aborted) {
      console.log('Generation aborted by user');
      throw new Error('Generation cancelled by user');
    }

    try {
      const currentKey = getGeminiKey();
      const genAI = new GoogleGenerativeAI(currentKey.key);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.8,
          topP: 0.95,
          topK: 40,
        }
      });

      // Pass abort signal to the API call
      const result = await model.generateContent(prompt, { signal: abortController?.signal });
      const response = await result.response;
      let text = response.text().trim();

      // Clean up response
      text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      text = text.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
      text = text.replace(/\\\\\\\\"/g, '\\"');
      text = text.replace(/,\s*([\]}])/g, '$1').trim();

      try {
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          return MOCK_QUESTIONS;
        }
        return parsed;
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError.message);
        return MOCK_QUESTIONS;
      }
    } catch (error) {
      // Check if error is due to abort
      if (error.name === 'AbortError' || (abortController && abortController.signal.aborted)) {
        console.log('Generation was cancelled');
        throw new Error('Generation cancelled by user');
      }

      if (error.message?.includes('quota') || error.message?.includes('limit') || error.message?.includes('429')) {
        const nextKey = switchGeminiKey();
        attempts++;
        if (attempts >= maxAttempts) {
          return MOCK_QUESTIONS;
        }
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        throw error;
      }
    }
  }

  return MOCK_QUESTIONS;
};

/**
 * Build the generation prompt
 */
function buildGenerationPrompt(context, subtestLabel, complexity, patternList, instruksiSpesifik) {
  return `
SYSTEM: GENERATOR SOAL UTBK-SNBT DENGAN POLA RESMI

=== SUBTES & LEVEL ===
Subtes: ${subtestLabel}
Level: ${complexity}

=== POLA TERSEDIA ===
${patternList}

${instruksiSpesifik ? `=== INSTRUKSI SPESIFIK ===\n${instruksiSpesifik}\n` : ''}

=== KONTEKS ===
${context}

Generate 5 questions in JSON format following the SNBT pattern.
`;
}

/**
 * Build the image cleanup prompt
 */
function buildImageCleanupPrompt(truncatedText, multiSourceInstruction, subtestLabel, complexity, patternList) {
  return `
=== PERAN & TUGAS ===
Anda adalah Pembuat Soal UTBK Senior. Tugas Anda adalah membuat "SOAL BAYANGAN" (Shadow Question) dari input teks/gambar yang diberikan.

${multiSourceInstruction}

INPUT TEKS (DARI OCR/PDF):
"${truncatedText}"

=== SUBTES & LEVEL ===
Subtes: ${subtestLabel}
Level: ${complexity}

=== POLA TERSEDIA ===
${patternList}

Generate 5 shadow questions in JSON format.
`;
}

export default {
  generateQuestionsWithContext,
  generateQuestionsFromImageWithAbort
};
