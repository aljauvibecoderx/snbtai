# 🚀 Quick Reference: Tipe Soal PK Baru

## 📋 Ringkasan Singkat

Dua tipe soal baru untuk PK (Pengetahuan Kuantitatif):

1. **Data Sufficiency** - Analisis kecukupan data
2. **Statement Analysis** - Analisis pernyataan benar

---

## 🎯 1. Data Sufficiency

### JSON Structure
```json
{
  "type": "data_sufficiency",
  "stimulus": "Context...",
  "text": "Question?",
  "statements": ["(1) Info 1", "(2) Info 2"],
  "options": [],
  "correctIndex": 2,
  "explanation": "Analysis..."
}
```

### Opsi Jawaban (FIXED)
```
A. (1) SAJA cukup, (2) SAJA tidak cukup
B. (2) SAJA cukup, (1) SAJA tidak cukup
C. DUA BERSAMA-SAMA cukup, SATU SAJA tidak cukup
D. (1) SAJA cukup DAN (2) SAJA cukup
E. (1) dan (2) tidak cukup
```

### Pattern
```javascript
{ 
  id: 'pk_kecukupan_1', 
  pattern: 'Putuskan apakah pernyataan (1) dan (2) berikut cukup...', 
  level: [3, 4, 5], 
  type: 'kecukupan' 
}
```

---

## 🎯 2. Statement Analysis

### JSON Structure (Regular MCQ)
```json
{
  "stimulus": "Data...",
  "text": "Pernyataan:\\n\\n(1) ...\\n(2) ...\\n(3) ...\\n\\nBerapa banyak yang benar?",
  "options": ["0", "1", "2", "3", "4"],
  "correctIndex": 2,
  "explanation": "(1) Benar... (2) Salah..."
}
```

### Pattern
```javascript
{ 
  id: 'pk_analisis_1', 
  pattern: 'Berapa banyak pernyataan di atas yang benar?', 
  level: [3, 4, 5], 
  type: 'analisis_pernyataan' 
}
```

---

## 💻 Frontend Components

### Data Sufficiency (Already Exists)
```jsx
<DataSufficiencyQuestion
  question={question}
  userAnswer={userAnswers[idx]}
  onAnswer={(idx) => handleAnswer(idx)}
  disabled={isLocked}
/>
```

### Statement Analysis (Regular MCQ)
```jsx
// Gunakan rendering MCQ biasa
// Format pernyataan di dalam text dengan \\n\\n
```

---

## 🎨 Styling

### Data Sufficiency Box
```jsx
<div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
  <div className="text-xs font-bold text-amber-700 mb-2">
    Pernyataan (1)
  </div>
  <LatexWrapper text={statement} />
</div>
```

### Statement Analysis List
```
Format dalam text:
"Pernyataan:\\n\\n(1) Item 1\\n(2) Item 2\\n(3) Item 3"
```

---

## ✅ Checklist

### Implementation
- [x] Pattern di questionTemplates.js
- [x] AI prompt instructions
- [x] DataSufficiencyQuestion component
- [x] LaTeX support
- [x] Scoring logic

### Testing
- [ ] Generate Data Sufficiency
- [ ] Generate Statement Analysis
- [ ] Render dengan LaTeX
- [ ] Scoring IRT

---

## 📝 Contoh Cepat

### Data Sufficiency
```
Q: Berapa luas segitiga ABC?
(1) AB = 5, BC = 12
(2) Siku-siku di B
Answer: C (Keduanya bersama cukup)
```

### Statement Analysis
```
Data: 70, 80, 85, 90, 95
(1) Rata-rata = 84 ✓
(2) Median = 85 ✓
(3) Rentang = 25 ✓
(4) Tidak ada < 70 ✗
Answer: 3 pernyataan benar
```

---

## 🔗 Files Modified

1. `questionTemplates.js` - Added patterns
2. `App.js` - Already has DataSufficiencyQuestion
3. `PK_NEW_QUESTION_TYPES.md` - Full documentation

---

## 🚀 Deploy

```bash
# No additional dependencies needed
# Just deploy as usual
npm run build
```

---

**Status**: ✅ Ready  
**Version**: 1.0  
**Date**: 2024
