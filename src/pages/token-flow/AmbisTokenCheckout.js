import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, Wallet, QrCode, Building2, Loader, AlertCircle } from 'lucide-react';

const PAYMENT_METHODS = [
  { id: 'bank', name: 'Transfer Bank', icon: Building2, fee: 0 },
  { id: 'ewallet', name: 'E-Wallet', icon: Wallet, fee: 1000 },
  { id: 'qris', name: 'QRIS', icon: QrCode, fee: 500 }
];

export const AmbisTokenCheckout = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pkg = location.state?.package;

  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    if (!pkg || !user) {
      navigate('/ambis-token');
    }
  }, [pkg, user, navigate]);

  if (!pkg) return null;

  const selectedMethod = PAYMENT_METHODS.find(m => m.id === paymentMethod);
  const totalPrice = pkg.price + (selectedMethod?.fee || 0);

  const handleCheckout = async () => {
    if (!agreedToTerms) {
      alert('Harap setujui syarat dan ketentuan');
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      const orderId = 'TKN' + Date.now();
      navigate('/ambis-token/payment', { 
        state: { 
          package: pkg, 
          paymentMethod: selectedMethod,
          totalPrice,
          orderId 
        } 
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F8] relative overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-15">
        <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] bg-violet-500 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[25%] h-[25%] bg-amber-500 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/ambis-token')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Kembali</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi Pembeli</h3>
              <div className="flex items-center gap-4">
                <img src={user?.photoURL} alt={user?.displayName} className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-semibold text-gray-900">{user?.displayName}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Metode Pembayaran</h3>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  return (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? 'border-violet-500 bg-violet-50'
                          : 'border-gray-200 hover:border-violet-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-5 h-5 accent-violet-600"
                        />
                        <Icon className="w-6 h-6 text-gray-600" />
                        <span className="font-medium text-gray-900">{method.name}</span>
                      </div>
                      {method.fee > 0 && (
                        <span className="text-sm text-gray-600">+Rp {method.fee.toLocaleString('id-ID')}</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-5 h-5 accent-violet-600 mt-0.5"
                />
                <span className="text-sm text-gray-600">
                  Saya setuju dengan{' '}
                  <a href="/terms" className="text-violet-600 hover:underline">
                    Syarat dan Ketentuan
                  </a>{' '}
                  serta{' '}
                  <a href="/privacy" className="text-violet-600 hover:underline">
                    Kebijakan Privasi
                  </a>
                </span>
              </label>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Pesanan</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Paket</span>
                  <span className="font-semibold text-gray-900">{pkg.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Jumlah Token</span>
                  <span className="font-semibold text-gray-900">{pkg.coins + pkg.bonus} Token</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Harga Paket</span>
                  <span className="font-semibold text-gray-900">Rp {pkg.price.toLocaleString('id-ID')}</span>
                </div>
                {selectedMethod?.fee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Biaya Admin</span>
                    <span className="font-semibold text-gray-900">Rp {selectedMethod.fee.toLocaleString('id-ID')}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-violet-600">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing || !agreedToTerms}
                className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Bayar Sekarang
                  </>
                )}
              </button>

              <div className="mt-4 flex items-start gap-2 text-xs text-gray-500">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Pembayaran aman dan terenkripsi. Token akan otomatis masuk setelah pembayaran berhasil.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
