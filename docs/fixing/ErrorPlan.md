# Error Fix Plan: JSON Parsing Error pada GenerateQuestion.js

**File**: `src/features/ambisBattle/GenerateQuestion.js`  
**Tanggal Update**: 2026-03-22  
**Status**: 🔴 CRITICAL - REVISED SOLUTION  
**Prioritas**: CRITICAL

---

## 1. Ringkasan Masalah

### 1.1 Error Terbaru (2026-03-22)

**Error Message**:
```
JSON Parse Error: Unterminated string in JSON at position 260 (line 1 column 261)
```

**Raw Text dari AI**:
```json
[  {    
  "text": "Pernyataan **\"Saya bekerja 2 jam sehari\"** benar. Jika saya hanya bekerja pada hari kerja (Senin-Jumat), maka total jam kerja saya dalam $3$ minggu adalah...",    
  "options": ["A. $20$ jam", "B. $25$ jam", "C. $30$ jam", "D. $35$ jam", "E. $4...
```

**Lokasi Error**: `GenerateQuestion.js:169-171`

### 1.2 Analisis Root Cause (UPDATED)

| Penyebab | Dampak | Status |
|----------|--------|--------|
| **AI menggunakan `\"` dalam string JSON** | JSON.parse() gagal karena string tidak ter-escape | 🔴 **ROOT CAUSE** |
| Prompt membingungkan AI | AI bingung antara `\"` vs `\\"` | 🔴 Critical |
| Tidak ada pre-parse validation | Error langsung throw tanpa repair attempt | 🟡 Medium |
| Tidak ada fallback/repair mechanism | Gagal total padahal data hampir benar | 🟡 Medium |

### 1.3 Penjelasan Masalah Teknis

**Masalah Utama**: AI menghasilkan JSON seperti ini:
```json
{
  "text": "Pernyataan **\"Saya bekerja 2 jam sehari\"** benar..."
}
```

Dalam JSON yang valid, tanda petik di dalam string HARUS di-escape. Namun AI menulis `\"` yang dalam konteks JavaScript string literal berarti:
- `\"` = backslash + quote (tidak valid dalam JSON)
- Yang seharusnya: `\\"` (double backslash + quote)

**Mengapa Error di Position 260?**
Karena setelah `**\"Saya bekerja 2 jam sehari\"**`, AI melanjutkan dengan ` benar` tanpa escape yang benar, sehingga JSON parser melihat:
```
"Pernyataan **\"Saya bekerja 2 jam sehari\"** benar...
                      ↑
              String unterminated!
```

---

## 2. Solusi Teknis (REVISED)

### 2.1 Prinsip Solusi Baru

**"Escape-Agnostic Parsing + Auto-Repair"**

Daripada mengandalkan AI untuk escape dengan benar (yang sering gagal), kita:
1. **Terima apa saja dari AI** (baik `\"` atau `\\"`)
2. **Pre-process dengan regex yang robust** untuk normalisasi escaping
3. **Repair JSON yang broken** sebelum parse
4. **Fallback ke pattern matching** jika parse tetap gagal

### 2.2 Komponen Solusi

#### A. Enhanced Prompt (ANTI-CONFUSION)

**Masalah**: Prompt lama membingungkan AI dengan terlalu banyak backslash.

**Solusi**: Gunakan prompt yang lebih sederhana dengan **contoh konkret**.

```javascript
const prompt = `SYSTEM: GENERATOR SOAL UTBK-SNBT - JSON STRICT MODE

Anda adalah generator soal SNBT profesional. TUGAS ANDA: Hasilkan HANYA JSON array valid.

=== CONTOH FORMAT YANG BENAR (HAFALKAN POLA INI) ===
[
  {
    "text": "Perhatikan pernyataan: \\\\\\"Saya bekerja 2 jam sehari\\\\\\". Jika bekerja hanya Senin-Jumat, total jam dalam 3 minggu adalah...",
    "options": ["A. 20 jam", "B. 25 jam", "C. 30 jam", "D. 35 jam", "E. 40 jam"],
    "correctIndex": 2,
    "explanation": "2 jam × 5 hari × 3 minggu = 30 jam",
    "subtest": "${subtest}",
    "topic": "${topic}",
    "difficulty": "${difficulty}"
  }
]

