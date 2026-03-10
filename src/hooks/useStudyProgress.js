import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase/firebase';
import { silabusData } from '../data/silabus';

export const useStudyProgress = (userId) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

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

    // Update Firebase
    try {
      const docRef = doc(db, 'user_progress', userId);
      await updateDoc(docRef, calculatedProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  // Reset all progress
  const resetProgress = async () => {
    if (!userId) return;
    
    const initialProgress = initializeProgress();
    setProgress(initialProgress);
    
    try {
      const docRef = doc(db, 'user_progress', userId);
      await setDoc(docRef, initialProgress);
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  };

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'user_progress', userId);
    
    const unsubscribe = onSnapshot(docRef, async (docSnap) => {
      try {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProgress(calculateProgress(data));
        } else {
          // Initialize new user progress
          const initialProgress = initializeProgress();
          await setDoc(docRef, initialProgress);
          setProgress(initialProgress);
        }
      } catch (error) {
        console.error('Error in progress listener:', error);
        // Fallback to initial progress
        const initialProgress = initializeProgress();
        setProgress(initialProgress);
      }
      setLoading(false);
    }, (error) => {
      console.error('Firestore listener error:', error);
      // Fallback to initial progress
      const initialProgress = initializeProgress();
      setProgress(initialProgress);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return {
    progress,
    loading,
    toggleCompletion,
    resetProgress
  };
};