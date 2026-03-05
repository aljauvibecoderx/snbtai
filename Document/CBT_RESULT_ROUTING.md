# CBT & Result SEO Routing Implementation

## 📋 Overview

Implementasi routing berbasis slug untuk halaman CBT (Computer-Based Test) dan Result, menggantikan sistem state-based routing dengan path-based routing yang SEO-friendly.

## 🎯 URL Structure

### Before (State-based)
```
/question → CBT page (data dari location.state)
/result → Result page (data dari location.state)
```

### After (Path-based)
```
/cbt/:packageSlug → CBT page untuk paket soal
/cbt/result/:attemptId → Result page dengan attempt ID
/tryout/:slug → CBT page untuk tryout resmi
/tryout/:slug/result → Result page untuk tryout resmi
```

## 🔧 Implementation Details

### 1. Route Handler di App.js

```javascript
// Handle CBT package route: /cbt/:packageSlug
if (path.startsWith('/cbt/')) {
  const slug = path.replace('/cbt/', '');
  
  // Check if it's result page: /cbt/result/:attemptId
  if (slug.startsWith('result/')) {
    const attemptId = slug.replace('result/', '');
    sessionStorage.setItem('current_attempt_id', attemptId);
    setView('RESULT');
    return;
  }
  
  // Regular CBT package page
  if (slug) {
    handleCBTPackageRoute(slug);
    return;
  }
}
```

### 2. CBT Package Handler

```javascript
const handleCBTPackageRoute = async (packageSlug) => {
  try {
    const { getQuestionSetBySlug, getQuestionsBySetId } = await import('./firebase');
    const questionSet = await getQuestionSetBySlug(packageSlug);
    
    if (!questionSet) {
      setView('404');
      return;
    }
    
    // Load questions from set
    const questions = await getQuestionsBySetId(questionSet.id);
    
    if (questions.length === 0) {
      showToast('Paket soal tidak memiliki soal', 'error');
      setView('HOME');
      window.history.pushState({}, '', '/');
      return;
    }
    
    // Start CBT directly
    setQuestions(questions);
    setUserAnswers({});
    setRaguRagu({});
    setCurrentQuestionIdx(0);
    setStreak(0);
    setPoints(0);
    setFeedback(null);
    setMode('exam');
    setTimer(questions.length * 60);
    setFromBankSoal(true);
    setIsOfficialTryout(false);
    setView('CBT');
    
    sessionStorage.setItem('current_package_slug', packageSlug);
    
    if (user) {
      const id = await saveAttempt({
        userId: user.uid,
        subtest: questionSet.subtest || 'mixed',
        setId: questionSet.id,
        totalQuestions: questions.length,
        timeLimit: questions.length * 60,
        mode: 'exam'
      });
      setAttemptId(id);
    }
  } catch (error) {
    console.error('Error loading CBT package:', error);
    showToast('Gagal memuat paket soal', 'error');
    setView('HOME');
    window.history.pushState({}, '', '/');
  }
};
```

### 3. Legacy Route Support

```javascript
if (path === '/question') {
  // Legacy route - redirect to proper CBT route if possible
  const packageSlug = sessionStorage.getItem('current_package_slug');
  const tryoutSlug = sessionStorage.getItem('current_tryout_slug');
  
  if (tryoutSlug) {
    window.history.replaceState({}, '', `/tryout/${tryoutSlug}`);
    handleTryoutSlugRoute(tryoutSlug);
    return;
  } else if (packageSlug) {
    window.history.replaceState({}, '', `/cbt/${packageSlug}`);
    handleCBTPackageRoute(packageSlug);
    return;
  }
  
  // Fallback to sessionStorage state
  const savedState = sessionStorage.getItem('cbt_state');
  if (savedState) {
    // Restore state...
  } else {
    window.history.pushState({}, '', '/');
    setView('HOME');
  }
}
```

### 4. Result Page Routing

```javascript
if (path === '/result') {
  // Legacy route - redirect to proper result route if possible
  const tryoutSlug = sessionStorage.getItem('current_tryout_slug');
  const attemptId = sessionStorage.getItem('current_attempt_id');
  
  if (tryoutSlug) {
    window.history.replaceState({}, '', `/tryout/${tryoutSlug}/result`);
  } else if (attemptId) {
    window.history.replaceState({}, '', `/cbt/result/${attemptId}`);
  }
  setView('RESULT');
}
```