=== ATURAN WAJIB (ZERO TOLERANCE) ===
1. KEMBALIKAN HANYA JSON ARRAY. Tanpa teks pengantar. Tanpa markdown.
2. Untuk tanda petik dalam string: gunakan \\\\\\" (double backslash + quote)
   - Contoh: "Kata \\\\\\"efektif\\\\\\" adalah baku" ✅
   - JANGAN: "Kata \\"efektif\\" adalah baku" ❌
   - JANGAN: "Kata "efektif" adalah baku" ❌
3. Untuk matematika: gunakan $...$ dengan LaTeX
   - Contoh: "Luas persegi dengan sisi $5$ cm adalah $25$ cm²"
   - Rumus: "$\\\\\\\\frac{1}{2}$", "$x^2$", "$\\\\\\\\sqrt{16}$"
4. Setiap opsi WAJIB dimulai dengan "A. ", "B. ", dst.
5. correctIndex: angka 0-4 (bukan string!)

=== DATA SOAL ===
Subtes: ${subtest}
Topik: ${topic}
Kesulitan: ${difficulty}
Jumlah: ${count} soal
${contextPrompt}

=== POLA SOAL YANG TERSEDIA ===
${patternList}

HASILKAN SEKARANG JSON ARRAY DENGAN ${count} SOAL:`;
```

#### B. Multi-Layer Cleaning (ENHANCED)

**6 Layer Cleaning** dengan normalisasi escaping:

