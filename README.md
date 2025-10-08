# **Backend E-commerce Modern \- BelanjaKu API**

Selamat datang di repositori Backend E-commerce BelanjaKu. Proyek ini adalah backend yang kokoh, modular, dan dapat diskalakan yang dibangun dengan tumpukan teknologi modern, dirancang untuk mendukung platform e-commerce dengan berbagai fitur.

Arsitekturnya mengikuti prinsip-prinsip **Clean Architecture**, memisahkan logika bisnis (*services*), penanganan permintaan (*controllers*), dan akses data (*models*) untuk kemudahan pemeliharaan dan pengujian.

## **PROGRESS PROYEK (Oktober 2025\)**

Saat ini, seluruh fondasi dan fitur inti dari backend telah **berhasil dibangun** dan siap untuk diintegrasikan dengan aplikasi frontend.

* **✅ Fondasi Proyek:** Konfigurasi TypeScript, Express, Sequelize, dan penanganan error global telah selesai.  
* **✅ Modul Inti:**  
  * **Autentikasi:** Fungsionalitas registrasi, login, dan proteksi rute dengan JWT sudah lengkap.  
  * **Manajemen Produk & Kategori:** Operasi CRUD untuk produk dan kategori telah selesai, termasuk unggah gambar.  
  * **Sistem Pesanan:** Alur kerja untuk membuat pesanan (*checkout*) dan melihat riwayat pesanan sudah berfungsi.  
  * **Ulasan & Rating:** Pengguna dapat memberikan ulasan untuk produk yang telah mereka beli.  
* **✅ Fitur Admin:**  
  * **Manajemen Pengguna:** Admin dapat mengelola semua data pengguna (CRUD).  
  * **Manajemen Kategori:** Admin dapat mengelola kategori produk (CRUD).  
  * **Manajemen Opsi Pengiriman:** Admin dapat mengelola metode pengiriman (CRUD).  
* **✅ Fitur Penjual (Seller):**  
  * **Manajemen Produk:** Penjual dapat mengelola produk mereka sendiri (CRUD).  
  * **Manajemen Profil Toko:** Penjual dapat membuat dan memperbarui profil toko mereka.  
* **✅ Infrastruktur:**  
  * **Database:** Migrasi dan *seeder* untuk semua tabel telah dibuat.  
  * **Query Lanjutan:** Utilitas APIFeatures untuk *sorting*, *filtering*, dan paginasi telah diimplementasikan pada modul produk.  
  * **Logging:** Sistem *logging* terstruktur menggunakan Winston telah diintegrasikan.  
* **✅ Fondasi Pembayaran:** Kerangka kerja untuk simulasi pembayaran dan penanganan *webhook* telah dibuat.

## **Fitur Utama**

* **Autentikasi & Otorisasi Berbasis JWT**: Sistem aman dengan *access token* dan *refresh token*.  
* **Manajemen Pengguna Berbasis Peran**: Peran yang jelas (user, seller, admin) dengan hak akses yang berbeda.  
* **CRUD Penuh**: Operasi *Create, Read, Update, Delete* untuk semua modul utama (Produk, Kategori, Pesanan, dll.).  
* **Unggah Gambar Produk**: Penanganan unggah file menggunakan Multer.  
* **Query API Lanjutan**: Dukungan untuk *filtering*, *sorting*, paginasi, dan pemilihan *field* pada *endpoint* produk.  
* **Sistem Pesanan Transaksional**: Memastikan konsistensi data saat membuat pesanan dan mengurangi stok produk.  
* **Logging Terstruktur**: Pencatatan log yang rapi untuk *development* dan *production* menggunakan Winston.  
* **Arsitektur Modular**: Mudah untuk diperluas dengan fitur-fitur baru di masa depan.

## **Tumpukan Teknologi**

* **Runtime**: Node.js  
* **Framework**: Express.js  
* **Bahasa**: TypeScript  
* **Database**: PostgreSQL  
* **ORM**: Sequelize  
* **Autentikasi**: JSON Web Token (JWT)  
* **Validasi**: express-validator  
* **Unggah File**: multer  
* **Logging**: winston & morgan  
* **Lingkungan**: dotenv

## **Panduan Instalasi & Penggunaan**

### **1\. Prasyarat**

* Node.js (v18 atau lebih baru)  
* NPM atau Yarn  
* PostgreSQL terinstal dan berjalan di mesin Anda.

### **2\. Kloning Repositori**

