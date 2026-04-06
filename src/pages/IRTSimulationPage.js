import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart2, Target, Zap, Shield, Sword, ChevronRight,
  ChevronLeft, Info, CheckCircle2, AlertTriangle, TrendingUp,
  Users, GraduationCap, BookOpen, Brain, Star, ArrowRight,
  RotateCcw, Share2, Download, Sparkles, Trophy, Activity,
  Play
} from 'lucide-react';
import { UnifiedNavbar } from '../components/layout/UnifiedNavbar';
import { useTokenBalance } from '../hooks/useTokenBalance';
import SNBTExamPage from './SNBTExamPage';

// ─── Data & Config ────────────────────────────────────────────────────────────

const POPULATION_SCALES = [
  { id: 'small', label: '100.000 Peserta', desc: 'Skala kompetisi kecil (simulasi regional)', multiplier: 0.9 },
  { id: 'medium', label: '300.000 Peserta', desc: 'Skala SNBT rata-rata nasional', multiplier: 1.0 },
  { id: 'large', label: '500.000 Peserta', desc: 'Skala kompetisi penuh nasional', multiplier: 1.15 },
];

const SUBTESTS_CONFIG = [
  { id: 'tps_pu',  label: 'TPS - Penalaran Umum',              abbr: 'PU',  total: 20, weightMin: 100, weightMax: 200 },
  { id: 'tps_ppu', label: 'TPS - Penget. & Pemahaman Umum',    abbr: 'PPU', total: 20, weightMin: 80,  weightMax: 180 },
  { id: 'tps_pbm', label: 'TPS - Pemahaman Bacaan & Menulis',  abbr: 'PBM', total: 20, weightMin: 90,  weightMax: 190 },
  { id: 'tps_pk',  label: 'TPS - Pengetahuan Kuantitatif',     abbr: 'PK',  total: 15, weightMin: 100, weightMax: 200 },
  { id: 'lit_ind', label: 'Literasi Bahasa Indonesia',          abbr: 'LIT', total: 30, weightMin: 80,  weightMax: 160 },
  { id: 'lit_ing', label: 'Literasi Bahasa Inggris',            abbr: 'ENG', total: 20, weightMin: 70,  weightMax: 150 },
  { id: 'pm',      label: 'Penalaran Matematika',               abbr: 'PM',  total: 20, weightMin: 100, weightMax: 200 },
];

const TOP_PTN_LIST = [
  { id: 'ui',     name: 'Universitas Indonesia',        city: 'Jakarta' },
  { id: 'itb',    name: 'Institut Teknologi Bandung',   city: 'Bandung' },
  { id: 'ugm',    name: 'Universitas Gadjah Mada',      city: 'Yogyakarta' },
  { id: 'its',    name: 'Institut Teknologi Sepuluh N.',city: 'Surabaya' },
  { id: 'unpad',  name: 'Universitas Padjadjaran',      city: 'Bandung' },
  { id: 'undip',  name: 'Universitas Diponegoro',       city: 'Semarang' },
  { id: 'unair',  name: 'Universitas Airlangga',        city: 'Surabaya' },
  { id: 'ipb',    name: 'Institut Pertanian Bogor',     city: 'Bogor' },
  { id: 'unib',   name: 'Universitas Brawijaya',        city: 'Malang' },
  { id: 'uns',    name: 'Universitas Sebelas Maret',    city: 'Solo' },
];

// Safe score reference per PTN (dummy probabilistic data)
const PTN_SAFE_SCORES = {
  ui: 720, itb: 730, ugm: 710, its: 700, unpad: 680,
  undip: 670, unair: 685, ipb: 665, unib: 660, uns: 655,
};

// Role icons & colors
const ROLES = {
  'Main Carry':      { icon: Sword,    color: 'text-amber-600',  bg: 'bg-amber-50',   border: 'border-amber-200',  desc: 'Subtes andalan — maksimalkan skor di sini!' },
  'Secondary Carry': { icon: TrendingUp,color: 'text-blue-600', bg: 'bg-blue-50',    border: 'border-blue-200',    desc: 'Pendukung kuat — pertahankan performa ini.' },
  'Stabilizer':      { icon: Shield,   color: 'text-emerald-600',bg: 'bg-emerald-50', border: 'border-emerald-200', desc: 'Area aman — jaga, jangan blunder.' },
  'Damage Control':  { icon: Target,   color: 'text-rose-600',   bg: 'bg-rose-50',    border: 'border-rose-200',    desc: 'Subtes lemah — pilih soal mudah, skip soal sulit.' },
};

