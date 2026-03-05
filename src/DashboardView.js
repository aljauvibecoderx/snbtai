import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, BookOpen, History, ArrowLeft, TrendingUp, Award, Target, BarChart3, Trophy, Trash2, Search, Filter, CheckCircle, Camera, X, Bookmark, Globe, BookText, Edit2 } from 'lucide-react';
import { getMyQuestions, getPublicQuestions, getMyAttempts, deleteQuestionSet, getWishlist, removeFromWishlist } from './firebase';
import { getPublishedTryouts, getTryoutQuestions } from './firebase-admin';
import { ImageUploader } from './ImageUploader';
import { SUBTESTS, getSubtestLabel } from './subtestHelper';
import { PTNPediaView } from './ptnpedia';
import { getVocabList, deleteVocab, getVocabStats, updateVocab } from './vocab-firebase';


export const DashboardView = ({ user, onBack, onViewDetail, onStartQuiz, onVisionGenerate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get active tab from URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/ai-lens')) return 'ai-lens';
    if (path.includes('/official-tryouts')) return 'official';
    if (path.includes('/my-questions')) return 'my';
    if (path.includes('/question-bank')) return 'bank';
    if (path.includes('/wishlist')) return 'wishlist';
    if (path.includes('/history')) return 'riwayat';
    if (path.includes('/ptnpedia')) return 'ptnpedia';
    if (path.includes('/vocab')) return 'vocab';

    return 'overview';
  };
  
  const activeTab = getActiveTab();
  const [myQuestions, setMyQuestions] = useState([]);
  const [publicQuestions, setPublicQuestions] = useState([]);
  const [officialTryouts, setOfficialTryouts] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [vocabList, setVocabList] = useState([]);
  const [vocabStats, setVocabStats] = useState({ total: 0, xp: 0, needReview: 0, mastered: 0 });
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [subtestFilter, setSubtestFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [editingVocab, setEditingVocab] = useState(null);
  
  // Vision feature states
  const [showVisionModal, setShowVisionModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [visionSubtest, setVisionSubtest] = useState('tps_pu');
  const [visionModel, setVisionModel] = useState('mcq');
  const [isGeneratingVision, setIsGeneratingVision] = useState(false);
  const [loadingTryout, setLoadingTryout] = useState(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, location.pathname]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [my, pub, att, tryouts, wish, vocab, stats] = await Promise.all([
        getMyQuestions(user.uid),
        getPublicQuestions(),
        getMyAttempts(user.uid),
        getPublishedTryouts(),
        getWishlist(user.uid),
        getVocabList(user.uid),
        getVocabStats(user.uid)
      ]);
      
      console.log('📊 Dashboard Data Loaded:', {
        myQuestions: my.length,
        publicQuestions: pub.length,
        attempts: att.length,
        tryouts: tryouts.length,
        wishlist: wish.length,
        vocab: vocab.length
      });
      
      // Map attempts dengan question set data
      const attemptsWithSets = await Promise.all(
        att.map(async (attempt) => {
          if (attempt.setId) {
            const set = my.find(s => s.id === attempt.setId);
            return { ...attempt, setTitle: set?.title };
          }
          return attempt;
        })
      );
      
      setMyQuestions(my);
      setPublicQuestions(pub);
      setOfficialTryouts(tryouts);
      setAttempts(attemptsWithSets);
      setWishlist(wish);
      setVocabList(vocab);
      setVocabStats(stats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (setId) => {
    try {
      await deleteQuestionSet(setId, user.uid);
      setShowDeleteConfirm(null);
      loadData();
    } catch (error) {
      alert('Gagal menghapus soal. Coba lagi.');
    }
  };

  const groupBySubtest = (questions) => {
    const grouped = {};
    questions.forEach(q => {
      if (!grouped[q.subtest]) grouped[q.subtest] = [];
      grouped[q.subtest].push(q);
    });
    return grouped;
  };

  const getStats = () => {
    const totalQuestions = myQuestions.reduce((sum, set) => sum + (set.totalQuestions || 0), 0);
    const totalAttempts = attempts.length;
    const avgScore = attempts.length > 0 ? (attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length).toFixed(1) : 0;
    const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.score || 0)).toFixed(0) : 0;
    const subtestCount = myQuestions.length;
    return { totalQuestions, totalAttempts, avgScore, bestScore, subtestCount };
  };

  const handleVisionGenerate = async () => {
    if (!selectedImage || !visionSubtest) return;
    
    setIsGeneratingVision(true);
    try {
      await onVisionGenerate(selectedImage, visionSubtest, visionModel);
      setShowVisionModal(false);
      setSelectedImage(null);
    } catch (error) {
      alert('Gagal generate soal dari gambar. Coba lagi.');
    } finally {
      setIsGeneratingVision(false);
    }
  };

  const renderOverview = () => {
    const stats = getStats();
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-indigo-50 rounded-full -mr-10 sm:-mr-16 -mt-10 sm:-mt-16 opacity-50"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2 sm:mb-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <FileText size={16} className="sm:w-6 sm:h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-3xl font-bold text-slate-900">{stats.totalQuestions}</p>
                    <p className="text-[9px] sm:text-xs text-slate-500 font-medium">Total Soal</p>
                  </div>
                </div>
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{width: `${Math.min((stats.totalQuestions / 50) * 100, 100)}%`}}></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-teal-50 rounded-full -mr-10 sm:-mr-16 -mt-10 sm:-mt-16 opacity-50"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2 sm:mb-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-teal-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <Target size={16} className="sm:w-6 sm:h-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-3xl font-bold text-slate-900">{stats.totalAttempts}</p>
                    <p className="text-[9px] sm:text-xs text-slate-500 font-medium">Percobaan</p>
                  </div>
                </div>
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{width: `${Math.min((stats.totalAttempts / 20) * 100, 100)}%`}}></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-amber-50 rounded-full -mr-10 sm:-mr-16 -mt-10 sm:-mt-16 opacity-50"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2 sm:mb-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-amber-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <TrendingUp size={16} className="sm:w-6 sm:h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-3xl font-bold text-slate-900">{stats.avgScore}%</p>
                    <p className="text-[9px] sm:text-xs text-slate-500 font-medium">Rata-rata</p>
                  </div>
                </div>
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{width: `${stats.avgScore}%`}}></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-rose-50 rounded-full -mr-10 sm:-mr-16 -mt-10 sm:-mt-16 opacity-50"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2 sm:mb-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-rose-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <Trophy size={16} className="sm:w-6 sm:h-6 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-3xl font-bold text-slate-900">{stats.bestScore}%</p>
                    <p className="text-[9px] sm:text-xs text-slate-500 font-medium">Terbaik</p>
                  </div>
                </div>
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{width: `${stats.bestScore}%`}}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          {myQuestions.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">Paket Terbaru</h3>
                <button onClick={() => navigate('/dashboard/my-questions')} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Lihat Semua →</button>
              </div>
              <div className="space-y-3">
                {myQuestions.slice(0, 3).map((set, idx) => {
                  const mainSubtest = Object.keys(set.subtestSummary || {})[0] || 'tps_pu';
                  const subtestLabel = getSubtestLabel(mainSubtest);
                  return (
                    <div key={set.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all cursor-pointer" onClick={() => onViewDetail(set.id)}>
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText size={18} className="text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{set.title || 'Latihan SNBT'}</p>
                        <p className="text-xs text-slate-500">{set.totalQuestions || 0} soal • Level {set.complexity || 3}</p>
                      </div>
                      <div className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600 whitespace-nowrap">
                        {subtestLabel}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Right Column - Info Panel */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <BarChart3 size={18} />
              </div>
              <h3 className="font-bold">Ringkasan</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">Paket Soal</span>
                <span className="text-xl font-bold">{stats.subtestCount}</span>
              </div>
              <div className="h-px bg-white/20"></div>
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">Total Soal</span>
                <span className="text-xl font-bold">{stats.totalQuestions}</span>
              </div>
              <div className="h-px bg-white/20"></div>
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">Dikerjakan</span>
                <span className="text-xl font-bold">{stats.totalAttempts}x</span>
              </div>
            </div>
          </div>
          
          {/* Progress Info */}
          {stats.totalQuestions > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-4 text-sm">Progress Belajar</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-600">Soal Dibuat</span>
                    <span className="text-xs font-bold text-slate-800">{stats.totalQuestions}/50</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all" style={{width: `${Math.min((stats.totalQuestions / 50) * 100, 100)}%`}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-600">Target Skor</span>
                    <span className="text-xs font-bold text-slate-800">{stats.avgScore}/100</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full transition-all" style={{width: `${stats.avgScore}%`}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMyQuestions = () => {
    const colors = ['from-purple-500 to-purple-600', 'from-blue-500 to-blue-600', 'from-pink-500 to-pink-600', 'from-orange-500 to-orange-600', 'from-red-500 to-red-600', 'from-green-500 to-green-600', 'from-cyan-500 to-cyan-600'];
    
    const filteredQuestions = myQuestions.filter(set => {
      const query = searchQuery.toLowerCase();
      const shortId = set.id?.slice(-6).toUpperCase() || '';
      const matchSearch = !searchQuery || shortId.includes(searchQuery.toUpperCase()) || set.title?.toLowerCase().includes(query) || set.id?.toLowerCase().includes(query);
      const subtestList = Object.keys(set.subtestSummary || {});
      const mainSubtest = subtestList[0] || 'tps_pu';
      const matchSubtest = subtestFilter === 'all' || mainSubtest === subtestFilter;
      let matchTime = true;
      if (timeFilter === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const createdTime = set.createdAt?.seconds ? new Date(set.createdAt.seconds * 1000) : null;
        matchTime = createdTime && createdTime >= today;
      } else if (timeFilter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const createdTime = set.createdAt?.seconds ? new Date(set.createdAt.seconds * 1000) : null;
        matchTime = createdTime && createdTime >= weekAgo;
      }
      return matchSearch && matchSubtest && matchTime;
    });
    
    const groupedBySubtest = {};
    filteredQuestions.forEach(set => {
      const subtestList = Object.keys(set.subtestSummary || {});
      const mainSubtest = subtestList[0] || 'tps_pu';
      if (!groupedBySubtest[mainSubtest]) {
        groupedBySubtest[mainSubtest] = [];
      }
      groupedBySubtest[mainSubtest].push(set);
    });
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Cari berdasarkan Kode Soal..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select value={subtestFilter} onChange={(e) => setSubtestFilter(e.target.value)} className="w-full sm:w-auto pl-10 pr-8 py-2 sm:py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white appearance-none cursor-pointer">
                  <option value="all">Semua Subtes</option>
                  {SUBTESTS.map(st => <option key={st.id} value={st.id}>{st.label}</option>)}
                </select>
              </div>
              <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="px-3 py-2 sm:py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white appearance-none cursor-pointer">
                <option value="all">Semua Waktu</option>
                <option value="today">Baru Saja (Hari Ini)</option>
                <option value="week">Minggu Ini</option>
              </select>
            </div>
          </div>
          {(searchQuery || subtestFilter !== 'all' || timeFilter !== 'all') && <p className="text-xs text-slate-500 mt-2">Ditemukan {filteredQuestions.length} dari {myQuestions.length} paket soal</p>}
        </div>
        <div className="space-y-8">
        {SUBTESTS.map((subtest, subtestIdx) => {
          const sets = groupedBySubtest[subtest.id] || [];
          if (sets.length === 0) return null;
          
          const totalQuestions = sets.reduce((sum, set) => sum + (set.totalQuestions || 0), 0);
          const colorIdx = subtestIdx % colors.length;
          
          return (
            <div key={subtest.id}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-1 h-8 bg-gradient-to-b ${colors[colorIdx]} rounded-full`}></div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{subtest.label}</h3>
                    <p className="text-xs text-slate-500">{sets.length} paket • {totalQuestions} soal</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sets.map((set, idx) => {
                  const shortId = set.id?.slice(-6).toUpperCase() || 'XXXXXX';
                  
                  return (
                    <div key={set.id} className={`bg-gradient-to-br ${colors[colorIdx]} rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow relative group cursor-pointer`} onClick={() => onViewDetail(set.id)}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 bg-white/20 rounded text-xs font-bold">L{set.complexity || 3}</div>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(set.id); }}
                          className="p-1.5 bg-white/20 hover:bg-rose-500 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-xs opacity-75 mb-1">Kode Soal</p>
                        <p className="text-lg font-bold tracking-wider">#{shortId}</p>
                      </div>
                      
                      <div className="border-t border-white/20 pt-3 mb-3">
                        <p className="text-sm font-bold mb-2">{set.title || 'Latihan SNBT'}</p>
                        <p className="text-xs opacity-90">{set.totalQuestions || 0} soal</p>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs opacity-75">
                        <span>Status: Public</span>
                        <span>{set.createdAt?.seconds ? new Date(set.createdAt.seconds * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Baru'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        
        {myQuestions.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-400">
            <FileText size={64} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Belum ada soal yang dibuat</p>
            <p className="text-sm mt-2">Mulai buat soal pertamamu!</p>
          </div>
        )}
        {myQuestions.length > 0 && filteredQuestions.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-400">
            <Search size={64} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Tidak ditemukan</p>
            <p className="text-sm mt-2">Coba kata kunci lain</p>
          </div>
        )}
        </div>
      </div>
    );
  };

  const renderBankSoal = () => {
    const colors = ['from-purple-500 to-purple-600', 'from-blue-500 to-blue-600', 'from-pink-500 to-pink-600', 'from-orange-500 to-orange-600', 'from-red-500 to-red-600', 'from-green-500 to-green-600', 'from-cyan-500 to-cyan-600'];
    
    const filteredQuestions = publicQuestions.filter(set => {
      const query = searchQuery.toLowerCase();
      const shortId = set.id?.slice(-6).toUpperCase() || '';
      const matchSearch = !searchQuery || shortId.includes(searchQuery.toUpperCase()) || set.title?.toLowerCase().includes(query) || set.id?.toLowerCase().includes(query);
      const subtestList = Object.keys(set.subtestSummary || {});
      const mainSubtest = subtestList[0] || 'tps_pu';
      const matchSubtest = subtestFilter === 'all' || mainSubtest === subtestFilter;
      let matchTime = true;
      if (timeFilter === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const createdTime = set.createdAt?.seconds ? new Date(set.createdAt.seconds * 1000) : null;
        matchTime = createdTime && createdTime >= today;
      } else if (timeFilter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const createdTime = set.createdAt?.seconds ? new Date(set.createdAt.seconds * 1000) : null;
        matchTime = createdTime && createdTime >= weekAgo;
      }
      return matchSearch && matchSubtest && matchTime;
    });
    
    const groupedBySubtest = {};
    filteredQuestions.forEach(set => {
      const subtestList = Object.keys(set.subtestSummary || {});
      const mainSubtest = subtestList[0] || 'tps_pu';
      if (!groupedBySubtest[mainSubtest]) {
        groupedBySubtest[mainSubtest] = [];
      }
      groupedBySubtest[mainSubtest].push(set);
    });
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Cari berdasarkan Kode Soal..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select value={subtestFilter} onChange={(e) => setSubtestFilter(e.target.value)} className="w-full sm:w-auto pl-10 pr-8 py-2 sm:py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white appearance-none cursor-pointer">
                  <option value="all">Semua Subtes</option>
                  {SUBTESTS.map(st => <option key={st.id} value={st.id}>{st.label}</option>)}
                </select>
              </div>
              <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="px-3 py-2 sm:py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white appearance-none cursor-pointer">
                <option value="all">Semua Waktu</option>
                <option value="today">Baru Saja (Hari Ini)</option>
                <option value="week">Minggu Ini</option>
              </select>
            </div>
          </div>
          {(searchQuery || subtestFilter !== 'all' || timeFilter !== 'all') && <p className="text-xs text-slate-500 mt-2">Ditemukan {filteredQuestions.length} dari {publicQuestions.length} paket soal</p>}
        </div>
        <div className="space-y-8">
        {SUBTESTS.map((subtest, subtestIdx) => {
          const sets = groupedBySubtest[subtest.id] || [];
          if (sets.length === 0) return null;
          
          const totalQuestions = sets.reduce((sum, set) => sum + (set.totalQuestions || 0), 0);
          const colorIdx = subtestIdx % colors.length;
          
          return (
            <div key={subtest.id}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-1 h-8 bg-gradient-to-b ${colors[colorIdx]} rounded-full`}></div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{subtest.label}</h3>
                    <p className="text-xs text-slate-500">{sets.length} paket • {totalQuestions} soal</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sets.map((set) => {
                  const shortId = set.id?.slice(-6).toUpperCase() || 'XXXXXX';
                  return (
                    <div key={set.id} className={`bg-gradient-to-br ${colors[colorIdx]} rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer`} onClick={() => onStartQuiz(set.id)}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 bg-white/20 rounded text-xs font-bold">L{set.complexity || 3}</div>
                        </div>
                        <BookOpen size={20} className="opacity-80" />
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-xs opacity-75 mb-1">Kode Soal</p>
                        <p className="text-lg font-bold tracking-wider">#{shortId}</p>
                      </div>
                      
                      <div className="border-t border-white/20 pt-3 mb-3">
                        <p className="text-sm font-bold mb-2 line-clamp-2">{set.title}</p>
                        <p className="text-xs opacity-90">{set.totalQuestions || 0} soal</p>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs opacity-75">
                        <span>Klik untuk mengerjakan →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        
        {publicQuestions.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-400">
            <BookOpen size={64} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Belum ada soal publik</p>
          </div>
        )}
        {publicQuestions.length > 0 && filteredQuestions.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-400">
            <Search size={64} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Tidak ditemukan</p>
            <p className="text-sm mt-2">Coba kata kunci lain</p>
          </div>
        )}
        </div>
      </div>
    );
  };

  const renderOfficialTryouts = () => {
    const handleStartTryout = async (tryout) => {
      setLoadingTryout(tryout.id);
      try {
        if (!tryout.slug) {
          alert('Tryout tidak memiliki slug URL!');
          return;
        }
        
        const questions = await getTryoutQuestions(tryout.questionsList);
        if (questions.length === 0) {
          alert('Tryout tidak memiliki soal!');
          return;
        }
        
        // Start quiz with slug-based routing
        onStartQuiz(tryout.id, questions, tryout);
      } catch (error) {
        console.error('Error starting tryout:', error);
        alert('Gagal memulai tryout. Coba lagi.');
      } finally {
        setLoadingTryout(null);
      }
    };
    
    if (officialTryouts.length === 0) {
      return (
        <div className="text-center py-16 text-slate-400">
          <Trophy size={64} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Belum ada tryout resmi</p>
          <p className="text-sm mt-2">Tryout resmi akan muncul di sini</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {officialTryouts.map((tryout) => {
          const isLoading = loadingTryout === tryout.id;
          
          return (
          <div key={tryout.id} className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-400 rounded-2xl p-6 shadow-xl relative overflow-hidden hover:shadow-2xl transition-all cursor-pointer" onClick={() => !isLoading && handleStartTryout(tryout)}>
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-sm font-medium text-amber-700">Memuat soal...</p>
                </div>
              </div>
            )}
            
            {/* Official Badge */}
            <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <CheckCircle size={14} />
              OFFICIAL
            </div>
            
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900 mb-2 pr-20">{tryout.title}</h3>
              <p className="text-sm text-slate-600">{tryout.description}</p>
              {tryout.slug && (
                <p className="text-xs text-amber-700 mt-2 font-mono">/{tryout.slug}</p>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{tryout.questionsList?.length || 0}</div>
                <div className="text-xs text-slate-600">Soal</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{Math.floor((tryout.totalDuration || 0) / 60)}</div>
                <div className="text-xs text-slate-600">Menit</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{tryout.stats?.totalAttempts || 0}</div>
                <div className="text-xs text-slate-600">Peserta</div>
              </div>
            </div>
            
            <div className="bg-white/50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Avg Score:</span>
                <span className="font-bold text-amber-700">{(tryout.stats?.averageScore || 0).toFixed(1)}</span>
              </div>
            </div>
            
            <button 
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '⏳ Memuat...' : '🚀 Mulai Tryout Resmi'}
            </button>
          </div>
        );})}
      </div>
    );
  };
  
  const renderWishlist = () => {
    const colors = ['from-pink-500 to-pink-600', 'from-purple-500 to-purple-600', 'from-rose-500 to-rose-600'];
    
    const groupedBySubtest = {};
    wishlist.forEach(item => {
      const subtest = item.subtest || 'tps_pu';
      if (!groupedBySubtest[subtest]) {
        groupedBySubtest[subtest] = [];
      }
      groupedBySubtest[subtest].push(item);
    });
    
    const handleViewWishlistQuestion = (item) => {
      onViewDetail(item.questionSetId, item.questionIndex);
    };
    
    const handleRemoveWishlist = async (wishlistId) => {
      try {
        await removeFromWishlist(wishlistId);
        loadData();
      } catch (error) {
        alert('Gagal menghapus dari wishlist');
      }
    };
    
    if (wishlist.length === 0) {
      return (
        <div className="text-center py-16 text-slate-400">
          <Bookmark size={64} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Belum ada soal di wishlist</p>
          <p className="text-sm mt-2">Simpan soal yang ingin dipelajari nanti</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-8">
        {SUBTESTS.map((subtest, subtestIdx) => {
          const items = groupedBySubtest[subtest.id] || [];
          if (items.length === 0) return null;
          
          const colorIdx = subtestIdx % colors.length;
          
          return (
            <div key={subtest.id}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-1 h-8 bg-gradient-to-b ${colors[colorIdx]} rounded-full`}></div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{subtest.label}</h3>
                    <p className="text-xs text-slate-500">{items.length} soal tersimpan</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item, idx) => {
                  const question = item.question || {};
                  return (
                    <div 
                      key={item.id} 
                      className={`bg-gradient-to-br ${colors[colorIdx]} rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow relative group cursor-pointer`}
                      onClick={() => handleViewWishlistQuestion(item)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Bookmark size={16} fill="currentColor" />
                          <span className="text-xs font-bold">Soal #{item.questionIndex + 1}</span>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRemoveWishlist(item.id); }}
                          className="p-1.5 bg-white/20 hover:bg-rose-500 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-xs opacity-75 mb-1">Dari Paket</p>
                        <p className="text-sm font-bold line-clamp-2">{item.setTitle || 'Latihan SNBT'}</p>
                      </div>
                      
                      <div className="border-t border-white/20 pt-3">
                        <p className="text-xs opacity-90 line-clamp-2">{question.text || 'Soal tersimpan'}</p>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs opacity-75 mt-3">
                        <span>Klik untuk lihat</span>
                        <span>{item.savedAt?.seconds ? new Date(item.savedAt.seconds * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Baru'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  const renderRiwayat = () => {
    if (attempts.length === 0) {
      return (
        <div className="text-center py-16 text-slate-400">
          <History size={64} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Belum ada riwayat</p>
          <p className="text-sm mt-2">Mulai kerjakan soal untuk melihat riwayat</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {attempts.map((attempt, idx) => {
          const subtest = SUBTESTS.find(s => s.id === attempt.subtest);
          const date = attempt.finishedAt?.seconds 
            ? new Date(attempt.finishedAt.seconds * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
            : 'Baru saja';
          const scoreColor = attempt.score >= 80 ? 'text-teal-600' : attempt.score >= 60 ? 'text-amber-600' : 'text-rose-600';
          
          return (
            <div key={attempt.id || idx} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <History size={18} className="text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-slate-800">{attempt.setTitle || subtest?.label || 'Latihan SNBT'}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span>{date}</span>
                      <span>•</span>
                      <span>{attempt.mode === 'game' ? '🎮 Game' : '📝 Ujian'}</span>
                      <span>•</span>
                      <span>{Math.floor((attempt.timeUsed || 0) / 60)}:{((attempt.timeUsed || 0) % 60).toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className={`text-2xl font-bold ${scoreColor}`}>{(attempt.score || 0).toFixed(0)}%</div>
                  <div className="text-xs text-slate-500">{attempt.correctAnswers || 0}/{attempt.totalQuestions || 0}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderVocab = () => {
    const filteredVocab = vocabList.filter(v => {
      const query = searchQuery.toLowerCase();
      return !searchQuery || v.word.toLowerCase().includes(query);
    });

    const handleDeleteVocab = async (vocabId) => {
      try {
        await deleteVocab(vocabId);
        loadData();
      } catch (error) {
        alert('Gagal menghapus vocab');
      }
    };

    const handleEditVocab = async () => {
      if (!editingVocab) return;
      try {
        await updateVocab(editingVocab.id, {
          word: editingVocab.word,
          meaning: editingVocab.meaning,
          example: editingVocab.example || ''
        });
        setEditingVocab(null);
        loadData();
      } catch (error) {
        alert('Gagal mengupdate vocab');
      }
    };

    if (vocabList.length === 0) {
      return (
        <div className="text-center py-16 text-slate-400">
          <BookText size={64} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Belum ada vocab tersimpan</p>
          <p className="text-sm mt-2">Highlight kata saat mengerjakan soal Literasi Bahasa Inggris</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {editingVocab && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Edit Vocab</h3>
                <button onClick={() => setEditingVocab(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Kata</label>
                  <input
                    type="text"
                    value={editingVocab.word}
                    onChange={(e) => setEditingVocab({...editingVocab, word: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Arti</label>
                  <input
                    type="text"
                    value={editingVocab.meaning}
                    onChange={(e) => setEditingVocab({...editingVocab, meaning: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Contoh (opsional)</label>
                  <input
                    type="text"
                    value={editingVocab.example || ''}
                    onChange={(e) => setEditingVocab({...editingVocab, example: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>
              <button
                onClick={handleEditVocab}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold mb-1">{vocabStats.total}</div>
            <div className="text-sm opacity-90">Total Kata</div>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold mb-1">{vocabStats.xp}</div>
            <div className="text-sm opacity-90">Total XP</div>
          </div>
          <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold mb-1">{vocabStats.needReview}</div>
            <div className="text-sm opacity-90">Perlu Review</div>
          </div>
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="text-3xl font-bold mb-1">{vocabStats.mastered}</div>
            <div className="text-sm opacity-90">Mastered</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari kata..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            />
          </div>
          {searchQuery && <p className="text-xs text-slate-500 mt-2">Ditemukan {filteredVocab.length} dari {vocabList.length} kata</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVocab.map((vocab) => (
            <div key={vocab.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{vocab.word}</h3>
                  <p className="text-sm text-slate-600">{vocab.meaning}</p>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => setEditingVocab(vocab)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteVocab(vocab.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              {vocab.example && (
                <div className="p-3 bg-slate-50 rounded-lg mb-3">
                  <p className="text-xs text-slate-600 italic">"{vocab.example}"</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{vocab.source === 'highlight' ? '✨ Highlight' : '🔍 Manual'}</span>
                <span>+{vocab.xpEarned || 5} XP</span>
              </div>
            </div>
          ))}
        </div>

        {filteredVocab.length === 0 && vocabList.length > 0 && (
          <div className="text-center py-16 text-slate-400">
            <Search size={64} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Tidak ditemukan</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F3F4F8] relative overflow-x-hidden">
      {showVisionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Camera size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">UTBK-AI Lens</h3>
                  <p className="text-xs text-slate-500">Generate soal dari gambar</p>
                </div>
              </div>
              <button onClick={() => { setShowVisionModal(false); setSelectedImage(null); }} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={20} className="text-slate-600" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Pilih Subtes</label>
                <select value={visionSubtest} onChange={(e) => setVisionSubtest(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm">
                  {SUBTESTS.map(st => <option key={st.id} value={st.id}>{st.label}</option>)}
                </select>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Tipe Soal</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setVisionModel('mcq')} className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${visionModel === 'mcq' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-indigo-200'}`}>
                    Pilihan Ganda
                  </button>
                  <button onClick={() => setVisionModel('grid_boolean')} className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${visionModel === 'grid_boolean' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-indigo-200'}`}>
                    Tabel Ya/Tidak
                  </button>
                </div>
              </div>
              
              <ImageUploader 
                onImageSelect={setSelectedImage} 
                selectedSubtest={visionSubtest}
                selectedModel={visionModel}
                onGenerate={handleVisionGenerate}
                isGenerating={isGeneratingVision}
              />
            </div>
          </div>
        </div>
      )}
      
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-rose-600" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Hapus Paket Soal?</h3>
              <p className="text-slate-600 text-sm mb-6">Semua soal dalam paket ini akan dihapus permanen dari database.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">
                  Batal
                </button>
                <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Background Blur Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500 rounded-full blur-[120px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 relative z-10">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <button onClick={() => { onBack(); window.history.pushState({}, '', '/'); }} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md">
              <ArrowLeft size={18} className="sm:w-5 sm:h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Kelola soal dan pantau progresmu</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto bg-white rounded-2xl p-2 shadow-lg border border-slate-200 scrollbar-hide">
          <button onClick={() => navigate('/dashboard/overview')} className={`px-3 sm:px-5 py-2 sm:py-3 rounded-xl text-[11px] sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${activeTab === 'overview' ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
            <BarChart3 size={14} className="sm:w-4 sm:h-4" /><span>Overview</span>
          </button>
          <button onClick={() => navigate('/dashboard/ptnpedia')} className={`px-3 sm:px-5 py-2 sm:py-3 rounded-xl text-[11px] sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${activeTab === 'ptnpedia' ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Globe size={14} className="sm:w-4 sm:h-4" /><span>PTNPedia</span>
          </button>
          <button onClick={() => navigate('/dashboard/ai-lens')} className={`px-3 sm:px-5 py-2 sm:py-3 rounded-xl text-[11px] sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${activeTab === 'ai-lens' ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Camera size={14} className="sm:w-4 sm:h-4" /><span>AI Lens</span>
          </button>
          <button onClick={() => navigate('/dashboard/official-tryouts')} className={`px-3 sm:px-5 py-2 sm:py-3 rounded-xl text-[11px] sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${activeTab === 'official' ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Trophy size={14} className="sm:w-4 sm:h-4" /><span>Tryout Resmi</span>
          </button>
          <button onClick={() => navigate('/dashboard/my-questions')} className={`px-3 sm:px-5 py-2 sm:py-3 rounded-xl text-[11px] sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${activeTab === 'my' ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
            <FileText size={14} className="sm:w-4 sm:h-4" /><span>Soal Saya</span>
          </button>
          <button onClick={() => navigate('/dashboard/question-bank')} className={`px-3 sm:px-5 py-2 sm:py-3 rounded-xl text-[11px] sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${activeTab === 'bank' ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
            <BookOpen size={14} className="sm:w-4 sm:h-4" /><span>Bank Soal</span>
          </button>
          <button onClick={() => navigate('/dashboard/wishlist')} className={`px-3 sm:px-5 py-2 sm:py-3 rounded-xl text-[11px] sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${activeTab === 'wishlist' ? 'bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Bookmark size={14} className="sm:w-4 sm:h-4" /><span>Wishlist</span>
          </button>
          <button onClick={() => navigate('/dashboard/history')} className={`px-3 sm:px-5 py-2 sm:py-3 rounded-xl text-[11px] sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${activeTab === 'riwayat' ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
            <History size={14} className="sm:w-4 sm:h-4" /><span>Riwayat</span>
          </button>
          <button onClick={() => navigate('/dashboard/vocab')} className={`px-3 sm:px-5 py-2 sm:py-3 rounded-xl text-[11px] sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap flex-shrink-0 ${activeTab === 'vocab' ? 'bg-gradient-to-r from-indigo-600 to-purple-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
            <BookText size={14} className="sm:w-4 sm:h-4" /><span>Vocab</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600"></div>
            <p className="text-slate-500 mt-4">Memuat data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'ptnpedia' && <PTNPediaView user={user} onBack={() => navigate('/dashboard/overview')} />}
            {activeTab === 'ai-lens' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="text-center py-12">
                  <Camera size={64} className="mx-auto mb-4 text-purple-600 opacity-50" />
                  <h3 className="text-lg font-bold text-slate-800 mb-2">AI Lens</h3>
                  <p className="text-sm text-slate-600 mb-6">Generate soal dari gambar dengan AI</p>
                  <button onClick={() => setShowVisionModal(true)} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all">
                    Buka AI Lens
                  </button>
                </div>
              </div>
            )}
            {activeTab === 'official' && renderOfficialTryouts()}
            {activeTab === 'my' && renderMyQuestions()}
            {activeTab === 'bank' && renderBankSoal()}
            {activeTab === 'wishlist' && renderWishlist()}
            {activeTab === 'riwayat' && renderRiwayat()}
            {activeTab === 'vocab' && renderVocab()}
          </>
        )}
      </div>
    </div>
  );
};
