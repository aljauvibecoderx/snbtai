# Installation Guide

Panduan lengkap instalasi SNBT AI untuk development dan production.

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | 16+ | LTS recommended |
| npm | 8+ | Comes with Node.js |
| Git | 2.0+ | For version control |
| Firebase Account | - | Free tier sufficient |
| Google AI Studio | - | For Gemini API |

---

## Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-repo/SNBT-AI.git
cd "SNBT AI - Competition"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` file dengan konfigurasi Anda:

```env
# Firebase Config
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
REACT_APP_FIREBASE_MEASUREMENT_ID=G-ABC123

# Google AI (Gemini)
REACT_APP_GEMINI_KEY_1=your_gemini_key
REACT_APP_GEMINI_KEY_2=your_gemini_key_2
REACT_APP_GEMINI_KEY_3=your_gemini_key_3

# Backend (Optional)
REACT_APP_BACKEND_URL=http://localhost:3001
```

### 4. Setup Firebase

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Buat project baru
3. **Authentication**: Enable Google Sign-in
4. **Firestore**: Create database (start in test mode)
5. **Copy config** ke `.env`

### 5. Setup Google AI Studio

1. Buka [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API Key
3. **Disarankan**: Buat 3 keys untuk rotation
4. Tambahkan ke `.env`

### 6. Run Development Server

```bash
npm start
```

Aplikasi akan berjalan di `http://localhost:8000`

---

## Backend Setup (PTNPedia)

### Option 1: Vercel (Recommended)

```bash
cd vercel-backend
npm install
vercel --prod
```

Copy URL output (contoh: `https://your-app.vercel.app`) ke:
```env
REACT_APP_BACKEND_URL=https://your-app.vercel.app
```

### Option 2: Local Development

```bash
cd vercel-backend
npm install
npm start
```

Backend akan berjalan di `http://localhost:3001`

---

## Production Build

### 1. Security Check

```bash
npm run security-check
```

### 2. Build

```bash
npm run build
```

### 3. Deploy

**Firebase Hosting:**
```bash
firebase deploy --only hosting
```

**Vercel:**
```bash
cd vercel-backend
vercel --prod
```

---

## Troubleshooting

### Error: Firebase auth/api-key-not-valid
- Cek `.env` file ada dan valid
- Restart dev server: `Ctrl+C` then `npm start`

### Error:Quota exceeded
- Tunggu beberapa menit
- Gunakan API key alternatif (key_2, key_3)
- Cek quota di Google AI Console

### Error: Module not found
- Hapus `node_modules` dan `package-lock.json`
- Jalankan `npm install` ulang

---

## Next Steps

Setelah instalasi:
1. [Konfigurasi Firestore Rules](firestore.rules)
2. [Setup Admin Panel](docs/ADMIN_PANEL_BLUEPRINT.md)
3. [Baca Security Guide](SECURITY.md)

---

## Support

- Email: support@snbtai.com
- Issues: GitHub Issues