## 📦 Required Firebase Functions

### 1. Get Question Set by Slug

```javascript
// firebase.js
export const getQuestionSetBySlug = async (slug) => {
  try {
    const q = query(
      collection(db, 'questionSets'),
      where('slug', '==', slug),
      limit(1)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error getting question set by slug:', error);
    throw error;
  }
};
```

### 2. Generate Slug for Question Sets

```javascript
// utils/slugify.js already exists
import { generateSlug, generateUniqueSlug } from './utils/slugify';

// When saving question set
const slug = await generateUniqueSlug(
  title,
  async (testSlug) => {
    const existing = await getQuestionSetBySlug(testSlug);
    return existing !== null;
  }
);
```

## 🔄 Migration Strategy

### Phase 1: Add Slug Field to Existing Data
```javascript
// Run migration script to add slugs to existing question sets
const migrateQuestionSets = async () => {
  const setsSnapshot = await getDocs(collection(db, 'questionSets'));
  
  for (const doc of setsSnapshot.docs) {
    const data = doc.data();
    if (!data.slug) {
      const slug = await generateUniqueSlug(
        data.title || `soal-${doc.id.slice(-6)}`,
        async (testSlug) => {
          const existing = await getQuestionSetBySlug(testSlug);
          return existing !== null;
        }
      );
      
      await updateDoc(doc.ref, { slug });
      console.log(`Added slug "${slug}" to ${doc.id}`);
    }
  }
};
```

### Phase 2: Update Dashboard Links
```javascript
// DashboardView.js - Update onClick handlers
<div 
  onClick={() => {
    // Old: onViewDetail(set.id)
    // New: Navigate to slug-based URL
    navigate(`/cbt/${set.slug}`);
  }}
>
```

### Phase 3: Deprecate Legacy Routes
- Keep `/question` and `/result` for backward compatibility
- Automatically redirect to new slug-based URLs
- Show deprecation notice in console

## 🎨 SEO Benefits

### 1. Readable URLs
```
Before: /question (no context)
After: /cbt/matematika-dasar-set-1 (descriptive)
```

### 2. Shareable Links
Users can share direct links to specific question packages:
```
https://snbtai.com/cbt/penalaran-umum-level-3
https://snbtai.com/tryout/simulasi-utbk-2026/result
```

### 3. Meta Tags (Future Enhancement)
```javascript
// Add to CBTView component
<Helmet>
  <title>{questionSet.title} - SNBT AI</title>
  <meta name="description" content={`Latihan ${questionSet.title} dengan ${questionSet.totalQuestions} soal`} />
  <meta name="robots" content="noindex, nofollow" />
</Helmet>
```

## ⚠️ Important Notes

1. **Session Storage**: Masih digunakan sebagai fallback untuk backward compatibility
2. **404 Handling**: Slug yang tidak ditemukan akan redirect ke 404 page
3. **Authentication**: CBT page tetap bisa diakses tanpa login, tapi hasil tidak tersimpan
4. **Attempt ID**: Untuk result page, gunakan attempt ID dari Firestore

## 🧪 Testing Checklist

- [ ] CBT page dapat diakses via slug: `/cbt/:packageSlug`
- [ ] Result page dapat diakses via attempt ID: `/cbt/result/:attemptId`
- [ ] Tryout page tetap berfungsi: `/tryout/:slug`
- [ ] Legacy routes redirect dengan benar
- [ ] 404 page muncul untuk slug yang tidak valid
- [ ] Session storage fallback berfungsi
- [ ] Slug generation tidak ada duplikat
- [ ] Navigation dari Dashboard menggunakan slug

## 📚 Related Files

- `src/App.js` - Main routing logic
- `src/DashboardView.js` - Dashboard navigation
- `src/firebase.js` - Firestore queries
- `src/utils/slugify.js` - Slug generation utility
- `Document/SLUG_ROUTING_IMPLEMENTATION.md` - Detailed implementation guide

## 🚀 Next Steps

1. Implement `getQuestionSetBySlug` function in firebase.js
2. Add slug field to questionSets collection schema
3. Run migration script for existing data
4. Update Dashboard navigation to use slugs
5. Add meta tags for SEO optimization
6. Test all routing scenarios
7. Deploy and monitor for errors

---

**Status**: ✅ Specification Complete - Ready for Implementation
**Priority**: High
**Estimated Time**: 2-3 hours
