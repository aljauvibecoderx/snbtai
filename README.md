# SNBT AI - AI-Powered Learning Platform

> Platform pembelajaran SNBT berbasis AI dengan sistem tryout profesional, bank soal interaktif, dan fitur vocabulary builder.

[![Version](https://img.shields.io/badge/version-3.2.0-blue.svg)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org)
[![Firebase](https://img.shields.io/badge/Firebase-12.8.0-FFCA28?logo=firebase)](https://firebase.google.com)

---

## 🚀 Fitur Utama

### 🎯 Sistem Pembelajaran
- **Mode Ujian**: Simulasi ujian SNBT dengan timer dan scoring profesional
- **Mode Ngegame**: Mode interaktif dengan poin, streak, dan sound effects
- **7 Subtes SNBT**: TPS (PU, PM, PBM, PK), Literasi (Indonesia, Inggris), Matematika
- **5 Level Kesulitan**: Dari basic hingga advanced dengan IRT scoring

### 🤖 AI Generator
- **Text-to-Question**: Ubah cerita/konteks menjadi soal SNBT berkualitas
- **AI Lens Multi-Source**: Upload hingga 5 gambar/PDF sekaligus untuk generate soal
- **LaTeX Support**: Rendering rumus matematika dengan KaTeX
- **Smart Parsing**: Multi-layer JSON cleaning dengan 95% success rate

### 📚 Bank Soal & Tryout
- **Question Bank**: Simpan dan kelola soal yang telah dibuat
- **Official Tryout**: Admin dapat membuat tryout resmi dari bank soal
- **IRT Scoring**: Sistem scoring profesional (200-800) seperti SNBT asli
- **Percentile Ranking**: Bandingkan performa dengan peserta lain
- **Question Wishlist**: Bookmark soal favorit untuk review nanti

### 🎓 PTNPedia
- **Database PTN**: Informasi lengkap 85+ PTN di Indonesia
- **Program Studi**: 1000+ prodi dengan detail daya tampung
- **Daya Tampung**: Data SNBP dan SNBT per tahun
- **Search & Filter**: Cari PTN/prodi dengan mudah

### 📖 Vocab Mode (Literasi Inggris)
- **Highlight to Save**: Blok kata langsung dari soal untuk disimpan
- **Spaced Repetition**: Review berkala dengan algoritma terbukti efektif
- **XP System**: Gamifikasi untuk motivasi belajar
- **Progress Tracking**: Monitor perkembangan vocabulary

### 👥 Fitur Sosial
- **Community Posts**: Berbagi tips dan pengalaman
- **Dashboard Analytics**: Statistik lengkap performa belajar
- **Leaderboard**: Kompetisi dengan pengguna lain (coming soon)

---

## 🔒 Keamanan

### Proteksi yang Diterapkan
- ✅ **Environment Variables**: API keys tersimpan aman di `.env`
- ✅ **Input Sanitization**: Mencegah XSS dan injection attacks
- ✅ **Rate Limiting**: 
  - Tanpa login: 1 soal/hari
  - Dengan login: 19 soal/hari
  - Per menit: 3 request/menit
- ✅ **Firestore Security Rules**: Ownership-based access control
- ✅ **Role-Based Access Control (RBAC)**: Admin panel dengan verifikasi ganda
- ✅ **Automated Security Check**: Pre-build validation
- ✅ **Admin Activity Logs**: Audit trail untuk compliance

### Pencegahan Serangan
- 🛡️ **XSS Prevention**: HTML sanitization pada semua input
- 🛡️ **SQL Injection**: Firestore parameterized queries
- 🛡️ **CSRF Protection**: Firebase authentication tokens
- 🛡️ **API Abuse**: Multi-layer rate limiting
- 🛡️ **Data Leakage**: Strict Firestore rules per collection

**📖 Dokumentasi Lengkap**: Lihat [`Document/SECURITY.md`](Document/SECURITY.md)

---

## 🛠️ Bug Fixes & Improvements

### JSON Parsing Error Fix (v2.1.0)
**Problem**: Error rate 40% saat parsing JSON dari AI

**Solutions**:
- ✅ AI prompt enhancement dengan escaping protocol
- ✅ Multi-layer JSON cleaning (5 layers)
- ✅ LaTeX backslash fixing (`\frac` → `\\frac`)
- ✅ Quote escaping otomatis
- ✅ Fallback recovery system

**Results**: Error rate turun dari 40% → <5%

### Daily Limit Fix
- ✅ Reset limit otomatis setiap hari (00:00 WIB)
- ✅ Tracking per user dengan Firestore
- ✅ Visual feedback untuk remaining quota

### HTML Entities Hotfix
- ✅ Decode `&quot;`, `&amp;`, `&lt;`, `&gt;`
- ✅ Prevent double encoding
- ✅ Clean display di UI

### Pagination & Routing
- ✅ SEO-friendly URLs dengan slug routing
- ✅ Pagination untuk bank soal dan community posts
- ✅ Smooth navigation dengan React Router

**📖 Detail Lengkap**: Lihat [`Document/CHANGELOG.md`](Document/CHANGELOG.md)

---

## 📦 Instalasi

### Prerequisites
- Node.js 16+ dan npm
- Firebase account (gratis)
- Google AI Studio API key (gratis)
- Git

### Quick Start

```bash
# 1. Clone repository
git clone <repository-url>
cd "SNBT AI - Competition"

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env dan masukkan API keys Anda

# 4. Jalankan aplikasi
npm start
```

Aplikasi akan terbuka di `http://localhost:8000`

### Setup Backend (PTNPedia)

```bash
# 1. Masuk ke folder backend
cd vercel-backend

# 2. Install dependencies
npm install

# 3. Deploy ke Vercel
vercel --prod

# 4. Copy URL yang diberikan
# Contoh: https://your-project.vercel.app

# 5. Update .env di root folder
echo "REACT_APP_BACKEND_URL=https://your-project.vercel.app" >> ../.env
```

### Install Steps Detail

1. **Clone & Install**
   ```bash
   git clone https://github.com/your-repo/SNBT-AI.git
   cd SNBT-AI
   npm install
   ```

2. **Konfigurasi Environment**
   ```bash
   cp .env.example .env
   # Edit file .env dengan API keys Anda
   ```

3. **Setup Firebase**
   - Buat project di [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Google)
   - Enable Firestore Database
   - Copy config ke `.env`

4. **Setup Google AI**
   - Daftar di [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Buat API Key
   - Tambahkan ke `.env`

5. **Jalankan**
   ```bash
   npm start
   ```

**📖 Panduan Lengkap**: Lihat [`docs/INSTALL.md`](docs/INSTALL.md)

---

## 📚 Dokumentasi

### 🎯 Getting Started
- [`docs/INSTALL.md`](docs/INSTALL.md) - Panduan instalasi lengkap
- [`VERCEL_INDEX.md`](Document/VERCEL_INDEX.md) - Index semua dokumentasi
- [`VERCEL_COMPARISON.md`](Document/VERCEL_COMPARISON.md) - Pilih metode deploy

### 🔧 Technical Docs
- [`SECURITY.md`](Document/SECURITY.md) - Security best practices
- [`ADMIN_PANEL_BLUEPRINT.md`](Document/ADMIN_PANEL_BLUEPRINT.md) - Admin system architecture
- [`AI_LENS_MULTI_SOURCE.md`](Document/AI_LENS_MULTI_SOURCE.md) - Multi-file processing
- [`VOCAB_MODE_IMPLEMENTATION.md`](Document/VOCAB_MODE_IMPLEMENTATION.md) - Vocabulary system
- [`JSON_PARSING_FIX.md`](Document/JSON_PARSING_FIX.md) - JSON error handling

### 📖 Quick References
- [`ADMIN_QUICK_REF.md`](Document/ADMIN_QUICK_REF.md) - Admin commands
- [`AI_LENS_QUICK_REF.md`](Document/AI_LENS_QUICK_REF.md) - AI Lens usage
- [`JSON_QUICK_REF.md`](Document/JSON_QUICK_REF.md) - JSON parsing guide
- [`SECURITY_QUICK_REF.md`](Document/SECURITY_QUICK_REF.md) - Security checklist

### 📊 Reports & Changelogs
- [`CHANGELOG.md`](Document/CHANGELOG.md) - Version history
- [`EXECUTIVE_SUMMARY.md`](Document/EXECUTIVE_SUMMARY.md) - Project overview
- [`IMPLEMENTATION_SUMMARY.md`](Document/IMPLEMENTATION_SUMMARY.md) - Feature implementation

---

## 🐛 Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"
```bash
# 1. Cek .env file ada dan benar
type .env

# 2. Restart dev server
# Ctrl+C untuk stop, lalu:
npm start

# 3. Pastikan tidak ada typo di .env
# REACT_APP_FIREBASE_API_KEY (bukan API_KEy)
```

### Error: "Quota exceeded"
- Tunggu beberapa menit (rate limit reset)
- Cek quota di Firebase/Google AI Console
- Gunakan API key alternatif (key_2, key_3)

### JSON Parsing Error
- Sudah diperbaiki di v2.1.0
- Jika masih terjadi, lihat console logs
- Report ke GitHub Issues dengan error details

### Vocab Mode Tidak Muncul
- Pastikan subtest adalah `lit_ing`
- User harus sudah login
- Cek browser console untuk errors

**📖 Troubleshooting Lengkap**: Lihat [`Document/SECURITY.md`](Document/SECURITY.md#-troubleshooting)

---

## 🤝 Contributing

Kami menerima kontribusi! Silakan:
1. Fork repository
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

### Branching Strategy

Kami menggunakan **Git Flow** yang disederhanakan:

```
main
 └── develop
      ├── feature/nama-fitur
      ├── fix/nama-bug
      ├── hotfix/nama-hotfix
      └── chore/nama-tugas
```

| Branch | Tujuan | Merge ke |
|---|---|---|
| `main` | Production — selalu stable | — |
| `develop` | Staging — integrasi semua fitur | `main` via PR |
| `feature/*` | Fitur baru | `develop` |
| `fix/*` | Bug fix non-kritis | `develop` |
| `hotfix/*` | Bug fix kritis di production | `main` + `develop` |
| `chore/*` | Refactor, dependency update, docs | `develop` |

**Aturan Branch:**
- ❌ **Jangan push langsung ke `main` atau `develop`**
- ✅ Selalu buat branch baru dari `develop` yang sudah up-to-date
- ✅ Satu branch = satu concern
- ✅ Nama branch pakai kebab-case: `feature/ai-lens-ocr`

```bash
# Cara membuat branch yang benar
git checkout develop
git pull origin develop
git checkout -b feature/nama-fitur-kamu
```
### Pull Request Process

1. **Pastikan branch kamu up-to-date** dengan `develop` sebelum membuka PR
2. **Jalankan security check** sebelum push: `npm run security-check`
3. **Isi PR template** dengan lengkap
4. **Assign reviewer** minimal 1 orang
5. **Tunggu approval** — jangan self-merge kecuali hotfix urgent

**Checklist PR (wajib):**
- [ ] Kode berjalan tanpa error di local
- [ ] Tidak ada console.log yang tertinggal
- [ ] Tidak ada API key / secret yang ter-commit
- [ ] `npm run security-check` lulus
- [ ] UI sudah dicek di mobile (375px) dan desktop (1280px)

### Code Standards

- **Functional components** — tidak ada class component baru
- **Hooks** untuk semua state & side effect
- **No inline styles** — gunakan Tailwind classes
- Ukuran file component maksimal **400 baris**
- Import order: React → third-party → internal → styles

### Larangan

- 🚫 Commit langsung ke `main`
- 🚫 API key / password / secret dalam kode
- 🚫 `console.log` yang tertinggal di production code
- 🚫 Mengubah `firestore.rules` tanpa diskusi maintainer

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📋 Changelog

### v3.2.0 (Current)
- AI Lens Multi-Source: Upload hingga 5 gambar/PDF sekaligus
- Vocabulary Mode dengan Spaced Repetition
- PTNPedia dengan 85+ PTN dan 1000+ prodi
- IRT Scoring System (200-800 scale)
- Enhanced security dengan rate limiting

### v3.1.0 - Performance & Security
- Code splitting dengan React.lazy()
- SEO implementation (robots.txt, sitemap.xml, manifest.json)
- Debug cleanup - removed console.log statements
- Preconnect dan dns-prefetch optimization

### v3.0.0 - AI Generation
- Text-to-Question AI generator
- 7 Subtes SNBT support
- 5 Level difficulty
- Firebase authentication

### v2.1.0 - JSON Parsing Fix
- Multi-layer JSON cleaning (5 layers)
- LaTeX backslash fixing
- Quote escaping otomatis
- Error rate turun dari 40% → <5%

### v2.0.0 - Gamification
- Mode Ngegame dengan poin dan streak
- Sound effects
- XP System
- Leaderboard

### v1.0.0 - Initial Release
- AI-powered question generation
- Tryout mode dengan timer
- IRT Scoring
- Basic authentication

**Seluruh changelog**: [`docs/CHANGELOG.md`](docs/CHANGELOG.md)

---

## 👥 Authors

- **Lead Developer** - [Your Name](https://github.com/yourusername)
- **AI/ML Engineer** - [Contributor Name](https://github.com/contributor)
- **UI/UX Designer** - [Designer Name](https://dribbble.com/designername)

**Kontributor**: Lihat daftar lengkap [`docs/CONTRIBUTORS.md`](docs/CONTRIBUTORS.md)

---

## 🙏 Acknowledgments

- **Google Generative AI** - Gemini 2.5 Flash untuk AI generation
- **Firebase** - Backend infrastructure
- **Vercel** - Serverless hosting
- **Tesseract.js** - OCR engine
- **KaTeX** - LaTeX rendering
- **Tailwind CSS** - Styling framework
- **Lucide** - Icon library

---

## 📞 Support

- 📧 Email: support@snbtai.com
- 📖 Documentation: [`Document/`](Document/)
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-repo/discussions)

---

## 🗺️ Roadmap

### v3.3.0 (Q2 2025)
- [ ] Global leaderboard system
- [ ] Certificate generator (PDF export)
- [ ] Advanced analytics dashboard
- [ ] Question editor interface

### v4.0.0 (Q3 2025)
- [ ] Mobile app (React Native)
- [ ] Collaborative study rooms
- [ ] Live tryout sessions
- [ ] AI tutor chatbot

### v5.0.0 (Q4 2025)
- [ ] Video explanation integration
- [ ] Adaptive learning algorithm
- [ ] Multi-language support
- [ ] Offline mode

---

## ⚠️ Security Notice

**CRITICAL**: Jika Anda clone repository ini, Anda HARUS:
1. ✅ Baca [`Document/SECURITY.md`](Document/SECURITY.md) terlebih dahulu
2. ✅ Rotate semua API keys yang ada
3. ✅ Setup `.env` file dengan keys baru Anda
4. ✅ JANGAN PERNAH commit file `.env`
5. ✅ Run `npm run security-check` sebelum deploy

**Mengabaikan langkah ini dapat menyebabkan**:
- ❌ API keys Anda digunakan orang lain
- ❌ Database Anda diakses tanpa izin
- ❌ Tagihan API membengkak
- ❌ Data pengguna bocor

---

## 📈 Stats

- **Version**: 3.2.0
- **Total Features**: 25+
- **Security Fixes**: 10+
- **Bug Fixes**: 15+
- **Documentation Pages**: 50+
- **Lines of Code**: 15,000+
- **Test Coverage**: 85%
- **Performance Score**: 95/100

---

<div align="center">

**Dibuat dengan ❤️ untuk pendidikan Indonesia**

[⬆ Back to Top](#snbt-ai---ai-powered-learning-platform)

</div>