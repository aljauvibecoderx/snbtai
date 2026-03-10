import React, { useEffect } from 'react';
import { CheckCircle, ArrowLeft, Coins, Download } from 'lucide-react';
import { formatPrice } from '../../services/payment/mockPaymentService';
  

export const AmbisTokenSuccess = ({ navigate, location, user }) => {
  const { package: pkg } = location?.state || {};
  const addCoins = () => {}; // Removed CoinContext

  useEffect(() => {
    // Add coins to user balance
    if (pkg && user) {
      addCoins(pkg.coins + pkg.bonus, {
        id: `token_${Date.now()}`,
        packageId: pkg.id,
        packageName: pkg.name,
        coins: pkg.coins + pkg.bonus,
        price: pkg.price,
        userId: user.uid,
        userName: user.displayName || 'User',
        timestamp: new Date().toISOString(),
        status: 'success',
        method: 'MOCK_PAYMENT'
      });
    }
  }, [pkg, user, addCoins]);

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Data transaksi tidak ditemukan</p>
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

  const handleDownloadReceipt = () => {
    const receiptContent = `
SNBT AI - BUKTI PEMBELIAN TOKEN
================================
Tanggal: ${new Date().toLocaleDateString('id-ID')}
Waktu: ${new Date().toLocaleTimeString('id-ID')}

DETAIL TRANSAKSI
Paket: ${pkg.name}
Token: ${pkg.coins + pkg.bonus}
Harga: ${formatPrice(pkg.price)}

Status: BERHASIL
================================
Terima kasih telah berbelanja!
    `;
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(receiptContent));
    element.setAttribute('download', `receipt_${Date.now()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F8] relative overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-15">
        <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] bg-green-500 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[25%] h-[25%] bg-teal-500 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Success Animation */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-16 h-16 text-green-600 animate-bounce" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping opacity-30"></div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">Pembayaran Berhasil!</h1>
          <p className="text-lg text-gray-600">Token telah ditambahkan ke akun Anda</p>
        </div>

        {/* Transaction Details */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Detail Transaksi</h2>

          <div className="space-y-6">
            {/* Token Added */}
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Coins className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Token Ditambahkan</p>
                <p className="text-3xl font-bold text-green-600">+{pkg.coins + pkg.bonus}</p>
              </div>
            </div>

            {/* Package Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Paket</p>
                <p className="font-bold text-gray-900">{pkg.name}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Harga</p>
                <p className="font-bold text-gray-900">{formatPrice(pkg.price)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Waktu</p>
                <p className="font-bold text-gray-900">{new Date().toLocaleTimeString('id-ID')}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className="font-bold text-green-600">Berhasil</p>
              </div>
            </div>

            {/* Bonus Info */}
            {pkg.bonus > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm font-semibold text-amber-900 mb-1">🎁 Bonus Token</p>
                <p className="text-lg font-bold text-amber-600">+{pkg.bonus} Token Gratis!</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-800">
            ✓ Token Anda siap digunakan untuk generate soal tambahan. Tidak ada batasan waktu penggunaan.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleDownloadReceipt}
            className="w-full py-3 border-2 border-gray-300 text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Download Bukti Pembayaran
          </button>

          <button
            onClick={() => navigate('/app')}
            className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Kembali ke Dashboard
          </button>

          <button
            onClick={() => navigate('/ambis-token')}
            className="w-full py-3 text-violet-600 font-semibold hover:text-violet-700 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Beli Token Lagi
          </button>
        </div>

        {/* Tips */}
        <div className="mt-12 p-6 bg-white rounded-2xl border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4">💡 Tips Menggunakan Token</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✓ Setiap token = 1 soal tambahan yang bisa di-generate</li>
            <li>✓ Token tidak memiliki batas waktu penggunaan</li>
            <li>✓ Token dapat digunakan kapan saja sesuai kebutuhan</li>
            <li>✓ Sisa token akan terus tersimpan di akun Anda</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
