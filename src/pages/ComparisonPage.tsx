
import { useState } from "react";
import type {
  AlgorithmId,
  DiskRequest,
  SimulationConfig,
  SimulationMetrics,
  SimulationResult,
} from "../algorithms/types";
import { runSimulation } from "../engine/simulationEngine";
import { calculateMetrics } from "../engine/metricsEngine";

const algorithms: AlgorithmId[] = [
  "FCFS",
  "SSTF",
  "SCAN",
  "C-SCAN",
  "LOOK",
  "C-LOOK",
];

interface ComparisonResult {
  algorithm: AlgorithmId;
  result: SimulationResult;
  metrics: SimulationMetrics;
}

const defaultConfig: SimulationConfig = {
  initialHead: 50,
  minCylinder: 0,
  maxCylinder: 199,
  direction: "up",
  serviceTime: 1,
};

export const ComparisonPage = () => {
  const [initialHead, setInitialHead] = useState("50");
  const [requestsInput, setRequestsInput] = useState(
    "82, 170, 43, 140, 24, 16, 190",
  );
  const [comparisonResults, setComparisonResults] = useState<
    ComparisonResult[]
  >([]);
  const [error, setError] = useState("");
  const [hasCompared, setHasCompared] = useState(false);

  function handleCompare() {
    setError("");
    setComparisonResults([]);
    setHasCompared(false);

    const head = Number(initialHead);

    if (
      initialHead.trim() === "" ||
      !Number.isInteger(head) ||
      head < 0 ||
      head > 199
    ) {
      setError("Posisi awal head harus berada dalam rentang 0–199.");
      return;
    }

    const cylinderValues = requestsInput
      .split(",")
      .map((value) => value.trim());

    if (
      cylinderValues.length === 0 ||
      cylinderValues.some(
        (value) => value === "" || !Number.isInteger(Number(value)),
      )
    ) {
      setError("Masukkan antrean cylinder yang valid.");
      return;
    }

    const requests: DiskRequest[] = cylinderValues.map(
      (value, index) => ({
        id: `R${index + 1}`,
        cylinder: Number(value),
        arrivalTime: 0,
      }),
    );

    const config: SimulationConfig = {
      ...defaultConfig,
      initialHead: head,
    };

    const results: ComparisonResult[] = [];

    for (const algorithm of algorithms) {
      const output = runSimulation({
        algorithm,
        requests,
        config,
      });

      if (!output.success || !output.result) {
        setError(`${algorithm}: ${output.errors.join(" ")}`);
        return;
      }

      const metrics = calculateMetrics(
        requests,
        output.result.steps,
        output.result.totalHeadMovement,
      );

      results.push({
        algorithm,
        result: output.result,
        metrics,
      });
    }

    setComparisonResults(results);
    setHasCompared(true);
  }

  const bestResult = hasCompared
    ? comparisonResults.reduce<ComparisonResult | null>(
        (best, current) =>
          !best ||
          current.metrics.totalHeadMovement <
            best.metrics.totalHeadMovement
            ? current
            : best,
        null,
      )
    : null;

  const maxMovement = Math.max(
    1,
    ...comparisonResults.map(
      (item) => item.metrics.totalHeadMovement,
    ),
  );

  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#051F45",
    backgroundColor: "#FFFFFF",
    boxSizing: "border-box" as const,
    marginTop: "8px",
  };

  return (
    <main
      style={{
        padding: "24px",
        maxWidth: "1200px",
        margin: "0 auto",
        color: "#051F45",
      }}
    >
      <header style={{ marginBottom: "28px" }}>
        <p
          style={{
            color: "#778295",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "1px",
          }}
        >
          ANALISIS KINERJA
        </p>

        <h1 style={{ fontSize: "28px", margin: "8px 0" }}>
          Perbandingan Algoritma
        </h1>

        <p style={{ color: "#475569", lineHeight: 1.6 }}>
          Bandingkan performa enam algoritma penjadwalan disk
          menggunakan konfigurasi dan antrean request yang sama.
        </p>
      </header>

      <section
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E5E7EB",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ fontSize: "19px", marginTop: 0 }}>
          Konfigurasi perbandingan
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          <label style={{ fontWeight: 600, fontSize: "14px" }}>
            Posisi awal head
            <input
              type="number"
              min="0"
              max="199"
              value={initialHead}
              onChange={(event) => setInitialHead(event.target.value)}
              style={inputStyle}
            />
          </label>

          <label style={{ fontWeight: 600, fontSize: "14px" }}>
            Antrean cylinder
            <textarea
              rows={3}
              value={requestsInput}
              onChange={(event) =>
                setRequestsInput(event.target.value)
              }
              placeholder="82, 170, 43, 140, 24"
              style={{
                ...inputStyle,
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
          </label>
        </div>

        <p style={{ color: "#778295", fontSize: "12px" }}>
          Rentang cylinder: 0–199. Pisahkan nomor cylinder dengan koma.
          Arah awal: up. Service time: 1.
        </p>

        <button
          type="button"
          onClick={handleCompare}
          style={{
            backgroundColor: "#051F45",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            padding: "12px 22px",
            fontWeight: 600,
            cursor: "pointer",
            marginTop: "8px",
          }}
        >
          Bandingkan Semua Algoritma
        </button>

        {error && (
          <p
            role="alert"
            style={{
              color: "#B42318",
              backgroundColor: "#FEF3F2",
              padding: "12px",
              borderRadius: "8px",
              marginTop: "16px",
            }}
          >
            {error}
          </p>
        )}
      </section>

      {hasCompared && (
        <>
          {bestResult && (
            <section
              style={{
                backgroundColor: "#FCE7EC",
                border: "1px solid #F2C4CD",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "24px",
              }}
            >
              <p style={{ margin: 0, fontSize: "13px" }}>
                HEAD MOVEMENT TERENDAH
              </p>
              <h2 style={{ margin: "8px 0" }}>
                {bestResult.algorithm}
              </h2>
              <strong>
                {bestResult.metrics.totalHeadMovement} cylinder
              </strong>
            </section>
          )}

          <section
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "24px",
              overflowX: "auto",
            }}
          >
            <h2 style={{ fontSize: "19px" }}>
              Tabel perbandingan
            </h2>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
                fontSize: "13px",
                minWidth: "850px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#F8F7F4" }}>
                  {[
                    "Algoritma",
                    "Urutan pelayanan",
                    "Head movement",
                    "Waiting time",
                    "Turnaround",
                    "Throughput",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #E5E7EB",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {comparisonResults.map((item) => {
                  const order = item.result.steps
                    .filter(
                      (step) =>
                        step.eventType === "request-served" &&
                        step.cylinder !== undefined,
                    )
                    .map((step) => step.cylinder)
                    .join(" → ");

                  return (
                    <tr key={item.algorithm}>
                      <td style={{ padding: "12px", fontWeight: 700 }}>
                        {item.algorithm}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          fontFamily: "monospace",
                        }}
                      >
                        {order || "—"}
                      </td>
                      <td style={{ padding: "12px" }}>
                        {item.metrics.totalHeadMovement.toFixed(0)}
                      </td>
                      <td style={{ padding: "12px" }}>
                        {item.metrics.averageWaitingTime.toFixed(2)}
                      </td>
                      <td style={{ padding: "12px" }}>
                        {item.metrics.averageTurnaroundTime.toFixed(2)}
                      </td>
                      <td style={{ padding: "12px" }}>
                        {item.metrics.throughput.toFixed(3)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <section
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <h2 style={{ fontSize: "19px" }}>
              Grafik Total Head Movement
            </h2>

            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "16px",
                height: "240px",
                paddingTop: "30px",
                overflowX: "auto",
                borderBottom: "2px solid #E5E7EB",
              }}
            >
              {comparisonResults.map((item) => {
                const movement = item.metrics.totalHeadMovement;
                const height = (movement / maxMovement) * 100;
                const isBest =
                  item.algorithm === bestResult?.algorithm;

                return (
                  <div
                    key={item.algorithm}
                    style={{
                      flex: "1 0 65px",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <strong style={{ fontSize: "12px", marginBottom: 6 }}>
                      {movement}
                    </strong>

                    <div
                      title={`${item.algorithm}: ${movement} cylinder`}
                      style={{
                        width: "70%",
                        maxWidth: "55px",
                        height: `${height}%`,
                        minHeight: movement === 0 ? "2px" : "4px",
                        backgroundColor: isBest ? "#F2C4CD" : "#051F45",
                        borderRadius: "6px 6px 0 0",
                        transition: "height 0.3s ease",
                      }}
                    />

                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        marginTop: "8px",
                      }}
                    >
                      {item.algorithm}
                    </span>
                  </div>
                );
              })}
            </div>

            <p style={{ color: "#778295", fontSize: "12px" }}>
              Batang berwarna pink menunjukkan algoritma dengan
              total head movement terendah.
            </p>
          </section>
        </>
      )}

      {!hasCompared && !error && (
        <section
          style={{
            textAlign: "center",
            padding: "40px 20px",
            backgroundColor: "#FFFFFF",
            border: "1px dashed #E5E7EB",
            borderRadius: "12px",
          }}
        >
          <h3>Belum ada hasil perbandingan</h3>
          <p style={{ color: "#778295" }}>
            Masukkan konfigurasi, lalu klik tombol Bandingkan Semua
            Algoritma.
          </p>
        </section>
      )}
    </main>
  );
};

export default ComparisonPage;
