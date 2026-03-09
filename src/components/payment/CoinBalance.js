// ============================================================
// CoinBalance.js — Navbar Coin Balance Widget
// Clickable → opens package modal
// ============================================================

import React from 'react';
import { Coins } from 'lucide-react';
import { useCoin } from '../../context/CoinContext';

/**
 * @param {function} onClick — Callback saat koin diklik (buka modal beli koin)
 * @param {string} size — 'sm' | 'md' (default md)
 */
export const CoinBalance = ({ onClick, size = 'md' }) => {
  const { balance } = useCoin();

  if (size === 'sm') {
    return (
      <button
        id="coin-balance-btn-sm"
        onClick={onClick}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-lg hover:border-violet-300 hover:shadow-sm transition-all duration-300 group"
        title="Klik untuk beli koin"
      >
        <Coins className="w-3.5 h-3.5 text-violet-500 group-hover:scale-110 transition-transform" />
        <span className="text-xs font-bold text-gray-900 tabular-nums">{balance}</span>
        <span className="text-xs text-gray-500">Koin</span>
      </button>
    );
  }

  return (
    <button
      id="coin-balance-btn"
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-lg hover:border-violet-300 hover:shadow-md transition-all duration-300 group"
      title="Klik untuk beli koin"
    >
      <div className="relative">
        <Coins className="w-4 h-4 text-violet-500 group-hover:scale-110 transition-transform duration-300" />
      </div>
      <span className="text-sm font-black text-gray-900 tabular-nums">{balance}</span>
      <span className="text-xs text-gray-500 font-medium">Koin</span>
    </button>
  );
};

export default CoinBalance;
