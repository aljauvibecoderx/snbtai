import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, getDocs, orderBy, updateDoc, arrayUnion, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { FIREBASE_CONFIG } from '../../config/config';

const app = initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Auto-set admin role for superuser email
    if (user.email === 'superuserdeveloper@protonmail.com') {
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: 'admin',
        lastLogin: serverTimestamp()
      }, { merge: true });
    }
    
    return user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export const saveUserData = async (userId, data) => {
  try {
    if (data.email === 'superuserdeveloper@protonmail.com') {
      data.role = 'admin';
    }
    await setDoc(doc(db, 'users', userId), data, { merge: true });
  } catch (error) {
    console.error("Save error:", error);
    throw error;
  }
};

export const getUserData = async (userId) => {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Get data error:", error);
    return null;
  }
};

export const saveQuestionSet = async (setData, userId) => {
  try {
    const setRef = await addDoc(collection(db, 'question_sets'), {
      ...setData,
      createdBy: userId,
      createdAt: serverTimestamp(),
      visibility: 'public'
    });
    return setRef.id;
  } catch (error) {
    console.error('Error saving question set:', error);
    throw error;
  }
};

export const saveQuestion = async (questionData, userId, setId) => {
  try {
    const flattenRepresentation = (rep) => {
      if (!rep || !rep.data) return rep;
      
      if (rep.type === 'table' && Array.isArray(rep.data)) {
        return { type: 'table', data: JSON.stringify(rep.data) };
      }
      if (rep.type === 'thread' && rep.data.posts) {
        return { type: 'thread', data: JSON.stringify(rep.data) };
      }
      if (rep.type === 'chart' && rep.data.points) {
        return { type: 'chart', data: JSON.stringify(rep.data) };
      }
      if (rep.type === 'flowchart' && rep.data.nodes) {
        return { type: 'flowchart', data: JSON.stringify(rep.data) };
      }
      if (rep.type === 'shape' && rep.data) {
        return { type: 'shape', data: JSON.stringify(rep.data) };
      }
      if (rep.type === 'function' && rep.data) {
        return { type: 'function', data: JSON.stringify(rep.data) };
      }
      if (rep.type === 'grid_boolean' && rep.data) {
        return { type: 'grid_boolean', data: JSON.stringify(rep.data) };
      }
      return rep;
    };
    
    const sanitizedData = {
      ...questionData,
      type: questionData.type || 'regular',
      representation: flattenRepresentation(questionData.representation),
      ...(questionData.grid_data && { grid_data: questionData.grid_data }),
      ...(questionData.p_value && { p_value: questionData.p_value }),
      ...(questionData.q_value && { q_value: questionData.q_value }),
      ...(questionData.statements && { statements: questionData.statements })
    };
    
    const questionRef = await addDoc(collection(db, 'questions'), {
      ...sanitizedData,
      setId: setId,
      createdBy: userId,
      createdAt: serverTimestamp()
    });
    
    return questionRef.id;
  } catch (error) {
    console.error('Error saving question:', error);
    throw error;
  }
};

