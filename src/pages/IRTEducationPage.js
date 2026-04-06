import React, { useState } from 'react';
import {
  Brain, BarChart3, Target, TrendingUp, Shield, Sword,
  ChevronRight, ChevronLeft, Info, BookOpen, Lightbulb,
  Users, Award, Zap, AlertCircle, CheckCircle2, ArrowRight,
  Clock, Calculator, FileText, Globe, PenTool
} from 'lucide-react';
import { UnifiedNavbar } from '../components/layout/UnifiedNavbar';
import { useTokenBalance } from '../hooks/useTokenBalance';

// ─── Educational Content Data ────────────────────────────────────────────────────

const irtSections = [
  {
    id: 'intro',
    title: 'Apa itu IRT?',
    icon: Brain,
    color: 'bg-violet-500',
    content: [
      {
        type: 'text',
        content: 'IRT (Item Response Theory) adalah teori pengukuran modern yang digunakan untuk menganalisis hasil tes. Berbeda dengan sistem penilaian konvensional yang hanya menghitung jumlah jawaban benar, IRT mempertimbangkan tingkat kesulitan setiap soal.'
      },
      {
        type: 'highlight',
        content: 'Di SNBT, IRT digunakan untuk memastikan pembobotan soal yang adil dan akurat, sehingga skor mencerminkan kemampuan sesungguhnya peserta.'
      }
    ]
  },
  {
    id: 'how',
    title: 'Cara Kerja IRT',
    icon: BarChart3,
    color: 'bg-blue-500',
    content: [
      {
        type: 'text',
        content: 'IRT menganalisis setiap soal secara individual untuk menentukan:'
      },
      {
        type: 'list',
        items: [
          'Tingkat kesulitan soal (parameter difficulty)',
          'Kemampuan dibutuhkan untuk menjawab benar (parameter ability)',
          'Daya beda soal (parameter discrimination)'
        ]
      },
      {
        type: 'formula',
        title: 'Logit Model',
        content: 'P(X=1|θ,β) = 1 / (1 + e^(θ-β))',
        explanation: 'Dimana θ = kemampuan peserta, β = kesulitan soal'
      }
    ]
  },
  {
    id: 'benefits',
    title: 'Keunggulan IRT',
    icon: TrendingUp,
    color: 'bg-emerald-500',
    content: [
      {
        type: 'comparison',
        title: 'Sistem Konvensional vs IRT',
        left: {
          title: 'Konvensional',
          items: [
            'Setiap soal bernilai sama',
            'Tidak mempertimbangkan kesulitan',
            'Rentan terhadap tebakan',
            'Skor tidak akurat'
          ]
        },
        right: {
          title: 'IRT',
          items: [
            'Pembobotan dinamis per soal',
            'Analisis tingkat kesulitan',
            'Deteksi pola jawaban',
            'Skor lebih valid'
          ]
        }
      }
    ]
  },
  {
    id: 'snbt',
    title: 'IRT di SNBT',
    icon: Target,
    color: 'bg-amber-500',
    content: [
      {
        type: 'text',
        content: 'SNBT menggunakan IRT untuk 7 subtes dengan karakteristik berbeda:'
      },
      {
        type: 'grid',
        items: [
          { icon: Brain, title: 'TPS Penalaran Umum', desc: '20 soal, fokus logika', difficulty: 'Medium' },
          { icon: BookOpen, title: 'TPS PPU', desc: '20 soal, pengetahuan umum', difficulty: 'Easy' },
          { icon: FileText, title: 'TPS PBM', desc: '20 soal, literasi baca', difficulty: 'Medium' },
          { icon: Calculator, title: 'TPS PK', desc: '15 soal, kuantitatif', difficulty: 'Hard' },
          { icon: PenTool, title: 'Literasi B. Indonesia', desc: '30 soal, bahasa', difficulty: 'Medium' },
          { icon: Globe, title: 'Literasi B. Inggris', desc: '20 soal, bahasa asing', difficulty: 'Medium' },
          { icon: BarChart3, title: 'Penalaran Matematika', desc: '20 soal, matematika', difficulty: 'Hard' }
        ]
      }
    ]
  },
  {
    id: 'strategy',
    title: 'Strategi IRT',
    icon: Shield,
    color: 'bg-rose-500',
    content: [
      {
        type: 'roles',
        title: 'Peran Strategis Subtes',
        roles: [
          {
            name: 'Main Carry',
            icon: Sword,
            color: 'text-amber-600',
            desc: 'Subtes andalan dengan performa terbaik. Fokus maksimalkan skor di sini.',
            strategy: 'Prioritaskan waktu dan energi, jawab semua soal dengan teliti.'
          },
          {
            name: 'Secondary Carry',
            icon: TrendingUp,
            color: 'text-blue-600',
            desc: 'Pendukung kuat dengan performa baik. Pertahankan level ini.',
            strategy: 'Jaga konsistensi, review sebelum submit.'
          },
          {
            name: 'Stabilizer',
            icon: Shield,
            color: 'text-emerald-600',
            desc: 'Area aman dengan performa stabil. Hindari kesalahan tidak perlu.',
            strategy: 'Fokus pada akurasi, skip soal terlalu sulit.'
          },
          {
            name: 'Damage Control',
            icon: Target,
            color: 'text-rose-600',
            desc: 'Subtes lemah. Minimalkan kerugian.',
            strategy: 'Prioritaskan soal mudah, tebakan strategis jika waktu habis.'
          }
        ]
      }
    ]
  },
  {
    id: 'simulation',
    title: 'Simulasi IRT Kami',
    icon: Lightbulb,
    color: 'bg-indigo-500',
    content: [
      {
        type: 'text',
        content: 'Simulasi IRT kami menggunakan algoritma canggih untuk memberikan analisis realistis:'
      },
      {
        type: 'features',
        features: [
          {
            title: 'Analisis Real-Time',
            desc: 'Setiap jawaban dianalisis sesuai tingkat kesulitan dan populasi.',
            icon: Zap
          },
          {
            title: 'Breakdown Detail',
            desc: 'Lihat soal mana yang paling berdampak pada skor Anda.',
            icon: BarChart3
          },
          {
            title: 'Matrix Target',
            desc: 'Dapatkan target spesifik per subtes untuk PTN pilihan Anda.',
            icon: Target
          },
          {
            title: 'Role Strategy',
            desc: 'Identifikasi peran strategis setiap subtes dalam performa Anda.',
            icon: Shield
          }
        ]
      }
    ]
  }
];

