import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Coins, Download, ArrowLeft, Sparkles, Home } from 'lucide-react';

const CONFETTI_COLORS = ['#8338e9', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#ec4899'];

const PaymentSuccessPage = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pkg, totalCoins } = location.state || {};
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const t = setTimeout(() => setShowConfetti(false), 3500);
    return () => clearTimeout(t);
  }, []);

  if (!pkg) {
    return (
      <div className="min-h-screen bg-[#F3F4F8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Data transaksi tidak ditemukan.</p>
          <button
            onClick={() => navigate('/dashboard/ambis-coin')}
            className="px-6 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 text-sm font-semibold transition-all"
          >
            Kembali ke Toko
          </button>
        </div>
      </div>
    );
  }

  const coinsAdded = totalCoins ?? pkg.coins + pkg.bonus;
  const serviceFee = 2000;

  const handleDownloadReceipt = () => {
    const content = [
      'SNBT AI - BUKTI PEMBELIAN COIN',
      '================================',
      `Tanggal : ${new Date().toLocaleDateString('id-ID')}`,
      `Waktu   : ${new Date().toLocaleTimeString('id-ID')}`,
      '',
      'DETAIL TRANSAKSI',
      `Paket   : ${pkg.name}`,
      `Coin    : ${coinsAdded}`,
      `Harga   : Rp ${pkg.price.toLocaleString('id-ID')}`,
      `Admin   : Rp ${serviceFee.toLocaleString('id-ID')}`,
      `Total   : Rp ${(pkg.price + serviceFee).toLocaleString('id-ID')}`,
      '',
      'Status  : BERHASIL',
      '================================',
      'Terima kasih telah berbelanja!',
    ].join('\n');

    const a = document.createElement('a');
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
    a.download = `receipt_${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#F3F4F8] relative overflow-hidden">
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(-10px) rotate(0deg);   opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
        }
        @keyframes success-pop {
          0%   { transform: scale(0);    opacity: 0; }
          60%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1);    opacity: 1; }
        }
        @keyframes ping-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0;   }
        }
        .success-pop { animation: success-pop 0.65s cubic-bezier(0.175, 0.885, 0.32, 1.275) both; }
        .ping-ring   { animation: ping-ring 1.6s ease-out infinite; }
      `}</style>

      {/* Ambient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] bg-green-400/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[25%] h-[25%] bg-teal-400/15 rounded-full blur-[100px]" />
      </div>

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-sm"
              style={{
                left: `${(i * 3.7) % 100}%`,
                top: '-12px',
                width: `${6 + (i % 4) * 2}px`,
                height: `${6 + (i % 3) * 2}px`,
                background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                animation: `confetti-fall ${1.8 + (i % 5) * 0.4}s ease-out ${(i % 7) * 0.1}s forwards`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-20 max-w-lg mx-auto px-4 py-12">
        {/* Success icon */}
        <div className="text-center mb-10">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute w-32 h-32 rounded-full bg-green-200/50 ping-ring" />
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center success-pop">
              <CheckCircle className="w-14 h-14 text-green-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pembayaran Berhasil!</h1>
          <p className="text-gray-500">
            <span className="font-semibold text-green-600">+{coinsAdded} Coin</span> telah
            ditambahkan ke akunmu
          </p>
        </div>

        {/* Transaction card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="text-sm font-bold text-gray-700">Detail Transaksi</h2>
          </div>
          <div className="p-5 space-y-4">
            {/* Coins added */}
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
                <Coins className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Coin Ditambahkan</p>
                <p className="text-2xl font-bold text-green-600">+{coinsAdded}</p>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Paket', value: pkg.name },
                { label: 'Harga', value: `Rp ${pkg.price.toLocaleString('id-ID')}` },
                { label: 'Waktu', value: new Date().toLocaleTimeString('id-ID') },
                { label: 'Status', value: 'Berhasil', green: true },
              ].map(({ label, value, green }) => (
                <div key={label} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-[11px] text-gray-400 mb-0.5">{label}</p>
                  <p className={`text-sm font-bold ${green ? 'text-green-600' : 'text-gray-800'}`}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {pkg.bonus > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <p className="text-sm text-amber-800 font-medium">
                  🎁 +{pkg.bonus} Bonus Coin sudah termasuk!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={handleDownloadReceipt}
            className="w-full py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <Download size={16} />
            Download Bukti Pembayaran
          </button>
          <button
            onClick={() => navigate('/app')}
            className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-violet-100 transition-all flex items-center justify-center gap-2"
          >
            <Home size={16} />
            Kembali ke Dashboard
          </button>
          <button
            onClick={() => navigate('/dashboard/ambis-coin')}
            className="w-full py-3 text-violet-600 font-semibold text-sm hover:text-violet-700 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Beli Coin Lagi
          </button>
        </div>

        {/* Tips */}
        <div className="mt-8 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800 mb-3">💡 Tips Menggunakan Coin</h3>
          <ul className="space-y-1.5 text-xs text-gray-500">
            <li>✓ Setiap coin = 1 soal tambahan yang bisa di-generate</li>
            <li>✓ Coin tidak memiliki batas waktu penggunaan</li>
            <li>✓ Coin dapat digunakan kapan saja sesuai kebutuhan</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
