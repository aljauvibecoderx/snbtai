# 🔒 Firestore Rules Update - Vocab & Wishlist

## ⚠️ CRITICAL: Deploy Firestore Rules

Firestore rules telah diupdate untuk mendukung **Vocab Mode** dan **Wishlist**. Anda HARUS deploy rules ini ke Firebase Console.

---

## 📋 Rules yang Ditambahkan

### 1. Vocab Collection
```javascript
match /vocab/{vocabId} {
  allow read: if request.auth != null && request.auth.uid == resource.data.userId;
  allow create: if request.auth != null;
  allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
}
```

**Security**:
- ✅ User hanya bisa read vocab miliknya sendiri
- ✅ User hanya bisa create jika authenticated
- ✅ User hanya bisa update/delete vocab miliknya sendiri

### 2. Wishlist Collection
```javascript
match /wishlist/{wishlistId} {
  allow read: if request.auth != null && request.auth.uid == resource.data.userId;
  allow create: if request.auth != null;
  allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
}
```

**Security**:
- ✅ User hanya bisa read wishlist miliknya sendiri
- ✅ User hanya bisa create jika authenticated
- ✅ User hanya bisa delete wishlist miliknya sendiri

---

## 🚀 Cara Deploy Rules

### **Method 1: Firebase Console (Recommended)**

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Pilih project Anda
3. Klik **Firestore Database** di sidebar
4. Klik tab **Rules**
5. Copy-paste isi file `firestore.rules` ke editor
6. Klik **Publish**

### **Method 2: Firebase CLI**

```bash
# Install Firebase CLI (jika belum)
npm install -g firebase-tools

# Login
firebase login

# Deploy rules
firebase deploy --only firestore:rules
```

---

## ✅ Verifikasi

Setelah deploy, test dengan:

1. **Login** ke aplikasi
2. Buka **Dashboard → Vocab**
3. Jika tidak ada error "Missing or insufficient permissions" → ✅ Success
4. Coba save vocab dari CBT View (Literasi Bahasa Inggris)
5. Coba delete vocab dari Dashboard

---

## 🐛 Troubleshooting

### Error: "Missing or insufficient permissions"

**Penyebab**: Rules belum di-deploy atau salah konfigurasi

**Solusi**:
1. Pastikan rules sudah di-deploy
2. Pastikan user sudah login
3. Pastikan `userId` field ada di document vocab
4. Check Firebase Console → Firestore → Rules → pastikan rules sudah ter-publish

### Error: "PERMISSION_DENIED"

**Penyebab**: User mencoba akses vocab user lain

**Solusi**: Ini expected behavior. Rules bekerja dengan benar untuk mencegah unauthorized access.

---

## 📊 Firestore Schema

### Vocab Collection
```
vocab/
  {vocabId}/
    - userId: string (required)
    - word: string
    - meaning: string
    - example: string
    - source: "highlight" | "manual_search"
    - savedAt: timestamp
    - lastReviewed: timestamp | null
    - reviewCount: number
    - nextReview: timestamp
    - mastered: boolean
    - xpEarned: number
```

### Wishlist Collection
```
wishlist/
  {wishlistId}/
    - userId: string (required)
    - questionSetId: string
    - questionIndex: number
    - question: object
    - subtest: string
    - setTitle: string
    - savedAt: timestamp
```

---

## 🔐 Security Best Practices

✅ **Ownership-based access**: User hanya bisa akses data miliknya  
✅ **Authentication required**: Semua operasi butuh login  
✅ **No public read**: Vocab dan wishlist private per user  
✅ **No cross-user access**: User A tidak bisa lihat vocab User B  

---

**Status**: ⏳ **PENDING DEPLOYMENT**  
**Action Required**: Deploy `firestore.rules` ke Firebase Console  
**Priority**: 🔴 **HIGH** (Vocab feature tidak akan berfungsi tanpa rules ini)
