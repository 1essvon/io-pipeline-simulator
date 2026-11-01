import type {
  AlgorithmId,
  DiskRequest,
  SimulationConfig,
} from "../../algorithms/types";
import { RequestListEditor } from "./RequestListEditor";

const algorithmOptions: AlgorithmId[] = [
  "FCFS",
  "SSTF",
  "SCAN",
  "C-SCAN",
  "LOOK",
  "C-LOOK",
];

interface ConfigurationPanelProps {
  algorithm: AlgorithmId;
  config: SimulationConfig;
  requests: DiskRequest[];
  errors: string[];
  onAlgorithmChange: (algorithm: AlgorithmId) => void;
  onConfigChange: (config: SimulationConfig) => void;
  onRequestsChange: (requests: DiskRequest[]) => void;
  onRun: () => void;
}

function toInputValue(value: number): string | number {
  return Number.isNaN(value) ? "" : value;
}

export function ConfigurationPanel({
  algorithm,
  config,
  requests,
  errors,
  onAlgorithmChange,
  onConfigChange,
  onRequestsChange,
  onRun,
}: ConfigurationPanelProps) {
  const cylinderCount = config.maxCylinder + 1;

  return (
    <section className="config-panel">
      <h2>Konfigurasi Simulasi</h2>

      <label className="field">
        <span className="field-label">Algoritma</span>
        <select
          value={algorithm}
          onChange={(event) =>
            onAlgorithmChange(event.target.value as AlgorithmId)
          }
        >
          {algorithmOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span className="field-label">
          Jumlah Silinder (0-{config.maxCylinder})
        </span>
        <input
          type="number"
          value={toInputValue(cylinderCount)}
          onChange={(event) =>
            onConfigChange({
              ...config,
              maxCylinder: Number(event.target.value) - 1,
            })
          }
        />
      </label>

      <label className="field">
        <span className="field-label">Posisi Head Awal</span>
        <input
          type="number"
          value={toInputValue(config.initialHead)}
          onChange={(event) =>
            onConfigChange({
              ...config,
              initialHead: Number(event.target.value),
            })
          }
        />
      </label>

      <fieldset className="field">
        <legend className="field-label">Arah Awal</legend>
        <label>
          <input
            type="radio"
            name="direction"
            checked={config.direction === "up"}
            onChange={() => onConfigChange({ ...config, direction: "up" })}
          />
          Naik
        </label>
        <label>
          <input
            type="radio"
            name="direction"
            checked={config.direction === "down"}
            onChange={() => onConfigChange({ ...config, direction: "down" })}
          />
          Turun
        </label>
      </fieldset>

      <RequestListEditor requests={requests} onChange={onRequestsChange} />

      {errors.length > 0 && (
        <ul className="field-error-list" role="alert">
          {errors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}

      <button type="button" className="run-button" onClick={onRun}>
        Jalankan Simulasi
      </button>
    </section>
  );
}