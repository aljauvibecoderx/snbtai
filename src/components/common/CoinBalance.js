import React from 'react';
import { Coins, Plus } from 'lucide-react';

export const CoinBalance = ({ balance = 0, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md ${className}`}
    >
      <Coins className="w-4 h-4" strokeWidth={2} />
      <span className="text-sm font-semibold">{balance}</span>
      <Plus className="w-3 h-3 opacity-75" strokeWidth={2} />
    </button>
  );
};

export default CoinBalance;