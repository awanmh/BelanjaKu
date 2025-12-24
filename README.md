# 📋 Panduan Kontribusi Tim (SOP Git)

Halo Tim\! Berikut adalah cara bekerja di repositori ini. Kita memisahkan pengerjaan Backend dan Frontend di branch yang berbeda agar lebih rapi dan aman.

#### 1\. Persiapan Awal (Lakukan Sekali Saja)

1.  **Clone Repositori:**
    Buka terminal di folder tujuan Anda, lalu jalankan:

    ```bash
    git clone (https://github.com/awanmh/BelanjaKu.git)
    cd BelanjaKu
    ```

2.  **Ambil Semua Update Terbaru:**
    Agar laptop Anda mengenali branch baru yang sudah dibuat (`backend-update` & `frontend-update`):

    ```bash
    git fetch origin
    ```

---

#### 👨‍💻 Untuk Tim Backend (Server & Database)

Tugas kalian hanya fokus di dalam folder `apps/backend`. Jangan menyentuh folder frontend.

1.  **Pindah ke Branch Backend:**

    ```bash
    git checkout backend-update
    ```

    _(Pastikan terminal menampilkan: "Switched to branch 'backend-update'")_

2.  **Masuk ke Folder Kerja:**

    ```bash
    cd apps/backend
    ```

3.  **Instalasi & Running (Harian):**

    ```bash
    npm install
    npm run db:migrate  # Jika ada perubahan database
    npm run dev
    ```

4.  **Cara Push Codingan (Simpan Pekerjaan):**
    Setelah selesai coding fitur tertentu:

    ```bash
    # 1. Pastikan Anda masih di branch yang benar
    git branch
    # (Harus ada tanda bintang * di backend-update)

    # 2. Masukkan perubahan ke antrian
    git add .

    # 3. Simpan dengan pesan yang jelas
    git commit -m "feat(backend): menambahkan fitur X"
    # atau "fix(backend): memperbaiki bug Y"

    # 4. Tarik update terbaru teman lain dulu (PENTING!)
    git pull origin backend-update

    # 5. Kirim ke GitHub
    git push origin backend-update
    ```

---

### ⚠️ Aturan Penting (Wajib Baca)

1.  **Jangan Coding di `main`:** Branch `main` adalah branch suci yang hanya berisi kode gabungan yang sudah final. Jangan pernah push langsung ke `main`.
2.  **Selalu `git pull` Dulu:** Sebelum melakukan `git push`, biasakan melakukan `git pull origin <nama_branch>` untuk menghindari bentrok kode (_conflict_) dengan teman satu tim.
3.  **Perhatikan `.gitignore`:** Folder seperti `node_modules`, `.next`, atau `dist` **TIDAK BOLEH** di-push. File `.gitignore` sudah disiapkan untuk mencegah ini otomatis, jangan dihapus.
4.  **API URL:** Untuk tim Frontend, pastikan file `.env.local` Anda mengarah ke URL backend teman Anda (jika satu jaringan) atau localhost masing-masing.
5.  **Saat ingin push** usahakan update file `README.md` dan perbarui update-an apa yang dikerjakan dan to-do selanjutnya.

### Update (Latest Session - Backend Excellence)

**1. Core Backend Features:**

- **Product Variants (SKU Management):**
  - Implemented `ProductVariant` model and `product_variants` table via migration `20251224000005-create-variants-discussions.js`.
  - Updated `ProductService` to handle variant creation and updates.
  - Updated `products` table to allow robust SKU management.
- **Product Discussions (Q&A):**
  - Implemented `ProductDiscussion` model and `product_discussions` table via migration (same as above).
  - Added Controller, Service, and Routes for User Q&A on products.
- **Full-Text Search:**
  - Added `TSVECTOR` column `search_vector` and GIN Index to `products` table via migration `20251224000006-add-search-vector.js`.
  - Implemented high-performance search using `plainto_tsquery` in `APIFeatures`.
- **Real-Time Notifications:**
  - Integrated `socket.io` via `SocketGateway` for real-time updates.
  - Implemented `NotificationService` for managing user notifications.
- **Wishlist:**
  - Implemented `WishlistService` and endpoints for managing user favorites.
- **Seeding:**
  - Added `2025100601-demo-users.js` for seeding Admin, Seller, and User accounts.

**2. Quality Assurance (Unit Testing):**

- **ACHIEVEMENT:** Reached **100% Pass Rate** across all 23 Test Suites! 🟢
- **Fixes:**
  - Fixed `product.routes.test.ts`: Resolved Multipart/Form-Data validation issues (Error 422) and missing Database Associations (Error 500).
  - Fixed `order.routes.test.ts`: Updated promotion creation types.
  - Fixed `product.service.test.ts`: Added missing mocks for Transactions and FindByPk.
- **Coverage:** created comprehensive tests for `Wishlist`, `Notification`, and `ProductDiscussion`.

**3. Previous Updates:**

- Progress Search Bar: `2025120400-add-fulltext-search.js`
- Progress Notification Email: `20251204130950-add-reset-password-to-users.js`, `email.util.ts`, `email.util.test.ts`.

### To-Do (Next Steps)

#### 🖥️ Frontend Integration (Next.js)

- [ ] **Consume New APIs:** Integrasi endpoint baru (Product Discussions, Variants, Wishlist) ke UI.
- [ ] **Real-Time UI:** Implementasi `socket.io-client` di frontend untuk notifikasi real-time.
- [ ] **Search UI:** Membuat UI pencarian yang memanfaatkan endpoint full-text search backend.

#### 🛒 Shopping Cart (Keranjang)

- [ ] **Database:** Membuat file migrasi untuk tabel `carts` dan `cart_items` (Relasi ke User & Products).
- [ ] **API Endpoint:** Membuat CRUD untuk `api/v1/carts` (Add to cart, Update qty, Delete item).
- [ ] **Logic:** Implementasi logika sinkronisasi stok produk saat dimasukkan ke keranjang (opsional: reservasi stok).
- [ ] **CATATAN:** Sudah ada fitur cuman belum integrasi dengan frontend

#### 💳 Payment Gateway Integration (Midtrans/Xendit)

- [ ] **Integration:** Update `payment.service.ts` untuk request token pembayaran ke Payment Gateway (Mode Sandbox).
- [ ] **Webhook:** Membuat endpoint khusus untuk menangani Webhook/Callback dari Payment Gateway untuk update status pembayaran otomatis.
- [ ] **Security:** Memastikan validasi signature key pada Webhook agar aman.

#### 📍 User Address & Shipping

- [ ] **Shipping Calculation:** Integrasi `shipping.service.ts` dengan API Logistik (contoh: RajaOngkir) untuk menghitung biaya kirim real-time berdasarkan alamat terpilih.

Selamat bekerja! 🚀

---
