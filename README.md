# Proyek E-commerce \"belanjaKu\"

Selamat datang di repositori proyek \"belanjaKu\". Proyek ini merupakan
implementasi dari cetak biru arsitektur untuk platform e-commerce modern
yang dinamis dan berkonversi tinggi, dengan meniru strategi pemimpin
pasar di Indonesia seperti Tokopedia dan Shopee.

## Ringkasan Eksekutif

\"belanjaKu\" dirancang lebih dari sekadar platform e-commerce biasa.
Inti dari proyek ini adalah **arsitektur halaman produk dinamis** yang
dibangun di atas kerangka kerja modular berbasis data. Sistem ini
menggunakan \"Master Prompt,\" sebuah sistem variabel terstruktur yang
mampu menghasilkan skenario halaman produk yang sangat realistis dan
sadar konteks.

Tujuannya adalah untuk menciptakan fondasi yang kuat bagi manajer
produk, desainer UX/UI, dan pengembang dalam membangun pengalaman
e-commerce kelas dunia yang disesuaikan untuk pasar Indonesia.

## Filosofi Arsitektur: Anatomi Halaman Produk Berkonversi Tinggi

Halaman produk kami bukanlah halaman statis, melainkan ekosistem dinamis
yang dipecah menjadi empat zona strategis utama untuk membimbing
pengguna dari penemuan hingga konversi.

1.  **Zona Kepercayaan dan Bukti Sosial**: Mengumpulkan sinyal-sinyal
    > untuk memvalidasi kualitas produk dan keandalan penjual, seperti
    > rating, jumlah terjual, dan lencana penjual.

2.  **Zona Informasi Inti Produk**: Menyajikan fitur, manfaat, dan
    > spesifikasi produk melalui konten yang kaya dan terstruktur
    > seperti galeri gambar/video dan deskripsi detail.

3.  **Zona Aksi Komersial**: Mendorong keputusan pembelian dengan
    > mengintegrasikan harga, promosi, dan logistik secara jelas dan
    > persuasif.

4.  **Zona Penemuan dan Navigasi**: Meningkatkan keterlibatan pengguna
    > dengan merekomendasikan produk relevan lainnya untuk mendorong
    > *cross-selling* dan *upselling*.

## Fitur Utama

Platform \"belanjaKu\" dirancang untuk mendukung serangkaian fitur
komprehensif yang penting dalam e-commerce modern:

### Bukti Sosial & Kepercayaan Pengguna {#bukti-sosial-kepercayaan-pengguna}

- **Peringkat & Ulasan**: Menampilkan agregat peringkat bintang beserta
  > jumlah total ulasan untuk membangun kepercayaan.

