import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  BookOpen, 
  Brain, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  PenTool,
  Sparkles,
  Timer,
  X,
  Zap,
  Trophy,
  Volume2,
  VolumeX
} from 'lucide-react';

// --- CONFIGURATION & DATA ---

const SUBTESTS = [
  { id: 'tps_pu', label: 'TPS - Penalaran Umum', icon: Brain },
  { id: 'tps_ppu', label: 'TPS - Pengetahuan & Pemahaman Umum', icon: BookOpen },
  { id: 'tps_pbm', label: 'TPS - Pemahaman Bacaan & Menulis', icon: PenTool },
  { id: 'tps_pk', label: 'TPS - Pengetahuan Kuantitatif', icon: FunctionIcon },
  { id: 'lit_ind', label: 'Literasi Bahasa Indonesia', icon: BookOpen },
  { id: 'lit_ing', label: 'Literasi Bahasa Inggris', icon: BookOpen },
  { id: 'pm', label: 'Penalaran Matematika', icon: FunctionIcon },
];

function FunctionIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 18h16" /><path d="M4 14a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4" /><path d="M4 10h16" /><path d="M12 2v20" />
    </svg>
  );
}

const COMPLEXITY_LEVELS = [
  { level: 1, label: 'Level 1: Dasar', desc: 'Pemahaman literal.' },
  { level: 2, label: 'Level 2: Sederhana', desc: 'Satu langkah logika.' },
  { level: 3, label: 'Level 3: Menengah', desc: 'Inferensi multi-langkah.' },
  { level: 4, label: 'Level 4: Sulit', desc: 'Abstraksi tinggi.' },
  { level: 5, label: 'Level 5: Pakar (HOTS)', desc: 'Analisis kompleks.' },
];

const MINI_QUIZ_DATA = [
  { q: "2, 4, 8, 16, ...?", a: "32" },
  { q: "Ibukota masa depan?", a: "Nusantara" },
  { q: "Lawan 'Efisien'?", a: "Boros" },
  { q: "7 x 8 = ...?", a: "56" },
  { q: "Campuran Biru+Kuning?", a: "Hijau" }
];

