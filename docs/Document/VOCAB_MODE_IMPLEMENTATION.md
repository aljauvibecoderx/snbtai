# 🎯 Vocab Mode - Implementation Guide

## Overview
Vocab Mode adalah fitur eksklusif untuk **Literasi Bahasa Inggris** yang membantu user menyimpan dan mengulang kosakata tanpa keluar dari sistem CBT.

## 🎨 Design Philosophy

### Desktop vs Mobile
- **Desktop**: Full-featured dengan panel samping, search manual, dan review di CBT
- **Mobile**: Simplified - hanya highlight to save, review di Overview saja

### CBT vs Overview
- **CBT**: Mode fokus ujian (highlight & save vocab)
- **Overview**: Mode belajar (review dengan spaced repetition)

### Visual Style
- Warna netral (putih, abu soft, hitam elegan)
- Typography modern dengan banyak whitespace
- Rounded card halus dengan shadow lembut
- **Tidak terlihat seperti game** - vibes premium learning platform

---

## 📁 File Structure

```
src/
├── VocabMode.js              # All vocab UI components
├── vocab-firebase.js         # Firebase functions for vocab
└── App.js                    # Integration point (CBT View)
```

---

## 🔧 Implementation Steps

### Step 1: Import Vocab Components ke App.js

Tambahkan di bagian atas App.js (setelah imports lainnya):

```javascript
import { 
  VocabPanel, 
  HighlightPopup, 
  MeaningModal, 
  SearchModal,
  VocabReviewReminder,
  VocabProgressCard,
  VocabReviewQuiz
} from './VocabMode';
import { 
  saveVocab, 
  getVocabStats, 
  getVocabNeedReview, 
  checkVocabExists 
} from './vocab-firebase';
```

### Step 2: Add Vocab State ke CBTView

Tambahkan state di dalam CBTView component:

```javascript
const CBTView = ({ ... }) => {
  // Existing states...
  
  // Vocab Mode States (only for lit_ing)
  const [showVocabPanel, setShowVocabPanel] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [highlightPosition, setHighlightPosition] = useState({ x: 0, y: 0 });
  const [showHighlightPopup, setShowHighlightPopup] = useState(false);
  const [showMeaningModal, setShowMeaningModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [vocabMeaning, setVocabMeaning] = useState(null);
  const [vocabStats, setVocabStats] = useState({ total: 0, xp: 0, needReview: 0 });
  
  const isLitIng = subtestId === 'lit_ing';
  
  // ... rest of component
};
```

### Step 3: Enable Text Selection untuk Literasi Inggris

Ubah class `select-none` menjadi conditional:

```javascript
<div className={`min-h-screen bg-[#F3F4F8] flex flex-col font-sans ${isLitIng ? '' : 'select-none'} relative overflow-x-hidden`}>
```

### Step 4: Add Text Selection Handler

Tambahkan function untuk handle text selection:

```javascript
const handleTextSelection = () => {
  if (!isLitIng || !user) return;
  
  const selection = window.getSelection();
  const text = selection.toString().trim();
  
  if (text && text.split(' ').length <= 3) { // Max 3 words
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    setSelectedText(text);
    setHighlightPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + window.scrollY
    });
    setShowHighlightPopup(true);
  }
};

useEffect(() => {
  if (isLitIng && user) {
    document.addEventListener('mouseup', handleTextSelection);
    return () => document.removeEventListener('mouseup', handleTextSelection);
  }
}, [isLitIng, user]);
```

### Step 5: Add Vocab Panel (Desktop Only)

Tambahkan di sidebar (setelah navigation panel):

```javascript
{/* Sidebar */}
<aside className=\"lg:col-span-2 space-y-2 animate-slide-in-right\">
  {/* Existing game player and navigation... */}
  
  {/* Vocab Panel - Desktop Only, Lit Ing Only */}
  {isLitIng && user && (
    <div className=\"hidden lg:block\">
      <VocabPanel 
        user={user} 
        onSearchClick={() => setShowSearchModal(true)} 
      />
    </div>
  )}