- **Metrik Kecepatan Penjualan**: Menunjukkan jumlah unit yang terjual
  > (misalnya, \"Terjual 25rb+\") sebagai indikator kuat popularitas
  > produk.

- **Identitas Penjual Terverifikasi**: Menampilkan nama toko, lokasi,
  > dan lencana berbasis kinerja seperti \"Official Store\" atau \"Power
  > Merchant\".

### Informasi Produk yang Kaya

- **Hierarki Visual**: Galeri gambar dan video produk berkualitas tinggi
  > untuk presentasi yang dinamis dan dapat dipercaya.

- **Deskripsi Terstruktur**: Tata letak deskripsi yang menarik secara
  > visual dengan campuran gambar dan teks, mirip seperti halaman arahan
  > mini.

- **Atribut & Spesifikasi**: Daftar atribut produk yang lengkap untuk
  > membantu keputusan pembelian dan mendukung algoritma
  > pencarian/penyaringan.

### Mesin Harga & Promosi Berlapis {#mesin-harga-promosi-berlapis}

- **Tampilan Harga Dinamis**: Menggunakan harga coret untuk menyoroti
  > diskon dan menciptakan rasa urgensi.

- **Promosi Multi-Lapis**: Kemampuan untuk menumpuk beberapa penawaran
  > secara bersamaan, seperti diskon langsung, cashback, voucher toko,
  > Kombo Hemat, dan Flash Sale.

- **Gratis Ongkir**: Penawaran bebas biaya pengiriman yang merupakan
  > pendorong konversi utama.

### Logistik & Opsi Pengiriman Fleksibel {#logistik-opsi-pengiriman-fleksibel}

- **Beragam Pilihan Pengiriman**: Menyediakan opsi pengiriman seperti
  > Instan, *Same Day*, Reguler, Kargo, dan *Cash on Delivery* (COD).

- **Transparansi Biaya & Waktu**: Memberikan informasi jelas mengenai
  > biaya pengiriman (Ongkir) dan perkiraan waktu tiba berdasarkan
  > lokasi pembeli dan penjual.

### Keterlibatan & Personalisasi Pengguna {#keterlibatan-personalisasi-pengguna}

- **Lencana Status Produk**: Menandai produk dengan lencana \"Terbaru\"
  > atau \"Paling Laris\" untuk menarik perhatian pengguna.

- **Notifikasi Penting**: Fitur seperti \"Ingatkan Saya\" untuk
  > notifikasi penurunan harga (*price drop alert*) guna mendorong
  > keterlibatan kembali.

## Tech Stack yang Direkomendasikan

Untuk membangun platform \"belanjaKu\" yang scalable, andal, dan modern,
kami merekomendasikan tumpukan teknologi berikut:

### Frontend

- **Framework**: **Next.js (React)** - Untuk Server-Side Rendering (SSR)
  > dan Static Site Generation (SSG) yang optimal bagi SEO dan performa.

- **Bahasa**: **TypeScript** - Untuk pengembangan yang lebih aman dan
  > terkelola dengan type safety.

- **Styling**: **Tailwind CSS** - Kerangka kerja CSS utility-first untuk
  > membangun desain kustom dengan cepat dan konsisten.

- **Manajemen State**: **Zustand** atau **React Context** - Untuk
  > manajemen state global yang sederhana dan efisien.

### Backend

- **Framework**: **Node.js** dengan **Express.js** atau **NestJS** -
  > Express.js untuk fleksibilitas, atau NestJS untuk arsitektur yang
  > lebih terstruktur dan modular.

- **Bahasa**: **TypeScript** - Menjaga konsistensi dengan frontend dan
  > memberikan keuntungan type safety.

- **API**: **REST API** - Sebagai standar industri yang matang untuk
  > komunikasi client-server.

- **Autentikasi**: **JWT (JSON Web Tokens)** - Untuk mengelola sesi
  > pengguna yang aman dan stateless.

### Database

- **Database Utama**: **PostgreSQL** - Sistem database relasional yang
  > kuat, andal, dan cocok untuk data transaksional e-commerce.

- **Caching**: **Redis** - Untuk caching data yang sering diakses
  > (seperti detail produk populer, sesi pengguna) guna mengurangi beban
  > database dan mempercepat respons.

### Infrastruktur & Deployment {#infrastruktur-deployment}

- **Kontainerisasi**: **Docker** - Untuk mengemas aplikasi dan
  > dependensinya, memastikan konsistensi di berbagai lingkungan.

- **Cloud Provider**: **AWS** (Amazon Web Services) atau **GCP** (Google
  > Cloud Platform).

- **Deployment Frontend**: **Vercel** - Platform yang dioptimalkan untuk
  > hosting aplikasi Next.js dengan CI/CD yang terintegrasi.

## Arsitektur & Model Data {#arsitektur-model-data}

### Diagram Alur Pengguna (Flowchart)

Diagram ini mengilustrasikan perjalanan pengguna dari awal hingga akhir
di platform \"belanjaKu\".

graph TD  
A\[Pengguna Membuka Aplikasi/Website\] \--\> B{Mencari Produk atau
Memilih Kategori};  
B \--\> C\[Melihat Halaman Daftar Produk\];  
C \--\> D{Filter & Urutkan Hasil};  
D \-- Berdasarkan Harga, Ulasan, Lokasi, dll \--\> C;  
C \--\> E\[Memilih & Membuka Halaman Detail Produk\];  
  
subgraph Halaman Detail Produk  
E \--\> F\[\<strong\>Zona Kepercayaan & Bukti Sosial\</strong\>\<br/\>-
Cek Peringkat Bintang & Jumlah Ulasan\<br/\>- Lihat Jumlah Terjual
(\'Terjual 25rb+\')\<br/\>- Verifikasi Reputasi Penjual (\'Official
Store\')\];  
F \--\> G\[\<strong\>Zona Informasi Inti Produk\</strong\>\<br/\>- Lihat
Gambar/Video Produk\<br/\>- Baca Deskripsi & Spesifikasi\];  
G \--\> H\[\<strong\>Zona Aksi Komersial\</strong\>\<br/\>- Cek Harga &
Diskon\<br/\>- Lihat Promo (Cashback, Gratis Ongkir)\<br/\>- Pilih Opsi
Pengiriman (Reguler, Instan, COD)\];  
H \--\> I\[Menambahkan Produk ke Keranjang\];  
end  
  
I \--\> J{Lanjut Belanja atau ke Keranjang};  
J \-- Lanjut Belanja \--\> C;  
J \-- Ke Keranjang \--\> K\[Halaman Keranjang\];  
K \--\> L\[Memeriksa Pesanan & Memilih Alamat\];  
L \--\> M\[Halaman Checkout\];  
M \-- Pilih Metode Pembayaran \--\> N\[Konfirmasi Pembayaran\];  
N \--\> O\[Pesanan Dibuat\];  
O \--\> P\[Menerima Notifikasi Konfirmasi Pesanan\];

### Diagram Kelas (Class Diagram)

Diagram ini menunjukkan struktur data dan hubungan antar entitas utama
dalam sistem.

classDiagram  
class User {  
+int id  
+string name  
+string email  
+string location  
}  
class Seller {  
+int id  
+string store_name  
+string location  
+SellerType type  
}  
class Product {  
+int id  
+string name  
+string sku  
+float base_price  
+int stock  
+int sold_count  
+BestsellerStatus bestseller_status  
}  
class Order {  
+int id  
+date created_at  
+OrderStatus status  
}  
class Review {  
+float score  
+string comment  
}  
class Promotion {  
+PromoType type  
+string value  
}  
class ShippingOption {  
+ShippingType type  
+float cost  
+string eta  
}  
  
User \"1\" \-- \"0..\*\" Order  
User \"1\" \-- \"0..\*\" Review  
Seller \"1\" \-- \"1..\*\" Product  
Product \"1\" \-- \"0..\*\" Review  
Product \"0..\*\" \-- \"0..\*\" Promotion  
Order \"1\" \-- \"1\" ShippingOption

### Contoh Struktur Data API (Berdasarkan Master Prompt)

Respons API untuk halaman produk akan mengikuti struktur modular ini,
memastikan konsistensi antara backend dan frontend.

{  
\"user_context\": {  
\"location\": \"Jakarta Barat\"  
},  
\"product\": {  
\"name\": \"Kemeja Flanel Pria Lengan Panjang\",  
\"category\": \"Fashion Pria \> Kemeja\",  
\"sku\": \"KFP-001-RED-L\"  
},  
\"seller\": {  
\"name\": \"Toko Resmi Flanelku\",  
\"location\": \"Jakarta Utara\",  
\"type\": \"Official Store\"  
},  
\"social_proof\": {  
\"rating\": { \"score\": 4.9, \"count\": 32150 },  
\"sales\": { \"sold\": 75000, \"status\": \"terlaris\" },  
\"recency\": { \"status\": null }  
},  
\"commercial\": {  
\"pricing\": { \"base\": 200000, \"discount_percentage\": 5, \"final\":
190000 },  
\"promotions\": \[  
{ \"type\": \"cashback\", \"value\": \"5%\" },  
{ \"type\": \"shipping\", \"value\": \"Gratis Ongkir Min. Belanja
Rp50rb\" }  
\]  
},  
\"logistics\": {  
\"options\": \[  
{ \"type\": \"Instan\", \"cost\": 25000, \"eta\": \"1-2 jam\" },  
{ \"type\": \"Reguler\", \"cost\": 9000, \"eta\": \"1-2 hari\" },  
{ \"type\": \"COD\", \"cost\": 12000, \"eta\": \"2-3 hari\" }  
\]  
}  
}

