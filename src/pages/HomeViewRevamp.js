import React, { useState, useEffect } from 'react';
import { LogIn, Sparkles, ChevronRight, Wallet, TrendingUp, Activity, Users, BookOpen, Eye, Gamepad2, FileText, Heart, Zap, Clock, CheckCircle2 } from 'lucide-react';
import { SUBTESTS } from '../constants/subtestHelper';
import { TemplateInfo } from '../components/common/TemplateInfo';
import { UnifiedNavbar } from '../components/layout/UnifiedNavbar';
import { useTokenBalance } from '../hooks/useTokenBalance';

const SUBTEST_CONFIG = {
  'tps_pu': { icon: Activity, color: '#8B5CF6' },
  'tps_ppu': { icon: BookOpen, color: '#3B82F6' },
  'tps_pbm': { icon: BookOpen, color: '#06B6D4' },
  'tps_pk': { icon: Activity, color: '#F59E0B' },
  'lit_ind': { icon: BookOpen, color: '#EF4444' },
  'lit_ing': { icon: BookOpen, color: '#14B8A6' },
  'pm': { icon: Activity, color: '#6366F1' }
};

const COMPLEXITY_LEVELS = [
  { level: 0, label: 'Adaptive', color: 'purple' },
  { level: 1, label: 'Dasar', color: 'green' },
  { level: 2, label: 'Sederhana', color: 'lime' },
  { level: 3, label: 'Menengah', color: 'amber' },
  { level: 4, label: 'Sulit', color: 'orange' },
  { level: 5, label: 'Pakar', color: 'rose' },
];

