import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Plus, Trash2, Edit3, CheckCircle2, BookOpen,
  Sparkles, Loader2, AlertCircle, Check, ChevronDown, ChevronUp, Swords, Shuffle, Filter
} from 'lucide-react';
import { saveQuestionsToRoom, listenToRoom, startBattle } from '../../services/firebase/ambisBattle';
import { getSubtestGroups, getRandomQuestionsFromSubtests } from '../../services/firebase/ambisBattleConfig';
import { GEMINI_KEYS } from '../../config/config';
import { selectTemplate, getAllPatterns } from '../../utils/questionTemplates';
import { generateEnhancedBattleQuestions } from './enhancedQuestionGenerator';

const SUBTESTS = [
  { id: 'tps_pu', label: 'TPS - Penalaran Umum' },
  { id: 'tps_ppu', label: 'TPS - Pengetahuan & Pemahaman Umum' },
  { id: 'tps_pbm', label: 'TPS - Pemahaman Bacaan & Menulis' },
  { id: 'tps_pk', label: 'TPS - Pengetahuan Kuantitatif' },
  { id: 'lit_ind', label: 'Literasi Bahasa Indonesia' },
  { id: 'lit_ing', label: 'Literasi Bahasa Inggris' },
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

const generateQuestionWithAI = async (
  subtest,
  topic,
  level,
  count,
  context
) => {
  try {
    const questions = await generateEnhancedBattleQuestions(
      subtest,
      topic,
      level,
      count,
      context,
      '' // No specific instructions for basic generation
    );
    
    return questions;
  } catch (error) {
    console.error('Enhanced generation failed:', error);
    throw error;
  }
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
          {question.stimulus && (
            <p className="text-xs text-amber-600 line-clamp-1 mb-1 font-medium">📄 {question.stimulus}</p>
          )}
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
        <div className="border-t border-slate-100 p-4 space-y-3">
          {/* Stimulus Section */}
          {question.stimulus && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs font-semibold text-amber-800 mb-1">Stimulus:</p>
              <p className="text-xs text-amber-700 leading-relaxed">{question.stimulus}</p>
            </div>
          )}
          
          {/* Question */}
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs font-semibold text-slate-800 mb-1">Pertanyaan:</p>
            <p className="text-xs text-slate-700 leading-relaxed">{question.text}</p>
          </div>

          {/* Options */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-600">Pilihan Jawaban:</p>
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
          </div>

          {/* Explanation */}
          {question.explanation && (
            <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg">
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
    stimulus: '', text: '', options: ['', '', '', '', ''], correctIndex: 0,
    explanation: '', subtest: 'tps_pu', topic: '', level: 3
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
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Stimulus (Teks Pendukung) *</label>
            <textarea
              value={form.stimulus}
              onChange={(e) => setForm({ ...form, stimulus: e.target.value })}
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100 resize-none"
              placeholder="Masukkan teks stimulus, bacaan pendek, atau konteks pendukung..."
            />
          </div>
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
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Level Kesulitan</label>
              <select
                value={form.level || 3}
                onChange={(e) => setForm({ ...form, level: parseInt(e.target.value) })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-400"
              >
                <option value={1}>Level 1 - Sangat Mudah</option>
                <option value={2}>Level 2 - Mudah</option>
                <option value={3}>Level 3 - Sedang</option>
                <option value={4}>Level 4 - Sulit</option>
                <option value={5}>Level 5 - Sangat Sulit</option>
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
            disabled={!form.stimulus || !form.text || form.options.some((o) => !o)}
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
  const [aiConfig, setAiConfig] = useState({ subtest: 'tps_pu', topic: TOPICS[0], level: 3, count: 5, context: '' });
  const [showGroupSelector, setShowGroupSelector] = useState(false);
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [showBankSoalFilter, setShowBankSoalFilter] = useState(false);
  const [bankSoalConfig, setBankSoalConfig] = useState({
    subtests: ['tps_pu'],
    questionCount: 5,
    level: 'all', // 'all' or 1-5
    timeRange: 'all', // 'all', 'today', 'week', 'month'
    source: 'all' // 'all', 'public', 'private'
  });
  const [availableQuestions, setAvailableQuestions] = useState(0);
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
      console.log('Fetching questions for group:', group.name);
      console.log('Subtests:', group.subtests);
      console.log('Questions per subtest:', group.questionsPerSubtest);
      
      const randomQuestions = await getRandomQuestionsFromSubtests(
        group.subtests,
        group.questionsPerSubtest,
        user?.uid
      );
      
      console.log('Questions fetched:', randomQuestions.length);
      
      if (!randomQuestions || randomQuestions.length === 0) {
        console.error('No questions found. Debug info:');
        console.error('- User ID:', user?.uid);
        console.error('- Group:', group);
        console.error('- This might be because:');
        console.error('  1. No public question sets exist');
        console.error('  2. No user private question sets exist');
        console.error('  3. Question sets exist but with different subtest IDs');
        console.error('  4. Question sets have no questions array');
        
        throw new Error(
          `Tidak ada soal tersedia untuk grup "${group.name}".\n\n` +
          `Subtests yang dicari: ${group.subtests.join(', ')}\n\n` +
          `Pastikan ada soal di Bank Soal dengan subtest yang sesuai.\n` +
          `Atau gunakan AI Generator untuk membuat soal baru.\n\n` +
          `Tips: Buat soal terlebih dahulu di fitur "Buat Soal" atau "Question Package Manager".`
        );
      }
      
      // Show warning if not enough questions
      if (randomQuestions.length < group.totalQuestions) {
        alert(
          `⚠️ Perhatian:\n\n` +
          `Hanya ${randomQuestions.length} soal tersedia dari ${group.totalQuestions} yang diharapkan.\n\n` +
          `Soal akan tetap dimuat, tapi mungkin kurang dari target.`
        );
      }
      
      setQuestions(randomQuestions);
      alert(`✅ Berhasil memuat ${randomQuestions.length} soal dari grup "${group.name}"`);
    } catch (e) {
      console.error('Group generation error:', e);
      setError(e.message || 'Gagal mengambil soal dari grup.');
    } finally {
      setAiLoading(false);
    }
  };

  // Calculate available questions based on bank soal filter
  const calculateAvailableQuestions = async () => {
    const { getMySetsByTimeRange, getPublicSetsByTimeRange } = await import('../../services/firebase/firebase');
    
    try {
      let sets = [];
      
      // Get sets based on source filter
      if (bankSoalConfig.source === 'all' || bankSoalConfig.source === 'public') {
        if (bankSoalConfig.timeRange === 'all') {
          const publicSets = await getPublicSetsByTimeRange('all');
          sets.push(...publicSets);
        } else {
          const publicSets = await getPublicSetsByTimeRange(bankSoalConfig.timeRange);
          sets.push(...publicSets);
        }
      }
      
      if ((bankSoalConfig.source === 'all' || bankSoalConfig.source === 'private') && user?.uid) {
        if (bankSoalConfig.timeRange === 'all') {
          const privateSets = await getMySetsByTimeRange(user.uid, 'all');
          sets.push(...privateSets);
        } else {
          const privateSets = await getMySetsByTimeRange(user.uid, bankSoalConfig.timeRange);
          sets.push(...privateSets);
        }
      }
      
      // Count matching questions
      let count = 0;
      sets.forEach(set => {
        if (set.questions && Array.isArray(set.questions)) {
          const matching = set.questions.filter(q => {
            const matchesSubtest = bankSoalConfig.subtests.some(st => 
              q.subtest === st || q.category === st || set.category === st
            );
            const matchesLevel = bankSoalConfig.level === 'all' || 
              q.level === parseInt(bankSoalConfig.level) ||
              q.difficulty === parseInt(bankSoalConfig.level);
            
            // Validate question has valid options
            const hasValidOptions = q.options && 
                                   Array.isArray(q.options) && 
                                   q.options.length > 0;
            
            return matchesSubtest && matchesLevel && hasValidOptions;
          });
          count += matching.length;
        }
      });
      
      setAvailableQuestions(count);
      return count;
    } catch (error) {
      console.error('Error calculating available questions:', error);
      return 0;
    }
  };

  // Handle generate from bank soal with custom filters
  const handleGenerateFromBankSoal = async () => {
    setAiLoading(true);
    setError('');
    
    try {
      const { getMySetsByTimeRange, getPublicSetsByTimeRange } = await import('../../services/firebase/firebase');
      
      let allQuestions = [];
      
      // Get sets based on source filter
      if (bankSoalConfig.source === 'all' || bankSoalConfig.source === 'public') {
        const timeRange = bankSoalConfig.timeRange === 'all' ? 'all' : bankSoalConfig.timeRange;
        const publicSets = await getPublicSetsByTimeRange(timeRange);
        
        publicSets.forEach(set => {
          if (set.questions && Array.isArray(set.questions)) {
            const matching = set.questions.filter(q => {
              const matchesSubtest = bankSoalConfig.subtests.some(st => 
                q.subtest === st || q.category === st || set.category === st
              );
              const matchesLevel = bankSoalConfig.level === 'all' || 
                q.level === parseInt(bankSoalConfig.level) ||
                q.difficulty === parseInt(bankSoalConfig.level);
              
              // Validate question has valid options
              const hasValidOptions = q.options && 
                                     Array.isArray(q.options) && 
                                     q.options.length > 0;
              
              if (matchesSubtest && matchesLevel && !hasValidOptions) {
                console.warn(`Question skipped in public set: missing or empty options. Set: "${set.title}"`, q);
              }
              
              return matchesSubtest && matchesLevel && hasValidOptions;
            });
            allQuestions.push(...matching.map(q => ({...q, setId: set.id, setTitle: set.title})));
          }
        });
      }
      
      if ((bankSoalConfig.source === 'all' || bankSoalConfig.source === 'private') && user?.uid) {
        const timeRange = bankSoalConfig.timeRange === 'all' ? 'all' : bankSoalConfig.timeRange;
        const privateSets = await getMySetsByTimeRange(user.uid, timeRange);
        
        privateSets.forEach(set => {
          if (set.questions && Array.isArray(set.questions)) {
            const matching = set.questions.filter(q => {
              const matchesSubtest = bankSoalConfig.subtests.some(st => 
                q.subtest === st || q.category === st || set.category === st
              );
              const matchesLevel = bankSoalConfig.level === 'all' || 
                q.level === parseInt(bankSoalConfig.level) ||
                q.difficulty === parseInt(bankSoalConfig.level);
              
              // Validate question has valid options
              const hasValidOptions = q.options && 
                                     Array.isArray(q.options) && 
                                     q.options.length > 0;
              
              if (matchesSubtest && matchesLevel && !hasValidOptions) {
                console.warn(`Question skipped in private set: missing or empty options. Set: "${set.title}"`, q);
              }
              
              return matchesSubtest && matchesLevel && hasValidOptions;
            });
            allQuestions.push(...matching.map(q => ({...q, setId: set.id, setTitle: set.title})));
          }
        });
      }
      
      // Shuffle and select
      const shuffled = allQuestions.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, Math.min(bankSoalConfig.questionCount, allQuestions.length));
      
      if (selected.length === 0) {
        throw new Error(
          `Tidak ada soal yang cocok dengan filter yang dipilih.\n\n` +
          `Filter aktif:\n` +
          `- Subtes: ${bankSoalConfig.subtests.map(s => SUBTESTS.find(st => st.id === s)?.label).join(', ')}\n` +
          `- Level: ${bankSoalConfig.level === 'all' ? 'Semua Level' : 'Level ' + bankSoalConfig.level}\n` +
          `- Rentang Waktu: ${bankSoalConfig.timeRange === 'all' ? 'Semua Waktu' : bankSoalConfig.timeRange}\n` +
          `- Sumber: ${bankSoalConfig.source === 'all' ? 'Semua Sumber' : bankSoalConfig.source}\n\n` +
          `Tips: Cobalah filter yang berbeda atau buat soal baru terlebih dahulu.`
        );
      }
      
      setQuestions(selected);
      alert(`✅ Berhasil memuat ${selected.length} soal dari Bank Soal`);
      setShowBankSoalFilter(false);
    } catch (e) {
      console.error('Bank soal generation error:', e);
      setError(e.message || 'Gagal mengambil soal dari bank soal.');
    } finally {
      setAiLoading(false);
    }
  };

  // Update available count when filter changes
  useEffect(() => {
    if (showBankSoalFilter) {
      calculateAvailableQuestions();
    }
  }, [bankSoalConfig, showBankSoalFilter]);

  // Word count validation constants
  const MIN_WORDS = 10;
  const MAX_WORDS = 200;

  const getWordCount = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const validateWordCount = (text) => {
    const wordCount = getWordCount(text);
    if (text.trim() && wordCount < MIN_WORDS) {
      return `Minimal ${MIN_WORDS} kata diperlukan. Saat ini: ${wordCount} kata.`;
    }
    if (wordCount > MAX_WORDS) {
      return `Maksimal ${MAX_WORDS} kata diperbolehkan. Saat ini: ${wordCount} kata.`;
    }
    return null;
  };

  const handleGenerateWithAI = async () => {
    setAiLoading(true);
    setError('');
    try {
      const { subtest, topic, level, count, context } = aiConfig;

      // Validate word count if context is provided
      if (context.trim()) {
        const validationError = validateWordCount(context);
        if (validationError) {
          throw new Error(validationError);
        }
      }

      const newQuestions = await generateQuestionWithAI(
        subtest, // Pass subtest ID directly (e.g., 'tps_pu')
        topic,
        level,
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
              <label className="text-xs font-medium text-slate-500 mb-1 block">Level Kesulitan</label>
              <select
                value={aiConfig.level}
                onChange={(e) => setAiConfig({ ...aiConfig, level: parseInt(e.target.value) })}
                className="w-full border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-violet-400"
              >
                <option value={1}>Level 1 - Sangat Mudah</option>
                <option value={2}>Level 2 - Mudah</option>
                <option value={3}>Level 3 - Sedang</option>
                <option value={4}>Level 4 - Sulit</option>
                <option value={5}>Level 5 - Sangat Sulit</option>
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
              Konteks / Referensi Acuan <span className="text-slate-400 font-normal">(Opsional)</span>
            </label>
            <div className="relative">
              <textarea
                value={aiConfig.context}
                onChange={(e) => setAiConfig({ ...aiConfig, context: e.target.value })}
                className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none resize-none ${
                  aiConfig.context.trim() && validateWordCount(aiConfig.context)
                    ? 'border-red-300 focus:border-red-400 bg-red-50'
                    : 'border-slate-200 focus:border-violet-400'
                } shadow-sm`}
                placeholder="Masukkan wacana bacaan pendek, konsep spesifik, atau informasi tabel yang ingin dijadikan bahan soal oleh AI..."
                rows={3}
              />
              {/* Word count indicator */}
              {aiConfig.context.trim() && (
                <div className="absolute bottom-2 right-2 flex items-center gap-1">
                  <span className={`text-xs font-medium ${
                    validateWordCount(aiConfig.context) ? 'text-red-600' : 'text-slate-500'
                  }`}>
                    {getWordCount(aiConfig.context)} kata
                  </span>
                  {validateWordCount(aiConfig.context) && (
                    <AlertCircle size={12} className="text-red-500" />
                  )}
                </div>
              )}
            </div>
            {/* Validation message */}
            {aiConfig.context.trim() && validateWordCount(aiConfig.context) && (
              <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-700">{validateWordCount(aiConfig.context)}</p>
                <p className="text-xs text-red-600 mt-1">
                  💡 Tip: Gunakan {MIN_WORDS}-{MAX_WORDS} kata untuk hasil terbaik.
                </p>
              </div>
            )}
            {/* Help text */}
            {!aiConfig.context.trim() && (
              <p className="text-xs text-slate-500 mt-1">
                💡 Minimal {MIN_WORDS} kata, maksimal {MAX_WORDS} kata untuk kualitas soal yang optimal.
              </p>
            )}
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
          <p className="text-xs text-slate-500 mb-3">Pilih grup subtest atau gunakan filter kustom untuk mengambil soal</p>
          
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
            <p className="text-xs text-blue-800">
              <span className="font-bold">ℹ️ Info:</span> Soal diambil dari Bank Soal yang sudah ada. 
              Jika tidak ada soal, gunakan AI Generator di atas untuk membuat soal baru terlebih dahulu.
            </p>
          </div>
          
          {/* Two options: Quick Select or Advanced Filter */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => setShowGroupSelector(true)}
              disabled={loadingGroups}
              className="py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl text-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Shuffle size={14} />
              Grup Cepat
            </button>
            <button
              onClick={() => setShowBankSoalFilter(true)}
              disabled={loadingGroups}
              className="py-3 bg-white border-2 border-indigo-600 text-indigo-700 font-bold rounded-xl text-sm hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
            >
              <Filter size={14} />
              Filter Lanjutan
            </button>
          </div>
          
          {/* Quick Group Selector */}
          {showGroupSelector && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">Pilih Grup:</span>
                <button 
                  onClick={() => setShowGroupSelector(false)}
                  className="text-xs text-slate-500 hover:text-slate-700"
                >
                  Tutup
                </button>
              </div>
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

          {/* Advanced Bank Soal Filter Modal */}
          {showBankSoalFilter && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <Filter size={16} className="text-indigo-600" />
                    </div>
                    <h3 className="font-bold text-slate-900">Filter Bank Soal</h3>
                  </div>
                  <button 
                    onClick={() => setShowBankSoalFilter(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg"
                  >
                    <span className="text-slate-500 text-lg">×</span>
                  </button>
                </div>
                
                <div className="p-4 space-y-4">
                  {/* Subtest Selection */}
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-2 block">
                      Pilih Subtes (Bisa Lebih dari Satu)
                    </label>
                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                      {SUBTESTS.map(subtest => (
                        <label key={subtest.id} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={bankSoalConfig.subtests.includes(subtest.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setBankSoalConfig(prev => ({...prev, subtests: [...prev.subtests, subtest.id]}));
                              } else {
                                setBankSoalConfig(prev => ({...prev, subtests: prev.subtests.filter(s => s !== subtest.id)}));
                              }
                            }}
                            className="w-4 h-4 text-indigo-600 rounded"
                          />
                          <span className="text-sm text-slate-700">{subtest.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Level Selection */}
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-2 block">Level Kesulitan</label>
                    <select
                      value={bankSoalConfig.level}
                      onChange={(e) => setBankSoalConfig(prev => ({...prev, level: e.target.value}))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400"
                    >
                      <option value="all">Semua Level</option>
                      <option value={1}>Level 1 - Sangat Mudah</option>
                      <option value={2}>Level 2 - Mudah</option>
                      <option value={3}>Level 3 - Sedang</option>
                      <option value={4}>Level 4 - Sulit</option>
                      <option value={5}>Level 5 - Sangat Sulit</option>
                    </select>
                  </div>

                  {/* Time Range */}
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-2 block">Rentang Waktu</label>
                    <select
                      value={bankSoalConfig.timeRange}
                      onChange={(e) => setBankSoalConfig(prev => ({...prev, timeRange: e.target.value}))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400"
                    >
                      <option value="all">Semua Waktu</option>
                      <option value="today">Hari Ini</option>
                      <option value="yesterday">Kemarin</option>
                      <option value="last_3_days">3 Hari Terakhir</option>
                      <option value="last_week">Minggu Ini</option>
                      <option value="last_2_weeks">2 Minggu Terakhir</option>
                      <option value="last_month">Bulan Ini</option>
                      <option value="last_3_months">3 Bulan Terakhir</option>
                      <option value="last_6_months">6 Bulan Terakhir</option>
                      <option value="last_year">Tahun Ini</option>
                    </select>
                  </div>

                  {/* Source Selection */}
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-2 block">Sumber Soal</label>
                    <select
                      value={bankSoalConfig.source}
                      onChange={(e) => setBankSoalConfig(prev => ({...prev, source: e.target.value}))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400"
                    >
                      <option value="all">Semua Sumber (Publik & Pribadi)</option>
                      <option value="public">Bank Soal Publik</option>
                      <option value="private">Soal Saya (Pribadi)</option>
                    </select>
                  </div>

                  {/* Question Count */}
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-2 block">
                      Jumlah Soal: {bankSoalConfig.questionCount}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={bankSoalConfig.questionCount}
                      onChange={(e) => setBankSoalConfig(prev => ({...prev, questionCount: parseInt(e.target.value)}))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>1</span>
                      <span>25</span>
                      <span>50</span>
                    </div>
                  </div>

                  {/* Available Count */}
                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3">
                    <p className="text-sm text-indigo-800">
                      <span className="font-semibold">{availableQuestions}</span> soal tersedia dengan filter ini
                    </p>
                    <p className="text-xs text-indigo-600 mt-1">
                      Klik "Cek Ketersediaan" untuk memperbarui
                    </p>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                      <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                      <p className="text-xs text-red-700">{error}</p>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-slate-100 space-y-2">
                  <button
                    onClick={handleGenerateFromBankSoal}
                    disabled={aiLoading || bankSoalConfig.subtests.length === 0}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {aiLoading ? (
                      <><Loader2 size={16} className="animate-spin" /> Mengambil Soal...</>
                    ) : (
                      <><Shuffle size={16} /> Ambil {bankSoalConfig.questionCount} Soal</>
                    )}
                  </button>
                  <button
                    onClick={calculateAvailableQuestions}
                    disabled={aiLoading}
                    className="w-full py-2 bg-white border-2 border-indigo-200 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-all text-sm"
                  >
                    🔄 Cek Ketersediaan
                  </button>
                  <button
                    onClick={() => setShowBankSoalFilter(false)}
                    className="w-full py-2 text-slate-600 font-medium text-sm hover:text-slate-900"
                  >
                    Batal
                  </button>
                </div>
              </div>
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
