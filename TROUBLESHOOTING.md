# 🔧 Panduan Perbaikan BelanjaKu

## 📋 Ringkasan Permasalahan yang Ditemukan

### ✅ Masalah yang Sudah Diperbaiki:

1. **✓ Product Detail Page Error (Line 60)**
   - **Masalah**: Error saat fetch related products karena query parameter tidak sesuai
   - **Solusi**: Mengubah dari `category=${name}` menjadi `categoryId=${id}` dan menambahkan try-catch
   - **File**: `apps/frontend/src/app/(main)/products/[slug]/page.tsx`

2. **✓ Missing Category Data in Product Detail**
   - **Masalah**: Backend tidak mengirim data category saat get product by ID
   - **Solusi**: Menambahkan include category di `getProductById`
   - **File**: `apps/backend/src/services/product.service.ts`

### ⚠️ Masalah yang Perlu Anda Selesaikan Manual:

3. **Missing Environment File di Frontend**
   - **Lokasi**: `apps/frontend/.env.local`
   - **Isi yang diperlukan**:
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
     ```
   - **Cara**: Buat file `.env.local` di folder `apps/frontend/` dan copy isi di atas

---

## 🚀 Langkah-Langkah Setup & Verifikasi

### 1️⃣ Setup Environment Variables

#### Backend (.env sudah ada, pastikan isinya benar):
```bash
# File: apps/backend/.env
NODE_ENV=development
PORT=5000

# Database PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=yourpassword
DB_NAME=ecommerce_db

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_REFRESH_EXPIRES_IN=7d
```

#### Frontend (BUAT FILE BARU):
```bash
# File: apps/frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

### 2️⃣ Verifikasi Database PostgreSQL

**Pastikan PostgreSQL sudah running:**
```bash
# Windows - Cek service PostgreSQL
sc query postgresql-x64-14
```

**Buat database jika belum ada:**
```sql
-- Buka psql atau pgAdmin
CREATE DATABASE ecommerce_db;
```

**Test koneksi database:**
```bash
cd apps/backend
node check-db.js
```

---

### 3️⃣ Jalankan Migrasi Database

```bash
cd apps/backend
npm run db:migrate
```

**Jika ada error, reset database:**
```bash
npm run db:migrate:undo
npm run db:migrate
```

---

### 4️⃣ (Opsional) Seed Data Awal

```bash
cd apps/backend
npm run db:seed:all
```

---

### 5️⃣ Jalankan Backend

**Terminal 1 - Backend:**
```bash
cd apps/backend
npm run dev
```

**Verifikasi backend running:**
- Buka browser: http://localhost:5000
- Harus muncul: `{"message":"Welcome to BelanjaKu E-commerce API","version":"1.0.0"}`

---

### 6️⃣ Jalankan Frontend

**Terminal 2 - Frontend:**
```bash
cd apps/frontend
npm run dev
```

**Verifikasi frontend running:**
- Buka browser: http://localhost:3000
- Halaman home harus muncul

---

## 🧪 Testing Koneksi Frontend-Backend

### Test 1: Register User Baru
1. Buka: http://localhost:3000/auth/register
2. Isi form registrasi
3. Klik "Daftar Sekarang"
4. Jika berhasil → redirect ke login

### Test 2: Login
1. Buka: http://localhost:3000/auth/login
2. Login dengan akun yang baru dibuat
3. Jika berhasil → redirect ke home

### Test 3: View Product Detail
1. Klik salah satu produk di homepage
2. Halaman detail produk harus muncul tanpa error
3. Section "Kamu Mungkin Suka" harus muncul (jika ada produk related)

---

## 🔍 Troubleshooting

### Error: "Cannot connect to database"
**Solusi:**
1. Pastikan PostgreSQL service running
2. Cek kredensial di `.env` (DB_USER, DB_PASS, DB_NAME)
3. Jalankan: `psql -U postgres` untuk test koneksi

### Error: "ECONNREFUSED localhost:5000"
**Solusi:**
1. Pastikan backend running di terminal 1
2. Cek file `.env.local` di frontend sudah dibuat
3. Restart frontend setelah membuat `.env.local`

### Error: "Product not found" atau "Related products error"
**Solusi:**
1. Pastikan ada data produk di database
2. Jalankan seeder: `npm run db:seed:all` di folder backend
3. Atau buat produk manual melalui API/frontend

### Error: "Unauthorized" saat add to cart/wishlist
**Solusi:**
1. Pastikan sudah login
2. Cek localStorage di browser (F12 → Application → Local Storage)
3. Harus ada key `belanjaku-storage` dengan token

---

## 📊 Struktur Database

### Tables yang Harus Ada:
- ✓ users
- ✓ products
- ✓ categories
- ✓ orders
- ✓ order_items
- ✓ carts
- ✓ wishlists
- ✓ reviews
- ✓ sellers
- ✓ payments
- ✓ shipping_options
- ✓ promotions

**Cek tables di database:**
```sql
\dt  -- di psql
```

---

## 🎯 Checklist Verifikasi Akhir

- [ ] PostgreSQL service running
- [ ] Database `ecommerce_db` sudah dibuat
- [ ] File `.env` di backend sudah benar
- [ ] File `.env.local` di frontend sudah dibuat
- [ ] Migrasi database berhasil (semua tables ada)
- [ ] Backend running di http://localhost:5000
- [ ] Frontend running di http://localhost:3000
- [ ] Register user baru berhasil
- [ ] Login berhasil
- [ ] View product detail tanpa error
- [ ] Add to cart berhasil (setelah login)
- [ ] Add to wishlist berhasil (setelah login)

---

## 📝 Catatan Penting

1. **Selalu jalankan backend SEBELUM frontend**
2. **Restart frontend setelah membuat/mengubah `.env.local`**
3. **Jika ada perubahan di database model, jalankan migrasi ulang**
4. **Gunakan 2 terminal terpisah untuk backend dan frontend**

---

## 🆘 Jika Masih Ada Error

Jika masih ada error setelah mengikuti panduan ini:

1. **Screenshot error** yang muncul
2. **Copy error message** dari console/terminal
3. **Cek log** di terminal backend dan frontend
4. **Verifikasi** semua langkah di atas sudah diikuti

---

**Dibuat oleh**: Antigravity AI Assistant
**Tanggal**: 2025-12-16
**Project**: BelanjaKu E-commerce Platform