</aside>
```

### Step 6: Add Vocab Modals

Tambahkan sebelum closing tag `</div>` di CBTView:

```javascript
{/* Vocab Modals */}
{showHighlightPopup && (
  <HighlightPopup
    word={selectedText}
    position={highlightPosition}
    onViewMeaning={async () => {
      setShowHighlightPopup(false);
      // Mock API call - replace with real dictionary API
      setVocabMeaning({
        word: selectedText,
        meaning: 'Arti dari kata ini',
        example: 'Contoh penggunaan dalam kalimat'
      });
      setShowMeaningModal(true);
    }}
    onSave={async () => {
      try {
        const exists = await checkVocabExists(user.uid, selectedText);
        if (exists) {
          showToast('Kata sudah tersimpan', 'info');
        } else {
          await saveVocab(user.uid, {
            word: selectedText,
            meaning: 'Arti dari kata ini',
            example: 'Contoh penggunaan',
            source: 'highlight'
          });
          showToast('✓ Saved +5 XP', 'success');
          sfx.playClick();
        }
        setShowHighlightPopup(false);
      } catch (error) {
        showToast('Gagal menyimpan kata', 'error');
      }
    }}
    onClose={() => setShowHighlightPopup(false)}
  />
)}

{showMeaningModal && vocabMeaning && (
  <MeaningModal
    word={vocabMeaning.word}
    meaning={vocabMeaning.meaning}
    example={vocabMeaning.example}
    isSaved={false}
    onSave={async () => {
      try {
        await saveVocab(user.uid, {
          word: vocabMeaning.word,
          meaning: vocabMeaning.meaning,
          example: vocabMeaning.example,
          source: 'highlight'
        });
        showToast('✓ Saved +5 XP', 'success');
        sfx.playClick();
        setShowMeaningModal(false);
      } catch (error) {
        showToast('Gagal menyimpan kata', 'error');
      }
    }}
    onClose={() => setShowMeaningModal(false)}
  />
)}

{showSearchModal && (
  <SearchModal
    user={user}
    onClose={() => setShowSearchModal(false)}
    showToast={showToast}
  />
)}
```

### Step 7: Add Vocab Review to Dashboard

Di DashboardView.js, tambahkan di Overview tab:

```javascript
import { VocabReviewReminder, VocabProgressCard, VocabReviewQuiz } from './VocabMode';
import { getVocabStats, getVocabNeedReview, updateVocabReview } from './vocab-firebase';

// Inside renderOverview():
const [vocabStats, setVocabStats] = useState({ total: 0, xp: 0, needReview: 0, mastered: 0 });
const [showVocabReview, setShowVocabReview] = useState(false);
const [vocabToReview, setVocabToReview] = useState([]);

useEffect(() => {
  if (user) {
    loadVocabStats();
  }
}, [user]);

const loadVocabStats = async () => {
  const stats = await getVocabStats(user.uid);
  setVocabStats(stats);
};

const handleStartReview = async () => {
  const vocab = await getVocabNeedReview(user.uid);
  setVocabToReview(vocab);
  setShowVocabReview(true);
};

// Add to Overview render:
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Left Column - Stats Cards */}
  <div className="lg:col-span-2 space-y-6">
    {/* Existing stats... */}
    
    {/* Vocab Review Reminder */}
    {vocabStats.needReview > 0 && (
      <VocabReviewReminder 
        needReview={vocabStats.needReview} 
        onStartReview={handleStartReview} 
      />
    )}
  </div>
  
  {/* Right Column - Info Panel */}
  <div className="space-y-6">
    {/* Existing panels... */}
    
    {/* Vocab Progress */}
    {vocabStats.total > 0 && (
      <VocabProgressCard stats={vocabStats} />
    )}
  </div>
</div>

{/* Vocab Review Quiz Modal */}
{showVocabReview && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
    <VocabReviewQuiz
      vocabList={vocabToReview}
      onComplete={async () => {
        setShowVocabReview(false);
        await loadVocabStats();
      }}
    />
  </div>
)}
```

---

## 🔥 Firestore Structure

### Collection: `vocab`

```javascript
{
  userId: "user123",
  word: "comprehend",
  meaning: "memahami, mengerti",
  example: "I can comprehend the text easily.",
  source: "highlight" | "manual_search",
  savedAt: Timestamp,
  lastReviewed: Timestamp | null,
  reviewCount: 0,
  nextReview: Timestamp, // Spaced repetition
  mastered: false,
  xpEarned: 5
}
```

### Spaced Repetition Algorithm

```
Review 1: +1 day
Review 2: +3 days
Review 3: +7 days
Review 4: +14 days
Review 5+: +30 days

