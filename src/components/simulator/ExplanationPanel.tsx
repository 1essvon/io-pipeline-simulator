import { useState } from "react";
import type {
  SimulationEventType,
  SimulationStep,
} from "../../algorithms/types";
import { getEventLabel } from "./eventLabels";

type ExplanationMode = "ringkas" | "lengkap";

const eventHints: Record<SimulationEventType, string> = {
  "request-served":
    "Head sudah sampai di silinder permintaan, lalu permintaan itu dilayani. Setelah itu head siap menuju permintaan berikutnya.",
  "direction-change":
    "Head berbalik arah karena sudah mencapai ujung perjalanan di arah sebelumnya, yaitu batas disk atau permintaan terjauh.",
  "wrap-around":
    "Head berpindah ke sisi seberang tanpa melayani permintaan yang dilewati, lalu melanjutkan ke arah yang sama. Perpindahan ini tetap dihitung sebagai jarak dan waktu.",
};

interface ExplanationPanelProps {
  step: SimulationStep | null;
}

export function ExplanationPanel({ step }: ExplanationPanelProps) {
  const [mode, setMode] = useState<ExplanationMode>("lengkap");

  return (
    <section className="explanation-panel">
      <div className="explanation-header">
        <h2>Penjelasan Langkah</h2>
        <label className="explanation-mode">
          <span className="field-label">Mode Penjelasan</span>
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value as ExplanationMode)}
          >
            <option value="lengkap">Lengkap (Pemula)</option>
            <option value="ringkas">Ringkas</option>
          </select>
        </label>
      </div>

      {!step ? (
        <p className="metrics-empty">
          Pilih event pada timeline atau tekan Putar untuk melihat detailnya.
        </p>
      ) : (
        <>
          <p className="explanation-text">{step.explanation}</p>

          {mode === "lengkap" && (
            <>
              <p className="explanation-hint">{eventHints[step.eventType]}</p>

              <dl className="explanation-details">
                <div>
                  <dt>Langkah ke</dt>
                  <dd>{step.stepNumber}</dd>
                </div>
                <div>
                  <dt>Event</dt>
                  <dd>{getEventLabel(step)}</dd>
                </div>
                {step.cylinder !== undefined && (
                  <div>
                    <dt>Cylinder tujuan</dt>
                    <dd>{step.cylinder}</dd>
                  </div>
                )}
                <div>
                  <dt>Posisi head</dt>
                  <dd>{step.headPosition}</dd>
                </div>
                <div>
                  <dt>Jarak dari sebelumnya</dt>
                  <dd>{step.distanceFromPrevious} silinder</dd>
                </div>
                <div>
                  <dt>Waktu berjalan</dt>
                  <dd>{step.elapsedTime} unit</dd>
                </div>
              </dl>
            </>
          )}
        </>
      )}
    </section>
  );
}