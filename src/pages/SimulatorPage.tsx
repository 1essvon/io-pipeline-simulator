import { useMemo, useState } from "react";
import type {
  AlgorithmId,
  DiskRequest,
  SimulationConfig,
  SimulationResult,
} from "../algorithms/types";
import { runSimulation } from "../engine/simulationEngine";
import { calculateMetrics } from "../engine/metricsEngine";
import { usePlayback } from "../hooks/usePlayback";
import { ConfigurationPanel } from "../components/simulator/ConfigurationPanel";
import { DiskVisualization } from "../components/simulator/DiskVisualization";
import { EventTimeline } from "../components/simulator/EventTimeline";
import { ExplanationPanel } from "../components/simulator/ExplanationPanel";
import { MetricsPanel } from "../components/simulator/MetricsPanel";
import { PlaybackControls } from "../components/simulator/PlaybackControls";
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
  const [errors, setErrors] = useState<string[]>([]);

  const steps = result?.steps ?? [];
  const playback = usePlayback(steps.length);

  // Perubahan konfigurasi membuat hasil sebelumnya tidak berlaku.
  function clearResult() {
    setResult(null);
    setSimulatedRequests([]);
    setErrors([]);
    playback.reset();
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
      setErrors(output.errors);
      playback.reset();
      return;
    }

    setErrors([]);
    setResult(output.result);
    setSimulatedRequests(requests);
    setSimulatedHead(config.initialHead);
    playback.reset();
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

  const activeIndex = playback.position >= 0 ? playback.position : null;
  const activeStep = activeIndex !== null ? (steps[activeIndex] ?? null) : null;

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
        <DiskVisualization
          config={config}
          requests={requests}
          steps={steps}
          activeIndex={activeIndex}
          totalHeadMovement={result ? result.totalHeadMovement : null}
        />
        <PlaybackControls
          totalSteps={steps.length}
          position={playback.position}
          isPlaying={playback.isPlaying}
          isFinished={playback.isFinished}
          speed={playback.speed}
          onPlay={playback.play}
          onPause={playback.pause}
          onStepBack={playback.stepBack}
          onStepForward={playback.stepForward}
          onReset={playback.reset}
          onReplay={playback.replay}
          onSpeedChange={playback.setSpeed}
        />
        <MetricsPanel metrics={metrics} />
        <EventTimeline
          steps={steps}
          initialHead={simulatedHead}
          selectedIndex={activeIndex}
          onSelect={playback.seek}
        />
        <ExplanationPanel step={activeStep} />
      </div>
    </div>
  );
}