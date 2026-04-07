import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Plus, Trash2, Edit3, CheckCircle2, BookOpen,
  Sparkles, Loader2, AlertCircle, Check, ChevronDown, ChevronUp, Swords, Shuffle
} from 'lucide-react';
import { saveQuestionsToRoom, listenToRoom, startBattle } from '../../services/firebase/ambisBattle';
import { getSubtestGroups, getRandomQuestionsFromSubtests } from '../../services/firebase/ambisBattleConfig';
import { GEMINI_KEYS } from '../../config/config';
import { selectTemplate, getAllPatterns } from '../../utils/questionTemplates';

const SUBTESTS = [
  { id: 'pu', label: 'Penalaran Umum' },
  { id: 'pbu', label: 'Pemahaman Bacaan' },
  { id: 'ppkn', label: 'Pengetahuan & Pemahaman Umum' },
  { id: 'pk', label: 'Pengetahuan Kuantitatif' },
  { id: 'lbind', label: 'Literasi Bahasa Indonesia' },
  { id: 'lbing', label: 'Literasi Bahasa Inggris' },
  { id: 'pm', label: 'Penalaran Matematika' },
];

const TOPICS = [
  'Logika & Penalaran', 'Matematika Dasar', 'Bahasa Indonesia',
  'Bahasa Inggris', 'Fisika', 'Kimia', 'Biologi', 'Sejarah', 'Ekonomi', 'Geografi'
];

const GEMINI_KEY_INDEX = 'gemini_key_index';

const getGeminiKey = () => {
  const index = parseInt(localStorage.getItem(GEMINI_KEY_INDEX) || '0');
  return GEMINI_KEYS[index % GEMINI_KEYS.length];
};

const switchGeminiKey = () => {
  const currentIndex = parseInt(localStorage.getItem(GEMINI_KEY_INDEX) || '0');
  const nextIndex = (currentIndex + 1) % GEMINI_KEYS.length;
  localStorage.setItem(GEMINI_KEY_INDEX, nextIndex.toString());
  return GEMINI_KEYS[nextIndex];
};

