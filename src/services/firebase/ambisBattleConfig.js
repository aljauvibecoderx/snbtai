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
    subtests: ['tps_pu', 'tps_pk', 'tps_pbm', 'tps_ppu'],
    questionsPerSubtest: 5,
    totalQuestions: 20
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
    subtests: ['tps_pu', 'tps_pk', 'tps_pbm', 'tps_ppu', 'lit_ind', 'lit_ing', 'pm'],
    questionsPerSubtest: 5,
    totalQuestions: 35
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
export const getRandomQuestionsFromSubtests = async (subtests, questionsPerSubtest, userId = null) => {
  const allQuestions = [];
  
  try {
    // Get all public question sets
    const q = query(
      collection(db, 'question_sets'),
      where('visibility', '==', 'public')
    );
    const snapshot = await getDocs(q);
    
    console.log('Found public question sets:', snapshot.docs.length);
    console.log('Looking for subtests:', subtests);
    
    // Process each subtest
    for (const subtest of subtests) {
      const subtestQuestions = [];
      
      // Collect questions from all sets for this subtest
      for (const docSnap of snapshot.docs) {
        const setData = docSnap.data();
        
        // Check if set has questions array
        if (setData.questions && Array.isArray(setData.questions)) {
          // Filter questions by subtest - check multiple possible fields
          // Also filter out questions with empty or missing options
          const matchingQuestions = setData.questions.filter(q => {
            // Check multiple ways subtest can be stored
            const matchesSubtest = q.subtest === subtest || 
                   q.category === subtest || 
                   setData.category === subtest ||
                   setData.subtest === subtest;
            
            // Validate question has proper options
            const hasValidOptions = q.options && 
                                   Array.isArray(q.options) && 
                                   q.options.length > 0;
            
            // Validate required fields
            const hasRequiredFields = q.text && 
                                     q.correctIndex !== undefined;
            
            if (matchesSubtest && !hasValidOptions) {
              console.warn(`Question skipped: missing or empty options. Set: "${setData.title}"`, q);
            }
            
            return matchesSubtest && hasValidOptions && hasRequiredFields;
          });
          
          console.log(`Set "${setData.title}" has ${matchingQuestions.length} matching questions for subtest ${subtest}`);
          
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
      
      console.log(`Total questions for subtest ${subtest}: ${subtestQuestions.length}`);
      
      // Shuffle and pick random questions
      if (subtestQuestions.length > 0) {
        const shuffled = subtestQuestions.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(questionsPerSubtest, subtestQuestions.length));
        allQuestions.push(...selected);
        console.log(`Selected ${selected.length} questions for subtest ${subtest}`);
      } else {
        console.warn(`No questions found for subtest ${subtest}`);
      }
    }
    
    console.log(`Total questions collected: ${allQuestions.length}`);
    
    // If no questions found and userId provided, try user's private sets
    if (allQuestions.length === 0 && userId) {
      console.log('No public questions found, trying user private sets...');
      
      try {
        const userQ = query(
          collection(db, 'question_sets'),
          where('createdBy', '==', userId)
        );
        const userSnapshot = await getDocs(userQ);
        
        console.log('Found user question sets:', userSnapshot.docs.length);
        
        // Process each subtest again with user sets
        for (const subtest of subtests) {
          const subtestQuestions = [];
          
          for (const docSnap of userSnapshot.docs) {
            const setData = docSnap.data();
            
            if (setData.questions && Array.isArray(setData.questions)) {
              const matchingQuestions = setData.questions.filter(q => {
                const matchesSubtest = q.subtest === subtest || 
                       q.category === subtest || 
                       setData.category === subtest ||
                       setData.subtest === subtest;
                
                // Validate question has proper options
                const hasValidOptions = q.options && 
                                       Array.isArray(q.options) && 
                                       q.options.length > 0;
                
                // Validate required fields
                const hasRequiredFields = q.text && 
                                         q.correctIndex !== undefined;
                
                if (matchesSubtest && !hasValidOptions) {
                  console.warn(`Question skipped in user set: missing or empty options. Set: "${setData.title}"`, q);
                }
                
                return matchesSubtest && hasValidOptions && hasRequiredFields;
              });
              
              console.log(`User set "${setData.title}" has ${matchingQuestions.length} valid matching questions for subtest ${subtest}`);
              
              matchingQuestions.forEach(q => {
                subtestQuestions.push({
                  ...q,
                  setId: docSnap.id,
                  setTitle: setData.title || 'Untitled'
                });
              });
            }
          }
          
          if (subtestQuestions.length > 0) {
            const shuffled = subtestQuestions.sort(() => Math.random() - 0.5);
            const selected = shuffled.slice(0, Math.min(questionsPerSubtest, subtestQuestions.length));
            allQuestions.push(...selected);
            console.log(`Selected ${selected.length} user questions for subtest ${subtest}`);
          }
        }
        
        console.log(`Total questions after fallback: ${allQuestions.length}`);
      } catch (fallbackError) {
        console.error('Error in fallback to user sets:', fallbackError);
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
