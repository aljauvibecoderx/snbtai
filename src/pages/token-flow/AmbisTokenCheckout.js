import React, { useState } from 'react';
import { ArrowLeft, Coins, Tag, ShoppingCart, AlertCircle, ChevronRight } from 'lucide-react';
import { formatPrice } from '../../services/payment/mockPaymentService';
import { useCoin } from '../../context/CoinContext';

export const AmbisTokenCheckout = ({ user, navigate, location }) => {
  const pkg = location?.state?.package;
  const { balance } = useCoin();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('bank');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Paket tidak ditemukan</p>
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

  const adminFee = selectedMethod === 'bank' ? 0 : selectedMethod === 'ewallet' ? 1000 : 500;
  const totalPrice = pkg.price + adminFee;

  const handleProceedToPayment = () => {
    if (!agreedToTerms) {
      alert('Silakan setujui syarat dan ketentuan');
      return;
    }
    navigate('/ambis-token/payment', { 
      state: { 
        package: pkg, 
        paymentMethod: selectedMethod,
        totalPrice,
        adminFee
      } 
    });
  };

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
          onClick={() => navigate('/ambis-token')}
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
              <p className="text-gray-600">Pilih metode pembayaran untuk melanjutkan</p>
            </div>

            {/* User Info */}
            {user && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Informasi Pengguna</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Nama:</span> {user.displayName || 'User'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Token Saat Ini:</span> {balance}
                  </p>
                </div>
              </div>
            )}

            {/* Payment Methods */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Pilih Metode Pembayaran</h3>
              <div className="space-y-3">
                {/* Bank Transfer */}
                <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedMethod === 'bank'
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-gray-200 hover:border-violet-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={selectedMethod === 'bank'}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">Transfer Bank</p>
                      <p className="text-xs text-gray-500">BCA, Mandiri, BNI, dll</p>
                    </div>
                    <span className="text-sm font-bold text-green-600">Gratis</span>
                  </div>
                </label>

                {/* E-Wallet */}
                <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedMethod === 'ewallet'
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-gray-200 hover:border-violet-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="ewallet"
                    checked={selectedMethod === 'ewallet'}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">E-Wallet</p>
                      <p className="text-xs text-gray-500">GoPay, OVO, DANA</p>
                    </div>
                    <span className="text-sm font-bold text-amber-600">+Rp 1.000</span>
                  </div>
                </label>

                {/* QRIS */}
                <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedMethod === 'qris'
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-gray-200 hover:border-violet-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="qris"
                    checked={selectedMethod === 'qris'}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">QRIS</p>
                      <p className="text-xs text-gray-500">Scan QR Code</p>
                    </div>
                    <span className="text-sm font-bold text-blue-600">+Rp 500</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Terms */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="accent-amber-600 w-4 h-4 mt-1 flex-shrink-0"
                />
                <span className="text-sm text-amber-800">
                  Saya setuju dengan <span className="font-semibold">Syarat & Ketentuan</span> dan <span className="font-semibold">Kebijakan Privasi</span>
                </span>
              </label>
            </div>

            {/* CTA */}
            <button
              onClick={handleProceedToPayment}
              disabled={!agreedToTerms || isProcessing}
              className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                agreedToTerms && !isProcessing
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart size={18} />
              Lanjut ke Pembayaran
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Order Summary Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-6">
              <h3 className="font-bold text-gray-900 mb-4">Ringkasan Pesanan</h3>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                    <Coins className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{pkg.name}</p>
                    <p className="text-sm text-gray-500">{pkg.coins + pkg.bonus} Token</p>
                  </div>
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
                  <span>Total</span>
                  <span className="text-violet-600">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700">
                    Pembayaran akan diproses dalam 24 jam. Token akan langsung ditambahkan setelah verifikasi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
