# Proyek E-commerce BelanjaKu (Monorepo)

Selamat datang di BelanjaKu, sebuah proyek e-commerce lengkap yang
dibangun dengan arsitektur monorepo menggunakan PNPM Workspaces. Proyek
ini mencakup aplikasi frontend yang dibuat dengan Next.js (App Router)
dan backend dengan Node.js (Express), serta didukung oleh PostgreSQL dan
Redis yang berjalan di Docker.

## Struktur Proyek

Berikut adalah gambaran umum struktur direktori dalam monorepo ini:
```
belanjaKu/  
├── 📂 apps/  
│ ├── 📂 frontend/ \# Proyek Next.js  
│ │ ├── 📂 app/  
│ │ │ ├── 📂 (main)/ \# Grup route utama dengan layout  
│ │ │ │ ├── 📂 products/  
│ │ │ │ │ └── 📂 \[slug\]/  
│ │ │ │ │ └── page.tsx \# Halaman Detail Produk Dinamis  
│ │ │ │ ├── 📂 cart/  
│ │ │ │ │ └── page.tsx  
│ │ │ │ ├── 📂 checkout/  
│ │ │ │ │ └── page.tsx  
│ │ │ │ ├── 📂 profile/  
│ │ │ │ │ └── page.tsx  
│ │ │ │ └── layout.tsx \# Layout utama (Navbar, Footer)  
│ │ │ ├── page.tsx \# Halaman Beranda (Homepage)  
│ │ │ └── layout.tsx \# Layout root  
│ │ ├── 📂 components/  
│ │ │ ├── 📂 ui/ \# Komponen UI generik (Button, Card, Input)  
│ │ │ ├── 📂 product/ \# Komponen spesifik untuk Halaman Produk  
│ │ │ └── 📂 layout/  
│ │ │ ├── Navbar.tsx  
│ │ │ └── Footer.tsx  
│ │ ├── 📂 lib/ \# Helpers, utils, koneksi API client  
│ │ └── 📂 store/ \# State management (Zustand)  
│ │  
│ └── 📂 backend/ \# Proyek Node.js (Express)  
│ ├── 📂 src/  
│ │ ├── 📂 api/ \# Router & Controllers  
│ │ ├── 📂 config/ \# Konfigurasi (database, env)  
│ │ ├── 📂 database/  
│ │ │ ├── 📂 models/ \# Model database  
│ │ │ ├── 📂 migrations/  
│ │ │ └── 📂 seeders/  
│ │ ├── 📂 middlewares/ \# Middleware (auth JWT, error handling)  
│ │ ├── 📂 services/ \# Logika bisnis  
│ │ ├── 📂 utils/ \# Fungsi helper  
│ │ └── server.ts \# Entry point server  
│ └── .env.example  
│  
├── 📂 packages/  
│ └── 📂 ui/ \# (Opsional) Komponen UI bersama  
│  
├── docker-compose.yml \# Konfigurasi Docker untuk Postgres & Redis  
├── package.json \# Konfigurasi monorepo & script utama  
├── pnpm-workspace.yaml \# Mendefinisikan workspaces  
└── tsconfig.base.json \# Konfigurasi TypeScript dasar
```
## Panduan Setup Proyek

Ikuti langkah-langkah berikut untuk menyiapkan dan menjalankan proyek di
lingkungan lokal Anda.

### Prasyarat

Pastikan perangkat lunak berikut sudah terinstal di sistem Anda:

1.  **Node.js** (v18 atau lebih baru)

2.  **pnpm** (npm install -g pnpm)

3.  **Docker** dan **Docker Compose**

4.  **Git**

### Langkah 1: Inisialisasi Monorepo

#### 1.  Buat package.json di root. Buka terminal di direktori root proyek (belanjaKu/) dan jalankan:
    
    
    pnpm init
    

#### 2.  Konfigurasi package.json
       
        {
           "name": "belanjaku-monorepo",
           "private": true,
           "version": "1.0.0",
           "description": "Proyek E-commerce BelanjaKu",
           "scripts": {
           "dev": "pnpm --parallel --stream dev",
           "build": "pnpm --filter \"./apps/*\" build"
           },
           "devDependencies": {
           "turbo": "^1.10.16" # Opsional, untuk build & dev yang lebih cepat
           }
        }

#### 3.  Definisikan Workspace. Buat file `pnpm-workspace.yaml` di direktori root untuk memberitahu
pnpm di mana aplikasi dan package kita berada.  
    ````
    packages:
      - 'apps/*'
      - 'packages/*'
    ````
### Langkah 2: Setup Database & Cache dengan Docker {#langkah-2-setup-database-cache-dengan-docker}

