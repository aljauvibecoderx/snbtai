import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MessageCircle, Send, Instagram, Linkedin, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqs = [
    {
      question: 'Apakah SNBT AI benar-benar gratis?',
      answer: 'Ya! Kami menyediakan 1 soal/hari tanpa login dan 19 soal/hari dengan login gratis. Fitur premium akan tersedia untuk akses unlimited.'
    },
    {
      question: 'Bagaimana cara kerja AI Generator?',
      answer: 'Anda cukup input teks/cerita atau upload gambar/PDF, lalu AI kami (Google Gemini) akan menghasilkan soal SNBT berkualitas sesuai subtes dan tingkat kesulitan yang Anda pilih.'
    },
    {
      question: 'Apakah soal yang dihasilkan akurat?',
      answer: 'Kami menggunakan AI terkini dan terus meningkatkan kualitas. Namun, kami sarankan untuk menggunakan platform ini sebagai alat bantu belajar, bukan satu-satunya sumber.'
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    // Validasi
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({
        type: 'error',
        message: 'Mohon lengkapi semua field yang wajib diisi.'
      });
      setIsSubmitting(false);
      return;
    }

    // Simulasi pengiriman (ganti dengan API call sebenarnya)
    setTimeout(() => {
      setStatus({
        type: 'success',
        message: 'Pesan Anda berhasil dikirim! Kami akan merespons dalam 1-2 hari kerja.'
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

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
            <MessageCircle className="text-purple-600" size={24} />
            <span className="font-bold text-xl text-gray-900">SNBT AI</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Hubungi Kami</h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Punya pertanyaan, kendala teknis, atau saran untuk kami? Tim SNBT AI siap mendengarkan dan membantu Anda.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Methods */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Cara Menghubungi</h2>
              
              <div className="space-y-4">
                {/* Email */}
                <a
                  href="mailto:support@snbt-ai.com"
                  className="flex items-start gap-4 p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-purple-200 transition-colors">
                    <Mail className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-sm text-gray-600 mb-1">support@snbt-ai.com</p>
                    <p className="text-xs text-gray-500">Respons dalam 1-2 hari kerja</p>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-green-200 transition-colors">
                    <MessageCircle className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
                    <p className="text-sm text-gray-600 mb-1">+62 812-3456-7890</p>
                    <p className="text-xs text-gray-500">Chat langsung (09:00 - 17:00 WIB)</p>
                  </div>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/snbtai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-pink-300 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-pink-200 transition-colors">
                    <Instagram className="text-pink-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Instagram</h3>
                    <p className="text-sm text-gray-600 mb-1">@snbtai</p>
                    <p className="text-xs text-gray-500">Tips & update terbaru</p>
                  </div>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/company/snbtai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-200 transition-colors">
                    <Linkedin className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">LinkedIn</h3>
                    <p className="text-sm text-gray-600 mb-1">SNBT AI</p>
                    <p className="text-xs text-gray-500">Koneksi profesional</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Jam Operasional
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Senin - Jumat</span>
                  <span className="font-medium">09:00 - 17:00 WIB</span>
                </div>
                <div className="flex justify-between">
                  <span>Sabtu</span>
                  <span className="font-medium">09:00 - 14:00 WIB</span>
                </div>
                <div className="flex justify-between">
                  <span>Minggu</span>
                  <span className="font-medium text-red-600">Tutup</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Kirim Pesan</h2>
              <p className="text-gray-600 mb-8">
                Isi formulir di bawah ini dan kami akan merespons secepat mungkin.
              </p>

              {/* Status Message */}
              {status.message && (
                <div
                  className={`flex items-start gap-3 p-4 rounded-xl mb-6 ${
                    status.type === 'success'
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  {status.type === 'success' ? (
                    <CheckCircle className="text-green-600 shrink-0" size={20} />
                  ) : (
                    <AlertCircle className="text-red-600 shrink-0" size={20} />
                  )}
                  <p
                    className={`text-sm ${
                      status.type === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {status.message}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap Anda"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nama@email.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">
                    Subjek
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  >
                    <option value="">Pilih kategori pertanyaan</option>
                    <option value="technical">Kendala Teknis</option>
                    <option value="feature">Saran Fitur</option>
                    <option value="billing">Pembayaran & Billing</option>
                    <option value="partnership">Kerjasama & Partnership</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                    Pesan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Ceritakan pertanyaan atau kendala Anda secara detail..."
                    rows="6"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors resize-none"
                    required
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-2">
                    Minimal 20 karakter. Semakin detail, semakin cepat kami bisa membantu.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Kirim Pesan
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pertanyaan yang Sering Diajukan</h2>
            <p className="text-lg text-gray-600">
              Mungkin jawaban Anda sudah ada di sini
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-purple-300 transition-colors"
              >
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer font-semibold text-gray-900 list-none">
                  <span>{faq.question}</span>
                  <span className="text-purple-600 group-open:rotate-180 transition-transform">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Tidak menemukan jawaban yang Anda cari?{' '}
              <a href="#" className="text-purple-600 hover:underline font-medium">
                Lihat FAQ lengkap
              </a>
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-100 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Ingin Berkolaborasi?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Kami terbuka untuk partnership dengan institusi pendidikan, content creator, atau developer yang 
            ingin berkontribusi untuk pendidikan Indonesia.
          </p>
          <a
            href="mailto:partnership@snbt-ai.com"
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors"
          >
            <Mail size={20} />
            partnership@snbt-ai.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
