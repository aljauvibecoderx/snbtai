# ⚡ Quick Reference: Migrasi Backend ke Vercel

## 🚀 3 Langkah Cepat

### 1. Deploy Backend
```bash
cd vercel-backend
vercel --prod
```

### 2. Update .env
```env
REACT_APP_BACKEND_URL=https://your-project.vercel.app
```

### 3. Restart App
```bash
npm start
```

---

## 📋 Commands Penting

| Command | Fungsi |
|---------|--------|
| `vercel login` | Login ke Vercel |
| `vercel` | Deploy preview |
| `vercel --prod` | Deploy production |
| `vercel logs` | Lihat logs |
| `vercel ls` | List deployments |

---

## 🔗 Endpoints

```
GET /api/ptnpedia/health
GET /api/ptnpedia/universities?type=snbp
GET /api/ptnpedia/programs/:code?type=snbp
```

---

## 🧪 Test Backend

```bash
# Health check
curl https://your-project.vercel.app/api/ptnpedia/health

# Get universities
curl https://your-project.vercel.app/api/ptnpedia/universities?type=snbp

# Get programs
curl https://your-project.vercel.app/api/ptnpedia/programs/0001?type=snbp
```

---

## 📁 File yang Diubah

### ✅ Sudah Siap (JANGAN DIUBAH)
- `vercel-backend/api/ptnpedia.js`
- `vercel-backend/vercel.json`
- `vercel-backend/package.json`
- `src/ptnpedia.js`

### ⚠️ HARUS DIUBAH
- `.env` → Tambahkan `REACT_APP_BACKEND_URL`

---

## 🐛 Troubleshooting

| Error | Solusi |
|-------|--------|
| API not available | Cek URL di `.env` |
| CORS error | Deploy ulang: `vercel --prod` |
| Timeout | Tunggu & coba lagi (cache aktif) |
| Data tidak muncul | Restart app: `npm start` |

---

## 💡 Tips

- ✅ Backend otomatis HTTPS
- ✅ Auto-scaling gratis
- ✅ Caching 1 jam
- ✅ Fallback ke mock data
- ⚠️ Timeout 10 detik (hobby plan)
- ⚠️ Jangan commit `.env`

---

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Vercel Dashboard: https://vercel.com/dashboard
- Logs: Dashboard → Project → Logs
