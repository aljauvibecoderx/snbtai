# 🧪 Vocab Feature - Quick Test Guide

## ⚡ 5-Minute Test

### Prerequisites
✅ User sudah login  
✅ Firestore rules sudah di-setup (vocab collection)

### Test Steps

#### 1️⃣ Access Vocab (30 detik)
```
1. Login ke aplikasi
2. Pilih subtest: "Literasi Bahasa Inggris"
3. Generate soal (tulis cerita minimal 20 karakter)
4. Masuk ke CBT View
```

**Expected**: 
- ✅ Button "Vocab" muncul di header (desktop: icon + text, mobile: icon only)

---

#### 2️⃣ Open Vocab Panel (15 detik)
```
1. Klik button "Vocab" di header
```

**Expected**:
- ✅ Panel slide in dari kanan
- ✅ Tampil stats: "Kata Tersimpan: 0", "Total XP: 0"
- ✅ Button "Cari Kata" visible
- ✅ Panel responsive (mobile: 224px, desktop: 256px)

---

#### 3️⃣ Highlight & Save Text (60 detik)
```
1. Scroll ke stimulus atau question text
2. Highlight/select kata (max 3 kata)
3. Popup muncul dengan kata yang diselect
4. Klik "Save"
5. Input field muncul (auto-focus)
6. Ketik arti kata (contoh: "efektif")
7. Press Enter atau klik "Simpan"
```

**Expected**:
- ✅ Text bisa diselect (cursor berubah)
- ✅ Popup muncul di atas text yang diselect
- ✅ Popup menampilkan kata yang dipilih
- ✅ Setelah klik "Save": Input field expand
- ✅ Input field auto-focus
- ✅ Button "Simpan" disabled jika kosong
- ✅ Setelah input arti & save: Toast "Vocab berhasil disimpan! +5 XP"
- ✅ Stats di panel update (Kata Tersimpan: 1, Total XP: 5)

---

#### 4️⃣ Search & Save Word (75 detik)
```
1. Klik "Cari Kata" di Vocab Panel
2. Modal search muncul
3. Input kata (English): "beautiful"
4. Input arti (Indonesia): "indah, cantik"
5. Klik "Simpan Vocab"
```

**Expected**:
- ✅ Modal fullscreen muncul
- ✅ Dua input field: Kata & Arti
- ✅ Input field bisa diketik
- ✅ Button "Simpan Vocab" disabled jika salah satu kosong
- ✅ Button enabled jika kedua field terisi
- ✅ Setelah save: Modal close, toast success
- ✅ Stats update (Kata Tersimpan: 2, Total XP: 10)

---

#### 5️⃣ Duplicate Prevention (30 detik)
```
1. Highlight kata yang sama lagi
2. Klik "Save"
```

**Expected**:
- ✅ Toast: "Kata sudah ada di vocab list"
- ✅ Stats tidak berubah

---

#### 6️⃣ Non-English Subtest (30 detik)
```
1. Kembali ke Home
2. Pilih subtest: "Penalaran Umum"
3. Generate soal
```

**Expected**:
- ✅ Button "Vocab" TIDAK muncul
- ✅ Text TIDAK bisa diselect

---

#### 7️⃣ Logout Test (15 detik)
```
1. Logout dari aplikasi
2. Pilih "Literasi Bahasa Inggris"
3. Generate soal
```

**Expected**:
- ✅ Button "Vocab" TIDAK muncul (karena belum login)

---

## 🐛 Common Issues & Solutions

### Issue 1: Text tidak bisa diselect
**Cause**: `userSelect: 'none'` masih ada di container utama  
**Fix**: Pastikan hanya stimulus & question yang punya `userSelect: 'text'`

### Issue 2: Button vocab tidak muncul
**Cause**: Condition `!isMobile` masih ada  
**Fix**: Hapus condition `!isMobile`, ganti dengan responsive class

### Issue 3: Panel tidak muncul di mobile
**Cause**: Panel di-wrap dengan `{!isMobile && ...}`  
**Fix**: Hapus wrapper, buat panel responsive dengan Tailwind

### Issue 4: Firestore permission error
**Cause**: Rules belum di-setup  
**Fix**: Lihat `VOCAB_PERMISSIONS_FIX.md`

---

## 📊 Success Criteria

✅ **All 7 tests passed**  
✅ **No console errors**  
✅ **Responsive di mobile & desktop**  
✅ **Toast notifications working**  
✅ **Stats update correctly**

---

**Total Test Time**: ~5-6 minutes  
**Difficulty**: Easy  
**Required**: Login + English Literacy subtest
