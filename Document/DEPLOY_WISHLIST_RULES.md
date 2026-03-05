# 🔒 DEPLOY FIRESTORE SECURITY RULES - WISHLIST

## ⚠️ CRITICAL: Security Rules Belum Aktif!

Error `Missing or insufficient permissions` terjadi karena Firestore security rules untuk collection `wishlist` belum di-deploy.

## 📋 Langkah Deploy (5 Menit)

### 1. Buka Firebase Console
- Go to: https://console.firebase.google.com
- Pilih project Anda
- Klik **Firestore Database** di sidebar kiri
- Klik tab **Rules**

### 2. Tambahkan Rules untuk Wishlist

Tambahkan rules berikut di dalam `match /databases/{database}/documents { ... }`:

```javascript
// Wishlist Collection Rules
match /wishlist/{wishlistId} {
  // Allow read if user owns the wishlist item
  allow read: if request.auth != null && request.auth.uid == resource.data.userId;
  
  // Allow create if user is authenticated and userId matches
  allow create: if request.auth != null 
                && request.auth.uid == request.resource.data.userId
                && request.resource.data.keys().hasAll(['userId', 'questionSetId', 'questionIndex', 'subtest', 'setTitle', 'question', 'savedAt']);
  
  // Allow delete if user owns the wishlist item
  allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
  
  // No updates allowed (delete and recreate instead)
  allow update: if false;
}
```

### 3. Publish Rules
- Klik tombol **Publish** di kanan atas
- Tunggu beberapa detik hingga rules aktif

### 4. Test
- Refresh aplikasi
- Login dengan akun Google
- Coba bookmark soal
- Seharusnya berhasil tanpa error

## 🎯 Penjelasan Rules

- **read**: User hanya bisa baca wishlist miliknya sendiri
- **create**: User hanya bisa create wishlist dengan userId-nya sendiri
- **delete**: User hanya bisa hapus wishlist miliknya sendiri
- **update**: Tidak diizinkan (gunakan delete + create)

## ✅ Verifikasi

Setelah deploy, cek di Firebase Console:
1. Firestore Database > Rules
2. Pastikan ada section `match /wishlist/{wishlistId}`
3. Status harus "Published"

## 🐛 Troubleshooting

**Error masih muncul?**
- Clear browser cache
- Logout dan login ulang
- Tunggu 1-2 menit untuk propagasi rules
- Cek Firebase Console > Firestore > Rules tab untuk error syntax

**Rules tidak muncul?**
- Pastikan Anda edit di tab "Rules" bukan "Indexes"
- Jangan hapus rules yang sudah ada, hanya tambahkan
- Klik "Publish" setelah edit

## 📝 File Reference

Full rules ada di: `firestore-wishlist-rules.txt`
