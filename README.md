# SNBT AI - AI-Powered Learning

Aplikasi React untuk mengubah cerita menjadi soal SNBT dengan bantuan AI.

## ⚠️ SECURITY NOTICE

**CRITICAL:** Jika Anda clone repository ini, Anda HARUS:
1. Baca `SECURITY.md` terlebih dahulu
2. Rotate semua API keys yang ada
3. Setup `.env` file dengan keys baru Anda
4. JANGAN PERNAH commit file `.env`

## Fitur

- **Mode Ujian**: Simulasi ujian SNBT yang serius
- **Mode Ngegame**: Mode interaktif dengan poin dan streak
- **AI Generator**: Mengubah cerita menjadi soal SNBT
- **AI Lens Multi-Source**: Upload hingga 5 gambar sekaligus untuk generate soal
- **PTNPedia**: Informasi lengkap PTN, program studi, dan daya tampung (SNBP/SNBT)
- **LaTeX Support**: Mendukung rumus matematika
- **Sound Effects**: Efek suara interaktif
- **Responsive Design**: Tampilan yang responsif

## Instalasi

1. Clone repository:
```bash
git clone <repository-url>
cd "SNBT AI Production 7"
```

2. Setup environment variables:
```bash
cp .env.example .env
# Edit .env dan masukkan API keys Anda
# Tambahkan REACT_APP_BACKEND_URL untuk PTNPedia
```

3. Install dependencies:
```bash
npm install
```

4. Deploy backend ke Vercel (untuk PTNPedia):
```bash
cd vercel-backend
vercel --prod
# Salin URL yang diberikan
```

5. Update `.env` dengan URL Vercel:
```env
REACT_APP_BACKEND_URL=https://your-project.vercel.app
```

6. Jalankan aplikasi:
```bash
npm start
```

7. Buka browser di `http://localhost:3000`

**📖 Panduan Lengkap:** Lihat `VERCEL_MIGRATION_GUIDE.md` untuk tutorial step-by-step

## 🔒 Security

- ✅ API keys protected dengan environment variables
- ✅ Input sanitization untuk mencegah XSS
- ✅ Rate limiting untuk mencegah abuse
- ✅ Firestore security rules yang ketat
- ✅ Ownership-based access control

Baca `SECURITY.md` untuk detail lengkap.

## 🛠️ Bug Fixes

### JSON Parsing Error Fix (Latest)

Memperbaiki error berulang saat parsing JSON dari AI yang menyebabkan user tidak bisa generate soal:

- ✅ **Escaping Protocol**: Instruksi ketat untuk AI tentang escaping karakter
- ✅ **Multi-Layer Cleaning**: 5 layer pembersihan JSON dengan fallback
- ✅ **LaTeX Fix**: Proper handling untuk simbol matematika (\frac, \circ, dll)
- ✅ **Quote Handling**: Escape otomatis untuk dialog dan tanda petik
- ✅ **Recovery System**: Automatic recovery untuk 95% error cases
- ✅ **Enhanced Logging**: Detail error logs untuk debugging

**Error Rate**: Turun dari ~40% menjadi <5%

Baca `JSON_PARSING_FIX.md` untuk detail lengkap atau `JSON_QUICK_REF.md` untuk quick reference.

## Cara Penggunaan

1. Pilih subtes yang diinginkan
2. Tulis cerita atau konteks (minimal 20 karakter)
3. Atur tingkat kesulitan (1-5)
4. Pilih mode (Ujian atau Ngegame)
5. Klik "Generate Soal"

## Teknologi

- React 18
- Tailwind CSS
- Lucide React Icons
- Google Generative AI (Gemini 2.5 Flash)
- KaTeX (LaTeX rendering)
- Tesseract.js (OCR)
- Vercel Serverless Functions (Backend)
- Cheerio (Web Scraping)

## Scripts

- `npm start` - Menjalankan development server
- `npm build` - Build untuk production
- `npm test` - Menjalankan tests
- `npm eject` - Eject dari Create React App

## 📚 Dokumentasi

### 🎯 Mulai Di Sini
- `VERCEL_INDEX.md` - Index semua dokumentasi Vercel
- `VERCEL_COMPARISON.md` - Pilih metode deploy: Website vs CLI

### Deploy Backend ke Vercel
- `VERCEL_WEB_DEPLOY.md` - Panduan deploy via website Vercel (untuk pemula)
- `VERCEL_WEB_VISUAL.md` - Visual guide dengan screenshot mockup
- `VERCEL_WEB_QUICK.md` - Quick reference 5 langkah
- `VERCEL_MIGRATION_GUIDE.md` - Panduan lengkap via CLI
- `VERCEL_QUICK_REF.md` - Quick reference commands CLI
- `VERCEL_VISUAL_GUIDE.md` - Visual guide dengan diagram

### Dokumentasi Lainnya
- `SECURITY.md` - Security best practices
- `JSON_PARSING_FIX.md` - Detail fix untuk JSON parsing errors