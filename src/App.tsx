
import { useState } from "react";
import "./App.css";
import { runSimulation } from "./engine/simulationEngine";
import type { SimulationResult } from "./algorithms/types";
import { calculateMetrics } from "./engine/metricsEngine";

const algorithms = ["FCFS", "SSTF", "SCAN", "C-SCAN", "LOOK", "C-LOOK"];

function App() {
  const [algorithm, setAlgorithm] = useState("FCFS");
  const [initialHead, setInitialHead] = useState("50");
  const [requests, setRequests] = useState("82, 170, 43, 140, 24, 16, 190");
  const [simulationResult, setSimulationResult] =
  useState<SimulationResult | null>(null);
  const [completedRequests, setCompletedRequests] = useState<
  { id: string; cylinder: number; arrivalTime: number }[] | null
>(null);
  const [simulationError, setSimulationError] = useState("");

  const metrics =
  simulationResult && completedRequests
    ? calculateMetrics(
        completedRequests,
        simulationResult.steps,
        simulationResult.totalHeadMovement,
      )
    : null;

  const requestList = requests
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  function handleRunSimulation() {
    setSimulationResult(null);
    setCompletedRequests(null);
    setSimulationError("");

    const head = Number(initialHead);
    const cylinders = requests.split(",").map((value) => value.trim());

    if (
      initialHead.trim() === "" ||
      !Number.isInteger(head) ||
      head < 0 ||
      cylinders.length === 0 ||
      cylinders.some(
        (value) => value === "" || !Number.isInteger(Number(value)),
      )
    ) {
      setSimulationError(
        "Periksa kembali posisi awal head dan antrean cylinder.",
      );
      return;
    }

    const input = {
      algorithm: algorithm as (typeof algorithms)[number] as
        | "FCFS"
        | "SSTF"
        | "SCAN"
        | "C-SCAN"
        | "LOOK"
        | "C-LOOK",
      requests: cylinders.map((value, index) => ({
        id: `R${index + 1}`,
        cylinder: Number(value),
        arrivalTime: 0,
      })),
      config: {
        initialHead: head,
        minCylinder: 0,
        maxCylinder: 199,
        direction: "up" as const,
        serviceTime: 1,
      },
    };

    const output = runSimulation(input);

    if (!output.success || !output.result) {
      setSimulationError(output.errors.join(" "));
      return;
    }

    setSimulationResult(output.result);
    setCompletedRequests(input.requests);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">IO</div>
          <div>
            <strong>IO Pipeline</strong>
            <span>SIMULATOR DISK</span>
          </div>
        </div>

        <p className="nav-label">MENU UTAMA</p>

        <nav aria-label="Navigasi utama">
          <a className="nav-item active" href="#dashboard">
            ▦ Dasbor
          </a>
          <a className="nav-item" href="#simulator">
            ◉ Simulasi
          </a>
          <a className="nav-item" href="#metrics">
            ▤ Metrik Kinerja
          </a>
          <a className="nav-item" href="#guide">
            ⓘ Panduan Belajar
          </a>
        </nav>

        <div className="sidebar-bottom">
          <span className="status-dot" />
          <span>Ruang kerja engine inti</span>
          <small>v1.0</small>
        </div>
      </aside>

      <section className="main-content" id="dashboard">
        <header className="topbar">
          <div>
            <p className="eyebrow">
              SISTEM OPERASI / PENJADWALAN DISK
            </p>
            <h1>I/O Pipeline Simulator</h1>
          </div>

          <div className="topbar-tag">
            <span className="status-dot" />
            Ruang simulasi
          </div>
        </header>

        <section className="welcome-card">
          <div className="welcome-copy">
            <span className="pill">PEMBELAJARAN INTERAKTIF</span>

            <h2>Pahami setiap pergerakan head disk.</h2>

            <p>
              Pelajari algoritma penjadwalan disk, amati pergerakan head,
              dan bandingkan metrik kinerja dalam satu aplikasi.
            </p>

            <a className="primary-button" href="#simulator">
              Mulai simulasi <span>↗</span>
            </a>
          </div>

          <div className="disk-visual" aria-hidden="true">
            <div className="disk-ring ring-one" />
            <div className="disk-ring ring-two" />
            <div className="disk-center">IO</div>
            <span className="disk-point point-one" />
            <span className="disk-point point-two" />
            <span className="disk-point point-three" />
          </div>
        </section>

        <section className="section-heading">
          <div>
            <p className="eyebrow">MULAI DI SINI</p>
            <h2>Pengaturan simulasi</h2>
          </div>
          <span className="muted-text">Atur permintaan disk</span>
        </section>

        <section className="workspace-grid" id="simulator">
          <div className="panel setup-panel">
            <div className="panel-heading">
              <div>
                <h3>Konfigurasi</h3>
                <p>Tentukan algoritma dan masukan simulasi.</p>
              </div>
              <span className="panel-icon">⚙</span>
            </div>

            <label htmlFor="algorithm">
              Algoritma penjadwalan
            </label>

            <select
              id="algorithm"
              value={algorithm}
              onChange={(event) => setAlgorithm(event.target.value)}
            >
              {algorithms.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <label htmlFor="initial-head">
              Posisi awal head
            </label>

            <input
              id="initial-head"
              type="number"
              min="0"
              value={initialHead}
              onChange={(event) => setInitialHead(event.target.value)}
            />

            <label htmlFor="requests">
              Antrean permintaan (nomor cylinder)
            </label>

            <textarea
              id="requests"
              rows={3}
              value={requests}
              onChange={(event) => setRequests(event.target.value)}
              placeholder="Contoh: 82, 170, 43, 140, 24"
            />

            <p className="helper-text">
              Pisahkan setiap nomor cylinder dengan koma.
            </p>

            <button
              className="primary-button full-width"
              type="button"
              onClick={handleRunSimulation}
            >
              Jalankan simulasi <span>→</span>
            </button>

            {simulationError && (
              <p role="alert" className="helper-text">
                {simulationError}
              </p>
            )}

              {simulationResult && (
                <div className="notice" role="status">
                  <p>
                    Simulasi berhasil. Total pergerakan head:{" "}
                    {simulationResult.totalHeadMovement} cylinder.
                  </p>
                </div>
              )}
            </div>

            <div className="panel preview-panel">
            <div className="panel-heading">
              <div>
                <h3>Ringkasan permintaan</h3>
                <p>Pratinjau masukan simulasi saat ini.</p>
              </div>

              <span className="preview-badge">PRATINJAU</span>
            </div>

            <div className="preview-stat">
              <span>Algoritma terpilih</span>
              <strong>{algorithm}</strong>
            </div>

            <div className="preview-stat">
              <span>Posisi awal head</span>
              <strong>{initialHead || "—"}</strong>
            </div>

            <div className="preview-stat">
              <span>Jumlah permintaan</span>
              <strong>{requestList.length}</strong>
            </div>

            <div className="request-list">
              <span className="request-list-label">
                ANTREAN CYLINDER
              </span>

              <div className="request-chips">
                {requestList.map((value, index) => (
                  <span
                    className="request-chip"
                    key={`${value}-${index}`}
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>

            <div className="notice">
              <span>ⓘ</span>
              <p>
                Ini adalah pratinjau masukan, bukan hasil simulasi.
                Hasil akan ditampilkan setelah algoritma penjadwalan
                terhubung ke engine.
              </p>
            </div>
          </div>
        </section>

        <section className="section-heading metrics-heading" id="metrics">
          <div>
            <p className="eyebrow">ANALISIS KINERJA</p>
            <h2>Ringkasan metrik</h2>
          </div>

          <span className="muted-text">
            Tersedia setelah simulasi
          </span>
        </section>

        
        <section className="metrics-grid">
          {[
            [
              "↔",
              "Total pergerakan head",
              metrics ? metrics.totalHeadMovement.toFixed(0) : "—",
              "Satuan cylinder",
            ],
            [
              "◷",
              "Total waktu pencarian",
              metrics ? metrics.totalSeekTime.toFixed(2) : "—",
              "Satuan waktu",
            ],
            [
              "⌁",
              "Rata-rata waktu tunggu",
              metrics ? metrics.averageWaitingTime.toFixed(2) : "—",
              "Satuan waktu",
            ],
            [
              "⇧",
              "Throughput",
              metrics ? metrics.throughput.toFixed(3) : "—",
              "Permintaan per satuan waktu",
            ],
          ].map(([icon, label, value, unit]) => (
            <div className="panel metric-card" key={label}>
              <span className="metric-icon">{icon}</span>
              <p>{label}</p>
              <strong>{value}</strong>
              <span className="metric-unit">{unit}</span>
            </div>
          ))}
        </section>


        <footer id="guide">
          <span>I/O PIPELINE SIMULATOR</span>
          <span>Media pembelajaran Sistem Operasi</span>
        </footer>
      </section>
    </main>
  );
}

export default App;
