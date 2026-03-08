import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { getAllPatterns } from '../../utils/questionTemplates';

export const TemplateInfo = ({ subtestId, complexity }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const patterns = getAllPatterns(subtestId);
  const relevantPatterns = patterns.filter(p => p.level.includes(complexity));
  
  if (!patterns || patterns.length === 0) return null;
  
  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-xs">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2">
          <Info size={14} className="text-indigo-600" />
          <span className="font-bold text-indigo-700">
            Pola Soal Level {complexity}
          </span>
          <span className="text-indigo-500">
            ({relevantPatterns.length} pola)
          </span>
        </div>
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      
      {isExpanded && (
        <div className="mt-3 space-y-2 pl-5">
          {relevantPatterns.map((pattern, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-indigo-400 mt-0.5">•</span>
              <div className="flex-1">
                <p className="text-indigo-800 font-medium leading-relaxed">
                  {pattern.pattern}
                </p>
                <p className="text-indigo-500 text-[10px] mt-0.5">
                  Tipe: {pattern.type}
                </p>
              </div>
            </div>
          ))}
          {relevantPatterns.length === 0 && (
            <p className="text-indigo-600 italic">
              Tidak ada pola khusus untuk level ini. AI akan menggunakan pola umum.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateInfo;
