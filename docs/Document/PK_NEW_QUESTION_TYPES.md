# 📑 Dokumentasi: Tipe Soal Baru PK (Pengetahuan Kuantitatif)

## 🎯 Overview

Implementasi dua tipe soal baru untuk subtes **Pengetahuan Kuantitatif (PK)** sesuai format UTBK resmi:

1. **Analisis Kecukupan Data** (Data Sufficiency)
2. **Analisis Pernyataan Benar** (Statement Analysis)

---

## 📊 1. Analisis Kecukupan Data

### Deskripsi
Tipe soal yang menguji kemampuan siswa untuk menentukan apakah informasi yang diberikan cukup untuk menjawab pertanyaan.

### Format Soal
- **Pertanyaan utama**: Diberikan di bagian atas
- **Pernyataan (1)**: Informasi pertama
- **Pernyataan (2)**: Informasi kedua
- **Opsi jawaban**: 5 pilihan standar UTBK (A-E)

### Opsi Jawaban (TETAP/TIDAK BOLEH DIUBAH)
```
A. Pernyataan (1) SAJA cukup untuk menjawab pertanyaan, tetapi pernyataan (2) SAJA tidak cukup
B. Pernyataan (2) SAJA cukup untuk menjawab pertanyaan, tetapi pernyataan (1) SAJA tidak cukup
C. DUA pernyataan BERSAMA-SAMA cukup untuk menjawab pertanyaan, tetapi SATU pernyataan SAJA tidak cukup
D. Pernyataan (1) SAJA cukup untuk menjawab pertanyaan dan pernyataan (2) SAJA cukup
E. Pernyataan (1) dan pernyataan (2) tidak cukup untuk menjawab pertanyaan
```

### Struktur JSON
```json
{
  "type": "data_sufficiency",
  "stimulus": "Sebuah toko menjual dua jenis produk A dan B.",
  "representation": {"type": "text", "data": null},
  "text": "Berapa harga 1 unit produk A?",
  "statements": [
    "Harga 2 unit A dan 3 unit B adalah Rp50.000",
    "Harga 1 unit B adalah Rp8.000"
  ],
  "options": [],
  "correctIndex": 2,
  "explanation": "(1) Saja: $2A + 3B = 50000$, tidak cukup (2 variabel). (2) Saja: Hanya tahu B, tidak cukup. (1)+(2): Substitusi $B=8000$ ke persamaan (1), dapat $A = 17000$. Jawaban: C"
}
```

### Cara Kerja di Frontend
1. **Rendering**: Komponen `DataSufficiencyQuestion` menampilkan:
   - Pertanyaan utama di atas
   - 2 kotak pernyataan dengan border amber
   - 5 opsi jawaban standar (A-E)

2. **Scoring**: 
   - Bobot IRT lebih tinggi karena tingkat kesulitan analisis dua arah
   - User harus memilih 1 dari 5 opsi

3. **Validation**:
   - AI memastikan setiap pernyataan diuji secara independen dalam explanation
   - Explanation harus menjelaskan: (1) saja, (2) saja, dan (1)+(2) gabungan

---

## 📊 2. Analisis Pernyataan Benar

### Deskripsi
Tipe soal yang menyajikan stimulus matematika dan 4-5 pernyataan. User menentukan berapa banyak atau pernyataan mana yang benar.

### Variasi Input

#### Model A: Berapa Banyak?
```
Pertanyaan: "Berapa banyak pernyataan di atas yang benar?"
Opsi: 0, 1, 2, 3, 4
```

#### Model B: Pernyataan Mana?
```
Pertanyaan: "Pernyataan mana saja yang benar?"
Opsi: (1) dan (3), (2) dan (4), (1), (2), dan (3), dll.
```

### Struktur JSON (Regular MCQ)
```json
{
  "stimulus": "Data penjualan buku dalam 5 hari: 12, 15, 18, 14, 16 buku.",
  "representation": {"type": "text", "data": null},
  "text": "Perhatikan pernyataan berikut:\\n\\n(1) Rata-rata penjualan adalah 15 buku\\n(2) Median data lebih besar dari rata-rata\\n(3) Total penjualan mencapai 75 buku\\n(4) Penjualan tertinggi adalah 18 buku\\n\\nBerapa banyak pernyataan di atas yang benar?",
  "options": ["0", "1", "2", "3", "4"],
  "correctIndex": 3,
  "explanation": "(1) Benar: $(12+15+18+14+16)/5 = 15$. (2) Salah: Median = 15, sama dengan rata-rata. (3) Benar: Total = 75. (4) Benar: Maksimum = 18. Jadi ada 3 pernyataan benar."
}
```

