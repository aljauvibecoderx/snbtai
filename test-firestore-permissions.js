/**
 * Firestore Permission Test Script
 * 
 * Run this in browser console (F12) to diagnose permission issues
 * 
 * Usage:
 * 1. Open browser console (F12)
 * 2. Copy-paste this entire script
 * 3. Press Enter
 * 4. Check output for errors
 */

(async () => {
  console.clear();
  console.log('=== 🔍 FIRESTORE PERMISSION DIAGNOSTIC ===\n');
  
  // 1. Check Authentication
  console.log('1️⃣ Checking Authentication...');
  const user = firebase.auth().currentUser;
  
  if (!user) {
    console.error('❌ NOT AUTHENTICATED! Please login first.');
    return;
  }
  
  console.log('✅ Authenticated');
  console.log('   UID:', user.uid);
  console.log('   Email:', user.email || 'N/A');
  console.log();
  
  // 2. Import Firestore functions
  console.log('2️⃣ Loading Firestore...');
  let db, doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where;
  
  try {
    const firestore = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js');
    db = window.db || window.firebaseApp?.firestore();
    
    if (!db) {
      // Try to get from existing app
      const { db: appDb } = await import('./services/firebase/firebase.js');
      db = appDb;
    }
    
    doc = firestore.doc;
    getDoc = firestore.getDoc;
    setDoc = firestore.setDoc;
    updateDoc = firestore.updateDoc;
    collection = firestore.collection;
    getDocs = firestore.getDocs;
    query = firestore.query;
    where = firestore.where;
    
    console.log('✅ Firestore loaded\n');
  } catch (e) {
    console.error('❌ Failed to load Firestore:', e.message);
    return;
  }
  
  // 3. Test user_progress
  console.log('3️⃣ Testing user_progress collection...');
  const progressRef = doc(db, 'user_progress', user.uid);
  
  try {
    // Try to read
    const progressSnap = await getDoc(progressRef);
    console.log('✅ READ user_progress:', progressSnap.exists() ? 'Document exists' : 'Document not found');
    
    // Try to write
    const testData = {
      userId: user.uid,
      test: true,
      lastUpdated: new Date(),
      totalProgress: 0,
      statistics: {
        totalQuestionsAnswered: 0,
        totalCorrectAnswers: 0,
        totalSetsCompleted: 0
      }
    };
    
    await setDoc(progressRef, testData, { merge: true });
    console.log('✅ WRITE user_progress: SUCCESS');
    
    // Verify write
    const verifySnap = await getDoc(progressRef);
    console.log('✅ VERIFY user_progress:', verifySnap.exists());
    
  } catch (error) {
    console.error('❌ user_progress FAILED');
    console.error('   Error Code:', error.code);
    console.error('   Error Message:', error.message);
    
    if (error.code === 'permission-denied') {
      console.error('\   ⚠️  PERMISSION DENIED!');
      console.error('   → Rules not deployed correctly');
      console.error('   → Document ID does not match user UID');
      console.error('   → Firestore rules need to be updated');
    }
  }
  
  console.log();
  
  // 4. Test user_metrics
  console.log('4️⃣ Testing user_metrics collection...');
  const metricsRef = doc(db, 'user_metrics', user.uid);
  
  try {
    const metricsSnap = await getDoc(metricsRef);
    console.log('✅ READ user_metrics:', metricsSnap.exists() ? 'Document exists' : 'Document not found');
    
    const metricsData = {
      userId: user.uid,
      test: true,
      currentStreak: 0,
      longestStreak: 0,
      totalPoints: 0,
      todayCorrect: 0,
      todayWrong: 0
    };
    
    await setDoc(metricsRef, metricsData, { merge: true });
    console.log('✅ WRITE user_metrics: SUCCESS');
    
  } catch (error) {
    console.error('❌ user_metrics FAILED');
    console.error('   Error Code:', error.code);
    console.error('   Error Message:', error.message);
  }
  
  console.log();
  
  // 5. Test question_completions (create)
  console.log('5️⃣ Testing question_completions collection...');
  const completionsCol = collection(db, 'question_completions');
  
  try {
    const { serverTimestamp } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js');
    
    const completionData = {
      userId: user.uid,
      questionSetId: 'test-123',
      category: 'test',
      difficulty: 1,
      totalQuestions: 5,
      score: 80,
      correctCount: 4,
      timeUsed: 300,
      completedAt: serverTimestamp(),
      source: 'test'
    };
    
    // Try to create
    const { addDoc } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js');
    const newDocRef = await addDoc(completionsCol, completionData);
    console.log('✅ CREATE question_completions: SUCCESS (ID:', newDocRef.id, ')');
    
  } catch (error) {
    console.error('❌ question_completions FAILED');
    console.error('   Error Code:', error.code);
    console.error('   Error Message:', error.message);
  }
  
  console.log();
  console.log('=== 🔍 DIAGNOSTIC COMPLETE ===\n');
  
  // Summary
  console.log('SUMMARY:');
  console.log('--------');
  console.log('If you see ✅ for all tests: Firestore is working perfectly!');
  console.log('If you see ❌ for any test: Check Firestore rules deployment');
  console.log();
  console.log('Next Steps:');
  console.log('1. If all tests failed → Deploy Firestore rules');
  console.log('2. If some tests passed → Check specific collection rules');
  console.log('3. If all tests passed → Clear browser cache (Ctrl+Shift+R)');
  console.log();
  console.log('To deploy rules:');
  console.log('  → Double-click: deploy-firestore-rules.bat');
  console.log('  → Or run: firebase deploy --only firestore:rules');
  console.log();
})();
