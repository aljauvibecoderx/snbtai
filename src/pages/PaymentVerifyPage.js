import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Wallet, Building2, ArrowLeft, Loader2 } from 'lucide-react';

const PaymentVerifyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPackage = location.state?.package;
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!selectedPackage) {
    navigate('/payment');
    return null;
  }

  const totalCoins = selectedPackage.coins + selectedPackage.bonus;

  const handlePayment = async () => {
    if (!paymentMethod) return;
    
    setIsProcessing(true);
    
    // Simulasi proses pembayaran
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    navigate('/payment/success', { 
      state: { 
        coins: totalCoins,
        amount: selectedPackage.price,
        method: paymentMethod 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft size={20} /> Kembali
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Verifikasi Pembayaran</h1>

          {/* Order Summary */}
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">Ringkasan Pesanan</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Paket Koin</span>
                <span className="font-semibold">{totalCoins} Koin</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Harga</span>
                <span className="font-semibold">Rp {selectedPackage.price.toLocaleString('id-ID')}</span>
              </div>
              {selectedPackage.bonus > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Bonus</span>
                  <span className="font-semibold">+{selectedPackage.bonus} Koin</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600">Rp {selectedPackage.price.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">Pilih Metode Pembayaran</h2>
            <div className="space-y-3">
              {[
                { id: 'gopay', name: 'GoPay', icon: Wallet },
                { id: 'ovo', name: 'OVO', icon: Wallet },
                { id: 'dana', name: 'DANA', icon: Wallet },
                { id: 'bca', name: 'Transfer BCA', icon: Building2 },
                { id: 'mandiri', name: 'Transfer Mandiri', icon: Building2 },
              ].map(method => (
                <div
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3 ${
                    paymentMethod === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <method.icon size={24} className="text-gray-600" />
                  <span className="font-medium">{method.name}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={!paymentMethod || isProcessing}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <CreditCard size={24} />
                Bayar Sekarang
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentVerifyPage;
