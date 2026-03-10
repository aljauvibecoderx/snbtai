# AMBIS COIN PAYMENT FLOW - INTEGRATION GUIDE

## ✅ FILES CREATED

1. `src/pages/payment-flow/AmbisCoinStore.js` - Halaman toko coin dengan paket-paket
2. `src/pages/payment-flow/AmbisCoinCheckout.js` - Halaman checkout dengan form pembayaran
3. `src/pages/payment-flow/AmbisCoinPayment.js` - Halaman instruksi pembayaran
4. `src/pages/payment-flow/AmbisCoinSuccess.js` - Halaman sukses setelah pembayaran
5. `src/pages/payment-flow/index.js` - Export file

## 🔧 INTEGRATION STEPS

### 1. Add Imports to App.js (Line 4, after LandingPage import)

```javascript
import { AmbisCoinStore, AmbisCoinCheckout, AmbisCoinPayment, AmbisCoinSuccess } from './pages/payment-flow';
```

### 2. Add Routes to App.js (Inside AppContent function, after existing routes)

Cari bagian `<Routes>` dan tambahkan routes ini:

```javascript
{/* Ambis Coin Payment Flow */}
{view === 'AMBIS_COIN_STORE' && (
  <AmbisCoinStore 
    user={user} 
    onLogin={handleLogin}
  />
)}
{view === 'AMBIS_COIN_CHECKOUT' && (
  <AmbisCoinCheckout 
    user={user}
  />
)}
{view === 'AMBIS_COIN_PAYMENT' && (
  <AmbisCoinPayment />
)}
{view === 'AMBIS_COIN_SUCCESS' && (
  <AmbisCoinSuccess 
    user={user}
  />
)}
```

### 3. Add Route Handling in useEffect (Line ~3600, inside handleRoute function)

```javascript
if (path === '/ambis-coin') {
  setView('AMBIS_COIN_STORE');
} else if (path === '/ambis-coin/checkout') {
  setView('AMBIS_COIN_CHECKOUT');
} else if (path === '/ambis-coin/payment') {
  setView('AMBIS_COIN_PAYMENT');
} else if (path === '/ambis-coin/success') {
  setView('AMBIS_COIN_SUCCESS');
}
```

### 4. Update CoinBalance Component onClick

Di `src/components/payment/CoinBalance.js`, pastikan onClick navigate ke `/ambis-coin`:

```javascript
onClick={() => navigate('/ambis-coin')}
```

## 🎨 FEATURES

### AmbisCoinStore
- 3 paket coin (Starter, Popular, Premium)
- Bonus coins untuk paket tertentu
- Trust badges (Secure, Instant, Guarantee)
- FAQ section
- Responsive design

### AmbisCoinCheckout
- User info display
- Payment method selection (Bank, E-Wallet, QRIS)
- Order summary sidebar
- Terms & conditions checkbox
- Admin fee calculation

### AmbisCoinPayment
- 24-hour countdown timer
- Payment instructions per method
- Copy-to-clipboard for account numbers
- QR Code for QRIS
- Step-by-step guide

### AmbisCoinSuccess
- Success animation
- Transaction details
- Download receipt button
- Quick actions (Dashboard, Create Questions)

## 🎯 USER FLOW

1. User clicks "Beli Coin" button → `/ambis-coin`
2. User selects package → `/ambis-coin/checkout`
3. User selects payment method → `/ambis-coin/payment`
4. User completes payment → `/ambis-coin/success`

## 🔗 NAVIGATION PATHS

- `/ambis-coin` - Store page
- `/ambis-coin/checkout` - Checkout page
- `/ambis-coin/payment` - Payment instructions
- `/ambis-coin/success` - Success page

## 📱 RESPONSIVE

All pages are fully responsive with:
- Mobile-first design
- Grid layouts that adapt
- Touch-friendly buttons
- Optimized for all screen sizes

## 🎨 DESIGN CONSISTENCY

- Background: `bg-[#F3F4F8]`
- Blur effects: `opacity-15`
- Primary color: Violet/Purple gradient
- Border radius: `rounded-2xl` / `rounded-3xl`
- Shadows: Subtle and elegant
