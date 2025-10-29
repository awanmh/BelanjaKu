## **Backend E-commerce Modern - BelanjaKu**

Selamat datang di repositori backend untuk proyek E-commerce BelanjaKu. Proyek ini dibangun dengan TypeScript, Express.js, dan Sequelize (PostgreSQL) menggunakan prinsip-prinsip Clean Architecture untuk memastikan kode yang dihasilkan modular, dapat diskalakan, dan mudah dikelola.

### 🚀 Status Proyek: Siap Rilis (Kandidat)

**Status: Semua Fitur Inti (v1) Selesai & Terverifikasi Penuh.**

Kita telah mencapai tonggak pencapaian besar: 100% tes berhasil (117/117 passed) di 18 test suites. Ini mengonfirmasi bahwa seluruh arsitektur backend, dari controller hingga service dan model, berfungsi sesuai harapan.

**Pencapaian Utama yang Telah Selesai & Diverifikasi:**

**1. ✅ [Selesai] Modul Fungsional Lengkap:**

- **Autentikasi & Keamanan**: Sistem registrasi dan login berbasis JWT dengan rate limiting untuk mencegah serangan *brute-force*.

- **Manajemen Produk & Penjual**: Penjual dapat melakukan operasi CRUD pada produk mereka, termasuk unggah gambar melalui `multer`.

- **Manajemen Pesanan & Diskon**: Pengguna dapat membuat pesanan (checkout) dan berhasil menerapkan kode promosi.

- **Dasbor Penjual**: Endpoint untuk manajemen profil toko, statistik penjualan, dan notifikasi stok menipis telah dibuat dan diuji.

- **Manajemen Admin**: Admin memiliki akses penuh untuk mengelola pengguna, kategori, dan opsi pengiriman.

- **Sistem Ulasan**: Pengguna dapat memberikan ulasan hanya untuk produk yang telah mereka beli.

**2. ✅ [Selesai] Infrastruktur Pengujian yang Solid:**

- **Unit Testing (Layanan)**: Semua service inti (`AuthService`, `ProductService`, `UserService`, `CategoryService`, `ReviewService`, `SellerService`, `ShippingService`, `PaymentService`, `PromotionService`, `OrderService`) memiliki cakupan tes yang sangat tinggi (sebagian besar 95-100%).

- **Integration Testing (API):** Alur API end-to-end yang paling kritis telah diverifikasi menggunakan `Supertest`, termasuk:

  - Registrasi, Login, dan Rate Limiting.

  - Pembuatan Produk (dengan unggah file) dan otorisasi Penjual.

  - Alur Pesanan (Checkout dengan dan tanpa diskon).

  - Alur Ulasan (Hanya pembeli yang bisa memberi ulasan).

  - Rute Admin (Manajemen Pengguna & Kategori).

  - Rute Penjual (Dasbor & Manajemen Profil).

**3. ✅ [Selesai] Peningkatan Kualitas Kode:**

- **Refactoring:** Menghapus logika `if (!req.user)` yang berlebihan dari controller yang dilindungi.

- **Otomatisasi Keamanan:** Menerapkan hook `.toJSON` pada model `User` untuk secara otomatis menghapus hash password dari semua respons API.

- **Fitur Lanjutan:** Implementasi Soft Deletes (`paranoid: true`) pada model `User` dan `Product`, lengkap dengan API untuk melihat dan memulihkan data yang diarsipkan.

- **Paginasi Lanjutan:** Menerapkan `APIFeatures` dan respons paginasi (`{ rows, pagination }`) pada endpoint `GET` utama.

**Backend ini sekarang berada dalam kondisi yang sangat stabil, aman, dan terverifikasi.**

**🛠️ Rencana Kerja & To-Do untuk Kolaborasi Malam Ini**

Fokus kita sekarang beralih dari implementasi fitur baru ke **penyempurnaan akhir** dan **peningkatan cakupan tes integrasi** untuk controller yang belum sepenuhnya teruji.

**Prioritas #1: Selesaikan Cakupan Tes Integrasi (Controller)**

Tujuan: Memastikan setiap method di dalam controller telah teruji melalui alur API, terutama untuk kasus error dan otorisasi.

- **[ ] Tes Integrasi `ProductController` (Admin/Seller):**

  - Tulis tes untuk `GET /products/:id` (publik).

  - Tulis tes untuk `PUT /products/:id` (kasus gagal: non-penjual mencoba mengedit).

  - Tulis tes untuk `DELETE /products/:id` (admin/penjual berhasil soft delete).

- **[ ] Tes Integrasi `OrderController` (Buyer & Seller):**

  - Tulis tes untuk `GET /orders/my-orders` (sebagai pembeli).

  - Tulis tes untuk `GET /orders/seller` (sebagai penjual).

  - Tulis tes untuk `PUT /orders/seller/:id` (sebagai penjual, mengubah status `processing` -> `shipped`).

  - Tulis tes untuk `GET /orders/:id` (kasus sukses sebagai pembeli, kasus gagal sebagai pembeli lain).

- **[ ] Tes Integrasi `ShippingController` (Admin):**

  - Tulis tes untuk `GET /shipping/:id`.

  - Tulis tes untuk `PUT /shipping/:id`.

  - Tulis tes untuk `DELETE /shipping/:id` (kasus gagal: pengguna biasa).

- **[ ] Tes Integrasi `PromotionController` (Seller/Admin):**

  - Tulis file tes baru `promotion.routes.test.ts`.

  - Tes `POST /promotions` (sebagai penjual).

  - Tes `GET /promotions` (publik, dengan filter productId).

  - Tes `DELETE /promotions/:id` (sebagai penjual pemilik).

**Prioritas #2: Selesaikan Tes Unit (Service)**

Tujuan: Mencapai cakupan 100% untuk logika bisnis yang paling kompleks.

- **[ ] Selesaikan `order.service.ts`:**

  - Tambahkan tes untuk skenario `createOrder` di mana `product.stock` menjadi 0.

  - Tambahkan tes untuk `updateOrderStatusBySeller` (kasus gagal: transisi status tidak valid, misal pending -> shipped).

- **[ ] Selesaikan `auth.service.ts`:**

  - Tambahkan tes untuk kasus di mana `bcrypt.compare` gagal (melempar error).

- **Benahi npm test nya menjadi `hijau` semua**

**Prioritas #3: Peningkatan Kualitas (Opsional)**

- **[ ] Selesaikan `validator.middleware.ts`:**

  - Tulis tes untuk memverifikasi bahwa middleware `validate` benar-benar menangkap error validasi dan mengembalikannya sebagai respons `422`.

- **[ ] Selesaikan `auth.middleware.ts`:**

  - Tulis tes untuk middleware `protect` yang menyimulasikan token tidak valid, token kedaluwarsa, atau tidak ada token sama sekali.

**⚙️ Panduan Setup & Instalasi (Pengingat)**

1. **Prasyarat:** Node.js (v18+), PostgreSQL.

2. **Instalasi:** Jalankan `npm install`.

3. **Konfigurasi `.env`:** Salin `.env.example` menjadi `.env` dan isi detail database Anda.

4. **Setup Database:** Buat dua database kosong di PostgreSQL: `ecommerce_db` (untuk pengembangan) dan `ecommerce_db_test` (untuk pengujian).

5. **Migrasi:** Jalankan `npm run db:migrate` untuk membuat semua tabel di `ecommerce_db`.

6. **Seeding:** Jalankan `npm run db:seed:all` untuk mengisi data awal.

7. **Menjalankan Server:** `npm run dev`.

8. **Menjalankan Tes:** `npm test`.