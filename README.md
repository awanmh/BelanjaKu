# BelanjaKu

**BelanjaKu** adalah aplikasi E-Commerce berbasis web modern yang dirancang untuk memberikan pengalaman berbelanja daring yang mulus dan intuitif. Proyek ini dibangun dengan arsitektur **Monorepo**, memisahkan logika _Frontend_ dan _Backend_ untuk skalabilitas dan pemeliharaan yang lebih baik.

---

## �️ Tech Stack

Proyek ini dibangun menggunakan teknologi terkini yang _production-ready_:

### Frontend

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **HTTP Client:** Axios

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Authentication:** JWT (JSON Web Token) & bcryptjs
- **Other Tools:** Socket.io (Real-time), Multer (File Upload)

---

## ✨ Fitur Utama

- **Otentikasi Pengguna:** Sistem registrasi dan login yang aman untuk Pembeli dan Penjual.
- **Katalog Produk:** Penelusuran produk berdasarkan kategori (Pria, Wanita, Anak, Olahraga) dengan filter yang responsif.
- **Detail Produk:** Informasi mendalam produk termasuk varian ukuran dan stok real-time.
- **Keranjang Belanja (Shopping Cart):** Manajemen keranjang belanja yang persisten dan tersinkronisasi.
- **Checkout & Pembayaran:** Alur checkout lengkap dengan simulasi pembayaran dan validasi alamat pengiriman.
- **Manajemen Toko (Seller):** Dashboard khusus penjual untuk mengelola produk (CRUD).
- **Wishlist:** Fitur simpan produk favorit untuk pembelian mendatang.

---

## 📂 Struktur Folder

Struktur direktori utama proyek ini:

```bash
BelanjaKu/
├── apps/
│   ├── backend/         # Server-side logic, API, Database migrations
│   │   ├── src/
│   │   │   ├── api/     # Controllers & Routes
│   │   │   ├── services/# Business Logic
│   │   │   └── database/# Models & Migrations
│   │   └── ...
│   │
│   └── frontend/        # Client-side interface
│       ├── src/
│       │   ├── app/     # App Router Pages
│       │   ├── components/ # Reusable UI Components
│       │   └── store/   # Global State (Zustand)
│       └── ...
│
└── ...
```

---

## 🚀 Cara Menjalankan Project

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di lingkungan lokal Anda.

### Prasyarat

- Node.js (v18+)
- PostgreSQL Database
- Git

### 1. Backend Setup

```bash
cd apps/backend

# Instal dependencies
npm install

# Setup Database
# Pastikan PostgreSQL sudah berjalan dan database 'belanjaku' sudah dibuat
npm run db:migrate  # Menjalankan migrasi database
npm run db:seed     # (Opsional) Mengisi data awal/dummy

# Menjalankan Server (Default: Port 5000)
npm run dev
```

### 2. Frontend Setup

```bash
cd apps/frontend

# Instal dependencies
npm install

# Menjalankan Client (Default: Port 3000)
npm run dev
```

Buka browser dan akses [http://localhost:3000](http://localhost:3000).

---

## � Environment Variables

Pastikan Anda membuat file `.env` (Backend) dan `.env.local` (Frontend) berdasarkan contoh berikut:

**Backend (`apps/backend/.env`)**

```env
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/belanjaku
JWT_SECRET=rahasia_super_aman
NODE_ENV=development
```

**Frontend (`apps/frontend/.env.local`)**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

## 🧪 Testing

Proyek ini dilengkapi dengan Unit Test untuk memastikan keandalan fitur dasar (terutama Backend).

**Menjalankan Test Backend:**

```bash
cd apps/backend
npm test
```

---

## 📌 Status Project

Status saat ini: **Stable (Main Branch)**

- ✅ Semua fitur inti (Auth, Produk, Cart, Checkout) berfungsi dengan baik.
- ✅ Integrasi Frontend dan Backend telah diverifikasi.
- ✅ Kode siap untuk pengembangan fitur lanjutan atau deployment.

---

Dibuat oleh Tim BelanjaKu
