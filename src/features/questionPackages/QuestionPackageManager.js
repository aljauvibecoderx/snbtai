import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getMySetsByTimeRange, getPublicSetsByTimeRange, saveQuestionSetWithId } from '../../services/firebase/firebase';
import { generateEnhancedBattleQuestions } from '../ambisBattle/enhancedQuestionGenerator';
import { SUBTESTS } from '../../constants/subtestHelper';
import { Clock, Calendar, Users, BookOpen, Filter, Plus, Trash2, Edit } from 'lucide-react';

const QuestionPackageManager = () => {
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState({
    timeRange: 'all',
    type: 'my', // 'my' or 'public'
    subtest: 'all'
  });

  const [newPackage, setNewPackage] = useState({
    title: '',
    description: '',
    subtest: 'tps_pu',
    level: 3,
    questionCount: 5,
    topic: '',
    context: ''
  });

  const timeRangeOptions = [
    { value: 'all', label: 'Semua Waktu' },
    { value: 'today', label: 'Hari Ini' },
    { value: 'yesterday', label: 'Kemarin' },
    { value: 'last_3_days', label: '3 Hari Terakhir' },
    { value: 'last_week', label: 'Minggu Terakhir' },
    { value: 'last_2_weeks', label: '2 Minggu Terakhir' },
    { value: 'last_month', label: 'Bulan Terakhir' },
    { value: 'last_3_months', label: '3 Bulan Terakhir' },
    { value: 'last_6_months', label: '6 Bulan Terakhir' },
    { value: 'last_year', label: 'Tahun Terakhir' }
  ];

  useEffect(() => {
    loadPackages();
  }, [filter, user]);

  const loadPackages = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let result;
      if (filter.type === 'my') {
        if (filter.timeRange === 'all') {
          const { getMySets } = await import('../../services/firebase/firebase');
          result = await getMySets(user.uid);
        } else {
          result = await getMySetsByTimeRange(user.uid, filter.timeRange);
        }
      } else {
        if (filter.timeRange === 'all') {
          const { getPublicSets } = await import('../../services/firebase/firebase');
          result = await getPublicSets(filter.subtest === 'all' ? null : filter.subtest);
        } else {
          result = await getPublicSetsByTimeRange(filter.timeRange, filter.subtest === 'all' ? null : filter.subtest);
        }
      }

      // Apply subtest filter if needed
      if (filter.subtest !== 'all' && filter.type === 'my') {
        result = result.filter(pkg => 
          pkg.category === filter.subtest || 
          pkg.subtest === filter.subtest ||
          (pkg.subtestSummary && pkg.subtestSummary[filter.subtest])
        );
      }

      setPackages(result);
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePackage = async () => {
    if (!user || !newPackage.title.trim()) return;

    setLoading(true);
    try {
      // Generate questions using the enhanced battle system
      const questions = await generateEnhancedBattleQuestions(
        newPackage.subtest,
        newPackage.topic,
        newPackage.level,
        newPackage.questionCount,
        newPackage.context
      );

      // Save the question set
      const packageData = {
        title: newPackage.title,
        description: newPackage.description,
        category: newPackage.subtest,
        difficulty: newPackage.level,
        questionCount: questions.length,
        questions: questions,
        source: 'User Generated',
        metadata: {
          topic: newPackage.topic,
          context: newPackage.context,
          level: newPackage.level
        }
      };

      const packageId = await saveQuestionSetWithId(packageData, user.uid);
      
      // Reset form and refresh packages
      setNewPackage({
        title: '',
        description: '',
        subtest: 'tps_pu',
        level: 3,
        questionCount: 5,
        topic: '',
        context: ''
      });
      setShowCreateForm(false);
      loadPackages();

      alert('Paket soal berhasil dibuat!');
    } catch (error) {
      console.error('Error creating package:', error);
      alert('Gagal membuat paket soal: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Tanggal tidak tersedia';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSubtestLabel = (subtestId) => {
    const subtest = SUBTESTS.find(s => s.id === subtestId);
    return subtest ? subtest.label : subtestId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <BookOpen className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Manajer Paket Soal</h1>
                <p className="text-sm text-slate-600">Buat dan kelola paket soal SNBT Anda</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium rounded-xl hover:shadow-md transition-all flex items-center gap-2"
            >
              <Plus size={16} />
              Buat Paket Baru
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Filter:</span>
            </div>
            
            <select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-violet-400"
            >
              <option value="my">Paket Saya</option>
              <option value="public">Paket Publik</option>
            </select>

            <select
              value={filter.timeRange}
              onChange={(e) => setFilter({ ...filter, timeRange: e.target.value })}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-violet-400"
            >
              {timeRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={filter.subtest}
              onChange={(e) => setFilter({ ...filter, subtest: e.target.value })}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-violet-400"
            >
              <option value="all">Semua Subtes</option>
              {SUBTESTS.map(subtest => (
                <option key={subtest.id} value={subtest.id}>
                  {subtest.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Create Package Form */}
        {showCreateForm && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">Buat Paket Soal Baru</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Judul Paket</label>
                    <input
                      type="text"
                      value={newPackage.title}
                      onChange={(e) => setNewPackage({ ...newPackage, title: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-violet-400"
                      placeholder="Masukkan judul paket soal"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subtes</label>
                    <select
                      value={newPackage.subtest}
                      onChange={(e) => setNewPackage({ ...newPackage, subtest: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-violet-400"
                    >
                      {SUBTESTS.map(subtest => (
                        <option key={subtest.id} value={subtest.id}>
                          {subtest.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                  <textarea
                    value={newPackage.description}
                    onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-violet-400"
                    placeholder="Deskripsi paket soal (opsional)"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Level Kesulitan</label>
                    <select
                      value={newPackage.level}
                      onChange={(e) => setNewPackage({ ...newPackage, level: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-violet-400"
                    >
                      <option value={1}>Level 1 - Sangat Mudah</option>
                      <option value={2}>Level 2 - Mudah</option>
                      <option value={3}>Level 3 - Sedang</option>
                      <option value={4}>Level 4 - Sulit</option>
                      <option value={5}>Level 5 - Sangat Sulit</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah Soal</label>
                    <select
                      value={newPackage.questionCount}
                      onChange={(e) => setNewPackage({ ...newPackage, questionCount: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-violet-400"
                    >
                      <option value={3}>3 Soal</option>
                      <option value={5}>5 Soal</option>
                      <option value={10}>10 Soal</option>
                      <option value={15}>15 Soal</option>
                      <option value={20}>20 Soal</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Topik</label>
                    <input
                      type="text"
                      value={newPackage.topic}
                      onChange={(e) => setNewPackage({ ...newPackage, topic: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-violet-400"
                      placeholder="Topik spesifik"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Konteks Tambahan</label>
                  <textarea
                    value={newPackage.context}
                    onChange={(e) => setNewPackage({ ...newPackage, context: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-violet-400"
                    placeholder="Konteks atau referensi tambahan untuk pembuatan soal (opsional)"
                    rows={3}
                  />
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleCreatePackage}
                  disabled={loading || !newPackage.title.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:shadow-md transition-all disabled:opacity-50"
                >
                  {loading ? 'Membuat...' : 'Buat Paket'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Packages List */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            {packages.length} Paket Soal {filter.type === 'my' ? 'Saya' : 'Publik'}
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="mx-auto text-slate-400 mb-3" size={48} />
              <p className="text-slate-600">Tidak ada paket soal ditemukan</p>
              <p className="text-sm text-slate-500 mt-1">
                {filter.type === 'my' ? 'Buat paket soal pertama Anda' : 'Coba filter lainnya'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {packages.map((pkg) => (
                <div key={pkg.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900">{pkg.title}</h3>
                        <span className="px-2 py-1 bg-violet-100 text-violet-700 text-xs rounded-full">
                          {getSubtestLabel(pkg.category || pkg.subtest)}
                        </span>
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                          Level {pkg.difficulty || pkg.complexity || 3}
                        </span>
                      </div>
                      
                      {pkg.description && (
                        <p className="text-sm text-slate-600 mb-2">{pkg.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <BookOpen size={12} />
                          <span>{pkg.totalQuestions || pkg.questions?.length || 0} soal</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{formatDate(pkg.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={12} />
                          <span>{pkg.visibility === 'public' ? 'Publik' : 'Pribadi'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionPackageManager;
