# Bank Soal Deletion Feature - Visual Guide

## User Interface Flow

### For Admin Users

```
┌─────────────────────────────────────────────────────────────┐
│                    Dashboard - Bank Soal                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Question Set Card (Hover State)                     │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │                                                       │   │
│  │  L3  [🗑️ DELETE]  📖                                │   │
│  │                                                       │   │
│  │  Kode Soal                                           │   │
│  │  #ABC123                                             │   │
│  │                                                       │   │
│  │  ─────────────────────────────────────────────────   │   │
│  │  Latihan Pengetahuan Kuantitatif                     │   │
│  │  15 soal                                             │   │
│  │                                                       │   │
│  │  Klik untuk mengerjakan →                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Question Set Card (Normal State)                    │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │                                                       │   │
│  │  L3  📖                                              │   │
│  │                                                       │   │
│  │  Kode Soal                                           │   │
│  │  #DEF456                                             │   │
│  │                                                       │   │
│  │  ─────────────────────────────────────────────────   │   │
│  │  Latihan Penalaran Umum                              │   │
│  │  20 soal                                             │   │
│  │                                                       │   │
│  │  Klik untuk mengerjakan →                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Deletion Confirmation Dialog

```
┌─────────────────────────────────────────────────────────┐
│                                                           │
│                    🗑️ Hapus Paket Soal?                 │
│                                                           │
│  Semua soal dalam paket ini akan dihapus permanen       │
│  dari database.                                          │
│                                                           │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │     Batal        │  │     Hapus        │             │
│  └──────────────────┘  └──────────────────┘             │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### For Regular Users

```
┌─────────────────────────────────────────────────────────────┐
│                    Dashboard - Bank Soal                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Question Set Card (Hover State)                     │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │                                                       │   │
│  │  L3  📖                                              │   │
│  │  (No delete button - user is not admin)              │   │
│  │                                                       │   │
│  │  Kode Soal                                           │   │
│  │  #ABC123                                             │   │
│  │                                                       │   │
│  │  ─────────────────────────────────────────────────   │   │
│  │  Latihan Pengetahuan Kuantitatif                     │   │
│  │  15 soal                                             │   │
│  │                                                       │   │
│  │  Klik untuk mengerjakan →                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Process Flow Diagram

### Complete Deletion Workflow

```
START
  │
  ├─→ User navigates to Dashboard
  │
  ├─→ DashboardView component mounts
  │
  ├─→ checkUserAdmin() called
  │     │
  │     └─→ checkAdminRole(userId)
  │           │
  │           ├─→ Fetch user document from Firestore
  │           │
  │           ├─→ Check role field
  │           │
  │           ├─→ Check email === superuser email
  │           │
  │           └─→ Return boolean (isAdmin)
  │
  ├─→ isAdmin state updated
  │
  ├─→ renderBankSoal() renders cards
  │     │
  │     └─→ For each set:
  │           ├─→ If isAdmin: show delete button
  │           └─→ If !isAdmin: hide delete button
  │
  ├─→ User hovers over card
  │     │
  │     └─→ Delete button appears (opacity: 0 → 100)
  │
  ├─→ User clicks delete button
  │     │
  │     └─→ setShowDeleteConfirm(setId)
  │
  ├─→ Confirmation dialog appears
  │
  ├─→ User clicks "Hapus"
  │     │
  │     └─→ handleDelete(setId, isPublic=true)
  │           │
  │           ├─→ Check: isPublic && isAdmin
  │           │
  │           ├─→ Call deleteQuestionSetAsAdmin()
  │           │     │
  │           │     ├─→ checkAdminRole(adminId)
  │           │     │
  │           │     ├─→ Query questions with setId
  │           │     │
  │           │     ├─→ Delete all questions (Promise.all)
  │           │     │
  │           │     ├─→ Delete question_sets document
  │           │     │
  │           │     ├─→ Create admin_logs entry
  │           │     │
  │           │     └─→ Return true
  │           │
  │           ├─→ setShowDeleteConfirm(null)
  │           │
  │           └─→ loadData() refresh
  │                 │
  │                 ├─→ Fetch myQuestions
  │                 ├─→ Fetch publicQuestions (updated)
  │                 ├─→ Fetch attempts
  │                 └─→ Fetch tryouts
  │
  ├─→ Dashboard re-renders
  │     │
  │     └─→ Deleted set no longer appears
  │
  └─→ END
```

## State Management

### Component State

```javascript
// Admin Status
isAdmin: boolean
  ├─→ true: User has admin role
  └─→ false: User is regular user

// Delete Confirmation
showDeleteConfirm: null | string
  ├─→ null: Dialog not shown
  └─→ setId: Dialog shown for this set

// Data States
myQuestions: QuestionSet[]
publicQuestions: QuestionSet[]
  └─→ Updated after deletion

// Loading States
loading: boolean
  └─→ true: Data loading
```

## Data Flow Diagram

### Before Deletion

```
Firestore Database
├── question_sets
│   ├── set_001
│   │   ├── title: "Latihan PK"
│   │   ├── visibility: "public"
│   │   └── createdAt: timestamp
│   └── set_002
│       ├── title: "Latihan PU"
│       └── ...
│
├── questions
│   ├── q_001 (setId: set_001)
│   ├── q_002 (setId: set_001)
│   ├── q_003 (setId: set_002)
│   └── ...
│
└── admin_logs
    └── (no deletion entries)
