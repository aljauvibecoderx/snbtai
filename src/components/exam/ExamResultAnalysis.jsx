import React, { useState } from 'react';
import { 
  BookOpen, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  Eye,
  ArrowLeft,
  TrendingDown,
  Clock,
  Target
} from 'lucide-react';

/**
 * Exam Result Analysis View
 * 
 * Displays detailed analysis of exam performance with:
 * - Session info header
 * - AI recommendation summary
 * - Priority material list (sorted by wrong count)
 * - Review mode for wrong answers
 * 
 * Uses existing UI components and styling patterns.
 * 
 * @param {Object} props
 * @param {Object} props.sessionData - Session data from Firestore
 * @param {Array} props.questions - Array of question objects
 * @param {Object} props.userAnswers - User's answers map
 * @param {Function} props.onRetake - Retake exam handler
 * @param {Function} props.onBack - Back to dashboard handler
 */
const ExamResultAnalysis = ({
  sessionData,
  questions,
  userAnswers,
  onRetake,
  onBack
}) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const { materialAnalysis, aiRecommendation } = sessionData || {};
  const { priorityMaterials = [], totalWeakMaterials = 0 } = materialAnalysis || {};

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
      onRetake(sessionData.questionSetId);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
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
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
                  <span>{sessionData?.subtestName || 'Subtest'}</span>
                  <span>•</span>
                  <span>{sessionData?.sessionName || 'Sesi'}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleRetakeClick}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
            >
              <RotateCcw size={16} />
              <span className="hidden sm:inline">Kerjakan Lagi</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        
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
                  Kode: {sessionData?.subtestCode || 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase font-medium">Skor</p>
                <p className={`text-2xl font-bold ${
                  sessionData?.score >= 70 ? 'text-teal-600' : 
                  sessionData?.score >= 50 ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {sessionData?.score?.toFixed(0) || '0'}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase font-medium">Benar</p>
                <p className="text-2xl font-bold text-teal-600">
                  {sessionData?.correctCount || '0'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase font-medium">Salah</p>
                <p className="text-2xl font-bold text-rose-600">
                  {sessionData?.wrongCount || '0'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase font-medium">Waktu</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {formatTime(sessionData?.timeUsed || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendation Banner */}
        {aiRecommendation?.summary && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                <BookOpen size={24} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold">Rekomendasi Belajar AI</span>
                </div>
                
                <p className="text-indigo-100 leading-relaxed text-sm sm:text-base">
                  {aiRecommendation.summary}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Priority Materials List */}
        {priorityMaterials.length > 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <TrendingDown size={20} className="text-rose-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  Materi Prioritas ({totalWeakMaterials})
                </h2>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Urutan berdasarkan jumlah kesalahan terbanyak
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {priorityMaterials.map((material, index) => (
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

        {/* Tips Section */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Target size={20} className="text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-indigo-900 mb-2">
                Tips Belajar Efektif
              </h4>
              <ul className="text-sm text-indigo-800 space-y-1">
                <li>• Fokus pada materi prioritas tertinggi terlebih dahulu</li>
                <li>• Review pembahasan soal untuk memahami konsep yang salah</li>
                <li>• Ulangi latihan pada materi yang sama hingga akurasi &gt;80%</li>
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

/**
 * Material Analysis Card
 * Displays individual material performance
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
              <span className="text-slate-400">dari</span>
              <span className="font-medium text-slate-500">{material.totalQuestions}</span>
              <span>soal</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-slate-500">{material.accuracy}%</span>
              <span>akurasi</span>
            </div>
          </div>

          {/* Question Numbers */}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
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

/**
 * Review Modal
 * Shows wrong questions for a specific material
 */
const ReviewModal = ({ material, questions, userAnswers, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter questions for this material
  const wrongQuestions = material.questionNumbers.map(num => ({
    index: num - 1,
    question: questions[num - 1]
  }));

  const currentQuestion = wrongQuestions[currentIndex];

  if (!currentQuestion) return null;

  const { question, index: questionIndex } = currentQuestion;
  const userAnswer = userAnswers[questionIndex];
  const correctIndex = question.correctIndex;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between z-10">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Review: {material.materialName}
              </h3>
              <p className="text-sm text-slate-500">
                Soal {currentIndex + 1} dari {wrongQuestions.length}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <XCircle size={20} className="text-slate-600" />
            </button>
          </div>

          {/* Question Content */}
          <div className="p-6 space-y-4">
            {/* Question Number Badge */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                Soal #{currentQuestion.questionNumber}
              </span>
              <span className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-full">
                Dijawab Salah
              </span>
            </div>

            {/* Question Text */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              {question.stimulus && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-slate-500 mb-2">Stimulus:</p>
                  <div className="text-sm text-slate-700">{question.stimulus}</div>
                </div>
              )}
              
              <p className="text-sm font-medium text-slate-900">{question.text}</p>
            </div>

            {/* Options */}
            {question.options && (
              <div className="space-y-2">
                {question.options.map((option, idx) => {
                  const isUserAnswer = idx === userAnswer;
                  const isCorrect = idx === correctIndex;
                  
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border-2 ${
                        isCorrect 
                          ? 'bg-green-50 border-green-300' 
                          : isUserAnswer 
                            ? 'bg-rose-50 border-rose-300'
                            : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCorrect 
                            ? 'bg-green-500 text-white' 
                            : isUserAnswer 
                              ? 'bg-rose-500 text-white'
                              : 'bg-slate-200 text-slate-600'
                        }`}>
                          {isCorrect ? (
                            <CheckCircle size={14} />
                          ) : isUserAnswer ? (
                            <XCircle size={14} />
                          ) : (
                            <span className="text-xs font-bold">{String.fromCharCode(65 + idx)}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-700">{option}</p>
                          {isCorrect && (
                            <span className="text-xs font-semibold text-green-700">
                              ✓ Jawaban Benar
                            </span>
                          )}
                          {isUserAnswer && !isCorrect && (
                            <span className="text-xs font-semibold text-rose-700">
                              ✗ Jawaban Kamu
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Explanation */}
            {(question.explanation || question.pembahasan) && (
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={16} className="text-indigo-600" />
                  <span className="text-sm font-semibold text-indigo-700">
                    Pembahasan:
                  </span>
                </div>
                <p className="text-sm text-indigo-900 leading-relaxed">
                  {question.explanation || question.pembahasan}
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 text-sm font-semibold rounded-lg transition-colors"
            >
              ← Sebelumnya
            </button>

            <button
              onClick={() => setCurrentIndex(prev => Math.min(wrongQuestions.length - 1, prev + 1))}
              disabled={currentIndex === wrongQuestions.length - 1}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Berikutnya →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default ExamResultAnalysis;