## Skenario Penggunaan Dinamis

Arsitektur ini memungkinkan simulasi berbagai skenario siklus hidup
produk secara dinamis.

#### 1. Skenario A: Peluncuran Produk Baru {#skenario-a-peluncuran-produk-baru}

- **Tujuan**: Mendorong adopsi awal untuk produk baru tanpa riwayat
  > penjualan.

- **Strategi**: Memanfaatkan tumpukan promosi yang agresif.

- **Konfigurasi API**: rating.count = 0, sales.sold = 0, recency.status
  > = \'terbaru\', promotions diisi dengan diskon peluncuran, voucher,
  > dan gratis ongkir.

#### 2. Skenario B: Produk Terlaris (Best-Seller) {#skenario-b-produk-terlaris-best-seller}

- **Tujuan**: Menampilkan produk pemimpin pasar dengan bukti sosial yang
  > luar biasa.

- **Strategi**: Menekankan pada rating tinggi dan volume penjualan,
  > dengan promosi minimal.

- **Konfigurasi API**: rating.count \> 10000, sales.sold \> 50000,
  > sales.status = \'terlaris\', promosi minimal (misal: diskon kecil).

#### 3. Skenario C: Urgensi Flash Sale {#skenario-c-urgensi-flash-sale}

- **Tujuan**: Menciptakan urgensi yang kuat melalui promosi berbatas
  > waktu.

