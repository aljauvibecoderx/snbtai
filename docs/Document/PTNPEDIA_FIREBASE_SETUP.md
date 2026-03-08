# PTNPedia - Firebase Cloud Functions Setup

## 🚀 Quick Setup (5 menit)

### Step 1: Update ptnpedia-service.js

Ganti file `src/ptnpedia-service.js` dengan `ptnpedia-service-v2.js`:

```bash
cp src/ptnpedia-service-v2.js src/ptnpedia-service.js
```

### Step 2: Deploy Firebase Cloud Functions

1. **Copy function code ke Firebase:**
```bash
# Buka firebase-functions-ptnpedia.js
# Copy semua code
# Paste ke functions/index.js
```

2. **Install dependencies di functions folder:**
```bash
cd functions
npm install axios cheerio
```

3. **Deploy:**
```bash
firebase deploy --only functions
```

### Step 3: Update PTNPediaView.js

Pastikan import sudah benar:
```javascript
import { getUniversityList, getUniversityPrograms } from './ptnpedia-service';
```

## 📋 Penjelasan Solusi

### Mengapa Firebase Cloud Functions?

| Aspek | Problem | Solusi |
|-------|---------|--------|
| CORS | Browser block cross-origin | Cloud Function (server-side) |
| Setup | Perlu backend terpisah | Terintegrasi dengan Firebase |
| Deployment | Kompleks | `firebase deploy` |
| Cost | Perlu server | Pay-per-use |

### Alur Kerja

```
Browser (PTNPedia)
    ↓ (httpsCallable)
Firebase Cloud Function
    ↓ (axios)
SNPMB API
    ↓ (response)
Firebase Cloud Function
    ↓ (return)
Browser (PTNPedia)
```

**Keuntungan:**
- ✅ Tidak ada CORS issue
- ✅ Caching di Cloud Function
- ✅ Server-to-server communication
- ✅ Scalable & reliable

## 🔧 Troubleshooting

### Error: "getPTNUniversities is not a function"

**Solusi:**
1. Pastikan Cloud Function sudah di-deploy: `firebase deploy --only functions`
2. Tunggu 1-2 menit setelah deploy
3. Refresh browser

### Error: "Failed to fetch"

**Solusi:**
1. Check Firebase Console untuk error logs
2. Pastikan axios dan cheerio sudah di-install di functions
3. Cek internet connection

### Data tidak muncul

**Solusi:**
1. Buka browser DevTools → Console
2. Lihat error message
3. Check Firebase Cloud Functions logs

## 📦 Dependencies

**functions/package.json:**
```json
{
  "dependencies": {
    "firebase-functions": "^4.0.0",
    "firebase-admin": "^11.0.0",
    "axios": "^1.4.0",
    "cheerio": "^1.0.0-rc.12"
  }
}
```

## 🌐 Environment Variables

Tidak perlu environment variables untuk Cloud Functions - semua config sudah di Firebase Console.

## 📊 Performance

- **First load**: 2-3 detik (fetch dari SNPMB)
- **Cached load**: <100ms (dari Cloud Function cache)
- **Cache duration**: 1 jam

## 🔐 Security

- ✅ API keys tidak exposed
- ✅ Server-to-server communication
- ✅ Rate limiting bisa diterapkan
- ✅ Input validation di Cloud Function

## 📝 Deployment Checklist

- [ ] Copy firebase-functions-ptnpedia.js ke functions/index.js
- [ ] Run `npm install` di functions folder
- [ ] Run `firebase deploy --only functions`
- [ ] Update ptnpedia-service.js ke v2
- [ ] Test di browser
- [ ] Check Firebase Console logs

## 🎯 Next Steps

1. **Deploy Cloud Functions** (5 menit)
2. **Test di development** (2 menit)
3. **Deploy ke production** (1 menit)

## 📞 Support

Jika ada error:
1. Check Firebase Console → Functions → Logs
2. Lihat error message
3. Cek network tab di DevTools
4. Pastikan internet connection stabil

## ✅ Verification

Setelah setup, test dengan:

```javascript
// Di browser console
const { httpsCallable } = await import('firebase/functions');
const { functions } = await import('./firebase');
const getPTNUniversities = httpsCallable(functions, 'getPTNUniversities');
const result = await getPTNUniversities({ type: 'snbp' });
console.log(result.data);
```

Jika muncul array universitas, setup berhasil! ✅
