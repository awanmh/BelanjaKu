# 📋 Panduan Kontribusi Tim (SOP Git)

Halo Tim! Berikut adalah cara bekerja di repositori ini. Kita memisahkan pengerjaan Backend dan Frontend di branch yang berbeda agar lebih rapi dan aman.

#### 1. Persiapan Awal (Lakukan Sekali Saja)

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

### Update (Latest Session - Backend Frontend)

Membenahi logika dan tampilan untuk register/login sesuai dengan role dan integrasi dengan database.