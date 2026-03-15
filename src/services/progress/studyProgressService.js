/**
 * Study Progress Tracking Service
 * 
 * Provides comprehensive progress tracking for SNBT learning activities:
 * - Question completion tracking
 * - Study session history
 * - Performance analytics
 * - Material progress
 * 
 * Usage:
 * import { trackQuestionCompletion, getStudyHistory, getUserProgress } from './services/progress/studyProgressService';
 */

import { doc, getDoc, setDoc, updateDoc, onSnapshot, collection, addDoc, query, where, orderBy, getDocs, serverTimestamp, increment } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { silabusData } from '../../data/silabus';

/**
 * Track when a user completes a question set
 * @param {string} userId - User ID
 * @param {Object} questionSet - Question set data
 * @param {Object} result - Result data (score, correctCount, etc.)
 */
export const trackQuestionSetCompletion = async (userId, questionSet, result) => {
  if (!userId) return;

  try {
    const completionData = {
      userId,
      questionSetId: questionSet.id || questionSet.setId,
      category: questionSet.category || questionSet.subtest,
      difficulty: questionSet.difficulty || questionSet.complexity || 3, // Default to 3 if undefined
      totalQuestions: questionSet.totalQuestions || questionSet.questions?.length || 0,
      score: result.score || 0,
      correctCount: result.correctCount || 0,
      timeUsed: result.timeUsed || 0,
      completedAt: serverTimestamp(),
      source: questionSet.source || 'practice'
    };

    // Validate required fields
    if (!completionData.questionSetId || !completionData.category) {
      console.warn('trackQuestionSetCompletion: Missing required fields, skipping tracking');
      return;
    }

    // Save to completions collection
    await addDoc(collection(db, 'question_completions'), completionData);

    // Update user's overall progress
    await updateUserProgress(userId, completionData.category, completionData.correctCount, completionData.totalQuestions);

    // Update subject-specific progress
    await updateSubjectProgress(userId, completionData.category, result);

    console.log('✓ Question set completion tracked');
  } catch (error) {
    console.error('Error tracking completion:', error);
  }
};

/**
 * Track individual question completion
 * @param {string} userId - User ID
 * @param {string} questionSetId - Question set ID
 * @param {number} questionIndex - Question index
 * @param {boolean} isCorrect - Whether answer was correct
 * @param {string} subtest - Subtest ID
 * @param {number} timeSpent - Time spent in seconds
 */
export const trackQuestionCompletion = async (userId, questionSetId, questionIndex, isCorrect, subtest, timeSpent) => {
  if (!userId) return;

  try {
    const questionData = {
      userId,
      questionSetId,
      questionIndex,
      subtest,
      isCorrect,
      timeSpent,
      answeredAt: serverTimestamp()
    };

    await addDoc(collection(db, 'question_answers'), questionData);

    // Update streak and performance metrics
    await updateUserMetrics(userId, isCorrect);

  } catch (error) {
    console.error('Error tracking question:', error);
  }
};

/**
 * Update user's overall progress
 */
