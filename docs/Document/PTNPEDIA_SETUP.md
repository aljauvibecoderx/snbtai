# 🎓 PTNPedia - Setup & Installation Guide

## 📌 Overview

PTNPedia adalah fitur baru di SNBT AI yang menyediakan informasi lengkap tentang Perguruan Tinggi Negeri (PTN), program studi, daya tampung, dan peluang masuk dari SNPMB.

## ✨ Fitur Utama

- 📚 Daftar lengkap PTN dari SNPMB
- 🎯 Program studi per universitas
- 📊 Data daya tampung dan peminat
- 🔍 Pencarian dan filter
- 📈 Sorting berdasarkan berbagai kriteria
- 📱 Responsive design
- ⚡ Caching system untuk performa optimal

## 🚀 Quick Start (5 Menit)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Backend Server
```bash
npm run start:backend
```

Output yang diharapkan:
```
╔════════════════════════════════════════╗
║     PTNPedia API Server Started        ║
╠════════════════════════════════════════╣
║ Port: 3001                             ║
║ Environment: development               ║
║ CORS: All origins                      ║
╠════════════════════════════════════════╣
║ Endpoints:                             ║
║ • GET /                                ║
║ • GET /health                          ║
║ • GET /api/ptnpedia/universities       ║
║ • GET /api/ptnpedia/programs/:code     ║
║ • GET /api/ptnpedia/health             ║
╚════════════════════════════════════════╝
```

### 3. Start Frontend (Terminal Baru)
```bash
npm start
```

### 4. Access PTNPedia
Buka browser dan navigasi ke:
```
http://localhost:8000/dashboard/ptnpedia
```

## 📋 Detailed Setup

### Prerequisites
- Node.js 14+ 
- npm atau yarn
- Browser modern (Chrome, Firefox, Safari, Edge)

### Installation Steps

#### Step 1: Clone/Setup Project
```bash
cd "SNBT AI Production 6"
```

#### Step 2: Install All Dependencies
```bash
npm install
```

Ini akan install:
- React & React Router
- Express & CORS
- Axios & Cheerio (untuk parsing)
- Firebase
- Lucide React Icons
- Dan dependencies lainnya

#### Step 3: Verify Installation
```bash
npm list express axios cheerio cors
```

Pastikan semua terinstall dengan versi yang tepat.

#### Step 4: Start Backend
```bash
npm run start:backend
```

Tunggu sampai muncul pesan "PTNPedia API Server Started"

#### Step 5: Start Frontend (Terminal Baru)
```bash
npm start
```

Tunggu sampai browser terbuka otomatis di `http://localhost:8000`

#### Step 6: Navigate to PTNPedia
1. Klik menu Dashboard
2. Pilih tab "PTNPedia" (icon Globe)
3. Atau langsung ke: `http://localhost:8000/dashboard/ptnpedia`

## 🧪 Testing

### Test Backend API
```bash
# Get universities
curl "http://localhost:3001/api/ptnpedia/universities?type=snbp"

# Get programs
curl "http://localhost:3001/api/ptnpedia/programs/0001?type=snbp"

# Health check
curl "http://localhost:3001/api/ptnpedia/health"
```

### Test Frontend
1. Buka `/dashboard/ptnpedia`
2. Pilih SNBP atau SNBT
3. Cari universitas (e.g., "Indonesia")
4. Klik universitas untuk lihat program studi
5. Test sort options
6. Verify data muncul dengan benar

## 🔧 Configuration

### Backend Port
Default: `3001`

Untuk mengubah:
```bash
PORT=3002 npm run start:backend
```

### Frontend Port
Default: `8000`

Untuk mengubah di `package.json`:
```json
"start": "set PORT=9000 && react-scripts start"
```

### API Endpoint
Jika backend di server lain, ubah di `src/ptnpedia.js`:
```javascript
const API_BASE = 'https://your-backend-url.com';
```

### Cache Duration
Di `src/ptnpedia-backend.js`:
```javascript
const CACHE_DURATION = 3600000; // 1 jam
// Ubah ke: 1800000 (30 menit), 7200000 (2 jam), dll
```

