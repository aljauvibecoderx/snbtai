import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, deleteDoc, serverTimestamp, orderBy, onSnapshot } from 'firebase/firestore';

// Save vocab word
export const saveVocab = async (userId, vocabData) => {
  try {
    const vocabRef = collection(db, 'vocab');
    const docRef = await addDoc(vocabRef, {
      userId,
      word: vocabData.word,
      meaning: vocabData.meaning,
      example: vocabData.example || '',
      source: vocabData.source || 'highlight', // 'highlight' or 'manual_search'
      savedAt: serverTimestamp(),
      lastReviewed: null,
      reviewCount: 0,
      nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      mastered: false,
      xpEarned: 5
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving vocab:', error);
    throw error;
  }
};

// Get vocab list for user
export const getVocabList = async (userId) => {
  try {
    const vocabRef = collection(db, 'vocab');
    const q = query(vocabRef, where('userId', '==', userId), orderBy('savedAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      savedAt: doc.data().savedAt?.toDate(),
      lastReviewed: doc.data().lastReviewed?.toDate(),
      nextReview: doc.data().nextReview?.toDate?.() || new Date(doc.data().nextReview)
    }));
  } catch (error) {
    console.error('Error getting vocab list:', error);
    return [];
  }
};

// Get vocab stats
export const getVocabStats = async (userId) => {
  try {
    const vocabList = await getVocabList(userId);
    const now = new Date();
    
    const needReview = vocabList.filter(v => 
      v.nextReview && new Date(v.nextReview) <= now && !v.mastered
    ).length;
    
    const mastered = vocabList.filter(v => v.mastered).length;
    const totalXP = vocabList.reduce((sum, v) => sum + (v.xpEarned || 5), 0);
    
    return {
      total: vocabList.length,
      xp: totalXP,
      needReview,
      mastered
    };
  } catch (error) {
    console.error('Error getting vocab stats:', error);
    return { total: 0, xp: 0, needReview: 0, mastered: 0 };
  }
};

// Update vocab review (Spaced Repetition)
export const updateVocabReview = async (vocabId, isCorrect) => {
  try {
    const vocabRef = doc(db, 'vocab', vocabId);
    const vocabDoc = await getDocs(query(collection(db, 'vocab'), where('__name__', '==', vocabId)));
    
    if (vocabDoc.empty) return;
    
    const vocabData = vocabDoc.docs[0].data();
    const reviewCount = (vocabData.reviewCount || 0) + 1;
    
    // Spaced Repetition Algorithm (SM-2 simplified)
    let nextReviewDays = 1;
    if (isCorrect) {
      if (reviewCount === 1) nextReviewDays = 1;
      else if (reviewCount === 2) nextReviewDays = 3;
      else if (reviewCount === 3) nextReviewDays = 7;
      else if (reviewCount === 4) nextReviewDays = 14;
      else nextReviewDays = 30;
    } else {
      nextReviewDays = 1; // Reset if wrong
    }
    
    const nextReview = new Date(Date.now() + nextReviewDays * 24 * 60 * 60 * 1000);
    const mastered = reviewCount >= 5 && isCorrect;
    
    await updateDoc(vocabRef, {
      lastReviewed: serverTimestamp(),
      reviewCount,
      nextReview,
      mastered,
      xpEarned: (vocabData.xpEarned || 5) + (isCorrect ? 10 : 0)
    });
  } catch (error) {
    console.error('Error updating vocab review:', error);
    throw error;
  }
};

// Update vocab
export const updateVocab = async (vocabId, updates) => {
  try {
    const vocabRef = doc(db, 'vocab', vocabId);
    await updateDoc(vocabRef, updates);
  } catch (error) {
    console.error('Error updating vocab:', error);
    throw error;
  }
};

// Delete vocab
export const deleteVocab = async (vocabId) => {
  try {
    const vocabRef = doc(db, 'vocab', vocabId);
    await deleteDoc(vocabRef);
  } catch (error) {
    console.error('Error deleting vocab:', error);
    throw error;
  }
};

// Get vocab words that need review
export const getVocabNeedReview = async (userId) => {
  try {
    const vocabList = await getVocabList(userId);
    const now = new Date();
    
    return vocabList.filter(v => 
      v.nextReview && new Date(v.nextReview) <= now && !v.mastered
    );
  } catch (error) {
    console.error('Error getting vocab need review:', error);
    return [];
  }
};

// Check if word already saved
export const checkVocabExists = async (userId, word) => {
  try {
    const vocabRef = collection(db, 'vocab');
    const q = query(
      vocabRef,
      where('userId', '==', userId),
      where('word', '==', word.toLowerCase())
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking vocab exists:', error);
    return false;
  }
};

// Real-time listener for vocab list
export const subscribeToVocabList = (userId, callback) => {
  try {
    const vocabRef = collection(db, 'vocab');
    const q = query(vocabRef, where('userId', '==', userId), orderBy('savedAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const vocabList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        savedAt: doc.data().savedAt?.toDate(),
        lastReviewed: doc.data().lastReviewed?.toDate(),
        nextReview: doc.data().nextReview?.toDate?.() || new Date(doc.data().nextReview)
      }));
      callback(vocabList);
    }, (error) => {
      console.error('Error in vocab listener:', error);
      callback([]);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up vocab listener:', error);
    return () => {};
  }
};

// Get vocab by word
export const getVocabByWord = async (userId, word) => {
  try {
    const vocabRef = collection(db, 'vocab');
    const q = query(
      vocabRef,
      where('userId', '==', userId),
      where('word', '==', word.toLowerCase())
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      savedAt: doc.data().savedAt?.toDate(),
      lastReviewed: doc.data().lastReviewed?.toDate(),
      nextReview: doc.data().nextReview?.toDate?.() || new Date(doc.data().nextReview)
    };
  } catch (error) {
    console.error('Error getting vocab by word:', error);
    return null;
  }
};
