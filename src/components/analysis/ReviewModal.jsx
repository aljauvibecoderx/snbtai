import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Brain } from 'lucide-react';
import LatexWrapper from '../../utils/latex';

/**
 * Review Modal
 * Shows wrong questions for a specific material with:
 * - Question text
 * - User's wrong answer (highlighted red)
 * - Correct answer (highlighted green)
 * - Explanation (if available)
 * - Navigation between questions
 * 
 * @param {Object} props
 * @param {Object} props.material - Material object with question numbers
 * @param {Array} props.questions - Array of all question objects
 * @param {Object} props.userAnswers - User's answers map
 * @param {Function} props.onClose - Close modal handler
 */
const ReviewModal = ({ material, questions, userAnswers, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter questions for this material
  const wrongQuestions = material.questionNumbers.map(num => ({
    index: num - 1, // Convert to 0-based
    question: questions[num - 1]
  }));

  const currentQuestion = wrongQuestions[currentIndex];

  if (!currentQuestion) return null;

  const { question, index: questionIndex } = currentQuestion;
  const userAnswer = userAnswers[questionIndex];
  const correctIndex = question.correctIndex;

  // Determine if question has explanation
  const hasExplanation = question.explanation || question.pembahasan;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />

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
              aria-label="Close modal"
            >
              <X size={20} className="text-slate-600" />
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
                  <div className="text-sm text-slate-700">
                    <LatexWrapper text={question.stimulus} />
                  </div>
                </div>
              )}
              
              <p className="text-sm font-medium text-slate-900">
                <LatexWrapper text={question.text} />
              </p>
              
              {/* Representation if exists */}
              {question.representation && (
                <div className="mt-3">
                  {/* TODO: Add representation renderer */}
                </div>
              )}
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
                          <p className="text-sm text-slate-700">
                            <LatexWrapper text={option} />
                          </p>
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
            {hasExplanation && (
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Brain size={16} className="text-indigo-600" />
                  <span className="text-sm font-semibold text-indigo-700">
                    Pembahasan:
                  </span>
                </div>
                <p className="text-sm text-indigo-900 leading-relaxed">
                  <LatexWrapper text={question.explanation || question.pembahasan} />
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

            <div className="flex items-center gap-2">
              {wrongQuestions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === currentIndex 
                      ? 'bg-indigo-600 w-4' 
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to question ${idx + 1}`}
                />
              ))}
            </div>

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

export default ReviewModal;
