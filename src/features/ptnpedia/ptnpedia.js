import React, { useState, useEffect, useCallback } from 'react';
import { Search, TrendingUp, Users, Target, ChevronDown, Loader, AlertCircle, BookOpen, ArrowLeft, Sparkles, Zap, Globe, BarChart3, X } from 'lucide-react';

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
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showMobileList, setShowMobileList] = useState(false);

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
    <div className="ptnpedia-container h-screen max-h-screen overflow-hidden flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-blue-400/15 to-cyan-400/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-gradient-to-r from-violet-300/10 to-pink-300/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Main Content - Fixed to viewport */}
      <div className="flex-1 flex flex-col max-w-[1440px] mx-auto w-full px-4 sm:px-6 py-3 relative z-10 overflow-hidden">
        
        {/* Header Section (~120px) */}
        <div className="flex-shrink-0 space-y-3">
          {/* Title & Back Button */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="group p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg border border-white/50"
              >
                <ArrowLeft size={18} className="text-slate-600 group-hover:text-slate-800 transition-colors" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
                  PTNPedia
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Eksplorasi PTN & program studi
                </p>
              </div>
            </div>
            
            {/* Info Button */}
            <button
              onClick={() => setShowInfoModal(true)}
              className="group p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-xl transition-all duration-300 shadow-sm hover:shadow-md border border-white/50"
              title="Cara Membaca Data"
            >
              <BookOpen size={18} className="text-indigo-600 group-hover:text-indigo-700" />
            </button>
          </div>

          {/* Segmented Controls - Simplified */}
          <div className="flex items-center justify-between gap-3">
            {/* Data Type Selector - Primary */}
            <div className="bg-slate-100/80 backdrop-blur-sm rounded-xl p-1 flex gap-1">
              <button
                onClick={() => setDataType('snbp')}
                className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg transition-all duration-300 ${
                  dataType === 'snbp'
                    ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles size={14} />
                <span className="text-xs sm:text-sm font-medium">SNBP</span>
              </button>
              <button
                onClick={() => setDataType('snbt')}
                className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg transition-all duration-300 ${
                  dataType === 'snbt'
                    ? 'bg-white text-emerald-700 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Zap size={14} />
                <span className="text-xs sm:text-sm font-medium">SNBT</span>
              </button>
            </div>

            {/* Compare Button - Secondary Action */}
            <button
              onClick={() => setViewMode(viewMode === 'compare' ? 'browse' : 'compare')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                viewMode === 'compare'
                  ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
                  : 'bg-white/80 backdrop-blur-sm text-slate-700 border border-slate-200 hover:bg-white hover:shadow-md'
              }`}
            >
              <BarChart3 size={16} />
              <span className="text-xs sm:text-sm font-semibold">
                {viewMode === 'compare' ? 'Tutup' : 'Bandingkan'}
              </span>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex-shrink-0 mb-2">
            <div className="bg-gradient-to-r from-rose-50 to-red-50 border border-rose-200/50 rounded-xl p-2.5 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-rose-100 rounded-lg">
                  <AlertCircle className="text-rose-600" size={14} />
                </div>
                <p className="font-medium text-rose-800 text-xs">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area - Two Column Split View */}
        {viewMode === 'compare' ? (
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            {/* Compare Search - Compact */}
            <div className="flex-shrink-0 mb-3">
              <div className="bg-white/90 backdrop-blur-xl rounded-xl p-3 shadow-sm border border-gray-200/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
                    <BarChart3 size={14} className="text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-sm">Bandingkan Prodi</h3>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="text"
                      placeholder="Nama prodi..."
                      value={compareProdiName}
                      onChange={(e) => setCompareProdiName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCompareProdi()}
                      className="w-full pl-8 pr-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs sm:text-sm placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    onClick={handleCompareProdi}
                    disabled={loading || !compareProdiName.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium text-xs sm:text-sm hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-300 shadow-sm whitespace-nowrap"
                  >
                    {loading ? <Loader className="animate-spin" size={14} /> : 'Cari'}
                  </button>
                </div>
              </div>
            </div>

            {/* Results - Scrollable */}
            <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
              {compareResults.length > 0 && (
                <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 overflow-hidden">
                  <div className="p-3 border-b border-gray-200/50 bg-gradient-to-r from-slate-50/80 to-white/80">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-sm">Hasil ({sortedCompareResults.length})</h3>
                      <select
                        value={compareSortBy}
                        onChange={(e) => setCompareSortBy(e.target.value)}
                        className="px-2.5 py-1.5 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs appearance-none cursor-pointer"
                      >
                        <option value="ratio-asc">Rasio Terendah</option>
                        <option value="ratio-desc">Rasio Tertinggi</option>
                        <option value="chance-desc">Peluang Tertinggi</option>
                      </select>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100/50 max-h-[calc(100vh-340px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {sortedCompareResults.map((prog, idx) => (
                      <div key={idx} className="p-3 hover:bg-white/50 transition-all duration-300 group">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
                          <div className="flex-1 mb-2 sm:mb-0">
                            <h4 className="font-semibold text-slate-900 text-xs sm:text-sm leading-tight group-hover:text-indigo-700 transition-colors">{prog.name}</h4>
                            <p className="text-xs text-indigo-600 font-medium mt-0.5">{prog.universityName}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{prog.jenjang} • Kode: {prog.code}</p>
                          </div>
                          <div className="text-center sm:text-right sm:ml-3">
                            <div className="text-base font-bold text-indigo-600">{prog.ratio}</div>
                            <p className="text-[9px] text-slate-500">Rasio</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5">
                          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 rounded-lg p-1.5 text-center">
                            <div className="flex items-center justify-center gap-1 mb-0.5">
                              <Target size={10} className="text-teal-600" />
                              <span className="font-bold text-slate-900 text-xs">{prog.capacity}</span>
                            </div>
                            <p className="text-[9px] text-slate-600">Daya Tampung</p>
                          </div>
                          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-lg p-1.5 text-center">
                            <div className="flex items-center justify-center gap-1 mb-0.5">
                              <Users size={10} className="text-amber-600" />
                              <span className="font-bold text-slate-900 text-xs">{prog.applicants}</span>
                            </div>
                            <p className="text-[9px] text-slate-600">Peminat</p>
                          </div>
                          <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 rounded-lg p-1.5 text-center">
                            <div className="flex items-center justify-center gap-1 mb-0.5">
                              <TrendingUp size={10} className="text-rose-600" />
                              <span className="font-bold text-slate-900 text-xs">{prog.admissionChance}</span>
                            </div>
                            <p className="text-[9px] text-slate-600">Peluang</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!loading && compareResults.length === 0 && compareProdiName && (
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-8 text-center shadow-sm border border-gray-200/50">
                  <BookOpen className="mx-auto text-slate-300 mb-2" size={28} />
                  <p className="text-sm text-slate-600 font-medium">Tidak ada hasil ditemukan</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Browse Mode - Split View */
          <div className="flex-1 flex flex-col overflow-hidden min-h-0 mt-3">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-full">
              
              {/* Left Panel - University List (33%) */}
              <div className="lg:col-span-4 flex flex-col h-full min-h-0 hidden lg:flex">
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden flex flex-col h-full">
                  {/* Header (50px) */}
                  <div className="p-3 border-b border-gray-200/50 bg-gradient-to-r from-slate-50/80 to-white/80 flex-shrink-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
                          <Globe size={14} className="text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">Pilih PTN</h3>
                          <p className="text-xs text-slate-600">{filteredUniversities.length} universitas</p>
                        </div>
                      </div>
                    </div>

                    {/* Search (48px) */}
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input
                        type="text"
                        placeholder="Cari universitas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs sm:text-sm placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Scrollable List */}
                  <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
                    {loading && !universities.length ? (
                      <div className="p-6 text-center">
                        <Loader className="animate-spin text-indigo-600 mx-auto mb-2" size={18} />
                        <p className="text-xs text-slate-600 font-medium">Memuat data...</p>
                      </div>
                    ) : filteredUniversities.length === 0 ? (
                      <div className="p-6 text-center">
                        <BookOpen className="mx-auto text-slate-300 mb-2" size={22} />
                        <p className="text-xs text-slate-600 font-medium">Tidak ada universitas ditemukan</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100/50">
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
                            className={`w-full px-3 py-2 text-left transition-all duration-300 hover:bg-indigo-50/30 group ${
                              expandedUniversity === uni.code
                                ? 'bg-gradient-to-r from-indigo-50/80 to-purple-50/80 border-l-4 border-indigo-500'
                                : ''
                            }`}
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-800 text-xs sm:text-sm leading-tight group-hover:text-indigo-700 transition-colors truncate">
                                  {uni.name}
                                </p>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 group-hover:bg-indigo-100 rounded-full text-[10px] font-medium text-slate-600 group-hover:text-indigo-700 transition-colors">
                                    <div className="w-1 h-1 bg-current rounded-full" />
                                    {uni.code}
                                  </span>
                                </div>
                              </div>
                              <div className={`ml-2 p-1.5 rounded transition-all ${
                                expandedUniversity === uni.code
                                  ? 'bg-indigo-100 text-indigo-600'
                                  : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                              }`}>
                                <ChevronDown size={14} className={`transition-transform ${
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

              {/* Right Panel - Program Details (67%) */}
              <div className="lg:col-span-8 flex flex-col h-full min-h-0">
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden flex flex-col h-full">
                  {expandedUniversity ? (
                    <>
                      {/* Header (60px) */}
                      <div className="p-3 border-b border-gray-200/50 flex-shrink-0">
                        <div className="mb-2">
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                            {universities.find(u => u.code === expandedUniversity)?.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">{sortedPrograms.length} program studi</p>
                        </div>
                        
                        {/* Search + Filter (48px) */}
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input
                              type="text"
                              placeholder="Cari program..."
                              value={programSearchQuery}
                              onChange={(e) => setProgramSearchQuery(e.target.value)}
                              className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                            />
                          </div>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm bg-white cursor-pointer whitespace-nowrap"
                          >
                            <option value="name">Nama</option>
                            <option value="ratio">Rasio</option>
                            <option value="capacity">Daya Tampung</option>
                            <option value="applicants">Peminat</option>
                          </select>
                        </div>
                      </div>

                      {/* Scrollable Programs List */}
                      <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
                        {loading ? (
                          <div className="p-6 text-center">
                            <Loader className="animate-spin mx-auto text-indigo-600 mb-2" size={18} />
                            <p className="text-xs text-slate-500">Memuat program studi...</p>
                          </div>
                        ) : sortedPrograms.length === 0 ? (
                          <div className="p-6 text-center">
                            <BookOpen className="mx-auto text-slate-300 mb-2" size={22} />
                            <p className="text-xs text-slate-500">
                              {programSearchQuery ? 'Tidak ada program yang cocok' : 'Tidak ada program studi'}
                            </p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100/50">
                            {sortedPrograms.map((prog, idx) => (
                              <div key={idx} className="px-3 py-2.5 hover:bg-slate-50/50 transition-colors">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
                                  <div className="flex-1 mb-2 sm:mb-0">
                                    <h4 className="font-semibold text-slate-900 text-xs sm:text-sm leading-tight">{prog.name}</h4>
                                    <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
                                      {prog.jenjang} • Kode: {prog.code}
                                    </p>
                                  </div>
                                  <div className="text-center sm:text-right sm:ml-3">
                                    <div className="text-base font-bold text-indigo-600">{prog.ratio}</div>
                                    <p className="text-[9px] sm:text-[10px] text-slate-500">Rasio</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-1.5 text-center">
                                  <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 rounded-lg p-1.5">
                                    <div className="flex items-center justify-center gap-1 mb-0.5">
                                      <Target size={10} className="text-teal-600" />
                                      <span className="font-bold text-slate-900 text-xs">{prog.capacity}</span>
                                    </div>
                                    <p className="text-[9px] text-slate-500">Daya Tampung</p>
                                  </div>
                                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-lg p-1.5">
                                    <div className="flex items-center justify-center gap-1 mb-0.5">
                                      <Users size={10} className="text-amber-600" />
                                      <span className="font-bold text-slate-900 text-xs">{prog.applicants}</span>
                                    </div>
                                    <p className="text-[9px] text-slate-500">Peminat</p>
                                  </div>
                                  <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 rounded-lg p-1.5">
                                    <div className="flex items-center justify-center gap-1 mb-0.5">
                                      <TrendingUp size={10} className="text-rose-600" />
                                      <span className="font-bold text-slate-900 text-xs">{prog.admissionChance}</span>
                                    </div>
                                    <p className="text-[9px] text-slate-500">Peluang</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    /* Empty State - Welcome Screen */
                    <div className="flex-1 flex flex-col items-center p-8 lg:p-12 lg:pt-24 overflow-y-auto pb-32">
                      <div className="text-center lg:translate-y-[-80px]">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                          <BookOpen className="text-indigo-600 w-10 h-10 sm:w-12 sm:h-12" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-xl sm:text-2xl mb-3 text-center">
                          Selamat Datang di PTNPedia
                        </h3>
                        <p className="text-slate-600 text-sm sm:text-base text-center max-w-md mb-2 leading-relaxed">
                          Jelajahi ribuan program studi dari puluhan PTN favorit di seluruh Indonesia
                        </p>
                        <p className="text-slate-500 text-xs sm:text-sm text-center max-w-md leading-relaxed">
                          Pilih universitas di panel sebelah kiri untuk melihat detail program studi, daya tampung, dan peluang masuk
                        </p>
                        
                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-8">
                          <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-indigo-600">50+</div>
                            <div className="text-xs sm:text-sm text-slate-500 mt-1">PTN</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-purple-600">1000+</div>
                            <div className="text-xs sm:text-sm text-slate-500 mt-1">Prodi</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-pink-600">2</div>
                            <div className="text-xs sm:text-sm text-slate-500 mt-1">Jalur</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile FAB - Pilih PTN */}
                <div className="lg:hidden absolute bottom-6 right-6 z-20">
                  <button
                    onClick={() => setShowMobileList(true)}
                    className="group flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300"
                  >
                    <Globe size={18} />
                    <span className="font-semibold text-sm">Pilih PTN</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Bottom Sheet */}
            {showMobileList && (
              <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setShowMobileList(false)}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="w-full flex justify-center pt-3 pb-2">
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                  </div>
                  <div className="px-4 pb-3 border-b border-gray-200/50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-slate-900">Pilih PTN</h3>
                      <button onClick={() => setShowMobileList(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={18} className="text-slate-600" />
                      </button>
                    </div>
                  </div>
                  <div className="px-4 py-3 border-b border-gray-200/50">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        placeholder="Cari universitas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {filteredUniversities.map((uni) => (
                      <button
                        key={uni.code}
                        onClick={() => {
                          setExpandedUniversity(uni.code);
                          loadPrograms(uni.code);
                          setShowMobileList(false);
                        }}
                        className={`w-full p-4 text-left border-b border-gray-100/50 hover:bg-indigo-50/30 transition-colors ${
                          expandedUniversity === uni.code ? 'bg-indigo-50' : ''
                        }`}
                      >
                        <p className="font-semibold text-slate-800 text-sm">{uni.name}</p>
                        <p className="text-xs text-slate-500 mt-1">Kode: {uni.code}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Attribution */}
        <div className="flex-shrink-0 mt-auto pt-4 pb-2 border-t border-gray-200/50">
          <div className="text-center">
            <p className="text-[10px] sm:text-xs text-slate-500">
              Data dari{' '}
              <a href="https://snpmb.bppp.kemdikbud.go.id" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                SNPMB.id
              </a>
              {' '}• © {new Date().getFullYear()} SNBT AI
            </p>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowInfoModal(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div 
            className="relative bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                  <BookOpen size={18} className="text-indigo-600" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Cara Membaca Data</h3>
              </div>
              <button onClick={() => setShowInfoModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={18} className="text-slate-600" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-3 border border-indigo-100">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 bg-white rounded-lg">
                    <BarChart3 size={16} className="text-indigo-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Rasio Peminat</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Perbandingan jumlah peminat dengan daya tampung. <span className="font-semibold text-indigo-600">Semakin kecil angka, semakin mudah masuk.</span>
                </p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-100">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 bg-white rounded-lg">
                    <Target size={16} className="text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Daya Tampung</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Jumlah kursi yang tersedia untuk program studi tersebut.
                </p>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-3 border border-rose-100">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 bg-white rounded-lg">
                    <TrendingUp size={16} className="text-rose-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Peluang Masuk</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Estimasi persentase peluang diterima berdasarkan rasio peminat.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full mt-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 5px;
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
        
        .ptnpedia-container {
          max-width: 100%;
        }
        
        @media (min-width: 1024px) {
          .ptnpedia-container .main-content {
            height: calc(100vh - 140px);
          }
        }
      `}</style>
    </div>
  );
};

export default PTNPediaView;
