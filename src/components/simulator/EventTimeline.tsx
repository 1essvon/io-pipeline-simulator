import type { SimulationStep } from "../../algorithms/types";
import { getEventLabel } from "./eventLabels";

interface EventTimelineProps {
  steps: SimulationStep[];
  initialHead: number;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

export function EventTimeline({
  steps,
  initialHead,
  selectedIndex,
  onSelect,
}: EventTimelineProps) {
  return (
    <section className="timeline-panel">
      <h2>Timeline Simulasi</h2>

      {steps.length === 0 ? (
        <p className="metrics-empty">
          Jalankan simulasi untuk melihat timeline.
        </p>
      ) : (
        <div className="table-scroll">
          <table className="timeline-table">
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Event</th>
                <th>Posisi Head</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0</td>
                <td>Mulai</td>
                <td>{initialHead}</td>
                <td>Posisi head awal</td>
              </tr>
              {steps.map((step, index) => (
                <tr
                  key={`${step.stepNumber}-${index}`}
                  className={index === selectedIndex ? "row-selected" : ""}
                >
                  <td>{step.elapsedTime}</td>
                  <td>
                    <button
                      type="button"
                      className="timeline-event"
                      aria-pressed={index === selectedIndex}
                      onClick={() => onSelect(index)}
                    >
                      {getEventLabel(step)}
                    </button>
                  </td>
                  <td>{step.headPosition}</td>
                  <td>Gerak {step.distanceFromPrevious} silinder</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}