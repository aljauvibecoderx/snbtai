# Error Fix Plan: JSON Parsing Error pada GenerateQuestion.js

**File**: `src/features/ambisBattle/GenerateQuestion.js`  
**Tanggal**: 2026-03-22  
**Status**: Pending Approval  
**Prioritas**: 🔴 CRITICAL

---

## 1. Ringkasan Masalah

### 1.1 Deskripsi Error
AI berhasil membuat soal, namun **gagal karena tidak sesuai format JSON** yang diharapkan sistem.

### 1.2 Error Log
```
Failed to parse JSON array from AI response: [
  {
    "text": "All students who study diligently will definitely pass the SNBT...",
    "options": [
      "A. Some SNBT participants will definitely pass the SNBT.",
      "B. All students who study diligently are SNBT participants.",
      ...
    ],
    "correctIndex": 0,
    "explanation": "Premise 1: Study Hard -> Pass
```

**Lokasi Error**: `GenerateQuestion.js:78`  
**Stack Trace**:
```
at generateQuestionWithAI (GenerateQuestion.js:78:1)
at async handleGenerateWithAI (GenerateQuestion.js:275:1)
```

### 1.3 Analisis Root Cause

| Penyebab | Dampak |
|----------|--------|
| Prompt tidak cukup ketat | AI menghasilkan JSON dengan format bebas |
| Tidak ada protokol escaping | Tanda petik `"` tidak di-escape dengan benar |
| Tidak ada protokol LaTeX | Rumus matematika tidak menggunakan double backslash |
| Parsing logic terlalu sederhana | Tidak bisa membersihkan response AI yang "kotor" |
| Tidak ada retry mechanism | Gagal total saat API key quota exceeded |

---

## 2. Solusi Teknis

### 2.1 Prinsip Solusi
**"Copy-Paste Mekanisme yang Sudah Berhasil"**

Menggunakan sistem yang sama persis seperti di `App.js` (baris 800-1400) yang sudah terbukti stabil dengan success rate >95%.

### 2.2 Komponen yang Akan Diimplementasi

#### A. Prompt Engineering (CRITICAL)

**File Referensi**: `App.js` (baris ~1015-1400)

**Protokol Escaping yang Wajib Ada**:
```javascript
const prompt = `
=== PROTOKOL ESCAPING KARAKTER (CRITICAL) ===
1. Tanda petik ganda di dalam string: WAJIB escape dengan \\" (SATU backslash + quote)
   - SALAH: \\\\" (double backslash)
   - SALAH: " (tanpa escape)
   - BENAR: \\" (single backslash)

2. Backslash untuk LaTeX: WAJIB TEPAT DUA backslash \\\\\\\\ (contoh: \\\\\\\\frac, \\\\\\\\circ)
   - SALAH: \\\\frac (satu backslash), \\\\\\\\\\\\frac (tiga backslash)
   - BENAR: \\\\\\\\frac, \\\\\\\\circ, \\\\\\\\sqrt (dua backslash)

3. Newline: Gunakan \\\\n, JANGAN baris baru fisik
4. DILARANG ada teks di luar JSON
5. DILARANG markdown code blocks
`;
```

**Hirarki Simbol (Layering Rule)**:
```javascript
=== ATURAN WAJIB: HIRARKI SIMBOL ===
Saat menggabungkan format bold (**) dengan tanda petik ganda (\\"):
1. PRIORITAS TANDA PETIK: Setiap tanda petik ganda WAJIB di-escape
   - SALAH: "kata **"tebal"**"
   - BENAR: "kata **\\"tebal\\"**"
2. Format: **\\"Kalimat tebal dan dikutip\\"**
`;
```

**Protokol LaTeX**:
```javascript
=== PROTOKOL LATEX (CRITICAL) ===
SETIAP ekspresi matematika WAJIB dibungkus dengan $:
1. Inline math: $x$, $f(x)$, $\\\\frac{1}{2}$
2. Display math: $$f(x) = 2x + 1$$
3. Variabel tunggal: $x$, $y$, $P$, $Q$ (WAJIB dibungkus $)
4. Operator: $\\\\times$, $\\\\div$, $\\\\circ$
5. Kurung untuk pecahan/pangkat: $\\\\left( \\\\frac{1}{2} \\\\right)^2$
`;
```

#### B. Multi-Layer JSON Cleaning

**File Referensi**: `App.js` (baris ~950-970)

