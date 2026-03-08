# 🔧 Quick Fix: Reset Daily Limit Manually

## Untuk User yang Sudah Login

### Cara 1: Refresh Page
1. Buka aplikasi
2. Tekan `Ctrl + Shift + R` (Windows) atau `Cmd + Shift + R` (Mac)
3. Hard refresh akan reload data dari Firestore

### Cara 2: Clear Cache
1. Buka Developer Tools (`F12`)
2. Klik tab "Application" atau "Storage"
3. Klik "Clear site data"
4. Refresh page

### Cara 3: Logout & Login
1. Klik Logout
2. Login kembali
3. Data akan ter-reload dari server

---

## Untuk User Tanpa Login

### Cara 1: Clear localStorage (RECOMMENDED)
1. Buka Developer Tools (`F12`)
2. Klik tab "Console"
3. Paste code ini:
```javascript
localStorage.removeItem('latsol_ai_usage');
location.reload();
```
4. Tekan Enter

### Cara 2: Manual Clear
1. Buka Developer Tools (`F12`)
2. Klik tab "Application" atau "Storage"
3. Expand "Local Storage"
4. Klik domain website
5. Cari key `latsol_ai_usage`
6. Klik kanan → Delete
7. Refresh page

### Cara 3: Incognito Mode
1. Buka browser Incognito/Private
2. Akses website
3. Limit akan fresh (1 soal/hari)

---

## Debug: Cek Current Usage

Paste di Console (`F12`):

```javascript
// Cek localStorage
const usage = JSON.parse(localStorage.getItem('latsol_ai_usage') || '{}');
console.log('Current Usage:', usage);
console.log('Today:', new Date().toDateString());
console.log('Stored Date:', usage.date);
console.log('Daily Count:', usage.dailyCount);

// Reset manual
localStorage.setItem('latsol_ai_usage', JSON.stringify({
  dailyCount: 0,
  geminiCount: 0,
  hfCount: 0,
  minuteCount: 0,
  date: new Date().toDateString(),
  lastMinute: new Date().getMinutes()
}));
console.log('✅ Reset complete! Refresh page.');
```

---

## Verifikasi Fix Berhasil

Setelah reset, cek:
1. Counter menunjukkan `0/1` (non-login) atau `0/19` (login)
2. Button "Generate Soal" aktif (tidak disabled)
3. Tidak ada pesan "Limit Habis"

---

## Jika Masih Bermasalah

1. **Clear ALL browser data**
   - Settings → Privacy → Clear browsing data
   - Pilih "All time"
   - Centang semua
   - Clear data

2. **Try different browser**
   - Chrome, Firefox, Edge, Safari
   - Test di browser lain

3. **Check browser console**
   - Buka Console (`F12`)
   - Cari error messages
   - Screenshot dan report

---

## Prevention

Untuk mencegah masalah di masa depan:

1. **Jangan clear cache saat sedang generate**
2. **Tunggu hingga proses selesai**
3. **Login untuk tracking yang lebih reliable**
4. **Update browser ke versi terbaru**

---

## Technical Notes

### Root Cause:
- localStorage tidak auto-reset saat hari berganti
- Perlu manual check `date` field
- Fix sudah implemented di code

### What Changed:
```javascript
// OLD: No auto-reset
const usage = getUsageData();
return usage.dailyCount;

// NEW: Auto-reset if different day
const usage = getUsageData();
const today = new Date().toDateString();
if (usage.date !== today) {
  // Reset to 0
  return 0;
}
return usage.dailyCount;
```

### For Developers:
- Check console logs: `📊 Daily Usage Debug`
- Verify timestamp comparison
- Test at midnight (00:00)

---

**Last Updated:** 2025-01-20
**Version:** 1.1.1