const generateQuestionWithAI = async (subtest, topic, difficulty, count, context = '') => {
  const apiKey = getGeminiKey();
  if (!apiKey) throw new Error('API key tidak tersedia. Silakan cek pengaturan API Key.');

  // Pilih template yang sesuai
  const subtestId = SUBTESTS.find((s) => s.label === subtest || s.id === subtest)?.id || 'pu';
  const levelParam = difficulty === 'Mudah' ? 1 : difficulty === 'Sedang' ? 3 : 5;
  const allPatterns = getAllPatterns(subtestId);

  // Generate list pola untuk prompt
  const patternList = allPatterns
    .filter(p => p.level.includes(levelParam))
    .map(p => `- "${p.pattern}" (Tipe: ${p.type})`)
    .join('\\n');

  const contextPrompt = context.trim()
    ? `\\n\\n=== KONTEKS MATERI ACUAN (WAJIB DIGUNAKAN) ===\\n"${context}"\\nBuatlah soal yang relevan, menantang, dan terhubung ERAT dengan konteks di atas!`
    : '';

  // === PROMPT LENGKAP DENGAN SEMUA PROTOKOL ===
  const prompt = `SYSTEM: GENERATOR SOAL UTBK-SNBT DENGAN POLA RESMI

Kamu adalah AI profesional pembuat soal quiz pilihan ganda realtime.
Buatkan ${count} soal pilihan ganda SNBT untuk subtes ${subtest}, topik ${topic}, tingkat kesulitan ${difficulty}.${contextPrompt}

=== PROTOKOL ESCAPING KARAKTER (CRITICAL) ===
SETIAP output JSON WAJIB mengikuti aturan ini:
1. Tanda petik ganda di dalam string: WAJIB escape dengan \\" (SATU backslash + quote)
   - SALAH: \\\\" (double backslash)
   - SALAH: " (tanpa escape)
   - BENAR: \\" (single backslash)
2. Backslash untuk LaTeX: WAJIB TEPAT DUA backslash \\\\ (contoh: \\\\frac, \\\\circ)
   - SALAH: \\frac (satu backslash), \\\\\\frac (tiga backslash)
   - BENAR: \\\\frac, \\\\circ, \\\\sqrt (dua backslash)
3. Newline: Gunakan \\n, JANGAN baris baru fisik
4. DILARANG ada teks di luar JSON
5. DILARANG markdown code blocks
6. DILARANG karakter kontrol (form feed, tab manual)
7. Markdown Bold: Gunakan **kata** untuk kata yang perlu ditebalkan
8. Kutipan/Dialog: Gunakan \\" untuk dialog atau kutipan dalam teks

=== ATURAN WAJIB: HIRARKI SIMBOL (The Layering Rule) ===
Saat menggabungkan format bold (**) dengan tanda petik ganda (\\"):
1. PRIORITAS TANDA PETIK: Setiap tanda petik ganda yang merupakan bagian dari kalimat WAJIB di-escape dengan tepat satu backslash
   - SALAH: "kata **"tebal"**"
   - BENAR: "kata **\\"tebal\\"**"
2. Format: **\\"Kalimat tebal dan dikutip\\"**

=== PROTOKOL LATEX (CRITICAL) ===
SETIAP ekspresi matematika WAJIB dibungkus dengan $:
1. Inline math: $x$, $f(x)$, $\\\\frac{1}{2}$
2. Display math: $$f(x) = 2x + 1$$
3. Variabel tunggal: $x$, $y$, $P$, $Q$ (WAJIB dibungkus $)
4. Angka dalam konteks math: $\\\\frac{1}{9}$, $x^2$
5. WAJIB kurung kurawal: $\\\\\\\\frac{1}{9}$ BUKAN $\\\\\\\\frac19$
6. Operator: $\\\\times$, $\\\\div$, $\\\\circ$
7. Perbandingan: $P > Q$, $P < Q$, $P = Q$ (dibungkus $)
8. Kurung untuk pecahan/pangkat: Gunakan $\\\\left($ dan $\\\\right)$

=== POLA TERSEDIA ===
${patternList}

=== FORMAT OUTPUT (JSON ARRAY) ===
[
  {
    "text": "Teks pertanyaan utama...",
    "options": ["A. Opsi pertama", "B. Opsi kedua", "C. Opsi ketiga", "D. Opsi keempat", "E. Opsi kelima"],
    "correctIndex": 0,
    "explanation": "Pembahasan rinci...",
    "subtest": "${subtest}",
    "topic": "${topic}",
    "difficulty": "${difficulty}"
  }
]

=== VALIDASI SEBELUM OUTPUT ===
✓ Semua LaTeX command menggunakan TEPAT DUA backslash (\\\\frac, \\\\circ)
✓ Semua tanda petik di dalam string di-escape (\\")
✓ Tidak ada teks di luar JSON. KEMBALIKAN HANYA ARRAY JSON MURNI.`;

  // === RETRY MECHANISM DENGAN API KEY ROTATION ===
  let attempts = 0;
  const maxAttempts = GEMINI_KEYS.length;

  while (attempts < maxAttempts) {
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");

      const currentKey = getGeminiKey();
      const genAI = new GoogleGenerativeAI(currentKey.key);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        }
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();

      // === MULTI-LAYER CLEANING ===
      // Layer 1: Remove markdown code blocks
      text = text.replace(/```(?:json)?\s*/gi, '').replace(/```\s*/g, '');

      // Layer 2: Remove control characters
      text = text.replace(/[\x00-\x1F\x7F-\x9F]/g, '');

      // Layer 3: Fix over-escaped quotes if they occur
      text = text.replace(/\\\\\\"/g, '\\"');

      // Layer 4: Remove trailing commas
      text = text.replace(/,\s*([\]}])/g, '$1').trim();

      // Layer 5: Extract JSON array if wrapped in text
      const match = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (match) {
        text = match[0];
      }

      // === PARSE JSON ===
      try {
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          throw new Error('JSON array kosong atau tidak valid');
        }
        return parsed;
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError.message);
        console.error('Raw text:', text);
        throw new Error('AI gagal mengikuti format JSON. Silakan diregenerate.');
      }

    } catch (error) {
      // Check for quota/limit errors
      if (error.message?.includes('quota') || error.message?.includes('limit') || error.message?.includes('429')) {
        switchGeminiKey();
        attempts++;
        if (attempts >= maxAttempts) {
          throw new Error('Semua API key exhausted (limit habis). Silakan coba lagi nanti.');
        }
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3s delay
      } else {
        throw error;
      }
    }
  }

  throw new Error('Gagal generate soal setelah multi-retries.');
};