- **Strategi**: Menggabungkan diskon besar dengan kelangkaan stok dan
  > penghitung waktu mundur.

- **Konfigurasi API**: promotions berisi type: \'flash_sale\' dengan
  > end_time, dan ditambah data inventory.stock yang rendah.

## Pemanfaatan Strategis Lintas Tim

Arsitektur ini dirancang untuk menjadi **\"sumber kebenaran tunggal\"**
yang menyelaraskan tim Desain, Produk, dan Rekayasa.

- **Untuk Desain UX/UI**: Memungkinkan desainer mengisi mockup dengan
  > data yang realistis dan melakukan *stress testing* pada komponen UI.

- **Untuk Manajemen Produk**: Menjadi alat untuk validasi hipotesis dan
  > merancang pengujian A/B yang terkontrol.

- **Untuk Rekayasa (Engineering)**: Berfungsi sebagai spesifikasi yang
  > jelas untuk definisi *endpoint* API dan memodelkan logika bisnis di
  > server.

## Setup & Instalasi {#setup-instalasi}

*(Bagian ini akan berisi instruksi tentang cara menjalankan proyek
secara lokal, termasuk prasyarat, instalasi dependensi, dan perintah
untuk menjalankan server pengembangan.)*

\# Clone repositori ini  
git clone
\[https://github.com/username/belanjaku.git\](https://github.com/username/belanjaku.git)  
  
\# Masuk ke direktori proyek  
cd belanjaku  
  
\# Instal dependensi  
npm install  
  
\# Jalankan server pengembangan  
npm run dev

## Cara Berkontribusi

Kami menyambut kontribusi dari komunitas. Silakan lihat CONTRIBUTING.md
untuk panduan lebih lanjut tentang cara berkontribusi pada proyek ini.
