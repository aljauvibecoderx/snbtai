// ============================================================
// StatsContext.js — Global Stats State Management
// Single Source of Truth untuk hari ini, bank soal, kredit
// ============================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getTotalQuestionsCount } from '../services/firebase/firebase';

const StatsContext = createContext(null);

const DAILY_LIMIT_LOGGED_IN = 19;
const DAILY_LIMIT_NON_LOGGED_IN = 1;

export const StatsProvider = ({ children, user, myQuestions, coinBalance }) => {
  const [stats, setStats] = useState({
    hariIni: 0,
    bankSoal: 0,
    kredit: 0,
    isLoading: true
  });
  const bankSoalCacheRef = React.useRef(null);
  const lastFetchRef = React.useRef(0);

  // Calculate stats whenever dependencies change
  const calculateStats = useCallback(async () => {
    // Debug logging removed for production
    try {
      // 1. Hitung hari ini (jumlah set yang dibuat hari ini)
      let hariIni = 0;
      if (user && myQuestions) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTimestamp = today.getTime() / 1000;
        
        const todaySets = myQuestions.filter(set => {
          if (!set.createdAt || !set.createdAt.seconds) return false;
          return set.createdAt.seconds >= todayTimestamp;
        });
        
        hariIni = todaySets.length;
      }

      // 2. Hitung bank soal dengan caching (refresh setiap 5 menit)
      let bankSoal = bankSoalCacheRef.current || 0;
      const now = Date.now();
      const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
      
      if (!bankSoalCacheRef.current || (now - lastFetchRef.current) > CACHE_DURATION) {
        try {
          bankSoal = await getTotalQuestionsCount();
          if (bankSoal > 0) {
            bankSoalCacheRef.current = bankSoal;
            lastFetchRef.current = now;
          }
        } catch (err) {
          // Silently use cache on error
          bankSoal = bankSoalCacheRef.current || 0;
        }
      }

      // 3. Hitung kredit (remaining quota)
      const dailyLimit = user ? DAILY_LIMIT_LOGGED_IN : DAILY_LIMIT_NON_LOGGED_IN;
      const totalLimit = dailyLimit + (coinBalance || 0);
      const kredit = Math.max(0, totalLimit - hariIni);

      setStats({
        hariIni,
        bankSoal,
        kredit,
        isLoading: false
      });
    } catch (error) {
      // Error handling without console logging
      setStats(prev => ({ 
        ...prev, 
        bankSoal: bankSoalCacheRef.current || prev.bankSoal,
        isLoading: false 
      }));
    }
  }, [user, myQuestions, coinBalance]);

  // Recalculate when dependencies change
  useEffect(() => {
    if (myQuestions === undefined) return; // Wait for data
    calculateStats();
  }, [calculateStats, myQuestions]);

  // Manual refresh function
  const refreshStats = useCallback(() => {
    calculateStats();
  }, [calculateStats]);

  const value = {
    stats,
    refreshStats
  };

  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
};

export const useStats = () => {
  const ctx = useContext(StatsContext);
  if (!ctx) {
    return {
      stats: { hariIni: 0, bankSoal: 0, kredit: 0, isLoading: true },
      refreshStats: () => {}
    };
  }
  return ctx;
};

export default StatsContext;
