import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins, Zap, Crown, Check, ArrowLeft, Sparkles, Shield, Clock, Star } from 'lucide-react';
import { useTokenBalance } from '../hooks/useTokenBalance';

export const SERVICE_FEE = 2000;

export const COIN_PACKAGES = [
  {
    id: 'starter',
    name: 'Starter Pack',
    coins: 10,
    price: 10000,
    bonus: 0,
    popular: false,
    icon: Coins,
    gradient: 'from-slate-500 to-slate-600',
    features: ['10 Soal Tambahan', 'Berlaku Selamanya', 'Support 24/7'],
  },
  {
    id: 'popular',
    name: 'Popular Pack',
    coins: 50,
    price: 45000,
    bonus: 5,
    popular: true,
    icon: Zap,
    gradient: 'from-violet-500 to-purple-600',
    features: ['55 Soal Tambahan', '+5 Bonus Token', 'Berlaku Selamanya', 'Priority Support'],
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    coins: 100,
    price: 80000,
    bonus: 15,
    popular: false,
    icon: Crown,
    gradient: 'from-amber-500 to-orange-600',
    features: ['115 Soal Tambahan', '+15 Bonus Token', 'Berlaku Selamanya', 'VIP Support', 'Early Access'],
  },
];

const TRUST_BADGES = [
  { icon: Shield, text: 'Pembayaran Aman', color: 'text-green-600' },
  { icon: Clock, text: 'Instant Delivery', color: 'text-blue-600' },
  { icon: Star, text: 'Garansi 100%', color: 'text-amber-500' },
];

const FAQ_ITEMS = [
  {
    q: 'Bagaimana cara menggunakan Ambis Coin?',
    a: 'Coin otomatis menambah limit soal harianmu. 1 Coin = 1 Soal tambahan yang bisa di-generate.',
  },
  {
    q: 'Apakah Ambis Coin bisa expired?',
    a: 'Tidak! Coin yang kamu beli berlaku selamanya dan tidak akan hangus.',
  },
  {
    q: 'Metode pembayaran apa yang tersedia?',
    a: 'QRIS, Transfer Bank/VA, GoPay, dan OVO.',
  },
];

const AmbisCoinPage = () => {
  const navigate = useNavigate();
  const tokenBalance = useTokenBalance();

  const handleBuy = (pkg) => {
    const checkoutPkg = {
      id: pkg.id,
      name: pkg.name,
      coins: pkg.coins,
      price: pkg.price,
      bonus: pkg.bonus,
      popular: pkg.popular,
      features: pkg.features,
    };
    navigate('/dashboard/checkout', { state: { pkg: checkoutPkg } });
  };

  return (
    <div className="min-h-screen bg-[#F3F4F8] relative overflow-x-hidden">
      {/* Ambient BG */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] bg-violet-400/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[25%] h-[25%] bg-amber-400/15 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10">
        {/* Early Access Banner */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 rounded-2xl p-5 shadow-lg shadow-purple-200/50">
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-6 h-6 text-white" />
              <span className="text-white font-bold text-lg text-center">
                🎉 Spesial Early Access: Semua Paket Diskon 100% (Periode Maret - April)!
              </span>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-semibold text-violet-700">Ambis Coin Store</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Isi Ulang Ambis Coin</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Buka akses ke ribuan soal SNBT AI. 1 Coin = 1 Soal Tambahan per hari.
          </p>
        </div>

        {/* Current balance */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
              <Coins className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Saldo Coin Kamu</p>
              <p className="text-2xl font-bold text-gray-900">{tokenBalance}</p>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          {TRUST_BADGES.map(({ icon: Icon, text, color }) => (
            <div key={text} className="flex items-center gap-2 text-sm text-gray-600">
              <Icon className={`w-4 h-4 ${color}`} />
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* Package cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {COIN_PACKAGES.map((pkg) => {
            const Icon = pkg.icon;
            const totalCoins = pkg.coins + pkg.bonus;
            return (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-3xl p-8 border-2 transition-all duration-300 hover:-translate-y-1 ${
                  pkg.popular
                    ? 'border-violet-400 shadow-xl shadow-violet-100'
                    : 'border-gray-100 hover:border-violet-200 shadow-sm hover:shadow-md'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-bold rounded-full tracking-wide shadow-lg whitespace-nowrap">
                    🔥 PALING LARIS
                  </div>
                )}

                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pkg.gradient} flex items-center justify-center mb-6 shadow-sm`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1">{pkg.name}</h3>

                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-4xl font-bold text-gray-900">{totalCoins}</span>
                  <span className="text-base text-gray-400 font-medium">Coin</span>
                  {pkg.bonus > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                      +{pkg.bonus} Bonus
                    </span>
                  )}
                </div>

                <p className="text-2xl font-bold mb-6">
                  <span className="line-through text-gray-400 text-lg mr-2">Rp {pkg.price.toLocaleString('id-ID')}</span>
                  <span className="text-violet-600 text-4xl">Rp 0</span>
                  <span className="text-xs font-normal text-gray-400 ml-1.5">
                    + Rp {SERVICE_FEE.toLocaleString('id-ID')} admin
                  </span>
                </p>

                <ul className="space-y-2.5 mb-8">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleBuy(pkg)}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:shadow-lg hover:shadow-violet-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Klaim Gratis
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-5">Pertanyaan Umum</h3>
          <div className="space-y-4">
            {FAQ_ITEMS.map(({ q, a }) => (
              <div key={q} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <p className="text-sm font-semibold text-gray-800 mb-1">{q}</p>
                <p className="text-sm text-gray-500">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbisCoinPage;
