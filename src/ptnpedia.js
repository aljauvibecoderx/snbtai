import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, TrendingUp, Users, Target, ChevronDown, Loader, AlertCircle, BookOpen } from 'lucide-react';

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
    <div className="min-h-screen bg-[#F3F4F8] relative overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 relative z-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md">
              <ChevronDown size={20} className="text-slate-600 rotate-90" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">PTNPedia</h1>
              <p className="text-sm text-slate-500 mt-1">Informasi lengkap PTN, program studi, dan daya tampung</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-6">
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setDataType('snbp')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                dataType === 'snbp'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              SNBP (Afirmasi)
            </button>
            <button
              onClick={() => setDataType('snbt')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                dataType === 'snbt'
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              SNBT (Tes Tulis)
            </button>
          </div>
          <div className="flex gap-2 border-t border-slate-200 pt-4">
            <button
              onClick={() => setViewMode('browse')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                viewMode === 'browse'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Jelajah PTN
            </button>
            <button
              onClick={() => setViewMode('compare')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                viewMode === 'compare'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Bandingkan Prodi
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="text-rose-600" size={20} />
            <p className="text-sm text-rose-700">{error}</p>
          </div>
        )}

        {viewMode === 'compare' ? (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Bandingkan Program Studi</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Ketik nama program studi (contoh: Teknik Informatika)"
                    value={compareProdiName}
                    onChange={(e) => setCompareProdiName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCompareProdi()}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  onClick={handleCompareProdi}
                  disabled={loading || !compareProdiName.trim()}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? 'Mencari...' : 'Bandingkan'}
                </button>
              </div>
            </div>

            {compareResults.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900">Hasil Perbandingan</h3>
                    <p className="text-xs text-slate-500 mt-1">{sortedCompareResults.length} program ditemukan</p>
                  </div>
                  <div className="relative">
                    <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select
                      value={compareSortBy}
                      onChange={(e) => setCompareSortBy(e.target.value)}
                      className="w-full sm:w-auto pr-10 pl-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white appearance-none cursor-pointer"
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

                <div className="max-h-[600px] overflow-y-auto">
                  <div className="divide-y divide-slate-200">
                    {sortedCompareResults.map((prog, idx) => (
                      <div key={idx} className="p-3 sm:p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3">
                          <div className="flex-1 mb-2 sm:mb-0">
                            <h4 className="font-semibold text-slate-900 text-sm leading-tight">{prog.name}</h4>
                            <p className="text-xs text-indigo-600 font-medium mt-1">{prog.universityName}</p>
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
                </div>
              </div>
            )}

            {!loading && compareResults.length === 0 && compareProdiName && (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200">
                <BookOpen className="mx-auto text-slate-300 mb-4" size={48} />
                <p className="text-slate-500 font-medium">Tidak ada hasil ditemukan</p>
                <p className="text-sm text-slate-400 mt-2">Coba kata kunci lain atau periksa ejaan</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
            <div className="xl:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-slate-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Cari universitas..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                </div>

                <div className="max-h-[400px] xl:max-h-[600px] overflow-y-auto">
                  {loading && !universities.length ? (
                    <div className="p-8 text-center">
                      <Loader className="animate-spin mx-auto text-indigo-600 mb-2" size={24} />
                      <p className="text-sm text-slate-500">Memuat data...</p>
                    </div>
                  ) : filteredUniversities.length === 0 ? (
                    <div className="p-8 text-center">
                      <BookOpen className="mx-auto text-slate-300 mb-2" size={32} />
                      <p className="text-sm text-slate-500">Tidak ada universitas ditemukan</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-200">
                      {filteredUniversities.map((uni) => (
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
                          className={`w-full p-3 sm:p-4 text-left transition-all hover:bg-slate-50 ${
                            expandedUniversity === uni.code ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''
                          }`}
                        >
                          <p className="font-medium text-slate-800 text-sm leading-tight">{uni.name}</p>
                          <p className="text-xs text-slate-500 mt-1">Kode: {uni.code}</p>
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

        <div className="mt-6 sm:mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-4 sm:p-6">
          <h3 className="font-bold text-slate-900 mb-3 text-sm sm:text-base">Cara Membaca Data</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div>
              <p className="font-semibold text-slate-800 mb-1">Rasio Peminat</p>
              <p className="text-slate-600 leading-relaxed">Perbandingan jumlah peminat dengan daya tampung. Semakin kecil, semakin mudah masuk.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-800 mb-1">Daya Tampung</p>
              <p className="text-slate-600 leading-relaxed">Jumlah kursi yang tersedia untuk program studi tersebut.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-800 mb-1">Peluang Masuk</p>
              <p className="text-slate-600 leading-relaxed">Estimasi persentase peluang diterima berdasarkan rasio peminat.</p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500">
            Data bersumber dari{' '}
            <a href="https://snpmb.bppp.kemdikbud.go.id" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 font-medium">
              SNPMB.id
            </a>
            {' '}• © {new Date().getFullYear()} SNBT AI
          </p>
        </div>
      </div>
    </div>
  );
};

export default PTNPediaView;
