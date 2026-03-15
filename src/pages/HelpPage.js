import React, { useEffect, useState } from 'react';
import { BookOpen, ChevronLeft, Zap, Trophy, Users, Sparkles, Heart, TrendingUp, CheckCircle, AlertCircle, Cpu, Shield, Rocket, Key, Gamepad2, FileText, Lightbulb, HelpCircle, Target, Edit3, BarChart3, GitBranch, PieChart, XCircle, Camera, Coins, GraduationCap } from 'lucide-react';

const Logo = ({ size = 40 }) => (
  <div className="flex items-center gap-3">
    <div className="relative">
      <div 
        className="rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-sm overflow-hidden"
        style={{ width: size, height: size }}
      >
        <Sparkles className="text-white" size={size * 0.6} strokeWidth={2} />
      </div>
    </div>
    <div className="flex flex-col">
      <span className="font-bold text-lg leading-none text-slate-900">SNBT AI</span>
      <span className="text-xs leading-none text-slate-500">AI-Powered Learning</span>
    </div>
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
  const baseStyle = "px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95";
  const variants = {
    secondary: "bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50 hover:border-primary/30 shadow-sm"
  };
  return <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>{children}</button>;
};

const SectionCard = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 ${className}`}>{children}</div>
);

export const HelpView = ({ onBack }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
  <div className={`min-h-screen bg-[#F3F4F8] p-4 font-sans relative overflow-x-hidden transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="lp-orb absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-400/15 rounded-full blur-[120px]" />
      <div className="lp-orb-2 absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-400/15 rounded-full blur-[120px]" />
      <div className="lp-orb-3 absolute top-[40%] right-[10%] w-[25%] h-[25%] bg-purple-300/10 rounded-full blur-[100px]" />
    </div>
    <style>{`
      @keyframes lpFloatOrb {
        0%, 100% { transform: translate(0,0) scale(1); }
        50% { transform: translate(12px,-16px) scale(1.06); }
      }
      .lp-orb { animation: lpFloatOrb 9s ease-in-out infinite; }
      .lp-orb-2 { animation: lpFloatOrb 12s ease-in-out infinite reverse; }
      .lp-orb-3 { animation: lpFloatOrb 7s ease-in-out infinite; animation-delay: 3s; }
      
      @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(18px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .anim-fade-up { animation: fadeSlideUp 0.5s cubic-bezier(.22,.68,0,1.2) both; }
      
      .delay-0 { animation-delay: 0ms; }
      .delay-50 { animation-delay: 50ms; }
      .delay-100 { animation-delay: 100ms; }
      .delay-150 { animation-delay: 150ms; }
      .delay-200 { animation-delay: 200ms; }
      .delay-250 { animation-delay: 250ms; }
      .delay-300 { animation-delay: 300ms; }
      .delay-350 { animation-delay: 350ms; }
      .delay-400 { animation-delay: 400ms; }
    `}</style>
    
    <div className="max-w-4xl mx-auto relative z-10">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="secondary" onClick={() => { onBack(); window.history.pushState({}, '', '/'); }}>
            <ChevronLeft size={18} /> Kembali
          </Button>
          <Logo size={32} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Panduan SNBT AI 2026</h1>
        <p className="text-sm sm:text-base text-slate-600">Platform AI untuk latihan soal UTBK-SNBT dengan sistem login & community</p>
      </div>
      
      <div className="grid gap-6">
        <SectionCard className="anim-fade-up delay-0">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Rocket size={22} className="text-[#8338e9]" />
            Cara Menggunakan (Mudah!)
          </h2>
          <div className="space-y-4 text-slate-700">
            <div className="flex gap-3">
              <span className="bg-violet-100 text-[#8338e9] w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              <div>
                <h3 className="font-semibold text-base">Pilih Mata Pelajaran</h3>
                <p className="text-sm text-slate-600">Ada 7 pilihan: Penalaran Umum, Bahasa Indonesia, Bahasa Inggris, Matematika, dll.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="bg-violet-100 text-[#8338e9] w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              <div>
                <h3 className="font-semibold text-base">Tulis Cerita Singkat</h3>
                <p className="text-sm text-slate-600">Minimal 20 huruf. Contoh: "Harga beras naik 20%, gaji tetap" - AI akan ubah jadi soal UTBK!</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="bg-violet-100 text-[#8338e9] w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              <div>
                <h3 className="font-semibold text-base">Pilih Tingkat Kesulitan</h3>
                <p className="text-sm text-slate-600">Level 1 (Mudah) sampai Level 5 (Sangat Sulit). Sesuaikan dengan kemampuanmu!</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="bg-violet-100 text-[#8338e9] w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
              <div>
                <h3 className="font-semibold text-base">Pilih Mode</h3>
                <p className="text-sm text-slate-600">Mode Ujian (serius, ada timer) atau Mode Game (seru, ada nyawa & poin)</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="bg-violet-100 text-[#8338e9] w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">5</span>
              <div>
                <h3 className="font-semibold text-base">Klik Generate & Kerjakan!</h3>
                <p className="text-sm text-slate-600">Tunggu sebentar, jawab kuis pemanasan, lalu kerjakan 5 soal dengan pembahasan lengkap</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="bg-violet-100 text-[#8338e9] w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">6</span>
              <div>
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <Camera size={16} className="text-[#8338e9]" />
                  Gunakan AI Lens (Opsional)
                </h3>
                <p className="text-sm text-slate-600">Punya soal sulit di buku cetak? Foto saja menggunakan fitur AI Lens, dan AI kami akan mengekstrak logika soal tersebut lalu membuatkan variasi soal baru yang mirip untuk kamu berlatih.</p>
              </div>
            </div>
          </div>
        </SectionCard>
        
        <SectionCard className="anim-fade-up delay-50">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Sparkles size={22} className="text-[#8338e9]" />
            Fitur Premium (Gratis di Masa Beta!)
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Coins size={20} className="text-amber-600" />
                </div>
                <h3 className="font-bold text-gray-800">Ambis Coin</h3>
              </div>
              <p className="text-sm text-slate-600">Sistem mata uang platform kami. Gunakan koin ini untuk men-generate soal.</p>
              <div className="mt-3 px-3 py-2 bg-amber-100/50 rounded-lg border border-amber-200">
                <p className="text-xs font-medium text-amber-800">🎉 Selama masa Beta (Maret-April), semua paket koin gratis 100%!</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Camera size={20} className="text-violet-600" />
                </div>
                <h3 className="font-bold text-gray-800">AI Lens</h3>
              </div>
              <p className="text-sm text-slate-600">Punya soal sulit di buku cetak? Foto saja menggunakan fitur AI Lens, dan AI kami akan mengekstrak logika soal tersebut lalu membuatkan variasi soal baru yang mirip untuk kamu berlatih.</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <GraduationCap size={20} className="text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-800">PTNPedia</h3>
              </div>
              <p className="text-sm text-slate-600">Jangan asal pilih jurusan! Gunakan PTNPedia untuk menganalisis rasio keketatan, daya tampung, dan probabilitas masuk ke 76+ Universitas Negeri di Indonesia.</p>
            </div>
          </div>
        </SectionCard>
        
        <SectionCard className="anim-fade-up delay-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Key size={22} className="text-[#8338e9]" />
            Kenapa Harus Login?
          </h2>
          <div className="space-y-4 text-slate-700">
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <p className="text-sm text-red-800 font-medium mb-2 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500" />
                Tanpa Login:
              </p>
              <p className="text-sm text-red-700 flex items-center gap-2">Cuma bisa buat 1 soal per hari</p>
            </div>
            <div className="bg-violet-50 p-4 rounded-lg border border-violet-200">
              <p className="text-sm text-violet-800 font-medium mb-2 flex items-center gap-2">
                <Sparkles size={16} className="text-[#8338e9]" />
                Dengan Login (Gratis!):
              </p>
              <ul className="text-sm text-violet-700 space-y-2">
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#8338e9]" /> Buat 20 soal per hari</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#8338e9]" /> Simpan semua soal yang pernah dibuat</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#8338e9]" /> Lihat soal dari pengguna lain</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#8338e9]" /> Lacak progress belajarmu</li>
              </ul>
            </div>
          </div>
        </SectionCard>
        
        <SectionCard className="anim-fade-up delay-150">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Gamepad2 size={22} className="text-[#8338e9]" />
            Dua Mode Belajar
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-slate-700">
            <div className="bg-teal-50 p-5 rounded-xl border border-teal-200">
              <h3 className="font-semibold text-base text-teal-700 mb-3 flex items-center gap-2">
                <Gamepad2 size={18} className="text-teal-600" />
                Mode Game (Seru!)
              </h3>
              <ul className="text-sm space-y-2 text-slate-600">
                <li className="flex items-center gap-2"><Heart size={14} className="text-rose-500" /> Punya 3 nyawa</li>
                <li className="flex items-center gap-2"><Zap size={14} className="text-amber-500" /> Jawab benar berturut = bonus poin</li>
                <li className="flex items-center gap-2"><Sparkles size={14} className="text-violet-500" /> Ada musik & efek suara</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-teal-500" /> Langsung tahu benar/salah</li>
              </ul>
            </div>
            <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-200">
              <h3 className="font-semibold text-base text-indigo-700 mb-3 flex items-center gap-2">
                <FileText size={18} className="text-indigo-600" />
                Mode Ujian (Serius)
              </h3>
              <ul className="text-sm space-y-2 text-slate-600">
                <li className="flex items-center gap-2"><AlertCircle size={14} className="text-indigo-500" /> Ada timer hitung mundur</li>
                <li className="flex items-center gap-2"><BookOpen size={14} className="text-indigo-500" /> Bisa tandai soal ragu-ragu</li>
                <li className="flex items-center gap-2"><TrendingUp size={14} className="text-indigo-500" /> Pembahasan lengkap di akhir</li>
                <li className="flex items-center gap-2"><Shield size={14} className="text-indigo-500" /> Progress tersimpan (login)</li>
                <li className="flex items-center gap-2"><Target size={14} className="text-[#8338e9]" /> Real-time IRT scoring</li>
                <li className="flex items-center gap-2"><BookOpen size={14} className="text-emerald-500" /> Vocab Vault tersedia</li>
              </ul>
              <div className="mt-3 px-3 py-2 bg-indigo-100/50 rounded-lg border border-indigo-200">
                <p className="text-xs text-indigo-700">Sistem penilaian menggunakan Real-time IRT (Item Response Theory) yang sama dengan UTBK asli.</p>
              </div>
            </div>
          </div>
        </SectionCard>
        
        <SectionCard className="anim-fade-up delay-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Sparkles size={20} className="text-[#8338e9]" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Mode Presisi</h2>
          </div>
          <p className="text-sm text-slate-600 mb-6">Instruksi khusus untuk menghasilkan soal yang lebih spesifik sesuai kebutuhanmu.</p>
          <div className="space-y-4">
            <div className="border-l-4 border-[#8338e9] bg-purple-50/50 p-4 rounded-r-lg">
              <p className="text-sm font-semibold text-gray-800 mb-3">Cara Menggunakan</p>
              <ol className="text-sm text-slate-600 space-y-2">
                <li className="flex gap-3"><span className="text-[#8338e9] font-semibold">1.</span> Tulis konteks seperti biasa</li>
                <li className="flex gap-3"><span className="text-[#8338e9] font-semibold">2.</span> Isi kolom Mode Presisi dengan instruksi spesifik</li>
                <li className="flex gap-3"><span className="text-[#8338e9] font-semibold">3.</span> Atau gunakan tombol preset yang tersedia</li>
                <li className="flex gap-3"><span className="text-[#8338e9] font-semibold">4.</span> Klik Generate Soal</li>
              </ol>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="flex gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <BarChart3 size={18} className="text-[#8338e9] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Grafik & Tabel</p>
                  <p className="text-xs text-slate-500 mt-0.5">Visualisasi data dalam bentuk grafik</p>
                </div>
              </div>
              <div className="flex gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <Target size={18} className="text-[#8338e9] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Perbandingan</p>
                  <p className="text-xs text-slate-500 mt-0.5">Fokus pada rasio dan proporsi</p>
                </div>
              </div>
              <div className="flex gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <GitBranch size={18} className="text-[#8338e9] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Flowchart</p>
                  <p className="text-xs text-slate-500 mt-0.5">Diagram alur proses logika</p>
                </div>
              </div>
              <div className="flex gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <PieChart size={18} className="text-[#8338e9] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Statistik</p>
                  <p className="text-xs text-slate-500 mt-0.5">Analisis data dan statistik</p>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
        
        <SectionCard className="anim-fade-up delay-250">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <HelpCircle size={22} className="text-[#8338e9]" />
            Pertanyaan Umum (FAQ)
          </h2>
          <div className="space-y-4 text-slate-700">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-sm text-gray-800 font-semibold mb-1">Q: Berapa soal yang bisa saya buat?</p>
              <p className="text-sm text-slate-600">A: Tanpa login = 1 soal/hari. Dengan login = 20 soal/hari (gratis!)</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-sm text-gray-800 font-semibold mb-1">Q: Apa bedanya Gemini dan Gemma?</p>
              <p className="text-sm text-slate-600">A: Gemini (Terbaik) lebih cepat dan akurat. Gemma (Alternatif) dipakai kalau Gemini penuh.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-sm text-gray-800 font-semibold mb-1">Q: Soal saya tersimpan nggak?</p>
              <p className="text-sm text-slate-600">A: Kalau sudah login, semua soal otomatis tersimpan. Bisa diakses di Dashboard.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p className="text-sm text-gray-800 font-semibold mb-1">Q: Bisa lihat soal orang lain?</p>
              <p className="text-sm text-slate-600">A: Bisa! Login dulu, lalu buka menu Community.</p>
            </div>
          </div>
        </SectionCard>
        
        <SectionCard className="anim-fade-up delay-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <Edit3 size={20} className="text-rose-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Panduan Menulis Prompt</h2>
          </div>
          <div className="space-y-6">
            <div className="border-l-4 border-slate-400 bg-slate-50/50 p-4 rounded-r-lg">
              <p className="text-sm font-semibold text-gray-800 mb-3">Aturan Dasar</p>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex gap-2"><span className="text-slate-400">•</span> Minimal 20 karakter</div>
                <div className="flex gap-2"><span className="text-slate-400">•</span> Tulis dengan jelas dan spesifik</div>
                <div className="flex gap-2"><span className="text-slate-400">•</span> Sertakan angka atau data</div>
                <div className="flex gap-2"><span className="text-slate-400">•</span> Sesuaikan dengan subtes</div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={18} className="text-teal-600" />
                <p className="text-sm font-semibold text-gray-800">Contoh Baik</p>
              </div>
              <div className="space-y-3">
                <div className="bg-teal-50/50 border border-teal-200 rounded-lg p-4">
                  <p className="text-xs font-medium text-teal-900 mb-2">Penalaran Matematika</p>
                  <p className="text-sm text-slate-700">"Sebuah toko menjual buku dengan harga Rp50.000. Jika diberi diskon 20%, lalu ditambah pajak 10%, berapa harga akhir?"</p>
                </div>
                <div className="bg-teal-50/50 border border-teal-200 rounded-lg p-4">
                  <p className="text-xs font-medium text-teal-900 mb-2">Penalaran Umum</p>
                  <p className="text-sm text-slate-700">"Urbanisasi menyebabkan kepadatan Jakarta mencapai 15.342 jiwa/km². Dampaknya adalah polusi udara meningkat dan lahan hijau berkurang."</p>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <XCircle size={18} className="text-rose-600" />
                <p className="text-sm font-semibold text-gray-800">Contoh Kurang Baik</p>
              </div>
              <div className="space-y-2">
                <div className="bg-red-50/50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
                  <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-700">"Ekonomi lagi susah"</p>
                    <p className="text-xs text-red-600 mt-1">Terlalu pendek dan tidak spesifik</p>
                  </div>
                </div>
                <div className="bg-red-50/50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
                  <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-700">"Hitung luas"</p>
                    <p className="text-xs text-red-600 mt-1">Tidak ada konteks</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-l-4 border-amber-500 bg-amber-50/50 p-4 rounded-r-lg">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={18} className="text-amber-600" />
                <p className="text-sm font-semibold text-gray-800">Tips Profesional</p>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex gap-2"><CheckCircle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" /> <span>Sertakan angka untuk konteks lebih jelas</span></div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" /> <span>Jelaskan situasi atau masalah yang ada</span></div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" /> <span>Gunakan Mode Presisi untuk hasil optimal</span></div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" /> <span>Sesuaikan level dengan kemampuan</span></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target size={18} className="text-[#8338e9]" />
                <p className="text-sm font-semibold text-gray-800">Kombinasi Terbaik</p>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-slate-600 mb-1">Konteks</p>
                  <p className="text-sm text-slate-700">"Sebuah perusahaan memiliki 100 karyawan. Tahun ini, 20% karyawan resign dan diganti dengan fresh graduate."</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-600 mb-1">Mode Presisi</p>
                  <p className="text-sm text-slate-700">"Buat soal dengan tabel perbandingan data karyawan"</p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-violet-200">
                  <Sparkles size={14} className="text-teal-600" />
                  <p className="text-xs font-medium text-teal-600">Hasil: Soal dengan tabel dan analisis data yang detail</p>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  </div>
  );
};

export default HelpView;