import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, AlertCircle, CheckCircle, XCircle, Shield, Lock, Users, CreditCard, Ban, AlertTriangle, RefreshCw } from 'lucide-react';

const TermsConditions = () => {
  const [activeSection, setActiveSection] = useState('intro');

  const sections = [
    { id: 'intro', title: 'Pendahuluan' },
    { id: 'account', title: 'Akun Pengguna' },
    { id: 'service', title: 'Layanan AI' },
    { id: 'payment', title: 'Pembayaran & Kredit' },
    { id: 'prohibited', title: 'Larangan Penggunaan' },
    { id: 'liability', title: 'Batasan Tanggung Jawab' },
    { id: 'changes', title: 'Perubahan Ketentuan' }
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
            <FileText className="text-purple-600" size={24} />
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
                {sections.map(section => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={() => setActiveSection(section.id)}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === section.id
                        ? 'bg-purple-50 text-purple-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-3xl">
            {/* Title */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Syarat & Ketentuan Penggunaan</h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Selamat datang di SNBT AI. Dengan menggunakan platform kami, Anda setuju untuk mematuhi ketentuan berikut. 
                Mohon baca dengan seksama sebelum menggunakan layanan kami.
              </p>
              <p className="text-sm text-gray-500 mt-4">Terakhir diperbarui: 1 Januari 2025</p>
            </div>

            <div className="space-y-12">
              {/* Section 1 */}
              <section id="intro" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Pendahuluan</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    SNBT AI adalah platform pembelajaran berbasis kecerdasan buatan yang dirancang untuk membantu siswa 
                    mempersiapkan diri menghadapi Seleksi Nasional Berdasarkan Tes (SNBT). Dengan mengakses atau menggunakan 
                    layanan kami, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Jika Anda tidak setuju dengan ketentuan ini, mohon untuk tidak menggunakan platform kami.
                  </p>
                </div>
              </section>

              <div className="border-t border-gray-200"></div>

              {/* Section 2 */}
              <section id="account" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Akun Pengguna</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Untuk mengakses fitur lengkap SNBT AI, Anda perlu membuat akun dengan informasi yang akurat dan lengkap.
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex gap-3">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Anda bertanggung jawab penuh atas keamanan akun dan kata sandi Anda</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Dilarang berbagi akun dengan orang lain atau menggunakan akun orang lain tanpa izin</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Anda harus segera memberitahu kami jika terjadi penggunaan akun yang tidak sah</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Kami berhak menangguhkan atau menghapus akun yang melanggar ketentuan</span>
                    </li>
                  </ul>
                </div>
              </section>

              <div className="border-t border-gray-200"></div>

              {/* Section 3 */}
              <section id="service" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Layanan AI</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    SNBT AI menggunakan teknologi kecerdasan buatan (Google Gemini) untuk menghasilkan soal-soal latihan.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 my-6">
                    <h3 className="text-lg font-semibold text-amber-900 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Disclaimer Penting
                    </h3>
                    <p className="text-amber-800 leading-relaxed">
                      Soal yang dihasilkan oleh AI mungkin memerlukan verifikasi lebih lanjut. Kami berusaha memberikan 
                      kualitas terbaik, namun tidak menjamin 100% akurasi konten. Pengguna disarankan untuk menggunakan 
                      platform ini sebagai alat bantu belajar, bukan satu-satunya sumber.
                    </p>
                  </div>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex gap-3">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Konten yang dihasilkan AI bersifat edukatif dan tidak menggantikan bimbingan resmi</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Kami tidak bertanggung jawab atas interpretasi atau penggunaan konten yang salah</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Layanan dapat mengalami downtime atau perubahan tanpa pemberitahuan sebelumnya</span>
                    </li>
                  </ul>
                </div>
              </section>

              <div className="border-t border-gray-200"></div>

              {/* Section 4 */}
              <section id="payment" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Pembayaran & Kredit</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    SNBT AI menawarkan layanan gratis dengan batasan penggunaan harian, serta opsi premium untuk akses unlimited.
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex gap-3">
                      <span className="text-purple-600 font-bold">•</span>
                      <span><strong>Pengguna Gratis:</strong> 1 soal per hari tanpa login, 19 soal per hari dengan login</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-purple-600 font-bold">•</span>
                      <span><strong>Pengguna Premium:</strong> Akses unlimited dengan fitur tambahan (jika tersedia)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Semua pembayaran bersifat final dan tidak dapat dikembalikan kecuali diwajibkan oleh hukum</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Harga dapat berubah sewaktu-waktu dengan pemberitahuan 30 hari sebelumnya</span>
                    </li>
                  </ul>
                </div>
              </section>

              <div className="border-t border-gray-200"></div>

              {/* Section 5 */}
              <section id="prohibited" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Larangan Penggunaan</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Anda dilarang menggunakan SNBT AI untuk tujuan berikut:
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex gap-3">
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <span>Menyalahgunakan API atau melakukan scraping data secara otomatis</span>
                    </li>
                    <li className="flex gap-3">
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <span>Mengunggah konten ilegal, berbahaya, atau melanggar hak cipta</span>
                    </li>
                    <li className="flex gap-3">
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <span>Mencoba mengakses sistem atau data pengguna lain tanpa izin</span>
                    </li>
                    <li className="flex gap-3">
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <span>Menggunakan platform untuk spam, phishing, atau aktivitas penipuan</span>
                    </li>
                    <li className="flex gap-3">
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <span>Merekayasa balik (reverse engineer) atau menduplikasi layanan kami</span>
                    </li>
                  </ul>
                  <p className="text-gray-600 leading-relaxed mt-4">
                    Pelanggaran terhadap ketentuan ini dapat mengakibatkan penangguhan atau penghapusan akun secara permanen.
                  </p>
                </div>
              </section>

              <div className="border-t border-gray-200"></div>

              {/* Section 6 */}
              <section id="liability" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Batasan Tanggung Jawab</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    SNBT AI adalah alat bantu belajar dan tidak menjamin hasil tertentu dalam ujian SNBT resmi.
                  </p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex gap-3">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Kami tidak menjamin kelulusan atau skor tertentu dalam ujian SNBT</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Platform disediakan "sebagaimana adanya" tanpa jaminan tersurat maupun tersirat</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Kami tidak bertanggung jawab atas kerugian langsung, tidak langsung, atau konsekuensial</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>Tanggung jawab kami terbatas pada jumlah yang Anda bayarkan dalam 12 bulan terakhir</span>
                    </li>
                  </ul>
                </div>
              </section>

              <div className="border-t border-gray-200"></div>

              {/* Section 7 */}
              <section id="changes" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Perubahan Ketentuan</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan berlaku segera setelah 
                    dipublikasikan di halaman ini.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Penggunaan berkelanjutan atas layanan kami setelah perubahan dianggap sebagai persetujuan Anda terhadap 
                    ketentuan yang diperbarui. Kami menyarankan Anda untuk memeriksa halaman ini secara berkala.
                  </p>
                </div>
              </section>
            </div>

            {/* Footer CTA */}
            <div className="mt-16 p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Punya Pertanyaan?</h3>
              <p className="text-gray-600 mb-4">
                Jika ada yang kurang jelas mengenai syarat dan ketentuan ini, jangan ragu untuk menghubungi kami.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                Hubungi Kami
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
