import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Target, TrendingUp, Sparkles, CheckCircle2, Users,
  FileText, GraduationCap, Brain, Trophy, Star, X, Coins, Crown, Flame,
  ChevronDown, Shield, Award, Mail, MessageSquare, Phone, Instagram,
  Camera, BarChart2, Activity, MapPin
} from 'lucide-react';
import { auth, loginWithGoogle } from '../services/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { UnifiedNavbar } from '../components/layout/UnifiedNavbar';
import { useTokenBalance } from '../hooks/useTokenBalance';
import { SEOHelmet } from '../components/common/SEOHelmet';
import UniversityMarquee from '../components/common/UniversityMarquee';

// ─── Interactive Demo Strip ──────────────────────────────────────────────────
const InteractiveDemoStrip = ({ onNavigate, user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    if (!isLoading) { setDotCount(0); return; }
    const id = setInterval(() => setDotCount(d => (d + 1) % 4), 400);
    return () => clearInterval(id);
  }, [isLoading]);

  const handleHover = () => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2200);
  };

  const handleClick = () => {
    onNavigate('/app');
  };

  return (
    <section className="py-10 md:py-14 px-4 md:px-6 bg-white relative z-10 border-b border-slate-100">
      <div className="max-w-2xl mx-auto">
        <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4 md:mb-5">
          ✦ Coba Langsung — Gratis Selama Maret-April, Tidak Perlu Kartu Kredit
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl p-3 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Ketik satu kalimat tentang fotosintesis..."
              className="flex-1 bg-white rounded-xl px-4 md:px-5 py-3 text-sm md:text-sm text-slate-700 placeholder-slate-400 border border-slate-200 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all font-medium"
            />
            <button
              onClick={handleClick}
              onMouseEnter={handleHover}
              className="relative px-4 md:px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold text-sm whitespace-nowrap hover:shadow-lg hover:scale-[1.02] transition-all min-w-[140px] md:min-w-[148px] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  AI Berpikir{'.' .repeat(dotCount)}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Soares
                </>
              )}
            </button>
          </div>

          {isLoading && (
            <div className="flex items-center gap-2 mt-3 px-1">
              <span className="flex gap-1">
                {[0, 150, 300].map(delay => (
                  <span
                    key={delay}
                    className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </span>
              <span className="text-xs text-violet-600 font-medium">
                AI sedang menganalisis dan menyusun soal SNBT…
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// ─── Main Landing Page ────────────────────────────────────────────────────────
const LandingPage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [user, setUser] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [myQuestions, setMyQuestions] = useState([]);
  const [publicQuestions, setPublicQuestions] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const tokenBalance = useTokenBalance();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const { getMyQuestions, getPublicQuestions, getMyAttempts } = await import('../services/firebase/firebase');
        const [my, pub, att] = await Promise.all([
          getMyQuestions(currentUser.uid),
          getPublicQuestions(),
          getMyAttempts(currentUser.uid)
        ]);
        setMyQuestions(my);
        setPublicQuestions(pub);
        setAttempts(att);
      }
    });
    return () => unsubscribe();
  }, []);

  // Scroll-reveal observer
  useEffect(() => {
    const els = document.querySelectorAll('.lp-reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('lp-visible'); io.unobserve(e.target); }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const todayAttempts = attempts.filter(a => {
    const today = new Date(); today.setHours(0,0,0,0);
    const d = a.finishedAt?.seconds ? new Date(a.finishedAt.seconds * 1000) : new Date();
    d.setHours(0,0,0,0);
    return d.getTime() === today.getTime();
  });

  const universities = [
    'UI', 'ITB', 'UGM', 'ITS', 'UNPAD', 'UNDIP', 'UNAIR', 'IPB',
    'UNJ', 'UNS', 'UB', 'UNSRI', 'UNAND', 'UNHAS', 'UIN Jakarta', 'UNEJ'
  ];

  // ─── Bento features — 4 new headline + 2 supporting ────────────────────────
  const bentoFeatures = [
    {
      id: 'ai-lens',
      icon: <Camera className="w-8 h-8" />,
      title: 'AI Lens: Image to Quiz',
      desc: 'Upload foto catatan, buku, atau screenshot. AI kami mengubah gambar menjadi soal SNBT lengkap dengan OCR cerdas. Dukung JPG, PNG, dan PDF.',
      tag: 'Baru',
      size: 'large',
    },
    {
      id: 'ptnpedia',
      icon: <MapPin className="w-7 h-7" />,
      title: 'PTNPedia Explorer',
      desc: 'Database 85+ PTN, 1000+ prodi, daya tampung SNBP & SNBT terkini. Cari dan bandingkan kampus impianmu.',
      size: 'small',
    },
    {
      id: 'irt',
      icon: <BarChart2 className="w-7 h-7" />,
      title: 'Real-time IRT Scoring',
      desc: 'Skor 200–800 seperti SNBT asli. Percentile nasional & analisis per subtes langsung setelah ujian.',
      size: 'small',
    },
    {
      id: 'progress',
      icon: <Activity className="w-8 h-8" />,
      title: 'Smart Progress Tracker',
      desc: 'Dashboard analitik yang melacak kelemahan per subtes, streak belajar harian, dan rekomendasi materi selanjutnya secara otomatis.',
      tag: 'AI-powered',
      size: 'large',
    },
    {
      id: 'tryout',
      icon: <Trophy className="w-7 h-7" />,
      title: 'Tryout Profesional',
      desc: 'Simulasi ujian SNBT lengkap dengan timer, ranking & sound effects.',
      size: 'small',
    },
    {
      id: 'vocab',
      icon: <BookOpen className="w-7 h-7" />,
      title: 'Vocab Builder',
      desc: 'Highlight kata dari soal → spaced repetition → XP & streak system.',
      size: 'small',
    },
  ];

  const comparisonData = [
    { old: 'Buku cetak statis', new: 'AI Generator dinamis', icon: <Brain /> },
    { old: 'Tidak ada feedback', new: 'IRT Scoring real-time', icon: <Target /> },
    { old: 'Belajar sendiri', new: 'Community & leaderboard', icon: <Users /> },
    { old: 'Mahal & terbatas', new: 'Gratis & unlimited', icon: <Sparkles /> }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '0',
      coins: '20',
      features: ['1 soal/hari tanpa login', '19 soal/hari dengan login', 'Akses bank soal', 'Mode ngegame'],
      popular: false
    },
    {
      name: 'Pro',
      price: '49K',
      coins: '100',
      features: ['100 soal AI/bulan', 'Tryout unlimited', 'Vocab mode premium', 'Priority support'],
      popular: true
    },
    {
      name: 'Ultimate',
      price: '99K',
      coins: '250',
      features: ['250 soal AI/bulan', 'Semua fitur Pro', 'Analytics advanced', 'Certificate generator'],
      popular: false
    }
  ];

  const testimonials = [
    { name: 'Aisyah Putri', school: 'SMA Negeri 8 Jakarta', role: 'Lolos SNBT UI 2024', avatar: 'AP', text: 'Dulu aku bingung mulai dari mana… sekarang udah lolos UI berkat SNBT AI! AI Generator-nya keren banget, bisa bikin soal dari materi apapun.', rating: 5, color: 'from-violet-500 to-purple-500' },
    { name: 'Budi Santoso', school: 'SMA Negeri 3 Bandung', role: 'Lolos SNBT ITB 2024', avatar: 'BS', text: 'IRT Scoring-nya akurat, mirip SNBT asli. Tryout-nya juga lengkap dan ranking-nya memotivasi. Recommended banget!', rating: 5, color: 'from-blue-500 to-cyan-500' },
    { name: 'Citra Dewi', school: 'SMA Negeri 1 Yogyakarta', role: 'Lolos SNBT UGM 2024', avatar: 'CD', text: 'Vocab Mode-nya membantu banget buat Literasi Inggris. Nilai saya naik drastis dari 450 jadi 680. Terima kasih SNBT AI!', rating: 5, color: 'from-pink-500 to-rose-500' },
    { name: 'Doni Wijaya', school: 'SMA Negeri 2 Surabaya', role: 'Lolos SNBT ITS 2024', avatar: 'DW', text: 'Fitur AI Lens-nya keren, bisa upload gambar langsung. Soal yang dihasilkan berkualitas dan sesuai kisi-kisi SNBT.', rating: 5, color: 'from-emerald-500 to-teal-500' },
    { name: 'Eka Putri', school: 'SMA Negeri 5 Medan', role: 'Lolos SNBT UNPAD 2024', avatar: 'EP', text: 'Harga koinnya terjangkau dan fitur-fiturnya lengkap. Dari gratis 19 soal/hari udah cukup untuk persiapan matang.', rating: 5, color: 'from-orange-500 to-amber-500' }
  ];

  const faqs = [
    { q: 'Apakah SNBT AI benar-benar gratis?', a: 'Ya! Kamu bisa generate 19 soal/hari gratis dengan login. Tanpa login tetap dapat 1 soal/hari.' },
    { q: 'Bagaimana cara kerja AI Generator?', a: 'Cukup masukkan teks/cerita atau upload gambar/PDF, AI akan otomatis membuat soal SNBT berkualitas dengan pilihan ganda dan pembahasan.' },
    { q: 'Apa itu IRT Scoring?', a: 'Item Response Theory adalah sistem penilaian profesional (200-800) yang digunakan SNBT asli. Lebih akurat karena mempertimbangkan tingkat kesulitan tiap soal.' },
    { q: 'Apakah soalnya mirip SNBT asli?', a: 'Ya! Soal dibuat mengikuti kisi-kisi SNBT resmi dengan 7 subtes (TPS, Literasi, Matematika) dan 5 level kesulitan.' },
    { q: 'Bagaimana cara akses Tryout?', a: 'Login terlebih dahulu, lalu pilih tryout dari dashboard. Tryout dibuat dari bank soal terbaik dengan timer dan ranking real-time.' }
  ];

  return (
    <div className="w-full">
      <SEOHelmet
        title="SNBT AI - Platform Belajar SNBT Berbasis AI | Gratis!"
        description="Platform pembelajaran SNBT terlengkap dengan AI Generator, Tryout Profesional, IRT Scoring 200-800, dan Bank Soal 10K+. Generate soal dari teks/gambar dengan AI. Gratis untuk siswa Indonesia!"
        keywords="snbt, utbk, belajar snbt, tryout snbt, soal snbt, ai generator soal, irt scoring, ptn, universitas"
        url="https://snbtai.xyz"
      />

      <div className="min-h-screen bg-slate-50 relative">
        {/* ── Animation Styles ── */}
        <style>{`
          /* Scroll Reveal */
          .lp-reveal {
            opacity: 0;
            transform: translateY(24px);
            transition: opacity 0.6s cubic-bezier(.22,.68,0,1.2), transform 0.6s cubic-bezier(.22,.68,0,1.2);
          }
          .lp-reveal.lp-visible { opacity: 1; transform: translateY(0); }

          /* Stagger */
          .lp-d-0   { transition-delay: 0ms; }
          .lp-d-80  { transition-delay: 80ms; }
          .lp-d-160 { transition-delay: 160ms; }
          .lp-d-240 { transition-delay: 240ms; }
          .lp-d-320 { transition-delay: 320ms; }
          .lp-d-400 { transition-delay: 400ms; }

          /* Hero entrance */
          @keyframes lpFadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes lpFadeBadge {
            from { opacity: 0; transform: translateY(-14px) scale(0.95); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes lpFloatOrb {
            0%, 100% { transform: translate(0,0) scale(1); }
            50%       { transform: translate(12px,-16px) scale(1.06); }
          }

          .lp-hero-badge  { animation: lpFadeBadge 0.6s cubic-bezier(.22,.68,0,1.2) 0.1s both; }
          .lp-hero-h1     { animation: lpFadeUp 0.7s cubic-bezier(.22,.68,0,1.2) 0.2s both; }
          .lp-hero-sub    { animation: lpFadeUp 0.6s ease 0.35s both; }
          .lp-hero-cta    { animation: lpFadeUp 0.6s ease 0.5s both; }
          .lp-hero-stats  { animation: lpFadeUp 0.6s ease 0.65s both; }
          .lp-float-badge { animation: lpFadeBadge 0.7s cubic-bezier(.22,.68,0,1.2) 0.8s both; }
          .lp-orb         { animation: lpFloatOrb 9s ease-in-out infinite; }
          .lp-orb-2       { animation: lpFloatOrb 12s ease-in-out infinite reverse; }
          .lp-orb-3       { animation: lpFloatOrb 7s ease-in-out infinite; animation-delay: 3s; }

          /* Card hover */
          .lp-card-hover {
            transition: transform 0.22s ease, box-shadow 0.22s ease;
          }
          .lp-card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 40px rgba(131,56,233,0.13), 0 2px 8px rgba(0,0,0,0.05);
          }
          .lp-shadow {
            box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 4px 14px rgba(0,0,0,0.05);
          }
          .lp-stat-hover {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .lp-stat-hover:hover {
            transform: translateY(-3px) scale(1.01);
            box-shadow: 0 8px 28px rgba(131,56,233,0.16);
          }
          .lp-testimonial-hover {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .lp-testimonial-hover:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.09);
          }
          .lp-pricing-hover {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .lp-pricing-hover:not(.popular-card):hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 40px rgba(131,56,233,0.1);
          }
          .lp-faq-answer {
            overflow: hidden;
            max-height: 0;
            transition: max-height 0.35s cubic-bezier(.22,.68,0,1), opacity 0.3s ease;
            opacity: 0;
          }
          .lp-faq-answer.open { max-height: 200px; opacity: 1; }

          /* Bento card */
          .bento-card {
            background: #ffffff;
            border: 1px solid rgba(226, 232, 240, 0.8);
            border-radius: 1.25rem;
            padding: 1.5rem;
            transition: transform 0.22s ease, box-shadow 0.22s ease;
            position: relative;
            overflow: hidden;
          }
          @media (min-width: 768px) {
            .bento-card {
              border-radius: 1.5rem;
              padding: 2rem;
            }
          }
          .bento-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 60px rgba(131,56,233,0.12), 0 4px 16px rgba(0,0,0,0.06);
          }
          .bento-card-large {
            min-height: auto;
          }
          @media (min-width: 768px) {
            .bento-card-large {
              min-height: 420px;
            }
          }
          .bento-card-small {
            min-height: auto;
          }
          @media (min-width: 768px) {
            .bento-card-small {
              min-height: 200px;
            }
          }
          .bento-icon {
            width: 52px;
            height: 52px;
            border-radius: 14px;
            background: rgba(131,56,233,0.08);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #8338e9;
            margin-bottom: 1.25rem;
            flex-shrink: 0;
          }
          .bento-tag {
            display: inline-flex;
            align-items: center;
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            padding: 2px 10px;
            border-radius: 999px;
            background: rgba(131,56,233,0.1);
            color: #8338e9;
            margin-bottom: 0.75rem;
          }
          /* Footer dark link hover */
          .footer-dark-link {
            color: #9ca3af;
            transition: color 0.2s ease;
            cursor: pointer;
          }
          .footer-dark-link:hover { color: #a78bfa; }
        `}</style>

        {/* Background Orbs */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="lp-orb   absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-400/10 rounded-full blur-[120px]" />
          <div className="lp-orb-2 absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-400/10 rounded-full blur-[120px]" />
          <div className="lp-orb-3 absolute top-[40%] right-[10%] w-[25%] h-[25%] bg-purple-300/08 rounded-full blur-[100px]" />
        </div>

        {/* ── Navbar ── */}
        <UnifiedNavbar
          user={user}
          onLogin={loginWithGoogle}
          onLogout={() => { auth.signOut(); setUser(null); }}
          navigate={navigate}
          setView={() => {}}
          onBuyCoin={() => navigate('/ambis-coin')}
          coinBalance={tokenBalance}
          dailyUsage={todayAttempts.length}
          totalQuestionsInBank={publicQuestions.length}
          remainingQuota={19 - todayAttempts.length}
          isAdmin={false}
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
          variant="default"
        />

        {/* ══════════════════════════════════════════
            HERO SECTION — bg-slate-50
        ══════════════════════════════════════════ */}
        <section className="pt-28 md:pt-40 pb-16 md:pb-20 px-4 md:px-6 relative overflow-hidden z-10 bg-slate-50">
          {/* Floating badge */}
          <div className="absolute top-32 right-6 md:right-10 lp-float-badge z-10 hidden sm:block">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl px-4 py-2 shadow-lg border border-violet-100">
              <div className="flex items-center gap-2 text-sm">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="font-semibold text-slate-700">1.240 soal dibuat hari ini</span>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 max-w-4xl mx-auto">
              {/* Top badge */}
              <div className="inline-block mb-4 lp-hero-badge">
                <div className="bg-gradient-to-r from-violet-100 to-indigo-100 border border-violet-200 rounded-full px-6 py-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-600" />
                  <span className="text-sm font-semibold text-violet-700">Platform Belajar SNBT No. 1 di Indonesia</span>
                </div>
              </div>

              {/* Hero headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] sm:leading-[1.05] text-slate-900 lp-hero-h1">
                <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                  Soal SNBT Realistis
                </span>
                <br />
                <span className="text-slate-900">dari Cerita Apapun</span>
              </h1>

              {/* Sub-headline */}
              <p className="text-lg sm:text-xl text-gray-500 leading-relaxed max-w-3xl mx-auto font-medium mt-6 lp-hero-sub">
                Masukkan teks atau upload gambar — AI mengubahnya menjadi soal SNBT berkualitas dengan pembahasan lengkap, instan.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6 lp-hero-cta">
                <button
                  onClick={() => navigate('/app')}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full hover:shadow-xl hover:scale-105 transition-all font-bold flex items-center justify-center gap-2 group text-base"
                >
                  {user ? 'Masuk Ke Aplikasi' : 'Coba Gratis Sekarang'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => document.querySelector('[data-section="how-it-works"]')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-full hover:border-violet-300 hover:bg-white transition-all font-semibold shadow-sm"
                >
                  Lihat Cara Kerja
                </button>
              </div>
            </div>

            {/* Hero stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 mt-10 sm:mt-14 max-w-3xl mx-auto lp-hero-stats">
              {[
                { value: '10K+', label: 'Soal Latihan', icon: <FileText className="w-5 h-5" /> },
                { value: '1K+',  label: 'Siswa Aktif',  icon: <Users className="w-5 h-5" /> },
                { value: '85+',  label: 'PTN Tersedia', icon: <GraduationCap className="w-5 h-5" /> }
              ].map((stat, i) => (
                <div key={i} className="bg-white/70 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-100 lp-shadow lp-stat-hover">
                  <div className="flex items-center gap-3 mb-1 text-violet-600">
                    {stat.icon}
                    <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-violet-600">{stat.value}</span>
                  </div>
                  <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            INTERACTIVE DEMO STRIP — bg-white
        ══════════════════════════════════════════ */}
        <InteractiveDemoStrip onNavigate={navigate} user={user} />

        {/* ══════════════════════════════════════════
            TRUSTED BY TICKER — above features
        ══════════════════════════════════════════ */}
        <UniversityMarquee universities={universities} />

        {/* ══════════════════════════════════════════
            BENTO GRID FEATURES — bg-white
        ══════════════════════════════════════════ */}
        <section className="py-16 md:py-28 px-4 md:px-6 bg-white relative z-10">
          <div className="max-w-7xl mx-auto space-y-10 md:space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto lp-reveal">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-500">Fitur Unggulan</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                Semua yang kamu butuhkan
              </h2>
              <p className="text-base md:text-lg text-gray-500">
                Ekosistem belajar SNBT terlengkap — dalam satu platform
              </p>
            </div>

            {/* Asymmetric Bento Grid — 3-column */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 lp-reveal lp-d-80">
              {/* AI Lens — Large (2×2) */}
              <div className="bento-card bento-card-large md:col-span-2 md:row-span-2">
                <div className="bento-icon">
                  <Camera className="w-7 h-7" />
                </div>
                {bentoFeatures[0].tag && (
                  <span className="bento-tag">{bentoFeatures[0].tag}</span>
                )}
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{bentoFeatures[0].title}</h3>
                <p className="text-base text-gray-500 leading-relaxed mb-8">{bentoFeatures[0].desc}</p>

                {/* Visual demo element */}
                <div className="mt-auto">
                  <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-md bg-violet-100 flex items-center justify-center">
                        <Camera className="w-3.5 h-3.5 text-violet-600" />
                      </div>
                      <span className="text-xs font-semibold text-slate-600">biologi_catatan.jpg</span>
                      <span className="ml-auto text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">OCR ✓</span>
                    </div>
                    {['Fotosintesis adalah proses...', 'Menghasilkan soal Biologi TPS...', 'Level: Sedang · 5 pilihan ganda'].map((t, i) => (
                      <div key={i} className="h-2 rounded-full bg-gradient-to-r from-violet-200 to-indigo-100" style={{width: `${[90, 70, 55][i]}%`, opacity: 1 - i * 0.15}} />
                    ))}
                  </div>
                  <button
                    onClick={() => navigate('/app')}
                    className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm hover:shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2 group"
                  >
                    Coba AI Lens <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* PTNPedia — small */}
              <div className="bento-card bento-card-small">
                <div className="bento-icon">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{bentoFeatures[1].title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{bentoFeatures[1].desc}</p>
                <div className="mt-4 flex gap-2 flex-wrap">
                  {['85+ PTN', '1000+ Prodi', 'SNBP & SNBT'].map(tag => (
                    <span key={tag} className="text-xs bg-slate-50 text-slate-500 font-medium px-2.5 py-1 rounded-full border border-slate-100">{tag}</span>
                  ))}
                </div>
              </div>

              {/* IRT Scoring — small */}
              <div className="bento-card bento-card-small">
                <div className="bento-icon">
                  <BarChart2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{bentoFeatures[2].title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{bentoFeatures[2].desc}</p>
                <div className="mt-4">
                  <div className="flex items-end gap-1 h-8">
                    {[40,60,50,75,85,70,92].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm" style={{height:`${h}%`, background: i === 6 ? '#8338e9' : 'rgba(131,56,233,0.15)'}} />
                    ))}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Skor IRT: <span className="text-violet-600 font-bold">734</span></div>
                </div>
              </div>

              {/* Smart Progress — large */}
              <div className="bento-card bento-card-large">
                <div className="bento-icon">
                  <Activity className="w-7 h-7" />
                </div>
                {bentoFeatures[3].tag && (
                  <span className="bento-tag">{bentoFeatures[3].tag}</span>
                )}
                <h3 className="text-xl font-bold text-slate-900 mb-2">{bentoFeatures[3].title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{bentoFeatures[3].desc}</p>
                {/* Mini progress bars */}
                <div className="space-y-2.5">
                  {[
                    { label: 'Literasi Indonesia', val: 82 },
                    { label: 'Matematika', val: 61 },
                    { label: 'TPS Penalaran', val: 75 },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600 font-medium">{item.label}</span>
                        <span className="text-violet-600 font-bold">{item.val}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" style={{width:`${item.val}%`}} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tryout — small */}
              <div className="bento-card bento-card-small">
                <div className="bento-icon">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{bentoFeatures[4].title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{bentoFeatures[4].desc}</p>
                <div className="mt-4 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-slate-500 font-medium">128 siswa aktif tryout</span>
                </div>
              </div>

              {/* Vocab Builder — small */}
              <div className="bento-card bento-card-small">
                <div className="bento-icon">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{bentoFeatures[5].title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{bentoFeatures[5].desc}</p>
                <div className="mt-4 flex gap-2">
                  <span className="text-xs bg-amber-50 text-amber-600 font-bold px-2 py-0.5 rounded-full border border-amber-100">🔥 Streak 7</span>
                  <span className="text-xs bg-violet-50 text-violet-600 font-bold px-2 py-0.5 rounded-full border border-violet-100">⚡ 240 XP</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            COMPARISON TABLE — bg-slate-50
        ══════════════════════════════════════════ */}
        <section className="py-16 md:py-28 px-4 md:px-6 bg-slate-50 relative z-10">
          <div className="max-w-5xl mx-auto space-y-8 md:space-y-12">
            <div className="text-center space-y-3 lp-reveal">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-500">Perbandingan</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                Cara Lama vs SNBT AI
              </h2>
              <p className="text-base md:text-lg text-gray-500">Lihat perbedaan signifikan dalam belajar</p>
            </div>

            <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                <div className="p-4 md:p-8 bg-slate-50"><div className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400">Fitur</div></div>
                <div className="p-4 md:p-8 bg-red-50"><div className="text-center font-bold text-red-600 uppercase text-xs md:text-sm tracking-wide flex items-center justify-center gap-1 md:gap-2"><X className="w-3 md:w-4 h-3 md:h-4" /> Cara Lama</div></div>
                <div className="p-4 md:p-8 bg-violet-50"><div className="text-center font-bold text-violet-600 uppercase text-xs md:text-sm tracking-wide flex items-center justify-center gap-1 md:gap-2"><CheckCircle2 className="w-3 md:w-4 h-3 md:h-4" /> SNBT AI</div></div>
              </div>
              {comparisonData.map((item, idx) => (
                <div key={idx} className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 border-t border-slate-200 lp-reveal" style={{transitionDelay:`${idx*70}ms`}}>
                  <div className="p-4 md:p-6 flex items-center justify-center text-slate-400">{item.icon}</div>
                  <div className="p-4 md:p-6 text-center text-sm md:text-base text-slate-600">{item.old}</div>
                  <div className="p-4 md:p-6 text-center font-semibold text-sm md:text-base text-slate-900">{item.new}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            TESTIMONIALS — bg-white
        ══════════════════════════════════════════ */}
        <section className="py-16 md:py-28 px-4 md:px-6 bg-white relative z-10">
          <div className="max-w-7xl mx-auto space-y-10 md:space-y-12">
            <div className="text-center space-y-3 lp-reveal">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-500">Testimoni</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">Apa Kata Mereka?</h2>
              <p className="text-base md:text-lg text-gray-500">Ribuan siswa sudah lolos PTN impian dengan SNBT AI</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {testimonials.map((t, idx) => (
                <div key={idx} className="bg-slate-50 rounded-2xl p-5 md:p-6 border border-slate-100 lp-testimonial-hover lp-reveal" style={{transitionDelay:`${idx*70}ms`}}>
                  <div className="flex items-start gap-3 md:gap-4 mb-4">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>{t.avatar}</div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-slate-900">{t.name}</div>
                      <div className="text-xs text-slate-400">{t.school}</div>
                      <div className="text-xs font-semibold text-violet-600 mt-0.5">{t.role}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed italic">"{t.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            HOW IT WORKS — bg-slate-50
        ══════════════════════════════════════════ */}
        <section data-section="how-it-works" className="py-16 md:py-28 px-4 md:px-6 bg-slate-50 relative z-10">
          <div className="max-w-6xl mx-auto space-y-10 md:space-y-12">
            <div className="text-center space-y-3 lp-reveal">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-500">Cara Kerja</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">Mulai dalam 3 langkah</h2>
              <p className="text-base md:text-lg text-gray-500">Tidak perlu setup. Langsung bisa.</p>
            </div>

            <div className="relative">
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-200 via-purple-200 to-indigo-200 -translate-y-1/2 -z-10" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
                {[
                  { num: '1', title: 'Pilih Materi', desc: 'Pilih dari 7 subtes SNBT', icon: <BookOpen className="w-5 h-5" /> },
                  { num: '2', title: 'Kerjakan Soares', desc: 'Mode ujian atau interaktif', icon: <Target className="w-5 h-5" /> },
                  { num: '3', title: 'Lihat Hasil', desc: 'Analisis dengan IRT scoring', icon: <TrendingUp className="w-5 h-5" /> }
                ].map((step, idx) => (
                  <div key={idx} className="relative lp-reveal bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border-2 border-slate-100 hover:border-violet-200 lp-shadow lp-card-hover" style={{transitionDelay:`${idx*120}ms`}}>
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-lg md:text-xl font-black mb-4 md:mb-5 shadow-lg">{step.num}</div>
                    <div className="mb-2 md:mb-3 text-violet-600">{step.icon}</div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-sm md:text-base text-gray-500">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 md:mt-10 text-center">
              <button onClick={() => navigate('/app')} className="w-full sm:w-auto px-8 md:px-10 py-3.5 md:py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full hover:shadow-2xl hover:scale-105 transition-all font-bold flex items-center justify-center gap-2 mx-auto group">
                Coba SNBT AI (Gratis Selama Maret-April)
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            VALUE PROPS — bg-white
        ══════════════════════════════════════════ */}
        <section className="py-16 md:py-28 px-4 md:px-6 bg-white relative z-10">
          <div className="max-w-7xl mx-auto space-y-10 md:space-y-12">
            <div className="text-center space-y-3 lp-reveal">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-500">Keunggulan</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">Mengapa Memilih SNBT AI?</h2>
              <p className="text-base md:text-lg text-gray-500">Keunggulan yang tidak dimiliki platform lain</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {[
                { icon: <Brain className="w-6 md:w-7 h-6 md:h-7" />, title: 'AI Dinamis & Adaptif', desc: 'Generate soal unlimited dengan AI yang terus belajar dari pola jawaban kamu' },
                { icon: <Target className="w-6 md:w-7 h-6 md:h-7" />, title: 'IRT Scoring Real-time', desc: 'Sistem penilaian profesional 200-800 seperti SNBT asli, bukan scoring biasa' },
                { icon: <Users className="w-6 md:w-7 h-6 md:h-7" />, title: 'Komunitas Aktif', desc: 'Berbagi tips, diskusi soal, dan kompetisi dengan ribuan siswa lain' },
                { icon: <Sparkles className="w-6 md:w-7 h-6 md:h-7" />, title: 'Harga Terjangkau', desc: 'Gratis 19 soal/hari atau paket koin mulai 49K dengan unlimited tryout' }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-100 lp-card-hover lp-reveal" style={{transitionDelay:`${idx*80}ms`}}>
                  <div className="bento-icon w-10 h-10 md:w-12 md:h-12">{item.icon}</div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm md:text-base text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            BLOG PREVIEW — bg-slate-50
        ══════════════════════════════════════════ */}
        <section className="py-16 md:py-28 px-4 md:px-6 bg-slate-50 relative z-10">
          <div className="max-w-7xl mx-auto space-y-10 md:space-y-12">
            <div className="text-center space-y-3 lp-reveal">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-500">Tips & Artikel</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">Tips Lolos SNBT 2025</h2>
              <p className="text-base md:text-lg text-gray-500">Artikel terbaru untuk persiapan maksimal</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {[
                { title: 'Strategi Belajar Efektif 3 Bulan Sebelum Ujian', excerpt: 'Cara membagi waktu belajar, fokus pada subtes lemah, dan maksimalkan retention dengan spaced repetition...', date: '15 Jan 2025', category: 'Strategi' },
                { title: 'Kesalahan Umum Saat Mengerjakan Soares Literasi', excerpt: 'Jangan terjebak dalam 5 kesalahan fatal yang sering dilakukan saat mengerjakan soal Literasi Indonesia & Inggris...', date: '12 Jan 2025', category: 'Tips' },
                { title: 'Cara Memaksimalkan Fitur Vocab Builder', excerpt: 'Teknik highlight-to-save, spaced repetition algorithm, dan XP system untuk meningkatkan vocabulary secara konsisten...', date: '10 Jan 2025', category: 'Fitur' }
              ].map((article, idx) => (
                <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-slate-100 lp-card-hover cursor-pointer group lp-reveal" style={{transitionDelay:`${idx*90}ms`}}>
                  <div className="h-32 md:h-36 bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                    <BookOpen className="w-8 md:w-10 h-8 md:h-10 text-violet-300" />
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-3 py-1 rounded-full">{article.category}</span>
                      <span className="text-xs text-slate-400">{article.date}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-violet-600 transition-colors leading-snug">{article.title}</h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{article.excerpt}</p>
                    <button className="text-violet-600 font-semibold text-sm flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                      Baca Selengkapnya <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Strategi Belajar Efektif 3 Bulan Sebelum Ujian', excerpt: 'Cara membagi waktu belajar, fokus pada subtes lemah, dan maksimalkan retention dengan spaced repetition...', date: '15 Jan 2025', category: 'Strategi' },
                { title: 'Kesalahan Umum Saat Mengerjakan Soal Literasi', excerpt: 'Jangan terjebak dalam 5 kesalahan fatal yang sering dilakukan saat mengerjakan soal Literasi Indonesia & Inggris...', date: '12 Jan 2025', category: 'Tips' },
                { title: 'Cara Memaksimalkan Fitur Vocab Builder', excerpt: 'Teknik highlight-to-save, spaced repetition algorithm, dan XP system untuk meningkatkan vocabulary secara konsisten...', date: '10 Jan 2025', category: 'Fitur' }
              ].map((article, idx) => (
                <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-slate-100 lp-card-hover cursor-pointer group lp-reveal" style={{transitionDelay:`${idx*90}ms`}}>
                  <div className="h-36 bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-violet-300" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-3 py-1 rounded-full">{article.category}</span>
                      <span className="text-xs text-slate-400">{article.date}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-violet-600 transition-colors leading-snug">{article.title}</h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{article.excerpt}</p>
                    <button className="text-violet-600 font-semibold text-sm flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                      Baca Selengkapnya <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SOCIAL PROOF STATS — gradient banner
        ══════════════════════════════════════════ */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-slate-50 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-2xl md:rounded-3xl p-6 md:p-12 text-white shadow-2xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
                {[
                  { value: '10,000+', label: 'Soal Tersedia',  icon: <FileText className="w-5 md:w-7 h-5 md:h-7" /> },
                  { value: '1,000+',  label: 'Siswa Aktif',    icon: <Users className="w-5 md:w-7 h-5 md:h-7" /> },
                  { value: '85+',    label: 'PTN Database',   icon: <GraduationCap className="w-5 md:w-7 h-5 md:h-7" /> },
                  { value: '95%',    label: 'Success Rate',   icon: <Star className="w-5 md:w-7 h-5 md:h-7" /> }
                ].map((s, idx) => (
                  <div key={idx} className="space-y-1 md:space-y-2">
                    <div className="flex justify-center">{s.icon}</div>
                    <div className="text-2xl md:text-4xl font-extrabold tracking-tight">{s.value}</div>
                    <div className="text-xs md:text-sm text-violet-200 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FAQ — bg-white
        ══════════════════════════════════════════ */}
        <section className="py-16 md:py-28 px-4 md:px-6 bg-white relative z-10">
          <div className="max-w-3xl mx-auto space-y-8 md:space-y-10">
            <div className="text-center space-y-3 lp-reveal">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-500">FAQ</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">Pertanyaan Umum</h2>
              <p className="text-base md:text-lg text-gray-500">Jawaban untuk pertanyaan yang sering ditanyakan</p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100 overflow-hidden lp-reveal" style={{transitionDelay:`${idx*60}ms`}}>
                  <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full px-4 md:px-6 py-4 flex items-center justify-between hover:bg-slate-100/70 transition-colors">
                    <span className="text-sm md:text-base font-bold text-slate-900 text-left">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ml-2 md:ml-3 ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 md:px-6 py-4 bg-white border-t border-slate-100">
                      <p className="text-sm md:text-base text-gray-500 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            NEWSLETTER — bg-slate-50
        ══════════════════════════════════════════ */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-slate-50 relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-2xl md:rounded-3xl p-6 md:p-12 text-white shadow-2xl text-center space-y-4 md:space-y-5">
              <h2 className="text-2xl md:text-3xl sm:text-4xl font-black tracking-tight">Dapatkan Tips Eksklusif</h2>
              <p className="text-sm md:text-base text-violet-100 leading-relaxed">Tips belajar, promo khusus, dan update fitur terbaru langsung ke email kamu</p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <input type="email" placeholder="Masukkan email kamu" className="flex-1 px-5 md:px-6 py-3 rounded-full bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/60 transition-all text-sm md:text-base" />
                <button className="px-6 md:px-8 py-3 bg-white text-violet-600 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap">Langganan</button>
              </div>
              <p className="text-xs text-violet-200">Kami tidak akan spam. Unsubscribe kapan saja.</p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FINAL CTA — bg-white
        ══════════════════════════════════════════ */}
        <section className="py-16 md:py-28 px-4 md:px-6 bg-white relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-6 md:space-y-7">
            <h2 className="text-3xl md:text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">Siap untuk lolos SNBT?</h2>
            <p className="text-base md:text-lg text-gray-500">Bergabung dengan ribuan siswa yang sudah mempersiapkan diri dengan SNBT AI</p>
            <button onClick={() => navigate('/app')} className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full hover:shadow-2xl hover:scale-105 transition-all font-bold text-base flex items-center justify-center gap-3 mx-auto group">
              {user ? 'Masuk Ke Aplikasi' : 'Coba Gratis Sekarang'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 pt-2">
              {[
                { icon: <Shield className="w-4 h-4" />, text: 'Secured by Firebase' },
                { icon: <Award className="w-4 h-4" />, text: 'SSL Encrypted' },
                { icon: <CheckCircle2 className="w-4 h-4" />, text: 'GDPR Compliant' }
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="text-violet-400">{b.icon}</span> {b.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FOOTER — bg-gray-900 (dark)
        ══════════════════════════════════════════ */}
        <footer className="py-12 md:py-20 px-4 md:px-6 bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-10 mb-10 md:mb-14">
              {/* Brand */}
              <div className="space-y-4">
                <div className="text-2xl font-extrabold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  SNBT AI
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Platform pembelajaran SNBT berbasis AI untuk lolos PTN impian
                </p>
                <div className="flex gap-2.5 pt-1">
                  {['f','𝕏','in'].map((icon, i) => (
                    <a key={i} href="#" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-violet-900 flex items-center justify-center text-gray-400 hover:text-violet-400 transition-all text-xs border border-gray-700 hover:border-violet-700">
                      {icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Fitur */}
              <div>
                <h4 className="text-sm font-bold text-gray-100 mb-4">Fitur</h4>
                <ul className="space-y-2.5">
                  {[
                    { label: 'AI Generator', path: '/app' },
                    { label: 'Tryout', path: '/dashboard/official-tryouts' },
                    { label: 'Bank Soal', path: '/dashboard/question-bank' },
                    { label: 'PTNPedia', path: '/dashboard/ptnpedia' },
                    { label: 'Vocab Mode', path: '/dashboard/vocab' }
                  ].map(item => (
                    <li key={item.label} onClick={() => navigate(item.path)} className="footer-dark-link text-sm">{item.label}</li>
                  ))}
                </ul>
              </div>

              {/* Perusahaan */}
              <div>
                <h4 className="text-sm font-bold text-gray-100 mb-4">Perusahaan</h4>
                <ul className="space-y-2.5">
                  {[
                    { label: 'Tentang Kami', path: '/about' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'Karir', path: '/careers' },
                    { label: 'Kontak', path: '/contact' }
                  ].map(item => (
                    <li key={item.label} onClick={() => navigate(item.path)} className="footer-dark-link text-sm">{item.label}</li>
                  ))}
                </ul>
              </div>

              {/* Kontak */}
              <div>
                <h4 className="text-sm font-bold text-gray-100 mb-4">Kontak</h4>
                <ul className="space-y-2.5">
                  <li className="footer-dark-link text-sm flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> support@snbtai.com</li>
                  <li className="footer-dark-link text-sm flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5" /> WhatsApp</li>
                  <li className="footer-dark-link text-sm flex items-center gap-2"><Instagram className="w-3.5 h-3.5" /> Instagram</li>
                  <li className="footer-dark-link text-sm flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> +62 XXX XXXX</li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-sm font-bold text-gray-100 mb-4">Legal</h4>
                <ul className="space-y-2.5">
                  {[
                    { label: 'Privacy Policy', path: '/privacy' },
                    { label: 'Terms of Service', path: '/terms' },
                    { label: 'About Us', path: '/about' },
                    { label: 'Contact Us', path: '/contact' }
                  ].map(item => (
                    <li key={item.label} onClick={() => navigate(item.path)} className="footer-dark-link text-sm">{item.label}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="pt-6 md:pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
              <p className="text-sm text-gray-500">© 2025 SNBT AI. All rights reserved.</p>
              <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Secured by Firebase</span>
                <span>·</span>
                <span>SSL Encrypted</span>
                <span>·</span>
                <span>GDPR Compliant</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
