import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  ChevronRight,
  RotateCcw,
  Eye,
  Brain,
  TrendingDown,
  ArrowLeft
} from 'lucide-react';
import { analyzeMaterialPerformance } from '../../services/ai/aiRecommendationService';
import MaterialAnalysisCard from './MaterialAnalysisCard';
import ReviewModal from './ReviewModal';
import AIRecommendationBanner from './AIRecommendationBanner';

/**
 * Result Analysis View
 * 
 * Displays detailed analysis of exam performance with:
 * - Priority material list (sorted by wrong count)
 * - AI recommendation summary
 * - Review mode for wrong answers
 * - Retake functionality
 * 
 * @param {Object} props
 * @param {Array} props.questions - Array of question objects
 * @param {Object} props.userAnswers - User's answers map
 * @param {Object} props.resultData - Result data from Firestore
 * @param {string} props.questionSetId - Question set ID for retake
 * @param {Function} props.onRetake - Retake exam handler
 * @param {Function} props.onBack - Back to dashboard handler
 */
const ResultAnalysisView = ({
  questions,
  userAnswers,
  resultData,
  questionSetId,
  onRetake,
  onBack
}) => {
  const [materialAnalysis, setMaterialAnalysis] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  useEffect(() => {
    // Analyze material performance from current session
    const analysis = analyzeMaterialPerformance(questions, userAnswers);
    setMaterialAnalysis(analysis);
  }, [questions, userAnswers]);

  const handleReviewMaterial = (material) => {
    setSelectedMaterial(material);
    setShowReviewModal(true);
  };

  const handleCloseReview = () => {
    setShowReviewModal(false);
    setSelectedMaterial(null);
  };

  const handleRetakeClick = () => {
    if (onRetake) {
      onRetake(questionSetId);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-slate-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Analisis & Rekomendasi Belajar
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  {questions[0]?.subtest || 'Subtest'} • {questions.length} soal
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleRetakeClick}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
              >
                <RotateCcw size={16} />
                <span className="hidden sm:inline">Retake</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        
        {/* AI Recommendation Banner */}
        {resultData?.aiRecommendation?.summary && (
          <AIRecommendationBanner 
            summary={resultData.aiRecommendation.summary}
            generatedAt={resultData.aiRecommendation.generatedAt}
          />
        )}

        {/* Session Info Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <BookOpen size={20} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Detail Sesi</h3>
                <p className="text-sm text-slate-500">
                  {resultData?.category || questions[0]?.subtest || 'Umum'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase font-medium">Skor</p>
                <p className={`text-2xl font-bold ${
                  resultData?.score >= 70 ? 'text-teal-600' : 
                  resultData?.score >= 50 ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {resultData?.score?.toFixed(0) || '0'}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase font-medium">Benar</p>
                <p className="text-2xl font-bold text-teal-600">
                  {resultData?.correctCount || '0'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase font-medium">Salah</p>
                <p className="text-2xl font-bold text-rose-600">
                  {resultData?.wrongCount || '0'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Materials List */}
        {materialAnalysis && materialAnalysis.priorityMaterials.length > 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <TrendingDown size={20} className="text-rose-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  Materi Prioritas ({materialAnalysis.totalWeakMaterials})
                </h2>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Urutan berdasarkan jumlah kesalahan terbanyak
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {materialAnalysis.priorityMaterials.map((material, index) => (
                <MaterialAnalysisCard
                  key={material.materialName}
                  material={material}
                  rank={index + 1}
                  onReview={() => handleReviewMaterial(material)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-green-900 mb-2">
              Sempurna! 🎉
            </h3>
            <p className="text-green-700">
              Tidak ada kesalahan. Pertahankan prestasimu!
            </p>
          </div>
        )}

        {/* Additional Info */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Brain size={20} className="text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-indigo-900 mb-2">
                Tips Belajar Efektif
              </h4>
              <ul className="text-sm text-indigo-800 space-y-1">
                <li>• Fokus pada materi prioritas tertinggi terlebih dahulu</li>
                <li>• Review pembahasan soal untuk memahami konsep yang salah</li>
                <li>• Ulangi latihan pada materi yang sama hingga akurasi >80%</li>
                <li>• Istirahat yang cukup dan belajar secara konsisten</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          material={selectedMaterial}
          questions={questions}
          userAnswers={userAnswers}
          onClose={handleCloseReview}
        />
      )}
    </div>
  );
};

export default ResultAnalysisView;
