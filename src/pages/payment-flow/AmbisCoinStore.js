import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins, Zap, Crown, Sparkles, ArrowRight, Check, Shield, Clock } from 'lucide-react';

const COIN_PACKAGES = [
  {
    id: 'starter',
    name: 'Starter Pack',
    coins: 10,
    price: 10000,
    bonus: 0,
    popular: false,
    icon: Coins,
    color: 'from-gray-500 to-gray-600',
    features: ['10 Soal Tambahan', 'Berlaku 30 Hari', 'Support 24/7']
  },
  {
    id: 'popular',
    name: 'Popular Pack',
    coins: 50,
    price: 45000,
    bonus: 5,
    popular: true,
    icon: Zap,
    color: 'from-violet-500 to-purple-600',
    features: ['50 Soal Tambahan', '+5 Bonus Coins', 'Berlaku 60 Hari', 'Priority Support']
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    coins: 100,
    price: 80000,
    bonus: 15,
    popular: false,
    icon: Crown,
    color: 'from-amber-500 to-orange-600',
    features: ['100 Soal Tambahan', '+15 Bonus Coins', 'Berlaku 90 Hari', 'VIP Support', 'Early Access']
  }
];

export const AmbisCoinStore = ({ user, onLogin }) => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);

  const handleBuy = (pkg) => {
    if (!user) {
      onLogin();
      return;
    }
    navigate('/ambis-coin/checkout', { state: { package: pkg } });
  };

  return (
    <div className="min-h-screen bg-[#F3F4F8] relative overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-15">
        <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] bg-violet-500 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[25%] h-[25%] bg-amber-500 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-semibold text-violet-600">Ambis Coin Store</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Beli Ambis Coin
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tingkatkan limit soal harianmu dengan Ambis Coin. 1 Coin = 1 Soal Tambahan
          </p>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="w-5 h-5 text-green-600" />
            <span>Pembayaran Aman</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>Instant Delivery</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Check className="w-5 h-5 text-violet-600" />
            <span>Garansi 100%</span>
          </div>
        </div>

        {/* Packages */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {COIN_PACKAGES.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-3xl p-8 border-2 transition-all duration-300 hover:scale-105 ${
                  pkg.popular
                    ? 'border-violet-500 shadow-2xl shadow-violet-200'
                    : 'border-gray-200 hover:border-violet-300'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-bold rounded-full">
                    PALING LARIS
                  </div>
                )}

                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pkg.color} flex items-center justify-center mb-6`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {pkg.coins + pkg.bonus}
                  </span>
                  <span className="text-lg text-gray-500">Coins</span>
                  {pkg.bonus > 0 && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                      +{pkg.bonus} Bonus
                    </span>
                  )}
                </div>

                <div className="text-3xl font-bold text-gray-900 mb-6">
                  Rp {pkg.price.toLocaleString('id-ID')}
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleBuy(pkg)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Beli Sekarang
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Pertanyaan Umum</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Bagaimana cara menggunakan Ambis Coin?</h4>
              <p className="text-gray-600 text-sm">Ambis Coin otomatis menambah limit soal harianmu. 1 Coin = 1 Soal tambahan.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Apakah Ambis Coin bisa expired?</h4>
              <p className="text-gray-600 text-sm">Ya, setiap paket memiliki masa berlaku. Pastikan gunakan sebelum expired.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Metode pembayaran apa saja yang tersedia?</h4>
              <p className="text-gray-600 text-sm">Kami menerima transfer bank, e-wallet (GoPay, OVO, DANA), dan QRIS.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
