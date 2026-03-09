// ============================================================
// PaymentModal.js — Checkout Modal (Confirmation + Processing + Result)
// ============================================================

import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Loader2, Coins, Tag, ShoppingCart, AlertCircle } from 'lucide-react';
import { processMockPayment, formatPrice } from '../../services/payment/mockPaymentService';
import { useCoin } from '../../context/CoinContext';

const STEPS = {
  CONFIRM: 'confirm',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed',
};

export const PaymentModal = ({ pkg, user, onClose, onSuccess }) => {
  const [step, setStep] = useState(STEPS.CONFIRM);
  const [errorMsg, setErrorMsg] = useState('');
  const { addCoins } = useCoin();

  const handlePay = async () => {
    setStep(STEPS.PROCESSING);
    setErrorMsg('');

    try {
      const result = await processMockPayment(pkg.id, user);

      if (result.success) {
        addCoins(result.coins, result.transaction);
        setStep(STEPS.SUCCESS);
        setTimeout(() => {
          onSuccess?.(result);
          onClose();
        }, 2200);
      } else {
        setErrorMsg(result.error || 'Terjadi kesalahan yang tidak diketahui.');
        setStep(STEPS.FAILED);
      }
    } catch (err) {
      setErrorMsg('Gagal menghubungi server. Periksa koneksi internet Anda.');
      setStep(STEPS.FAILED);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && step !== STEPS.PROCESSING && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal Container */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-gray-100">
          {/* Drag Handle (mobile) */}
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Konfirmasi Pembelian</h2>
                <p className="text-xs text-gray-500">Paket {pkg.name}</p>
              </div>
            </div>
            {step !== STEPS.PROCESSING && (
              <button
                id="payment-modal-close"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* === STEP: CONFIRM === */}
          {step === STEPS.CONFIRM && (
            <div className="space-y-5">
              {/* Package Summary Card */}
              <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white border border-violet-200 flex items-center justify-center shadow-sm">
                      <Coins className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-900">{pkg.coins} Koin</div>
                      <div className="text-xs text-violet-600 font-medium">+{pkg.generateQuota} Generate Soal</div>
                    </div>
                  </div>
                  {pkg.badge && (
                    <span className="text-xs font-bold text-white bg-gradient-to-r from-violet-500 to-indigo-500 px-3 py-1.5 rounded-full">
                      {pkg.badge}
                    </span>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-4 border-t border-violet-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Harga asli</span>
                    <span className="text-sm text-gray-400 line-through">{formatPrice(pkg.originalPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 flex items-center gap-1.5">
                      <Tag size={12} className="text-green-500" />
                      Diskon {pkg.discount}%
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      -{formatPrice(pkg.originalPrice - pkg.price)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-violet-100">
                    <span className="text-base font-bold text-gray-900">Total Bayar</span>
                    <span className="text-lg font-black text-violet-600">{formatPrice(pkg.price)}</span>
                  </div>
                </div>
              </div>

              {/* Mock mode info */}
              <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  <span className="font-semibold">Mode Demo:</span> Ini adalah simulasi pembayaran. Tidak ada uang yang dikenakan.
                </p>
              </div>

              {/* CTA */}
              <div className="flex gap-3">
                <button
                  id="payment-cancel-btn"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                >
                  Batal
                </button>
                <button
                  id="payment-confirm-btn"
                  onClick={handlePay}
                  className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-violet-200 active:scale-[0.98]"
                >
                  Bayar Sekarang
                </button>
              </div>
            </div>
          )}

          {/* === STEP: PROCESSING === */}
          {step === STEPS.PROCESSING && (
            <div className="flex flex-col items-center justify-center py-10 gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-violet-50 border border-violet-100 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-violet-300 animate-ping opacity-30" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-base font-bold text-gray-900">Memproses Pembayaran...</p>
                <p className="text-sm text-gray-500">Mohon tunggu sebentar</p>
              </div>
            </div>
          )}

          {/* === STEP: SUCCESS === */}
          {step === STEPS.SUCCESS && (
            <div className="flex flex-col items-center justify-center py-8 gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
                  <CheckCircle className="w-11 h-11 text-green-500" />
                </div>
                {/* Particle burst */}
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-violet-400 animate-particle"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${i * 60}deg) translate(30px) translateY(-50%)`,
                      animationDelay: `${i * 0.08}s`,
                    }}
                  />
                ))}
              </div>
              <div className="text-center space-y-1">
                <p className="text-xl font-bold text-gray-900">Pembayaran Berhasil!</p>
                <p className="text-sm text-green-600 font-semibold">+{pkg.coins} Koin telah ditambahkan</p>
                <p className="text-xs text-gray-400 mt-1">Koin Anda siap digunakan untuk generate soal</p>
              </div>
              <div className="w-full bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-green-600">{pkg.coins}</div>
                <div className="text-xs text-gray-500">Koin Ditambahkan</div>
              </div>
            </div>
          )}

          {/* === STEP: FAILED === */}
          {step === STEPS.FAILED && (
            <div className="space-y-5">
              <div className="flex flex-col items-center justify-center py-6 gap-4">
                <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center">
                  <XCircle className="w-11 h-11 text-red-500" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-base font-bold text-gray-900">Pembayaran Gagal</p>
                  <p className="text-sm text-gray-500">{errorMsg}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  id="payment-close-failed-btn"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                >
                  Tutup
                </button>
                <button
                  id="payment-retry-btn"
                  onClick={() => setStep(STEPS.CONFIRM)}
                  className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-violet-200"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes particle {
          0% { opacity: 1; transform: rotate(var(--r, 0deg)) translate(0px) scale(1); }
          100% { opacity: 0; transform: rotate(var(--r, 0deg)) translate(40px) scale(0); }
        }
        .animate-slide-up { animation: slide-up 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-particle { animation: particle 0.6s ease-out forwards; }
        @media (min-width: 640px) {
          .animate-slide-up { animation: none; opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
};

export default PaymentModal;
