Backend E-commerce Modern (TypeScript, Express, Sequelize)Ini adalah backend lengkap untuk aplikasi e-commerce modern yang dibangun dengan tumpukan teknologi yang kuat dan skalabel, mengikuti prinsip-prinsip Clean Architecture.Fitur UtamaAutentikasi & Otorisasi: Sistem berbasis JWT (Access & Refresh Token) dengan peran pengguna (user, seller, admin).Manajemen Produk: Operasi CRUD penuh untuk produk.Manajemen Kategori: Operasi CRUD penuh untuk kategori produk.Sistem Pesanan: Logika checkout transaksional untuk membuat pesanan dan mengelola item pesanan.Ulasan Produk: Pengguna hanya dapat memberikan ulasan untuk produk yang telah mereka beli.Arsitektur Modular: Kode diorganisir berdasarkan fitur (Auth, Products, Orders, dll.) dengan pemisahan yang jelas antara controller, service, validator, dan model.Validasi Input: Menggunakan express-validator untuk memastikan data yang masuk ke API valid.Penanganan Error Terpusat: Middleware error global untuk respons yang konsisten.Database: Menggunakan Sequelize ORM dengan PostgreSQL, lengkap dengan migrasi dan seeder.Struktur Proyek📂 backend/
├── 📂 src/
│   ├── 📂 api/         # Layer untuk routing, controller, dan validasi
│   ├── 📂 config/      # Konfigurasi aplikasi (env, database)
│   ├── 📂 database/    # Model Sequelize, migrasi, dan seeder
│   ├── 📂 middlewares/ # Middleware Express (auth, error, validator)
│   ├── 📂 services/    # Tempat logika bisnis
│   ├── 📂 utils/       # Fungsi bantuan (helpers)
│   └── 📜 server.ts    # Entry point utama aplikasi
├── 📜 .env.example
├── 📜 .sequelizerc
├── 📜 package.json
└── 📜 tsconfig.json
Panduan Instalasi dan Menjalankan ProyekIkuti langkah-langkah ini untuk menjalankan proyek secara lokal.1. PrasyaratNode.js (v18 atau lebih baru)PostgreSQLNPM atau Yarn2. Setup Awala. Clone Repositorygit clone <URL_REPOSITORY_ANDA>
cd backend
b. Instal Dependenciesnpm install
3. Konfigurasi Databasea. Buat Database PostgreSQLBuka tool database Anda (misalnya pgAdmin) dan buat database baru. Contoh: ecommerce_db.b. Konfigurasi EnvironmentSalin file .env.example menjadi .env:cp .env.example .env
Buka file .env dan isi variabel koneksi database sesuai dengan konfigurasi PostgreSQL Anda:DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password_anda
DB_NAME=ecommerce_db
4. Migrasi dan Seedinga. Jalankan MigrasiPerintah ini akan membuat semua tabel yang dibutuhkan di database Anda.npm run db:migrate
b. Jalankan Seeder (Opsional)Perintah ini akan mengisi database dengan data awal (contoh: user admin, produk, kategori) untuk mempermudah pengujian.npm run db:seed:all
5. Jalankan AplikasiJalankan server pengembangan. Aplikasi akan berjalan di http://localhost:5000.npm run dev
Server Anda sekarang sudah aktif dan siap menerima permintaan API!Endpoint API UtamaAuth: POST /api/v1/auth/register, POST /api/v1/auth/loginProducts: GET /api/v1/products, POST /api/v1/products (Seller/Admin)Categories: GET /api/v1/categories, POST /api/v1/categories (Admin)Orders: GET /api/v1/orders, POST /api/v1/orders (User)Reviews: GET /api/v1/reviews/product/:productId, POST /api/v1/reviews (User)Gunakan tool seperti Postman untuk menguji endpoint di atas. Untuk rute yang terproteksi, jangan lupa menyertakan Access Token di header Authorization dengan format Bearer <TOKEN>.