// ─── Components ───────────────────────────────────────────────────────────────

const SectionCard = ({ section, isActive, onClick }) => {
  const Icon = section.icon;
  return (
    <button
      onClick={() => onClick(section.id)}
      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
        isActive
          ? 'border-violet-500 bg-violet-50 shadow-lg'
          : 'border-gray-200 bg-white hover:border-violet-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-lg ${section.color} flex items-center justify-center flex-shrink-0`}>
          <Icon size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900">{section.title}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {section.content[0].content.substring(0, 60)}...
          </p>
        </div>
        <ChevronRight 
          size={20} 
          className={`transition-transform ${isActive ? 'text-violet-600' : 'text-gray-400'}`} 
        />
      </div>
    </button>
  );
};

const ContentRenderer = ({ content }) => {
  return (
    <div className="space-y-6">
      {content.map((item, index) => {
        switch (item.type) {
          case 'text':
            return (
              <p key={index} className="text-gray-700 leading-relaxed">
                {item.content}
              </p>
            );
          
          case 'highlight':
            return (
              <div key={index} className="p-4 bg-violet-50 border border-violet-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Lightbulb size={20} className="text-violet-600 flex-shrink-0 mt-0.5" />
                  <p className="text-violet-800 font-medium">{item.content}</p>
                </div>
              </div>
            );
          
          case 'list':
            return (
              <ul key={index} className="space-y-2">
                {item.items.map((listItem, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-violet-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{listItem}</span>
                  </li>
                ))}
              </ul>
            );
          
          case 'formula':
            return (
              <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <Calculator size={16} />
                  {item.title}
                </h4>
                <div className="bg-white p-3 rounded border border-blue-100 text-center font-mono text-sm text-blue-900 mb-2">
                  {item.content}
                </div>
                <p className="text-xs text-blue-700 italic">{item.explanation}</p>
              </div>
            );
          
          case 'comparison':
            return (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
                  <h4 className="font-bold text-rose-800 mb-3">{item.left.title}</h4>
                  <ul className="space-y-2">
                    {item.left.items.map((listItem, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <AlertCircle size={14} className="text-rose-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-rose-700">{listItem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <h4 className="font-bold text-emerald-800 mb-3">{item.right.title}</h4>
                  <ul className="space-y-2">
                    {item.right.items.map((listItem, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-emerald-700">{listItem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          
          case 'grid':
            return (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {item.items.map((gridItem, i) => {
                  const Icon = gridItem.icon;
                  return (
                    <div key={i} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon size={16} className="text-violet-600" />
                        <h5 className="font-bold text-gray-800 text-sm">{gridItem.title}</h5>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{gridItem.desc}</p>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        gridItem.difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
                        gridItem.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {gridItem.difficulty}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          
          case 'roles':
            return (
              <div key={index} className="space-y-4">
                <h4 className="font-bold text-gray-800">{item.title}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {item.roles.map((role, i) => {
                    const RoleIcon = role.icon;
                    return (
                      <div key={i} className={`p-4 rounded-lg border-2 ${
                        role.color === 'text-amber-600' ? 'bg-amber-50 border-amber-200' :
                        role.color === 'text-blue-600' ? 'bg-blue-50 border-blue-200' :
                        role.color === 'text-emerald-600' ? 'bg-emerald-50 border-emerald-200' :
                        'bg-rose-50 border-rose-200'
                      }`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-lg ${
                            role.color === 'text-amber-600' ? 'bg-amber-500' :
                            role.color === 'text-blue-600' ? 'bg-blue-500' :
                            role.color === 'text-emerald-600' ? 'bg-emerald-500' :
                            'bg-rose-500'
                          } flex items-center justify-center`}>
                            <RoleIcon size={18} className="text-white" />
                          </div>
                          <div>
                            <h5 className={`font-bold ${role.color}`}>{role.name}</h5>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{role.desc}</p>
                        <div className="p-2 bg-white rounded border border-gray-200">
                          <p className="text-xs font-semibold text-gray-800 mb-1">Strategi:</p>
                          <p className="text-xs text-gray-600">{role.strategy}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          
          case 'features':
            return (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {item.features.map((feature, i) => {
                  const FeatureIcon = feature.icon;
                  return (
                    <div key={i} className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
                          <FeatureIcon size={18} className="text-white" />
                        </div>
                        <div>
                          <h5 className="font-bold text-indigo-800 mb-1">{feature.title}</h5>
                          <p className="text-sm text-indigo-700">{feature.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          
          default:
            return null;
        }
      })}
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────────

const IRTEducationPage = ({ user, onLogin, onLogout, navigate, setView }) => {
  const [activeSection, setActiveSection] = useState('intro');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const tokenBalance = useTokenBalance();

  const currentSection = irtSections.find(s => s.id === activeSection);
  const currentIndex = irtSections.findIndex(s => s.id === activeSection);

  const handleNext = () => {
    if (currentIndex < irtSections.length - 1) {
      setActiveSection(irtSections[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActiveSection(irtSections[currentIndex - 1].id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50">
      {/* Background Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-400/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-400/10 rounded-full blur-[120px]" />
      </div>

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

      <main className="relative z-10 pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white border border-violet-200 rounded-full px-4 py-1.5 mb-4 shadow-sm">
              <BookOpen size={14} className="text-violet-600" />
              <span className="text-xs font-bold text-violet-700 uppercase tracking-wider">Pusat Edukasi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-4">
              Memahami Sistem{' '}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                IRT SNBT
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pelajari cara kerja Item Response Theory dan strategi optimal untuk menghadapi SNBT
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress Pembelajaran</span>
              <span className="text-sm font-medium text-violet-600">
                {currentIndex + 1} dari {irtSections.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-violet-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / irtSections.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-4 sticky top-24">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Brain size={16} className="text-violet-600" />
                  Materi Pembelajaran
                </h3>
                <div className="space-y-2">
                  {irtSections.map((section) => (
                    <SectionCard
                      key={section.id}
                      section={section}
                      isActive={activeSection === section.id}
                      onClick={setActiveSection}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg p-8">
                {/* Section Header */}
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                  <div className={`w-12 h-12 rounded-lg ${currentSection.color} flex items-center justify-center`}>
                    <currentSection.icon size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentSection.title}</h2>
                  </div>
                </div>

                {/* Section Content */}
                <div className="min-h-[400px]">
                  <ContentRenderer content={currentSection.content} />
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                      currentIndex === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <ChevronLeft size={16} />
                    Sebelumnya
                  </button>

                  <div className="flex items-center gap-2">
                    {currentIndex < irtSections.length - 1 ? (
                      <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-6 py-2 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition-all"
                      >
                        Selanjutnya
                        <ChevronRight size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate('/irt-simulation')}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                      >
                        Coba Simulasi
                        <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/irt-simulation')}
              className="p-4 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-all flex items-center justify-center gap-2"
            >
              <Target size={20} />
              Mulai Simulasi IRT
            </button>
            <button
              onClick={() => navigate('/snbt-exam')}
              className="p-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
            >
              <Brain size={20} />
              Kerjakan Ujian Contoh
            </button>
            <button
              onClick={() => window.open('https://snpmb.polri.go.id/', '_blank')}
              className="p-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <Info size={20} />
              Info Resmi SNPMB
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IRTEducationPage;
