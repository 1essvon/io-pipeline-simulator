import { beforeEach, describe, expect, it } from "vitest";
import {
  registerAlgorithm,
  runSimulation,
} from "../simulationEngine";
import type {
  DiskRequest,
  SimulationConfig,
  SimulationResult,
} from "../../algorithms/types";

const config: SimulationConfig = {
  initialHead: 50,
  minCylinder: 0,
  maxCylinder: 199,
  direction: "up",
  serviceTime: 1,
};

const requests: DiskRequest[] = [
  { id: "R1", cylinder: 82, arrivalTime: 0 },
];

const fakeResult: SimulationResult = {
  algorithm: "FCFS",
  steps: [],
  totalHeadMovement: 32,
  totalSeekTime: 32,
  completedRequests: 1,
};

beforeEach(() => {
  registerAlgorithm("FCFS", () => fakeResult);
});

describe("simulationEngine", () => {
  it("menjalankan algoritma yang sudah didaftarkan", () => {
    const output = runSimulation({
      algorithm: "FCFS",
      requests,
      config,
    });

    expect(output.success).toBe(true);
    expect(output.result).toEqual(fakeResult);
    expect(output.errors).toHaveLength(0);
  });

  it("menolak algoritma yang belum didaftarkan", () => {
    const output = runSimulation({
      algorithm: "SSTF",
      requests,
      config,
    });

    expect(output.success).toBe(false);
    expect(output.errors[0]).toContain(
      "Algoritma SSTF belum didaftarkan.",
    );
  });

  it("menolak head di luar batas", () => {
    const output = runSimulation({
      algorithm: "FCFS",
      requests,
      config: { ...config, initialHead: 250 },
    });

    expect(output.success).toBe(false);
    expect(output.errors.length).toBeGreaterThan(0);
  });
});
