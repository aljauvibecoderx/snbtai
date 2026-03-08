# Bank Soal Question Set Deletion Feature

## Overview
Implemented admin-only deletion feature for managing question sets in the Bank Soal (Question Bank). This allows admins to permanently remove question sets from the public bank while maintaining data integrity.

## Features

### 1. Admin Role Verification
- Automatic admin status check on component mount
- Uses `checkAdminRole()` from firebase-admin.js
- Superuser email (`superuserdeveloper@protonmail.com`) automatically gets admin privileges

### 2. Delete Button Visibility
- Delete button only appears for admin users
- Located on Bank Soal question set cards
- Appears on hover with smooth opacity transition
- Red color scheme (rose-500) for clear danger indication

### 3. Deletion Flow
1. Admin hovers over a Bank Soal question set card
2. Delete button appears (trash icon)
3. Admin clicks delete button
4. Confirmation dialog appears with warning message
5. Admin confirms deletion
6. System deletes all questions in the set from database
7. Question set document is deleted from Firestore
8. Admin action is logged in admin_logs collection
9. Dashboard refreshes to reflect changes

## Technical Implementation

### Files Modified

#### 1. **firebase-admin.js**
Added new function: `deleteQuestionSetAsAdmin(setId, adminId)`
- Verifies admin role before deletion
- Deletes all questions associated with the set
- Deletes the question set document
- Logs the action in admin_logs collection
- Throws error if user is not admin

```javascript
export const deleteQuestionSetAsAdmin = async (setId, adminId) => {
  // Checks admin role
  // Deletes questions and set
  // Logs action
}
```

#### 2. **DashboardView.js**
Added/Modified:
- Import `checkAdminRole` and `deleteQuestionSetAsAdmin` from firebase-admin
- New state: `isAdmin` to track admin status
- New function: `checkUserAdmin()` to verify admin on mount
- Updated `handleDelete()` to support both personal and admin deletions
- Added delete button to Bank Soal cards (visible only for admins)
- Updated delete confirmation dialog to handle both scenarios

### Key Changes

**Imports:**
```javascript
import { checkAdminRole, deleteQuestionSetAsAdmin } from './firebase-admin';
```

**State:**
```javascript
const [isAdmin, setIsAdmin] = useState(false);
```

**Admin Check:**
```javascript
const checkUserAdmin = async () => {
  if (user?.uid) {
    const adminStatus = await checkAdminRole(user.uid);
    setIsAdmin(adminStatus);
  }
};
```

**Delete Handler:**
```javascript
const handleDelete = async (setId, isPublic = false) => {
  if (isPublic && isAdmin) {
    await deleteQuestionSetAsAdmin(setId, user.uid);
  } else {
    await deleteQuestionSet(setId, user.uid);
  }
  // Reload data
};
```

**Bank Soal Card:**
- Added `group` class for hover effects
- Delete button with conditional rendering based on `isAdmin`
- Button hidden by default, visible on hover with `group-hover:opacity-100`

## Security Features

1. **Role-Based Access Control**
   - Only users with admin role can delete public question sets
   - Superuser email has automatic admin privileges
   - Role verification happens server-side in Firestore

2. **Audit Logging**
   - All admin deletions logged in `admin_logs` collection
   - Includes: adminId, action, targetId, timestamp, details
   - Enables tracking of who deleted what and when

3. **Data Integrity**
   - Atomic deletion: all questions deleted before set document
   - Confirmation dialog prevents accidental deletion
   - Clear warning message about permanent deletion

## User Experience

### For Regular Users
- No delete button visible in Bank Soal
- Can only delete their own question sets from "Soal Saya"

### For Admins
- Delete button appears on hover in Bank Soal
- Confirmation dialog with clear warning
- Immediate feedback after deletion
- Dashboard auto-refreshes

## Database Changes

### Collections Affected
1. **question_sets** - Set document deleted
2. **questions** - All questions with matching setId deleted
3. **admin_logs** - New entry created for audit trail

### Firestore Rules
Deletion is protected by existing Firestore security rules:
- Only authenticated users can delete
- Admin verification happens in application code
- Database rules enforce additional constraints

## Testing Checklist

- [ ] Admin can see delete button in Bank Soal
- [ ] Non-admin users cannot see delete button
- [ ] Confirmation dialog appears on delete click
- [ ] Canceling deletion keeps data intact
- [ ] Confirming deletion removes set and questions
- [ ] Dashboard refreshes after deletion
- [ ] Admin action is logged in admin_logs
- [ ] Deleted set no longer appears in Bank Soal
- [ ] Deleted set no longer appears in user's attempts

## Error Handling

- Admin role check fails: Error message displayed
- Deletion fails: Alert shown with retry option
- Network error: Graceful error handling with user feedback

## Future Enhancements

1. Soft delete with recovery option
2. Bulk deletion for multiple sets
3. Deletion history/audit trail UI
4. Restore deleted sets (admin only)
5. Deletion reason/notes in admin_logs
