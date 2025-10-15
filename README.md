# **Backend E-commerce Modern \- BelanjaKu**

Selamat datang di repositori backend untuk proyek E-commerce **BelanjaKu**. Proyek ini dibangun dengan TypeScript, Express.js, dan Sequelize (PostgreSQL) menggunakan prinsip-prinsip Clean Architecture untuk memastikan kode yang dihasilkan modular, dapat diskalakan, dan mudah dikelola.

### **🚀 Status Proyek & Kemajuan Hari Ini (15 Oktober 2025\)**

**Status: Fondasi Backend Lengkap dan Teruji.**

Hari ini kita telah mencapai tonggak pencapaian yang signifikan. Seluruh arsitektur backend, modul-modul fungsional inti, dan infrastruktur pengujian telah berhasil diimplementasikan dan diverifikasi.

**Pencapaian Utama:**

1. **Implementasi Modul Fungsional Lengkap:**  
   * ✅ **Autentikasi & Keamanan:** Sistem registrasi dan login berbasis JWT dengan *rate limiting* untuk mencegah serangan *brute-force*.  
   * ✅ **Manajemen Produk & Penjual:** Penjual dapat melakukan operasi CRUD pada produk mereka, termasuk unggah gambar melalui multer.  
   * ✅ **Manajemen Pesanan:** Pengguna dapat membuat pesanan (*checkout*), dan penjual dapat melihat serta memperbarui status pesanan yang masuk ke toko mereka.  
   * ✅ **Fitur Promosi & Diskon:** Penjual/Admin dapat membuat promosi, dan logika untuk menerapkan diskon pada saat *checkout* telah diimplementasikan di OrderService.  
   * ✅ **Dasbor Penjual:** *Endpoint* untuk manajemen profil toko, statistik penjualan (pendapatan, jumlah pesanan), dan notifikasi produk dengan stok menipis telah dibuat.  
   * ✅ **Manajemen Admin:** Admin memiliki akses penuh untuk mengelola pengguna, kategori, dan opsi pengiriman.  
   * ✅ **Sistem Ulasan:** Pengguna dapat memberikan ulasan hanya untuk produk yang telah mereka beli.  
   * ✅ **Fondasi Pembayaran:** Kerangka kerja untuk simulasi pembayaran dan penanganan *webhook* telah dibangun.  
2. **Infrastruktur Pengujian yang Solid:**  
   * ✅ **Konfigurasi Jest & ts-jest:** Lingkungan pengujian telah disiapkan untuk bekerja dengan TypeScript.  
   * ✅ **Database Terisolasi:** Pengujian berjalan pada database terpisah (ecommerce\_db\_test) yang dibuat ulang setiap kali tes dijalankan, memastikan tidak ada konflik data.  
   * ✅ **Unit Testing:** Telah ditulis *unit test* yang komprehensif untuk *service* paling krusial (AuthService, ProductService, UserService, CategoryService, dll.) dengan cakupan kode yang tinggi.  
   * ✅ **Integration Testing:** Telah ditulis *integration test* menggunakan Supertest untuk memverifikasi alur API secara *end-to-end*, termasuk registrasi, login, pembuatan produk (dengan unggah file), dan skenario keamanan.

**Dengan kata lain, backend ini sekarang berada dalam kondisi yang sangat stabil dan terverifikasi.**

### **🛠️ Rencana Kerja & To-Do untuk Kolaborasi Malam Ini**

Berikut adalah daftar tugas yang perlu kita selesaikan untuk menyempurnakan proyek ini. Mari kita kerjakan sesuai urutan prioritas.

#### **Prioritas \#1: Selesaikan Cakupan Pengujian (Testing)**

Tujuan kita adalah memastikan setiap logika bisnis terlindungi oleh tes. Ini akan memberikan kepercayaan diri untuk melakukan *refactoring* atau menambahkan fitur baru di masa depan.

* **\[ \] Tulis *Unit Test* untuk *Service* yang Tersisa:**  
  * shipping.service.ts  
  * promotion.service.ts  
  * payment.service.ts (fokus pada logika simulasi)  
  * Tingkatkan cakupan untuk order.service.ts untuk mencakup semua kasus (termasuk kegagalan transaksi).  
  * **Target:** Mencapai cakupan kode \>90% untuk semua file di dalam direktori src/services/.  
* **\[ \] Tulis *Integration Test* untuk *Endpoint* yang Belum Teruji:**  
  * **User/Admin:** GET /users, PUT /users/:id, DELETE /users/:id.  
  * **Categories:** GET /categories, POST /categories, DELETE /categories/:id.  
  * **Reviews:** POST /reviews, GET /reviews/product/:productId.  
  * **Seller Dashboard:** POST /sellers/profile, GET /sellers/profile/me.

#### **Prioritas \#2: Refactor & Peningkatan Kualitas Kode**

Setelah semua logika teruji, kita bisa merapikan kode tanpa takut merusaknya.

* **\[ \] Implementasi APIFeatures pada *Endpoint* Lain:**  
  * Terapkan kelas APIFeatures pada *endpoint* GET lainnya (misalnya, GET /users oleh admin) untuk menambahkan fungsionalitas *filter*, *sort*, dan paginasi.  
* **\[ \] Refactor *Controller*:**  
  * Identifikasi logika yang berulang di dalam *controller* (seperti if (\!req.user) ...) dan pertimbangkan untuk mengekstraknya ke dalam *middleware* atau fungsi *helper* khusus untuk membuat *controller* lebih ramping.  
* **\[ \] Perkuat Tipe Data:**  
  * Lakukan peninjauan di seluruh proyek untuk mengganti penggunaan tipe any dengan *interface* atau tipe yang lebih spesifik.

#### **Prioritas \#3: Fitur Tambahan (Jika Waktu Memungkinkan)**

Jika kita berhasil menyelesaikan prioritas di atas, kita bisa mulai mengerjakan fitur baru.

* **\[ \] Implementasi *Soft Deletes*:**  
  * Modifikasi model-model penting (seperti Product dan User) untuk menggunakan fitur paranoid dari Sequelize. Ini akan "mengarsipkan" data saat dihapus, bukan menghapusnya secara permanen.  
  * Buat *endpoint* baru untuk admin (misalnya, GET /users/archived) untuk melihat atau memulihkan data yang telah diarsipkan.  
* **\[ \] Tambahkan Respon Paginasi:**  
  * Saat ini, *endpoint* GET yang menggunakan paginasi hanya mengembalikan data. Perbarui responsnya agar menyertakan metadata paginasi seperti currentPage, totalPages, dan totalItems.

### **⚙️ Panduan Setup & Instalasi (Pengingat)**

1. **Prasyarat:** Node.js (v18+), PostgreSQL.  
2. **Instalasi:** Jalankan npm install.  
3. **Konfigurasi .env:** Salin .env.example menjadi .env dan isi detail database Anda.  
4. **Setup Database:** Buat dua database kosong di PostgreSQL: ecommerce\_db (untuk pengembangan) dan ecommerce\_db\_test (untuk pengujian).  
5. **Migrasi:** Jalankan npm run db:migrate untuk membuat semua tabel di ecommerce\_db.  
6. **Seeding:** Jalankan npm run db:seed:all untuk mengisi data awal.  
7. **Menjalankan Server:** npm run dev.  
8. **Menjalankan Tes:** npm test.

Mari kita mulai dari **Prioritas \#1** dan pastikan fondasi pengujian kita benar-benar solid\!