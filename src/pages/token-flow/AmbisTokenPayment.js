import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Copy, Check, Clock, AlertCircle, ArrowRight } from 'lucide-react';

export const AmbisTokenPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { package: pkg, paymentMethod, totalPrice, orderId } = location.state || {};

  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);

  useEffect(() => {
    if (!pkg || !orderId) {
      navigate('/ambis-token');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [pkg, orderId, navigate]);

  if (!pkg) return null;

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPaymentInstructions = () => {
    switch (paymentMethod?.id) {
      case 'bank':
        return {
          title: 'Transfer Bank',
          account: '1234567890',
          accountName: 'PT SNBT AI Indonesia',
          bank: 'Bank BCA',
          steps: [
            'Buka aplikasi mobile banking atau ATM',
            'Pilih menu Transfer',
            'Masukkan nomor rekening tujuan',
            'Masukkan nominal transfer sesuai total pembayaran',
            'Konfirmasi dan selesaikan transaksi',
            'Simpan bukti transfer'
          ]
        };
      case 'ewallet':
        return {
          title: 'E-Wallet (GoPay/OVO/DANA)',
          phone: '081234567890',
          name: 'SNBT AI',
          steps: [
            'Buka aplikasi e-wallet Anda',
            'Pilih menu Transfer atau Kirim Uang',
            'Masukkan nomor tujuan',
            'Masukkan nominal sesuai total pembayaran',
            'Konfirmasi dan selesaikan transaksi',
            'Screenshot bukti pembayaran'
          ]
        };
      case 'qris':
        return {
          title: 'QRIS',
          qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + orderId,
          steps: [
            'Buka aplikasi e-wallet atau mobile banking',
            'Pilih menu Scan QR',
            'Scan QR Code di atas',
            'Periksa nominal pembayaran',
            'Konfirmasi dan selesaikan transaksi',
            'Screenshot bukti pembayaran'
          ]
        };
      default:
        return null;
    }
  };

  const instructions = getPaymentInstructions();

  return (
    <div className="min-h-screen bg-[#F3F4F8] relative overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-15">
        <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] bg-violet-500 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[25%] h-[25%] bg-amber-500 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-900">Selesaikan Pembayaran Dalam</p>
              <p className="text-2xl font-bold text-amber-600">{formatTime(timeLeft)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-amber-700">Order ID</p>
            <p className="font-mono font-bold text-amber-900">{orderId}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{instructions?.title}</h2>

              {paymentMethod?.id === 'bank' && (
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Bank</p>
                    <p className="text-lg font-bold text-gray-900">{instructions.bank}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Nomor Rekening</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-mono font-bold text-gray-900">{instructions.account}</p>
                      <button
                        onClick={() => handleCopy(instructions.account)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-600" />}
                      </button>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Atas Nama</p>
                    <p className="text-lg font-bold text-gray-900">{instructions.accountName}</p>
                  </div>
                </div>
              )}

              {paymentMethod?.id === 'ewallet' && (
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Nomor Tujuan</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-mono font-bold text-gray-900">{instructions.phone}</p>
                      <button
                        onClick={() => handleCopy(instructions.phone)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-600" />}
                      </button>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Atas Nama</p>
                    <p className="text-lg font-bold text-gray-900">{instructions.name}</p>
                  </div>
                </div>
              )}

              {paymentMethod?.id === 'qris' && (
                <div className="flex justify-center mb-6">
                  <div className="p-6 bg-white border-2 border-gray-200 rounded-2xl">
                    <img src={instructions.qrCode} alt="QR Code" className="w-64 h-64" />
                  </div>
                </div>
              )}

              <div className="p-4 bg-violet-50 border border-violet-200 rounded-xl mb-6">
                <p className="text-sm text-violet-700 mb-1">Total Pembayaran</p>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold text-violet-600">Rp {totalPrice?.toLocaleString('id-ID')}</p>
                  <button
                    onClick={() => handleCopy(totalPrice?.toString())}
                    className="p-2 hover:bg-violet-100 rounded-lg transition-colors"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-violet-600" />}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-4">Cara Pembayaran</h3>
                <ol className="space-y-3">
                  {instructions?.steps.map((step, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-100 text-violet-600 text-sm font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-rose-800">
                <p className="font-semibold mb-1">Penting!</p>
                <p>Transfer sesuai nominal yang tertera. Jika berbeda, pembayaran tidak akan terverifikasi otomatis.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-6">
              <h3 className="font-bold text-gray-900 mb-4">Detail Pesanan</h3>
              
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Paket</span>
                  <span className="font-semibold text-gray-900">{pkg.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jumlah Token</span>
                  <span className="font-semibold text-gray-900">{pkg.coins + pkg.bonus} Token</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Metode</span>
                  <span className="font-semibold text-gray-900">{paymentMethod?.name}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/ambis-token/success', { state: { orderId, package: pkg } })}
                className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Sudah Bayar
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Klik tombol di atas setelah menyelesaikan pembayaran
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
