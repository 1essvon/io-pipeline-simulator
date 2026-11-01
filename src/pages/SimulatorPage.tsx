import { useMemo, useState } from "react";
import type {
  AlgorithmId,
  DiskRequest,
  SimulationConfig,
  SimulationResult,
} from "../algorithms/types";
import { runSimulation } from "../engine/simulationEngine";
import { calculateMetrics } from "../engine/metricsEngine";
import { ConfigurationPanel } from "../components/simulator/ConfigurationPanel";
import { EventTimeline } from "../components/simulator/EventTimeline";
import { ExplanationPanel } from "../components/simulator/ExplanationPanel";
import { MetricsPanel } from "../components/simulator/MetricsPanel";
import "../components/simulator/simulator.css";

const defaultConfig: SimulationConfig = {
  initialHead: 50,
  minCylinder: 0,
  maxCylinder: 199,
  direction: "up",
  serviceTime: 1,
};

const defaultRequests: DiskRequest[] = [82, 170, 43, 140, 24].map(
  (cylinder, index) => ({
    id: `R${index + 1}`,
    cylinder,
    arrivalTime: 0,
  }),
);

export default function SimulatorPage() {
  const [algorithm, setAlgorithm] = useState<AlgorithmId>("FCFS");
  const [config, setConfig] = useState<SimulationConfig>(defaultConfig);
  const [requests, setRequests] = useState<DiskRequest[]>(defaultRequests);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [simulatedRequests, setSimulatedRequests] = useState<DiskRequest[]>([]);
  const [simulatedHead, setSimulatedHead] = useState(defaultConfig.initialHead);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Perubahan konfigurasi membuat hasil sebelumnya tidak berlaku.
  function clearResult() {
    setResult(null);
    setSimulatedRequests([]);
    setSelectedIndex(null);
    setErrors([]);
  }

  function handleAlgorithmChange(next: AlgorithmId) {
    setAlgorithm(next);
    clearResult();
  }

  function handleConfigChange(next: SimulationConfig) {
    setConfig(next);
    clearResult();
  }

  function handleRequestsChange(next: DiskRequest[]) {
    setRequests(next);
    clearResult();
  }

  function handleRun() {
    const output = runSimulation({ algorithm, requests, config });

    if (!output.success || !output.result) {
      setResult(null);
      setSimulatedRequests([]);
      setSelectedIndex(null);
      setErrors(output.errors);
      return;
    }

    setErrors([]);
    setResult(output.result);
    setSimulatedRequests(requests);
    setSimulatedHead(config.initialHead);
    setSelectedIndex(null);
  }

  const metrics = useMemo(
    () =>
      result
        ? calculateMetrics(
            simulatedRequests,
            result.steps,
            result.totalHeadMovement,
          )
        : null,
    [result, simulatedRequests],
  );

  const steps = result?.steps ?? [];
  const selectedStep =
    selectedIndex !== null ? (steps[selectedIndex] ?? null) : null;

  return (
    <div className="simulator-layout">
      <ConfigurationPanel
        algorithm={algorithm}
        config={config}
        requests={requests}
        errors={errors}
        onAlgorithmChange={handleAlgorithmChange}
        onConfigChange={handleConfigChange}
        onRequestsChange={handleRequestsChange}
        onRun={handleRun}
      />

      <div className="simulator-main">
        <MetricsPanel metrics={metrics} />
        <EventTimeline
          steps={steps}
          initialHead={simulatedHead}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
        />
        <ExplanationPanel step={selectedStep} />
      </div>
    </div>
  );
}