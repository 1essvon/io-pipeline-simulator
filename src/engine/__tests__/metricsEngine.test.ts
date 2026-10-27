import { describe, expect, it } from "vitest";
import { calculateMetrics } from "../metricsEngine";
import type {
  DiskRequest,
  SimulationStep,
} from "../../algorithms/types";

const requests: DiskRequest[] = [
  { id: "R1", cylinder: 60, arrivalTime: 2 },
  { id: "R2", cylinder: 80, arrivalTime: 5 },
];

const steps: SimulationStep[] = [
  {
    stepNumber: 1,
    headPosition: 60,
    requestId: "R1",
    cylinder: 60,
    distanceFromPrevious: 10,
    elapsedTime: 4,
    serviceStartTime: 3,
    completionTime: 4,
    eventType: "request-served",
    explanation: "Melayani R1",
  },
  {
    stepNumber: 2,
    headPosition: 80,
    requestId: "R2",
    cylinder: 80,
    distanceFromPrevious: 20,
    elapsedTime: 8,
    serviceStartTime: 7,
    completionTime: 8,
    eventType: "request-served",
    explanation: "Melayani R2",
  },
];

describe("calculateMetrics", () => {
  it("menghitung metrik request dan pergerakan head", () => {
    const metrics = calculateMetrics(requests, steps, 30);

    expect(metrics.totalHeadMovement).toBe(30);
    expect(metrics.totalSeekTime).toBe(8);
    expect(metrics.averageWaitingTime).toBe(1.5);
    expect(metrics.averageTurnaroundTime).toBe(2.5);
    expect(metrics.averageResponseTime).toBe(1.5);
    expect(metrics.throughput).toBe(0.25);
    expect(metrics.maxWaitingTime).toBe(2);
  });

  it("menghasilkan nol jika tidak ada request yang selesai", () => {
    const metrics = calculateMetrics([], [], 0);

    expect(metrics.totalHeadMovement).toBe(0);
    expect(metrics.totalSeekTime).toBe(0);
    expect(metrics.averageWaitingTime).toBe(0);
    expect(metrics.averageTurnaroundTime).toBe(0);
    expect(metrics.averageResponseTime).toBe(0);
    expect(metrics.throughput).toBe(0);
    expect(metrics.maxWaitingTime).toBe(0);
  });
});
