# Quick Fix - Permissions Error

## Problem
Firebase permissions error saat auto-save ke `bank_soal` dan `soal_saya`.

## Solution
Hapus auto-save, biarkan manual save nanti setelah Firestore rules diupdate.

## Changes Made

### App.js
1. ✅ Removed `await saveToBankSoal()` from handleStart
2. ✅ Removed `await saveToBankSoal()` from handleVisionGenerate  
3. ✅ Removed `await saveToSoalSaya()` from completeExam

### What Still Works
- ✅ questionSetId created and saved to question_sets
- ✅ resultId created and saved to results
- ✅ State management (questionSetId, resultId)
- ✅ Legacy system (backward compatible)
- ✅ URL paths remain `/question` and `/result`

### Next Steps (Manual Implementation)
User dapat manual save ke bank_soal/soal_saya dengan button nanti setelah Firestore rules ready.

## Firestore Rules Needed

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bank_soal/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    match /soal_saya/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    match /question_sets/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    match /results/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```
