import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Download, Home, Receipt } from 'lucide-react';

export const AmbisCoinSuccess = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, package: pkg } = location.state || {};

  useEffect(() => {
    if (!orderId || !pkg) {
      navigate('/ambis-coin');
    }
  }, [orderId, pkg, navigate]);

  if (!pkg) return null;

  const transactionDate = new Date().toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-[#F3F4F8] relative overflow-x-hidden flex items-center justify-center p-4">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-15">
        <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] bg-green-500 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[25%] h-[25%] bg-violet-500 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Pembayaran Berhasil!</h1>
          <p className="text-lg text-gray-600">Ambis Coin telah ditambahkan ke akun Anda</p>
        </div>

        {/* Transaction Details */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order ID</p>
              <p className="font-mono font-bold text-gray-900">{orderId}</p>
            </div>
            <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">
              BERHASIL
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Paket</span>
              <span className="font-semibold text-gray-900">{pkg.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Jumlah Coin</span>
              <span className="font-semibold text-gray-900">{pkg.coins + pkg.bonus} Coins</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Pembayaran</span>
              <span className="font-semibold text-gray-900">Rp {pkg.price.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tanggal Transaksi</span>
              <span className="font-semibold text-gray-900">{transactionDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pembeli</span>
              <span className="font-semibold text-gray-900">{user?.displayName}</span>
            </div>
          </div>

          <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
            <p className="text-sm text-violet-800 text-center">
              ✨ Coin telah ditambahkan ke akun Anda dan siap digunakan untuk membuat soal tambahan!
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/dashboard/overview')}
            className="flex items-center justify-center gap-2 py-3 bg-white border-2 border-gray-200 text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition-all"
          >
            <Home className="w-5 h-5" />
            Ke Dashboard
          </button>
          <button
            onClick={() => navigate('/app')}
            className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <Receipt className="w-5 h-5" />
            Buat Soal
          </button>
        </div>

        {/* Download Receipt */}
        <button
          onClick={() => window.print()}
          className="w-full mt-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Download Bukti Transaksi
        </button>
      </div>
    </div>
  );
};
