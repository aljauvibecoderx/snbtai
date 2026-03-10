import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, TrendingUp, Users, Target, ChevronDown, Loader, AlertCircle, BookOpen, ArrowLeft, Sparkles, Zap, Globe, BarChart3 } from 'lucide-react';

const MOCK_UNIVERSITIES = [
  { code: '0001', name: 'Universitas Indonesia' },
  { code: '0002', name: 'Institut Teknologi Bandung' },
  { code: '0003', name: 'Universitas Gadjah Mada' },
  { code: '0004', name: 'Universitas Airlangga' },
  { code: '0005', name: 'Universitas Diponegoro' }
];

const MOCK_PROGRAMS = {
  '0001': [
    { code: '55201', name: 'Teknik Informatika', jenjang: 'S1', capacity: '120', applicants: '2500', ratio: '20.8', admissionChance: '4.80%' },
    { code: '55202', name: 'Teknik Elektro', jenjang: 'S1', capacity: '100', applicants: '1800', ratio: '18.0', admissionChance: '5.56%' }
  ]
};

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

const PTNPediaAPI = {
  async getUniversities(dataType = 'snbp') {
    try {
      const response = await fetch(`${BACKEND_URL}/api/universities?type=${dataType}`);
      if (!response.ok) throw new Error('API not available');
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.log('Using mock data for universities:', error.message);
      return MOCK_UNIVERSITIES;
    }
  },

  async getPrograms(universityCode, dataType = 'snbp') {
    try {
      const response = await fetch(`${BACKEND_URL}/api/programs?code=${universityCode}&type=${dataType}`);
      if (!response.ok) throw new Error('API not available');
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.log('Using mock data for programs:', error.message);
      return MOCK_PROGRAMS[universityCode] || [];
    }
  }
};

