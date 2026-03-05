# Implementasi Sistem Template Pola Soal SNBT

## Overview
Sistem template ini memastikan setiap soal yang dihasilkan AI mengikuti pola pertanyaan SNBT yang autentik berdasarkan analisis `questiontype.md`.

## Struktur File

### 1. `questionTemplates.js`
File utama yang berisi:
- **QUESTION_TEMPLATES**: Database pola pertanyaan untuk setiap subtes
- **DISTRACTOR_STRATEGIES**: Strategi membuat opsi salah yang realistis
- **selectTemplate()**: Memilih template berdasarkan subtes dan level
- **getAllPatterns()**: Mendapatkan semua pola dari subtes
- **generatePromptWithTemplate()**: Generate prompt AI dengan template

### 2. `TemplateInfo.js`
Komponen UI untuk menampilkan pola soal yang akan digunakan kepada user.

### 3. `App.js` (Modified)
Integrasi sistem template ke dalam AI prompt generator.

## Cara Kerja

### 1. User Memilih Subtes & Level
```javascript
formData = {
  subtest: 'tps_pu',
  complexity: 3,
  context: '...'
}
```

### 2. Sistem Memilih Template
```javascript
const selectedTemplate = selectTemplate('tps_pu', 3);
// Returns: {
//   id: 'pu_simpulan_pasti',
//   pattern: 'Berdasarkan informasi tersebut, manakah simpulan yang PASTI BENAR?',
//   level: [3, 4, 5],
//   type: 'simpulan'
// }
```

### 3. AI Generate Soal dengan Pola
AI menerima prompt yang berisi:
- List pola pertanyaan yang WAJIB diikuti
- Template prioritas yang dipilih sistem
- Strategi distraktor
- Prinsip pembuatan soal SNBT

### 4. Output Soal Konsisten
Setiap soal mengikuti pola SNBT asli, membantu siswa familiar dengan format ujian.

## Pola Pertanyaan per Subtes

### TPS - Penalaran Umum (tps_pu)
- "Berdasarkan informasi tersebut, manakah simpulan yang PASTI BENAR?"
- "Simpulan yang PALING MUNGKIN benar adalah..."
- "Manakah yang PALING MUNGKIN menjadi penyebab utama..."
- "Apa yang PALING MUNGKIN terjadi jika..."
- "Informasi tambahan manakah yang paling memperkuat argumen..."

### TPS - Pengetahuan & Pemahaman Umum (tps_ppu)
- "Imbuhan [...] dalam kata [...] memiliki makna yang sama dengan..."
- "Informasi berikut sesuai dengan teks, kecuali..."
- "Gagasan utama yang dapat disimpulkan dari teks adalah..."
- "Kalimat yang tidak logis dalam bacaan adalah..."

### TPS - Pemahaman Bacaan & Menulis (tps_pbm)
- "Perbaikan ejaan yang tepat pada kalimat [...] adalah..."
- "Kata yang paling tepat untuk melengkapi [...] adalah..."
- "Kalimat tidak efektif yang terdapat pada teks adalah..."
- "Kata '[kata]' memiliki makna yang sama dengan..."

### TPS - Pengetahuan Kuantitatif (tps_pk)
- "Hubungan antara kuantitas P dan Q berikut yang benar adalah..."
- "Putuskan apakah pernyataan (1) dan (2) berikut cukup..."
- "Banyaknya pernyataan yang benar adalah sebanyak..."
- "Maka, jarak [TITIK] ke bidang [BIDANG] adalah..."

### Literasi Bahasa Indonesia (lit_ind)
- "Pernyataan yang TIDAK sesuai dengan bacaan di atas adalah..."
- "Berdasarkan teks, mengapa [SUBJEK] melakukan [TINDAKAN]?"
- "Makna dari '[KATA/FRASA]' berdasarkan bacaan adalah..."
- "Apa langkah yang dapat dilakukan sebagai langkah mengantisipasi..."

### Literasi Bahasa Inggris (lit_ing)
- "Which of the following is NOT the reason why..."
- "Which of the following is the best main idea of the text?"
- "What can we infer from the passage?"
- "The word '[WORD]' is closest in meaning to..."
- "Which tone best describes the author..."

### Penalaran Matematika (pm)
- "Berapa maksimal [OBJEK] yang bisa [AKSI] dengan pertimbangan..."
- "Berapa [BESARAN] yang tersisa dengan pertimbangan..."
- "Jika Kn menyatakan bilangan pada petak pertama baris ke-n, maka Kn = ..."
- "Tentukan nilai kebenaran dari pernyataan-pernyataan di bawah ini!"

## Strategi Distraktor

Setiap opsi salah dibuat dengan strategi berikut:
1. **Logis tapi salah asumsi**: Jawaban yang logis tapi menggunakan asumsi yang salah
2. **Benar sebagian**: Benar untuk sebagian kasus tapi tidak umum
3. **Terlalu literal**: Interpretasi terlalu literal, tidak melihat konteks
4. **Overgeneralisasi**: Generalisasi berlebihan dari informasi terbatas
5. **Salah rujukan**: Merujuk pada bagian teks yang salah

## Keunggulan Sistem

### 1. Konsistensi
Setiap soal mengikuti pola SNBT asli, membantu siswa terbiasa dengan format ujian.

### 2. Variasi
Template yang beragam mencegah kebosanan dan melatih berbagai aspek penalaran.

### 3. Adaptif
Tingkat kesulitan dapat disesuaikan per template, dari level 1 (dasar) hingga level 5 (HOTS).

### 4. Scalable
Mudah menambah template baru dengan mengedit `questionTemplates.js`.

### 5. Transparansi
User dapat melihat pola soal yang akan digunakan sebelum generate.

## Cara Menambah Template Baru

Edit `questionTemplates.js`:

```javascript
tps_pu: {
  patterns: [
    // ... existing patterns
    {
      id: 'pu_new_pattern',
      pattern: 'Pola pertanyaan baru...',
      level: [3, 4],
      type: 'new_type'
    }
  ]
}
```

## Testing

Untuk memastikan sistem bekerja:
1. Pilih subtes dan level kesulitan
2. Klik info icon untuk melihat pola yang tersedia
3. Generate soal
4. Verifikasi bahwa pertanyaan mengikuti pola yang ditampilkan

## Future Improvements

1. **Analytics**: Track pola mana yang paling sering menghasilkan soal berkualitas
2. **User Feedback**: Biarkan user memilih pola spesifik yang ingin dilatih
3. **Pattern Difficulty**: Tambahkan scoring kesulitan per pola
4. **Custom Patterns**: Biarkan guru membuat pola custom untuk kelas mereka
