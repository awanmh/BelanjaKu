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

-----

#### 🎨 Untuk Tim Frontend (UI/UX & Tampilan)

Tugas kalian hanya fokus di dalam folder `apps/frontend`. Jangan menyentuh folder backend.

1.  **Pindah ke Branch Frontend:**

    ```bash
    git checkout frontend-update
    ```

    *(Pastikan terminal menampilkan: "Switched to branch 'frontend-update'")*

2.  **Masuk ke Folder Kerja:**

    ```bash
    cd apps/frontend
    ```

3.  **Instalasi & Running (Harian):**

    ```bash
    npm install
    npm run dev
    ```

4.  **Cara Push Codingan (Simpan Pekerjaan):**
    Setelah selesai coding halaman/komponen tertentu:

    ```bash
    # 1. Pastikan Anda masih di branch yang benar
    git branch 
    # (Harus ada tanda bintang * di frontend-update)

    # 2. Masukkan perubahan ke antrian
    git add .

    # 3. Simpan dengan pesan yang jelas
    git commit -m "feat(frontend): membuat halaman login"
    # atau "style(frontend): memperbaiki layout navbar"

    # 4. Tarik update terbaru teman lain dulu (PENTING!)
    git pull origin frontend-update

    # 5. Kirim ke GitHub
    git push origin frontend-update
    ```

-----

### ⚠️ Aturan Penting (Wajib Baca)

1.  **Jangan Coding di `main`:** Branch `main` adalah branch suci yang hanya berisi kode gabungan yang sudah final. Jangan pernah push langsung ke `main`.
2.  **Selalu `git pull` Dulu:** Sebelum melakukan `git push`, biasakan melakukan `git pull origin <nama_branch>` untuk menghindari bentrok kode (*conflict*) dengan teman satu tim.
3.  **Perhatikan `.gitignore`:** Folder seperti `node_modules`, `.next`, atau `dist` **TIDAK BOLEH** di-push. File `.gitignore` sudah disiapkan untuk mencegah ini otomatis, jangan dihapus.
4.  **API URL:** Untuk tim Frontend, pastikan file `.env.local` Anda mengarah ke URL backend teman Anda (jika satu jaringan) atau localhost masing-masing.
5.  **Saat ingin push** usahakan update file `README.md` dan perbarui update-an apa yang dikerjakan dan to-do selanjutnya.

### Update
- Sudah membenahi error di fitur A.
- Fitur B sudah tahap awal/fondasi.
- Fitur C sudah aman.

### To-Do (example)
- Selanjutnya mengerjakan fitur A.
- Melanjutkan fitur B karena masih error
- Tambahkan bla-bla dibagian fitur C.

Selamat bekerja\! 🚀

-----
