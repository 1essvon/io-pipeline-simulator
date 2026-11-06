import type {
  SimulationEventType,
  SimulationStep,
} from "../../algorithms/types";

const eventLabels: Record<SimulationEventType, string> = {
  "request-served": "Layani",
  "direction-change": "Ubah arah",
  "wrap-around": "Wrap-around",
};

export function getEventLabel(step: SimulationStep): string {
  const base = eventLabels[step.eventType];
  return step.eventType === "request-served" && step.requestId
    ? `${base} ${step.requestId}`
    : base;
}