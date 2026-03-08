## 🔍 ANALISIS MASALAH: PENGAMBILAN DATA TERBATAS (100 SET)

### ❌ **PENYEBAB MASALAH**

#### 1. **Firestore Query Limitation (1MB per query)**
```javascript
// SEBELUMNYA - Mengambil SEMUA docs tanpa limit
const setsSnapshot = await getDocs(collection(db, 'question_sets'));
```
- `getDocs()` tanpa `limit()` bisa mengambil hingga 1MB data
- Jika data > 1MB, query akan gagal atau terpotong
- Tidak ada mekanisme untuk data yang lebih besar

#### 2. **Memory Sorting (Tidak Scalable)**
```javascript
// SEBELUMNYA - Sorting di memory
allSets.sort((a, b) => { ... });
return allSets.slice(0, limit); // Hanya return 100
```
- Sorting dilakukan di memory setelah fetch semua data
- Slice hanya mengambil 100 pertama
- Jika ada 1000+ set, hanya 100 yang ditampilkan

#### 3. **Hardcoded Limit**
```javascript
// SEBELUMNYA
return allSets.slice(0, limit); // limit = 100
```
- Tidak ada pagination
- Tidak ada cara untuk mengakses data di atas 100

### ✅ **SOLUSI: CURSOR-BASED PAGINATION**

#### 1. **Firestore Query dengan Pagination**
```javascript
// SESUDAH - Query dengan limit dan cursor
let q = query(
  collection(db, 'question_sets'),
  orderBy(orderField, orderDir),
  limit(pageSize + 1)  // +1 untuk detect hasMore
);

if (lastDoc) {
  q = query(
    collection(db, 'question_sets'),
    orderBy(orderField, orderDir),
    startAfter(lastDoc),  // Cursor untuk next page
    limit(pageSize + 1)
  );
}
```

#### 2. **Return Pagination Info**
```javascript
return {
  data: allSets,           // Data untuk halaman ini
  hasMore: hasMore,        // Ada halaman berikutnya?
  lastDoc: lastDoc         // Cursor untuk next page
};
```

#### 3. **Load More Button di UI**
```javascript
{hasMore && (
  <button onClick={handleLoadMore}>
    Muat Lebih Banyak
  </button>
)}
```

### 📊 **PERBANDINGAN**

| Aspek | Sebelumnya | Sesudah |
|-------|-----------|--------|
| Max Data | ~100 set | Unlimited |
| Memory Usage | Tinggi (load semua) | Rendah (50 per page) |
| Sorting | Di memory | Di Firestore |
| Pagination | Tidak ada | Cursor-based |
| Scalability | Buruk | Excellent |
| Query Size | Bisa > 1MB | Selalu < 1MB |

### 🔧 **IMPLEMENTASI**

#### File: `firebase-admin.js`
```javascript
export const getAllQuestionSetsForManagement = async (
  sortBy = 'createdAt',
  order = 'desc',
  pageSize = 50,
  lastDoc = null  // Cursor untuk pagination
) => {
  // Query dengan orderBy dan limit
  // Jika ada lastDoc, gunakan startAfter()
  // Return { data, hasMore, lastDoc }
}
```

#### File: `ManageQuestionsPanel.js`
```javascript
const [lastDoc, setLastDoc] = useState(null);
const [hasMore, setHasMore] = useState(false);

const loadSets = async (cursor) => {
  const result = await getAllQuestionSetsForManagement(
    sortBy, sortOrder, pageSize, cursor
  );
  
  if (cursor) {
    setSets(prev => [...prev, ...result.data]); // Append
  } else {
    setSets(result.data); // Replace
  }
  
  setLastDoc(result.lastDoc);
  setHasMore(result.hasMore);
};

const handleLoadMore = () => {
  if (lastDoc && hasMore) {
    loadSets(lastDoc);
  }
};
```

### 🎯 **KEUNTUNGAN**

✅ **Unlimited Data** - Bisa handle ribuan set soal
✅ **Efficient** - Hanya load 50 per page
✅ **Scalable** - Tidak ada batasan 1MB
✅ **Fast** - Sorting di Firestore, bukan memory
✅ **User-Friendly** - "Load More" button
✅ **Backward Compatible** - Sorting/filtering tetap berfungsi

### 📝 **CATATAN TEKNIS**

- Pagination menggunakan `startAfter()` dengan cursor (DocumentSnapshot)
- `limit(pageSize + 1)` untuk detect apakah ada halaman berikutnya
- Sorting dilakukan di Firestore dengan `orderBy()`
- Tidak perlu index baru (sudah ada default)
- Kompatibel dengan semua browser modern
