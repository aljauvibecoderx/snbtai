// ============================================================
// CoinContext.js — Global Ambis Coin State Management
// Persists to localStorage for offline/session persistence
// ============================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'snbt_ai_coin_data';

const defaultCoinData = {
  balance: 0,
  totalEarned: 0,
  transactions: [],
  lastUpdated: null,
};

const CoinContext = createContext(null);

export const CoinProvider = ({ children }) => {
  const [coinData, setCoinData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultCoinData;
    } catch {
      return defaultCoinData;
    }
  });

  // Sync ke localStorage setiap ada perubahan
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(coinData));
    } catch (e) {
      console.error('Failed to save coin data:', e);
    }
  }, [coinData]);

  /**
   * Tambahkan koin setelah pembayaran berhasil
   */
  const addCoins = useCallback((amount, transaction) => {
    setCoinData(prev => ({
      ...prev,
      balance: prev.balance + amount,
      totalEarned: prev.totalEarned + amount,
      transactions: [transaction, ...prev.transactions],
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  /**
   * Kurangi koin saat generate soal
   */
  const spendCoins = useCallback((amount) => {
    setCoinData(prev => {
      if (prev.balance < amount) return prev;
      return {
        ...prev,
        balance: prev.balance - amount,
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  /**
   * Cek apakah punya cukup koin
   */
  const hasEnoughCoins = useCallback((amount = 1) => {
    return coinData.balance >= amount;
  }, [coinData.balance]);

  /**
   * Reset semua data koin (dev / logout)
   */
  const resetCoins = useCallback(() => {
    setCoinData(defaultCoinData);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = {
    balance: coinData.balance,
    totalEarned: coinData.totalEarned,
    transactions: coinData.transactions,
    lastUpdated: coinData.lastUpdated,
    addCoins,
    spendCoins,
    hasEnoughCoins,
    resetCoins,
  };

  return <CoinContext.Provider value={value}>{children}</CoinContext.Provider>;
};

export const useCoin = () => {
  const ctx = useContext(CoinContext);
  if (!ctx) throw new Error('useCoin harus digunakan di dalam CoinProvider');
  return ctx;
};

export default CoinContext;
