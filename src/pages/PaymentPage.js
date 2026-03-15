import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Coins, ArrowLeft } from 'lucide-react';

const COIN_PACKAGES = [
  { id: 1, coins: 10, price: 10000, bonus: 0 },
  { id: 2, coins: 50, price: 45000, bonus: 5 },
  { id: 3, coins: 100, price: 85000, bonus: 15 },
  { id: 4, coins: 500, price: 400000, bonus: 100 },
];

const PaymentPage = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);

  const handlePurchase = () => {
    if (!selectedPackage) return;
    navigate('/payment/verify', { state: { package: selectedPackage } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft size={20} /> Kembali
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Coins className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Beli Ambis Coin</h1>
            <p className="text-gray-600 mt-2">Pilih paket yang sesuai dengan kebutuhan Anda</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {COIN_PACKAGES.map(pkg => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg)}
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                  selectedPackage?.id === pkg.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{pkg.coins + pkg.bonus} Koin</h3>
                    {pkg.bonus > 0 && (
                      <span className="text-sm text-green-600 font-semibold">+{pkg.bonus} Bonus!</span>
                    )}
                  </div>
                  <Coins className="text-yellow-500" size={32} />
                </div>
                <p className="text-3xl font-bold text-blue-600">Rp {pkg.price.toLocaleString('id-ID')}</p>
                <p className="text-sm text-gray-500 mt-2">≈ Rp {Math.round(pkg.price / (pkg.coins + pkg.bonus)).toLocaleString('id-ID')}/koin</p>
              </div>
            ))}
          </div>

          <button
            onClick={handlePurchase}
            disabled={!selectedPackage}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CreditCard size={24} />
            Lanjut ke Pembayaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
