# Markdown Bold Formatting Fix

## 🔴 Problem

Soal PBM/Literasi menanyakan "Penulisan kata bercetak tebal yang benar...", tetapi kata-kata tersebut tidak muncul tebal di layar karena tidak diformat dengan Markdown.

**Impact**: User tidak bisa menjawab soal karena elemen visual hilang.

## ✅ Solution

### 1. Frontend - LatexWrapper Component
Menambahkan Markdown bold processing:

```javascript
// Process Markdown bold (**text**)
processedText = processedText.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
```

### 2. Backend - AI Prompt Enhancement
Menambahkan instruksi formatting untuk subtes PBM/Literasi:

```
FORMAT STIMULUS PBM:
- Setiap kalimat WAJIB diberi nomor: (1), (2), (3), dst
- Kata yang menjadi objek analisis WAJIB ditebalkan dengan **kata**
- Contoh: "(1) **Charles** adalah pelajar yang **aktif**."
- Jika soal menanyakan "kata bercetak tebal", pastikan kata tersebut ada di stimulus dengan format **bold**
```

## 📝 Example

### Input (AI Output):
```json
{
  "stimulus": "(1) **Charles** adalah pelajar yang sangat **aktif**. (2) Dia selalu **menurut** apa pun permintaan dari **Kekasihnya** Monica.",
  "text": "Penulisan kata bercetak tebal yang benar terdapat pada kalimat..."
}
```

### Output (Rendered):
```
(1) Charles adalah pelajar yang sangat aktif. (2) Dia selalu menurut apa pun permintaan dari Kekasihnya Monica.
```

## 🎯 Impact

- ✅ Kata bercetak tebal muncul dengan benar
- ✅ User dapat menjawab soal PBM/Literasi
- ✅ Konsistensi antara pertanyaan dan stimulus
- ✅ Visual clarity meningkat

**Status**: ✅ FIXED
