# Implementasi Slug-Based Routing untuk Tryout

## Overview
Sistem routing berbasis slug telah diimplementasikan untuk membuat URL tryout lebih SEO-friendly dan mudah dibaca.

## Perubahan yang Dilakukan

### 1. Slug Utility (`src/utils/slugify.js`)
- **generateSlug(title)**: Mengubah judul menjadi URL-safe slug
  - Lowercase semua karakter
  - Ganti spasi dengan hyphen (-)
  - Hapus karakter spesial
  - Hapus multiple hyphens
  
- **generateUniqueSlug(title, checkExists)**: Generate slug unik dengan pengecekan duplikasi
  - Jika slug sudah ada, tambahkan counter (-1, -2, dst)

### 2. Firebase Admin (`src/firebase-admin.js`)
- **checkSlugExists(slug)**: Cek apakah slug sudah digunakan
- **createTryout()**: Otomatis generate slug saat membuat tryout
- **getTryoutBySlug(slug)**: Ambil data tryout berdasarkan slug

### 3. App.js Routing
- Route handler untuk `/tryout/:slug`
- **handleTryoutSlugRoute(slug)**: Load tryout berdasarkan slug dan start CBT
- Update DashboardView untuk menggunakan slug-based URL

### 4. Admin Dashboard (`src/AdminDashboard.js`)
- TryoutBuilderPanel: Tampilkan slug setelah tryout dibuat
- ManageTryoutPanel: Tampilkan slug di daftar tryout

## Cara Penggunaan

### Admin: Membuat Tryout
1. Buka Admin Panel
2. Buat tryout baru dengan judul, misal: "Tryout Akbar Nasional #1"
3. Sistem otomatis generate slug: `tryout-akbar-nasional-1`
4. URL yang dihasilkan: `/tryout/tryout-akbar-nasional-1`

### User: Mengakses Tryout
1. Klik link tryout atau akses langsung: `https://domain.com/tryout/tryout-akbar-nasional-1`
2. Sistem otomatis load soal dan start CBT
3. URL tetap menggunakan slug selama mengerjakan

## Contoh URL

### Sebelum (ID-based):
```
/tryout/DOC_ID_abc123xyz
```

### Sesudah (Slug-based):
```
/tryout/simulasi-snbt-2026
/tryout/tryout-akbar-nasional-1
/tryout/persiapan-utbk-gelombang-1
```

## Fitur Keamanan

### Uniqueness Check
- Setiap slug dicek duplikasi sebelum disimpan
- Jika duplikat, otomatis tambahkan counter
- Contoh: `simulasi-snbt-2026`, `simulasi-snbt-2026-1`, `simulasi-snbt-2026-2`

### Fallback
- Jika slug tidak ditemukan, redirect ke 404
- Jika tryout tidak memiliki soal, tampilkan error dan redirect ke home

## Database Schema

### Collection: `tryouts`
```javascript
{
  id: "DOC_ID_123",
  title: "Tryout Akbar Nasional #1",
  slug: "tryout-akbar-nasional-1",  // NEW FIELD
  description: "...",
  questionsList: [...],
  status: "published",
  createdAt: Timestamp,
  // ... fields lainnya
}
```

### Index Required
Buat index di Firestore untuk query by slug:
- Collection: `tryouts`
- Field: `slug` (Ascending)
- Query scope: Collection

## Testing

### Test Cases
1. ✅ Generate slug dari judul dengan spasi
2. ✅ Generate slug dari judul dengan karakter spesial
3. ✅ Handle duplikasi slug
4. ✅ Load tryout by slug
5. ✅ 404 jika slug tidak ditemukan
6. ✅ URL tetap slug-based selama CBT

### Manual Testing
```bash
# Test 1: Buat tryout dengan judul normal
Judul: "Simulasi SNBT 2026"
Expected slug: "simulasi-snbt-2026"

# Test 2: Buat tryout dengan karakter spesial
Judul: "Tryout: Persiapan UTBK (Gelombang 1)"
Expected slug: "tryout-persiapan-utbk-gelombang-1"

# Test 3: Buat tryout dengan judul sama
Judul: "Simulasi SNBT 2026" (kedua kali)
Expected slug: "simulasi-snbt-2026-1"

# Test 4: Akses via URL
URL: /tryout/simulasi-snbt-2026
Expected: Load tryout dan start CBT

# Test 5: Akses slug tidak ada
URL: /tryout/tidak-ada
Expected: Redirect ke 404
```

## Migration Strategy

### Tryout Lama (Tanpa Slug)
Tryout yang sudah ada sebelum implementasi ini tidak memiliki field `slug`.

**Lazy Migration**: Saat admin edit tryout lama, sistem otomatis generate slug.

**Manual Migration** (Opsional):
```javascript
// Script untuk migrate semua tryout lama
const migrateTryouts = async () => {
  const tryouts = await getDocs(collection(db, 'tryouts'));
  
  for (const doc of tryouts.docs) {
    const data = doc.data();
    if (!data.slug) {
      const slug = await generateUniqueSlug(data.title, checkSlugExists);
      await updateDoc(doc.ref, { slug });
      console.log(`Migrated: ${data.title} -> ${slug}`);
    }
  }
};
```

## SEO Benefits

### Before
```html
<title>Tryout | SNBT AI</title>
<meta property="og:url" content="https://domain.com/tryout/DOC_ID_123" />
```

### After
```html
<title>Simulasi SNBT 2026 | SNBT AI</title>
<meta property="og:url" content="https://domain.com/tryout/simulasi-snbt-2026" />
```

## Troubleshooting

### Slug tidak ter-generate
- Pastikan `generateUniqueSlug` dipanggil di `createTryout`
- Cek console log untuk error

### Tryout tidak load
- Cek apakah slug ada di database
- Cek Firestore index untuk field `slug`
- Cek console log untuk error

### Duplikasi slug
- Sistem otomatis handle dengan counter
- Jika masih duplikat, cek fungsi `checkSlugExists`

## Future Enhancements

1. **Custom Slug**: Admin bisa set custom slug
2. **Slug History**: Track perubahan slug untuk redirect
3. **Analytics**: Track akses berdasarkan slug
4. **Share Button**: Copy slug URL untuk share
5. **QR Code**: Generate QR code dari slug URL

## Kesimpulan

Implementasi slug-based routing berhasil dilakukan dengan:
- ✅ Auto-generate slug dari title
- ✅ Uniqueness check untuk mencegah duplikasi
- ✅ Route handler untuk `/tryout/:slug`
- ✅ Admin panel menampilkan slug
- ✅ SEO-friendly URLs

Sistem siap digunakan untuk tryout baru. Tryout lama akan di-migrate secara lazy saat di-edit.
