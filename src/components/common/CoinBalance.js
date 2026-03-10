import React from 'react';
import { Coins, Plus } from 'lucide-react';

export const CoinBalance = ({ balance = 0, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-300 shadow-sm hover:shadow-md ${className}`}
    >
      <Coins className="w-4 h-4" strokeWidth={2} />
      <span className="text-sm font-semibold">{balance}</span>
      <Plus className="w-3 h-3 opacity-75" strokeWidth={2} />
    </button>
  );
};

export default CoinBalance;