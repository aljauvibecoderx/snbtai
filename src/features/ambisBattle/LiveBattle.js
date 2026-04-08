import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Clock, CheckCircle2, XCircle, Zap, Loader2,
  AlertCircle, Swords, BookOpen, ChevronDown, ChevronUp,
  Table, BarChart3, FileText, HelpCircle
} from 'lucide-react';
import { useBattleEngine, QUESTION_DURATION } from '../../services/battleEngine';
import LatexWrapper from '../../utils/latex';

// Helper to render question representation (table, chart, etc.)
const QuestionRepresentation = ({ representation }) => {
  if (!representation || representation.type === 'text' || !representation.data) {
    return null;
  }

  // Render table representation
  if (representation.type === 'table') {
    return (
      <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg overflow-x-auto">
        <div className="flex items-center gap-2 mb-2">
          <Table size={16} className="text-indigo-600" />
          <span className="text-xs font-semibold text-slate-700">Data Tabel:</span>
        </div>
        <div className="text-xs font-mono whitespace-pre-wrap text-slate-800">
          {typeof representation.data === 'string' 
            ? representation.data 
            : JSON.stringify(representation.data, null, 2)}
        </div>
      </div>
    );
  }

  // Render chart representation
  if (representation.type === 'chart') {
    return (
      <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 size={16} className="text-emerald-600" />
          <span className="text-xs font-semibold text-slate-700">Data Grafik:</span>
        </div>
        <div className="text-xs font-mono whitespace-pre-wrap text-slate-800">
          {typeof representation.data === 'string' 
            ? representation.data 
            : JSON.stringify(representation.data, null, 2)}
        </div>
      </div>
    );
  }

  // Render statement/list representation
  if (representation.type === 'statement' || representation.type === 'list') {
    return (
      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <FileText size={16} className="text-amber-600" />
          <span className="text-xs font-semibold text-amber-800">Pernyataan:</span>
        </div>
        <div className="text-xs text-amber-900 whitespace-pre-wrap leading-relaxed">
          {typeof representation.data === 'string' 
            ? representation.data 
            : JSON.stringify(representation.data, null, 2)}
        </div>
      </div>
    );
  }

  return null;
};

// Helper to detect question type and render appropriately
const getQuestionType = (question) => {
  if (!question) return 'unknown';
  
  // Check representation type
  if (question.representation?.type && question.representation.type !== 'text') {
    return question.representation.type;
  }
  
  // Check if boolean question (only 2 options, typically Benar/Salah or True/False)
  if (question.options?.length === 2) {
    const opts = question.options.map(o => o.toLowerCase());
    const hasTrue = opts.some(o => o.includes('benar') || o.includes('true') || o === 'a. benar' || o === 'b. salah');
    const hasFalse = opts.some(o => o.includes('salah') || o.includes('false'));
    if (hasTrue && hasFalse) {
      return 'boolean';
    }
  }
  
  // Check if statement question (text mentions "pernyataan")
  if (question.text?.toLowerCase().includes('pernyataan') || 
      question.stimulus?.toLowerCase().includes('pernyataan')) {
    return 'statement';
  }
  
  return 'text';
};

