import React from 'react';
import { Sparkles } from 'lucide-react';

export const SparklesLogo = ({ size = 40, showText = true, className = "", textColor = "text-slate-900" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="relative">
      <div 
        className="w-full h-full rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-sm overflow-hidden"
        style={{ width: size, height: size }}
      >
        <Sparkles className="text-white" size={size * 0.6} strokeWidth={2} />
      </div>
    </div>
    {showText && (
      <div>
        <div className={`text-base font-bold ${textColor}`}>SNBT AI</div>
        <div className="text-[10px] text-gray-500 font-medium">Learning Platform</div>
      </div>
    )}
  </div>
);

export default SparklesLogo;
