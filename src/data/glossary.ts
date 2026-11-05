export interface GlossaryItem {
  term: string;
  definition: string;
  category: 'Algoritma' | 'Konsep Dasar' | 'Metrik';
}

export const GLOSSARY_DATA: GlossaryItem[] = [
  {
    term: "FCFS (First-Come, First-Served)",
    definition: "Algoritma penjadwalan I/O paling sederhana yang melayani permintaan disk sesuai urutan kedatangannya tanpa mengoptimalkan pergerakan head.",
    category: "Algoritma"
  },
  {
    term: "SSTF (Shortest Seek Time First)",
    definition: "Algoritma yang memilih permintaan dengan jarak trek terdekat dari posisi head saat ini untuk meminimalkan waktu pencarian (seek time).",
    category: "Algoritma"
  },
  {
    term: "SCAN (Elevator Algorithm)",
    definition: "Head disk bergerak terus ke satu arah melayani semua permintaan hingga menyentuh ujung disk, lalu berbalik arah melayani sisa permintaan.",
    category: "Algoritma"
  },
  {
    term: "C-SCAN (Circular SCAN)",
    definition: "Varian dari SCAN di mana head hanya melayani permintaan saat bergerak ke satu arah. Saat sampai di ujung, head langsung meluncur kembali ke awal tanpa melayani permintaan.",
    category: "Algoritma"
  },
  {
    term: "LOOK",
    definition: "Mirip dengan SCAN, tetapi head hanya bergerak sejauh permintaan trek terjauh di arah tersebut (tidak harus sampai menyentuh ujung fisik disk).",
    category: "Algoritma"
  },
  {
    term: "C-LOOK (Circular LOOK)",
    definition: "Kombinasi C-SCAN dan LOOK. Head bergerak melayani satu arah hingga permintaan terakhir, lalu melompat kembali ke permintaan paling awal di sisi sebelah.",
    category: "Algoritma"
  },
  {
    term: "Seek Time",
    definition: "Waktu yang dibutuhkan oleh head read/write disk untuk berpindah dari posisi trek saat ini ke posisi trek yang dituju.",
    category: "Metrik"
  },
  {
    term: "Total Head Movement",
    definition: "Jumlah akumulasi seluruh pergerakan lintasan/trek yang dilalui oleh head disk selama menyelesaikan seluruh antrean I/O.",
    category: "Metrik"
  }
];