```

### After Deletion (set_001)

```
Firestore Database
├── question_sets
│   └── set_002
│       ├── title: "Latihan PU"
│       └── ...
│
├── questions
│   ├── q_003 (setId: set_002)
│   └── ...
│
└── admin_logs
    └── log_001
        ├── adminId: "user_123"
        ├── action: "delete_question_set"
        ├── targetId: "set_001"
        ├── timestamp: 2024-01-15T10:30:00Z
        └── details: { setId: "set_001" }
```

## Component Hierarchy

```
DashboardView
├── State Management
│   ├── isAdmin
│   ├── showDeleteConfirm
│   ├── publicQuestions
│   └── ...
│
├── Effects
│   └── useEffect (mount)
│       ├── loadData()
│       └── checkUserAdmin()
│
├── Functions
│   ├── checkUserAdmin()
│   ├── handleDelete()
│   ├── renderBankSoal()
│   └── ...
│
└── Render
    ├── Tab Navigation
    ├── renderBankSoal()
    │   ├── Filter Controls
    │   ├── Question Set Cards
    │   │   ├── Card Header
    │   │   │   ├── Level Badge
    │   │   │   └── Delete Button (if isAdmin)
    │   │   ├── Card Body
    │   │   └── Card Footer
    │   └── Empty State
    │
    └── Delete Confirmation Dialog
        ├── Icon
        ├── Title
        ├── Message
        └── Buttons
            ├── Cancel
            └── Confirm
```

## Error Handling Flow

```
handleDelete() called
  │
  ├─→ Try Block
  │   │
  │   ├─→ Check isPublic && isAdmin
  │   │
  │   ├─→ Call deleteQuestionSetAsAdmin()
  │   │     │
  │   │     ├─→ checkAdminRole() fails
  │   │     │   └─→ Throw: "Unauthorized: Admin role required"
  │   │     │
  │   │     ├─→ Query fails
  │   │     │   └─→ Throw: Database error
  │   │     │
  │   │     ├─→ Delete fails
  │   │     │   └─→ Throw: Delete error
  │   │     │
  │   │     └─→ Success
  │   │         └─→ Return true
  │   │
  │   ├─→ setShowDeleteConfirm(null)
  │   │
  │   └─→ loadData()
  │
  └─→ Catch Block
      │
      ├─→ console.error('Delete error:', error)
      │
      └─→ alert('Gagal menghapus soal. Coba lagi.')
```

## Security Layers

```
User Action
  │
  ├─→ Layer 1: UI Level
  │   └─→ Delete button only shown if isAdmin
  │
  ├─→ Layer 2: Function Level
  │   └─→ handleDelete() checks isPublic && isAdmin
  │
  ├─→ Layer 3: API Level
  │   └─→ deleteQuestionSetAsAdmin() verifies admin role
  │
  ├─→ Layer 4: Database Level
  │   └─→ Firestore security rules enforce constraints
  │
  └─→ Layer 5: Audit Level
      └─→ All actions logged in admin_logs
```

## Performance Optimization

```
Admin Status Check
  │
  ├─→ First Call
  │   ├─→ Fetch from Firestore
  │   ├─→ Store in cache
  │   └─→ Set 5-minute TTL
  │
  ├─→ Subsequent Calls (within 5 min)
  │   └─→ Return from cache (no DB call)
  │
  └─→ After 5 Minutes
      └─→ Cache expires, fetch fresh data
```

## Deletion Performance

```
deleteQuestionSetAsAdmin()
  │
  ├─→ Admin Role Check: ~50ms
  │
  ├─→ Query Questions: ~100ms
  │
  ├─→ Delete Questions (Parallel): ~200ms
  │   └─→ Promise.all() for efficiency
  │
  ├─→ Delete Set Document: ~50ms
  │
  ├─→ Create Audit Log: ~50ms
  │
  └─→ Total: ~450ms (typical)
```

## Testing Scenarios

### Scenario 1: Admin Deletion
```
Admin User
  ├─→ Login with superuser email
  ├─→ Navigate to Bank Soal
  ├─→ Hover over set
  ├─→ Delete button appears ✓
  ├─→ Click delete
  ├─→ Confirm dialog appears ✓
  ├─→ Click "Hapus"
  ├─→ Set deleted ✓
  ├─→ Dashboard refreshes ✓
  └─→ Entry in admin_logs ✓
```

### Scenario 2: Regular User
```
Regular User
  ├─→ Login with regular account
  ├─→ Navigate to Bank Soal
  ├─→ Hover over set
  ├─→ Delete button NOT visible ✓
  ├─→ Can only delete own sets ✓
  └─→ No admin functions available ✓
```

### Scenario 3: Error Handling
```
Error Scenario
  ├─→ Admin not verified
  │   └─→ Error: "Unauthorized" ✓
  ├─→ Database error
  │   └─→ Error: "Gagal menghapus soal" ✓
  ├─→ Network error
  │   └─→ Error: Connection failed ✓
  └─→ User sees alert ✓
```

---

**Visual Guide Complete**
Use this guide for understanding the feature flow and architecture.