export const PTNPediaView = ({ user, onBack }) => {
  const [dataType, setDataType] = useState('snbp');
  const [universities, setUniversities] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [expandedUniversity, setExpandedUniversity] = useState(null);
  const [error, setError] = useState(null);
  const [programSearchQuery, setProgramSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('browse');
  const [compareProdiName, setCompareProdiName] = useState('');
  const [compareResults, setCompareResults] = useState([]);
  const [compareSortBy, setCompareSortBy] = useState('ratio-asc');

  useEffect(() => {
    loadUniversities();
  }, [dataType]);

  const loadUniversities = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await PTNPediaAPI.getUniversities(dataType);
      setUniversities(data);
      setPrograms([]);
    } catch (err) {
      setError('Gagal memuat data universitas. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const loadPrograms = useCallback(async (universityCode) => {
    setLoading(true);
    try {
      const data = await PTNPediaAPI.getPrograms(universityCode, dataType);
      setPrograms(data);
    } catch (err) {
      setError('Gagal memuat program studi. Coba lagi.');
    } finally {
      setLoading(false);
    }
  }, [dataType]);

  const handleCompareProdi = async () => {
    if (!compareProdiName.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const results = [];
      for (const uni of universities) {
        const progs = await PTNPediaAPI.getPrograms(uni.code, dataType);
        const matchedProgs = progs.filter(p => 
          p.name.toLowerCase().includes(compareProdiName.toLowerCase())
        );
        if (matchedProgs.length > 0) {
          matchedProgs.forEach(prog => {
            results.push({
              ...prog,
              universityName: uni.name,
              universityCode: uni.code
            });
          });
        }
      }
      setCompareResults(results);
      if (results.length === 0) {
        setError('Tidak ada program studi yang cocok di semua universitas');
      }
    } catch (err) {
      setError('Gagal membandingkan program studi. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUniversities = universities
    .filter(uni => uni.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const sortedPrograms = [...programs]
    .filter(prog => prog.name.toLowerCase().includes(programSearchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'ratio') return parseFloat(b.ratio) - parseFloat(a.ratio);
      if (sortBy === 'capacity') return parseInt(b.capacity) - parseInt(a.capacity);
      if (sortBy === 'applicants') return parseInt(b.applicants) - parseInt(a.applicants);
      return a.name.localeCompare(b.name);
    });

  const sortedCompareResults = [...compareResults].sort((a, b) => {
    if (compareSortBy === 'ratio-asc') return parseFloat(a.ratio) - parseFloat(b.ratio);
    if (compareSortBy === 'ratio-desc') return parseFloat(b.ratio) - parseFloat(a.ratio);
    if (compareSortBy === 'capacity-desc') return parseInt(b.capacity) - parseInt(a.capacity);
    if (compareSortBy === 'capacity-asc') return parseInt(a.capacity) - parseInt(b.capacity);
    if (compareSortBy === 'applicants-desc') return parseInt(b.applicants) - parseInt(a.applicants);
    if (compareSortBy === 'applicants-asc') return parseInt(a.applicants) - parseInt(b.applicants);
    if (compareSortBy === 'chance-desc') return parseFloat(b.admissionChance) - parseFloat(a.admissionChance);
    if (compareSortBy === 'chance-asc') return parseFloat(a.admissionChance) - parseFloat(b.admissionChance);
    return a.universityName.localeCompare(b.universityName);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 relative overflow-x-hidden">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-blue-400/15 to-cyan-400/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-gradient-to-r from-violet-300/10 to-pink-300/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 relative z-10">
        {/* Premium Header Section */}
        <div className="mb-8 dash-fade-up d-delay-0">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={onBack} 
              className="group p-3 bg-white/80 backdrop-blur-sm hover:bg-white rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg border border-white/50"
            >
              <ArrowLeft size={20} className="text-slate-600 group-hover:text-slate-800 transition-colors" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
                PTNPedia
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">
                Eksplorasi PTN, program studi & peluang masuk terlengkap
              </p>
            </div>
          </div>
        </div>

        {/* Premium Quick Actions Grid */}
        <div className="mb-8 dash-fade-up d-delay-80">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
            {/* SNBP Card */}
            <button
              onClick={() => setDataType('snbp')}
              className={`group relative p-2 sm:p-3 rounded-xl transition-all duration-300 overflow-hidden ${
                dataType === 'snbp'
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 scale-[1.01]'
                  : 'bg-white/70 backdrop-blur-sm text-slate-700 hover:bg-white hover:shadow-md border border-white/50'
              }`}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-lg ${
                    dataType === 'snbp' ? 'bg-white/20' : 'bg-indigo-100'
                  }`}>
                    <Sparkles size={16} className={dataType === 'snbp' ? 'text-white' : 'text-indigo-600'} />
                  </div>
                  <div className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                    dataType === 'snbp' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    Afirmasi
                  </div>
                </div>
                <h3 className="font-bold text-sm mb-0.5">SNBP</h3>
                <p className={`text-[10px] opacity-80 leading-tight ${
                  dataType === 'snbp' ? 'text-white' : 'text-slate-600'
                }`}>
                  Jalur prestasi akademik
                </p>
              </div>
              {dataType === 'snbp' && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 animate-pulse" />
              )}
            </button>

            {/* SNBT Card */}
            <button
              onClick={() => setDataType('snbt')}
              className={`group relative p-2 sm:p-3 rounded-xl transition-all duration-300 overflow-hidden ${
                dataType === 'snbt'
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 scale-[1.01]'
                  : 'bg-white/70 backdrop-blur-sm text-slate-700 hover:bg-white hover:shadow-md border border-white/50'
              }`}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-lg ${
                    dataType === 'snbt' ? 'bg-white/20' : 'bg-emerald-100'
                  }`}>
                    <Zap size={16} className={dataType === 'snbt' ? 'text-white' : 'text-emerald-600'} />
                  </div>
                  <div className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                    dataType === 'snbt' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    Tes Tulis
                  </div>
                </div>
                <h3 className="font-bold text-sm mb-0.5">SNBT</h3>
                <p className={`text-[10px] opacity-80 leading-tight ${
                  dataType === 'snbt' ? 'text-white' : 'text-slate-600'
                }`}>
                  Ujian tertulis berbasis komputer
                </p>
              </div>
              {dataType === 'snbt' && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 animate-pulse" />
              )}
            </button>
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={() => setViewMode('browse')}
              className={`group p-4 rounded-xl transition-all duration-300 border ${
                viewMode === 'browse'
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-white/50 backdrop-blur-sm border-white/50 text-slate-600 hover:bg-white hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  viewMode === 'browse' ? 'bg-indigo-100' : 'bg-slate-100 group-hover:bg-indigo-100'
                }`}>
                  <Globe size={16} className={viewMode === 'browse' ? 'text-indigo-600' : 'text-slate-600 group-hover:text-indigo-600'} />
                </div>
                <span className="font-medium text-sm">Jelajah PTN</span>
              </div>
            </button>

            <button
              onClick={() => setViewMode('compare')}
              className={`group p-4 rounded-xl transition-all duration-300 border ${
                viewMode === 'compare'
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-white/50 backdrop-blur-sm border-white/50 text-slate-600 hover:bg-white hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  viewMode === 'compare' ? 'bg-indigo-100' : 'bg-slate-100 group-hover:bg-indigo-100'
                }`}>
                  <BarChart3 size={16} className={viewMode === 'compare' ? 'text-indigo-600' : 'text-slate-600 group-hover:text-indigo-600'} />
                </div>
                <span className="font-medium text-sm">Bandingkan</span>
              </div>
            </button>
          </div>
        </div>

        {/* Premium Error Display */}
        {error && (
          <div className="mb-6 dash-fade-up d-delay-160">
            <div className="bg-gradient-to-r from-rose-50 to-red-50 border border-rose-200/50 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-100 rounded-xl">
                  <AlertCircle className="text-rose-600" size={20} />
                </div>
                <div>
                  <p className="font-medium text-rose-800 text-sm">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'compare' ? (
          <div className="space-y-6 dash-fade-up d-delay-200">
            {/* Premium Search Section */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                  <BarChart3 size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Bandingkan Program Studi</h3>
                  <p className="text-sm text-slate-600">Temukan program terbaik di berbagai PTN</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input
                      type="text"
                      placeholder="Ketik nama program studi (contoh: Teknik Informatika)"
                      value={compareProdiName}
                      onChange={(e) => setCompareProdiName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCompareProdi()}
                      className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-300 transition-all text-sm placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <button
                  onClick={handleCompareProdi}
                  disabled={loading || !compareProdiName.trim()}
                  className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader className="animate-spin" size={16} />
                      <span>Mencari...</span>
                    </div>
                  ) : (
                    'Bandingkan'
                  )}
                </button>
              </div>
            </div>

            {compareResults.length > 0 && (
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 overflow-hidden">
                <div className="p-6 border-b border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-white/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">Hasil Perbandingan</h3>
                      <p className="text-sm text-slate-600 mt-1">
                        <span className="inline-flex items-center gap-1">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                          {sortedCompareResults.length} program ditemukan
                        </span>
                      </p>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                      <div className="relative">
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <select
                          value={compareSortBy}
                          onChange={(e) => setCompareSortBy(e.target.value)}
                          className="w-full sm:w-auto pr-10 pl-4 py-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm appearance-none cursor-pointer transition-all"
                        >
                          <option value="ratio-asc">Rasio Terendah</option>
                          <option value="ratio-desc">Rasio Tertinggi</option>
                          <option value="chance-desc">Peluang Tertinggi</option>
                          <option value="chance-asc">Peluang Terendah</option>
                          <option value="capacity-desc">Daya Tampung Terbanyak</option>
                          <option value="capacity-asc">Daya Tampung Tersedikit</option>
                          <option value="applicants-desc">Peminat Terbanyak</option>
                          <option value="applicants-asc">Peminat Tersedikit</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="max-h-[600px] overflow-y-auto">
                  <div className="divide-y divide-slate-200/50">
                    {sortedCompareResults.map((prog, idx) => (
                      <div key={idx} className="p-4 sm:p-6 hover:bg-white/50 transition-all duration-300 group">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4">
                          <div className="flex-1 mb-3 sm:mb-0">
                            <h4 className="font-semibold text-slate-900 text-base leading-tight group-hover:text-indigo-700 transition-colors">{prog.name}</h4>
                            <p className="text-sm text-indigo-600 font-medium mt-1 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                              {prog.universityName}
                            </p>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                              <span className="px-2 py-1 bg-slate-100 rounded-full text-xs font-medium">{prog.jenjang}</span>
                              <span>Kode: {prog.code}</span>
                            </p>
                          </div>
                          <div className="text-center sm:text-right sm:ml-6">
                            <div className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                              <div className="text-2xl font-bold text-indigo-600">{prog.ratio}</div>
                              <div className="text-xs text-slate-600 font-medium">Rasio</div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 rounded-xl p-3 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <Target size={14} className="text-teal-600" />
                              <span className="font-bold text-slate-900 text-sm">{prog.capacity}</span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium">Daya Tampung</p>
                          </div>
                          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-3 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <Users size={14} className="text-amber-600" />
                              <span className="font-bold text-slate-900 text-sm">{prog.applicants}</span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium">Peminat</p>
                          </div>
                          <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 rounded-xl p-3 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <TrendingUp size={14} className="text-rose-600" />
                              <span className="font-bold text-slate-900 text-sm">{prog.admissionChance}</span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium">Peluang</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!loading && compareResults.length === 0 && compareProdiName && (
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg border border-white/50">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="text-slate-400" size={32} />
                </div>
                <p className="text-slate-600 font-medium text-lg mb-2">Tidak ada hasil ditemukan</p>
                <p className="text-sm text-slate-500">Coba kata kunci lain atau periksa ejaan</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 dash-fade-up d-delay-200">
            {/* Premium University List */}
            <div className="xl:col-span-1">
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-white/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                      <Globe size={20} className="text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">Pilih Universitas</h3>
                      <p className="text-sm text-slate-600">Jelajahi PTN favorit Anda</p>
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input
                        type="text"
                        placeholder="Cari universitas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-300 transition-all text-sm placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="max-h-[400px] xl:max-h-[500px] overflow-y-auto">
                  {loading && !universities.length ? (
                    <div className="p-8 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <Loader className="animate-spin text-indigo-600" size={24} />
                      </div>
                      <p className="text-sm text-slate-600 font-medium">Memuat data...</p>
                    </div>
                  ) : filteredUniversities.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <BookOpen className="text-slate-400" size={24} />
                      </div>
                      <p className="text-sm text-slate-600 font-medium">Tidak ada universitas ditemukan</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-200/50">
                      {filteredUniversities.map((uni, index) => (
                        <button
                          key={uni.code}
                          onClick={() => {
                            if (expandedUniversity === uni.code) {
                              setExpandedUniversity(null);
                            } else {
                              setExpandedUniversity(uni.code);
                              loadPrograms(uni.code);
                            }
                          }}
                          className={`w-full p-4 sm:p-5 text-left transition-all duration-300 hover:bg-white/50 group ${
                            expandedUniversity === uni.code 
                              ? 'bg-gradient-to-r from-indigo-50/80 to-purple-50/80 border-l-4 border-indigo-500' 
                              : ''
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-800 text-sm leading-tight group-hover:text-indigo-700 transition-colors truncate">
                                {uni.name}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 group-hover:bg-indigo-100 rounded-full text-xs font-medium text-slate-600 group-hover:text-indigo-700 transition-colors">
                                  <div className="w-1.5 h-1.5 bg-current rounded-full" />
                                  Kode: {uni.code}
                                </span>
                              </div>
                            </div>
                            <div className={`ml-3 p-2 rounded-lg transition-all ${
                              expandedUniversity === uni.code 
                                ? 'bg-indigo-100 text-indigo-600' 
                                : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                            }`}>
                              <ChevronDown size={16} className={`transition-transform ${
                                expandedUniversity === uni.code ? 'rotate-180' : ''
                              }`} />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="xl:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {expandedUniversity ? (
                  <>
                    <div className="p-3 sm:p-4 border-b border-slate-200">
                      <div className="mb-3">
                        <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-tight">
                          {universities.find(u => u.code === expandedUniversity)?.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">{sortedPrograms.length} program studi</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input
                            type="text"
                            placeholder="Cari program..."
                            value={programSearchQuery}
                            onChange={(e) => setProgramSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                          />
                        </div>
                        <div className="relative">
                          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full sm:w-auto pr-10 pl-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white appearance-none cursor-pointer"
                          >
                            <option value="name">Nama Program</option>
                            <option value="ratio">Rasio Peminat</option>
                            <option value="capacity">Daya Tampung</option>
                            <option value="applicants">Jumlah Peminat</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="max-h-[500px] xl:max-h-[600px] overflow-y-auto">
                      {loading ? (
                        <div className="p-8 text-center">
                          <Loader className="animate-spin mx-auto text-indigo-600 mb-2" size={24} />
                          <p className="text-sm text-slate-500">Memuat program studi...</p>
                        </div>
                      ) : sortedPrograms.length === 0 ? (
                        <div className="p-8 text-center">
                          <BookOpen className="mx-auto text-slate-300 mb-2" size={32} />
                          <p className="text-sm text-slate-500">
                            {programSearchQuery ? 'Tidak ada program yang cocok' : 'Tidak ada program studi'}
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-200">
                          {sortedPrograms.map((prog, idx) => (
                            <div key={idx} className="p-3 sm:p-4 hover:bg-slate-50 transition-colors">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3">
                                <div className="flex-1 mb-2 sm:mb-0">
                                  <h4 className="font-semibold text-slate-900 text-sm leading-tight">{prog.name}</h4>
                                  <p className="text-xs text-slate-500 mt-1">
                                    {prog.jenjang} • Kode: {prog.code}
                                  </p>
                                </div>
                                <div className="text-center sm:text-right sm:ml-4">
                                  <div className="text-lg font-bold text-indigo-600">{prog.ratio}</div>
                                  <p className="text-xs text-slate-500">Rasio</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                                <div className="bg-slate-50 rounded-lg p-2">
                                  <div className="flex items-center justify-center gap-1 mb-1">
                                    <Target size={12} className="text-teal-600 sm:w-3.5 sm:h-3.5" />
                                    <span className="font-bold text-slate-900 text-xs sm:text-sm">{prog.capacity}</span>
                                  </div>
                                  <p className="text-[9px] sm:text-[10px] text-slate-500">Daya Tampung</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-2">
                                  <div className="flex items-center justify-center gap-1 mb-1">
                                    <Users size={12} className="text-amber-600 sm:w-3.5 sm:h-3.5" />
                                    <span className="font-bold text-slate-900 text-xs sm:text-sm">{prog.applicants}</span>
                                  </div>
                                  <p className="text-[9px] sm:text-[10px] text-slate-500">Peminat</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-2">
                                  <div className="flex items-center justify-center gap-1 mb-1">
                                    <TrendingUp size={12} className="text-rose-600 sm:w-3.5 sm:h-3.5" />
                                    <span className="font-bold text-slate-900 text-xs sm:text-sm">{prog.admissionChance}</span>
                                  </div>
                                  <p className="text-[9px] sm:text-[10px] text-slate-500">Peluang</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="p-12 text-center">
                    <BookOpen className="mx-auto text-slate-300 mb-4" size={48} />
                    <p className="text-slate-500 font-medium">Pilih universitas untuk melihat program studi</p>
                    <p className="text-sm text-slate-400 mt-2">Informasi meliputi daya tampung, jumlah peminat, dan peluang masuk</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Premium Footer */}
        <div className="mt-12 dash-fade-up d-delay-400">
          <div className="bg-gradient-to-r from-indigo-50/80 via-white/50 to-purple-50/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                <BookOpen size={20} className="text-indigo-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Cara Membaca Data</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg group-hover:scale-110 transition-transform">
                    <BarChart3 size={16} className="text-indigo-600" />
                  </div>
                  <p className="font-semibold text-slate-800">Rasio Peminat</p>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Perbandingan jumlah peminat dengan daya tampung. Semakin kecil, semakin mudah masuk.
                </p>
              </div>
              
              <div className="group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg group-hover:scale-110 transition-transform">
                    <Target size={16} className="text-emerald-600" />
                  </div>
                  <p className="font-semibold text-slate-800">Daya Tampung</p>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Jumlah kursi yang tersedia untuk program studi tersebut.
                </p>
              </div>
              
              <div className="group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-br from-rose-100 to-rose-200 rounded-lg group-hover:scale-110 transition-transform">
                    <TrendingUp size={16} className="text-rose-600" />
                  </div>
                  <p className="font-semibold text-slate-800">Peluang Masuk</p>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Estimasi persentase peluang diterima berdasarkan rasio peminat.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Attribution */}
        <div className="mt-6 text-center dash-fade-up d-delay-450">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-white/50">
            <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
            <p className="text-xs text-slate-600">
              Data bersumber dari{' '}
              <a href="https://snpmb.bppp.kemdikbud.go.id" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                SNPMB.id
              </a>
              {' '}• © {new Date().getFullYear()} SNBT AI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PTNPediaView;

// Add premium animation styles
const premiumStyles = `
  /* Premium Animation System */
  @keyframes dashFadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes dashFadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes premiumGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.1); }
    50% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.2); }
  }
  
  .dash-fade-up { animation: dashFadeUp 0.6s cubic-bezier(0.22, 0.68, 0, 1.2) both; }
  .dash-fade-in { animation: dashFadeIn 0.4s ease both; }
  .premium-glow { animation: premiumGlow 3s ease-in-out infinite; }
  
  .d-delay-0 { animation-delay: 0ms; }
  .d-delay-80 { animation-delay: 80ms; }
  .d-delay-160 { animation-delay: 160ms; }
  .d-delay-200 { animation-delay: 200ms; }
  .d-delay-400 { animation-delay: 400ms; }
  .d-delay-450 { animation-delay: 450ms; }
  
  /* Premium Glassmorphism */
  .glass-effect {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.5);
  }
  
  /* Premium Hover Effects */
  .premium-hover {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .premium-hover:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 10px 40px rgba(99, 102, 241, 0.15);
  }
  
  /* Premium Focus Effects */
  .premium-focus:focus-within {
    transform: scale(1.01);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

// Inject premium styles
if (typeof document !== 'undefined' && !document.getElementById('ptnpedia-premium-styles')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'ptnpedia-premium-styles';
  styleElement.textContent = premiumStyles;
  document.head.appendChild(styleElement);
}