// ─── Helper: Compute IRT Simulation ─────────────────────────────────────────

function computeSimulation({ baselineScores, populationScale, targetPtn }) {
  const safeScore = targetPtn ? (PTN_SAFE_SCORES[targetPtn] || 680) : 680;
  const multiplier = populationScale?.multiplier || 1.0;
  const adjustedSafe = Math.round(safeScore * multiplier);

  // Distribute required score across subtests proportionally
  const totalWeight = SUBTESTS_CONFIG.reduce((s, st) => s + ((st.weightMin + st.weightMax) / 2), 0);
  
  const matrix = SUBTESTS_CONFIG.map((st) => {
    const userRaw = baselineScores[st.id] || 50;
    const pctCorrect = userRaw / 100;
    const userCorrect = Math.round(pctCorrect * st.total);
    
    const avgWeight = (st.weightMin + st.weightMax) / 2;
    const requiredPct = adjustedSafe / 800; // simplified
    const targetCorrect = Math.max(1, Math.min(st.total, Math.round(requiredPct * st.total * 1.1)));
    const jatahSalah = st.total - targetCorrect;

    // IRT score for this subtest (200-800 scale)
    const irtScore = Math.round(200 + (userCorrect / st.total) * 600);

    return {
      ...st,
      userCorrect,
      userPct: Math.round(pctCorrect * 100),
      targetCorrect,
      jatahSalah,
      irtScore,
      gap: userCorrect - targetCorrect,
    };
  });

  // Assign roles based on gap and userPct
  const sorted = [...matrix].sort((a, b) => (b.userPct - b.weightMin / 2) - (a.userPct - a.weightMin / 2));
  matrix.forEach((st) => {
    const rank = sorted.findIndex(s => s.id === st.id);
    if (rank === 0) st.role = 'Main Carry';
    else if (rank <= 2 && st.userPct >= 60) st.role = 'Secondary Carry';
    else if (st.userPct >= 45) st.role = 'Stabilizer';
    else st.role = 'Damage Control';
  });

  // IRT Logic Breakdown: find key questions (very easy or very hard simulated)
  const breakdowns = matrix.map((st) => {
    const popCorrectRate = 40 + Math.random() * 40; // dummy 40-80%
    const isHardQuestion = popCorrectRate < 50;
    const diff = Math.abs(st.userPct - popCorrectRate);
    return {
      subtest: st.abbr,
      subtestFull: st.label,
      soalNo: Math.floor(Math.random() * st.total) + 1,
      popCorrectRate: Math.round(popCorrectRate),
      userGotRight: st.userPct > popCorrectRate,
      isHard: isHardQuestion,
      scoreDelta: Math.round(diff * 2),
    };
  }).filter(b => b.scoreDelta > 15).slice(0, 4);

  const totalIRT = Math.round(matrix.reduce((sum, st) => sum + st.irtScore, 0) / matrix.length);
  const percentile = Math.min(99, Math.max(1, Math.round(((totalIRT - 200) / 600) * 85 + 10)));

  return { matrix, breakdowns, totalIRT, adjustedSafe, percentile };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const StepIndicator = ({ step }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {[1, 2, 3, 4].map((s) => (
      <React.Fragment key={s}>
        <div className={`flex items-center gap-2 ${step >= s ? 'opacity-100' : 'opacity-40'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            step > s ? 'bg-violet-600 text-white' : step === s ? 'bg-violet-600 text-white ring-4 ring-violet-100' : 'bg-gray-200 text-gray-500'
          }`}>
            {step > s ? <CheckCircle2 size={14} /> : s}
          </div>
          <span className={`text-xs font-semibold hidden sm:block ${step >= s ? 'text-violet-700' : 'text-gray-400'}`}>
            {s === 1 ? 'Konfigurasi' : s === 2 ? 'Metode Input' : s === 3 ? 'Input Data' : 'Hasil Analisis'}
          </span>
        </div>
        {s < 4 && <div className={`flex-1 h-0.5 max-w-12 rounded-full ${step > s ? 'bg-violet-400' : 'bg-gray-200'}`} />}
      </React.Fragment>
    ))}
  </div>
);

// Step 1: Konfigurasi
const Step1Config = ({ config, setConfig, onNext }) => {
  const isValid = config.populationScale && config.targetPtn;
  return (
    <div className="space-y-6 animate-fadeSlideUp">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Pilih Skala Populasi</h2>
        <p className="text-xs text-gray-500 mb-3">Seberapa besar kompetisi yang ingin kamu simulasikan?</p>
        <div className="grid gap-3">
          {POPULATION_SCALES.map(scale => (
            <button
              key={scale.id}
              onClick={() => setConfig(c => ({ ...c, populationScale: scale }))}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                config.populationScale?.id === scale.id
                  ? 'border-violet-500 bg-violet-50'
                  : 'border-gray-200 bg-white hover:border-violet-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-gray-900">{scale.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{scale.desc}</div>
                </div>
                {config.populationScale?.id === scale.id && (
                  <CheckCircle2 size={18} className="text-violet-600 flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Pilih PTN Target</h2>
        <p className="text-xs text-gray-500 mb-3">Maksimal 1 pilihan untuk simulasi ini</p>
        <div className="grid grid-cols-2 gap-2">
          {TOP_PTN_LIST.map(ptn => (
            <button
              key={ptn.id}
              onClick={() => setConfig(c => ({ ...c, targetPtn: ptn.id }))}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                config.targetPtn === ptn.id
                  ? 'border-violet-500 bg-violet-50'
                  : 'border-gray-100 bg-white hover:border-violet-200'
              }`}
            >
              <div className="text-xs font-bold text-gray-900 truncate">{ptn.name}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{ptn.city}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!isValid}
        className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
          isValid ? 'bg-violet-600 text-white hover:bg-violet-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        Lanjut ke Input Skor TO <ChevronRight size={16} />
      </button>
    </div>
  );
};

// Step 2: Pilih Metode Input
const Step2Method = ({ onNext, onBack, onTakeExam, onManualInput }) => {
  const [selectedMethod, setSelectedMethod] = useState('');

  return (
    <div className="space-y-5 animate-fadeSlideUp">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Pilih Metode Input Skor</h2>
        <p className="text-xs text-gray-500">Pilih cara untuk menginput data ke simulasi IRT.</p>
      </div>

      {/* Method Selection */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setSelectedMethod('manual')}
          className={`p-4 rounded-xl border-2 text-left transition-all ${
            selectedMethod === 'manual'
              ? 'border-violet-500 bg-violet-50'
              : 'border-gray-200 bg-white hover:border-violet-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <Target size={18} className="text-violet-600" />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900">Input Manual</div>
              <div className="text-xs text-gray-500">Masukkan skor TO terakhir</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => setSelectedMethod('exam')}
          className={`p-4 rounded-xl border-2 text-left transition-all ${
            selectedMethod === 'exam'
              ? 'border-violet-500 bg-violet-50'
              : 'border-gray-200 bg-white hover:border-violet-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Brain size={18} className="text-emerald-600" />
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900">Kerjakan Ujian</div>
              <div className="text-xs text-gray-500">Simulasi SNBT nyata</div>
            </div>
          </div>
        </button>
      </div>

      {selectedMethod && (
        <div className="space-y-4">
          {selectedMethod === 'manual' ? (
            <div className="p-4 bg-violet-50 border border-violet-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Target size={20} className="text-violet-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-violet-800 mb-1">Input Manual</h3>
                  <p className="text-sm text-violet-700 leading-relaxed">
                    Masukkan skor try out terakhir kamu secara manual untuk setiap subtes.
                    Data ini akan menjadi dasar untuk simulasi IRT.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Brain size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-emerald-800 mb-1">Ujian Simulasi SNBT</h3>
                  <p className="text-sm text-emerald-700 leading-relaxed">
                    Kerjakan 7 subtes ujian SNBT dengan soal dummy berdasarkan aturan resmi SNPMB. 
                    Hasil jawabanmu akan otomatis menjadi input untuk simulasi IRT.
                  </p>
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-emerald-600">
                      <CheckCircle2 size={12} />
                      <span>125 soal total (sesuai SNPMB)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald-600">
                      <CheckCircle2 size={12} />
                      <span>Timer per subtes</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald-600">
                      <CheckCircle2 size={12} />
                      <span>Hasil otomatis ke IRT simulation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={onBack} className="flex items-center gap-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all">
              <ChevronLeft size={16} /> Kembali
            </button>
            <button
              onClick={() => selectedMethod === 'exam' ? onTakeExam() : onManualInput()}
              className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg"
            >
              {selectedMethod === 'exam' ? (
                <>
                  <Play size={16} /> Mulai Ujian Simulasi
                </>
              ) : (
                <>
                  <Target size={16} /> Input Skor Manual
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Step 3: Input TO Scores Manual
const Step3Scores = ({ scores, setScores, onNext, onBack }) => {
  const allFilled = SUBTESTS_CONFIG.every(st => scores[st.id] !== undefined && scores[st.id] !== '');

  return (
    <div className="space-y-5 animate-fadeSlideUp">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Masukkan Skor Try Out Terakhir</h2>
        <p className="text-xs text-gray-500">Masukkan persentase benar per subtes (0–100) dari TO terakhirmu.</p>
      </div>

      <div className="space-y-3">
        {SUBTESTS_CONFIG.map(st => (
          <div key={st.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-black text-violet-700">{st.abbr}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-800 truncate">{st.label}</div>
              <div className="text-[10px] text-gray-400">{st.total} soal</div>
            </div>
            <div className="relative flex-shrink-0">
              <input
                type="number"
                min="0" max="100"
                placeholder="0-100"
                value={scores[st.id] ?? ''}
                onChange={e => {
                  const v = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                  setScores(s => ({ ...s, [st.id]: v }));
                }}
                className="w-20 text-center py-2 px-2 rounded-lg border border-gray-200 focus:border-violet-400 focus:outline-none text-sm font-bold bg-white"
              />
              <span className="text-[10px] text-gray-400 absolute -bottom-3.5 left-0 right-0 text-center">% benar</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="flex items-center gap-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all">
          <ChevronLeft size={16} /> Kembali
        </button>
        <button
          onClick={onNext}
          disabled={!allFilled}
          className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            allFilled ? 'bg-violet-600 text-white hover:bg-violet-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Sparkles size={16} /> Generate Analisis IRT
        </button>
      </div>
    </div>
  );
};

// Step 4: Results
const Step4Results = ({ result, config, onReset }) => {
  const { matrix, breakdowns, totalIRT, adjustedSafe, percentile } = result;
  const selectedPtn = TOP_PTN_LIST.find(p => p.id === config.targetPtn);
  const isPass = totalIRT >= adjustedSafe;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Hasil Simulasi IRT SNBT AI',
        text: `Skor IRT simulasiku: ${totalIRT}/800 (Percentile ${percentile}%). Target ${selectedPtn?.name}: ${adjustedSafe}. Cek strategimu di SNBT AI!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `Skor IRT simulasiku: ${totalIRT}/800 (Percentile ${percentile}%). Cek SNBT AI untuk simulasi lengkap!`
      );
    }
  };

  return (
    <div className="space-y-6 animate-fadeSlideUp">
      {/* Score Summary Card */}
      <div className={`relative rounded-2xl p-5 overflow-hidden ${isPass ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-violet-600 to-indigo-700'}`}>
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-1">Simulasi Skor IRT</div>
          <div className="text-5xl font-black text-white mb-1">{totalIRT}</div>
          <div className="text-white/80 text-sm">dari 800 poin</div>
          <div className="flex items-center gap-3 mt-3">
            <div className="bg-white/20 rounded-lg px-3 py-1.5">
              <div className="text-white text-xs font-semibold">Percentile</div>
              <div className="text-white font-black text-lg">{percentile}%</div>
            </div>
            <div className="bg-white/20 rounded-lg px-3 py-1.5">
              <div className="text-white text-xs font-semibold">Target {selectedPtn?.name?.split(' ')[1]}</div>
              <div className="text-white font-black text-lg">{adjustedSafe}</div>
            </div>
            <div className={`bg-white/20 rounded-lg px-3 py-1.5 ${isPass ? 'bg-white/30' : ''}`}>
              <div className="text-white text-xs font-semibold">Status</div>
              <div className="text-white font-black text-sm">{isPass ? '✅ AMAN' : '⚠️ PERLU NAIK'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Matrix Target IRT */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
          <BarChart2 size={16} className="text-violet-600" /> Matrix Target IRT
        </h3>
        <p className="text-xs text-gray-500 mb-3">Target spesifik per subtes untuk mengamankan kursi di {selectedPtn?.name}.</p>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-xs min-w-[480px]">
            <thead>
              <tr className="bg-violet-50 border-b border-violet-100">
                <th className="text-left p-3 font-bold text-violet-800">Subtes</th>
                <th className="text-center p-3 font-bold text-violet-800">Total</th>
                <th className="text-center p-3 font-bold text-violet-800">Kamu Benar</th>
                <th className="text-center p-3 font-bold text-violet-800">Target Benar</th>
                <th className="text-center p-3 font-bold text-violet-800">Jatah S/K</th>
                <th className="text-center p-3 font-bold text-violet-800">Skor IRT</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((st, i) => (
                <tr key={st.id} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="p-3">
                    <div className="font-semibold text-gray-800">{st.abbr}</div>
                    <div className="text-gray-400 text-[10px] truncate max-w-[120px]">{st.label}</div>
                  </td>
                  <td className="text-center p-3 text-gray-600 font-semibold">{st.total}</td>
                  <td className="text-center p-3">
                    <span className={`font-bold ${st.userCorrect >= st.targetCorrect ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {st.userCorrect}
                    </span>
                  </td>
                  <td className="text-center p-3 font-bold text-violet-700">{st.targetCorrect}</td>
                  <td className="text-center p-3 text-amber-600 font-semibold">{st.jatahSalah}</td>
                  <td className="text-center p-3">
                    <span className={`px-2 py-0.5 rounded-full font-bold ${
                      st.irtScore >= 600 ? 'bg-emerald-100 text-emerald-700' :
                      st.irtScore >= 450 ? 'bg-blue-100 text-blue-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>{st.irtScore}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Assignment */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Trophy size={16} className="text-amber-500" /> Peran Subtes di Sistem (Role Strategy)
        </h3>
        <p className="text-xs text-gray-500 mb-3">Klasifikasi strategis berdasarkan kekuatan relatifmu.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {matrix.map(st => {
            const role = ROLES[st.role] || ROLES['Stabilizer'];
            const Icon = role.icon;
            return (
              <div key={st.id} className={`p-4 rounded-xl border-2 ${role.bg} ${role.border}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <Icon size={16} className={role.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-gray-800">{st.abbr}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/70 ${role.color}`}>{st.role}</span>
                    </div>
                    <p className="text-[10px] text-gray-600 mt-1 leading-relaxed">{role.desc}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/60 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-violet-400" style={{ width: `${st.userPct}%` }} />
                      </div>
                      <span className={`text-xs font-bold ${role.color}`}>{st.userPct}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* IRT Logic Breakdown */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Brain size={16} className="text-indigo-600" /> IRT Logic Breakdown
        </h3>
        <p className="text-xs text-gray-500 mb-3">Soal-soal kunci yang paling berdampak pada fluktuasi skormu.</p>
        <div className="space-y-2.5">
          {breakdowns.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-sm">Tidak ada soal kunci signifikan terdeteksi.</div>
          ) : breakdowns.map((b, i) => (
            <div key={i} className={`p-4 rounded-xl border ${b.userGotRight ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${b.userGotRight ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'}`}>
                  {b.userGotRight ? '↑' : '↓'}
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-800">
                    Soal No. {b.soalNo} — {b.subtest}
                  </div>
                  <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                    {b.userGotRight
                      ? `Skor ${b.subtest} kamu naik karena kamu benar di soal ini, sementara hanya ${b.popCorrectRate}% populasi simulasi yang menjawab benar. Pembobotan maksimal (+${b.scoreDelta} poin).`
                      : `Skor ${b.subtest} kamu turun karena kamu salah di soal ini. ${b.popCorrectRate}% populasi menjawab benar — ini soal dengan dampak besar (-${b.scoreDelta} poin estimasi).`
                    }
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
        <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-800 leading-relaxed">
          <strong>Catatan Penting:</strong> Matrix ini adalah simulasi strategis berbasis data probabilitas historis. Dirancang untuk memandu fokus dan strategi belajarmu, bukan jaminan mutlak kelulusan seleksi resmi.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button onClick={onReset} className="flex items-center gap-2 px-4 py-3 border-2 border-violet-200 text-violet-700 rounded-xl text-sm font-semibold hover:bg-violet-50 transition-all">
          <RotateCcw size={15} /> Ulangi
        </button>
        <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all">
          <Share2 size={15} /> Bagikan Hasil
        </button>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

const IRTSimulationPage = ({ user, onLogin, onLogout, navigate, setView }) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({ populationScale: null, targetPtn: null });
  const [scores, setScores] = useState({});
  const [result, setResult] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showExam, setShowExam] = useState(false);
  const tokenBalance = useTokenBalance();

  const handleGenerateResult = useCallback(() => {
    const computed = computeSimulation({
      baselineScores: scores,
      populationScale: config.populationScale,
      targetPtn: config.targetPtn,
    });
    setResult(computed);
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [scores, config]);

  const handleTakeExam = useCallback(() => {
    setShowExam(true);
  }, []);

  const handleManualInput = useCallback(() => {
    setStep(3);
  }, []);

  const handleExamComplete = useCallback((examData) => {
    // Convert exam results to scores format
    const examScores = examData.subtestScores;
    setScores(examScores);
    setShowExam(false);
    
    // Auto-generate IRT results after exam
    const computed = computeSimulation({
      baselineScores: examScores,
      populationScale: config.populationScale,
      targetPtn: config.targetPtn,
    });
    setResult(computed);
    setStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [config]);

  const handleReset = () => {
    setStep(1);
    setConfig({ populationScale: null, targetPtn: null });
    setScores({});
    setResult(null);
    setShowExam(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If showing exam, render exam page
  if (showExam) {
    return (
      <SNBTExamPage
        user={user}
        onLogin={onLogin}
        onLogout={onLogout}
        navigate={navigate}
        setView={setView}
        onExamComplete={handleExamComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F8] relative">
      {/* Background Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="irt-orb absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-400/10 rounded-full blur-[120px]" />
        <div className="irt-orb-2 absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-400/10 rounded-full blur-[120px]" />
      </div>

      <style>{`
        @keyframes irtOrb { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(10px,-14px) scale(1.05)} }
        .irt-orb { animation: irtOrb 9s ease-in-out infinite; }
        .irt-orb-2 { animation: irtOrb 12s ease-in-out infinite reverse; }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .animate-fadeSlideUp { animation: fadeSlideUp 0.4s cubic-bezier(.22,.68,0,1.2) both; }
      `}</style>

      <UnifiedNavbar
        user={user}
        onLogin={onLogin}
        onLogout={onLogout}
        navigate={navigate}
        setView={setView}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        onBuyCoin={() => { setView?.('AMBIS_COIN_PRICING'); navigate?.('/dashboard/ambis-coin'); }}
        coinBalance={tokenBalance}
      />

      <main className="relative z-10 pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Hero Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white border border-violet-200 rounded-full px-4 py-1.5 mb-4 shadow-sm">
              <BarChart2 size={14} className="text-violet-600" />
              <span className="text-xs font-bold text-violet-700 uppercase tracking-wider">Fitur Eksklusif</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              Simulasi SNBT Score &{' '}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">IRT Matrix</span>
            </h1>
            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
              Bedah cara kerja pembobotan IRT, dapatkan target strategis per subtes, dan ubah cara kamu bermain di SNBT.
            </p>
          </div>

          {/* Card Container */}
          <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-gray-100 p-6">
            <StepIndicator step={step} />

            {step === 1 && (
              <Step1Config config={config} setConfig={setConfig} onNext={() => setStep(2)} />
            )}
            {step === 2 && (
              <Step2Method 
                onNext={() => {}}
                onBack={() => setStep(1)}
                onTakeExam={handleTakeExam}
                onManualInput={handleManualInput}
              />
            )}
            {step === 3 && (
              <Step3Scores 
                scores={scores} 
                setScores={setScores} 
                onNext={handleGenerateResult} 
                onBack={() => setStep(2)}
              />
            )}
            {step === 4 && result && (
              <Step4Results result={result} config={config} onReset={handleReset} />
            )}
          </div>

          {/* Feature Info Cards */}
          {step === 1 && (
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { icon: Target, title: 'Matrix Target', desc: 'Kuota benar per subtes' },
                { icon: Zap,    title: 'Role Strategy', desc: 'Carry, Stabilizer, Control' },
                { icon: Brain,  title: 'IRT Breakdown', desc: 'Logika fluktuasi skor' },
              ].map((f, i) => (
                <div key={i} className="bg-white rounded-xl p-3.5 border border-gray-100 text-center shadow-sm">
                  <f.icon size={18} className="text-violet-600 mx-auto mb-1.5" />
                  <div className="text-xs font-bold text-gray-800">{f.title}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{f.desc}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default IRTSimulationPage;