const HomeViewRevamp = ({
  formData,
  setFormData,
  handleStart,
  errorMsg,
  mode,
  setMode,
  apiKey,
  modelType,
  setModelType,
  user,
  onLogin,
  onLogout,
  usageData,
  setView,
  setShowLoginModal,
  isDeveloperMode = false,
  totalQuestionsInBank = 0,
  isAdmin = false,
  navigate,
  dailyLimit = 19,
  dailyUsage = 0,
  totalLimit = 19,
  coinBalance = 0,
  onBuyCoin,
  publicQuestions = [],
  attempts = []
}) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const tokenBalance = useTokenBalance();
  const totalLimitWithToken = totalLimit + tokenBalance;
  const isLimitReached = isDeveloperMode ? false : dailyUsage >= totalLimitWithToken;
  const canGenerate = !isLimitReached && formData.context.length >= 20;
  const remainingQuota = Math.max(0, totalLimitWithToken - dailyUsage);
  const showBankSoalButton = user && dailyUsage >= totalLimitWithToken && tokenBalance === 0;

  return (
    <div className="min-h-screen bg-[#F3F4F8] relative" style={{ scrollbarGutter: 'stable' }}>
      {/* Background floating orbs - reduced opacity for desktop */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="lp-orb   absolute top-[-10%] left-[-10%]  w-[40%] h-[40%] bg-violet-400/10 rounded-full blur-[120px]" />
        <div className="lp-orb-2 absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-400/10 rounded-full blur-[120px]" />
        <div className="lp-orb-3 absolute top-[40%] right-[10%]   w-[25%] h-[25%] bg-purple-300/8  rounded-full blur-[100px]" />
      </div>
      <style>{`
        .custom-border { border: 1px solid rgba(0, 0, 0, 0.06); }
        .active-card { background-color: #7C3AED !important; color: white !important; }
        .active-card svg { color: white !important; }

        /* ── Desktop-First Container ── */
        .desktop-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 16px;
        }
        @media (min-width: 1366px) {
          .desktop-container {
            padding: 20px 24px;
          }
        }

        /* ── Premium Soft UI Shadow System (Compact) ── */
        .shadow-card {
          box-shadow: 0 1px 3px rgba(124, 58, 237, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
        }
        .shadow-card-hover {
          box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 6px 16px rgba(99,102,241,0.08), 0 12px 32px rgba(99,102,241,0.06);
        }
        .shadow-btn-glow {
          box-shadow: 0 0 0 0 rgba(124, 58, 237, 0);
          transition: box-shadow 0.25s ease;
        }
        .shadow-btn-glow:hover {
          box-shadow: 0 0 16px 3px rgba(124, 58, 237, 0.15);
        }
        .shadow-btn-glow:active {
          transform: scale(0.98);
          box-shadow: 0 0 10px 2px rgba(124, 58, 237, 0.1);
        }

        /* ── Premium Form Input States (Compact) ── */
        .input-premium {
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          transition: all 0.2s ease;
          font-size: 13px;
        }
        .input-premium:hover {
          border-color: #CBD5E1;
        }
        .input-premium:focus {
          background-color: #FFFFFF;
          border-color: #A855F7;
          outline: none;
          box-shadow: 0 2px 8px -1px rgba(168, 85, 247, 0.12);
        }
        .input-premium:focus-within {
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.08);
        }

        /* ── Premium Subtest Card States (Compact) ── */
        .subtest-card {
          border: 1px solid #E2E8F0;
          background-color: #FFFFFF;
          transition: all 0.18s ease;
        }
        .subtest-card:hover {
          border-color: #A855F7;
          box-shadow: 0 3px 10px -2px rgba(168, 85, 247, 0.1);
          transform: translateY(-1px);
        }
        .subtest-card.active-card {
          border-color: #A855F7;
          background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%);
          box-shadow: 0 6px 16px -4px rgba(124, 58, 237, 0.3);
        }
        .subtest-card.active-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px -4px rgba(124, 58, 237, 0.35);
        }

        /* ── Compact Mode Card States ── */
        .mode-card {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .mode-card:hover {
          transform: translateY(-1px);
        }
        .mode-card.game-active {
          box-shadow: 0 4px 14px rgba(244, 63, 94, 0.18);
        }
        .mode-card.exam-active {
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.18);
        }

        /* ── Entrance Animations (Faster) ── */
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideRight {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes lpFloatOrb {
          0%, 100% { transform: translate(0,0) scale(1); }
          50%       { transform: translate(8px,-10px) scale(1.04); }
        }

        .anim-fade-up    { animation: fadeSlideUp 0.4s cubic-bezier(.22,.68,0,1.2) both; }
        .anim-fade-right { animation: fadeSlideRight 0.35s cubic-bezier(.22,.68,0,1.2) both; }
        .anim-fade-in    { animation: fadeIn 0.3s ease both; }
        .lp-orb        { animation: lpFloatOrb 8s ease-in-out infinite; }
        .lp-orb-2      { animation: lpFloatOrb 10s ease-in-out infinite reverse; }
        .lp-orb-3      { animation: lpFloatOrb 6s ease-in-out infinite; animation-delay: 2s; }

        .delay-0   { animation-delay: 0ms; }
        .delay-50  { animation-delay: 50ms; }
        .delay-100 { animation-delay: 100ms; }
        .delay-150 { animation-delay: 150ms; }
        .delay-200 { animation-delay: 200ms; }

        /* ── Range Slider (Compact) ── */
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          background: #7C3AED;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(124,58,237,0.3);
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }
        input[type='range']::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 2px 8px rgba(124,58,237,0.4);
        }
        input[type='range']::-webkit-slider-track {
          height: 5px;
          border-radius: 9999px;
          background: #E2E8F0;
        }

        /* ── Responsive Breakpoints ── */
        @media (max-width: 1024px) {
          .desktop-container {
            padding: 16px;
          }
          .lg\\:col-span-7, .lg\\:col-span-5 {
            grid-column: span 1 !important;
          }
        }
        @media (max-width: 768px) {
          .desktop-container {
            padding: 12px;
          }
        }
        @media (max-width: 375px) {
          .desktop-container {
            padding: 10px;
          }
        }
      `}</style>

      {/* UnifiedNavbar */}
      <UnifiedNavbar
        user={user}
        onLogin={onLogin}
        onLogout={onLogout}
        navigate={navigate}
        setView={setView}
        dailyUsage={dailyUsage}
        totalQuestionsInBank={totalQuestionsInBank}
        remainingQuota={remainingQuota}
        isAdmin={isAdmin}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        variant="default"
        onBuyCoin={onBuyCoin}
        coinBalance={tokenBalance}
      />

      <main className="relative z-10 pt-24 md:pt-28 pb-32 md:pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto md:py-8 flex flex-col lg:flex-row gap-6">

          {/* KOLOM KIRI (Area Input Utama) - Full width on mobile, 60% on desktop (7:5 ratio) */}
          <div className="flex-1 lg:w-[60%]">
            <div className="bg-white rounded-2xl p-5 md:p-8 shadow-card flex flex-col anim-fade-up delay-100 min-h-[700px]">

                <div className="mb-6 anim-fade-right delay-150">
                  <h1 className="text-xl font-bold text-gray-900 mb-1">Buat Soal SNBT</h1>
                  <p className="text-sm text-gray-400">Buat soal latihan SNBT dengan cepat untuk membantu kamu belajar lebih efektif.</p>
                </div>

                <div className="space-y-6 flex-1 flex flex-col">
                  {/* Konteks Soares - Textarea lebih tinggi dan fleksibel */}
                  <div className="flex-1 flex flex-col">
                    <label className="block text-sm font-semibold mb-3">Konteks Soares</label>
                    <div className="relative flex-1">
                      <textarea
                        id="konteks-soal"
                        name="konteks"
                        autoComplete="off"
                        className="input-premium w-full h-full min-h-[220px] p-4 rounded-xl outline-none resize-none text-sm placeholder:text-gray-400"
                        placeholder="Masukkan konteks soal yang ingin dibuat. Contoh:&#10;Jika hari ini Sabtu dan besok Minggu, maka hari ke-5 dari sekarang adalah..."
                        value={formData.context}
                        onChange={(e) => setFormData({ ...formData, context: e.target.value.slice(0, 500) })}
                      />
                      <div className="flex items-center justify-between mt-2 px-1">
                        <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                          Semakin jelas konteks, semakin berkualitas soal yang dihasilkan
                        </span>
                        <span className="text-[11px] font-medium text-violet-500">{formData.context.length}/500</span>
                      </div>
                    </div>
                  </div>

                  {/* Instruksi Spesifik */}
                  <div>
                    <label className="block text-sm font-semibold mb-3">Instruksi Spesifik <span className="text-gray-400 font-normal">(Opsional)</span></label>
                    <div className="relative">
                      <textarea
                        id="instruksi-spesifik"
                        name="instruksi_spesifik"
                        autoComplete="off"
                        className="input-premium w-full h-24 p-4 rounded-xl outline-none resize-none text-sm placeholder:text-gray-400"
                        placeholder="Contoh: Fokus pada analisis data, gunakan grafik..."
                        value={formData.instruksi_spesifik}
                        onChange={(e) => setFormData({ ...formData, instruksi_spesifik: e.target.value.slice(0, 200) })}
                      />
                      <div className="text-right mt-2 px-1">
                        <span className="text-[11px] font-medium text-violet-500">{formData.instruksi_spesifik.length}/200</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tombol CTA - Hidden on mobile, shown on desktop */}
                <div className="hidden md:block mt-8 space-y-4">
                  {isLimitReached && !user ? (
                    <button onClick={onLogin} className="w-full py-4 bg-gray-50 border border-gray-100 text-gray-400 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all duration-200 hover:shadow-sm">
                      <LogIn size={16} strokeWidth={2} />
                      Login untuk 20 Soal/Hari
                      <ChevronRight size={16} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  ) : showBankSoalButton ? (
                    <button onClick={() => { setView('DASHBOARD'); navigate('/dashboard/question-bank'); }} className="w-full py-4 bg-gray-50 border border-gray-100 text-gray-400 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all duration-200 hover:shadow-sm">
                      <Users size={16} strokeWidth={2} />
                      Kredit Habis, Cek Bank Soal
                      <ChevronRight size={16} strokeWidth={2} />
                    </button>
                  ) : (
                    <button
                      onClick={handleStart}
                      disabled={!canGenerate}
                      className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 ${canGenerate
                        ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-btn-glow active:scale-[0.98]'
                        : 'bg-gray-50 border border-gray-100 text-gray-300 cursor-not-allowed'
                        }`}
                    >
                      <Sparkles size={16} strokeWidth={2} className={canGenerate ? 'animate-pulse' : ''} />
                      Buat Soal
                      <ChevronRight size={16} strokeWidth={2} />
                    </button>
                  )}

                  {!isDeveloperMode && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2 px-3 py-1 bg-violet-50 rounded-full">
                        <span className="text-[10px] font-semibold text-gray-500">Sisa hari ini:</span>
                        <span className="text-[10px] font-bold text-violet-600">{remainingQuota}/{totalLimitWithToken}</span>
                      </div>
                      {tokenBalance > 0 && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 rounded-full border border-amber-200">
                          <Wallet size={12} className="text-amber-600" />
                          <span className="text-[10px] font-bold text-amber-600">Token: {tokenBalance}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* KOLOM KANAN (Panel Pengaturan Soal) - Full width on mobile, 5/12 on desktop */}
            <div className="flex-1 lg:w-[40%]">
              {/* Panel Pengaturan Soal - Single Container */}
              <div className="bg-white rounded-2xl shadow-card p-5 md:p-6 anim-fade-up delay-200 h-full mb-6">
                <div className="mb-5 pb-3 border-b border-gray-100">
                  <h2 className="text-base font-bold text-gray-900">Pengaturan Soal</h2>
                  <p className="text-[11px] text-gray-400">Konfigurasi soal yang ingin dibuat</p>
                </div>

                {/* Section 1: Subtes */}
                <div className="mb-5 pb-5 border-b border-gray-100">
                  <div className="mb-3">
                    <h3 className="text-sm font-bold text-gray-800">Subtes</h3>
                    <p className="text-[10px] text-gray-400">Pilih jenis kemampuan yang ingin dilatih</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {SUBTESTS.map((st) => {
                      const config = SUBTEST_CONFIG[st.id] || SUBTEST_CONFIG['tps_pu'];
                      const Icon = config.icon;
                      const isSelected = formData.subtest === st.id;

                      return (
                        <button
                          key={st.id}
                          onClick={() => setFormData({ ...formData, subtest: st.id })}
                          className={`subtest-card flex flex-col p-3 rounded-xl items-start text-left gap-2 ${isSelected
                            ? 'active-card'
                            : ''
                            }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-white/20' : 'bg-violet-50'
                            }`}>
                            <Icon className="w-4 h-4" strokeWidth={2} style={{ color: isSelected ? 'white' : '#8B5CF6' }} />
                          </div>
                          <span className="text-[11px] font-bold leading-tight">{st.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 2: Kesulitan */}
                <div className="mb-5 pb-5 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-bold text-gray-800">Kesulitan</h3>
                      <p className="text-[10px] text-gray-400">Tentukan tingkat kesulitan soal</p>
                    </div>
                    <div className="px-2 py-0.5 bg-violet-50 text-violet-600 text-[10px] font-bold rounded-full">Level {formData.complexity}</div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-bold text-gray-700">Level Kesulitan</label>
                      <button
                        onClick={() => navigate('/snbt-question-types')}
                        className="flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700 transition-colors"
                      >
                        <Eye size={14} />
                        Lihat Detail
                      </button>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="1"
                      value={formData.complexity}
                      onChange={(e) => setFormData({ ...formData, complexity: parseInt(e.target.value) })}
                      className="w-full h-1.5 bg-violet-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-[10px] font-semibold text-gray-400">Adaptive</span>
                      <span className="text-[10px] font-semibold text-gray-400">Pakar</span>
                    </div>
                  </div>
                  <div className="px-3 py-2 bg-violet-50/50 rounded-lg border border-violet-100">
                    <span className="text-[10px] font-bold text-violet-700 block mb-0.5">
                      {formData.complexity === 0 && 'Adaptive - Otomatis disesuaikan'}
                      {formData.complexity === 1 && 'Basic - Konsep dasar'}
                      {formData.complexity === 2 && 'Easy - Aplikasi sederhana'}
                      {formData.complexity === 3 && 'Medium - Analisis standar'}
                      {formData.complexity === 4 && 'Hard - Pemikiran kritis'}
                      {formData.complexity === 5 && 'Advanced - Level olimpiade'}
                    </span>
                    <p className="text-[9px] text-violet-600 leading-relaxed">
                      {formData.complexity === 0 && 'Tingkat kesulitan akan disesuaikan dengan konteks'}
                      {formData.complexity === 1 && 'Soal langsung, satu langkah penyelesaian'}
                      {formData.complexity === 2 && 'Butuh 2-3 langkah, konsep tunggal'}
                      {formData.complexity === 3 && 'Multi-konsep, analisis mendalam'}
                      {formData.complexity === 4 && 'Reasoning kompleks, strategi tingkat tinggi'}
                      {formData.complexity === 5 && 'Abstraksi tinggi, solusi non-standar'}
                    </p>
                  </div>
                </div>

                {/* Section 3: Mode Belajar */}
                <div className="pt-2">
                  <div className="mb-3">
                    <h3 className="text-sm font-bold text-gray-800">Mode Belajar</h3>
                    <p className="text-[10px] text-gray-400">Pilih pengalaman belajar yang sesuai</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {/* Game Mode */}
                    <button
                      onClick={() => setMode('game')}
                      className={`relative flex flex-col p-3 rounded-xl border-2 transition-all duration-300 ${
                        mode === 'game'
                          ? 'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-500 shadow-md'
                          : 'bg-white border-gray-200 hover:border-rose-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          mode === 'game' ? 'bg-rose-500' : 'bg-rose-100'
                        }`}>
                          <Gamepad2 size={18} className={mode === 'game' ? 'text-white' : 'text-rose-600'} />
                        </div>
                      </div>
                      <span className={`text-xs font-bold mb-0.5 ${mode === 'game' ? 'text-rose-700' : 'text-gray-700'}`}>
                        Mode Game
                      </span>
                      <span className="text-[9px] text-gray-500 text-left leading-tight">
                        Belajar sambil bermain
                      </span>
                      {mode === 'game' && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 size={14} className="text-rose-500" />
                        </div>
                      )}
                    </button>

                    {/* Exam Mode */}
                    <button
                      onClick={() => setMode('exam')}
                      className={`relative flex flex-col p-3 rounded-xl border-2 transition-all duration-300 ${
                        mode === 'exam'
                          ? 'bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-500 shadow-md'
                          : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          mode === 'exam' ? 'bg-indigo-600' : 'bg-indigo-100'
                        }`}>
                          <FileText size={18} className={mode === 'exam' ? 'text-white' : 'text-indigo-600'} />
                        </div>
                      </div>
                      <span className={`text-xs font-bold mb-0.5 ${mode === 'exam' ? 'text-indigo-700' : 'text-gray-700'}`}>
                        Mode Ujian
                      </span>
                      <span className="text-[9px] text-gray-500 text-left leading-tight">
                        Simulasi UTBK asli
                      </span>
                      {mode === 'exam' && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 size={14} className="text-indigo-500" />
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Mode Features */}
                  <div className={`p-3 rounded-lg border ${
                    mode === 'game' 
                      ? 'bg-rose-50/50 border-rose-200' 
                      : 'bg-indigo-50/50 border-indigo-200'
                  }`}>
                    {mode === 'game' ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <Heart size={12} className="text-rose-500" />
                          <span className="text-[9px] font-medium text-rose-700">3 Nyawa</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Zap size={12} className="text-amber-500" />
                          <span className="text-[9px] font-medium text-rose-700">Bonus Poin Streak</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-emerald-500" />
                          <span className="text-[9px] font-medium text-rose-700">Feedback Langsung</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} className="text-indigo-500" />
                          <span className="text-[9px] font-medium text-indigo-700">Timer Hitung Mundur</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-emerald-500" />
                          <span className="text-[9px] font-medium text-indigo-700">Tandai Ragu-ragu</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <TrendingUp size={12} className="text-teal-500" />
                          <span className="text-[9px] font-medium text-indigo-700">Real-time IRT Scoring</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>

        {/* Mobile-only CTA Button Section - Full width at bottom (above bottom nav) */}
        <div className="lg:hidden mt-6 pb-24">
          <div className="space-y-4">
            {isLimitReached && !user ? (
              <button onClick={onLogin} className="w-full py-4 bg-gray-50 border border-gray-100 text-gray-400 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all duration-200 hover:shadow-sm">
                <LogIn size={16} strokeWidth={2} />
                Login untuk 20 Soal/Hari
                <ChevronRight size={16} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            ) : showBankSoalButton ? (
              <button onClick={() => { setView('DASHBOARD'); navigate('/dashboard/question-bank'); }} className="w-full py-4 bg-gray-50 border border-gray-100 text-gray-400 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all duration-200 hover:shadow-sm">
                <Users size={16} strokeWidth={2} />
                Kredit Habis, Cek Bank Soal
                <ChevronRight size={16} strokeWidth={2} />
              </button>
            ) : (
              <button
                onClick={handleStart}
                disabled={!canGenerate}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 ${canGenerate
                  ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-btn-glow active:scale-[0.98]'
                  : 'bg-gray-50 border border-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
              >
                <Sparkles size={16} strokeWidth={2} className={canGenerate ? 'animate-pulse' : ''} />
                Buat Soal
                <ChevronRight size={16} strokeWidth={2} />
              </button>
            )}

            {!isDeveloperMode && (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-violet-50 rounded-full">
                  <span className="text-[10px] font-semibold text-gray-500">Sisa hari ini:</span>
                  <span className="text-[10px] font-bold text-violet-600">{remainingQuota}/{totalLimitWithToken}</span>
                </div>
                {tokenBalance > 0 && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 rounded-full border border-amber-200">
                    <Wallet size={12} className="text-amber-600" />
                    <span className="text-[10px] font-bold text-amber-600">Token: {tokenBalance}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 pb-safe">
        <div className="grid grid-cols-4 h-16">
          <button
            onClick={() => { setView('HOME'); navigate('/'); }}
            className="flex flex-col items-center justify-center gap-1 text-violet-600"
          >
            <Sparkles size={20} strokeWidth={2} />
            <span className="text-xs font-semibold">Buat</span>
          </button>

          {user && (
            <button
              onClick={() => { setView('DASHBOARD'); navigate('/dashboard/overview'); }}
              className="flex flex-col items-center justify-center gap-1 text-gray-400"
            >
              <Activity size={20} strokeWidth={2} />
              <span className="text-xs font-medium">Dashboard</span>
            </button>
          )}

          {user && (
            <button
              onClick={() => { setView('COMMUNITY'); navigate('/community'); }}
              className="flex flex-col items-center justify-center gap-1 text-gray-400"
            >
              <Users size={20} strokeWidth={2} />
              <span className="text-xs font-medium">Community</span>
            </button>
          )}

          <button
            onClick={() => { setView('HELP'); navigate('/rules'); }}
            className="flex flex-col items-center justify-center gap-1 text-gray-400"
          >
            <BookOpen size={20} strokeWidth={2} />
            <span className="text-xs font-medium">Panduan</span>
          </button>
        </div>
      </nav>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Konfirmasi Logout</h3>
            <p className="text-gray-600 mb-6">Yakin ingin keluar dari akun?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all font-medium">
                Batal
              </button>
              <button onClick={() => { setShowLogoutConfirm(false); onLogout(); }} className="flex-1 px-4 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 hover:shadow-lg transition-all font-semibold">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeViewRevamp;
