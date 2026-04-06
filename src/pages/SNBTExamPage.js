import React, { useState, useEffect, useCallback } from 'react';
import {
  Clock, ChevronRight, ChevronLeft, CheckCircle2, AlertCircle,
  BookOpen, Brain, Calculator, Globe, FileText, PenTool,
  BarChart3, Target, Zap, Shield, ArrowRight, RotateCcw,
  Play, Pause, SkipForward, Save, LogOut, User
} from 'lucide-react';
import { UnifiedNavbar } from '../components/layout/UnifiedNavbar';
import { useTokenBalance } from '../hooks/useTokenBalance';

// ─── Konfigurasi Subtes SNBT ────────────────────────────────────────────────────

const SUBTESTS_CONFIG = [
  { 
    id: 'tps_pu', 
    label: 'TPS - Penalaran Umum', 
    abbr: 'PU', 
    total: 20, 
    duration: 20, // menit
    icon: Brain,
    color: 'bg-violet-500',
    description: 'Kemampuan penalaran logis dan analitis'
  },
  { 
    id: 'tps_ppu', 
    label: 'TPS - Pengetahuan & Pemahaman Umum', 
    abbr: 'PPU', 
    total: 20, 
    duration: 15,
    icon: BookOpen,
    color: 'bg-blue-500',
    description: 'Pengetahuan umum dan pemahaman konsep'
  },
  { 
    id: 'tps_pbm', 
    label: 'TPS - Pemahaman Bacaan & Menulis', 
    abbr: 'PBM', 
    total: 20, 
    duration: 25,
    icon: FileText,
    color: 'bg-emerald-500',
    description: 'Kemampuan memahami teks dan menulis'
  },
  { 
    id: 'tps_pk', 
    label: 'TPS - Pengetahuan Kuantitatif', 
    abbr: 'PK', 
    total: 15, 
    duration: 20,
    icon: Calculator,
    color: 'bg-amber-500',
    description: 'Kemampuan matematika dasar dan kuantitatif'
  },
  { 
    id: 'lit_ind', 
    label: 'Literasi Bahasa Indonesia', 
    abbr: 'LIT', 
    total: 30, 
    duration: 35,
    icon: PenTool,
    color: 'bg-rose-500',
    description: 'Kemampuan literasi dalam bahasa Indonesia'
  },
  { 
    id: 'lit_ing', 
    label: 'Literasi Bahasa Inggris', 
    abbr: 'ENG', 
    total: 20, 
    duration: 25,
    icon: Globe,
    color: 'bg-indigo-500',
    description: 'Kemampuan literasi dalam bahasa Inggris'
  },
  { 
    id: 'pm', 
    label: 'Penalaran Matematika', 
    abbr: 'PM', 
    total: 20, 
    duration: 30,
    icon: BarChart3,
    color: 'bg-cyan-500',
    description: 'Penalaran matematika lanjutan'
  },
];

// ─── Data Soal Dummy untuk Setiap Subtes ─────────────────────────────────────────

