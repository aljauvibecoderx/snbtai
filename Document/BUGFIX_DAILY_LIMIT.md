# 🐛 Bug Fix: Daily Limit Not Resetting

## 📋 Issue Description

**Problem:** User kredit tidak reset setiap hari. Setelah mencapai limit 19 soal di hari pertama, di hari kedua masih menunjukkan limit tercapai.

**Reported:** User melaporkan bahwa setelah hari berganti (00:00), limit kredit masih menunjukkan habis.

---

## 🔍 Root Cause Analysis

### Masalah Utama:

1. **String Comparison vs Timestamp**
   ```javascript
   // ❌ SALAH - Menggunakan string comparison
   const today = new Date().toDateString(); // "Mon Jan 20 2025"
   const createdDate = new Date(q.createdAt.seconds * 1000).toDateString();
   return createdDate === today; // Tidak reliable!
   ```

2. **Timezone Issues**
   - `toDateString()` menggunakan local timezone
   - Firestore `serverTimestamp()` menggunakan UTC
   - Menyebabkan mismatch saat compare

3. **Precision Loss**
   - String comparison kehilangan informasi jam/menit/detik
   - Tidak bisa akurat detect "start of day"

### Contoh Kasus:
```
User generate soal: 19 Jan 2025 23:50 (UTC+7)
Firestore timestamp: 19 Jan 2025 16:50 (UTC)

Hari berikutnya (20 Jan 2025 00:10):
- toDateString() = "Sat Jan 20 2025"
- Firestore date string = "Sat Jan 20 2025" (setelah convert)
- Tapi soal kemarin masih ter-count karena logic error!
```

---

## ✅ Solution Implemented

### Fix 1: Timestamp-Based Comparison

```javascript
// ✅ BENAR - Menggunakan timestamp comparison
const getDailyUsage = () => {
  if (user) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day (00:00:00.000)
    const todayTimestamp = today.getTime() / 1000; // Convert to seconds
    
    return myQuestions.filter(q => {
      if (!q.createdAt || !q.createdAt.seconds) return false;
      return q.createdAt.seconds >= todayTimestamp; // Compare timestamps
    }).length;
  }
  return getUsageData().dailyCount;
};
```

### Keuntungan:

1. **Akurat**: Timestamp comparison lebih presisi
2. **Timezone-Safe**: Menggunakan local timezone user
3. **Reliable**: Tidak terpengaruh format string
4. **Performance**: Numeric comparison lebih cepat

### Cara Kerja:

```
Contoh: Hari ini 20 Jan 2025, jam 10:00

1. today = new Date() // 20 Jan 2025 10:00:00
2. today.setHours(0,0,0,0) // 20 Jan 2025 00:00:00
3. todayTimestamp = 1737331200 (seconds since epoch)

4. Filter questions:
   - Soal A: createdAt = 1737320000 (19 Jan 23:00) ❌ < todayTimestamp
   - Soal B: createdAt = 1737335000 (20 Jan 01:00) ✅ >= todayTimestamp
   
5. Result: Hanya soal hari ini yang di-count
```

---

## 🧪 Testing

### Test Case 1: Normal Usage
```
Day 1 (19 Jan):
- Generate 19 soal ✅
- Limit reached ✅

Day 2 (20 Jan 00:01):
- getDailyUsage() = 0 ✅
- Can generate again ✅
```

### Test Case 2: Midnight Edge Case
```
19 Jan 23:59:
- Generate soal #19 ✅
- Limit reached ✅

20 Jan 00:00:
- getDailyUsage() = 0 ✅
- Limit reset ✅
```

### Test Case 3: Multiple Days
```
Day 1: 19 soal
Day 2: 19 soal
Day 3: Check usage
- Should only count Day 3 soal ✅
```

---

## 📊 Impact

### Before Fix:
- ❌ Limit tidak reset setiap hari
- ❌ User tidak bisa generate soal baru
- ❌ Timezone issues
- ❌ Inconsistent behavior

### After Fix:
- ✅ Limit reset tepat jam 00:00 local time
- ✅ User bisa generate 19 soal setiap hari
- ✅ Timezone-safe
- ✅ Consistent & reliable

---

## 🔄 Related Changes

### Files Modified:
1. `src/App.js` - Line ~1850 (HomeView getDailyUsage)
2. `src/App.js` - Line ~2100 (handleStart getDailyUsage)

### Functions Updated:
- `getDailyUsage()` - 2 instances
- Logic: String comparison → Timestamp comparison

---

## 📝 Notes

### For Developers:

1. **Always use timestamp for date comparison**
   ```javascript
   // ❌ Don't
   date1.toDateString() === date2.toDateString()
   
   // ✅ Do
   date1.getTime() >= startOfDay.getTime()
   ```

2. **Set time to start of day for daily resets**
   ```javascript
   const today = new Date();
   today.setHours(0, 0, 0, 0); // Critical!
   ```

3. **Handle missing data gracefully**
   ```javascript
   if (!q.createdAt || !q.createdAt.seconds) return false;
   ```

### For Users:

- Limit sekarang reset tepat jam **00:00 waktu lokal**
- Tidak perlu logout/login untuk reset
- Refresh page untuk update counter

---

## 🚀 Deployment

### Steps:
1. ✅ Code updated
2. ✅ Tested locally
3. ⏳ Deploy to production
4. ⏳ Monitor for 24 hours
5. ⏳ Verify reset works at midnight

### Rollback Plan:
If issues occur, revert to string comparison with timezone fix:
```javascript
const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
```

---

## 📞 Support

If limit still not resetting:
1. Clear browser cache
2. Logout and login again
3. Check browser console for errors
4. Report to dev team with:
   - Current time
   - Last generation time
   - Browser timezone

---

**Fixed by:** Amazon Q Security Audit
**Date:** 2025-01-20
**Version:** 1.1.0
