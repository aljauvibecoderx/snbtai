# AMBIS COIN PAYMENT FLOW - INTEGRATION GUIDE

## ✅ FILES CREATED

1. `src/pages/payment-flow/AmbisCoinStore.js` - Halaman toko coin
2. `src/pages/payment-flow/AmbisCoinCheckout.js` - Halaman checkout
3. `src/pages/payment-flow/AmbisCoinPayment.js` - Halaman pembayaran
4. `src/pages/payment-flow/AmbisCoinSuccess.js` - Halaman sukses

## 🔧 MANUAL INTEGRATION

### Step 1: Add Import (Line 4 di App.js)
```javascript
import { AmbisCoinStore, AmbisCoinCheckout, AmbisCoinPayment, AmbisCoinSuccess } from './pages/payment-flow';
```

### Step 2: Add Routes (Di dalam Routes section)
```javascript
{view === 'AMBIS_COIN_STORE' && <AmbisCoinStore user={user} onLogin={handleLogin} />}
{view === 'AMBIS_COIN_CHECKOUT' && <AmbisCoinCheckout user={user} />}
{view === 'AMBIS_COIN_PAYMENT' && <AmbisCoinPayment />}
{view === 'AMBIS_COIN_SUCCESS' && <AmbisCoinSuccess user={user} />}
```

### Step 3: Add Path Handling (Di handleRoute function)
```javascript
if (path === '/ambis-coin') setView('AMBIS_COIN_STORE');
else if (path === '/ambis-coin/checkout') setView('AMBIS_COIN_CHECKOUT');
else if (path === '/ambis-coin/payment') setView('AMBIS_COIN_PAYMENT');
else if (path === '/ambis-coin/success') setView('AMBIS_COIN_SUCCESS');
```

## 🎯 USER FLOW
1. Click "Beli Coin" → Store
2. Select Package → Checkout
3. Choose Payment → Payment Instructions
4. Complete Payment → Success Page
