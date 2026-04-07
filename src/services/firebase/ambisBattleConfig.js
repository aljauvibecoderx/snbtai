import { db } from './firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

/**
 * Ambis Battle Subtest Grouping Configuration
 */

// Default subtest groups
export const DEFAULT_SUBTEST_GROUPS = [
  {
    id: 'tps_all',
    name: 'TPS Lengkap',
    subtests: ['tps_pu', 'tps_pk', 'tps_pbm'],
    questionsPerSubtest: 5,
    totalQuestions: 15
  },
  {
    id: 'literasi_all',
    name: 'Literasi Lengkap',
    subtests: ['lit_ind', 'lit_ing'],
    questionsPerSubtest: 5,
    totalQuestions: 10
  },
  {
    id: 'snbt_mini',
    name: 'SNBT Mini',
    subtests: ['tps_pu', 'tps_pk', 'lit_ind', 'pm'],
    questionsPerSubtest: 3,
    totalQuestions: 12
  },
  {
    id: 'snbt_full',
    name: 'SNBT Lengkap',
    subtests: ['tps_pu', 'tps_pk', 'tps_pbm', 'lit_ind', 'lit_ing', 'pm'],
    questionsPerSubtest: 5,
    totalQuestions: 30
  }
];

// Save custom group
export const saveSubtestGroup = async (groupData, userId) => {
  const groupId = groupData.id || `custom_${Date.now()}`;
  await setDoc(doc(db, 'ambis_battle_groups', groupId), {
    ...groupData,
    id: groupId,
    createdBy: userId,
    createdAt: serverTimestamp(),
    isCustom: true
  });
  return groupId;
};

// Get all groups (default + custom)
export const getSubtestGroups = async (userId = null) => {
  const groups = [...DEFAULT_SUBTEST_GROUPS];
  
  if (userId) {
    const q = query(
      collection(db, 'ambis_battle_groups'),
      where('createdBy', '==', userId)
    );
    const snapshot = await getDocs(q);
    const customGroups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    groups.push(...customGroups);
  }
  
  return groups;
};

// Get random questions from subtests
export const getRandomQuestionsFromSubtests = async (subtests, questionsPerSubtest) => {
  const allQuestions = [];
  
  try {
    // Get all public question sets
    const q = query(
      collection(db, 'question_sets'),
      where('visibility', '==', 'public')
    );
    const snapshot = await getDocs(q);
    
    // Process each subtest
    for (const subtest of subtests) {
      const subtestQuestions = [];
      
      // Collect questions from all sets for this subtest
      for (const docSnap of snapshot.docs) {
        const setData = docSnap.data();
        
        // Check if set has questions array
        if (setData.questions && Array.isArray(setData.questions)) {
          // Filter questions by subtest
          const matchingQuestions = setData.questions.filter(q => {
            // Check both subtest field and category field
            return q.subtest === subtest || setData.category === subtest;
          });
          
          // Add to collection with set metadata
          matchingQuestions.forEach(q => {
            subtestQuestions.push({
              ...q,
              setId: docSnap.id,
              setTitle: setData.title || 'Untitled'
            });
          });
        }
      }
      
      // Shuffle and pick random questions
      if (subtestQuestions.length > 0) {
        const shuffled = subtestQuestions.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(questionsPerSubtest, subtestQuestions.length));
        allQuestions.push(...selected);
      }
    }
    
    return allQuestions;
  } catch (error) {
    console.error('Error getting random questions:', error);
    return [];
  }
};

// Save config
export const saveAmbisBattleConfig = async (config, userId) => {
  await setDoc(doc(db, 'ambis_battle_configs', userId), {
    ...config,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

// Get config
export const getAmbisBattleConfig = async (userId) => {
  const docSnap = await getDoc(doc(db, 'ambis_battle_configs', userId));
  if (!docSnap.exists()) {
    return {
      defaultGroup: 'snbt_mini',
      randomizeQuestions: true,
      timerPerQuestion: 30
    };
  }
  return docSnap.data();
};