const LiveBattle = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();
  const roomId = params.roomId || window.location.pathname.split('/').pop() || sessionStorage.getItem('battle_room');

  // --- 1. Engine Injection (Centralized Server Logic) ---
  const {
    room,
    loading,
    error,
    phase,
    countdown,
    timeLeft,
    showExplanation,
    setShowExplanation,
    myPlayer,
    opponent,
    questions,
    currentIndex,
    currentQuestion,
    hasMyAnswer,
    hasOpponentAnswer,
    handleAnswerSubmit
  } = useBattleEngine(roomId, user);

  // --- Redirects and Error Boundaries ---
  if (room && room.status === 'finished') {
    navigate(`/ambis-battle/result/${roomId}`);
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin mx-auto mb-3 text-violet-600" />
          <p className="text-slate-500 text-sm">Engine menyinkronkan data...</p>
        </div>
      </div>
    );
  }

  if (!room || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-3" />
          <p className="text-slate-800 font-semibold mb-4">{error || 'Room tidak ditemukan'}</p>
          <button onClick={() => navigate('/ambis-battle')} className="text-violet-600 underline font-medium text-sm">
            Kembali ke Lobby
          </button>
        </div>
      </div>
    );
  }

  // --- Derived UI State ---
  const myAnswerIndex = myPlayer?.answers?.[currentIndex]?.answerIndex;
  const isCorrect = myAnswerIndex === currentQuestion?.correctIndex;
  const myScore = myPlayer?.score || 0;
  const opponentScore = opponent?.score || 0;
  
  const timerPercent = (timeLeft / QUESTION_DURATION) * 100;
  const timerColor = timeLeft > 15 ? 'bg-emerald-500' : timeLeft > 7 ? 'bg-amber-400' : 'bg-red-500';

  // --- Countdown View Phase ---
  if (phase === 'countdown') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-violet-500/20">
            <span className="text-5xl font-black text-white">{countdown || 0}</span>
          </div>
          <p className="text-slate-500 font-semibold text-sm uppercase tracking-widest">Persiapan Soal...</p>
        </div>
      </div>
    );
  }

  // --- Battle Playing Phase ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-violet-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 max-w-md mx-auto w-full px-4 pt-4 pb-6">
        {/* -- UI: Scores Board -- */}
        <div className="flex items-center gap-2 mb-3">
          {/* P1 */}
          <div className="flex-1 bg-white border border-slate-200 shadow-sm rounded-xl p-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-violet-700">
              {myPlayer?.name?.[0]?.toUpperCase() || 'M'}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 truncate">{myPlayer?.name || 'Kamu'}</p>
              <p className="text-lg font-black text-slate-800 leading-none">{myScore}</p>
            </div>
            {hasMyAnswer && <CheckCircle2 size={16} className="text-emerald-500 ml-auto flex-shrink-0" />}
          </div>

          <div className="flex flex-col items-center flex-shrink-0 px-2">
            <Swords size={18} className="text-slate-300" />
            <span className="text-[10px] font-bold text-slate-400 mt-1">VS</span>
          </div>

          {/* P2 */}
          <div className="flex-1 bg-white border border-slate-200 shadow-sm rounded-xl p-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-indigo-700">
              {opponent?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0 text-right w-full">
              <p className="text-xs text-slate-500 truncate">{opponent?.name || 'Lawan'}</p>
              <p className="text-lg font-black text-slate-800 leading-none">{opponentScore}</p>
            </div>
            {hasOpponentAnswer && <CheckCircle2 size={16} className="text-emerald-500 ml-auto flex-shrink-0" />}
          </div>
        </div>

        {/* -- UI: Server Synchronized Timer -- */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl px-3 py-2 mb-3 flex items-center gap-3">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Clock size={12} className={timeLeft <= 7 ? 'text-red-500' : 'text-slate-500'} />
            <span className={`text-sm font-bold ${timeLeft <= 7 ? 'text-red-500' : 'text-slate-700'}`}>
              {timeLeft}s
            </span>
          </div>
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${timerColor}`}
              style={{ width: `${Math.max(0, timerPercent)}%` }}
            />
          </div>
          <span className="text-xs font-medium text-slate-500 flex-shrink-0">
            {currentIndex + 1}/{questions.length}
          </span>
        </div>

        {/* -- UI: Question Context & Text (With LaTeX) -- */}
        {currentQuestion && (
          <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-4 mb-4 flex-1 overflow-y-auto min-h-32">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-violet-700 bg-violet-100 px-2.5 py-1 rounded-full border border-violet-200">
                  {currentQuestion.subtest || 'SNBT'}
                </span>
                {/* Question Type Badge */}
                {(() => {
                  const qType = getQuestionType(currentQuestion);
                  if (qType === 'table') return (
                    <span className="text-xs font-medium text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Table size={10} /> Tabel
                    </span>
                  );
                  if (qType === 'chart') return (
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <BarChart3 size={10} /> Grafik
                    </span>
                  );
                  if (qType === 'boolean') return (
                    <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <HelpCircle size={10} /> Benar/Salah
                    </span>
                  );
                  if (qType === 'statement') return (
                    <span className="text-xs font-medium text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <FileText size={10} /> Pernyataan
                    </span>
                  );
                  return null;
                })()}
              </div>
              {currentQuestion.difficulty && (
                <span className="text-xs text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full">
                  Level: {currentQuestion.difficulty}
                </span>
              )}
            </div>
            
            {/* Stimulus Section */}
            {currentQuestion.stimulus && (
              <div className="mb-4 p-3 bg-purple-100 border border-purple-300 rounded-lg">
                <p className="text-xs font-semibold text-black mb-2">📄 Stimulus:</p>
                <p className="text-xs text-black leading-relaxed">
                  <LatexWrapper text={currentQuestion.stimulus} />
                </p>
              </div>
            )}

            {/* Representation Section (Table, Chart, Statement) */}
            <QuestionRepresentation representation={currentQuestion.representation} />
            
            {/* Question Text */}
            <div className="mb-2">
              <p className="text-xs font-semibold text-slate-600 mb-2">Pertanyaan:</p>
              <p className="text-slate-800 text-sm leading-relaxed font-medium">
                 <LatexWrapper text={currentQuestion.text || ''} />
              </p>
            </div>
          </div>
        )}

        {/* -- UI: Interactive Options (With LaTeX) -- */}
        {currentQuestion && (
          <div className="space-y-2 mb-4">
            {currentQuestion.options?.map((option, i) => {
              const isSelected = myAnswerIndex === i;
              const isActuallyCorrect = i === currentQuestion.correctIndex;
              const isMissed = myAnswerIndex === -1 && isActuallyCorrect; 
              // Wait for answer explicitly to reveal the truth
              const revealStatus = hasMyAnswer; 

              let btnClass = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-[0.98]';
              if (revealStatus) {
                if (isActuallyCorrect) {
                  btnClass = 'bg-emerald-50 border-emerald-500 text-emerald-800';
                } else if (isSelected && !isActuallyCorrect) {
                  btnClass = 'bg-red-50 border-red-500 text-red-800';
                } else {
                  btnClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswerSubmit(i)}
                  disabled={hasMyAnswer || phase !== 'playing'}
                  className={`w-full text-left border rounded-xl p-3.5 transition-all flex items-center gap-3 ${btnClass} disabled:cursor-default`}
                >
                  <div className="flex-1 text-sm leading-snug">
                     <LatexWrapper text={option || ''} />
                  </div>
                  {revealStatus && isActuallyCorrect && <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />}
                  {revealStatus && isSelected && !isActuallyCorrect && <XCircle size={16} className="text-red-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}

        {/* -- UI: Post-Answer Feedback Block -- */}
        {hasMyAnswer && currentQuestion && (
          <div className="space-y-2 mt-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className={`rounded-xl p-3 border shadow-sm ${
              isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <><Zap size={16} className="text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-700">Tepat Sekali!</span></>
                  ) : myAnswerIndex === -1 ? (
                    <><Clock size={16} className="text-red-500" />
                    <span className="text-sm font-bold text-red-700">Waktu Habis!</span></>
                  ) : (
                    <><XCircle size={16} className="text-red-500" />
                    <span className="text-sm font-bold text-red-700">Salah Jawaban!</span></>
                  )}
                </div>
                
                {/* View Explanation Button Requirement Met */}
                {currentQuestion.explanation && (
                  <button 
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
                  >
                    <BookOpen size={12} />
                    {showExplanation ? 'Tutup Pembahasan' : 'Lihat Pembahasan'}
                  </button>
                )}
              </div>

              {showExplanation && currentQuestion.explanation && (
                <div className="mt-3 pt-3 border-t border-slate-200/60 transition-all">
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    <LatexWrapper text={currentQuestion.explanation} />
                  </p>
                </div>
              )}
            </div>
            <p className="text-xs font-medium text-slate-400 text-center animate-pulse">
              Mensinkronisasi untuk memuat soal berikutnya...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveBattle;