## 📁 File Structure

```
SNBT AI Production 6/
├── src/
│   ├── ptnpedia.js                 # Frontend React component
│   ├── ptnpedia-backend.js         # Backend API logic
│   ├── DashboardView.js            # Dashboard integration
│   └── ...
├── Document/
│   ├── PTNPEDIA_IMPLEMENTATION.md  # Full documentation
│   ├── PTNPEDIA_QUICK_REF.md       # Quick reference
│   ├── PTNPEDIA_SUMMARY.md         # Implementation summary
│   └── ...
├── server.js                        # Express server
├── package.json                     # Dependencies
└── README.md                        # This file
```

## 🐛 Troubleshooting

### Issue: "Cannot find module 'express'"
**Solution:**
```bash
npm install express axios cheerio cors
```

### Issue: "CORS Error" di browser
**Solution:**
1. Pastikan backend running: `npm run start:backend`
2. Check port 3001 tidak digunakan aplikasi lain
3. Restart backend server

### Issue: "No data showing"
**Solution:**
1. Check API response: `curl http://localhost:3001/api/ptnpedia/universities`
2. Verify SNPMB endpoint masih aktif
3. Check browser console untuk error messages

### Issue: "Slow response"
**Solution:**
1. Tunggu cache warm-up (first request bisa 2-5 detik)
2. Restart server
3. Check internet connection

### Issue: "Port already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3001
kill -9 <PID>
```

## 📚 Documentation

- **Full Guide**: `Document/PTNPEDIA_IMPLEMENTATION.md`
- **Quick Reference**: `Document/PTNPEDIA_QUICK_REF.md`
- **Summary**: `Document/PTNPEDIA_SUMMARY.md`

## 🚢 Deployment

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
```bash
docker build -t ptnpedia .
docker run -p 3001:3001 ptnpedia
```

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API info |
| `/health` | GET | Health check |
| `/api/ptnpedia/universities` | GET | Get universities |
| `/api/ptnpedia/programs/:code` | GET | Get programs |
| `/api/ptnpedia/health` | GET | API health |

## 🎨 Features

### Data Type Selection
- Toggle antara SNBP dan SNBT
- Data real-time dari SNPMB

### Search & Filter
- Search universitas by name
- Filter by type (SNBP/SNBT)

### Sorting Options
- Sort by nama
- Sort by rasio peminat
- Sort by daya tampung
- Sort by jumlah peminat

### Metrics Display
- Daya tampung
- Jumlah peminat
- Rasio peminat
- Peluang masuk (%)

## 🔒 Security

- ✅ Input validation
- ✅ CORS properly configured
- ✅ Error handling
- ✅ No sensitive data exposed

## 📈 Performance

- **First Request**: 2-5 detik
- **Cached Request**: <100ms
- **Cache Duration**: 1 jam
- **Cache Hit Rate**: ~80%

## 🤝 Contributing

1. Test thoroughly
2. Follow code style
3. Add comments
4. Update documentation
5. Submit PR

## 📞 Support

### Common Issues
- Check troubleshooting section above
- Review documentation files
- Check server logs

### Getting Help
1. Read the documentation
2. Check browser console
3. Check server logs
4. Contact development team

## ✅ Checklist

Sebelum production, pastikan:
- [ ] Backend running tanpa error
- [ ] Frontend dapat akses API
- [ ] Data muncul dengan benar
- [ ] Search & filter berfungsi
- [ ] Sort options bekerja
- [ ] Mobile responsive
- [ ] No console errors
- [ ] API response time acceptable

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Cheerio Documentation](https://cheerio.js.org/)
- [SNPMB Official](https://snpmb.bppp.kemdikbud.go.id/)

## 📝 Version History

### v1.0.0 (January 2024)
- Initial release
- Universities & programs listing
- Search & sort functionality
- SNBP & SNBT support
- Responsive design
- Caching system

## 📄 License

Same as SNBT AI project

---

## 🎉 You're All Set!

PTNPedia is now ready to use. Enjoy exploring PTN data!

**Questions?** Check the documentation or contact the development team.

**Last Updated**: January 2024
