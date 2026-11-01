import { useMemo, useState } from "react";
import type {
  DiskRequest,
  SimulationConfig,
  SimulationResult,
} from "../algorithms/types";
import { runSimulation } from "../engine/simulationEngine";
import { calculateMetrics } from "../engine/metricsEngine";
import { MetricsPanel } from "../components/simulator/MetricsPanel";

const sampleConfig: SimulationConfig = {
  initialHead: 50,
  minCylinder: 0,
  maxCylinder: 199,
  direction: "up",
  serviceTime: 1,
};

const sampleRequests: DiskRequest[] = [82, 170, 43, 140, 24].map(
  (cylinder, index) => ({
    id: `R${index + 1}`,
    cylinder,
    arrivalTime: 0,
  }),
);

export default function SimulatorPage() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const metrics = useMemo(
    () =>
      result
        ? calculateMetrics(sampleRequests, result.steps, result.totalHeadMovement)
        : null,
    [result],
  );

  function handleRun() {
    const output = runSimulation({
      algorithm: "FCFS",
      requests: sampleRequests,
      config: sampleConfig,
    });

    if (!output.success || !output.result) {
      setResult(null);
      setErrors(output.errors);
      return;
    }

    setErrors([]);
    setResult(output.result);
  }

  return (
    <div>
      <button type="button" onClick={handleRun}>
        Jalankan Simulasi
      </button>
      {errors.map((message) => (
        <p key={message}>{message}</p>
      ))}
      <MetricsPanel metrics={metrics} />
    </div>
  );
}