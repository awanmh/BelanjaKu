# Setup Frontend BelanjaKu

Branch `frontend-setup` digunakan untuk pengembangan frontend aplikasi **BelanjaKu**.  
Dokumentasi ini menjelaskan cara melakukan **setup frontend**, **push**, dan **pull** ke branch ini.

## 1. Cara Menjalankan
Pastikan Backend Berjalan, di terminal backend :

```Bash
npm run dev
```

## 2. Setup Frontend:

- **Opsional**
  
Buka terminal baru, buat folder frontend (jika belum), masuk ke dalamnya, lalu inisialisasi dan instal dependensi manual sesuai package.json di atas, atau:

```Bash
# Opsional
npx create-next-app@latest frontend
# Pilih: TypeScript (Yes), ESLint (Yes), Tailwind (Yes), src/ (No), App Router (Yes), alias (default @/*)
    *Jika Anda menggunakan `create-next-app`, Anda tinggal menimpa file-file yang saya berikan di atas ke lokasi yang sesuai.*
```

- Instal Paket Tambahan:

```Bash
cd frontend
npm install axios zustand lucide-react clsx tailwind-merge
```

- Jalankan Frontend:

```Bash
npm run dev
```

Buka browser di `http://localhost:3000`. Jika backend Anda berjalan dengan benar, Anda akan melihat halaman beranda yang mencoba mengambil produk dari database.

## Cara push dan pull ke github

### Update Dokumentasi (README.md)

Sebelum melakukan `git push`, pastikan `README.md` sudah diperbarui sesuai perubahan terbaru.

### Langkah-langkah:

1. Edit file README.md untuk menambahkan dokumentasi perubahan.
   ```bash
   code README.md

### Tambahan
- Biasakan setiap kali ada perubahan besar (misalnya setup library baru, konfigurasi, to-do untuk pengerjaan selanjutnya, atau cara run project), langsung update README.md.

- Gunakan pesan commit yang jelas seperti:  
  - `"Update README.md: tambah instruksi install axios"`  
  - `"Update README.md: cara run frontend dengan Next.js"`

- Tambahkan juga branch baru jika dirasa dibutuhkan
Buat branch baru (misalnya frontend-feature-navbar):

```bash
git checkout -b frontend-feature-navbar
```
**Cara Push Branch Baru ke GitHub**

- Tambahkan perubahan:

```bash
git add .
```
- Commit dengan pesan yang jelas:

```bash
git commit -m "Menambahkan komponen Navbar di frontend"
```
- Push branch baru ke GitHub:

```bash
git push origin frontend-feature-navbar
```

### Pull (Menarik perubahan dari remote)

Sebelum mulai coding, pastikan branch lokal tersinkron dengan branch remote:

```bash
# Pindah ke branch frontend-setup
git checkout frontend-setup

# Tarik perubahan terbaru dari remote
git pull origin frontend-setup
```

---

### Push (Mengirim perubahan ke remote)

Setelah melakukan perubahan di frontend, ikuti langkah berikut:

```bash
# Tambahkan file yang diubah
git add .

# Commit perubahan dengan pesan yang jelas
git commit -m "Deskripsi perubahan frontend"

# Push ke branch frontend-setup di GitHub
git push origin frontend-setup
```

---

### Catatan Penting

- **Jangan commit `node_modules/`, `.next/`, atau file build.** Pastikan `.gitignore` sudah benar.
- Selalu lakukan `git pull` sebelum `git push` untuk menghindari konflik.
- Gunakan pesan commit yang deskriptif agar mudah dilacak.
- Jika terjadi konflik saat `git pull`, selesaikan manual di file yang bentrok lalu jalankan:
  ```bash
  git add .
  git commit -m "Resolve merge conflict"
  git push origin frontend-setup
  ```

---

### Contoh Alur Kerja

1. Tarik perubahan terbaru:
   ```bash
   git pull origin frontend-setup
   ```
2. Edit file frontend sesuai kebutuhan.
3. Tambahkan dan commit:
   ```bash
   git add .
   git commit -m "Menambahkan komponen Navbar"
   ```
4. Push ke GitHub:
   ```bash
   git push origin frontend-setup
   ```

---

Dengan panduan ini, semua anggota tim bisa konsisten bekerja di branch `frontend-setup` tanpa masalah konflik atau file besar yang tidak perlu.
