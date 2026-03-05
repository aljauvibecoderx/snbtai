# ⚡ Quick Fix: Vocab Permissions Error

## 🔴 Error
```
FirebaseError: Missing or insufficient permissions.
```

## ✅ Solution (2 Minutes)

### Step 1: Open Firebase Console
1. Go to https://console.firebase.google.com/
2. Select your project
3. Click **Firestore Database** → **Rules** tab

### Step 2: Add These Rules
Scroll to bottom of rules, add before closing `}`:

```javascript
match /vocab/{vocabId} {
  allow read: if request.auth != null && request.auth.uid == resource.data.userId;
  allow create: if request.auth != null;
  allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
}

match /wishlist/{wishlistId} {
  allow read: if request.auth != null && request.auth.uid == resource.data.userId;
  allow create: if request.auth != null;
  allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
}
```

### Step 3: Publish
Click **Publish** button

### Step 4: Test
1. Refresh aplikasi
2. Login
3. Dashboard → Vocab tab
4. Error hilang ✅

---

## 📝 Full Rules File

Atau copy-paste seluruh isi `firestore.rules` dari project ke Firebase Console.

---

**Time**: ~2 minutes  
**Difficulty**: Easy  
**Required**: Firebase Console access
