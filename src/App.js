import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

import { AmbisTokenStore, AmbisTokenCheckout, AmbisTokenPayment, AmbisTokenSuccess } from './pages/token-flow';
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
  VolumeX,
  LogIn,
  LogOut,
  User,
  Users,
  Smile,
  Frown,
  Meh,
  Skull,
  Flame,
  Menu,
  Settings,
  WifiOff,
  AlertTriangle,
  Bookmark,
  BookText
} from 'lucide-react';
import { HelpView } from './pages/HelpPage';
import { selectTemplate, generatePromptWithTemplate, getAllPatterns } from './utils/questionTemplates';
import { TemplateInfo } from './components/common/TemplateInfo';
import { auth, loginWithGoogle, logout, saveUserData, getUserData, saveQuestionSet, saveQuestion, getQuestionsBySetId, saveAttempt, updateAttemptStatus, finishAttempt, getTotalQuestionsCount, saveQuestionSetWithId, getQuestionSetById, saveResultWithId, getResultById, saveToBankSoal, saveToSoalSaya, addToWishlist, removeFromWishlist, checkWishlistStatus, getUserTokenBalance, addTokens, spendTokens, getTokenTransactions } from './services/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { CommunityView } from './features/community/CommunityView';
import { DashboardView } from './features/dashboard/DashboardView';
import HomeViewRevamp from './pages/HomeViewRevamp';
import { DetailSoalView } from './features/soal/DetailSoalView';
import { NotFoundPage } from './pages/ErrorPage';
import { sanitizeContext } from './utils/security';
import { SettingsView } from './pages/SettingsView';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import { GEMINI_KEYS, HF_API_KEY } from './config/config';
import { AdminDashboard } from './features/tryout/AdminDashboard';
import { checkAdminRole } from './services/firebase/firebase-admin';
import { ImageUploader } from './components/common/ImageUploader';
import { IRTScoring } from './utils/irt-scoring';
import { SUBTESTS, getSubtestLabel } from './constants/subtestHelper';
import { VocabPanel, HighlightPopup, SearchModal } from './features/vocab/VocabMode';
import { saveVocab, checkVocabExists } from './services/vocab/vocab-firebase';
import { NotificationProvider, useNotification } from './components/common/NotificationSystem';

import { StatsProvider } from './context/StatsContext';
import { AnimatedBackground } from './components/common/AnimatedBackground';
import AmbisToken from './pages/AmbisToken';
import './styles/typography.css';

// Toast system replaced by NotificationSystem

// --- NETWORK STATUS DETECTOR ---
const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

const OfflineIndicator = () => (
  <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] bg-rose-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce-in">
    <WifiOff size={20} className="animate-pulse" />
    <span className="text-sm font-bold">Tidak ada koneksi internet</span>
  </div>
);

// --- CONFIGURATION & DATA ---

// Add icons to SUBTESTS imported from subtestHelper
const SUBTESTS_WITH_ICONS = SUBTESTS.map(st => ({
  ...st,
  icon: st.id === 'tps_pu' ? Brain :
        st.id === 'tps_ppu' ? BookOpen :
        st.id === 'tps_pbm' ? PenTool :
        st.id === 'tps_pk' ? FunctionIcon :
        st.id === 'lit_ind' ? BookOpen :
        st.id === 'lit_ing' ? BookOpen :
        st.id === 'pm' ? FunctionIcon : Brain
}));

function FunctionIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 18h16" /><path d="M4 14a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4" /><path d="M4 10h16" /><path d="M12 2v20" />
    </svg>
  );
}

const COMPLEXITY_LEVELS = [
  { level: 0, label: 'Level 0: Adaptive', desc: 'AI memilih pola paling sesuai permintaan.' },
  { level: 1, label: 'Level 1: Dasar', desc: 'Pemahaman literal.' },
  { level: 2, label: 'Level 2: Sederhana', desc: 'Satu langkah logika.' },
  { level: 3, label: 'Level 3: Menengah', desc: 'Inferensi multi-langkah.' },
  { level: 4, label: 'Level 4: Sulit', desc: 'Abstraksi tinggi.' },
  { level: 5, label: 'Level 5: Pakar (HOTS)', desc: 'Analisis kompleks.' },
];

const MINI_QUIZ_DATA = [
  { q: "2, 4, 8, 16, ...?", options: ["24", "30", "32", "64"], correctIndex: 2 },
  { q: "Ibukota masa depan Indonesia?", options: ["Jakarta", "Nusantara", "Surabaya", "Bandung"], correctIndex: 1 },
  { q: "Lawan kata 'Efisien'?", options: ["Hemat", "Boros", "Cepat", "Lambat"], correctIndex: 1 },
  { q: "7 × 8 = ...?", options: ["54", "56", "58", "64"], correctIndex: 1 },
  { q: "Campuran Biru + Kuning?", options: ["Hijau", "Ungu", "Oranye", "Merah"], correctIndex: 0 },
  { q: "Planet terdekat dengan Matahari?", options: ["Venus", "Mars", "Merkurius", "Bumi"], correctIndex: 2 },
  { q: "1 + 2 + 3 + 4 + 5 = ...?", options: ["12", "15", "18", "20"], correctIndex: 1 },
  { q: "Ibu kota Jepang?", options: ["Seoul", "Beijing", "Tokyo", "Bangkok"], correctIndex: 2 },
  { q: "Akar dari 144?", options: ["10", "11", "12", "14"], correctIndex: 2 },
  { q: "Sinonim 'Cerdas'?", options: ["Bodoh", "Pintar", "Malas", "Rajin"], correctIndex: 1 },
  { q: "50% dari 200?", options: ["50", "75", "100", "150"], correctIndex: 2 },
  { q: "Benua terbesar di dunia?", options: ["Afrika", "Amerika", "Asia", "Eropa"], correctIndex: 2 },
  { q: "3² + 4² = ...?", options: ["12", "25", "49", "64"], correctIndex: 1 },
  { q: "Lawan kata 'Gelap'?", options: ["Terang", "Suram", "Redup", "Buram"], correctIndex: 0 },
  { q: "Jumlah hari dalam 1 tahun kabisat?", options: ["364", "365", "366", "367"], correctIndex: 2 }
];

