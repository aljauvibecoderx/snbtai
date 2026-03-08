import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, X, Bookmark, BookmarkCheck } from 'lucide-react';
import { SUBTESTS, getSubtestLabel } from '../../constants/subtestHelper';
import { addToWishlist, removeFromWishlist, checkWishlistStatus } from '../../services/firebase/firebase';

const LatexWrapper = ({ text }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!document.getElementById('katex-css')) {
      const link = document.createElement('link');
      link.id = 'katex-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
      document.head.appendChild(link);
    }
    
    if (!window.katex) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  const renderContent = (rawText) => {
    if (!rawText) return "";
    if (!isLoaded || !window.katex) return rawText;

    // Fix escaped backslashes from database
    let text = rawText.replace(/\\\\frac/g, '\\frac')
                      .replace(/\\\\\(/g, '\\(')
                      .replace(/\\\\\)/g, '\\)')
                      .replace(/\\\\\{/g, '\\{')
                      .replace(/\\\\\}/g, '\\}');

    const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);

    return parts.map((part, idx) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        try { return window.katex.renderToString(part.slice(2, -2), { displayMode: true, throwOnError: false }); } catch (e) { return part; }
      } else if (part.startsWith('$') && part.endsWith('$')) {
        try { return window.katex.renderToString(part.slice(1, -1), { displayMode: false, throwOnError: false }); } catch (e) { return part; }
      } else {
        return part;
      }
    }).join('');
  };
  return <span className="latex-content" style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: renderContent(text) }} />;
};

