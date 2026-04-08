import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Trophy, Swords, Home, RotateCcw, Crown, CheckCircle2,
  XCircle, Clock, Target, Zap, Loader2, Star, ChevronDown,
  ChevronUp, BookOpen, AlertCircle, Table, BarChart3, FileText, HelpCircle
} from 'lucide-react';
import { getRoom, leaveRoom } from '../../services/firebase/ambisBattle';
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

  // Render grid_boolean representation (multiple statements to evaluate)
  if (representation.type === 'grid_boolean') {
    return (
      <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <FileText size={16} className="text-orange-600" />
          <span className="text-xs font-semibold text-orange-800">📋 Pernyataan yang perlu dievaluasi:</span>
        </div>
        <div className="text-xs text-orange-900 whitespace-pre-wrap leading-relaxed mb-3">
          {typeof representation.data === 'string' 
            ? representation.data 
            : JSON.stringify(representation.data, null, 2)}
        </div>
        <p className="text-xs font-semibold text-orange-800">
          Pertanyaan: Berapa banyak pernyataan di atas yang benar?
        </p>
      </div>
    );
  }

  return null;
};

// Helper to detect question type
const getQuestionType = (question) => {
  if (!question) return 'unknown';
  
  // Check representation type first
  if (question.representation?.type && question.representation.type !== 'text') {
    return question.representation.type;
  }
  
  // Check if boolean question (only 2 options)
  if (question.options?.length === 2) {
    const opts = question.options.map(o => o.toLowerCase());
    const hasTrue = opts.some(o => o.includes('benar') || o.includes('true'));
    const hasFalse = opts.some(o => o.includes('salah') || o.includes('false'));
    if (hasTrue && hasFalse) {
      return 'boolean';
    }
  }
  
  // Check if grid_boolean type (multiple statements to evaluate)
  if (question.representation?.type === 'grid_boolean' || 
      (question.text?.toLowerCase().includes('pernyataan') && question.options?.length === 5)) {
    return 'grid_boolean';
  }
  
  // Check if statement question
  if (question.text?.toLowerCase().includes('pernyataan') || 
      question.stimulus?.toLowerCase().includes('pernyataan')) {
    return 'statement';
  }
  
  return 'text';
};

