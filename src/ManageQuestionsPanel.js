import React, { useState, useEffect } from 'react';
import { Trash2, ChevronUp, ChevronDown, Eye, Bookmark, BookmarkCheck } from 'lucide-react';
import { deleteQuestionSet, getAllQuestionSetsForManagement } from './firebase-admin';
import { getQuestionsBySetId, addToWishlist, removeFromWishlist, checkWishlistStatus } from './firebase';
import { DetailSoalView } from './DetailSoalView';

export const ManageQuestionsPanel = ({ user, showToast }) => {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterSubtest, setFilterSubtest] = useState('');
  const [selectedSets, setSelectedSets] = useState(new Set());
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [pageSize] = useState(50);
  const [viewingSet, setViewingSet] = useState(null);
  const [viewingQuestions, setViewingQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  useEffect(() => {
    setSets([]);
    setLastDoc(null);
    loadSets(null);
  }, [sortBy, sortOrder]);

  const loadSets = async (cursor) => {
    setLoading(true);
    const result = await getAllQuestionSetsForManagement(sortBy, sortOrder, pageSize, cursor);
    
    if (cursor) {
      setSets(prev => [...prev, ...result.data]);
    } else {
      setSets(result.data);
    }
    
    setLastDoc(result.lastDoc);
    setHasMore(result.hasMore);
    setLoading(false);
  };

  const handleLoadMore = () => {
    if (lastDoc && hasMore) {
      loadSets(lastDoc);
    }
  };

  const handleToggleSelect = (setId) => {
    const newSelected = new Set(selectedSets);
    if (newSelected.has(setId)) {
      newSelected.delete(setId);
    } else {
      newSelected.add(setId);
    }
    setSelectedSets(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedSets.size === filteredSets.length) {
      setSelectedSets(new Set());
    } else {
      setSelectedSets(new Set(filteredSets.map(s => s.id)));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedSets.size === 0) {
      alert('❌ Pilih paket soal yang akan dihapus!');
      return;
    }

    if (!window.confirm(`Hapus ${selectedSets.size} paket soal? Tindakan tidak bisa dibatalkan!`)) {
      return;
    }

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const setId of selectedSets) {
      try {
        await deleteQuestionSet(setId, user.uid);
        successCount++;
      } catch (error) {
        console.error('Error deleting set:', error);
        errorCount++;
      }
    }

    alert(`✅ ${successCount} paket dihapus${errorCount > 0 ? `, ${errorCount} gagal` : ''}`);
    setSelectedSets(new Set());
    setSets([]);
    setLastDoc(null);
    loadSets(null);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filteredSets = filterSubtest
    ? sets.filter(s => s.subtest === filterSubtest)
    : sets;

  const subtests = ['tps_pu', 'tps_pk', 'tps_pbm', 'lit_ind', 'lit_ing', 'pm'];
  const subtestLabels = {
    tps_pu: 'TPS - Penalaran Umum',
    tps_pk: 'TPS - Pengetahuan Kuantitatif',
    tps_pbm: 'TPS - Pemahaman Bacaan',
    lit_ind: 'Literasi Indonesia',
    lit_ing: 'Literasi Inggris',
    pm: 'Penalaran Matematika'
  };

  const handleViewQuestions = async (set) => {
    setLoadingQuestions(true);
    try {
      const questions = await getQuestionsBySetId(set.id);
      setViewingQuestions(questions);
      setViewingSet(set);
    } catch (error) {
      showToast?.('Gagal memuat soal', 'error');
    } finally {
      setLoadingQuestions(false);
    }
  };

  if (viewingSet && viewingQuestions.length > 0) {
    return (
      <DetailSoalView
        questions={viewingQuestions}
        subtestLabel={viewingSet.title}
        subtestId={viewingSet.subtest}
        onBack={() => {
          setViewingSet(null);
          setViewingQuestions([]);
        }}
        user={user}
        questionSetId={viewingSet.id}
        showToast={showToast}
      />
    );
  }

  if (loading && sets.length === 0) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Bank Soal ({filteredSets.length} paket{hasMore ? '+' : ''})</h2>
        <div className="flex gap-2">
          <select
            value={filterSubtest}
            onChange={(e) => setFilterSubtest(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
          >
            <option value="">Semua Subtes</option>
            {subtests.map(st => (
              <option key={st} value={st}>{subtestLabels[st]}</option>
            ))}
          </select>
          {selectedSets.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 text-sm flex items-center gap-2"
            >
              <Trash2 size={16} />
              Hapus ({selectedSets.size})
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedSets.size === filteredSets.length && filteredSets.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 accent-rose-600"
                  />
                </th>
                <th
                  className="px-4 py-3 text-left font-bold text-slate-700 cursor-pointer hover:bg-slate-100"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center gap-1">
                    Paket Soal
                    {sortBy === 'title' && (
                      sortOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left font-bold text-slate-700 cursor-pointer hover:bg-slate-100"
                  onClick={() => handleSort('subtest')}
                >
                  <div className="flex items-center gap-1">
                    Subtes
                    {sortBy === 'subtest' && (
                      sortOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-bold text-slate-700">Jumlah Soal</th>
                <th
                  className="px-4 py-3 text-left font-bold text-slate-700 cursor-pointer hover:bg-slate-100"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-1">
                    Dibuat
                    {sortBy === 'createdAt' && (
                      sortOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-center font-bold text-slate-700">Aksi</th>
                <th className="px-4 py-3 text-center font-bold text-slate-700">Lihat</th>
              </tr>
            </thead>
            <tbody>
              {filteredSets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-slate-500">
                    Belum ada paket soal
                  </td>
                </tr>
              ) : (
                filteredSets.map(set => (
                  <tr key={set.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedSets.has(set.id)}
                        onChange={() => handleToggleSelect(set.id)}
                        className="w-4 h-4 accent-rose-600"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-900 truncate max-w-xs">
                          {set.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 font-mono">
                          #{set.id?.slice(-6).toUpperCase()}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                        {subtestLabels[set.subtest] || set.subtest || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-medium">
                      {set.totalQuestions}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">
                      {set.createdAt
                        ? new Date(set.createdAt.toDate?.() || set.createdAt).toLocaleDateString('id-ID')
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus paket "${set.title}" (${set.totalQuestions} soal)?`)) {
                            deleteQuestionSet(set.id, user.uid).then(() => {
                              alert('✅ Paket dihapus');
                              setSets(sets.filter(s => s.id !== set.id));
                            }).catch(err => alert('❌ Gagal: ' + err.message));
                          }
                        }}
                        className="px-2 py-1 bg-rose-100 text-rose-600 rounded hover:bg-rose-200 text-xs font-medium"
                      >
                        Hapus
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleViewQuestions(set)}
                        disabled={loadingQuestions}
                        className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200 text-xs font-medium flex items-center gap-1 mx-auto"
                      >
                        <Eye size={14} />
                        Lihat
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium"
          >
            {loading ? 'Loading...' : 'Muat Lebih Banyak'}
          </button>
        </div>
      )}
    </div>
  );
};
