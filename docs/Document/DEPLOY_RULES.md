# Deploy Firestore Rules

## Cara Deploy Rules ke Firebase Console:

1. Buka Firebase Console: https://console.firebase.google.com/
2. Pilih project Anda
3. Klik **Firestore Database** di menu kiri
4. Klik tab **Rules**
5. Copy paste isi file `firestore.rules` ke editor
6. Klik **Publish**

## Atau gunakan Firebase CLI:

```bash
# Install Firebase CLI jika belum
npm install -g firebase-tools

# Login
firebase login

# Init project (pilih Firestore)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

## Rules yang sudah diperbaiki:

- ✅ Posts collection: read public, create/update untuk authenticated users
- ✅ Likes dan comments bisa diupdate oleh semua user yang login
- ✅ Delete hanya untuk owner post
