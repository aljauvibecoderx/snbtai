import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, BookOpen, History, ArrowLeft, TrendingUp, Award, Target, BarChart3, Trophy, Trash2, Search, Filter, CheckCircle, Camera, X, Bookmark, Globe, BookText, Edit2 } from 'lucide-react';
import { getMyQuestions, getPublicQuestions, getMyAttempts, deleteQuestionSet, getWishlist, removeFromWishlist } from '../../services/firebase/firebase';
import { getPublishedTryouts, getTryoutQuestions } from '../../services/firebase/firebase-admin';
import { ImageUploader } from '../../components/common/ImageUploader';
import { SUBTESTS, getSubtestLabel } from '../../constants/subtestHelper';
import { PTNPediaView } from '../ptnpedia/ptnpedia';
import { getVocabList, deleteVocab, getVocabStats, updateVocab, saveVocab, subscribeToVocabList } from '../../services/vocab/vocab-firebase';
import { UnifiedNavbar } from '../../components/layout/UnifiedNavbar';
import { auth } from '../../services/firebase/firebase';
import { useTokenBalance } from '../../hooks/useTokenBalance';
import ProgressTracker from '../../components/ProgressTracker';


export const DashboardView = ({ user, onBack, onViewDetail, onStartQuiz, onVisionGenerate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const tokenBalance = useTokenBalance();
  
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
    if (path.includes('/progress')) return 'progress';

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
  const [showAddVocab, setShowAddVocab] = useState(false);
  const [newVocab, setNewVocab] = useState({ word: '', meaning: '', example: '' });
  
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
      
      // Setup real-time listener for vocab
      const unsubscribeVocab = subscribeToVocabList(user.uid, (vocabList) => {
        setVocabList(vocabList);
        // Update stats when vocab changes
        getVocabStats(user.uid).then(stats => setVocabStats(stats));
      });
      
      return () => {
        unsubscribeVocab();
      };
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
    const greeting = new Date().getHours() < 12 ? 'Selamat pagi' : new Date().getHours() < 18 ? 'Selamat siang' : 'Selamat malam';
    
    return (
      <div className="space-y-6">
        {/* Mobile Header - Only visible on mobile */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-indigo-200 p-0.5">
                  <img 
                    alt="User Profile" 
                    className="w-full h-full rounded-full object-cover" 
                    src={user?.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.displayName || 'User')}
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <p className="text-caption text-slate-400 uppercase tracking-wider">{greeting},</p>
                <h1 className="text-h4 text-slate-900">{user?.displayName || 'User'}</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-50 stat-card-hover flex flex-col gap-2 dash-fade-up d-delay-80">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <FileText size={20} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-label text-slate-400 mb-1">Total Soal</p>
                  <p className="text-stat text-slate-900">{stats.totalQuestions}</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-50 stat-card-hover flex flex-col gap-2 dash-fade-up d-delay-160">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Target size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-label text-slate-400 mb-1">Percobaan</p>
                  <p className="text-stat text-slate-900">{stats.totalAttempts}</p>
                </div>
              </div>
            </div>

            {/* Paket Terbaru - Moved here */}
            {myQuestions.length > 0 && (
              <div className="space-y-4 dash-fade-up d-delay-250">
                <div className="flex items-center justify-between">
                  <h2 className="text-h4 text-slate-800">Paket Terbaru</h2>
                  <button 
                    onClick={() => navigate('/dashboard/my-questions')} 
                    className="text-btn text-indigo-600 font-semibold hover:text-indigo-700"
                  >
                    Semua
                  </button>
                </div>
                <div className="space-y-3">
                  {myQuestions.slice(0, 3).map((set) => {
                    const mainSubtest = Object.keys(set.subtestSummary || {})[0] || 'tps_pu';
                    const subtestLabel = getSubtestLabel(mainSubtest);
                    const shortId = set.id?.slice(-6).toUpperCase() || 'XXXXXX';
                    
                    return (
                      <div 
                        key={set.id} 
                        className="bg-white p-4 rounded-xl flex items-center justify-between border border-slate-50 shadow-sm dash-shadow-hover cursor-pointer"
                        onClick={() => onViewDetail(set.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <FileText size={24} />
                          </div>
                          <div>
                            <h4 className="text-body-sm font-bold text-slate-800">#{shortId}</h4>
                            <p className="text-caption text-slate-400">{set.totalQuestions || 0} Soal • Level {set.complexity || 3}</p>
                          </div>
                        </div>
                        <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                          <span className="text-slate-400 text-sm">→</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column - Info Panel (Desktop Only) */}
          <div className="hidden lg:block space-y-6">
            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg stat-card-hover dash-fade-up d-delay-120">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <BarChart3 size={18} />
                </div>
                <h3 className="text-h4 text-white">Ringkasan</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-body-sm opacity-90">Paket Soal</span>
                  <span className="text-stat-sm font-bold">{stats.subtestCount}</span>
                </div>
                <div className="h-px bg-white/20"></div>
                <div className="flex items-center justify-between">
                  <span className="text-body-sm opacity-90">Total Soal</span>
                  <span className="text-stat-sm font-bold">{stats.totalQuestions}</span>
                </div>
                <div className="h-px bg-white/20"></div>
                <div className="flex items-center justify-between">
                  <span className="text-body-sm opacity-90">Dikerjakan</span>
                  <span className="text-stat-sm font-bold">{stats.totalAttempts}x</span>
                </div>
              </div>
            </div>
            
            {/* Additional Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 dash-fade-up d-delay-200">
              <h4 className="text-label text-slate-500 mb-4">Statistik Lainnya</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-caption text-slate-500">Rata-rata Skor</span>
                  <span className="text-stat-sm text-amber-600">{stats.avgScore}%</span>
                </div>
                <div className="h-px bg-slate-100"></div>
                <div className="flex items-center justify-between">
                  <span className="text-caption text-slate-500">Skor Terbaik</span>
                  <span className="text-stat-sm text-rose-600">{stats.bestScore}%</span>
                </div>
              </div>
            </div>
            
            {/* Progress Belajar - Moved here */}
            {stats.totalQuestions > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 dash-fade-up d-delay-300">
                <h4 className="text-label text-slate-500 mb-4">Progress Belajar</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-slate-600">Soal Dikerjakan</span>
                      <span className="text-xs font-bold text-indigo-600">{Math.min((stats.totalAttempts / 20) * 100, 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{width: `${Math.min((stats.totalAttempts / 20) * 100, 100)}%`}}></div>
                    </div>
                    <p className="mt-1.5 text-[10px] text-slate-500 flex items-center gap-1">
                      <CheckCircle size={12} /> {stats.totalAttempts}/20 Percobaan
                    </p>
                  </div>
                  
                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-slate-600">Target Skor</span>
                      <span className="text-xs font-bold text-orange-500">{stats.avgScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{width: `${stats.avgScore}%`}}></div>
                    </div>
                    <p className="mt-1.5 text-[10px] text-slate-500 flex items-center gap-1">
                      <CheckCircle size={12} /> Rata-rata skor
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
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
            <p className="text-body text-slate-400 font-medium">Belum ada soal yang dibuat</p>
            <p className="text-body-sm text-slate-400 mt-2">Mulai buat soal pertamamu!</p>
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
                <div className="text-stat-sm font-extrabold text-amber-600">{tryout.questionsList?.length || 0}</div>
                <div className="text-caption text-slate-500">Soal</div>
              </div>
              <div className="text-center">
                <div className="text-stat-sm font-extrabold text-amber-600">{Math.floor((tryout.totalDuration || 0) / 60)}</div>
                <div className="text-caption text-slate-500">Menit</div>
              </div>
              <div className="text-center">
                <div className="text-stat-sm font-extrabold text-amber-600">{tryout.stats?.totalAttempts || 0}</div>
                <div className="text-caption text-slate-500">Peserta</div>
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
                    <h3 className="text-h4 text-slate-800">{subtest.label}</h3>
                    <p className="text-caption text-slate-400">{items.length} soal tersimpan</p>
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
            <div
            key={attempt.id || idx}
            className="bg-white rounded-xl p-4 dash-shadow border border-slate-100 riwayat-row dash-row-slide"
            style={{ animationDelay: `${idx * 55}ms` }}
          >
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

    const handleAddVocab = async () => {
      if (!newVocab.word || !newVocab.meaning) {
        alert('Kata dan arti harus diisi');
        return;
      }
      try {
        await saveVocab(user.uid, {
          word: newVocab.word.trim(),
          meaning: newVocab.meaning.trim(),
          example: newVocab.example.trim(),
          source: 'manual'
        });
        setShowAddVocab(false);
        setNewVocab({ word: '', meaning: '', example: '' });
        loadData();
      } catch (error) {
        alert('Gagal menambah vocab');
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
        {showAddVocab && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Tambah Vocab Baru</h3>
                <button onClick={() => { setShowAddVocab(false); setNewVocab({ word: '', meaning: '', example: '' }); }} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Kata *</label>
                  <input
                    type="text"
                    value={newVocab.word}
                    onChange={(e) => setNewVocab({...newVocab, word: e.target.value})}
                    placeholder="Masukkan kata bahasa Inggris"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Arti *</label>
                  <input
                    type="text"
                    value={newVocab.meaning}
                    onChange={(e) => setNewVocab({...newVocab, meaning: e.target.value})}
                    placeholder="Arti dalam bahasa Indonesia"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Contoh (opsional)</label>
                  <input
                    type="text"
                    value={newVocab.example}
                    onChange={(e) => setNewVocab({...newVocab, example: e.target.value})}
                    placeholder="Contoh kalimat"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>
              <button
                onClick={handleAddVocab}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
              >
                Tambah Vocab
              </button>
            </div>
          </div>
        )}
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
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg stat-card-hover dash-fade-up d-delay-0">
            <div className="text-3xl font-bold mb-1">{vocabStats.total}</div>
            <div className="text-sm opacity-90">Total Kata</div>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg stat-card-hover dash-fade-up d-delay-80">
            <div className="text-3xl font-bold mb-1">{vocabStats.xp}</div>
            <div className="text-sm opacity-90">Total XP</div>
          </div>
          <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg stat-card-hover dash-fade-up d-delay-160">
            <div className="text-3xl font-bold mb-1">{vocabStats.needReview}</div>
            <div className="text-sm opacity-90">Perlu Review</div>
          </div>
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg stat-card-hover dash-fade-up d-delay-250">
            <div className="text-3xl font-bold mb-1">{vocabStats.mastered}</div>
            <div className="text-sm opacity-90">Mastered</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari kata..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              />
            </div>
            <button
              onClick={() => setShowAddVocab(true)}
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm whitespace-nowrap"
            >
              + Tambah Vocab
            </button>
          </div>
          {searchQuery && <p className="text-xs text-slate-500 mt-2">Ditemukan {filteredVocab.length} dari {vocabList.length} kata</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVocab.map((vocab) => (
            <div key={vocab.id} className="bg-white rounded-2xl p-5 dash-shadow border border-slate-100 vocab-card group">
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
    <div className="min-h-screen bg-[#F3F4F8] relative">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* ── Premium Shadow System ── */
        .dash-shadow {
          box-shadow:
            0 1px 2px rgba(0,0,0,0.04),
            0 4px 12px rgba(0,0,0,0.05),
            0 8px 24px rgba(0,0,0,0.03);
        }
        .dash-shadow-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .dash-shadow-hover:hover {
          transform: translateY(-3px);
          box-shadow:
            0 2px 4px rgba(0,0,0,0.05),
            0 10px 28px rgba(99,102,241,0.12),
            0 18px 44px rgba(99,102,241,0.08);
        }
        .stat-card-hover {
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .stat-card-hover:hover {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 8px 28px rgba(99,102,241,0.18);
        }

        /* ── Entrance Animations ── */
        @keyframes dashFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dashFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dashSlideRight {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes dashFloatOrb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(10px, -14px) scale(1.05); }
        }
        @keyframes progressGrow {
          from { width: 0%; }
          to   { width: var(--progress-width); }
        }
        @keyframes rowSlide {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .dash-fade-up    { animation: dashFadeUp 0.45s cubic-bezier(.22,.68,0,1.2) both; }
        .dash-fade-in    { animation: dashFadeIn 0.4s ease both; }
        .dash-slide-r    { animation: dashSlideRight 0.4s ease both; }
        .dash-row-slide  { animation: rowSlide 0.35s ease both; }
        .dash-orb        { animation: dashFloatOrb 8s ease-in-out infinite; }
        .dash-orb-2      { animation: dashFloatOrb 11s ease-in-out infinite reverse; }
        .progress-anim   { animation: progressGrow 0.9s cubic-bezier(.22,.68,0,1) both; }

        .d-delay-0   { animation-delay: 0ms; }
        .d-delay-80  { animation-delay: 80ms; }
        .d-delay-120 { animation-delay: 120ms; }
        .d-delay-160 { animation-delay: 160ms; }
        .d-delay-200 { animation-delay: 200ms; }
        .d-delay-250 { animation-delay: 250ms; }
        .d-delay-300 { animation-delay: 300ms; }
        .d-delay-350 { animation-delay: 350ms; }
        .d-delay-400 { animation-delay: 400ms; }

        /* ── Tab content fade ── */
        .tab-content { animation: dashFadeIn 0.3s ease both; }

        /* ── Vocab card hover ── */
        .vocab-card {
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .vocab-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(99,102,241,0.12);
        }

        /* ── Riwayat row hover ── */
        .riwayat-row {
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .riwayat-row:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 16px rgba(99,102,241,0.10);
        }
      `}</style>
      {/* Background Blur Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="dash-orb absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-400/15 rounded-full blur-[120px]" />
        <div className="dash-orb-2 absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-400/15 rounded-full blur-[120px]" />
        <div className="dash-orb absolute top-1/2 right-[5%] w-[20%] h-[20%] bg-purple-300/10 rounded-full blur-[90px]" style={{animationDelay:'4s'}} />
      </div>

      {/* Unified Navbar */}
      <UnifiedNavbar
        user={user}
        onLogin={() => navigate('/login')}
        onLogout={() => {
          auth.signOut();
          navigate('/');
        }}
        navigate={navigate}
        setView={() => {}}
        dailyUsage={attempts.length}
        totalQuestionsInBank={publicQuestions.length}
        remainingQuota={19 - attempts.filter(a => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const attemptDate = a.finishedAt?.seconds ? new Date(a.finishedAt.seconds * 1000) : new Date();
          attemptDate.setHours(0, 0, 0, 0);
          return attemptDate.getTime() === today.getTime();
        }).length}
        isAdmin={false}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        variant="dashboard"
        showBackButton={true}
        onBack={() => { onBack(); navigate('/app'); }}
        coinBalance={tokenBalance}
      />

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
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 pt-28 sm:pt-32 relative z-10">
        {/* Premium Glassmorphism Navigation Bar */}
        <div className="mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="overflow-x-auto no-scrollbar">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-xl rounded-full p-2 shadow-lg border border-white/20 min-w-min">
              <button 
                onClick={() => navigate('/dashboard/overview')} 
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap min-h-[44px] ${
                  activeTab === 'overview' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                <BarChart3 size={18} strokeWidth={2} />
                <span className="text-sm font-semibold">Overview</span>
              </button>
              
              <button 
                onClick={() => navigate('/dashboard/ptnpedia')} 
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap min-h-[44px] ${
                  activeTab === 'ptnpedia' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                <Globe size={18} strokeWidth={2} />
                <span className="text-sm font-semibold">PTNPedia</span>
              </button>
              
              <button 
                onClick={() => navigate('/dashboard/ai-lens')} 
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap min-h-[44px] ${
                  activeTab === 'ai-lens' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                <Camera size={18} strokeWidth={2} />
                <span className="text-sm font-semibold">AI Lens</span>
              </button>
              
              <button 
                onClick={() => navigate('/dashboard/official-tryouts')} 
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap min-h-[44px] ${
                  activeTab === 'official' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                <Trophy size={18} strokeWidth={2} />
                <span className="text-sm font-semibold">Tryout</span>
              </button>
              
              <button 
                onClick={() => navigate('/dashboard/my-questions')} 
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap min-h-[44px] ${
                  activeTab === 'my' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                <FileText size={18} strokeWidth={2} />
                <span className="text-sm font-semibold">Soal Saya</span>
              </button>
              
              <button 
                onClick={() => navigate('/dashboard/question-bank')} 
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap min-h-[44px] ${
                  activeTab === 'bank' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                <BookOpen size={18} strokeWidth={2} />
                <span className="text-sm font-semibold">Bank Soal</span>
              </button>
              
              <button 
                onClick={() => navigate('/dashboard/wishlist')} 
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap min-h-[44px] ${
                  activeTab === 'wishlist' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                <Bookmark size={18} strokeWidth={2} />
                <span className="text-sm font-semibold">Wishlist</span>
              </button>
              
              <button 
                onClick={() => navigate('/dashboard/vocab')} 
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap min-h-[44px] ${
                  activeTab === 'vocab' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                <BookText size={18} strokeWidth={2} />
                <span className="text-sm font-semibold">Vocab</span>
              </button>
              
              <button 
                onClick={() => navigate('/dashboard/progress')} 
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 whitespace-nowrap min-h-[44px] ${
                  activeTab === 'progress' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                <Target size={18} strokeWidth={2} />
                <span className="text-sm font-semibold">Progress</span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600"></div>
            <p className="text-slate-500 mt-4">Memuat data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && <div className="tab-content">{renderOverview()}</div>}
            {activeTab === 'ptnpedia' && <div className="tab-content"><PTNPediaView user={user} onBack={() => navigate('/dashboard/overview')} /></div>}
            {activeTab === 'ai-lens' && (
              <div className="tab-content bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
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
            {activeTab === 'official' && <div className="tab-content">{renderOfficialTryouts()}</div>}
            {activeTab === 'my' && <div className="tab-content">{renderMyQuestions()}</div>}
            {activeTab === 'bank' && <div className="tab-content">{renderBankSoal()}</div>}
            {activeTab === 'wishlist' && <div className="tab-content">{renderWishlist()}</div>}
            {activeTab === 'riwayat' && <div className="tab-content">{renderRiwayat()}</div>}
            {activeTab === 'vocab' && <div className="tab-content">{renderVocab()}</div>}
            {activeTab === 'progress' && <div className="tab-content"><ProgressTracker userId={user?.uid} /></div>}
          </>
        )}
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className={`lg:hidden fixed bottom-6 left-6 right-6 z-50 transition-all duration-500 ease-in-out ${
        showMobileMenu 
          ? 'translate-y-32 opacity-0 pointer-events-none' 
          : 'translate-y-0 opacity-100'
      }`}>
        <div className="bg-white/90 backdrop-blur-xl rounded-full h-16 px-6 flex items-center justify-between shadow-lg border border-slate-100">
          {/* Left Side */}
          <div className="flex flex-1 justify-around items-center pr-4">
            <button 
              onClick={() => navigate('/dashboard/overview')}
              className={`flex flex-col items-center gap-0.5 transition-colors ${
                activeTab === 'overview' ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'
              }`}
            >
              <BarChart3 size={20} strokeWidth={1.5} />
              <span className="text-[9px] font-medium">Beranda</span>
            </button>
            
            <button 
              onClick={() => navigate('/dashboard/history')}
              className={`flex flex-col items-center gap-0.5 transition-colors ${
                activeTab === 'riwayat' ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'
              }`}
            >
              <History size={20} strokeWidth={1.5} />
              <span className="text-[9px] font-medium">Riwayat</span>
            </button>
          </div>
          
          {/* Center - Bank Soal (Subtle Floating) */}
          <div className="relative -top-4">
            <button 
              onClick={() => navigate('/dashboard/question-bank')}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-4 ring-white hover:scale-105 transition-transform"
            >
              <BookOpen size={22} strokeWidth={2} className="text-white" />
            </button>
          </div>
          
          {/* Right Side */}
          <div className="flex flex-1 justify-around items-center pl-4">
            <button 
              onClick={() => navigate('/dashboard/wishlist')}
              className={`flex flex-col items-center gap-0.5 transition-colors ${
                activeTab === 'wishlist' ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'
              }`}
            >
              <Bookmark size={20} strokeWidth={1.5} />
              <span className="text-[9px] font-medium">Saved</span>
            </button>
            
            <button 
              onClick={() => navigate('/dashboard/ptnpedia')}
              className={`flex flex-col items-center gap-0.5 transition-colors ${
                activeTab === 'ptnpedia' ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'
              }`}
            >
              <Globe size={20} strokeWidth={1.5} />
              <span className="text-[9px] font-medium">PTN</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
