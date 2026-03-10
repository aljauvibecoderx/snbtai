import React, { useState } from 'react';
import { Coins, Sparkles, ArrowLeft, Zap, TrendingUp, Shield, Check, Clock, Crown, ChevronRight } from 'lucide-react';
import { COIN_PACKAGES, formatPrice } from '../../services/payment/mockPaymentService';
import { PaymentModal } from '../../components/payment/PaymentModal';


export const AmbisTokenStore = ({ user, onBack, navigate, onTokenUpdate }) => {
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const balance = 0;
  const totalEarned = 0;

  const handleSelectPackage = (pkg) => {
    setSelectedPkg(pkg);
    setShowModal(true);
  };

  const handlePaymentSuccess = async (result) => {
    setShowModal(false);
    setSelectedPkg(null);
    
    // Update token balance
    if (onTokenUpdate) {
      await onTokenUpdate();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPkg(null);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F8] relative overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-15">
        <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] bg-violet-500 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[25%] h-[25%] bg-amber-500 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6 text-sm font-medium"
          >
            <ArrowLeft size={18} />
            Kembali
          </button>
        )}

        {/* Header */}
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

        {/* Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                <Coins className="w-5 h-5 text-violet-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Token Tersisa</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{balance}</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Total Dibeli</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{totalEarned}</div>
          </div>
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
            const Icon = pkg.highlight ? Crown : Coins;
            return (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-3xl p-8 border-2 transition-all duration-300 hover:scale-105 ${
                  pkg.highlight
                    ? 'border-violet-500 shadow-2xl shadow-violet-200'
                    : 'border-gray-200 hover:border-violet-300'
                }`}
              >
                {pkg.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-bold rounded-full">
                    PALING LARIS
                  </div>
                )}

                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-6`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {pkg.coins}
                  </span>
                  <span className="text-lg text-gray-500">Token</span>
                </div>

                <div className="text-3xl font-bold text-gray-900 mb-6">
                  Rp {pkg.price.toLocaleString('id-ID')}
                </div>

                <p className="text-sm text-gray-600 mb-8">{pkg.description}</p>

                <button
                  onClick={() => handleSelectPackage(pkg)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    pkg.highlight
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

        {/* FAQ */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Pertanyaan Umum</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Bagaimana cara menggunakan Ambis Token?</h4>
              <p className="text-gray-600 text-sm">Ambis Token otomatis menambah limit soal harianmu. 1 Token = 1 Soal tambahan yang bisa di-generate.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Apakah Ambis Token bisa expired?</h4>
              <p className="text-gray-600 text-sm">Tidak! Token yang kamu beli berlaku selamanya dan tidak akan hangus.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Metode pembayaran apa saja yang tersedia?</h4>
              <p className="text-gray-600 text-sm">Kami menerima transfer bank, e-wallet (GoPay, OVO, DANA), dan QRIS. Integrasi pembayaran nyata segera hadir!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && selectedPkg && (
        <PaymentModal
          pkg={selectedPkg}
          user={user}
          onClose={handleCloseModal}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};
