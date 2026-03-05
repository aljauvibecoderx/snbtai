# 🎯 ADMIN PANEL & OFFICIAL TRYOUT SYSTEM - Complete Documentation

## 📋 TABLE OF CONTENTS
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Admin Access Flow](#admin-access-flow)
4. [Features](#features)
5. [IRT Scoring System](#irt-scoring-system)
6. [Implementation Guide](#implementation-guide)
7. [Security](#security)

---

## 🎯 OVERVIEW

Sistem Admin Panel & Official Tryout mengubah SNBT AI dari tool latihan biasa menjadi **platform kompetisi resmi** dengan:
- ✅ Admin dapat kurasi soal terbaik dari bank soal global
- ✅ Buat tryout resmi dengan badge "OFFICIAL"
- ✅ IRT Scoring seperti SNBT asli (skala 200-800)
- ✅ Global leaderboard untuk kompetisi
- ✅ Role-based access control (RBAC)

---

## 🏗️ ARCHITECTURE

### Database Schema (Firestore)

```javascript
// Collection: users
{
  uid: string,
  email: string,
  displayName: string,
  role: "admin" | "user",  // Default: "user"
  createdAt: timestamp
}

// Collection: tryouts (NEW)
{
  id: string,
  title: string,
  description: string,
  questionsList: [
    { qid: string, subtest: string, order: number }
  ],
  totalDuration: number,  // seconds
  status: "draft" | "published",
  createdBy: string,  // admin UID
  createdAt: timestamp,
  publishedAt: timestamp,
  difficulty: number,  // 1-5
  tags: string[],
  stats: {
    totalAttempts: number,
    averageScore: number
  }
}

// Collection: tryout_attempts (NEW)
{
  id: string,
  tryoutId: string,
  userId: string,
  score: number,
  irtScore: number,  // 200-800
  rawScore: number,
  theta: number,  // ability estimate
  percentile: number,
  timeUsed: number,
  completedAt: timestamp
}

// Collection: admin_logs (NEW)
{
  id: string,
  adminId: string,
  action: string,  // "create_tryout", "publish_tryout", etc
  targetId: string,
  timestamp: timestamp,
  details: object
}
```

---

## 🔐 ADMIN ACCESS FLOW

### Flow Diagram

```
USER LOGIN
    ↓
Check Firestore: users/{uid}
    ↓
    ├─ role: "user" → Normal Dashboard
    │
    └─ role: "admin" → Show "Admin Panel" Button
           ↓
       Click "Admin Panel"
           ↓
       Verify Admin (double-check)
           ↓
       ✅ Access Granted → Admin Dashboard
```

### Step-by-Step Access

1. **Setup Admin Manual (First Time)**
   ```
   Firebase Console → Firestore Database
   → Collection: users
   → Find your UID document
   → Add/Edit field: role = "admin"
   → Save
   ```

2. **Login as Admin**
   - Login dengan akun yang sudah di-set sebagai admin
   - Tombol "Admin Panel" akan muncul di navigation
   - Klik untuk akses admin dashboard

3. **Security Check**
   - Frontend check: `isAdmin` state
   - Backend check: Firestore rules `isAdmin()` function
   - Double protection mencegah unauthorized access

---

## 🎨 FEATURES

### 1. Admin Dashboard

**Overview Panel**
- Total tryout published
- Total tryout draft
- Statistics summary

**Tryout Builder**
- Browse global question bank
- Filter by subtest & level
- Select questions (checkbox)
- Set title & description
- Save as draft or publish

**Manage Tryout**
- List all tryouts (draft & published)
- Publish draft tryout
- Delete tryout
- View statistics

### 2. Question Management

**3 Ways Admin Add Questions:**

```
┌─────────────────────────────────────────┐
│  1. KURASI (Pick from User Bank)       │
│     Browse → Select → Add to Tryout     │
│                                         │
│  2. EDIT (Refine AI Output)            │
│     Select → Modify → Save New Version  │
│                                         │
│  3. CREATE (Manual Input)              │
│     Form → Preview → Save to Bank       │
└─────────────────────────────────────────┘
```

**Kurasi Flow:**
```javascript
// Admin melihat semua soal dari database
const questions = await getGlobalQuestions({
  minLevel: 4,  // HOTS only
  subtest: 'tps_pu'
});

// Pilih soal terbaik
selectedQuestions.push(question);

// Tambahkan ke tryout
await createTryout({
  title: "Tryout Akbar #1",
  questionsList: selectedQuestions.map(q => ({
    qid: q.id,
    subtest: q.subtest,
    order: index
  }))
});
```

### 3. Official Tryout (User View)

**Visual Differences:**

| Feature | Normal Practice | Official Tryout |
|---------|----------------|-----------------|
| Border | Gray | Gold gradient |
| Badge | - | ✓ OFFICIAL |
| Leaderboard | No | Global ranking |
| Certificate | No | Auto-generate |
| Pause | Yes | No (strict mode) |

**User Flow:**
```
Dashboard → Tab "Tryout Resmi"
    ↓
See Official Card (gold border + badge)
    ↓
Click "Mulai Tryout Resmi"
    ↓
Fullscreen CBT Mode
    ↓
Submit → IRT Score Calculated
    ↓
View Result + Global Ranking
    ↓
Download Certificate
```

---

## 📊 IRT SCORING SYSTEM

### What is IRT?

**Item Response Theory** = Sistem penilaian yang mempertimbangkan:
- Tingkat kesulitan soal (difficulty parameter)
- Daya pembeda soal (discrimination parameter)
- Kemampuan peserta (ability/theta)

### Formula (3-Parameter Logistic Model)

```
P(θ) = c + (1-c) / (1 + e^(-a(θ-b)))

Where:
- θ (theta) = Ability of test-taker
- a = Discrimination parameter (0-2)
- b = Difficulty parameter (-3 to +3)
- c = Guessing parameter (0.25 for 5 options)
- P = Probability of correct answer
```

### Implementation

```javascript
// Calculate IRT Score
const irtResult = IRTScoring.calculateIRTScore(userAnswers, questions);

// Result:
{
  irtScore: 650,      // Scaled score (200-800)
  rawScore: 12,       // Number correct
  theta: 1.5,         // Ability estimate
  totalQuestions: 15
}

// Interpretation
if (irtScore >= 700) → "Exceptional" (Top 5%)
if (irtScore >= 600) → "Excellent" (Top 20%)
if (irtScore >= 500) → "Good" (Average)
if (irtScore >= 400) → "Fair" (Below Average)
else → "Needs Improvement"
```

### Why IRT Better Than Raw Score?

**Example:**
```
Student A: 15/20 correct (easy questions) → IRT: 480
Student B: 12/20 correct (hard questions) → IRT: 620

Raw score: A > B
IRT score: B > A (more accurate!)
```

**Benefits:**
- ✅ Accounts for question difficulty
- ✅ Comparable across different tests
- ✅ More accurate ability estimation
- ✅ Matches official SNBT scoring

---

## 🚀 IMPLEMENTATION GUIDE

### Step 1: Deploy Firestore Rules

```bash
# Deploy updated rules
firebase deploy --only firestore:rules
```

### Step 2: Set First Admin

```
1. Login to Firebase Console
2. Go to Firestore Database
3. Collection: users
4. Find your UID document
5. Add field: role = "admin"
6. Save
```

### Step 3: Test Admin Access

```
1. Logout and login again
2. Check if "Admin Panel" button appears
3. Click to access admin dashboard
4. Try creating a tryout
```

### Step 4: Create First Official Tryout

```
1. Go to Admin Panel → Buat Tryout
2. Browse question bank
3. Select 10-15 quality questions
4. Set title: "Tryout Akbar Nasional #1"
5. Save as draft
6. Preview and test
7. Publish
```

### Step 5: Verify User Experience

```
1. Login as regular user
2. Check dashboard for "Tryout Resmi" tab
3. See official tryout card (gold border)
4. Start tryout
5. Complete and check IRT score
6. Verify leaderboard entry
```

---

## 🔒 SECURITY

### Firestore Security Rules

```javascript
function isAdmin() {
  return request.auth != null && 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
}

// Tryouts: Only admin can create/edit
match /tryouts/{tryoutId} {
  allow read: if resource.data.status == "published" || isAdmin();
  allow create, update, delete: if isAdmin();
}

// Admin logs: Only admin can read/write
match /admin_logs/{logId} {
  allow read, create: if isAdmin();
}
```

### Frontend Protection

```javascript
// Check admin role on mount
useEffect(() => {
  const verifyAdmin = async () => {
    const adminStatus = await checkAdminRole(user.uid);
    if (!adminStatus) {
      alert('⛔ Access denied');
      onBack();
    }
  };
  verifyAdmin();
}, [user]);
```

### Best Practices

1. **Never expose admin credentials**
   - Don't hardcode admin UIDs
   - Use Firestore role field only

2. **Log all admin actions**
   - Every create/edit/delete logged
   - Audit trail for security

3. **Double-check permissions**
   - Frontend check (UX)
   - Backend check (Security)

4. **Rate limiting**
   - Prevent admin API abuse
   - Monitor suspicious activity

---

## 📈 MONITORING & ANALYTICS

### Admin Logs

```javascript
// View admin activity
const logs = await getDocs(
  query(collection(db, 'admin_logs'), 
        orderBy('timestamp', 'desc'), 
        limit(50))
);

// Example log
{
  adminId: "admin_uid",
  action: "publish_tryout",
  targetId: "tryout_123",
  timestamp: "2026-01-15T10:30:00Z",
  details: { title: "Tryout Akbar #1" }
}
```

### Tryout Statistics

```javascript
// Get tryout performance
const tryout = await getTryoutById(tryoutId);

console.log({
  totalAttempts: tryout.stats.totalAttempts,
  averageScore: tryout.stats.averageScore,
  averageIRT: tryout.stats.averageIRT
});
```

---

## 🎯 ROADMAP

### Phase 1: Core Features (DONE)
- ✅ Admin role system
- ✅ Tryout builder
- ✅ IRT scoring
- ✅ Basic leaderboard

### Phase 2: Enhancements (TODO)
- ⏳ Certificate generator (PDF/Image)
- ⏳ Advanced analytics dashboard
- ⏳ Question quality scoring
- ⏳ Auto-calibrate IRT parameters

### Phase 3: Advanced (FUTURE)
- 🔮 AI-powered question recommendation
- 🔮 Adaptive testing (CAT)
- 🔮 Multi-admin collaboration
- 🔮 Scheduled tryout releases

---

## 📞 SUPPORT

### Common Issues

**Q: Admin button tidak muncul?**
A: Pastikan field `role: "admin"` sudah di-set di Firestore users collection.

**Q: Error "Access denied" saat buka admin panel?**
A: Logout dan login ulang. Pastikan Firestore rules sudah di-deploy.

**Q: IRT score tidak muncul?**
A: IRT score hanya muncul untuk official tryout. Latihan biasa hanya menampilkan raw score.

**Q: Bagaimana cara menghapus admin role?**
A: Edit field `role` di Firestore menjadi `"user"` atau hapus field tersebut.

---

## 🎉 CONCLUSION

Sistem Admin Panel & Official Tryout ini mengubah SNBT AI menjadi platform kompetisi yang profesional dengan:

1. **Quality Control**: Admin kurasi soal terbaik
2. **Fair Scoring**: IRT scoring seperti SNBT asli
3. **Engagement**: Leaderboard & certificate
4. **Security**: RBAC & audit logs
5. **Scalability**: Ready untuk ribuan user

**Next Steps:**
1. Deploy Firestore rules
2. Set admin role
3. Create first official tryout
4. Monitor user engagement
5. Iterate based on feedback

---

**Built with ❤️ by SNBT AI Team**
