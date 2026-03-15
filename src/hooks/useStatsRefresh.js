// ============================================================
// useStatsRefresh.js — Hook untuk refresh stats setelah action
// ============================================================

import { useCallback } from 'react';
import { useStats } from '../context/StatsContext';

export const useStatsRefresh = () => {
  const { refreshStats } = useStats();

  // Refresh after generating questions
  const refreshAfterGenerate = useCallback(() => {
    setTimeout(() => {
      refreshStats();
    }, 500); // Small delay to ensure Firestore write completes
  }, [refreshStats]);

  // Refresh after spending coins
  const refreshAfterCoinSpend = useCallback(() => {
    setTimeout(() => {
      refreshStats();
    }, 300);
  }, [refreshStats]);

  // Refresh after login
  const refreshAfterLogin = useCallback(() => {
    setTimeout(() => {
      refreshStats();
    }, 1000);
  }, [refreshStats]);

  return {
    refreshAfterGenerate,
    refreshAfterCoinSpend,
    refreshAfterLogin,
    refreshStats
  };
};
