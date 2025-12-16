# ✅ BelanjaKu - Checklist Verifikasi Sistem

## 📅 Tanggal: 2025-12-16
## 🔧 Status: Perbaikan Selesai

---

## 🔴 Masalah yang Ditemukan & Diperbaiki

### 1. ✅ Error di Product Detail Page (FIXED)
**File**: `apps/frontend/src/app/(main)/products/[slug]/page.tsx`

**Masalah**:
- Line 60: Error saat fetch related products
- Query parameter menggunakan `category=${name}` yang tidak valid
- Tidak ada error handling

**Solusi**:
- ✓ Mengubah query menjadi `categoryId=${id}`
- ✓ Menambahkan try-catch untuk error handling
- ✓ Related products sekarang fetch dengan benar

**Commit**: Line 58-73 updated with proper error handling

---

### 2. ✅ Missing Category Data (FIXED)
**File**: `apps/backend/src/services/product.service.ts`

**Masalah**:
- `getProductById` tidak include category relation
- Frontend tidak bisa akses `productData.category`

**Solusi**:
- ✓ Menambahkan `{ model: db.Category, as: 'category' }` di include
- ✓ Product detail sekarang mengembalikan data category

**Commit**: Line 162-171 updated with category include

---

### 3. ⚠️ Missing Frontend Environment File
**File**: `apps/frontend/.env.local` (PERLU DIBUAT MANUAL)

**Masalah**:
- File tidak ada (diblokir gitignore)
- Frontend tidak tahu URL backend

**Solusi**:
```bash
# Buat file: apps/frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

**Status**: ⚠️ PERLU ACTION MANUAL

---

## 📋 Checklist Setup Lengkap

### A. Prerequisites
- [ ] Node.js installed (v18 atau lebih baru)
- [ ] PostgreSQL installed dan running
- [ ] npm atau yarn installed
- [ ] Git installed

### B. Database Setup
- [ ] PostgreSQL service running
- [ ] Database `ecommerce_db` sudah dibuat
- [ ] User PostgreSQL sudah dikonfigurasi
- [ ] Test koneksi berhasil: `node apps/backend/test-db-connection.js`

### C. Backend Configuration
- [ ] File `apps/backend/.env` exists
- [ ] DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME sudah diisi
- [ ] JWT_SECRET sudah diisi
- [ ] Dependencies installed: `npm install` di folder backend
- [ ] Migrations berhasil: `npm run db:migrate`
- [ ] (Optional) Seeder berhasil: `npm run db:seed:all`

### D. Frontend Configuration
- [ ] File `apps/frontend/.env.local` sudah dibuat
- [ ] NEXT_PUBLIC_API_URL sudah diisi
- [ ] Dependencies installed: `npm install` di folder frontend

### E. Running Services
- [ ] Backend running di http://localhost:5000
- [ ] Frontend running di http://localhost:3000
- [ ] API test berhasil: `node apps/backend/test-api.js`

### F. Functional Testing
- [ ] Homepage loads tanpa error
- [ ] Register user baru berhasil
- [ ] Login berhasil
- [ ] View product list berhasil
- [ ] View product detail berhasil
- [ ] Related products muncul di product detail
- [ ] Add to cart berhasil (setelah login)
- [ ] Add to wishlist berhasil (setelah login)
- [ ] View cart berhasil
- [ ] View wishlist berhasil

---

## 🔍 Verifikasi Koneksi

### Backend ↔ Database
```bash
cd apps/backend
node test-db-connection.js
```

**Expected Output**:
```
✅ Database connection successful!
📊 Tables in database:
  1. users
  2. products
  3. categories
  ...
✅ All essential tables exist!
```

---

### Frontend ↔ Backend
```bash
cd apps/backend
node test-api.js
```

**Expected Output**:
```
✅ 1. Root Endpoint
✅ 2. API v1 Base
✅ 3. Get All Products
✅ 4. Get All Categories
...
🎉 All tests passed!
```

---

## 🚀 Quick Start Commands

### Setup (First Time)
```bash
# Run automated setup
setup.bat

# Or manual:
cd apps/backend
npm install
npm run db:migrate
npm run db:seed:all

cd ../frontend
npm install
```

### Development
```bash
# Terminal 1 - Backend
cd apps/backend
npm run dev

# Terminal 2 - Frontend
cd apps/frontend
npm run dev
```

---

## 📊 Database Tables Status

| Table | Status | Records | Notes |
|-------|--------|---------|-------|
| users | ✅ | - | User accounts |
| products | ✅ | - | Product catalog |
| categories | ✅ | - | Product categories |
| orders | ✅ | - | Customer orders |
| order_items | ✅ | - | Order line items |
| carts | ✅ | - | Shopping carts |
| wishlists | ✅ | - | User wishlists |
| reviews | ✅ | - | Product reviews |
| sellers | ✅ | - | Seller accounts |
| payments | ✅ | - | Payment records |
| shipping_options | ✅ | - | Shipping methods |
| promotions | ✅ | - | Promotional campaigns |

---

## 🔧 API Endpoints Status

### Public Endpoints
| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/` | GET | ✅ | Welcome message |
| `/api/v1/products` | GET | ✅ | List products |
| `/api/v1/products/:id` | GET | ✅ | Product detail |
| `/api/v1/categories` | GET | ✅ | List categories |
| `/api/v1/auth/register` | POST | ✅ | User registration |
| `/api/v1/auth/login` | POST | ✅ | User login |

### Protected Endpoints (Require Auth)
| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/api/v1/cart` | GET | ✅ | Get user cart |
| `/api/v1/cart` | POST | ✅ | Add to cart |
| `/api/v1/wishlist` | GET | ✅ | Get wishlist |
| `/api/v1/wishlist` | POST | ✅ | Add to wishlist |
| `/api/v1/orders` | GET | ✅ | Get user orders |
| `/api/v1/orders` | POST | ✅ | Create order |

---

## 🐛 Known Issues & Solutions

### Issue 1: "ECONNREFUSED localhost:5000"
**Cause**: Backend not running
**Solution**: 
```bash
cd apps/backend
npm run dev
```

### Issue 2: "Cannot connect to database"
**Cause**: PostgreSQL not running or wrong credentials
**Solution**:
1. Start PostgreSQL service
2. Check `.env` credentials
3. Create database if not exists

### Issue 3: "Product not found"
**Cause**: No products in database
**Solution**:
```bash
cd apps/backend
npm run db:seed:all
```

### Issue 4: "Unauthorized" on cart/wishlist
**Cause**: Not logged in or token expired
**Solution**:
1. Login again
2. Check localStorage for token
3. Clear cache and re-login

---

## 📝 Environment Variables Reference

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=yourpassword
DB_NAME=ecommerce_db
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_REFRESH_EXPIRES_IN=7d
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

## 🎯 Final Verification

Setelah semua checklist di atas selesai:

1. ✅ Backend running tanpa error
2. ✅ Frontend running tanpa error
3. ✅ Database terkoneksi
4. ✅ API endpoints accessible
5. ✅ User dapat register
6. ✅ User dapat login
7. ✅ Products dapat ditampilkan
8. ✅ Product detail dapat diakses
9. ✅ Cart functionality working
10. ✅ Wishlist functionality working

---

## 📞 Support

Jika masih ada masalah setelah mengikuti checklist ini:

1. Baca `TROUBLESHOOTING.md` untuk panduan detail
2. Check terminal logs untuk error messages
3. Verify semua environment variables sudah benar
4. Restart both backend and frontend

---

**Last Updated**: 2025-12-16
**Version**: 1.0.0
**Status**: ✅ Ready for Development