const updateUserProgress = async (userId, category, correctCount, totalCount) => {
  try {
    const progressRef = doc(db, 'user_progress', userId);
    const progressSnap = await getDoc(progressRef);

    if (!progressSnap.exists()) {
      // Initialize progress document
      await initializeUserProgress(userId);
    }

    // Update statistics
    await updateDoc(progressRef, {
      statistics: {
        totalQuestionsAnswered: increment(totalCount),
        totalCorrectAnswers: increment(correctCount),
        totalSetsCompleted: increment(1),
        lastActiveAt: serverTimestamp()
      },
      categoryStats: {
        [category]: {
          questionsAnswered: increment(totalCount),
          correctAnswers: increment(correctCount),
          setsCompleted: increment(1)
        }
      },
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user progress:', error);
  }
};

/**
 * Update subject-specific progress based on silabus
 */
const updateSubjectProgress = async (userId, category, result) => {
  try {
    const progressRef = doc(db, 'user_progress', userId);
    const progressSnap = await getDoc(progressRef);

    if (!progressSnap.exists()) return;

    const progress = progressSnap.data();
    const subjectKey = mapCategoryToSubject(category);

    if (!subjectKey || !progress.subjects?.[subjectKey]) return;

    // Mark related materials as completed based on performance
    const materialsToUpdate = [];
    const accuracy = result.correctCount / result.totalQuestions;

    // If user got >70% correct, mark related materials as completed
    if (accuracy >= 0.7) {
      Object.entries(progress.subjects[subjectKey].materials).forEach(([materialId, material]) => {
        if (!material.completed) {
          materialsToUpdate.push(materialId);
        }
      });

      // Mark first incomplete material as completed
      if (materialsToUpdate.length > 0) {
        const updatedProgress = { ...progress };
        updatedProgress.subjects[subjectKey].materials[materialsToUpdate[0]] = {
          completed: true,
          completedAt: new Date()
        };
        updatedProgress.lastUpdated = new Date();

        await updateDoc(progressRef, updatedProgress);
      }
    }
  } catch (error) {
    console.error('Error updating subject progress:', error);
  }
};

/**
 * Update user metrics (streak, points, etc.)
 */
const updateUserMetrics = async (userId, isCorrect) => {
  try {
    const metricsRef = doc(db, 'user_metrics', userId);
    const metricsSnap = await getDoc(metricsRef);

    if (!metricsSnap.exists()) {
      // Initialize metrics
      await setDoc(metricsRef, {
        userId,
        currentStreak: 0,
        longestStreak: 0,
        totalPoints: 0,
        todayCorrect: 0,
        todayWrong: 0,
        lastAnswerDate: new Date().toDateString(),
        createdAt: serverTimestamp()
      });
      return;
    }

    const metrics = metricsSnap.data();
    const today = new Date().toDateString();
    const updates = {};

    // Reset daily stats if new day
    if (metrics.lastAnswerDate !== today) {
      updates.todayCorrect = 0;
      updates.todayWrong = 0;
      updates.lastAnswerDate = today;
    }

    // Update streak
    if (isCorrect) {
      updates.currentStreak = (metrics.currentStreak || 0) + 1;
      updates.longestStreak = Math.max(metrics.longestStreak || 0, updates.currentStreak);
      updates.todayCorrect = (metrics.todayCorrect || 0) + 1;
      updates.totalPoints = (metrics.totalPoints || 0) + 10; // 10 points per correct answer
    } else {
      updates.currentStreak = 0;
      updates.todayWrong = (metrics.todayWrong || 0) + 1;
    }

    await updateDoc(metricsRef, updates);
  } catch (error) {
    console.error('Error updating metrics:', error);
  }
};

/**
 * Initialize user progress document
 */
export const initializeUserProgress = async (userId) => {
  try {
    const subjects = {};

    silabusData.forEach(item => {
      if (!subjects[item.subject]) {
        subjects[item.subject] = {
          completed: 0,
          total: 0,
          progress: 0,
          materials: {}
        };
      }

      subjects[item.subject].total++;
      subjects[item.subject].materials[item.id] = {
        completed: false,
        completedAt: null
      };
    });

    const progressData = {
      userId,
      totalProgress: 0,
      lastUpdated: serverTimestamp(),
      statistics: {
        totalQuestionsAnswered: 0,
        totalCorrectAnswers: 0,
        totalSetsCompleted: 0,
        lastActiveAt: serverTimestamp()
      },
      categoryStats: {},
      subjects
    };

    await setDoc(doc(db, 'user_progress', userId), progressData);
    return progressData;
  } catch (error) {
    console.error('Error initializing progress:', error);
    return null;
  }
};

/**
 * Get user's study history
 * @param {string} userId - User ID
 * @param {number} limit - Number of records to fetch
 */
export const getStudyHistory = async (userId, limit = 20) => {
  if (!userId) return [];

  try {
    const q = query(
      collection(db, 'question_completions'),
      where('userId', '==', userId),
      orderBy('completedAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).slice(0, limit);
  } catch (error) {
    console.error('Error getting study history:', error);
    return [];
  }
};

/**
 * Get user's progress summary
 * @param {string} userId - User ID
 */
export const getUserProgress = async (userId) => {
  if (!userId) {
    console.log('getUserProgress: No userId provided');
    return null;
  }

  try {
    const progressRef = doc(db, 'user_progress', userId);
    const progressSnap = await getDoc(progressRef);

    if (!progressSnap.exists()) {
      console.log('getUserProgress: No progress document found, initializing...');
      // Initialize progress document
      const newProgress = await initializeUserProgress(userId);
      return newProgress;
    }

    console.log('getUserProgress: Progress loaded successfully');
    return progressSnap.data();
  } catch (error) {
    // Handle permission errors gracefully
    if (error.code === 'permission-denied') {
      console.warn('Permission denied for user progress. User may not be authenticated or rules not deployed.');
      console.warn('Firestore Rules must be deployed! See FIX_PERMISSION_ERROR.md');
      return null;
    }
    console.error('Error getting progress:', error);
    return null;
  }
};

/**
 * Get user's metrics
 * @param {string} userId - User ID
 */
export const getUserMetrics = async (userId) => {
  if (!userId) return null;

  try {
    const metricsRef = doc(db, 'user_metrics', userId);
    const metricsSnap = await getDoc(metricsRef);

    if (!metricsSnap.exists()) {
      // Initialize with default values
      const defaultMetrics = {
        currentStreak: 0,
        longestStreak: 0,
        totalPoints: 0,
        todayCorrect: 0,
        todayWrong: 0
      };
      
      // Try to create the document
      try {
        await setDoc(metricsRef, {
          userId,
          ...defaultMetrics,
          createdAt: serverTimestamp()
        });
      } catch (createError) {
        // If creation fails due to permissions, just return defaults
        if (createError.code !== 'permission-denied') {
          console.error('Error initializing metrics:', createError);
        }
      }
      
      return defaultMetrics;
    }

    return metricsSnap.data();
  } catch (error) {
    // Handle permission errors gracefully
    if (error.code === 'permission-denied') {
      console.warn('Permission denied for user metrics. User may not be authenticated.');
      return null;
    }
    console.error('Error getting metrics:', error);
    return null;
  }
};

/**
 * Get real-time progress updates
 * @param {string} userId - User ID
 * @param {function} callback - Callback function for updates
 */
export const subscribeToProgress = (userId, callback) => {
  if (!userId) return () => {};

  const progressRef = doc(db, 'user_progress', userId);
  
  return onSnapshot(progressRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Progress subscription error:', error);
    callback(null);
  });
};

/**
 * Map category to subject key
 */
function mapCategoryToSubject(category) {
  const mapping = {
    'tps_pu': 'penalaran_umum',
    'tps_ppu': 'pemahaman_bacaan_menulis',
    'tps_pbm': 'pemahaman_bacaan_menulis',
    'tps_pk': 'pengetahuan_kuantitatif',
    'lit_ind': 'literasi_bahasa_indonesia',
    'lit_ing': 'literasi_bahasa_inggris',
    'pm': 'penalaran_matematika'
  };
  return mapping[category] || null;
}

/**
 * Export progress data for backup
 */
export const exportProgressData = async (userId) => {
  if (!userId) return null;

  try {
    const [progress, metrics, history] = await Promise.all([
      getUserProgress(userId),
      getUserMetrics(userId),
      getStudyHistory(userId, 100)
    ]);

    return {
      userId,
      exportedAt: new Date().toISOString(),
      progress,
      metrics,
      recentHistory: history
    };
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
};

export default {
  trackQuestionSetCompletion,
  trackQuestionCompletion,
  getUserProgress,
  getUserMetrics,
  getStudyHistory,
  subscribeToProgress,
  exportProgressData
};