const QuestionCard = ({ question, index, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div
        className="flex items-start gap-3 p-4 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-violet-700">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 line-clamp-2">{question.text}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-slate-400">{question.subtest}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-xs text-slate-400">{question.difficulty}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={(e) => { e.stopPropagation(); onEdit(index); }} className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
            <Edit3 size={14} className="text-slate-500" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(index); }} className="p-1.5 hover:bg-red-100 rounded-lg transition-colors">
            <Trash2 size={14} className="text-red-400" />
          </button>
          {expanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 p-4 space-y-2">
          {question.options?.map((opt, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 text-xs p-2 rounded-lg ${i === question.correctIndex ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50'
                }`}
            >
              {i === question.correctIndex && <CheckCircle2 size={12} className="text-emerald-600 mt-0.5 flex-shrink-0" />}
              <span className={i === question.correctIndex ? 'text-emerald-800 font-medium' : 'text-slate-600'}>
                {opt}
              </span>
            </div>
          ))}
          {question.explanation && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-xs text-blue-700"><span className="font-semibold">Pembahasan:</span> {question.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const EditQuestionModal = ({ question, onSave, onClose }) => {
  const [form, setForm] = useState(question || {
    text: '', options: ['', '', '', '', ''], correctIndex: 0,
    explanation: '', subtest: 'pu', topic: '', difficulty: 'Sedang'
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center sm:items-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="font-bold text-slate-900">{question ? 'Edit Soal' : 'Tambah Soal'}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg"><span className="text-slate-500 text-lg leading-none">×</span></button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Teks Soal *</label>
            <textarea
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100 resize-none"
              placeholder="Masukkan pertanyaan..."
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Pilihan Jawaban (pilih yang benar)</label>
            {form.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => setForm({ ...form, correctIndex: i })}
                  className={`w-6 h-6 rounded-full flex-shrink-0 border-2 flex items-center justify-center transition-all ${form.correctIndex === i ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-emerald-400'
                    }`}
                >
                  {form.correctIndex === i && <Check size={12} className="text-white" />}
                </button>
                <span className="text-xs text-slate-500 font-bold w-5">{String.fromCharCode(65 + i)}.</span>
                <input
                  type="text"
                  value={opt.replace(/^[A-E]\.\s?/, '')}
                  onChange={(e) => {
                    const newOpts = [...form.options];
                    newOpts[i] = `${String.fromCharCode(65 + i)}. ${e.target.value}`;
                    setForm({ ...form, options: newOpts });
                  }}
                  className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-violet-400"
                  placeholder={`Opsi ${String.fromCharCode(65 + i)}`}
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Subtes</label>
              <select
                value={form.subtest}
                onChange={(e) => setForm({ ...form, subtest: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-400"
              >
                {SUBTESTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Kesulitan</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-400"
              >
                {['Mudah', 'Sedang', 'Sulit'].map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Pembahasan</label>
            <textarea
              value={form.explanation}
              onChange={(e) => setForm({ ...form, explanation: e.target.value })}
              rows={2}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-400 resize-none"
              placeholder="Jelaskan mengapa jawaban tersebut benar..."
            />
          </div>
          <button
            onClick={() => onSave(form)}
            disabled={!form.text || form.options.some((o) => !o)}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl disabled:opacity-40 transition-all hover:shadow-md"
          >
            Simpan Soal
          </button>
        </div>
      </div>
    </div>
  );
};

const GenerateQuestion = ({ user }) => {
  const params = useParams();
  const roomId = params.roomId || window.location.pathname.split('/').pop() || sessionStorage.getItem('battle_room');
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [aiConfig, setAiConfig] = useState({ subtest: 'pu', topic: TOPICS[0], difficulty: 'Sedang', count: 5, context: '' });
  const [showGroupSelector, setShowGroupSelector] = useState(false);
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const unsubRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;
    unsubRef.current = listenToRoom(roomId, (data) => {
      if (!data) { navigate('/ambis-battle'); return; }
      setRoom(data);
      if (data.questions?.length > 0 && questions.length === 0) {
        setQuestions(data.questions);
      }
      setLoading(false);
    });
    
    // Load groups
    loadGroups();
    
    return () => unsubRef.current?.();
  }, [roomId]);

  const loadGroups = async () => {
    setLoadingGroups(true);
    const allGroups = await getSubtestGroups(user?.uid);
    setGroups(allGroups);
    setLoadingGroups(false);
  };

  // Host guard
  useEffect(() => {
    if (room && user && room.hostId !== user.uid) {
      navigate(`/ambis-battle/waiting-room/${roomId}`);
    }
  }, [room, user]);

  const handleGenerateFromGroup = async (group) => {
    setAiLoading(true);
    setError('');
    setShowGroupSelector(false);
    try {
      const randomQuestions = await getRandomQuestionsFromSubtests(
        group.subtests,
        group.questionsPerSubtest
      );
      
      if (!randomQuestions || randomQuestions.length === 0) {
        throw new Error('Tidak ada soal tersedia untuk grup ini. Pastikan ada soal di bank soal.');
      }
      
      setQuestions(randomQuestions);
    } catch (e) {
      console.error('Group generation error:', e);
      setError(e.message || 'Gagal mengambil soal dari grup.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateWithAI = async () => {
    setAiLoading(true);
    setError('');
    try {
      const { subtest, topic, difficulty, count, context } = aiConfig;

      const newQuestions = await generateQuestionWithAI(
        SUBTESTS.find((s) => s.id === subtest)?.label || subtest,
        topic,
        difficulty,
        count,
        context
      );

      if (!newQuestions || newQuestions.length === 0) {
        throw new Error('Semua soal gagal di-generate (Mungkin format salah). Coba lagi.');
      }

      setQuestions((prev) => [...prev, ...newQuestions]);
    } catch (e) {
      console.error("AI Generation Error: ", e);
      setError(e.message || 'Gagal generate soal.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveAndStart = async () => {
    if (questions.length === 0) { setError('Tambahkan minimal 1 soal.'); return; }
    setSaving(true);
    setError('');
    try {
      await saveQuestionsToRoom(roomId, questions);
      await startBattle(roomId);
      navigate(`/ambis-battle/live/${roomId}`);
    } catch (e) {
      setError(e.message || 'Gagal menyimpan soal.');
      setSaving(false);
    }
  };

  const handleSaveAndWait = async () => {
    if (questions.length === 0) { setError('Tambahkan minimal 1 soal.'); return; }
    setSaving(true);
    setError('');
    try {
      await saveQuestionsToRoom(roomId, questions);
      navigate(`/ambis-battle/waiting-room/${roomId}`);
    } catch (e) {
      setError(e.message || 'Gagal menyimpan soal.');
      setSaving(false);
    }
  };

  const handleDelete = (i) => setQuestions((prev) => prev.filter((_, idx) => idx !== i));
  const handleEdit = (i) => { setEditIndex(i); setShowModal(true); };
  const handleAdd = () => { setEditIndex(null); setShowModal(true); };
  const handleModalSave = (form) => {
    if (editIndex !== null) {
      setQuestions((prev) => prev.map((q, i) => (i === editIndex ? form : q)));
    } else {
      setQuestions((prev) => [...prev, form]);
    }
    setShowModal(false);
    setEditIndex(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 size={32} className="text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-violet-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 pt-12 pb-28">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(`/ambis-battle/waiting-room/${roomId}`)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
            <ArrowLeft size={18} className="text-slate-600" />
          </button>
          <div className="flex-1">
            <h1 className="font-black text-slate-900 text-lg leading-tight">Buat Soal Battle</h1>
            <p className="text-xs text-slate-500">Room: <span className="font-mono font-bold text-violet-600">{roomId}</span></p>
          </div>
          <div className="bg-violet-100 rounded-xl px-3 py-1.5 text-sm font-bold text-violet-700">
            {questions.length} soal
          </div>
        </div>

        {/* AI Generator */}
        <div className="bg-white border border-violet-200 rounded-2xl p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 text-sm">Generate Soal dengan AI</span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Subtes</label>
              <select
                value={aiConfig.subtest}
                onChange={(e) => setAiConfig({ ...aiConfig, subtest: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-violet-400"
              >
                {SUBTESTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Kesulitan</label>
              <select
                value={aiConfig.difficulty}
                onChange={(e) => setAiConfig({ ...aiConfig, difficulty: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-violet-400"
              >
                <option>Mudah</option>
                <option>Sedang</option>
                <option>Sulit</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Topik</label>
              <select
                value={aiConfig.topic}
                onChange={(e) => setAiConfig({ ...aiConfig, topic: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-violet-400"
              >
                {TOPICS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Jumlah Soal</label>
              <select
                value={aiConfig.count}
                onChange={(e) => setAiConfig({ ...aiConfig, count: parseInt(e.target.value) })}
                className="w-full border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-violet-400 bg-white shadow-sm"
              >
                {[1, 3, 5, 10].map((n) => <option key={n} value={n}>{n} soal</option>)}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-semibold text-slate-600 mb-1 block flex items-center gap-1">
              Konteks / Referensi Acuan Singkat <span className="text-slate-400 font-normal">(Opsional)</span>
            </label>
            <textarea
              value={aiConfig.context}
              onChange={(e) => setAiConfig({ ...aiConfig, context: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-400 shadow-sm resize-none"
              placeholder="Masukkan wacana bacaan pendek, konsep spesifik, atau informasi tabel yang ingin dijadikan bahan soal oleh AI..."
              rows={3}
            />
          </div>

          <button
            onClick={handleGenerateWithAI}
            disabled={aiLoading}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl text-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {aiLoading ? (
              <><Loader2 size={14} className="animate-spin" /> Generating {aiConfig.count} soal...</>
            ) : (
              <><Sparkles size={14} /> Generate {aiConfig.count} Soal AI</>
            )}
          </button>
        </div>

        {/* Group-Based Generator */}
        <div className="bg-white border border-indigo-200 rounded-2xl p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
              <Shuffle size={14} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 text-sm">Ambil dari Bank Soal</span>
          </div>
          <p className="text-xs text-slate-500 mb-3">Pilih grup subtest untuk mengambil soal random dari bank soal</p>
          
          {!showGroupSelector ? (
            <button
              onClick={() => setShowGroupSelector(true)}
              disabled={loadingGroups}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl text-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Shuffle size={14} />
              Pilih Grup Subtest
            </button>
          ) : (
            <div className="space-y-2">
              {groups.map(group => (
                <button
                  key={group.id}
                  onClick={() => handleGenerateFromGroup(group)}
                  disabled={aiLoading}
                  className="w-full p-3 border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 rounded-xl text-left transition-all disabled:opacity-50"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-sm">{group.name}</span>
                    {group.isCustom && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">Custom</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">
                    {group.totalQuestions} soal • {group.subtests.length} subtest
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {group.subtests.map(st => (
                      <span key={st} className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded">
                        {st}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
              <button
                onClick={() => setShowGroupSelector(false)}
                className="w-full py-2 text-sm text-slate-600 hover:text-slate-900 font-medium"
              >
                Batal
              </button>
            </div>
          )}
        </div>

        {/* Manual Add */}
        <button
          onClick={handleAdd}
          className="w-full bg-white border-2 border-dashed border-slate-300 hover:border-violet-400 hover:bg-violet-50/50 rounded-2xl p-4 text-center transition-all mb-4 flex items-center justify-center gap-2"
        >
          <Plus size={18} className="text-slate-400" />
          <span className="text-sm font-semibold text-slate-500">Tambah Soal Manual</span>
        </button>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-center gap-2">
            <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        {/* Question List */}
        {questions.length > 0 && (
          <div className="space-y-3 mb-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {questions.length} Soal Siap
            </p>
            {questions.map((q, i) => (
              <QuestionCard
                key={i}
                question={q}
                index={i}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {questions.length === 0 && (
          <div className="text-center py-10">
            <BookOpen size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-400">Belum ada soal. Generate dengan AI atau tambah manual.</p>
          </div>
        )}
      </div>

      {/* Bottom CTA — sticky */}
      {questions.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-t border-slate-200 px-4 py-4">
          <div className="max-w-md mx-auto space-y-2">
            <button
              onClick={handleSaveAndStart}
              disabled={saving}
              className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60"
            >
              {saving ? (
                <><Loader2 size={16} className="animate-spin" /> Memulai Battle...</>
              ) : (
                <><Swords size={16} /> Simpan & Mulai Battle ({questions.length} soal)</>
              )}
            </button>
            <button
              onClick={handleSaveAndWait}
              disabled={saving}
              className="w-full py-2.5 text-sm text-slate-600 hover:text-slate-900 font-semibold transition-colors"
            >
              Simpan & Kembali ke Waiting Room
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showModal && (
        <EditQuestionModal
          question={editIndex !== null ? questions[editIndex] : null}
          onSave={handleModalSave}
          onClose={() => { setShowModal(false); setEditIndex(null); }}
        />
      )}
    </div>
  );
};

export default GenerateQuestion;