const BattleResult = ({ user }) => {
  const params = useParams();
  const roomId = params.roomId || window.location.pathname.split('/').pop() || sessionStorage.getItem('battle_room');
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());

  useEffect(() => {
    if (!roomId) return;
    getRoom(roomId).then((data) => {
      setRoom(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [roomId]);

  const handlePlayAgain = async () => {
    try {
      if (user) await leaveRoom(roomId, user.uid);
    } catch (e) { /* silent */ }
    sessionStorage.removeItem('battle_role');
    sessionStorage.removeItem('battle_room');
    navigate('/ambis-battle');
  };

  const handleHome = () => navigate('/app');

  const toggleQuestionExpansion = (index) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQuestions(newExpanded);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 size={36} className="text-violet-600 animate-spin" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <p className="text-slate-600 font-medium mb-4">Data battle tidak ditemukan.</p>
          <button onClick={handleHome} className="text-violet-600 font-medium underline text-sm hover:text-violet-700">Kembali ke Home</button>
        </div>
      </div>
    );
  }

  const players = room.players || [];
  const questions = room.questions || [];
  const me = players.find((p) => p.id === user?.uid);
  const opponent = players.find((p) => p.id !== user?.uid);

  const myScore = me?.score || 0;
  const opponentScore = opponent?.score || 0;
  const iWin = myScore > opponentScore;
  const isDraw = myScore === opponentScore;

  // Per-question stats
  const myAnswers = me?.answers || {};
  const opAnswers = opponent?.answers || {};

  const correctCount = Object.values(myAnswers).filter((a) => a.isCorrect).length;
  const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const avgTime = Object.values(myAnswers).length > 0
    ? Math.round(Object.values(myAnswers).reduce((s, a) => s + (a.timeTaken || 0), 0) / Object.values(myAnswers).length)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full blur-3xl opacity-20 ${iWin ? 'bg-amber-400' : isDraw ? 'bg-slate-400' : 'bg-indigo-600'}`} />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 pt-8 pb-10">

        {/* ── Winner Banner ── */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 relative">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl ${
              iWin
                ? 'bg-gradient-to-br from-amber-400 to-yellow-500 shadow-amber-500/20'
                : isDraw
                ? 'bg-gradient-to-br from-slate-200 to-slate-300'
                : 'bg-gradient-to-br from-slate-200 to-slate-300'
            }`}>
              {iWin ? <Trophy size={36} className="text-white" /> : isDraw ? <Swords size={36} className="text-white" /> : <Swords size={36} className="text-slate-500" />}
            </div>
            {iWin && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-50">
                <Star size={16} className="text-white fill-white" />
              </div>
            )}
          </div>

          <h1 className={`text-3xl font-black tracking-tight mb-1 ${
            iWin ? 'text-amber-500' : isDraw ? 'text-slate-700' : 'text-slate-800'
          }`}>
            {iWin ? '🎉 Kamu Menang!' : isDraw ? '🤝 Seri!' : '😤 Kamu Kalah'}
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            {iWin ? 'Kerja bagus! Kamu lebih cepat dan tepat.' : isDraw ? 'Pertandingan ketat! Skor sama.' : 'Jangan menyerah, coba lagi!'}
          </p>
        </div>

        {/* ── Score Card ── */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 mb-4">
          <div className="flex items-center">
            {/* My side */}
            <div className={`flex-1 text-center p-3 rounded-xl ${iWin ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50 border border-slate-100'}`}>
              <div className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center text-sm font-bold text-white ${iWin ? 'bg-amber-500' : 'bg-violet-600'}`}>
                {me?.name?.[0]?.toUpperCase() || 'M'}
              </div>
              <p className="text-xs text-slate-500 font-medium truncate mb-1">{me?.name || 'Kamu'} {iWin && <Crown size={10} className="inline text-amber-500" />}</p>
              <p className={`text-3xl font-black ${iWin ? 'text-amber-500' : 'text-slate-800'}`}>{myScore}</p>
            </div>

            {/* Center */}
            <div className="px-3 flex flex-col items-center">
              <Swords size={20} className="text-slate-400 mb-1" />
              <p className="text-xs text-slate-400 font-bold">VS</p>
            </div>

            {/* Opponent side */}
            <div className={`flex-1 text-center p-3 rounded-xl ${!iWin && !isDraw ? 'bg-indigo-50 border border-indigo-200' : 'bg-slate-50 border border-slate-100'}`}>
              <div className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center text-sm font-bold text-white ${!iWin && !isDraw ? 'bg-indigo-500' : 'bg-slate-400'}`}>
                {opponent?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <p className="text-xs text-slate-500 font-medium truncate mb-1">{opponent?.name || 'Lawan'} {!iWin && !isDraw && <Crown size={10} className="inline text-amber-500" />}</p>
              <p className={`text-3xl font-black ${!iWin && !isDraw ? 'text-indigo-600' : 'text-slate-800'}`}>{opponentScore}</p>
            </div>
          </div>
        </div>

        {/* ── My Stats ── */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 mb-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Statistik Kamu</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <Target size={16} className="text-emerald-500" />, label: 'Akurasi', value: `${accuracy}%`, color: 'text-emerald-600' },
              { icon: <CheckCircle2 size={16} className="text-blue-500" />, label: 'Benar', value: `${correctCount}/${questions.length}`, color: 'text-blue-600' },
              { icon: <Clock size={16} className="text-amber-500" />, label: 'Rata Waktu', value: `${avgTime}s`, color: 'text-amber-600' },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                <div className="flex justify-center mb-1">{stat.icon}</div>
                <p className={`text-lg font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Detailed Question Breakdown & Explanations ── */}
        {questions.length > 0 && (
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Evaluasi & Pembahasan Lengkap</p>
              <div className="flex items-center gap-1 text-xs text-amber-600">
                <BookOpen size={12} />
                <span>Klik untuk detail</span>
              </div>
            </div>
            <div className="space-y-3">
              {questions.map((q, i) => {
                const myA = myAnswers[i];
                const opA = opAnswers[i];
                const myCorrect = myA?.isCorrect;
                const opCorrect = opA?.isCorrect;
                const isExpanded = expandedQuestions.has(i);

                return (
                  <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                    {/* Question Header */}
                    <div 
                      className="flex items-center gap-3 p-3 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => toggleQuestionExpansion(i)}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white flex-shrink-0 ${
                        myCorrect ? 'bg-emerald-500' : myA === undefined ? 'bg-slate-400' : 'bg-red-500'
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 line-clamp-2">{q.text}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">{q.subtest || 'SNBT'}</span>
                          {/* Question Type Badge */}
                          {(() => {
                            const qType = getQuestionType(q);
                            if (qType === 'table') return (
                              <span className="text-xs font-medium text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                                <Table size={10} /> Tabel
                              </span>
                            );
                            if (qType === 'chart') return (
                              <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                                <BarChart3 size={10} /> Grafik
                              </span>
                            );
                            if (qType === 'boolean') return (
                              <span className="text-xs font-medium text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                                <HelpCircle size={10} /> Benar/Salah
                              </span>
                            );
                            if (qType === 'grid_boolean') return (
                              <span className="text-xs font-medium text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                                <FileText size={10} /> Hitung Benar
                              </span>
                            );
                            if (qType === 'statement') return (
                              <span className="text-xs font-medium text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                                <FileText size={10} /> Pernyataan
                              </span>
                            );
                            return null;
                          })()}
                          {q.difficulty && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                              <span className="text-xs text-slate-500">{q.difficulty}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* My answer indicator */}
                        <div className="flex flex-col items-center">
                          {myA === undefined ? (
                            <div className="w-5 h-5 rounded-md bg-slate-300" />
                          ) : myCorrect ? (
                            <CheckCircle2 size={16} className="text-emerald-500" />
                          ) : (
                            <XCircle size={16} className="text-red-500" />
                          )}
                          <span className="text-[9px] font-semibold text-slate-400">Kamu</span>
                        </div>
                        <div className="w-px h-5 bg-slate-300" />
                        {/* Opponent answer indicator */}
                        <div className="flex flex-col items-center">
                          {opA === undefined ? (
                            <div className="w-5 h-5 rounded-md bg-slate-300" />
                          ) : opCorrect ? (
                            <CheckCircle2 size={16} className="text-emerald-500" />
                          ) : (
                            <XCircle size={16} className="text-red-500" />
                          )}
                          <span className="text-[9px] font-semibold text-slate-400">Lawan</span>
                        </div>
                        {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                      </div>
                    </div>

                    {/* Detailed Explanation (Expanded) */}
                    {isExpanded && (
                      <div className="border-t border-slate-200 p-4 space-y-4 bg-white">
                        {/* Stimulus Section */}
                        {q.stimulus && (
                          <div className="p-3 bg-purple-100 border border-purple-300 rounded-lg">
                            <p className="text-xs font-semibold text-black mb-2">📄 Stimulus:</p>
                            <p className="text-xs text-black leading-relaxed">
                              <LatexWrapper text={q.stimulus} />
                            </p>
                          </div>
                        )}

                        {/* Representation Section (Table, Chart, Statement) */}
                        <QuestionRepresentation representation={q.representation} />

                        {/* Question Text */}
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <p className="text-xs font-semibold text-slate-800 mb-2">❓ Pertanyaan:</p>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            <LatexWrapper text={q.text} />
                          </p>
                        </div>

                        {/* Options with Correct Answer Highlight */}
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-slate-800">📝 Pilihan Jawaban:</p>
                          {q.options?.map((option, optIndex) => {
                            const isCorrect = optIndex === q.correctIndex;
                            const myAnswer = myA?.answerIndex;
                            const iSelected = myAnswer === optIndex;
                            
                            return (
                              <div 
                                key={optIndex}
                                className={`p-2.5 rounded-lg border text-sm ${
                                  isCorrect 
                                    ? 'bg-emerald-50 border-emerald-300' 
                                    : iSelected && !isCorrect
                                    ? 'bg-red-50 border-red-300'
                                    : 'bg-slate-50 border-slate-200'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {isCorrect && <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />}
                                  {iSelected && !isCorrect && <XCircle size={14} className="text-red-600 flex-shrink-0" />}
                                  <span className={`leading-relaxed ${isCorrect ? 'font-medium text-emerald-800' : iSelected && !isCorrect ? 'text-red-800' : 'text-slate-700'}`}>
                                    <LatexWrapper text={option} />
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Detailed Explanation */}
                        {q.explanation && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-xs font-semibold text-blue-800 mb-2">🔍 Pembahasan Lengkap:</p>
                            <p className="text-sm text-blue-700 leading-relaxed">
                              <LatexWrapper text={q.explanation} />
                            </p>
                          </div>
                        )}

                        {/* Performance Summary */}
                        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg">
                          <div className="text-center">
                            <p className="text-xs text-slate-500 mb-1">Jawaban Kamu</p>
                            <p className={`text-sm font-bold ${myCorrect ? 'text-emerald-600' : myA === undefined ? 'text-slate-400' : 'text-red-600'}`}>
                              {myA === undefined ? 'Tidak dijawab' : myCorrect ? '✓ Benar' : '✗ Salah'}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-slate-500 mb-1">Waktu</p>
                            <p className="text-sm font-bold text-slate-600">
                              {myA?.timeTaken ? `${myA.timeTaken}s` : '-'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Action Buttons ── */}
        <div className="space-y-3">
          <button
            onClick={handlePlayAgain}
            className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <RotateCcw size={18} /> Main Lagi
          </button>
          <button
            onClick={handleHome}
            className="w-full py-3 text-slate-500 font-semibold text-sm hover:bg-slate-100 hover:text-slate-800 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Home size={16} /> Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};

export default BattleResult;
