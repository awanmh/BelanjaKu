# **Panduan Kontribusi untuk Proyek "belanjaKu"**

Terima kasih atas minat Anda untuk berkontribusi pada proyek "belanjaKu"\! Kami sangat menghargai waktu dan usaha yang Anda berikan. Setiap kontribusi, baik itu laporan bug, permintaan fitur, atau pull request, sangat berarti bagi kami.

Dokumen ini adalah panduan untuk membantu Anda selama proses kontribusi.

## **Daftar Isi**

* [Kode Etik](https://www.google.com/search?q=%23kode-etik)  
* [Bagaimana Cara Berkontribusi?](https://www.google.com/search?q=%23bagaimana-cara-berkontribusi)  
  * [Melaporkan Bug](https://www.google.com/search?q=%23melaporkan-bug)  
  * [Mengajukan Fitur Baru](https://www.google.com/search?q=%23mengajukan-fitur-baru)  
  * [Membuat Pull Request Pertama Anda](https://www.google.com/search?q=%23membuat-pull-request-pertama-anda)  
* [Panduan Gaya](https://www.google.com/search?q=%23panduan-gaya)  
  * [Pesan Commit Git](https://www.google.com/search?q=%23pesan-commit-git)  
  * [Gaya Kode](https://www.google.com/search?q=%23gaya-kode)  
* [Proses Pengembangan](https://www.google.com/search?q=%23proses-pengembangan)

## **Kode Etik**

Proyek ini dan semua partisipannya diatur oleh [Kode Etik](https://www.google.com/search?q=CODE_OF_CONDUCT.md) kami. Dengan berpartisipasi, Anda diharapkan untuk menjunjung tinggi kode etik ini. Harap laporkan perilaku yang tidak dapat diterima ke email proyek (project-admin@belanjaku.dev).

## **Bagaimana Cara Berkontribusi?**

### **Melaporkan Bug**

Sebelum melaporkan bug, pastikan untuk:

1. **Memeriksa Issues yang Ada**: Pastikan bug yang Anda temukan belum dilaporkan sebelumnya.  
2. **Memastikan Anda Menggunakan Versi Terbaru**: Cek apakah Anda menggunakan versi terbaru dari proyek dan dependensinya.

Jika bug tersebut belum dilaporkan, silakan buat *issue* baru dengan mengikuti template "Laporan Bug". Pastikan untuk menyertakan:

* Judul yang jelas dan deskriptif.  
* Langkah-langkah untuk mereproduksi bug.  
* Deskripsi perilaku yang diharapkan dan perilaku aktual yang terjadi.  
* Screenshot atau video jika memungkinkan.  
* Informasi tentang lingkungan Anda (sistem operasi, versi browser, versi Node.js, dll.).

### **Mengajukan Fitur Baru**

Kami selalu terbuka untuk ide-ide baru\! Jika Anda memiliki saran untuk fitur atau perbaikan, silakan:

1. **Memeriksa Issues yang Ada**: Pastikan ide Anda belum pernah diusulkan sebelumnya.  
2. Buat *issue* baru dengan template "Permintaan Fitur".  
3. Jelaskan secara detail masalah yang ingin Anda selesaikan dan bagaimana fitur yang Anda usulkan dapat menyelesaikannya.

### **Membuat Pull Request Pertama Anda**

Jika Anda ingin berkontribusi langsung ke kode, berikut adalah langkah-langkahnya:

1. **Fork Repositori**: Buat *fork* dari repositori utama ke akun GitHub Anda.  
2. **Clone Fork Anda**: Clone repositori yang sudah di-*fork* ke mesin lokal Anda.  
   git clone \[https://github.com/NAMA\_ANDA/belanjaku.git\](https://github.com/NAMA\_ANDA/belanjaku.git)

3. **Buat Branch Baru**: Buat *branch* baru dari main untuk perubahan Anda. Gunakan nama *branch* yang deskriptif.  
   git checkout \-b fitur/nama-fitur-yang-luar-biasa

   Atau untuk perbaikan bug:  
   git checkout \-b perbaikan/deskripsi-bug-singkat

4. **Lakukan Perubahan**: Lakukan perubahan kode yang diperlukan di *branch* baru Anda.  
5. **Commit Perubahan**: Lakukan *commit* terhadap perubahan Anda dengan pesan yang jelas (lihat [Panduan Gaya Pesan Commit](https://www.google.com/search?q=%23pesan-commit-git)).  
   git commit \-m "fitur: Menambahkan kemampuan login via Google"

6. **Push ke Fork Anda**: *Push* perubahan Anda ke repositori *fork* Anda di GitHub.  
   git push origin fitur/nama-fitur-yang-luar-biasa

7. **Buat Pull Request (PR)**: Buka repositori utama di GitHub dan buat *pull request* baru. Berikan judul dan deskripsi yang jelas untuk PR Anda, dan hubungkan dengan *issue* yang relevan jika ada.

## **Panduan Gaya**

### **Pesan Commit Git**

Gunakan format Conventional Commits. Ini membantu menjaga riwayat commit tetap teratur dan mudah dibaca.  
Formatnya adalah: \<tipe\>: \<deskripsi\>  
Contoh:

* fitur: Menambahkan validasi pada form registrasi  
* perbaikan: Mengatasi masalah layout pada halaman checkout  
* docs: Memperbarui panduan instalasi di README.md  
* refactor: Menyederhanakan logika pengambilan data produk

### **Gaya Kode**

* **TypeScript**: Ikuti praktik terbaik TypeScript. Gunakan tipe yang kuat dan hindari penggunaan any.  
* **React/Next.js**: Gunakan *functional components* dengan Hooks. Jaga agar komponen tetap kecil dan fokus pada satu tanggung jawab.  
* **Linting**: Proyek ini menggunakan ESLint dan Prettier. Pastikan untuk menjalankan npm run lint dan npm run format sebelum melakukan *commit* untuk memastikan kode Anda konsisten dengan gaya proyek.

## **Proses Pengembangan**

Setelah Anda membuat *pull request*, salah satu pengelola proyek akan meninjaunya. Kami mungkin akan memberikan umpan balik atau meminta perubahan. Setelah PR Anda disetujui dan semua pemeriksaan CI/CD berhasil, kami akan menggabungkannya ke *branch* main.

Terima kasih sekali lagi atas kontribusi Anda\!