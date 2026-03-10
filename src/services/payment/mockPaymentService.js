// ============================================================
// mockPaymentService.js — Mock Payment Service
// TODO: Mayar Integration — swap this file with Mayar SDK later
// ============================================================

/**
 * Paket token yang tersedia
 * TODO: Mayar Integration — fetch ini dari Mayar product catalog API
 */
export const TOKEN_PACKAGES = [
  {
    id: 'token_starter',
    name: 'Token Starter',
    tokens: 5,
    price: 25000,
    originalPrice: 35000,
    discount: 29,
    badge: null,
    highlight: false,
    description: 'Paket token dasar untuk memulai.',
  },
  {
    id: 'token_popular',
    name: 'Token Popular',
    tokens: 30,
    price: 120000,
    originalPrice: 150000,
    discount: 20,
    badge: 'Paling Laris',
    highlight: true,
    description: 'Paket token terpopuler dengan nilai terbaik.',
  },
  {
    id: 'token_premium',
    name: 'Token Premium',
    tokens: 75,
    price: 250000,
    originalPrice: 350000,
    discount: 29,
    badge: 'Best Value',
    highlight: false,
    description: 'Paket token premium untuk pengguna setia.',
  },
];

/**
 * Paket koin yang tersedia
 * TODO: Mayar Integration — fetch ini dari Mayar product catalog API
 */
export const COIN_PACKAGES = [
  {
    id: 'starter',
    name: 'Starter Pack',
    coins: 10,
    price: 10000,
    originalPrice: 15000,
    discount: 33,
    generateQuota: 10,
    badge: null,
    highlight: false,
    description: 'Cocok untuk percobaan awal.',
  },
  {
    id: 'popular',
    name: 'Popular Pack',
    coins: 55,
    price: 45000,
    originalPrice: 60000,
    discount: 25,
    generateQuota: 55,
    badge: 'Paling Laris',
    highlight: true,
    description: 'Pilihan terbaik untuk belajar rutin.',
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    coins: 115,
    price: 80000,
    originalPrice: 120000,
    discount: 33,
    generateQuota: 115,
    badge: 'Best Value',
    highlight: false,
    description: 'Nilai terbaik untuk pejuang SNBT serius.',
  },
];

/**
 * Format harga ke format Rupiah Indonesia
 */
export const formatPrice = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Ambil data paket berdasarkan ID
 */
export const getPackageById = (packageId) => {
  return COIN_PACKAGES.find(p => p.id === packageId) ?? null;
};

/**
 * Simulasi proses pembayaran — MOCK MODE
 * TODO: Mayar Integration — ganti fungsi ini dengan Mayar payment API call
 *
 * @param {string} packageId — ID paket yang dibeli
 * @param {object} user — Data user yang melakukan pembelian
 * @returns {Promise<{success: boolean, transactionId: string, coins: number, packageName: string, price: number, error?: string}>}
 */
export const processMockPayment = async (packageId, user = null) => {
  const pkg = getPackageById(packageId);
  if (!pkg) {
    return { success: false, error: 'Paket tidak ditemukan.' };
  }

  // TODO: Mayar Integration — Inisialisasi Mayar payment di sini
  // const mayar = new MayarSDK({ apiKey: process.env.REACT_APP_MAYAR_API_KEY });
  // const response = await mayar.createTransaction({ productId: pkg.mayarProductId, ... });

  // Simulasi delay jaringan (1.5 - 2.5 detik)
  const delay = 1500 + Math.random() * 1000;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Simulasi success rate 100% untuk testing
  const isSuccess = true;

  if (!isSuccess) {
    return {
      success: false,
      error: 'Pembayaran gagal diproses. Silakan coba lagi.',
    };
  }

  const transaction = {
    id: `mock_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    packageId: pkg.id,
    packageName: pkg.name,
    coins: pkg.coins,
    price: pkg.price,
    userId: user?.uid ?? 'guest',
    userName: user?.displayName ?? 'Guest',
    timestamp: new Date().toISOString(),
    status: 'success',
    method: 'MOCK_PAYMENT', // TODO: Mayar Integration — ganti dengan metode Mayar
  };

  return {
    success: true,
    transactionId: transaction.id,
    coins: pkg.coins,
    packageName: pkg.name,
    price: pkg.price,
    transaction,
  };
};
