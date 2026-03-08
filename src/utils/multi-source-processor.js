import Tesseract from 'tesseract.js';

const MAX_TEXT_LENGTH = 8000;

/**
 * Extract text from image using Tesseract.js
 * @param {string} imageDataUrl - Base64 data URL of image
 * @returns {Promise<string>} Extracted text
 */
export const extractTextFromImage = async (imageDataUrl) => {
  try {
    const { data: { text } } = await Tesseract.recognize(
      imageDataUrl,
      'ind+eng',
      { logger: () => { } }
    );
    return text || '';
  } catch (error) {
    console.error('OCR error:', error);
    return '';
  }
};

/**
 * Clean extracted text to save tokens
 * @param {string} text - Raw text
 * @returns {string} Cleaned text
 */
const cleanText = (text) => {
  return text
    .replace(/[^\w\s\d.,;:!?()\-+=\/*%$@#&]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Process multiple files (images only) in parallel
 * @param {Array} files - Array of file objects with {name, type, data, isImage}
 * @param {Function} onProgress - Progress callback (current, total)
 * @returns {Promise<string>} Combined text with separators
 */
export const processMultipleFiles = async (files, onProgress) => {
  if (!files || files.length === 0) return '';

  const extractionPromises = files.map(async (file, index) => {
    try {
      let extractedText = '';

      if (file.isImage) {
        extractedText = await extractTextFromImage(file.data);
      }

      if (onProgress) onProgress(index + 1, files.length);

      return {
        index,
        name: file.name,
        text: cleanText(extractedText)
      };
    } catch (error) {
      console.error(`Error processing ${file.name}:`, error);
      return {
        index,
        name: file.name,
        text: ''
      };
    }
  });

  const results = await Promise.all(extractionPromises);

  let combinedText = '';
  results.forEach((result, idx) => {
    if (result.text) {
      combinedText += `\n\n=== SUMBER ${idx + 1}: ${result.name} ===\n${result.text}`;
    }
  });

  if (combinedText.length > MAX_TEXT_LENGTH) {
    combinedText = combinedText.substring(0, MAX_TEXT_LENGTH) + '\n\n[Teks dipotong untuk efisiensi token]';
  }

  return combinedText.trim();
};

/**
 * Generate enhanced prompt for multi-source input
 * @param {string} combinedText - Combined text from all sources
 * @param {number} sourceCount - Number of sources
 * @returns {string} Enhanced prompt instruction
 */
export const generateMultiSourcePrompt = (combinedText, sourceCount) => {
  return `
=== MULTI-SOURCE INPUT (${sourceCount} SUMBER) ===

Anda menerima teks dari ${sourceCount} sumber berbeda (hasil OCR).
Setiap sumber dipisahkan dengan marker "=== SUMBER X ===".

TUGAS ANDA:
1. **Sintesis Informasi**: Hubungkan informasi dari semua sumber untuk memahami konsep yang utuh
2. **Identifikasi Pola**: Cari pola soal dominan di antara semua sumber
3. **Variasi Isomorfik**: Buat soal baru dengan logika gabungan, tapi narasi dan angka baru
4. **Formatting**: Output JSON valid dengan LaTeX sempurna

CRITICAL RULES:
- JANGAN copy-paste nama, angka, atau skenario dari input
- WAJIB ubah konteks tapi pertahankan logika (isomorfik)
- Gunakan LaTeX dengan TEPAT DUA backslash (\\\\frac, \\\\circ)
- Escape tanda petik dengan \\" (satu backslash)

INPUT TEKS:
${combinedText}
`;
};
