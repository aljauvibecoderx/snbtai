# Security Policy

## Versi yang Didukung

Berikut adalah versi SNBT AI yang saat ini menerima pembaruan keamanan:

| Versi | Didukung |
|---|---|
| 3.x (latest) | ✅ Ya |
| 2.x | ⚠️ Patch kritis saja |
| 1.x | ❌ Tidak |

---

## Melaporkan Kerentanan (Responsible Disclosure)

**Jangan** laporkan kerentanan keamanan melalui GitHub Issues publik, Pull Request, atau media sosial — hal ini dapat mengekspos pengguna lain sebelum patch tersedia.

### Cara Melaporkan

Kirim laporan kerentanan secara **privat** melalui salah satu kanal berikut:

| Kanal | Detail |
|---|---|
| 📧 **Email** | security@snbtai.com |
| 🔒 **GitHub Security Advisory** | [Report a Vulnerability](../../security/advisories/new) |

### Yang Harus Disertakan dalam Laporan

Untuk mempercepat proses penanganan, sertakan informasi berikut:

1. **Deskripsi** — Jelaskan jenis kerentanan (XSS, IDOR, API abuse, dll.)
2. **Dampak** — Apa yang bisa dilakukan penyerang? Data apa yang terekspos?
3. **Langkah Reproduksi** — Step-by-step yang jelas dan dapat diulangi
4. **Bukti (PoC)** — Screenshot, video, atau payload yang digunakan
5. **Environment** — Browser, OS, versi aplikasi
6. **Saran Perbaikan** (opsional) — Jika kamu punya rekomendasi

### Contoh Format Laporan

```
Judul: IDOR pada endpoint /api/questions/{id}

Dampak: Pengguna A dapat mengakses soal privat milik Pengguna B
tanpa autentikasi.

Langkah Reproduksi:
1. Login sebagai Pengguna A
2. Akses GET /api/questions/QUESTION_ID_PENGGUNA_B
3. Response mengembalikan data soal penuh

Bukti: [screenshot/curl output]

Saran: Tambahkan validasi ownership di Firestore Security Rules
untuk koleksi `questions`.
```

---

## Timeline Respons

Kami berkomitmen untuk:

| Tahap | Target Waktu |
|---|---|
| Konfirmasi penerimaan laporan | **1 × 24 jam** |
| Penilaian awal (valid/tidak valid) | **3 hari kerja** |
| Update status & estimasi patch | **7 hari kerja** |
| Rilis patch (severity tinggi) | **14 hari kalender** |
| Rilis patch (severity rendah) | **30 hari kalender** |

---

## Klasifikasi Severity

| Level | Deskripsi | Contoh |
|---|---|---|
| 🔴 **Kritis** | Data loss massal atau akses tidak sah ke seluruh data | RCE, SQL Injection, bypass auth |
| 🟠 **Tinggi** | Akses tidak sah ke data pengguna lain | IDOR, privilege escalation |
| 🟡 **Sedang** | Eksploitasi terbatas, butuh interaksi user | Stored XSS, CSRF |
| 🟢 **Rendah** | Dampak minimal, informasi saja | Verbose error, open redirect |

---

## Proteksi yang Sudah Diterapkan

Sebagai transparansi, berikut adalah lapisan keamanan yang sudah kami implementasikan:

- **Firebase Authentication** — Google OAuth, token-based session
- **Firestore Security Rules** — Ownership-based access control per koleksi
- **Input Sanitization** — `sanitizeContext()` untuk mencegah XSS & injection
- **Rate Limiting** — Per-user daily quota + per-minute throttle (3 req/menit)
- **Role-Based Access Control** — Admin panel dengan verifikasi dua lapis
- **Environment Variables** — Semua secret disimpan di `.env`, tidak pernah di-commit
- **Pre-build Security Check** — `npm run security-check` memvalidasi sebelum build
- **Admin Audit Logs** — Setiap aksi admin tercatat di Firestore

---

## Program Bug Bounty

Saat ini kami **belum memiliki program bug bounty formal**. Namun, peneliti yang melaporkan kerentanan valid dan mengikuti responsible disclosure akan:

- ✅ Mendapat kredit di **Security Hall of Fame** kami (jika bersedia)
- ✅ Mendapat akun **Pro gratis** selama 6 bulan sebagai bentuk apresiasi
- ✅ Mendapat respons privat dan update progres penanganan

---

## Pengungkapan Publik (Coordinated Disclosure)

Setelah patch dirilis, kami akan mempublikasikan **Security Advisory** di GitHub dengan detail:
- Versi yang terdampak
- Deskripsi kerentanan (tanpa PoC lengkap)
- Kredit untuk pelapor (jika bersedia)
- Langkah migrasi untuk pengguna

Kami meminta peneliti untuk **tidak mempublikasikan detail teknis selama minimal 90 hari** setelah patch dirilis, agar pengguna memiliki waktu untuk memperbarui.

---

## Kontak

Untuk pertanyaan non-security, gunakan kanal berikut:
- 📧 **General**: support@snbtai.com
- 🐛 **Bug (non-security)**: GitHub Issues
- 💬 **Diskusi**: GitHub Discussions
