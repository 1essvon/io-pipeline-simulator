export type LessonCategory = 'konsep' | 'algoritma' | 'analisis';

export interface Lesson {
  id: string;
  title: string;
  category: LessonCategory;
  summary: string;
  paragraphs: string[];
  /** Contoh dengan head awal 50, arah naik, silinder 0–199, permintaan 82, 170, 43, 140, 24 */
  example?: string;
  keyPoint?: string;
}

export const lessons: Lesson[] = [
  {
    id: 'pengenalan-io',
    title: 'Apa itu I/O?',
    category: 'konsep',
    summary: 'Pertukaran data antara komputer dan penyimpanan.',
    paragraphs: [
      'I/O (input/output) adalah proses pertukaran data atau permintaan antara komputer, program, dan perangkat yang digunakan.',
      'Saat kamu membuka sebuah foto, program meminta komputer membaca data foto dari penyimpanan. Data itu lalu diproses dan ditampilkan di layar.',
    ],
    keyPoint: 'Aplikasi ini adalah simulasi edukasi. Ia tidak mengendalikan atau mengukur disk fisik.',
  },
  {
    id: 'antrean-pipeline',
    title: 'Antrean dan pipeline',
    category: 'konsep',
    summary: 'Tahapan sebuah permintaan sampai selesai.',
    paragraphs: [
      'Pipeline adalah rangkaian tahap yang dilalui suatu proses dari awal sampai selesai.',
      'Permintaan I/O dibuat, masuk ke antrean, dipilih oleh algoritma penjadwalan, diproses oleh disk, lalu dinyatakan selesai.',
    ],
  },
  {
    id: 'disk-head',
    title: 'Disk head dan silinder',
    category: 'konsep',
    summary: 'Siapa yang bergerak, dan ke mana.',
    paragraphs: [
      'Silinder (cylinder) adalah lokasi fisik pada disk tempat data disimpan. Disk head adalah bagian yang bergerak ke silinder tertentu untuk membaca atau menulis data.',
      'Makin jauh head harus bergerak, makin lama waktu yang dibutuhkan. Karena itu urutan pelayanan sangat berpengaruh.',
    ],
    keyPoint: 'Dalam simulator, pindah satu silinder butuh 1 unit waktu dan melayani satu permintaan butuh 1 unit waktu.',
  },
  {
    id: 'fcfs',
    title: 'FCFS',
    category: 'algoritma',
    summary: 'First-Come, First-Served: sesuai urutan datang.',
    paragraphs: [
      'Permintaan dilayani sesuai urutan awalnya. Algoritma ini sederhana dan adil dalam urutan, tetapi head bisa bolak-balik jauh.',
    ],
    example: 'Urutan 82 → 170 → 43 → 140 → 24. Total perpindahan head 460 silinder.',
  },
  {
    id: 'sstf',
    title: 'SSTF',
    category: 'algoritma',
    summary: 'Shortest Seek Time First: pilih yang terdekat.',
    paragraphs: [
      'Permintaan yang paling dekat dengan posisi head dipilih lebih dulu. Jika jaraknya sama, permintaan yang muncul lebih awal dalam urutan awal dipilih.',
      'Perpindahan head biasanya kecil, tetapi permintaan yang jauh bisa menunggu sangat lama.',
    ],
    example: 'Urutan 43 → 24 → 82 → 140 → 170. Total perpindahan head 172 silinder.',
  },
  {
    id: 'scan',
    title: 'SCAN',
    category: 'algoritma',
    summary: 'Seperti lift: satu arah sampai batas, lalu berbalik.',
    paragraphs: [
      'Head bergerak ke satu arah sambil melayani permintaan yang dilewati. Head terus sampai batas fisik disk, baru berbalik arah.',
    ],
    example: 'Arah naik: 82 → 140 → 170 → batas 199 → 43 → 24. Total 324 silinder.',
  },
  {
    id: 'cscan',
    title: 'C-SCAN',
    category: 'algoritma',
    summary: 'SCAN melingkar: kembali ke ujung seberang.',
    paragraphs: [
      'Head melayani permintaan dalam satu arah. Di batas disk, head pindah ke batas seberang tanpa melayani apa pun, lalu melanjutkan arah yang sama.',
      'Perpindahan wrap tetap dihitung sebagai jarak dan waktu.',
    ],
    example: 'Arah naik: 82 → 140 → 170 → 199, wrap ke 0, lalu 24 → 43. Total 391 silinder.',
  },
  {
    id: 'look',
    title: 'LOOK',
    category: 'algoritma',
    summary: 'SCAN yang berbalik di permintaan terjauh.',
    paragraphs: [
      'Mirip SCAN, tetapi head hanya bergerak sampai permintaan terjauh pada arah itu, lalu berbalik. Head tidak perlu menuju batas fisik disk.',
    ],
    example: 'Arah naik: 82 → 140 → 170, berbalik, lalu 43 → 24. Total 266 silinder.',
  },
  {
    id: 'clook',
    title: 'C-LOOK',
    category: 'algoritma',
    summary: 'C-SCAN yang melompat antar permintaan terjauh.',
    paragraphs: [
      'Mirip C-SCAN, tetapi head melompat dari permintaan terjauh di satu sisi ke permintaan terjauh di sisi lain, bukan ke batas fisik disk.',
    ],
    example: 'Arah naik: 82 → 140 → 170, lompat ke 24, lalu 43. Total 285 silinder.',
  },
  {
    id: 'metrik',
    title: 'Metrik dan analisis',
    category: 'analisis',
    summary: 'Cara membaca hasil simulasi.',
    paragraphs: [
      'Total head movement adalah jumlah jarak perpindahan head. Waiting time adalah waktu sejak permintaan tiba sampai mulai dilayani. Turnaround time adalah waktu sejak tiba sampai selesai.',
      'Throughput adalah jumlah permintaan selesai per satuan waktu. Waktu tunggu maksimum menunjukkan permintaan yang paling lama menunggu.',
    ],
    keyPoint: 'Angka terkecil bukan satu-satunya ukuran. Bandingkan beberapa metrik sebelum menyimpulkan.',
  },
];

/* ---- Progres belajar (localStorage) ---- */
export const PROGRESS_KEY = 'iops.progress';
/** Ubah ke true jika tim memutuskan simulator baru terbuka setelah materi dasar selesai. */
export const SIMULATOR_GATE_ENABLED = false;
export const PREREQUISITE_IDS = ['pengenalan-io', 'antrean-pipeline', 'disk-head'];

export function loadProgress(): string[] {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function saveProgress(done: string[]): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(done));
  } catch {
    /* abaikan */
  }
}

export function isSimulatorUnlocked(done: string[] = loadProgress()): boolean {
  return !SIMULATOR_GATE_ENABLED || PREREQUISITE_IDS.every((id) => done.includes(id));
}
