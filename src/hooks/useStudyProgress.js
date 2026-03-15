import { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase/firebase';
import { silabusData } from '../data/silabus';

export const useStudyProgress = (userId) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const unsubscribeRef = useRef(null);

  // Initialize progress structure from silabus data
  const initializeProgress = () => {
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

    return {
      userId,
      totalProgress: 0,
      lastUpdated: new Date(),
      subjects
    };
  };

  // Calculate progress percentages
  const calculateProgress = (progressData) => {
    let totalCompleted = 0;
    let totalMaterials = 0;

    Object.keys(progressData.subjects).forEach(subjectKey => {
      const subject = progressData.subjects[subjectKey];
      const completed = Object.values(subject.materials).filter(m => m.completed).length;
      
      subject.completed = completed;
      subject.progress = subject.total > 0 ? completed / subject.total : 0;
      
      totalCompleted += completed;
      totalMaterials += subject.total;
    });

    progressData.totalProgress = totalMaterials > 0 ? totalCompleted / totalMaterials : 0;
    return progressData;
  };

  // Toggle material completion status
  const toggleCompletion = async (materialId) => {
    if (!userId || !progress) return;

    try {
      const material = silabusData.find(item => item.id === materialId);
      if (!material) return;

      const subjectKey = material.subject;
      const currentStatus = progress.subjects[subjectKey]?.materials[materialId]?.completed || false;

      const updatedProgress = { ...progress };
      updatedProgress.subjects[subjectKey].materials[materialId] = {
        completed: !currentStatus,
        completedAt: !currentStatus ? new Date() : null
      };
      updatedProgress.lastUpdated = new Date();

      const calculatedProgress = calculateProgress(updatedProgress);
      setProgress(calculatedProgress);

      // Update Firebase using setDoc with merge to handle non-existent documents
      const docRef = doc(db, 'user_progress', userId);
      await setDoc(docRef, calculatedProgress, { merge: true });
    } catch (error) {
      console.error('Error updating progress:', error);
      // Revert local state on error
      const docRef = doc(db, 'user_progress', userId);
      const freshData = await getDoc(docRef);
      if (freshData.exists()) {
        setProgress(calculateProgress(freshData.data()));
      }
    }
  };

  // Reset all progress
  const resetProgress = async () => {
    if (!userId) return;
    
    try {
      const initialProgress = initializeProgress();
      setProgress(initialProgress);
      
      const docRef = doc(db, 'user_progress', userId);
      await setDoc(docRef, initialProgress);
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  };

  // Import progress data
  const importProgress = async (importedData) => {
    if (!userId) return;
    
    try {
      const docRef = doc(db, 'user_progress', userId);
      const processedData = {
        ...importedData,
        userId,
        lastUpdated: new Date()
      };
      
      const calculatedProgress = calculateProgress(processedData);
      await setDoc(docRef, calculatedProgress);
      setProgress(calculatedProgress);
    } catch (error) {
      console.error('Error importing progress:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // Clean up previous listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    const docRef = doc(db, 'user_progress', userId);

    unsubscribeRef.current = onSnapshot(docRef, async (docSnap) => {
      try {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProgress(calculateProgress(data));
        } else {
          // Initialize new user progress
          const initialProgress = initializeProgress();
          try {
            await setDoc(docRef, initialProgress);
            setProgress(initialProgress);
          } catch (createError) {
            // Handle permission errors - use local state only
            if (createError.code !== 'permission-denied') {
              console.error('Error initializing progress:', createError);
            }
            setProgress(initialProgress);
          }
        }
      } catch (error) {
        console.error('Error in progress listener:', error);
        // Fallback to initial progress
        const initialProgress = initializeProgress();
        setProgress(initialProgress);
      }
      setLoading(false);
    }, (error) => {
      // Handle listener errors (including permissions)
      if (error.code === 'permission-denied') {
        console.warn('Permission denied for progress tracking. Using local state only.');
      } else {
        console.error('Firestore listener error:', error);
      }
      // Fallback to initial progress
      const initialProgress = initializeProgress();
      setProgress(initialProgress);
      setLoading(false);
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [userId]);

  return {
    progress,
    loading,
    toggleCompletion,
    resetProgress,
    importProgress
  };
};