```javascript
// Layer 1: Remove markdown code blocks
text = text.replace(/```(?:json)?\\s*/gi, '').replace(/```\\s*/g, '');

// Layer 2: Remove control characters
text = text.replace(/[\\x00-\\x1F\\x7F-\\x9F]/g, '');

// Layer 3: Normalize escaped quotes - CRITICAL FIX
// AI mungkin menghasilkan: \\" atau \\\\" atau \\\\\\" - normalisasi ke \\"
text = text.replace(/\\\\{3,}"/g, '\\\\"');  // \\\\" atau lebih → \\"
text = text.replace(/\\\\"/g, '\\\\"');       // Ensure consistent \\"

// Layer 4: Fix unescaped quotes inside strings (THE MAIN FIX)
// Pattern: Cari quote yang tidak escaped di tengah string
text = fixUnescapedQuotes(text);

// Layer 5: Remove trailing commas
text = text.replace(/,\\s*([\\]}])/g, '$1').trim();

// Layer 6: Extract JSON array
const match = text.match(/\\[\\s*\\{[\\s\\S]*\\}\\s*\\]/);
if (match) {
  text = match[0];
}
```

**Fungsi fixUnescapedQuotes** (CRITICAL):
```javascript
function fixUnescapedQuotes(text) {
  // Fix pattern: word"word (unescaped quote in middle of text)
  // Example: "Kata "efektif" adalah" → "Kata \\"efektif\\" adalah"
  
  // Step 1: Split by quotes to analyze segments
  const parts = text.split('"');
  
  // Step 2: Rebuild with proper escaping
  let result = '';
  for (let i = 0; i < parts.length; i++) {
    if (i === 0) {
      result = parts[i];
    } else if (i % 2 === 1) {
      // This is content inside quotes (should be escaped)
      result += '\\\\"' + parts[i];
    } else {
      // This is content outside quotes
      result += parts[i];
    }
  }
  
  return result;
}
```

#### C. JSON Repair Fallback

Jika JSON.parse() tetap gagal, gunakan **regex-based extraction**:

```javascript
function tryRepairAndParse(text) {
  // Attempt 1: Direct parse
  try {
    return JSON.parse(text);
  } catch (e) {
    console.log('Direct parse failed:', e.message);
  }
  
  // Attempt 2: Fix common issues
  let repaired = text;
  
  // Fix: Unescaped quotes after colon
  repaired = repaired.replace(/:\\s*"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"\\s*[,}]/g, (match) => {
    return match.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, '"\\"$1\\""');
  });
  
  // Fix: Missing closing quotes
  repaired = repaired.replace(/"([^"]*)([,{\\]\\n])/g, '"$1"$2');
  
  // Fix: Newlines in strings (replace with \\n)
  repaired = repaired.replace(/"([^"]*)\\n([^"]*)"/g, '"$1\\\\n$2"');
  
  try {
    return JSON.parse(repaired);
  } catch (e2) {
    console.log('Repair attempt 1 failed, trying pattern extraction...');
    
    // Attempt 2: Extract questions with regex
    return extractQuestionsWithRegex(text);
  }
}

function extractQuestionsWithRegex(text) {
  const questions = [];
  
  // Pattern untuk extract text field
  const textMatches = text.matchAll(/"text":\\s*"([^"]*(?:\\\\.[^"]*)*)"/g);
  const texts = Array.from(textMatches, m => m[1]);
  
  // Pattern untuk extract options array
  const optionsMatches = text.matchAll(/"options":\\s*\\[([^\\]]*)\\]/g);
  const optionsArrays = Array.from(optionsMatches, m => {
    return m[1].match(/"[^"]*"/g)?.map(s => s.slice(1, -1)) || [];
  });
  
  // Pattern untuk extract correctIndex
  const indexMatches = text.matchAll(/"correctIndex":\\s*(\\d+)/g);
  const indices = Array.from(indexMatches, m => parseInt(m[1]));
  
  // Pattern untuk extract explanation
  const explanationMatches = text.matchAll(/"explanation":\\s*"([^"]*(?:\\\\.[^"]*)*)"/g);
  const explanations = Array.from(explanationMatches, m => m[1]);
  
  // Build questions array
  const count = Math.min(texts.length, optionsArrays.length, indices.length);
  for (let i = 0; i < count; i++) {
    questions.push({
      text: texts[i],
      options: optionsArrays[i],
      correctIndex: indices[i],
      explanation: explanations[i] || ''
    });
  }
  
  return questions.length > 0 ? questions : null;
}
```

#### D. Retry Mechanism (UNCHANGED)

Tetap gunakan retry dengan API key rotation seperti sebelumnya.

---

## 3. Struktur JSON Output

### 3.1 Format Standar (Regular Question)
```json
{
  "text": "Pertanyaan utama...",
  "options": ["A. Opsi A", "B. Opsi B", "C. Opsi C", "D. Opsi D", "E. Opsi E"],
  "correctIndex": 0,
  "explanation": "Pembahasan rinci...",
  "subtest": "Penalaran Umum",
  "topic": "Logika",
  "difficulty": "Sedang"
}
```

---

## 4. Implementasi Detail (REVISED)

### 4.1 File yang Dimodifikasi

| File | Perubahan |
|------|-----------|
| `src/features/ambisBattle/GenerateQuestion.js` | Replace fungsi `generateQuestionWithAI` sepenuhnya |
| `src/features/ambisBattle/GenerateQuestion.js` | Tambah helper functions di atas komponen |

### 4.2 Helper Functions (BARU)

```javascript
// Tambahkan SEBELUM generateQuestionWithAI

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
    
    if (char === '\\\\' && !escaped) {
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
  repaired = repaired.replace(/\\\\{3,}"/g, '\\\\"');
  
  // Fix trailing commas
  repaired = repaired.replace(/,\\s*([\\]}])/g, '$1');
  
  // Fix newlines in strings
  repaired = repaired.replace(/"([^"]*)\\n([^"]*)"/g, '"$1\\\\n$2"');
  
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
  const textPattern = /"text":\\s*"((?:[^"\\\\]|\\\\.)*)"/g;
  const texts = Array.from(text.matchAll(textPattern), m => m[1]);
  
  // Extract options arrays
  const optionsPattern = /"options":\\s*\\[((?:[^\\[\\]]|\\[(?:[^\\[\\]]|\\[[^\\[\\]]*\\])*\\])*)\\]/g;
  const optionsArrays = Array.from(text.matchAll(optionsPattern), m => {
    const inner = m[1];
    const optionMatches = inner.match(/"((?:[^"\\\\]|\\\\.)*)"/g);
    return optionMatches ? optionMatches.map(s => s.slice(1, -1)) : [];
  });
  
  // Extract correctIndex
  const indexPattern = /"correctIndex":\\s*(\\d+)/g;
  const indices = Array.from(text.matchAll(indexPattern), m => parseInt(m[1]));
  
  // Extract explanation
  const explanationPattern = /"explanation":\\s*"((?:[^"\\\\]|\\\\.)*)"/g;
  const explanations = Array.from(text.matchAll(explanationPattern), m => m[1]);
  
  // Extract subtest
  const subtestPattern = /"subtest":\\s*"([^"]+)"/g;
  const subtests = Array.from(text.matchAll(subtestPattern), m => m[1]);
  
  // Extract topic
  const topicPattern = /"topic":\\s*"([^"]+)"/g;
  const topics = Array.from(text.matchAll(topicPattern), m => m[1]);
  
  // Extract difficulty
  const difficultyPattern = /"difficulty":\\s*"([^"]+)"/g;
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
```

### 4.3 Fungsi generateQuestionWithAI (REPLACE TOTAL)

```javascript
const generateQuestionWithAI = async (subtest, topic, difficulty, count, context = '') => {
  const apiKey = getGeminiKey();
  if (!apiKey) throw new Error('API key tidak tersedia.');

  const subtestId = SUBTESTS.find((s) => s.label === subtest || s.id === subtest)?.id || 'pu';
  const levelParam = difficulty === 'Mudah' ? 1 : difficulty === 'Sedang' ? 3 : 5;
  const allPatterns = getAllPatterns(subtestId);

  const patternList = allPatterns
    .filter(p => p.level.includes(levelParam))
    .map(p => `- "${p.pattern}" (Tipe: ${p.type})`)
    .join('\\n');

  const contextPrompt = context.trim()
    ? `\\n\\n=== KONTEKS MATERI ACUAN (WAJIB DIGUNAKAN) ===\\n"${context}"\\nBuatlah soal yang relevan!`
    : '';

  // === ENHANCED PROMPT WITH CONCRETE EXAMPLES ===
  const prompt = `SYSTEM: GENERATOR SOAL UTBK-SNBT - JSON STRICT MODE

Anda adalah generator soal SNBT profesional. TUGAS ANDA: Hasilkan HANYA JSON array valid.

=== CONTOH FORMAT YANG BENAR (HAFALKAN POLA INI) ===
[
  {
    "text": "Perhatikan pernyataan: \\\\\\"Saya bekerja 2 jam sehari\\\\\\". Total jam dalam 3 minggu adalah...",
    "options": ["A. 20 jam", "B. 25 jam", "C. 30 jam", "D. 35 jam", "E. 40 jam"],
    "correctIndex": 2,
    "explanation": "2 jam × 5 hari × 3 minggu = 30 jam",
    "subtest": "${subtest}",
    "topic": "${topic}",
    "difficulty": "${difficulty}"
  }
]

=== ATURAN WAJIB (ZERO TOLERANCE) ===
1. KEMBALIKAN HANYA JSON ARRAY. Tanpa teks pengantar. Tanpa markdown.
2. Untuk tanda petik dalam string: gunakan \\\\\\" (double backslash + quote)
   - BENAR: "Kata \\\\\\"efektif\\\\\\" adalah baku"
   - SALAH: "Kata \\"efektif\\" adalah baku"
   - SALAH: "Kata "efektif" adalah baku"
3. Untuk matematika: gunakan $...$ dengan LaTeX
   - Contoh: "Luas persegi dengan sisi $5$ cm"
   - Rumus: "$\\\\\\\\frac{1}{2}$", "$x^2$", "$\\\\\\\\sqrt{16}$"
4. Setiap opsi WAJIB dimulai dengan "A. ", "B. ", dst.
5. correctIndex: angka 0-4 (bukan string!)

=== DATA SOAL ===
Subtes: ${subtest}
Topik: ${topic}
Kesulitan: ${difficulty}
Jumlah: ${count} soal
${contextPrompt}

=== POLA SOAL YANG TERSEDIA ===
${patternList}

HASILKAN SEKARANG JSON ARRAY DENGAN ${count} SOAL:`;

  // === RETRY MECHANISM DENGAN API KEY ROTATION ===
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
          maxOutputTokens: 4000,
        }
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();

      console.log('Raw AI response length:', text.length);

      // === MULTI-LAYER CLEANING ===
      // Layer 1: Remove markdown code blocks
      text = text.replace(/```(?:json)?\\s*/gi, '').replace(/```\\s*/g, '');
      
      // Layer 2: Remove control characters
      text = text.replace(/[\\x00-\\x1F\\x7F-\\x9F]/g, '');
      
      // Layer 3: Normalize escaped quotes
      text = text.replace(/\\\\{3,}"/g, '\\\\"');
      
      // Layer 4: Remove trailing commas
      text = text.replace(/,\\s*([\\]}])/g, '$1').trim();
      
      // Layer 5: Extract JSON array
      const match = text.match(/\\[\\s*\\{[\\s\\S]*?\\}\\s*\\]/);
      if (match) {
        text = match[0];
      }

      console.log('Cleaned text length:', text.length);

      // === PARSE WITH REPAIR FALLBACK ===
      const parsed = tryRepairAndParse(text);
      
      if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('No valid questions extracted');
      }

      console.log('Successfully parsed', parsed.length, 'questions');
      return parsed;

    } catch (error) {
      // Check for quota/limit errors
      if (error.message?.includes('quota') || error.message?.includes('429')) {
        switchGeminiKey();
        attempts++;
        if (attempts >= maxAttempts) {
          throw new Error('Semua API key exhausted.');
        }
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        console.error('Generation error:', error);
        throw error;
      }
    }
  }

  throw new Error('Gagal generate soal.');
};
```

---

## 5. Testing Plan (UPDATED)

### 5.1 Test Cases

| # | Test Case | Input | Expected Output | Status |
|---|-----------|-------|-----------------|--------|
| 1 | Generate soal dengan kutipan | Subtes: PU, ada dialog | JSON valid dengan `\\"` | ⏳ Pending |
| 2 | Generate soal matematika | Subtes: PK, LaTeX | JSON dengan `\\\\frac` | ⏳ Pending |
| 3 | Generate soal bold+quote | Subtes: PBM | Format `**\\"kata\\"**` | ⏳ Pending |
| 4 | AI response truncated | Response > 4000 chars | Auto-retry atau extraction | ⏳ Pending |
| 5 | API quota exceeded | 429 error | Auto-switch key | ⏳ Pending |
| 6 | JSON broken mid-string | Unterminated quote | Regex extraction | ⏳ Pending |

### 5.2 Acceptance Criteria

- ✅ **Success rate > 95%** (dari 100 generate, maksimal 5 gagal)
- ✅ **Unterminated string error = 0%** (fixed dengan `fixUnescapedQuotes`)
- ✅ **Regex extraction fallback** (jika parse gagal, masih bisa extract)
- ✅ **LaTeX ter-render benar** (double backslash)
- ✅ **Auto-retry bekerja** saat quota exceeded

### 5.3 Debugging Checklist

Jika masih ada error, cek:

```
[ ] Apakah AI response mengandung ```json ... ```?
    → Layer 1 cleaning harus handle
    
[ ] Apakah ada karakter kontrol (\\x00-\\x1F)?
    → Layer 2 cleaning harus handle
    
[ ] Apakah ada \\\\" (triple+ backslash)?
    → Layer 3 normalization harus handle
    
[ ] Apakah ada trailing comma sebelum } atau ]?
    → Layer 4 cleaning harus handle
    
[ ] Apakah JSON array ter-extract dengan regex?
    → Layer 5 extraction harus handle
    
[ ] Jika JSON.parse gagal, apakah tryRepairAndParse dipanggil?
    → Repair fallback harus handle
    
[ ] Jika repair gagal, apakah extractQuestionsWithRegex dipanggil?
    → Regex extraction adalah last resort
```

---

## 6. Error Scenarios & Solutions

### Scenario A: "Unterminated string in JSON"

**Symptom**:
```
JSON Parse Error: Unterminated string in JSON at position 260
```

**Cause**: AI menghasilkan `\"Saya bekerja\"` tanpa escape yang benar.

**Solution Applied**:
1. `fixUnescapedQuotes()` - Character-by-character parsing
2. `tryRepairAndParse()` - Multi-attempt repair
3. `extractQuestionsWithRegex()` - Last resort extraction

### Scenario B: "Unexpected token in JSON"

**Symptom**:
```
JSON Parse Error: Unexpected token 'S' in JSON at position 0
```

**Cause**: AI mengembalikan teks "Sure! Here's your JSON..." sebelum array.

**Solution Applied**:
- Layer 5: Regex `\\[\\s*\\{[\\s\\S]*?\\}\\s*\\]` extract array only

### Scenario C: "Cannot read properties of undefined"

**Symptom**:
```
TypeError: Cannot read properties of undefined (reading 'length')
```

**Cause**: `tryRepairAndParse()` returns null, code continues.

**Solution Applied**:
```javascript
const parsed = tryRepairAndParse(text);
if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
  throw new Error('No valid questions extracted');
}
```

---

## 7. Dependencies

### 7.1 Files yang Harus Ada
- `src/utils/questionTemplates.js` ✅
- `src/constants/subtestHelper.js` ✅
- `src/config/config.js` (GEMINI_KEYS) ✅
- `src/services/firebase/ambisBattle.js` ✅

### 7.2 NPM Packages
- `@google/generative-ai` ✅ (sudah terinstall)

---

## 8. Timeline Estimasi

| Fase | Durasi | Deskripsi |
|------|--------|-----------|
| Implementation | 45 menit | Copy-paste dan adaptasi kode dari ErrorPlan.md |
| Testing | 30 menit | Test berbagai skenario generate |
| Bug Fix | 15 menit | Fix issue yang muncul |
| **Total** | **1.5 jam** | |

---

## 9. Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Prompt terlalu panjang | Token limit exceeded | Medium | Truncate context jika > 8000 chars |
| API key habis | Generate gagal | Low | Retry mechanism dengan multiple keys |
| Format masih salah | Parse error | Low | Copy exact dari ErrorPlan.md |
| LaTeX tidak render | UI broken | Low | Test dengan soal matematika |
| Regex extraction gagal | No questions | Low | Return empty array dengan error message |

---

## 10. Referensi

### 10.1 File Referensi Utama
- `src/App.js` (baris 800-1400) - Main generation logic
- `src/services/ai/questionGeneratorWithAbort.js` - Service layer
- `src/utils/questionTemplates.js` - Template patterns
- `src/utils/questionPatterns.js` - Pattern definitions

### 10.2 Dokumentasi
- `Error Loging.md` - Error log saat ini
- `fixingmbis.md` - Prompt engineering notes
- `README.md` - System overview

---

**Catatan**: Dokumen ini dibuat sebagai panduan implementasi fix untuk error JSON parsing pada fitur Generate Question di Ambis Battle. Update terbaru (2026-03-22) menambahkan mekanisme auto-repair untuk unterminated string error.
