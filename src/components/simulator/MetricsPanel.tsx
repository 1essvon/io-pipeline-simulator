import type { SimulationMetrics } from "../../algorithms/types";
import "./simulator.css";

interface MetricsPanelProps {
  metrics: SimulationMetrics | null;
}

function formatNumber(value: number, digits = 1): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(digits);
}

export function MetricsPanel({ metrics }: MetricsPanelProps) {
  if (!metrics) {
    return (
      <section className="metrics-panel">
        <h2>Metrik Hasil</h2>
        <p className="metrics-empty">
          Jalankan simulasi untuk melihat metrik.
        </p>
      </section>
    );
  }

  const items = [
    { label: "Total Head Movement", value: formatNumber(metrics.totalHeadMovement), unit: "silinder" },
    { label: "Rata-rata Waktu Tunggu", value: formatNumber(metrics.averageWaitingTime), unit: "unit waktu" },
    { label: "Rata-rata Turnaround Time", value: formatNumber(metrics.averageTurnaroundTime), unit: "unit waktu" },
    { label: "Rata-rata Response Time", value: formatNumber(metrics.averageResponseTime), unit: "unit waktu" },
    { label: "Waktu Tunggu Maksimum", value: formatNumber(metrics.maxWaitingTime), unit: "unit waktu" },
    { label: "Throughput", value: formatNumber(metrics.throughput, 2), unit: "permintaan/unit waktu" },
    { label: "Total Waktu Simulasi", value: formatNumber(metrics.totalSeekTime), unit: "unit waktu" },
  ];

  return (
    <section className="metrics-panel">
      <h2>Metrik Hasil</h2>
      <div className="metrics-grid">
        {items.map((item) => (
          <div className="metric-card" key={item.label}>
            <span className="metric-label">{item.label}</span>
            <strong className="metric-value">{item.value}</strong>
            <span className="metric-unit">{item.unit}</span>
          </div>
        ))}
      </div>
    </section>
  );
}