import { db } from './firebase';
import { 
  collection, query, where, getDocs, addDoc, updateDoc, 
  doc, serverTimestamp, orderBy, limit, getDoc, deleteDoc, increment, arrayUnion, startAfter
} from 'firebase/firestore';
import { generateUniqueSlug } from '../../utils/slugify';

// Check if user is admin (with caching)
const adminCache = new Map();

export const checkAdminRole = async (userId, forceRefresh = false) => {
  try {
    if (!forceRefresh && adminCache.has(userId)) {
      return adminCache.get(userId);
    }
    
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      console.warn('User document not found:', userId);
      return false;
    }
    
    const userData = userDoc.data();
    console.log('User data fetched:', { uid: userId, email: userData.email, role: userData.role });
    
    // Check if user is admin by role OR by superuser email
    const isAdmin = userData.role === 'admin' || userData.email === 'superuserdeveloper@protonmail.com';
    
    if (isAdmin && userData.role !== 'admin') {
      // Auto-fix: set role to admin if email matches superuser
      await updateDoc(doc(db, 'users', userId), { role: 'admin' });
      console.log('Auto-fixed admin role for superuser email');
    }
    
    adminCache.set(userId, isAdmin);
    setTimeout(() => adminCache.delete(userId), 5 * 60 * 1000);
    
    return isAdmin;
  } catch (error) {
    console.error('Admin check error:', error);
    return false;
  }
};

// Get all questions from global bank with filters
export const getGlobalQuestions = async (filters = {}) => {
  try {
    let q = query(collection(db, 'questions'), limit(50));
    
    if (filters.subtest) {
      q = query(q, where('subtest', '==', filters.subtest));
    }
    if (filters.minLevel) {
      q = query(q, where('level', '>=', filters.minLevel));
    }
    
    q = query(q, orderBy('createdAt', 'desc'));
    
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
    console.error('Error fetching global questions:', error);
    return [];
  }
};

