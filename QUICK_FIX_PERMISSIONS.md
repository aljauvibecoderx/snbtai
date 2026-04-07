# Quick Fix: Permission Errors in Ambis Battle

## 🔴 Error Message
```
Missing or insufficient permissions.
FirebaseError: Missing or insufficient permissions.
```

## ✅ Solution (3 Steps)

### Step 1: Deploy Firestore Rules
```bash
# Option A: Use the batch file (Windows)
deploy-firestore-all.bat

# Option B: Manual command
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### Step 2: Wait 30 seconds
Rules need time to propagate across Firebase servers.

### Step 3: Refresh Browser
- Press `Ctrl + Shift + R` (hard refresh)
- Or close and reopen the browser

---

## 🔍 What Was Added

### New Firestore Rules:
```javascript
// ambis_battle_groups - Custom subtest groups
match /ambis_battle_groups/{groupId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null && 
                   request.resource.data.createdBy == request.auth.uid;
  allow update, delete: if request.auth != null && 
                           resource.data.createdBy == request.auth.uid;
}

// ambis_battle_configs - User settings
match /ambis_battle_configs/{userId} {
  allow read, write: if request.auth != null && 
                        request.auth.uid == userId;
}
```

### New Indexes:
1. `ambis_battle_groups` - Query by creator
2. `question_sets` - Query by visibility

---

## 🧪 Test After Deployment

Open browser console (F12) and run:

```javascript
// Test 1: Check if logged in
console.log('User:', auth.currentUser);

// Test 2: Load groups
import { getSubtestGroups } from './services/firebase/ambisBattleConfig';
const groups = await getSubtestGroups(auth.currentUser.uid);
console.log('Groups loaded:', groups.length);

// Test 3: Create test group
import { saveSubtestGroup } from './services/firebase/ambisBattleConfig';
await saveSubtestGroup({
  name: 'Test Group',
  subtests: ['tps_pu'],
  questionsPerSubtest: 5,
  totalQuestions: 5
}, auth.currentUser.uid);
console.log('Test group created!');
```

---

## 🚨 Still Getting Errors?

### Error: "The query requires an index"
**Solution**: Click the link in error message → Create Index → Wait 2-5 minutes

### Error: "User not authenticated"
**Solution**: Make sure you're logged in to the app

### Error: "PERMISSION_DENIED"
**Solution**: 
1. Check `primary/firestore.rules` file exists
2. Run `firebase deploy --only firestore:rules` again
3. Wait 1 minute
4. Hard refresh browser (Ctrl + Shift + R)

---

## 📋 Checklist

Before using Ambis Battle features:
- [ ] Deployed rules: `firebase deploy --only firestore:rules`
- [ ] Deployed indexes: `firebase deploy --only firestore:indexes`
- [ ] Waited 30 seconds
- [ ] Refreshed browser
- [ ] Logged in to app
- [ ] Tested in console

---

## 🎯 Where to Use

### Admin Panel
- Go to Admin Panel → Ambis Battle tab
- Create/edit/delete custom groups
- Should work after deploying rules

### User - Generate Question
- Create Ambis Battle room
- Go to Generate Question page
- Click "Pilih Grup Subtest"
- Select a group
- Should load questions from bank soal

---

## 💡 Pro Tips

1. **Always deploy rules first** before testing new features
2. **Wait 30 seconds** after deployment for rules to propagate
3. **Hard refresh** (Ctrl + Shift + R) to clear cache
4. **Check console** (F12) for detailed error messages
5. **Test in incognito** if still having issues (clears all cache)

---

## 📞 Need Help?

If still getting errors after following all steps:
1. Screenshot the error in console (F12)
2. Check Firebase Console → Firestore → Rules (verify they're published)
3. Check Firebase Console → Firestore → Indexes (verify they're built)
4. Share error details for further debugging
