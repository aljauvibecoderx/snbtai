# 🎨 Visual Guide: Deploy via Website Vercel

## 📸 Step-by-Step dengan Screenshot

---

## STEP 1: Login ke Vercel

```
┌────────────────────────────────────────────────────────┐
│                    vercel.com                          │
├────────────────────────────────────────────────────────┤
│                                                        │
│              Welcome to Vercel                         │
│                                                        │
│         ┌──────────────────────────┐                  │
│         │  Continue with GitHub    │ ← Klik ini       │
│         └──────────────────────────┘                  │
│                                                        │
│         ┌──────────────────────────┐                  │
│         │  Continue with GitLab    │                  │
│         └──────────────────────────┘                  │
│                                                        │
│         ┌──────────────────────────┐                  │
│         │  Continue with Email     │                  │
│         └──────────────────────────┘                  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Pilih:** Continue with GitHub (Recommended)

---

## STEP 2: Authorize Vercel

```
┌────────────────────────────────────────────────────────┐
│                    GitHub                              │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Vercel by Vercel wants to access your account        │
│                                                        │
│  This application will be able to:                     │
│  ✓ Read your repositories                             │
│  ✓ Deploy your code                                   │
│                                                        │
│         ┌──────────────────────────┐                  │
│         │  Authorize Vercel        │ ← Klik ini       │
│         └──────────────────────────┘                  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## STEP 3: Vercel Dashboard

```
┌────────────────────────────────────────────────────────┐
│  Vercel  [Search]              [Add New... ▼] [Avatar]│
├────────────────────────────────────────────────────────┤
│                                                        │
│  Overview                                              │
│                                                        │
│  You don't have any projects yet                       │
│                                                        │
│  ┌──────────────────────────────────────────┐         │
│  │  Import a Git Repository                 │         │
│  │                                           │         │
│  │  [Import Git Repository →]               │         │
│  └──────────────────────────────────────────┘         │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Klik:** Add New... → Project

---

## STEP 4: Import Repository

```
┌────────────────────────────────────────────────────────┐
│  Import Git Repository                                 │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Search repositories...                                │
│  [_____________________________]                       │
│                                                        │
│  Your GitHub Repositories:                             │
│                                                        │
│  ┌──────────────────────────────────────────┐         │
│  │ 📁 SNBT AI Production 7                  │         │
│  │    Updated 2 hours ago                   │         │
│  │                            [Import →]    │ ← Klik  │
│  └──────────────────────────────────────────┘         │
│                                                        │
│  ┌──────────────────────────────────────────┐         │
│  │ 📁 my-other-project                      │         │
│  │    Updated 1 day ago                     │         │
│  │                            [Import →]    │         │
│  └──────────────────────────────────────────┘         │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Pilih:** SNBT AI Production 7 → Import

---

## STEP 5: Configure Project (PENTING!)

```
┌────────────────────────────────────────────────────────┐
│  Configure Project                                     │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Project Name                                          │
│  [ptnpedia-backend_______________]                     │
│                                                        │
│  Framework Preset                                      │
│  [Other ▼]                                             │
│                                                        │
│  Root Directory                                        │
│  [./                             ] [Edit]  ← Klik Edit│
│                                                        │
│  Build and Output Settings                             │
│  Build Command                                         │
│  [                               ]                     │
│                                                        │
│  Output Directory                                      │
│  [                               ]                     │
│                                                        │
│  Install Command                                       │
│  [npm install                    ]                     │
│                                                        │
│                              [Deploy]                  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## STEP 5.1: Edit Root Directory (KRUSIAL!)

```
┌────────────────────────────────────────────────────────┐
│  Root Directory                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Select the directory where your code is located       │
│                                                        │
│  📁 SNBT AI Production 7/                              │
│    ├─ 📁 src/                                          │
│    ├─ 📁 public/                                       │
│    ├─ 📁 vercel-backend/  ← Pilih ini!                │
│    ├─ 📄 package.json                                  │
│    └─ 📄 README.md                                     │
│                                                        │
│  Selected: vercel-backend                              │
│                                                        │
│                    [Cancel]  [Continue]                │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**⚠️ SANGAT PENTING:** Pilih folder `vercel-backend`!

---

## STEP 6: Deploy

