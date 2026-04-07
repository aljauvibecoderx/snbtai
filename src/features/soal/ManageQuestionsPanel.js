import React, { useState, useEffect } from 'react';
import { Trash2, ChevronUp, ChevronDown, Eye, Bookmark, BookmarkCheck, Search, Filter, Calendar, Hash, FileText, AlertTriangle } from 'lucide-react';
import { deleteQuestionSet, getAllQuestionSetsForManagement } from '../../services/firebase/firebase-admin';
import { getQuestionsBySetId, addToWishlist, removeFromWishlist, checkWishlistStatus } from '../../services/firebase/firebase';
import { DetailSoalView } from './DetailSoalView';

export const ManageQuestionsPanel = ({ user, showToast }) => {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterSubtest, setFilterSubtest] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSets, setSelectedSets] = useState(new Set());
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [pageSize] = useState(50);
  const [viewingSet, setViewingSet] = useState(null);
  const [viewingQuestions, setViewingQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [qualityFilter, setQualityFilter] = useState('all');
  const [minQuestions, setMinQuestions] = useState('');
  const [maxQuestions, setMaxQuestions] = useState('');

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

  const filteredSets = sets.filter(s => {
    const matchSubtest = !filterSubtest || s.subtest === filterSubtest;
    const matchSearch = !searchQuery || 
      s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Quality filter
    let matchQuality = true;
    if (qualityFilter === 'incomplete') {
      matchQuality = !s.totalQuestions || s.totalQuestions === 0;
    } else if (qualityFilter === 'valid') {
      matchQuality = s.totalQuestions && s.totalQuestions > 0;
    }
    
    // Question count filter
    const questionCount = s.totalQuestions || 0;
    const matchMin = !minQuestions || questionCount >= parseInt(minQuestions);
    const matchMax = !maxQuestions || questionCount <= parseInt(maxQuestions);
    
    return matchSubtest && matchSearch && matchQuality && matchMin && matchMax;
  });

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
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Bank Soal</h2>
          <p className="text-sm text-slate-500">{filteredSets.length} paket{hasMore ? '+' : ''} tersedia</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {selectedSets.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 text-sm flex items-center gap-2 transition-all shadow-sm"
            >
              <Trash2 size={16} />
              Hapus ({selectedSets.size})
            </button>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-2">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Cari judul atau ID paket..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
            />
          </div>
          
          {/* Filter Subtest */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
              value={filterSubtest}
              onChange={(e) => setFilterSubtest(e.target.value)}
              className="pl-9 pr-8 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-white cursor-pointer appearance-none"
              style={{ minWidth: '180px' }}
            >
              <option value="">Semua Subtes</option>
              {subtests.map(st => (
                <option key={st} value={st}>{subtestLabels[st]}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>
          </div>
          
          {/* Advanced Filters Row */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100">
            {/* Quality Filter */}
            <select
              value={qualityFilter}
              onChange={(e) => setQualityFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-white"
            >
              <option value="all">Semua Kualitas</option>
              <option value="valid">✓ Valid (Ada Soal)</option>
              <option value="incomplete">⚠ Bermasalah (Kosong)</option>
            </select>
            
            {/* Question Count Range */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min soal"
                value={minQuestions}
                onChange={(e) => setMinQuestions(e.target.value)}
                className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                min="0"
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                placeholder="Max soal"
                value={maxQuestions}
                onChange={(e) => setMaxQuestions(e.target.value)}
                className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                min="0"
              />
            </div>
            
            {/* Clear Filters */}
            {(qualityFilter !== 'all' || minQuestions || maxQuestions || searchQuery || filterSubtest) && (
              <button
                onClick={() => {
                  setQualityFilter('all');
                  setMinQuestions('');
                  setMaxQuestions('');
                  setSearchQuery('');
                  setFilterSubtest('');
                }}
                className="px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors whitespace-nowrap"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Compact Card Grid */}
      <div className="grid grid-cols-1 gap-3">
        {loading && sets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-sm text-slate-500">Memuat data...</p>
          </div>
        ) : filteredSets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-medium">Tidak ada paket soal ditemukan</p>
            {(searchQuery || filterSubtest) && (
              <button
                onClick={() => { setSearchQuery(''); setFilterSubtest(''); }}
                className="mt-3 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Reset Filter
              </button>
            )}
          </div>
        ) : (
          filteredSets.map(set => (
            <div key={set.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all group">
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={selectedSets.has(set.id)}
                    onChange={() => handleToggleSelect(set.id)}
                    className="w-4 h-4 accent-indigo-600 cursor-pointer"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Title & Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 text-sm truncate group-hover:text-indigo-700 transition-colors">
                        {set.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-mono">
                          <Hash size={12} />
                          {set.id?.slice(-6).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold whitespace-nowrap">
                      {subtestLabels[set.subtest] || set.subtest || '-'}
                    </span>
                  </div>

                  {/* Quality Warning Badge */}
                  {(!set.totalQuestions || set.totalQuestions === 0) && (
                    <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded mb-2">
                      <AlertTriangle size={12} />
                      <span>Paket kosong / bermasalah</span>
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <FileText size={12} />
                      {set.totalQuestions} soal
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {set.createdAt
                        ? new Date(set.createdAt.toDate?.() || set.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '-'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewQuestions(set)}
                      disabled={loadingQuestions}
                      className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      <Eye size={14} />
                      Lihat Soal
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Hapus paket "${set.title}" (${set.totalQuestions} soal)?`)) {
                          deleteQuestionSet(set.id, user.uid).then(() => {
                            showToast?.('Paket berhasil dihapus', 'success');
                            setSets(sets.filter(s => s.id !== set.id));
                          }).catch(err => showToast?.('Gagal menghapus: ' + err.message, 'error'));
                        }
                      }}
                      className="px-3 py-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Trash2 size={14} />
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center pt-2">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-2.5 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 disabled:opacity-50 text-sm font-semibold transition-all shadow-sm"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                Memuat...
              </span>
            ) : (
              'Muat Lebih Banyak'
            )}
          </button>
        </div>
      )}
    </div>
  );
};
