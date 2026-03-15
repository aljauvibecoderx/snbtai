import React, { useState, useEffect } from 'react';
import { Coins, Sparkles, ArrowLeft, Zap, TrendingUp, Shield, Check, Clock, Crown, ChevronRight } from 'lucide-react';

const TOKEN_PACKAGES = [
  { id: 'starter', name: 'Starter Pack', coins: 10, price: 10000, bonus: 0, popular: false, icon: Coins, color: 'from-gray-500 to-gray-600', features: ['10 Soal Tambahan', 'Berlaku Selamanya', 'Support 24/7'] },
  { id: 'popular', name: 'Popular Pack', coins: 50, price: 45000, bonus: 5, popular: true, icon: Zap, color: 'from-violet-500 to-purple-600', features: ['50 Soal Tambahan', '+5 Bonus Token', 'Berlaku Selamanya', 'Priority Support'] },
  { id: 'premium', name: 'Premium Pack', coins: 100, price: 80000, bonus: 15, popular: false, icon: Crown, color: 'from-amber-500 to-orange-600', features: ['100 Soal Tambahan', '+15 Bonus Token', 'Berlaku Selamanya', 'VIP Support', 'Early Access'] }
];

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-200">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
        <Icon className="w-5 h-5 text-violet-600" />
      </div>
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </div>
    <div className="text-3xl font-bold text-gray-900">{value}</div>
  </div>
);

const TrustBadge = ({ icon: Icon, text, color }) => (
  <div className="flex items-center gap-2 text-sm text-gray-600">
    <Icon className={`w-5 h-5 ${color}`} />
    <span>{text}</span>
  </div>
);

const FAQItem = ({ q, a }) => (
  <div>
    <h4 className="font-semibold text-gray-900 mb-2">{q}</h4>
    <p className="text-gray-600 text-sm">{a}</p>
  </div>
);

const AmbisToken = ({ user, onBack, onTokenUpdate, tokenBalance = 0 }) => {
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [lastSuccess, setLastSuccess] = useState(null);
  const [balance, setBalance] = useState(parseInt(localStorage.getItem('ambisTokenBalance') || '0'));

  useEffect(() => {
    const updateBalance = () => {
      setBalance(parseInt(localStorage.getItem('ambisTokenBalance') || '0'));
    };
    window.addEventListener('storage', updateBalance);
    return () => window.removeEventListener('storage', updateBalance);
  }, []);

  const handleSelectPackage = (pkg) => {
    setSelectedPkg(pkg);
    setShowModal(true);
  };

  const handlePaymentSuccess = (pkg) => {
    const totalCoins = pkg.coins + pkg.bonus;
    const currentBalance = parseInt(localStorage.getItem('ambisTokenBalance') || '0');
    const newBalance = currentBalance + totalCoins;
    
    localStorage.setItem('ambisTokenBalance', newBalance.toString());
    setBalance(newBalance);
    
    setLastSuccess({
      coins: totalCoins,
      packageName: pkg.name,
      price: pkg.price
    });
    setShowModal(false);
    setSelectedPkg(null);
    
    if (onTokenUpdate) {
      onTokenUpdate();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPkg(null);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F8] relative overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-15">
        <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] bg-violet-500 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[25%] h-[25%] bg-amber-500 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6 text-sm font-medium"
          >
            <ArrowLeft size={18} />
            Kembali
          </button>
        )}

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-semibold text-violet-600">Ambis Token Store</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Beli Ambis Token
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tingkatkan limit soal harianmu dengan Ambis Token. 1 Token = 1 Soal Tambahan
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
          <StatCard icon={Coins} label="Token Tersisa" value={balance} />
          <StatCard icon={TrendingUp} label="Total Pembelian" value={balance} />
        </div>

        {lastSuccess && (
          <div className="mb-6 max-w-2xl mx-auto bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-green-800">+{lastSuccess.coins} Token Berhasil Ditambahkan!</div>
                <div className="text-xs text-green-600">Paket {lastSuccess.packageName} · Rp {lastSuccess.price.toLocaleString('id-ID')}</div>
              </div>
              <button onClick={() => setLastSuccess(null)} className="text-green-400 hover:text-green-600">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <TrustBadge icon={Shield} text="Pembayaran Aman" color="text-green-600" />
          <TrustBadge icon={Clock} text="Instant Delivery" color="text-blue-600" />
          <TrustBadge icon={Check} text="Garansi 100%" color="text-violet-600" />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {TOKEN_PACKAGES.map((pkg) => {
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
                  <span className="text-lg text-gray-500">Token</span>
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
                  onClick={() => handleSelectPackage(pkg)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Beli Sekarang
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Pertanyaan Umum</h3>
          <div className="space-y-4">
            <FAQItem q="Bagaimana cara menggunakan Ambis Token?" a="Ambis Token otomatis menambah limit soal harianmu. 1 Token = 1 Soal tambahan yang bisa di-generate." />
            <FAQItem q="Apakah Ambis Token bisa expired?" a="Tidak! Token yang kamu beli berlaku selamanya dan tidak akan hangus." />
            <FAQItem q="Metode pembayaran apa saja yang tersedia?" a="Kami menerima transfer bank, e-wallet (GoPay, OVO, DANA), dan QRIS. Integrasi pembayaran nyata segera hadir!" />
          </div>
        </div>
      </div>

      {showModal && selectedPkg && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Konfirmasi Pembelian</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-violet-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Paket</p>
                <p className="text-lg font-bold text-gray-900">{selectedPkg.name}</p>
                <p className="text-sm text-violet-600 mt-2">{selectedPkg.coins + selectedPkg.bonus} Token</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Total Harga</p>
                <p className="text-2xl font-bold text-gray-900">Rp {selectedPkg.price.toLocaleString('id-ID')}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={() => handlePaymentSuccess(selectedPkg)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                >
                  Bayar Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmbisToken;
