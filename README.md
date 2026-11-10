# I/O Pipeline Simulator

Aplikasi web interaktif untuk mempelajari dan menyimulasikan algoritma penjadwalan disk (*Disk Scheduling Algorithms*) pada sistem operasi.

## Deskripsi Proyek

I/O Pipeline Simulator merupakan aplikasi pembelajaran yang membantu pengguna memahami bagaimana sistem operasi mengatur urutan permintaan akses disk (*disk I/O*).

Aplikasi menyediakan simulasi visual, perhitungan hasil penjadwalan, serta perbandingan beberapa algoritma disk scheduling untuk membantu pengguna memahami cara kerja setiap algoritma.

## Fitur Utama

- Simulasi enam algoritma disk scheduling.
- Visualisasi pergerakan head disk.
- Pengaturan daftar permintaan disk dan posisi awal head.
- Kontrol playback simulasi.
- Tampilan metrik hasil simulasi.
- Perbandingan hasil antaralgoritma.
- Halaman pembelajaran dan panduan penggunaan.

## Algoritma yang Didukung

1. **FCFS (First Come First Served)**
2. **SSTF (Shortest Seek Time First)**
3. **SCAN (Elevator Algorithm)**
4. **C-SCAN (Circular SCAN)**
5. **LOOK**
6. **C-LOOK**

## Teknologi yang Digunakan

- React
- TypeScript
- Vite
- CSS

## Persyaratan Sistem

Sebelum menjalankan aplikasi, pastikan perangkat telah memiliki:

- Node.js
- npm
- Git

## Instalasi

Clone repository:

```bash
git clone https://github.com/1essvon/io-pipeline-simulator.git
```

Masuk ke direktori proyek:

```bash
cd io-pipeline-simulator
```

Install dependencies:

```bash
npm install
```

Jalankan aplikasi dalam mode development:

```bash
npm run dev
```

Buka alamat lokal yang ditampilkan oleh Vite pada terminal.

## Pengujian

Menjalankan pengujian:

```bash
npm test
```

Menjalankan production build:

```bash
npm run build
```

## Cara Penggunaan

1. Buka aplikasi melalui browser.
2. Masuk ke halaman Simulator.
3. Pilih algoritma disk scheduling yang ingin dipelajari.
4. Atur posisi awal head dan daftar permintaan disk.
5. Jalankan simulasi.
6. Amati visualisasi pergerakan head dan hasil perhitungan.
7. Gunakan kontrol playback untuk melihat proses simulasi.
8. Buka halaman Comparison untuk membandingkan algoritma.

## Halaman Aplikasi

- **Beranda:** halaman pengenalan aplikasi.
- **Belajar:** materi pengenalan disk scheduling.
- **Simulator:** menjalankan simulasi algoritma.
- **Comparison:** membandingkan hasil algoritma.
- **Guide:** panduan penggunaan aplikasi.

## Demo Aplikasi

Aplikasi dapat diakses secara online melalui:

https://io-pipeline-simulator.vercel.app/

## Anggota Tim dan Pembagian Tugas

| No. | Anggota GitHub | Tanggung Jawab / Kontribusi |
|---|---|---|
| 1 | Faisal Affandi - 257006111124 | Integrasi Advanced Disk Scheduling Algorithms dan Core Engine. |
| 2 | Acep Haikal Fauzy - 257006111120 | MetricsPanel dan kerangka SimulatorPage (#1), serta UI halaman Simulator dan kontrol playback . |
| 3 | Muhammad Ilyas Maulana - 257006111102 | Kontribusi implementasi Basic Disk Scheduling Algorithms: FCFS, SSTF, dan SCAN . |
| 4 | Syahril Musthofa - 257006111099| Kontribusi integrasi algoritma C-SCAN, LOOK, dan C-LOOK . |
| 5 | Nazwa Zahra Aulia - 257006111125| Halaman Comparison dan Guide . |
| 6 | Kanisa Ayra Nabila - 257006111118 | Design System, Navbar, Beranda, dan halaman Belajar . |

## Repository

GitHub: https://github.com/1essvon/io-pipeline-simulator

---

**I/O Pipeline Simulator — Disk Scheduling Algorithm Learning Tool**