If wrong: Reset to +1 day
```

---

## 🎯 User Flow

### Desktop Flow

1. **User mengerjakan soal Lit Ing**
2. **User blok kata** → Popup muncul
3. **User klik "Lihat Arti"** → Modal blur background
4. **User klik "Simpan"** → Notif "+5 XP"
5. **Kata masuk Vocab Panel** (sidebar)
6. **User bisa search manual** via panel
7. **Di Overview**: Reminder "4 kata perlu review"
8. **User klik "Mulai Review"** → Mini quiz
9. **Selesai review** → XP bertambah, kata dijadwalkan ulang

### Mobile Flow

1. **User mengerjakan soal Lit Ing**
2. **User blok kata** → Popup muncul
3. **User klik "Lihat Arti"** → Modal blur background
4. **User klik "Simpan"** → Notif "+5 XP"
5. **Tidak ada panel samping** (mobile)
6. **Tidak ada search manual** (mobile)
7. **Di Overview**: Reminder "4 kata perlu review"
8. **User klik "Mulai Review"** → Mini quiz

---

## 🚀 Integration Checklist

- [ ] Import VocabMode components ke App.js
- [ ] Import vocab-firebase functions
- [ ] Add vocab states ke CBTView
- [ ] Enable text selection untuk lit_ing
- [ ] Add text selection handler
- [ ] Add VocabPanel ke sidebar (desktop only)
- [ ] Add vocab modals (HighlightPopup, MeaningModal, SearchModal)
- [ ] Add VocabReviewReminder ke Dashboard Overview
- [ ] Add VocabProgressCard ke Dashboard Overview
- [ ] Add VocabReviewQuiz modal ke Dashboard
- [ ] Test highlight to save flow
- [ ] Test search manual flow (desktop)
- [ ] Test spaced repetition review
- [ ] Test mobile responsiveness

---

## 🎨 Design Tokens

```css
/* Colors */
--vocab-primary: #4f46e5 (indigo-600)
--vocab-success: #14b8a6 (teal-600)
--vocab-warning: #f59e0b (amber-500)
--vocab-bg: #f8fafc (slate-50)
--vocab-border: #e2e8f0 (slate-200)

/* Typography */
--vocab-font-sm: 0.75rem (12px)
--vocab-font-base: 0.875rem (14px)
--vocab-font-lg: 1rem (16px)

/* Spacing */
--vocab-space-sm: 0.5rem (8px)
--vocab-space-md: 1rem (16px)
--vocab-space-lg: 1.5rem (24px)

/* Border Radius */
--vocab-radius-sm: 0.5rem (8px)
--vocab-radius-md: 0.75rem (12px)
--vocab-radius-lg: 1rem (16px)
```

---

## 📊 Analytics Events (Optional)

```javascript
// Track vocab usage
analytics.track('vocab_word_saved', { word, source: 'highlight' });
analytics.track('vocab_word_reviewed', { word, isCorrect });
analytics.track('vocab_review_completed', { totalWords, score });
analytics.track('vocab_search_manual', { word });
```

---

## 🐛 Known Limitations

1. **Dictionary API**: Saat ini menggunakan mock data. Perlu integrasi dengan real dictionary API (e.g., Free Dictionary API, Oxford API)
2. **Mobile Search**: Tidak ada search manual di mobile untuk menjaga UX tetap ringan
3. **Offline Mode**: Vocab tidak bisa disimpan saat offline
4. **Language Detection**: Tidak ada validasi apakah kata yang disimpan benar-benar bahasa Inggris

---

## 🔮 Future Enhancements

1. **Audio Pronunciation**: Tambah tombol speaker untuk dengar pronunciation
2. **Word of the Day**: Notifikasi harian dengan kata baru
3. **Vocab Flashcards**: Mode flashcard untuk review
4. **Export to Anki**: Export vocab ke Anki format
5. **Synonym & Antonym**: Tampilkan sinonim dan antonim
6. **Usage Frequency**: Tampilkan seberapa sering kata muncul di soal
7. **Vocab Leaderboard**: Kompetisi siapa yang paling banyak vocab
8. **AI-Powered Suggestions**: AI suggest kata yang perlu dipelajari berdasarkan level user

---

## 📝 Notes

- Fitur ini **HANYA** aktif di `lit_ing` (Literasi Bahasa Inggris)
- Tidak muncul di subtes lain (TPS, PM, Lit Indo, dll)
- User **HARUS LOGIN** untuk menggunakan fitur ini
- Desain mengikuti prinsip **minimalism** dan **premium learning platform**
- Tidak ada animasi berlebihan atau warna mencolok
- Fokus pada **functionality** dan **user experience**

---

## 🎓 Educational Value

Vocab Mode membantu user:
1. **Belajar sambil latihan** - tidak perlu keluar dari CBT
2. **Spaced repetition** - metode terbukti efektif untuk memorisasi
3. **Gamification** - XP dan progress tracking untuk motivasi
4. **Contextual learning** - kata disimpan dari konteks soal asli
5. **Long-term retention** - review berkala untuk ingatan jangka panjang

---

**Status**: ✅ Ready for Implementation
**Priority**: High
**Estimated Time**: 4-6 hours
**Dependencies**: Firebase, User Authentication
