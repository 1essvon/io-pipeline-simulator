import React, { useState } from 'react';

interface MetricResult {
  algorithm: string;
  order: string;
  totalMovement: number;
  avgWaitTime: number;
  avgTurnaroundTime: number;
  throughput: number;
}

export const ComparisonPage: React.FC = () => {
  // Data sampel awal untuk tabel & grafik perbandingan
  const [metrics] = useState<MetricResult[]>([
    { algorithm: 'FCFS', order: '82 -> 170 -> 43 -> 140 -> 24', totalMovement: 460, avgWaitTime: 92.2, avgTurnaroundTime: 93.2, throughput: 1.0 },
    { algorithm: 'SSTF', order: '58 -> 43 -> 24 -> 82 -> 140 -> 170', totalMovement: 172, avgWaitTime: 34.4, avgTurnaroundTime: 35.4, throughput: 1.0 },
    { algorithm: 'SCAN', order: '58 -> 82 -> 140 -> 170 -> 199 -> 43 -> 24', totalMovement: 208, avgWaitTime: 41.6, avgTurnaroundTime: 42.6, throughput: 1.0 },
    { algorithm: 'C-SCAN', order: '58 -> 82 -> 140 -> 170 -> 199 -> 0 -> 24 -> 43', totalMovement: 248, avgWaitTime: 51.8, avgTurnaroundTime: 52.8, throughput: 1.0 },
    { algorithm: 'LOOK', order: '58 -> 82 -> 140 -> 170 -> 43 -> 24', totalMovement: 216, avgWaitTime: 43.0, avgTurnaroundTime: 44.0, throughput: 1.0 },
    { algorithm: 'C-LOOK', order: '58 -> 82 -> 140 -> 170 -> 24 -> 43', totalMovement: 190, avgWaitTime: 42.6, avgTurnaroundTime: 43.6, throughput: 1.0 },
  ]);

  const maxMovement = Math.max(...metrics.map(m => m.totalMovement));

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>Perbandingan Algoritma</h1>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
          Lihat dan bandingkan performa semua algoritma penjadwalan I/O dalam satu tampilan.
        </p>
      </div>

      {/* Tabel Perbandingan */}
      <div style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '0.5rem', border: '1px solid #e2e8f0', marginBottom: '2.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '0.75rem 1rem', color: '#475569' }}>Algoritma</th>
              <th style={{ padding: '0.75rem 1rem', color: '#475569' }}>Urutan Pelayanan</th>
              <th style={{ padding: '0.75rem 1rem', color: '#475569' }}>Total Head Movement</th>
              <th style={{ padding: '0.75rem 1rem', color: '#475569' }}>Rata-rata Waktu Tunggu</th>
              <th style={{ padding: '0.75rem 1rem', color: '#475569' }}>Rata-rata Turnaround</th>
              <th style={{ padding: '0.75rem 1rem', color: '#475569' }}>Throughput</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((row, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold', color: '#0f172a' }}>{row.algorithm}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#64748b', fontFamily: 'monospace' }}>{row.order}</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: '600', color: '#2563eb' }}>{row.totalMovement}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>{row.avgWaitTime}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>{row.avgTurnaroundTime}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>{row.throughput}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Visualisasi Grafik Batang */}
      <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', backgroundColor: '#ffffff' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '1.5rem' }}>
          Grafik Total Head Movement
        </h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', height: '200px', paddingBottom: '1rem', borderBottom: '2px solid #cbd5e1' }}>
          {metrics.map((item, index) => {
            const heightPercent = (item.totalMovement / maxMovement) * 100;
            return (
              <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.25rem' }}>
                  {item.totalMovement}
                </span>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '40px',
                    height: `${heightPercent}%`,
                    backgroundColor: '#3b82f6',
                    borderRadius: '0.25rem 0.25rem 0 0',
                    transition: 'height 0.3s ease'
                  }}
                />
                <span style={{ marginTop: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>
                  {item.algorithm}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};