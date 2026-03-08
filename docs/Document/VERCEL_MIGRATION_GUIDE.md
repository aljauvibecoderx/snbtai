# 🚀 Panduan Migrasi Backend ke Vercel

## 📌 Ringkasan
Panduan ini akan membantu Anda migrasi dari backend local (server.js) ke Vercel serverless functions.

---

## ✅ LANGKAH 1: Install Vercel CLI

Buka terminal di folder project:

```bash
npm install -g vercel
```

---

## ✅ LANGKAH 2: Login ke Vercel

```bash
vercel login
```

Pilih metode login:
- GitHub (Recommended)
- GitLab
- Email

---

## ✅ LANGKAH 3: Deploy Backend

### 3.1 Masuk ke folder vercel-backend

```bash
cd vercel-backend
```

### 3.2 Deploy ke Vercel

```bash
vercel
```

Jawab pertanyaan berikut:

| Pertanyaan | Jawaban |
|------------|---------|
| Set up and deploy? | **Y** |
| Which scope? | Pilih account Anda |
| Link to existing project? | **N** |
| Project name? | **ptnpedia-backend** |
| In which directory? | **./** |
| Override settings? | **N** |

### 3.3 Deploy ke Production

```bash
vercel --prod
```

Vercel akan memberikan URL production seperti:
```
✅ Production: https://ptnpedia-backend.vercel.app
```

**SALIN URL INI!** Anda akan membutuhkannya di langkah berikutnya.

---

## ✅ LANGKAH 4: Update Environment Variables

### 4.1 Edit file `.env` di root project

Buka file `.env` dan tambahkan/update baris ini:

```env
# Backend URL (Vercel)
REACT_APP_BACKEND_URL=https://ptnpedia-backend.vercel.app
```

**⚠️ PENTING:** Ganti `https://ptnpedia-backend.vercel.app` dengan URL yang Anda dapatkan dari Vercel!

### 4.2 Contoh file `.env` lengkap:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Gemini API Keys
REACT_APP_GEMINI_KEY_1=your_gemini_key_1
REACT_APP_GEMINI_KEY_2=your_gemini_key_2
REACT_APP_GEMINI_KEY_3=your_gemini_key_3

# HuggingFace API Key
REACT_APP_HF_API_KEY=your_huggingface_key

# Backend URL (Vercel)
REACT_APP_BACKEND_URL=https://ptnpedia-backend.vercel.app
```

---

## ✅ LANGKAH 5: Test Backend

### 5.1 Test Health Check

Buka browser atau gunakan curl:

```bash
curl https://ptnpedia-backend.vercel.app/api/ptnpedia/health
```

Response yang benar:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 5.2 Test Get Universities

```bash
curl https://ptnpedia-backend.vercel.app/api/ptnpedia/universities?type=snbp
```

### 5.3 Test Get Programs

```bash
curl https://ptnpedia-backend.vercel.app/api/ptnpedia/programs/0001?type=snbp
```

---

## ✅ LANGKAH 6: Restart Frontend

Setelah update `.env`, restart aplikasi React:

```bash
# Stop aplikasi (Ctrl+C)
# Lalu jalankan lagi:
npm start
```

---

## ✅ LANGKAH 7: Test di Browser

1. Buka aplikasi di `http://localhost:3000`
2. Klik menu **PTNPedia**
3. Pilih **SNBP** atau **SNBT**
4. Coba pilih universitas
5. Pastikan data muncul dengan benar

---

## 📁 FILE YANG SUDAH DIUBAH

### ✅ File yang sudah siap (TIDAK PERLU DIUBAH):

1. **vercel-backend/api/ptnpedia.js** ✅
   - Serverless function untuk Vercel
   - Sudah support CORS
   - Sudah ada caching

2. **vercel-backend/vercel.json** ✅
   - Konfigurasi routing Vercel
   - Sudah benar

3. **vercel-backend/package.json** ✅
   - Dependencies untuk backend

4. **src/ptnpedia.js** ✅
   - Frontend sudah menggunakan `REACT_APP_BACKEND_URL`
   - Fallback ke mock data jika backend error

### ✅ File yang HARUS DIUBAH:

1. **`.env`** ⚠️
   - Tambahkan `REACT_APP_BACKEND_URL=https://your-vercel-url.vercel.app`

---

## 🔧 TROUBLESHOOTING

### ❌ Error: "API not available"

**Penyebab:** Backend URL salah atau backend belum deploy.

**Solusi:**
1. Cek URL di `.env` sudah benar
2. Test backend dengan curl
3. Pastikan sudah restart aplikasi React

### ❌ Error: "CORS policy"

**Penyebab:** CORS tidak diaktifkan di backend.

**Solusi:** File `vercel-backend/api/ptnpedia.js` sudah include CORS headers. Pastikan Anda deploy versi terbaru:

```bash
cd vercel-backend
vercel --prod
```

### ❌ Error: "Timeout"

**Penyebab:** Vercel hobby plan memiliki timeout 10 detik.

**Solusi:** Backend sudah menggunakan caching. Jika masih timeout, coba lagi (cache akan aktif di request kedua).

### ❌ Data tidak muncul

**Penyebab:** Environment variable tidak terbaca.

**Solusi:**
1. Pastikan `.env` ada di root project
2. Restart aplikasi React (Ctrl+C lalu `npm start`)
3. Cek console browser (F12) untuk error

---

## 🎯 ENDPOINTS YANG TERSEDIA

| Endpoint | Method | Parameter | Deskripsi |
|----------|--------|-----------|-----------|
| `/api/ptnpedia/health` | GET | - | Health check |
| `/api/ptnpedia/universities` | GET | `?type=snbp\|snbt` | Daftar universitas |
| `/api/ptnpedia/programs/:code` | GET | `?type=snbp\|snbt` | Program studi per universitas |

---

## 📊 PERBANDINGAN: Local vs Vercel

| Aspek | Local (server.js) | Vercel |
|-------|-------------------|--------|
| **Setup** | Perlu run `node server.js` | Otomatis |
| **Scaling** | Manual | Auto-scaling |
| **CORS** | Perlu setup manual | Sudah include |
| **Deployment** | Manual | 1 command |
| **Cost** | Gratis (local) | Gratis (hobby plan) |
| **Uptime** | Harus selalu running | 24/7 |
| **SSL** | Perlu setup | Otomatis HTTPS |

---

## 🚀 DEPLOY FRONTEND KE VERCEL (OPSIONAL)

Jika ingin deploy frontend juga:

```bash
# Di root project (bukan di vercel-backend)
vercel
```

Jawab pertanyaan:
- Project name: **snbt-ai-frontend**
- Framework: **Create React App**
- Build command: **npm run build**
- Output directory: **build**

Jangan lupa set environment variables di Vercel Dashboard:
1. Buka https://vercel.com/dashboard
2. Pilih project Anda
3. Settings → Environment Variables
4. Tambahkan semua variable dari `.env`

---

## ✅ CHECKLIST MIGRASI

- [ ] Install Vercel CLI
- [ ] Login ke Vercel
- [ ] Deploy backend ke Vercel
- [ ] Salin URL production
- [ ] Update `.env` dengan URL Vercel
- [ ] Restart aplikasi React
- [ ] Test health check
- [ ] Test get universities
- [ ] Test get programs
- [ ] Test di browser (PTNPedia)
- [ ] Commit perubahan ke Git

---

## 📝 CATATAN PENTING

1. **Jangan commit file `.env`** ke Git (sudah ada di `.gitignore`)
2. **Vercel hobby plan** memiliki limit:
   - 100GB bandwidth/bulan
   - 100 serverless function invocations/hari
   - 10 detik timeout per request
3. **Caching aktif** selama 1 jam untuk mengurangi request ke SNPMB
4. **Mock data** akan digunakan jika backend error (fallback)

---

## 🆘 BUTUH BANTUAN?

Jika ada masalah:
1. Cek console browser (F12)
2. Cek logs Vercel: https://vercel.com/dashboard → Project → Logs
3. Test endpoint dengan curl
4. Pastikan `.env` sudah benar

---

## 🎉 SELESAI!

Backend Anda sekarang sudah running di Vercel! 🚀

Tidak perlu lagi menjalankan `node server.js` secara manual.