```
┌────────────────────────────────────────────────────────┐
│  Configure Project                                     │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Project Name: ptnpedia-backend                        │
│  Framework: Other                                      │
│  Root Directory: vercel-backend ✓                      │
│                                                        │
│                                                        │
│                    [Deploy] ← Klik ini                 │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## STEP 7: Deployment Progress

```
┌────────────────────────────────────────────────────────┐
│  Deploying ptnpedia-backend                            │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ⏳ Building...                                        │
│                                                        │
│  ✓ Cloning repository                                  │
│  ✓ Installing dependencies                             │
│  ⏳ Building serverless functions                      │
│  ⏳ Deploying to production                            │
│                                                        │
│  ┌──────────────────────────────────────────┐         │
│  │ ████████████░░░░░░░░░░░░░░░░░░░░ 60%     │         │
│  └──────────────────────────────────────────┘         │
│                                                        │
│  Estimated time: 30 seconds                            │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Tunggu 1-2 menit...**

---

## STEP 8: Deployment Success! 🎉

```
┌────────────────────────────────────────────────────────┐
│  🎉 Congratulations!                                   │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Your project has been deployed!                       │
│                                                        │
│  ┌──────────────────────────────────────────┐         │
│  │  https://ptnpedia-backend.vercel.app     │         │
│  │                                  [Copy]  │         │
│  └──────────────────────────────────────────┘         │
│                                                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐      │
│  │   Visit    │  │  Dashboard │  │   Logs     │      │
│  └────────────┘  └────────────┘  └────────────┘      │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**SALIN URL INI!** → `https://ptnpedia-backend.vercel.app`

---

## STEP 9: Test Backend

### 9.1 Klik "Visit"

```
┌────────────────────────────────────────────────────────┐
│  Browser: https://ptnpedia-backend.vercel.app          │
├────────────────────────────────────────────────────────┤
│                                                        │
│  404: NOT_FOUND                                        │
│                                                        │
│  Code: NOT_FOUND                                       │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Ini NORMAL!** Root URL memang 404.

### 9.2 Test Health Check

Ubah URL menjadi:
```
https://ptnpedia-backend.vercel.app/api/ptnpedia/health
```

```
┌────────────────────────────────────────────────────────┐
│  Browser: .../api/ptnpedia/health                      │
├────────────────────────────────────────────────────────┤
│                                                        │
│  {                                                     │
│    "status": "ok",                                     │
│    "timestamp": "2024-01-15T10:30:00.000Z"            │
│  }                                                     │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**✅ BERHASIL!** Backend sudah live!

---

## STEP 10: Update .env

Buka file `.env` di VS Code:

```
┌────────────────────────────────────────────────────────┐
│  VS Code: .env                                         │
├────────────────────────────────────────────────────────┤
│                                                        │
│  # Firebase Configuration                              │
│  REACT_APP_FIREBASE_API_KEY=...                        │
│  REACT_APP_FIREBASE_AUTH_DOMAIN=...                    │
│  ...                                                   │
│                                                        │
│  # Backend URL (Vercel)                                │
│  REACT_APP_BACKEND_URL=https://ptnpedia-backend.vercel.app
│                        ↑                               │
│                        └─ Paste URL di sini            │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Save file!** (Ctrl+S)

---

## STEP 11: Restart React App

```
┌────────────────────────────────────────────────────────┐
│  Terminal                                              │
├────────────────────────────────────────────────────────┤
│                                                        │
│  $ npm start                                           │
│  ^C                          ← Tekan Ctrl+C dulu      │
│                                                        │
│  $ npm start                 ← Jalankan lagi          │
│                                                        │
│  Compiled successfully!                                │
│                                                        │
│  You can now view snbt-ai in the browser.              │
│                                                        │
│    Local:            http://localhost:3000             │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## STEP 12: Test di Browser

### 12.1 Buka PTNPedia

```
┌────────────────────────────────────────────────────────┐
│  Browser: http://localhost:3000                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────────────────────────────────────┐         │
│  │  SNBT AI                                 │         │
│  │                                           │         │
│  │  [Dashboard] [PTNPedia] [Bank Soal]      │         │
│  │              ↑                            │         │
│  │              └─ Klik ini                  │         │
│  └──────────────────────────────────────────┘         │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### 12.2 Pilih SNBP/SNBT

```
┌────────────────────────────────────────────────────────┐
│  PTNPedia                                              │
├────────────────────────────────────────────────────────┤
│                                                        │
│  [SNBP (Afirmasi)]  [SNBT (Tes Tulis)]                │
│   ↑                                                    │
│   └─ Klik salah satu                                   │
│                                                        │
│  ⏳ Memuat data...                                     │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### 12.3 Data Muncul! ✅

