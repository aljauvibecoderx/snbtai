# Slug-Based Routing - Quick Reference

## Alur Routing Tryout

### ✅ SEKARANG (Slug-Based)
```
Klik TO Premium → /tryout/simulasi-snbt-2026 → /tryout/simulasi-snbt-2026/result
```

### ❌ SEBELUMNYA (Generic)
```
Klik TO Premium → /question → /result
```

## URL Structure

### Tryout Page
```
/tryout/:slug
Contoh: /tryout/simulasi-snbt-2026
```

### Result Page
```
/tryout/:slug/result
Contoh: /tryout/simulasi-snbt-2026/result
```

## Implementasi

### 1. Route Handler (App.js)
```javascript
// Detect tryout slug
if (path.startsWith('/tryout/')) {
  const slug = path.replace('/tryout/', '');
  
  // Result page
  if (slug.endsWith('/result')) {
    const tryoutSlug = slug.replace('/result', '');
    sessionStorage.setItem('current_tryout_slug', tryoutSlug);
    setView('RESULT');
    return;
  }
  
  // Tryout page
  handleTryoutSlugRoute(slug);
}
```

### 2. Start Tryout
```javascript
// Store slug in sessionStorage
sessionStorage.setItem('current_tryout_slug', slug);

// Set URL
window.history.pushState({}, '', `/tryout/${slug}`);
```

### 3. Complete Exam
```javascript
// Get slug from sessionStorage
const tryoutSlug = sessionStorage.getItem('current_tryout_slug');

// Set result URL
if (tryoutSlug && isOfficialTryout) {
  window.history.replaceState({}, '', `/tryout/${tryoutSlug}/result`);
}
```

## Benefits

### SEO
- ✅ URL mencerminkan konten
- ✅ Google dapat index per tryout
- ✅ Rich snippets support

### UX
- ✅ URL dapat di-share
- ✅ Bookmark-friendly
- ✅ Browser history lebih jelas

### Analytics
- ✅ Track per tryout
- ✅ Conversion funnel jelas
- ✅ User journey tracking

## Testing

### Test Case 1: Start Tryout
```
1. Klik "Mulai" pada tryout "Simulasi SNBT 2026"
2. URL berubah ke: /tryout/simulasi-snbt-2026
3. CBT dimulai
```

### Test Case 2: Complete Tryout
```
1. Selesaikan tryout
2. URL berubah ke: /tryout/simulasi-snbt-2026/result
3. Result page ditampilkan
```

### Test Case 3: Direct Access
```
1. Akses langsung: /tryout/simulasi-snbt-2026
2. Tryout dimuat dan CBT dimulai
```

### Test Case 4: Refresh During CBT
```
1. Refresh browser saat mengerjakan
2. State restored dari sessionStorage
3. URL tetap: /tryout/simulasi-snbt-2026
```

## Cleanup

SessionStorage dibersihkan saat:
- User selesai tryout (masuk result)
- User kembali ke home
- User logout

## Backward Compatibility

Route `/question` masih berfungsi untuk:
- Generate soal biasa (bukan tryout)
- Legacy support

Hanya tryout yang menggunakan slug-based routing.