const GridBooleanReadOnly = ({ grid_data, userAnswer }) => {
  if (!grid_data || grid_data.length === 0) return null;
  
  return (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-2 border-indigo-200 rounded-lg text-sm min-w-[500px]">
        <thead>
          <tr className="bg-indigo-50 border-b-2 border-indigo-200">
            <th className="p-3 text-left font-bold text-indigo-900 w-[60%]">Pernyataan</th>
            <th className="p-3 text-center font-bold text-indigo-900 w-[20%] border-l border-indigo-200">Ya</th>
            <th className="p-3 text-center font-bold text-indigo-900 w-[20%] border-l border-indigo-200">Tidak</th>
          </tr>
        </thead>
        <tbody>
          {grid_data.map((item, i) => {
            const userAns = userAnswer?.[i];
            const isCorrect = userAns === item.correct_answer;
            const bgColor = userAnswer ? (isCorrect ? 'bg-teal-50' : 'bg-rose-50') : (item.correct_answer ? 'bg-teal-50' : 'bg-rose-50');
            
            return (
              <tr key={i} className={`border-b border-slate-200 last:border-b-0 ${bgColor}`}>
                <td className="p-3 text-slate-700 align-middle">
                  <LatexWrapper text={`${i + 1}. ${item.statement}`} />
                </td>
                <td className="p-3 text-center align-middle border-l border-slate-200">
                  {item.correct_answer && (
                    <CheckCircle2 className="text-teal-600 mx-auto" size={20} />
                  )}
                  {userAnswer && userAns === true && !item.correct_answer && (
                    <X className="text-rose-600 mx-auto" size={20} />
                  )}
                </td>
                <td className="p-3 text-center align-middle border-l border-slate-200">
                  {!item.correct_answer && (
                    <CheckCircle2 className="text-teal-600 mx-auto" size={20} />
                  )}
                  {userAnswer && userAns === false && item.correct_answer && (
                    <X className="text-rose-600 mx-auto" size={20} />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const DetailSoalView = ({ questions, subtestLabel, subtestId, onBack, user, questionSetId, showToast }) => {
  const displayLabel = subtestId ? getSubtestLabel(subtestId) : subtestLabel;
  const [wishlistStatus, setWishlistStatus] = useState({});
  const [loadingWishlist, setLoadingWishlist] = useState({});

  useEffect(() => {
    if (user && questionSetId) {
      loadWishlistStatus();
    }
  }, [user, questionSetId]);

  const loadWishlistStatus = async () => {
    if (!user || !questionSetId) return;
    const status = {};
    for (let i = 0; i < questions.length; i++) {
      const wishlistId = await checkWishlistStatus(user.uid, questionSetId, i);
      status[i] = wishlistId;
    }
    setWishlistStatus(status);
  };

  const handleWishlistToggle = async (idx) => {
    if (!user) {
      showToast?.('Login untuk menyimpan soal', 'warning');
      return;
    }
    
    const question = questions[idx];
    const currentSubtest = subtestId || question?.subtest || 'tps_pu';
    
    setLoadingWishlist(prev => ({ ...prev, [idx]: true }));
    
    try {
      if (wishlistStatus[idx]) {
        await removeFromWishlist(wishlistStatus[idx]);
        setWishlistStatus(prev => ({ ...prev, [idx]: null }));
        showToast?.('Soal dihapus dari wishlist', 'success');
      } else {
        const wishlistId = await addToWishlist(user.uid, {
          setId: questionSetId,
          questionIndex: idx,
          subtest: currentSubtest,
          setTitle: displayLabel,
          question: question
        });
        setWishlistStatus(prev => ({ ...prev, [idx]: wishlistId }));
        showToast?.('✓ Soal disimpan ke Wishlist', 'success');
      }
    } catch (error) {
      showToast?.('Gagal menyimpan soal', 'error');
    } finally {
      setLoadingWishlist(prev => ({ ...prev, [idx]: false }));
    }
  };
  return (
    <div className="min-h-screen bg-[#F3F4F8]">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2 hover:bg-white rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{displayLabel}</h1>
            <p className="text-sm text-slate-500">{questions.length} soal</p>
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((q, idx) => {
            // Fallback: Detect grid_boolean by checking multiple possible field names
            const isGridBoolean = q.type === 'grid_boolean' || q.grid_data || q.statements;
            const gridData = q.grid_data || q.statements;
            
            return (
            <div key={q.id} id={`question-${idx}`} className="bg-white rounded-xl border border-slate-200 p-6 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Soal #{idx + 1}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-700 font-medium">Level {q.level}</span>
                  {user && (
                    <button
                      onClick={() => handleWishlistToggle(idx)}
                      disabled={loadingWishlist[idx]}
                      className={`p-2 rounded-lg transition-all ${
                        wishlistStatus[idx]
                          ? 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
                      } ${loadingWishlist[idx] ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title={wishlistStatus[idx] ? 'Hapus dari wishlist' : 'Simpan ke wishlist'}
                    >
                      {wishlistStatus[idx] ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-200">
                <p className="text-sm text-slate-700 leading-relaxed">
                  <LatexWrapper text={q.stimulus} />
                </p>
              </div>

              <p className="text-base font-medium text-slate-900 mb-4">
                <LatexWrapper text={q.text} />
              </p>

              {/* Conditional Rendering: Grid Boolean vs MCQ */}
              {isGridBoolean && gridData ? (
                <GridBooleanReadOnly grid_data={gridData} />
              ) : q.type === 'pq_comparison' && q.p_value && q.q_value ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg">
                    <div className="text-xs font-bold text-indigo-600 mb-2 uppercase tracking-wider">Kuantitas P</div>
                    <div className="text-base font-medium text-slate-800">
                      <LatexWrapper text={q.p_value} />
                    </div>
                  </div>
                  <div className="p-4 bg-teal-50 border-2 border-teal-200 rounded-lg">
                    <div className="text-xs font-bold text-teal-600 mb-2 uppercase tracking-wider">Kuantitas Q</div>
                    <div className="text-base font-medium text-slate-800">
                      <LatexWrapper text={q.q_value} />
                    </div>
                  </div>
                  <div className="col-span-full p-4 bg-teal-50 border-2 border-teal-500 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="text-teal-600" size={20} />
                      <span className="font-bold text-teal-700">
                        Jawaban: {['P > Q', 'Q > P', 'P = Q', 'Tidak dapat ditentukan'][q.correctIndex]}
                      </span>
                    </div>
                  </div>
                </div>
              ) : q.type === 'data_sufficiency' && q.statements ? (
                <div className="space-y-3 mb-4">
                  {q.statements.map((stmt, i) => (
                    <div key={`stmt-${idx}-${i}`} className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
                      <div className="text-xs font-bold text-amber-700 mb-2">Pernyataan ({i + 1})</div>
                      <div className="text-sm text-slate-800">
                        <LatexWrapper text={stmt} />
                      </div>
                    </div>
                  ))}
                  <div className="p-4 bg-teal-50 border-2 border-teal-500 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="text-teal-600" size={20} />
                      <span className="font-bold text-teal-700 text-sm">
                        Jawaban: {['A', 'B', 'C', 'D', 'E'][q.correctIndex]}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {q.options?.map((opt, optIdx) => (
                    <div key={optIdx} className={`p-4 rounded-lg border-2 ${optIdx === q.correctIndex ? 'border-teal-500 bg-teal-50' : 'border-slate-200 bg-white'}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${optIdx === q.correctIndex ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <span className="flex-1 text-sm text-slate-700 leading-relaxed">
                          <LatexWrapper text={opt} />
                        </span>
                        {optIdx === q.correctIndex && <CheckCircle2 className="text-teal-500" size={20} />}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold tracking-wider text-indigo-600 uppercase">Pembahasan</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  <LatexWrapper text={q.explanation} />
                </p>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
