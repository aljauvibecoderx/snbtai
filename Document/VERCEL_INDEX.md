# 📚 Dokumentasi Vercel Backend - Index

## 🎯 Pilih Metode Deploy

### 🌐 Deploy via Website (Recommended untuk Pemula)
Tidak perlu install CLI, semua dilakukan di browser.

**Mulai di sini:**
1. **`VERCEL_WEB_QUICK.md`** - 5 langkah cepat (2 menit baca)
2. **`VERCEL_WEB_DEPLOY.md`** - Panduan lengkap step-by-step
3. **`VERCEL_WEB_VISUAL.md`** - Visual guide dengan screenshot mockup

**Kelebihan:**
- ✅ Tidak perlu install CLI
- ✅ Interface visual mudah dipahami
- ✅ Auto deploy setiap git push
- ✅ Cocok untuk pemula

---

### 💻 Deploy via CLI (Recommended untuk Developer)
Menggunakan terminal/command line.

**Mulai di sini:**
1. **`VERCEL_QUICK_REF.md`** - Quick reference commands (1 menit baca)
2. **`VERCEL_MIGRATION_GUIDE.md`** - Panduan lengkap migrasi
3. **`VERCEL_VISUAL_GUIDE.md`** - Visual guide dengan diagram

**Kelebihan:**
- ✅ Lebih cepat (3 command saja)
- ✅ Bisa deploy dari terminal
- ✅ Cocok untuk automation
- ✅ Cocok untuk developer berpengalaman

---

## 📖 Dokumentasi Lengkap

### Deploy via Website
| File | Deskripsi | Waktu Baca |
|------|-----------|------------|
| `VERCEL_WEB_QUICK.md` | Quick reference 5 langkah | 2 menit |
| `VERCEL_WEB_DEPLOY.md` | Panduan lengkap step-by-step | 10 menit |
| `VERCEL_WEB_VISUAL.md` | Visual guide dengan screenshot | 15 menit |

### Deploy via CLI
| File | Deskripsi | Waktu Baca |
|------|-----------|------------|
| `VERCEL_QUICK_REF.md` | Quick reference commands | 1 menit |
| `VERCEL_MIGRATION_GUIDE.md` | Panduan lengkap migrasi | 15 menit |
| `VERCEL_VISUAL_GUIDE.md` | Visual guide dengan diagram | 10 menit |

---

## 🚀 Quick Start

### Metode 1: Website (Pemula)
```
1. Buka https://vercel.com
2. Login dengan GitHub
3. Import repository
4. Set root directory: vercel-backend
5. Deploy
6. Salin URL
7. Update .env
```

### Metode 2: CLI (Developer)
```bash
# Install CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd vercel-backend
vercel --prod

# Update .env dengan URL yang diberikan
```

---

## 📁 Struktur File Backend

```
vercel-backend/
├── api/
│   └── ptnpedia.js       ← Serverless function
├── vercel.json            ← Config routing
├── package.json           ← Dependencies
└── README.md              ← Info backend
```

---

## 🔗 Endpoints

Setelah deploy, backend akan tersedia di:

```
https://your-project.vercel.app/api/ptnpedia/health
https://your-project.vercel.app/api/ptnpedia/universities?type=snbp
https://your-project.vercel.app/api/ptnpedia/programs/:code?type=snbp
```

---

## ⚙️ Environment Variables

File `.env` di root project:

```env
# Backend URL (Vercel)
REACT_APP_BACKEND_URL=https://your-project.vercel.app
```

**⚠️ PENTING:** Ganti dengan URL Anda!

---

## 🧪 Testing

### Test Backend
```bash
# Health check
curl https://your-project.vercel.app/api/ptnpedia/health

# Get universities
curl https://your-project.vercel.app/api/ptnpedia/universities?type=snbp

# Get programs
curl https://your-project.vercel.app/api/ptnpedia/programs/0001?type=snbp
```

### Test Frontend
1. Buka `http://localhost:3000`
2. Klik **PTNPedia**
3. Pilih **SNBP** atau **SNBT**
4. Klik universitas
5. Pastikan data muncul

---

## 🐛 Troubleshooting

### Error: "No serverless functions found"
**Solusi:** Set root directory ke `vercel-backend`

