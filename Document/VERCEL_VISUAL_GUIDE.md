# 🎨 Visual Guide: Migrasi Backend ke Vercel

## 📊 Arsitektur Sebelum vs Sesudah

```
SEBELUM (Local Backend)
┌─────────────────┐
│   React App     │
│  localhost:3000 │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Local Server   │
│  node server.js │
│  localhost:3001 │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   SNPMB API     │
│  (External)     │
└─────────────────┘

❌ Harus run server manual
❌ Tidak bisa diakses dari luar
❌ Perlu setup CORS manual


SESUDAH (Vercel Backend)
┌─────────────────┐
│   React App     │
│  localhost:3000 │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Vercel Backend  │
│ your-app.vercel │
│ (Serverless)    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   SNPMB API     │
│  (External)     │
└─────────────────┘

✅ Otomatis running 24/7
✅ HTTPS gratis
✅ Auto-scaling
✅ CORS sudah setup
```

---

## 🔄 Alur Deployment

```
┌──────────────────────────────────────────────────────────┐
│                    DEPLOYMENT FLOW                        │
└──────────────────────────────────────────────────────────┘

1. INSTALL CLI
   ┌─────────────────┐
   │ npm install -g  │
   │     vercel      │
   └────────┬────────┘
            │
            ↓
2. LOGIN
   ┌─────────────────┐
   │  vercel login   │
   └────────┬────────┘
            │
            ↓
3. DEPLOY
   ┌─────────────────┐
   │ cd vercel-      │
   │    backend      │
   │                 │
   │ vercel --prod   │
   └────────┬────────┘
            │
            ↓
4. GET URL
   ┌─────────────────┐
   │ https://your-   │
   │ project.vercel  │
   │     .app        │
   └────────┬────────┘
            │
            ↓
5. UPDATE .ENV
   ┌─────────────────┐
   │ REACT_APP_      │
   │ BACKEND_URL=    │
   │ https://...     │
   └────────┬────────┘
            │
            ↓
6. RESTART APP
   ┌─────────────────┐
   │   npm start     │
   └────────┬────────┘
            │
            ↓
7. ✅ DONE!
```

---

## 📁 Struktur Folder

```
SNBT AI Production 7/
│
├── vercel-backend/          ← BACKEND (Deploy ini!)
│   ├── api/
│   │   └── ptnpedia.js     ← Serverless function
│   ├── vercel.json          ← Config Vercel
│   ├── package.json         ← Dependencies
│   └── README.md
│
├── src/                     ← FRONTEND
│   ├── ptnpedia.js         ← Sudah siap (pakai env var)
│   ├── ptnpedia-backend.js ← Old (tidak dipakai)
│   └── ptnpedia-api.js     ← Old (tidak dipakai)
│
├── .env                     ← UPDATE INI!
├── .env.example
└── package.json
```

---

## 🔌 API Flow

```
┌─────────────────────────────────────────────────────────┐
│                    REQUEST FLOW                          │
└─────────────────────────────────────────────────────────┘

USER CLICK "PTNPedia"
        │
        ↓
┌───────────────────┐
│  ptnpedia.js      │
│  (Frontend)       │
└─────────┬─────────┘
          │
          │ fetch(REACT_APP_BACKEND_URL + '/api/ptnpedia/universities')
          ↓
┌───────────────────┐
│  Vercel Backend   │
│  ptnpedia.js      │
└─────────┬─────────┘
          │
          │ Check Cache?
          ├─ YES → Return cached data
          │
          └─ NO ↓
┌───────────────────┐
│   SNPMB API       │
│   (Scraping)      │
└─────────┬─────────┘
          │
          ↓
┌───────────────────┐
│  Parse HTML       │
│  (Cheerio)        │
└─────────┬─────────┘
          │
          ↓
┌───────────────────┐
│  Cache Result     │
│  (1 hour)         │
└─────────┬─────────┘
          │
          ↓
┌───────────────────┐
│  Return JSON      │
│  to Frontend      │
└─────────┬─────────┘
          │
          ↓
┌───────────────────┐
│  Display Data     │
│  (React UI)       │
└───────────────────┘
```

---

## 🎯 Environment Variables

```
┌──────────────────────────────────────────────────────────┐
│                    .env FILE                              │
└──────────────────────────────────────────────────────────┘

# Firebase (Sudah ada)
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
REACT_APP_FIREBASE_MEASUREMENT_ID=...

# Gemini (Sudah ada)
REACT_APP_GEMINI_KEY_1=...
REACT_APP_GEMINI_KEY_2=...
REACT_APP_GEMINI_KEY_3=...

# HuggingFace (Sudah ada)
REACT_APP_HF_API_KEY=...

# Backend URL (TAMBAHKAN INI!) ← ⚠️ PENTING!
REACT_APP_BACKEND_URL=https://your-project.vercel.app
                      ↑
                      └─ Ganti dengan URL dari Vercel
```

---

## 🧪 Testing Checklist

