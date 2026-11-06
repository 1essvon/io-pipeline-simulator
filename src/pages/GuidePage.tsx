import React, { useState } from 'react';
import { GLOSSARY_DATA } from '../data/glossary';

export const GuidePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'konsep' | 'penggunaan' | 'glosarium'>('konsep');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const filteredGlossary = GLOSSARY_DATA.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {/* Header Halaman Panduan */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1e293b' }}>Panduan dan Glosarium I/O Simulator</h1>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
          Pelajari konsep dasar penjadwalan disk I/O, cara penggunaan simulator, dan istilah-istilah penting di sini.
        </p>
      </div>

      {/* Navigasi Tab */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e2e8f0', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('konsep')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            background: 'none',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            color: activeTab === 'konsep' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'konsep' ? '3px solid #2563eb' : '3px solid transparent',
            marginBottom: '-2px'
          }}
        >
          Konsep Dasar
        </button>
        <button
          onClick={() => setActiveTab('penggunaan')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            background: 'none',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            color: activeTab === 'penggunaan' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'penggunaan' ? '3px solid #2563eb' : '3px solid transparent',
            marginBottom: '-2px'
          }}
        >
          Cara Penggunaan
        </button>
        <button
          onClick={() => setActiveTab('glosarium')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            background: 'none',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            color: activeTab === 'glosarium' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'glosarium' ? '3px solid #2563eb' : '3px solid transparent',
            marginBottom: '-2px'
          }}
        >
          Glosarium Istilah
        </button>
      </div>

      {/* Konten Tab 1: Konsep Dasar */}
      {activeTab === 'konsep' && (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', backgroundColor: '#f8fafc' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }}>
              Apa itu Penjadwalan Disk I/O?
            </h3>
            <p style={{ color: '#334155', lineHeight: '1.6' }}>
              Penjadwalan Disk I/O adalah teknik yang digunakan oleh sistem operasi untuk menentukan urutan eksekusi 
              permintaan baca/tulis (read/write) pada disk penyimpanan. Tujuan utamanya adalah untuk meminimalkan 
              seek time (waktu pencarian lintasan) dan meningkatkan efisiensi pergerakan head disk.
            </p>
          </div>

          <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', backgroundColor: '#f8fafc' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }}>
              Mengapa Penjadwalan Disk Sangat Penting?
            </h3>
            <ul style={{ color: '#334155', lineHeight: '1.8', paddingLeft: '1.25rem' }}>
              <li><strong>Mengurangi Latensi:</strong> Meminimalkan waktu tunggu aplikasi saat meminta data dari memori sekunder.</li>
              <li><strong>Mengoptimalkan Performa Sistem:</strong> Menghindari pergerakan head disk yang bolak-balik secara acak.</li>
              <li><strong>Mencegah Starvation:</strong> Memastikan seluruh antrean permintaan terlayani secara adil.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Konten Tab 2: Cara Penggunaan */}
      {activeTab === 'penggunaan' && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {[
            { step: "1", title: "Pilih Algoritma", desc: "Pilih salah satu algoritma penjadwalan disk (FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK) dari menu kontrol." },
            { step: "2", title: "Tentukan Posisi Awal Head", desc: "Masukkan angka posisi awal trek disk tempat head saat ini berada." },
            { step: "3", title: "Input Antrean Permintaan (Queue)", desc: "Masukkan daftar nomor trek disk yang ingin diakses, dipisahkan dengan koma atau spasi." },
            { step: "4", title: "Jalankan Simulasi & Analisis", desc: "Tekan tombol 'Jalankan Simulasi' untuk melihat animasi pergerakan head, garis grafik, dan metrik hasil perbandingan." }
          ].map((item) => (
            <div key={item.step} style={{ display: 'flex', gap: '1rem', padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', backgroundColor: '#ffffff' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {item.step}
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0f172a' }}>{item.title}</h4>
                <p style={{ color: '#64748b', marginTop: '0.25rem' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Konten Tab 3: Glosarium Istilah */}
      {activeTab === 'glosarium' && (
        <div>
          {/* Filter & Pencarian */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Cari istilah atau definisi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '0.6rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', flex: '1', minWidth: '200px' }}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: '0.6rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.375rem', backgroundColor: '#fff' }}
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Algoritma">Algoritma</option>
              <option value="Konsep Dasar">Konsep Dasar</option>
              <option value="Metrik">Metrik</option>
            </select>
          </div>

          {/* List Glosarium */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {filteredGlossary.map((item, index) => (
              <div key={index} style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1.25rem', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0f172a' }}>{item.term}</h4>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', backgroundColor: '#e0f2fe', color: '#0369a1', fontWeight: '600' }}>
                    {item.category}
                  </span>
                </div>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.5' }}>{item.definition}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};