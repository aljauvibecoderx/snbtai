import React, { useState } from 'react';
import { LogIn, Sparkles, ChevronRight, Wallet, TrendingUp, Activity, Users, BookOpen } from 'lucide-react';
import { SUBTESTS } from '../constants/subtestHelper';
import { TemplateInfo } from '../components/common/TemplateInfo';
import { UnifiedNavbar } from '../components/layout/UnifiedNavbar';

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
  dailyLimit,
  dailyUsage,
  totalLimit,
  coinBalance,
  onBuyCoin,
  publicQuestions = [],
  attempts = []
}) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isLimitReached = isDeveloperMode ? false : dailyUsage >= totalLimit;
  const canGenerate = !isLimitReached && formData.context.length >= 20;
  const remainingQuota = Math.max(0, totalLimit - dailyUsage);
  const showBankSoalButton = user && dailyUsage >= dailyLimit && coinBalance === 0; // Show when base limit reached and no coins

  return (
    <div className="min-h-screen bg-[#F3F4F8] relative overflow-x-hidden">
      {/* Background floating orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="lp-orb   absolute top-[-10%] left-[-10%]  w-[40%] h-[40%] bg-violet-400/15 rounded-full blur-[120px]" />
        <div className="lp-orb-2 absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-400/15 rounded-full blur-[120px]" />
        <div className="lp-orb-3 absolute top-[40%] right-[10%]   w-[25%] h-[25%] bg-purple-300/10  rounded-full blur-[100px]" />
      </div>
      <style>{`
        .custom-border { border: 1px solid rgba(0, 0, 0, 0.06); }
        .active-card { background-color: #7C3AED !important; color: white !important; }
        .active-card svg { color: white !important; }

        /* ── Premium Shadow System ── */
        .shadow-card {
          box-shadow:
            0 1px 2px rgba(0,0,0,0.04),
            0 4px 12px rgba(0,0,0,0.05),
            0 8px 24px rgba(0,0,0,0.04);
        }
        .shadow-card-hover {
          box-shadow:
            0 2px 4px rgba(0,0,0,0.05),
            0 8px 24px rgba(99,102,241,0.10),
            0 16px 40px rgba(99,102,241,0.08);
        }
        .shadow-btn-glow {
          box-shadow: 0 0 0 0 rgba(124, 58, 237, 0);
          transition: box-shadow 0.3s ease;
        }
        .shadow-btn-glow:hover {
          box-shadow: 0 0 20px 4px rgba(124, 58, 237, 0.18);
        }
        .shadow-btn-glow:active {
          transform: scale(0.98);
          box-shadow: 0 0 12px 2px rgba(124, 58, 237, 0.12);
        }

        /* ── Entrance Animations ── */
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideRight {
          from { opacity: 0; transform: translateX(-14px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes lpFloatOrb {
          0%, 100% { transform: translate(0,0) scale(1); }
          50%       { transform: translate(12px,-16px) scale(1.06); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0); }
          50%       { box-shadow: 0 0 18px 6px rgba(124, 58, 237, 0.15); }
        }
        @keyframes subtestPop {
          from { opacity: 0; transform: scale(0.88) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .anim-fade-up    { animation: fadeSlideUp 0.5s cubic-bezier(.22,.68,0,1.2) both; }
        .anim-fade-right { animation: fadeSlideRight 0.45s cubic-bezier(.22,.68,0,1.2) both; }
        .anim-fade-in    { animation: fadeIn 0.4s ease both; }
        .lp-orb        { animation: lpFloatOrb 9s ease-in-out infinite; }
        .lp-orb-2      { animation: lpFloatOrb 12s ease-in-out infinite reverse; }
        .lp-orb-3      { animation: lpFloatOrb 7s ease-in-out infinite; animation-delay: 3s; }

        .delay-0   { animation-delay: 0ms; }
        .delay-50  { animation-delay: 50ms; }
        .delay-100 { animation-delay: 100ms; }
        .delay-150 { animation-delay: 150ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-250 { animation-delay: 250ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-350 { animation-delay: 350ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }

        /* ── Subtes card hover ── */
        .subtest-card {
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
        }
        .subtest-card:hover:not(.active-card) {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(99,102,241,0.12);
          background: rgba(99,102,241,0.04);
        }
        .subtest-card.active-card {
          box-shadow: 0 4px 20px rgba(124,58,237,0.3);
          transform: translateY(-1px);
        }

        /* ── Card hover lift ── */
        .card-lift {
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .card-lift:hover {
          transform: translateY(-3px);
        }
        .card-lift:hover { box-shadow:
          0 2px 4px rgba(0,0,0,0.04),
          0 12px 32px rgba(99,102,241,0.10),
          0 20px 48px rgba(99,102,241,0.07);
        }

        /* ── Range slider ── */
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          background: #7C3AED;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(124,58,237,0.35);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        input[type='range']::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 2px 12px rgba(124,58,237,0.5);
        }
        input[type='range']::-webkit-slider-track {
          height: 6px;
          border-radius: 9999px;
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
        coinBalance={coinBalance}
      />

      <main className="relative z-10 pt-20 md:pt-20 pb-20 md:pb-16 px-0 md:px-8">
        <div className="max-w-6xl mx-auto md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 md:gap-8 items-start">

            <div className="lg:col-span-7">
              <div className="bg-white rounded-none md:rounded-2xl p-4 md:p-8 border-0 md:shadow-card card-lift md:custom-border flex flex-col anim-fade-up delay-100">

                <div className="mb-8 anim-fade-right delay-150">
                  <h1 className="text-xl font-bold text-gray-900 mb-1">Buat Soal SNBT</h1>
                  <p className="text-sm text-gray-400">Buat soal latihan SNBT dengan cepat untuk membantu kamu belajar lebih efektif.</p>
                </div>

                <div className="space-y-6 flex-1">
                  <div>
                    <label className="block text-sm font-semibold mb-3">Konteks Soal</label>
                    <div className="relative">
                      <textarea
                        className="w-full h-32 p-4 rounded-xl border border-gray-100 bg-gray-50/50 focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400 outline-none resize-none text-sm placeholder:text-gray-300 transition-all duration-200 focus:bg-white focus:shadow-card"
                        placeholder="Masukkan konteks soal yang ingin dibuat. Contoh:&#10;Jika hari ini Sabtu dan besok Minggu, maka hari ke-5 dari sekarang adalah..."
                        value={formData.context}
                        onChange={(e) => setFormData({ ...formData, context: e.target.value.slice(0, 500) })}
                      />
                      <div className="flex items-center justify-between mt-2 px-1">
                        <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                          Semakin jelas konteks, semakin berkualitas soal yang dihasilkan
                        </span>
                        <span className="text-[11px] font-medium text-indigo-400">{formData.context.length}/500</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3">Instruksi Spesifik <span className="text-gray-300 font-normal">(Opsional)</span></label>
                    <div className="relative">
                      <textarea
                        className="w-full h-24 p-4 rounded-xl border border-gray-100 bg-gray-50/50 focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400 outline-none resize-none text-sm placeholder:text-gray-300 transition-all duration-200 focus:bg-white focus:shadow-card"
                        placeholder="Contoh: Fokus pada analisis data, gunakan grafik..."
                        value={formData.instruksi_spesifik}
                        onChange={(e) => setFormData({ ...formData, instruksi_spesifik: e.target.value.slice(0, 200) })}
                      />
                      <div className="text-right mt-2 px-1">
                        <span className="text-[11px] font-medium text-indigo-400">{formData.instruksi_spesifik.length}/200</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 space-y-4">
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
                    <div className="flex justify-center">
                      <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full">
                        <span className="text-[10px] font-semibold text-gray-500">Sisa hari ini:</span>
                        <span className="text-[10px] font-bold text-indigo-600">{remainingQuota}/{totalLimit}</span>
                      </div>
                      {coinBalance > 0 && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-full">
                          <Wallet size={12} className="text-amber-600" />
                          <span className="text-[10px] font-bold text-amber-600">+{coinBalance}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6 px-4 md:px-0 mt-4 md:mt-0">
              <div className="bg-white rounded-2xl shadow-card card-lift custom-border p-6 anim-fade-up delay-200">
                <div className="mb-4">
                  <h3 className="text-sm font-bold">Subtes</h3>
                  <p className="text-[11px] text-gray-400">Pilih jenis kemampuan yang ingin dilatih</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {SUBTESTS.map((st) => {
                    const config = SUBTEST_CONFIG[st.id] || SUBTEST_CONFIG['tps_pu'];
                    const Icon = config.icon;
                    const isSelected = formData.subtest === st.id;

                    return (
                      <button
                        key={st.id}
                        onClick={() => setFormData({ ...formData, subtest: st.id })}
                        className={`subtest-card flex flex-col p-3 rounded-xl custom-border items-start text-left gap-2 ${isSelected
                          ? 'active-card'
                          : 'bg-white'
                          }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-white/20' : 'bg-indigo-50'
                          }`}>
                          <Icon className="w-4 h-4" strokeWidth={2} style={{ color: isSelected ? 'white' : '#6366F1' }} />
                        </div>
                        <span className="text-[11px] font-bold leading-tight">{st.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-card card-lift custom-border p-6 anim-fade-up delay-300">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-bold">Kesulitan</h3>
                    <p className="text-[11px] text-gray-400">Tentukan tingkat kesulitan soal yang ingin dibuat</p>
                  </div>
                  <div className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full">Level {formData.complexity}</div>
                </div>
                <div className="mt-6 mb-6">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="1"
                    value={formData.complexity}
                    onChange={(e) => setFormData({ ...formData, complexity: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-indigo-50 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-3">
                    <span className="text-[10px] font-semibold text-gray-400">Adaptive</span>
                    <span className="text-[10px] font-semibold text-gray-400">Pakar</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-50">
                  <span className="text-[11px] font-bold text-indigo-600 block mb-1">
                    {formData.complexity === 0 && 'Adaptive - Otomatis disesuaikan'}
                    {formData.complexity === 1 && 'Basic - Konsep dasar'}
                    {formData.complexity === 2 && 'Easy - Aplikasi sederhana'}
                    {formData.complexity === 3 && 'Medium - Analisis standar'}
                    {formData.complexity === 4 && 'Hard - Pemikiran kritis'}
                    {formData.complexity === 5 && 'Advanced - Level olimpiade'}
                  </span>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    {formData.complexity === 0 && 'Tingkat kesulitan akan disesuaikan dengan konteks'}
                    {formData.complexity === 1 && 'Soal langsung, satu langkah penyelesaian'}
                    {formData.complexity === 2 && 'Butuh 2-3 langkah, konsep tunggal'}
                    {formData.complexity === 3 && 'Multi-konsep, analisis mendalam'}
                    {formData.complexity === 4 && 'Reasoning kompleks, strategi tingkat tinggi'}
                    {formData.complexity === 5 && 'Abstraksi tinggi, solusi non-standar'}
                  </p>
                </div>
              </div>

            </div>
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