```
┌──────────────────────────────────────────────────────────┐
│                    TESTING STEPS                          │
└──────────────────────────────────────────────────────────┘

1. Test Backend Health
   ┌─────────────────────────────────────────────┐
   │ curl https://your-project.vercel.app/       │
   │      api/ptnpedia/health                    │
   │                                             │
   │ Expected: {"status":"ok","timestamp":"..."} │
   └─────────────────────────────────────────────┘

2. Test Get Universities
   ┌─────────────────────────────────────────────┐
   │ curl https://your-project.vercel.app/       │
   │      api/ptnpedia/universities?type=snbp    │
   │                                             │
   │ Expected: {"success":true,"data":[...]}     │
   └─────────────────────────────────────────────┘

3. Test Get Programs
   ┌─────────────────────────────────────────────┐
   │ curl https://your-project.vercel.app/       │
   │      api/ptnpedia/programs/0001?type=snbp   │
   │                                             │
   │ Expected: {"success":true,"data":[...]}     │
   └─────────────────────────────────────────────┘

4. Test in Browser
   ┌─────────────────────────────────────────────┐
   │ 1. Open http://localhost:3000               │
   │ 2. Click "PTNPedia"                         │
   │ 3. Select SNBP/SNBT                         │
   │ 4. Click university                         │
   │ 5. Check if programs load                   │
   └─────────────────────────────────────────────┘
```

---

## 🐛 Common Errors & Solutions

```
┌──────────────────────────────────────────────────────────┐
│                    ERROR HANDLING                         │
└──────────────────────────────────────────────────────────┘

ERROR: "API not available"
├─ Cause: Backend URL salah atau backend down
└─ Solution:
   ├─ Cek .env file
   ├─ Test backend dengan curl
   └─ Restart React app

ERROR: "CORS policy"
├─ Cause: CORS headers tidak ada
└─ Solution:
   ├─ File ptnpedia.js sudah include CORS
   └─ Deploy ulang: vercel --prod

ERROR: "Timeout"
├─ Cause: Request > 10 detik
└─ Solution:
   ├─ Coba lagi (cache akan aktif)
   └─ Upgrade Vercel plan (optional)

ERROR: "Data tidak muncul"
├─ Cause: Environment variable tidak terbaca
└─ Solution:
   ├─ Pastikan .env ada di root
   ├─ Restart app: npm start
   └─ Clear browser cache
```

---

## 📊 Performance Comparison

```
┌──────────────────────────────────────────────────────────┐
│              LOCAL vs VERCEL COMPARISON                   │
└──────────────────────────────────────────────────────────┘

Metric          │ Local Server  │ Vercel Backend
────────────────┼───────────────┼────────────────
Setup Time      │ 5 minutes     │ 2 minutes
Deployment      │ Manual        │ 1 command
Uptime          │ Manual start  │ 24/7 automatic
Scaling         │ Single server │ Auto-scaling
HTTPS           │ Manual setup  │ Automatic
CORS            │ Manual setup  │ Pre-configured
Cost            │ Free (local)  │ Free (hobby)
Maintenance     │ High          │ Low
Accessibility   │ Local only    │ Global
Caching         │ Manual        │ Built-in
```

---

## 🎓 Key Concepts

```
┌──────────────────────────────────────────────────────────┐
│                    SERVERLESS FUNCTIONS                   │
└──────────────────────────────────────────────────────────┘

Traditional Server:
┌─────────────────┐
│  Always Running │  ← Konsumsi resource terus
│  Fixed Resources│  ← Tidak bisa scale otomatis
│  Manual Deploy  │  ← Perlu setup manual
└─────────────────┘

Serverless (Vercel):
┌─────────────────┐
│  On-Demand      │  ← Hanya jalan saat ada request
│  Auto-Scaling   │  ← Scale otomatis saat traffic tinggi
│  Zero Config    │  ← Deploy langsung jalan
└─────────────────┘

Benefits:
✅ Pay per use (gratis untuk hobby)
✅ No server maintenance
✅ Automatic scaling
✅ Global CDN
✅ Built-in monitoring
```

---

## 🚀 Next Steps

```
┌──────────────────────────────────────────────────────────┐
│                    AFTER MIGRATION                        │
└──────────────────────────────────────────────────────────┘

1. Monitor Performance
   ├─ Vercel Dashboard → Analytics
   └─ Check response times

2. Setup Custom Domain (Optional)
   ├─ Vercel Dashboard → Domains
   └─ Add your domain

3. Add Environment Variables (If needed)
   ├─ Vercel Dashboard → Settings → Environment Variables
   └─ Add production secrets

4. Enable Monitoring
   ├─ Vercel Dashboard → Monitoring
   └─ Setup alerts

5. Deploy Frontend to Vercel (Optional)
   ├─ Run: vercel (in root folder)
   └─ Set build command: npm run build
```

---

## 📚 Resources

```
┌──────────────────────────────────────────────────────────┐
│                    HELPFUL LINKS                          │
└──────────────────────────────────────────────────────────┘

📖 Vercel Docs
   https://vercel.com/docs

🎯 Serverless Functions Guide
   https://vercel.com/docs/functions

🔧 Vercel CLI Reference
   https://vercel.com/docs/cli

📊 Vercel Dashboard
   https://vercel.com/dashboard

💬 Vercel Community
   https://github.com/vercel/vercel/discussions
```

---

## ✅ Success Indicators

```
Anda berhasil migrasi jika:

✅ Backend deploy tanpa error
✅ Health check return {"status":"ok"}
✅ Universities API return data
✅ Programs API return data
✅ PTNPedia di browser load data
✅ Tidak ada CORS error
✅ Response time < 3 detik
✅ Cache berfungsi (request kedua lebih cepat)
```

---

## 🎉 Congratulations!

```
┌──────────────────────────────────────────────────────────┐
│                                                           │
│              🎊 MIGRATION COMPLETE! 🎊                    │
│                                                           │
│  Backend Anda sekarang running di Vercel!                │
│  Tidak perlu lagi run server manual.                     │
│                                                           │
│  Next: Deploy frontend juga ke Vercel? 🚀                │
│                                                           │
└──────────────────────────────────────────────────────────┘
```
