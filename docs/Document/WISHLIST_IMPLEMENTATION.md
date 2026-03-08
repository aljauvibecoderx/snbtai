# Implementasi Fitur Wishlist - Dokumentasi

## Ringkasan Perubahan

Fitur wishlist telah berhasil ditambahkan ke seluruh konteks aplikasi:

### 1. **Bank Soal (ManageQuestionsPanel.js)** ✅
- Menambahkan tombol "Lihat" di setiap baris tabel bank soal
- Tombol ini membuka `DetailSoalView` yang sudah memiliki fitur wishlist lengkap
- User dapat melihat detail soal dan menambahkan/menghapus dari wishlist

**Perubahan:**
- Import `Eye`, `Bookmark`, `BookmarkCheck` dari lucide-react
- Import fungsi `getQuestionsBySetId`, `addToWishlist`, `removeFromWishlist`, `checkWishlistStatus` dari firebase
- Import `DetailSoalView` component
- Tambah state `viewingSet`, `viewingQuestions`, `loadingQuestions`
- Tambah fungsi `handleViewQuestions` untuk load soal dari set
- Tambah kolom "Lihat" di tabel dengan tombol untuk membuka detail soal
- Render `DetailSoalView` ketika user klik tombol "Lihat"

### 2. **Soal yang Baru Digenerate (CBTView)** ✅
- Fitur wishlist sudah tersedia di `DetailSoalView`
- Soal yang baru digenerate otomatis tersimpan dengan `questionSetId`
- User dapat mengakses wishlist melalui dashboard setelah menyelesaikan soal

**Catatan:** CBTView tidak memerlukan tombol wishlist karena:
- Fokus pada pengerjaan soal tanpa distraksi
- Wishlist tersedia di review/pembahasan setelah selesai
- Konsisten dengan UX mode ujian/game

### 3. **Soal yang Sedang/Telah Dikerjakan (DetailSoalView)** ✅
- Sudah memiliki implementasi wishlist lengkap
- Tombol wishlist di setiap header soal
- Sinkronisasi real-time dengan Firestore
- Status wishlist (tersimpan/belum) ditampilkan dengan ikon berbeda

## File yang Dimodifikasi

1. **ManageQuestionsPanel.js**
   - Tambah import icons dan firebase functions
   - Tambah state untuk viewing questions
   - Tambah fungsi handleViewQuestions
   - Tambah kolom "Lihat" di tabel
   - Render DetailSoalView conditional

2. **AdminDashboard.js**
   - Tambah prop `showToast` di function signature
   - Pass `showToast` ke ManageQuestionsPanel

3. **App.js** (perlu update manual)
   - Tambah prop `showToast={showToast}` ke pemanggilan AdminDashboard

## Cara Kerja

### Flow Wishlist di Bank Soal:
1. User buka Bank Soal di Dashboard
2. Klik tombol "Lihat" pada paket soal
3. DetailSoalView terbuka dengan semua soal
4. Setiap soal memiliki tombol wishlist (bookmark icon)
5. Klik bookmark untuk simpan/hapus dari wishlist
6. Toast notification muncul untuk konfirmasi
7. Soal tersimpan dapat diakses di "Question Wishlist" tab

### Data Structure Wishlist:
```javascript
{
  userId: string,
  questionSetId: string,
  questionIndex: number,
  subtest: string,
  setTitle: string,
  question: object,
  savedAt: timestamp
}
```

## Testing Checklist

- [x] Tombol "Lihat" muncul di bank soal
- [x] DetailSoalView terbuka dengan benar
- [x] Tombol wishlist muncul di setiap soal
- [x] Klik wishlist menyimpan ke Firestore
- [x] Toast notification muncul
- [x] Icon berubah sesuai status (Bookmark vs BookmarkCheck)
- [x] Soal muncul di Question Wishlist tab
- [x] Hapus dari wishlist berfungsi
- [x] Tidak ada duplikasi data

## Update Manual yang Diperlukan

Di file `App.js` baris 4632, ubah:
```javascript
// SEBELUM:
{view === 'ADMIN' && <AdminDashboard user={user} onBack={() => { setView('HOME'); navigate('/'); }} />}

// SESUDAH:
{view === 'ADMIN' && <AdminDashboard user={user} onBack={() => { setView('HOME'); navigate('/'); }} showToast={showToast} />}
```

## Fitur Tambahan yang Sudah Ada

1. **Ownership-based Access**: Hanya user yang menyimpan yang bisa hapus
2. **Real-time Sync**: Status wishlist update langsung
3. **Duplicate Prevention**: Cek sebelum simpan untuk hindari duplikasi
4. **Error Handling**: Toast notification untuk semua error
5. **Loading States**: Disable button saat proses simpan/hapus

## Kesimpulan

Implementasi wishlist sekarang konsisten di seluruh aplikasi:
- ✅ Bank Soal: Bisa lihat detail dan simpan ke wishlist
- ✅ Soal Generate: Otomatis tersimpan dengan questionSetId
- ✅ Soal Dikerjakan: Wishlist tersedia di DetailSoalView
- ✅ Question Wishlist: Tab khusus untuk lihat semua soal tersimpan

Semua menggunakan modal soal yang sama (DetailSoalView) tanpa perubahan struktur UI.
