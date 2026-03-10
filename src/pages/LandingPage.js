import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Target, TrendingUp, Sparkles, CheckCircle2, Users, FileText, GraduationCap, Zap, Brain, Trophy, Clock, Star, X, Coins, Crown, Flame, Quote, ChevronDown, Shield, Award, Menu, Mail, MessageSquare, Phone, Instagram } from 'lucide-react';
import { auth } from '../services/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { UnifiedNavbar } from '../components/layout/UnifiedNavbar';

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [myQuestions, setMyQuestions] = useState([]);
  const [publicQuestions, setPublicQuestions] = useState([]);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Load data for navbar
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
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  // Scroll-reveal observer
  useEffect(() => {
    const els = document.querySelectorAll('.lp-reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('lp-visible'); io.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const universities = ['UI', 'ITB', 'UGM', 'ITS', 'UNPAD', 'UNDIP', 'UNAIR', 'IPB'];

  const bentoFeatures = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Generator Soal",
      desc: "Generate soal SNBT berkualitas dari teks atau gambar. Mendukung upload hingga 5 file sekaligus (JPG, PNG, PDF) dengan OCR otomatis.",
      color: "from-violet-500 to-purple-500",
      size: "large"
    },
    {
      icon: <Target className="w-7 h-7" />,
      title: "IRT Scoring",
      desc: "Sistem penilaian profesional 200-800 seperti SNBT asli dengan percentile ranking",
      color: "from-blue-500 to-cyan-500",
      size: "small"
    },
    {
      icon: <Sparkles className="w-7 h-7" />,
      title: "Vocab Builder",
      desc: "Highlight kata langsung dari soal, spaced repetition, dan XP system untuk motivasi",
      color: "from-pink-500 to-rose-500",
      size: "small"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Tryout Profesional",
      desc: "Simulasi ujian SNBT lengkap dengan timer, IRT scoring, dan ranking. Mode ujian atau mode ngegame dengan streak & sound effects.",
      color: "from-amber-500 to-orange-500",
      size: "large"
    },
    {
      icon: <BookOpen className="w-7 h-7" />,
      title: "10K+ Soal",
      desc: "Bank soal lengkap 7 subtes (TPS, Literasi, Matematika) dengan 5 level kesulitan",
      color: "from-emerald-500 to-teal-500",
      size: "small"
    },
    {
      icon: <GraduationCap className="w-7 h-7" />,
      title: "PTNPedia",
      desc: "Database 85+ PTN dengan 1000+ prodi, daya tampung SNBP & SNBT, search & filter",
      color: "from-indigo-500 to-blue-500",
      size: "small"
    }
  ];

  const comparisonData = [
    { old: "Buku cetak statis", new: "AI Generator dinamis", icon: <Brain /> },
    { old: "Tidak ada feedback", new: "IRT Scoring real-time", icon: <Target /> },
    { old: "Belajar sendiri", new: "Community & leaderboard", icon: <Users /> },
    { old: "Mahal & terbatas", new: "Gratis & unlimited", icon: <Sparkles /> }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "0",
      coins: "20",
      features: ["1 soal/hari tanpa login", "19 soal/hari dengan login", "Akses bank soal", "Mode ngegame"],
      popular: false
    },
    {
      name: "Pro",
      price: "49K",
      coins: "100",
      features: ["100 soal AI/bulan", "Tryout unlimited", "Vocab mode premium", "Priority support"],
      popular: true
    },
    {
      name: "Ultimate",
      price: "99K",
      coins: "250",
      features: ["250 soal AI/bulan", "Semua fitur Pro", "Analytics advanced", "Certificate generator"],
      popular: false
    }
  ];

  const testimonials = [
    { name: "Aisyah Putri", school: "SMA Negeri 8 Jakarta", role: "Lolos SNBT UI 2024", avatar: "AP", text: "Dulu aku bingung mulai dari mana… sekarang udah lolos UI berkat SNBT AI! AI Generator-nya keren banget, bisa bikin soal dari materi apapun.", rating: 5, color: "from-violet-500 to-purple-500" },
    { name: "Budi Santoso", school: "SMA Negeri 3 Bandung", role: "Lolos SNBT ITB 2024", avatar: "BS", text: "IRT Scoring-nya akurat, mirip SNBT asli. Tryout-nya juga lengkap dan ranking-nya memotivasi. Recommended banget!", rating: 5, color: "from-blue-500 to-cyan-500" },
    { name: "Citra Dewi", school: "SMA Negeri 1 Yogyakarta", role: "Lolos SNBT UGM 2024", avatar: "CD", text: "Vocab Mode-nya membantu banget buat Literasi Inggris. Nilai saya naik drastis dari 450 jadi 680. Terima kasih SNBT AI!", rating: 5, color: "from-pink-500 to-rose-500" },
    { name: "Doni Wijaya", school: "SMA Negeri 2 Surabaya", role: "Lolos SNBT ITS 2024", avatar: "DW", text: "Fitur AI Lens-nya keren, bisa upload gambar langsung. Soal yang dihasilkan berkualitas dan sesuai kisi-kisi SNBT.", rating: 5, color: "from-emerald-500 to-teal-500" },
    { name: "Eka Putri", school: "SMA Negeri 5 Medan", role: "Lolos SNBT UNPAD 2024", avatar: "EP", text: "Harga koinnya terjangkau dan fitur-fiturnya lengkap. Dari gratis 19 soal/hari udah cukup untuk persiapan matang.", rating: 5, color: "from-orange-500 to-amber-500" }
  ];

  const faqs = [
    { q: "Apakah SNBT AI benar-benar gratis?", a: "Ya! Kamu bisa generate 19 soal/hari gratis dengan login. Tanpa login tetap dapat 1 soal/hari." },
    { q: "Bagaimana cara kerja AI Generator?", a: "Cukup masukkan teks/cerita atau upload gambar/PDF, AI akan otomatis membuat soal SNBT berkualitas dengan pilihan ganda dan pembahasan." },
    { q: "Apa itu IRT Scoring?", a: "Item Response Theory adalah sistem penilaian profesional (200-800) yang digunakan SNBT asli. Lebih akurat dari scoring biasa karena mempertimbangkan tingkat kesulitan soal." },
    { q: "Apakah soalnya mirip SNBT asli?", a: "Ya! Soal dibuat mengikuti kisi-kisi SNBT resmi dengan 7 subtes (TPS, Literasi, Matematika) dan 5 level kesulitan." },
    { q: "Bagaimana cara akses Tryout?", a: "Login terlebih dahulu, lalu pilih tryout dari dashboard. Tryout dibuat oleh admin dari bank soal terbaik dengan timer dan ranking." }
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F8] relative">
      {/* Animation System */}
      <style>{`
        /* ── Scroll Reveal ── */
        .lp-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.6s cubic-bezier(.22,.68,0,1.2), transform 0.6s cubic-bezier(.22,.68,0,1.2);
        }
        .lp-reveal.lp-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .lp-reveal-left {
          opacity: 0; transform: translateX(-24px);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .lp-reveal-left.lp-visible { opacity: 1; transform: translateX(0); }
        .lp-reveal-scale {
          opacity: 0; transform: scale(0.94);
          transition: opacity 0.5s ease, transform 0.5s cubic-bezier(.22,.68,0,1.3);
        }
        .lp-reveal-scale.lp-visible { opacity: 1; transform: scale(1); }

        /* Stagger helpers */
        .lp-d-0   { transition-delay: 0ms; }
        .lp-d-80  { transition-delay: 80ms; }
        .lp-d-160 { transition-delay: 160ms; }
        .lp-d-240 { transition-delay: 240ms; }
        .lp-d-320 { transition-delay: 320ms; }
        .lp-d-400 { transition-delay: 400ms; }
        .lp-d-480 { transition-delay: 480ms; }

        /* ── Hero entrance ── */
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

        .lp-orb        { animation: lpFloatOrb 9s ease-in-out infinite; }
        .lp-orb-2      { animation: lpFloatOrb 12s ease-in-out infinite reverse; }
        .lp-orb-3      { animation: lpFloatOrb 7s ease-in-out infinite; animation-delay: 3s; }

        /* ── Premium Shadow System ── */
        .lp-shadow {
          box-shadow:
            0 1px 2px rgba(0,0,0,0.04),
            0 4px 14px rgba(0,0,0,0.05),
            0 8px 28px rgba(0,0,0,0.04);
        }
        .lp-card-hover {
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .lp-card-hover:hover {
          transform: translateY(-4px);
          box-shadow:
            0 2px 4px rgba(0,0,0,0.05),
            0 12px 32px rgba(124,58,237,0.12),
            0 20px 48px rgba(99,102,241,0.09);
        }
        .lp-stat-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .lp-stat-hover:hover {
          transform: translateY(-3px) scale(1.01);
          box-shadow: 0 8px 28px rgba(124,58,237,0.16);
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
          box-shadow: 0 12px 40px rgba(124,58,237,0.10);
        }
        .lp-faq-answer {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.35s cubic-bezier(.22,.68,0,1), opacity 0.3s ease;
          opacity: 0;
        }
        .lp-faq-answer.open {
          max-height: 200px;
          opacity: 1;
        }
      `}</style>

      {/* Background floating orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="lp-orb   absolute top-[-10%] left-[-10%]  w-[40%] h-[40%] bg-violet-400/15 rounded-full blur-[120px]" />
        <div className="lp-orb-2 absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-400/15 rounded-full blur-[120px]" />
        <div className="lp-orb-3 absolute top-[40%] right-[10%]   w-[25%] h-[25%] bg-purple-300/10  rounded-full blur-[100px]" />
      </div>
      {/* Unified Navbar */}
      <UnifiedNavbar
        user={user}
        onLogin={() => navigate('/app')}
        onLogout={() => {
          auth.signOut();
          setUser(null);
        }}
        navigate={navigate}
        setView={() => {}}
        onBuyCoin={() => navigate('/ambis-coin')}
        dailyUsage={attempts.filter(a => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const attemptDate = a.finishedAt?.seconds ? new Date(a.finishedAt.seconds * 1000) : new Date();
          attemptDate.setHours(0, 0, 0, 0);
          return attemptDate.getTime() === today.getTime();
        }).length}
        totalQuestionsInBank={publicQuestions.length}
        remainingQuota={19 - attempts.filter(a => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const attemptDate = a.finishedAt?.seconds ? new Date(a.finishedAt.seconds * 1000) : new Date();
          attemptDate.setHours(0, 0, 0, 0);
          return attemptDate.getTime() === today.getTime();
        }).length}
        isAdmin={false}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        variant="default"
      />

      {/* Hero Section with Floating Badge */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden z-10">
      <div className="absolute top-32 right-10 lp-float-badge z-10">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl px-4 py-2 shadow-lg border border-violet-100">
            <div className="flex items-center gap-2 text-sm">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-semibold text-slate-700">1.240 soal dibuat hari ini</span>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <div className="inline-block mb-4 lp-hero-badge">
              <div className="bg-gradient-to-r from-violet-100 to-indigo-100 border border-violet-200 rounded-full px-6 py-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-600" />
                <span className="text-sm font-semibold text-violet-700">Platform Belajar SNBT No. 1 di Indonesia</span>
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] text-slate-900 mt-2 lp-hero-h1">
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Ubah Cerita Apapun</span>
              <br />
              Menjadi Soal SNBT Realistis
            </h1>
            <p className="text-lg sm:text-xl text-slate-500 leading-[1.6] max-w-3xl mx-auto font-medium mt-6 lp-hero-sub">
              Masukkan teks atau upload gambar, AI akan mengubahnya menjadi soal SNBT berkualitas dengan pembahasan lengkap.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6 lp-hero-cta">
              <button 
                onClick={() => navigate('/app')}
                className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full hover:shadow-2xl hover:scale-105 transition-all font-bold flex items-center justify-center gap-2 group"
              >
                {user ? 'Masuk Ke Aplikasi' : 'Mulai Belajar Gratis'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => document.querySelector('[data-section="how-it-works"]').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-full hover:border-violet-300 hover:bg-slate-50 transition-all font-semibold shadow-sm"
              >
                Lihat Cara Kerja
              </button>
            </div>
          </div>

          {/* Stats Cards with Glassmorphism */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto lp-hero-stats">
            {[
              { value: "10K+", label: "Soal Latihan", icon: <FileText className="w-5 h-5" /> },
              { value: "1K+", label: "Siswa Aktif", icon: <Users className="w-5 h-5" /> },
              { value: "85+", label: "PTN Tersedia", icon: <GraduationCap className="w-5 h-5" /> }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-slate-100 lp-shadow lp-stat-hover">
                <div className="flex items-center gap-3 mb-2 text-violet-600">
                  {stat.icon}
                <div className="text-stat font-extrabold tracking-tight text-violet-600">{stat.value}</div>
                </div>
                <div className="text-body-sm text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee Logo Universities */}
      <section className="py-16 bg-slate-50 border-y border-slate-100 overflow-hidden">
        <div className="text-center mb-8">
          <p className="text-label text-slate-400 uppercase">Dipercayai oleh siswa dari</p>
        </div>
        <div className="flex animate-marquee whitespace-nowrap">
          {[...universities, ...universities].map((uni, idx) => (
            <div key={idx} className="mx-8 text-3xl font-bold text-slate-300 hover:text-slate-400 transition-colors">
              {uni}
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto lp-reveal">
            <h2 className="text-h1 text-slate-900">
              Semua yang kamu butuhkan
            </h2>
            <p className="text-body-lg text-slate-500">
              Fitur lengkap untuk persiapan SNBT yang maksimal
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {bentoFeatures.map((feature, idx) => (
              <div 
                key={idx} 
                className={`lp-reveal lp-d-${idx * 80} group ${feature.size === 'large' ? 'md:col-span-2 md:row-span-2' : 'md:col-span-2'} bg-white rounded-3xl p-8 border border-slate-100 lp-shadow lp-card-hover cursor-pointer`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-h3 text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-body text-slate-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-32 px-6 bg-slate-50/50 relative z-10">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4 lp-reveal">
            <h2 className="text-h1 text-slate-900">
              Cara Lama vs SNBT AI
            </h2>
            <p className="text-body-lg text-slate-500">Lihat perbedaan signifikan dalam belajar</p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mt-12 mb-12">
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
              <div className="p-8 bg-slate-50">
                <div className="text-center text-label text-slate-500">Fitur</div>
              </div>
              <div className="p-8 bg-red-50">
                <div className="text-center font-bold text-red-600 uppercase text-sm tracking-wide flex items-center justify-center gap-2">
                  <X className="w-4 h-4" /> Cara Lama
                </div>
              </div>
              <div className="p-8 bg-violet-50">
                <div className="text-center font-bold text-violet-600 uppercase text-sm tracking-wide flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> SNBT AI
                </div>
              </div>
            </div>
            
            {comparisonData.map((item, idx) => (
              <div key={idx} className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 border-t border-slate-200 lp-reveal" style={{transitionDelay:`${idx*70}ms`}}>
                <div className="p-6 flex items-center justify-center text-slate-400">
                  {item.icon}
                </div>
                <div className="p-6 text-center text-slate-600">{item.old}</div>
                <div className="p-6 text-center font-semibold text-slate-900">{item.new}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 px-6 bg-slate-50/50 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4 lp-reveal">
            <h2 className="text-h1 text-slate-900">Apa Kata Mereka?</h2>
            <p className="text-body-lg text-slate-500">Ribuan siswa sudah lolos PTN impian dengan SNBT AI</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-100 lp-shadow lp-testimonial-hover lp-reveal" style={{transitionDelay:`${idx*70}ms`}}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="text-body-sm font-bold text-slate-900">{testimonial.name}</div>
                    <div className="text-caption text-slate-400">{testimonial.school}</div>
                    <div className="text-caption font-semibold text-violet-600 mt-1">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-body-sm text-slate-500 leading-relaxed italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works with Visual Connection */}
      <section data-section="how-it-works" className="py-32 px-6 relative z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4 lp-reveal">
            <h2 className="text-h1 text-slate-900">Cara Kerja Platform</h2>
            <p className="text-body-lg text-slate-500">Mulai belajar dalam 3 langkah mudah</p>
          </div>
          
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-violet-200 via-purple-200 to-indigo-200 -translate-y-1/2 -z-10"></div>
            
            <div className="grid md:grid-cols-3 gap-16">
              {[
                { num: "1", title: "Pilih Materi", desc: "Pilih dari 7 subtes SNBT", icon: <BookOpen /> },
                { num: "2", title: "Kerjakan Soal", desc: "Mode ujian atau interaktif", icon: <Target /> },
                { num: "3", title: "Lihat Hasil", desc: "Analisis dengan IRT scoring", icon: <TrendingUp /> }
              ].map((step, idx) => (
                <div key={idx} className="relative lp-reveal" style={{transitionDelay:`${idx*120}ms`}}>
                  <div className="bg-white rounded-3xl p-8 border-2 border-slate-100 hover:border-violet-200 lp-shadow lp-card-hover">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg">
                      {step.num}
                    </div>
                    <div className="mb-4 text-violet-600">{step.icon}</div>
                    <h3 className="text-h3 text-slate-900 mb-3">{step.title}</h3>
                    <p className="text-body text-slate-500">{step.desc}</p>
                  </div>
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-8 -right-8 w-8 h-8 text-violet-300">
                      <ArrowRight className="w-full h-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Mid-page CTA */}
          <div className="mt-16 text-center">
            <button 
              onClick={() => navigate('/app')}
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full hover:shadow-2xl hover:scale-105 transition-all text-btn-lg flex items-center justify-center gap-2 group mx-auto"
            >
              Coba Gratis Sekarang
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Unique Value Proposition */}
      <section className="py-32 px-6 bg-gradient-to-br from-violet-50 to-indigo-50 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4 lp-reveal">
            <h2 className="text-h1 text-slate-900">Mengapa Memilih SNBT AI?</h2>
            <p className="text-body-lg text-slate-500">Keunggulan yang tidak dimiliki platform lain</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: <Brain className="w-8 h-8" />, title: "AI Dinamis & Adaptif", desc: "Generate soal unlimited dengan AI yang terus belajar dari pola jawaban kamu" },
              { icon: <Target className="w-8 h-8" />, title: "IRT Scoring Real-time", desc: "Sistem penilaian profesional 200-800 seperti SNBT asli, bukan scoring biasa" },
              { icon: <Users className="w-8 h-8" />, title: "Komunitas Aktif", desc: "Berbagi tips, diskusi soal, dan kompetisi dengan ribuan siswa lain" },
              { icon: <Sparkles className="w-8 h-8" />, title: "Harga Terjangkau", desc: "Gratis 19 soal/hari atau paket koin mulai 49K dengan unlimited tryout" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 border border-slate-100 lp-shadow lp-card-hover lp-reveal" style={{transitionDelay:`${idx*80}ms`}}>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white mb-4">
                  {item.icon}
                </div>
                <h3 className="text-h4 text-slate-900 mb-2">{item.title}</h3>
                <p className="text-body text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4 lp-reveal">
            <h2 className="text-h1 text-slate-900">Tips Lolos SNBT 2025</h2>
            <p className="text-body-lg text-slate-500">Artikel terbaru untuk persiapan maksimal</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Strategi Belajar Efektif 3 Bulan Sebelum Ujian", excerpt: "Pelajari cara membagi waktu belajar, fokus pada subtes lemah, dan maksimalkan retention dengan spaced repetition...", date: "15 Jan 2025", category: "Strategi" },
              { title: "Kesalahan Umum Saat Mengerjakan Soal Literasi", excerpt: "Jangan terjebak dalam 5 kesalahan fatal yang sering dilakukan siswa saat mengerjakan soal Literasi Indonesia & Inggris...", date: "12 Jan 2025", category: "Tips" },
              { title: "Cara Memaksimalkan Fitur Vocab Builder", excerpt: "Teknik highlight-to-save, spaced repetition algorithm, dan XP system untuk meningkatkan vocabulary secara konsisten...", date: "10 Jan 2025", category: "Fitur" }
            ].map((article, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-slate-100 lp-shadow lp-card-hover cursor-pointer group lp-reveal" style={{transitionDelay:`${idx*90}ms`}}>
                <div className="h-40 bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-violet-300" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-3 py-1 rounded-full">{article.category}</span>
                    <span className="text-xs text-slate-500">{article.date}</span>
                  </div>
                  <h3 className="text-h4 text-slate-900 mb-3 group-hover:text-violet-600 transition-colors">{article.title}</h3>
                  <p className="text-body-sm text-slate-500 mb-4 line-clamp-2">{article.excerpt}</p>
                  <button className="text-violet-600 font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                    Baca Selengkapnya
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 bg-violet-50/30 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4 lp-reveal">
            <h2 className="text-h1 text-slate-900">Paket Koin Mayar</h2>
            <p className="text-body-lg text-slate-500">Pilih paket yang sesuai dengan kebutuhan belajar kamu</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, idx) => (
              <div 
                key={idx} 
                className={`lp-reveal lp-pricing-hover lp-d-${idx * 80} relative bg-white rounded-3xl p-8 border-2 ${plan.popular ? 'border-violet-500 shadow-2xl scale-105 popular-card' : 'border-slate-200 shadow-sm'} hover:shadow-xl transition-all`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Crown className="w-4 h-4" /> Paling Populer
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="flex items-end justify-center gap-1 mb-2">
                    <span className="text-stat font-extrabold tracking-tight text-slate-900">{plan.price}</span>
                    {plan.price !== "0" && <span className="text-slate-600 mb-2">/bulan</span>}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-violet-600">
                    <Coins className="w-5 h-5" />
                    <span className="font-semibold">{plan.coins} Koin</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => navigate('/app')}
                  className={`w-full py-3 rounded-full font-bold transition-all ${plan.popular ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg hover:scale-105' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  Mulai Sekarang
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-3xl p-12 text-white shadow-2xl">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { value: "10,000+", label: "Soal Tersedia", icon: <FileText className="w-8 h-8" /> },
                { value: "1,000+", label: "Siswa Aktif", icon: <Users className="w-8 h-8" /> },
                { value: "85+", label: "PTN Database", icon: <GraduationCap className="w-8 h-8" /> },
                { value: "95%", label: "Success Rate", icon: <Star className="w-8 h-8" /> }
              ].map((stat, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-center">{stat.icon}</div>
                  <div className="text-stat font-extrabold tracking-tight">{stat.value}</div>
                  <div className="text-body-sm text-violet-100 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6 bg-slate-50/50 relative z-10">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4 lp-reveal">
            <h2 className="text-h1 text-slate-900">Pertanyaan Umum</h2>
            <p className="text-body-lg text-slate-500">Jawaban untuk pertanyaan yang sering ditanyakan</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-100 overflow-hidden lp-shadow lp-reveal" style={{transitionDelay:`${idx*60}ms`}}>
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <span className="text-body font-bold text-slate-900 text-left">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                    <p className="text-body text-slate-500 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-3xl p-12 text-white shadow-2xl">
            <div className="text-center space-y-6">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tighter">Dapatkan Tips Eksklusif</h2>
              <p className="text-body text-violet-100 leading-relaxed">Berlangganan newsletter kami untuk mendapatkan tips belajar, promo khusus, dan update fitur terbaru langsung ke email kamu</p>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <input 
                  type="email" 
                  placeholder="Masukkan email kamu" 
                  className="flex-1 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/60 transition-all"
                />
                <button className="px-8 py-3 bg-white text-violet-600 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap">
                  Langganan
                </button>
              </div>
              <p className="text-xs text-violet-100">Kami tidak akan spam. Unsubscribe kapan saja.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 px-6 bg-slate-50/50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { icon: <Shield className="w-8 h-8" />, title: "Secured by Firebase", desc: "Database terenkripsi dengan standar enterprise" },
              { icon: <Award className="w-8 h-8" />, title: "SSL Encrypted", desc: "Semua data ditransmisikan dengan enkripsi tingkat bank" },
              { icon: <CheckCircle2 className="w-8 h-8" />, title: "GDPR Compliant", desc: "Privasi data pengguna terjamin sesuai regulasi" }
            ].map((badge, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex justify-center text-violet-600">{badge.icon}</div>
                <div className="font-bold text-slate-900">{badge.title}</div>
                <div className="text-sm text-slate-600">{badge.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 bg-slate-50/50 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-h1 text-slate-900">
            Siap untuk lolos SNBT?
          </h2>
          <p className="text-body-lg text-slate-500">
            Bergabung dengan ribuan siswa yang sudah mempersiapkan diri dengan SNBT AI
          </p>
          <button 
            onClick={() => navigate('/app')}
            className="px-12 py-5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full hover:shadow-2xl hover:scale-105 transition-all text-btn-lg flex items-center justify-center gap-3 mx-auto group min-h-14"
          >
            {user ? 'Masuk Ke Aplikasi' : 'Mulai Belajar Sekarang'}
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="space-y-4">
              <div className="text-2xl font-extrabold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                SNBT AI
              </div>
              <p className="text-body-sm text-slate-500 leading-relaxed">
                Platform pembelajaran SNBT berbasis AI untuk lolos PTN impian
              </p>
              <div className="flex gap-3 pt-2">
                <a href="#" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-violet-100 flex items-center justify-center text-slate-600 hover:text-violet-600 transition-all text-sm">f</a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-violet-100 flex items-center justify-center text-slate-600 hover:text-violet-600 transition-all text-sm">𝕏</a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-violet-100 flex items-center justify-center text-slate-600 hover:text-violet-600 transition-all text-sm">in</a>
              </div>
            </div>
            <div>
              <h4 className="text-body-sm font-bold text-slate-900 mb-4">Fitur</h4>
              <ul className="space-y-2 text-body-sm text-slate-500">
                <li onClick={() => navigate('/app')} className="hover:text-violet-600 cursor-pointer transition-colors">AI Generator</li>
                <li onClick={() => navigate('/dashboard/official-tryouts')} className="hover:text-violet-600 cursor-pointer transition-colors">Tryout</li>
                <li onClick={() => navigate('/dashboard/question-bank')} className="hover:text-violet-600 cursor-pointer transition-colors">Bank Soal</li>
                <li onClick={() => navigate('/dashboard/ptnpedia')} className="hover:text-violet-600 cursor-pointer transition-colors">PTNPedia</li>
                <li onClick={() => navigate('/dashboard/vocab')} className="hover:text-violet-600 cursor-pointer transition-colors">Vocab Mode</li>
              </ul>
            </div>
            <div>
              <h4 className="text-body-sm font-bold text-slate-900 mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-body-sm text-slate-500">
                <li onClick={() => navigate('/about')} className="hover:text-violet-600 cursor-pointer transition-colors">Tentang Kami</li>
                <li onClick={() => navigate('/blog')} className="hover:text-violet-600 cursor-pointer transition-colors">Blog</li>
                <li onClick={() => navigate('/careers')} className="hover:text-violet-600 cursor-pointer transition-colors">Karir</li>
                <li onClick={() => navigate('/contact')} className="hover:text-violet-600 cursor-pointer transition-colors">Kontak</li>
              </ul>
            </div>
            <div>
              <h4 className="text-body-sm font-bold text-slate-900 mb-4">Kontak</h4>
              <ul className="space-y-2 text-body-sm text-slate-500">
                <li className="hover:text-violet-600 cursor-pointer transition-colors flex items-center gap-2"><Mail className="w-4 h-4" /> support@snbtai.com</li>
                <li className="hover:text-violet-600 cursor-pointer transition-colors flex items-center gap-2"><MessageSquare className="w-4 h-4" /> WhatsApp</li>
                <li className="hover:text-violet-600 cursor-pointer transition-colors flex items-center gap-2"><Instagram className="w-4 h-4" /> Instagram</li>
                <li className="hover:text-violet-600 cursor-pointer transition-colors flex items-center gap-2"><Phone className="w-4 h-4" /> +62 XXX XXXX</li>
              </ul>
            </div>
            <div>
              <h4 className="text-body-sm font-bold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-body-sm text-slate-500">
                <li onClick={() => navigate('/privacy')} className="hover:text-violet-600 cursor-pointer transition-colors">Privacy Policy</li>
                <li onClick={() => navigate('/terms')} className="hover:text-violet-600 cursor-pointer transition-colors">Terms of Service</li>
                <li onClick={() => navigate('/about')} className="hover:text-violet-600 cursor-pointer transition-colors">About Us</li>
                <li onClick={() => navigate('/contact')} className="hover:text-violet-600 cursor-pointer transition-colors">Contact Us</li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-body-sm text-slate-500">© 2025 SNBT AI. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Secured by Firebase</span>
              <span>•</span>
              <span>SSL Encrypted</span>
              <span>•</span>
              <span>GDPR Compliant</span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default LandingPage;