// Advanced features utilities

// Local Storage Cache Manager
export class ProgressCache {
  static CACHE_KEY = 'snbt_progress_cache';
  static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static set(userId, data) {
    const cacheData = {
      userId,
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
  }

  static get(userId) {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;

      const cacheData = JSON.parse(cached);
      if (cacheData.userId !== userId) return null;

      const isExpired = Date.now() - cacheData.timestamp > this.CACHE_DURATION;
      if (isExpired) {
        this.clear();
        return null;
      }

      return cacheData.data;
    } catch (error) {
      console.error('Cache read error:', error);
      return null;
    }
  }

  static clear() {
    localStorage.removeItem(this.CACHE_KEY);
  }
}

// Toast Notification System
export const showToast = (message, type = 'success') => {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full ${
    type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
  }`;
  toast.textContent = message;

  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-x-full');
  }, 100);

  // Animate out and remove
  setTimeout(() => {
    toast.classList.add('translate-x-full');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
};

// Progress Analytics with Enhanced Features
export const calculateStudyStats = (progress) => {
  if (!progress || !progress.subjects) return null;

  const subjects = Object.keys(progress.subjects);
  const stats = {
    totalMaterials: 0,
    completedMaterials: 0,
    subjectStats: {},
    streakDays: 0,
    averageProgress: 0,
    weakestSubject: null,
    strongestSubject: null,
    completionRate: 0
  };

  let lowestProgress = 1;
  let highestProgress = 0;

  subjects.forEach(subject => {
    const subjectData = progress.subjects[subject];
    stats.totalMaterials += subjectData.total;
    stats.completedMaterials += subjectData.completed;
    
    const subjectProgress = subjectData.progress || 0;
    
    if (subjectProgress < lowestProgress) {
      lowestProgress = subjectProgress;
      stats.weakestSubject = subject;
    }
    
    if (subjectProgress > highestProgress) {
      highestProgress = subjectProgress;
      stats.strongestSubject = subject;
    }
    
    stats.subjectStats[subject] = {
      name: subject.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      progress: subjectProgress,
      completed: subjectData.completed,
      total: subjectData.total,
      completionRate: subjectData.total > 0 ? (subjectData.completed / subjectData.total) * 100 : 0
    };
  });

  stats.averageProgress = stats.totalMaterials > 0 
    ? stats.completedMaterials / stats.totalMaterials 
    : 0;
    
  stats.completionRate = Math.round(stats.averageProgress * 100);

  return stats;
};

// Study Streak Calculator
export const calculateStreak = (completionHistory) => {
  if (!completionHistory || completionHistory.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  let currentDate = new Date(today);

  for (let i = 0; i < 365; i++) { // Check up to 1 year
    const dateStr = currentDate.toISOString().split('T')[0];
    
    if (completionHistory.includes(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

// Export/Import Progress Data
export const exportProgress = (progress) => {
  const dataStr = JSON.stringify(progress, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `snbt-progress-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
};

export const importProgress = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const progress = JSON.parse(e.target.result);
        resolve(progress);
      } catch (error) {
        reject(new Error('Invalid progress file format'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};