const generateDummyQuestions = (subtestId, count) => {
  const questionTemplates = {
    tps_pu: [
      {
        stimulus: "Dalam sebuah ruangan terdapat 5 orang: A, B, C, D, dan E. Mereka duduk dalam satu baris.",
        question: "Jika A harus duduk di ujung kiri dan B tidak boleh duduk di sebelah A, berapa banyak susunan duduk yang mungkin?",
        options: ["6", "12", "18", "24", "30"],
        correct: 1
      },
      {
        stimulus: "Semua mahasiswa yang lulus dengan predikat cumlaude pasti memiliki IPK di atas 3,5.",
        question: "Jika diketahui Budi lulus cumlaude, maka dapat disimpulkan bahwa...",
        options: [
          "IPK Budi di atas 3,5",
          "Budi mahasiswa berprestasi", 
          "Semua mahasiswa IPK > 3,5 lulus cumlaude",
          "Budi tidak pernah cuti",
          "Budi lulus tepat waktu"
        ],
        correct: 0
      },
      {
        stimulus: "Perhatikan pola angka berikut: 2, 5, 11, 23, 47, ...",
        question: "Angka selanjutnya dalam pola tersebut adalah...",
        options: ["71", "79", "95", "103", "111"],
        correct: 2
      }
    ],
    tps_ppu: [
      {
        stimulus: "Pancasila sebagai dasar negara Indonesia memiliki kedudukan yang fundamental dalam kehidupan berbangsa dan bernegara.",
        question: "Sila pertama Pancasila 'Ketuhanan Yang Maha Esa' menjamin kebebasan beragama dengan kewajiban...",
        options: [
          "Memilih agama yang paling banyak pengikutnya",
          "Menghormati kebebasan beragama orang lain",
          "Menyebarkan agama kepada orang lain",
          "Mengikuti semua agama",
          "Membuat agama baru"
        ],
        correct: 1
      },
      {
        stimulus: "Indonesia terletak di garis khatulistiwa yang menyebabkan iklim tropis.",
        question: "Dampak utama iklim tropis terhadap pertanian di Indonesia adalah...",
        options: [
          "Hanya bisa menanam tanaman subtropis",
          "Dapat dilakukan penanaman sepanjang tahun",
          "Musim tanam hanya dua kali setahun",
          "Tidak perlu irigasi",
          "Hasil pertanian selalu maksimal"
        ],
        correct: 1
      }
    ],
    tps_pbm: [
      {
        stimulus: "Baca paragraf berikut dengan saksama!\n\nPerubahan iklim menjadi isu global yang mempengaruhi berbagai aspek kehidupan. Peningkatan suhu bumi akibat emisi gas rumah kaca menyebabkan es di kutub mencair, naiknya permukaan air laut, dan cuaca ekstrem. Para ilmuwan memperingatkan bahwa jika tidak ada tindakan konkret, dampaknya akan semakin parah dalam beberapa dekade mendatang.",
        question: "Apa penyebab utama perubahan iklim yang disebutkan dalam paragraf tersebut?",
        options: [
          "Pencairan es di kutub",
          "Kenaikan permukaan air laut",
          "Emisi gas rumah kaca",
          "Cuaca ekstrem",
          "Peringatan ilmuwan"
        ],
        correct: 2
      },
      {
        stimulus: "Perhatikan teks editorial berikut!\n\nPendidikan karakter menjadi sorotan penting dalam dunia pendidikan modern. Di era digital ini, siswa tidak hanya membutuhkan kecerdasan akademis, tetapi juga kekuatan moral dan etika. Sekolah harus berperan aktif membentuk karakter siswa melalui kurikulum yang seimbang antara hard skills dan soft skills.",
        question: "Tujuan utama penulis teks tersebut adalah...",
        options: [
          "Mengkritik pendidikan modern",
          "Mendesak perubahan kurikulum",
          "Menyoroti pentingnya pendidikan karakter",
          "Membandingkan hard skills dan soft skills",
          "Mengadvokasi sekolah digital"
        ],
        correct: 2
      }
    ],
    tps_pk: [
      {
        stimulus: "Sebuah perusahaan memproduksi dua jenis produk, A dan B. Setiap unit A memerlukan 2 jam kerja dan 3 kg bahan, sedangkan setiap unit B memerlukan 3 jam kerja dan 2 kg bahan. Tersedia 60 jam kerja dan 48 kg bahan.",
        question: "Jika perusahaan ingin memproduksi sebanyak mungkin unit dengan kombinasi A dan B, berapa jumlah maksimal unit yang bisa diproduksi?",
        options: ["24", "26", "28", "30", "32"],
        correct: 1
      },
      {
        stimulus: "Dalam sebuah survei, 70% responden menyukai produk X dan 60% menyukai produk Y. Diketahui 40% menyukai kedua produk.",
        question: "Berapa persen responden yang menyukai paling tidak satu produk?",
        options: ["70%", "80%", "90%", "100%", "110%"],
        correct: 2
      }
    ],
    lit_ind: [
      {
        stimulus: "Baca kutipan novel berikut!\n\nMatahari pagi menyembul perlahan dari balik bukit, menyinari desa yang masih tertidur. Di kejauhan, terdengar kokok ayam jantan yang memecah keheningan. Pak Hasan, sang kepala desa, sudah berdiri di teras rumahnya sejak subuh, menatap sawah yang menghijau. Ia tahu hari ini akan menjadi hari penting bagi desanya.",
        question: "Amanat yang tersirat dalam kutipan novel tersebut adalah...",
        options: [
          "Pentingnya disiplin waktu",
          "Keindahan alam desa",
          "Kepedulian pemimpin terhadap desanya",
          "Kehidupan pedesaan yang tenang",
          "Tradisi pagi hari di desa"
        ],
        correct: 2
      },
      {
        stimulus: "Perhatikan puisi berikut!\n\nTanah airku\nDi sana langit biru menyapa\nDi sana padi menghijau bergelombang\nDi sana air mengalir jernih\nDi sana aku dilahirkan\nDi sana aku akan kembali",
        question: "Makna kata 'tanah air' dalam puisi tersebut mencerminkan perasaan...",
        options: [
          "Rindu dan cinta pada kampung halaman",
          "Kecewa pada kondisi negara",
          "Takut akan perubahan",
          "Bangga pada pencapaian negara",
          "Bingung memilih identitas"
        ],
        correct: 0
      }
    ],
    lit_ing: [
      {
        stimulus: "Read the following passage carefully!\n\nClimate change represents one of the most significant challenges facing humanity today. Rising global temperatures, caused by increasing greenhouse gas emissions, are leading to more frequent extreme weather events, rising sea levels, and disruptions to ecosystems worldwide. Scientists agree that immediate action is needed to reduce carbon emissions and transition to renewable energy sources.",
        question: "What is the main cause of climate change mentioned in the passage?",
        options: [
          "Extreme weather events",
          "Rising sea levels", 
          "Greenhouse gas emissions",
          "Ecosystem disruptions",
          "Renewable energy transition"
        ],
        correct: 2
      },
      {
        stimulus: "The company's new policy has generated considerable discussion among employees. While management argues that the changes will improve productivity and efficiency, many workers are concerned about job security and work-life balance. The situation highlights the ongoing tension between business objectives and employee welfare.",
        question: "What is the central conflict described in the passage?",
        options: [
          "Employee productivity vs efficiency",
          "Management vs workers communication",
          "Business objectives vs employee welfare",
          "Job security vs work-life balance",
          "Policy changes vs company growth"
        ],
        correct: 2
      }
    ],
    pm: [
      {
        stimulus: "Diberikan fungsi kuadrat f(x) = x² - 4x + 3. Grafik fungsi tersebut memotong sumbu x di titik A dan B.",
        question: "Jarak antara titik A dan B adalah...",
        options: ["1", "2", "3", "4", "5"],
        correct: 1
      },
      {
        stimulus: "Sebuah segitiga memiliki sisi-sisi dengan panjang 7 cm, 24 cm, dan 25 cm.",
        question: "Luas segitiga tersebut adalah...",
        options: ["84 cm²", "96 cm²", "108 cm²", "120 cm²", "132 cm²"],
        correct: 0
      },
      {
        stimulus: "Dalam barisan aritmatika, suku ke-3 adalah 17 dan suku ke-7 adalah 33.",
        question: "Jumlah 10 suku pertama barisan tersebut adalah...",
        options: ["200", "210", "220", "230", "240"],
        correct: 2
      }
    ]
  };

  const templates = questionTemplates[subtestId] || questionTemplates.tps_pu;
  const questions = [];
  
  for (let i = 0; i < count; i++) {
    const template = templates[i % templates.length];
    questions.push({
      id: `${subtestId}_${i + 1}`,
      number: i + 1,
      stimulus: template.stimulus,
      question: template.question,
      options: template.options,
      correct: template.correct,
      userAnswer: null
    });
  }
  
  return questions;
};

