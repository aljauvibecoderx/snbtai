# Firebase Firestore Rules

Buka Firebase Console → Firestore Database → Rules

Paste rules berikut:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Posts collection
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## Firebase Storage Rules

Buka Firebase Console → Storage → Rules

Paste rules berikut:

```
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /posts/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null 
                   && request.resource.size < 2 * 1024 * 1024;
    }
  }
}
```

## Penjelasan Rules:

### Firestore:
- **users**: Semua bisa baca, hanya owner yang bisa edit
- **posts**: Semua bisa baca, user login bisa create/update, hanya owner yang bisa delete

### Storage:
- **posts**: Semua bisa baca, user login bisa upload max 2MB

Setelah paste rules, klik **Publish** untuk mengaktifkan.
