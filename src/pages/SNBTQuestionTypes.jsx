import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTotalQuestionsCount } from '../services/firebase/firebase';
import {
  Brain,
  BookOpen,
  TrendingUp,
  Star,
  ChevronRight,
  Target,
  Lightbulb,
  Award,
  ArrowRight,
  CheckCircle2,
  Layers,
  Zap,
  Search,
  Filter,
  ChevronDown
} from 'lucide-react';
import {
  SUBTEST_CONFIG,
  LEVEL_CONFIG,
  QUESTION_TYPES,
  PATTERN_STATS,
  getTransformedPatterns
} from '../data/questionPatternsData';
import { replacePlaceholders, processPatternForDisplay } from '../utils/placeholderReplacer';

/**
 * SNBT Question Types Page
 * Premium, minimalist design for explaining SNBT question types and patterns
 *
 * Features:
 * - Level 1-5 classification with star indicators
 * - Question pattern cards for each subtest
 * - Premium, elegant design
 * - Responsive layout
 */

// Note: SUBTEST_CONFIG, LEVEL_CONFIG, QUESTION_TYPES imported from questionPatternsData.js

// Legacy QUESTION_PATTERNS kept for backward compatibility with existing PatternCard component
const QUESTION_PATTERNS = {
  tps_pu: [
    {
      id: 'pu_inference_direct',
      name: 'Inferensi Langsung',
      description: 'Menarik simpulan langsung dari teks',
      levels: [1, 2],
      frequency: 'Sangat Sering',
      example: 'Berdasarkan informasi tersebut, manakah simpulan yang PASTI BENAR?'
    },
    {
      id: 'pu_causation',
      name: 'Hubungan Sebab-Akibat',
      description: 'Menganalisis hubungan kausalitas',
      levels: [2, 3],
      frequency: 'Sering',
      example: 'Manakah yang PALING MUNGKIN menjadi penyebab fenomena tersebut?'
    },
    {
      id: 'pu_argument',
      name: 'Memperkuat/Melemahkan Argumen',
      description: 'Evaluasi kekuatan argumen',
      levels: [4, 5],
      frequency: 'Sedang',
      example: 'Informasi tambahan manakah yang paling memperkuat argumen peneliti?'
    },
    {
      id: 'pu_data',
      name: 'Interpretasi Data',
      description: 'Membaca dan menganalisis tabel/grafik',
      levels: [2, 3],
      frequency: 'Sangat Sering',
      example: 'Berapa persentase pertumbuhan berdasarkan data tersebut?'
    }
  ],
  tps_ppu: [
    {
      id: 'ppu_affix',
      name: 'Makna Imbuhan',
      description: 'Memahami makna imbuhan dalam konteks',
      levels: [2, 3],
      frequency: 'Sangat Sering',
      example: 'Makna imbuhan ber- dalam kata [...] memiliki makna yang sama dengan...'
    },
    {
      id: 'ppu_main_idea',
      name: 'Gagasan Utama',
      description: 'Mengidentifikasi ide pokok paragraf',
      levels: [3, 4],
      frequency: 'Sangat Sering',
      example: 'Gagasan utama yang dapat disimpulkan dari teks di atas adalah...'
    },
    {
      id: 'ppu_relation',
      name: 'Hubungan Antarparagraf',
      description: 'Menganalisis hubungan konseptual',
      levels: [3, 4],
      frequency: 'Sering',
      example: 'Masalah dalam paragraf 1 adalah masalah yang sama dengan...'
    }
  ],
  tps_pbm: [
    {
      id: 'pbm_spelling',
      name: 'Ejaan & Tanda Baca',
      description: 'Mengidentifikasi kesalahan ejaan',
      levels: [1, 2],
      frequency: 'Sangat Sering',
      example: 'Penulisan kata bercetak tebal yang benar terdapat pada kalimat...'
    },
    {
      id: 'pbm_effective',
      name: 'Kalimat Efektif',
      description: 'Menyempurnakan kalimat tidak efektif',
      levels: [2, 3],
      frequency: 'Sangat Sering',
      example: 'Kalimat (1) perlu disempurnakan dengan cara...'
    },
    {
      id: 'pbm_completion',
      name: 'Melengkapi Teks',
      description: 'Melengkapi bagian rumpang',
      levels: [2, 3],
      frequency: 'Sering',
      example: 'Pernyataan yang paling tepat untuk melengkapi kalimat (3) adalah...'
    }
  ],
  tps_pk: [
    {
      id: 'pk_comparison',
      name: 'Perbandingan P vs Q',
      description: 'Membandingkan dua kuantitas',
      levels: [2, 3, 4],
      frequency: 'Sangat Sering',
      example: 'Tentukan hubungan kuantitas P dan Q berikut.'
    },
    {
      id: 'pk_sufficiency',
      name: 'Kecukupan Data',
      description: 'Menilai kecukupan informasi',
      levels: [3, 4, 5],
      frequency: 'Sering',
      example: 'Putuskan apakah pernyataan (1) dan (2) cukup untuk menjawab pertanyaan.'
    },
    {
      id: 'pk_boolean',
      name: 'Grid Boolean',
      description: 'Menentukan kebenaran pernyataan',
      levels: [3, 4],
      frequency: 'Sering',
      example: 'Tentukan kebenaran pernyataan-pernyataan berikut!'
    },
    {
      id: 'pk_geometry',
      name: 'Geometri',
      description: 'Jarak, luas, volume bangun ruang',
      levels: [3, 4, 5],
      frequency: 'Sangat Sering',
      example: 'Maka, jarak P ke bidang BCGF adalah...'
    }
  ],
  pm: [
    {
      id: 'pm_optimization',
      name: 'Optimasi',
      description: 'Mencari nilai maksimum/minimum',
      levels: [3, 4],
      frequency: 'Sangat Sering',
      example: 'Berapa maksimal keuntungan yang dapat dicapai?'
    },
    {
      id: 'pm_sequence',
      name: 'Deret Aritmatika',
      description: 'Barisan dan deret dalam konteks',
      levels: [2, 3],
      frequency: 'Sangat Sering',
      example: 'Berapa total tabungan hingga bulan ke-12?'
    },
    {
      id: 'pm_function',
      name: 'Fungsi & Model',
      description: 'Pemodelan matematika',
      levels: [3, 4],
      frequency: 'Sering',
      example: 'Jika f adalah fungsi yang menyatakan fenomena tersebut, maka...'
    }
  ],
  lit_ind: [
    {
      id: 'lbi_explicit',
      name: 'Informasi Eksplisit',
      description: 'Menemukan informasi dalam teks',
      levels: [2, 3],
      frequency: 'Sangat Sering',
      example: 'Pernyataan yang TIDAK sesuai dengan bacaan di atas adalah...'
    },
    {
      id: 'lbi_meaning',
      name: 'Makna Kontekstual',
      description: 'Memahami makna kata dalam konteks',
      levels: [2, 3],
      frequency: 'Sangat Sering',
      example: 'Makna dari \'[...]\' berdasarkan bacaan adalah...'
    },
    {
      id: 'lbi_causal',
      name: 'Hubungan Sebab-Akibat',
      description: 'Menganalisis kausalitas dalam teks',
      levels: [3, 4],
      frequency: 'Sering',
      example: 'Mengapa fenomena A dapat menyebabkan fenomena B?'
    }
  ],
  lit_ing: [
    {
      id: 'lbe_detail',
      name: 'Detail Informasi',
      description: 'Menemukan informasi spesifik',
      levels: [2, 3],
      frequency: 'Sangat Sering',
      example: 'Which of the following is NOT the reason why...'
    },
    {
      id: 'lbe_main_idea',
      name: 'Main Idea',
      description: 'Ide pokok teks/paragraf',
      levels: [3, 4],
      frequency: 'Sangat Sering',
      example: 'Which of the following is the best main idea of Text 1?'
    },
    {
      id: 'lbe_inference',
      name: 'Inference',
      description: 'Menarik kesimpulan implisit',
      levels: [3, 4, 5],
      frequency: 'Sangat Sering',
      example: 'What can be inferred about the author\'s stance?'
    },
    {
      id: 'lbe_vocabulary',
      name: 'Vocabulary in Context',
      description: 'Makna kata dalam konteks',
      levels: [2, 3],
      frequency: 'Sering',
      example: 'The phrase [...] is closest in meaning to...'
    }
  ]
};

