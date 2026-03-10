# Ambis Token Flow - Integration Guide

## 📁 Struktur File Baru

```
src/pages/token-flow/
├── AmbisTokenStore.js      # /ambis-token - Halaman toko
├── AmbisTokenCheckout.js   # /ambis-token/checkout - Halaman checkout
├── AmbisTokenPayment.js    # /ambis-token/payment - Halaman instruksi pembayaran
├── AmbisTokenSuccess.js    # /ambis-token/success - Halaman sukses
└── index.js                # Export semua komponen
```

## 🔄 User Flow

```
1. /ambis-token (Store)
   ↓ User pilih paket
2. /ambis-token/checkout (Checkout)
   ↓ User pilih metode pembayaran
3. /ambis-token/payment (Payment Instructions)
   ↓ User selesaikan pembayaran
4. /ambis-token/success (Success)
   ↓ Token ditambahkan ke akun
```

## 🔧 Integrasi ke App.js

### 1. Import Komponen (Line ~4)
```javascript
import { AmbisTokenStore, AmbisTokenCheckout, AmbisTokenPayment, AmbisTokenSuccess } from './pages/token-flow';
```

### 2. Tambah Route Handling (Di dalam handleRoute function)
```javascript
} else if (path === '/ambis-token') {
  setView('AMBIS_TOKEN_STORE');
} else if (path === '/ambis-token/checkout') {
  setView('AMBIS_TOKEN_CHECKOUT');
} else if (path === '/ambis-token/payment') {
  setView('AMBIS_TOKEN_PAYMENT');
} else if (path === '/ambis-token/success') {
  setView('AMBIS_TOKEN_SUCCESS');
```

### 3. Render Komponen (Di dalam return statement)
```javascript
{view === 'AMBIS_TOKEN_STORE' && (
  <AmbisTokenStore 
    user={user}
    onBack={() => setView('HOME')}
    navigate={navigate}
  />
)}
{view === 'AMBIS_TOKEN_CHECKOUT' && (
  <AmbisTokenCheckout 
    user={user}
    navigate={navigate}
    location={location}
  />
)}
{view === 'AMBIS_TOKEN_PAYMENT' && (
  <AmbisTokenPayment 
    navigate={navigate}
    location={location}
  />
)}
{view === 'AMBIS_TOKEN_SUCCESS' && (
  <AmbisTokenSuccess 
    user={user}
    navigate={navigate}
    location={location}
  />
)}
```

## 📊 Perbandingan: Modal vs Flow

### Modal (Sebelumnya)
- Semua proses dalam 1 file (AmbisToken.js)
- Menggunakan state untuk navigasi antar tahap
- Tidak ada URL yang berubah
- Sulit untuk bookmark atau share

### Flow (Sekarang)
- Setiap tahap adalah halaman terpisah
- URL berubah sesuai tahap: `/ambis-token` → `/ambis-token/checkout` → `/ambis-token/payment` → `/ambis-token/success`
- User bisa bookmark atau share link
- Lebih mudah untuk debugging dan maintenance
- Konsisten dengan struktur payment-flow yang sudah ada

## 🎯 Keuntungan Struktur Baru

1. **Separation of Concerns**: Setiap komponen fokus pada satu tahap
2. **URL-based Navigation**: Mudah untuk tracking dan analytics
3. **State Management**: Menggunakan React Router location.state untuk pass data antar halaman
4. **Consistency**: Mengikuti pola yang sama dengan payment-flow
5. **Scalability**: Mudah untuk menambah fitur baru di setiap tahap

## 🔗 Navigation Pattern

```javascript
// Dari Store ke Checkout
navigate('/ambis-token/checkout', { state: { package: pkg } })

// Dari Checkout ke Payment
navigate('/ambis-token/payment', { 
  state: { 
    package: pkg, 
    paymentMethod: selectedMethod,
    totalPrice,
    adminFee
  } 
})

// Dari Payment ke Success
navigate('/ambis-token/success', { state: { package: pkg } })

// Kembali ke Home
navigate('/app')
```

## 💾 Data Flow

```
AmbisTokenStore
  ↓ (package data via location.state)
AmbisTokenCheckout
  ↓ (package + paymentMethod + totalPrice via location.state)
AmbisTokenPayment
  ↓ (package via location.state)
AmbisTokenSuccess
  ↓ (addCoins called)
User balance updated
```

## ✅ Sistem & Logika yang Dipertahankan

- ✓ Token packages dari mockPaymentService
- ✓ CoinContext untuk manage balance
- ✓ formatPrice utility
- ✓ Payment method selection logic
- ✓ Admin fee calculation
- ✓ Countdown timer
- ✓ Copy to clipboard functionality
- ✓ Receipt download
- ✓ All UI/UX elements

## 🚀 Testing Checklist

- [ ] Navigate ke /ambis-token (Store page)
- [ ] Pilih paket → navigate ke /ambis-token/checkout
- [ ] Pilih metode pembayaran → navigate ke /ambis-token/payment
- [ ] Klik "Saya Sudah Melakukan Pembayaran" → navigate ke /ambis-token/success
- [ ] Verify token ditambahkan ke balance
- [ ] Test back button di setiap halaman
- [ ] Test copy to clipboard di payment page
- [ ] Test download receipt
- [ ] Test countdown timer
- [ ] Verify UI konsisten dengan design sebelumnya
