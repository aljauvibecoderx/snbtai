# Question Set ID & Result ID System

## Overview
Sistem baru untuk mengelola soal dan hasil dengan ID unik yang konsisten, memastikan format soal (MCQ, grid_boolean, dll) tetap sama saat diakses dari Bank Soal atau Soal Saya.

## Struktur Data

### 1. question_sets Collection
Menyimpan set soal lengkap dengan metadata.

```javascript
{
  questionSetId: "auto-generated-id",
  userId: "user123",
  questions: [...], // Array soal lengkap dengan tipe
  category: "tps_pu",
  difficulty: 3,
  source: "AI Generator" | "AI Lens",
  metadata: {
    story: "...", // untuk AI Generator
    images: 5, // untuk AI Lens
    instruksi_spesifik: "..."
  },
  createdAt: timestamp
}
```

### 2. results Collection
Menyimpan hasil pengerjaan soal.

```javascript
{
  resultId: "auto-generated-id",
  questionSetId: "qset_xxx", // Reference ke question_sets
  userId: "user123",
  userAnswers: {...},
  score: 80,
  correctCount: 4,
  wrongCount: 1,
  mode: "exam" | "game",
  completedAt: timestamp
}
```

### 3. bank_soal Collection
Menyimpan referensi soal yang di-bookmark.

```javascript
{
  questionSetId: "qset_xxx",
  userId: "user123",
  category: "tps_pu",
  savedAt: timestamp
}
```

### 4. soal_saya Collection
Menyimpan referensi soal yang sudah dikerjakan.

```javascript
{
  questionSetId: "qset_xxx",
  resultId: "result_xxx",
  userId: "user123",
  category: "tps_pu",
  completedAt: timestamp
}
```

## Flow Implementasi

### Generate Soal (AI Generator / AI Lens)
1. User generate soal
2. Create `questionSetId` → Save ke `question_sets`
3. Auto-save ke `bank_soal` dengan `questionSetId`
4. Set `questionSetId` ke state

### Selesai Mengerjakan
1. User klik "Selesai"
2. Create `resultId` → Save ke `results` dengan reference `questionSetId`
3. Save ke `soal_saya` dengan `questionSetId` + `resultId`
4. Set `resultId` ke state

### Kerjakan Ulang dari Bank Soal/Soal Saya
1. Load soal dari `question_sets` berdasarkan `questionSetId`
2. Format soal tetap sama (grid_boolean tetap grid_boolean)
3. User mengerjakan dengan format asli

## Fungsi Firebase Baru

### firebase.js
```javascript
// Save & Get Question Sets
saveQuestionSetWithId(questionSetData, userId)
getQuestionSetById(questionSetId)

// Save & Get Results
saveResultWithId(resultData, userId)
getResultById(resultId)

// Bank Soal & Soal Saya
saveToBankSoal(questionSetId, userId, category)
saveToSoalSaya(questionSetId, resultId, userId, category)
getBankSoal(userId)
getSoalSaya(userId)
```

## Perubahan di App.js

### State Baru
```javascript
const [questionSetId, setQuestionSetId] = useState(null);
const [resultId, setResultId] = useState(null);
```

### handleStart (Generate Soal)
- Setelah generate → `saveQuestionSetWithId()`
- Auto `saveToBankSoal()`
- Set `questionSetId` ke state

### completeExam (Selesai Ujian)
- Setelah hitung score → `saveResultWithId()`
- Auto `saveToSoalSaya()`
- Set `resultId` ke state

### handleVisionGenerate (AI Lens)
- Setelah generate → `saveQuestionSetWithId()`
- Auto `saveToBankSoal()`
- Set `questionSetId` ke state

## Backward Compatibility

Sistem lama (question_sets + questions collections) tetap berjalan untuk:
- Legacy data yang sudah ada
- Fallback jika sistem baru gagal
- Kompatibilitas dengan fitur existing

## Benefits

✅ **Konsistensi Format**: Soal grid_boolean tetap grid_boolean saat diakses ulang
✅ **Auto-Save**: Otomatis save ke Bank Soal saat generate
✅ **Tracking**: Mudah track hasil pengerjaan dengan resultId
✅ **Relational**: Hubungan jelas antara soal, hasil, dan user
✅ **Migration Ready**: Mudah migrate data lama ke sistem baru

## Migration Plan (Future)

Untuk data lama yang belum punya questionSetId:
1. Buat script migration
2. Group questions by setId
3. Create questionSetId untuk setiap set
4. Update bank_soal dan soal_saya dengan questionSetId baru

## Testing Checklist

- [ ] Generate soal AI Generator → Check questionSetId created
- [ ] Generate soal AI Lens → Check questionSetId created
- [ ] Selesai ujian → Check resultId created
- [ ] Check bank_soal → Should have questionSetId
- [ ] Check soal_saya → Should have questionSetId + resultId
- [ ] Kerjakan ulang dari Bank Soal → Format tetap sama
- [ ] Kerjakan ulang dari Soal Saya → Format tetap sama
- [ ] Grid_boolean soal → Tetap grid_boolean saat diakses ulang
