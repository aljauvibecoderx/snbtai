import React, { useState, useEffect } from 'react';
import { Book, Search, X, Bookmark, TrendingUp, Award, Flame } from 'lucide-react';
import { saveVocab, getVocabList, updateVocabReview, getVocabStats, deleteVocab, subscribeToVocabList } from './vocab-firebase';

// Vocab Panel (Desktop Only - Sidebar)
export const VocabPanel = ({ isOpen, onClose, userId, onSearchClick }) => {
  const [stats, setStats] = useState({ total: 0, xp: 0, needReview: 0, mastered: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      // Setup real-time listener for stats
      const unsubscribe = subscribeToVocabList(userId, () => {
        loadStats();
      });
      
      return () => {
        unsubscribe();
      };
    }
  }, [userId]);

  const loadStats = async () => {
    try {
      const data = await getVocabStats(userId);
      setStats(data);
    } catch (error) {
      console.error('Error loading vocab stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed right-4 top-24 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-40">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-8 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed right-2 sm:right-4 top-20 sm:top-24 w-56 sm:w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 sm:p-4 space-y-3 sm:space-y-4 z-40 max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-slate-200">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Book size={16} className="text-indigo-600 sm:w-[18px] sm:h-[18px]" />
          <span className="text-xs sm:text-sm font-bold text-slate-800">Vocab Panel</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded transition-colors">
          <X size={14} className="text-slate-600 sm:w-4 sm:h-4" />
        </button>
      </div>

      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs text-slate-600">Kata Tersimpan</span>
          <span className="text-base sm:text-lg font-bold text-indigo-600">{stats.total}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs text-slate-600">Total XP</span>
          <span className="text-base sm:text-lg font-bold text-amber-600">{stats.xp}</span>
        </div>
      </div>

      <button
        onClick={onSearchClick}
        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-[10px] sm:text-xs text-slate-600 flex items-center gap-1.5 sm:gap-2 transition-colors justify-center"
      >
        <Search size={12} className="sm:w-[14px] sm:h-[14px]" />
        <span>Cari Kata</span>
      </button>

      {stats.needReview > 0 && (
        <div className="p-2 sm:p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-[10px] sm:text-xs text-amber-800 font-medium">
            {stats.needReview} kata perlu direview
          </p>
        </div>
      )}
    </div>
  );
};

// Highlight Popup (Desktop & Mobile)
export const HighlightPopup = ({ word, x, y, onSave, onClose, existingVocab }) => {
  const [meaning, setMeaning] = useState(existingVocab?.meaning || '');
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(!existingVocab);

  const handleSave = async () => {
    if (existingVocab) {
      onClose();
      return;
    }

    if (!showInput) {
      setShowInput(true);
      return;
    }

    if (!meaning.trim()) return;

    setLoading(true);
    try {
      const vocabData = {
        word: word.toLowerCase(),
        meaning: meaning.trim(),
        example: '',
        source: 'highlight'
      };
      await onSave(vocabData);
      setShowInput(false);
      setMeaning('');
    } catch (error) {
      console.error('Error saving vocab:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed z-50 bg-white rounded-xl shadow-2xl border-2 border-indigo-200 animate-fade-in"
      style={{
        top: `${y}px`,
        left: `${x}px`,
        transform: 'translate(-50%, -120%)',
        minWidth: '200px',
        maxWidth: '320px'
      }}
    >
      <div className="p-3">
        <div className="text-xs font-bold text-slate-700 mb-2">"{word}"</div>
        
        {existingVocab ? (
          <div className="space-y-2">
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span className="text-xs font-bold text-teal-700">Tersimpan</span>
              </div>
              <p className="text-sm text-slate-800 font-medium mb-1">{existingVocab.meaning}</p>
              {existingVocab.example && (
                <p className="text-xs text-slate-600 italic mt-2">"{existingVocab.example}"</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-full px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>
        ) : (
          <>
            {showInput && (
              <input
                type="text"
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                placeholder="Masukkan arti..."
                autoFocus
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            )}

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={loading || (showInput && !meaning.trim())}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Bookmark size={12} />
                {loading ? 'Saving...' : showInput ? 'Simpan' : 'Save'}
              </button>
              <button
                onClick={onClose}
                className="px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Meaning Modal (Desktop & Mobile)
export const MeaningModal = ({ word, meaning, example, onSave, onClose, isSaved }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">{word}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={18} className="text-slate-600" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">Arti</p>
            <p className="text-sm text-slate-800">{meaning}</p>
          </div>

          {example && (
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Contoh Kalimat</p>
              <p className="text-sm text-slate-600 italic">{example}</p>
            </div>
          )}
        </div>

        {!isSaved && (
          <button
            onClick={onSave}
            className="w-full px-4 py-3 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Bookmark size={16} />
            Simpan ke Vocab
          </button>
        )}

        {isSaved && (
          <div className="text-center text-sm text-teal-600 font-medium">
            ✓ Sudah tersimpan
          </div>
        )}
      </div>
    </div>
  );
};

// Search Modal (Desktop Only)
export const SearchModal = ({ isOpen, onClose, onSave, userId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [meaning, setMeaning] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingVocab, setExistingVocab] = useState(null);

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!searchQuery.trim() || !userId) return;

    setLoading(true);
    try {
      const { getVocabByWord } = await import('./vocab-firebase');
      const vocab = await getVocabByWord(userId, searchQuery.toLowerCase().trim());
      setExistingVocab(vocab);
      if (vocab) {
        setMeaning(vocab.meaning);
      }
    } catch (error) {
      console.error('Error searching vocab:', error);
      setExistingVocab(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!searchQuery.trim() || !meaning.trim() || !userId) return;

    try {
      const vocabData = {
        word: searchQuery.toLowerCase().trim(),
        meaning: meaning.trim(),
        example: '',
        source: 'manual_search'
      };
      await onSave(vocabData);
      setSearchQuery('');
      setMeaning('');
      setExistingVocab(null);
      onClose();
    } catch (error) {
      console.error('Error saving vocab:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Cari / Tambah Vocab</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={18} className="text-slate-600" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Kata (English)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Contoh: effective"
                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <button
                onClick={handleSearch}
                disabled={loading || !searchQuery.trim()}
                className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? '...' : <Search size={18} />}
              </button>
            </div>
          </div>

          {existingVocab && (
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Bookmark size={14} className="text-teal-600" fill="currentColor" />
                <span className="text-xs font-bold text-teal-700">Sudah tersimpan</span>
              </div>
              <p className="text-sm text-slate-700">
                <span className="font-semibold">{existingVocab.word}</span>: {existingVocab.meaning}
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Arti (Indonesia)</label>
            <input
              type="text"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
              placeholder="Contoh: efektif, berhasil guna"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!searchQuery.trim() || !meaning.trim() || existingVocab}
          className="w-full px-4 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Bookmark size={16} />
          {existingVocab ? 'Sudah Tersimpan' : 'Simpan Vocab'}
        </button>
      </div>
    </div>
  );
};

// Vocab Review Reminder (Dashboard Only)
export const VocabReviewReminder = ({ needReview, onStartReview }) => {
  if (needReview === 0) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-300 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
          <Flame size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-amber-900">Vocab Review</h3>
          <p className="text-sm text-amber-700">{needReview} kata belum kamu review</p>
        </div>
      </div>
      <button
        onClick={onStartReview}
        className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
      >
        Mulai Review
      </button>
    </div>
  );
};

// Vocab Progress Card (Dashboard)
export const VocabProgressCard = ({ stats }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <Book size={18} className="text-indigo-600" />
        <h3 className="text-lg font-bold text-slate-800">Vocab Progress</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Total Kata</span>
          <span className="text-2xl font-bold text-indigo-600">{stats.total}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Total XP</span>
          <span className="text-2xl font-bold text-amber-600">{stats.xp}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Level</span>
          <span className="text-2xl font-bold text-teal-600">{Math.floor(stats.xp / 100)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Mastered</span>
          <span className="text-2xl font-bold text-green-600">{stats.mastered || 0}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Perlu Review</span>
          <span className="text-2xl font-bold text-rose-600">{stats.needReview}</span>
        </div>
      </div>
    </div>
  );
};

// Mini Quiz Review (Dashboard)
export const VocabReviewQuiz = ({ vocabList, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentVocab = vocabList[currentIdx];

  const handleAnswer = (isCorrect) => {
    setSelectedAnswer(isCorrect);
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentIdx < vocabList.length - 1) {
        setCurrentIdx(currentIdx + 1);
        setSelectedAnswer(null);
      } else {
        setIsFinished(true);
      }
    }, 1000);
  };

  if (isFinished) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg text-center space-y-4">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
          <Award size={32} className="text-teal-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Review Selesai!</h3>
        <p className="text-sm text-slate-600">
          Kamu menjawab {score} dari {vocabList.length} dengan benar
        </p>
        <div className="text-3xl font-bold text-amber-600">+{score * 10} XP</div>
        <button
          onClick={onComplete}
          className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          Selesai
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-600">
          {currentIdx + 1} / {vocabList.length}
        </span>
        <div className="h-2 flex-1 mx-4 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all"
            style={{ width: `${((currentIdx + 1) / vocabList.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="text-center mb-6">
        <p className="text-2xl font-bold text-slate-900 mb-2">{currentVocab.word}</p>
        <p className="text-sm text-slate-600">Pilih arti yang benar</p>
      </div>

      <div className="space-y-2">
        {/* Generate 4 options with 1 correct */}
        {[currentVocab.meaning, 'Arti salah 1', 'Arti salah 2', 'Arti salah 3']
          .sort(() => Math.random() - 0.5)
          .map((option, idx) => {
            const isCorrect = option === currentVocab.meaning;
            const isSelected = selectedAnswer !== null;
            const showCorrect = isSelected && isCorrect;
            const showWrong = isSelected && !isCorrect && option !== currentVocab.meaning;

            return (
              <button
                key={idx}
                onClick={() => !isSelected && handleAnswer(isCorrect)}
                disabled={isSelected}
                className={`w-full p-4 rounded-xl text-left text-sm font-medium transition-all ${
                  showCorrect
                    ? 'bg-teal-100 border-2 border-teal-600 text-teal-900'
                    : showWrong
                    ? 'bg-rose-100 border-2 border-rose-600 text-rose-900'
                    : 'bg-slate-50 border-2 border-slate-200 text-slate-700 hover:bg-slate-100'
                } ${isSelected ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {option}
              </button>
            );
          })}
      </div>
    </div>
  );
};
