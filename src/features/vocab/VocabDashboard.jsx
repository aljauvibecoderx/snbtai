import React, { useState, useEffect } from 'react';
import { Book, Search, Globe, BookOpen, BookMarked, Bookmark, X, Edit2, Trash2, CheckCircle, Filter, SortAsc, Star, Brain, Calculator, FileText } from 'lucide-react';
import { getVocabList, getVocabStats, deleteVocab, updateVocab, subscribeToVocabList } from '../../services/vocab/vocab-firebase';
import { SUBTESTS, getSubtestLabel } from '../../constants/subtestHelper';

/**
 * Vocab Dashboard - Compact & Elegant Design
 * Supports ALL SNBT subtests with dynamic filtering
 *
 * Features:
 * - Dynamic subtest filter (only shows subtests with saved vocabulary)
 * - Status filter (All, Mastered, Need Review)
 * - Search functionality
 * - Sorting options
 * - Compact grid layout (2 cols mobile, 3-4 desktop)
 * - Snbtai theme colors (cyan/teal)
 * - Inline edit/delete
 */

// Complete SNBT subtest list with icons and snbtai theme colors
const ALL_SUBTEST_FILTERS = [
  { id: 'all', label: 'Semua Subtes', icon: Book, color: 'purple' },
  { id: 'tps_pu', label: 'Penalaran Umum', icon: Brain, color: 'purple' },
  { id: 'tps_ppu', label: 'Pemahaman Umum', icon: BookOpen, color: 'teal' },
  { id: 'tps_pbm', label: 'Bacaan & Menulis', icon: FileText, color: 'sky' },
  { id: 'tps_pk', label: 'Kuantitatif', icon: Calculator, color: 'indigo' },
  { id: 'lit_ind', label: 'B. Indonesia', icon: BookMarked, color: 'amber' },
  { id: 'lit_ing', label: 'B. Inggris', icon: Globe, color: 'blue' },
  { id: 'pm', label: 'Matematatika', icon: Calculator, color: 'violet' }
];

const STATUS_FILTERS = [
  { id: 'all', label: 'Semua', icon: Book },
  { id: 'mastered', label: 'Mastered', icon: CheckCircle },
  { id: 'review', label: 'Perlu Review', icon: Star }
];

const SORT_OPTIONS = [
  { id: 'newest', label: 'Terbaru' },
  { id: 'oldest', label: 'Terlama' },
  { id: 'alpha', label: 'A-Z' },
  { id: 'xp', label: 'XP Tertinggi' }
];

