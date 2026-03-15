import React from 'react';
import { AlertCircle, Eye } from 'lucide-react';

/**
 * Material Analysis Card
 * Displays individual material performance with:
 * - Material name
 * - Wrong count
 * - Question numbers that were answered wrong
 * - Review button
 * 
 * @param {Object} props
 * @param {Object} props.material - Material analysis object
 * @param {number} props.rank - Rank in priority list (1-based)
 * @param {Function} props.onReview - Callback when review button clicked
 */
const MaterialAnalysisCard = ({ material, rank, onReview }) => {
  return (
    <div className="p-4 hover:bg-slate-50 transition-colors">
      <div className="flex items-start gap-4">
        {/* Rank Badge */}
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            rank === 1 ? 'bg-rose-100 text-rose-700' :
            rank === 2 ? 'bg-orange-100 text-orange-700' :
            rank === 3 ? 'bg-amber-100 text-amber-700' :
            'bg-slate-100 text-slate-600'
          }`}>
            #{rank}
          </div>
        </div>

        {/* Material Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
            <h3 className="font-semibold text-slate-900 truncate">
              {material.materialName}
            </h3>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-600 mt-2">
            <div className="flex items-center gap-1">
              <span className="font-medium text-rose-600">{material.wrongCount}</span>
              <span>salah</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-slate-500">{material.totalQuestions}</span>
              <span>total soal</span>
            </div>
          </div>

          {/* Question Numbers */}
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="text-xs text-slate-500">Nomor:</span>
            {material.questionNumbers.map(num => (
              <span
                key={num}
                className="px-2 py-0.5 bg-rose-50 text-rose-700 text-xs font-medium rounded"
              >
                {num}
              </span>
            ))}
          </div>
        </div>

        {/* Review Button */}
        <button
          onClick={onReview}
          className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-lg transition-colors"
        >
          <Eye size={16} />
          <span className="hidden sm:inline">Lihat Soal</span>
        </button>
      </div>
    </div>
  );
};

export default MaterialAnalysisCard;