### Cara Kerja di Frontend
1. **Rendering**: 
   - Gunakan list numerik (1), (2), (3), (4) untuk pernyataan
   - Format dengan `\\n\\n` untuk pemisah paragraf
   - Opsi jawaban regular MCQ (A-E)

2. **Validation**:
   - AI harus memastikan setiap pernyataan diuji secara independen
   - Explanation harus menjelaskan kebenaran setiap pernyataan

3. **Pattern Recognition**:
   - Pattern ID: `pk_analisis_1` dan `pk_analisis_2`
   - Level: [3, 4, 5] (HOTS)

---

## 🎨 UI/UX Guidelines

### 1. Data Sufficiency
```jsx
// Kotak Pernyataan
<div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
  <div className="text-xs font-bold text-amber-700 mb-2">Pernyataan (1)</div>
  <div className="text-sm text-slate-800">
    <LatexWrapper text={statement} />
  </div>
</div>
```

### 2. Statement Analysis
```jsx
// Format Pernyataan dalam Text
"Perhatikan pernyataan berikut:\\n\\n(1) Pernyataan pertama\\n(2) Pernyataan kedua\\n(3) Pernyataan ketiga\\n\\nBerapa banyak pernyataan yang benar?"
```

### Styling Minimalist
- **Border**: 0.5px tipis dengan backdrop blur
- **Colors**: 
  - Data Sufficiency: Amber (warning)
  - Statement Analysis: Slate (neutral)
- **LaTeX**: Pastikan simbol matematika tetap terbaca dengan `<LatexWrapper>`

---

## 🔧 Integrasi dengan AI Prompt

### Instruksi untuk AI (sudah ada di App.js)

```javascript
// Untuk Data Sufficiency
{
  "type": "data_sufficiency",
  "stimulus": "Konteks soal...",
  "text": "Pertanyaan yang harus dijawab...",
  "statements": [
    "Pernyataan (1) dengan LaTeX jika perlu",
    "Pernyataan (2) dengan LaTeX jika perlu"
  ],
  "options": [],
  "correctIndex": 2,
  "explanation": "Analisis: (1) tidak cukup karena... (2) tidak cukup karena... (1)+(2) cukup karena..."
}
```

### Pattern di questionTemplates.js
```javascript
{ 
  id: 'pk_kecukupan_1', 
  pattern: 'Putuskan apakah pernyataan (1) dan (2) berikut cukup untuk menjawab pertanyaan tersebut.', 
  level: [3, 4, 5], 
  type: 'kecukupan' 
},
{ 
  id: 'pk_analisis_1', 
  pattern: 'Berapa banyak pernyataan di atas yang benar?', 
  level: [3, 4, 5], 
  type: 'analisis_pernyataan' 
}
```

---

## ✅ Checklist Implementasi

### Backend (AI Prompt)
- [x] Instruksi Data Sufficiency di prompt
- [x] Instruksi Statement Analysis di prompt
- [x] Opsi jawaban standar UTBK
- [x] Validation logic untuk explanation

### Frontend (React Components)
- [x] `DataSufficiencyQuestion` component (sudah ada di App.js)
- [x] Rendering pernyataan dengan border amber
- [x] Opsi jawaban A-E dengan styling
- [x] LaTeX support untuk rumus matematika

### Pattern Templates
- [x] Pattern `pk_kecukupan_1` dan `pk_kecukupan_2`
- [x] Pattern `pk_analisis_1` dan `pk_analisis_2`
- [x] Level kesulitan [3, 4, 5]

### Testing
- [ ] Test generate soal Data Sufficiency
- [ ] Test generate soal Statement Analysis
- [ ] Test rendering dengan LaTeX
- [ ] Test scoring IRT

---

## 📝 Contoh Soal Lengkap

