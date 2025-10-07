# **Backend E-commerce Modern (TypeScript, Express, Sequelize)**

Ini adalah backend lengkap untuk aplikasi e-commerce modern yang dibangun dengan tumpukan teknologi yang kuat dan skalabel, mengikuti prinsip-prinsip Clean Architecture.

## **Fitur Utama**

* **Autentikasi & Otorisasi:** Sistem berbasis JWT (Access & Refresh Token) dengan peran pengguna (user, seller, admin).  
* **Manajemen Produk:** Operasi CRUD penuh untuk produk.  
* **Manajemen Kategori:** Operasi CRUD penuh untuk kategori produk.  
* **Sistem Pesanan:** Logika checkout transaksional untuk membuat pesanan dan mengelola item pesanan.  
* **Ulasan Produk:** Pengguna hanya dapat memberikan ulasan untuk produk yang telah mereka beli.  
* **Arsitektur Modular:** Kode diorganisir berdasarkan fitur (Auth, Products, Orders, dll.) dengan pemisahan yang jelas antara *controller*, *service*, *validator*, dan *model*.  
* **Validasi Input:** Menggunakan express-validator untuk memastikan data yang masuk ke API valid.  
* **Penanganan Error Terpusat:** Middleware error global untuk respons yang konsisten.  
* **Database:** Menggunakan Sequelize ORM dengan PostgreSQL, lengkap dengan migrasi dan seeder.

## **Struktur Proyek**

📂 backend/  
├── 📂 src/  
│   ├── 📂 api/         \# Layer untuk routing, controller, dan validasi  
│   ├── 📂 config/      \# Konfigurasi aplikasi (env, database)  
│   ├── 📂 database/    \# Model Sequelize, migrasi, dan seeder  
│   ├── 📂 middlewares/ \# Middleware Express (auth, error, validator)  
│   ├── 📂 services/    \# Tempat logika bisnis  
│   ├── 📂 utils/       \# Fungsi bantuan (helpers)  
│   └── 📜 server.ts    \# Entry point utama aplikasi  
├── 📜 .env.example  
├── 📜 .sequelizerc  
├── 📜 package.json  
└── 📜 tsconfig.json

## **Progress Proyek**

* **Status:** **Fungsionalitas Inti Selesai**  
* **Modul yang Sudah Selesai (100%):**  
  * \[x\] **Autentikasi** (Register, Login, Proteksi Rute)  
  * \[x\] **Produk** (CRUD)  
  * \[x\] **Kategori** (CRUD)  
  * \[x\] **Pesanan / Orders** (Checkout, Lihat Riwayat)  
  * \[x\] **Ulasan / Reviews** (Membuat dan Melihat Ulasan)  
* Backend saat ini sudah memiliki semua fitur esensial yang dibutuhkan untuk sebuah platform e-commerce dan siap untuk diintegrasikan dengan frontend.

## **Rencana Pengembangan (To-Do)**

Berikut adalah daftar fitur dan perbaikan yang dapat dikerjakan selanjutnya untuk meningkatkan fungsionalitas aplikasi.

#### **1\. Manajemen User (Untuk Admin)**

* **Files:** user.service.ts, api/v1/users/\*  
* **Tugas:** Membangun endpoint CRUD (GET, PUT, DELETE) yang memungkinkan admin untuk mengelola data semua pengguna di sistem.

#### **2\. Fitur Upload Gambar**

* **File:** upload.middleware.ts  
* **Tugas:** Mengimplementasikan upload gambar produk menggunakan **Multer**. Bisa dikembangkan lebih lanjut untuk menyimpan file ke layanan cloud seperti **Cloudinary**.

#### **3\. Peningkatan Fitur API (Query Lanjutan)**

* **File:** apiFeatures.util.ts  
* **Tugas:** Membuat kelas *helper* untuk menambahkan fungsionalitas **pencarian, filter, dan sorting** yang lebih canggih pada endpoint GET /api/v1/products.

#### **4\. Model & Fitur Tambahan**

* **Files:** seller.model.ts, promotion.model.ts, shippingOption.model.ts  
* **Tugas:**  
  * Memisahkan data spesifik penjual (info toko, rating, dll.) ke dalam Seller model.  
  * Membangun sistem untuk manajemen promosi atau diskon produk.  
  * Menambahkan dukungan untuk berbagai opsi pengiriman beserta biayanya.

#### **5\. Infrastruktur & Logging**

* **File:** logger.util.ts  
* **Tugas:** Mengkonfigurasi **Winston** untuk *logging* aplikasi yang lebih terstruktur. Ini sangat penting untuk *debugging* di lingkungan produksi.

## **Panduan Instalasi dan Menjalankan Proyek**

Ikuti langkah-langkah ini untuk menjalankan proyek secara lokal.

### **1\. Prasyarat**

* [Node.js](https://nodejs.org/) (v18 atau lebih baru)  
* [PostgreSQL](https://www.postgresql.org/download/)  
* NPM atau Yarn

### **2\. Setup Awal**

**a. Clone Repository**

git clone \<URL\_REPOSITORY\_ANDA\>  
cd backend

**b. Instal Dependencies**

npm install

### **3\. Konfigurasi Database**

a. Buat Database PostgreSQL  
Buka tool database Anda (misalnya pgAdmin) dan buat database baru. Contoh: ecommerce\_db.  
b. Konfigurasi Environment  
Salin file .env.example menjadi .env:  
cp .env.example .env

Buka file .env dan isi variabel koneksi database sesuai dengan konfigurasi PostgreSQL Anda:

DB\_HOST=localhost  
DB\_PORT=5432  
DB\_USER=postgres  
DB\_PASS=password\_anda  
DB\_NAME=ecommerce\_db

### **4\. Migrasi dan Seeding**

a. Jalankan Migrasi  
Perintah ini akan membuat semua tabel yang dibutuhkan di database Anda.  
npm run db:migrate

b. Jalankan Seeder (Opsional)  
Perintah ini akan mengisi database dengan data awal (contoh: user admin, produk, kategori) untuk mempermudah pengujian.  
npm run db:seed:all

### **5\. Jalankan Aplikasi**

Jalankan server pengembangan. Aplikasi akan berjalan di http://localhost:5000.

npm run dev

Server Anda sekarang sudah aktif dan siap menerima permintaan API\!

## **Endpoint API Utama**

* **Auth:** POST /api/v1/auth/register, POST /api/v1/auth/login  
* **Products:** GET /api/v1/products, POST /api/v1/products (Seller/Admin)  
* **Categories:** GET /api/v1/categories, POST /api/v1/categories (Admin)  
* **Orders:** GET /api/v1/orders, POST /api/v1/orders (User)  
* **Reviews:** GET /api/v1/reviews/product/:productId, POST /api/v1/reviews (User)

Gunakan *tool* seperti Postman untuk menguji endpoint di atas. Untuk rute yang terproteksi, jangan lupa menyertakan *Access Token* di *header* Authorization dengan format Bearer \<TOKEN\>.