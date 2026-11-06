import { Link } from 'react-router-dom';

const WHY = [
  { title: 'Mudah dipahami', text: 'Konsep rumit dijelaskan dengan bahasa sederhana.' },
  { title: 'Interaktif', text: 'Ubah data dan algoritma, lihat hasilnya langsung.' },
  { title: 'Komprehensif', text: 'Enam algoritma dengan perbandingan hasil.' },
  { title: 'Cocok untuk semua', text: 'Mahasiswa, pelajar, hingga pengguna umum.' },
];

export default function HomePage() {
  return (
    <div className="container">
      <section className="hero">
        <div>
          <span className="pill">Selamat datang di</span>
          <h1 style={{ marginTop: 14 }}>I/O Pipeline <span className="hero__accent">Simulator</span></h1>
          <p className="hero__lead">Pelajari cara kerja penjadwalan disk I/O lewat simulasi interaktif yang mudah dipahami.</p>
          <ul className="checklist">
            <li>Visualisasi pergerakan disk head</li>
            <li>6 algoritma penjadwalan</li>
            <li>Metrik lengkap dan perbandingan</li>
            <li>Panduan konsep dengan bahasa sederhana</li>
          </ul>
          <div className="hero__actions">
            <Link className="btn btn--primary" to="/belajar">Mulai belajar</Link>
            <Link className="btn" to="/simulator">Langsung simulasi</Link>
          </div>
        </div>
        <svg viewBox="0 0 320 260" role="img" aria-label="Ilustrasi disk dan disk head">
          <ellipse cx="160" cy="200" rx="130" ry="36" fill="var(--color-soft)" />
          <ellipse cx="160" cy="150" rx="100" ry="38" fill="var(--color-navy)" />
          <rect x="60" y="100" width="200" height="50" fill="var(--color-navy)" />
          <ellipse cx="160" cy="100" rx="100" ry="38" fill="var(--color-pink)" />
          <ellipse cx="160" cy="100" rx="70" ry="25" fill="none" stroke="#051F45" strokeWidth="2" opacity=".35" />
          <ellipse cx="160" cy="100" rx="12" ry="5" fill="#051F45" />
          <path d="M262 40 L190 96" stroke="var(--color-navy)" strokeWidth="9" strokeLinecap="round" />
          <circle cx="262" cy="40" r="10" fill="var(--color-pink)" stroke="var(--color-navy)" strokeWidth="3" />
        </svg>
      </section>

      <h2>Mengapa penting?</h2>
      <div className="grid-4">
        {WHY.map((w) => (
          <div className="card" key={w.title}><h3>{w.title}</h3><p>{w.text}</p></div>
        ))}
      </div>
    </div>
  );
}
