# 🌐 Deploy Backend ke Vercel via Website

## 📌 Panduan Deploy Tanpa CLI (Pakai Website)

---

## ✅ LANGKAH 1: Persiapan

### 1.1 Push Code ke GitHub

Pastikan folder `vercel-backend` sudah di push ke GitHub:

```bash
# Di root project
git add .
git commit -m "Add vercel backend"
git push origin main
```

---

## ✅ LANGKAH 2: Buka Vercel Dashboard

1. Buka browser, kunjungi: **https://vercel.com**
2. Klik **Sign Up** (jika belum punya akun)
3. Pilih **Continue with GitHub** (Recommended)
4. Login dengan akun GitHub Anda
5. Authorize Vercel untuk akses GitHub

---

## ✅ LANGKAH 3: Import Project

### 3.1 Klik "Add New..."

Di dashboard Vercel:
1. Klik tombol **"Add New..."** (pojok kanan atas)
2. Pilih **"Project"**

### 3.2 Import Git Repository

1. Pilih repository Anda: **SNBT AI Production 7**
2. Klik **"Import"**

---

## ✅ LANGKAH 4: Configure Project

### 4.1 Project Settings

| Setting | Value |
|---------|-------|
| **Project Name** | `ptnpedia-backend` |
| **Framework Preset** | Other |
| **Root Directory** | `vercel-backend` ← **PENTING!** |
| **Build Command** | (kosongkan) |
| **Output Directory** | (kosongkan) |
| **Install Command** | `npm install` |

### 4.2 Set Root Directory

**⚠️ SANGAT PENTING:**

1. Klik **"Edit"** di bagian **Root Directory**
2. Ketik: `vercel-backend`
3. Klik **"Continue"**

Ini memberitahu Vercel bahwa backend ada di folder `vercel-backend`, bukan di root.

---

## ✅ LANGKAH 5: Deploy

1. Klik tombol **"Deploy"**
2. Tunggu proses deployment (1-2 menit)
3. Jika berhasil, akan muncul 🎉 **Congratulations!**

---

## ✅ LANGKAH 6: Dapatkan URL

Setelah deploy berhasil:

1. Salin URL yang diberikan, contoh:
   ```
   https://ptnpedia-backend.vercel.app
   ```

2. Atau klik **"Visit"** untuk test

---

## ✅ LANGKAH 7: Test Backend

### 7.1 Test di Browser

Buka URL berikut di browser:

```
https://ptnpedia-backend.vercel.app/api/ptnpedia/health
```

**Response yang benar:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 7.2 Test Get Universities

```
https://ptnpedia-backend.vercel.app/api/ptnpedia/universities?type=snbp
```

---

## ✅ LANGKAH 8: Update .env

Buka file `.env` di project Anda dan tambahkan:

```env
# Backend URL (Vercel)
REACT_APP_BACKEND_URL=https://ptnpedia-backend.vercel.app
```

**⚠️ Ganti dengan URL Anda!**

---

## ✅ LANGKAH 9: Restart App

```bash
# Stop app (Ctrl+C)
npm start
```

---

## ✅ LANGKAH 10: Test di Browser

1. Buka `http://localhost:3000`
2. Klik **PTNPedia**
3. Pilih **SNBP** atau **SNBT**
4. Klik universitas
5. Pastikan data muncul ✅

---

## 🎨 Screenshot Guide

### 1. Vercel Dashboard
```
┌─────────────────────────────────────────┐
│  Vercel Dashboard                       │
│                                         │
│  [Add New... ▼]  ← Klik ini            │
│    ├─ Project                           │
│    └─ ...                               │
└─────────────────────────────────────────┘
```

### 2. Import Repository
```
┌─────────────────────────────────────────┐
│  Import Git Repository                  │
│                                         │
│  ○ SNBT AI Production 7                 │
│     [Import] ← Klik ini                 │
└─────────────────────────────────────────┘
```

### 3. Configure Project
```
┌─────────────────────────────────────────┐
│  Configure Project                      │
│                                         │
│  Project Name:                          │
│  [ptnpedia-backend]                     │
│                                         │
│  Framework: Other                       │
│                                         │
│  Root Directory: [Edit]                 │
│  vercel-backend ← PENTING!              │
│                                         │
│  [Deploy] ← Klik ini                    │
└─────────────────────────────────────────┘
```

---

## 🔧 Troubleshooting

### ❌ Error: "No serverless functions found"

**Penyebab:** Root directory salah

**Solusi:**
1. Klik **Settings** di dashboard
2. Klik **General**
3. Scroll ke **Root Directory**
4. Set ke: `vercel-backend`
5. Klik **Save**
6. Redeploy: **Deployments** → **...** → **Redeploy**

### ❌ Error: "Build failed"

**Penyebab:** Dependencies tidak terinstall

**Solusi:**
1. Pastikan `vercel-backend/package.json` ada
2. Redeploy

### ❌ Error: "404 Not Found"

**Penyebab:** URL salah

**Solusi:**
Pastikan URL lengkap:
```
https://your-project.vercel.app/api/ptnpedia/health
                               ↑
                               Jangan lupa /api/ptnpedia/
```

---

## 🔄 Update Backend (Jika Ada Perubahan)

### Cara 1: Auto Deploy (Recommended)

Setiap kali Anda push ke GitHub, Vercel otomatis deploy:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Vercel akan auto-deploy dalam 1-2 menit.

### Cara 2: Manual Redeploy

1. Buka Vercel Dashboard
2. Pilih project **ptnpedia-backend**
3. Klik tab **Deployments**
4. Klik **...** (titik tiga) di deployment terakhir
5. Klik **Redeploy**

---

## 📊 Monitor Deployment

### Lihat Logs

1. Buka Vercel Dashboard
2. Pilih project **ptnpedia-backend**
3. Klik tab **Deployments**
4. Klik deployment yang ingin dilihat
5. Scroll ke bawah untuk lihat logs

### Lihat Analytics

1. Klik tab **Analytics**
2. Lihat:
   - Request count
   - Response time
   - Error rate

---

## 🎯 Custom Domain (Opsional)

Jika ingin pakai domain sendiri:

1. Buka project di Vercel Dashboard
2. Klik tab **Settings**
3. Klik **Domains**
4. Klik **Add**
5. Masukkan domain Anda (contoh: `api.snbtai.com`)
6. Follow instruksi untuk setup DNS

---

## ✅ Checklist

- [ ] Push code ke GitHub
- [ ] Login ke Vercel
- [ ] Import repository
- [ ] Set root directory: `vercel-backend`
- [ ] Deploy
- [ ] Salin URL
- [ ] Update `.env`
- [ ] Restart React app
- [ ] Test health check
- [ ] Test di browser (PTNPedia)

---

## 🎉 Selesai!

Backend Anda sekarang live di Vercel! 🚀

**URL Backend:** https://ptnpedia-backend.vercel.app

**Next Steps:**
- Monitor performance di Analytics
- Setup custom domain (optional)
- Deploy frontend juga ke Vercel (optional)
