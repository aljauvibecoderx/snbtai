import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  BookOpen,
  PenTool,
  TrendingUp,
  Calculator,
  BookMarked,
  Globe,
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  Target,
  Lightbulb,
  Award,
  Layers,
  CheckCircle2
} from 'lucide-react';
import {
  SUBTEST_CONFIG,
  LEVEL_CONFIG,
  QUESTION_TYPES,
  PATTERN_STATS,
  getTransformedPatterns
} from '../data/questionPatternsData';

/**
 * SNBT Question Patterns Page
 * Comprehensive reference for all 109 question patterns across 7 subtests
 */

export const SNBTQuestionPatterns = () => {
  const navigate = useNavigate();
  const [selectedSubtest, setSelectedSubtest] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPatterns, setExpandedPatterns] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const patterns = useMemo(() => getTransformedPatterns(), []);

  // Filter patterns
  const filteredPatterns = useMemo(() => {
    let result = [];

    // Collect all patterns
    for (const [subtestId, subtestPatterns] of Object.entries(patterns)) {
      result = result.concat(subtestPatterns.map(p => ({ ...p, subtestId })));
    }

    // Apply filters
    if (selectedSubtest !== 'all') {
      result = result.filter(p => p.subtestId === selectedSubtest);
    }

    if (selectedLevel !== 'all') {
      result = result.filter(p => p.levels.includes(parseInt(selectedLevel)));
    }

    if (selectedType !== 'all') {
      result = result.filter(p => p.type === selectedType);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [patterns, selectedSubtest, selectedLevel, selectedType, searchQuery]);

  const togglePattern = (patternId) => {
    setExpandedPatterns(prev => ({
      ...prev,
      [patternId]: !prev[patternId]
    }));
  };

  const getSubtestConfig = (subtestId) => SUBTEST_CONFIG[subtestId] || SUBTEST_CONFIG.tps_pu;
  const getTypeConfig = (typeId) => QUESTION_TYPES.find(t => t.id === typeId) || QUESTION_TYPES[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-600" />
              </button>
              <div className="flex items-center gap-2">
                <Layers size={20} className="text-indigo-600" />
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Pola Soal SNBT</h1>
                  <p className="text-xs text-slate-500">{PATTERN_STATS.totalPatterns} pola • 7 subtes</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
            >
              <Filter size={18} className="text-slate-600" />
              <span className="text-sm font-medium text-slate-600 hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            icon={Layers}
            label="Total Pola"
            value={PATTERN_STATS.totalPatterns}
            color="indigo"
          />
          <StatCard
            icon={Brain}
            label="Subtes"
            value={Object.keys(SUBTEST_CONFIG).length}
            color="purple"
          />
          <StatCard
            icon={Target}
            label="Tipe Soal"
            value={QUESTION_TYPES.length}
            color="amber"
          />
          <StatCard
            icon={Award}
            label="Level"
            value="0-5"
            color="teal"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 space-y-4 animate-fade-in">
            {/* Search */}
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pola soal..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Subtest Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">
                  Subtes
                </label>
                <select
                  value={selectedSubtest}
                  onChange={(e) => setSelectedSubtest(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                >
                  <option value="all">Semua Subtes</option>
                  {Object.values(SUBTEST_CONFIG).map(subtest => (
                    <option key={subtest.id} value={subtest.id}>
                      {subtest.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">
                  Level
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                >
                  <option value="all">Semua Level</option>
                  {LEVEL_CONFIG.map(level => (
                    <option key={level.level} value={level.level}>
                      Level {level.level}: {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">
                  Tipe
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                >
                  <option value="all">Semua Tipe</option>
                  {QUESTION_TYPES.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedSubtest !== 'all' || selectedLevel !== 'all' || selectedType !== 'all' || searchQuery) && (
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                <span className="text-xs text-slate-500">Filter aktif:</span>
                {selectedSubtest !== 'all' && (
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium">
                    {SUBTEST_CONFIG[selectedSubtest]?.name}
                  </span>
                )}
                {selectedLevel !== 'all' && (
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium">
                    Level {selectedLevel}
                  </span>
                )}
                {selectedType !== 'all' && (
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium">
                    {QUESTION_TYPES.find(t => t.id === selectedType)?.name}
                  </span>
                )}
                {searchQuery && (
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium">
                    "{searchQuery}"
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedSubtest('all');
                    setSelectedLevel('all');
                    setSelectedType('all');
                    setSearchQuery('');
                  }}
                  className="text-xs text-slate-500 hover:text-indigo-600 underline"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Menampilkan <span className="font-semibold text-slate-900">{filteredPatterns.length}</span> dari <span className="font-semibold text-slate-900">{PATTERN_STATS.totalPatterns}</span> pola
          </p>
        </div>

        {/* Patterns Grid */}
        {filteredPatterns.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {filteredPatterns.map((pattern, index) => {
              const subtest = getSubtestConfig(pattern.subtestId);
              const type = getTypeConfig(pattern.type);
              const isExpanded = expandedPatterns[pattern.id];

              return (
                <PatternCard
                  key={pattern.id}
                  pattern={pattern}
                  subtest={subtest}
                  type={type}
                  isExpanded={isExpanded}
                  onToggle={() => togglePattern(pattern.id)}
                  delay={index}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color }) => {
  const colors = {
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
    teal: { bg: 'bg-teal-100', text: 'text-teal-600' }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 ${colors[color].bg} rounded-lg flex items-center justify-center`}>
          <Icon size={16} className={colors[color].text} />
        </div>
      </div>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colors[color].text}`}>{value}</p>
    </div>
  );
};

// Pattern Card Component
const PatternCard = ({ pattern, subtest, type, isExpanded, onToggle, delay }) => {
  return (
    <div
      className={`bg-white rounded-xl border-2 ${subtest.borderColor} overflow-hidden transition-all duration-300 hover:shadow-md`}
      style={{ animationDelay: `${(delay + 1) * 30}ms` }}
    >
      {/* Header */}
      <div
        onClick={onToggle}
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${subtest.bgColor} ${subtest.textColor}`}>
                {subtest.code}
              </span>
              <span className={`text-xs font-medium px-2 py-1 rounded ${type.bgColor} ${type.textColor}`}>
                {type.code}
              </span>
            </div>
            <h4 className={`font-semibold text-lg mb-1 ${subtest.textColor}`}>
              {pattern.name}
            </h4>
            <p className="text-sm text-slate-600">
              {pattern.description}
            </p>
          </div>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            {isExpanded ? (
              <ChevronUp size={20} className="text-slate-400" />
            ) : (
              <ChevronDown size={20} className="text-slate-400" />
            )}
          </button>
        </div>

        {/* Quick Info */}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <div className="flex items-center gap-1">
            <Target size={14} className="text-slate-400" />
            <span className="text-xs text-slate-500">{type.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {pattern.levels.map(level => (
              <LevelBadge key={level} level={level} />
            ))}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className={`px-4 pb-4 border-t-2 ${subtest.borderColor} bg-gradient-to-br from-gray-50 to-white`}>
          <div className="mt-4 space-y-4">
            {/* Example Question */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={16} className={subtest.textColor} />
                <span className="text-sm font-semibold text-slate-700">Contoh Pola:</span>
              </div>
              <div className={`p-4 rounded-lg border ${subtest.borderColor} bg-white`}>
                <p className="text-sm text-slate-700 font-medium mb-3">
                  {pattern.example?.text || pattern.template?.text || 'Contoh pertanyaan'}
                </p>
                {pattern.example?.stimulus && (
                  <p className="text-xs text-slate-500 italic mb-3">
                    Stimulus: {pattern.example.stimulus}
                  </p>
                )}
                {pattern.example?.options && Array.isArray(pattern.example.options) && (
                  <div className="space-y-1">
                    {pattern.example.options.slice(0, 5).map((opt, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className={`w-5 h-5 rounded flex items-center justify-center font-bold ${subtest.bgColor} ${subtest.textColor}`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-slate-700">{opt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Context Variations */}
            {pattern.contextVariations && pattern.contextVariations.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Award size={16} className="text-amber-500" />
                  <span className="text-sm font-semibold text-slate-700">Konteks yang Sering Muncul:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pattern.contextVariations.map((context, i) => (
                    <span
                      key={i}
                      className={`px-2 py-1 rounded-md text-xs font-medium ${subtest.bgColor} ${subtest.textColor}`}
                    >
                      {context.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Concept */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Brain size={16} className="text-indigo-500" />
                <span className="text-sm font-semibold text-slate-700">Konsep yang Diuji:</span>
              </div>
              <p className="text-sm text-slate-600">{pattern.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Level Badge Component
const LevelBadge = ({ level }) => {
  const config = LEVEL_CONFIG.find(l => l.level === level) || LEVEL_CONFIG[0];

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${config.bgColor} ${config.borderColor}`}>
      {level > 0 && (
        <Star size={10} className={`${config.color} fill-current`} />
      )}
      <span className={`text-xs font-semibold ${config.color}`}>
        L{level}
      </span>
    </div>
  );
};

// Empty State Component
const EmptyState = () => {
  return (
    <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Search size={32} className="text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">
        Tidak ada pola yang ditemukan
      </h3>
      <p className="text-sm text-slate-600 mb-6">
        Coba ubah filter atau kata kunci pencarian Anda
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
      >
        Reset Filter
      </button>
    </div>
  );
};

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }
`;
document.head.appendChild(style);

export default SNBTQuestionPatterns;
