# 🔐 Panduan Keamanan SNBT AI

## 📌 Untuk Siapa Panduan Ini?

✅ **Developer Pemula** - Baru belajar coding  
✅ **Developer Berpengalaman** - Ingin deploy dengan aman  
✅ **Tim IT** - Mengelola keamanan aplikasi  
✅ **Pemilik Proyek** - Memahami risiko keamanan  

---

## 🚨 PERINGATAN PENTING

> ⚠️ **BAHAYA!** Repository ini pernah memiliki API keys yang ter-expose ke publik.  
> Jika Anda clone repository ini, **WAJIB** ikuti panduan di bawah!

### Apa yang Terjadi Jika Diabaikan?

❌ Orang lain bisa pakai API key Anda (gratis untuk mereka, Anda yang bayar!)  
❌ Database Anda bisa diakses/dihapus oleh orang lain  
❌ Tagihan API bisa membengkak tanpa Anda sadari  
❌ Data pengguna bisa bocor  

---

## 📚 Daftar Isi

1. [Setup Awal (Wajib)](#-setup-awal-wajib)
2. [Cara Mendapatkan API Key Baru](#-cara-mendapatkan-api-key-baru)
3. [Fitur Keamanan yang Sudah Ada](#-fitur-keamanan-yang-sudah-ada)
4. [Aturan Penting](#-aturan-penting)
5. [Troubleshooting](#-troubleshooting)
6. [Maintenance Rutin](#-maintenance-rutin)

---

## 🎯 Setup Awal (WAJIB)

### Langkah 1: Persiapan File Environment

```bash
# Buka terminal/command prompt di folder project
cd "SNBT AI Deploy Up"

# Copy file template
copy .env.example .env
```

**Penjelasan:**  
📄 `.env` = File rahasia yang menyimpan API keys  
📄 `.env.example` = Template/contoh (aman untuk di-share)

### Langkah 2: Isi API Keys Baru

**PENTING:** Jangan gunakan API keys yang ada di file! Buat yang baru!

1. Buka file `.env` dengan text editor (Notepad, VS Code, dll)
2. Ganti semua nilai `your_*` dengan API key baru Anda
3. Simpan file

**Contoh:**
```env
# ❌ JANGAN seperti ini (masih placeholder)
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here

# ✅ HARUS seperti ini (API key asli Anda)
REACT_APP_FIREBASE_API_KEY=AIzaSyC_NEW_KEY_YANG_ANDA_BUAT_SENDIRI
```

### Langkah 3: Verifikasi Keamanan

```bash
# Jalankan security check
npm run security-check
```

**Output yang diharapkan:**
```
✅ SECURITY CHECK PASSED!
All security measures are in place.
```

**Jika ada error:**
- Baca pesan error dengan teliti
- Perbaiki sesuai instruksi
- Jalankan lagi `npm run security-check`

### Langkah 4: Jalankan Aplikasi

```bash
# Install dependencies (hanya sekali)
npm install

# Jalankan development server
npm start
```

Aplikasi akan terbuka di `http://localhost:8000`

---

## 🔑 Cara Mendapatkan API Key Baru

### 1️⃣ Firebase (Database & Authentication)

**Gratis:** 50,000 reads/day, 20,000 writes/day

#### Langkah-langkah:

1. **Buka Firebase Console**  
   🌐 https://console.firebase.google.com

2. **Login dengan Google Account**  
   📧 Gunakan email pribadi/organisasi

3. **Buat Project Baru**  
   ➕ Klik "Add project"  
   📝 Nama: "SNBT AI" (atau nama lain)  
   ⚙️ Ikuti wizard setup (3-4 langkah)

4. **Tambah Web App**  
   🌐 Di dashboard, klik icon `</>` (Web)  
   📝 Nama app: "SNBT AI Web"  
   ✅ Centang "Also set up Firebase Hosting" (opsional)

5. **Copy Configuration**  
   📋 Akan muncul kode seperti ini:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "...",
     projectId: "...",
     // dst
   };
   ```

6. **Paste ke .env**  
   ```env
   REACT_APP_FIREBASE_API_KEY=AIzaSy...
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
   REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
   REACT_APP_FIREBASE_MEASUREMENT_ID=G-ABC123
   ```

7. **Setup Firestore Database**  
   🗄️ Sidebar → Firestore Database → Create database  
   🔒 Mode: "Production mode" (lebih aman)  
   🌍 Location: asia-southeast1 (Singapura - terdekat)

8. **Deploy Security Rules**  
   ```bash
   # Install Firebase CLI (sekali saja)
   npm install -g firebase-tools
   
   # Login
   firebase login
   
   # Deploy rules
   firebase deploy --only firestore:rules
   ```

---

### 2️⃣ Google AI Studio / Gemini (AI Generator)

**Gratis:** 15 requests/minute, 1,500 requests/day

#### Langkah-langkah:

1. **Buka Google AI Studio**  
   🌐 https://makersuite.google.com/app/apikey

2. **Login dengan Google Account**  
   📧 Sama dengan Firebase (recommended)

3. **Create API Key**  
   ➕ Klik "Create API Key"  
   📝 Pilih project Firebase yang tadi dibuat  
   ✅ Klik "Create API key in existing project"

4. **Buat 3 Keys (untuk rotasi)**  
   🔄 Ulangi langkah 3 sebanyak 3x  
   📋 Copy semua keys

5. **Paste ke .env**  
   ```env
   REACT_APP_GEMINI_KEY_1=AIzaSyD...
   REACT_APP_GEMINI_KEY_2=AIzaSyB...
   REACT_APP_GEMINI_KEY_3=AIzaSyA...
   ```

**💡 Tips:**  
- Buat 3 keys agar jika 1 limit, otomatis switch ke key lain
- Jangan share keys ke siapapun
- Rotate (ganti) setiap 3 bulan

---

### 3️⃣ HuggingFace (AI Alternatif)

**Gratis:** 1,000 requests/day

#### Langkah-langkah:

1. **Buka HuggingFace**  
   🌐 https://huggingface.co

2. **Sign Up / Login**  
   📧 Bisa pakai email atau GitHub

3. **Buka Settings → Access Tokens**  
   🌐 https://huggingface.co/settings/tokens

4. **Create New Token**  
   ➕ Klik "New token"  
   📝 Name: "SNBT AI"  
   🔒 Role: "Read" (cukup untuk inference)  
   ✅ Klik "Generate token"

5. **Copy Token**  
   📋 Token format: `hf_...` (34 karakter)

6. **Paste ke .env**  
   ```env
   REACT_APP_HF_API_KEY=hf_...
   ```

---

## 🛡️ Fitur Keamanan yang Sudah Ada

### ✅ 1. Environment Variables Protection

**Apa itu?**  
API keys disimpan di file `.env` yang tidak di-upload ke GitHub.

**Cara kerja:**
```javascript
// ❌ DULU (bahaya)
const apiKey = "AIzaSy...";

// ✅ SEKARANG (aman)
const apiKey = process.env.REACT_APP_GEMINI_KEY_1;
```

**File yang dilindungi:**
- ✅ `.env` → Tidak di-commit ke Git
- ✅ `.env.example` → Template (aman di-share)

---

### ✅ 2. Input Sanitization (Pembersihan Input)

**Apa itu?**  
Membersihkan input user dari kode berbahaya.

**Contoh serangan yang dicegah:**
```javascript
// User input jahat
<script>alert('Hacked!')</script>

// Setelah sanitasi
// Script dihapus, hanya text biasa
```

**Fungsi yang digunakan:**
- `sanitizeInput()` - Hapus script/iframe
- `sanitizeContext()` - Validasi panjang + sanitasi

---

### ✅ 3. Rate Limiting (Pembatasan Request)

**Apa itu?**  
Membatasi berapa kali user bisa generate soal.

**Limit yang diterapkan:**
- 🔒 **Tanpa Login:** 1 soal/hari
- 🔓 **Dengan Login:** 19 soal/hari
- ⚡ **Per Menit:** 3 request/menit (semua user)

**Kenapa penting?**
- Mencegah spam
- Menghemat quota API
- Mencegah abuse

---

### ✅ 4. Firestore Security Rules

**Apa itu?**  
Aturan database yang mengontrol siapa bisa baca/tulis data.

**Aturan yang diterapkan:**

| Collection | Read | Write |
|------------|------|-------|
| `users` | ✅ Owner only | ✅ Owner only |
| `question_sets` | ✅ Public OR Owner | ✅ Owner only |
| `questions` | ✅ Public set OR Owner | ✅ Owner only |
| `attempts` | ✅ Owner only | ✅ Owner only |
| `posts` | ✅ Everyone | ✅ Verified users |

**Contoh:**
```javascript
// User A tidak bisa hapus soal User B
// User A hanya bisa lihat soal public atau soal sendiri
```

---

### ✅ 5. Automated Security Check

**Apa itu?**  
Script otomatis yang cek keamanan sebelum deploy.

**Yang dicek:**
- ✅ File `.env` ada?
- ✅ `.env` di `.gitignore`?
- ✅ Tidak ada hardcoded API keys?
- ✅ File `security.js` ada?
- ✅ Firestore rules punya fungsi keamanan?

**Cara pakai:**
```bash
npm run security-check
```

---

## ⚠️ Aturan Penting

### ❌ JANGAN PERNAH:

1. **Commit file `.env`**
   ```bash
   # Cek dulu sebelum commit
   git status
   
   # Jika .env muncul, JANGAN commit!
   # Pastikan .env ada di .gitignore
   ```

2. **Hardcode API keys di code**
   ```javascript
   // ❌ SALAH
   const key = "AIzaSy...";
   
   // ✅ BENAR
   const key = process.env.REACT_APP_GEMINI_KEY_1;
   ```

3. **Share API keys via chat/email**
   - Jangan kirim via WhatsApp
   - Jangan kirim via Email
   - Jangan screenshot dan share

4. **Log API keys di console**
   ```javascript
   // ❌ SALAH
   console.log(apiKey);
   
   // ✅ BENAR
   console.log('API key loaded:', apiKey ? '✅' : '❌');
   ```

5. **Gunakan API keys orang lain**
   - Buat sendiri (gratis kok!)
   - Jangan pakai yang di tutorial

---

### ✅ SELALU LAKUKAN:

1. **Run security check sebelum deploy**
   ```bash
   npm run security-check
   npm run build
   ```

2. **Rotate API keys setiap 3 bulan**
   - Buat keys baru
   - Update `.env`
   - Hapus keys lama

3. **Monitor API usage**
   - Firebase Console → Usage
   - Google AI Studio → Quota
   - HuggingFace → Usage

4. **Update dependencies rutin**
   ```bash
   npm audit
   npm audit fix
   npm update
   ```

5. **Backup `.env` di tempat aman**
   - Password manager (1Password, Bitwarden)
   - Encrypted USB
   - JANGAN di cloud public

---

## 🔧 Troubleshooting

### ❓ Error: "Firebase: Error (auth/invalid-api-key)"

**Penyebab:**  
API key Firebase salah atau tidak ter-load.

**Solusi:**

1. **Cek file `.env` ada dan benar**
   ```bash
   # Windows
   type .env
   
   # Mac/Linux
   cat .env
   ```

2. **Restart development server**
   ```bash
   # Stop server (Ctrl+C)
   # Start lagi
   npm start
   ```

3. **Cek tidak ada typo**
   ```env
   # ❌ SALAH (typo)
   REACT_APP_FIREBASE_API_KEy=...
   
   # ✅ BENAR
   REACT_APP_FIREBASE_API_KEY=...
   ```

4. **Pastikan tidak ada spasi**
   ```env
   # ❌ SALAH (ada spasi)
   REACT_APP_FIREBASE_API_KEY = AIzaSy...
   
   # ✅ BENAR (tidak ada spasi)
   REACT_APP_FIREBASE_API_KEY=AIzaSy...
   ```

---

### ❓ Error: "Quota exceeded" / "Rate limit"

**Penyebab:**  
Terlalu banyak request ke API.

**Solusi:**

1. **Tunggu beberapa menit**  
   Rate limit biasanya reset setiap menit/jam

2. **Cek quota di console**
   - Firebase: https://console.firebase.google.com
   - Gemini: https://makersuite.google.com

3. **Upgrade plan (jika perlu)**  
   Atau buat project baru dengan email lain

---

### ❓ Security check failed

**Penyebab:**  
Ada masalah keamanan yang terdeteksi.

**Solusi:**

1. **Baca output error dengan teliti**
   ```bash
   npm run security-check
   # Baca semua pesan merah (❌)
   ```

2. **Perbaiki sesuai instruksi**
   - Jika `.env` tidak ada → buat dari `.env.example`
   - Jika ada hardcoded key → ganti dengan `process.env.*`
   - Jika `.env` tidak di gitignore → tambahkan

3. **Test lagi**
   ```bash
   npm run security-check
   ```

---

### ❓ Git mau commit file `.env`

**Penyebab:**  
`.env` tidak ada di `.gitignore`.

**Solusi:**

1. **Cek .gitignore**
   ```bash
   # Windows
   type .gitignore | findstr .env
   
   # Mac/Linux
   cat .gitignore | grep .env
   ```

2. **Jika tidak ada, tambahkan**
   ```bash
   echo .env >> .gitignore
   ```

3. **Jika sudah terlanjur commit**
   ```bash
   # Remove from git (file tetap ada di local)
   git rm --cached .env
   git commit -m "Remove .env from git"
   
   # Pastikan .env di .gitignore
   echo .env >> .gitignore
   git add .gitignore
   git commit -m "Add .env to gitignore"
   ```

---

## 🔄 Maintenance Rutin

### 📅 Setiap Hari (Jika Aktif Development)

- [ ] Monitor error logs
- [ ] Cek API usage tidak abnormal

### 📅 Setiap Minggu

- [ ] Run `npm audit` untuk cek vulnerabilities
- [ ] Review Firestore usage
- [ ] Backup database (jika ada data penting)

### 📅 Setiap Bulan

- [ ] Update dependencies: `npm update`
- [ ] Review security rules
- [ ] Cek API quotas

### 📅 Setiap 3 Bulan

- [ ] **Rotate semua API keys**
- [ ] Full security audit
- [ ] Review access logs

### 📅 Setiap Tahun

- [ ] Penetration testing (jika production)
- [ ] Update security policies
- [ ] Review dan update dokumentasi

---

## 📞 Butuh Bantuan?

### 📚 Dokumentasi Lengkap

- 📄 `SECURITY.md` - Dokumentasi keamanan lengkap
- 📄 `SECURITY_AUDIT_REPORT.md` - Hasil audit keamanan
- 📄 `SECURITY_QUICK_REF.md` - Quick reference
- 📄 `README.md` - Dokumentasi umum

### 🔍 Resources

- 🌐 [Firebase Docs](https://firebase.google.com/docs)
- 🌐 [Google AI Studio](https://ai.google.dev)
- 🌐 [React Security](https://reactjs.org/docs/dom-elements.html)
- 🌐 [OWASP Top 10](https://owasp.org/www-project-top-ten/)

### 🚨 Melaporkan Masalah Keamanan

**Jika menemukan celah keamanan:**

1. ❌ **JANGAN** buat public issue di GitHub
2. ❌ **JANGAN** share di social media
3. ✅ **LAKUKAN** contact tim security secara private
4. ✅ **LAKUKAN** dokumentasikan detail masalah

---

## ✅ Checklist Sebelum Deploy

```bash
# 1. Security check
[ ] npm run security-check → PASSED

# 2. Git check
[ ] git status → .env TIDAK muncul
[ ] .gitignore → .env ADA di list

# 3. Environment check
[ ] .env → Semua keys BARU (bukan yang exposed)
[ ] .env → Tidak ada placeholder (your_*)

# 4. Code check
[ ] Tidak ada console.log dengan sensitive data
[ ] Tidak ada hardcoded API keys
[ ] Tidak ada TODO yang critical

# 5. Firebase check
[ ] Firestore rules deployed
[ ] Authentication enabled
[ ] Security rules tested

# 6. Testing
[ ] npm test → PASSED
[ ] Manual testing → OK
[ ] Error handling → OK

# 7. Build
[ ] npm run build → SUCCESS
[ ] Build size reasonable (<5MB)

# 8. Final
[ ] Backup .env ke password manager
[ ] Dokumentasi updated
[ ] Team notified
```

---

## 🎓 Kesimpulan

### Yang Sudah Diperbaiki ✅

- ✅ API keys dipindah ke environment variables
- ✅ Input sanitization implemented
- ✅ Rate limiting added
- ✅ Firestore security rules strengthened
- ✅ Automated security check
- ✅ Comprehensive documentation

### Yang Harus Anda Lakukan 🎯

1. **Setup `.env` dengan API keys BARU**
2. **Rotate semua API keys yang exposed**
3. **Deploy Firestore rules**
4. **Run security check sebelum deploy**
5. **Monitor API usage secara rutin**

### Ingat! 🧠

> **Keamanan bukan tugas sekali jalan, tapi proses berkelanjutan!**

- 🔒 Selalu protect API keys
- 🔄 Rotate keys secara rutin
- 📊 Monitor usage
- 🛡️ Update dependencies
- 📚 Stay informed tentang security best practices

---

**Dibuat dengan ❤️ untuk keamanan yang lebih baik**

*Last updated: 2024*
