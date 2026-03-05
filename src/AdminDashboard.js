import React, { useState, useEffect } from 'react';
import { Shield, Plus, Eye, TrendingUp, ArrowLeft, Trash2, CheckCircle, Edit, Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { checkAdminRole, getGlobalQuestions, createTryout, getDraftTryouts, getPublishedTryouts, publishTryout, deleteTryout, updateTryout, getTryoutById } from './firebase-admin';
import { ManageQuestionsPanel } from './ManageQuestionsPanel';

export const AdminDashboard = ({ user, onBack, showToast }) => {
  const [view, setView] = useState('overview');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(true);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [email, setEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const ADMIN_PASSWORD = 'superadmin2026';
  
  // Verify admin role when user is available
  useEffect(() => {
    const verifyAdmin = async () => {
      if (!user || showPasswordPrompt || showLoginForm) return;
      
      setIsVerifying(true);
      // Force refresh to get latest data
      const adminStatus = await checkAdminRole(user.uid, true);
      console.log('Final admin verification:', adminStatus);
      
      if (!adminStatus) {
        alert('⛔ Akses ditolak. Role admin tidak ditemukan di Firestore.');
        onBack();
        return;
      }
      
      setIsVerified(true);
      setIsVerifying(false);
    };
    
    verifyAdmin();
  }, [user, showPasswordPrompt, showLoginForm, onBack]);
  
  const handlePasswordSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setShowPasswordPrompt(false);
      setShowLoginForm(true);
      setPasswordError('');
    } else {
      setPasswordError('Password salah!');
      setPassword('');
    }
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const { auth } = await import('./firebase');
      
      await signInWithEmailAndPassword(auth, email, loginPassword);
      setShowLoginForm(false);
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found') {
        setLoginError('Email tidak ditemukan');
      } else if (error.code === 'auth/wrong-password') {
        setLoginError('Password salah');
      } else if (error.code === 'auth/invalid-email') {
        setLoginError('Format email tidak valid');
      } else {
        setLoginError('Login gagal: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Step 1: Password prompt
  if (showPasswordPrompt) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-rose-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Superuser Access</h2>
            <p className="text-sm text-slate-600">Masukkan password akses</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password Akses</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                placeholder="Masukkan password"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                autoFocus
              />
              {passwordError && (
                <p className="text-rose-600 text-sm mt-2">{passwordError}</p>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onBack}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="flex-1 px-4 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all font-medium"
              >
                Lanjut
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Step 2: Login form
  if (showLoginForm) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Login</h2>
            <p className="text-sm text-slate-600">Masukkan kredensial admin</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                autoFocus
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            
            {loginError && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
                <p className="text-rose-600 text-sm">{loginError}</p>
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  // Step 3: Waiting for user login
  if (!user && !showPasswordPrompt && !showLoginForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }
  
  // Step 4: Verifying admin role
  if (user && !showPasswordPrompt && !showLoginForm && isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Memverifikasi akses admin...</p>
        </div>
      </div>
    );
  }
  
  // Step 5: Admin verified, show dashboard
  if (!isVerified && user && !showPasswordPrompt && !showLoginForm) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-rose-600 to-rose-500 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={32} />
            <div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-sm opacity-90">Kelola Tryout Resmi</p>
            </div>
          </div>
          <button onClick={onBack} className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 flex items-center gap-2">
            <ArrowLeft size={18} />
            Kembali
          </button>
        </div>
      </header>
      
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex gap-4">
          <button 
            onClick={() => setView('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${view === 'overview' ? 'bg-rose-100 text-rose-700' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setView('builder')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${view === 'builder' ? 'bg-rose-100 text-rose-700' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Plus size={16} className="inline mr-2" />
            Buat Tryout
          </button>
          <button 
            onClick={() => setView('manage')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${view === 'manage' ? 'bg-rose-100 text-rose-700' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <TrendingUp size={16} className="inline mr-2" />
            Kelola Tryout
          </button>
          <button 
            onClick={() => setView('questions')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${view === 'questions' ? 'bg-rose-100 text-rose-700' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Eye size={16} className="inline mr-2" />
            Bank Soal
          </button>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto p-6">
        {view === 'overview' && <OverviewPanel />}
        {view === 'builder' && <TryoutBuilderPanel user={user} onSuccess={() => setView('manage')} />}
        {view === 'manage' && <ManageTryoutPanel user={user} />}
        {view === 'questions' && <ManageQuestionsPanel user={user} showToast={showToast} />}
      </main>
    </div>
  );
};

const OverviewPanel = () => {
  const [stats, setStats] = useState({ totalTryouts: 0, totalPublished: 0, totalDrafts: 0 });
  
  useEffect(() => {
    const loadStats = async () => {
      const published = await getPublishedTryouts();
      setStats({
        totalTryouts: published.length,
        totalPublished: published.length,
        totalDrafts: 0
      });
    };
    loadStats();
  }, []);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-medium text-slate-500 mb-2">Total Tryout</h3>
        <p className="text-3xl font-bold text-rose-600">{stats.totalTryouts}</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-medium text-slate-500 mb-2">Published</h3>
        <p className="text-3xl font-bold text-teal-600">{stats.totalPublished}</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-medium text-slate-500 mb-2">Draft</h3>
        <p className="text-3xl font-bold text-amber-600">{stats.totalDrafts}</p>
      </div>
    </div>
  );
};

const TryoutBuilderPanel = ({ user, onSuccess }) => {
  const [questionSets, setQuestionSets] = useState([]);
  const [selectedSets, setSelectedSets] = useState([]);
  const [tryoutTitle, setTryoutTitle] = useState('');
  const [tryoutDesc, setTryoutDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterSubtest, setFilterSubtest] = useState('');
  
  useEffect(() => {
    const loadSets = async () => {
      const { getPublicSets } = await import('./firebase');
      const allSets = await getPublicSets();
      setQuestionSets(allSets);
    };
    loadSets();
  }, []);
  
  const handleCreateTryout = async () => {
    if (!tryoutTitle || selectedSets.length === 0) {
      alert('❌ Judul dan set soal harus dipilih!');
      return;
    }
    
    setLoading(true);
    try {
      // Get all questions from selected sets
      const { getQuestionsBySetId } = await import('./firebase');
      const allQuestions = [];
      
      for (const set of selectedSets) {
        const questions = await getQuestionsBySetId(set.id);
        allQuestions.push(...questions);
      }
      
      if (allQuestions.length === 0) {
        alert('❌ Set yang dipilih tidak memiliki soal!');
        setLoading(false);
        return;
      }
      
      const tryoutId = await createTryout({
        title: tryoutTitle,
        description: tryoutDesc || 'Tryout resmi SNBT AI',
        questionsList: allQuestions.map((q, idx) => ({
          qid: q.id,
          subtest: q.subtest,
          order: idx
        })),
        totalDuration: allQuestions.length * 90,
        difficulty: 4,
        tags: ['official', 'snbt'],
        sourceSetIds: selectedSets.map(s => s.id)
      }, user.uid);
      
      // Get the created tryout to show slug
      const { getTryoutById } = await import('./firebase-admin');
      const createdTryout = await getTryoutById(tryoutId);
      
      alert(`✅ Tryout berhasil dibuat!\n\nURL: /tryout/${createdTryout.slug}`);
      setTryoutTitle('');
      setTryoutDesc('');
      setSelectedSets([]);
      onSuccess();
    } catch (error) {
      alert('❌ Gagal membuat tryout: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredSets = filterSubtest 
    ? questionSets.filter(set => set.subtestSummary && set.subtestSummary[filterSubtest])
    : questionSets;
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-4">Buat Tryout Baru</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Judul Tryout</label>
            <input 
              type="text"
              value={tryoutTitle}
              onChange={(e) => setTryoutTitle(e.target.value)}
              placeholder="Tryout Akbar Nasional #1"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi</label>
            <textarea 
              value={tryoutDesc}
              onChange={(e) => setTryoutDesc(e.target.value)}
              placeholder="Simulasi lengkap 7 subtes UTBK 2026"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              rows="2"
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Set terpilih: <span className="font-bold text-rose-600">{selectedSets.length}</span>
              {selectedSets.length > 0 && (
                <span className="ml-2 text-xs">(
                  {selectedSets.reduce((sum, set) => sum + (set.totalQuestions || 0), 0)} soal total
                )</span>
              )}
            </p>
            <button 
              onClick={handleCreateTryout}
              disabled={loading}
              className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Menyimpan...' : 'Simpan Tryout'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Bank Set Soal</h3>
          <select 
            value={filterSubtest}
            onChange={(e) => setFilterSubtest(e.target.value)}
            className="px-3 py-1 border border-slate-300 rounded-lg text-sm"
          >
            <option value="">Semua Subtes</option>
            <option value="tps_pu">TPS - Penalaran Umum</option>
            <option value="tps_pk">TPS - Pengetahuan Kuantitatif</option>
            <option value="tps_pbm">TPS - Pemahaman Bacaan</option>
            <option value="lit_ind">Literasi Indonesia</option>
            <option value="lit_ing">Literasi Inggris</option>
            <option value="pm">Penalaran Matematika</option>
          </select>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredSets.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>Belum ada set soal tersedia</p>
            </div>
          ) : (
            filteredSets.map(set => (
              <div key={set.id} className="flex items-start gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                <input 
                  type="checkbox"
                  checked={selectedSets.some(s => s.id === set.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSets([...selectedSets, set]);
                    } else {
                      setSelectedSets(selectedSets.filter(s => s.id !== set.id));
                    }
                  }}
                  className="w-5 h-5 accent-rose-600 mt-1"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-800">{set.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    {set.totalQuestions} soal • Level {set.complexity || 3}
                  </p>
                  {set.subtestSummary && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Object.entries(set.subtestSummary).map(([subtest, count]) => (
                        <span key={subtest} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs">
                          {subtest}: {count}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const ManageTryoutPanel = ({ user }) => {
  const [tryouts, setTryouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTryout, setEditingTryout] = useState(null);
  
  useEffect(() => {
    loadTryouts();
  }, []);
  
  const loadTryouts = async () => {
    setLoading(true);
    const [drafts, published] = await Promise.all([
      getDraftTryouts(user.uid),
      getPublishedTryouts()
    ]);
    setTryouts([...drafts, ...published]);
    setLoading(false);
  };
  
  const handlePublish = async (tryoutId) => {
    if (!window.confirm('Publish tryout ini?')) return;
    try {
      await publishTryout(tryoutId, user.uid);
      alert('✅ Tryout berhasil dipublish!');
      loadTryouts();
    } catch (error) {
      alert('❌ Gagal publish: ' + error.message);
    }
  };
  
  const handleDelete = async (tryoutId) => {
    if (!window.confirm('Hapus tryout ini? Tindakan tidak bisa dibatalkan!')) return;
    try {
      await deleteTryout(tryoutId, user.uid);
      alert('✅ Tryout berhasil dihapus!');
      loadTryouts();
    } catch (error) {
      alert('❌ Gagal hapus: ' + error.message);
    }
  };
  
  const handleEdit = async (tryoutId) => {
    const tryout = await getTryoutById(tryoutId);
    setEditingTryout(tryout);
  };
  
  const handleSaveEdit = async (updatedData) => {
    try {
      await updateTryout(editingTryout.id, updatedData, user.uid);
      alert('✅ Tryout berhasil diupdate!');
      setEditingTryout(null);
      loadTryouts();
    } catch (error) {
      alert('❌ Gagal update: ' + error.message);
    }
  };
  
  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }
  
  if (editingTryout) {
    return <EditTryoutModal tryout={editingTryout} onSave={handleSaveEdit} onCancel={() => setEditingTryout(null)} />;
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Kelola Tryout</h2>
      {tryouts.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center border border-slate-200">
          <p className="text-slate-500">Belum ada tryout. Buat tryout pertama Anda!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tryouts.map(tryout => (
            <div key={tryout.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{tryout.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      tryout.status === 'published' 
                        ? 'bg-teal-100 text-teal-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {tryout.status === 'published' ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{tryout.description}</p>
                  <p className="text-xs text-slate-500">
                    {tryout.questionsList?.length || 0} soal • {Math.floor((tryout.totalDuration || 0) / 60)} menit
                  </p>
                  {tryout.slug && (
                    <p className="text-xs text-indigo-600 mt-1 font-mono">
                      URL: /tryout/{tryout.slug}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(tryout.id)}
                    className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm flex items-center gap-1"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  {tryout.status === 'draft' && (
                    <button 
                      onClick={() => handlePublish(tryout.id)}
                      className="px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm flex items-center gap-1"
                    >
                      <CheckCircle size={16} />
                      Publish
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(tryout.id)}
                    className="px-3 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 text-sm flex items-center gap-1"
                  >
                    <Trash2 size={16} />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EditTryoutModal = ({ tryout, onSave, onCancel }) => {
  const [title, setTitle] = useState(tryout.title);
  const [description, setDescription] = useState(tryout.description);
  const [duration, setDuration] = useState(Math.floor(tryout.totalDuration / 60));
  const [selectedSets, setSelectedSets] = useState([]);
  const [questionSets, setQuestionSets] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const loadSets = async () => {
      const { getPublicSets } = await import('./firebase');
      const allSets = await getPublicSets();
      setQuestionSets(allSets);
      
      // Pre-select sets if sourceSetIds exists
      if (tryout.sourceSetIds) {
        const preSelected = allSets.filter(s => tryout.sourceSetIds.includes(s.id));
        setSelectedSets(preSelected);
      }
    };
    loadSets();
  }, [tryout]);
  
  const handleSave = async () => {
    if (!title) {
      alert('❌ Judul harus diisi!');
      return;
    }
    
    setLoading(true);
    
    const updateData = {
      title,
      description,
      totalDuration: duration * 60
    };
    
    // If sets changed, update questions list
    if (selectedSets.length > 0) {
      const { getQuestionsBySetId } = await import('./firebase');
      const allQuestions = [];
      
      for (const set of selectedSets) {
        const questions = await getQuestionsBySetId(set.id);
        allQuestions.push(...questions);
      }
      
      updateData.questionsList = allQuestions.map((q, idx) => ({
        qid: q.id,
        subtest: q.subtest,
        order: idx
      }));
      updateData.sourceSetIds = selectedSets.map(s => s.id);
    }
    
    await onSave(updateData);
    setLoading(false);
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6">
          <h2 className="text-2xl font-bold">Edit Tryout</h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Judul Tryout</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              rows="2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Clock size={16} className="inline mr-1" />
              Durasi (menit)
            </label>
            <input 
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
              min="1"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-slate-500 mt-1">Rekomendasi: {tryout.questionsList?.length || 0} soal × 1.5 menit = {Math.ceil((tryout.questionsList?.length || 0) * 1.5)} menit</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Set Soal (Opsional - untuk mengganti soal)</label>
            <div className="space-y-2 max-h-64 overflow-y-auto border border-slate-200 rounded-lg p-3">
              {questionSets.map(set => (
                <label key={set.id} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={selectedSets.some(s => s.id === set.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSets([...selectedSets, set]);
                      } else {
                        setSelectedSets(selectedSets.filter(s => s.id !== set.id));
                      }
                    }}
                    className="w-5 h-5 accent-indigo-600 mt-1"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold">{set.title}</p>
                    <p className="text-xs text-slate-600">{set.totalQuestions} soal • Level {set.complexity}</p>
                  </div>
                </label>
              ))}
            </div>
            {selectedSets.length > 0 && (
              <p className="text-xs text-amber-600 mt-2">⚠️ Mengganti set akan menimpa soal yang ada ({selectedSets.reduce((sum, s) => sum + (s.totalQuestions || 0), 0)} soal baru)</p>
            )}
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-white"
          >
            Batal
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
};

