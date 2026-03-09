// ============================================================
// AmbisToken.js — Halaman Utama Ambis Coin
// Route: /ambis-token
// ============================================================

import React, { useState } from 'react';
import { Coins, Sparkles, ChevronRight, Clock, List, ArrowLeft } from 'lucide-react';
import { COIN_PACKAGES, formatPrice } from '../services/payment/mockPaymentService';
import { PackageCard } from '../components/payment/PackageCard';
import { PaymentModal } from '../components/payment/PaymentModal';
import { useCoin } from '../context/CoinContext';

const TABS = {
  PACKAGES: 'packages',
  HISTORY: 'history',
};

/**
 * @param {object} user — Firebase user object
 * @param {function} onBack — Callback untuk kembali ke halaman sebelumnya
 */
const AmbisToken = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState(TABS.PACKAGES);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [lastSuccess, setLastSuccess] = useState(null);

  const { balance, totalEarned, transactions } = useCoin();

  const handleSelectPackage = (pkg) => {
    setSelectedPkg(pkg);
    setShowModal(true);
  };

  const handlePaymentSuccess = (result) => {
    setLastSuccess(result);
    setShowModal(false);
    setSelectedPkg(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPkg(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/20">

      {/* ─── HERO SECTION ─── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-700 pt-20 pb-28">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />

        <div className="relative max-w-5xl mx-auto px-6">
          {/* Back button */}
          {onBack && (
            <button
              id="ambis-token-back-btn"
              onClick={onBack}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6 text-sm font-medium"
            >
              <ArrowLeft size={16} />
              Kembali
            </button>
          )}

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Ambis Token</h1>
              <p className="text-white/70 text-sm font-medium">Tingkatkan limit generate soalmu!</p>
            </div>
          </div>

          {/* Balance Card */}
          <div className="mt-6 flex items-center gap-6 bg-white/10 border border-white/20 rounded-2xl px-6 py-5 backdrop-blur-sm max-w-sm">
            <div className="text-center">
              <div className="text-3xl font-black text-white tabular-nums">{balance}</div>
              <div className="text-white/70 text-xs font-medium mt-0.5">Koin Tersisa</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-black text-white tabular-nums">{totalEarned}</div>
              <div className="text-white/70 text-xs font-medium mt-0.5">Total Dibeli</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="max-w-5xl mx-auto px-6 -mt-16 pb-28 sm:pb-12">
        {/* Success toast (inline banner) */}
        {lastSuccess && (
          <div
            className="mb-5 flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-4 shadow-sm cursor-pointer"
            onClick={() => setLastSuccess(null)}
          >
            <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-green-800">+{lastSuccess.coins} Koin Berhasil Ditambahkan!</div>
              <div className="text-xs text-green-600">Paket {lastSuccess.packageName} · {formatPrice(lastSuccess.price)}</div>
            </div>
            <ChevronRight size={16} className="text-green-400" />
          </div>
        )}

        {/* Tabs */}
        <div className="flex bg-white border border-gray-200 rounded-2xl p-1 mb-6 shadow-sm">
          <button
            id="tab-packages-btn"
            onClick={() => setActiveTab(TABS.PACKAGES)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === TABS.PACKAGES
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Coins size={15} />
            Paket Koin
          </button>
          <button
            id="tab-history-btn"
            onClick={() => setActiveTab(TABS.HISTORY)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === TABS.HISTORY
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <List size={15} />
            Riwayat
          </button>
        </div>

        {/* ─── TAB: PACKAGES ─── */}
        {activeTab === TABS.PACKAGES && (
          <div>
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-900">Pilih Paket</h2>
              <p className="text-sm text-gray-500">Setiap koin = 1x generate soal AI</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {COIN_PACKAGES.map(pkg => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  onSelect={handleSelectPackage}
                />
              ))}
            </div>

            {/* Info note */}
            <div className="mt-6 flex items-start gap-2.5 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
              <Sparkles className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-indigo-700 leading-relaxed">
                Koin yang dibeli tidak memiliki masa kadaluarsa dan akan tersimpan di akun Anda selamanya.
                Integrasi pembayaran nyata (Mayar) akan segera hadir!
              </p>
            </div>
          </div>
        )}

        {/* ─── TAB: HISTORY ─── */}
        {activeTab === TABS.HISTORY && (
          <div>
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-900">Riwayat Transaksi</h2>
              <p className="text-sm text-gray-500">{transactions.length} transaksi tercatat</p>
            </div>

            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-gray-300" />
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold text-gray-700">Belum ada transaksi</p>
                  <p className="text-sm text-gray-400 mt-1">Beli koin pertama Anda untuk mulai!</p>
                </div>
                <button
                  id="goto-packages-btn"
                  onClick={() => setActiveTab(TABS.PACKAGES)}
                  className="px-6 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 transition-all"
                >
                  Beli Koin
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0">
                      <Coins className="w-5 h-5 text-violet-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-900">Paket {tx.packageName}</div>
                      <div className="text-xs text-gray-400 truncate">
                        {new Date(tx.timestamp).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-green-600">+{tx.coins} Koin</div>
                      <div className="text-xs text-gray-400">{formatPrice(tx.price)}</div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" title="Berhasil" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── STICKY BOTTOM CTA (Mobile only) ─── */}
      {activeTab === TABS.PACKAGES && (
        <div className="fixed sm:hidden bottom-0 left-0 right-0 z-40 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          <button
            id="sticky-buy-coin-btn"
            onClick={() => document.getElementById('package-card-pro')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-base shadow-lg shadow-violet-200 hover:opacity-90 transition-all active:scale-[0.98]"
          >
            Beli Koin Sekarang
          </button>
        </div>
      )}

      {/* ─── PAYMENT MODAL ─── */}
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

export default AmbisToken;
