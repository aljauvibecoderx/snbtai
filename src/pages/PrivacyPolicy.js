import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, Cookie, Trash2, CheckCircle, XCircle, AlertCircle, Mail, MessageCircle, Monitor, Edit, Package, Ban, BarChart, Settings, Flame, Zap, Clock } from 'lucide-react';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('intro');

  const sections = [
    { id: 'intro', title: 'Pendahuluan', icon: Shield },
    { id: 'data-collection', title: 'Data yang Dikumpulkan', icon: Database },
    { id: 'data-usage', title: 'Penggunaan Data', icon: Eye },
    { id: 'security', title: 'Keamanan Data', icon: Lock },
    { id: 'user-rights', title: 'Hak Pengguna', icon: Trash2 },
    { id: 'cookies', title: 'Cookies & Tracking', icon: Cookie }
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
            <Shield className="text-purple-600" size={24} />
            <span className="font-bold text-xl text-gray-900">SNBT AI</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex gap-12">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Daftar Isi</h3>
              <nav className="space-y-1">
                {sections.map(section => {
                  const Icon = section.icon;
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === section.id
                          ? 'bg-purple-50 text-purple-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={16} />
                      {section.title}
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-3xl">
            {/* Title */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-6">
                <Shield size={16} />
                Privasi Anda Terlindungi
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Kebijakan Privasi</h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Privasi Anda adalah prioritas kami. Berikut adalah bagaimana kami mengumpulkan, menggunakan, dan melindungi 
                data pribadi Anda dengan standar keamanan tertinggi.
              </p>
              <p className="text-sm text-gray-500 mt-4">Terakhir diperbarui: 1 Januari 2025</p>
            </div>

            <div className="space-y-12">
              {/* Section 1 */}
              <section id="intro" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Pendahuluan</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    SNBT AI berkomitmen untuk melindungi privasi dan keamanan data pribadi Anda. Kebijakan privasi ini 
                    menjelaskan jenis informasi yang kami kumpulkan, bagaimana kami menggunakannya, dan hak-hak Anda 
                    terkait data pribadi.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 my-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Komitmen Kami
                    </h3>
                    <ul className="space-y-2 text-blue-800">
                      <li className="flex gap-2 items-center">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        <span>Data Anda tidak akan dijual ke pihak ketiga</span>
                      </li>
                      <li className="flex gap-2 items-center">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        <span>Enkripsi end-to-end untuk data sensitif</span>
                      </li>
                      <li className="flex gap-2 items-center">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        <span>Transparansi penuh dalam penggunaan data</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <div className="border-t border-gray-200"></div>

              {/* Section 2 */}
              <section id="data-collection" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="text-purple-600" size={28} />
                  <h2 className="text-2xl font-semibold text-gray-900">2. Data yang Dikumpulkan</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Kami mengumpulkan informasi berikut untuk memberikan layanan terbaik:
                  </p>

                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-purple-600" />
                        Informasi Akun
                      </h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Email address (untuk autentikasi)</li>
                        <li>• Nama pengguna (opsional)</li>
                        <li>• Foto profil (opsional)</li>
                        <li>• Tanggal pembuatan akun</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Database className="w-5 h-5 text-purple-600" />
                        Data Aktivitas Belajar
                      </h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Riwayat soal yang dikerjakan</li>
                        <li>• Skor dan performa tryout</li>
                        <li>• Waktu pengerjaan soal</li>
                        <li>• Vocabulary yang disimpan</li>
                        <li>• Statistik belajar (streak, XP, level)</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-purple-600" />
                        Konten yang Dibuat
                      </h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Input teks untuk generate soal</li>
                        <li>• Gambar/PDF yang diunggah (AI Lens)</li>
                        <li>• Postingan komunitas</li>
                        <li>• Komentar dan interaksi sosial</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-purple-600" />
                        Data Teknis
                      </h3>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Alamat IP</li>
                        <li>• Browser dan device information</li>
                        <li>• Timestamp akses</li>
                        <li>• Log error untuk debugging</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <div className="border-t border-gray-200"></div>

              {/* Section 3 */}
              <section id="data-usage" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="text-purple-600" size={28} />
                  <h2 className="text-2xl font-semibold text-gray-900">3. Penggunaan Data</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Data yang kami kumpulkan digunakan untuk tujuan berikut:
                  </p>
                  <ul className="space-y-4 text-gray-600">
                    <li className="flex gap-3">
                      <span className="text-purple-600 font-bold text-xl">1</span>
                      <div>
                        <strong className="text-gray-900">Personalisasi Pembelajaran</strong>
                        <p className="mt-1">Menyesuaikan tingkat kesulitan soal dan rekomendasi belajar berdasarkan performa Anda</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-purple-600 font-bold text-xl">2</span>
                      <div>
                        <strong className="text-gray-900">Peningkatan Layanan</strong>
                        <p className="mt-1">Menganalisis pola penggunaan untuk meningkatkan kualitas AI dan fitur platform</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-purple-600 font-bold text-xl">3</span>
                      <div>
                        <strong className="text-gray-900">Keamanan & Fraud Prevention</strong>
                        <p className="mt-1">Mendeteksi dan mencegah penyalahgunaan, spam, atau aktivitas mencurigakan</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-purple-600 font-bold text-xl">4</span>
                      <div>
                        <strong className="text-gray-900">Komunikasi</strong>
                        <p className="mt-1">Mengirim notifikasi penting, update fitur, atau newsletter (dengan persetujuan Anda)</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-purple-600 font-bold text-xl">5</span>
                      <div>
                        <strong className="text-gray-900">Analitik & Riset</strong>
                        <p className="mt-1">Memahami tren belajar untuk pengembangan konten edukatif yang lebih baik</p>
                      </div>
                    </li>
                  </ul>

                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-6">
                    <h3 className="text-lg font-semibold text-red-900 mb-2 flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      Kami TIDAK Akan:
                    </h3>
                    <ul className="space-y-2 text-red-800">
                      <li>• Menjual data Anda ke pihak ketiga untuk iklan</li>
                      <li>• Membagikan informasi pribadi tanpa izin Anda</li>
                      <li>• Menggunakan data untuk tujuan di luar konteks pendidikan</li>
                    </ul>
                  </div>
                </div>
              </section>

              <div className="border-t border-gray-200"></div>

              {/* Section 4 */}
              <section id="security" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="text-purple-600" size={28} />
                  <h2 className="text-2xl font-semibold text-gray-900">4. Keamanan Data</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Kami menerapkan langkah-langkah keamanan tingkat industri untuk melindungi data Anda:
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-purple-600" />
                        Enkripsi
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Data sensitif dienkripsi menggunakan AES-256 saat disimpan dan TLS 1.3 saat ditransmisikan
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Flame className="w-5 h-5 text-purple-600" />
                        Firebase Security
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Database dilindungi dengan Firestore Security Rules yang ketat dan ownership-based access control
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-600" />
                        Rate Limiting
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Sistem pembatasan otomatis untuk mencegah API abuse dan serangan brute force
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-purple-600" />
                        Input Sanitization
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Semua input pengguna dibersihkan untuk mencegah XSS, SQL injection, dan serangan lainnya
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed mt-6">
                    Meskipun kami menggunakan teknologi keamanan terkini, tidak ada sistem yang 100% aman. Kami menyarankan 
                    Anda untuk menggunakan password yang kuat dan tidak membagikan kredensial akun Anda.
                  </p>
                </div>
              </section>

              <div className="border-t border-gray-200"></div>

              {/* Section 5 */}
              <section id="user-rights" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <Trash2 className="text-purple-600" size={28} />
                  <h2 className="text-2xl font-semibold text-gray-900">5. Hak Pengguna</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Anda memiliki kontrol penuh atas data pribadi Anda. Berikut adalah hak-hak Anda:
                  </p>

                  <div className="space-y-4">
                    <div className="flex gap-4 p-5 bg-gray-50 rounded-xl">
                      <Eye className="w-6 h-6 text-purple-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Hak Akses</h3>
                        <p className="text-gray-600 text-sm">
                          Anda dapat mengakses dan melihat semua data pribadi yang kami simpan tentang Anda melalui dashboard
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-5 bg-gray-50 rounded-xl">
                      <Edit className="w-6 h-6 text-purple-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Hak Koreksi</h3>
                        <p className="text-gray-600 text-sm">
                          Anda dapat memperbarui atau memperbaiki informasi profil yang tidak akurat kapan saja
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-5 bg-gray-50 rounded-xl">
                      <Trash2 className="w-6 h-6 text-purple-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Hak Penghapusan (Right to be Forgotten)</h3>
                        <p className="text-gray-600 text-sm">
                          Anda dapat menghapus akun dan semua data terkait secara permanen melalui Settings → Delete Account
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-5 bg-gray-50 rounded-xl">
                      <Package className="w-6 h-6 text-purple-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Hak Portabilitas</h3>
                        <p className="text-gray-600 text-sm">
                          Anda dapat mengekspor data Anda dalam format JSON untuk dipindahkan ke layanan lain
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-5 bg-gray-50 rounded-xl">
                      <Ban className="w-6 h-6 text-purple-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Hak Keberatan</h3>
                        <p className="text-gray-600 text-sm">
                          Anda dapat menolak penggunaan data untuk tujuan tertentu seperti marketing atau analitik
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed mt-6">
                    Untuk menggunakan hak-hak ini, silakan hubungi kami di{' '}
                    <a href="mailto:privacy@snbt-ai.com" className="text-purple-600 hover:underline font-medium">
                      privacy@snbt-ai.com
                    </a>
                    {' '}atau melalui halaman Contact Us.
                  </p>
                </div>
              </section>

              <div className="border-t border-gray-200"></div>

              {/* Section 6 */}
              <section id="cookies" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <Cookie className="text-purple-600" size={28} />
                  <h2 className="text-2xl font-semibold text-gray-900">6. Cookies & Tracking</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Kami menggunakan cookies dan teknologi tracking serupa untuk meningkatkan pengalaman Anda:
                  </p>

                  <div className="space-y-4">
                    <div className="border-l-4 border-green-500 pl-4 py-2">
                      <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                        <Cookie className="w-5 h-5 text-green-600" />
                        Essential Cookies (Wajib)
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Diperlukan untuk fungsi dasar seperti autentikasi dan keamanan. Tidak dapat dinonaktifkan.
                      </p>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4 py-2">
                      <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                        <BarChart className="w-5 h-5 text-blue-600" />
                        Analytics Cookies (Opsional)
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Membantu kami memahami bagaimana pengguna berinteraksi dengan platform (Google Analytics, Firebase Analytics)
                      </p>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4 py-2">
                      <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-purple-600" />
                        Preference Cookies (Opsional)
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Menyimpan preferensi Anda seperti tema, bahasa, atau pengaturan tampilan
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed mt-6">
                    Anda dapat mengelola preferensi cookies melalui pengaturan browser Anda. Namun, menonaktifkan cookies 
                    tertentu dapat mempengaruhi fungsionalitas platform.
                  </p>
                </div>
              </section>
            </div>

            {/* Footer CTA */}
            <div className="mt-16 p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Masih Ada Pertanyaan tentang Privasi?</h3>
              <p className="text-gray-600 mb-4">
                Tim kami siap membantu Anda memahami bagaimana data Anda dilindungi.
              </p>
              <div className="flex gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Hubungi Kami
                </Link>
                <a
                  href="mailto:privacy@snbt-ai.com"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 font-medium rounded-lg border-2 border-purple-600 hover:bg-purple-50 transition-colors"
                >
                  Email Privacy Team
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
