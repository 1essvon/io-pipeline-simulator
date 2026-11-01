import type { SimulationStep } from "../../algorithms/types";
import { getEventLabel } from "./eventLabels";

interface ExplanationPanelProps {
  step: SimulationStep | null;
}

export function ExplanationPanel({ step }: ExplanationPanelProps) {
  if (!step) {
    return (
      <section className="explanation-panel">
        <h2>Penjelasan Langkah</h2>
        <p className="metrics-empty">
          Pilih event pada timeline untuk melihat detailnya.
        </p>
      </section>
    );
  }

  return (
    <section className="explanation-panel">
      <h2>Penjelasan Langkah</h2>
      <p className="explanation-text">{step.explanation}</p>

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
    </section>
  );
}