// ─── Komponen Timer ─────────────────────────────────────────────────────────────

const Timer = ({ minutes, onTimeUp, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) {
      if (timeLeft <= 0) onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, onTimeUp]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isWarning = timeLeft <= 300; // 5 menit terakhir
  const isCritical = timeLeft <= 60; // 1 menit terakhir

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm font-bold ${
      isCritical ? 'bg-red-100 text-red-700 animate-pulse' :
      isWarning ? 'bg-amber-100 text-amber-700' :
      'bg-gray-100 text-gray-700'
    }`}>
      <Clock size={14} />
      {formatTime(timeLeft)}
    </div>
  );
};

// ─── Komponen Soal ─────────────────────────────────────────────────────────────

const QuestionCard = ({ question, onAnswer, currentQuestion, totalQuestions }) => {
  const [selectedOption, setSelectedOption] = useState(question.userAnswer);

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
    onAnswer(question.id, index);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
            <span className="text-xs font-black text-violet-700">{question.number}</span>
          </div>
          <span className="text-sm text-gray-500">
            Soal {currentQuestion} dari {totalQuestions}
          </span>
        </div>
        {selectedOption !== null && (
          <div className="flex items-center gap-1 text-emerald-600">
            <CheckCircle2 size={16} />
            <span className="text-xs font-semibold">Terjawab</span>
          </div>
        )}
      </div>

      {/* Stimulus */}
      {question.stimulus && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {question.stimulus}
          </p>
        </div>
      )}

      {/* Question */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm font-semibold text-gray-800 leading-relaxed">
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(index)}
            className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
              selectedOption === index
                ? 'border-violet-500 bg-violet-50'
                : 'border-gray-200 bg-white hover:border-violet-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedOption === index
                  ? 'border-violet-500 bg-violet-500'
                  : 'border-gray-300'
              }`}>
                {selectedOption === index && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span className="text-sm text-gray-700">{option}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Komponen Navigasi Soal ─────────────────────────────────────────────────────

const QuestionNavigator = ({ questions, currentQuestion, onQuestionSelect }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-bold text-gray-800 mb-3">Navigasi Soal</h3>
      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, index) => {
          const isAnswered = q.userAnswer !== null;
          const isCurrent = index + 1 === currentQuestion;
          
          return (
            <button
              key={q.id}
              onClick={() => onQuestionSelect(index + 1)}
              className={`w-10 h-10 rounded-lg text-xs font-bold transition-all ${
                isCurrent
                  ? 'bg-violet-600 text-white ring-2 ring-violet-300'
                  : isAnswered
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200" />
          <span className="text-gray-600">Terjawab</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-gray-100 border border-gray-200" />
          <span className="text-gray-600">Belum</span>
        </div>
      </div>
    </div>
  );
};

// ─── Komponen Utama ─────────────────────────────────────────────────────────────

const SNBTExamPage = ({ user, onLogin, onLogout, navigate, setView, onExamComplete }) => {
  const [currentSubtest, setCurrentSubtest] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState({});
  const [isExamActive, setIsExamActive] = useState(false);
  const [examStartTime, setExamStartTime] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const tokenBalance = useTokenBalance();

  const currentSubtestData = SUBTESTS_CONFIG[currentSubtest];
  const [questions, setQuestions] = useState([]);

  // Generate questions when subtest changes
  useEffect(() => {
    const newQuestions = generateDummyQuestions(
      currentSubtestData.id, 
      currentSubtestData.total
    );
    setQuestions(newQuestions);
    setCurrentQuestion(1);
  }, [currentSubtest, currentSubtestData]);

  const handleStartExam = () => {
    setIsExamActive(true);
    setExamStartTime(Date.now());
    setShowInstructions(false);
  };

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
    
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, userAnswer: answerIndex } : q
    ));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleNextSubtest = () => {
    if (currentSubtest < SUBTESTS_CONFIG.length - 1) {
      setCurrentSubtest(prev => prev + 1);
      setShowInstructions(true);
      setIsExamActive(false);
    } else {
      // Exam completed
      handleSubmitExam();
    }
  };

  const handleSubmitExam = () => {
    setShowConfirmSubmit(true);
  };

  const confirmSubmitExam = () => {
    const examEndTime = Date.now();
    const duration = Math.round((examEndTime - examStartTime) / 1000 / 60); // in minutes
    
    // Calculate scores for each subtest
    const subtestScores = {};
    SUBTESTS_CONFIG.forEach((subtest, index) => {
      const subtestQuestions = questions.filter(q => q.id.startsWith(subtest.id));
      const correctAnswers = subtestQuestions.filter(q => q.userAnswer === q.correct).length;
      const percentage = Math.round((correctAnswers / subtest.total) * 100);
      subtestScores[subtest.id] = percentage;
    });

    const examData = {
      subtestScores,
      totalDuration: duration,
      completedAt: new Date().toISOString(),
      answers
    };

    onExamComplete(examData);
  };

  const handleTimeUp = () => {
    confirmSubmitExam();
  };

  const currentQuestionData = questions[currentQuestion - 1];

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50">
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

        <main className="pt-28 pb-20 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Subtest Header */}
              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-full ${currentSubtestData.color} flex items-center justify-center mx-auto mb-4`}>
                  <currentSubtestData.icon size={28} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentSubtestData.label}
                </h1>
                <p className="text-gray-600">{currentSubtestData.description}</p>
              </div>

              {/* Exam Info */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-violet-600">{currentSubtestData.total}</div>
                  <div className="text-xs text-gray-600">Soal</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{currentSubtestData.duration}</div>
                  <div className="text-xs text-gray-600">Menit</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600">
                    {currentSubtest + 1}/{SUBTESTS_CONFIG.length}
                  </div>
                  <div className="text-xs text-gray-600">Subtes</div>
                </div>
              </div>

              {/* Instructions */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3">Petunjuk Pengerjaan:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Baca setiap soal dengan teliti sebelum menjawab</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Pilih satu jawaban yang paling tepat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Kelola waktu dengan baik - {currentSubtestData.duration} menit untuk {currentSubtestData.total} soal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Gunakan navigasi soal untuk memeriksa jawaban</span>
                  </li>
                </ul>
              </div>

              {/* Start Button */}
              <button
                onClick={handleStartExam}
                className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                <Play size={20} />
                Mulai {currentSubtestData.abbr}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (showConfirmSubmit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Konfirmasi Selesai</h2>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menyelesaikan ujian? Jawaban yang telah Anda berikan akan disimpan.
            </p>
            <div className="space-y-3">
              <button
                onClick={confirmSubmitExam}
                className="w-full py-3 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition-all"
              >
                Ya, Selesaikan Ujian
              </button>
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                Batal, Lanjut Mengerjakan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded ${currentSubtestData.color} flex items-center justify-center`}>
                  <currentSubtestData.icon size={16} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">{currentSubtestData.abbr}</div>
                  <div className="text-xs text-gray-500">{currentSubtestData.label}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Timer
                minutes={currentSubtestData.duration}
                onTimeUp={handleTimeUp}
                isActive={isExamActive}
              />
              <button
                onClick={handleSubmitExam}
                className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-all"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex h-[calc(100vh-120px)]">
        {/* Question Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-6">
            {currentQuestionData && (
              <QuestionCard
                question={currentQuestionData}
                onAnswer={handleAnswer}
                currentQuestion={currentQuestion}
                totalQuestions={questions.length}
              />
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentQuestion === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ChevronLeft size={16} />
                Sebelumnya
              </button>

              <div className="flex items-center gap-2">
                {currentQuestion === questions.length ? (
                  <button
                    onClick={handleNextSubtest}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition-all"
                  >
                    {currentSubtest < SUBTESTS_CONFIG.length - 1 ? 'Subtes Berikutnya' : 'Selesai Ujian'}
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition-all"
                  >
                    Selanjutnya
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Question Navigator */}
        <aside className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <QuestionNavigator
            questions={questions}
            currentQuestion={currentQuestion}
            onQuestionSelect={setCurrentQuestion}
          />
        </aside>
      </main>
    </div>
  );
};

export default SNBTExamPage;
