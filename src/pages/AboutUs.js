import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Target, Heart, Zap, Users, BookOpen, Sparkles, TrendingUp, Brain, Flame, Atom } from 'lucide-react';

const AboutUs = () => {
  const values = [
    {
      icon: Heart,
      title: 'Aksesibilitas',
      description: 'Pendidikan berkualitas harus terjangkau untuk semua siswa, tanpa memandang latar belakang ekonomi.'
    },
    {
      icon: Zap,
      title: 'Inovasi',
      description: 'Memanfaatkan AI terkini untuk menciptakan pengalaman belajar yang adaptif dan personal.'
    },
    {
      icon: Target,
      title: 'Transparansi',
      description: 'Jujur tentang kemampuan dan keterbatasan teknologi kami, tanpa janji berlebihan.'
    },
    {
      icon: Users,
      title: 'Komunitas',
      description: 'Membangun ekosistem belajar kolaboratif di mana siswa saling mendukung dan berbagi.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Soal Dihasilkan' },
    { number: '5,000+', label: 'Pengguna Aktif' },
    { number: '85+', label: 'PTN Terdaftar' },
    { number: '95%', label: 'Kepuasan Pengguna' }
  ];

  const milestones = [
    { year: '2024 Q1', title: 'Peluncuran Beta', description: 'Platform pertama kali diluncurkan dengan fitur dasar AI generator' },
    { year: '2024 Q2', title: 'AI Lens Multi-Source', description: 'Menambahkan kemampuan upload hingga 5 gambar/PDF sekaligus' },
    { year: '2024 Q3', title: 'Vocab Mode & PTNPedia', description: 'Fitur vocabulary builder dan database PTN lengkap' },
    { year: '2024 Q4', title: 'IRT Scoring System', description: 'Implementasi sistem scoring profesional seperti SNBT asli' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">Kembali ke Beranda</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="text-purple-600" size={24} />
            <span className="font-bold text-xl text-gray-900">SNBT AI</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
            <Heart size={16} />
            Dibuat dengan untuk Pendidikan Indonesia
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Tentang SNBT AI
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Platform pembelajaran berbasis AI yang demokratis, inovatif, dan terjangkau untuk membantu 
            ribuan siswa Indonesia meraih impian mereka masuk PTN favorit.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Cerita Kami</h2>
          
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100 mb-8">
            <p className="text-gray-700 leading-relaxed mb-4">
              SNBT AI lahir dari <strong>keinginan sederhana</strong>: membuat persiapan SNBT yang berkualitas 
              dapat diakses oleh semua siswa, tidak hanya mereka yang mampu membayar bimbingan belajar mahal.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Kami melihat kesenjangan besar antara siswa di kota besar yang memiliki akses ke bimbel premium 
              dengan siswa di daerah yang hanya mengandalkan buku dan latihan terbatas. Di sinilah teknologi 
              <strong> kecerdasan buatan</strong> menjadi game-changer.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Dengan memanfaatkan <strong>Google Gemini AI</strong>, kami menciptakan platform yang dapat 
              menghasilkan soal-soal SNBT berkualitas secara unlimited, menyesuaikan tingkat kesulitan dengan 
              kemampuan siswa, dan memberikan feedback instan—semua dengan biaya yang sangat terjangkau atau 
              bahkan gratis.
            </p>
          </div>

          <blockquote className="border-l-4 border-purple-600 pl-6 py-2 my-8 italic text-gray-700 text-lg">
            "Setiap siswa berhak mendapatkan kesempatan yang sama untuk sukses, terlepas dari latar belakang 
            ekonomi mereka. Teknologi adalah kunci untuk mewujudkannya."
          </blockquote>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Dampak Kami</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border-2 border-purple-200 rounded-2xl p-8">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Target className="text-purple-600" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Visi Kami</h3>
            <p className="text-gray-600 leading-relaxed">
              Menjadi platform pembelajaran AI terdepan di Indonesia yang memberdayakan jutaan siswa untuk 
              meraih potensi maksimal mereka dan masuk ke perguruan tinggi impian.
            </p>
          </div>

          <div className="bg-white border-2 border-blue-200 rounded-2xl p-8">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="text-blue-600" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Misi Kami</h3>
            <p className="text-gray-600 leading-relaxed">
              Mendemokratisasi akses ke pendidikan berkualitas melalui teknologi AI yang inovatif, terjangkau, 
              dan mudah digunakan oleh semua kalangan.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nilai-Nilai Kami</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Prinsip-prinsip yang memandu setiap keputusan dan fitur yang kami bangun
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="text-purple-600" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Perjalanan Kami</h2>
          <p className="text-lg text-gray-600">
            Dari ide sederhana hingga platform yang digunakan ribuan siswa
          </p>
        </div>

        <div className="space-y-8">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                {index < milestones.length - 1 && (
                  <div className="w-0.5 h-full bg-purple-200 mt-2"></div>
                )}
              </div>
              <div className="flex-1 pb-8">
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="text-sm font-semibold text-purple-600 mb-1">{milestone.year}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Dibuat oleh Pelajar, untuk Pelajar</h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
            SNBT AI dikembangkan oleh tim yang memahami tantangan persiapan SNBT karena kami juga pernah 
            mengalaminya. Kami tahu betapa stresnya mencari materi latihan yang berkualitas, betapa mahalnya 
            bimbel, dan betapa pentingnya memiliki tools yang tepat.
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-purple-100 text-purple-700 rounded-full font-medium">
            <Users size={20} />
            Tim kecil dengan misi besar
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Teknologi yang Kami Gunakan</h2>
          <p className="text-lg text-gray-600">
            Dibangun dengan teknologi terkini untuk performa dan keamanan maksimal
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <Brain className="w-10 h-10 text-purple-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Google Gemini AI</h3>
            <p className="text-sm text-gray-600">Model AI terbaru untuk generate soal berkualitas</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <Flame className="w-10 h-10 text-orange-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Firebase</h3>
            <p className="text-sm text-gray-600">Database real-time dan autentikasi aman</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <Atom className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">React 18</h3>
            <p className="text-sm text-gray-600">UI modern dan responsif</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-purple-600 to-blue-600 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <TrendingUp className="mx-auto mb-6" size={48} />
          <h2 className="text-4xl font-bold mb-4">Bergabunglah dengan Ribuan Siswa Lainnya</h2>
          <p className="text-xl mb-8 opacity-90">
            Mulai perjalanan belajar Anda hari ini dan raih impian masuk PTN favorit
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/"
              className="px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Mulai Belajar Gratis
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-purple-600 transition-colors"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="max-w-4xl mx-auto px-6 py-12 text-center">
        <p className="text-gray-600 leading-relaxed">
          Punya pertanyaan atau ingin berkolaborasi? Kami selalu terbuka untuk feedback dan saran. 
          <Link to="/contact" className="text-purple-600 hover:underline font-medium ml-1">
            Mari berbicara →
          </Link>
        </p>
      </section>
    </div>
  );
};

export default AboutUs;
