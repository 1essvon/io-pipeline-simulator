import { describe, expect, it } from "vitest";
import { runSSTF } from "../sstf";
import type {
  DiskRequest,
  SimulationConfig,
} from "../types";

const config: SimulationConfig = {
  initialHead: 50,
  minCylinder: 0,
  maxCylinder: 199,
  direction: "up",
  serviceTime: 1,
};

describe("SSTF Algorithm", () => {
  it("memilih request dengan jarak terdekat", () => {
    const requests: DiskRequest[] = [
      { id: "R1", cylinder: 90, arrivalTime: 0 },
      { id: "R2", cylinder: 45, arrivalTime: 0 },
      { id: "R3", cylinder: 60, arrivalTime: 0 },
    ];

    const result = runSSTF(requests, config);

    expect(result.steps.map((step) => step.requestId)).toEqual([
      "R2",
      "R3",
      "R1",
    ]);

    expect(result.totalHeadMovement).toBe(50);
    expect(result.completedRequests).toBe(3);
  });

  it("memilih request yang lebih awal dalam antrean jika jaraknya sama", () => {
    const requests: DiskRequest[] = [
      { id: "R1", cylinder: 60, arrivalTime: 0 },
      { id: "R2", cylinder: 40, arrivalTime: 0 },
    ];

    const result = runSSTF(requests, config);

    expect(result.steps.map((step) => step.requestId)).toEqual([
      "R1",
      "R2",
    ]);
  });

  it("menunggu jika belum ada request yang tiba", () => {
    const requests: DiskRequest[] = [
      { id: "R1", cylinder: 55, arrivalTime: 5 },
    ];

    const result = runSSTF(requests, config);

    expect(result.steps[0]?.serviceStartTime).toBe(5);
    expect(result.steps[0]?.completionTime).toBe(10);
  });

  it("mengembalikan hasil kosong jika tidak ada request", () => {
    const result = runSSTF([], config);

    expect(result.steps).toHaveLength(0);
    expect(result.totalHeadMovement).toBe(0);
    expect(result.completedRequests).toBe(0);
  });
});