import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Coins, Home } from 'lucide-react';
import { useCoin } from '../context/CoinContext';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addCoins } = useCoin();
  const { coins, amount, method } = location.state || {};

  useEffect(() => {
    if (!coins) {
      navigate('/payment');
      return;
    }

    // Tambahkan koin ke balance
    addCoins(coins, {
      type: 'purchase',
      amount: coins,
      price: amount,
      method: method,
      timestamp: new Date().toISOString(),
    });

    // Update daily limit di localStorage
    const today = new Date().toDateString();
    const dailyData = JSON.parse(localStorage.getItem('dailyGenerationLimit') || '{}');
    
    if (dailyData.date !== today) {
      // Reset jika hari berbeda
      dailyData.date = today;
      dailyData.count = 0;
    }
    
    // Tambahkan limit berdasarkan koin (1 koin = 1 generate)
    dailyData.limit = (dailyData.limit || 19) + coins;
    localStorage.setItem('dailyGenerationLimit', JSON.stringify(dailyData));
  }, [coins, amount, method, addCoins, navigate]);

  if (!coins) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pembayaran Berhasil!</h1>
            <p className="text-gray-600">Transaksi Anda telah diproses</p>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 mb-6">
            <Coins className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">Koin Anda Bertambah</p>
            <p className="text-4xl font-bold text-yellow-600">+{coins} Koin</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">Detail Transaksi</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Jumlah Koin</span>
                <span className="font-semibold">{coins} Koin</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Bayar</span>
                <span className="font-semibold">Rp {amount?.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Metode</span>
                <span className="font-semibold uppercase">{method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Waktu</span>
                <span className="font-semibold">{new Date().toLocaleTimeString('id-ID')}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-800">
              ✨ Limit harian Anda telah bertambah <span className="font-bold">+{coins}</span> generate!
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
