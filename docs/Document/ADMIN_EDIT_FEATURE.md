# Admin Edit Tryout Feature

## Fitur Baru

### 1. Edit Tryout
Admin dapat mengedit tryout yang sudah dibuat dengan fitur:
- ✅ Edit judul tryout
- ✅ Edit deskripsi
- ✅ **Atur waktu/durasi** (dalam menit)
- ✅ Ganti set soal (opsional)
- ✅ Rekomendasi durasi otomatis (jumlah soal × 1.5 menit)

### 2. Cara Menggunakan
1. Login ke Admin Panel (`/superuser`)
2. Masuk ke tab "Kelola Tryout"
3. Klik tombol **Edit** pada tryout yang ingin diubah
4. Modal edit akan muncul dengan form:
   - **Judul**: Ubah judul tryout
   - **Deskripsi**: Ubah deskripsi
   - **Durasi**: Atur waktu dalam menit (ada rekomendasi otomatis)
   - **Set Soal**: Pilih set baru jika ingin mengganti soal (opsional)
5. Klik "Simpan Perubahan"

### 3. Firestore Rules
Rules sudah mendukung update tryout oleh admin:

```javascript
match /tryouts/{tryoutId} {
  allow read: if request.auth != null;
  allow write: if isAdmin();  // ✅ Sudah support update
}
```

**TIDAK PERLU** update Firestore rules karena:
- `allow write` sudah mencakup `create`, `update`, dan `delete`
- Function `isAdmin()` sudah mengecek role admin dari Firestore

### 4. Backend Functions

#### firebase-admin.js
```javascript
// Update tryout
export const updateTryout = async (tryoutId, updateData, adminId) => {
  await updateDoc(doc(db, 'tryouts', tryoutId), updateData);
  
  // Log admin action
  await addDoc(collection(db, 'admin_logs'), {
    adminId,
    action: 'update_tryout',
    targetId: tryoutId,
    timestamp: serverTimestamp(),
    details: updateData
  });
};
```

### 5. Update Data Structure
Saat edit, data yang bisa diupdate:
```javascript
{
  title: string,              // Judul baru
  description: string,        // Deskripsi baru
  totalDuration: number,      // Durasi dalam detik (menit × 60)
  questionsList: array,       // List soal baru (jika ganti set)
  sourceSetIds: array         // ID set soal yang dipilih
}
```

### 6. Fitur Tambahan
- **Rekomendasi Durasi**: Otomatis menghitung `jumlah_soal × 1.5 menit`
- **Preview Set**: Menampilkan jumlah soal dan level kesulitan
- **Warning**: Peringatan jika mengganti set soal (akan menimpa soal lama)
- **Admin Logs**: Setiap update tercatat di collection `admin_logs`

## Security
✅ Hanya admin yang bisa edit tryout
✅ Semua action tercatat di admin_logs
✅ Firestore rules sudah aman
✅ Role checking dengan cache (5 menit TTL)

## Testing Checklist
- [ ] Edit judul tryout
- [ ] Edit deskripsi
- [ ] Ubah durasi waktu
- [ ] Ganti set soal
- [ ] Simpan tanpa ganti set soal
- [ ] Cancel edit
- [ ] Cek admin_logs setelah update
- [ ] Cek tryout di user dashboard setelah edit