// Fallback Questions (Updated with LaTeX examples)
const MOCK_QUESTIONS = [
  {
    id: 1,
    stimulus: "Dalam studi meteorologi, durasi suatu peristiwa presipitasi (hujan) dapat dimodelkan berdasarkan volume air yang tersimpan. Model kuantitatif yang digunakan adalah:\n$$V = k \\cdot C$$\n$$T = \\frac{V}{R}$$\nDi mana $V$ adalah Volume air ($m^3$), $k$ adalah konstanta kapasitas dasar, dan $R$ adalah laju presipitasi ($m^3/menit$).",
    text: "Jika diasumsikan faktor interaksi awan $C=0.4$, konstanta kapasitas dasar $k=1250\\ m^3$, dan laju presipitasi terukur sebesar $R=50\\ m^3/menit$, berapakah durasi hujan ($T$) yang terjadi?",
    options: ["10 menit", "12.5 menit", "15 menit", "20 menit", "25 menit"],
    correctIndex: 0,
    explanation: "Substitusi nilai ke dalam rumus volume: $$V = 1250 \\cdot 0.4 = 500\\ m^3$$\nKemudian hitung durasi: $$T = \\frac{500}{50} = 10\\ text{menit}$$"
  },
  {
    id: 2,
    stimulus: "Fenomena kenaikan harga barang pokok seringkali memicu respons berantai dalam ekonomi rumah tangga. Ketika pendapatan tetap namun harga kebutuhan naik, individu dipaksa melakukan prioritas ulang.",
    text: "Jika harga beras naik $20\\%$ sementara gaji tetap, tindakan manakah yang paling mencerminkan prinsip ekonomi rasional?",
    options: ["Menggunakan tabungan darurat", "Mengurangi porsi makan drastis", "Mencari barang substitusi (jagung/ubi)", "Berutang untuk gaya hidup", "Menunggu bantuan pemerintah"],
    correctIndex: 2,
    explanation: "Substitusi adalah langkah rasional untuk memaksimalkan utilitas dengan anggaran terbatas (hukum permintaan)."
  },
  {
    id: 3,
    stimulus: "Pola tidur manusia dipengaruhi oleh ritme sirkadian. Gangguan pada ritme ini dapat menyebabkan penurunan fungsi kognitif.",
    text: "Manakah prediksi yang paling mungkin terjadi jika seseorang terus-menerus bekerja shift malam?",
    options: ["Adaptasi sempurna dalam 1 minggu", "Risiko gangguan metabolisme meningkat", "Ritme sirkadian hilang total", "Kualitas tidur siang lebih baik", "Tidak ada dampak signifikan"],
    correctIndex: 1,
    explanation: "Bekerja melawan ritme sirkadian alami secara kronis meningkatkan risiko gangguan kesehatan fisik dan mental."
  },
  {
    id: 4,
    stimulus: "Dalam logika matematika, implikasi $P \\rightarrow Q$ bernilai salah hanya jika $P$ benar dan $Q$ salah.",
    text: "Jika pernyataan 'Semua siswa yang rajin belajar akan lulus ujian' bernilai SALAH, maka kesimpulan yang benar adalah...",
    options: ["Tidak ada siswa rajin yang lulus", "Semua siswa malas akan lulus", "Ada siswa yang rajin belajar tetapi tidak lulus", "Ada siswa tidak rajin tetapi lulus", "Semua siswa rajin tidak lulus"],
    correctIndex: 2,
    explanation: "Negasi dari $\\forall x (P(x) \\rightarrow Q(x))$ adalah $\\exists x (P(x) \\land \\neg Q(x))$. Ada siswa rajin tapi tidak lulus."
  },
  {
    id: 5,
    stimulus: "Urbanisasi menyebabkan kepadatan penduduk di kota besar meningkat pesat ($> 15.000$ jiwa/$km^2$).",
    text: "Solusi jangka panjang paling efektif untuk mengatasi dampak negatif urbanisasi pada lingkungan kota adalah...",
    options: ["Melarang pendatang masuk", "Membangun gedung pencakar langit", "Transportasi umum terintegrasi & RTH", "Membagikan masker gratis", "Menutup semua pabrik"],
    correctIndex: 2,
    explanation: "Transportasi umum mengurangi polusi, dan RTH menyeimbangkan ekosistem kota secara berkelanjutan."
  }
];

// --- SOUND ENGINE ---
const useSound = () => {
  const [enabled, setEnabled] = useState(true);
  const audioCtxRef = useRef(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playTone = (freq, type, duration, vol = 0.1) => {
    if (!enabled || !audioCtxRef.current) return;
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
    gain.gain.setValueAtTime(vol, audioCtxRef.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtxRef.current.destination);
    osc.start();
    osc.stop(audioCtxRef.current.currentTime + duration);
  };

  const playCorrect = () => { initAudio(); playTone(600, 'sine', 0.1, 0.2); setTimeout(() => playTone(800, 'sine', 0.2, 0.2), 100); };
  const playWrong = () => { initAudio(); playTone(150, 'sawtooth', 0.3, 0.15); setTimeout(() => playTone(100, 'sawtooth', 0.3, 0.15), 100); };
  const playClick = () => { initAudio(); playTone(400, 'triangle', 0.05, 0.05); };
  const playFanfare = () => { initAudio(); [523, 659, 784, 1046].forEach((freq, i) => setTimeout(() => playTone(freq, 'square', 0.2, 0.1), i * 150)); };

  return { enabled, setEnabled, playCorrect, playWrong, playClick, playFanfare, initAudio };
};

// --- LATEX RENDERER COMPONENT ---
const LatexWrapper = ({ text, className = "" }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Inject KaTeX from CDN
    if (!document.getElementById('katex-css')) {
      const link = document.createElement('link');
      link.id = 'katex-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
      document.head.appendChild(link);
    }
    
    if (!window.katex) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  const renderContent = (rawText) => {
    if (!rawText) return "";
    if (!isLoaded || !window.katex) return rawText;

    // Split text by LaTeX delimiters: $$...$$ (block) or $...$ (inline)
    const parts = rawText.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);

    return parts.map((part) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        // Block math
        try {
          return window.katex.renderToString(part.slice(2, -2), { displayMode: true, throwOnError: false });
        } catch (e) { return part; }
      } else if (part.startsWith('$') && part.endsWith('$')) {
        // Inline math
        try {
          return window.katex.renderToString(part.slice(1, -1), { displayMode: false, throwOnError: false });
        } catch (e) { return part; }
      } else {
        return part;
      }
    }).join('');
  };

  return (
    <span 
      className={`latex-content ${className}`}
      style={{ whiteSpace: 'pre-wrap' }} // Preserve newlines
      dangerouslySetInnerHTML={{ __html: renderContent(text) }}
    />
  );
};

