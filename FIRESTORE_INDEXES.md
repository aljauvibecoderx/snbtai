# Firestore Indexes for Ambis Battle Features

## Required Indexes

### 1. ambis_battle_groups Collection

**Index 1: Query by creator with ordering**
```
Collection: ambis_battle_groups
Fields:
  - createdBy (Ascending)
  - createdAt (Descending)
```

**How to create**:
1. Go to Firebase Console → Firestore Database → Indexes
2. Click "Create Index"
3. Collection ID: `ambis_battle_groups`
4. Add fields:
   - Field: `createdBy`, Order: Ascending
   - Field: `createdAt`, Order: Descending
5. Click "Create"

---

### 2. question_sets Collection (for random retrieval)

**Index 2: Query by visibility**
```
Collection: question_sets
Fields:
  - visibility (Ascending)
```

**Note**: This index might already exist. If you get an error about it, you can skip this one.

---

## How to Deploy Rules

### Option 1: Using the batch file
```bash
# Run from project root
deploy-firestore-rules.bat
```

### Option 2: Manual deployment
```bash
# Make sure you're logged in
firebase login

# Deploy rules
firebase deploy --only firestore:rules
```

### Option 3: Firebase Console (Manual)
1. Go to Firebase Console
2. Select your project
3. Go to Firestore Database → Rules
4. Copy content from `primary/firestore.rules`
5. Paste and click "Publish"

---

## Verify Rules are Working

After deploying, test with this code in browser console:

```javascript
// Test reading groups (should work when logged in)
import { getSubtestGroups } from './services/firebase/ambisBattleConfig';
const groups = await getSubtestGroups(auth.currentUser.uid);
console.log('Groups:', groups);

// Test creating group (should work when logged in)
import { saveSubtestGroup } from './services/firebase/ambisBattleConfig';
await saveSubtestGroup({
  name: 'Test Group',
  subtests: ['tps_pu'],
  questionsPerSubtest: 5,
  totalQuestions: 5
}, auth.currentUser.uid);
```

---

## Troubleshooting

### Error: "Missing or insufficient permissions"

**Cause**: Rules not deployed or user not authenticated

**Solution**:
1. Make sure you're logged in
2. Deploy rules using one of the methods above
3. Refresh the page
4. Try again

### Error: "The query requires an index"

**Cause**: Firestore needs a composite index

**Solution**:
1. Click the link in the error message (it will take you to Firebase Console)
2. Click "Create Index"
3. Wait 2-5 minutes for index to build
4. Try again

### Error: "PERMISSION_DENIED"

**Cause**: User doesn't have permission or rules are incorrect

**Solution**:
1. Check if user is logged in: `console.log(auth.currentUser)`
2. Verify rules are deployed
3. Check if trying to access someone else's data

---

## Rules Summary

### ambis_battle_groups
- ✅ Read: Any authenticated user
- ✅ Create: Authenticated user (must set createdBy to own UID)
- ✅ Update/Delete: Only creator

### ambis_battle_configs
- ✅ Read/Write: Only owner (userId matches document ID)

### question_sets
- ✅ Read: Anyone (public)
- ✅ Create: Authenticated user
- ✅ Update/Delete: Creator or admin

---

## Quick Fix Commands

If you're getting permission errors, run these in order:

```bash
# 1. Deploy rules
firebase deploy --only firestore:rules

# 2. Wait 30 seconds for rules to propagate

# 3. Refresh your browser

# 4. Test in console
console.log('User:', auth.currentUser);
```

---

## Index Creation via Firebase CLI

Alternatively, create `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "ambis_battle_groups",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "createdBy", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

Then deploy:
```bash
firebase deploy --only firestore:indexes
```
