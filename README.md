# Backend E-commerce Modern - BelanjaKu API

Selamat datang di repositori backend untuk proyek E-commerce BelanjaKu. Proyek ini dibangun dengan standar industri menggunakan TypeScript, Express.js, dan PostgreSQL, dengan fokus pada arsitektur yang bersih, keamanan, dan pengujian yang menyeluruh.

## 🏆 Status Proyek: SIAP PRODUKSI (v1.0.0)

**Terakhir Diperbarui:** 25 November 2025
**Status Tes:** ✅ 110/110 Tests Passed (100%)

Backend ini telah melalui fase pengembangan dan pengujian yang intensif. Seluruh fitur inti telah diimplementasikan, di-refactor untuk kinerja dan keamanan, dan dilindungi oleh suite pengujian otomatis yang komprehensif.

### ✨ Fitur Utama yang Telah Selesai

**1. 🔐 Autentikasi & Keamanan Tingkat Lanjut**

- Registrasi & Login dengan JWT (Access & Refresh Tokens).

- **Rate Limiting:** Perlindungan terhadap serangan brute-force pada endpoint auth.

- **Password Security:** Hashing otomatis dengan bcrypt dan pencegahan kebocoran hash password via hook `toJSON`.

- **Role-Based Access Control (RBAC):** Middleware otorisasi untuk User, Seller, dan Admin.

**2. 📦 Manajemen Produk & Inventaris**

- CRUD Produk lengkap dengan dukungan unggah gambar (Multer).

- Manajemen Kategori Produk.

- **Soft Deletes:** Produk yang dihapus diarsipkan (bukan dihapus permanen) untuk keamanan data.

- **Paginasi Canggih:** Endpoint `GET` mendukung filtering, sorting, dan paginasi metadata (`totalItems`, `totalPages`).

**3. 🛒 Pesanan & Transaksi**

- Alur Checkout lengkap dengan validasi stok atomik (menggunakan transaksi database).

- **Sistem Diskon:** Dukungan kode promosi yang memotong harga secara otomatis.

- **Simulasi Pembayaran:** Integrasi mock payment gateway dengan penanganan webhook untuk update status otomatis.

**4. 🏪 Fitur Penjual (Seller)**

Dasbor Penjual: Statistik pendapatan dan penjualan real-time.

Notifikasi Stok Menipis (Low Stock Alerts).

Manajemen Pesanan Masuk: Update status pesanan (Processing -> Shipped).

**5 . ⭐ Ulasan & Review**

Logika bisnis ketat: Hanya pengguna yang sudah membeli produk yang bisa memberikan ulasan.

Pencegahan spam ulasan (satu ulasan per produk per user).

### 🛠️ Teknologi & Struktur Kode

- **Bahasa:** TypeScript (Strict Mode).

- **Framework:** Express.js.

- **ORM:** Sequelize (PostgreSQL).

- **Testing:** Jest & Supertest (Unit & Integration Tests).

- **Logging:** Winston Logger.

- **Validation:** Express-validator.

### 🚀 Panduan Instalasi & Menjalankan

**1. Clone Repositori:**

```bash
git clone -b backend-testing https://github.com/awanmh/BelanjaKu.git
cd <nama-file -> backend>
```

**2. Instal Dependensi:**

```bash
npm install
```

**3. Konfigurasi Environment:**
Salin `.env.example` ke `.env` dan sesuaikan kredensial database Anda.

**4. Setup Database:**
Pastikan PostgreSQL berjalan dan buat dua database: `ecommerce_db` dan `ecommerce_db_test`.

```bash
npm run db:migrate  # Jalankan migrasi
npm run db:seed:all # (Opsional) Isi data dummy
```

**5. Menjalankan Server:**

```bash
npm run dev
```

**6 .Menjalankan Pengujian (PENTING):** Untuk memverifikasi integritas sistem:

```bash
npm test
```

### 🔮 Roadmap Pengembangan Selanjutnya (v1.1.0)

Untuk pengembang yang akan melanjutkan proyek ini, berikut adalah rekomendasi fitur berikutnya:

1. **Integrasi Payment Gateway Nyata:** Ganti simulasi `PaymentService` dengan SDK resmi Midtrans atau Xendit.

2. **Fitur Pencarian Canggih:** Implementasikan pencarian teks penuh (full-text search) atau integrasi dengan Elasticsearch untuk pencarian produk.

3. **Notifikasi Email:** Integrasikan Nodemailer untuk mengirim email konfirmasi pesanan dan reset password.

4. **Deployment:** Siapkan `Dockerfile` dan konfigurasi CI/CD untuk deployment otomatis ke cloud (AWS/GCP/Render).

*Dokumentasi dibuat otomatis oleh Tim Pengembang BelanjaKu.*
