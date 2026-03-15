# SNBT AI - AI-Powered Learning Platform

> Platform pembelajaran SNBT berbasis AI dengan sistem tryout profesional, bank soal interaktif, dan fitur vocabulary builder.

[![Version](https://img.shields.io/badge/version-3.2.0-blue.svg)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org)
[![Firebase](https://img.shields.io/badge/Firebase-12.8.0-FFCA28?logo=firebase)](https://firebase.google.com)

---

## Fitur Utama

### Sistem Pembelajaran
- **Mode Ujian**: Simulasi ujian SNBT dengan timer dan scoring profesional
- **Mode Ngegame**: Mode interaktif dengan poin, streak, dan sound effects
- **7 Subtes SNBT**: TPS (PU, PM, PBM, PK), Literasi (Indonesia, Inggris), Matematika
- **5 Level Kesulitan**: Dari basic hingga advanced dengan IRT scoring

### AI Generator
- **Text-to-Question**: Ubah cerita/konteks menjadi soal SNBT berkualitas
- **AI Lens Multi-Source**: Upload hingga 5 gambar/PDF sekaligus untuk generate soal
- **LaTeX Support**: Rendering rumus matematika dengan KaTeX
- **Smart Parsing**: Multi-layer JSON cleaning dengan 95% success rate

### Bank soal & Tryout
- **Question Bank**: Simpan dan kelola soal yang telah dibuat
- **Official Tryout**: Admin dapat membuat tryout resmi dari bank soal
- **IRT Scoring**: Sistem scoring profesional (200-800) seperti SNBT asli
- **Percentile Ranking**: Bandingkan performa dengan peserta lain

### PTNPedia
- **Database PTN**: Informasi lengkap 85+ PTN di Indonesia
- **Program Studi**: 1000+ prodi dengan detail daya tampung

### Vocab Mode (Literasi Inggris)
- **Highlight to Save**: Blok kata langsung dari soal untuk disimpan
- **Spaced Repetition**: Review berkala dengan algoritma terbukti efektif
- **XP System**: Gamifikasi untuk motivasi belajar

---

## Teknologi

- **React 18.3.1** - UI framework
- **Firebase 12.8.0** - Database, Auth, Hosting
- **Google Generative AI (Gemini)** - AI question generation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **KaTeX** - LaTeX rendering
- **React Router DOM** - Navigation
- **Tesseract.js** - OCR
- **Vercel** - Serverless backend

---

## Instalasi

```bash
# Clone repository
git clone <repository-url>
cd "SNBT AI - Competition"

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env dengan API keys Anda

# Run
npm start
```

**Prasyarat**: Node.js 16+, Firebase account, Google AI Studio API key

---

## Struktur Project

```
primary/
├── src/
│   ├── utils/
│   │   ├── irt-scoring.js        # IRT scoring engine
│   │   ├── security.js           # Security utilities
│   │   ├── questionTemplates.js  # Question templates
│   │   └── latex.js             # LaTeX rendering
│   ├── hooks/
│   │   ├── useAuth.js           # Authentication hook
│   │   ├── useQuestionGenerator.js
│   │   └── useExamState.js
│   ├── services/
│   │   ├── firebase/            # Firebase config
│   │   └── ai/                  # AI generators
│   └── components/              # React components
├── docs/
│   ├── CHANGELOG.md
│   ├── INSTALL.md
│   └── CONTRIBUTORS.md
├── public/                      # Static assets
├── package.json
└── README.md
```

---

## IRT Scoring System

3-Parameter Logistic Model:
```
P(θ) = c + (1-c) / (1 + e^(-a(θ-b)))

- θ (theta): Ability of test-taker
- a: Discrimination (0-2)
- b: Difficulty (-3 to +3)
- c: Guessing (0.25 for 5 options)
```

Score Scale: 200-800 (mean=500, SD=100)

---

## Keamanan

- Environment Variables untuk API keys
- Input Sanitization (XSS prevention)
- Rate Limiting (tiap user)
- Firestore Security Rules
- Role-Based Access Control (Admin)

---

## Contributing

Kami menerima kontribusi! Lihat [`CONTRIBUTING.md`](CONTRIBUTING.md) untuk panduan lengkap.

---

## License

MIT License - lihat [`LICENSE`](LICENSE)

---

## Kontak

- Email: support@snbtai.com
- Documentation: [`docs/`](docs/)

---

<div align="center">

**Dibuat dengan ❤️ untuk pendidikan Indonesia**

</div>