export const getMySets = async (userId) => {
  try {
    const qNew = query(
      collection(db, 'question_sets'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const newSnapshot = await getDocs(qNew);
    const newSets = newSnapshot.docs.map(doc => {
      const data = doc.data();
      const totalQuestions = data.questions?.length || 0;
      const subtestSummary = {};
      if (data.questions) {
        data.questions.forEach(q => {
          const subtest = q.subtest || data.category;
          subtestSummary[subtest] = (subtestSummary[subtest] || 0) + 1;
        });
      }
      return { 
        id: doc.id, 
        ...data,
        totalQuestions,
        subtestSummary: Object.keys(subtestSummary).length > 0 ? subtestSummary : data.subtestSummary,
        complexity: data.difficulty || data.complexity || 3,
        title: data.source === 'AI Lens' ? `AI Lens - ${data.category}` : `Latihan ${data.category}`
      };
    });
    
    const q = query(
      collection(db, 'question_sets'),
      where('createdBy', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    const oldSets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const allSets = [...newSets, ...oldSets];
    const uniqueSets = allSets.filter((set, index, self) => 
      index === self.findIndex(s => s.id === set.id)
    );
    
    return uniqueSets;
  } catch (error) {
    console.error('Error getting sets:', error);
    return [];
  }
};

export const getQuestionsBySetId = async (setId) => {
  try {
    const setDoc = await getDoc(doc(db, 'question_sets', setId));
    if (setDoc.exists()) {
      const data = setDoc.data();
      if (data.questions && Array.isArray(data.questions)) {
        return data.questions.map(q => {
          if (q.representation && typeof q.representation.data === 'string') {
            try {
              q.representation.data = JSON.parse(q.representation.data);
            } catch (e) {}
          }
          return q;
        });
      }
    }
    
    if (setId === 'legacy') {
      const q = query(collection(db, 'questions'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        if (data.representation && typeof data.representation.data === 'string') {
          try {
            data.representation.data = JSON.parse(data.representation.data);
          } catch (e) {}
        }
        return { id: doc.id, ...data };
      });
    }
    
    const q = query(
      collection(db, 'questions'),
      where('setId', '==', setId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      if (data.representation && typeof data.representation.data === 'string') {
        try {
          data.representation.data = JSON.parse(data.representation.data);
        } catch (e) {}
      }
      return { id: doc.id, ...data };
    });
  } catch (error) {
    console.error('Error getting questions by set:', error);
    return [];
  }
};

export const getPublicSets = async (subtestFilter = null) => {
  try {
    const q = query(
      collection(db, 'question_sets'),
      where('visibility', '==', 'public')
    );
    const snapshot = await getDocs(q);
    const sets = snapshot.docs.map(doc => {
      const data = doc.data();
      const totalQuestions = data.questions?.length || 0;
      const subtestSummary = {};
      if (data.questions) {
        data.questions.forEach(q => {
          const subtest = q.subtest || data.category;
          subtestSummary[subtest] = (subtestSummary[subtest] || 0) + 1;
        });
      }
      return { 
        id: doc.id, 
        ...data,
        totalQuestions,
        subtestSummary: Object.keys(subtestSummary).length > 0 ? subtestSummary : data.subtestSummary,
        complexity: data.difficulty || data.complexity || 3,
        title: data.title || `Latihan ${data.category || 'SNBT'}`
      };
    });
    
    return sets;
  } catch (error) {
    console.error('Error getting public sets:', error);
    return [];
  }
};

export const getQuestionById = async (questionId) => {
  try {
    const docRef = doc(db, 'questions', questionId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    
    const data = docSnap.data();
    
    if (data.representation && typeof data.representation.data === 'string') {
      try {
        data.representation.data = JSON.parse(data.representation.data);
      } catch (e) {}
    }
    
    return { id: docSnap.id, ...data };
  } catch (error) {
    console.error('Error getting question:', error);
    return null;
  }
};

export const getMyQuestions = async (userId) => {
  const sets = await getMySets(userId);
  return sets;
};

export const getPublicQuestions = async () => {
  const sets = await getPublicSets();
  return sets;
};

export const saveAttempt = async (attemptData) => {
  try {
    const attemptRef = await addDoc(collection(db, 'attempts'), {
      ...attemptData,
      status: 'active',
      startedAt: serverTimestamp(),
      lastActiveAt: serverTimestamp(),
      totalPausedDuration: 0
    });
    return attemptRef.id;
  } catch (error) {
    console.error('Error saving attempt:', error);
    throw error;
  }
};

export const updateAttemptStatus = async (attemptId, status, additionalData = {}) => {
  try {
    const attemptRef = doc(db, 'attempts', attemptId);
    await updateDoc(attemptRef, {
      status,
      lastActiveAt: serverTimestamp(),
      ...additionalData
    });
  } catch (error) {
    console.error('Error updating attempt:', error);
    throw error;
  }
};

export const finishAttempt = async (attemptId, finalData) => {
  try {
    const attemptRef = doc(db, 'attempts', attemptId);
    await updateDoc(attemptRef, {
      ...finalData,
      status: 'finished',
      finishedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error finishing attempt:', error);
    throw error;
  }
};

export const getMyAttempts = async (userId) => {
  try {
    const q = query(
      collection(db, 'attempts'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting attempts:', error);
    return [];
  }
};

export const deleteQuestionSet = async (setId, userId) => {
  try {
    const q = query(
      collection(db, 'questions'),
      where('setId', '==', setId),
      where('createdBy', '==', userId)
    );
    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    await deleteDoc(doc(db, 'question_sets', setId));
    
    return true;
  } catch (error) {
    console.error('Error deleting question set:', error);
    throw error;
  }
};

export const getTotalQuestionsCount = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'questions'));
    return snapshot.size;
  } catch (error) {
    console.error('Error getting total questions count:', error);
    return 0;
  }
};

export const saveQuestionSetWithId = async (questionSetData, userId) => {
  try {
    const questionSetRef = await addDoc(collection(db, 'question_sets'), {
      ...questionSetData,
      userId,
      visibility: 'public',
      createdAt: serverTimestamp()
    });
    return questionSetRef.id;
  } catch (error) {
    console.error('Error saving question set:', error);
    throw error;
  }
};

export const getQuestionSetById = async (questionSetId) => {
  try {
    const docRef = doc(db, 'question_sets', questionSetId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error('Error getting question set:', error);
    return null;
  }
};

export const saveResultWithId = async (resultData, userId) => {
  try {
    const resultRef = await addDoc(collection(db, 'results'), {
      ...resultData,
      userId,
      completedAt: serverTimestamp()
    });
    return resultRef.id;
  } catch (error) {
    console.error('Error saving result:', error);
    throw error;
  }
};

export const getResultById = async (resultId) => {
  try {
    const docRef = doc(db, 'results', resultId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error('Error getting result:', error);
    return null;
  }
};

export const saveToBankSoal = async (questionSetId, userId, category) => {
  try {
    await addDoc(collection(db, 'bank_soal'), {
      questionSetId,
      userId,
      category,
      savedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error saving to bank soal:', error);
    throw error;
  }
};

export const saveToSoalSaya = async (questionSetId, resultId, userId, category) => {
  try {
    await addDoc(collection(db, 'soal_saya'), {
      questionSetId,
      resultId,
      userId,
      category,
      completedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error saving to soal saya:', error);
    throw error;
  }
};

export const getBankSoal = async (userId) => {
  try {
    const q = query(
      collection(db, 'bank_soal'),
      where('userId', '==', userId),
      orderBy('savedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting bank soal:', error);
    return [];
  }
};

export const getSoalSaya = async (userId) => {
  try {
    const q = query(
      collection(db, 'soal_saya'),
      where('userId', '==', userId),
      orderBy('completedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting soal saya:', error);
    return [];
  }
};

export const addToWishlist = async (userId, questionData) => {
  try {
    const wishlistRef = await addDoc(collection(db, 'wishlist'), {
      userId,
      questionSetId: questionData.setId,
      questionIndex: questionData.questionIndex,
      subtest: questionData.subtest,
      setTitle: questionData.setTitle,
      question: questionData.question,
      savedAt: serverTimestamp()
    });
    return wishlistRef.id;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

export const removeFromWishlist = async (wishlistId) => {
  try {
    await deleteDoc(doc(db, 'wishlist', wishlistId));
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

export const getWishlist = async (userId) => {
  try {
    const q = query(
      collection(db, 'wishlist'),
      where('userId', '==', userId),
      orderBy('savedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting wishlist:', error);
    return [];
  }
};

export const checkWishlistStatus = async (userId, questionSetId, questionIndex) => {
  try {
    const q = query(
      collection(db, 'wishlist'),
      where('userId', '==', userId),
      where('questionSetId', '==', questionSetId),
      where('questionIndex', '==', questionIndex)
    );
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : snapshot.docs[0].id;
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    return null;
  }
};

// Token Management Functions
export const getUserTokenBalance = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return data.tokenBalance || 0;
    }
    return 0;
  } catch (error) {
    console.error('Error getting token balance:', error);
    return 0;
  }
};

export const addTokens = async (userId, amount, transactionId = null) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    let currentBalance = 0;
    if (userDoc.exists()) {
      currentBalance = userDoc.data().tokenBalance || 0;
    }
    
    const newBalance = currentBalance + amount;
    
    await setDoc(userRef, {
      tokenBalance: newBalance,
      lastTokenUpdate: serverTimestamp()
    }, { merge: true });
    
    // Log transaction
    if (transactionId) {
      await addDoc(collection(db, 'token_transactions'), {
        userId,
        type: 'purchase',
        amount,
        transactionId,
        balanceBefore: currentBalance,
        balanceAfter: newBalance,
        timestamp: serverTimestamp()
      });
    }
    
    return newBalance;
  } catch (error) {
    console.error('Error adding tokens:', error);
    throw error;
  }
};

export const spendTokens = async (userId, amount, reason = 'question_generation') => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    const currentBalance = userDoc.data().tokenBalance || 0;
    
    if (currentBalance < amount) {
      throw new Error('Insufficient token balance');
    }
    
    const newBalance = currentBalance - amount;
    
    await setDoc(userRef, {
      tokenBalance: newBalance,
      lastTokenUpdate: serverTimestamp()
    }, { merge: true });
    
    // Log transaction
    await addDoc(collection(db, 'token_transactions'), {
      userId,
      type: 'spend',
      amount: -amount,
      reason,
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
      timestamp: serverTimestamp()
    });
    
    return newBalance;
  } catch (error) {
    console.error('Error spending tokens:', error);
    throw error;
  }
};

export const getTokenTransactions = async (userId) => {
  try {
    const q = query(
      collection(db, 'token_transactions'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting token transactions:', error);
    return [];
  }
};
