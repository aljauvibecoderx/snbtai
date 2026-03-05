# 🚀 ADMIN PANEL - Quick Reference Guide

## 🔐 SETUP ADMIN (First Time)

### 1. Set Admin Role di Firestore
```
Firebase Console → Firestore Database
→ Collection: users
→ Find document with your UID
→ Add field: role = "admin"
→ Save
```

### 2. Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### 3. Login & Verify
```
1. Logout dari aplikasi
2. Login kembali
3. Cek apakah tombol "Admin Panel" muncul
4. Klik untuk akses
```

---

## 📋 ADMIN OPERATIONS

### Create Official Tryout

```javascript
// 1. Browse Questions
Admin Panel → Buat Tryout → Browse Bank Soal

// 2. Filter (Optional)
Filter by: Subtest, Level (4-5 for HOTS)

// 3. Select Questions
☑ Click checkbox untuk pilih soal
Minimal: 5 soal
Recommended: 10-15 soal

// 4. Set Details
Title: "Tryout Akbar Nasional #1"
Description: "Simulasi lengkap 7 subtes"

// 5. Save
Click "Simpan Tryout" → Status: DRAFT

// 6. Publish
Kelola Tryout → Find your tryout → Click "Publish"
```

### Manage Tryouts

```javascript
// View All Tryouts
Admin Panel → Kelola Tryout

// Publish Draft
Find draft → Click "Publish" → Confirm

// Delete Tryout
Find tryout → Click "Hapus" → Confirm
⚠️ Cannot be undone!

// View Stats
See: Total attempts, Average score
```

---

## 🎯 IRT SCORING

### How It Works

```
Traditional Score: 12/15 = 80%
IRT Score: Considers question difficulty

Easy questions correct → Lower IRT
Hard questions correct → Higher IRT
```

### Score Ranges

```
800-700: Exceptional (Top 5%)
699-600: Excellent (Top 20%)
599-500: Good (Average)
499-400: Fair (Below Average)
399-200: Needs Improvement
```

### Calculation

```javascript
// Automatic calculation
const irtResult = IRTScoring.calculateIRTScore(
  userAnswers,
  questions
);

// Returns:
{
  irtScore: 650,    // Scaled (200-800)
  rawScore: 12,     // Number correct
  theta: 1.5,       // Ability
  totalQuestions: 15
}
```

---

## 🔍 MONITORING

### View Admin Logs

```javascript
// Check recent actions
Admin Panel → (Future: Analytics tab)

// Log format
{
  action: "publish_tryout",
  timestamp: "2026-01-15 10:30",
  details: { title: "Tryout #1" }
}
```

### Tryout Statistics

```javascript
// Per tryout
- Total attempts
- Average score
- Average IRT score
- Completion rate
```

---

## ⚠️ TROUBLESHOOTING

### Admin Button Tidak Muncul

```
✓ Check: Field role = "admin" di Firestore
✓ Logout dan login ulang
✓ Clear browser cache
✓ Check Firestore rules deployed
```

### Error "Access Denied"

```
✓ Verify admin role di Firestore
✓ Check Firestore rules:
  function isAdmin() { ... }
✓ Logout dan login ulang
```

### Tryout Tidak Muncul di User Dashboard

```
✓ Check status: Harus "published"
✓ Check questionsList: Tidak boleh kosong
✓ Refresh user dashboard
```

### IRT Score = 0

```
✓ IRT hanya untuk official tryout
✓ Latihan biasa tidak ada IRT score
✓ Check questions have IRT parameters
```

---

## 🎨 UI COMPONENTS

### Admin Dashboard Layout

```
┌─────────────────────────────────────┐
│ 🛡️ ADMIN PANEL                      │
├─────────────────────────────────────┤
│ [Overview] [Buat Tryout] [Kelola]  │
├─────────────────────────────────────┤
│                                     │
│  Content Area                       │
│                                     │
└─────────────────────────────────────┘
```

### Official Tryout Card (User View)

```
┌─────────────────────────────────────┐
│  ✓ OFFICIAL                    [🏆] │
│  ═══════════════════════════════    │
│  Tryout Akbar Nasional #1           │
│  ───────────────────────────────    │
│  ⏱ 105 min | 👥 1,234 | 📊 78.5    │
│  ───────────────────────────────    │
│  [🚀 MULAI TRYOUT RESMI]            │
└─────────────────────────────────────┘
```

---

## 📊 BEST PRACTICES

### Question Selection

```
✓ Pilih soal level 4-5 (HOTS)
✓ Mix berbagai subtes
✓ Cek kualitas stimulus & penjelasan
✓ Test soal sebelum publish
✓ Minimal 10 soal per tryout
```

### Tryout Creation

```
✓ Judul jelas & menarik
✓ Deskripsi informatif
✓ Durasi: 90 detik per soal
✓ Save as draft first
✓ Preview before publish
```

### Security

```
✓ Jangan share admin credentials
✓ Monitor admin logs regularly
✓ Review tryout stats
✓ Backup important data
✓ Use strong password
```

---

## 🚀 QUICK COMMANDS

### Firebase CLI

```bash
# Deploy rules
firebase deploy --only firestore:rules

# View logs
firebase firestore:logs

# Backup data
firebase firestore:export gs://bucket-name
```

### Common Queries

```javascript
// Get all published tryouts
const tryouts = await getPublishedTryouts();

// Get leaderboard
const top10 = await getTryoutLeaderboard(tryoutId, 10);

// Check admin role
const isAdmin = await checkAdminRole(userId);

// Create tryout
const id = await createTryout(data, adminId);

// Publish tryout
await publishTryout(tryoutId, adminId);
```

---

## 📞 SUPPORT CONTACTS

**Technical Issues:**
- Check console logs (F12)
- Review Firestore rules
- Verify admin role

**Feature Requests:**
- Document in GitHub Issues
- Discuss with team

**Security Concerns:**
- Report immediately
- Check admin logs
- Review access patterns

---

## ✅ CHECKLIST

### Before Publishing Tryout

- [ ] Minimal 10 soal terpilih
- [ ] Semua soal level 4-5
- [ ] Judul & deskripsi sudah diisi
- [ ] Preview soal sudah dicek
- [ ] Durasi sesuai (90s/soal)
- [ ] Test tryout sendiri
- [ ] Ready to publish

### After Publishing

- [ ] Verify muncul di user dashboard
- [ ] Check official badge tampil
- [ ] Test start tryout
- [ ] Monitor first attempts
- [ ] Check leaderboard works
- [ ] Review feedback

---

**Last Updated:** 2026-01-15
**Version:** 1.0.0