// Star Rating Component
const StarRating = ({ stars, maxStars = 5, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(maxStars)].map((_, i) => (
        <Star
          key={i}
          className={`${sizeClasses[size]} ${
            i < stars
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
};

// Level Badge Component
const LevelBadge = ({ level, showStars = true, size = 'md' }) => {
  const config = LEVEL_CONFIG.find(l => l.level === level) || LEVEL_CONFIG[0];
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${config.bgColor} ${config.borderColor} border rounded-full ${sizeClasses[size]}`}>
      {showStars && level > 0 && (
        <Star className={`w-3 h-3 ${config.color} fill-current`} />
      )}
      <span className={`font-semibold ${config.color}`}>
        Level {level === 0 ? '0' : level}
      </span>
      {size !== 'sm' && (
        <span className={`hidden sm:inline text-xs ${config.color} opacity-75`}>
          {config.label}
        </span>
      )}
    </div>
  );
};

// Subtest Card Component
const SubtestCard = ({ subtest, patterns, onSelect, isSelected, delay = 0 }) => {
  const Icon = subtest.icon;
  
  return (
    <div
      onClick={() => onSelect(subtest.id)}
      className={`group relative bg-white rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden dash-fade-up ${
        isSelected
          ? `${subtest.borderColor} shadow-lg scale-[1.02] stat-card-hover`
          : 'border-gray-100 shadow-sm stat-card-hover'
      }`}
      style={{ animationDelay: `${(delay + 1) * 50}ms` }}
    >
      {/* Gradient Header */}
      <div className={`h-1.5 bg-gradient-to-r ${subtest.color}`} />
      
      {/* Content */}
      <div className="p-5">
        {/* Icon & Code */}
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2.5 rounded-xl ${subtest.bgColor}`}>
            <Icon className={`w-6 h-6 ${subtest.textColor}`} />
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${subtest.bgColor} ${subtest.textColor}`}>
            {subtest.code}
          </span>
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-1.5 group-hover:text-gray-700 transition-colors">
          {subtest.name}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {subtest.description}
        </p>
        
        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-600">
              {subtest.totalPatterns} Pola
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-gray-600 transition-colors">
            <span className="text-xs font-medium">Detail</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
      
      {/* Selected Indicator */}
      {isSelected && (
        <div className={`absolute top-3 right-3 ${subtest.textColor}`}>
          <CheckCircle2 className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

// Pattern Card Component
const PatternCard = ({ pattern, subtest, delay = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div 
      className={`bg-white rounded-xl border ${subtest.borderColor} overflow-hidden transition-all duration-300 hover:shadow-md dash-fade-up stat-card-hover`}
      style={{ animationDelay: `${(delay + 1) * 40}ms` }}
    >
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">
              {pattern.name}
            </h4>
            <p className="text-sm text-gray-600">
              {pattern.description}
            </p>
          </div>
          <ChevronRight
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
              isExpanded ? 'rotate-90' : ''
            }`}
          />
        </div>
        
        {/* Quick Info */}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <div className="flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-500">{pattern.frequency}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {pattern.levels.map(level => (
              <LevelBadge key={level} level={level} size="sm" />
            ))}
          </div>
        </div>
      </div>
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className={`px-4 pb-4 border-t ${subtest.borderColor} bg-gray-50/50`}>
          <div className="mt-3 space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className={`w-4 h-4 ${subtest.textColor}`} />
              <span className="text-xs font-semibold text-gray-700">Contoh Pertanyaan:</span>
            </div>
            <p className={`text-sm ${subtest.textColor} bg-white p-3 rounded-lg border ${subtest.borderColor}`}>
              "{pattern.example}"
            </p>
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span className="text-xs text-gray-600">
                  Tingkat Kesulitan: <span className="font-semibold">{LEVEL_CONFIG[pattern.levels[0]]?.difficulty || 'Bervariasi'}</span>
                </span>
              </div>
              <button className={`text-xs font-medium ${subtest.textColor} hover:underline flex items-center gap-1`}>
                Latihan Soal
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Level Detail Modal Component
const LevelDetailModal = ({ subtest, level, onClose }) => {
  const navigate = useNavigate();
  const levelConfig = LEVEL_CONFIG.find(l => l.level === level);
  const subtestConfig = SUBTEST_CONFIG[subtest];
  
  const patterns = QUESTION_PATTERNS[subtest]?.filter(p => 
    p.levels.includes(level)
  ) || [];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 bg-gradient-to-r ${subtestConfig.color} rounded-t-3xl text-white`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <subtestConfig.icon className="w-8 h-8" />
              <div>
                <h2 className="text-xl font-bold">{subtestConfig.name}</h2>
                <p className="text-sm opacity-90">Level {level} - {levelConfig?.label}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <Zap className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            <LevelBadge level={level} size="lg" />
            <div className="flex-1" />
            <div className="text-right">
              <div className="text-2xl font-bold">{patterns.length}</div>
              <div className="text-xs opacity-90">Pola Soal</div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Level Description */}
          <div className={`p-4 rounded-xl ${levelConfig.bgColor} ${levelConfig.borderColor} border mb-6`}>
            <div className="flex items-start gap-3">
              <Brain className={`w-5 h-5 ${levelConfig.color} mt-0.5`} />
              <div>
                <h3 className={`font-semibold ${levelConfig.color} mb-1`}>
                  Karakteristik Level {level}
                </h3>
                <p className="text-sm text-gray-700">{levelConfig?.description}</p>
              </div>
            </div>
          </div>
          
          {/* Patterns */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Pola Soal yang Muncul
            </h3>
            
            {patterns.length > 0 ? (
              patterns.map(pattern => (
                <PatternCard
                  key={pattern.id}
                  pattern={pattern}
                  subtest={subtestConfig}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">
                Belum ada pola untuk level ini
              </p>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pt-6 border-t">
            <button
              onClick={() => {
                navigate(`/practice/${subtest}?level=${level}`);
                onClose();
              }}
              className={`flex-1 py-3 px-4 bg-gradient-to-r ${subtestConfig.color} text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}
            >
              <Target className="w-5 h-5" />
              Latihan Level {level}
            </button>
            <button
              onClick={onClose}
              className="py-3 px-6 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const SNBTQuestionTypes = () => {
  const navigate = useNavigate();
  const [bankSoalCount, setBankSoalCount] = useState(1240);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [selectedSubtest, setSelectedSubtest] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [showLevelModal, setShowLevelModal] = useState(false);
  
  // New state for patterns view
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [expandedPatterns, setExpandedPatterns] = useState({});
  
  const patterns = getTransformedPatterns();

  // Load bank soal count from Firebase
  useEffect(() => {
    const loadBankSoalCount = async () => {
      try {
        console.log('🔄 Loading bank soal count from Firebase...');
        const count = await getTotalQuestionsCount();
        console.log('✅ Bank soal count loaded:', count);
        setBankSoalCount(count || 1240);
      } catch (error) {
        console.error('❌ Error loading bank soal count:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    loadBankSoalCount();
  }, []);

  const displayBankSoal = isLoadingStats ? '1.240' : bankSoalCount.toLocaleString('id-ID');

  const handleSubtestSelect = (subtestId) => {
    setSelectedSubtest(subtestId === selectedSubtest ? null : subtestId);
  };

  const handleLevelClick = (level) => {
    setSelectedLevel(level);
    setShowLevelModal(true);
  };

  // Process patterns for display (replace placeholders)
  const processedPatterns = useMemo(() => {
    const processed = {};
    for (const [subtestId, subtestPatterns] of Object.entries(patterns)) {
      processed[subtestId] = subtestPatterns.map(p => processPatternForDisplay(p));
    }
    return processed;
  }, [patterns]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full mb-6">
              <Award className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-semibold text-violet-700">
                Panduan Lengkap SNBT 2025
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Tipe & Pola Soal SNBT
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Pahami setiap jenis soal, tingkat kesulitan, dan pola yang sering muncul 
              untuk memaksimalkan persiapan ujian Anda
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center dash-fade-up d-delay-80">
                <div className="text-3xl font-bold text-gray-900">{displayBankSoal}</div>
                <div className="text-sm text-gray-600 mt-1">Soal Tersedia</div>
              </div>
              <div className="text-center dash-fade-up d-delay-160">
                <div className="text-3xl font-bold text-gray-900">7</div>
                <div className="text-sm text-gray-600 mt-1">Subtes</div>
              </div>
              <div className="text-center dash-fade-up d-delay-250">
                <div className="text-3xl font-bold text-gray-900">5</div>
                <div className="text-sm text-gray-600 mt-1">Level</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Level Classification Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Klasifikasi Tingkat Kesulitan
          </h2>
          <p className="text-gray-600">
            Sistem Level 1-5 untuk mengukur kompleksitas soal
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {LEVEL_CONFIG.filter(l => l.level > 0).map((level, idx) => (
            <button
              key={level.level}
              onClick={() => handleLevelClick(level.level)}
              className={`p-4 rounded-2xl border-2 ${level.borderColor} ${level.bgColor} hover:shadow-lg transition-all duration-300 text-left group dash-fade-up`}
              style={{ animationDelay: `${(idx + 1) * 50}ms` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-full ${level.bgColor} border-2 ${level.borderColor} flex items-center justify-center`}>
                  <span className={`text-sm font-bold ${level.color}`}>{level.level}</span>
                </div>
                <StarRating stars={level.stars} size="sm" />
              </div>
              <div className={`font-bold ${level.color} mb-1`}>{level.label}</div>
              <div className="text-xs text-gray-600 line-clamp-2">{level.description}</div>
              <div className="mt-2 text-xs font-medium text-gray-500 group-hover:text-gray-700">
                Lihat Detail →
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Patterns Section - Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Patterns Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Semua Pola Soal SNBT
          </h2>
          <p className="text-gray-600">
            {PATTERN_STATS.totalPatterns} pola dari 7 subtes
          </p>
        </div>

        {/* Patterns will be rendered here using the SNBTQuestionPatterns component logic */}
        <PatternsListView
          patterns={processedPatterns}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterLevel={filterLevel}
          setFilterLevel={setFilterLevel}
          filterType={filterType}
          setFilterType={setFilterType}
          expandedPatterns={expandedPatterns}
          setExpandedPatterns={setExpandedPatterns}
        />
      </div>

      {/* Level Detail Modal */}
      {showLevelModal && selectedLevel && (
        <LevelDetailModal
          subtest={selectedSubtest || 'tps_pu'}
          level={selectedLevel}
          onClose={() => setShowLevelModal(false)}
        />
      )}

      {/* Footer CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white text-center dash-fade-up d-delay-300 stat-card-hover">
          <h2 className="text-3xl font-bold mb-4">
            Siap untuk Berlatih?
          </h2>
          <p className="text-violet-100 mb-8 max-w-2xl mx-auto">
            Terapkan pemahamanmu tentang tipe dan pola soal SNBT dengan latihan intensif
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/practice')}
              className="px-8 py-4 bg-white text-violet-600 rounded-xl font-bold hover:shadow-xl transition-all duration-300 flex items-center gap-2 dash-fade-in"
              style={{ animationDelay: '400ms' }}
            >
              <Target className="w-5 h-5" />
              Mulai Latihan
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-violet-700/50 text-white rounded-xl font-bold hover:bg-violet-700 transition-all duration-300 flex items-center gap-2 dash-fade-in"
              style={{ animationDelay: '450ms' }}
            >
              <BookOpen className="w-5 h-5" />
              Ke Dashboard
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ── Entrance Animations ── */
        @keyframes dashFadeUp {
          0%   { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes dashFadeIn {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes dashSlideRight {
          0%   { opacity: 0; transform: translateX(-12px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes rowSlide {
          0%   { opacity: 0; transform: scaleY(0.95); }
          100% { opacity: 1; transform: scaleY(1); }
        }
        
        @keyframes dashFloatOrb {
          0%, 100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-6px) scale(1.03); }
        }
        
        /* ── Animation Classes ── */
        .dash-fade-up    { animation: dashFadeUp 0.45s cubic-bezier(.22,.68,0,1.2) both; }
        .dash-fade-in    { animation: dashFadeIn 0.4s ease both; }
        .dash-slide-r    { animation: dashSlideRight 0.4s ease both; }
        .dash-row-slide  { animation: rowSlide 0.35s ease both; }
        .dash-orb        { animation: dashFloatOrb 8s ease-in-out infinite; }
        
        /* ── Stagger Delays ── */
        .d-delay-0  { animation-delay: 0ms; }
        .d-delay-50 { animation-delay: 50ms; }
        .d-delay-80 { animation-delay: 80ms; }
        .d-delay-120 { animation-delay: 120ms; }
        .d-delay-160 { animation-delay: 160ms; }
        .d-delay-200 { animation-delay: 200ms; }
        .d-delay-250 { animation-delay: 250ms; }
        .d-delay-300 { animation-delay: 300ms; }
        
        /* ── Hover Effects ── */
        .stat-card-hover {
          transition: transform 0.25s cubic-bezier(.22,.68,0,1.2), 
                      box-shadow 0.25s ease, 
                      border-color 0.2s ease;
        }
        
        .stat-card-hover:hover {
          transform: translateY(-3px) scale(1.015);
          box-shadow: 0 12px 24px -8px rgba(79, 70, 229, 0.15);
          border-color: rgba(79, 70, 229, 0.3);
        }
        
        .dash-shadow-hover {
          transition: box-shadow 0.3s ease;
        }
        
        .dash-shadow-hover:hover {
          box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </div>
  );
};

// Patterns List View Component - Grouped by Subtest
const PatternsListView = ({
  patterns,
  searchQuery,
  setSearchQuery,
  filterLevel,
  setFilterLevel,
  filterType,
  setFilterType,
  expandedPatterns,
  setExpandedPatterns
}) => {
  const [showFilters, setShowFilters] = useState(false);
  // Default: all subtests and patterns are collapsed
  const [expandedSubtests, setExpandedSubtests] = useState({});

  // Group patterns by subtest
  const groupedPatterns = useMemo(() => {
    const grouped = {};
    
    for (const [subtestId, subtestPatterns] of Object.entries(patterns)) {
      let filtered = subtestPatterns.map(p => ({ ...p, subtestId }));
      
      // Apply filters
      if (filterLevel !== 'all') {
        filtered = filtered.filter(p => p.levels.includes(parseInt(filterLevel)));
      }
      
      if (filterType !== 'all') {
        filtered = filtered.filter(p => p.type === filterType);
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        );
      }
      
      if (filtered.length > 0) {
        grouped[subtestId] = filtered;
      }
    }
    
    return grouped;
  }, [patterns, filterLevel, filterType, searchQuery]);

  // Calculate total
  const totalPatterns = Object.values(groupedPatterns).reduce((sum, arr) => sum + arr.length, 0);

  const togglePattern = (patternId) => {
    setExpandedPatterns(prev => ({
      ...prev,
      [patternId]: !prev[patternId]
    }));
  };

  const toggleSubtest = (subtestId) => {
    setExpandedSubtests(prev => ({
      ...prev,
      [subtestId]: !(prev[subtestId] || false)
    }));
  };

  const getSubtestConfig = (subtestId) => SUBTEST_CONFIG[subtestId] || SUBTEST_CONFIG.tps_pu;
  const getTypeConfig = (typeId) => QUESTION_TYPES.find(t => t.id === typeId) || QUESTION_TYPES[0];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pola soal..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="ml-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Filter size={18} className="text-slate-600" />
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase">Level</label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm bg-white"
              >
                <option value="all">Semua Level</option>
                {LEVEL_CONFIG.filter(l => l.level > 0).map(level => (
                  <option key={level.level} value={level.level}>Level {level.level}: {level.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase">Tipe</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm bg-white"
              >
                <option value="all">Semua Tipe</option>
                {QUESTION_TYPES.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Menampilkan <span className="font-semibold text-violet-600">{totalPatterns}</span> dari <span className="font-semibold">{PATTERN_STATS.totalPatterns}</span> pola
        </p>
        {totalPatterns > 0 && (
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterLevel('all');
              setFilterType('all');
            }}
            className="text-xs text-slate-500 hover:text-violet-600 underline"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Grouped by Subtest */}
      {totalPatterns === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Search size={48} className="mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">Tidak ada pola ditemukan</h3>
          <p className="text-slate-600">Coba ubah filter atau kata kunci pencarian</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedPatterns).map(([subtestId, subtestPatterns]) => {
            const subtest = getSubtestConfig(subtestId);

            return (
              <div
                key={subtestId}
                className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden"
              >
                {/* Subtest Header */}
                <div
                  onClick={() => toggleSubtest(subtestId)}
                  className={`p-4 cursor-pointer transition-colors ${subtest.bgColor} hover:opacity-90`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-white ${subtest.textColor}`}>
                        {subtest.icon && <subtest.icon size={20} />}
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg ${subtest.textColor}`}>
                          {subtest.name}
                        </h3>
                        <p className="text-xs text-slate-600">
                          {subtestPatterns.length} pola • {subtest.timeAllocation}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full bg-white ${subtest.textColor}`}>
                        {subtest.code}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-600 transition-transform ${
                          expandedSubtests[subtestId] ? '' : '-rotate-90'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Patterns List - Show only if expanded */}
                {expandedSubtests[subtestId] && (
                  <div className="p-4 space-y-3">
                    {subtestPatterns.map((pattern) => {
                      const type = getTypeConfig(pattern.type);
                      const isExpanded = expandedPatterns[pattern.id];

                      return (
                        <div
                          key={pattern.id}
                          className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all"
                        >
                          <div
                            onClick={() => togglePattern(pattern.id)}
                            className="p-4 cursor-pointer"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${subtest.bgColor} ${subtest.textColor}`}>
                                    {subtest.code}
                                  </span>
                                  <span className={`text-xs font-medium px-2 py-1 rounded ${type.bgColor} ${type.textColor}`}>
                                    {type.code}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    {pattern.name}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-700 font-medium">
                                  {pattern.description}
                                </p>
                              </div>
                              <ChevronDown
                                className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${
                                  isExpanded ? 'rotate-180' : ''
                                }`}
                              />
                            </div>
                            <div className="flex items-center gap-2 mt-3 flex-wrap">
                              {pattern.levels.map(level => (
                                <span
                                  key={level}
                                  className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-medium"
                                >
                                  L{level}
                                </span>
                              ))}
                              {pattern.type && (
                                <span className="text-xs text-slate-500">
                                  • {type.name}
                                </span>
                              )}
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="px-4 pb-4 border-t border-slate-200 bg-slate-50">
                              <div className="mt-4 space-y-3">
                                <div className="bg-white p-4 rounded-lg border border-slate-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Lightbulb size={16} className="text-amber-500" />
                                    <p className="text-xs font-semibold text-slate-700">
                                      Contoh Pola:
                                    </p>
                                  </div>
                                  <p className="text-sm text-slate-700 font-medium mb-2">
                                    {pattern.displayExample?.text || 
                                     (pattern.displayTemplate?.text && typeof pattern.displayTemplate.text === 'string' 
                                       ? pattern.displayTemplate.text 
                                       : 'Contoh pertanyaan')}
                                  </p>
                                  {pattern.displayExample?.stimulus && typeof pattern.displayExample.stimulus === 'string' && (
                                    <p className="text-xs text-slate-500 italic">
                                      Stimulus: {pattern.displayExample.stimulus}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                  <Brain size={14} />
                                  <span>Konsep: {pattern.description}</span>
                                </div>
                                {pattern.contextVariations && pattern.contextVariations.length > 0 && (
                                  <div className="flex items-start gap-2 text-xs">
                                    <Target size={14} className="text-indigo-500 mt-0.5" />
                                    <div className="flex-1">
                                      <p className="text-slate-600 mb-1">Konteks yang sering muncul:</p>
                                      <div className="flex flex-wrap gap-1">
                                        {pattern.contextVariations.map((ctx, i) => (
                                          <span
                                            key={i}
                                            className={`px-2 py-1 rounded bg-white border border-slate-200 ${subtest.textColor}`}
                                          >
                                            {typeof ctx === 'string' ? ctx.replace(/_/g, ' ') : ctx}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SNBTQuestionTypes;
