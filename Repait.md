ROLE & OBJECTIVE:
Bertindaklah sebagai Fullstack/UI Engineer. Kita akan membuang modal konfirmasi pembelian yang lama dan menggantinya dengan alur checkout bergaya e-commerce profesional. Selain itu, buat halaman khusus untuk "Ambis Coin".

1. GLOBAL HEADER INTEGRATION:

Perbarui komponen Header utama (Top Bar). Ubah tombol/indikator koin yang sebelumnya memicu modal menjadi komponen <Link> (React Router) atau navigasi yang mengarah ke path /dashboard/ambis-coin.

2. CREATE NEW PAGE: /dashboard/ambis-coin (Pricing Page):

Buat halaman baru berdasarkan halaman yang sudah ada saat ini

Action: Setiap tombol "Beli" di kartu ini tidak lagi membuka modal, melainkan melakukan navigasi (push route) ke /dashboard/checkout?package=popular-pack (atau gunakan state management untuk melempar data paket).

3. CREATE NEW PAGE: /dashboard/checkout (Professional Checkout UI):

Buat halaman checkout khusus dengan layout Split Screen (2 Kolom) ala Shopify atau Stripe.

Kolom Kiri (Detail Pembayaran - 60% width):

Form informasi pembeli (Nama, Email - read only jika sudah login).

Opsi Metode Pembayaran (Mockup): Buat UI pilihan pembayaran yang bisa diklik (seperti kotak dengan logo QRIS, Bank Transfer/Virtual Account, E-Wallet seperti GoPay/OVO). Beri aksen border ungu #8338e9 pada metode yang dipilih.

Kolom Kanan (Order Summary / Ringkasan Pesanan - 40% width):

Desain kotak berlatar belakang abu-abu sangat muda (bg-slate-50) agar terpisah secara visual dari form kiri.

Tampilkan detail barang: Ikon paket, Nama Paket ("Popular Pack"), Jumlah Token ("55 Token").

Rincian harga: Subtotal (Rp 45.000), Biaya Layanan/Admin (Rp 2.000), dan Total Pembayaran (Rp 47.000) yang ditulis dengan font besar dan bold.

Tombol aksi utama: "Bayar Sekarang" yang lebar penuh (w-full) di bagian paling bawah order summary.

4. MOCK PAYMENT SUCCESS FLOW:

Saat tombol "Bayar Sekarang" diklik, ubah state tombol menjadi loading state (berputar) selama 1.5 detik, lalu arahkan user ke halaman /dashboard/payment-success (atau tampilkan animasi sukses penuh dengan efek confetti), lalu tambahkan koin tersebut ke database/state pengguna.