# Bank Soal Deletion Feature - Quick Reference

## What Was Added

### Admin-Only Delete Functionality for Bank Soal
Admins can now permanently delete question sets from the public Bank Soal with full audit logging.

## How It Works

### For Admins
1. Go to Dashboard → Bank Soal tab
2. Hover over any question set card
3. Red trash icon appears in top-right corner
4. Click trash icon
5. Confirmation dialog appears
6. Click "Hapus" to confirm permanent deletion
7. Set and all its questions are deleted from database
8. Action is logged in admin_logs

### For Regular Users
- No delete button visible in Bank Soal
- Can only delete their own sets from "Soal Saya" tab

## Key Files

| File | Changes |
|------|---------|
| `firebase-admin.js` | Added `deleteQuestionSetAsAdmin()` function |
| `DashboardView.js` | Added admin check, delete button, updated handler |

## Functions

### `deleteQuestionSetAsAdmin(setId, adminId)`
**Location:** firebase-admin.js

**Purpose:** Delete a question set as admin with audit logging

**Parameters:**
- `setId` (string): ID of question set to delete
- `adminId` (string): ID of admin performing deletion

**Returns:** true on success

**Throws:** Error if user is not admin

**Side Effects:**
- Deletes all questions with matching setId
- Deletes question_sets document
- Creates entry in admin_logs collection

### `checkAdminRole(userId, forceRefresh)`
**Location:** firebase-admin.js

**Purpose:** Check if user has admin role

**Parameters:**
- `userId` (string): User ID to check
- `forceRefresh` (boolean): Skip cache and fetch fresh data

**Returns:** boolean (true if admin)

**Caching:** 5-minute cache with auto-refresh

## State Variables

```javascript
const [isAdmin, setIsAdmin] = useState(false);
const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
```

## Component Flow

```
DashboardView mounts
    ↓
checkUserAdmin() called
    ↓
checkAdminRole() verifies admin status
    ↓
isAdmin state updated
    ↓
Bank Soal renders with/without delete button
    ↓
User hovers over card
    ↓
Delete button appears (if isAdmin)
    ↓
User clicks delete
    ↓
Confirmation dialog shown
    ↓
User confirms
    ↓
handleDelete() called with isPublic=true
    ↓
deleteQuestionSetAsAdmin() executes
    ↓
Dashboard reloads
```

## Admin Privileges

### Automatic Admin Assignment
- Email: `superuserdeveloper@protonmail.com`
- Automatically gets `role: 'admin'` in Firestore users collection
- Happens on first Google login

### Manual Admin Assignment
Set `role: 'admin'` in Firestore:
```
users/{userId}
  role: "admin"
```

## Audit Logging

Every deletion creates an entry in `admin_logs`:
```javascript
{
  adminId: "user_id",
  action: "delete_question_set",
  targetId: "set_id",
  timestamp: serverTimestamp(),
  details: { setId: "set_id" }
}
```

## Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Gagal menghapus soal" | Deletion failed | Check console, retry |
| "Unauthorized: Admin role required" | User not admin | Contact admin |
| Network error | Connection issue | Check internet, retry |

## Testing

### Test as Admin
1. Login with superuser email
2. Go to Bank Soal
3. Hover over any set
4. Delete button should appear
5. Click and confirm deletion

### Test as Regular User
1. Login with regular account
2. Go to Bank Soal
3. Hover over any set
4. Delete button should NOT appear

## Rollback

If needed to disable feature:
1. Remove delete button from renderBankSoal()
2. Remove `deleteQuestionSetAsAdmin()` from firebase-admin.js
3. Remove admin check from DashboardView.js

## Related Features

- **Soal Saya Deletion:** Users can delete their own sets
- **Admin Logs:** All admin actions are logged
- **Role-Based Access:** Admin role controls feature access
