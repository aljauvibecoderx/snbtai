# Troubleshooting: Ambis Battle Issues

## ❌ Error 1: "showToast is not a function"

### Penyebab
Komponen `AmbisBattleGroupManager` dipanggil tanpa prop `showToast`.

### Solusi
✅ **Sudah diperbaiki!** Sekarang menggunakan fallback `alert()` jika `showToast` tidak tersedia.

### Verifikasi
Coba buat grup baru di Admin Panel → Ambis Battle. Seharusnya muncul alert "✅ Grup berhasil disimpan".

---

## ❌ Error 2: "Tidak ada soal tersedia untuk grup ini"

### Penyebab
Bank Soal kosong atau tidak ada soal dengan subtest yang sesuai.

### Solusi

#### Opsi 1: Generate Soal dengan AI (Recommended)
```
1. Buka halaman Generate Question
2. Gunakan "Generate Soal dengan AI"
3. Pilih subtest yang sesuai (misal: tps_pu, tps_pk)
4. Generate 5-10 soal
5. Simpan soal
6. Coba lagi ambil dari grup
```

#### Opsi 2: Cek Bank Soal di Admin Panel
```
1. Login sebagai admin
2. Admin Panel → Bank Soal
3. Cek apakah ada paket soal
4. Lihat subtest dari setiap paket
5. Pastikan subtest sesuai dengan grup yang dipilih
```

#### Opsi 3: Buat Soal Manual
```
1. Di halaman Generate Question
2. Klik "Tambah Soal Manual"
3. Isi soal dengan subtest yang sesuai
4. Simpan
```

---

## 🔍 Cara Cek Ketersediaan Soal

### Via Browser Console (F12)
```javascript
// Cek semua question sets
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './services/firebase/firebase';

const q = query(
  collection(db, 'question_sets'),
  where('visibility', '==', 'public')
);
const snapshot = await getDocs(q);

console.log('Total question sets:', snapshot.size);

snapshot.docs.forEach(doc => {
  const data = doc.data();
  console.log('Set:', data.title);
  console.log('Questions:', data.questions?.length || 0);
  console.log('Category:', data.category);
  if (data.questions) {
    const subtests = [...new Set(data.questions.map(q => q.subtest))];
    console.log('Subtests:', subtests);
  }
  console.log('---');
});
```

---

## 📊 Mapping Subtest

Pastikan subtest di soal sesuai dengan grup:

### Default Groups:
| Grup | Subtests yang Dicari |
|------|---------------------|
| TPS Lengkap | `tps_pu`, `tps_pk`, `tps_pbm`, `tps_ppu` (20 soal) |
| Literasi Lengkap | `lit_ind`, `lit_ing` (10 soal) |
| SNBT Mini | `tps_pu`, `tps_pk`, `lit_ind`, `pm` (12 soal) |
| SNBT Lengkap | `tps_pu`, `tps_pk`, `tps_pbm`, `tps_ppu`, `lit_ind`, `lit_ing`, `pm` (35 soal) |

### Subtest IDs yang Valid:
- `tps_pu` - TPS Penalaran Umum
- `tps_pk` - TPS Pengetahuan Kuantitatif
- `tps_pbm` - TPS Pemahaman Bacaan
- `tps_ppu` - TPS Pengetahuan & Pemahaman Umum
- `lit_ind` - Literasi Indonesia
- `lit_ing` - Literasi Inggris
- `pm` - Penalaran Matematika

---

## 🛠️ Fix: Populate Bank Soal

### Script untuk Generate Soal Awal

Jalankan di browser console untuk membuat soal sample:

```javascript
import { saveQuestionSetWithId } from './services/firebase/firebase';
import { auth } from './services/firebase/firebase';

// Sample questions untuk TPS PU
const sampleQuestions = [
  {
    text: "Jika semua A adalah B, dan semua B adalah C, maka...",
    options: ["A. Semua A adalah C", "B. Semua C adalah A", "C. Tidak ada A yang C", "D. Tidak dapat disimpulkan", "E. Semua benar"],
    correctIndex: 0,
    explanation: "Silogisme: A→B, B→C, maka A→C",
    subtest: "tps_pu",
    topic: "Logika",
    difficulty: "Sedang"
  },
  // Add more questions...
];

// Save to Firestore
await saveQuestionSetWithId({
  title: "TPS Penalaran Umum - Sample",
  category: "tps_pu",
  questions: sampleQuestions,
  questionCount: sampleQuestions.length,
  difficulty: 3,
  visibility: "public"
}, auth.currentUser.uid);

console.log('✅ Sample questions created!');
```

---

## ⚠️ Common Issues

### Issue: "Questions fetched: 0"
**Penyebab**: Tidak ada soal dengan subtest yang cocok

**Solusi**:
1. Cek console log untuk melihat subtest apa yang dicari
2. Buat soal dengan subtest yang sesuai
3. Atau ubah grup untuk menggunakan subtest yang tersedia

### Issue: "Hanya X soal tersedia dari Y yang diharapkan"
**Penyebab**: Bank soal kurang lengkap

**Solusi**:
1. Generate lebih banyak soal dengan AI
2. Atau kurangi `questionsPerSubtest` di grup
3. Atau gunakan grup yang lebih kecil (misal: TPS Lengkap → SNBT Mini)

### Issue: Soal yang sama muncul terus
**Penyebab**: Bank soal terbatas

**Solusi**:
1. Generate lebih banyak variasi soal
2. Buat soal dengan topik berbeda
3. Gunakan AI Generator dengan konteks berbeda

---

## 🎯 Best Practices

### 1. Populate Bank Soal Dulu
Sebelum menggunakan fitur grup, pastikan sudah ada minimal:
- 10 soal per subtest untuk grup kecil
- 20 soal per subtest untuk grup besar

### 2. Gunakan AI Generator
Cara tercepat untuk populate bank soal:
```
1. Generate 10 soal TPS PU
2. Generate 10 soal TPS PK
3. Generate 10 soal Literasi Indonesia
4. Generate 10 soal PM
5. Sekarang bisa pakai grup "SNBT Mini"
```

### 3. Verifikasi Subtest
Pastikan soal yang di-generate memiliki field `subtest` yang benar:
- Cek di Admin Panel → Bank Soal
- Lihat detail setiap paket
- Pastikan subtest sesuai dengan yang diharapkan

### 4. Test dengan Grup Kecil Dulu
Mulai dengan grup yang kecil:
1. Buat custom grup dengan 1 subtest, 3 soal
2. Test apakah bisa load soal
3. Jika berhasil, buat grup yang lebih besar

---

## 📝 Checklist Sebelum Menggunakan Grup

- [ ] Bank Soal sudah ada (cek di Admin Panel)
- [ ] Soal memiliki subtest yang sesuai
- [ ] Minimal 5 soal per subtest
- [ ] Visibility soal = "public"
- [ ] Firestore rules sudah di-deploy
- [ ] User sudah login

---

## 🔄 Quick Fix Workflow

Jika error "tidak ada soal tersedia":

```
1. Buka Generate Question page
2. Gunakan AI Generator:
   - Subtest: tps_pu
   - Jumlah: 10 soal
   - Generate
3. Ulangi untuk subtest lain (tps_pk, lit_ind, pm)
4. Sekarang coba "Pilih Grup Subtest" lagi
5. Pilih "SNBT Mini"
6. Seharusnya berhasil load soal
```

---

## 💡 Tips

1. **Generate soal dalam batch**: Generate 10 soal sekaligus lebih efisien
2. **Variasi topik**: Gunakan topik berbeda untuk variasi soal
3. **Simpan soal bagus**: Soal yang bagus bisa dipakai berkali-kali
4. **Backup bank soal**: Export soal penting ke JSON
5. **Monitor usage**: Cek berapa soal tersedia per subtest

---

## 📞 Need More Help?

Jika masih ada masalah:
1. Screenshot error di console (F12)
2. Cek berapa soal di Bank Soal
3. Cek subtest dari soal yang ada
4. Share info untuk debugging lebih lanjut
