# AI Prompt Enhancement untuk Question Type

## Masalah
AI tidak selalu menghasilkan field `representation` yang lengkap, sehingga soal tidak menampilkan grafik/tabel/flowchart.

## Solusi
Tambahkan instruksi ketat di prompt AI untuk SELALU menghasilkan representation field.

## Instruksi untuk AI (Sudah ditambahkan di App.js)

```
=== MANDATORY REPRESENTATION FIELD ===
SETIAP soal WAJIB memiliki field "representation" dengan struktur:

{
  "type": "text" | "table" | "chart" | "flowchart" | "shape" | "function" | "thread" | "grid_boolean",
  "data": null | [...] | {...}
}

ATURAN PEMILIHAN TYPE:
1. Jika soal memiliki DATA NUMERIK/TABEL → type: "table"
2. Jika soal memiliki GRAFIK/TREND → type: "chart"
3. Jika soal memiliki PROSES/ALUR → type: "flowchart"
4. Jika soal memiliki GEOMETRI → type: "shape"
5. Jika soal memiliki RUMUS MATEMATIKA → type: "function"
6. Jika soal adalah FORUM/DISKUSI → type: "thread"
7. Jika soal adalah GRID BOOLEAN (Ya/Tidak) → type: "grid_boolean"
8. Jika soal HANYA TEKS → type: "text"

CONTOH WAJIB:

Soal dengan Tabel:
{
  "representation": {
    "type": "table",
    "data": [
      ["Kota", "Kepadatan (jiwa/km²)"],
      ["Jakarta", "15,342"],
      ["Surabaya", "8,483"]
    ]
  }
}

Soal dengan Grafik:
{
  "representation": {
    "type": "chart",
    "data": {
      "points": [[0, 10], [1, 20], [2, 15]],
      "xLabel": "Waktu (jam)",
      "yLabel": "Jarak (km)"
    }
  }
}

Soal dengan Flowchart:
{
  "representation": {
    "type": "flowchart",
    "data": {
      "nodes": [
        {"id": "1", "type": "terminal", "label": "Mulai", "row": 0, "col": 0},
        {"id": "2", "type": "process", "label": "$x = a^2$", "row": 1, "col": 0}
      ],
      "edges": [{"from": "1", "to": "2"}]
    }
  }
}

Soal dengan Grid Boolean:
{
  "type": "grid_boolean",
  "grid_data": [
    {"statement": "Pernyataan 1", "correct_answer": true},
    {"statement": "Pernyataan 2", "correct_answer": false}
  ],
  "representation": {"type": "text", "data": null}
}

VALIDASI SEBELUM OUTPUT:
✓ Setiap soal memiliki field "representation"
✓ Field "type" tidak kosong
✓ Field "data" sesuai dengan type
✓ Untuk grid_boolean: field "grid_data" ada dan benar
✓ Untuk pq_comparison: field "p_value" dan "q_value" ada
✓ Untuk data_sufficiency: field "statements" ada
```

## Implementasi di App.js

Sudah ditambahkan di fungsi `generateQuestions` dan `generateQuestionsFromImage`:

```javascript
const prompt = `
...
=== MANDATORY REPRESENTATION FIELD ===
SETIAP soal WAJIB memiliki field "representation" dengan struktur:
{
  "type": "text" | "table" | "chart" | "flowchart" | "shape" | "function" | "thread" | "grid_boolean",
  "data": null | [...] | {...}
}
...
`;
```

## Checklist untuk Verifikasi

Setelah generate soal, pastikan:

1. **Field `representation` ada**
   ```javascript
   if (!question.representation) {
     console.error('❌ Soal tanpa representation:', question);
   }
   ```

2. **Field `type` tidak kosong**
   ```javascript
   if (!question.representation.type) {
     console.error('❌ Representation type kosong');
   }
   ```

3. **Data sesuai dengan type**
   ```javascript
   if (question.representation.type === 'table' && !Array.isArray(question.representation.data)) {
     console.error('❌ Table representation harus array');
   }
   ```

4. **Untuk soal khusus, field tambahan ada**
   ```javascript
   if (question.type === 'grid_boolean' && !question.grid_data) {
     console.error('❌ Grid boolean tanpa grid_data');
   }
   ```

## Monitoring

Tambahkan logging untuk track representation:

```javascript
const trackRepresentation = (questions) => {
  const stats = {
    total: questions.length,
    byType: {}
  };
  
  questions.forEach(q => {
    const type = q.representation?.type || 'missing';
    stats.byType[type] = (stats.byType[type] || 0) + 1;
  });
  
  console.log('📊 Representation Stats:', stats);
  return stats;
};
```

## Hasil yang Diharapkan

Setelah fix ini, setiap soal yang dihasilkan akan memiliki:

✅ Field `type` yang menunjukkan jenis soal
✅ Field `representation` dengan tipe yang sesuai
✅ Field `data` yang berisi informasi visual (tabel, grafik, dll)
✅ Untuk soal khusus: field tambahan seperti `grid_data`, `p_value`, dll
✅ Semua field tersimpan ke Firestore dengan benar
✅ Semua field ditampilkan di UI dengan benar

## Testing

```bash
# 1. Generate soal dengan tipe berbeda
# 2. Cek console untuk representation stats
# 3. Buka bank soal dan verifikasi tampilan
# 4. Cek Firestore untuk memastikan field tersimpan
```
