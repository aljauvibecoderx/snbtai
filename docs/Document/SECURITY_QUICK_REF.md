# ⚡ Panduan Cepat Keamanan SNBT AI

> 📌 **Quick Reference** - Untuk akses cepat saat development

---

## 🚀 Setup 5 Menit

```bash
# 1️⃣ Copy template
copy .env.example .env

# 2️⃣ Edit .env (ganti dengan API keys BARU Anda)
notepad .env

# 3️⃣ Cek keamanan
npm run security-check

# 4️⃣ Install & jalankan
npm install
npm start
```

✅ **Done!** Aplikasi jalan di `http://localhost:8000`

---

## 🔑 Dapatkan API Keys (Gratis)

### Firebase 🔥
```
🌐 https://console.firebase.google.com
➕ Add project → Buat project baru
🌐 Add app → Pilih Web (</>)
📋 Copy config → Paste ke .env
```

### Gemini 🧠
```
🌐 https://makersuite.google.com/app/apikey
➕ Create API Key (buat 3x untuk rotasi)
📋 Copy keys → Paste ke .env
```

### HuggingFace 🤗
```
🌐 https://huggingface.co/settings/tokens
➕ New token → Name: "SNBT AI", Role: Read
📋 Copy token → Paste ke .env
```

---

## ❌ Jangan Lakukan Ini!

```javascript
// ❌ Hardcode API key
const key = "AIzaSy...";

// ❌ Commit .env
git add .env  // BAHAYA!

// ❌ Log sensitive data
console.log(apiKey);

// ❌ Share keys via chat
"Ini API key ku: AIzaSy..."  // JANGAN!
```

---

## ✅ Selalu Lakukan Ini!

```javascript
// ✅ Gunakan environment variable
const key = process.env.REACT_APP_GEMINI_KEY_1;

// ✅ Cek .env tidak ter-track
git status  // .env tidak boleh muncul

// ✅ Log dengan aman
console.log('Key loaded:', key ? '✅' : '❌');

// ✅ Security check sebelum deploy
npm run security-check
```

---

## 🔧 Troubleshooting Cepat

### Error: "invalid-api-key"
```bash
# Restart server
Ctrl+C
npm start

# Cek .env ada dan benar
type .env
```

### Error: "Quota exceeded"
```bash
# Tunggu 1 menit, lalu coba lagi
# Atau cek quota di console provider
```

### Security check failed
```bash
# Baca error message
npm run security-check

# Perbaiki sesuai instruksi
# Test lagi
```

### Git mau commit .env
```bash
# Remove dari git
git rm --cached .env

# Pastikan di .gitignore
echo .env >> .gitignore
```

---

## 📊 Limit Gratis

| Service | Limit Harian | Limit Per Menit |
|---------|--------------|------------------|
| Firebase Firestore | 50K reads, 20K writes | - |
| Gemini API | 1,500 requests | 15 requests |
| HuggingFace | 1,000 requests | - |
| **App (No Login)** | **1 soal** | **3 requests** |
| **App (Login)** | **19 soal** | **3 requests** |

---

## 🔒 File Penting

```
✅ .env              → API keys (JANGAN commit!)
✅ .env.example      → Template (aman di-share)
✅ .gitignore        → Pastikan .env ada di sini
✅ security-check.js → Script validasi keamanan
✅ src/security.js   → Fungsi sanitasi & rate limit
✅ firestore.rules   → Database security rules
```

---

## 📝 Commands Penting

```bash
# Development
npm start                 # Jalankan app
npm run security-check    # Cek keamanan

# Security
npm audit                 # Cek vulnerabilities
npm audit fix             # Fix vulnerabilities

# Deployment
npm run build             # Build production (auto security check)
firebase deploy           # Deploy ke Firebase Hosting

# Git
git status                # Cek file yang akan di-commit
git add .                 # HATI-HATI! Cek .env tidak ikut
```

---

## 📅 Maintenance Schedule

- ✅ **Harian:** Monitor errors & API usage
- ✅ **Mingguan:** `npm audit`
- ✅ **Bulanan:** `npm update` + review security
- ✅ **3 Bulan:** **Rotate semua API keys**
- ✅ **Tahunan:** Full security audit

---

## 🎯 Checklist Deploy

```bash
[ ] npm run security-check → PASSED
[ ] git status → .env TIDAK muncul
[ ] .env → Keys BARU (bukan yang exposed)
[ ] Firestore rules deployed
[ ] npm test → PASSED
[ ] npm run build → SUCCESS
[ ] Backup .env ke password manager
```

---

## 📞 Butuh Bantuan?

📄 **Dokumentasi Lengkap:** `SECURITY.md`  
📄 **Audit Report:** `SECURITY_AUDIT_REPORT.md`  
📄 **README:** `README.md`  

🌐 **Firebase Docs:** https://firebase.google.com/docs  
🌐 **Google AI:** https://ai.google.dev  

---

## ⚡ Pro Tips

💡 Buat 3 Gemini keys untuk auto-rotation  
💡 Gunakan password manager untuk backup .env  
💡 Set reminder rotate keys setiap 3 bulan  
💡 Monitor Firebase usage via email alerts  
💡 Test di incognito untuk simulasi user baru  

---

**🛡️ Stay Safe, Code Secure!**
