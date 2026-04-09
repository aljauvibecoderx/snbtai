import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Swords, Users, Plus, LogIn, ChevronRight, ArrowLeft,
  Zap, Shield, Trophy, Wifi
} from 'lucide-react';
import { createRoom, joinRoom } from '../../services/firebase/ambisBattle';

const AmbisBattleLobby = ({ user, onLogin }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState(null); // 'create' | 'join'
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const requireLogin = () => {
    if (!user) {
      if (onLogin) onLogin();
      return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!requireLogin()) return;
    setLoading(true);
    setError('');
    try {
      const roomId = await createRoom(user);
      // Store role in sessionStorage
      sessionStorage.setItem('battle_role', 'host');
      sessionStorage.setItem('battle_room', roomId);
      navigate(`/ambis-battle/waiting-room/${roomId}`);
    } catch (e) {
      setError(e.message || 'Gagal membuat room.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!requireLogin()) return;
    if (!roomCode.trim()) { setError('Masukkan kode room terlebih dahulu.'); return; }
    setLoading(true);
    setError('');
    try {
      await joinRoom(roomCode.toUpperCase().trim(), user);
      sessionStorage.setItem('battle_role', 'player');
      sessionStorage.setItem('battle_room', roomCode.toUpperCase().trim());
      navigate(`/ambis-battle/waiting-room/${roomCode.toUpperCase().trim()}`);
    } catch (e) {
      setError(e.message || 'Gagal bergabung ke room.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <Zap size={16} />, text: 'Real-time multiplayer' },
    { icon: <Shield size={16} />, text: 'Server-based timer' },
    { icon: <Trophy size={16} />, text: 'Score & ranking' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-violet-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -right-20 w-56 h-56 bg-indigo-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 pt-14 pb-10 lg:max-w-6xl lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/app')}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Kembali
        </button>

        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-200 mb-4 lg:mb-6">
            <Swords size={36} className="text-white" />
          </div>
          <h1 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight">Ambis Battle</h1>
          <p className="text-sm lg:text-base text-slate-500 mt-1 lg:mt-2">Duel soal SNBT 1v1 secara real-time</p>

          {/* Feature badges */}
          <div className="flex items-center justify-center gap-2 lg:gap-3 mt-3 lg:mt-4 flex-wrap">
            {features.map((f, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-xs lg:text-sm text-violet-600 bg-violet-50 border border-violet-100 rounded-full px-2.5 lg:px-4 py-1 lg:py-2 font-medium">
                {f.icon} {f.text}
              </span>
            ))}
          </div>
        </div>

        {/* Login required notice */}
        {!user && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 lg:p-5 mb-5 lg:mb-6 flex items-center gap-3 lg:gap-4">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Wifi size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs lg:text-sm font-semibold text-amber-800">Login diperlukan</p>
              <p className="text-xs lg:text-sm text-amber-600">Login untuk mulai bermain Ambis Battle</p>
            </div>
            <button
              onClick={() => onLogin && onLogin()}
              className="ml-auto text-xs lg:text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg px-3 lg:px-4 py-1.5 lg:py-2 transition-colors"
            >
              Login
            </button>
          </div>
        )}

        {/* Mode selector */}
        {!mode ? (
          <div className="lg:flex lg:gap-8 lg:items-start">
            {/* Left: Main Menu Cards */}
            <div className="flex-1 lg:grid lg:grid-cols-2 lg:gap-6 space-y-3 lg:space-y-0">
            <button
              onClick={() => user ? setMode('create') : onLogin?.()}
              className="w-full bg-white border-2 border-violet-200 hover:border-violet-400 hover:bg-violet-50 rounded-2xl p-5 lg:p-6 text-left transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Plus size={26} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900 text-base lg:text-lg">Buat Room</div>
                  <div className="text-xs lg:text-sm text-slate-500 mt-0.5 lg:mt-1">Jadilah host, buat soal, tantang teman</div>
                </div>
                <ChevronRight size={20} className="text-slate-400 group-hover:text-violet-500 transition-colors" />
              </div>
            </button>

            <button
              onClick={() => user ? setMode('join') : onLogin?.()}
              className="w-full bg-white border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-2xl p-5 lg:p-6 text-left transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-md">
                  <LogIn size={26} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900 text-base lg:text-lg">Masuk Room</div>
                  <div className="text-xs lg:text-sm text-slate-500 mt-0.5 lg:mt-1">Masukkan kode 6 digit dari teman</div>
                </div>
                <ChevronRight size={20} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </div>
            </button>

            </div>

            {/* Right: How to Play Panel (Desktop) */}
            <div className="hidden lg:block lg:w-96 lg:sticky lg:top-8">
              <div className="bg-slate-100/80 rounded-2xl p-6 border border-slate-200">
                <p className="text-sm lg:text-base font-semibold text-slate-500 uppercase tracking-wide mb-4">Cara bermain</p>
                {[
                  { num: '1', text: 'Host buat room & generate soal' },
                  { num: '2', text: 'Teman join pakai kode room' },
                  { num: '3', text: 'Duel soal bareng, siapa cepat & tepat menang!' },
                ].map((step) => (
                  <div key={step.num} className="flex items-start gap-3 mb-3 last:mb-0">
                    <span className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-violet-600 text-white text-xs lg:text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{step.num}</span>
                    <p className="text-sm lg:text-base text-slate-600">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile: How it works (bottom) */}
            <div className="lg:hidden mt-6 bg-slate-100/80 rounded-2xl p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Cara bermain</p>
              {[
                { num: '1', text: 'Host buat room & generate soal' },
                { num: '2', text: 'Teman join pakai kode room' },
                { num: '3', text: 'Duel soal bareng, siapa cepat & tepat menang!' },
              ].map((step) => (
                <div key={step.num} className="flex items-start gap-3 mb-2 last:mb-0">
                  <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{step.num}</span>
                  <p className="text-xs text-slate-600">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        ) : mode === 'create' ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm lg:max-w-2xl lg:mx-auto">
            <button onClick={() => { setMode(null); setError(''); }} className="flex items-center gap-1 text-xs lg:text-sm text-slate-500 hover:text-slate-700 mb-5 lg:mb-6 transition-colors">
              <ArrowLeft size={16} /> Pilihan lain
            </button>
            <div className="text-center mb-6 lg:mb-8">
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <Plus size={28} className="text-violet-600" />
              </div>
              <h2 className="font-bold text-slate-900 text-lg lg:text-xl">Buat Room Baru</h2>
              <p className="text-xs lg:text-sm text-slate-500 mt-1 lg:mt-2">Kamu akan menjadi host dan bisa membuat soal</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs lg:text-sm rounded-xl p-3 lg:p-4 mb-4 lg:mb-6 text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleCreate}
              disabled={loading}
              className="w-full py-3.5 lg:py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 lg:gap-3 text-sm lg:text-base"
            >
              {loading ? (
                <><span className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Membuat room...</>
              ) : (
                <><Plus size={20} /> Buat Room Sekarang</>
              )}
            </button>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm lg:max-w-2xl lg:mx-auto">
            <button onClick={() => { setMode(null); setError(''); setRoomCode(''); }} className="flex items-center gap-1 text-xs lg:text-sm text-slate-500 hover:text-slate-700 mb-5 lg:mb-6 transition-colors">
              <ArrowLeft size={16} /> Pilihan lain
            </button>
            <div className="text-center mb-6 lg:mb-8">
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <LogIn size={28} className="text-indigo-600" />
              </div>
              <h2 className="font-bold text-slate-900 text-lg lg:text-xl">Masuk Room</h2>
              <p className="text-xs lg:text-sm text-slate-500 mt-1 lg:mt-2">Minta kode 6 digit dari host room</p>
            </div>

            <input
              type="text"
              value={roomCode}
              onChange={(e) => { setRoomCode(e.target.value.toUpperCase()); setError(''); }}
              maxLength={6}
              placeholder="Contoh: A7XK2P"
              className="w-full border-2 border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 lg:px-6 py-3 lg:py-4 text-center text-2xl lg:text-3xl font-mono font-bold tracking-widest text-slate-900 outline-none transition-all mb-4 lg:mb-6"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs lg:text-sm rounded-xl p-3 lg:p-4 mb-4 lg:mb-6 text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleJoin}
              disabled={loading || roomCode.length < 6}
              className="w-full py-3.5 lg:py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 lg:gap-3 text-sm lg:text-base"
            >
              {loading ? (
                <><span className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Bergabung...</>
              ) : (
                <><Users size={20} /> Masuk ke Room</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmbisBattleLobby;
