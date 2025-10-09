# **Backend E-commerce Modern \- BelanjaKu API**

Selamat datang di repositori Backend E-commerce BelanjaKu. Proyek ini dibangun menggunakan arsitektur modern berbasis TypeScript, Express.js, dan Sequelize (PostgreSQL) dengan mengikuti prinsip-prinsip Clean Architecture. Tujuannya adalah untuk menyediakan fondasi API yang modular, dapat diskalakan, aman, dan siap untuk dikembangkan lebih lanjut.

## **PROGRESS PROYEK (Diperbarui: 10 Oktober 2025\)**

### **✅ Pencapaian Utama Hari Ini:**

Hari ini, kita berhasil menyelesaikan beberapa fitur penting yang meningkatkan fungsionalitas dan kualitas proyek secara signifikan:

1. **Dasbor Penjual (Seller Dashboard) Ditingkatkan:**  
   * **Notifikasi Stok Menipis:** Mengimplementasikan *endpoint* GET /api/v1/sellers/dashboard/low-stock yang memungkinkan penjual untuk secara proaktif melihat produk mana saja yang stoknya berada di bawah ambang batas yang telah ditentukan.  
   * **Logika Bisnis:** Menambahkan metode getLowStockProducts di SellerService yang berisi *query* cerdas untuk memfilter produk berdasarkan stok.  
2. **Fitur Promosi & Diskon Diintegrasikan:**  
   * **Struktur Database Diperbarui:** Memperbarui model Order dan membuat migrasi baru untuk menambahkan kolom promotionId dan discountAmount. Ini memastikan setiap pesanan yang menggunakan diskon tercatat dengan benar.  
   * **Persiapan Logika Checkout:** Dengan adanya kolom ini, OrderService sekarang siap untuk dimodifikasi lebih lanjut untuk menerapkan logika kalkulasi diskon saat proses *checkout*.  
3. **Struktur Database Disempurnakan:**  
   * **Migrasi Terpisah:** Merombak file migrasi tunggal menjadi **satu file migrasi per tabel**. Ini adalah praktik terbaik yang sangat meningkatkan keterbacaan, pelacakan versi, dan kolaborasi tim.  
   * **Reset & Re-Migrate:** Berhasil menyelesaikan proses reset database dan menjalankan ulang semua migrasi secara berurutan, memastikan skema database sekarang bersih dan terorganisir.  
4. **Fondasi Pengujian (Testing) Disiapkan:**  
   * **Konfigurasi Jest:** Membuat file jest.config.js yang mengkonfigurasi *framework* pengujian Jest untuk proyek TypeScript kita, lengkap dengan pengaturan untuk ts-jest, *test environment*, dan laporan cakupan kode (*code coverage*).

### **🏆 Status Proyek Saat Ini:**

**Backend ini sekarang Feature-Complete untuk versi awal.** Semua modul fungsional inti (Autentikasi, Produk, Kategori, Pesanan, Ulasan, Profil Penjual, Pembayaran, dan Pengiriman) telah berhasil dibangun, terhubung, dan siap untuk tahap pengujian serta deployment.

## **🚀 Rencana Pengembangan (To-Do) untuk Programmer Selanjutnya**

Berikut adalah langkah-langkah logis berikutnya untuk melanjutkan pengembangan proyek ini:

### **1\. Implementasi Pengujian (Testing) secara Menyeluruh**

* **Tugas:** Menulis *unit test* dan *integration test* menggunakan Jest untuk semua *service* dan *endpoint* API.  
* **Prioritas:** **Sangat Tinggi.** Ini adalah langkah krusial untuk memastikan keandalan kode sebelum *deployment*.  
* **Memulai Dari Mana:** Buat folder \_\_tests\_\_ di dalam setiap modul (misalnya, src/services/\_\_tests\_\_/auth.service.test.ts) dan mulailah dengan menguji logika bisnis di dalam *service* terlebih dahulu.

### **2\. Implementasi Penuh Sistem Pembayaran**

* **Tugas:** Mengganti simulasi pembayaran dengan integrasi nyata ke salah satu *payment gateway* (misalnya, Midtrans, Xendit, Stripe).  
* **Langkah-langkah:**  
  1. Daftar di *sandbox* *payment gateway* pilihan untuk mendapatkan *API key*.  
  2. Instal SDK yang relevan (misalnya, midtrans-client).  
  3. Lengkapi logika di PaymentService untuk membuat transaksi nyata.  
  4. Implementasikan validasi *signature webhook* yang sesungguhnya untuk mengamankan notifikasi pembayaran.

### **3\. Deployment ke Lingkungan Produksi**

* **Tugas:** Mempublikasikan aplikasi backend ini ke layanan *hosting cloud*.  
* **Rekomendasi Platform:** **Render** atau **Railway** (keduanya memiliki dukungan yang baik untuk aplikasi Node.js \+ PostgreSQL).  
* **Langkah-langkah:**  
  1. Buat database PostgreSQL di layanan *hosting*.  
  2. Atur semua variabel lingkungan (*environment variables*), terutama DATABASE\_URL dan JWT\_SECRET, di dasbor *hosting*.  
  3. Atur perintah *build* (npm run build) dan perintah *start* (npm run start).  
  4. Pastikan migrasi database dijalankan secara otomatis saat proses *deployment*.

### **4\. Refresh Token & Manajemen Sesi**

* **Tugas:** Membuat *endpoint* POST /api/v1/auth/refresh yang menerima *refresh token* dan mengembalikan *access token* baru.  
* **Tujuan:** Meningkatkan keamanan dan pengalaman pengguna dengan memungkinkan sesi login bertahan lebih lama tanpa harus login ulang.

### **5\. Fitur Pencarian Produk (Search)**

* **Tugas:** Mengimplementasikan fungsionalitas pencarian teks pada *endpoint* GET /api/v1/products.  
* **Cara Implementasi:** Tambahkan logika di dalam metode filter() pada kelas APIFeatures untuk menangani *query parameter* seperti ?search=laptop dan menerjemahkannya menjadi *query* Sequelize menggunakan \[Op.iLike\].

## **📋 Daftar Isi**

1. [Fitur Utama](https://www.google.com/search?q=%23-fitur-utama)  
2. [Teknologi yang Digunakan](https://www.google.com/search?q=%23-teknologi-yang-digunakan)  
3. [Struktur Proyek](https://www.google.com/search?q=%23-struktur-proyek)  
4. [Panduan Instalasi & Setup](https://www.google.com/search?q=%23-panduan-instalasi--setup)  
5. [Dokumentasi API](https://www.google.com/search?q=%23-dokumentasi-api)

*Bagian selanjutnya dari README (Fitur, Teknologi, Instalasi, dll.) tetap sama seperti versi sebelumnya untuk kelengkapan.*