### Error: "API not available"
**Solusi:** Cek URL di `.env` dan restart app

### Error: "CORS policy"
**Solusi:** Deploy ulang backend

### Data tidak muncul
**Solusi:** Restart React app (`npm start`)

---

## 📊 Perbandingan Metode

| Aspek | Website | CLI |
|-------|---------|-----|
| **Setup** | Tidak perlu install | Perlu install CLI |
| **Kemudahan** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Kecepatan** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Visual** | ✅ Ada UI | ❌ Terminal only |
| **Auto Deploy** | ✅ Ya | ✅ Ya |
| **Monitoring** | ✅ Dashboard | ✅ Dashboard |
| **Cocok untuk** | Pemula | Developer |

---

## 🎓 Learning Path

### Pemula (Belum pernah deploy)
```
1. VERCEL_WEB_QUICK.md (2 min)
   ↓
2. VERCEL_WEB_DEPLOY.md (10 min)
   ↓
3. VERCEL_WEB_VISUAL.md (15 min)
   ↓
4. Deploy via website
   ↓
5. ✅ Done!
```

### Intermediate (Sudah pernah deploy)
```
1. VERCEL_QUICK_REF.md (1 min)
   ↓
2. Deploy via CLI
   ↓
3. ✅ Done!
```

### Advanced (Ingin tahu detail)
```
1. VERCEL_MIGRATION_GUIDE.md (15 min)
   ↓
2. VERCEL_VISUAL_GUIDE.md (10 min)
   ↓
3. Explore Vercel Dashboard
   ↓
4. Setup custom domain
   ↓
5. ✅ Done!
```

---

## 🔄 Update Backend

### Auto Deploy (Recommended)
```bash
git add .
git commit -m "Update backend"
git push origin main
```
Vercel otomatis deploy dalam 1-2 menit.

### Manual Redeploy
1. Buka Vercel Dashboard
2. Pilih project
3. Deployments → ... → Redeploy

---

## 📈 Monitoring

### Vercel Dashboard
- **Analytics:** Request count, response time
- **Logs:** Real-time logs
- **Deployments:** History deploy

### Access Dashboard
```
https://vercel.com/dashboard
→ Pilih project: ptnpedia-backend
→ Lihat Analytics, Logs, dll
```

---

## 🎯 Next Steps

Setelah backend live:

1. ✅ Monitor performance di Analytics
2. ✅ Setup custom domain (optional)
3. ✅ Deploy frontend ke Vercel (optional)
4. ✅ Setup environment variables di Vercel
5. ✅ Enable monitoring & alerts

---

## 🆘 Butuh Bantuan?

### Dokumentasi
- Vercel Docs: https://vercel.com/docs
- Serverless Functions: https://vercel.com/docs/functions

### Support
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Issues: https://github.com/vercel/vercel/issues
- Vercel Community: https://github.com/vercel/vercel/discussions

---

## ✅ Checklist Deployment

- [ ] Pilih metode (Website atau CLI)
- [ ] Baca dokumentasi yang sesuai
- [ ] Deploy backend
- [ ] Test health check
- [ ] Test endpoints
- [ ] Update `.env`
- [ ] Restart React app
- [ ] Test PTNPedia di browser
- [ ] Monitor di Vercel Dashboard
- [ ] ✅ Done!

---

## 🎉 Success!

Jika semua checklist ✅, backend Anda sudah live di Vercel! 🚀

**Tidak perlu lagi run `node server.js` manual.**

**Auto deploy aktif setiap git push.**

**Backend accessible 24/7 dengan HTTPS.**

---

## 📝 Notes

- Vercel hobby plan: Gratis untuk personal projects
- Timeout: 10 detik per request
- Bandwidth: 100GB/bulan
- Caching: 1 jam (sudah diimplementasi)
- Auto-scaling: Otomatis handle traffic tinggi

---

## 🔗 Quick Links

| Link | URL |
|------|-----|
| Vercel Dashboard | https://vercel.com/dashboard |
| Vercel Docs | https://vercel.com/docs |
| Backend URL | https://your-project.vercel.app |
| Health Check | https://your-project.vercel.app/api/ptnpedia/health |

---

**Happy Deploying! 🚀**
