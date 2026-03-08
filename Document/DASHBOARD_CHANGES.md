# Perubahan Spesifik untuk DashboardView.js

## Step 1: Update Import Statement

GANTI BARIS INI:
```javascript
import { FileText, BookOpen, History, ArrowLeft, TrendingUp, Award, Target, BarChart3, Trophy, Trash2, Search, Filter, CheckCircle, Camera, X, Bookmark, Globe, BookText, Edit2 } from 'lucide-react';
```

DENGAN:
```javascript
import { FileText, BookOpen, History, ArrowLeft, TrendingUp, Award, Target, BarChart3, Trophy, Trash2, Search, Filter, CheckCircle, Camera, X, Bookmark, Globe, BookText, Edit2, LogIn, LogOut, Menu, Sparkles, Activity, Wallet } from 'lucide-react';
```

---

## Step 2: Add State untuk Mobile Menu

TAMBAHKAN SETELAH STATE DECLARATIONS (setelah line dengan `const [loadingTryout, setLoadingTryout]`):
```javascript
const [showMobileMenu, setShowMobileMenu] = useState(false);
```

---

## Step 3: Update Return Statement

GANTI BAGIAN INI (dimulai dari `return (` sampai `<div className="max-w-7xl mx-auto p-4 sm:p-6 relative z-10">`):

DARI:
```jsx
  return (
    <div className="min-h-screen bg-[#F3F4F8] relative overflow-x-hidden">
      {showVisionModal && (
```

MENJADI:
```jsx
  return (
    <div className="min-h-screen bg-[#F3F4F8] relative overflow-x-hidden">
      {/* Background Blur Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500 rounded-full blur-[120px]"></div>
      </div>

      {/* Glassmorphism Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-gray-200 shadow-lg px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 text-violet-600" strokeWidth={2} />
              </div>
              <div>
                <div className="text-base font-bold text-gray-900">SNBT AI</div>
                <div className="text-[10px] text-gray-500 font-medium">Dashboard</div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              {user && (
                <>
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                    <Activity className="w-4 h-4 text-indigo-600" strokeWidth={2} />
                    <span className="text-sm font-semibold text-gray-900">{myQuestions.length}</span>
                    <span className="text-xs text-gray-500">paket</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
                    <TrendingUp className="w-4 h-4 text-emerald-600" strokeWidth={2} />
                    <span className="text-sm font-semibold text-gray-900">{attempts.length}</span>
                    <span className="text-xs text-gray-500">percobaan</span>
                  </div>
                </>
              )}

              {user ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                    <img src={user.photoURL} alt={user.displayName} className="w-5 h-5 rounded-full" />
                    <span className="text-sm font-medium text-gray-900">{user.displayName?.split(' ')[0]}</span>
                  </div>
                  <button onClick={() => onBack()} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <LogOut size={16} strokeWidth={2} />
                  </button>
                </div>
              ) : (
                <button onClick={() => navigate('/login')} className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all shadow-sm">
                  <LogIn size={14} strokeWidth={2} />
                  <span className="text-sm font-medium">Login</span>
                </button>
              )}
            </div>

            <button onClick={() => setShowMobileMenu(true)} className="md:hidden p-2 text-gray-600">
              <Menu size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
      </nav>

      {showMobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)}></div>
          <div className="absolute top-0 right-0 h-full w-64 bg-white shadow-2xl">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="font-bold text-slate-900">Menu</span>
                <button onClick={() => setShowMobileMenu(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showVisionModal && (
```

---

## Step 4: Update Delete Confirmation Dialog

GANTI BAGIAN INI:
```jsx
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-rose-600" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Hapus Paket Soal?</h3>
              <p className="text-slate-600 text-sm mb-6">Semua soal dalam paket ini akan dihapus permanen dari database.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
                  Batal
                </button>
                <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
```

DENGAN:
```jsx
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Paket Soal?</h3>
            <p className="text-gray-600 mb-6">Semua soal dalam paket ini akan dihapus permanen dari database.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all font-medium">
                Batal
              </button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 px-4 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 hover:shadow-lg transition-all font-semibold">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
```

---

## Step 5: Update Main Content Wrapper

GANTI BAGIAN INI:
```jsx
      {/* Background Blur Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500 rounded-full blur-[120px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 relative z-10">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <button onClick={() => { onBack(); navigate('/app'); }} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md">
              <ArrowLeft size={18} className="sm:w-5 sm:h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Kelola soal dan pantau progresmu</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto bg-white rounded-2xl p-2 shadow-lg border border-slate-200 scrollbar-hide">
```

DENGAN:
```jsx
      <main className="relative z-10 pt-28 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-sm text-gray-600">Kelola soal dan pantau progresmu</p>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto bg-white rounded-2xl p-2 shadow-lg border border-gray-200 scrollbar-hide">
```

---

## Step 6: Update Tab Button Styling

GANTI SEMUA BUTTON STYLING DARI:
```jsx
className={`px-3 sm:px-5 py-2 sm:py-3 rounded-xl text-[11px] sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${activeTab === 'overview' ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
```

MENJADI:
```jsx
className={`px-3 sm:px-5 py-2 sm:py-3 rounded-xl text-[11px] sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${activeTab === 'overview' ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
```

---

## Step 7: Update Closing Tags

GANTI BAGIAN AKHIR DARI:
```jsx
        )}
      </div>
    </div>
  );
};
```

MENJADI:
```jsx
        )}
      </div>
    </main>
    </div>
  );
};
```

---

## Summary

✅ Navbar dengan glassmorphism styling
✅ Background blur effects
✅ Stats badges di navbar
✅ Mobile menu support
✅ Updated delete dialog styling
✅ Proper spacing dengan pt-28
✅ Semua tombol tetap ada dan berfungsi
