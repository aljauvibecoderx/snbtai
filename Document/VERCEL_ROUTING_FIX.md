# 🔧 Quick Fix: Backend Routing Issue

## ❌ Masalah
Backend sudah deploy tapi universitas tidak muncul.

## ✅ Solusi

### 1. File yang Diubah
```
vercel-backend/
├── api/
│   ├── health.js          ← BARU
│   ├── universities.js    ← BARU
│   ├── programs.js        ← BARU
│   └── ptnpedia.js        ← LAMA (bisa dihapus)
└── vercel.json            ← DIUBAH (simplified)
```

### 2. Endpoint Baru

| Lama | Baru |
|------|------|
| `/api/ptnpedia/health` | `/api/health` |
| `/api/ptnpedia/universities?type=snbp` | `/api/universities?type=snbp` |
| `/api/ptnpedia/programs/0001?type=snbp` | `/api/programs?code=0001&type=snbp` |

### 3. Deploy Ulang

```bash
cd vercel-backend
vercel --prod
```

Atau via website:
1. Push ke GitHub: `git push`
2. Vercel auto-deploy (tunggu 1-2 menit)

### 4. Test Backend

```bash
node test-backend-vercel.js
```

Expected output:
```
✅ Health: { status: 'ok', timestamp: '...' }
✅ Universities: 100+ found
✅ Programs: 50+ found
```

### 5. Restart Frontend

```bash
npm start
```

## 🧪 Test Manual

```bash
# Health
curl https://snbtai-backends.vercel.app/api/health

# Universities
curl https://snbtai-backends.vercel.app/api/universities?type=snbp

# Programs
curl https://snbtai-backends.vercel.app/api/programs?code=0001&type=snbp
```

## ✅ Checklist

- [ ] File baru dibuat (health.js, universities.js, programs.js)
- [ ] vercel.json disederhanakan
- [ ] Frontend diupdate (ptnpedia.js)
- [ ] Push ke GitHub
- [ ] Vercel auto-deploy
- [ ] Test backend berhasil
- [ ] Restart frontend
- [ ] PTNPedia load data

## 🎉 Done!

Universitas sekarang harus muncul!
