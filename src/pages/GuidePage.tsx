import React, { useState } from 'react';
import { GLOSSARY_DATA } from '../data/glossary';

const cardStyle: React.CSSProperties = {
  padding: '1.5rem',
  border: '1px solid var(--color-line)',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text)',
  boxShadow: 'var(--shadow-card)',
};

const textStyle: React.CSSProperties = {
  color: 'var(--color-muted)',
  lineHeight: 1.6,
};

const inputStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  border: '1px solid var(--color-border)',
  borderRadius: '8px',
  backgroundColor: 'var(--color-bg)',
  color: 'var(--color-text)',
  font: 'inherit',
};

export const GuidePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'konsep' | 'penggunaan' | 'glosarium'>('konsep');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const filteredGlossary = GLOSSARY_DATA.filter(item => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Semua' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const tabs = [
    { id: 'konsep' as const, label: 'Konsep Dasar' },
    { id: 'penggunaan' as const, label: 'Cara Penggunaan' },
    { id: 'glosarium' as const, label: 'Glosarium Istilah' },
  ];

  const steps = [
    {
      step: '1',
      title: 'Pilih Algoritma',
      desc: 'Pilih salah satu algoritma penjadwalan disk (FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK) dari menu kontrol.',
    },
    {
      step: '2',
      title: 'Tentukan Posisi Awal Head',
      desc: 'Masukkan angka posisi awal trek disk tempat head saat ini berada.',
    },
    {
      step: '3',
      title: 'Input Antrean Permintaan (Queue)',
      desc: 'Masukkan daftar nomor trek disk yang ingin diakses, dipisahkan dengan koma atau spasi.',
    },
    {
      step: '4',
      title: 'Jalankan Simulasi & Analisis',
      desc: "Tekan tombol 'Jalankan Simulasi' untuk melihat animasi pergerakan head, garis grafik, dan metrik hasil perbandingan.",
    },
  ];

  return (
    <main
      style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        color: 'var(--color-text)',
      }}
    >
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1
          style={{
            fontSize: '2.25rem',
            fontWeight: 'bold',
            color: 'var(--color-text)',
          }}
        >
          Panduan dan Glosarium I/O Simulator
        </h1>

        <p style={{ ...textStyle, marginTop: '0.5rem' }}>
          Pelajari konsep dasar penjadwalan disk I/O, cara penggunaan simulator,
          dan istilah-istilah penting di sini.
        </p>
      </header>

      <nav
        aria-label="Navigasi panduan"
        style={{
          display: 'flex',
          gap: '1rem',
          borderBottom: '2px solid var(--color-line)',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: 'transparent',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                color: isActive
                  ? 'var(--color-accent)'
                  : 'var(--color-muted)',
                borderBottom: isActive
                  ? '3px solid var(--color-accent)'
                  : '3px solid transparent',
                marginBottom: '-2px',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {activeTab === 'konsep' && (
        <section style={{ display: 'grid', gap: '1.5rem' }}>
          <article style={cardStyle}>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: 'var(--color-text)',
                marginBottom: '0.5rem',
              }}
            >
              Apa itu Penjadwalan Disk I/O?
            </h3>

            <p style={textStyle}>
              Penjadwalan Disk I/O adalah teknik yang digunakan oleh sistem
              operasi untuk menentukan urutan eksekusi permintaan baca/tulis
              (read/write) pada disk penyimpanan. Tujuan utamanya adalah untuk
              meminimalkan seek time (waktu pencarian lintasan) dan meningkatkan
              efisiensi pergerakan head disk.
            </p>
          </article>

          <article style={cardStyle}>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: 'var(--color-text)',
                marginBottom: '0.5rem',
              }}
            >
              Mengapa Penjadwalan Disk Sangat Penting?
            </h3>

            <ul
              style={{
                ...textStyle,
                lineHeight: 1.8,
                paddingLeft: '1.25rem',
              }}
            >
              <li>
                <strong>Mengurangi Latensi:</strong> Meminimalkan waktu tunggu
                aplikasi saat meminta data dari memori sekunder.
              </li>
              <li>
                <strong>Mengoptimalkan Performa Sistem:</strong> Menghindari
                pergerakan head disk yang bolak-balik secara acak.
              </li>
              <li>
                <strong>Mencegah Starvation:</strong> Memastikan seluruh
                antrean permintaan terlayani secara adil.
              </li>
            </ul>
          </article>
        </section>
      )}

      {activeTab === 'penggunaan' && (
        <section style={{ display: 'grid', gap: '1rem' }}>
          {steps.map(item => (
            <article
              key={item.step}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1.25rem',
                border: '1px solid var(--color-line)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-on-accent, var(--color-on-navy))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                }}
              >
                {item.step}
              </div>

              <div>
                <h4
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: 'var(--color-text)',
                  }}
                >
                  {item.title}
                </h4>

                <p style={{ ...textStyle, marginTop: '0.25rem' }}>
                  {item.desc}
                </p>
              </div>
            </article>
          ))}
        </section>
      )}

      {activeTab === 'glosarium' && (
        <section>
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            <input
              type="text"
              placeholder="Cari istilah atau definisi..."
              aria-label="Cari istilah atau definisi"
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              style={{
                ...inputStyle,
                flex: '1',
                minWidth: '200px',
              }}
            />

            <select
              aria-label="Filter kategori glosarium"
              value={selectedCategory}
              onChange={event => setSelectedCategory(event.target.value)}
              style={inputStyle}
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Algoritma">Algoritma</option>
              <option value="Konsep Dasar">Konsep Dasar</option>
              <option value="Metrik">Metrik</option>
            </select>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1rem',
            }}
          >
            {filteredGlossary.map((item, index) => (
              <article
                key={`${item.term}-${index}`}
                style={{
                  border: '1px solid var(--color-line)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      color: 'var(--color-text)',
                    }}
                  >
                    {item.term}
                  </h4>

                  <span
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '0.25rem',
                      backgroundColor: 'var(--color-soft)',
                      color: 'var(--color-text)',
                      fontWeight: 600,
                    }}
                  >
                    {item.category}
                  </span>
                </div>

                <p
                  style={{
                    color: 'var(--color-muted)',
                    fontSize: '0.95rem',
                    lineHeight: 1.5,
                  }}
                >
                  {item.definition}
                </p>
              </article>
            ))}
          </div>

          {filteredGlossary.length === 0 && (
            <p
              style={{
                ...cardStyle,
                textAlign: 'center',
                color: 'var(--color-muted)',
              }}
            >
              Tidak ada istilah yang cocok dengan pencarian.
            </p>
          )}
        </section>
      )}
    </main>
  );
};