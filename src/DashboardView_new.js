import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, BookOpen, History, ArrowLeft, TrendingUp, Award, Target, BarChart3, Trophy, Trash2, Search, Filter, CheckCircle, Camera, X, Bookmark, Globe, BookText, Edit2 } from 'lucide-react';
import { getMyQuestions, getPublicQuestions, getMyAttempts, deleteQuestionSet, getWishlist, removeFromWishlist } from './firebase';
import { getPublishedTryouts, getTryoutQuestions } from './firebase-admin';
import { ImageUploader } from './ImageUploader';
import { SUBTESTS, getSubtestLabel } from './subtestHelper';
import { PTNPediaView } from './ptnpedia';
import { getVocabList, deleteVocab, getVocabStats, updateVocab, saveVocab, subscribeToVocabList } from './vocab-firebase';
import { UnifiedNavbar } from './UnifiedNavbar';

export const DashboardView = ({ user, onBack, onViewDetail, onStartQuiz, onVisionGenerate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
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
  const [showAddVocab, setShowAddVocab] = useState(false);
  const [newVocab, setNewVocab] = useState({ word: '', meaning: '', example: '' });
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showVisionModal, setShowVisionModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [visionSubtest, setVisionSubtest] = useState('tps_pu');
  const [visionModel, setVisionModel] = useState('mcq');
  const [isGeneratingVision, setIsGeneratingVision] = useState(false);
  const [loadingTryout, setLoadingTryout] = useState(null);

  useEffect(() => {
    if (user) {
      loadData();
      const unsubscribeVocab = subscribeToVocabList(user.uid, (vocabList) => {
        setVocabList(vocabList);
        getVocabStats(user.uid).then(stats => setVocabStats(stats));
      });
      return () => unsubscribeVocab();
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
          
          {myQuestions.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">Paket Terbaru</h3>
                <button onClick={() => navigate('/dashboard/my-questions')} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Lihat Semua →</button>
              </div>
              <div className="space-y-3">
                {myQuestions.slice(0, 3).map((set) => {
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
        
        <div className="space-y-6">
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

  return (
    <div className="min-h-screen bg-[#F3F4F8] relative overflow-x-hidden">
      {/* Background Blur Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-400 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-400 rounded-full blur-[120px]"></div>
      </div>
      
      {/* Unified Navbar */}
      <UnifiedNavbar
        user={user}
        onLogin={() => navigate('/login')}
        onLogout={() => {}}
        navigate={navigate}
        setView={(view) => {
          if (view === 'COMMUNITY') navigate('/community');
        }}
        dailyUsage={0}
        totalQuestionsInBank={myQuestions.length}
        remainingQuota={0}
        isAdmin={false}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        variant="dashboard"
      />
      
      <div className="pt-24"></div>
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 relative z-10">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <button onClick={() => { onBack(); navigate('/app'); }} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md">
              <ArrowLeft size={18} className="sm:w-5 sm:h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Kelola soal dan pantau progresmu</p>
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
            {activeTab === 'overview' && renderOverview()}
          </>
        )}
      </div>
    </div>
  );
};
