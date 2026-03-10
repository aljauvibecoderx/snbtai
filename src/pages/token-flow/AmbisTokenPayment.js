import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Clock, AlertCircle } from 'lucide-react';
import { formatPrice } from '../../services/payment/mockPaymentService';

export const AmbisTokenPayment = ({ navigate, location }) => {
  const { package: pkg, paymentMethod, totalPrice, adminFee } = location?.state || {};
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(t => t > 0 ? t - 1 : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Data pembayaran tidak ditemukan</p>
          <button
            onClick={() => navigate('/ambis-token')}
            className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          >
            Kembali ke Toko
          </button>
        </div>
      </div>
    );
  }

  const formatCountdown = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const paymentDetails = {
    bank: {
      title: 'Transfer Bank',
      icon: '🏦',
      details: [
        { label: 'Bank', value: 'BCA' },
        { label: 'Nomor Rekening', value: '1234567890', copyable: true },
        { label: 'Atas Nama', value: 'PT SNBT AI Indonesia' }
      ]
    },
    ewallet: {
      title: 'E-Wallet',
      icon: '📱',
      details: [
        { label: 'Nomor Telepon', value: '081234567890', copyable: true },
        { label: 'Atas Nama', value: 'SNBT AI' }
      ]
    },
    qris: {
      title: 'QRIS',
      icon: '📲',
      details: [
        { label: 'Scan QR Code di bawah', value: 'QR Code akan ditampilkan' }
      ]
    }
  };

  const details = paymentDetails[paymentMethod] || paymentDetails.bank;

  return (
    <div className="min-h-screen bg-[#F3F4F8] relative overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-15">
        <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] bg-violet-500 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[25%] h-[25%] bg-amber-500 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/ambis-token/checkout', { state: { package: pkg } })}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6 text-sm font-medium"
        >
          <ArrowLeft size={18} />
          Kembali
        </button>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Instruksi Pembayaran</h1>
              <p className="text-gray-600">Selesaikan pembayaran dalam waktu yang ditentukan</p>
            </div>

            {/* Countdown Timer */}
            <div className="bg-gradient-to-r from-rose-50 to-orange-50 border-2 border-rose-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-rose-600" />
                <span className="font-bold text-rose-900">Waktu Pembayaran</span>
              </div>
              <div className="text-4xl font-bold text-rose-600 font-mono">
                {formatCountdown(timeLeft)}
              </div>
              <p className="text-sm text-rose-700 mt-2">
                Pembayaran harus diselesaikan dalam 24 jam. Setelah itu, pesanan akan dibatalkan.
              </p>
            </div>

            {/* Payment Method Details */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{details.icon}</span>
                <h3 className="text-2xl font-bold text-gray-900">{details.title}</h3>
              </div>

              <div className="space-y-4">
                {details.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">{detail.label}</p>
                      <p className="text-lg font-mono font-bold text-gray-900 mt-1">{detail.value}</p>
                    </div>
                    {detail.copyable && (
                      <button
                        onClick={() => copyToClipboard(detail.value, idx)}
                        className={`p-2 rounded-lg transition-all ${
                          copiedField === idx
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                        title="Salin ke clipboard"
                      >
                        {copiedField === idx ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step by Step */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Langkah-Langkah Pembayaran</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <p className="font-semibold text-gray-900">Salin nomor rekening/telepon</p>
                    <p className="text-sm text-gray-600">Gunakan tombol salin di atas untuk kemudahan</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <p className="font-semibold text-gray-900">Lakukan transfer/pembayaran</p>
                    <p className="text-sm text-gray-600">Pastikan jumlah sesuai: {formatPrice(totalPrice)}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div>
                    <p className="font-semibold text-gray-900">Tunggu verifikasi</p>
                    <p className="text-sm text-gray-600">Token akan ditambahkan dalam 24 jam</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">Penting!</p>
                <p>Pastikan jumlah transfer sesuai dengan total yang ditampilkan. Jangan kurangi atau tambah jumlah.</p>
              </div>
            </div>

            {/* Confirmation Button */}
            <button
              onClick={() => navigate('/ambis-token/success', { state: { package: pkg } })}
              className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Saya Sudah Melakukan Pembayaran
            </button>
          </div>

          {/* Order Summary Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-6">
              <h3 className="font-bold text-gray-900 mb-4">Ringkasan Pesanan</h3>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Paket</p>
                  <p className="font-bold text-gray-900">{pkg.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Token</p>
                  <p className="font-bold text-gray-900">{pkg.coins + pkg.bonus}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Harga Paket</span>
                  <span className="font-semibold text-gray-900">{formatPrice(pkg.price)}</span>
                </div>
                {adminFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Biaya Admin</span>
                    <span className="font-semibold text-gray-900">{formatPrice(adminFee)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold pt-3 border-t border-gray-200">
                  <span>Total Bayar</span>
                  <span className="text-violet-600">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700">
                  ✓ Pembayaran aman dan terenkripsi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
