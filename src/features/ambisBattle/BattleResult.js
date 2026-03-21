import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Trophy, Swords, Home, RotateCcw, Crown, CheckCircle2,
  XCircle, Clock, Target, Zap, Loader2, Star
} from 'lucide-react';
import { getRoom, leaveRoom } from '../../services/firebase/ambisBattle';

const BattleResult = ({ user }) => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 size={36} className="text-violet-400 animate-spin" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Data battle tidak ditemukan.</p>
          <button onClick={handleHome} className="text-violet-400 underline text-sm">Kembali ke Home</button>
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
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full blur-3xl opacity-20 ${iWin ? 'bg-amber-400' : isDraw ? 'bg-slate-400' : 'bg-indigo-600'}`} />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 pt-8 pb-10">

        {/* ── Winner Banner ── */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 relative">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl ${
              iWin
                ? 'bg-gradient-to-br from-amber-400 to-yellow-500 shadow-amber-900/40'
                : isDraw
                ? 'bg-gradient-to-br from-slate-500 to-slate-600'
                : 'bg-gradient-to-br from-slate-700 to-slate-800'
            }`}>
              {iWin ? <Trophy size={36} className="text-white" /> : isDraw ? <Swords size={36} className="text-white" /> : <Swords size={36} className="text-slate-400" />}
            </div>
            {iWin && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
                <Star size={16} className="text-white fill-white" />
              </div>
            )}
          </div>

          <h1 className={`text-3xl font-black tracking-tight mb-1 ${
            iWin ? 'text-amber-400' : isDraw ? 'text-slate-300' : 'text-slate-400'
          }`}>
            {iWin ? '🎉 Kamu Menang!' : isDraw ? '🤝 Seri!' : '😤 Kamu Kalah'}
          </h1>
          <p className="text-slate-500 text-sm">
            {iWin ? 'Kerja bagus! Kamu lebih cepat dan tepat.' : isDraw ? 'Pertandingan ketat! Skor sama.' : 'Jangan menyerah, coba lagi!'}
          </p>
        </div>

        {/* ── Score Card ── */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 mb-4">
          <div className="flex items-center">
            {/* My side */}
            <div className={`flex-1 text-center p-3 rounded-xl ${iWin ? 'bg-amber-900/30 border border-amber-700/40' : 'bg-slate-700/40'}`}>
              <div className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center text-sm font-bold text-white ${iWin ? 'bg-amber-500' : 'bg-violet-600'}`}>
                {me?.name?.[0]?.toUpperCase() || 'M'}
              </div>
              <p className="text-xs text-slate-400 truncate mb-1">{me?.name || 'Kamu'} {iWin && <Crown size={10} className="inline text-amber-400" />}</p>
              <p className={`text-3xl font-black ${iWin ? 'text-amber-400' : 'text-white'}`}>{myScore}</p>
            </div>

            {/* Center */}
            <div className="px-3 flex flex-col items-center">
              <Swords size={20} className="text-slate-600 mb-1" />
              <p className="text-xs text-slate-600 font-bold">VS</p>
            </div>

            {/* Opponent side */}
            <div className={`flex-1 text-center p-3 rounded-xl ${!iWin && !isDraw ? 'bg-indigo-900/30 border border-indigo-700/40' : 'bg-slate-700/40'}`}>
              <div className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center text-sm font-bold text-white ${!iWin && !isDraw ? 'bg-indigo-500' : 'bg-slate-600'}`}>
                {opponent?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <p className="text-xs text-slate-400 truncate mb-1">{opponent?.name || 'Lawan'} {!iWin && !isDraw && <Crown size={10} className="inline text-amber-400" />}</p>
              <p className={`text-3xl font-black ${!iWin && !isDraw ? 'text-indigo-400' : 'text-white'}`}>{opponentScore}</p>
            </div>
          </div>
        </div>

        {/* ── My Stats ── */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 mb-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Statistik Kamu</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <Target size={16} className="text-emerald-400" />, label: 'Akurasi', value: `${accuracy}%`, color: 'text-emerald-400' },
              { icon: <CheckCircle2 size={16} className="text-blue-400" />, label: 'Benar', value: `${correctCount}/${questions.length}`, color: 'text-blue-400' },
              { icon: <Clock size={16} className="text-amber-400" />, label: 'Rata Waktu', value: `${avgTime}s`, color: 'text-amber-400' },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-700/60 rounded-xl p-3 text-center">
                <div className="flex justify-center mb-1">{stat.icon}</div>
                <p className={`text-lg font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Question Breakdown ── */}
        {questions.length > 0 && (
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Detail per Soal</p>
            <div className="space-y-2">
              {questions.map((q, i) => {
                const myA = myAnswers[i];
                const opA = opAnswers[i];
                const myCorrect = myA?.isCorrect;
                const opCorrect = opA?.isCorrect;

                return (
                  <div key={i} className="flex items-center gap-3 p-2.5 bg-slate-700/40 rounded-xl">
                    <div className="w-6 h-6 rounded-lg bg-slate-600 flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-xs text-slate-400 flex-1 line-clamp-1">{q.text}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* My answer */}
                      <div className="flex flex-col items-center">
                        {myA === undefined ? (
                          <div className="w-5 h-5 rounded-md bg-slate-600" />
                        ) : myCorrect ? (
                          <CheckCircle2 size={18} className="text-emerald-400" />
                        ) : (
                          <XCircle size={18} className="text-red-400" />
                        )}
                        <span className="text-[9px] text-slate-600">Kamu</span>
                      </div>
                      <div className="w-px h-6 bg-slate-600" />
                      {/* Opponent answer */}
                      <div className="flex flex-col items-center">
                        {opA === undefined ? (
                          <div className="w-5 h-5 rounded-md bg-slate-600" />
                        ) : opCorrect ? (
                          <CheckCircle2 size={18} className="text-emerald-400" />
                        ) : (
                          <XCircle size={18} className="text-red-400" />
                        )}
                        <span className="text-[9px] text-slate-600">Lawan</span>
                      </div>
                    </div>
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
            className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-violet-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <RotateCcw size={18} /> Main Lagi
          </button>
          <button
            onClick={handleHome}
            className="w-full py-3 text-slate-400 font-semibold text-sm hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <Home size={16} /> Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};

export default BattleResult;
