import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Clock, CheckCircle2, XCircle, Zap, Trophy, Loader2,
  AlertCircle, Crown, Swords
} from 'lucide-react';
import { listenToRoom, submitAnswer, advanceQuestion, finishBattle } from '../../services/firebase/ambisBattle';

const QUESTION_DURATION = 30; // seconds per question

const LiveBattle = ({ user }) => {
  const params = useParams();
  const roomId = params.roomId || window.location.pathname.split('/').pop() || sessionStorage.getItem('battle_room');
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [phase, setPhase] = useState('countdown'); // countdown | playing | transitioning
  const [timeLeft, setTimeLeft] = useState(QUESTION_DURATION);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [error, setError] = useState('');

  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const unsubRef = useRef(null);
  const answeredRef = useRef(false);
  const currentIndexRef = useRef(0);

  const isHost = room?.hostId === user?.uid;
  const myPlayer = room?.players?.find((p) => p.id === user?.uid);
  const opponent = room?.players?.find((p) => p.id !== user?.uid);
  const questions = room?.questions || [];
  const currentIndex = room?.currentQuestionIndex || 0;
  const currentQuestion = questions[currentIndex];

  // ─── Listen to room ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!roomId || !user) return;

    unsubRef.current = listenToRoom(roomId, (data) => {
      if (!data) { navigate('/ambis-battle'); return; }
      setRoom(data);
      setLoading(false);

      if (data.status === 'finished') {
        clearTimers();
        navigate(`/ambis-battle/result/${roomId}`);
      }

      // New question from host
      if (data.currentQuestionIndex !== currentIndexRef.current) {
        currentIndexRef.current = data.currentQuestionIndex;
        resetForNewQuestion();
      }
    });

    return () => {
      unsubRef.current?.();
      clearTimers();
    };
  }, [roomId, user]);

  const clearTimers = () => {
    clearInterval(timerRef.current);
    clearInterval(countdownRef.current);
  };

  const resetForNewQuestion = () => {
    setSelectedAnswer(null);
    setAnswered(false);
    answeredRef.current = false;
    setShowResult(false);
    setPhase('playing');
    setTimeLeft(QUESTION_DURATION);
    setQuestionStartTime(Date.now());
    clearTimers();
    startTimer();
  };

  // ─── Countdown on mount ───────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'countdown') return;
    setCountdown(3);
    let count = 3;
    countdownRef.current = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(countdownRef.current);
        setPhase('playing');
        setQuestionStartTime(Date.now());
        startTimer();
      }
    }, 1000);
    return () => clearInterval(countdownRef.current);
  }, []);

  // ─── Timer ────────────────────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    let t = QUESTION_DURATION;
    timerRef.current = setInterval(() => {
      t -= 1;
      setTimeLeft(t);
      if (t <= 0) {
        clearInterval(timerRef.current);
        if (!answeredRef.current) {
          handleTimeout();
        }
      }
    }, 1000);
  }, []);

  const handleTimeout = useCallback(async () => {
    if (answeredRef.current) return;
    answeredRef.current = true;
    setAnswered(true);
    setShowResult(true);

    try {
      await submitAnswer(roomId, user.uid, currentIndexRef.current, -1, QUESTION_DURATION);
    } catch (e) { /* silent */ }

    if (isHost) {
      setTimeout(async () => {
        await advanceToNext();
      }, 2500);
    }
  }, [roomId, user, isHost]);

  // ─── Answer ───────────────────────────────────────────────────────────────
  const handleAnswer = useCallback(async (optIndex) => {
    if (answeredRef.current || phase !== 'playing') return;
    answeredRef.current = true;
    clearInterval(timerRef.current);

    setSelectedAnswer(optIndex);
    setAnswered(true);
    setShowResult(true);

    const timeTaken = questionStartTime
      ? Math.round((Date.now() - questionStartTime) / 1000)
      : QUESTION_DURATION;

    try {
      await submitAnswer(roomId, user.uid, currentIndexRef.current, optIndex, timeTaken);
    } catch (e) { /* silent */ }

    if (isHost) {
      setTimeout(async () => {
        await advanceToNext();
      }, 2500);
    }
  }, [phase, questionStartTime, roomId, user, isHost]);

  const advanceToNext = async () => {
    if (!isHost) return;
    const nextIndex = currentIndexRef.current + 1;
    try {
      await advanceQuestion(roomId, nextIndex, questions.length);
    } catch (e) { /* silent */ }
  };

  // ─── Opponent progress for current question ───────────────────────────────
  const opponentAnsweredCurrent = opponent?.answers?.[currentIndex] !== undefined;
  const myAnsweredCurrent = myPlayer?.answers?.[currentIndex] !== undefined;

  // ─── Score display ─────────────────────────────────────────────────────────
  const myScore = myPlayer?.score || 0;
  const opponentScore = opponent?.score || 0;
  const timerPercent = (timeLeft / QUESTION_DURATION) * 100;
  const timerColor =
    timeLeft > 15 ? 'bg-emerald-500' : timeLeft > 7 ? 'bg-amber-400' : 'bg-red-500';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center text-white">
          <Loader2 size={40} className="animate-spin mx-auto mb-3 text-violet-400" />
          <p className="text-slate-400 text-sm">Memuat battle...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-3" />
          <p className="text-white font-semibold mb-4">{error}</p>
          <button onClick={() => navigate('/ambis-battle')} className="text-violet-400 underline text-sm">
            Kembali ke Lobby
          </button>
        </div>
      </div>
    );
  }

  // ─── Countdown phase ──────────────────────────────────────────────────────
  if (phase === 'countdown') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-violet-900/50">
            <span className="text-5xl font-black text-white">{countdown}</span>
          </div>
          <p className="text-slate-400 font-semibold text-sm uppercase tracking-widest">Battle dimulai dalam...</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Swords size={16} className="text-violet-400" />
            <p className="text-white font-bold">{questions.length} soal siap</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Battle UI ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col relative overflow-hidden">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 max-w-md mx-auto w-full px-4 pt-4 pb-6">
        {/* ── Top Bar: Scores ── */}
        <div className="flex items-center gap-2 mb-3">
          {/* My score */}
          <div className="flex-1 bg-slate-800/80 border border-violet-500/30 rounded-xl p-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
              {myPlayer?.name?.[0]?.toUpperCase() || 'M'}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 truncate">{myPlayer?.name || 'Kamu'}</p>
              <p className="text-lg font-black text-white leading-none">{myScore}</p>
            </div>
            {myAnsweredCurrent && (
              <div className="ml-auto">
                <CheckCircle2 size={16} className="text-emerald-400" />
              </div>
            )}
          </div>

          {/* VS */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              <Swords size={14} className="text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 font-bold mt-0.5">VS</p>
          </div>

          {/* Opponent score */}
          <div className="flex-1 bg-slate-800/80 border border-indigo-500/30 rounded-xl p-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
              {opponent?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 truncate">{opponent?.name || 'Lawan'}</p>
              <p className="text-lg font-black text-white leading-none">{opponentScore}</p>
            </div>
            {opponentAnsweredCurrent && (
              <div className="ml-auto">
                <CheckCircle2 size={16} className="text-emerald-400" />
              </div>
            )}
          </div>
        </div>

        {/* ── Progress & Timer ── */}
        <div className="bg-slate-800/60 rounded-xl px-3 py-2 mb-3 flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400 flex-shrink-0">
            <Clock size={12} />
            <span className={`text-sm font-bold ${timeLeft <= 7 ? 'text-red-400' : timeLeft <= 15 ? 'text-amber-400' : 'text-white'}`}>
              {timeLeft}s
            </span>
          </div>
          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${timerColor}`}
              style={{ width: `${timerPercent}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 flex-shrink-0">
            {currentIndex + 1}/{questions.length}
          </span>
        </div>

        {/* ── Question Card ── */}
        {currentQuestion && (
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 mb-4 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-violet-400 bg-violet-900/50 px-2.5 py-1 rounded-full border border-violet-800/60">
                {currentQuestion.subtest || 'SNBT'}
              </span>
              {currentQuestion.difficulty && (
                <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded-full">
                  {currentQuestion.difficulty}
                </span>
              )}
            </div>
            <p className="text-white text-sm leading-relaxed font-medium mb-2">{currentQuestion.text}</p>
          </div>
        )}

        {/* ── Options ── */}
        {currentQuestion && (
          <div className="space-y-2">
            {currentQuestion.options?.map((option, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrect = i === currentQuestion.correctIndex;

              let btnClass = 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-violet-500/50 active:scale-[0.98]';
              if (showResult) {
                if (isCorrect) {
                  btnClass = 'bg-emerald-900/60 border-emerald-500/60 text-emerald-200';
                } else if (isSelected && !isCorrect) {
                  btnClass = 'bg-red-900/60 border-red-500/60 text-red-200';
                } else {
                  btnClass = 'bg-slate-800/50 border-slate-700/50 text-slate-500';
                }
              } else if (isSelected) {
                btnClass = 'bg-violet-900/60 border-violet-500 text-violet-100';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={answered}
                  className={`w-full text-left border rounded-xl p-3.5 transition-all flex items-center gap-3 ${btnClass} disabled:cursor-not-allowed`}
                >
                  {showResult ? (
                    isCorrect ? (
                      <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                    ) : isSelected ? (
                      <XCircle size={16} className="text-red-400 flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-600 flex-shrink-0" />
                    )
                  ) : (
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                      isSelected ? 'bg-violet-600 text-white' : 'bg-slate-700 text-slate-400'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  )}
                  <span className="text-sm leading-snug">{option}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Answer Feedback ── */}
        {showResult && currentQuestion && (
          <div className={`mt-3 rounded-xl p-3 border ${
            selectedAnswer === currentQuestion.correctIndex
              ? 'bg-emerald-900/40 border-emerald-700/50'
              : 'bg-red-900/40 border-red-700/50'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              {selectedAnswer === currentQuestion.correctIndex ? (
                <><Zap size={14} className="text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-300">Benar! +{Math.max(100 - (QUESTION_DURATION - timeLeft - 1) * 2, 20)} poin</span></>
              ) : selectedAnswer === -1 ? (
                <><Clock size={14} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-300">Waktu habis!</span></>
              ) : (
                <><XCircle size={14} className="text-red-400" />
                  <span className="text-xs font-bold text-red-300">Salah! +0 poin</span></>
              )}
            </div>
            {currentQuestion.explanation && (
              <p className="text-xs text-slate-400 leading-relaxed">{currentQuestion.explanation}</p>
            )}
            {!isHost && (
              <p className="text-xs text-slate-500 mt-2 text-center">Menunggu soal berikutnya...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveBattle;
