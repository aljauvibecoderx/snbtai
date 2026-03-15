import React from 'react';
import { Brain, Sparkles, Clock } from 'lucide-react';

/**
 * AI Recommendation Banner
 * Displays AI-generated recommendation summary with:
 * - Gradient background for visibility
 * - AI icon and branding
 * - Recommendation text
 * - Generation timestamp
 * 
 * @param {Object} props
 * @param {string} props.summary - AI recommendation text
 * @param {Date|Object} props.generatedAt - Generation timestamp (Firestore timestamp or Date)
 */
const AIRecommendationBanner = ({ summary, generatedAt }) => {
  // Handle Firestore timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '';
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
          <Brain size={24} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-indigo-200" />
            <h2 className="text-lg font-bold">Rekomendasi Belajar AI</h2>
          </div>
          
          <p className="text-indigo-100 leading-relaxed mb-3 text-sm sm:text-base">
            {summary}
          </p>
          
          {generatedAt && (
            <div className="flex items-center gap-2 text-xs text-indigo-200">
              <Clock size={12} />
              <span>
                Dihasilkan {formatDate(generatedAt)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationBanner;
