import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, BookOpen, History, ArrowLeft, TrendingUp, Award, Target, BarChart3, Trophy, Trash2, Search, Filter, CheckCircle, Camera, X, Bookmark, Globe, BookText, Edit2, Swords, Zap, Users, Plus, LogIn } from 'lucide-react';
import { auth, loginWithGoogle, getMyQuestions, getPublicQuestions, getMyAttempts, deleteQuestionSet, getWishlist, removeFromWishlist } from '../../services/firebase/firebase';
import { getPublishedTryouts, getTryoutQuestions } from '../../services/firebase/firebase-admin';
import { ImageUploader } from '../../components/common/ImageUploader';
import { SUBTESTS, getSubtestLabel } from '../../constants/subtestHelper';
import { PTNPediaView } from '../ptnpedia/ptnpedia';
import { getVocabList, deleteVocab, getVocabStats, updateVocab, saveVocab, subscribeToVocabList } from '../../services/vocab/vocab-firebase';
import { UnifiedNavbar } from '../../components/layout/UnifiedNavbar';
import { useTokenBalance } from '../../hooks/useTokenBalance';
import ProgressTracker from '../../components/ProgressTracker';
import { ModalPortal } from '../../components/common/ModalPortal';

// Snbtai theme color scheme for all subtests
const SUBTEST_COLORS = {
  tps_pu: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200', badge: 'bg-cyan-100' },
  tps_ppu: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200', badge: 'bg-teal-100' },
  tps_pbm: { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200', badge: 'bg-sky-100' },
  tps_pk: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', badge: 'bg-indigo-100' },
  lit_ind: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', badge: 'bg-amber-100' },
  lit_ing: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', badge: 'bg-blue-100' },
  pm: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200', badge: 'bg-violet-100' },
  default: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200', badge: 'bg-cyan-100' }
};

const ITEMS_PER_PAGE = 9;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 0) return null;

  const getPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      }
    }
    const withDots = [];
    let prev = null;
    for (const p of pages) {
      if (prev && p - prev > 1) withDots.push('...');
      withDots.push(p);
      prev = p;
    }
    return withDots;
  };

  const navBtn = (disabled) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '40px',
    minWidth: '72px',
    padding: '0 14px',
    fontSize: '0.875rem',
    fontWeight: '600',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    background: '#ffffff',
    color: disabled ? '#cbd5e1' : '#7c3aed',
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    opacity: disabled ? 0.5 : 1,
    flexShrink: 0,
  });

  const pageBtn = (active) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    fontSize: '0.875rem',
    fontWeight: active ? '700' : '500',
    border: `1px solid ${active ? '#c4b5fd' : '#e2e8f0'}`,
    borderRadius: '8px',
    background: active ? '#ede9fe' : '#ffffff',
    color: active ? '#5b21b6' : '#475569',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    flexShrink: 0,
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        marginTop: '2rem',
        paddingBottom: '1.5rem',
        width: '100%',
      }}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={navBtn(currentPage === 1)}
      >
        ‹ Prev
      </button>

      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
        {getPages().map((p, i) =>
          p === '...' ? (
            <span
              key={`d${i}`}
              style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.875rem' }}
            >
              ···
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              style={pageBtn(p === currentPage)}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={navBtn(currentPage === totalPages)}
      >
        Next ›
      </button>
    </div>
  );
};

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
    if (path.includes('/ambis-battle')) return 'ambis-battle';

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
  const [newVocab, setNewVocab] = useState({ word: '', meaning: '', example: '', subtest: '' });

  // Pagination states
  const [myPage, setMyPage] = useState(1);
  const [bankPage, setBankPage] = useState(1);
  const [wishlistPage, setWishlistPage] = useState(1);
  const [vocabPage, setVocabPage] = useState(1);

  // Vision feature states
  const [showVisionModal, setShowVisionModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [visionSubtest, setVisionSubtest] = useState('tps_pu');
  const [visionModel, setVisionModel] = useState('mcq');
  const [isGeneratingVision, setIsGeneratingVision] = useState(false);
  const [loadingTryout, setLoadingTryout] = useState(null);
  
  // Practice params from recommendation
  const [practiceParams, setPracticeParams] = useState(null);

  useEffect(() => {
    // Listen for practice start event from recommendation page
    const handleStartPractice = (event) => {
      const params = event.detail;
      setPracticeParams(params);
      // Auto-open AI Lens or question generation with params
      setShowVisionModal(true);
    };

    window.addEventListener('startPractice', handleStartPractice);
    
    return () => {
      window.removeEventListener('startPractice', handleStartPractice);
    };
  }, []);

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

  // Reset pagination when filters change
  useEffect(() => {
    setMyPage(1);
    setBankPage(1);
    setWishlistPage(1);
    setVocabPage(1);
  }, [searchQuery, subtestFilter, timeFilter]);

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
      <div className="min-h-screen bg-gray-100/50">
        <div className="space-y-8">
          {/* Mobile Header - Only visible on mobile */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border-3 border-purple-100 p-0.5 shadow-md">
                    <img 
                      alt="User Profile" 
                      className="w-full h-full rounded-full object-cover" 
                      src={user?.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.displayName || 'User')}
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{greeting},</p>
                  <h1 className="text-xl font-bold text-gray-900">{user?.displayName || 'User'}</h1>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Stats Cards */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Grid - Enhanced with Modern Design */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col gap-4 transform hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shadow-sm">
                    <FileText size={22} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">Total Soal</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalQuestions}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col gap-4 transform hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shadow-sm">
                    <Target size={22} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">Percobaan</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalAttempts}</p>
                  </div>
                </div>
              </div>

              {/* Ambis Battle Quick Start Card - Compact UI */}
              <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl border border-white/10 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden relative group">
                {/* Decorative background icon */}
                <Swords size={120} className="absolute -right-6 -bottom-6 text-white/10 transform rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                      <Swords size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Ambis Battle</h3>
                      <p className="text-xs text-white/70">Duel soal 1v1 Real-time</p>
                    </div>
                    <span className="ml-auto bg-amber-400 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">New</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/5">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap size={14} className="text-amber-300" />
                        <span className="text-xs font-semibold">Tantangan</span>
                      </div>
                      <p className="text-[10px] text-white/60">Asah kecepatan & akurasi</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/5">
                      <div className="flex items-center gap-2 mb-1">
                        <Users size={14} className="text-blue-300" />
                        <span className="text-xs font-semibold">Duel Teman</span>
                      </div>
                      <p className="text-[10px] text-white/60">Maksimal 2 pemain / room</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => navigate('/dashboard/ambis-battle')}
                    className="w-full py-2.5 bg-white text-indigo-700 font-bold rounded-xl text-sm hover:bg-opacity-90 transition-colors shadow-lg"
                  >
                    Buka Lobby Battle
                  </button>
                </div>
              </div>

              {/* Paket Terbaru - Enhanced Design */}
              {myQuestions.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Paket Terbaru</h2>
                    <button
                      onClick={() => navigate('/dashboard/my-questions')}
                      className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      Lihat Semua →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {myQuestions.slice(0, 3).map((set) => {
                      const mainSubtest = Object.keys(set.subtestSummary || {})[0] || 'tps_pu';
                      const subtestLabel = getSubtestLabel(mainSubtest);
                      const shortId = set.id?.slice(-6).toUpperCase() || 'XXXXXX';
                      
                      return (
                        <div 
                          key={set.id} 
                          className="bg-white p-6 rounded-2xl flex items-center justify-between border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                          onClick={() => onViewDetail(set.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center shadow-sm">
                              <FileText size={28} className="text-purple-600" />
                            </div>
                            <div>
                              <h4 className="text-base font-bold text-gray-900">#{shortId}</h4>
                              <p className="text-sm text-gray-600">{set.totalQuestions || 0} Soal • Level {set.complexity || 3}</p>
                            </div>
                          </div>
                          <button className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center hover:bg-purple-100 transition-colors">
                            <span className="text-purple-600">→</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          
            {/* Right Column - Info Panel (Desktop Only) */}
            <div className="hidden lg:block space-y-8">
              {/* Quick Stats - Enhanced Design */}
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <BarChart3 size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Ringkasan</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium opacity-90">Paket Soal</span>
                    <span className="text-lg font-bold">{stats.subtestCount}</span>
                  </div>
                  <div className="h-px bg-white/20"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium opacity-90">Total Soal</span>
                    <span className="text-lg font-bold">{stats.totalQuestions}</span>
                  </div>
                  <div className="h-px bg-white/20"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium opacity-90">Dikerjakan</span>
                    <span className="text-lg font-bold">{stats.totalAttempts}x</span>
                  </div>
                </div>
              </div>
              
              {/* Additional Stats - Enhanced Design */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <h4 className="text-lg font-bold text-gray-900 mb-6">Statistik Lainnya</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Rata-rata Skor</span>
                    <span className="text-lg font-bold text-amber-600">{stats.avgScore}%</span>
                  </div>
                  <div className="h-px bg-gray-100"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Skor Terbaik</span>
                    <span className="text-lg font-bold text-rose-600">{stats.bestScore}%</span>
                  </div>
                </div>
              </div>
              
              {/* Progress Belajar - Enhanced Design */}
              {stats.totalQuestions > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <h4 className="text-lg font-bold text-gray-900 mb-6">Progress Belajar</h4>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-semibold text-gray-700">Soal Dikerjakan</span>
                        <span className="text-sm font-bold text-purple-600">{Math.min((stats.totalAttempts / 20) * 100, 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-500" style={{width: `${Math.min((stats.totalAttempts / 20) * 100, 100)}%`}}></div>
                      </div>
                      <p className="mt-2 text-xs text-gray-600 flex items-center gap-2">
                        <CheckCircle size={14} className="text-purple-600" /> {stats.totalAttempts}/20 Percobaan
                      </p>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-semibold text-gray-700">Target Skor</span>
                        <span className="text-sm font-bold text-orange-500">{stats.avgScore}%</span>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500" style={{width: `${stats.avgScore}%`}}></div>
                      </div>
                      <p className="mt-2 text-xs text-gray-600 flex items-center gap-2">
                        <CheckCircle size={14} className="text-orange-500" /> Rata-rata skor
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
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

    const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE);
    const paginatedItems = filteredQuestions.slice((myPage - 1) * ITEMS_PER_PAGE, myPage * ITEMS_PER_PAGE);

    const groupedBySubtest = {};
    paginatedItems.forEach(set => {
      const subtestList = Object.keys(set.subtestSummary || {});
      const mainSubtest = subtestList[0] || 'tps_pu';
      if (!groupedBySubtest[mainSubtest]) groupedBySubtest[mainSubtest] = [];
      groupedBySubtest[mainSubtest].push(set);
    });

    return (
      <div className="space-y-6 pb-40 md:pb-6">
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
          {(searchQuery || subtestFilter !== 'all' || timeFilter !== 'all') && (
            <p className="text-xs text-slate-500 mt-2">Ditemukan {filteredQuestions.length} dari {myQuestions.length} paket soal</p>
          )}
        </div>

        <div className="space-y-8">
          {SUBTESTS.map((subtest, subtestIdx) => {
            const sets = groupedBySubtest[subtest.id] || [];
            if (sets.length === 0) return null;

            const totalQs = sets.reduce((sum, set) => sum + (set.questionCount || set.totalQuestions || 0), 0);
            const colorIdx = subtestIdx % colors.length;

            return (
              <div key={subtest.id}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-1 h-8 bg-gradient-to-b ${colors[colorIdx]} rounded-full`}></div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{subtest.label}</h3>
                      <p className="text-xs text-slate-500">{sets.length} paket • {totalQs} soal</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sets.map((set) => {
                    const shortId = set.id?.slice(-6).toUpperCase() || 'XXXXXX';
                    return (
                      <div
                        key={set.id}
                        className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-gray-200 border-l-4 border-l-purple-600 transition-all duration-200 relative group cursor-pointer"
                        onClick={() => onViewDetail(set.id)}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-bold">L{set.complexity || 3}</div>
                          <button
                            onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(set.id); }}
                            className="p-1.5 bg-gray-100 hover:bg-rose-100 text-gray-400 hover:text-rose-600 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            title="Hapus"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="mb-3">
                          <p className="text-xs text-gray-400 mb-1">Kode Soal</p>
                          <p className="text-lg font-bold tracking-wider text-purple-700">#{shortId}</p>
                        </div>

                        <div className="border-t border-gray-100 pt-3 mb-3">
                          <p className="text-sm font-bold mb-2 text-gray-800">{set.title || 'Latihan SNBT'}</p>
                          <p className="text-xs text-gray-500">{set.questionCount || set.totalQuestions || 0} soal</p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-400">
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

        <Pagination currentPage={myPage} totalPages={totalPages} onPageChange={setMyPage} />
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

    const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE);
    const paginatedItems = filteredQuestions.slice((bankPage - 1) * ITEMS_PER_PAGE, bankPage * ITEMS_PER_PAGE);

    const groupedBySubtest = {};
    paginatedItems.forEach(set => {
      const subtestList = Object.keys(set.subtestSummary || {});
      const mainSubtest = subtestList[0] || 'tps_pu';
      if (!groupedBySubtest[mainSubtest]) groupedBySubtest[mainSubtest] = [];
      groupedBySubtest[mainSubtest].push(set);
    });

    return (
      <div className="space-y-6 pb-40 md:pb-6">
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
          {(searchQuery || subtestFilter !== 'all' || timeFilter !== 'all') && (
            <p className="text-xs text-slate-500 mt-2">Ditemukan {filteredQuestions.length} dari {publicQuestions.length} paket soal</p>
          )}
        </div>

        <div className="space-y-8">
          {SUBTESTS.map((subtest, subtestIdx) => {
            const sets = groupedBySubtest[subtest.id] || [];
            if (sets.length === 0) return null;

            // Bug fix: use questionCount (static field) first, fallback to totalQuestions
            const totalQs = sets.reduce((sum, set) => sum + (set.questionCount || set.totalQuestions || 0), 0);
            const colorIdx = subtestIdx % colors.length;

            return (
              <div key={subtest.id}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-1 h-8 bg-gradient-to-b ${colors[colorIdx]} rounded-full`}></div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{subtest.label}</h3>
                      <p className="text-xs text-slate-500">{sets.length} paket • {totalQs} soal</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sets.map((set) => {
                    const shortId = set.id?.slice(-6).toUpperCase() || 'XXXXXX';
                    return (
                      <div
                        key={set.id}
                        className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-gray-200 border-l-4 border-l-purple-600 transition-all duration-200 cursor-pointer"
                        onClick={() => onStartQuiz(set.id)}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-bold">L{set.complexity || 3}</div>
                          <BookOpen size={20} className="text-purple-400" />
                        </div>

                        <div className="mb-3">
                          <p className="text-xs text-gray-400 mb-1">Kode Soal</p>
                          <p className="text-lg font-bold tracking-wider text-purple-700">#{shortId}</p>
                        </div>

                        <div className="border-t border-gray-100 pt-3 mb-3">
                          <p className="text-sm font-bold mb-2 line-clamp-2 text-gray-800">{set.title}</p>
                          {/* Bug fix: questionCount is a static Firestore field, more reliable than computed totalQuestions */}
                          <p className="text-xs text-gray-500">{set.questionCount || set.totalQuestions || 0} soal</p>
                        </div>

                        <div className="flex items-center text-xs text-purple-600 font-medium">
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

        <Pagination currentPage={bankPage} totalPages={totalPages} onPageChange={setBankPage} />
      </div>
    );
  };

  const renderAmbisBattle = () => {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-full overflow-hidden flex flex-col">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200">
            <Swords size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Ambis Battle Lobby</h2>
            <p className="text-xs text-slate-500">Duel real-time 1v1 dengan teman</p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-bold text-slate-600 uppercase tracking-wider">
               <Zap size={10} className="text-amber-500" /> Real-time
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-bold text-slate-600 uppercase tracking-wider">
               <Users size={10} className="text-indigo-500" /> 2 Players
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 items-start overflow-y-auto pr-2 custom-scrollbar pb-10">
          {/* Create Room Card */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 border-b-4 border-b-violet-500 hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mb-4 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
              <Plus size={24} strokeWidth={3} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Buat Room Duel</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Jadilah host, pilih subtes dan tingkat kesulitan. Gunakan AI untuk membuat soal unik dalam sekejap atau tambahkan manual.
            </p>
            <button 
              onClick={() => navigate('/ambis-battle')} 
              className="w-full py-3 bg-violet-600 text-white font-bold rounded-xl text-sm hover:bg-violet-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-200"
            >
              <Plus size={18} /> Buat Room Baru
            </button>
          </div>

          {/* Join Room Card */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 border-b-4 border-b-indigo-500 hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-4 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <LogIn size={24} strokeWidth={3} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Masuk Room Teman</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Punya kode room dari teman? Masukkan kodenya dan bersiaplah untuk bertanding dalam duel kecerdasan real-time.
            </p>
            <button 
              onClick={() => navigate('/ambis-battle')} 
              className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
            >
              <LogIn size={18} /> Masuk ke Room
            </button>
          </div>

          {/* Featured/Info Section */}
          <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-6 border border-indigo-100 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-md flex-shrink-0 animate-pulse">
               <Trophy size={40} className="text-amber-400" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1 italic">"Kalahkan lawanmu dengan kecepatan dan ketepatan!"</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Skor dihitung berdasarkan seberapa cepat kamu menjawab soal dengan benar. Semakin cepat menjawab, semakin besar poin bonus yang didapat.
              </p>
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-violet-600">
                  <div className="w-1.5 h-1.5 bg-violet-600 rounded-full"></div> SINKRONISASI REAL-TIME
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div> AI GENERATED CONTENT
                </div>
              </div>
            </div>
          </div>
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
    
    const filteredWishlist = wishlist.filter(item => {
      const query = searchQuery.toLowerCase();
      const matchSearch = !searchQuery || item.setTitle?.toLowerCase().includes(query) || item.question?.text?.toLowerCase().includes(query);
      const matchSubtest = subtestFilter === 'all' || item.subtest === subtestFilter;
      return matchSearch && matchSubtest;
    });
    
    const totalPages = Math.ceil(filteredWishlist.length / ITEMS_PER_PAGE);
    const paginatedItems = filteredWishlist.slice((wishlistPage - 1) * ITEMS_PER_PAGE, wishlistPage * ITEMS_PER_PAGE);
    
    const groupedBySubtest = {};
    paginatedItems.forEach(item => {
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
      <>
        <div className="space-y-8 pb-40 md:pb-6">
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
                    const colorMap = { 
                      'from-pink-500 to-pink-600': { accent: 'text-pink-600', border: 'border-l-pink-600', bg: 'bg-pink-50' },
                      'from-purple-500 to-purple-600': { accent: 'text-purple-600', border: 'border-l-purple-600', bg: 'bg-purple-50' },
                      'from-rose-500 to-rose-600': { accent: 'text-rose-600', border: 'border-l-rose-600', bg: 'bg-rose-50' }
                    };
                    const colorClass = colors[colorIdx];
                    const colorStyle = colorMap[colorClass] || { accent: 'text-purple-600', border: 'border-l-purple-600', bg: 'bg-purple-50' };
                    
                    return (
                       <div 
                         key={item.id} 
                         className={`bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-gray-200 ${colorStyle.border} border-l-4 transition-all relative group cursor-pointer`}
                         onClick={() => handleViewWishlistQuestion(item)}
                       >
                         <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center gap-2">
                             <Bookmark size={16} className={colorStyle.accent} />
                             <span className={`text-xs font-bold ${colorStyle.accent}`}>Soal #{item.questionIndex + 1}</span>
                           </div>
                           <button 
                             onClick={(e) => { e.stopPropagation(); handleRemoveWishlist(item.id); }}
                             className="p-1.5 bg-gray-100 hover:bg-rose-100 text-gray-400 hover:text-rose-600 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                             title="Hapus"
                           >
                             <Trash2 size={14} />
                           </button>
                         </div>
                         
                         <div className="mb-3">
                           <p className="text-xs text-gray-400 mb-1">Dari Paket</p>
                           <p className="text-sm font-bold line-clamp-2 text-gray-800">{item.setTitle || 'Latihan SNBT'}</p>
                         </div>
                         
                         <div className="border-t border-gray-100 pt-3">
                           <p className="text-xs text-gray-600 line-clamp-2">{question.text || 'Soal tersimpan'}</p>
                         </div>
                         
                         <div className="flex items-center justify-between text-xs text-gray-400 mt-3">
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
          
          {wishlist.length === 0 && (
            <div className="col-span-full text-center py-16 text-slate-400">
              <Bookmark size={64} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">Belum ada soal di wishlist</p>
              <p className="text-sm mt-2">Simpan soal yang ingin dipelajari nanti</p>
            </div>
          )}
          {wishlist.length > 0 && filteredWishlist.length === 0 && (
            <div className="col-span-full text-center py-16 text-slate-400">
              <Search size={64} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">Tidak ditemukan</p>
            </div>
          )}
        </div>
        
        <Pagination currentPage={wishlistPage} totalPages={totalPages} onPageChange={setWishlistPage} />
      </>
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
    // Filter vocab by search query and subtest
    const filteredVocab = vocabList.filter(v => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || v.word.toLowerCase().includes(query) || v.meaning.toLowerCase().includes(query);
      const matchesSubtest = subtestFilter === 'all' || v.subtest === subtestFilter;
      return matchesSearch && matchesSubtest;
    });

    // Get available subtests from vocab list
    const availableSubtests = Array.from(new Set(vocabList.map(v => v.subtest)));
    
    // Pagination
    const vocabTotalPages = Math.ceil(filteredVocab.length / ITEMS_PER_PAGE);
    const paginatedVocab = filteredVocab.slice((vocabPage - 1) * ITEMS_PER_PAGE, vocabPage * ITEMS_PER_PAGE);

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
          example: editingVocab.example || '',
          subtest: editingVocab.subtest || 'lit_ing'
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
          source: 'manual',
          subtest: newVocab.subtest || 'lit_ing' // Default to lit_ing for backward compatibility
        });
        setShowAddVocab(false);
        setNewVocab({ word: '', meaning: '', example: '', subtest: '' });
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
      <>
        <div className="space-y-6 pb-40 md:pb-6">
          {/* Add Vocab Modal - Using Portal for proper z-index hierarchy */}
          <ModalPortal
            isOpen={showAddVocab}
            onClose={() => { setShowAddVocab(false); setNewVocab({ word: '', meaning: '', example: '', subtest: '' }); }}
            title="Tambah Vocab Baru"
            size="md"
          >
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Kata <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={newVocab.word}
                onChange={(e) => setNewVocab({...newVocab, word: e.target.value})}
                placeholder="Masukkan kata"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-900 text-base placeholder-slate-400 transition-all duration-200"
                autoComplete="off"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Arti <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={newVocab.meaning}
                onChange={(e) => setNewVocab({...newVocab, meaning: e.target.value})}
                placeholder="Arti dalam bahasa Indonesia"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-900 text-base placeholder-slate-400 transition-all duration-200"
                autoComplete="off"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Subtes <span className="text-rose-500">*</span>
              </label>
              <select
                value={newVocab.subtest}
                onChange={(e) => setNewVocab({...newVocab, subtest: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-900 text-base bg-white transition-all duration-200 cursor-pointer"
              >
                <option value="">Pilih Subtes</option>
                {SUBTESTS.map((subtest) => (
                  <option key={subtest.id} value={subtest.id}>
                    {subtest.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Contoh <span className="text-slate-400 font-normal">(opsional)</span>
              </label>
              <input
                type="text"
                value={newVocab.example}
                onChange={(e) => setNewVocab({...newVocab, example: e.target.value})}
                placeholder="Contoh kalimat"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-900 text-base placeholder-slate-400 transition-all duration-200"
                autoComplete="off"
              />
            </div>
          </div>
          
          {/* Action Button */}
          <button
            onClick={handleAddVocab}
            className="w-full px-6 py-3.5 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-xl font-semibold text-base hover:from-cyan-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-cyan-200 hover:shadow-xl hover:shadow-cyan-300 mt-6"
          >
            Tambah Vocab
          </button>
        </ModalPortal>

        {/* Edit Vocab Modal - Using Portal for proper z-index hierarchy */}
        {editingVocab && (
          <ModalPortal
            isOpen={!!editingVocab}
            onClose={() => setEditingVocab(null)}
            title="Edit Vocab"
            size="md"
          >
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Kata</label>
                <input
                  type="text"
                  value={editingVocab.word || ''}
                  onChange={(e) => setEditingVocab({...editingVocab, word: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-900 text-base transition-all duration-200"
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Arti</label>
                <input
                  type="text"
                  value={editingVocab.meaning || ''}
                  onChange={(e) => setEditingVocab({...editingVocab, meaning: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-900 text-base transition-all duration-200"
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Subtes</label>
                <select
                  value={editingVocab.subtest || ''}
                  onChange={(e) => setEditingVocab({...editingVocab, subtest: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-900 text-base bg-white transition-all duration-200 cursor-pointer"
                >
                  <option value="">Pilih Subtes</option>
                  {SUBTESTS.map((subtest) => (
                    <option key={subtest.id} value={subtest.id}>
                      {subtest.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Contoh <span className="text-slate-400 font-normal">(opsional)</span>
                </label>
                <input
                  type="text"
                  value={editingVocab.example || ''}
                  onChange={(e) => setEditingVocab({...editingVocab, example: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-900 text-base transition-all duration-200"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleEditVocab}
              className="w-full px-6 py-3.5 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-xl font-semibold text-base hover:from-cyan-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-cyan-200 hover:shadow-xl hover:shadow-cyan-300 mt-6"
            >
              Simpan Perubahan
            </button>
          </ModalPortal>
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

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Cari kata atau arti..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <button
              onClick={() => setShowAddVocab(true)}
              className="px-4 py-2.5 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors text-sm whitespace-nowrap"
            >
              + Tambah Vocab
            </button>
          </div>

          {/* Subtest Filter */}
          <div className="flex gap-2 flex-wrap">
            {/* All Subtes */}
            <button
              onClick={() => setSubtestFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                subtestFilter === 'all'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <BookText size={14} />
              <span>Semua Subtes</span>
            </button>

            {/* Dynamic Subtest Filters - Only show subtests with vocab */}
            {SUBTESTS.filter(s => availableSubtests.includes(s.id)).map((subtest) => {
              const isActive = subtestFilter === subtest.id;
              return (
                <button
                  key={subtest.id}
                  onClick={() => setSubtestFilter(subtest.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{subtest.label}</span>
                </button>
              );
            })}
          </div>

          {/* Filter Info */}
          {(searchQuery || subtestFilter !== 'all') && (
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <span className="text-xs text-slate-500">Filter aktif:</span>
              {subtestFilter !== 'all' && (
                <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-md text-xs font-medium">
                  {getSubtestLabel(subtestFilter)}
                </span>
              )}
              {searchQuery && (
                <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-md text-xs font-medium">
                  "{searchQuery}"
                </span>
              )}
              <button
                onClick={() => {
                  setSubtestFilter('all');
                  setSearchQuery('');
                }}
                className="text-xs text-slate-500 hover:text-cyan-600 underline"
              >
                Reset
              </button>
            </div>
          )}

          <p className="text-xs text-slate-500">Ditemukan {filteredVocab.length} dari {vocabList.length} kata</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedVocab.map((vocab) => {
            const subtestColor = SUBTEST_COLORS[vocab.subtest] || SUBTEST_COLORS.default;
            const subtestLabel = getSubtestLabel(vocab.subtest);
            
            return (
              <div key={vocab.id} className={`bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-gray-200 border-l-4 ${subtestColor.border} vocab-card group transition-all duration-200`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-slate-900">{vocab.word}</h3>
                      {vocab.mastered && (
                        <CheckCircle size={14} className="text-green-500" />
                      )}
                    </div>
                    <div className={`px-2 py-0.5 rounded text-[10px] font-semibold ${subtestColor.badge} ${subtestColor.text} inline-block mb-2`}>
                      {subtestLabel}
                    </div>
                    <p className="text-sm text-slate-600">{vocab.meaning}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingVocab(vocab)}
                      className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
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
                  <span className="font-semibold text-amber-600">+{vocab.xpEarned || 5} XP</span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredVocab.length === 0 && vocabList.length > 0 && (
          <div className="text-center py-16 text-slate-400">
            <Search size={64} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Tidak ditemukan</p>
          </div>
        )}
      </div>

      <Pagination currentPage={vocabPage} totalPages={vocabTotalPages} onPageChange={setVocabPage} />
    </>
    );
  };

  return (
    <div className="h-screen bg-slate-50 relative overflow-hidden flex flex-col">
      <style>{`
        /* ── iOS Safe Area for Bottom Navigation ── */
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 16px);
        }
        
        /* ── Scrollbar Styles ── */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

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
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .dash-fade-up    { animation: dashFadeUp 0.45s cubic-bezier(.22,.68,0,1.2) both; }
        .dash-fade-in    { animation: dashFadeIn 0.4s ease both; }
        .dash-slide-r    { animation: dashSlideRight 0.4s ease both; }
        .dash-row-slide  { animation: rowSlide 0.35s ease both; }
        .dash-orb        { animation: dashFloatOrb 8s ease-in-out infinite; }
        .dash-orb-2      { animation: dashFloatOrb 11s ease-in-out infinite reverse; }
        .progress-anim   { animation: progressGrow 0.9s cubic-bezier(.22,.68,0,1) both; }
        .animate-fade-in { animation: modalFadeIn 0.2s ease-out both; }
        .animate-modal-slide-up { animation: modalSlideUp 0.3s cubic-bezier(0.16,1,0.3,1) both; }

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
        onLogin={loginWithGoogle}
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
      
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-24 sm:pt-28 pb-4 relative z-10 flex-1 flex flex-col overflow-hidden">
        {/* Premium Glassmorphism Navigation Bar */}
        <div className="flex-shrink-0 mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="overflow-x-auto no-scrollbar">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-xl rounded-full p-1.5 shadow-lg border border-white/20 min-w-min">
              <button 
                onClick={() => navigate('/dashboard/overview')} 
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-300 whitespace-nowrap min-h-[40px] ${
                  activeTab === 'overview' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                <BarChart3 size={16} strokeWidth={2} />
                <span className="text-xs sm:text-sm font-semibold">Overview</span>
              </button>
              
              <button 
                onClick={() => navigate('/dashboard/ptnpedia')} 
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-300 whitespace-nowrap min-h-[40px] ${
                  activeTab === 'ptnpedia' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                <Globe size={16} strokeWidth={2} />
                <span className="text-xs sm:text-sm font-semibold">PTNPedia</span>
              </button>
              
              <button 
                onClick={() => navigate('/dashboard/ai-lens')} 
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-300 whitespace-nowrap min-h-[40px] ${
                  activeTab === 'ai-lens' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                <Camera size={16} strokeWidth={2} />
                <span className="text-xs sm:text-sm font-semibold">AI Lens</span>
              </button>
              
              <button 
                onClick={() => navigate('/dashboard/official-tryouts')} 
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-300 whitespace-nowrap min-h-[40px] ${
                  activeTab === 'official' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                <Trophy size={16} strokeWidth={2} />
                <span className="text-xs sm:text-sm font-semibold">Tryout</span>
              </button>
              
              <button 
                onClick={() => navigate('/dashboard/my-questions')} 
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-300 whitespace-nowrap min-h-[40px] ${
                  activeTab === 'my' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                <FileText size={16} strokeWidth={2} />
                <span className="text-xs sm:text-sm font-semibold">Soal Saya</span>
              </button>
              
              <button 
                onClick={() => navigate('/dashboard/question-bank')} 
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-300 whitespace-nowrap min-h-[40px] ${
                  activeTab === 'bank' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                <BookOpen size={16} strokeWidth={2} />
                <span className="text-xs sm:text-sm font-semibold">Bank Soal</span>
              </button>
              
              <button 
                onClick={() => navigate('/dashboard/wishlist')} 
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-300 whitespace-nowrap min-h-[40px] ${
                  activeTab === 'wishlist' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                <Bookmark size={16} strokeWidth={2} />
                <span className="text-xs sm:text-sm font-semibold">Wishlist</span>
              </button>
              
              <button 
                onClick={() => navigate('/dashboard/vocab')} 
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-300 whitespace-nowrap min-h-[40px] ${
                  activeTab === 'vocab' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                <BookText size={16} strokeWidth={2} />
                <span className="text-xs sm:text-sm font-semibold">Vocab</span>
              </button>
              
              <button 
                onClick={() => navigate('/dashboard/progress')} 
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-300 whitespace-nowrap min-h-[40px] ${
                  activeTab === 'progress' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                <Target size={16} strokeWidth={2} />
                <span className="text-xs sm:text-sm font-semibold">Progress</span>
              </button>

              <button 
                onClick={() => navigate('/dashboard/ambis-battle')} 
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-300 whitespace-nowrap min-h-[40px] ${
                  activeTab === 'ambis-battle' 
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30' 
                    : 'text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                <Swords size={16} strokeWidth={2} />
                <span className="text-xs sm:text-sm font-semibold">Battle</span>
                <span className="text-[10px] font-black bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded-full ml-1">NEW</span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600"></div>
              <p className="text-slate-500 mt-4">Memuat data...</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {activeTab === 'overview' && <div className="tab-content">{renderOverview()}</div>}
            {activeTab === 'ptnpedia' && <div className="tab-content h-full"><PTNPediaView user={user} onBack={() => navigate('/dashboard/overview')} /></div>}
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
            {activeTab === 'ambis-battle' && (
              <div className="tab-content h-full">
                {renderAmbisBattle()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation - Mobile Only with Safe Area */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white transition-all duration-500 ease-in-out pb-safe ${
        showMobileMenu 
          ? 'translate-y-32 opacity-0 pointer-events-none' 
          : 'translate-y-0 opacity-100'
      }`}>
        <div className="px-4 pb-4 pt-2 bg-white">
          <div className="bg-white/90 backdrop-blur-xl rounded-full h-14 px-5 flex items-center justify-between shadow-xl border border-slate-100">
            {/* Left Side */}
            <div className="flex flex-1 justify-around items-center pr-3">
              <button 
                onClick={() => navigate('/dashboard/overview')}
                className={`flex flex-col items-center gap-0.5 transition-colors min-w-[48px] ${
                  activeTab === 'overview' ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'
                }`}
              >
                <BarChart3 size={18} strokeWidth={1.5} />
                <span className="text-[9px] font-medium">Beranda</span>
              </button>
            
              <button 
                onClick={() => navigate('/dashboard/history')}
                className={`flex flex-col items-center gap-0.5 transition-colors min-w-[48px] ${
                  activeTab === 'riwayat' ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'
                }`}
              >
                <History size={18} strokeWidth={1.5} />
                <span className="text-[9px] font-medium">Riwayat</span>
              </button>
            </div>
          
            {/* Center - Bank Soal (Subtle Floating) */}
            <div className="relative -top-3">
              <button 
                onClick={() => navigate('/dashboard/question-bank')}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-4 ring-white hover:scale-105 transition-transform"
              >
                <BookOpen size={20} strokeWidth={2} className="text-white" />
              </button>
            </div>
          
            {/* Right Side */}
            <div className="flex flex-1 justify-around items-center pl-3">
              <button 
                onClick={() => navigate('/dashboard/ambis-battle')}
                className={`flex flex-col items-center gap-0.5 transition-colors min-w-[48px] ${
                  activeTab === 'ambis-battle' ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'
                }`}
              >
                <div className="relative">
                  <Swords size={18} strokeWidth={1.5} />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full border border-white"></span>
                </div>
                <span className="text-[9px] font-medium">Battle</span>
              </button>
            
              <button 
                onClick={() => navigate('/dashboard/ptnpedia')}
                className={`flex flex-col items-center gap-0.5 transition-colors min-w-[48px] ${
                  activeTab === 'ptnpedia' ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'
                }`}
              >
                <Globe size={18} strokeWidth={1.5} />
                <span className="text-[9px] font-medium">PTN</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