git clone \<URL\_REPOSITORI\_ANDA\>  
cd backend

### **3\. Instal Dependensi**

npm install

### **4\. Konfigurasi Lingkungan**

1. Buat salinan dari file .env.example dan beri nama .env.  
   \# Windows  
   copy .env.example .env  
   \# macOS / Linux  
   cp .env.example .env

2. Buka file .env dan isi dengan konfigurasi Anda, terutama detail koneksi database:  
   DB\_HOST=localhost  
   DB\_PORT=5432  
   DB\_USER=postgres  
   DB\_PASS=password\_anda  
   DB\_NAME=ecommerce\_db  
   JWT\_SECRET=rahasia\_yang\_sangat\_aman

### **5\. Pengaturan Database**

1. Pastikan server PostgreSQL Anda berjalan.  
2. Buat database baru dengan nama yang sama seperti yang Anda tulis di DB\_NAME (misalnya, ecommerce\_db).  
3. Jalankan migrasi untuk membuat semua tabel di database Anda:  
   npm run db:migrate

4. (Opsional) Isi database dengan data awal (admin, seller, produk, dll.):  
   npm run db:seed:all

### **6\. Jalankan Aplikasi**

npm run dev

Server akan berjalan di http://localhost:5000 (atau port yang Anda tentukan di .env).

## **Dokumentasi API**

Lihat file postman\_testing\_guide.md untuk panduan pengujian lengkap dan detail setiap *endpoint*.

## **Rencana Pengembangan (To-Do) untuk Programmer Selanjutnya**

Proyek ini memiliki fondasi yang kuat, tetapi masih banyak ruang untuk pengembangan lebih lanjut. Berikut adalah beberapa tugas yang bisa dikerjakan selanjutnya:

### **1\. Implementasi Penuh Sistem Pembayaran**

* **Tugas:** Integrasikan backend dengan *payment gateway* nyata seperti **Midtrans**, **Xendit**, atau **Stripe**.  
* **Langkah:**  
  * Buat *request* ke *payment gateway* di dalam payment.service.ts saat createPayment dipanggil.  
  * Implementasikan validasi *signature* di dalam *endpoint* /webhook untuk mengamankan notifikasi pembayaran.  
  * Tambahkan *endpoint* untuk pengguna bisa memeriksa status pembayaran sebuah pesanan.

### **2\. Peningkatan Fitur Penjual (Seller)**

* **Tugas:** Buat dasbor khusus untuk penjual.  
* **Langkah:**  
  * Buat *endpoint* bagi penjual untuk melihat daftar semua produk yang mereka jual.  
  * Buat *endpoint* bagi penjual untuk melihat pesanan yang masuk untuk produk mereka.  
  * Implementasikan fungsionalitas bagi penjual untuk memperbarui status pesanan (misalnya, dari processing menjadi shipped).

### **3\. Manajemen Inventaris Lanjutan**

* **Tugas:** Tingkatkan sistem stok produk.  
* **Langkah:**  
  * Tambahkan *hook* atau *event* untuk memberikan notifikasi jika stok produk menipis.  
  * Buat riwayat pergerakan stok (masuk/keluar) untuk setiap produk.

### **4\. Optimalisasi & Peningkatan Performa**

* **Tugas:** Terapkan strategi *caching* dan optimalkan *query* database.  
* **Langkah:**  
  * Gunakan **Redis** untuk melakukan *caching* pada data yang sering diakses (misalnya, daftar produk atau kategori).  
  * Analisis *query* yang lambat menggunakan EXPLAIN ANALYZE dan tambahkan *index* pada kolom-kolom yang sering di-filter atau di-sort.

### **5\. Pengujian (Testing)**

* **Tugas:** Buat *unit test* dan *integration test* untuk memastikan keandalan kode.  
* **Langkah:**  
  * Gunakan *framework* seperti **Jest** dan **Supertest**.  
  * Buat *test case* untuk setiap *service* (unit test) dan setiap *endpoint* API (integration test).  
  * Konfigurasikan database terpisah khusus untuk pengujian.

### **6\. Fitur Pengiriman Lanjutan**

* **Tugas:** Integrasikan dengan API pihak ketiga untuk ongkos kirim (misalnya, RajaOngkir).  
* **Langkah:**  
  * Tambahkan *endpoint* bagi pengguna untuk memeriksa ongkos kirim berdasarkan alamat tujuan.  
  * Hubungkan biaya pengiriman yang dipilih ke dalam total biaya pesanan saat *checkout*.