// Fallback Questions (Updated with representation)
const MOCK_QUESTIONS = [
  {
    id: 1,
    stimulus: "Dalam studi meteorologi, durasi suatu peristiwa presipitasi (hujan) dapat dimodelkan berdasarkan volume air yang tersimpan.",
    representation: {
      type: "function",
      data: {
        function: "T = \\frac{V}{R}",
        variables: [{name: "V", desc: "Volume air ($m^3$)"}, {name: "R", desc: "Laju presipitasi ($m^3$/menit)"}, {name: "T", desc: "Durasi (menit)"}]
      }
    },
    text: "Jika volume air $V=500\\ m^3$ dan laju presipitasi $R=50\\ m^3$/menit, berapakah durasi hujan ($T$)?",
    options: ["10 menit", "12.5 menit", "15 menit", "20 menit", "25 menit"],
    correctIndex: 0,
    explanation: "Substitusi: $T = \\frac{500}{50} = 10$ menit"
  },
  {
    id: 2,
    stimulus: "Fenomena kenaikan harga barang pokok memicu respons berantai dalam ekonomi rumah tangga.",
    representation: { type: "text", data: null },
    text: "Jika harga beras naik $20\\%$ sementara gaji tetap, tindakan manakah yang paling mencerminkan prinsip ekonomi rasional?",
    options: ["Menggunakan tabungan darurat", "Mengurangi porsi makan drastis", "Mencari barang substitusi (jagung/ubi)", "Berutang untuk gaya hidup", "Menunggu bantuan pemerintah"],
    correctIndex: 2,
    explanation: "Substitusi adalah langkah rasional untuk memaksimalkan utilitas dengan anggaran terbatas."
  },
  {
    id: 3,
    stimulus: "Pola tidur manusia dipengaruhi oleh ritme sirkadian.",
    representation: { type: "text", data: null },
    text: "Manakah prediksi yang paling mungkin terjadi jika seseorang terus-menerus bekerja shift malam?",
    options: ["Adaptasi sempurna dalam 1 minggu", "Risiko gangguan metabolisme meningkat", "Ritme sirkadian hilang total", "Kualitas tidur siang lebih baik", "Tidak ada dampak signifikan"],
    correctIndex: 1,
    explanation: "Bekerja melawan ritme sirkadian alami secara kronis meningkatkan risiko gangguan kesehatan."
  },
  {
    id: 4,
    stimulus: "Dalam logika matematika, implikasi $P \\rightarrow Q$ bernilai salah hanya jika $P$ benar dan $Q$ salah.",
    representation: { type: "text", data: null },
    text: "Jika pernyataan 'Semua siswa yang rajin belajar akan lulus ujian' bernilai SALAH, maka kesimpulan yang benar adalah...",
    options: ["Tidak ada siswa rajin yang lulus", "Semua siswa malas akan lulus", "Ada siswa yang rajin belajar tetapi tidak lulus", "Ada siswa tidak rajin tetapi lulus", "Semua siswa rajin tidak lulus"],
    correctIndex: 2,
    explanation: "Negasi dari $\\forall x (P(x) \\rightarrow Q(x))$ adalah $\\exists x (P(x) \\land \\neg Q(x))$."
  },
  {
    id: 6,
    stimulus: "The following is a discussion thread from an online education forum about the role of competition in schools.",
    representation: {
      type: "thread",
      data: {
        posts: [
          { author: "Sarah_Teacher", date: "15 March 2024, 08:30 AM", content: "Competition in schools can be beneficial if managed properly. It motivates students to excel and prepares them for real-world challenges." },
          { author: "Mike_Parent", date: "15 March 2024, 10:15 AM", content: "I disagree. Excessive competition creates stress and anxiety among children. Schools should focus more on collaboration rather than competition." },
          { author: "Dr_Chen", date: "15 March 2024, 02:45 PM", content: "Both perspectives have merit. The key is balance. Healthy competition combined with collaborative learning produces the best outcomes for student development." },
          { author: "Lisa_Student", date: "15 March 2024, 04:20 PM", content: "As a student, I feel competition pushes me to work harder, but it also makes me anxious about grades. Maybe schools need better support systems alongside competition." }
        ]
      }
    },
    text: "What can be inferred about Dr_Chen's stance on competition in schools?",
    options: [
      "Competition should be completely eliminated from schools",
      "Competition is harmful and creates unnecessary stress",
      "A balanced approach combining competition and collaboration is ideal",
      "Only collaborative learning should be implemented",
      "Competition is the only way to prepare students for life"
    ],
    correctIndex: 2,
    explanation: "Dr_Chen explicitly states that 'both perspectives have merit' and emphasizes 'balance' between healthy competition and collaborative learning, indicating support for a combined approach."
  },
  {
    id: 5,
    stimulus: "Urbanisasi menyebabkan kepadatan penduduk di kota besar meningkat pesat.",
    representation: {
      type: "table",
      data: [["Kota", "Kepadatan (jiwa/km²)"], ["Jakarta", "15,342"], ["Surabaya", "8,483"], ["Bandung", "14,228"]]
    },
    text: "Solusi jangka panjang paling efektif untuk mengatasi dampak negatif urbanisasi pada lingkungan kota adalah...",
    options: ["Melarang pendatang masuk", "Membangun gedung pencakar langit", "Transportasi umum terintegrasi & RTH", "Membagikan masker gratis", "Menutup semua pabrik"],
    correctIndex: 2,
    explanation: "Transportasi umum mengurangi polusi, dan RTH menyeimbangkan ekosistem kota."
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

// --- BACKGROUND MUSIC ---
const MUSIC_TRACKS = [
  'https://audio.jukehost.co.uk/bNXRtNjAtbpsPs8x3IJEZABWQ6sU9e6R',
  'https://audio.jukehost.co.uk/bNXRtNjAtbpsPs8x3IJEZABWQ6sU9e6R'
];

const useBackgroundMusic = () => {
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(0.3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

  useEffect(() => {
    audioRef.current = new Audio(MUSIC_TRACKS[currentTrack]);
    audioRef.current.loop = false;
    audioRef.current.volume = volume;
    
    audioRef.current.onended = () => {
      setCurrentTrack(prev => (prev + 1) % MUSIC_TRACKS.length);
    };
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const play = () => {
    if (audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(e => {
            // Silently handle autoplay restrictions
            if (e.name !== 'AbortError') {
              console.log('Audio play failed:', e.name);
            }
          });
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return { volume, setVolume, isPlaying, play, pause };
};

// --- LATEX RENDERER COMPONENT ---
const TableScrollWrapper = ({ children, minWidth = '500px' }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative">
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 border border-slate-300"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} className="text-slate-700" />
        </button>
      )}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div style={{ minWidth }}>{children}</div>
      </div>
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 border border-slate-300"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} className="text-slate-700" />
        </button>
      )}
    </div>
  );
};

const RepresentationRenderer = ({ representation }) => {
  if (!representation || representation.type === 'text') return null;
  
  if (representation.type === 'grid_boolean') {
    const { statements } = representation.data;
    if (!statements || statements.length === 0) return null;
    return (
      <div className="my-4">
        <TableScrollWrapper minWidth="500px">
          <div className="border-2 border-indigo-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-indigo-50 border-b-2 border-indigo-200">
                  <th className="p-3 text-left font-bold text-indigo-900 w-[60%]">Pernyataan</th>
                  <th className="p-3 text-center font-bold text-indigo-900 w-[20%] border-l border-indigo-200">Ya</th>
                  <th className="p-3 text-center font-bold text-indigo-900 w-[20%] border-l border-indigo-200">Tidak</th>
                </tr>
              </thead>
              <tbody>
                {statements.map((stmt, i) => (
                  <tr key={i} className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50">
                    <td className="p-3 text-slate-700 align-middle">
                      <LatexWrapper text={`${i + 1}. ${stmt}`} />
                    </td>
                    <td className="p-3 text-center align-middle border-l border-slate-200">
                      <div className="w-5 h-5 rounded border-2 border-slate-300 mx-auto"></div>
                    </td>
                    <td className="p-3 text-center align-middle border-l border-slate-200">
                      <div className="w-5 h-5 rounded border-2 border-slate-300 mx-auto"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TableScrollWrapper>
      </div>
    );
  }
  
  if (representation.type === 'thread') {
    const { posts } = representation.data;
    if (!posts || posts.length === 0) return null;
    return (
      <div className="my-4">
        <TableScrollWrapper minWidth="500px">
          <div className="border-2 border-slate-300 rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <tbody>
                {posts.map((post, i) => (
                  <tr key={i} className="border-b border-slate-300 last:border-b-0">
                    <td className="bg-slate-50 p-3 align-top border-r border-slate-300 w-[35%]">
                      <div className="font-bold text-slate-800 mb-1">{post.author}</div>
                      <div className="text-slate-500 text-[10px]">
                        Posted: {post.date}
                      </div>
                    </td>
                    <td className="p-3 bg-white align-top">
                      <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        <LatexWrapper text={post.content} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TableScrollWrapper>
      </div>
    );
  }
  
  if (representation.type === 'table') {
    const data = representation.data;
    if (!data || data.length === 0) return null;
    return (
      <div className="my-4">
        <TableScrollWrapper minWidth="400px">
          <table className="w-full border-collapse border border-slate-300 text-sm">
            <thead>
              <tr className="bg-slate-100">
                {data[0].map((header, i) => (
                  <th key={i} className="border border-slate-300 px-3 py-2 font-semibold text-slate-700"><LatexWrapper text={header} /></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(1).map((row, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  {row.map((cell, j) => (
                    <td key={j} className="border border-slate-300 px-3 py-2 text-slate-600"><LatexWrapper text={cell} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </TableScrollWrapper>
      </div>
    );
  }
  
  if (representation.type === 'function') {
    const { function: func, cases, variables } = representation.data;
    return (
      <div className="my-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
        {func && <div className="text-center font-mono text-lg mb-3"><LatexWrapper text={`$$${func}$$`} /></div>}
        {variables && (
          <div className="text-sm text-slate-600 mb-2">
            {variables.map((v, i) => (
              <div key={i}><LatexWrapper text={`${v.name}: ${v.desc}`} /></div>
            ))}
          </div>
        )}
        {cases && (
          <div className="space-y-1 text-sm">
            {cases.map((c, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-slate-500">•</span>
                <LatexWrapper text={`${c.result}, jika ${c.condition}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  if (representation.type === 'chart') {
    const { points, xLabel, yLabel } = representation.data;
    if (!points || points.length === 0) return null;
    
    const maxX = Math.max(...points.map(p => p[0]));
    const maxY = Math.max(...points.map(p => p[1]));
    const minX = Math.min(...points.map(p => p[0]));
    const minY = Math.min(...points.map(p => p[1]));
    
    return (
      <div className="my-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <svg viewBox="0 0 400 300" className="w-full max-w-md mx-auto">
          <line x1="40" y1="260" x2="360" y2="260" stroke="#64748b" strokeWidth="2" />
          <line x1="40" y1="260" x2="40" y2="20" stroke="#64748b" strokeWidth="2" />
          {points.map((point, i) => {
            const x = 40 + ((point[0] - minX) / (maxX - minX || 1)) * 300;
            const y = 260 - ((point[1] - minY) / (maxY - minY || 1)) * 220;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="4" fill="#4f46e5" />
                {i < points.length - 1 && (
                  <line 
                    x1={x} 
                    y1={y} 
                    x2={40 + ((points[i+1][0] - minX) / (maxX - minX || 1)) * 300} 
                    y2={260 - ((points[i+1][1] - minY) / (maxY - minY || 1)) * 220} 
                    stroke="#4f46e5" 
                    strokeWidth="2" 
                  />
                )}
                <text x={x} y={y - 10} fontSize="10" fill="#475569" textAnchor="middle">
                  ({point[0]},{point[1]})
                </text>
              </g>
            );
          })}
          {xLabel && <text x="200" y="290" fontSize="12" fill="#475569" textAnchor="middle">{xLabel}</text>}
          {yLabel && <text x="15" y="140" fontSize="12" fill="#475569" textAnchor="middle" transform="rotate(-90 15 140)">{yLabel}</text>}
        </svg>
      </div>
    );
  }
  
  if (representation.type === 'shape') {
    const { shapeType, dimensions, labels, objects, relations } = representation.data;
    
    return (
      <div className="my-4 p-4 bg-white border-2 border-indigo-200 rounded-lg">
        <svg viewBox="0 0 400 300" className="w-full max-w-lg mx-auto">
          {shapeType === 'triangle_right' && (
            <g>
              <line x1="100" y1="220" x2="300" y2="220" stroke="#4f46e5" strokeWidth="2.5" />
              <line x1="100" y1="220" x2="100" y2="80" stroke="#4f46e5" strokeWidth="2.5" />
              <line x1="100" y1="80" x2="300" y2="220" stroke="#4f46e5" strokeWidth="2.5" />
              <path d="M 100 200 L 120 200 L 120 220" stroke="#64748b" strokeWidth="1.5" fill="none" />
              {labels?.side_a && <text x="70" y="150" fontSize="14" fill="#1e293b" fontWeight="600">{labels.side_a}</text>}
              {labels?.side_b && <text x="200" y="245" fontSize="14" fill="#1e293b" fontWeight="600">{labels.side_b}</text>}
              {labels?.side_c && <text x="210" y="140" fontSize="14" fill="#1e293b" fontWeight="600">{labels.side_c}</text>}
              {dimensions?.side_a && <text x="50" y="150" fontSize="13" fill="#4f46e5" fontWeight="700">{dimensions.side_a} cm</text>}
              {dimensions?.side_b && <text x="200" y="265" fontSize="13" fill="#4f46e5" fontWeight="700">{dimensions.side_b} cm</text>}
            </g>
          )}
          {(shapeType === 'rectangle' || shapeType === 'square') && (
            <g>
              <rect x="100" y="100" width="200" height="120" fill="none" stroke="#4f46e5" strokeWidth="2.5" />
              {labels?.width && <text x="200" y="240" fontSize="14" fill="#1e293b" fontWeight="600" textAnchor="middle">{labels.width}</text>}
              {labels?.height && <text x="70" y="160" fontSize="14" fill="#1e293b" fontWeight="600" textAnchor="middle">{labels.height}</text>}
              {dimensions?.width && <text x="200" y="260" fontSize="13" fill="#4f46e5" fontWeight="700" textAnchor="middle">{dimensions.width} cm</text>}
              {dimensions?.height && <text x="50" y="160" fontSize="13" fill="#4f46e5" fontWeight="700" textAnchor="middle">{dimensions.height} cm</text>}
            </g>
          )}
          {shapeType === 'circle' && (
            <g>
              <circle cx="200" cy="150" r="80" fill="none" stroke="#4f46e5" strokeWidth="2.5" />
              <line x1="200" y1="150" x2="280" y2="150" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4" />
              {labels?.radius && <text x="240" y="140" fontSize="14" fill="#1e293b" fontWeight="600" textAnchor="middle">{labels.radius}</text>}
              {dimensions?.radius && <text x="240" y="165" fontSize="13" fill="#4f46e5" fontWeight="700" textAnchor="middle">{dimensions.radius} cm</text>}
            </g>
          )}
          {(shapeType === 'cube' || shapeType === 'cuboid') && (
            <g>
              <rect x="120" y="120" width="120" height="100" fill="none" stroke="#4f46e5" strokeWidth="2.5" />
              <rect x="160" y="80" width="120" height="100" fill="none" stroke="#4f46e5" strokeWidth="2.5" />
              <line x1="120" y1="120" x2="160" y2="80" stroke="#4f46e5" strokeWidth="2.5" />
              <line x1="240" y1="120" x2="280" y2="80" stroke="#4f46e5" strokeWidth="2.5" />
              <line x1="240" y1="220" x2="280" y2="180" stroke="#4f46e5" strokeWidth="2.5" />
              {Object.entries(dimensions || {}).map(([key, val], i) => (
                <text key={i} x="200" y={250 + i * 18} fontSize="13" fill="#4f46e5" fontWeight="700" textAnchor="middle">{key}: {val} cm</text>
              ))}
            </g>
          )}
        </svg>
        {relations && relations.length > 0 && (
          <div className="mt-3 text-xs text-slate-600 space-y-1">
            {relations.map((rel, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                <span>{rel}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  if (representation.type === 'flowchart') {
    const { nodes, edges } = representation.data;
    if (!nodes || nodes.length === 0) return null;
    
    const nodePositions = {};
    nodes.forEach((node) => {
      const col = node.col || 0;
      const row = node.row || 0;
      nodePositions[node.id] = { x: 200 + col * 120, y: 60 + row * 90 };
    });
    
    const FlowNode = ({ node, pos }) => {
      if (node.type === 'start' || node.type === 'end' || node.type === 'terminal') {
        return (
          <g>
            <ellipse cx={pos.x} cy={pos.y} rx="45" ry="18" fill="white" stroke="#64748b" strokeWidth="2" />
            <foreignObject x={pos.x - 40} y={pos.y - 9} width="80" height="18">
              <div xmlns="http://www.w3.org/1999/xhtml" className="flex items-center justify-center h-full">
                <span className="text-[9px] font-bold text-slate-700"><LatexWrapper text={node.label || ''} /></span>
              </div>
            </foreignObject>
          </g>
        );
      }
      
      if (node.type === 'io') {
        return (
          <g>
            <path d={`M ${pos.x - 50} ${pos.y - 16} L ${pos.x + 40} ${pos.y - 16} L ${pos.x + 50} ${pos.y + 16} L ${pos.x - 40} ${pos.y + 16} Z`} fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
            <foreignObject x={pos.x - 45} y={pos.y - 13} width="90" height="26">
              <div xmlns="http://www.w3.org/1999/xhtml" className="flex items-center justify-center h-full px-1">
                <span className="text-[9px] font-bold text-emerald-900 text-center leading-tight"><LatexWrapper text={node.label || ''} /></span>
              </div>
            </foreignObject>
          </g>
        );
      }
      
      if (node.type === 'process') {
        return (
          <g>
            <rect x={pos.x - 50} y={pos.y - 16} width="100" height="32" rx="5" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
            <foreignObject x={pos.x - 45} y={pos.y - 13} width="90" height="26">
              <div xmlns="http://www.w3.org/1999/xhtml" className="flex items-center justify-center h-full px-1">
                <span className="text-[9px] font-bold text-blue-900 text-center leading-tight"><LatexWrapper text={node.label || ''} /></span>
              </div>
            </foreignObject>
          </g>
        );
      }
      
      if (node.type === 'decision') {
        return (
          <g>
            <rect x={pos.x - 26} y={pos.y - 26} width="52" height="52" rx="3" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" transform={`rotate(45 ${pos.x} ${pos.y})`} />
            <foreignObject x={pos.x - 23} y={pos.y - 11} width="46" height="22">
              <div xmlns="http://www.w3.org/1999/xhtml" className="flex items-center justify-center h-full">
                <span className="text-[8px] font-bold text-amber-900 text-center leading-tight"><LatexWrapper text={node.label || ''} /></span>
              </div>
            </foreignObject>
          </g>
        );
      }
      
      return null;
    };
    
    const maxRow = Math.max(...nodes.map(n => n.row || 0));
    const svgHeight = 80 + (maxRow * 90) + 60;
    
    return (
      <div className="my-4 pt-4 pb-12 px-2 bg-white border-2 border-indigo-200 rounded-lg overflow-visible">
        <svg viewBox={`0 0 400 ${svgHeight}`} className="w-full mx-auto" style={{minHeight: `${svgHeight}px`}}>
          <defs>
            <marker id="arrowGray" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#64748b" />
            </marker>
          </defs>
          
          {edges?.map((edge, i) => {
            const from = nodePositions[edge.from];
            const to = nodePositions[edge.to];
            if (!from || !to) return null;
            const isBranch = Math.abs(from.x - to.x) > 10;
            
            if (isBranch) {
              const elbowY = from.y + 25;
              return (
                <g key={i}>
                  <line x1={from.x} y1={from.y + 20} x2={from.x} y2={elbowY} stroke="#64748b" strokeWidth="1.5" />
                  <line x1={from.x} y1={elbowY} x2={to.x} y2={elbowY} stroke="#64748b" strokeWidth="1.5" />
                  <line x1={to.x} y1={elbowY} x2={to.x} y2={to.y - 20} stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrowGray)" />
                  {edge.label && <text x={to.x > from.x ? to.x - 12 : to.x + 12} y={elbowY - 4} fontSize="9" fill="#dc2626" fontWeight="700">{edge.label}</text>}
                </g>
              );
            } else {
              return (
                <g key={i}>
                  <line x1={from.x} y1={from.y + 20} x2={to.x} y2={to.y - 20} stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrowGray)" />
                </g>
              );
            }
          })}
          
          {nodes.map((node, i) => {
            const pos = nodePositions[node.id];
            if (!pos) return null;
            return <FlowNode key={i} node={node} pos={pos} />;
          })}
        </svg>
      </div>
    );
  }
  
  return null;
};

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

    // Convert \n to actual newlines and process tables
    let processedText = rawText.replace(/\\n/g, '\n').replace(/\\n\\n\|([^\n]+)\|([\s\S]*?)(?=\\n\\n|$)/g, (match, header, body) => {
      const rows = (header + body).split('\\n').filter(r => r.trim() && !r.match(/^\|[-:\s|]+\|$/));
      if (rows.length === 0) return match;
      
      const tableRows = rows.map(row => {
        const cells = row.split('|').filter(c => c.trim()).map(c => c.trim());
        return cells;
      });
      
      if (tableRows.length === 0) return match;
      
      let html = '<table style="border-collapse:collapse;margin:1em 0;width:100%;border:1px solid #cbd5e1">';
      html += '<thead><tr style="background:#f1f5f9">';
      tableRows[0].forEach(cell => {
        html += `<th style="border:1px solid #cbd5e1;padding:0.5rem;text-align:left;font-weight:600">${cell}</th>`;
      });
      html += '</tr></thead><tbody>';
      
      for (let i = 1; i < tableRows.length; i++) {
        html += '<tr>';
        tableRows[i].forEach(cell => {
          html += `<td style="border:1px solid #cbd5e1;padding:0.5rem">${cell}</td>`;
        });
        html += '</tr>';
      }
      html += '</tbody></table>';
      return html;
    });

    // Process Markdown bold (**text**)
    processedText = processedText.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Split text by LaTeX delimiters: $$...$$ (block) or $...$ (inline)
    const parts = processedText.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);

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

// --- AI TOKEN TRACKING ---
const AI_USAGE_KEY = 'latsol_ai_usage';
const DAILY_REQUEST_LIMIT = 250;
const MINUTE_REQUEST_LIMIT = 10;
const MINUTE_TOKEN_LIMIT = 250000;
const DAILY_LIMIT_LOGGED_IN = 19;
const DAILY_LIMIT_NON_LOGGED_IN = 1;
const COIN_PER_QUESTION = 1; // 1 koin = 1 soal tambahan

const getUsageData = (userId = null) => {
  if (userId) {
    // Firestore mode - akan dihandle di component
    return { dailyCount: 0, geminiCount: 0, hfCount: 0, minuteCount: 0, date: new Date().toDateString(), lastMinute: new Date().getMinutes() };
  }
  
  // LocalStorage mode
  const stored = localStorage.getItem(AI_USAGE_KEY);
  if (!stored) return { dailyCount: 0, geminiCount: 0, hfCount: 0, minuteCount: 0, date: new Date().toDateString(), lastMinute: new Date().getMinutes() };
  
  const data = JSON.parse(stored);
  const today = new Date().toDateString();
  const currentMinute = new Date().getMinutes();
  
  if (data.date !== today) {
    return { dailyCount: 0, geminiCount: 0, hfCount: 0, minuteCount: 0, date: today, lastMinute: currentMinute };
  }
  
  if (data.lastMinute !== currentMinute) {
    data.minuteCount = 0;
    data.lastMinute = currentMinute;
  }
  
  return data;
};

const updateUsageCount = (modelType, userId = null) => {
  if (userId) {
    // Firestore mode - akan dihandle di component
    return;
  }
  
  // LocalStorage mode
  const usage = getUsageData();
  usage.dailyCount += 1;
  usage.minuteCount += 1;
  if (modelType === 'gemini') usage.geminiCount = (usage.geminiCount || 0) + 1;
  else usage.hfCount = (usage.hfCount || 0) + 1;
  localStorage.setItem(AI_USAGE_KEY, JSON.stringify(usage));
  return usage;
};

const getRemainingUsage = () => {
  const usage = getUsageData();
  return {
    daily: Math.max(0, DAILY_REQUEST_LIMIT - usage.dailyCount),
    minute: Math.max(0, MINUTE_REQUEST_LIMIT - usage.minuteCount)
  };
};

const checkTokenUsage = async (apiKey) => {
  if (!apiKey) return null;
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    
    if (response.headers.get('x-goog-quota-user')) {
      const quotaRemaining = response.headers.get('x-goog-quota-remaining');
      const quotaLimit = response.headers.get('x-goog-quota-limit');
      
      return {
        remaining: quotaRemaining ? parseInt(quotaRemaining) : null,
        limit: quotaLimit ? parseInt(quotaLimit) : null,
        percentage: quotaRemaining && quotaLimit ? (parseInt(quotaRemaining) / parseInt(quotaLimit)) * 100 : null
      };
    }
    
    return {
      remaining: null,
      limit: null,
      percentage: null,
      status: 'active'
    };
  } catch (error) {
    console.error('Token check error:', error);
    return null;
  }
};

// --- AI SERVICE ---

const GEMINI_KEY_INDEX = 'gemini_key_index';

const getGeminiKey = () => {
  const index = parseInt(localStorage.getItem(GEMINI_KEY_INDEX) || '0');
  return GEMINI_KEYS[index];
};

const switchGeminiKey = () => {
  const currentIndex = parseInt(localStorage.getItem(GEMINI_KEY_INDEX) || '0');
  const nextIndex = (currentIndex + 1) % GEMINI_KEYS.length;
  localStorage.setItem(GEMINI_KEY_INDEX, nextIndex.toString());
  return GEMINI_KEYS[nextIndex];
};

const generateQuestionsFromImage = async (filesOrImageBase64, subtestLabel, complexity, modelType, apiKey) => {
  if (!apiKey) {
    await new Promise(resolve => setTimeout(resolve, 2500));
    return MOCK_QUESTIONS;
  }

  const subtestId = SUBTESTS.find(s => s.label === subtestLabel)?.id;
  const selectedTemplate = selectTemplate(subtestId, complexity);
  const allPatterns = getAllPatterns(subtestId);
  const patternList = allPatterns
    .filter(p => p.level.includes(complexity))
    .map(p => `- "${p.pattern}" (Tipe: ${p.type})`)
    .join('\n');

  try {
    // Import multi-source processor
    const { processMultipleFiles, generateMultiSourcePrompt } = await import('./utils/multi-source-processor');
    
    let combinedText = '';
    let sourceCount = 1;
    
    // Check if input is array of files (multi-source) or single base64 string
    if (Array.isArray(filesOrImageBase64)) {
      // Multi-source mode
      combinedText = await processMultipleFiles(filesOrImageBase64, (current, total) => {
        console.log(`Processing ${current}/${total} files...`);
      });
      sourceCount = filesOrImageBase64.length;
    } else {
      // Legacy single image mode
      const Tesseract = await import('tesseract.js');
      const { data: { text: rawText } } = await Tesseract.recognize(
        filesOrImageBase64,
        'ind+eng',
        { logger: () => {} }
      );
      combinedText = rawText || '';
    }
    
    if (!combinedText || combinedText.length < 20) {
      return MOCK_QUESTIONS;
    }
    
    // Truncate to 8000 chars for token economy
    const truncatedText = combinedText.slice(0, 8000);

    // Step 2: Shadow Question Generator with Multi-Source Support
    const multiSourceInstruction = sourceCount > 1 ? generateMultiSourcePrompt(truncatedText, sourceCount) : '';
    
    const cleanupPrompt = `
=== PERAN & TUGAS ===
Anda adalah Pembuat Soal UTBK Senior. Tugas Anda adalah membuat "SOAL BAYANGAN" (Shadow Question) dari input teks/gambar yang diberikan.

${multiSourceInstruction}

INPUT TEKS (DARI OCR/PDF):
"${truncatedText}"

=== INSTRUKSI KRUSIAL: ANTI-PLAGIASI ===
1. DILARANG KERAS menyalin nama tokoh, angka, lokasi, atau skenario dari input asli.
2. Anda WAJIB mengubah konteks cerita namun MEMPERTAHANKAN LOGIKA PENYELESAIANNYA (Isomorfik).

=== PROSEDUR VARIASI (STEP-BY-STEP) ===
Langkah 1: Identifikasi Pola (Logic Skeleton)
- Jika soal Matematika: Temukan rumus dasarnya (misal: Deret Aritmatika $U_n$, atau Persamaan Linear $ax+b=c$). Ganti angkanya sehingga hasilnya tetap bulat dan logis.
- Jika soal Logika/PU: Temukan silogismenya (misal: Jika P maka Q). Ganti topik (misal: dari "Festival Seni" menjadi "Pertandingan Olahraga" atau "Panen Raya"), tapi pertahankan struktur sebab-akibatnya.

Langkah 2: Substitusi Elemen
- Ganti Nama: (misal: "SR", "Jani", "Rio" -> Ganti jadi "Budi", "Siti", "Perusahaan X").
- Ganti Angka: Ubah angka masukan, pastikan kunci jawaban berubah tapi cara menghitungnya sama.
- Ganti Skenario: Jika asli tentang "Liburan ke Pantai", ubah menjadi "Proyek Kantor" atau "Persiapan Ujian".

Langkah 3: Math Recovery (CRITICAL)
- Ubah semua notasi matematika yang rusak menjadi format LaTeX Valid
- Bungkus variabel ($x, y, P, Q$) dan angka pecahan/pangkat dengan tanda $
- Gunakan \\\\ (double backslash) untuk perintah LaTeX (contoh: \\\\frac, \\\\approx, \\\\rightarrow)

=== FORMAT OUTPUT (JSON) ===
Hasilkan 5 soal JSON valid dengan struktur berikut:

=== PROTOKOL ESCAPING (CRITICAL) ===
1. Tanda petik: escape dengan \\\"
2. LaTeX: TEPAT DUA backslash (\\\\\\\\frac)
3. Newline: gunakan \\\\n
=== SUBTES & LEVEL ===
Subtes: ${subtestLabel}
Level: ${complexity}

=== POLA TERSEDIA ===
${patternList}

=== OUTPUT (5 SOAL JSON) ===
[
  {
    "stimulus": "Teks stimulus BARU dengan skenario BARU yang Anda buat (JANGAN COPY PASTE INPUT).",
    "representation": {"type": "text", "data": null},
    "text": "Pertanyaan utama...",
    "options": ["Opsi A (Variasi)","Opsi B","Opsi C","Opsi D","Opsi E"],
    "correctIndex": 0,
    "explanation": "Jelaskan cara penyelesaian soal BARU ini. Tunjukkan bahwa polanya sama dengan soal asli tapi angkanya beda."
  }
]
    `;

    if (modelType === 'gemini') {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      
      let attempts = 0;
      const maxAttempts = GEMINI_KEYS.length;
      
      while (attempts < maxAttempts) {
        try {
          const currentKey = getGeminiKey();
          const genAI = new GoogleGenerativeAI(currentKey.key);
          const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            generationConfig: {
              temperature: 0.8,
              topP: 0.95,
              topK: 40,
            }
          });
          
          const result = await model.generateContent(cleanupPrompt);
          const response = await result.response;
          let text = response.text().trim();
          
          text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
          text = text.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
          text = text.replace(/\\\\\\\\"/g, '\\"');
          text = text.replace(/,\s*([\]}])/g, '$1').trim();
          
          try {
            const parsed = JSON.parse(text);
            if (!Array.isArray(parsed) || parsed.length === 0) {
              return MOCK_QUESTIONS;
            }
            return parsed;
          } catch (parseError) {
            console.error('JSON Parse Error:', parseError.message);
            return MOCK_QUESTIONS;
          }
        } catch (error) {
          if (error.message?.includes('quota') || error.message?.includes('limit') || error.message?.includes('429')) {
            const nextKey = switchGeminiKey();
            attempts++;
            if (attempts >= maxAttempts) {
              return MOCK_QUESTIONS;
            }
            // Auto-retry with 3s delay
            await new Promise(resolve => setTimeout(resolve, 3000));
          } else {
            throw error;
          }
        }
      }
    }
  } catch (error) {
    console.error("Vision Service Error:", error);
    return MOCK_QUESTIONS;
  }
};

const generateQuestions = async (context, subtestLabel, complexity, apiKey, modelType, onTokenUpdate, instruksiSpesifik = '') => {
  if (!apiKey) {
    await new Promise(resolve => setTimeout(resolve, 2500));
    return MOCK_QUESTIONS;
  }

  // Dapatkan subtest ID dari label
  const subtestId = SUBTESTS.find(s => s.label === subtestLabel)?.id;
  
  // Pilih template yang sesuai dengan level kesulitan
  const selectedTemplate = selectTemplate(subtestId, complexity);
  const allPatterns = getAllPatterns(subtestId);
  
  // Generate list pola untuk prompt
  const patternList = allPatterns
    .filter(p => p.level.includes(complexity))
    .map(p => `- "${p.pattern}" (Tipe: ${p.type})`)
    .join('\n');

  const prompt = `
SYSTEM: GENERATOR SOAL UTBK-SNBT DENGAN POLA RESMI

=== PROTOKOL ESCAPING KARAKTER (CRITICAL) ===
SETIAP output JSON WAJIB mengikuti aturan ini:
1. Tanda petik ganda di dalam string: WAJIB escape dengan \" (SATU backslash + quote)
   - SALAH: \\" (double backslash)
   - SALAH: " (tanpa escape)
   - BENAR: \" (single backslash)
2. Backslash untuk LaTeX: WAJIB TEPAT DUA backslash \\\\ (contoh: \\\\frac, \\\\circ)
   - SALAH: \\frac (satu backslash), \\\\\\frac (tiga backslash)
   - BENAR: \\\\frac, \\\\circ, \\\\sqrt (dua backslash)
3. Newline: Gunakan \\n, JANGAN baris baru fisik
4. DILARANG ada teks di luar JSON
5. DILARANG markdown code blocks
6. DILARANG karakter kontrol (form feed, tab manual)
7. Markdown Bold: Gunakan **kata** untuk kata yang perlu ditebalkan (soal PBM/Literasi) dengan format latex yang benar
8. Kutipan/Dialog: Gunakan \" untuk dialog atau kutipan dalam teks
   - Contoh: "Dia berkata: \"Semoga berhasil.\""

=== ATURAN WAJIB: HIRARKI SIMBOL (The Layering Rule) ===
Saat menggabungkan format bold (**) dengan tanda petik ganda (\"):
1. PRIORITAS TANDA PETIK: Setiap tanda petik ganda yang merupakan bagian dari kalimat WAJIB di-escape dengan tepat satu backslash, terlepas dari apakah kata tersebut ditebalkan atau tidak.
   - SALAH: "kata **"tebal"**"
   - BENAR: "kata **\"tebal\"**"
2. PENULISAN MARKDOWN DI LUAR KUTIPAN: Jika seluruh kalimat di dalam kutipan ingin ditebalkan, letakkan simbol ** di LUAR tanda petik yang sudah di-escape.
   - Format: **\"Kalimat tebal dan dikutip\"**
3. JANGAN PERNAH membiarkan tanda petik ganda telanjang (") berada di antara simbol asteris (**), karena ini akan menghancurkan struktur JSON.
4. Gunakan spasi yang jelas jika memungkinkan untuk memisahkan simbol agar tidak menempel pada simbol escape.

CONTOH BENAR:
- "Pikiran-pikiran kayak **\"Apakah\"** *goals* hidupku ini realistis?"
- "Kata **\"efektif\"** adalah kata baku yang benar."
- **\"Kalimat ini ditebalkan dan dikutip\"**

=== PROTOKOL LATEX (CRITICAL) ===
SETIAP ekspresi matematika WAJIB dibungkus dengan $:
1. Inline math: $x$, $f(x)$, $\\\\frac{1}{2}$
2. Display math: $$f(x) = 2x + 1$$
3. Variabel tunggal: $x$, $y$, $P$, $Q$ (WAJIB dibungkus $)
4. Angka dalam konteks math: $\\\\frac{1}{9}$, $x^2$
5. WAJIB kurung kurawal: $\\\\frac{1}{9}$ BUKAN $\\\\frac19$
6. Operator: $\\\\times$, $\\\\div$, $\\\\circ$
7. Perbandingan: $P > Q$, $P < Q$, $P = Q$ (dibungkus $)
8. Kurung untuk pecahan/pangkat: Gunakan $\\\\left($ dan $\\\\right)$
   - BENAR: $\\\\left( \\\\frac{1}{2} \\\\right)^2$
   - SALAH: $(\\\\frac{1}{2})^2$ (kurung tidak menyesuaikan tinggi)
9. Fungsi komposisi: $(f \\\\circ g)(x)$ dengan kurung lengkap

=== PROTOKOL BARIS BARU (CRITICAL) ===
Untuk pemisahan paragraf dan list:
1. Gunakan \\n\\n (double) untuk pemisah paragraf/section
2. Gunakan \\n (single) untuk list items
3. Format list: "Text:\\n\\n(1) Item 1\\n(2) Item 2\\n(3) Item 3"
4. JANGAN gunakan \n mentah, WAJIB \\n (escaped)

=== TIPE SOAL KHUSUS SNBT ===

0. FLOWCHART ALGORITMA (flowchart_algo) - ANTI-OVERFLOW PROTOCOL ===
Tipe soal ini menguji pemahaman alur logika algoritma dengan diagram alir.

⚠️ CRITICAL: PROTOKOL ANTI-OVERFLOW (AGAR RAPI)
- Decision (Diamond): Maksimal 10 karakter LaTeX. Contoh: $x < 5?$ ✅, $x$ bilangan prima? ❌
- Process (Rectangle): Maksimal 15 karakter LaTeX. Gunakan simbol, bukan kata. Contoh: $L = p \\\\times l$ ✅, Hitung Luas Persegi ❌
- LaTeX Simpel: Gunakan notasi matematika murni. Hindari teks naratif di dalam diagram
  - Don't: "Masukkan nilai jari-jari"
  - Do: "Input $r$"
- Linear Flow Priority: Prioritaskan alur vertikal (atas ke bawah) agar mudah dibaca di HP

SIMBOL STANDAR (HANYA 4 BENTUK):
1. terminal (Oval): Mulai/Selesai/Output - Contoh: "Mulai", "Selesai", "Output $x$"
2. io (Jajar Genjang): Input/Output Data - Contoh: "Input $a$", "Cetak $Hasil$"
3. process (Persegi Panjang): Perhitungan/Rumus - Contoh: "$x = a + 5$", "$L = p \\\\times l$"
4. decision (Belah Ketupat): Keputusan Ya/Tidak - Contoh: "$x > 10?$", "$s$ Ganjil?"

STRUKTUR JSON:
{
  "type": "flowchart_algo",
  "stimulus": "Perhatikan diagram alir berikut untuk menentukan nilai akhir P.",
  "representation": {
    "type": "flowchart",
    "data": {
      "nodes": [
        {"id": "1", "type": "terminal", "label": "Mulai", "row": 0, "col": 0},
        {"id": "2", "type": "io", "label": "Input $a$", "row": 1, "col": 0},
        {"id": "3", "type": "process", "label": "$x = a^2$", "row": 2, "col": 0},
        {"id": "4", "type": "decision", "label": "$x > 20?$", "row": 3, "col": 0},
        {"id": "5", "type": "process", "label": "$P = x - 5$", "row": 4, "col": -1},
        {"id": "6", "type": "process", "label": "$P = x + 10$", "row": 4, "col": 1},
        {"id": "7", "type": "terminal", "label": "Selesai", "row": 5, "col": 0}
      ],
      "edges": [
        {"from": "1", "to": "2"},
        {"from": "2", "to": "3"},
        {"from": "3", "to": "4"},
        {"from": "4", "to": "5", "label": "Ya"},
        {"from": "4", "to": "6", "label": "Tidak"},
        {"from": "5", "to": "7"},
        {"from": "6", "to": "7"}
      ]
    }
  },
  "text": "Jika input $a = 4$, berapakah nilai akhir $P$?",
  "options": ["13", "18", "21", "26", "28"],
  "correctIndex": 4,
  "explanation": "Langkah 1: Input a=4.\\nLangkah 2: x = 4^2 = 16.\\nLangkah 3: Cek apakah 16 > 20? (TIDAK).\\nLangkah 4: Masuk jalur TIDAK, maka P = 16 + 10 = 26."
}

KAPAN MENGGUNAKAN FLOWCHART_ALGO:
- Soal yang menguji pemahaman alur logika bercabang (if-else)
- Soal yang melibatkan iterasi sederhana atau kondisi bertingkat
- Soal Penalaran Matematika atau Pengetahuan Kuantitatif dengan alur keputusan

PERNYATAAN HARUS:
- Angka input masuk akal dan mudah dihitung manual
- Maksimal 7 nodes agar tidak terlalu kompleks
- Gunakan col: -1, 0, 1 untuk percabangan (kiri, tengah, kanan)
- Setiap decision WAJIB memiliki 2 jalur keluar (Ya/Tidak)

1. HUBUNGAN KUANTITAS (P vs Q) - PK_01
Format khusus untuk membandingkan dua kuantitas P dan Q.

STRUKTUR JSON:
{
  "type": "pq_comparison",
  "stimulus": "Konteks soal...",
  "representation": {"type": "text", "data": null},
  "text": "Berdasarkan informasi yang diberikan, manakah hubungan antara kuantitas P dan Q berikut yang benar?",
  "p_value": "Nilai atau ekspresi P (gunakan LaTeX: $2x + 3$)",
  "q_value": "Nilai atau ekspresi Q (gunakan LaTeX: $5y - 1$)",
  "options": [],
  "correctIndex": 0,
  "explanation": "Penjelasan perbandingan P dan Q..."
}

OPSI TETAP (JANGAN DIUBAH):
A. P > Q
B. Q > P  
C. P = Q
D. Informasi yang diberikan tidak cukup untuk memutuskan salah satu dari tiga pilihan di atas

CONTOH:
{
  "type": "pq_comparison",
  "stimulus": "Diketahui $x > 0$ dan $y > 0$ dengan $x + y = 10$.",
  "text": "Berdasarkan informasi yang diberikan, manakah hubungan antara kuantitas P dan Q berikut yang benar?",
  "p_value": "$x^2 + y^2$",
  "q_value": "$50$",
  "correctIndex": 3,
  "explanation": "Karena $(x+y)^2 = x^2 + 2xy + y^2 = 100$, maka $x^2 + y^2 = 100 - 2xy$. Nilai $xy$ bervariasi tergantung nilai $x$ dan $y$, sehingga hubungan P dan Q tidak dapat ditentukan."
}

2. KECUKUPAN DATA (Data Sufficiency) - PK_02
Format untuk menguji apakah informasi cukup untuk menjawab pertanyaan.

STRUKTUR JSON:
{
  "type": "data_sufficiency",
  "stimulus": "Konteks soal...",
  "representation": {"type": "text", "data": null},
  "text": "Pertanyaan yang harus dijawab...",
  "statements": [
    "Pernyataan (1) dengan LaTeX jika perlu",
    "Pernyataan (2) dengan LaTeX jika perlu"
  ],
  "options": [],
  "correctIndex": 2,
  "explanation": "Analisis: (1) tidak cukup karena... (2) tidak cukup karena... (1)+(2) cukup karena..."
}

OPSI TETAP (JANGAN DIUBAH):
A. Pernyataan (1) SAJA cukup untuk menjawab pertanyaan, tetapi pernyataan (2) SAJA tidak cukup
B. Pernyataan (2) SAJA cukup untuk menjawab pertanyaan, tetapi pernyataan (1) SAJA tidak cukup
C. DUA pernyataan BERSAMA-SAMA cukup untuk menjawab pertanyaan, tetapi SATU pernyataan SAJA tidak cukup
D. Pernyataan (1) SAJA cukup untuk menjawab pertanyaan dan pernyataan (2) SAJA cukup
E. Pernyataan (1) dan pernyataan (2) tidak cukup untuk menjawab pertanyaan

CONTOH:
{
  "type": "data_sufficiency",
  "stimulus": "Sebuah toko menjual dua jenis produk A dan B.",
  "text": "Berapa harga 1 unit produk A?",
  "statements": [
    "Harga 2 unit A dan 3 unit B adalah Rp50.000",
    "Harga 1 unit B adalah Rp8.000"
  ],
  "correctIndex": 2,
  "explanation": "(1) Saja: $2A + 3B = 50000$, tidak cukup (2 variabel). (2) Saja: Hanya tahu B, tidak cukup. (1)+(2): Substitusi $B=8000$ ke persamaan (1), dapat $A = 17000$. Jawaban: C"
}

3. GRID BOOLEAN (Ya/Tidak) - CRITICAL NAMING ===
Tipe soal ini disebut Boolean Matrix Question. User disajikan stimulus dan tabel berisi beberapa pernyataan.
User harus menentukan apakah setiap pernyataan "Ya" (true) atau "Tidak" (false).

SYARAT SKOR: All-or-Nothing. User mendapat poin HANYA jika SEMUA baris dijawab benar.

⚠️ CRITICAL: PENAMAAN FIELD WAJIB (JANGAN SALAH!)
- Field type: WAJIB "grid_boolean"
- Field data: WAJIB "grid_data" (JANGAN gunakan "statements" untuk tipe ini)
- Field di dalam array: WAJIB "statement" dan "correct_answer"

STRUKTUR JSON (WAJIB IKUTI PERSIS):
{
  "type": "grid_boolean",
  "stimulus": "Teks stimulus formal...",
  "representation": {"type": "text", "data": null},
  "text": "Tentukan kebenaran pernyataan berikut berdasarkan stimulus di atas!",
  "grid_data": [
    {"statement": "Pernyataan 1 dengan LaTeX jika perlu: $x > 5$", "correct_answer": true},
    {"statement": "Pernyataan 2", "correct_answer": false},
    {"statement": "Pernyataan 3", "correct_answer": true}
  ],
  "options": [],
  "correctIndex": -1,
  "explanation": "Penjelasan mengapa pernyataan 1 benar (Ya), pernyataan 2 salah (Tidak), dst..."
}

KAPAN MENGGUNAKAN GRID BOOLEAN:
- Soal yang menguji validitas MULTIPLE pernyataan sekaligus
- Analisis data/tabel dengan beberapa kesimpulan
- Evaluasi kebenaran beberapa sifat matematika
- Penalaran logika dengan multiple proposisi
- Literasi: evaluasi kebenaran beberapa pernyataan dari bacaan

CONTOH GRID BOOLEAN:
{
  "type": "grid_boolean",
  "stimulus": "Data penjualan buku dalam 5 hari: 12, 15, 18, 14, 16 buku.",
  "representation": {"type": "text", "data": null},
  "text": "Tentukan kebenaran pernyataan berikut!",
  "grid_data": [
    {"statement": "Rata-rata penjualan adalah 15 buku", "correct_answer": true},
    {"statement": "Median data lebih besar dari rata-rata", "correct_answer": false},
    {"statement": "Total penjualan mencapai 75 buku", "correct_answer": true},
    {"statement": "Penjualan tertinggi adalah 18 buku", "correct_answer": true}
  ],
  "options": [],
  "correctIndex": -1,
  "explanation": "(1) Ya: $(12+15+18+14+16)/5 = 15$. (2) Tidak: Median = 15, sama dengan rata-rata. (3) Ya: Total = 75. (4) Ya: Maksimum = 18."
}

PERNYATAAN HARUS:
- Tidak ambigu dan memiliki dasar kuat dari stimulus
- Menantang (HOTS) - bukan fakta langsung
- Menggunakan LaTeX untuk rumus: $\\\\frac{a}{b}$, $x^2$, $P > Q$
- 3-5 pernyataan per soal

INSTRUKSI GENERATE:
Jika konteks cocok untuk multiple evaluasi, gunakan type "grid_boolean".
Jika hanya 1 pertanyaan, gunakan type regular (tanpa field type).

=== VALIDASI SEBELUM OUTPUT ===
Sebelum memberikan JSON, cek:
✓ Semua LaTeX command menggunakan TEPAT DUA backslash (\\\\frac, \\\\circ)
✓ Semua variabel dan rumus dibungkus $ ($x$, $\\\\frac{1}{2}$)
✓ Semua tanda petik di dalam string di-escape (\\")
✓ Tidak ada karakter kontrol atau hidden symbols
✓ Kurung kurawal lengkap pada semua LaTeX command
✓ Untuk grid_boolean: field "options" kosong [], "correctIndex" = -1

=== TEMPLATE WAJIB ===
Subtes: ${subtestLabel}
${complexity === 0 ? `
🎯 LEVEL 0: ADAPTIVE MODE (PRIORITAS TERTINGGI)
Anda WAJIB menganalisis konteks dan instruksi spesifik user untuk memilih pola soal yang PALING SESUAI dari level 1-5.

ANALISIS KONTEKS:
1. Baca konteks user dengan teliti
2. Identifikasi kata kunci: "mudah", "sulit", "dasar", "HOTS", "analisis", "pemahaman", dll
3. Perhatikan instruksi spesifik user (jika ada)
4. Pilih level kesulitan yang paling cocok:
   - Level 1-2: Jika konteks sederhana, pemahaman literal, atau user minta "mudah"
   - Level 3: Jika konteks standar, inferensi sederhana
   - Level 4-5: Jika konteks kompleks, analisis mendalam, atau user minta "sulit"/"HOTS"

POLA YANG TERSEDIA (PILIH YANG PALING SESUAI):
${patternList || '(Gunakan pola umum untuk subtes ini)'}

CONTOH ADAPTIVE:
- Konteks: "Cerita sederhana tentang anak sekolah" → Pilih pola level 1-2
- Konteks: "Analisis kebijakan ekonomi kompleks" → Pilih pola level 4-5
- Instruksi: "Buat soal HOTS tentang statistika" → Pilih pola level 5
- Instruksi: "Soal dasar tentang ejaan" → Pilih pola level 1

WAJIB: Sesuaikan tingkat kesulitan dengan konteks user!
` : `
Gunakan HANYA pola pertanyaan berikut:

${patternList || '(Gunakan pola umum untuk subtes ini)'}

CRITICAL: Setiap soal HARUS mengikuti salah satu pola di atas PERSIS.
Jangan membuat pola pertanyaan baru atau modifikasi pola.
${selectedTemplate ? `\nTEMPLATE PRIORITAS: "${selectedTemplate.pattern}"` : ''}
`}

${instruksiSpesifik ? `
=== INSTRUKSI SPESIFIK DARI USER (PRIORITAS TINGGI) ===
User meminta: "${instruksiSpesifik}"

ATURAN PEMROSESAN INSTRUKSI SPESIFIK:
1. PRIORITAS UTAMA: Jika field instruksi_spesifik diisi, Anda WAJIB memprioritaskan sudut pandang tersebut dalam pembuatan soal tanpa keluar dari batasan subtes.
2. INTEGRASI KONTEKS: Jangan membuat soal di luar data yang ada pada konteks. Jika instruksi spesifik meminta "Grafik" namun konteks tidak memiliki data angka, buatlah data angka yang logis berdasarkan narasi konteks tersebut.
3. FORMAT MATEMATIKA: Gunakan standar LaTeX dengan pembungkus $...$ untuk semua simbol, variabel, dan persamaan matematika agar dapat dirender oleh library KaTeX.
4. LOGIKA SOAL: Pastikan tingkat kesulitan sesuai dengan level yang dipilih (Level 1: Dasar, Level 3: Menengah-Sulit/HOTS).

CONTOH PENANGANAN:
- Input Spesifik: "Buat dalam bentuk grafik"
  Respon AI: "Berdasarkan teks di atas, jika data tersebut disajikan dalam grafik batang, manakah visualisasi yang tepat..." (Sertakan tabel data pendukung di dalam soal).
- Input Spesifik: "Fokus pada perbandingan"
  Respon AI: Buat soal yang menggunakan konsep perbandingan (rasio, proporsi, atau hubungan kuantitatif P dan Q).
- Input Spesifik: "Gunakan flowchart"
  Respon AI: Buat soal dengan representation type "flowchart" yang menggambarkan alur logika atau proses.

WAJIB: Rekonstruksi formal sesuai instruksi spesifik, JANGAN tampilkan input user mentah!
` : ''}

=== PRINSIP GLOBAL (WAJIB) ===
✓ UTBK menguji PENGOLAHAN INFORMASI, bukan hafalan
✓ Jawaban benar JARANG yang paling "enak dibaca"
✓ Informasi kunci SELALU IMPLISIT
✓ Distraktor dibuat dari KESALAHAN BERPIKIR NYATA
✓ Bahasa: NETRAL, IMPERSONAL, FORMAL-INFORMATIF
✓ TANPA kata: "aku", "kamu", "kita", "menurut Anda", "pendapat"

=== BLUEPRINT SUBTES: ${subtestLabel} ===

${subtestLabel.includes('Penalaran Umum') ? `
TARGET: Inferensi, hubungan sebab-akibat, konsistensi logika
STRUKTUR: Stimulus → Informasi implisit → Pertanyaan inferensial
POLA PERTANYAAN WAJIB:
- "Berdasarkan informasi tersebut, manakah simpulan yang PASTI BENAR?"
- "Simpulan yang PALING MUNGKIN benar adalah..."
- "Manakah yang PALING MUNGKIN menjadi penyebab utama..."
- "Apa yang PALING MUNGKIN terjadi jika..."
- "Informasi tambahan manakah yang paling memperkuat argumen..."
DILARANG: "Mengapa", "Apa yang terjadi", "Berdasarkan teks, siapa"
DISTRAKTOR:
A: Logis tapi salah asumsi
B: Benar sebagian
C: Terlalu literal
D: Konsisten penuh (JAWABAN)
E: Overgeneralisasi
` : ''}

${subtestLabel.includes('Pengetahuan & Pemahaman Umum') ? `
TARGET: Makna kata dalam konteks, ide pokok implisit, hubungan gagasan
POLA PERTANYAAN WAJIB:
- "Imbuhan [...] dalam kata [...] memiliki makna yang sama dengan..."
- "Informasi berikut sesuai dengan teks, kecuali..."
- "Gagasan utama yang dapat disimpulkan dari teks adalah..."
- "Kalimat yang tidak logis dalam bacaan adalah..."
BAHASA: Tidak emotif, tidak personal, tidak metaforis berlebihan
FRASA KHAS: "mengindikasikan bahwa", "dapat disimpulkan", "memperlihatkan kecenderungan"
` : ''}

${subtestLabel.includes('Pemahaman Bacaan & Menulis') ? `
TARGET: Kohesi, koherensi, struktur teks, logika antar paragraf
POLA PERTANYAAN WAJIB:
- "Perbaikan ejaan yang tepat pada kalimat [...] adalah..."
- "Kata yang paling tepat untuk melengkapi [...] adalah..."
- "Kalimat tidak efektif yang terdapat pada teks adalah..."
- "Kata '[kata]' memiliki makna yang sama dengan..."
- "Kalimat di bawah ini tepat diletakkan sesudah kalimat..."
- "Penulisan kata bercetak tebal yang benar terdapat pada kalimat..."
TIPE: Kalimat tidak padu, paragraf tidak logis, urutan kalimat
BUKAN soal EYD murni → SOAL LOGIKA KEBAHASAAN

FORMAT STIMULUS PBM:
- Setiap kalimat WAJIB diberi nomor: (1), (2), (3), dst
- Kata yang menjadi objek analisis WAJIB ditebalkan dengan **kata**
- Contoh: "(1) **Charles** adalah pelajar yang **aktif**."
- Jika soal menanyakan "kata bercetak tebal", pastikan kata tersebut ada di stimulus dengan format **bold**
` : ''}

${subtestLabel.includes('Pengetahuan Kuantitatif') ? `
TARGET: Pemodelan matematika, estimasi, hubungan kuantitatif
POLA PERTANYAAN WAJIB:
- "Berdasarkan informasi yang diberikan, maka hubungan antara kuantitas P dan Q berikut yang benar adalah..."
- "Putuskan apakah pernyataan (1) dan (2) berikut cukup untuk menjawab pertanyaan tersebut."
- "Banyaknya pernyataan yang benar adalah sebanyak..."
- "Maka, jarak [TITIK] ke bidang [BIDANG] adalah..."
CIRI: Angka kecil, rumus sederhana, konsep tersembunyi
JIKA bisa diselesaikan 1 rumus langsung → TERLALU MUDAH
` : ''}

${subtestLabel.includes('Literasi Bahasa Indonesia') ? `
TARGET: Evaluasi argumen, konsistensi gagasan, implikasi teks
POLA PERTANYAAN WAJIB:
- "Pernyataan yang TIDAK sesuai dengan bacaan di atas adalah..."
- "Berdasarkan teks, mengapa [SUBJEK] melakukan [TINDAKAN]?"
- "Makna dari '[KATA/FRASA]' berdasarkan bacaan adalah..."
- "Apa langkah yang dapat dilakukan sebagai langkah mengantisipasi [MASALAH]?"
- "Penulisan kata bercetak tebal yang benar terdapat pada kalimat..."
TIDAK bertanya "apa isi teks" → BERTANYA "apa makna/dampak/implikasi"

FORMAT STIMULUS LITERASI:
- Setiap kalimat WAJIB diberi nomor: (1), (2), (3), dst
- Kata yang menjadi objek analisis WAJIB ditebalkan dengan **kata**
- Contoh: "(1) **Efektif** adalah kata baku yang benar."
` : ''}

${subtestLabel.includes('Literasi Bahasa Inggris') ? `
TARGET: Inference, reference, author's intent
POLA PERTANYAAN WAJIB (ENGLISH ONLY):
- "Which of the following is NOT the reason why..."
- "Which of the following is the best main idea of the text?"
- "What can we infer from the passage?"
- "The word '[WORD]' is closest in meaning to..."
- "Which tone best describes the author..."
- "According to the text, the purpose of [ACTION] is to..."
BAHASA: Formal, akademik ringan, tidak idiomatik berat
FORMAT KHUSUS: Gunakan "thread" untuk diskusi forum/komentar online
- Thread berisi 4-6 posts dengan author berbeda
- Setiap post: author name, timestamp, content
- Pertanyaan tentang: argumen, sikap penulis, implikasi, kesimpulan diskusi
- Thread berisi konten yang agak panjang, agar ada cukup informasi untuk inferensi

CRITICAL: ALL OUTPUT MUST BE IN ENGLISH
- Stimulus: English
- Question text: English
- All options: English
- Explanation: English
- Thread posts content: English
DO NOT translate to Indonesian. Keep everything in English.
` : ''}

${subtestLabel.includes('Penalaran Matematika') ? `
TARGET: Struktur berpikir matematis, generalisasi, analisis pola
POLA PERTANYAAN WAJIB:
- "Berapa maksimal [OBJEK] yang bisa [AKSI] dengan pertimbangan [KONDISI]?"
- "Berapa [BESARAN] yang tersisa dengan pertimbangan [KONDISI]?"
- "Jika Kn menyatakan bilangan pada petak pertama baris ke-n, maka Kn = ..."
- "Tentukan nilai kebenaran dari pernyataan-pernyataan di bawah ini!"
BUKAN hitung panjang → FOKUS ke alasan matematis
` : ''}

=== PIPELINE PEMBUATAN SOAL ===
1. EKSTRAKSI → Ambil fakta, besaran, perbandingan. BUANG cerita, emosi, merek, sudut pandang pribadi
2. KLASIFIKASI → Tentukan konsep: sebab-akibat, perubahan nilai, perbandingan, tren waktu
3. PILIH REPRESENTASI:
   - Perubahan waktu → table/chart
   - Kondisi berbeda → function
   - Perbandingan jumlah → table
   - Hubungan matematis → function/chart
   - Sebab-akibat naratif → text
   - Geometri/spasial → shape
   - Proses/alur → flowchart
4. REKONSTRUKSI STIMULUS → Tulis formal, netral, impersonal, informatif
5. BUAT PERTANYAAN sesuai level:
   Level 1: Identifikasi langsung
   Level 2: Hubungan sebab-akibat
   Level 3: Inferensi multi-langkah
   Level 4: Asumsi implisit
   Level 5: Generalisasi/kontra-contoh
6. BUAT OPSI → Semua masuk akal, tidak ada yang jelas salah

=== INPUT ===
KONTEKS: "${context}"
LEVEL: ${complexity === 0 ? 'ADAPTIVE (Pilih level 1-5 yang paling sesuai dengan konteks)' : complexity}

=== OUTPUT JSON (5 SOAL) ===
Campurkan tipe soal regular dan grid_boolean sesuai konteks.
[
  {
    "type": "grid_boolean" (OPSIONAL, hanya untuk soal tabel Ya/Tidak),
    "stimulus": "Teks formal netral impersonal...",
    "representation": {
      "type": "text" | "table" | "function" | "chart" | "shape" | "flowchart" | "grid_boolean",
      "data": null | [["Header","Header"],["val","val"]] | {"function":"f(x)=","cases":[{"condition":"","result":""}]} | {"points":[[x,y]],"xLabel":"","yLabel":""} | {"shapeType":"rectangle|circle|triangle_right|cube","dimensions":{},"labels":{}} | {"nodes":[{"id":"","label":"","type":"start|process|decision|end"}],"edges":[{"from":"","to":"","label":""}]}
    },
    "text": "Pertanyaan inferensial...",
    "grid_data": [{"statement":"...","correct_answer":true}] (HANYA untuk type grid_boolean),
    "options": ["Logis salah asumsi","Benar sebagian","Terlalu literal","Konsisten penuh","Overgeneralisasi"],
    "correctIndex": 3,
    "explanation": "Penjelasan logis..."
  }
]

CONTOH CAMPURAN (5 SOAL):
[
  {"type":"pq_comparison","stimulus":"...","text":"Hubungan P dan Q?","p_value":"$x^2$","q_value":"$2x$","correctIndex":3,"explanation":"..."},
  {"type":"data_sufficiency","stimulus":"...","text":"Berapa nilai x?","statements":["...","..."],"correctIndex":2,"explanation":"..."},
  {"type":"grid_boolean","stimulus":"...","text":"Tentukan kebenaran!","grid_data":[...],"correctIndex":-1,"explanation":"..."},
  {"stimulus":"...","text":"Simpulan tepat?","options":[...],"correctIndex":2,"explanation":"..."},
  {"stimulus":"...","text":"Nilai yang memenuhi?","options":[...],"correctIndex":1,"explanation":"..."}
]

PRIORITAS PENGGUNAAN:
- Untuk subtes PK (Pengetahuan Kuantitatif): Gunakan pq_comparison dan data_sufficiency lebih sering
- Untuk subtes PM (Penalaran Matematika): Gunakan soal regular dengan konteks aplikatif
- Untuk subtes lain: Gunakan grid_boolean untuk evaluasi multiple pernyataan, regular untuk lainnya

CONTOH REPRESENTATION:
- text: {"type":"text","data":null}
- table: {"type":"table","data":[["Variabel","Nilai"],["X","10"],["Y","20"]]}
- function: {"type":"function","data":{"function":"T = \\\\frac{V}{R}","variables":[{"name":"V","desc":"Volume ($m^3$)"},{"name":"R","desc":"Laju ($m^3$/menit)"}]}}
- chart: {"type":"chart","data":{"points":[[0,0],[1,2],[2,4]],"xLabel":"Waktu (jam)","yLabel":"Jarak (km)"}}
- shape: {"type":"shape","data":{"shapeType":"triangle_right","dimensions":{"side_a":"3","side_b":"4"},"labels":{"side_a":"a","side_b":"b","side_c":"c"}}}
- flowchart: {"type":"flowchart","data":{"nodes":[{"id":"1","label":"Mulai","type":"start","row":0,"col":0},{"id":"2","label":"x > 5?","type":"decision","row":1,"col":0},{"id":"3","label":"Selesai","type":"end","row":2,"col":0}],"edges":[{"from":"1","to":"2"},{"from":"2","to":"3","label":"Ya"}]}}
- thread: {"type":"thread","data":{"posts":[{"author":"John_Doe","date":"01 January 2024, 10:00 AM","content":"First post content..."},{"author":"Jane_Smith","date":"01 January 2024, 11:30 AM","content":"Reply content..."}]}}

LaTeX: $inline$ atau $$block$$
Escape backslash: \\\\

WAJIB: Rekonstruksi formal, JANGAN tampilkan input user mentah!

=== VALIDASI SEBELUM OUTPUT ===
Sebelum memberikan JSON, cek:
✓ Semua tanda petik di dalam string sudah di-escape dengan \\\"
✓ Semua backslash LaTeX sudah double \\\\
✓ Tidak ada baris baru fisik di dalam string
✓ Kurung kurawal dan siku seimbang
✓ Tidak ada trailing comma
  `;

  try {
    if (modelType === 'gemini') {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      
      let attempts = 0;
      const maxAttempts = GEMINI_KEYS.length;
      
      while (attempts < maxAttempts) {
        try {
          const currentKey = getGeminiKey();
          const genAI = new GoogleGenerativeAI(currentKey.key);
          const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
          const result = await model.generateContent(prompt);
          const response = await result.response;
          let text = response.text().trim();
          
          // 1. Remove markdown code blocks
          text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
          
          // 2. Remove control characters
          text = text.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
          
          // 3. Fix common AI mistakes
          text = text.replace(/\\\\"/g, '\\"');
          
          // 4. Remove trailing commas
          text = text.replace(/,\s*([\]}])/g, '$1').trim();
          
          try {
            const parsed = JSON.parse(text);
            if (!Array.isArray(parsed) || parsed.length === 0) {
              console.error('Invalid response format');
              return MOCK_QUESTIONS;
            }
            return parsed;
          } catch (parseError) {
            console.error('JSON Parse Error:', parseError.message);
            console.error('Problematic JSON (first 1000 chars):', text.substring(0, 1000));
            console.error('Error at position:', parseError.message.match(/position (\d+)/)?.[1]);
            
            // Emergency recovery
            try {
              let recoveryText = text
                .replace(/\\(?!["\\/bfnrtu$])/g, '\\\\') // Escape standalone backslashes
                .replace(/\n/g, '\\n') // Fix literal newlines
                .replace(/"[^"]*$/g, '"') // Close truncated strings
                .trim();
              
              if (!recoveryText.endsWith(']')) {
                recoveryText = recoveryText.replace(/[,\s]*$/, '') + ']';
              }
              
              const retryParsed = JSON.parse(recoveryText);
              if (Array.isArray(retryParsed) && retryParsed.length > 0) {
                console.log('✓ Recovered with emergency fix');
                return retryParsed;
              }
            } catch (retryError) {
              console.error('Recovery failed:', retryError.message);
            }
            
            return MOCK_QUESTIONS;
          }
        } catch (error) {
          if (error.message?.includes('quota') || error.message?.includes('limit') || error.message?.includes('429')) {
            const nextKey = switchGeminiKey();
            console.log(`Switching to ${nextKey.name} account...`);
            attempts++;
            if (attempts >= maxAttempts) {
              return MOCK_QUESTIONS;
            }
          } else {
            console.error('Parse error, using fallback questions:', error);
            return MOCK_QUESTIONS;
          }
        }
      }
    } else if (modelType === 'qwen') {
      const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'google/gemma-3-27b-it:featherless-ai',
          messages: [{ role: 'user', content: prompt }],
          stream: false
        })
      });
      const data = await response.json();
      if (!data.choices || !data.choices[0]) {
        if (data.error?.code === 429) {
          // Rate limit handled by caller
        }
        console.error('HuggingFace Error:', data.error?.message || data);
        return MOCK_QUESTIONS;
      }
      let text = data.choices[0].message.content.trim();
      
      // 1. Remove markdown code blocks
      text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // 2. Remove control characters
      text = text.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
      
      // 3. Fix common AI mistakes
      text = text.replace(/\\\\"/g, '\\"');
      
      // 4. Remove trailing commas
      text = text.replace(/,\s*([\]}])/g, '$1').trim();
      
      try {
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          console.error('Invalid response format');
          return MOCK_QUESTIONS;
        }
        return parsed;
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError.message);
        console.error('Problematic JSON (first 1000 chars):', text.substring(0, 1000));
        
        try {
          let recoveryText = text
            .replace(/\\(?!["\\/bfnrtu$])/g, '\\\\')
            .replace(/\n/g, '\\n')
            .replace(/"[^"]*$/g, '"')
            .trim();
          
          if (!recoveryText.endsWith(']')) {
            recoveryText = recoveryText.replace(/[,\s]*$/, '') + ']';
          }
          
          const retryParsed = JSON.parse(recoveryText);
          if (Array.isArray(retryParsed) && retryParsed.length > 0) {
            console.log('✓ Recovered with emergency fix');
            return retryParsed;
          }
        } catch (retryError) {
          console.error('Recovery failed:', retryError.message);
        }
        
        return MOCK_QUESTIONS;
      }
    }
  } catch (error) {
    console.error("AI Service Error:", error);
    return MOCK_QUESTIONS; 
  }
};

// --- GAME PLAYER COMPONENT ---
const GameOverModal = ({ onRestart }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
    <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 transform animate-bounce-in">
      <div className="text-center">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Skull className="text-rose-600" size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Game Over!</h3>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          Player terbunuh! Nyawa habis.
        </p>
        <button onClick={onRestart} className="w-full px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all">
          Lihat Hasil
        </button>
      </div>
    </div>
  </div>
);

const LoginRequiredModal = ({ onClose, onLogin }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
    <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 transform animate-bounce-in">
      <div className="text-center">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="text-indigo-600" size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Login Diperlukan</h3>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          Untuk menggunakan fitur Community, silakan login terlebih dahulu.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
            Batal
          </button>
          <button onClick={onLogin} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">
            Login
          </button>
        </div>
      </div>
    </div>
  </div>
);

const DeveloperPasswordModal = ({ onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = () => {
    if (password === 'admin123') {
      sessionStorage.setItem('dev_mode', 'true');
      onSuccess();
    } else {
      setError('Password salah!');
      setTimeout(() => setError(''), 2000);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 transform animate-bounce-in">
        <div className="text-center">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="text-rose-600" size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Developer Mode</h3>
          <p className="text-slate-600 text-sm mb-4 leading-relaxed">
            Masukkan password untuk akses unlimited.
          </p>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Password"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          {error && <p className="text-rose-600 text-sm mb-4">{error}</p>}
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
              Batal
            </button>
            <button onClick={handleSubmit} className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all">
              Masuk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfirmStartModal = ({ tryout, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full transform animate-bounce-in">
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold">Konfirmasi Persiapan Ujian 🚀</h3>
            <p className="text-sm opacity-90">Pastikan kamu siap!</p>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-bold text-amber-900 mb-2">{tryout?.title}</h4>
          <div className="flex items-center gap-4 text-sm text-amber-700">
            <span>📝 {tryout?.questionsList?.length || 0} Soal</span>
            <span>⏱️ {Math.floor((tryout?.totalDuration || 0) / 60)} Menit</span>
          </div>
        </div>
        
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
          <p className="text-sm text-rose-800 leading-relaxed">
            ⚠️ <strong>Perhatian:</strong> Waktu pengerjaan akan segera dimulai setelah Anda menekan tombol "Mulai Tryout". 
            Waktu akan terus berjalan dan <strong>tidak dapat diulang atau dijeda</strong>. 
            Pastikan koneksi internet Anda stabil dan Anda berada di tempat yang nyaman untuk berkonsentrasi.
          </p>
        </div>
        
        <p className="text-center text-slate-600 font-medium">Apakah Anda yakin ingin memulai sekarang?</p>
      </div>
      
      <div className="p-6 pt-0 flex gap-3">
        <button 
          onClick={onCancel}
          className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-medium"
        >
          Batalkan
        </button>
        <button 
          onClick={onConfirm}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all font-bold shadow-lg"
        >
          🚀 Mulai Tryout
        </button>
      </div>
    </div>
  </div>
);

const ConfirmModal = ({ message, onConfirm, onCancel, unansweredCount = 0, raguCount = 0 }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
    <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 transform animate-bounce-in">
      <div className="text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="text-amber-600" size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Konfirmasi</h3>
        {unansweredCount > 0 && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg">
            <p className="text-sm text-rose-800 font-semibold flex items-center justify-center gap-2">
              <AlertTriangle size={16} className="text-rose-600" />
              Ada {unansweredCount} soal yang belum dijawab!
            </p>
          </div>
        )}
        {raguCount > 0 && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800 font-semibold flex items-center justify-center gap-2">
              <AlertTriangle size={16} className="text-amber-600" />
              Ada {raguCount} soal yang ditandai ragu-ragu!
            </p>
          </div>
        )}
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
            Batal
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">
            Ya, Lanjutkan
          </button>
        </div>
      </div>
    </div>
  </div>
);

const WelcomeModal = ({ onClose }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  
  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideWelcomeModal', 'true');
    }
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4 pt-24">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform animate-bounce-in overflow-hidden">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 p-6 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Selamat Datang!</h3>
          <p className="text-sm opacity-90">Terima kasih sudah bergabung dengan SNBT AI</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users size={18} className="text-teal-600" />
              <h4 className="font-bold text-teal-900 text-sm">Gabung Komunitas WhatsApp</h4>
            </div>
            <p className="text-xs text-teal-700 mb-3">Diskusi soal, tips UTBK, dan update fitur terbaru!</p>
            <a 
              href="https://chat.whatsapp.com/LlX1whgL8dVBM9QbApSZjO" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-all text-center"
            >
              Join Sekarang →
            </a>
          </div>
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={18} className="text-rose-600" />
              <h4 className="font-bold text-rose-900 text-sm">Tonton Video Panduan</h4>
            </div>
            <p className="text-xs text-rose-700 mb-3">Pelajari cara maksimalkan fitur SNBT AI</p>
            <a 
              href="https://youtu.be/06PX_BtVQXM" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-all text-center"
            >
              Tonton Tutorial →
            </a>
          </div>
          <label className="flex items-center gap-2 cursor-pointer px-2 py-1">
            <input 
              type="checkbox" 
              checked={dontShowAgain} 
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="accent-indigo-600 w-4 h-4"
            />
            <span className="text-xs text-slate-600">Jangan tampilkan lagi</span>
          </label>
          <button 
            onClick={handleClose}
            className="w-full px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium"
          >
            Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
};

const GamePlayer = ({ health, isCorrect, isWrong, streak }) => {
  const getPlayerState = () => {
    if (isWrong) return 'hurt';
    if (isCorrect) return 'happy';
    if (health <= 1) return 'critical';
    return 'normal';
  };
  
  const state = getPlayerState();
  
  const getPlayerIcon = () => {
    if (state === 'hurt') return <Frown size={32} className="text-white" />;
    if (state === 'happy') return <Smile size={32} className="text-white" />;
    if (state === 'critical') return <Skull size={32} className="text-white" />;
    return <Meh size={32} className="text-white" />;
  };
  
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
        state === 'hurt' ? 'bg-rose-500 animate-pulse scale-90' :
        state === 'happy' ? 'bg-teal-500 animate-bounce scale-110' :
        state === 'critical' ? 'bg-red-600 animate-pulse' :
        'bg-indigo-500'
      }`}>
        {getPlayerIcon()}
      </div>
      <div className="flex space-x-1">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full ${
            i < health ? 'bg-red-500' : 'bg-gray-300'
          }`} />
        ))}
      </div>
      {streak > 0 && (
        <div className="text-xs font-bold text-amber-500 animate-pulse flex items-center gap-1">
          <Flame size={14} className="text-amber-500" /> {streak} Streak!
        </div>
      )}
    </div>
  );
};

// --- COMPONENTS ---

const Logo = ({ size = 40, showText = true, className = "", textColor = "text-slate-900" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="relative">
      <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-sm">
        <defs>
          <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:"#4f46e5",stopOpacity:1}} />
            <stop offset="50%" style={{stopColor:"#7c3aed",stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:"#2563eb",stopOpacity:1}} />
          </linearGradient>
          <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:"#06b6d4",stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:"#0891b2",stopOpacity:1}} />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#brainGradient)" stroke="#1e293b" strokeWidth="2"/>
        <path d="M25 35 C20 30, 20 25, 25 22 C30 20, 35 22, 38 25 C42 20, 48 20, 52 22 C58 20, 65 22, 70 25 C75 22, 80 25, 80 30 C82 35, 80 40, 75 42 C80 45, 82 50, 80 55 C82 60, 80 65, 75 68 C70 70, 65 68, 62 65 C58 70, 52 70, 48 68 C42 70, 35 68, 32 65 C28 68, 22 65, 20 60 C18 55, 20 50, 25 48 C20 45, 18 40, 20 35 Z" fill="white" opacity="0.9"/>
        <g stroke="url(#circuitGradient)" strokeWidth="2" fill="none" opacity="0.8">
          <line x1="30" y1="40" x2="45" y2="40"/>
          <line x1="55" y1="40" x2="70" y2="40"/>
          <line x1="30" y1="50" x2="40" y2="50"/>
          <line x1="60" y1="50" x2="70" y2="50"/>
          <line x1="35" y1="60" x2="50" y2="60"/>
          <line x1="55" y1="60" x2="65" y2="60"/>
          <line x1="40" y1="45" x2="40" y2="55"/>
          <line x1="60" y1="45" x2="60" y2="55"/>
          <line x1="50" y1="35" x2="50" y2="45"/>
        </g>
        <g fill="url(#circuitGradient)">
          <circle cx="40" cy="40" r="2"/>
          <circle cx="60" cy="40" r="2"/>
          <circle cx="40" cy="50" r="2"/>
          <circle cx="60" cy="50" r="2"/>
          <circle cx="50" cy="60" r="2"/>
          <circle cx="50" cy="40" r="2"/>
        </g>
      </svg>
    </div>
    {showText && (
      <div className="flex flex-col">
        <span className={`font-bold text-lg leading-none ${textColor}`}>SNBT AI</span>
        <span className={`text-xs leading-none ${textColor === 'text-white' ? 'text-indigo-200' : 'text-slate-500'}`}>AI-Powered Learning</span>
      </div>
    )}
  </div>
);

const TokenIndicator = ({ apiKey }) => {
  const [usage, setUsage] = useState(getRemainingUsage());
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setUsage(getRemainingUsage());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  if (!apiKey) return null;
  
  const getColor = () => {
    if (usage.daily < 50 || usage.minute < 2) return 'text-rose-600 bg-rose-50 border-rose-200';
    if (usage.daily < 100 || usage.minute < 5) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-teal-600 bg-teal-50 border-teal-200';
  };
  
  return (
    <div className="relative">
      <button 
        onClick={() => setShowDetails(!showDetails)}
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold transition-all hover:scale-105 ${getColor()}`}
      >
        <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
        <span>{MINUTE_REQUEST_LIMIT - usage.minute}/{MINUTE_REQUEST_LIMIT} menit</span>
      </button>
      
      {showDetails && (
        <div className="absolute bottom-full left-0 mb-2 p-6 bg-white rounded-xl shadow-xl border border-slate-200 z-50 w-80">
          <div className="text-sm space-y-4">
            <div className="font-bold text-slate-800 text-center border-b pb-3 text-base">Google AI Studio Free Tier</div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600 font-medium">Per Day:</span>
                <span className={`font-mono font-bold text-lg ${usage.daily < 50 ? 'text-rose-600' : usage.daily < 100 ? 'text-amber-600' : 'text-teal-600'}`}>
                  {DAILY_REQUEST_LIMIT - usage.daily}/{DAILY_REQUEST_LIMIT}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600 font-medium">Per Minute:</span>
                <span className={`font-mono font-bold text-lg ${usage.minute < 2 ? 'text-rose-600' : usage.minute < 5 ? 'text-amber-600' : 'text-teal-600'}`}>
                  {MINUTE_REQUEST_LIMIT - usage.minute}/{MINUTE_REQUEST_LIMIT}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600 font-medium">Tokens/Min:</span>
                <span className="font-mono font-bold text-lg text-indigo-600">
                  {MINUTE_TOKEN_LIMIT.toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="pt-3 border-t text-slate-500 text-center">
              <div className="text-xs">Reset: Harian 00:00 | Per menit otomatis</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const baseStyle = "px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20",
    secondary: "bg-white text-slate-700 border-2 border-slate-200 hover:bg-slate-50 hover:border-primary/30 shadow-sm",
    ghost: "text-slate-500 hover:text-primary hover:bg-primary/5",
    success: "bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-200"
  };
  return <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} disabled={disabled}>{children}</button>;
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${className}`}>{children}</div>
);

// --- VIEWS ---



const HomeView = ({ formData, setFormData, handleStart, errorMsg, mode, setMode, apiKey, modelType, setModelType, onHelp, user, onLogin, onLogout, usageData, setView, setShowLoginModal, myQuestions, onReloadQuestions, isDeveloperMode = false, totalQuestionsInBank = 0, isAdmin = false, navigate }) => {
  const coinBalance = 0;
  // Reload questions when component mounts
  useEffect(() => {
    if (user && onReloadQuestions) {
      onReloadQuestions();
    }
  }, [user, onReloadQuestions]);
  
  const getDailyUsage = () => {
    if (user) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTimestamp = today.getTime() / 1000;
      
      // Count sets created today (each set = 1 generation)
      const todaySets = myQuestions.filter(set => {
        if (!set.createdAt || !set.createdAt.seconds) return false;
        return set.createdAt.seconds >= todayTimestamp;
      });
      
      // Return number of generations (sets), not total questions
      const totalToday = todaySets.length;
      
      console.log('📊 Daily Usage Debug:', {
        todayTimestamp,
        totalSets: myQuestions.length,
        todaySets: todaySets.length,
        generations: totalToday,
        limit: DAILY_LIMIT_LOGGED_IN
      });
      
      return totalToday;
    }
    
    // For non-logged users, use localStorage
    const usage = getUsageData();
    const today = new Date().toDateString();
    
    // Reset if different day
    if (usage.date !== today) {
      const newUsage = {
        dailyCount: 0,
        geminiCount: 0,
        hfCount: 0,
        minuteCount: 0,
        date: today,
        lastMinute: new Date().getMinutes()
      };
      localStorage.setItem(AI_USAGE_KEY, JSON.stringify(newUsage));
      console.log('🔄 Reset daily usage for non-logged user');
      return 0;
    }
    
    console.log('📊 Non-logged usage:', usage.dailyCount, '/', DAILY_LIMIT_NON_LOGGED_IN);
    return usage.dailyCount;
  };
  
  const dailyUsage = getDailyUsage();
  const dailyLimit = user ? DAILY_LIMIT_LOGGED_IN : DAILY_LIMIT_NON_LOGGED_IN;
  const totalLimit = dailyLimit + coinBalance; // Base limit + coins
  
  // Use HomeViewRevamp component
  return (
    <HomeViewRevamp
      formData={formData}
      setFormData={setFormData}
      handleStart={handleStart}
      errorMsg={errorMsg}
      mode={mode}
      setMode={setMode}
      apiKey={apiKey}
      modelType={modelType}
      setModelType={setModelType}
      user={user}
      onLogin={onLogin}
      onLogout={onLogout}
      usageData={usageData}
      setView={setView}
      setShowLoginModal={setShowLoginModal}
      isDeveloperMode={isDeveloperMode}
      totalQuestionsInBank={totalQuestionsInBank}
      isAdmin={isAdmin}
      navigate={navigate}
      dailyLimit={dailyLimit}
      dailyUsage={dailyUsage}
      totalLimit={totalLimit}
      coinBalance={coinBalance}
      onBuyCoin={() => setView('AMBIS_TOKEN_STORE')}
    />
  );
};

const LoadingView = ({ loadingQuizIdx, stopwatch, onQuizAnswer, onCancel }) => {
  const audioRef = useRef(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  useEffect(() => {
    audioRef.current = new Audio('https://audio.jukehost.co.uk/cV5X5dS9qN5JILPpPeY6XEUywC54iscf');
    audioRef.current.volume = 0.4;
    audioRef.current.loop = true;
    audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, [loadingQuizIdx]);
  
  const handleSubmit = (idx) => {
    setSelectedAnswer(idx);
    setIsAnswered(true);
    const correct = idx === MINI_QUIZ_DATA[loadingQuizIdx].correctIndex;
    onQuizAnswer(correct);
  };
  
  return (
  <div className="min-h-screen bg-[#F3F4F8] flex flex-col items-center justify-center p-6 text-center space-y-8 relative overflow-x-hidden">
    <AnimatedBackground />
    {/* Background Blur Effects */}
    <div className="fixed inset-0 z-0 pointer-events-none opacity-15">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500 rounded-full blur-[120px]"></div>
    </div>
    <div className="absolute top-6 left-6 z-10 hidden sm:block">
      <Logo size={32} />
    </div>
    <div className="space-y-2 animate-pulse">
      <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-indigo-300"><Brain className="text-white animate-spin-slow" size={32} /></div>
      <h2 className="text-2xl font-bold text-slate-800">Meracik Soal...</h2>
      <p className="text-slate-500">AI sedang mengubah ceritamu menjadi soal ujian.</p>
      <div className="flex items-center justify-center gap-2 text-indigo-600 font-mono text-lg font-bold">
        <Clock size={20} />
        <span>{stopwatch.toFixed(1)}s</span>
      </div>
    </div>
    <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-lg border border-indigo-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-teal-400 animate-loading-bar"></div>
      <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 block">Pemanasan Otak</span>
      <p className="text-xl font-medium text-slate-800 mb-4">{MINI_QUIZ_DATA[loadingQuizIdx].q}</p>
      
      {!isAnswered ? (
        <div className="space-y-2">
          {MINI_QUIZ_DATA[loadingQuizIdx].options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSubmit(idx)}
              className="w-full p-3 rounded-lg border-2 border-slate-200 text-sm font-medium text-slate-700 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left"
            >
              {String.fromCharCode(65 + idx)}. {opt}
            </button>
          ))}
        </div>
      ) : (
        <div className={`p-3 rounded-lg ${selectedAnswer === MINI_QUIZ_DATA[loadingQuizIdx].correctIndex ? 'bg-teal-50 border border-teal-200' : 'bg-rose-50 border border-rose-200'}`}>
          <p className={`text-sm font-bold mb-1 ${selectedAnswer === MINI_QUIZ_DATA[loadingQuizIdx].correctIndex ? 'text-teal-700' : 'text-rose-700'}`}>
            {selectedAnswer === MINI_QUIZ_DATA[loadingQuizIdx].correctIndex ? '✓ Benar!' : '✗ Salah!'}
          </p>
          <p className="text-sm text-slate-600">Jawaban: <span className="font-bold text-teal-600">{MINI_QUIZ_DATA[loadingQuizIdx].options[MINI_QUIZ_DATA[loadingQuizIdx].correctIndex]}</span></p>
        </div>
      )}
    </div>
    <button onClick={onCancel} className="px-6 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600 transition-all flex items-center gap-2">
      <X size={16} /> Hentikan
    </button>
  </div>
);
};

const PQComparisonQuestion = ({ question, userAnswer, onAnswer, disabled }) => {
  const { p_value, q_value } = question;
  if (!p_value || !q_value) return null;
  
  const options = [
    { label: 'A', text: 'P > Q' },
    { label: 'B', text: 'Q > P' },
    { label: 'C', text: 'P = Q' },
    { label: 'D', text: 'Informasi yang diberikan tidak cukup untuk memutuskan salah satu dari tiga pilihan di atas' }
  ];
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg">
          <div className="text-xs font-bold text-indigo-600 mb-2 uppercase tracking-wider">Kuantitas P</div>
          <div className="text-base font-medium text-slate-800">
            <LatexWrapper text={p_value} />
          </div>
        </div>
        <div className="p-4 bg-teal-50 border-2 border-teal-200 rounded-lg">
          <div className="text-xs font-bold text-teal-600 mb-2 uppercase tracking-wider">Kuantitas Q</div>
          <div className="text-base font-medium text-slate-800">
            <LatexWrapper text={q_value} />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {options.map((opt, idx) => (
          <label
            key={idx}
            className={`group relative flex items-start gap-3 p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
              userAnswer === idx
                ? 'border-2 border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-2 border-slate-100 bg-white hover:bg-slate-50 hover:border-primary/30'
            } ${disabled ? 'pointer-events-none' : ''}`}
          >
            <input
              type="radio"
              name="pq_answer"
              value={idx}
              checked={userAnswer === idx}
              onChange={() => onAnswer(idx)}
              disabled={disabled}
              className="sr-only"
            />
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold border-2 transition-colors flex-shrink-0 ${
              userAnswer === idx
                ? 'bg-primary text-white border-primary'
                : 'bg-slate-50 text-slate-600 border-slate-200 group-hover:border-primary/50'
            }`}>
              {opt.label}
            </div>
            <span className="flex-1 font-medium text-slate-700 text-sm leading-relaxed pt-1">
              <LatexWrapper text={opt.text} />
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

const DataSufficiencyQuestion = ({ question, userAnswer, onAnswer, disabled }) => {
  const { statements } = question;
  if (!statements || statements.length !== 2) return null;
  
  const options = [
    { label: 'A', text: 'Pernyataan (1) SAJA cukup untuk menjawab pertanyaan, tetapi pernyataan (2) SAJA tidak cukup' },
    { label: 'B', text: 'Pernyataan (2) SAJA cukup untuk menjawab pertanyaan, tetapi pernyataan (1) SAJA tidak cukup' },
    { label: 'C', text: 'DUA pernyataan BERSAMA-SAMA cukup untuk menjawab pertanyaan, tetapi SATU pernyataan SAJA tidak cukup' },
    { label: 'D', text: 'Pernyataan (1) SAJA cukup untuk menjawab pertanyaan dan pernyataan (2) SAJA cukup' },
    { label: 'E', text: 'Pernyataan (1) dan pernyataan (2) tidak cukup untuk menjawab pertanyaan' }
  ];
  
  return (
    <div className="space-y-4">
      <div className="space-y-3 mb-6">
        {statements.map((stmt, i) => (
          <div key={i} className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
            <div className="text-xs font-bold text-amber-700 mb-2">Pernyataan ({i + 1})</div>
            <div className="text-sm text-slate-800">
              <LatexWrapper text={stmt} />
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {options.map((opt, idx) => (
          <label
            key={idx}
            className={`group relative flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
              userAnswer === idx
                ? 'border-2 border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-2 border-slate-100 bg-white hover:bg-slate-50 hover:border-primary/30'
            } ${disabled ? 'pointer-events-none' : ''}`}
          >
            <input
              type="radio"
              name="ds_answer"
              value={idx}
              checked={userAnswer === idx}
              onChange={() => onAnswer(idx)}
              disabled={disabled}
              className="sr-only"
            />
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold border-2 transition-colors flex-shrink-0 ${
              userAnswer === idx
                ? 'bg-primary text-white border-primary'
                : 'bg-slate-50 text-slate-600 border-slate-200 group-hover:border-primary/50'
            }`}>
              {opt.label}
            </div>
            <span className="flex-1 font-medium text-slate-700 text-xs leading-relaxed pt-0.5">
              {opt.text}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

const GridBooleanQuestion = ({ question, userAnswer, onAnswer, disabled }) => {
  const { grid_data } = question;
  if (!grid_data || grid_data.length === 0) return null;
  
  const handleToggle = (index, value) => {
    if (disabled) return;
    const newAnswers = { ...(userAnswer || {}) };
    newAnswers[index] = value;
    onAnswer(newAnswers);
  };
  
  const isAnswered = (index) => userAnswer && userAnswer[index] !== undefined;
  const getRowClass = (index) => {
    if (!isAnswered(index)) return 'bg-rose-50';
    return 'bg-blue-50';
  };
  
  return (
    <div className="my-4">
      <TableScrollWrapper minWidth="500px">
        <div className="border-2 border-indigo-200 rounded-lg overflow-hidden">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="bg-indigo-50 border-b-2 border-indigo-200">
                <th className="p-2 sm:p-3 text-left font-bold text-indigo-900 w-[60%]">Pernyataan</th>
                <th className="p-2 sm:p-3 text-center font-bold text-indigo-900 w-[20%] border-l border-indigo-200">Ya</th>
                <th className="p-2 sm:p-3 text-center font-bold text-indigo-900 w-[20%] border-l border-indigo-200">Tidak</th>
              </tr>
            </thead>
            <tbody>
              {grid_data.map((item, i) => (
                <tr key={i} className={`border-b border-slate-200 last:border-b-0 transition-colors ${getRowClass(i)}`}>
                  <td className="p-2 sm:p-3 text-slate-700 align-middle">
                    <LatexWrapper text={`${i + 1}. ${item.statement}`} />
                  </td>
                  <td className="p-2 sm:p-3 text-center align-middle border-l border-slate-200">
                    <label className="flex items-center justify-center cursor-pointer">
                      <input
                        type="radio"
                        name={`grid_${i}`}
                        checked={userAnswer?.[i] === true}
                        onChange={() => handleToggle(i, true)}
                        disabled={disabled}
                        className="w-5 h-5 accent-teal-600 cursor-pointer"
                      />
                    </label>
                  </td>
                  <td className="p-2 sm:p-3 text-center align-middle border-l border-slate-200">
                    <label className="flex items-center justify-center cursor-pointer">
                      <input
                        type="radio"
                        name={`grid_${i}`}
                        checked={userAnswer?.[i] === false}
                        onChange={() => handleToggle(i, false)}
                        disabled={disabled}
                        className="w-5 h-5 accent-rose-600 cursor-pointer"
                      />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableScrollWrapper>
    </div>
  );
};

const CBTView = ({ 
  questions, currentQuestionIdx, setCurrentQuestionIdx, userAnswers, handleAnswer, 
  raguRagu, toggleRagu, timer, finishExam, formatTime, subtestId, mode, streak, points, sfx, feedback, health, isPaused, setIsPaused,
  setStreak, setPoints, setFeedback, setHealth, setShowGameOver, user, questionSetId, showToast
}) => {
  const bgMusic = useBackgroundMusic();
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [isAnswerLocked, setIsAnswerLocked] = useState({});
  const [tempGridAnswer, setTempGridAnswer] = useState({});
  const [wishlistStatus, setWishlistStatus] = useState({});
  const [isCheckingWishlist, setIsCheckingWishlist] = useState(false);

  // Vocab Mode States (English Literacy Only)
  // CRITICAL FIX: Detect English Literacy from subtestId OR from questions array
  const isEnglishLiteracy = subtestId === 'lit_ing' || 
    (questions && questions.length > 0 && questions[0]?.subtest === 'lit_ing');
  const [vocabPanelOpen, setVocabPanelOpen] = useState(false);
  const [highlightPopup, setHighlightPopup] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detect mobile/desktop for vocab features
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle text selection for vocab (English Literacy only)
  const handleTextSelection = async () => {
    if (!isEnglishLiteracy || !user) return;
    
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText && selectedText.split(' ').length <= 3) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // Check if word exists in vocab
      const { getVocabByWord } = await import('./services/vocab/vocab-firebase');
      const existingVocab = await getVocabByWord(user.uid, selectedText.toLowerCase());
      
      setHighlightPopup({
        word: selectedText,
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
        existingVocab: existingVocab
      });
    } else {
      setHighlightPopup(null);
    }
  };

  // Save vocab word
  const handleSaveVocab = async (vocabData) => {
    if (!user) {
      showToast('Login untuk menyimpan vocab', 'warning');
      return;
    }

    try {
      const exists = await checkVocabExists(user.uid, vocabData.word);
      if (exists) {
        showToast('Kata sudah ada di vocab list', 'info');
        return;
      }

      await saveVocab(user.uid, vocabData);
      showToast('Vocab berhasil disimpan! +5 XP', 'success');
      setHighlightPopup(null);
    } catch (error) {
      console.error('Error saving vocab:', error);
      showToast('Gagal menyimpan vocab', 'error');
    }
  };

  useEffect(() => {
    if (mode === 'game') {
      bgMusic.play();
    }
    return () => {
      bgMusic.pause();
    };
  }, [mode, bgMusic]);
  
  // Check wishlist status for current question
  useEffect(() => {
    const checkWishlist = async () => {
      if (!user || !questionSetId) {
        console.log('⚠️ Wishlist check skipped:', { user: !!user, questionSetId });
        return;
      }
      setIsCheckingWishlist(true);
      const status = await checkWishlistStatus(user.uid, questionSetId, currentQuestionIdx);
      setWishlistStatus(prev => ({ ...prev, [currentQuestionIdx]: status }));
      setIsCheckingWishlist(false);
    };
    checkWishlist();
  }, [user, questionSetId, currentQuestionIdx]);

  if (!questions || questions.length === 0) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  
  const question = questions[currentQuestionIdx];
  const isGameMode = mode === 'game';
  const isGridBoolean = question.type === 'grid_boolean';
  const hasAnswered = userAnswers[currentQuestionIdx] !== undefined;
  const isLocked = isAnswerLocked[currentQuestionIdx];
  const isCorrect = feedback?.status === 'correct' && feedback.idx === currentQuestionIdx;
  const isWrong = feedback?.status === 'wrong' && feedback.idx === currentQuestionIdx;
  
  const isAnswerComplete = () => {
    if (isGridBoolean) {
      const answer = tempGridAnswer[currentQuestionIdx] || userAnswers[currentQuestionIdx];
      return answer && question.grid_data.every((_, idx) => answer[idx] !== undefined);
    }
    return userAnswers[currentQuestionIdx] !== undefined;
  };
  
  const handleGridAnswerChange = (gridAnswers) => {
    setTempGridAnswer(prev => ({ ...prev, [currentQuestionIdx]: gridAnswers }));
  };
  
  const handleLockAnswer = () => {
    if (!isAnswerComplete()) return;
    
    // For grid_boolean, move from temp to final answer
    if (isGridBoolean) {
      const finalAnswer = tempGridAnswer[currentQuestionIdx];
      handleAnswer(currentQuestionIdx, finalAnswer);
    }
    
    setIsAnswerLocked(prev => ({ ...prev, [currentQuestionIdx]: true }));
    
    const answer = isGridBoolean ? tempGridAnswer[currentQuestionIdx] : userAnswers[currentQuestionIdx];
    let isCorrect = false;
    
    if (question.type === 'grid_boolean') {
      isCorrect = question.grid_data.every((item, idx) => answer[idx] === item.correct_answer);
    } else if (question.type === 'pq_comparison' || question.type === 'data_sufficiency') {
      isCorrect = answer === question.correctIndex;
    } else {
      isCorrect = answer === question.correctIndex;
    }
    
    if (isCorrect) {
      sfx.playCorrect();
      setStreak(s => s + 1);
      setPoints(p => p + 10 + (streak * 2));
      setFeedback({ status: 'correct', idx: currentQuestionIdx });
    } else {
      sfx.playWrong();
      setStreak(0);
      setHealth(h => {
        const newHealth = h - 1;
        if (newHealth <= 0) {
          setShowGameOver(true);
        }
        return newHealth;
      });
      setFeedback({ status: 'wrong', idx: currentQuestionIdx });
    }
    setTimeout(() => setFeedback(null), 2000);
  };
  
  const handleMCQAnswer = (qIndex, ansIndex) => {
    handleAnswer(qIndex, ansIndex);
    
    if (isGameMode && !isGridBoolean) {
      // Auto-lock for MCQ in game mode
      setIsAnswerLocked(prev => ({ ...prev, [qIndex]: true }));
      
      const isCorrect = ansIndex === question.correctIndex;
      
      if (isCorrect) {
        sfx.playCorrect();
        setStreak(s => s + 1);
        setPoints(p => p + 10 + (streak * 2));
        setFeedback({ status: 'correct', idx: qIndex });
      } else {
        sfx.playWrong();
        setStreak(0);
        setHealth(h => {
          const newHealth = h - 1;
          if (newHealth <= 0) {
            setShowGameOver(true);
          }
          return newHealth;
        });
        setFeedback({ status: 'wrong', idx: qIndex });
      }
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const getOptionClass = (idx) => {
    if (isGameMode && isLocked) {
      if (idx === question.correctIndex) return 'border-2 border-primary bg-primary/5 ring-2 ring-primary/20';
      if (idx === userAnswers[currentQuestionIdx]) return 'border-2 border-rose-400 bg-rose-50 ring-2 ring-rose-200 shake-animation';
      return 'border-2 border-slate-100 bg-white opacity-50';
    }
    if (userAnswers[currentQuestionIdx] === idx) return 'border-2 border-primary bg-primary/5 ring-2 ring-primary/20';
    return 'border-2 border-slate-100 bg-white hover:bg-slate-50 hover:border-primary/30';
  };

  const getDifficultyBadge = () => {
    if (!question) return null;
    const level = question.complexity || 3;
    if (level <= 2) return <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">EASY</div>;
    if (level <= 3) return <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">MEDIUM</div>;
    return <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">HARD</div>;
  };

  return (
    <div className="min-h-screen bg-[#F3F4F8] flex flex-col font-sans relative overflow-x-hidden">
      <AnimatedBackground />
      {/* Background Blur Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-15">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        {/* Desktop: Single Line Header */}
        <div className="hidden sm:flex px-6 py-3 items-center justify-between">
          <div>
            <h1 className="text-sm font-bold text-slate-900 uppercase leading-tight">SNBT AI 2026</h1>
            <span className="text-xs text-slate-600 font-medium">{SUBTESTS.find(s=>s.id === subtestId)?.label}</span>
          </div>
          <div className="flex items-center gap-3">
            {isGameMode && (
              <>
                <div className="flex items-center gap-1.5 text-amber-600 font-bold bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                  <Zap size={16} fill="currentColor" />
                  <span className="text-sm">{streak}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-800 font-mono bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                  <Trophy size={14} className="text-yellow-500" />
                  <span className="text-sm">{points}</span>
                </div>
              </>
            )}
            <div className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full shadow-lg">
              <Timer size={16} className={isPaused ? '' : 'animate-pulse'} />
              <span className="font-mono font-bold text-sm">{formatTime(timer)}</span>
              <button 
                onClick={() => setIsPaused(!isPaused)} 
                className="ml-1 hover:bg-white/20 rounded p-1 transition-colors"
                title={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                )}
              </button>
            </div>
            {isGameMode && (
              <button onClick={() => setShowVolumeControl(!showVolumeControl)} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-2 rounded-full hover:bg-slate-200 transition-colors">
                <Settings size={16} />
              </button>
            )}
            {isEnglishLiteracy && user && (
              <button 
                onClick={() => setVocabPanelOpen(!vocabPanelOpen)} 
                className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-2 rounded-full hover:bg-indigo-200 transition-colors"
                title="Vocab Mode"
              >
                <BookText size={16} />
                <span className="text-xs font-semibold hidden sm:inline">Vocab</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile: Compact Header */}
        <div className="flex sm:hidden flex-col">
          <div className="px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-primary text-white px-3 py-1.5 rounded-full shadow-md">
                <Timer size={14} className={isPaused ? '' : 'animate-pulse'} />
                <span className="font-mono font-bold text-xs">{formatTime(timer)}</span>
                <button 
                  onClick={() => setIsPaused(!isPaused)} 
                  className="ml-0.5 hover:bg-white/20 rounded p-0.5 transition-colors"
                  title={isPaused ? 'Resume' : 'Pause'}
                >
                  {isPaused ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                  )}
                </button>
              </div>
              {isGameMode && (
                <button onClick={() => setShowVolumeControl(!showVolumeControl)} className="flex items-center bg-slate-100 text-slate-700 p-2 rounded-full">
                  <Settings size={14} />
                </button>
              )}
            </div>
          </div>
          {isGameMode && (
            <div className="px-4 py-2 flex items-center justify-between bg-slate-50 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-amber-600 font-bold bg-white px-2 py-1 rounded-lg border border-amber-200">
                  <Zap size={12} fill="currentColor" />
                  <span className="text-xs">{streak}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-800 font-mono bg-white px-2 py-1 rounded-lg border border-slate-200">
                  <Trophy size={12} className="text-yellow-500" />
                  <span className="text-xs">{points}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Volume Control Dropdown */}
        {isGameMode && showVolumeControl && (
          <div className="absolute top-full right-4 mt-2 p-4 bg-white rounded-2xl shadow-xl border border-slate-200 w-64 z-50">
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-slate-600">Music Volume</span>
                <span className="text-xs font-bold text-slate-700">{Math.round(bgMusic.volume * 100)}%</span>
              </div>
              <input type="range" min="0" max="1" step="0.1" value={bgMusic.volume} onChange={(e) => bgMusic.setVolume(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10 pt-24 sm:pt-20 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 items-start w-full pb-4 animate-fade-in">
        <section className="lg:col-span-10 space-y-4 animate-scale-in">
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-xl ring-1 ring-black/5 relative overflow-hidden group">
            {/* Left Border Accent */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-transparent opacity-50"></div>
            
            {isGameMode && isCorrect && (
              <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-20"></div>
                <Sparkles size={100} className="text-teal-500 animate-bounce" />
              </div>
            )}
            
            {isGameMode && isWrong && (
              <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-20"></div>
                <X size={100} className="text-rose-500 animate-pulse" />
              </div>
            )}

            {/* Question Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">Soal No. {currentQuestionIdx + 1}</span>
              <div className="flex items-center gap-2">
                {getDifficultyBadge()}
                <button
                  onClick={async () => {
                    if (!user) {
                      showToast('Login untuk menyimpan soal', 'warning');
                      return;
                    }
                    if (!questionSetId) {
                      showToast('Tidak dapat menyimpan soal ini', 'warning');
                      return;
                    }
                    if (isCheckingWishlist) return;
                    const isInWishlist = wishlistStatus[currentQuestionIdx];
                    
                    if (isInWishlist) {
                      await removeFromWishlist(isInWishlist);
                      setWishlistStatus(prev => ({ ...prev, [currentQuestionIdx]: null }));
                      showToast('Soal dihapus dari wishlist', 'success');
                      sfx.playClick();
                    } else {
                      const wishlistId = await addToWishlist(user.uid, {
                        setId: questionSetId,
                        questionIndex: currentQuestionIdx,
                        subtest: subtestId,
                        setTitle: `Soal ${subtestId}`,
                        question: question
                      });
                      setWishlistStatus(prev => ({ ...prev, [currentQuestionIdx]: wishlistId }));
                      showToast('✓ Soal disimpan ke Wishlist', 'success');
                      sfx.playClick();
                    }
                  }}
                  className={`p-2 rounded-lg transition-all ${
                    wishlistStatus[currentQuestionIdx]
                      ? 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-pink-600'
                  } ${!user || !questionSetId ? 'opacity-50' : ''}`}
                  title={!user ? 'Login untuk menyimpan' : wishlistStatus[currentQuestionIdx] ? 'Hapus dari wishlist' : 'Simpan ke wishlist'}
                >
                  <Bookmark size={16} fill={wishlistStatus[currentQuestionIdx] ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            {/* Stimulus Box */}
            <div 
              className="bg-[#F3F4F8] rounded-2xl p-4 md:p-6 mb-6 border border-slate-200 relative" 
              onMouseUp={isEnglishLiteracy ? handleTextSelection : undefined}
              style={{ userSelect: isEnglishLiteracy ? 'text' : 'none' }}
            >
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Stimulus</span>
              </div>
              <div className="mt-8 max-w-none">
                <p className="text-sm leading-relaxed text-slate-700 font-medium">
                  <LatexWrapper text={question.stimulus} />
                </p>
                <RepresentationRenderer representation={question.representation} />
              </div>
            </div>
            
            {/* Question Text */}
            <h2 
              className="text-sm md:text-base font-medium leading-relaxed text-slate-800 mb-6" 
              onMouseUp={isEnglishLiteracy ? handleTextSelection : undefined}
              style={{ userSelect: isEnglishLiteracy ? 'text' : 'none' }}
            >
              <LatexWrapper text={question.text} />
            </h2>

            {/* Special Question Types */}
            {question.type === 'pq_comparison' ? (
              <PQComparisonQuestion
                question={question}
                userAnswer={userAnswers[currentQuestionIdx]}
                onAnswer={(idx) => handleMCQAnswer(currentQuestionIdx, idx)}
                disabled={isGameMode && isLocked}
              />
            ) : question.type === 'data_sufficiency' ? (
              <DataSufficiencyQuestion
                question={question}
                userAnswer={userAnswers[currentQuestionIdx]}
                onAnswer={(idx) => handleMCQAnswer(currentQuestionIdx, idx)}
                disabled={isGameMode && isLocked}
              />
            ) : question.type === 'grid_boolean' ? (
              <GridBooleanQuestion
                question={question}
                userAnswer={tempGridAnswer[currentQuestionIdx] || userAnswers[currentQuestionIdx]}
                onAnswer={handleGridAnswerChange}
                disabled={isGameMode && isLocked}
              />
            ) : (
              /* Regular Options */
              <div className="space-y-3 animate-fade-in">
                {question.options.map((opt, idx) => (
                <label
                  key={idx}
                  className={`group relative flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all duration-200 ${getOptionClass(idx)} ${isGameMode && hasAnswered ? 'pointer-events-none' : ''}`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={idx}
                    checked={userAnswers[currentQuestionIdx] === idx}
                    onChange={() => handleMCQAnswer(currentQuestionIdx, idx)}
                    className="sr-only"
                    disabled={isGameMode && isLocked}
                  />
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                    userAnswers[currentQuestionIdx] === idx || (isGameMode && hasAnswered && idx === question.correctIndex)
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-slate-50 text-slate-600 border-slate-200 group-hover:border-primary/50'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="flex-1 font-medium text-slate-700 text-sm leading-relaxed"><LatexWrapper text={opt} /></span>
                  {isGameMode && isLocked && idx === question.correctIndex && <CheckCircle2 className="text-primary absolute right-3" size={20} />}
                  {isGameMode && isLocked && idx === userAnswers[currentQuestionIdx] && idx !== question.correctIndex && <X className="text-rose-600 absolute right-3" size={20} />}
                </label>
              ))}
              </div>
            )}

            {/* Navigation */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              {/* Mobile: Stacked Layout */}
              <div className="flex flex-col gap-3 sm:hidden">
                {/* Tombol Simpan (Full Width) - For Grid Boolean in ALL modes */}
                {isGridBoolean && !isLocked && (
                  <Button 
                    onClick={handleLockAnswer} 
                    disabled={!isAnswerComplete()}
                    className={`w-full py-3 ${!isAnswerComplete() ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <CheckCircle2 size={18} /> Simpan Jawaban
                  </Button>
                )}
                
                {/* Prev & Next (Side by Side) */}
                <div className="flex gap-2">
                  <Button 
                    variant="secondary" 
                    disabled={currentQuestionIdx === 0} 
                    onClick={() => setCurrentQuestionIdx(curr => curr - 1)} 
                    className="flex-1 text-sm py-2"
                  >
                    <ChevronLeft size={16} /> Prev
                  </Button>
                  
                  {currentQuestionIdx < questions.length - 1 ? (
                    <Button 
                      onClick={() => { setCurrentQuestionIdx(curr => curr + 1); sfx.playClick(); }} 
                      disabled={isGridBoolean && !isLocked}
                      className="flex-1 text-sm py-2"
                    >
                      Next <ChevronRight size={16} />
                    </Button>
                  ) : (
                    <Button 
                      variant="success" 
                      onClick={finishExam} 
                      className="flex-1 text-sm py-2"
                    >
                      Selesai <CheckCircle2 size={16} />
                    </Button>
                  )}
                </div>
                
                {/* Ragu-ragu (Exam Mode Only) */}
                {!isGameMode && !isGridBoolean && (
                  <label className="flex items-center justify-center gap-2 cursor-pointer py-2">
                    <input type="checkbox" className="accent-amber-500 w-4 h-4" checked={!!raguRagu[currentQuestionIdx]} onChange={() => toggleRagu(currentQuestionIdx)} />
                    <span className="text-amber-600 font-bold text-xs">Ragu-ragu</span>
                  </label>
                )}
              </div>
              
              {/* Desktop: Horizontal Layout */}
              <div className="hidden sm:flex justify-between items-center">
                <Button variant="secondary" disabled={currentQuestionIdx === 0} onClick={() => setCurrentQuestionIdx(curr => curr - 1)} className="text-sm py-2 px-4"><ChevronLeft size={16} /> Prev</Button>
                
                {/* Conditional: Show "Simpan Jawaban" for grid_boolean in ALL modes */}
                {isGridBoolean && !isLocked ? (
                  <Button 
                    onClick={handleLockAnswer} 
                    disabled={!isAnswerComplete()}
                    className={`text-sm py-2 px-4 ${!isAnswerComplete() ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <CheckCircle2 size={16} /> Simpan Jawaban
                  </Button>
                ) : !isGameMode && !isGridBoolean ? (
                  <label className="flex items-center gap-2 cursor-pointer px-3 py-1.5 hover:bg-amber-50 rounded-2xl">
                    <input type="checkbox" className="accent-amber-500 w-4 h-4" checked={!!raguRagu[currentQuestionIdx]} onChange={() => toggleRagu(currentQuestionIdx)} />
                    <span className="text-amber-600 font-bold text-xs">Ragu-ragu</span>
                  </label>
                ) : null}
                
                {currentQuestionIdx < questions.length - 1 ? (
                  <Button 
                    onClick={() => { setCurrentQuestionIdx(curr => curr + 1); sfx.playClick(); }} 
                    disabled={isGridBoolean && !isLocked}
                    className="text-sm py-2 px-4"
                  >
                    Next <ChevronRight size={16} />
                  </Button>
                ) : (
                  <Button variant="success" onClick={finishExam} className="text-sm py-2 px-4">Selesai <CheckCircle2 size={16} /></Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="lg:col-span-2 space-y-2 animate-slide-in-right">
          {isGameMode && (
            <div className="bg-white rounded-2xl p-2 shadow-lg ring-1 ring-black/5">
              <h3 className="text-[9px] font-bold text-slate-800 mb-1 uppercase tracking-wide text-center">Status</h3>
              <div className="flex justify-center">
                <GamePlayer health={health} isCorrect={isCorrect} isWrong={isWrong} streak={streak} />
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-2xl p-2 shadow-lg ring-1 ring-black/5">
            <h3 className="text-[9px] font-bold text-slate-800 mb-1 uppercase tracking-wide">Navigasi</h3>
            <div className="grid grid-cols-5 gap-1">
              {questions.map((q, idx) => {
                const answered = userAnswers[idx] !== undefined;
                const locked = isAnswerLocked[idx];
                const isCorrect = isGameMode && locked && (() => {
                  if (q.type === 'grid_boolean') {
                    return userAnswers[idx] && q.grid_data.every((item, i) => userAnswers[idx][i] === item.correct_answer);
                  } else if (q.type === 'pq_comparison' || q.type === 'data_sufficiency') {
                    return userAnswers[idx] === q.correctIndex;
                  } else {
                    return userAnswers[idx] === q.correctIndex;
                  }
                })();
                const isWrong = isGameMode && locked && !isCorrect;
                const isRagu = raguRagu[idx];
                
                let bgClass = "bg-white border-2 border-slate-200 text-slate-600";
                if (idx === currentQuestionIdx) bgClass = "ring-2 ring-primary/50 border-primary z-10";
                
                if (isGameMode) {
                  if (isCorrect) bgClass += " bg-teal-500 text-white border-teal-600";
                  else if (isWrong) bgClass += " bg-rose-500 text-white border-rose-600";
                  else if (isRagu) bgClass += " bg-amber-400 text-white border-amber-500";
                } else {
                  if (isRagu) bgClass += " bg-amber-400 text-white border-amber-500";
                  else if (answered) bgClass += " bg-slate-700 text-white border-slate-800";
                }
                return <button key={idx} onClick={() => setCurrentQuestionIdx(idx)} className={`w-full aspect-square rounded-lg flex items-center justify-center text-[9px] font-bold transition-all hover:scale-105 ${bgClass}`}>{idx + 1}</button>
              })}
            </div>
          </div>
        </aside>
      </main>

      {/* Vocab Mode Components (English Literacy Only) */}
      {isEnglishLiteracy && user && (
        <>
          {/* Vocab Panel */}
          <VocabPanel
            isOpen={vocabPanelOpen}
            onClose={() => setVocabPanelOpen(false)}
            userId={user.uid}
            onSearchClick={() => setSearchModalOpen(true)}
          />

          {/* Highlight Popup */}
          {highlightPopup && (
            <HighlightPopup
              word={highlightPopup.word}
              x={highlightPopup.x}
              y={highlightPopup.y}
              existingVocab={highlightPopup.existingVocab}
              onSave={handleSaveVocab}
              onClose={() => setHighlightPopup(null)}
            />
          )}

          {/* Search Modal */}
          {searchModalOpen && (
            <SearchModal
              isOpen={searchModalOpen}
              onClose={() => setSearchModalOpen(false)}
              onSave={handleSaveVocab}
              userId={user.uid}
            />
          )}
        </>
      )}
    </div>
  );
};

const ResultView = ({ score, irtScore, percentile, userAnswers, questions, timeUsed, formatTime, points, sfx, user, usageData, fromBankSoal, onBackToDashboard, setView, navigate, questionSetId, showToast }) => {
  useEffect(() => { sfx.playFanfare(); }, [sfx]);
  
  const totalGenerated = user ? usageData.dailyCount : getUsageData().dailyCount;
  const interpretation = IRTScoring.getInterpretation(irtScore || 0);
  
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailQuestions, setDetailQuestions] = useState([]);
  const [detailSubtest, setDetailSubtest] = useState('');
  
  const handleViewDetail = () => {
    setDetailQuestions(questions);
    setDetailSubtest(questions[0]?.subtest || 'tps_pu');
    setShowDetailModal(true);
  };
  
  const handleBackToMenu = () => {
    if (fromBankSoal) {
      onBackToDashboard();
    } else {
      setView('HOME');
      navigate('/app');
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F8] p-3 sm:p-6 flex items-center justify-center font-sans relative overflow-x-hidden animate-fade-in">
      <AnimatedBackground />
      {/* Background Blur Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-15">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500 rounded-full blur-[120px]"></div>
      </div>
      <div className="absolute top-6 left-6 z-10 hidden sm:block">
        <Logo size={32} />
      </div>
      <div className="max-w-4xl w-full space-y-4 sm:space-y-6 animate-fade-in-up relative z-10">
        <Card className="p-4 sm:p-8 text-center border-t-4 border-t-indigo-600">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-indigo-600">
            {score >= 70 ? <Trophy size={32} className="text-yellow-500 sm:w-10 sm:h-10" /> : <Brain size={32} className="sm:w-10 sm:h-10" />}
          </div>
          <h2 className="text-xl sm:text-3xl font-bold text-slate-900 mb-2">Hasil Latihan</h2>
          <p className="text-sm sm:text-base text-slate-500 mb-4 sm:mb-8">Berikut adalah performa penalaranmu.</p>
          
          {/* IRT Score Hero */}
          {irtScore > 0 && (
            <div className="mb-6">
              <div className="text-5xl sm:text-6xl font-bold text-indigo-600 mb-2">
                {irtScore}
              </div>
              <div className="text-sm text-slate-500">Skor IRT (200-800)</div>
              <div className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-bold bg-${interpretation.color}-100 text-${interpretation.color}-700`}>
                {interpretation.level}
              </div>
            </div>
          )}
          
          {totalGenerated >= 5 && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs sm:text-sm text-amber-800">
                ⚠️ Kamu sudah membuat <span className="font-bold">{totalGenerated} soal</span> hari ini.
                {totalGenerated >= 10 && " Jangan membuat soal lagi kalau tidak mau kreditmu habis!"}
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-8">
            <div className="p-2 sm:p-4 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] sm:text-xs text-slate-500 uppercase font-medium block mb-1">Akurasi</span>
              <p className={`text-lg sm:text-2xl font-bold ${score >= 70 ? 'text-teal-600' : 'text-slate-700'}`}>{score.toFixed(0)}%</p>
            </div>
            {irtScore > 0 && (
              <div className="p-2 sm:p-4 rounded-lg bg-indigo-50 border border-indigo-200">
                <span className="text-[10px] sm:text-xs text-slate-500 uppercase font-medium block mb-1">Skor IRT</span>
                <p className="text-lg sm:text-2xl font-bold text-indigo-600">{irtScore}</p>
              </div>
            )}
            {percentile > 0 && (
              <div className="p-2 sm:p-4 rounded-lg bg-teal-50 border border-teal-200">
                <span className="text-[10px] sm:text-xs text-slate-500 uppercase font-medium block mb-1">Percentile</span>
                <p className="text-lg sm:text-2xl font-bold text-teal-600">{percentile}%</p>
              </div>
            )}
            <div className="p-2 sm:p-4 rounded-lg bg-amber-50 border border-amber-200">
              <span className="text-[10px] sm:text-xs text-slate-500 uppercase font-medium block mb-1">Poin</span>
              <p className="text-lg sm:text-2xl font-bold text-amber-500">+{points}</p>
            </div>
             <div className="p-2 sm:p-4 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] sm:text-xs text-slate-500 uppercase font-medium block mb-1">Benar</span>
              <p className="text-lg sm:text-2xl font-bold text-teal-600">{Object.keys(userAnswers).filter(idx => userAnswers[idx] === questions[idx].correctIndex).length}<span className="text-xs sm:text-sm font-normal text-slate-400">/{questions.length}</span></p>
            </div>
            <div className="p-2 sm:p-4 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] sm:text-xs text-slate-500 uppercase font-medium block mb-1">Waktu</span>
              <p className="text-lg sm:text-2xl font-bold text-indigo-600">{formatTime(timeUsed)}</p>
            </div>
          </div>
          
          {irtScore > 0 && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-left mb-6">
              <h4 className="font-bold text-indigo-900 mb-2">📊 Interpretasi Skor IRT</h4>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>• Skor IRT Anda: <strong>{irtScore}</strong> (skala 200-800)</li>
                {percentile > 0 && <li>• Anda lebih baik dari <strong>{percentile}%</strong> peserta lain</li>}
                <li>• Level: <strong>{interpretation.level}</strong> - {interpretation.description}</li>
              </ul>
            </div>
          )}
          
          <div className="flex gap-3">
            <Button onClick={handleBackToMenu} className="flex-1">{fromBankSoal ? 'Kembali ke Dashboard' : 'Menu Soal Saya'}</Button>
            {user && questionSetId && (
              <Button onClick={handleViewDetail} variant="secondary" className="flex-1">
                <Bookmark size={18} /> Lihat & Simpan Soal
              </Button>
            )}
          </div>
        </Card>
        
        {showDetailModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDetailModal(false)}></div>
            <div className="relative min-h-screen flex items-center justify-center p-4">
              <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between z-10">
                  <h3 className="text-lg font-bold text-slate-900">Detail Soal & Wishlist</h3>
                  <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <X size={20} className="text-slate-600" />
                  </button>
                </div>
                <div className="p-4">
                  <DetailSoalView
                    questions={detailQuestions}
                    subtestLabel={getSubtestLabel(detailSubtest)}
                    subtestId={detailSubtest}
                    onBack={() => setShowDetailModal(false)}
                    user={user}
                    questionSetId={questionSetId}
                    showToast={showToast}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3 sm:space-y-4 animate-fade-in-up">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 px-1">Pembahasan</h3>
          {questions.map((q, idx) => {
            let isCorrect = false;
            if (q.type === 'grid_boolean') {
              const userAnswer = userAnswers[idx];
              isCorrect = userAnswer && q.grid_data.every((item, i) => userAnswer[i] === item.correct_answer);
            } else if (q.type === 'pq_comparison' || q.type === 'data_sufficiency') {
              isCorrect = userAnswers[idx] === q.correctIndex;
            } else {
              isCorrect = userAnswers[idx] === q.correctIndex;
            }
            
            return (
              <Card key={idx} className={`p-3 sm:p-6 border-l-4 ${isCorrect ? 'border-l-teal-500' : 'border-l-rose-500'} animate-scale-in overflow-hidden`} style={{animationDelay: `${idx * 0.1}s`}}>
                <div className="flex gap-2 sm:gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {isCorrect ? <CheckCircle2 className="text-teal-500" size={16} /> : <X className="text-rose-500" size={16} />}
                  </div>
                  <div className="flex-1 space-y-3 sm:space-y-3 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Soal {idx + 1}</span>
                      <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:py-1 rounded whitespace-nowrap ${isCorrect ? 'bg-teal-50 text-teal-700' : 'bg-rose-50 text-rose-700'}`}>
                        {isCorrect ? 'BENAR' : 'SALAH'}
                      </span>
                    </div>
                    
                    <div className="p-3 sm:p-3 bg-slate-50 rounded-lg border border-slate-200 overflow-x-auto">
                      <p className="text-[10px] sm:text-xs text-slate-500 font-medium mb-2">Stimulus:</p>
                      <p className="text-xs sm:text-sm text-slate-600 italic break-words leading-relaxed">
                        <LatexWrapper text={q.stimulus} />
                      </p>
                      <RepresentationRenderer representation={q.representation} />
                    </div>
                    
                    <p className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed break-words py-1">
                      <LatexWrapper text={q.text} />
                    </p>
                    
                    {q.type === 'pq_comparison' ? (
                      /* P vs Q Result */
                      <div className="space-y-2.5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                            <span className="text-[10px] font-bold text-indigo-600 block mb-1">Kuantitas P</span>
                            <div className="text-xs text-slate-700"><LatexWrapper text={q.p_value} /></div>
                          </div>
                          <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                            <span className="text-[10px] font-bold text-teal-600 block mb-1">Kuantitas Q</span>
                            <div className="text-xs text-slate-700"><LatexWrapper text={q.q_value} /></div>
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg overflow-x-auto ${isCorrect ? 'bg-teal-50 border border-teal-200' : 'bg-rose-50 border border-rose-200'}`}>
                          <span className="text-[10px] sm:text-xs font-medium text-slate-500 block mb-1.5">Jawabanmu:</span>
                          <p className={`text-xs sm:text-sm font-semibold ${isCorrect ? 'text-teal-700' : 'text-rose-700'}`}>
                            {['P > Q', 'Q > P', 'P = Q', 'Tidak dapat ditentukan'][userAnswers[idx]] || 'Tidak dijawab'}
                          </p>
                        </div>
                        {!isCorrect && (
                          <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 overflow-x-auto">
                            <span className="text-[10px] sm:text-xs font-medium text-slate-500 block mb-1.5">Jawaban Benar:</span>
                            <p className="text-xs sm:text-sm text-teal-700 font-semibold">
                              {['P > Q', 'Q > P', 'P = Q', 'Tidak dapat ditentukan'][q.correctIndex]}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : q.type === 'data_sufficiency' ? (
                      /* Data Sufficiency Result */
                      <div className="space-y-2.5">
                        <div className="space-y-2 mb-3">
                          {q.statements.map((stmt, i) => (
                            <div key={i} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                              <span className="text-[10px] font-bold text-amber-700 block mb-1">Pernyataan ({i + 1})</span>
                              <div className="text-xs text-slate-700"><LatexWrapper text={stmt} /></div>
                            </div>
                          ))}
                        </div>
                        <div className={`p-3 rounded-lg overflow-x-auto ${isCorrect ? 'bg-teal-50 border border-teal-200' : 'bg-rose-50 border border-rose-200'}`}>
                          <span className="text-[10px] sm:text-xs font-medium text-slate-500 block mb-1.5">Jawabanmu:</span>
                          <p className={`text-xs sm:text-sm font-semibold ${isCorrect ? 'text-teal-700' : 'text-rose-700'}`}>
                            {['A', 'B', 'C', 'D', 'E'][userAnswers[idx]] || 'Tidak dijawab'}
                          </p>
                        </div>
                        {!isCorrect && (
                          <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 overflow-x-auto">
                            <span className="text-[10px] sm:text-xs font-medium text-slate-500 block mb-1.5">Jawaban Benar:</span>
                            <p className="text-xs sm:text-sm text-teal-700 font-semibold">
                              {['A', 'B', 'C', 'D', 'E'][q.correctIndex]}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : q.type === 'grid_boolean' ? (
                      /* Grid Boolean Result */
                      <div className="space-y-2.5">
                        <div className="p-3 sm:p-3 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-[10px] sm:text-xs font-medium text-slate-500 block mb-2">Hasil Jawaban:</span>
                          <TableScrollWrapper minWidth="400px">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b border-slate-300">
                                  <th className="p-2 text-left font-bold text-slate-700">Pernyataan</th>
                                  <th className="p-2 text-center font-bold text-slate-700">Jawabanmu</th>
                                  <th className="p-2 text-center font-bold text-slate-700">Benar</th>
                                </tr>
                              </thead>
                              <tbody>
                                {q.grid_data.map((item, i) => {
                                  const userAns = userAnswers[idx]?.[i];
                                  const isRowCorrect = userAns === item.correct_answer;
                                  return (
                                    <tr key={i} className={`border-b border-slate-200 ${isRowCorrect ? 'bg-teal-50' : 'bg-rose-50'}`}>
                                      <td className="p-2 text-slate-700">
                                        <LatexWrapper text={`${i + 1}. ${item.statement}`} />
                                      </td>
                                      <td className="p-2 text-center font-bold">
                                        <span className={isRowCorrect ? 'text-teal-700' : 'text-rose-700'}>
                                          {userAns === undefined ? '-' : userAns ? 'Ya' : 'Tidak'}
                                        </span>
                                      </td>
                                      <td className="p-2 text-center font-bold text-teal-700">
                                        {item.correct_answer ? 'Ya' : 'Tidak'}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </TableScrollWrapper>
                        </div>
                      </div>
                    ) : (
                      /* Regular Multiple Choice Result */
                      <div className="space-y-2.5">
                        <div className={`p-3 sm:p-3 rounded-lg overflow-x-auto ${isCorrect ? 'bg-teal-50 border border-teal-200' : 'bg-rose-50 border border-rose-200'}`}>
                          <span className="text-[10px] sm:text-xs font-medium text-slate-500 block mb-1.5">Jawabanmu:</span>
                          <p className={`text-xs sm:text-sm font-semibold break-words leading-relaxed ${isCorrect ? 'text-teal-700' : 'text-rose-700'}`}>
                            <LatexWrapper text={q.options[userAnswers[idx]] || "Tidak dijawab"} />
                          </p>
                        </div>
                        
                        {!isCorrect && (
                          <div className="p-3 sm:p-3 rounded-lg bg-teal-50 border border-teal-200 overflow-x-auto">
                            <span className="text-[10px] sm:text-xs font-medium text-slate-500 block mb-1.5">Jawaban Benar:</span>
                            <p className="text-xs sm:text-sm text-teal-700 font-semibold break-words leading-relaxed">
                              <LatexWrapper text={q.options[q.correctIndex]} />
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="p-3 sm:p-4 bg-indigo-50 rounded-lg border border-indigo-100 overflow-x-auto">
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="text-[10px] sm:text-xs font-bold text-indigo-700 uppercase tracking-wider">Penjelasan</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed break-words">
                        <LatexWrapper text={q.explanation} />
                      </p>
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

function AppContent() {
  const { addNotification } = useNotification();
  const [tokenBalance, setTokenBalance] = useState(0);
  const coinBalance = tokenBalance; // Ambis coin balance
  const [view, setView] = useState(() => {
    const path = window.location.pathname;
    if (path === '/') return 'LANDING';
    if (path === '/app') return 'HOME';
    if (path.startsWith('/dashboard')) return 'DASHBOARD';
    if (path === '/community') return 'COMMUNITY';
    if (path === '/question') return 'CBT';
    if (path === '/result') return 'RESULT';
    if (path === '/rules') return 'HELP';
    if (path === '/superuser') return 'ADMIN';
    if (path === '/settings') return 'SETTINGS';
    if (path === '/terms') return 'TERMS';
    if (path === '/privacy') return 'PRIVACY';
    if (path === '/about') return 'ABOUT';
    if (path === '/contact') return 'CONTACT';
    if (path === '/404' || path === '/error') return '404';
    if (path.startsWith('/tryout/') && path.endsWith('/result')) return 'RESULT';
    return ''; // Prevent flash of HomeView on unknown/async routes
  });
  const [mode, setMode] = useState('exam');
  const [modelType, setModelType] = useState('gemini');
  const [formData, setFormData] = useState({ context: '', subtest: SUBTESTS[0].id, complexity: 0, instruksi_spesifik: '' });
  const [questions, setQuestions] = useState([]);
  const [questionSetId, setQuestionSetId] = useState(null);
  const [resultId, setResultId] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [raguRagu, setRaguRagu] = useState({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);
  const [loadingQuizIdx, setLoadingQuizIdx] = useState(0);
  const [stopwatch, setStopwatch] = useState(0);
  const [loadingQuizScore, setLoadingQuizScore] = useState(0);
  const [cancelGeneration, setCancelGeneration] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [detailQuestions, setDetailQuestions] = useState([]);
  const [detailSubtest, setDetailSubtest] = useState('');
  const [myQuestions, setMyQuestions] = useState([]);
  const [fromBankSoal, setFromBankSoal] = useState(false);
  
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [health, setHealth] = useState(3);
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isCompletingExam, setIsCompletingExam] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [attemptId, setAttemptId] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnswerLocked, setIsAnswerLocked] = useState({});
  const [showDevPassword, setShowDevPassword] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [irtScore, setIrtScore] = useState(0);
  const [percentile, setPercentile] = useState(0);
  const [isOfficialTryout, setIsOfficialTryout] = useState(false);
  const [showConfirmStart, setShowConfirmStart] = useState(false);
  const [pendingTryout, setPendingTryout] = useState(null);
  
  const [user, setUser] = useState(null);
  const [usageData, setUsageData] = useState(getUsageData());
  const [totalQuestionsInBank, setTotalQuestionsInBank] = useState(0);
  
  const showToast = (message, type = 'error') => {
    addNotification(message, type, 3000);
  };
  const isOnline = useNetworkStatus();

  const sfx = useSound();
  const apiKey = modelType === 'gemini' ? getGeminiKey().key : HF_API_KEY;
  
  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const prevUser = user;
      setUser(currentUser);
      
      if (currentUser) {
        const data = await getUserData(currentUser.uid);
        if (data?.usage) {
          setUsageData(data.usage);
        }
        
        // Load token balance
        const balance = await getUserTokenBalance(currentUser.uid);
        setTokenBalance(balance);
        
        // Check admin role
        const adminStatus = await checkAdminRole(currentUser.uid);
        setIsAdmin(adminStatus);
        
        // Check if first time login and user hasn't disabled welcome modal
        const hideWelcome = localStorage.getItem('hideWelcomeModal') === 'true';
        if (!prevUser && (!data || !data.hasSeenWelcome) && !hideWelcome) {
          setShowWelcome(true);
          await saveUserData(currentUser.uid, { hasSeenWelcome: true });
        }
        
        // Load my questions
        const { getMyQuestions } = await import('./services/firebase/firebase');
        const questions = await getMyQuestions(currentUser.uid);
        setMyQuestions(questions);
        // Load total questions count from bank
        const total = await getTotalQuestionsCount();
        setTotalQuestionsInBank(total);
        
        // If there's a pending tryout after login, show confirmation
        if (pendingTryout && !prevUser) {
          setShowLoginModal(false);
          setShowConfirmStart(true);
        }
      } else {
        setUsageData(getUsageData());
        setMyQuestions([]);
        setTotalQuestionsInBank(0);
        setIsAdmin(false);
        setTokenBalance(0);
      }
    });
    return () => unsubscribe();
  }, [pendingTryout]);
  
  // Reload questions when returning to HOME view
  const reloadMyQuestions = useCallback(async () => {
    if (user) {
      const { getMyQuestions } = await import('./services/firebase/firebase');
      const questions = await getMyQuestions(user.uid);
      setMyQuestions(questions);
      console.log('🔄 Questions reloaded:', questions.length);
    }
  }, [user]);
  
  // Handle tryout slug route
  const handleTryoutSlugRoute = async (slug) => {
    try {
      const { getTryoutBySlug, getTryoutQuestions } = await import('./services/firebase/firebase-admin');
      const tryout = await getTryoutBySlug(slug);
      
      if (!tryout) {
        setView('404');
        return;
      }
      
      // Load questions
      const questions = await getTryoutQuestions(tryout.questionsList || []);
      
      if (questions.length === 0) {
        showToast('Tryout tidak memiliki soal', 'error');
        setView('HOME');
        window.history.pushState({}, '', '/');
        return;
      }
      
      // If user not logged in, show login prompt
      if (!user) {
        setPendingTryout({ tryout, questions, slug });
        setShowLoginModal(true);
        return;
      }
      
      // If logged in, show confirmation modal
      setPendingTryout({ tryout, questions, slug });
      setShowConfirmStart(true);
    } catch (error) {
      console.error('Error loading tryout:', error);
      showToast('Gagal memuat tryout', 'error');
      setView('HOME');
      window.history.pushState({}, '', '/');
    }
  };
  
  // Start tryout after confirmation
  const startTryoutAfterConfirm = async () => {
    if (!pendingTryout) return;
    
    const { tryout, questions, slug } = pendingTryout;
    
    setQuestions(questions);
    setUserAnswers({});
    setRaguRagu({});
    setCurrentQuestionIdx(0);
    setStreak(0);
    setPoints(0);
    setFeedback(null);
    setMode('exam');
    setTimer(tryout.totalDuration || questions.length * 60);
    setFromBankSoal(true);
    setIsOfficialTryout(true);
    setView('CBT');
    
    sessionStorage.setItem('current_tryout_slug', slug);
    
    if (user) {
      const id = await saveAttempt({
        userId: user.uid,
        subtest: 'tryout',
        setId: tryout.id,
        totalQuestions: questions.length,
        timeLimit: tryout.totalDuration || questions.length * 60,
        mode: 'exam'
      });
      setAttemptId(id);
    }
    
    setShowConfirmStart(false);
    setPendingTryout(null);
  };
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleRoute = () => {
      const path = location.pathname;
      const hash = location.hash;
      
      // Hash-based error pages
      if (hash === '#400') {
        setView('400');
        return;
      } else if (hash === '#401') {
        setView('401');
        return;
      } else if (hash === '#403') {
        setView('403');
        return;
      } else if (hash === '#404') {
        setView('404');
        return;
      } else if (hash === '#503') {
        setView('503');
        return;
      }
      
      // Check for tryout slug route: /tryout/:slug
      if (path.startsWith('/tryout/')) {
        const slug = path.replace('/tryout/', '');
        
        // Check if it's result page
        if (slug.endsWith('/result')) {
          const tryoutSlug = slug.replace('/result', '');
          sessionStorage.setItem('current_tryout_slug', tryoutSlug);
          setView('RESULT');
          return;
        }
        
        // Regular tryout page
        if (slug) {
          handleTryoutSlugRoute(slug);
          return;
        }
      }
      
      if (path === '/developer') {
        const devAuth = sessionStorage.getItem('dev_mode');
        if (devAuth === 'true') {
          setIsDeveloperMode(true);
          setView('HOME');
        } else {
          setShowDevPassword(true);
        }
      } else if (path === '/question') {
        // Restore CBT state from sessionStorage
        const savedState = sessionStorage.getItem('cbt_state');
        if (savedState) {
          const state = JSON.parse(savedState);
          setQuestions(state.questions);
          setUserAnswers(state.userAnswers);
          setRaguRagu(state.raguRagu);
          setCurrentQuestionIdx(state.currentQuestionIdx);
          setTimer(state.timer);
          setMode(state.mode);
          setStreak(state.streak || 0);
          setPoints(state.points || 0);
          setHealth(state.health || 3);
          setFormData(state.formData);
          setIsOfficialTryout(state.isOfficialTryout || false);
          if (state.tryoutSlug) {
            sessionStorage.setItem('current_tryout_slug', state.tryoutSlug);
          }
          setView('CBT');
        } else {
          // No saved state, redirect to home
          window.history.pushState({}, '', '/');
          setView('HOME');
        }
      } else if (path === '/result') {
        // Check if it's from tryout
        const tryoutSlug = sessionStorage.getItem('current_tryout_slug');
        if (tryoutSlug) {
          // Redirect to slug-based result
          window.history.replaceState({}, '', `/tryout/${tryoutSlug}/result`);
        }
        setView('RESULT');
      } else if (path === '/community') {
        if (!user) {
          setShowLoginModal(true);
          window.history.pushState({}, '', '/');
          return;
        }
        setView('COMMUNITY');
      } else if (path === '/rules') {
        setView('HELP');
      } else if (path.startsWith('/dashboard')) {
        setView('DASHBOARD');
      } else if (path === '/superuser') {
        setView('ADMIN');
      } else if (path === '/settings') {
        setView('SETTINGS');
      } else if (path === '/terms') {
        setView('TERMS');
      } else if (path === '/privacy') {
        setView('PRIVACY');
      } else if (path === '/about') {
        setView('ABOUT');
      } else if (path === '/contact') {
        setView('CONTACT');

      } else if (path === '/ambis-token') {
        setView('AMBIS_TOKEN_STORE');
      } else if (path === '/ambis-token/checkout') {
        setView('AMBIS_TOKEN_CHECKOUT');
      } else if (path === '/ambis-token/payment') {
        setView('AMBIS_TOKEN_PAYMENT');
      } else if (path === '/ambis-token/success') {
        setView('AMBIS_TOKEN_SUCCESS');
      } else if (path === '/404' || path === '/error') {
        setView('404');
      } else if (path === '/app') {
        setView('HOME');
      } else if (path === '/') {
        setView('LANDING');
      } else {
        // 404 - URL tidak ditemukan
        setView('404');
      }
    };
    handleRoute();
  }, [location, user]);
  
  // Sync usage to Firestore
  useEffect(() => {
    if (user) {
      saveUserData(user.uid, { usage: usageData }).catch(console.error);
    }
  }, [usageData, user]);
  
  // Token update function
  const updateTokenBalance = async () => {
    if (user) {
      const balance = await getUserTokenBalance(user.uid);
      setTokenBalance(balance);
    }
  };
  
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      showToast('Login gagal. Coba lagi.', 'error');
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      setView('HOME');
      if (window.location.hash) {
        window.location.hash = '';
      }
    } catch (error) {
      showToast('Logout gagal. Coba lagi.', 'error');
    }
  }; 

  const handleVisionGenerate = async (filesArray, subtestId, modelType) => {
    if (!isOnline) {
      showToast('Tidak ada koneksi internet. Periksa jaringan Anda.', 'error');
      return;
    }
    
    const selectedSubtest = SUBTESTS.find(s => s.id === subtestId);
    if (!selectedSubtest) return;
    
    sfx.playClick();
    sfx.initAudio();
    setView('LOADING');
    setErrorMsg('');
    setHealth(3);
    setStopwatch(0);
    setLoadingQuizScore(0);
    setCancelGeneration(false);
    
    const quizInterval = setInterval(() => setLoadingQuizIdx(p => (p + 1) % MINI_QUIZ_DATA.length), 2500);
    const stopwatchInterval = setInterval(() => setStopwatch(s => s + 0.1), 100);

    try {
      const generatedQuestions = await generateQuestionsFromImage(
        filesArray, // Pass array of files or single base64
        selectedSubtest.label,
        3,
        'gemini',
        getGeminiKey().key
      );
      
      clearInterval(quizInterval);
      clearInterval(stopwatchInterval);
      
      if (cancelGeneration) {
        setView('DASHBOARD');
        return;
      }
      
      const isFallback = generatedQuestions === MOCK_QUESTIONS;
      
      if (!isFallback && user) {
        const newUsage = { ...usageData };
        newUsage.dailyCount += 1;
        newUsage.minuteCount += 1;
        newUsage.geminiCount = (newUsage.geminiCount || 0) + 1;
        setUsageData(newUsage);
      }
      
      if (user && !isFallback) {
        try {
          const subtestSummary = {};
          generatedQuestions.forEach(q => {
            const subtest = q.subtest || subtestId;
            subtestSummary[subtest] = (subtestSummary[subtest] || 0) + 1;
          });
          
          // Save to question_sets collection with new system
          const newQuestionSetId = await saveQuestionSetWithId({
            questions: generatedQuestions,
            category: subtestId,
            difficulty: 3,
            source: 'AI Lens',
            metadata: {
              images: filesArray.length || 1
            }
          }, user.uid);
          
          setQuestionSetId(newQuestionSetId);
          
          // Legacy system for backward compatibility
          const setId = await saveQuestionSet({
            title: `AI Lens - ${selectedSubtest.label}`,
            subtestSummary: subtestSummary,
            totalQuestions: generatedQuestions.length,
            complexity: 3,
            model: 'gemini-vision'
          }, user.uid);
          
          for (const q of generatedQuestions) {
            await saveQuestion({
              subtest: q.subtest || subtestId,
              level: q.level || 3,
              stimulus: q.stimulus,
              representation: q.representation || { type: 'text', data: null },
              text: q.text,
              options: q.options,
              correctIndex: q.correctIndex,
              explanation: q.explanation,
              ...(q.p_value && { p_value: q.p_value }),
              ...(q.q_value && { q_value: q.q_value }),
              ...(q.statements && { statements: q.statements }),
              ...(q.grid_data && { grid_data: q.grid_data })
            }, user.uid, setId);
          }
          
          const { getMyQuestions } = await import('./services/firebase/firebase');
          const updatedQuestions = await getMyQuestions(user.uid);
          setMyQuestions(updatedQuestions);
        } catch (saveError) {
          console.error('Save question error:', saveError);
        }
      }
      
      setQuestions(generatedQuestions);
      setUserAnswers({});
      setRaguRagu({});
      setCurrentQuestionIdx(0);
      setStreak(0);
      setPoints(0);
      setFeedback(null);
      setMode('exam');
      setTimer(generatedQuestions.length * 60);
      sfx.playFanfare();
      
      setView('CBT');
      window.history.replaceState({}, document.title, '/question');
      if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(()=>{});
    } catch (err) {
      clearInterval(quizInterval);
      clearInterval(stopwatchInterval);
      
      if (!navigator.onLine) {
        showToast('Koneksi internet terputus. Periksa jaringan Anda.', 'error');
      } else {
        showToast('Gagal membuat soal dari gambar. Coba lagi.', 'error');
      }
      
      setView('DASHBOARD');
    }
  };

  const handleStart = async () => {
    // Check network first
    if (!isOnline) {
      showToast('Tidak ada koneksi internet. Periksa jaringan Anda.', 'error');
      return;
    }
    
    const sanitizedContext = sanitizeContext(formData.context);
    
    if (sanitizedContext.length < 20) { 
      showToast('Cerita terlalu pendek atau mengandung karakter tidak valid', 'warning');
      return; 
    }
    
    // Rate limiting check
    const userId = user?.uid || 'anonymous';
    if (formData.context.includes('spam') || formData.context.length > 500) {
      showToast('Input tidak valid', 'warning');
      return;
    }
    
    // Skip limit check for developer mode
    if (isDeveloperMode) {
      sfx.playClick();
      sfx.initAudio();
      setView('LOADING');
      setErrorMsg('');
      setHealth(3);
      setStopwatch(0);
      setLoadingQuizScore(0);
      setCancelGeneration(false);
      
      const quizInterval = setInterval(() => setLoadingQuizIdx(p => (p + 1) % MINI_QUIZ_DATA.length), 2500);
      const stopwatchInterval = setInterval(() => setStopwatch(s => s + 0.1), 100);

      (async () => {
        try {
          const selectedSubtest = SUBTESTS.find(s => s.id === formData.subtest);
          const generatedQuestions = await generateQuestions(
            sanitizedContext,
            selectedSubtest.label, 
            formData.complexity, 
            apiKey,
            modelType,
            null,
            formData.instruksi_spesifik || ''
          );
          
          clearInterval(quizInterval);
          clearInterval(stopwatchInterval);
          
          if (cancelGeneration) {
            setView('HOME');
            return;
          }
          
          setQuestions(generatedQuestions);
          setUserAnswers({});
          setRaguRagu({});
          setCurrentQuestionIdx(0);
          setStreak(0);
          setPoints(0);
          setFeedback(null);
          setTimer(generatedQuestions.length * 60);
          sfx.playFanfare();
          
          setView('CBT');
          window.history.replaceState({}, document.title, '/question');
          if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(()=>{});
        } catch (err) {
          clearInterval(quizInterval);
          clearInterval(stopwatchInterval);
          setErrorMsg("Gagal generate soal. Coba lagi.");
          setView('HOME');
        }
      })();
      return;
    }
    
    // Check daily limit - use same calculation as HomeView
    const dailyUsage = (() => {
      if (user) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTimestamp = today.getTime() / 1000;
        
        const todaySets = myQuestions.filter(set => {
          if (!set.createdAt || !set.createdAt.seconds) return false;
          return set.createdAt.seconds >= todayTimestamp;
        });
        
        // Count number of sets (generations), not total questions
        return todaySets.length;
      }
      
      const usage = getUsageData();
      const today = new Date().toDateString();
      
      if (usage.date !== today) {
        localStorage.setItem(AI_USAGE_KEY, JSON.stringify({
          dailyCount: 0,
          geminiCount: 0,
          hfCount: 0,
          minuteCount: 0,
          date: today,
          lastMinute: new Date().getMinutes()
        }));
        return 0;
      }
      
      return usage.dailyCount;
    })();
    const dailyLimit = user ? DAILY_LIMIT_LOGGED_IN : DAILY_LIMIT_NON_LOGGED_IN;
    const totalLimit = dailyLimit + tokenBalance; // Limit dasar + token
    
    if (dailyUsage >= totalLimit) {
      if (!user) {
        showToast(`Limit harian tercapai (${dailyLimit} soal/hari). Login untuk 20 soal/hari!`, 'warning');
      } else if (dailyUsage >= dailyLimit && tokenBalance === 0) {
        showToast(`Limit harian tercapai (${dailyLimit} soal/hari). Beli token untuk soal tambahan!`, 'warning');
      } else {
        showToast(`Limit harian tercapai (${totalLimit} soal/hari).`, 'warning');
      }
      return;
    }
    
    sfx.playClick();
    sfx.initAudio();
    setView('LOADING');
    setErrorMsg('');
    setHealth(3);
    setStopwatch(0);
    setLoadingQuizScore(0);
    setCancelGeneration(false);
    
    const quizInterval = setInterval(() => setLoadingQuizIdx(p => (p + 1) % MINI_QUIZ_DATA.length), 2500);
    const stopwatchInterval = setInterval(() => setStopwatch(s => s + 0.1), 100);

    try {
      const selectedSubtest = SUBTESTS.find(s => s.id === formData.subtest);
      const generatedQuestions = await generateQuestions(
        sanitizedContext, // Use sanitized context
        selectedSubtest.label, 
        formData.complexity, 
        apiKey,
        modelType,
        null,
        formData.instruksi_spesifik || '' // Pass instruksi spesifik
      );
      
      clearInterval(quizInterval);
      clearInterval(stopwatchInterval);
      
      if (cancelGeneration) {
        setView('HOME');
        return;
      }
      
      // Check if fallback questions were used (check by reference, not content)
      const isFallback = generatedQuestions === MOCK_QUESTIONS;
      
      // Only count usage and save if NOT fallback
      if (!isFallback) {
        if (user) {
          const newUsage = { ...usageData };
          newUsage.dailyCount += 1;
          newUsage.minuteCount += 1;
          if (modelType === 'gemini') newUsage.geminiCount = (newUsage.geminiCount || 0) + 1;
          else newUsage.hfCount = (newUsage.hfCount || 0) + 1;
          setUsageData(newUsage);
          
          // Spend token if over daily limit
          if (dailyUsage >= dailyLimit && coinBalance > 0) {
            try {
              const newBalance = await spendTokens(user.uid, 1, 'question_generation');
              setTokenBalance(newBalance);
              showToast('1 Token digunakan untuk soal tambahan', 'info');
            } catch (error) {
              console.error('Error spending token:', error);
              showToast('Gagal menggunakan token', 'error');
            }
          }
        } else {
          updateUsageCount(modelType);
        }
      }
      
      if (user && !isFallback) {
        try {
          // Calculate subtest summary
          const subtestSummary = {};
          generatedQuestions.forEach(q => {
            const subtest = q.subtest || formData.subtest;
            subtestSummary[subtest] = (subtestSummary[subtest] || 0) + 1;
          });
          
          // Save to question_sets collection with new system
          const newQuestionSetId = await saveQuestionSetWithId({
            questions: generatedQuestions,
            category: formData.subtest,
            difficulty: formData.complexity,
            source: 'AI Generator',
            metadata: {
              story: sanitizedContext,
              instruksi_spesifik: formData.instruksi_spesifik || ''
            }
          }, user.uid);
          
          setQuestionSetId(newQuestionSetId);
          
          // Save question set first (legacy system for backward compatibility)
          const setId = await saveQuestionSet({
            title: `Latihan ${selectedSubtest.label}`,
            subtestSummary: subtestSummary,
            totalQuestions: generatedQuestions.length,
            complexity: formData.complexity,
            model: modelType
          }, user.uid);
          
          // Save individual questions linked to the set
          for (const q of generatedQuestions) {
            await saveQuestion({
              subtest: q.subtest || formData.subtest,
              level: q.level || formData.complexity,
              stimulus: q.stimulus,
              representation: q.representation || { type: 'text', data: null },
              text: q.text,
              options: q.options,
              correctIndex: q.correctIndex,
              explanation: q.explanation
            }, user.uid, setId);
          }
          
          // Reload questions
          const { getMyQuestions } = await import('./services/firebase/firebase');
          const updatedQuestions = await getMyQuestions(user.uid);
          setMyQuestions(updatedQuestions);
        } catch (saveError) {
          console.error('Save question error:', saveError);
        }
      }
      
      setQuestions(generatedQuestions);
      setUserAnswers({});
      setRaguRagu({});
      setCurrentQuestionIdx(0);
      setStreak(0);
      setPoints(0);
      setFeedback(null);
      setTimer(generatedQuestions.length * 60);
      sfx.playFanfare();
      
      // Create attempt for logged in user
      if (user && mode === 'exam' && !isFallback) {
        const id = await saveAttempt({
          userId: user.uid,
          subtest: formData.subtest,
          setId: generatedQuestions[0]?.setId || null,
          totalQuestions: generatedQuestions.length,
          timeLimit: generatedQuestions.length * 60,
          mode: mode
        });
        setAttemptId(id);
      }
      
      setView('CBT');
      window.history.replaceState({}, document.title, '/question');
      if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(()=>{});
    } catch (err) {
      clearInterval(quizInterval);
      clearInterval(stopwatchInterval);
      
      // Enhanced error handling
      if (!navigator.onLine) {
        showToast('Koneksi internet terputus. Periksa jaringan Anda.', 'error');
      } else if (err.message?.includes('quota') || err.message?.includes('limit') || err.message?.includes('429')) {
        showToast('Kredit tercapai. Coba beberapa saat lagi.', 'warning');
      } else if (err.message?.includes('timeout') || err.message?.includes('network')) {
        showToast('Koneksi lambat atau timeout. Coba lagi.', 'error');
      } else {
        showToast('Gagal membuat soal. Coba beberapa saat lagi.', 'error');
      }
      
      setView('HOME');
    }
  };

  const handleAnswer = (qIndex, ansIndex) => {
    if (mode === 'game' && isAnswerLocked[qIndex]) return;
    setUserAnswers(prev => ({ ...prev, [qIndex]: ansIndex }));
    if (mode !== 'game') sfx.playClick();
  };

  const finishExam = useCallback(async () => {
    const unansweredCount = questions.length - Object.keys(userAnswers).length;
    const raguCount = Object.keys(raguRagu).filter(k => raguRagu[k]).length;
    
    if (unansweredCount > 0 || raguCount > 0) {
      setShowConfirm(true);
      return;
    }
    
    setShowConfirm(false);
    await completeExam();
  }, [questions, userAnswers, raguRagu]);

  const completeExam = async () => {
    let correctCount = 0;
    let totalWeight = 0;
    let earnedWeight = 0;
    
    questions.forEach((q, idx) => {
      const weight = q.type === 'grid_boolean' ? 20 : 10;
      totalWeight += weight;
      
      let isCorrect = false;
      if (q.type === 'grid_boolean') {
        const userAnswer = userAnswers[idx];
        isCorrect = userAnswer && q.grid_data.every((item, i) => userAnswer[i] === item.correct_answer);
      } else if (q.type === 'pq_comparison' || q.type === 'data_sufficiency') {
        isCorrect = userAnswers[idx] === q.correctIndex;
      } else {
        isCorrect = userAnswers[idx] === q.correctIndex;
      }
      
      if (isCorrect) {
        correctCount++;
        earnedWeight += weight;
      }
    });
    
    const finalScore = (correctCount / questions.length) * 100;
    
    let finalIrtScore = 0;
    let finalPercentile = 0;
    let irtResult = null;
    
    if (isOfficialTryout) {
      const weightedPercentage = earnedWeight / totalWeight;
      finalIrtScore = Math.round(200 + (weightedPercentage * 800));
      
      irtResult = {
        irtScore: finalIrtScore,
        rawScore: correctCount,
        theta: 0,
        weightedScore: earnedWeight
      };
      
      const allScores = [];
      finalPercentile = IRTScoring.calculatePercentile(finalIrtScore, allScores);
    }
    
    setScore(finalScore);
    setIrtScore(finalIrtScore);
    setPercentile(finalPercentile);
    
    // Save result with new system (skip for official tryouts)
    if (user && questionSetId && !isOfficialTryout) {
      try {
        const newResultId = await saveResultWithId({
          questionSetId,
          userAnswers,
          score: finalScore,
          correctCount,
          wrongCount: questions.length - correctCount,
          mode
        }, user.uid);
        
        setResultId(newResultId);
      } catch (saveError) {
        console.error('Error saving result:', saveError);
      }
    }
    
    if (user && attemptId) {
      await finishAttempt(attemptId, {
        score: finalScore,
        irtScore: finalIrtScore,
        rawScore: isOfficialTryout && irtResult ? irtResult.rawScore : correctCount,
        theta: isOfficialTryout && irtResult ? irtResult.theta : 0,
        percentile: finalPercentile,
        correctAnswers: correctCount,
        timeUsed: (questions.length * 60) - timer
      });
    }
    
    if (isOfficialTryout && user) {
      try {
        const tryoutId = questions[0]?.tryoutId;
        if (!tryoutId) {
          return;
        }
        const { saveTryoutAttempt } = await import('./services/firebase/firebase-admin');
        await saveTryoutAttempt({
          tryoutId,
          userId: user.uid,
          score: finalScore,
          irtScore: finalIrtScore,
          rawScore: correctCount,
          timeUsed: (questions.length * 60) - timer,
          answers: userAnswers
        });
      } catch (saveError) {
        if (saveError.message === 'SERVER_QUOTA_EXCEEDED') {
          showToast('Server sedang terkendala, coba lagi nanti. Tenang, data kamu aman didalam server', 'warning');
        } else {
          console.error('Failed to save tryout attempt:', saveError);
        }
      }
    }
    
    if (document.exitFullscreen) document.exitFullscreen().catch(()=>{});
    setView('RESULT');
    
    // Update URL for result page
    const tryoutSlug = sessionStorage.getItem('current_tryout_slug');
    if (tryoutSlug && isOfficialTryout) {
      window.history.replaceState({}, document.title, `/tryout/${tryoutSlug}/result`);
    } else {
      window.history.replaceState({}, document.title, '/result');
    }
    
    setShowConfirm(false);
  };

  useEffect(() => {
    let interval;
    if (view === 'CBT' && timer > 0 && !isPaused) interval = setInterval(() => setTimer(t => t - 1), 1000);
    else if (view === 'CBT' && timer === 0) finishExam();
    return () => clearInterval(interval);
  }, [view, timer, isPaused, finishExam]);
  
  // Save CBT state to sessionStorage
  useEffect(() => {
    if (view === 'CBT' && questions.length > 0) {
      const tryoutSlug = sessionStorage.getItem('current_tryout_slug');
      sessionStorage.setItem('cbt_state', JSON.stringify({
        questions,
        userAnswers,
        raguRagu,
        currentQuestionIdx,
        timer,
        mode,
        streak,
        points,
        health,
        formData,
        isOfficialTryout,
        tryoutSlug
      }));
    } else if (view === 'RESULT' || view === 'HOME') {
      sessionStorage.removeItem('cbt_state');
      sessionStorage.removeItem('current_tryout_slug');
    }
  }, [view, questions, userAnswers, raguRagu, currentQuestionIdx, timer, mode, streak, points, health, formData, isOfficialTryout]);
  
  // Prevent reload in CBT and RESULT
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (view === 'CBT' || view === 'RESULT') {
        e.preventDefault();
        e.returnValue = 'Kalau kamu reload website, progres kamu akan hilang';
        return 'Kalau kamu reload website, progres kamu akan hilang';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [view]);

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <>
      {!isOnline && <OfflineIndicator />}
      {showConfirmStart && pendingTryout && (
        <ConfirmStartModal 
          tryout={pendingTryout.tryoutData}
          onConfirm={async () => {
            const { setId, questionsData, tryoutData } = pendingTryout;
            let questions = questionsData;
            if (!questions) {
              questions = await getQuestionsBySetId(setId);
            }
            setQuestions(questions);
            setUserAnswers({});
            setRaguRagu({});
            setCurrentQuestionIdx(0);
            setStreak(0);
            setPoints(0);
            setFeedback(null);
            setMode('exam');
            setTimer(tryoutData?.totalDuration || questions.length * 60);
            setFromBankSoal(true);
            setIsOfficialTryout(!!tryoutData);
            if (tryoutData?.slug) {
              window.history.pushState({}, '', `/tryout/${tryoutData.slug}`);
            } else {
              window.history.pushState({}, '', '/question');
            }
            setShowConfirmStart(false);
            setPendingTryout(null);
            setView('CBT');
          }}
          onCancel={() => {
            setShowConfirmStart(false);
            setPendingTryout(null);
          }}
        />
      )}
      <style>{`
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        .shake-animation { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        @keyframes bounce-in { 0% { opacity: 0; transform: scale(0.5); } 50% { transform: scale(1.05); } 100% { opacity: 1; transform: scale(1); } }
        .animate-bounce-in { animation: bounce-in 0.5s ease-out; }
        @keyframes slide-in-right { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-in-right { animation: slide-in-right 0.4s ease-out forwards; }
        @keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
        @keyframes button-press { 0% { transform: scale(1); } 50% { transform: scale(0.95); } 100% { transform: scale(1); } }
        .animate-button-press { animation: button-press 0.2s ease-out; }
        button:active, .clickable:active { animation: button-press 0.2s ease-out; }
        * { transition: opacity 0.2s ease, transform 0.2s ease; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      {showLoginModal && <LoginRequiredModal onClose={() => setShowLoginModal(false)} onLogin={() => { setShowLoginModal(false); handleLogin(); }} />}
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
      {showDevPassword && <DeveloperPasswordModal onClose={() => { setShowDevPassword(false); window.history.pushState({}, '', '/'); setView('HOME'); }} onSuccess={() => { setShowDevPassword(false); setIsDeveloperMode(true); setView('HOME'); }} />}
      {showGameOver && <GameOverModal onRestart={() => { setShowGameOver(false); finishExam(); }} />}
      {showConfirm && (
        <ConfirmModal 
          message={questions.length - Object.keys(userAnswers).length > 0 ? "Yakin ingin menyelesaikan ujian?" : `Ada ${Object.keys(raguRagu).filter(k => raguRagu[k]).length} soal yang masih ragu-ragu. Yakin ingin selesai?`}
          unansweredCount={questions.length - Object.keys(userAnswers).length}
          raguCount={Object.keys(raguRagu).filter(k => raguRagu[k]).length}
          onConfirm={async () => { setShowConfirm(false); await completeExam(); }} 
          onCancel={() => setShowConfirm(false)} 
        />
      )}
      {view === 'AMBIS_TOKEN_STORE' && (
        <AmbisTokenStore 
          user={user}
          onBack={() => setView('HOME')}
          navigate={navigate}
          onTokenUpdate={updateTokenBalance}
        />
      )}
      {view === 'AMBIS_TOKEN_CHECKOUT' && (
        <AmbisTokenCheckout 
          user={user}
          navigate={navigate}
          location={location}
          onTokenUpdate={updateTokenBalance}
        />
      )}
      {view === 'AMBIS_TOKEN_PAYMENT' && (
        <AmbisTokenPayment 
          navigate={navigate}
          location={location}
          onTokenUpdate={updateTokenBalance}
        />
      )}
      {view === 'AMBIS_TOKEN_SUCCESS' && (
        <AmbisTokenSuccess 
          user={user}
          navigate={navigate}
          location={location}
          onTokenUpdate={updateTokenBalance}
        />
      )}

      {view === 'AMBIS_TOKEN' && (
        <AmbisToken 
          user={user}
          onBack={() => setView('HOME')}
          onTokenUpdate={updateTokenBalance}
        />
      )}

      {view === '404' && <NotFoundPage />}
      {view === 'LANDING' && <LandingPage />}
      {view === 'HOME' && <HomeView formData={formData} setFormData={setFormData} handleStart={handleStart} errorMsg={errorMsg} mode={mode} setMode={setMode} apiKey={apiKey} modelType={modelType} setModelType={setModelType} onHelp={() => setView('HELP')} user={user} onLogin={handleLogin} onLogout={handleLogout} usageData={usageData} setView={setView} setShowLoginModal={setShowLoginModal} myQuestions={myQuestions} onReloadQuestions={reloadMyQuestions} isDeveloperMode={isDeveloperMode} totalQuestionsInBank={totalQuestionsInBank} isAdmin={isAdmin} navigate={navigate} />}
      {view === 'ADMIN' && <AdminDashboard user={user} onBack={() => { setView('HOME'); navigate('/'); }} />}
      {view === 'SETTINGS' && <SettingsView user={user} onBack={() => { setView('HOME'); navigate('/app'); }} onLogout={handleLogout} />}
      {view === 'TERMS' && <TermsConditions />}
      {view === 'PRIVACY' && <PrivacyPolicy />}
      {view === 'ABOUT' && <AboutUs />}
      {view === 'CONTACT' && <ContactUs />}
      {view === 'DASHBOARD' && <DashboardView user={user} onBack={() => { setView('HOME'); navigate('/'); }} onViewDetail={async (setId, questionIndex) => { const questions = await getQuestionsBySetId(setId); setDetailQuestions(questions); setQuestionSetId(setId); setDetailSubtest('Paket Soal'); setView('DETAIL'); if (questionIndex !== undefined) { setTimeout(() => { const element = document.getElementById(`question-${questionIndex}`); if (element) { element.scrollIntoView({ behavior: 'smooth', block: 'center' }); element.classList.add('highlight-flash'); setTimeout(() => element.classList.remove('highlight-flash'), 2000); } }, 100); } }} onStartQuiz={async (setId, questionsData, tryoutData) => { if (tryoutData) { if (!user) { setShowLoginModal(true); return; } setPendingTryout({ setId, questionsData, tryoutData }); setShowConfirmStart(true); } else { let questions; if (questionsData) { questions = questionsData; } else { questions = await getQuestionsBySetId(setId); } setQuestions(questions); setUserAnswers({}); setRaguRagu({}); setCurrentQuestionIdx(0); setStreak(0); setPoints(0); setFeedback(null); setMode('exam'); setTimer(tryoutData?.totalDuration || questions.length * 60); setFromBankSoal(true); setIsOfficialTryout(!!tryoutData); if (tryoutData?.slug) { window.history.pushState({}, '', `/tryout/${tryoutData.slug}`); } else { window.history.pushState({}, '', '/question'); } setView('CBT'); } }} onVisionGenerate={handleVisionGenerate} />}
      {view === 'DETAIL' && <DetailSoalView questions={detailQuestions} subtestLabel={detailSubtest} subtestId={detailQuestions[0]?.subtest} onBack={() => { setView('DASHBOARD'); navigate('/dashboard/overview'); }} user={user} questionSetId={questionSetId} showToast={showToast} />}
      {view === 'HELP' && <HelpView onBack={() => setView('HOME')} />}
      {view === 'COMMUNITY' && <CommunityView onBack={() => setView('HOME')} user={user} onLogin={handleLogin} />}
      {view === 'AMBIS_TOKEN' && <AmbisToken user={user} onBack={() => { setView('HOME'); navigate('/'); }} onTokenUpdate={async () => {
        if (user) {
          const balance = await getUserTokenBalance(user.uid);
          setTokenBalance(balance);
        }
      }} />}
      {view === 'AMBIS_TOKEN_STORE' && <AmbisTokenStore user={user} onBack={() => setView('HOME')} navigate={navigate} />}
      {view === 'AMBIS_TOKEN_CHECKOUT' && <AmbisTokenCheckout user={user} navigate={navigate} location={location} />}
      {view === 'AMBIS_TOKEN_PAYMENT' && <AmbisTokenPayment navigate={navigate} location={location} />}
      {view === 'AMBIS_TOKEN_SUCCESS' && <AmbisTokenSuccess user={user} navigate={navigate} location={location} />}
      {view === 'LOADING' && <LoadingView loadingQuizIdx={loadingQuizIdx} stopwatch={stopwatch} onQuizAnswer={(correct) => { if (correct) setLoadingQuizScore(s => s + 1); }} onCancel={() => { setCancelGeneration(true); setView('HOME'); }} />}
      {view === 'CBT' && <CBTView questions={questions} currentQuestionIdx={currentQuestionIdx} setCurrentQuestionIdx={setCurrentQuestionIdx} userAnswers={userAnswers} handleAnswer={handleAnswer} raguRagu={raguRagu} toggleRagu={(i)=>setRaguRagu(p=>({...p,[i]:!p[i]}))} timer={timer} finishExam={finishExam} formatTime={formatTime} subtestId={questions[0]?.subtest || formData.subtest} mode={mode} streak={streak} points={points} sfx={sfx} feedback={feedback} health={health} isPaused={isPaused} setIsPaused={setIsPaused} setStreak={setStreak} setPoints={setPoints} setFeedback={setFeedback} setHealth={setHealth} setShowGameOver={setShowGameOver} user={user} questionSetId={questionSetId} showToast={showToast} />}
      {view === 'RESULT' && <ResultView score={score} irtScore={irtScore} percentile={percentile} userAnswers={userAnswers} questions={questions} timeUsed={(questions.length*60)-timer} formatTime={formatTime} points={points} sfx={sfx} user={user} usageData={usageData} fromBankSoal={fromBankSoal} onBackToDashboard={() => { setView('DASHBOARD'); setFromBankSoal(false); navigate('/dashboard/overview'); }} setView={setView} navigate={navigate} />}
    </>
  );
}


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

