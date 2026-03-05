# PTNPedia - Quick Reference Guide

## 🎯 Apa itu PTNPedia?

Fitur di SNBT AI yang menampilkan data PTN, program studi, daya tampung, dan peluang masuk dari SNPMB.

## 📁 File-File Penting

| File | Fungsi |
|------|--------|
| `src/ptnpedia.js` | Frontend React component |
| `src/ptnpedia-backend.js` | Backend API handler |
| `src/DashboardView.js` | Dashboard integration |

## 🚀 Quick Start (5 Menit)

### 1. Setup Backend (Express Standalone)

```bash
# Di root project
npm install express axios cheerio cors

# Buat file: server.js
```

```javascript
const express = require('express');
const { setupPTNPediaRoutes } = require('./src/ptnpedia-backend');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

setupPTNPediaRoutes(app);
app.listen(3001, () => console.log('PTNPedia API on port 3001'));
```

### 2. Run Server
```bash
node server.js
```

### 3. Test API
```bash
curl "http://localhost:3001/api/ptnpedia/universities?type=snbp"
```

### 4. Access Frontend
- Buka dashboard: `/dashboard/ptnpedia`
- Pilih SNBP atau SNBT
- Cari universitas
- Klik untuk lihat program studi

## 🔌 API Endpoints

### Universities
```
GET /api/ptnpedia/universities?type=snbp
```

Response:
```json
{
  "success": true,
  "count": 87,
  "data": [
    {"code": "0001", "name": "Universitas Indonesia"},
    ...
  ]
}
```

### Programs
```
GET /api/ptnpedia/programs/0001?type=snbp
```

Response:
```json
{
  "success": true,
  "count": 45,
  "data": [
    {
      "code": "55201",
      "name": "Teknik Informatika",
      "capacity": "120",
      "applicants": "2500",
      "ratio": "20.8",
      "admissionChance": "4.80%"
    },
    ...
  ]
}
```

## 🎨 UI Features

| Fitur | Deskripsi |
|-------|-----------|
| Data Type Toggle | Pilih SNBP atau SNBT |
| Search | Cari universitas by name |
| Sort | Urutkan by nama, rasio, daya tampung, peminat |
| Metrics | Tampilkan daya tampung, peminat, peluang |
| Info Box | Penjelasan cara membaca data |

## 🔧 Konfigurasi

### Ubah API Endpoint
Di `src/ptnpedia.js`:
```javascript
const PTNPediaAPI = {
  async getUniversities(dataType = 'snbp') {
    const response = await fetch(`/api/ptnpedia/universities?type=${dataType}`);
    // Ubah URL sesuai backend Anda
  }
};
```

### Ubah Cache Duration
Di `src/ptnpedia-backend.js`:
```javascript
const CACHE_DURATION = 3600000; // 1 jam
// Ubah ke: 1800000 (30 menit), 7200000 (2 jam), dll
```

## 🐛 Common Issues

| Issue | Solusi |
|-------|--------|
| CORS Error | Pastikan backend running dan CORS enabled |
| Slow Response | Tunggu cache warm-up atau restart server |
| No Data | Check SNPMB endpoint masih aktif |
| 404 Error | Verify university code format (4 digit) |

## 📊 Data Source

- **SNBP**: `https://sidatagrun-public-1076756628210.asia-southeast2.run.app/ptn_sn.php`
- **SNBT**: `https://sidatagrun-public-1076756628210.asia-southeast2.run.app/ptn_sb.php`

## 🔐 Security Checklist

- [ ] CORS properly configured
- [ ] Input validation implemented
- [ ] Rate limiting enabled (optional)
- [ ] Error messages don't leak sensitive info
- [ ] API keys not exposed in frontend

## 📈 Performance Tips

1. **Enable Caching**: Sudah default 1 jam
2. **Use Redis**: Untuk distributed caching
3. **Compress Response**: Implement gzip
4. **Lazy Load**: Load programs on demand
5. **Monitor**: Track API response times

## 🚢 Deployment Options

### Option 1: Firebase Cloud Functions
```bash
firebase deploy --only functions:ptnpedia
```

### Option 2: Vercel
```bash
vercel deploy
```

### Option 3: Heroku
```bash
git push heroku main
```

### Option 4: Docker
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3001
CMD ["node", "server.js"]
```

## 📱 Mobile Optimization

- Responsive grid layout
- Touch-friendly buttons
- Optimized font sizes
- Smooth scrolling
- Minimal data usage

## 🧪 Testing Checklist

- [ ] Universities load correctly
- [ ] Search works
- [ ] Sort options work
- [ ] Programs display correctly
- [ ] Metrics calculated accurately
- [ ] Mobile responsive
- [ ] No console errors
- [ ] API response time < 1s

## 📞 Debugging

### Enable Logging
```javascript
// Di ptnpedia-backend.js
console.log(`Fetching universities from: ${url}`);
console.log(`Fetched ${universities.length} universities`);
```

### Check Cache
```javascript
// Di ptnpedia-backend.js
console.log(`Cache size: ${cache.size}`);
console.log(`Cache keys: ${Array.from(cache.keys())}`);
```

### Monitor API
```bash
# Watch server logs
tail -f server.log

# Monitor performance
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3001/api/ptnpedia/health
```

## 🎓 Learning Resources

- SNPMB Official: https://snpmb.bppp.kemdikbud.go.id/
- Cheerio Docs: https://cheerio.js.org/
- Express Docs: https://expressjs.com/
- React Docs: https://react.dev/

## 📝 Changelog

### v1.0.0 (Jan 2024)
- Initial release
- Universities & programs listing
- Search & sort functionality
- SNBP & SNBT support
- Responsive design
- Caching system

## 🤝 Contributing

1. Test thoroughly
2. Follow code style
3. Add comments
4. Update documentation
5. Submit PR

## 📄 License

Same as SNBT AI project

---

**Quick Links:**
- [Full Documentation](./PTNPEDIA_IMPLEMENTATION.md)
- [API Endpoints](#-api-endpoints)
- [Troubleshooting](#-common-issues)
- [Deployment](#-deployment-options)

**Last Updated**: January 2024