// Snbtai theme color scheme for all subtests
const SUBTEST_COLORS = {
  tps_pu: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200', badge: 'bg-cyan-100' },
  tps_ppu: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200', badge: 'bg-teal-100' },
  tps_pbm: { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200', badge: 'bg-sky-100' },
  tps_pk: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', badge: 'bg-indigo-100' },
  lit_ind: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', badge: 'bg-amber-100' },
  lit_ing: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', badge: 'bg-blue-100' },
  pm: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200', badge: 'bg-violet-100' },
  // Default fallback
  default: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200', badge: 'bg-cyan-100' }
};

export const VocabDashboard = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [vocabList, setVocabList] = useState([]);
  const [allVocabList, setAllVocabList] = useState([]); // Store all vocab for dynamic filter
  const [availableSubtests, setAvailableSubtests] = useState([]); // Subtests with saved vocab
  const [stats, setStats] = useState({ total: 0, xp: 0, needReview: 0, mastered: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ word: '', meaning: '', example: '' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (user) {
      loadAllVocabData();
    }
  }, [user]);

  // Real-time listener for vocab changes (all subtests)
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToVocabList(user.uid, (list) => {
      setAllVocabList(list);
      
      // Calculate available subtests from all vocab
      const subtestSet = new Set(list.map(v => v.subtest));
      const available = Array.from(subtestSet);
      setAvailableSubtests(available);
      
      // Filter by active tab
      const filtered = activeTab === 'all' ? list : list.filter(v => v.subtest === activeTab);
      setVocabList(filtered);

      // Update stats for active tab
      loadStats(activeTab);
    });

    return () => unsubscribe();
  }, [user, activeTab]);

  const loadAllVocabData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const list = await getVocabList(user.uid, null); // Load all vocab
      setAllVocabList(list);
      
      // Calculate available subtests
      const subtestSet = new Set(list.map(v => v.subtest));
      const available = Array.from(subtestSet);
      setAvailableSubtests(available);
      
      // Filter by active tab
      const filtered = activeTab === 'all' ? list : list.filter(v => v.subtest === activeTab);
      setVocabList(filtered);
      
      await loadStats(activeTab);
    } catch (error) {
      console.error('Error loading vocab:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async (filter) => {
    if (!user) return;
    try {
      const data = await getVocabStats(user.uid, filter === 'all' ? null : filter);
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleDelete = async (vocabId) => {
    if (!window.confirm('Hapus kata ini?')) return;

    try {
      await deleteVocab(vocabId);
      await loadAllVocabData();
    } catch (error) {
      console.error('Error deleting vocab:', error);
    }
  };

  const handleEdit = (vocab) => {
    setEditingId(vocab.id);
    setEditData({
      word: vocab.word,
      meaning: vocab.meaning,
      example: vocab.example || ''
    });
  };

  const handleSaveEdit = async (vocabId) => {
    try {
      await updateVocab(vocabId, editData);
      setEditingId(null);
      await loadAllVocabData();
    } catch (error) {
      console.error('Error updating vocab:', error);
    }
  };

  // Advanced filtering and sorting
  const filteredList = vocabList
    .filter(vocab => {
      // Search filter
      const matchesSearch = vocab.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           vocab.meaning.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      let matchesStatus = true;
      if (statusFilter === 'mastered') {
        matchesStatus = vocab.mastered === true;
      } else if (statusFilter === 'review') {
        matchesStatus = vocab.nextReview && new Date(vocab.nextReview) <= new Date() && !vocab.mastered;
      }
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sorting
      if (sortBy === 'newest') {
        return (b.savedAt?.getTime() || 0) - (a.savedAt?.getTime() || 0);
      } else if (sortBy === 'oldest') {
        return (a.savedAt?.getTime() || 0) - (b.savedAt?.getTime() || 0);
      } else if (sortBy === 'alpha') {
        return a.word.localeCompare(b.word);
      } else if (sortBy === 'xp') {
        return (b.xpEarned || 0) - (a.xpEarned || 0);
      }
      return 0;
    });

  const toggleFilters = () => setShowFilters(!showFilters);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-600" />
              </button>
              <div className="flex items-center gap-2">
                <Book size={20} className="text-purple-600" />
                <h1 className="text-xl font-bold text-slate-900">Koleksi Kata</h1>
                <div className="px-2.5 py-0.5 bg-purple-100 rounded-full">
                  <span className="text-xs font-bold text-purple-700">{stats.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            icon={Book}
            label="Total Kata"
            value={stats.total}
            color="purple-gradient"
          />
          <StatCard
            icon={CheckCircle}
            label="Total XP"
            value={stats.xp}
            color="purple-soft"
          />
          <StatCard
            icon={Globe}
            label="Perlu Review"
            value={stats.needReview}
            color="purple-soft"
          />
          <StatCard
            icon={Edit2}
            label="Mastered"
            value={stats.mastered || 0}
            color="purple-soft"
          />
        </div>

        {/* Segmented Control - Dynamic Subtest Filter */}
        <div className="bg-white rounded-xl p-1.5 shadow-sm border border-slate-200">
          <div className="flex gap-1 overflow-x-auto pb-1">
            {/* Filter: Semua Subtes */}
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-shrink-0 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Book size={14} className={activeTab === 'all' ? 'text-white' : 'text-purple-600'} />
              <span>Semua Subtes</span>
            </button>
            
            {/* Dynamic Subtest Filters - Only show subtests with saved vocabulary */}
            {ALL_SUBTEST_FILTERS.filter(f => f.id !== 'all').map((filter) => {
              const Icon = filter.icon;
              const isActive = activeTab === filter.id;
              const hasVocab = availableSubtests.includes(filter.id);
              
              // Only show subtests that have vocabulary OR are currently active
              if (!hasVocab && !isActive) return null;

              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveTab(filter.id)}
                  className={`flex-shrink-0 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-white' : `text-${filter.color}-600`} />
                  <span className="hidden sm:inline">{filter.label}</span>
                  <span className="sm:hidden">{filter.id.split('_').pop().toUpperCase()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kata atau arti..."
            className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm shadow-sm"
          />
          <button
            onClick={toggleFilters}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            title="Filter & Sort"
          >
            <Filter size={18} className={`text-slate-600 ${showFilters ? 'text-purple-600' : ''}`} />
          </button>
        </div>

        {/* Filter & Sort Controls */}
        {showFilters && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 space-y-4 animate-fade-in">
            {/* Status Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">
                Status
              </label>
              <div className="flex gap-2 flex-wrap">
                {STATUS_FILTERS.map((filter) => {
                  const Icon = filter.icon;
                  const isActive = statusFilter === filter.id;
                  
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setStatusFilter(filter.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Icon size={14} />
                      <span>{filter.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">
                Urutkan
              </label>
              <div className="flex gap-2 flex-wrap">
                {SORT_OPTIONS.map((option) => {
                  const isActive = sortBy === option.id;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => setSortBy(option.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <SortAsc size={14} />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Filters Summary */}
            {(statusFilter !== 'all' || sortBy !== 'newest') && (
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                <span className="text-xs text-slate-500">Filter aktif:</span>
                {statusFilter !== 'all' && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium">
                    {STATUS_FILTERS.find(f => f.id === statusFilter)?.label}
                  </span>
                )}
                {sortBy !== 'newest' && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium">
                    {SORT_OPTIONS.find(o => o.id === sortBy)?.label}
                  </span>
                )}
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setSortBy('newest');
                  }}
                  className="text-xs text-slate-500 hover:text-purple-600 underline"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        )}

        {/* Vocab Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-slate-200 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredList.length === 0 ? (
          <EmptyState subtest={activeTab} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredList.map((vocab) => (
              <VocabCard
                key={vocab.id}
                vocab={vocab}
                isEditing={editingId === vocab.id}
                editData={editData}
                onEdit={handleEdit}
                onSaveEdit={handleSaveEdit}
                onDelete={handleDelete}
                setEditData={setEditData}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colors = {
    cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-l-cyan-600' },
    teal: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-l-teal-600' },
    green: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-l-emerald-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-l-amber-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-l-purple-600' },
    'purple-gradient': { bg: 'bg-gradient-to-br from-purple-600 to-indigo-700', text: 'text-white', border: 'border-l-purple-600', isGradient: true },
    'purple-soft': { bg: 'bg-white', text: 'text-purple-700', border: 'border-l-purple-600', isSoft: true }
  };

  const cardColor = colors[color] || colors.cyan;

  return (
    <div className={`rounded-2xl p-6 shadow-md border-l-4 ${cardColor.border} ${cardColor.isGradient ? 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white' : 'bg-white border border-purple-100 shadow-sm'}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cardColor.isGradient ? 'bg-white/20' : cardColor.bg}`}>
          <Icon size={16} className={cardColor.isGradient ? 'text-white' : cardColor.text} />
        </div>
      </div>
      <p className={`text-xs mb-1 ${cardColor.isSoft ? 'text-slate-500' : 'text-white/90'}`}>{label}</p>
      <p className={`text-2xl font-bold ${cardColor.isSoft ? 'text-purple-700' : 'text-white'}`}>{value}</p>
    </div>
  );
};

const VocabCard = ({ vocab, isEditing, editData, onEdit, onSaveEdit, onDelete, setEditData }) => {
  const subtestColor = SUBTEST_COLORS[vocab.subtest] || SUBTEST_COLORS.default;
  const subtestLabel = getSubtestLabel(vocab.subtest);

  if (isEditing) {
    return (
      <div className={`bg-white rounded-xl p-4 border-2 ${subtestColor.border} shadow-sm`}>
        <input
          type="text"
          value={editData.word}
          onChange={(e) => setEditData({ ...editData, word: e.target.value })}
          className="w-full px-3 py-2 text-sm font-bold border border-slate-200 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Kata"
        />
        <input
          type="text"
          value={editData.meaning}
          onChange={(e) => setEditData({ ...editData, meaning: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Arti"
        />
        <input
          type="text"
          value={editData.example}
          onChange={(e) => setEditData({ ...editData, example: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Contoh (opsional)"
        />
        <div className="flex gap-2">
          <button
            onClick={() => onSaveEdit(vocab.id)}
            className="flex-1 px-3 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            Simpan
          </button>
          <button
            onClick={() => onEdit(null)}
            className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl p-4 border border-gray-200 border-l-4 ${subtestColor.border} shadow-sm hover:shadow-md transition-all group`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-bold text-slate-900">{vocab.word}</h3>
            {vocab.mastered && (
              <CheckCircle size={12} className="text-green-500" />
            )}
          </div>
          <div className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${subtestColor.bg} ${subtestColor.text} inline-block`}>
            {subtestLabel}
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(vocab)}
            className="p-1.5 hover:bg-slate-100 rounded transition-colors"
          >
            <Edit2 size={12} className="text-slate-600" />
          </button>
          <button
            onClick={() => onDelete(vocab.id)}
            className="p-1.5 hover:bg-rose-50 rounded transition-colors"
          >
            <Trash2 size={12} className="text-rose-600" />
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-600 mb-2 line-clamp-2">{vocab.meaning}</p>

      {vocab.example && (
        <p className="text-[10px] text-slate-500 italic line-clamp-2 border-t border-slate-100 pt-2">
          "{vocab.example}"
        </p>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <span className="text-[10px] text-slate-400">
          {vocab.reviewCount || 0}x review
        </span>
        <span className="text-[10px] font-semibold text-amber-600">
          +{vocab.xpEarned || 5} XP
        </span>
      </div>
    </div>
  );
};

const EmptyState = ({ subtest }) => {
  const subtestLabel = subtest === 'all' ? 'semua subtes' : getSubtestLabel(subtest);

  return (
    <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
      <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Book size={32} className="text-purple-500" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">
        Belum ada kata di {subtestLabel}
      </h3>
      <p className="text-sm text-slate-600 mb-6">
        Highlight teks saat mengerjakan soal untuk menyimpan kata baru
      </p>
    </div>
  );
};

export default VocabDashboard;