Kita akan menggunakan Docker untuk menjalankan PostgreSQL dan Redis agar
tidak perlu menginstalnya secara manual.

1.  **Buat file docker-compose.yml** di direktori root.  
        
        version: '3.8'
        services:
          postgres-db:
            image: postgres:15-alpine
            container_name: belanjaku_db
            restart: always
            environment:
                POSTGRES_USER: admin
                POSTGRES_PASSWORD: password123
                POSTGRES_DB: belanjaku_dev
            ports:
                - "5432:5432"
            volumes:
                - postgres_data:/var/lib/postgresql/data
        
          redis-cache:
            image: redis:7-alpine
            container_name: belanjaku_cache
            restart: always
            ports:
            - "6379:6379"
            volumes:
            - redis_data:/data
        
        volumes:
          postgres_data:
          redis_data:
        
2.  Jalankan Container  
    - Buka terminal di root proyek dan jalankan
        ```
      docker-compose up -d     
        ```
    - Database dan cache Anda sekarang sudah berjalan di background.

### Langkah 3: Setup Backend (Node.js & Express) {#langkah-3-setup-backend-node.js-express}

1.  Inisialisasi Proyek Backend. Dari direktori root (belanjaKu/), jalankan perintah berikut:
    ```
    # Inisialisasi proyek Node.js  
    pnpm init  
       
    # Install dependencies utama  
    pnpm add express cors dotenv jsonwebtoken pg redis  
       
    # Install dev dependencies  
    pnpm add -D typescript ts-node nodemon @types/express @types/node @types/pg
    ```
3.  Konfigurasi TypeScript. Buat file `tsconfig.json` di dalam `apps/backend/`.  
    ```
    {
      "compilerOptions": {
        "target": "es6",
        "module": "commonjs",
        "outDir": "./dist",
        "rootDir": "./src",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true
      },
      "include": ["src/**/*"]
    }
    ```

4.  Variabel Lingkungan. Buat file `.env.example` di `apps/backend/`. Salin file ini menjadi `.env` untuk penggunaan lokal.  
    ```
    # Server
    PORT=5000
    
    # Database (sesuai docker-compose.yml)
    DB_HOST=localhost
    DB_USER=admin
    DB_PASSWORD=password123
    DB_NAME=belanjaku_dev
    DB_PORT=5432
    
    # Redis (sesuai docker-compose.yml)
    REDIS_URL=redis://localhost:6379
    
    # JWT
    JWT_SECRET=rahasia-banget-jangan-disebar
    ```
6.  Tambahkan Scripts. Tambahkan scripts ke `apps/backend/package.json`.
    ```  
      "scripts": {
        "dev": "nodemon src/server.ts",
        "build": "tsc",
        "start": "node dist/server.js"
      }
    ``` 
   Setelah ini, Anda bisa mulai mengisi direktori src/ sesuai struktur di atas.

### Langkah 4: Setup Frontend (Next.js) {#langkah-4-setup-frontend-next.js}

1.  Buat Proyek Next.js. Kembali ke direktori root (belanjaKu/), lalu jalankan:  
    ```
    # Gunakan pnpm untuk membuat aplikasi Next.js  
    pnpm create next-app apps/frontend  
    ```   
     Saat proses instalasi, pilih opsi berikut:

    - ✔ Would you like to use TypeScript? **Yes**

    - ✔ Would you like to use ESLint? **Yes**

    - ✔ Would you like to use Tailwind CSS? **Yes**

    - ✔ Would you like to use src/ directory? **No**

    - ✔ Would you like to use App Router? **Yes**

    - ✔ Would you like to customize the default import alias? **No**

3.  Variabel Lingkungan. Buat file .env.local di apps/frontend/ dengan isi berikut:  
    ```
    NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
    ```
5.  Update Scripts (Opsional). Pastikan script di `apps/frontend/package.json` sudah sesuai. Biasanya sudah benar secara default.  
    ```
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "next lint"
    }
    ```
### Langkah 5: Menjalankan Keseluruhan Proyek 🚀 {#langkah-5-menjalankan-keseluruhan-proyek}

Setelah semua setup selesai, Anda bisa menjalankan kedua aplikasi secara
bersamaan.

1.  **Kembali ke direktori root** proyek belanjaKu/.

2.  **Instal semua dependencies** untuk seluruh workspace.  
    ```
    pnpm install
    ```
4.  **Jalankan server pengembangan** untuk backend dan frontend.  
    ```
    pnpm dev
    ```    
    Terminal akan menampilkan log dari kedua aplikasi. Frontend akan berjalan di `http://localhost:3000` dan backend di `http://localhost:5000`. Selamat! Proyek Anda sudah siap untuk dikembangkan.
