# Wishlist Feature - Quick Reference

## ✅ Implementation Complete

### Files Modified:

1. **firebase.js** ✅
   - Added: `addToWishlist()`, `removeFromWishlist()`, `getWishlist()`, `checkWishlistStatus()`

2. **DetailSoalView.js** ✅
   - Added: Bookmark icon on each question card
   - Added: Toggle save/unsave functionality
   - Added: Visual indicator for saved questions
   - Props needed: `user`, `questionSetId`, `showToast`

3. **DashboardView.js** ✅
   - Added: "Wishlist" tab in navigation
   - Added: `renderWishlist()` function
   - Added: Wishlist data loading
   - Added: View and remove wishlist handlers

4. **App.js** ⚠️ NEEDS UPDATE
   - Update `onViewDetail` to support `questionIndex` parameter
   - Pass required props to DetailSoalView

## 🔧 App.js Changes Needed

### Current onViewDetail:
```javascript
onViewDetail={async (setId) => {
  const questions = await getQuestionsBySetId(setId);
  setDetailQuestions(questions);
  setDetailSubtest('Paket Soal');
  setView('DETAIL');
}}
```

### Updated onViewDetail:
```javascript
onViewDetail={async (setId, questionIndex = null) => {
  const questions = await getQuestionsBySetId(setId);
  setDetailQuestions(questions);
  setDetailSubtest('Paket Soal');
  setQuestionSetId(setId); // Store for wishlist
  setView('DETAIL');
  
  // Scroll to specific question if index provided
  if (questionIndex !== null) {
    setTimeout(() => {
      const element = document.getElementById(`question-${questionIndex}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }
}}
```

### DetailSoalView Render:
```javascript
{view === 'DETAIL' && (
  <DetailSoalView 
    questions={detailQuestions} 
    subtestLabel={detailSubtest} 
    subtestId={detailSubtest}
    onBack={() => { setView('DASHBOARD'); navigate('/dashboard/overview'); }}
    user={user}
    questionSetId={questionSetId}
    showToast={showToast}
  />
)}
```

### DetailSoalView.js - Add ID to question cards:
```javascript
<div key={q.id} id={`question-${idx}`} className="bg-white rounded-xl border border-slate-200 p-6">
  {/* Rest of the card content */}
</div>
```

## 🎯 How It Works

### 1. Save to Wishlist
```
User on DetailSoalView → Click Bookmark icon → 
checkWishlistStatus() → addToWishlist() → 
Update state → Show toast "✓ Soal disimpan ke Wishlist"
```

### 2. View Wishlist
```
Dashboard → Click "Wishlist" tab → 
getWishlist() → Group by subtest → 
Render cards with question preview
```

### 3. Open Wishlist Question
```
Click wishlist card → 
onViewDetail(setId, questionIndex) → 
Load questions → Scroll to specific question → 
Show full question + explanation
```

## 📊 Database Schema

### Collection: `wishlist`
```javascript
{
  userId: "user123",
  questionSetId: "set456",
  questionIndex: 2,
  subtest: "tps_pu",
  setTitle: "Latihan Penalaran Umum",
  question: { /* full question object */ },
  savedAt: Timestamp
}
```

## 🎨 UI Components

### Bookmark Button (DetailSoalView)
```javascript
<button
  onClick={() => handleWishlistToggle(idx)}
  disabled={loadingWishlist[idx]}
  className={wishlistStatus[idx] 
    ? 'bg-pink-100 text-pink-600' 
    : 'bg-slate-100 text-slate-400'}
>
  {wishlistStatus[idx] ? <BookmarkCheck /> : <Bookmark />}
</button>
```

### Wishlist Tab (DashboardView)
```javascript
<button 
  onClick={() => navigate('/dashboard/wishlist')} 
  className={activeTab === 'wishlist' 
    ? 'bg-gradient-to-r from-pink-600 to-pink-500 text-white' 
    : 'text-slate-600'}
>
  <Bookmark size={14} />
  <span>Wishlist</span>
</button>
```

### Wishlist Card
```javascript
<div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-5 text-white">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Bookmark size={16} fill="currentColor" />
      <span>Soal #{item.questionIndex + 1}</span>
    </div>
    <button onClick={() => handleRemoveWishlist(item.id)}>
      <Trash2 size={14} />
    </button>
  </div>
  <p className="text-sm font-bold">{item.setTitle}</p>
  <p className="text-xs line-clamp-2">{item.question.text}</p>
</div>
```

## 🔐 Security Rules (Firestore)

Add to `firestore.rules`:
```javascript
match /wishlist/{wishlistId} {
  allow read: if request.auth != null && 
              resource.data.userId == request.auth.uid;
  allow create: if request.auth != null && 
                request.resource.data.userId == request.auth.uid;
  allow delete: if request.auth != null && 
                resource.data.userId == request.auth.uid;
}
```

## ✅ Testing Checklist

- [x] Firebase functions created
- [x] DetailSoalView bookmark button added
- [x] DashboardView wishlist tab added
- [ ] App.js onViewDetail updated
- [ ] DetailSoalView question cards have IDs
- [ ] Test save to wishlist
- [ ] Test remove from wishlist
- [ ] Test view wishlist question
- [ ] Test scroll to question
- [ ] Deploy Firestore rules

## 🚀 Deployment Steps

1. Update App.js with new onViewDetail handler
2. Add IDs to question cards in DetailSoalView
3. Deploy Firestore security rules
4. Test all functionality
5. Deploy to production

---

**Status**: 90% Complete - Need App.js final updates
**Next**: Update App.js onViewDetail handler and add question card IDs