// --- AI SERVICE ---

const generateQuestions = async (context, subtestLabel, complexity, apiKey) => {
  if (!apiKey) {
    await new Promise(resolve => setTimeout(resolve, 2500));
    return MOCK_QUESTIONS;
  }

  try {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

    const prompt = `
      SYSTEM PROMPT — STIMULUS RECONSTRUCTION MODE
      Tugas: Ubah cerita pengguna menjadi soal SNBT formal.
      
      PROSEDUR:
      1. Ekstrak fakta.
      2. Buat STIMULUS formal (akademik).
      3. Buat Soal Penalaran (HOTS).
      4. JUMLAH SOAL: WAJIB 5 SOAL.

      ATURAN FORMAT JSON:
      - JSON Valid.
      - Gunakan format LaTeX untuk rumus matematika/simbol.
      - Contoh LaTeX: $E=mc^2$ untuk inline, $$E=mc^2$$ untuk block.
      - Escape backslash dengan benar (gunakan double backslash \\\\ untuk simbol LaTeX).

      INPUT: "${context}" | SUBTES: ${subtestLabel} | LEVEL: ${complexity}
      
      OUTPUT JSON WAJIB:
      [
        {
          "stimulus": "Teks formal...",
          "text": "Pertanyaan...",
          "options": ["A", "B", "C", "D", "E"],
          "correctIndex": 0,
          "explanation": "Penjelasan..."
        },
        ...
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim().replace(/```json|```/g, '');
    
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      return MOCK_QUESTIONS;
    }

  } catch (error) {
    console.error("AI Service Error:", error);
    return MOCK_QUESTIONS; 
  }
};

// --- COMPONENTS ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const baseStyle = "px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-indigo-200",
    ghost: "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50",
    success: "bg-teal-600 text-white hover:bg-teal-700 shadow-teal-200"
  };
  return <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} disabled={disabled}>{children}</button>;
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${className}`}>{children}</div>
);

// --- VIEWS ---

