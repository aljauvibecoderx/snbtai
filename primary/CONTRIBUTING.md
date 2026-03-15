# Contributing to SNBT AI

Terima kasih sudah tertarik untuk berkontribusi! Panduan ini memastikan semua kontribusi konsisten, dapat di-review dengan cepat, dan tidak merusak kestabilan production.

---

## 📋 Table of Contents

- [Prasyarat](#prasyarat)
- [Branching Strategy](#branching-strategy)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Code Standards](#code-standards)
- [Larangan](#larangan)

---

## Prasyarat

Pastikan kamu sudah memiliki:

- **Node.js** v16+ dan **npm** v8+
- **Git** terkonfigurasi dengan nama dan email yang benar
- Akses ke Firebase project (minta ke maintainer)
- File `.env` yang sudah diisi (lihat `.env.example`)

```bash
git clone <repo-url>
npm install
cp .env.example .env   # isi API keys
npm start
```

---

## Branching Strategy

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

### Aturan Branch

- ❌ **Jangan push langsung ke `main` atau `develop`**
- ✅ Selalu buat branch baru dari `develop` yang sudah up-to-date
- ✅ Satu branch = satu concern (jangan campur fitur dan bug fix)
- ✅ Nama branch pakai kebab-case: `feature/ai-lens-ocr`, bukan `feature/AILens`

```bash
# Cara membuat branch yang benar
git checkout develop
git pull origin develop
git checkout -b feature/nama-fitur-kamu
```

---

## Commit Convention

Kami menggunakan **Conventional Commits** agar changelog bisa di-generate otomatis.

### Format

```
<type>(<scope>): <deskripsi singkat>

[body opsional — jelaskan "mengapa", bukan "apa"]

[footer opsional — referensi issue: Closes #123]
```

### Tipe Commit

| Tipe | Kapan Dipakai |
|---|---|
| `feat` | Fitur baru untuk end user |
| `fix` | Bug fix untuk end user |
| `docs` | Perubahan dokumentasi saja |
| `style` | Formatting, semicolon — tidak ada perubahan logika |
| `refactor` | Refactor kode — bukan fitur baru, bukan bug fix |
| `perf` | Perubahan yang meningkatkan performa |
| `test` | Menambah atau memperbaiki test |
| `chore` | Update build process, dependency, config |
| `revert` | Revert commit sebelumnya |

### Scope (Opsional)

Gunakan scope untuk memperjelas bagian mana yang berubah:
`landing`, `dashboard`, `ptnpedia`, `vocab`, `auth`, `scoring`, `ai`, `tryout`, `firebase`, `ui`

### Contoh Commit yang Benar

```bash
feat(ai): tambah AI Lens untuk upload gambar ke soal SNBT
fix(scoring): perbaiki kalkulasi IRT saat semua jawaban salah
docs(readme): update panduan instalasi Firebase
refactor(ptnpedia): pisah komponen PTNCard dan PTNDetail
perf(landing): lazy load bento grid section
chore: update lucide-react ke versi 0.470.0
```

### Contoh Commit yang Salah ❌

```bash
update stuff
fixed bug
WIP
asdfjkl
```

---

## Pull Request Process

1. **Pastikan branch kamu up-to-date** dengan `develop` sebelum membuka PR
2. **Jalankan security check** sebelum push: `npm run security-check`
3. **Isi PR template** dengan lengkap:
   - Deskripsi singkat perubahan
   - Screenshot/GIF jika ada perubahan UI
   - Checklist: sudah test di mobile, sudah test di desktop
4. **Assign reviewer** minimal 1 orang (maintainer utama)
5. **Tunggu approval** — jangan self-merge kecuali hotfix urgent
6. **Squash merge** diutamakan agar history `develop` tetap bersih

### Checklist PR (wajib)

```
- [ ] Kode berjalan tanpa error di local
- [ ] Tidak ada console.log yang tertinggal
- [ ] Tidak ada API key / secret yang ter-commit
- [ ] `npm run security-check` lulus
- [ ] UI sudah dicek di mobile (375px) dan desktop (1280px)
- [ ] Tidak ada breaking change pada fitur lain
```

---

## Code Standards

### JavaScript / React

- **Functional components** — tidak ada class component baru
- **Hooks** untuk semua state & side effect
- **No inline styles** — gunakan Tailwind classes atau CSS modules
- **No hardcoded colors** — gunakan design token dari `tailwind.config` / CSS variables
- Ukuran file component maksimal **400 baris** — lebih dari itu, pecah jadi sub-komponen
- Import order: React → third-party → internal (`../`) → styles

```js
// ✅ Benar
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { MyComponent } from '../components/MyComponent';

// ❌ Salah — import acak-acakan
import { MyComponent } from '../components/MyComponent';
import React from 'react';
import { Brain } from 'lucide-react';
```

### Firebase & Security

- **Jangan pernah** menyimpan API key atau secret di dalam kode — selalu gunakan `.env`
- Tambahkan validasi di **Firestore Security Rules** untuk koleksi baru
- Gunakan fungsi `sanitizeContext()` dari `utils/security.js` untuk semua input user

### Naming Convention

| Entitas | Konvensi | Contoh |
|---|---|---|
| Component | PascalCase | `BentoCard`, `PTNPediaList` |
| Hook | camelCase + `use` prefix | `useTokenBalance`, `useNetworkStatus` |
| Utility function | camelCase | `formatTime`, `sanitizeContext` |
| CSS class | kebab-case | `lp-card-hover`, `bento-icon` |
| Constant | UPPER_SNAKE_CASE | `MAX_DAILY_QUOTA`, `GEMINI_KEYS` |

---

## Larangan

Hal-hal berikut akan langsung menyebabkan PR ditolak:

- 🚫 Commit langsung ke `main`
- 🚫 API key / password / secret dalam kode atau commit message
- 🚫 `console.log` yang tertinggal di production code
- 🚫 Mengubah `firestore.rules` tanpa diskusi dan review maintainer
- 🚫 Breaking change pada fitur yang sudah stable tanpa migrasi plan
- 🚫 Dependency baru yang tidak ada justifikasi dan belum disetujui maintainer

---

## Butuh Bantuan?

Hubungi maintainer via:
- 📧 **Email**: support@snbtai.com
- 💬 **Discord**: *(coming soon)*

Atau buka **GitHub Discussion** untuk pertanyaan yang tidak mendesak.