// Check if slug exists
const checkSlugExists = async (slug) => {
  try {
    const q = query(collection(db, 'tryouts'), where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking slug:', error);
    return false;
  }
};

// Create official tryout with proper stats initialization and slug
export const createTryout = async (tryoutData, adminId) => {
  try {
    const isAdmin = await checkAdminRole(adminId);
    console.log('Admin check result:', isAdmin, 'for user:', adminId);
    
    if (!isAdmin) {
      throw new Error('User is not admin. Please ensure role field is set to "admin" in Firestore users collection.');
    }
    
    const slug = await generateUniqueSlug(tryoutData.title, checkSlugExists);
    
    const tryoutRef = await addDoc(collection(db, 'tryouts'), {
      ...tryoutData,
      slug,
      createdBy: adminId,
      createdAt: serverTimestamp(),
      status: 'draft',
      stats: { 
        totalAttempts: 0, 
        averageScore: 0,
        totalScoreAccumulated: 0 
      },
      participatedUserIds: []
    });
    
    await addDoc(collection(db, 'admin_logs'), {
      adminId,
      action: 'create_tryout',
      targetId: tryoutRef.id,
      timestamp: serverTimestamp(),
      details: { title: tryoutData.title, slug }
    });
    
    return tryoutRef.id;
  } catch (error) {
    console.error('Error creating tryout:', error);
    if (error.code === 'resource-exhausted' || error.message?.includes('quota')) {
      throw new Error('SERVER_QUOTA_EXCEEDED');
    }
    throw error;
  }
};

// Publish tryout
export const publishTryout = async (tryoutId, adminId) => {
  try {
    await updateDoc(doc(db, 'tryouts', tryoutId), {
      status: 'published',
      publishedAt: serverTimestamp()
    });
    
    await addDoc(collection(db, 'admin_logs'), {
      adminId,
      action: 'publish_tryout',
      targetId: tryoutId,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error publishing tryout:', error);
    throw error;
  }
};

// Get published tryouts
export const getPublishedTryouts = async () => {
  try {
    const q = query(
      collection(db, 'tryouts'),
      where('status', '==', 'published')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching tryouts:', error);
    return [];
  }
};

// Get draft tryouts (admin only)
export const getDraftTryouts = async (adminId) => {
  try {
    const q = query(
      collection(db, 'tryouts'),
      where('status', '==', 'draft')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching draft tryouts:', error);
    return [];
  }
};

// Save tryout attempt with live aggregation
export const saveTryoutAttempt = async (attemptData) => {
  try {
    // 1. Save attempt to history
    const attemptRef = await addDoc(collection(db, 'tryout_attempts'), {
      ...attemptData,
      completedAt: serverTimestamp()
    });
    
    // 2. Update tryout stats with atomic increment
    const tryoutRef = doc(db, 'tryouts', attemptData.tryoutId);
    await updateDoc(tryoutRef, {
      'stats.totalAttempts': increment(1),
      'stats.totalScoreAccumulated': increment(attemptData.irtScore || attemptData.score || 0),
      participatedUserIds: arrayUnion(attemptData.userId)
    });
    
    // 3. Recalculate average (read after write)
    const tryoutDoc = await getDoc(tryoutRef);
    if (tryoutDoc.exists()) {
      const stats = tryoutDoc.data().stats;
      const newAvg = stats.totalScoreAccumulated / stats.totalAttempts;
      await updateDoc(tryoutRef, {
        'stats.averageScore': newAvg
      });
    }
    
    return attemptRef.id;
  } catch (error) {
    console.error('Error saving attempt:', error);
    if (error.code === 'resource-exhausted' || error.message?.includes('quota')) {
      throw new Error('SERVER_QUOTA_EXCEEDED');
    }
    throw error;
  }
};

// Get leaderboard
export const getTryoutLeaderboard = async (tryoutId, limitCount = 10) => {
  try {
    const q = query(
      collection(db, 'tryout_attempts'),
      where('tryoutId', '==', tryoutId),
      orderBy('irtScore', 'desc'),
      orderBy('timeUsed', 'asc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    
    const leaderboard = [];
    for (let i = 0; i < snapshot.docs.length; i++) {
      const attemptData = snapshot.docs[i].data();
      const userDoc = await getDoc(doc(db, 'users', attemptData.userId));
      leaderboard.push({
        rank: i + 1,
        id: snapshot.docs[i].id,
        ...attemptData,
        userName: userDoc.exists() ? userDoc.data().displayName : 'Anonymous'
      });
    }
    
    return leaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

// Create admin question manually
export const createAdminQuestion = async (questionData, adminId) => {
  try {
    const questionRef = await addDoc(collection(db, 'questions'), {
      ...questionData,
      createdBy: adminId,
      createdByAdmin: true,
      isOfficial: true,
      createdAt: serverTimestamp()
    });
    
    await addDoc(collection(db, 'admin_logs'), {
      adminId,
      action: 'create_question',
      targetId: questionRef.id,
      timestamp: serverTimestamp()
    });
    
    return questionRef.id;
  } catch (error) {
    console.error('Error creating admin question:', error);
    throw error;
  }
};

// Delete tryout
export const deleteTryout = async (tryoutId, adminId) => {
  try {
    await deleteDoc(doc(db, 'tryouts', tryoutId));
    
    await addDoc(collection(db, 'admin_logs'), {
      adminId,
      action: 'delete_tryout',
      targetId: tryoutId,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error deleting tryout:', error);
    throw error;
  }
};

// Get tryout by ID
export const getTryoutById = async (tryoutId) => {
  try {
    const tryoutDoc = await getDoc(doc(db, 'tryouts', tryoutId));
    if (!tryoutDoc.exists()) return null;
    return { id: tryoutDoc.id, ...tryoutDoc.data() };
  } catch (error) {
    console.error('Error getting tryout:', error);
    if (error.code === 'resource-exhausted' || error.message?.includes('quota')) {
      throw new Error('SERVER_QUOTA_EXCEEDED');
    }
    return null;
  }
};

// Get tryout by slug
export const getTryoutBySlug = async (slug) => {
  try {
    const q = query(collection(db, 'tryouts'), where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error getting tryout by slug:', error);
    if (error.code === 'resource-exhausted' || error.message?.includes('quota')) {
      throw new Error('SERVER_QUOTA_EXCEEDED');
    }
    return null;
  }
};

// Get questions for tryout
export const getTryoutQuestions = async (questionsList) => {
  try {
    const questions = [];
    for (const item of questionsList) {
      const qDoc = await getDoc(doc(db, 'questions', item.qid));
      if (qDoc.exists()) {
        const data = qDoc.data();
        if (data.representation && typeof data.representation.data === 'string') {
          try {
            data.representation.data = JSON.parse(data.representation.data);
          } catch (e) {}
        }
        questions.push({ id: qDoc.id, ...data, order: item.order });
      }
    }
    return questions.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error getting tryout questions:', error);
    return [];
  }
};

// Get user's tryout attempts
export const getUserTryoutAttempts = async (userId) => {
  try {
    const q = query(
      collection(db, 'tryout_attempts'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching user tryout attempts:', error);
    return [];
  }
};

// Update tryout
export const updateTryout = async (tryoutId, updateData, adminId) => {
  try {
    await updateDoc(doc(db, 'tryouts', tryoutId), updateData);
    
    await addDoc(collection(db, 'admin_logs'), {
      adminId,
      action: 'update_tryout',
      targetId: tryoutId,
      timestamp: serverTimestamp(),
      details: updateData
    });
  } catch (error) {
    console.error('Error updating tryout:', error);
    throw error;
  }
};

// Delete question set (entire package)
export const deleteQuestionSet = async (setId, adminId) => {
  try {
    const setDoc = await getDoc(doc(db, 'question_sets', setId));
    const setData = setDoc.data();
    
    await deleteDoc(doc(db, 'question_sets', setId));
    
    await addDoc(collection(db, 'admin_logs'), {
      adminId,
      action: 'delete_question_set',
      targetId: setId,
      timestamp: serverTimestamp(),
      details: { 
        title: setData?.title || 'Untitled',
        totalQuestions: setData?.questions?.length || 0,
        category: setData?.category || 'Unknown'
      }
    });
  } catch (error) {
    console.error('Error deleting question set:', error);
    throw error;
  }
};

// Get all question sets for management with pagination
export const getAllQuestionSetsForManagement = async (sortBy = 'createdAt', order = 'desc', pageSize = 50, lastDoc = null) => {
  try {
    const orderField = sortBy === 'title' ? 'title' : sortBy === 'subtest' ? 'category' : 'createdAt';
    const orderDir = order === 'desc' ? 'desc' : 'asc';
    
    let q = query(
      collection(db, 'question_sets'),
      orderBy(orderField, orderDir),
      limit(pageSize + 1)
    );
    
    if (lastDoc) {
      q = query(
        collection(db, 'question_sets'),
        orderBy(orderField, orderDir),
        startAfter(lastDoc),
        limit(pageSize + 1)
      );
    }
    
    const snapshot = await getDocs(q);
    const docs = snapshot.docs;
    const hasMore = docs.length > pageSize;
    const items = docs.slice(0, pageSize);
    
    const allSets = items.map(setDoc => {
      const setData = setDoc.data();
      const totalQuestions = setData.questions?.length || 0;
      let subtest = setData.category || '';
      if (setData.questions && setData.questions.length > 0) {
        subtest = setData.questions[0].subtest || setData.category || '';
      }
      
      return {
        id: setDoc.id,
        title: setData.title || `Paket ${setData.category || 'Soal'}`,
        subtest: subtest,
        totalQuestions: totalQuestions,
        createdAt: setData.createdAt || new Date(),
        category: setData.category,
        ...setData,
        _doc: setDoc
      };
    });
    
    return {
      data: allSets,
      hasMore: hasMore,
      lastDoc: items.length > 0 ? items[items.length - 1] : null
    };
  } catch (error) {
    console.error('Error fetching question sets:', error);
    return { data: [], hasMore: false, lastDoc: null };
  }
};