```
┌────────────────────────────────────────────────────────┐
│  PTNPedia - SNBP                                       │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Universitas:                                          │
│  ┌──────────────────────────────────────────┐         │
│  │ Universitas Indonesia                    │         │
│  │ Kode: 0001                               │         │
│  ├──────────────────────────────────────────┤         │
│  │ Institut Teknologi Bandung               │         │
│  │ Kode: 0002                               │         │
│  ├──────────────────────────────────────────┤         │
│  │ Universitas Gadjah Mada                  │         │
│  │ Kode: 0003                               │         │
│  └──────────────────────────────────────────┘         │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**🎉 BERHASIL!** Data dari Vercel backend muncul!

---

## 📊 Vercel Dashboard Overview

```
┌────────────────────────────────────────────────────────┐
│  Vercel Dashboard - ptnpedia-backend                   │
├────────────────────────────────────────────────────────┤
│                                                        │
│  [Overview] [Deployments] [Analytics] [Settings]       │
│                                                        │
│  Production Deployment                                 │
│  ┌──────────────────────────────────────────┐         │
│  │ ✓ ptnpedia-backend.vercel.app            │         │
│  │   Deployed 5 minutes ago                 │         │
│  │   Status: Ready                          │         │
│  └──────────────────────────────────────────┘         │
│                                                        │
│  Recent Activity                                       │
│  ┌──────────────────────────────────────────┐         │
│  │ 10:30 AM  GET /api/ptnpedia/health       │         │
│  │ 10:31 AM  GET /api/ptnpedia/universities │         │
│  │ 10:32 AM  GET /api/ptnpedia/programs/0001│         │
│  └──────────────────────────────────────────┘         │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 🔄 Auto Deploy (Bonus!)

Setiap kali push ke GitHub, Vercel otomatis deploy:

```
┌────────────────────────────────────────────────────────┐
│  Git Workflow                                          │
├────────────────────────────────────────────────────────┤
│                                                        │
│  1. Edit code                                          │
│     ↓                                                  │
│  2. git add .                                          │
│     ↓                                                  │
│  3. git commit -m "Update backend"                     │
│     ↓                                                  │
│  4. git push origin main                               │
│     ↓                                                  │
│  5. Vercel detects push                                │
│     ↓                                                  │
│  6. Auto deploy (1-2 min)                              │
│     ↓                                                  │
│  7. ✅ Live!                                           │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Tidak perlu deploy manual lagi!**

---

## ✅ Success Checklist

```
┌────────────────────────────────────────────────────────┐
│  Deployment Checklist                                  │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ☑ Login ke Vercel                                     │
│  ☑ Import repository                                   │
│  ☑ Set root directory: vercel-backend                  │
│  ☑ Deploy berhasil                                     │
│  ☑ Salin URL                                           │
│  ☑ Health check return OK                              │
│  ☑ Update .env                                         │
│  ☑ Restart React app                                   │
│  ☑ PTNPedia load data                                  │
│  ☑ Tidak ada error                                     │
│                                                        │
│  🎉 ALL DONE!                                          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 🆘 Common Issues

### Issue 1: "No serverless functions found"

```
❌ Error
┌────────────────────────────────────────────┐
│ No serverless functions found              │
└────────────────────────────────────────────┘

✅ Solution
1. Dashboard → Settings → General
2. Root Directory → Edit
3. Set: vercel-backend
4. Save
5. Deployments → Redeploy
```

### Issue 2: "404 Not Found"

```
❌ Wrong URL
https://ptnpedia-backend.vercel.app
                                   ↑
                                   └─ Missing /api/ptnpedia/

✅ Correct URL
https://ptnpedia-backend.vercel.app/api/ptnpedia/health
                                   ↑
                                   └─ Include full path
```

### Issue 3: "Data tidak muncul"

```
❌ Problem
.env tidak terbaca

✅ Solution
1. Cek .env ada di root project
2. Cek REACT_APP_BACKEND_URL sudah benar
3. Restart app: Ctrl+C → npm start
4. Clear browser cache (Ctrl+Shift+R)
```

---

## 🎉 Selesai!

Backend Anda sekarang live di Vercel! 🚀

**URL:** https://ptnpedia-backend.vercel.app

**Auto Deploy:** ✅ Aktif (setiap git push)

**Monitoring:** Vercel Dashboard → Analytics
