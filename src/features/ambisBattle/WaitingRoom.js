import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Crown, CheckCircle2, Clock, Users, Swords,
  Copy, Check, Share2, Loader2, BookOpen, AlertCircle
} from 'lucide-react';
import {
  listenToRoom,
  togglePlayerReady,
  leaveRoom,
  updateRoomStatus,
} from '../../services/firebase/ambisBattle';

const WaitingRoom = ({ user }) => {
  const params = useParams();
  const roomId = params.roomId || window.location.pathname.split('/').pop() || sessionStorage.getItem('battle_room');
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const unsubRef = useRef(null);

  const isHost = room?.hostId === user?.uid;
  const myPlayer = room?.players?.find((p) => p.id === user?.uid);
  const opponent = room?.players?.find((p) => p.id !== user?.uid);
  const allReady = room?.players?.length === 2 && room?.players?.every((p) => p.isReady);

  useEffect(() => {
    if (!roomId || !user) return;
    setLoading(true);

    unsubRef.current = listenToRoom(roomId, (data) => {
      if (!data) {
        setError('Room sudah tidak ada.');
        setLoading(false);
        return;
      }
      setRoom(data);
      setLoading(false);

      // Auto-navigate based on status
      if (data.status === 'generating') {
        if (data.hostId === user.uid) {
          navigate(`/ambis-battle/generate-question/${roomId}`);
        }
        // players wait here during generating
      }
      if (data.status === 'playing') {
        navigate(`/ambis-battle/live/${roomId}`);
      }
      if (data.status === 'finished') {
        navigate(`/ambis-battle/result/${roomId}`);
      }
    });

    return () => unsubRef.current?.();
  }, [roomId, user]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReady = async () => {
    if (!user || !roomId) return;
    try {
      await togglePlayerReady(roomId, user.uid);
    } catch (e) {
      setError('Gagal mengubah status ready.');
    }
  };

  const handleGoGenerate = async () => {
    if (!isHost) return;
    try {
      await updateRoomStatus(roomId, 'generating');
      navigate(`/ambis-battle/generate-question/${roomId}`);
    } catch (e) {
      setError('Gagal melanjutkan ke pembuatan soal.');
    }
  };

  const handleLeave = async () => {
    try {
      if (user) await leaveRoom(roomId, user.uid);
      sessionStorage.removeItem('battle_role');
      sessionStorage.removeItem('battle_room');
      navigate('/ambis-battle');
    } catch (e) {
      navigate('/ambis-battle');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8">
          <AlertCircle size={48} className="text-amber-400 mx-auto mb-3" />
          <p className="text-slate-700 font-semibold">Kamu harus login untuk mengakses room.</p>
          <button onClick={() => navigate('/ambis-battle')} className="mt-4 text-sm text-violet-600 underline">
            Kembali ke Lobby
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 size={32} className="text-violet-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-3" />
          <p className="text-slate-700 font-semibold mb-4">{error}</p>
          <button onClick={() => navigate('/ambis-battle')} className="text-sm text-violet-600 underline">
            Kembali ke Lobby
          </button>
        </div>
      </div>
    );
  }

  const statusLabel = {
    waiting: { text: 'Menunggu Pemain', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
    generating: { text: 'Soal Sedang Dibuat...', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
    ready: { text: 'Soal Siap! Semua Ready?', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  }[room?.status] || { text: room?.status, color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200' };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-violet-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-16 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 pt-12 pb-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={handleLeave} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
            <ArrowLeft size={18} className="text-slate-600" />
          </button>
          <div className="flex-1">
            <h1 className="font-black text-slate-900 text-lg leading-tight">Waiting Room</h1>
            <p className="text-xs text-slate-500">Battle akan segera dimulai</p>
          </div>
          <div className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${statusLabel.bg} ${statusLabel.color}`}>
            {statusLabel.text}
          </div>
        </div>

        {/* Room Code */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 shadow-sm">
          <p className="text-xs text-slate-500 font-medium mb-2 text-center">Kode Room — Bagikan ke teman</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center">
              <span className="font-mono font-black text-3xl tracking-widest text-violet-700">{roomId}</span>
            </div>
            <button
              onClick={handleCopyCode}
              className="p-3 bg-violet-100 hover:bg-violet-200 rounded-xl transition-colors"
            >
              {copied ? <Check size={20} className="text-emerald-600" /> : <Copy size={20} className="text-violet-600" />}
            </button>
          </div>
        </div>

        {/* Players */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} className="text-slate-500" />
            <span className="text-sm font-semibold text-slate-700">Pemain ({room?.players?.length || 0}/2)</span>
          </div>

          <div className="space-y-3">
            {room?.players?.map((player) => {
              const isMe = player.id === user.uid;
              const isPlayerHost = player.id === room.hostId;
              return (
                <div
                  key={player.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    player.isReady
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {player.photo ? (
                      <img src={player.photo} alt={player.name} className="w-10 h-10 rounded-xl object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                        {player.name?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                    {isPlayerHost && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                        <Crown size={10} className="text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">
                      {player.name} {isMe && <span className="text-violet-500 text-xs font-normal">(kamu)</span>}
                    </p>
                    <p className="text-xs text-slate-500">{isPlayerHost ? 'Host' : 'Player'}</p>
                  </div>

                  <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    player.isReady
                      ? 'text-emerald-700 bg-emerald-100'
                      : 'text-slate-400 bg-slate-100'
                  }`}>
                    <CheckCircle2 size={12} />
                    {player.isReady ? 'Ready!' : 'Belum ready'}
                  </div>
                </div>
              );
            })}

            {/* Empty slot */}
            {(room?.players?.length || 0) < 2 && (
              <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Users size={16} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">Menunggu pemain...</p>
                  <p className="text-xs text-slate-400">Bagikan kode room ke teman</p>
                </div>
                <div className="ml-auto">
                  <span className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status messages */}
        {room?.status === 'generating' && !isHost && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4 text-center">
            <Loader2 size={20} className="text-blue-500 animate-spin mx-auto mb-2" />
            <p className="text-sm font-semibold text-blue-700">Host sedang membuat soal...</p>
            <p className="text-xs text-blue-500 mt-1">Tunggu sebentar, kamu akan otomatis diarahkan</p>
          </div>
        )}

        {room?.status === 'ready' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-4 flex items-center gap-3">
            <BookOpen size={20} className="text-emerald-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-700">
                {room?.questions?.length || 0} soal siap digunakan!
              </p>
              <p className="text-xs text-emerald-600">Semua pemain harus ready untuk mulai</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Non-host: Toggle Ready */}
          {!isHost && room?.status !== 'generating' && (
            <button
              onClick={handleReady}
              className={`w-full py-3.5 font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                myPlayer?.isReady
                  ? 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] shadow-sm'
              }`}
            >
              <CheckCircle2 size={18} />
              {myPlayer?.isReady ? 'Batalkan Ready' : 'Siap Bermain!'}
            </button>
          )}

          {/* Host: Go to Generate Questions */}
          {isHost && (room?.status === 'waiting' || room?.status === 'generating') && (
            <button
              onClick={handleGoGenerate}
              disabled={(room?.players?.length || 0) < 2}
              className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <BookOpen size={18} />
              {(room?.players?.length || 0) < 2 ? 'Tunggu pemain lain bergabung' : 'Buat Soal →'}
            </button>
          )}

          {/* Host: Start Game */}
          {isHost && room?.status === 'ready' && (
            <button
              onClick={() => navigate(`/ambis-battle/generate-question/${roomId}`)}
              className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Swords size={18} />
              {allReady ? 'Mulai Battle!' : `Edit Soal (${room?.questions?.length || 0} soal)`}
            </button>
          )}

          <button
            onClick={handleLeave}
            className="w-full py-2.5 text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Tinggalkan Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
