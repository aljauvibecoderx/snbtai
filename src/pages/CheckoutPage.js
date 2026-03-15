import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  QrCode,
  Building2,
  Smartphone,
  Wallet,
  Loader2,
  Coins,
  ChevronRight,
} from 'lucide-react';
import { SERVICE_FEE } from './AmbisCoinPage';

const PAYMENT_METHODS = [
  {
    id: 'qris',
    name: 'QRIS',
    desc: 'Scan QR dari semua dompet digital',
    icon: QrCode,
    iconColor: 'text-orange-500',
    bgColor: 'bg-orange-50',
  },
  {
    id: 'bank',
    name: 'Transfer Bank / Virtual Account',
    desc: 'BCA, Mandiri, BNI, BRI, dan lainnya',
    icon: Building2,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'gopay',
    name: 'GoPay',
    desc: 'Bayar dengan saldo GoPay',
    icon: Smartphone,
    iconColor: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 'ovo',
    name: 'OVO',
    desc: 'Bayar dengan saldo OVO',
    icon: Wallet,
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
];

const CheckoutPage = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pkg = location.state?.pkg;

  const [selectedMethod, setSelectedMethod] = useState('qris');
  const [isLoading, setIsLoading] = useState(false);

  if (!pkg) {
    return (
      <div className="min-h-screen bg-[#F3F4F8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Paket tidak ditemukan.</p>
          <button
            onClick={() => navigate('/dashboard/ambis-coin')}
            className="px-6 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 text-sm font-semibold transition-all"
          >
            Pilih Paket
          </button>
        </div>
      </div>
    );
  }

  const totalCoins = pkg.coins + pkg.bonus;
  const subtotal = pkg.price;
  const serviceFee = SERVICE_FEE;
  const discount = subtotal + serviceFee;
  const total = 0;

  const isFreeClaim = total === 0;

  const handlePay = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Add coins to localStorage
      const currentBalance = parseInt(localStorage.getItem('ambisTokenBalance') || '0');
      const newBalance = currentBalance + totalCoins;
      localStorage.setItem('ambisTokenBalance', newBalance.toString());
      // Notify other components (hooks listening to storage)
      window.dispatchEvent(new Event('storage'));

      navigate('/dashboard/payment-success', {
        state: { pkg, paymentMethod: selectedMethod, totalCoins },
        replace: true,
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F8] relative">
      {/* Ambient */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] bg-violet-400/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">
        {/* Back */}
        <button
          onClick={() => navigate('/dashboard/ambis-coin')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Kembali ke Toko
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── LEFT COLUMN (60%) ── */}
          <div className="flex-[3] space-y-6">
            {/* Buyer Info */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 mb-5 uppercase tracking-wide">
                Informasi Pembeli
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    readOnly
                    id="buyer-name"
                    name="buyer-name"
                    autoComplete="name"
                    value={user?.displayName || 'Guest'}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <input
                    readOnly
                    id="buyer-email"
                    name="buyer-email"
                    autoComplete="email"
                    value={user?.email || '-'}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 mb-5 uppercase tracking-wide">
                Metode Pembayaran
              </h2>
              {isFreeClaim && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-sm text-green-700 font-medium text-center">
                    🎉 Metode pembayaran tidak diperlukan untuk klaim gratis.
                  </p>
                </div>
              )}
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedMethod === method.id;
                  const isDisabled = isFreeClaim;
                  return (
                    <button
                      key={method.id}
                      onClick={() => !isDisabled && setSelectedMethod(method.id)}
                      disabled={isDisabled}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        isDisabled
                          ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                          : isSelected
                          ? 'border-[#8338e9] bg-violet-50/50 shadow-sm'
                          : 'border-gray-100 bg-gray-50/40 hover:border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl ${method.bgColor} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className={`w-5 h-5 ${method.iconColor}`} strokeWidth={1.8} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-semibold ${
                            isDisabled ? 'text-gray-400' : isSelected ? 'text-[#8338e9]' : 'text-gray-800'
                          }`}
                        >
                          {method.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{method.desc}</p>
                      </div>

                      {/* Radio dot */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isDisabled ? 'border-gray-200' : isSelected ? 'border-[#8338e9] bg-[#8338e9]' : 'border-gray-300'
                        }`}
                      >
                        {!isDisabled && isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN (40%) ── */}
          <div className="flex-[2]">
            <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden sticky top-6">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-sm font-bold text-gray-800">Ringkasan Pesanan</h2>
              </div>

              <div className="p-6 space-y-5">
                {/* Package info */}
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{pkg.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {totalCoins} Coin
                      {pkg.bonus > 0 ? ` (termasuk +${pkg.bonus} bonus)` : ''}
                    </p>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Biaya Layanan</span>
                    <span className="font-medium">Rp {serviceFee.toLocaleString('id-ID')}</span>
                  </div>
                  {isFreeClaim && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Diskon Early Access (100%)</span>
                      <span>- Rp {discount.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-900">Total Pembayaran</span>
                    <span className={`text-xl font-bold ${isFreeClaim ? 'text-violet-600 text-3xl' : 'text-gray-900'}`}>
                      Rp {total.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Pay button */}
                <button
                  onClick={handlePay}
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold text-sm hover:from-violet-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-violet-200/60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      {isFreeClaim ? 'Dapatkan Koin (Gratis)' : 'Bayar Sekarang'}
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-gray-400">
                  {isFreeClaim ? '🎉 Klaim gratis untuk Early Access' : '🔒 Pembayaran dijamin aman dan terenkripsi'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