const HomeView = ({ formData, setFormData, handleStart, errorMsg, mode, setMode }) => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
    <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide uppercase">
          <Sparkles size={14} />
          AI-Powered Learning
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Ubah Ceritamu Jadi <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">Soal SNBT.</span>
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed">
          Pilih mode latihanmu: Simulasi serius atau mode Ngegame yang interaktif dengan poin dan streak!
        </p>
        <div className="bg-white p-2 rounded-2xl border border-slate-200 inline-flex gap-2">
          <button onClick={() => setMode('exam')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${mode === 'exam' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
            <Clock size={16} /> Mode Ujian
          </button>
          <button onClick={() => setMode('game')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${mode === 'game' ? 'bg-teal-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
            <Zap size={16} /> Mode Ngegame
          </button>
        </div>
      </div>
      <Card className="p-6 md:p-8 space-y-6 shadow-xl shadow-indigo-100/50 border-indigo-50/50 relative overflow-hidden">
        {errorMsg && <div className="absolute top-0 left-0 w-full bg-rose-500 text-white text-sm py-2 px-4 text-center">{errorMsg}</div>}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">1. Pilih Subtes</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SUBTESTS.map((st) => (
              <button key={st.id} onClick={() => setFormData({ ...formData, subtest: st.id })} className={`p-3 rounded-xl border text-left text-sm transition-all flex items-center gap-3 ${formData.subtest === st.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600' : 'border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-slate-50'}`}>
                <st.icon size={16} />
                <span className="truncate">{st.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">2. Tulis Konteks</label>
            <span className={`text-xs ${formData.context.length > 500 ? 'text-rose-500' : 'text-slate-400'}`}>{formData.context.length}/500</span>
          </div>
          <textarea className="w-full h-32 p-4 rounded-xl border border-slate-200 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-slate-50 focus:bg-white transition-all text-sm" placeholder="Tulis cerita singkat di sini..." value={formData.context} onChange={(e) => setFormData({ ...formData, context: e.target.value.slice(0, 500) })} />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-end">
             <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">3. Kesulitan</label>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Level {formData.complexity}</span>
          </div>
          <input type="range" min="1" max="5" step="1" value={formData.complexity} onChange={(e) => setFormData({ ...formData, complexity: parseInt(e.target.value) })} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
        </div>
        <Button onClick={handleStart} className="w-full mt-2" disabled={formData.context.length < 20}>Generate Soal <ChevronRight size={18} /></Button>
      </Card>
    </div>
  </div>
);

const LoadingView = ({ loadingQuizIdx }) => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center space-y-8">
    <div className="space-y-2 animate-pulse">
      <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-indigo-300"><Brain className="text-white animate-spin-slow" size={32} /></div>
      <h2 className="text-2xl font-bold text-slate-800">Meracik Soal...</h2>
      <p className="text-slate-500">AI sedang mengubah ceritamu menjadi soal ujian.</p>
    </div>
    <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-lg border border-indigo-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-teal-400 animate-loading-bar"></div>
      <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 block">Pemanasan Otak</span>
      <p className="text-xl font-medium text-slate-800 mb-2">{MINI_QUIZ_DATA[loadingQuizIdx].q}</p>
      <span className="text-sm font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">{MINI_QUIZ_DATA[loadingQuizIdx].a}</span>
    </div>
  </div>
);

const CBTView = ({ 
  questions, currentQuestionIdx, setCurrentQuestionIdx, userAnswers, handleAnswer, 
  raguRagu, toggleRagu, timer, finishExam, formatTime, subtestId, mode, streak, points, sfx, feedback 
}) => {
  const question = questions[currentQuestionIdx];
  const isGameMode = mode === 'game';
  const hasAnswered = userAnswers[currentQuestionIdx] !== undefined;

  const getOptionClass = (idx) => {
    if (isGameMode && hasAnswered) {
      if (idx === question.correctIndex) return 'bg-teal-100 border-teal-500 text-teal-800 ring-1 ring-teal-500';
      if (idx === userAnswers[currentQuestionIdx]) return 'bg-rose-100 border-rose-500 text-rose-800 ring-1 ring-rose-500 shake-animation';
      return 'bg-white border-slate-200 opacity-50';
    }
    if (userAnswers[currentQuestionIdx] === idx) return 'bg-indigo-50 border-indigo-600 ring-1 ring-indigo-600 text-indigo-900';
    return 'bg-white border-slate-200 hover:bg-slate-50 hover:border-indigo-300 text-slate-700';
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none">
      <header className="bg-indigo-900 text-white p-4 shadow-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
               <h1 className="font-bold text-lg leading-none">Simulasi SNBT 2026</h1>
               {isGameMode && <span className="bg-teal-500 text-xs px-2 py-0.5 rounded font-bold">GAMIFIED</span>}
            </div>
            <p className="text-xs text-indigo-300 mt-1 opacity-80">{SUBTESTS.find(s=>s.id === subtestId)?.label}</p>
          </div>
          <div className="flex items-center gap-4">
            {isGameMode && (
              <div className="flex items-center gap-4 mr-4">
                 <div className="flex items-center gap-1 text-amber-400 font-bold animate-pulse"><Zap size={18} fill="currentColor" /><span>{streak}</span></div>
                 <div className="flex items-center gap-1 text-white font-mono bg-indigo-800 px-3 py-1 rounded-lg border border-indigo-700"><Trophy size={14} className="text-yellow-400" /><span>{points}</span></div>
              </div>
            )}
            <button onClick={() => sfx.setEnabled(!sfx.enabled)} className="text-indigo-300 hover:text-white transition-colors">{sfx.enabled ? <Volume2 size={20} /> : <VolumeX size={20} />}</button>
            <div className="flex items-center gap-2 bg-indigo-800 px-4 py-2 rounded-lg border border-indigo-700">
              <Timer size={18} className="text-teal-400" />
              <span className={`font-mono font-bold text-xl ${timer < 60 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>{formatTime(timer)}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-9 space-y-6">
          <Card className="p-8 min-h-[60vh] flex flex-col justify-between relative overflow-hidden">
            {isGameMode && feedback?.status === 'correct' && feedback.idx === currentQuestionIdx && (
               <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                  <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-20"></div>
                  <Sparkles size={100} className="text-teal-500 animate-bounce" />
               </div>
            )}

            <div>
              <div className="flex justify-between items-start mb-6">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Soal No. {currentQuestionIdx + 1}</span>
                {raguRagu[currentQuestionIdx] && !isGameMode && <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded font-bold">RAGU-RAGU</span>}
              </div>

              <div className="mb-6 p-6 bg-slate-50 border-l-4 border-indigo-300 rounded-r-lg shadow-sm">
                <span className="block text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Stimulus</span>
                <div className="text-slate-800 text-sm font-serif leading-relaxed text-justify">
                  <LatexWrapper text={question.stimulus} />
                </div>
              </div>
              
              <div className="text-xl text-slate-900 leading-relaxed font-medium mb-8">
                <LatexWrapper text={question.text} />
              </div>

              <div className="space-y-3">
                {question.options.map((opt, idx) => (
                  <button
                    key={idx}
                    disabled={isGameMode && hasAnswered}
                    onClick={() => handleAnswer(currentQuestionIdx, idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 group relative ${getOptionClass(idx)}`}
                  >
                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border transition-colors ${userAnswers[currentQuestionIdx] === idx || (isGameMode && hasAnswered && idx === question.correctIndex) ? 'bg-transparent border-current' : 'bg-white text-slate-500 border-slate-300'}`}>{String.fromCharCode(65 + idx)}</span>
                    <span className="flex-1 font-medium"><LatexWrapper text={opt} /></span>
                    {isGameMode && hasAnswered && idx === question.correctIndex && <CheckCircle2 className="text-teal-600 absolute right-4" size={24} />}
                    {isGameMode && hasAnswered && idx === userAnswers[currentQuestionIdx] && idx !== question.correctIndex && <X className="text-rose-600 absolute right-4" size={24} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
              <Button variant="secondary" disabled={currentQuestionIdx === 0} onClick={() => setCurrentQuestionIdx(curr => curr - 1)}><ChevronLeft size={18} /> Prev</Button>
              {!isGameMode && (
                <label className="flex items-center gap-2 cursor-pointer px-4 py-2 hover:bg-amber-50 rounded-lg">
                  <input type="checkbox" className="accent-amber-500 w-5 h-5" checked={!!raguRagu[currentQuestionIdx]} onChange={() => toggleRagu(currentQuestionIdx)} />
                  <span className="text-amber-600 font-bold text-sm">Ragu-ragu</span>
                </label>
              )}
              {currentQuestionIdx < questions.length - 1 ? (
                 <Button onClick={() => { setCurrentQuestionIdx(curr => curr + 1); sfx.playClick(); }}>Next <ChevronRight size={18} /></Button>
              ) : (
                <Button variant="success" onClick={finishExam}>Selesai <CheckCircle2 size={18} /></Button>
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
           <Card className="p-4">
              <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wide">Navigasi</h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const answered = userAnswers[idx] !== undefined;
                  const isCorrect = isGameMode && answered && userAnswers[idx] === q.correctIndex;
                  const isWrong = isGameMode && answered && userAnswers[idx] !== q.correctIndex;
                  
                  let bgClass = "bg-white border-slate-300 text-slate-600";
                  if (idx === currentQuestionIdx) bgClass = "ring-2 ring-indigo-400 border-indigo-600 z-10";
                  
                  if (isGameMode) {
                     if (isCorrect) bgClass += " bg-teal-500 text-white border-teal-600";
                     else if (isWrong) bgClass += " bg-rose-500 text-white border-rose-600";
                  } else {
                     if (raguRagu[idx]) bgClass += " bg-amber-400 text-white border-amber-500";
                     else if (answered) bgClass += " bg-slate-700 text-white border-slate-800";
                  }
                  return <button key={idx} onClick={() => setCurrentQuestionIdx(idx)} className={`w-full aspect-square rounded flex items-center justify-center text-sm font-bold border transition-all ${bgClass}`}>{idx + 1}</button>
                })}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

const ResultView = ({ score, userAnswers, questions, timeUsed, formatTime, points, sfx }) => {
  useEffect(() => { sfx.playFanfare(); }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center font-sans">
      <div className="max-w-3xl w-full space-y-6 animate-fade-in-up">
        <Card className="p-8 text-center border-t-8 border-t-indigo-600">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600 shadow-inner">
            {score >= 70 ? <Trophy size={48} className="text-yellow-500 animate-bounce" /> : <Brain size={48} />}
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Hasil Latihan</h2>
          <p className="text-slate-500 mb-8">Berikut adalah performa penalaranmu.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-400 uppercase font-bold">Akurasi</span>
              <p className={`text-2xl font-extrabold ${score >= 70 ? 'text-teal-600' : 'text-slate-700'}`}>{score.toFixed(0)}%</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-400 uppercase font-bold">Poin</span>
              <p className="text-2xl font-extrabold text-amber-500">+{points}</p>
            </div>
             <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-400 uppercase font-bold">Benar</span>
              <p className="text-2xl font-extrabold text-teal-600">{Object.keys(userAnswers).filter(idx => userAnswers[idx] === questions[idx].correctIndex).length}<span className="text-sm font-normal text-slate-400">/{questions.length}</span></p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-400 uppercase font-bold">Waktu</span>
              <p className="text-2xl font-extrabold text-indigo-600">{formatTime(timeUsed)}</p>
            </div>
          </div>
          <Button onClick={() => window.location.reload()}>Latihan Baru</Button>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 ml-2">Pembahasan & Evaluasi</h3>
          {questions.map((q, idx) => {
            const isCorrect = userAnswers[idx] === q.correctIndex;
            return (
              <Card key={idx} className={`p-6 border-l-4 ${isCorrect ? 'border-l-teal-500' : 'border-l-rose-500'}`}>
                <div className="flex gap-4">
                  <div className="mt-1">{isCorrect ? <CheckCircle2 className="text-teal-500" /> : <X className="text-rose-500" />}</div>
                  <div className="space-y-2 w-full">
                    <div className="mb-2 p-3 bg-slate-100 rounded text-xs text-slate-600 font-serif italic">
                      Stimulus: "<LatexWrapper text={q.stimulus.substring(0, 150) + (q.stimulus.length > 150 ? '...' : '')} />"
                    </div>
                    <p className="font-medium text-slate-900"><LatexWrapper text={q.text} /></p>
                    <div className="text-sm space-y-1 mt-2">
                      <p className={`font-semibold ${isCorrect ? 'text-teal-700' : 'text-rose-600'}`}>
                        Jawabanmu: <LatexWrapper text={q.options[userAnswers[idx]] || "Tidak dijawab"} />
                      </p>
                      {!isCorrect && (
                         <p className="text-teal-700 font-semibold">
                           Jawaban Benar: <LatexWrapper text={q.options[q.correctIndex]} />
                         </p>
                      )}
                    </div>
                    <div className="mt-4 p-4 bg-indigo-50 rounded-lg text-sm text-slate-700 leading-relaxed">
                      <span className="font-bold text-indigo-700 block mb-1">Penjelasan:</span>
                      <LatexWrapper text={q.explanation} />
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function KontekstualApp() {
  const [view, setView] = useState('HOME');
  const [mode, setMode] = useState('exam');
  const [formData, setFormData] = useState({ context: '', subtest: SUBTESTS[0].id, complexity: 3 });
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [raguRagu, setRaguRagu] = useState({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);
  const [loadingQuizIdx, setLoadingQuizIdx] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const sfx = useSound();
  const apiKey = "AIzaSyDcuAmH3nAOjZAZaYNv_LkDwVWfdicBuj0"; 

  const handleStart = async () => {
    if (formData.context.length < 20) { alert("Cerita kependekan."); return; }
    sfx.playClick();
    sfx.initAudio();
    setView('LOADING');
    setErrorMsg('');
    const quizInterval = setInterval(() => setLoadingQuizIdx(p => (p + 1) % MINI_QUIZ_DATA.length), 2500);

    try {
      const selectedSubtest = SUBTESTS.find(s => s.id === formData.subtest);
      const generatedQuestions = await generateQuestions(formData.context, selectedSubtest.label, formData.complexity, apiKey);
      clearInterval(quizInterval);
      setQuestions(generatedQuestions);
      setTimer(generatedQuestions.length * 60);
      setView('CBT');
      if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(()=>{});
    } catch (err) {
      clearInterval(quizInterval);
      setErrorMsg("Gagal generate soal. Coba lagi.");
      setView('HOME');
    }
  };

  const handleAnswer = (qIndex, ansIndex) => {
    if (mode === 'game' && userAnswers[qIndex] !== undefined) return;
    setUserAnswers(prev => ({ ...prev, [qIndex]: ansIndex }));
    
    if (mode === 'game') {
      const isCorrect = ansIndex === questions[qIndex].correctIndex;
      if (isCorrect) {
        sfx.playCorrect();
        setStreak(s => s + 1);
        setPoints(p => p + 10 + (streak * 2));
        setFeedback({ status: 'correct', idx: qIndex });
      } else {
        sfx.playWrong();
        setStreak(0);
        setFeedback({ status: 'wrong', idx: qIndex });
      }
    } else {
        sfx.playClick();
    }
  };

  const finishExam = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => { if (userAnswers[idx] === q.correctIndex) correctCount++; });
    setScore((correctCount / questions.length) * 100);
    if (document.exitFullscreen) document.exitFullscreen().catch(()=>{});
    setView('RESULT');
  };

  useEffect(() => {
    let interval;
    if (view === 'CBT' && timer > 0) interval = setInterval(() => setTimer(t => t - 1), 1000);
    else if (view === 'CBT' && timer === 0) finishExam();
    return () => clearInterval(interval);
  }, [view, timer]);

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <>
      <style>{`
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        .shake-animation { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
      `}</style>
      {view === 'HOME' && <HomeView formData={formData} setFormData={setFormData} handleStart={handleStart} errorMsg={errorMsg} mode={mode} setMode={setMode} />}
      {view === 'LOADING' && <LoadingView loadingQuizIdx={loadingQuizIdx} />}
      {view === 'CBT' && <CBTView questions={questions} currentQuestionIdx={currentQuestionIdx} setCurrentQuestionIdx={setCurrentQuestionIdx} userAnswers={userAnswers} handleAnswer={handleAnswer} raguRagu={raguRagu} toggleRagu={(i)=>setRaguRagu(p=>({...p,[i]:!p[i]}))} timer={timer} finishExam={finishExam} formatTime={formatTime} subtestId={formData.subtest} mode={mode} streak={streak} points={points} sfx={sfx} feedback={feedback} />}
      {view === 'RESULT' && <ResultView score={score} userAnswers={userAnswers} questions={questions} timeUsed={(questions.length*60)-timer} formatTime={formatTime} points={points} sfx={sfx} />}
    </>
  );
}