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
  
  for (const subtest of subtests) {
    const q = query(
      collection(db, 'question_sets'),
      where('visibility', '==', 'public')
    );
    const snapshot = await getDocs(q);
    
    const validSets = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(set => {
        if (!set.questions || set.questions.length === 0) return false;
        return set.questions.some(q => q.subtest === subtest);
      });
    
    const subtestQuestions = [];
    for (const set of validSets) {
      const questions = set.questions.filter(q => q.subtest === subtest);
      subtestQuestions.push(...questions.map(q => ({ ...q, setId: set.id })));
    }
    
    // Shuffle and pick random
    const shuffled = subtestQuestions.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, questionsPerSubtest);
    
    allQuestions.push(...selected);
  }
  
  return allQuestions;
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
