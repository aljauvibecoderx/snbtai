import React, { useEffect, useState } from 'react';
import { AnimatedBackground } from '../components/common/AnimatedBackground';
import { BookOpen, ChevronLeft, Zap, Trophy, Users, Sparkles, Heart, TrendingUp, CheckCircle, AlertCircle, Cpu, Shield, Rocket, Key, Gamepad2, FileText, Lightbulb, HelpCircle, Target, Edit3, BarChart3, GitBranch, PieChart, XCircle } from 'lucide-react';

const Logo = ({ size = 40 }) => (
  <div className="flex items-center gap-3">
    <div className="relative">
      <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-sm">
        <defs>
          <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:"#4f46e5",stopOpacity:1}} />
            <stop offset="50%" style={{stopColor:"#7c3aed",stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:"#2563eb",stopOpacity:1}} />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#brainGradient)" stroke="#1e293b" strokeWidth="2"/>
        <path d="M25 35 C20 30, 20 25, 25 22 C30 20, 35 22, 38 25 C42 20, 48 20, 52 22 C58 20, 65 22, 70 25 C75 22, 80 25, 80 30 C82 35, 80 40, 75 42 C80 45, 82 50, 80 55 C82 60, 80 65, 75 68 C70 70, 65 68, 62 65 C58 70, 52 70, 48 68 C42 70, 35 68, 32 65 C28 68, 22 65, 20 60 C18 55, 20 50, 25 48 C20 45, 18 40, 20 35 Z" fill="white" opacity="0.9"/>
      </svg>
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

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${className}`}>{children}</div>
);

export const HelpView = ({ onBack }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
  <div className={`min-h-screen bg-[#F3F4F8] p-4 font-sans relative overflow-x-hidden transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
    <AnimatedBackground />
    <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500 rounded-full blur-[120px]"></div>
    </div>
    <div className="max-w-4xl mx-auto relative z-10">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="secondary" onClick={() => { onBack(); window.history.pushState({}, '', '/'); }}>
            <ChevronLeft size={18} /> Kembali
          </Button>
          <Logo size={32} />
        </div>
        <h1 className="text-xl sm:text-3xl font-bold text-slate-900 mb-2">Panduan SNBT AI 2026</h1>
        <p className="text-sm sm:text-base text-slate-600">Platform AI untuk latihan soal UTBK-SNBT dengan sistem login & community</p>
      </div>
      
      <div className="grid gap-6 animate-fadeInUp">
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeInUp { animation: fadeInUp 0.6s ease-out; }
          .animate-fadeInUp > * { animation: fadeInUp 0.6s ease-out backwards; }
          .animate-fadeInUp > *:nth-child(1) { animation-delay: 0.1s; }
          .animate-fadeInUp > *:nth-child(2) { animation-delay: 0.2s; }
          .animate-fadeInUp > *:nth-child(3) { animation-delay: 0.3s; }
          .animate-fadeInUp > *:nth-child(4) { animation-delay: 0.4s; }
          .animate-fadeInUp > *:nth-child(5) { animation-delay: 0.5s; }
        `}</style>
        <Card className="p-6">
          <h2 className="text-base sm:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Rocket size={20} className="text-indigo-600" />
            Cara Menggunakan (Mudah!)
          </h2>
          <div className="space-y-3 sm:space-y-4 text-slate-700">
            <div className="flex gap-2 sm:gap-3">
              <span className="bg-indigo-100 text-indigo-700 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">1</span>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Pilih Mata Pelajaran</h3>
                <p className="text-xs sm:text-sm text-slate-600">Ada 7 pilihan: Penalaran Umum, Bahasa Indonesia, Bahasa Inggris, Matematika, dll.</p>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <span className="bg-indigo-100 text-indigo-700 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">2</span>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Tulis Cerita Singkat</h3>
                <p className="text-xs sm:text-sm text-slate-600">Minimal 20 huruf. Contoh: "Harga beras naik 20%, gaji tetap" - AI akan ubah jadi soal UTBK!</p>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <span className="bg-indigo-100 text-indigo-700 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">3</span>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Pilih Tingkat Kesulitan</h3>
                <p className="text-xs sm:text-sm text-slate-600">Level 1 (Mudah) sampai Level 5 (Sangat Sulit). Sesuaikan dengan kemampuanmu!</p>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <span className="bg-indigo-100 text-indigo-700 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">4</span>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Pilih Mode</h3>
                <p className="text-xs sm:text-sm text-slate-600">Mode Ujian (serius, ada timer) atau Mode Game (seru, ada nyawa & poin)</p>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <span className="bg-indigo-100 text-indigo-700 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">5</span>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Klik Generate & Kerjakan!</h3>
                <p className="text-xs sm:text-sm text-slate-600">Tunggu sebentar, jawab kuis pemanasan, lalu kerjakan 5 soal dengan pembahasan lengkap</p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-base sm:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Key size={20} className="text-purple-600" />
            Kenapa Harus Login?
          </h2>
          <div className="space-y-3 sm:space-y-4 text-slate-700">
            <div className="bg-purple-50 p-3 sm:p-4 rounded-lg border border-purple-200">
              <p className="text-xs sm:text-sm text-purple-800 font-medium mb-2">Tanpa Login:</p>
              <p className="text-xs sm:text-sm text-purple-700 flex items-center gap-2"><AlertCircle size={14} className="text-purple-600" /> Cuma bisa buat 1 soal per hari</p>
            </div>
            <div className="bg-indigo-50 p-3 sm:p-4 rounded-lg border border-indigo-200">
              <p className="text-xs sm:text-sm text-indigo-800 font-medium mb-2 flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-600" />
                Dengan Login (Gratis!):
              </p>
              <ul className="text-xs sm:text-sm text-indigo-700 space-y-1">
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-indigo-600" /> Buat 20 soal per hari</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-indigo-600" /> Simpan semua soal yang pernah dibuat</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-indigo-600" /> Lihat soal dari pengguna lain</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-indigo-600" /> Lacak progress belajarmu</li>
              </ul>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-base sm:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <HelpCircle size={20} className="text-teal-600" />
            Pertanyaan Umum (FAQ)
          </h2>
          <div className="space-y-3 sm:space-y-4 text-slate-700">
            <div className="bg-slate-50 p-3 sm:p-4 rounded-lg border border-slate-200">
              <p className="text-xs sm:text-sm text-slate-800 font-semibold mb-1">Q: Berapa soal yang bisa saya buat?</p>
              <p className="text-xs sm:text-sm text-slate-600">A: Tanpa login = 1 soal/hari. Dengan login = 20 soal/hari (gratis!)</p>
            </div>
            <div className="bg-slate-50 p-3 sm:p-4 rounded-lg border border-slate-200">
              <p className="text-xs sm:text-sm text-slate-800 font-semibold mb-1">Q: Apa bedanya Gemini dan Gemma?</p>
              <p className="text-xs sm:text-sm text-slate-600">A: Gemini (Terbaik) lebih cepat dan akurat. Gemma (Alternatif) dipakai kalau Gemini penuh.</p>
            </div>
            <div className="bg-slate-50 p-3 sm:p-4 rounded-lg border border-slate-200">
              <p className="text-xs sm:text-sm text-slate-800 font-semibold mb-1">Q: Soal saya tersimpan nggak?</p>
              <p className="text-xs sm:text-sm text-slate-600">A: Kalau sudah login, semua soal otomatis tersimpan. Bisa diakses di Dashboard.</p>
            </div>
            <div className="bg-slate-50 p-3 sm:p-4 rounded-lg border border-slate-200">
              <p className="text-xs sm:text-sm text-slate-800 font-semibold mb-1">Q: Bisa lihat soal orang lain?</p>
              <p className="text-xs sm:text-sm text-slate-600">A: Bisa! Login dulu, lalu buka menu Community.</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-base sm:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Gamepad2 size={20} className="text-amber-600" />
            Dua Mode Belajar
          </h2>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 text-slate-700">
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
              <h3 className="font-semibold text-sm sm:text-base text-teal-700 mb-2 flex items-center gap-2">
                <Gamepad2 size={16} className="text-teal-600" />
                Mode Game (Seru!)
              </h3>
              <ul className="text-xs sm:text-sm space-y-1 text-slate-600">
                <li className="flex items-center gap-2"><Heart size={14} className="text-rose-500" /> Punya 3 nyawa</li>
                <li className="flex items-center gap-2"><Zap size={14} className="text-amber-500" /> Jawab benar berturut = bonus poin</li>
                <li className="flex items-center gap-2"><Sparkles size={14} className="text-indigo-500" /> Ada musik & efek suara</li>
                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-teal-500" /> Langsung tahu benar/salah</li>
              </ul>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h3 className="font-semibold text-sm sm:text-base text-indigo-700 mb-2 flex items-center gap-2">
                <FileText size={16} className="text-indigo-600" />
                Mode Ujian (Serius)
              </h3>
              <ul className="text-xs sm:text-sm space-y-1 text-slate-600">
                <li className="flex items-center gap-2"><AlertCircle size={14} className="text-indigo-500" /> Ada timer hitung mundur</li>
                <li className="flex items-center gap-2"><BookOpen size={14} className="text-indigo-500" /> Bisa tandai soal ragu-ragu</li>
                <li className="flex items-center gap-2"><TrendingUp size={14} className="text-indigo-500" /> Pembahasan lengkap di akhir</li>
                <li className="flex items-center gap-2"><Shield size={14} className="text-indigo-500" /> Progress tersimpan (login)</li>
              </ul>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Sparkles size={20} className="text-purple-600" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">Mode Presisi</h2>
          </div>
          <p className="text-sm text-slate-600 mb-6">Instruksi khusus untuk menghasilkan soal yang lebih spesifik sesuai kebutuhanmu.</p>
          <div className="space-y-4">
            <div className="border-l-4 border-purple-500 bg-purple-50/50 p-4 rounded-r-lg">
              <p className="text-sm font-semibold text-slate-800 mb-3">Cara Menggunakan</p>
              <ol className="text-sm text-slate-600 space-y-2">
                <li className="flex gap-3"><span className="text-purple-600 font-semibold">1.</span> Tulis konteks seperti biasa</li>
                <li className="flex gap-3"><span className="text-purple-600 font-semibold">2.</span> Isi kolom Mode Presisi dengan instruksi spesifik</li>
                <li className="flex gap-3"><span className="text-purple-600 font-semibold">3.</span> Atau gunakan tombol preset yang tersedia</li>
                <li className="flex gap-3"><span className="text-purple-600 font-semibold">4.</span> Klik Generate Soal</li>
              </ol>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="flex gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <BarChart3 size={18} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-800">Grafik & Tabel</p>
                  <p className="text-xs text-slate-500 mt-0.5">Visualisasi data dalam bentuk grafik</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <Target size={18} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-800">Perbandingan</p>
                  <p className="text-xs text-slate-500 mt-0.5">Fokus pada rasio dan proporsi</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <GitBranch size={18} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-800">Flowchart</p>
                  <p className="text-xs text-slate-500 mt-0.5">Diagram alur proses logika</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <PieChart size={18} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-800">Statistik</p>
                  <p className="text-xs text-slate-500 mt-0.5">Analisis data dan statistik</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <Edit3 size={20} className="text-rose-600" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">Panduan Menulis Prompt</h2>
          </div>
          <div className="space-y-6">
            <div className="border-l-4 border-slate-400 bg-slate-50/50 p-4 rounded-r-lg">
              <p className="text-sm font-semibold text-slate-800 mb-3">Aturan Dasar</p>
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
                <p className="text-sm font-semibold text-slate-800">Contoh Baik</p>
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
                <p className="text-sm font-semibold text-slate-800">Contoh Kurang Baik</p>
              </div>
              <div className="space-y-2">
                <div className="bg-rose-50/50 border border-rose-200 rounded-lg p-3 flex items-start gap-3">
                  <AlertCircle size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-700">"Ekonomi lagi susah"</p>
                    <p className="text-xs text-rose-600 mt-1">Terlalu pendek dan tidak spesifik</p>
                  </div>
                </div>
                <div className="bg-rose-50/50 border border-rose-200 rounded-lg p-3 flex items-start gap-3">
                  <AlertCircle size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-700">"Hitung luas"</p>
                    <p className="text-xs text-rose-600 mt-1">Tidak ada konteks</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-l-4 border-amber-500 bg-amber-50/50 p-4 rounded-r-lg">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={18} className="text-amber-600" />
                <p className="text-sm font-semibold text-slate-800">Tips Profesional</p>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex gap-2"><CheckCircle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" /> <span>Sertakan angka untuk konteks lebih jelas</span></div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" /> <span>Jelaskan situasi atau masalah yang ada</span></div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" /> <span>Gunakan Mode Presisi untuk hasil optimal</span></div>
                <div className="flex gap-2"><CheckCircle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" /> <span>Sesuaikan level dengan kemampuan</span></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target size={18} className="text-indigo-600" />
                <p className="text-sm font-semibold text-slate-800">Kombinasi Terbaik</p>
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
                <div className="flex items-center gap-2 pt-2 border-t border-indigo-200">
                  <Sparkles size={14} className="text-teal-600" />
                  <p className="text-xs font-medium text-teal-600">Hasil: Soal dengan tabel dan analisis data yang detail</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
  );
};