### Contoh 1: Data Sufficiency
```
Stimulus: "Sebuah segitiga ABC memiliki sisi-sisi dengan panjang tertentu."

Pertanyaan: "Berapakah luas segitiga ABC?"

Pernyataan:
(1) Panjang sisi AB = 5 cm dan BC = 12 cm
(2) Segitiga ABC adalah segitiga siku-siku di B

Jawaban: C (DUA pernyataan BERSAMA-SAMA cukup)

Explanation:
(1) Saja: Kita tahu 2 sisi, tapi tidak tahu tinggi atau sudut. Tidak cukup.
(2) Saja: Kita tahu bentuk segitiga, tapi tidak tahu ukuran sisi. Tidak cukup.
(1)+(2): Dengan siku-siku di B, maka AB dan BC adalah alas dan tinggi. 
Luas = 1/2 × 5 × 12 = 30 cm². Cukup!
```

### Contoh 2: Statement Analysis (Model A)
```
Stimulus: "Data nilai ujian 5 siswa: 70, 80, 85, 90, 95"

Pertanyaan: "Perhatikan pernyataan berikut:

(1) Rata-rata nilai adalah 84
(2) Median nilai adalah 85
(3) Rentang nilai adalah 25
(4) Tidak ada siswa yang mendapat nilai di bawah 70

Berapa banyak pernyataan di atas yang benar?"

Opsi: A. 0  B. 1  C. 2  D. 3  E. 4

Jawaban: D (3 pernyataan benar)

Explanation:
(1) Benar: (70+80+85+90+95)/5 = 84
(2) Benar: Median = nilai tengah = 85
(3) Benar: Rentang = 95 - 70 = 25
(4) Salah: Ada siswa dengan nilai 70 (bukan di bawah 70)
Jadi ada 3 pernyataan benar.
```

---

## 🚀 Cara Menggunakan

### 1. Generate Soal
```javascript
// User input di form
formData = {
  context: "Sebuah toko menjual produk A dan B dengan harga berbeda",
  subtest: "tps_pk",
  complexity: 4,
  instruksi_spesifik: "Buat soal kecukupan data"
}

// AI akan otomatis generate dengan type: "data_sufficiency"
```

### 2. Render di CBT
```javascript
// Di CBTView, komponen akan otomatis detect type
{question.type === 'data_sufficiency' ? (
  <DataSufficiencyQuestion
    question={question}
    userAnswer={userAnswers[currentQuestionIdx]}
    onAnswer={(idx) => handleMCQAnswer(currentQuestionIdx, idx)}
    disabled={isGameMode && isLocked}
  />
) : (
  // Regular MCQ
)}
```

### 3. Scoring
```javascript
// Sama seperti MCQ biasa
const isCorrect = userAnswers[idx] === question.correctIndex;

// Tapi dengan bobot IRT lebih tinggi untuk Data Sufficiency
```

---

## 🎓 Tips untuk AI Generator

1. **Data Sufficiency**:
   - Pastikan (1) saja tidak cukup
   - Pastikan (2) saja tidak cukup
   - Pastikan (1)+(2) cukup atau tidak cukup dengan jelas
   - Explanation harus menjelaskan ketiga skenario

2. **Statement Analysis**:
   - Buat 4-5 pernyataan yang independen
   - Setiap pernyataan harus bisa diverifikasi dari stimulus
   - Hindari pernyataan yang ambigu
   - Gunakan LaTeX untuk rumus matematika

3. **LaTeX**:
   - Gunakan `$...$` untuk inline math
   - Gunakan `$$...$$` untuk display math
   - Escape backslash dengan `\\\\` (double backslash)

---

## 📚 Referensi

- **File**: `questionTemplates.js` - Pattern definitions
- **File**: `App.js` - Component rendering (DataSufficiencyQuestion)
- **Prompt**: AI prompt di `generateQuestions()` function
- **Dokumentasi**: `QUESTION_TYPE_FIX.md` untuk format JSON

---

## 🔄 Update Log

**2024-01-XX**: Initial implementation
- ✅ Added Data Sufficiency pattern
- ✅ Added Statement Analysis pattern
- ✅ Updated questionTemplates.js
- ✅ Created documentation

---

## 💡 Future Enhancements

1. **Visual Feedback**: Animasi saat user memilih pernyataan
2. **Hint System**: Petunjuk untuk analisis pernyataan
3. **Statistics**: Track success rate per tipe soal
4. **Practice Mode**: Mode latihan khusus untuk Data Sufficiency

---

**Dibuat oleh**: SNBT AI Team  
**Tanggal**: 2024  
**Status**: ✅ Ready for Production