**5 Layer Cleaning**:
```javascript
// Layer 1: Remove markdown code blocks
text = text.replace(/```json\\s*/g, '').replace(/```\\s*/g, '');

// Layer 2: Remove control characters (form feed, tab, etc.)
text = text.replace(/[\\x00-\\x1F\\x7F-\\x9F]/g, '');

// Layer 3: Fix over-escaped quotes (\\\\\\" -> \\")
text = text.replace(/\\\\\\\\\\\\"/g, '\\\\"');

// Layer 4: Remove trailing commas before closing bracket
text = text.replace(/,\\s*([\\]}])/g, '$1').trim();

// Layer 5: Final trim
text = text.trim();
```

#### C. Retry Mechanism dengan API Key Rotation

**File Referensi**: `App.js` (baris ~810-825, ~940-960)

**Helper Functions**:
```javascript
const GEMINI_KEY_INDEX = 'gemini_key_index';

const getGeminiKey = () => {
  const index = parseInt(localStorage.getItem(GEMINI_KEY_INDEX) || '0');
  return GEMINI_KEYS[index];
};

const switchGeminiKey = () => {
  const currentIndex = parseInt(localStorage.getItem(GEMINI_KEY_INDEX) || '0');
  const nextIndex = (currentIndex + 1) % GEMINI_KEYS.length;
  localStorage.setItem(GEMINI_KEY_INDEX, nextIndex.toString());
  return GEMINI_KEYS[nextIndex];
};
```

**Retry Logic**:
```javascript
let attempts = 0;
const maxAttempts = GEMINI_KEYS.length;

while (attempts < maxAttempts) {
  try {
    const currentKey = getGeminiKey();
    const genAI = new GoogleGenerativeAI(currentKey.key);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContent(prompt, { signal: abortSignal });
    // ... parsing logic
    
  } catch (error) {
    if (error.message?.includes('quota') || error.message?.includes('429')) {
      const nextKey = switchGeminiKey();
      attempts++;
      if (attempts >= maxAttempts) {
        return MOCK_QUESTIONS;
      }
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3s delay
    } else {
      throw error;
    }
  }
}
```

#### D. Template Integration

**File Referensi**: `App.js` (baris ~1000-1015)

**Imports yang Diperlukan**:
```javascript
import { selectTemplate, getAllPatterns } from '../../utils/questionTemplates';
import { SUBTESTS } from '../../constants/subtestHelper';
```

**Template Selection**:
```javascript
const subtestId = SUBTESTS.find(s => s.label === subtestLabel)?.id;
const selectedTemplate = selectTemplate(subtestId, complexity);
const allPatterns = getAllPatterns(subtestId);

const patternList = allPatterns
  .filter(p => p.level.includes(complexity))
  .map(p => `- "${p.pattern}" (Tipe: ${p.type})`)
  .join('\\n');
```

---

## 3. Struktur JSON Output

### 3.1 Format Standar (Regular Question)
```json
{
  "stimulus": "Teks stimulus...",
  "representation": {"type": "text", "data": null},
  "text": "Pertanyaan utama...",
  "options": ["Opsi A", "Opsi B", "Opsi C", "Opsi D", "Opsi E"],
  "correctIndex": 0,
  "explanation": "Pembahasan rinci..."
}
```

### 3.2 Format Khusus

#### A. PQ Comparison (PK_01)
```json
{
  "type": "pq_comparison",
  "stimulus": "Konteks soal...",
  "text": "Berdasarkan informasi yang diberikan, manakah hubungan antara kuantitas P dan Q berikut yang benar?",
  "p_value": "$x^2 + y^2$",
  "q_value": "$50$",
  "options": ["P > Q", "Q > P", "P = Q", "Informasi tidak cukup"],
  "correctIndex": 3,
  "explanation": "Penjelasan..."
}
```

#### B. Data Sufficiency (PK_02)
```json
{
  "type": "data_sufficiency",
  "stimulus": "Konteks soal...",
  "text": "Berapa harga 1 unit produk A?",
  "statements": [
    "Harga 2 unit A dan 3 unit B adalah Rp50.000",
    "Harga 1 unit B adalah Rp8.000"
  ],
  "options": [
    "Pernyataan (1) SAJA cukup...",
    "Pernyataan (2) SAJA cukup...",
    "DUA pernyataan BERSAMA-SAMA cukup...",
    "Pernyataan (1) SAJA cukup dan pernyataan (2) SAJA cukup",
    "Pernyataan (1) dan pernyataan (2) tidak cukup"
  ],
  "correctIndex": 2,
  "explanation": "Analisis..."
}
```

#### C. Grid Boolean (Ya/Tidak)
```json
{
  "type": "grid_boolean",
  "stimulus": "Teks stimulus...",
  "text": "Tentukan kebenaran pernyataan berikut!",
  "grid_data": [
    {"statement": "Rata-rata penjualan adalah 15 buku", "correct_answer": true},
    {"statement": "Median data lebih besar dari rata-rata", "correct_answer": false},
    {"statement": "Total penjualan mencapai 75 buku", "correct_answer": true}
  ],
  "options": [],
  "correctIndex": -1,
  "explanation": "Penjelasan..."
}
```

#### D. Flowchart Algorithm
```json
{
  "type": "flowchart_algo",
  "stimulus": "Perhatikan diagram alir berikut...",
  "representation": {
    "type": "flowchart",
    "data": {
      "nodes": [
        {"id": "1", "type": "terminal", "label": "Mulai", "row": 0, "col": 0},
        {"id": "2", "type": "io", "label": "Input $a$", "row": 1, "col": 0},
        {"id": "3", "type": "process", "label": "$x = a^2$", "row": 2, "col": 0},
        {"id": "4", "type": "decision", "label": "$x > 20?$", "row": 3, "col": 0}
      ],
      "edges": [
        {"from": "1", "to": "2"},
        {"from": "2", "to": "3"},
        {"from": "3", "to": "4"},
        {"from": "4", "to": "5", "label": "Ya"},
        {"from": "4", "to": "6", "label": "Tidak"}
      ]
    }
  },
  "text": "Jika input $a = 4$, berapakah nilai akhir $P$?",
  "options": ["13", "18", "21", "26", "28"],
  "correctIndex": 4,
  "explanation": "Langkah 1: Input a=4.\\nLangkah 2: x = 4^2 = 16..."
}
```

---

## 4. Implementasi Detail

### 4.1 File yang Dimodifikasi

| File | Baris | Perubahan |
|------|-------|-----------|
| `src/features/ambisBattle/GenerateQuestion.js` | 1-25 | Tambah imports |
| `src/features/ambisBattle/GenerateQuestion.js` | 30-100 | Replace fungsi `generateQuestionWithAI` |
| `src/features/ambisBattle/GenerateQuestion.js` | 260-320 | Update `handleGenerateWithAI` |

### 4.2 Imports Baru (Baris 1-25)
```javascript
// Tambahkan setelah import yang sudah ada:
import { selectTemplate, getAllPatterns } from '../../utils/questionTemplates';
import { SUBTESTS } from '../../constants/subtestHelper';
import { GEMINI_KEYS } from '../../config/config';
```

### 4.3 Helper Functions (Sebelum komponen utama)
```javascript
// Tambahkan sebelum SUBTESTS array:
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
```

### 4.4 Fungsi generateQuestionWithAI (Replace Total)
```javascript
const generateQuestionWithAI = async (subtest, topic, difficulty, count, context = '') => {
  const apiKey = getGeminiKey();
  if (!apiKey) throw new Error('API key tidak tersedia. Silakan cek pengaturan API Key.');

  // Dapatkan subtest ID dari label
  const subtestId = SUBTESTS.find(s => s.id === subtest)?.id;
  
  // Pilih template yang sesuai dengan level kesulitan
  const selectedTemplate = selectTemplate(subtestId, difficulty === 'Mudah' ? 1 : difficulty === 'Sedang' ? 3 : 5);
  const allPatterns = getAllPatterns(subtestId);

  // Generate list pola untuk prompt
  const patternList = allPatterns
    .filter(p => p.level.includes(difficulty === 'Mudah' ? 1 : difficulty === 'Sedang' ? 3 : 5))
    .map(p => `- "${p.pattern}" (Tipe: ${p.type})`)
    .join('\\n');

  const contextPrompt = context.trim() ? `\\n\\n=== KONTEKS MATERI ACUAN (WAJIB DIGUNAKAN) ===\\n"${context}"\\nBuatlah soal yang relevan, menantang, dan terhubung ERAT dengan konteks di atas!` : '';

  // === PROMPT LENGKAP DENGAN SEMUA PROTOKOL ===
  const prompt = `
SYSTEM: GENERATOR SOAL UTBK-SNBT DENGAN POLA RESMI

=== PROTOKOL ESCAPING KARAKTER (CRITICAL) ===
SETIAP output JSON WAJIB mengikuti aturan ini:
1. Tanda petik ganda di dalam string: WAJIB escape dengan \\\\" (SATU backslash + quote)
   - SALAH: \\\\\\\\" (double backslash)
   - SALAH: " (tanpa escape)
   - BENAR: \\\\" (single backslash)
2. Backslash untuk LaTeX: WAJIB TEPAT DUA backslash \\\\\\\\\\\\ (contoh: \\\\\\\\\\\\frac, \\\\\\\\\\\\circ)
   - SALAH: \\\\\\\\frac (satu backslash), \\\\\\\\\\\\\\\\\\\\frac (tiga backslash)
   - BENAR: \\\\\\\\\\\\frac, \\\\\\\\\\\\circ, \\\\\\\\\\\\sqrt (dua backslash)
3. Newline: Gunakan \\\\n, JANGAN baris baru fisik
4. DILARANG ada teks di luar JSON
5. DILARANG markdown code blocks
6. DILARANG karakter kontrol (form feed, tab manual)
7. Markdown Bold: Gunakan **kata** untuk kata yang perlu ditebalkan
8. Kutipan/Dialog: Gunakan \\\\" untuk dialog atau kutipan dalam teks

=== ATURAN WAJIB: HIRARKI SIMBOL (The Layering Rule) ===
Saat menggabungkan format bold (**) dengan tanda petik ganda (\\\\"):
1. PRIORITAS TANDA PETIK: Setiap tanda petik ganda yang merupakan bagian dari kalimat WAJIB di-escape dengan tepat satu backslash
   - SALAH: "kata **"tebal"**"
   - BENAR: "kata **\\\\\"tebal\\\\\""**"
2. Format: **\\\\\"Kalimat tebal dan dikutip\\\\\"**

=== PROTOKOL LATEX (CRITICAL) ===
SETIAP ekspresi matematika WAJIB dibungkus dengan $:
1. Inline math: $x$, $f(x)$, $\\\\\\\\frac{1}{2}$
2. Display math: $$f(x) = 2x + 1$$
3. Variabel tunggal: $x$, $y$, $P$, $Q$ (WAJIB dibungkus $)
4. Angka dalam konteks math: $\\\\\\\\frac{1}{9}$, $x^2$
5. WAJIB kurung kurawal: $\\\\\\\\frac{1}{9}$ BUKAN $\\\\\\\\frac19$
6. Operator: $\\\\\\\\times$, $\\\\\\\\div$, $\\\\\\\\circ$
7. Perbandingan: $P > Q$, $P < Q$, $P = Q$ (dibungkus $)
8. Kurung untuk pecahan/pangkat: Gunakan $\\\\\\\\left($ dan $\\\\\\\\right)$

=== SUBTES & LEVEL ===
Subtes: ${subtest}
Topik: ${topic}
Level: ${difficulty}

=== POLA TERSEDIA ===
${patternList}

${contextPrompt}

=== FORMAT OUTPUT (JSON ARRAY) ===
Hasilkan ${count} soal JSON valid dengan struktur:
[
  {
    "stimulus": "Teks stimulus (jika ada)...",
    "representation": {"type": "text", "data": null},
    "text": "Pertanyaan utama...",
    "options": ["A. Opsi pertama", "B. Opsi kedua", "C. Opsi ketiga", "D. Opsi keempat", "E. Opsi kelima"],
    "correctIndex": 0,
    "explanation": "Pembahasan rinci..."
  }
]

=== VALIDASI SEBELUM OUTPUT ===
✓ Semua LaTeX command menggunakan TEPAT DUA backslash (\\\\\\\\frac, \\\\\\\\\\\\circ)
✓ Semua variabel dan rumus dibungkus $ ($x$, $\\\\\\\\frac{1}{2}$)
✓ Semua tanda petik di dalam string di-escape (\\\\")
✓ Tidak ada karakter kontrol atau hidden symbols
✓ Kurung kurawal lengkap pada semua LaTeX command

KEMBALIKAN HANYA ARRAY JSON MURNI. TANPA TEKS PENGANTAR. TANPA MARKDOWN.
`;

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
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 4000,
        }
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();

      // === MULTI-LAYER CLEANING ===
      // Layer 1: Remove markdown code blocks
      text = text.replace(/```json\\s*/g, '').replace(/```\\s*/g, '');
      
      // Layer 2: Remove control characters
      text = text.replace(/[\\x00-\\x1F\\x7F-\\x9F]/g, '');
      
      // Layer 3: Fix over-escaped quotes
      text = text.replace(/\\\\\\\\\\\\"/g, '\\\\"');
      
      // Layer 4: Remove trailing commas
      text = text.replace(/,\\s*([\\]}])/g, '$1').trim();
      
      // Layer 5: Extract JSON array if wrapped in text
      const match = text.match(/\\[\\s*\\{[\\s\\S]*\\}\\s*\\]/);
      if (match) {
        text = match[0];
      }

      // === PARSE JSON ===
      try {
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          throw new Error('JSON array kosong atau tidak valid');
        }
        return parsed;
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError.message);
        console.error('Raw text:', text);
        throw new Error('Failed to parse JSON');
      }

    } catch (error) {
      // Check for quota/limit errors
      if (error.message?.includes('quota') || error.message?.includes('limit') || error.message?.includes('429')) {
        const nextKey = switchGeminiKey();
        attempts++;
        if (attempts >= maxAttempts) {
          throw new Error('Semua API key exhausted. Silakan coba lagi nanti.');
        }
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3s delay
      } else {
        throw error;
      }
    }
  }

  throw new Error('Gagal generate soal setelah semua percobaan.');
};
```

---

## 5. Testing Plan

### 5.1 Test Cases

| Test Case | Input | Expected Output | Status |
|-----------|-------|-----------------|--------|
| Generate 1 soal mudah | Subtes: PU, Topik: Logika, Difficulty: Mudah | 1 JSON valid | ⏳ Pending |
| Generate 5 soal sulit | Subtes: PK, Topik: Matematika, Difficulty: Sulit | 5 JSON valid dengan LaTeX | ⏳ Pending |
| Generate dengan konteks | Context: "Bab Deret Aritmatika" | Soal relevan dengan konteks | ⏳ Pending |
| API Key quota exceeded | Simulasi 429 error | Auto-retry dengan key lain | ⏳ Pending |
| LaTeX rendering | Soal matematika | Double backslash (\\\\frac) | ⏳ Pending |
| Bold + Quote combo | Soal PBM dengan kutipan | Format: **\\\\\"kata\\\\\"** | ⏳ Pending |

### 5.2 Acceptance Criteria

- ✅ Success rate > 95% (dari 100 generate, maksimal 5 gagal)
- ✅ Semua JSON output valid dan parseable
- ✅ LaTeX ter-render dengan benar di UI
- ✅ Auto-retry bekerja saat quota exceeded
- ✅ Format soal konsisten dengan sistem existing

---

## 6. Dependencies

### 6.1 Files yang Harus Ada
- `src/utils/questionTemplates.js` ✅
- `src/constants/subtestHelper.js` ✅
- `src/config/config.js` (GEMINI_KEYS) ✅
- `src/services/firebase/ambisBattle.js` ✅

### 6.2 NPM Packages
- `@google/generative-ai` ✅ (sudah terinstall)

---

## 7. Timeline Estimasi

| Fase | Durasi | Deskripsi |
|------|--------|-----------|
| Implementation | 30 menit | Copy-paste dan adaptasi kode dari App.js |
| Testing | 15 menit | Test berbagai skenario generate |
| Bug Fix | 15 menit | Fix issue yang muncul |
| **Total** | **1 jam** | |

---

## 8. Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Prompt terlalu panjang | Token limit exceeded | Medium | Truncate context jika > 8000 chars |
| API key habis | Generate gagal | Low | Retry mechanism dengan multiple keys |
| Format masih salah | Parse error | Low | Copy exact dari App.js yang sudah proven |
| LaTeX tidak render | UI broken | Low | Test dengan soal matematika |

---

## 9. Referensi

### 9.1 File Referensi Utama
- `src/App.js` (baris 800-1400) - Main generation logic
- `src/services/ai/questionGeneratorWithAbort.js` - Service layer
- `src/utils/questionTemplates.js` - Template patterns
- `src/utils/questionPatterns.js` - Pattern definitions

### 9.2 Dokumentasi
- `Error Loging.md` - Error log saat ini
- `fixingmbis.md` - Prompt engineering notes
- `README.md` - System overview

---

## 10. Approval

| Role | Name | Status | Date |
|------|------|--------|------|
| Developer | - | ⏳ Pending | - |
| Reviewer | - | ⏳ Pending | - |
| Approver | - | ⏳ Pending | - |

---

**Catatan**: Dokumen ini dibuat sebagai panduan implementasi fix untuk error JSON parsing pada fitur Generate Question di Ambis Battle.
