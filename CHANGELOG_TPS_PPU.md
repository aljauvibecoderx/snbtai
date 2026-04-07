# Changelog - TPS PPU Addition

## ✅ Perubahan

### Subtest TPS PPU Ditambahkan

**Sebelumnya**: Hanya 6 subtest tersedia
- tps_pu, tps_pk, tps_pbm, lit_ind, lit_ing, pm

**Sekarang**: 7 subtest tersedia
- tps_pu, tps_pk, tps_pbm, **tps_ppu**, lit_ind, lit_ing, pm

---

## 📊 Update Default Groups

### TPS Lengkap
- **Sebelum**: 15 soal (PU, PK, PBM)
- **Sekarang**: 20 soal (PU, PK, PBM, **PPU**)

### SNBT Lengkap
- **Sebelum**: 30 soal (6 subtests)
- **Sekarang**: 35 soal (7 subtests termasuk **PPU**)

### Tidak Berubah:
- Literasi Lengkap: 10 soal
- SNBT Mini: 12 soal

---

## 🎯 Apa itu TPS PPU?

**TPS - Pengetahuan & Pemahaman Umum**

Subtest yang menguji:
- Pengetahuan umum
- Wawasan kebangsaan
- Sejarah
- Geografi
- Ekonomi
- Sosial budaya

---

## 📁 Files Modified

1. `src/features/admin/AmbisBattleGroupManager.js`
   - Added `tps_ppu` to availableSubtests

2. `src/services/firebase/ambisBattleConfig.js`
   - Updated DEFAULT_SUBTEST_GROUPS
   - TPS Lengkap: 15 → 20 soal
   - SNBT Lengkap: 30 → 35 soal

3. `TROUBLESHOOTING_AMBIS_BATTLE.md`
   - Updated subtest mapping table
   - Added tps_ppu to valid subtest IDs

4. `IMPLEMENTATION_SUMMARY.md`
   - Updated default groups documentation

---

## 🔄 Migration Guide

### Untuk Admin

**Grup yang sudah ada tidak terpengaruh**. Hanya default groups yang diupdate.

Jika ingin menambahkan PPU ke custom group:
1. Admin Panel → Ambis Battle
2. Edit grup yang ada
3. Centang "TPS - Pengetahuan & Pemahaman Umum"
4. Adjust questions per subtest jika perlu
5. Simpan

### Untuk User

**Tidak ada action yang diperlukan**. 

Grup default akan otomatis menggunakan konfigurasi baru:
- TPS Lengkap sekarang include PPU
- SNBT Lengkap sekarang include PPU

---

## 🧪 Testing

### Test 1: Cek Available Subtests
```
1. Admin Panel → Ambis Battle
2. Klik "Tambah Grup"
3. Lihat checkbox subtests
4. Harus ada 7 pilihan (termasuk PPU)
```

### Test 2: Default Groups
```
1. Generate Question page
2. Klik "Pilih Grup Subtest"
3. Lihat "TPS Lengkap"
4. Harus menunjukkan 20 soal (bukan 15)
5. Lihat "SNBT Lengkap"
6. Harus menunjukkan 35 soal (bukan 30)
```

### Test 3: Generate Questions
```
1. Generate Question page
2. AI Generator: Subtest = "Pengetahuan & Pemahaman Umum"
3. Generate 5 soal
4. Soal harus memiliki subtest = "tps_ppu"
5. Bisa digunakan di grup yang include PPU
```

---

## 📝 Notes

### Backward Compatibility
✅ Custom groups yang sudah ada tetap berfungsi
✅ Soal lama tidak terpengaruh
✅ Hanya default groups yang berubah

### Question Bank
⚠️ Untuk menggunakan grup dengan PPU, pastikan ada soal dengan subtest `tps_ppu` di bank soal.

Cara populate:
```
1. Generate Question page
2. AI Generator:
   - Subtest: Pengetahuan & Pemahaman Umum
   - Topic: Sejarah / Geografi / Ekonomi
   - Jumlah: 10 soal
3. Generate & Simpan
```

---

## 🎓 Subtest Lengkap SNBT 2024

Sekarang sistem support semua 7 subtest resmi SNBT:

### TPS (Tes Potensi Skolastik)
1. ✅ Penalaran Umum (PU)
2. ✅ Pengetahuan Kuantitatif (PK)
3. ✅ Pemahaman Bacaan & Menulis (PBM)
4. ✅ Pengetahuan & Pemahaman Umum (PPU) ← **BARU**

### Literasi
5. ✅ Literasi Bahasa Indonesia
6. ✅ Literasi Bahasa Inggris

### Matematika
7. ✅ Penalaran Matematika

---

## ✨ Summary

- ✅ TPS PPU ditambahkan ke sistem
- ✅ Default groups diupdate
- ✅ Total 7 subtests tersedia
- ✅ Backward compatible
- ✅ Dokumentasi diupdate

Sistem sekarang lengkap sesuai struktur SNBT resmi! 🎉
