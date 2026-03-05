# ⚡ Quick: Deploy via Website Vercel

## 🚀 5 Langkah Cepat

### 1. Login
- Buka: **https://vercel.com**
- Klik: **Continue with GitHub**

### 2. Import
- Klik: **Add New... → Project**
- Pilih: **SNBT AI Production 7**
- Klik: **Import**

### 3. Configure (PENTING!)
- Project Name: `ptnpedia-backend`
- Framework: `Other`
- **Root Directory: `vercel-backend`** ← KRUSIAL!
- Klik: **Deploy**

### 4. Salin URL
```
https://ptnpedia-backend.vercel.app
```

### 5. Update .env
```env
REACT_APP_BACKEND_URL=https://ptnpedia-backend.vercel.app
```

Restart app: `npm start`

---

## ⚠️ PENTING!

**Root Directory HARUS:** `vercel-backend`

Jika tidak diset, akan error: "No serverless functions found"

---

## 🧪 Test

```
https://your-project.vercel.app/api/ptnpedia/health
```

Response:
```json
{"status":"ok","timestamp":"..."}
```

---

## 🔄 Auto Deploy

Setiap `git push` → Vercel otomatis deploy!

---

## 📚 Dokumentasi Lengkap

- `VERCEL_WEB_DEPLOY.md` - Panduan lengkap
- `VERCEL_WEB_VISUAL.md` - Visual guide dengan screenshot
- `VERCEL_MIGRATION_GUIDE.md` - Panduan via CLI
