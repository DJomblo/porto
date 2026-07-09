# Panduan Deploy ke Vercel (Deployment Guide)

Proyek porto Anda saat ini sudah berhasil di-upload ke GitHub di repository: **[DJomblo/porto](https://github.com/DJomblo/porto)**.

Berikut adalah dua pilihan (metode) termudah untuk mendeploy website porto Anda ke Vercel:

---

## 🚀 Metode A: Menggunakan Vercel Dashboard (Rekomendasi - Otomatis)

Metode ini adalah yang paling praktis karena setiap kali Anda melakukan `git push` ke GitHub, Vercel akan otomatis meng-update website Anda secara live (Continuous Deployment).

1. **Daftar/Masuk ke Vercel:**
   - Kunjungi [vercel.com](https://vercel.com/) dan buat akun menggunakan akun **GitHub** Anda.
2. **Import Proyek dari GitHub:**
   - Pada halaman Dashboard Vercel, klik tombol **"Add New..."** lalu pilih **"Project"**.
   - Cari repository bernama `porto` pada daftar repository GitHub Anda, lalu klik **"Import"**.
3. **Konfigurasi Proyek:**
   - **Framework Preset**: Pilih **Other** (karena ini adalah situs static HTML biasa).
   - **Root Directory**: Biarkan `./` (default).
   - **Build and Output Settings**: Biarkan default (kosong).
4. **Deploy:**
   - Klik tombol **"Deploy"**.
   - Tunggu sekitar 10-30 detik hingga proses deployment selesai.
   - Vercel akan memberikan domain gratis berakhiran `.vercel.app` (misal: `porto-xxx.vercel.app`) yang bisa langsung diakses publik!

---

## 🛠️ Metode B: Menggunakan Vercel CLI (Lewat Terminal)

Jika Anda ingin mendeploy langsung dari komputer Anda lewat terminal tanpa harus membuka browser dashboard:

1. **Install Vercel CLI secara global:**
   Buka terminal/PowerShell Anda dan jalankan perintah berikut:
   ```bash
   npm install -g vercel
   ```
2. **Login ke Akun Vercel melalui CLI:**
   Jalankan perintah login di terminal:
   ```bash
   vercel login
   ```
   Pilih metode login yang sesuai (misalnya menggunakan akun GitHub Anda).
3. **Mulai Deployment:**
   Pastikan Anda berada di direktori proyek (`d:\Website\porto`), lalu jalankan perintah:
   ```bash
   vercel
   ```
   Ikuti pertanyaan interaktif di terminal:
   - *Set up and deploy “d:\Website\porto”?* **Y**
   - *Which scope do you want to deploy to?* (pilih akun Anda)
   - *Link to existing project?* **N**
   - *What’s your project’s name?* **porto**
   - *In which directory is your code located?* `./`
   - *Want to modify these settings?* **N** (Vercel akan mendeteksi otomatis situs HTML statis Anda).
4. **Selesai:**
   Vercel CLI akan menyalin file Anda dan memberikan URL **Preview** (untuk testing).
5. **Deploy ke Production:**
   Jika semuanya sudah oke dan Anda ingin mengubahnya menjadi URL production tetap, jalankan:
   ```bash
   vercel --prod
   ```
