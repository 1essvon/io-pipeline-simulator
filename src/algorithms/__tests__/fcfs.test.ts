import { describe, expect, it } from "vitest";
import { runFCFS } from "../fcfs";
import type { DiskRequest, SimulationConfig } from "../types";

const config: SimulationConfig = {
  initialHead: 50,
  minCylinder: 0,
  maxCylinder: 199,
  direction: "up",
  serviceTime: 1,
};

describe("FCFS Algorithm", () => {
  it("should serve requests according to arrival time", () => {
    const requests: DiskRequest[] = [
      { id: "R1", cylinder: 80, arrivalTime: 5 },
      { id: "R2", cylinder: 40, arrivalTime: 0 },
      { id: "R3", cylinder: 70, arrivalTime: 2 },
    ];

    const result = runFCFS(requests, config);

    expect(result.algorithm).toBe("FCFS");
    expect(result.steps.map((step) => step.requestId)).toEqual([
      "R2",
      "R3",
      "R1",
    ]);
    expect(result.totalHeadMovement).toBe(50);
    expect(result.completedRequests).toBe(3);
  });

  it("should preserve input order when arrival times are equal", () => {
    const requests: DiskRequest[] = [
      { id: "R1", cylinder: 60, arrivalTime: 0 },
      { id: "R2", cylinder: 40, arrivalTime: 0 },
    ];

    const result = runFCFS(requests, config);

    expect(result.steps.map((step) => step.requestId)).toEqual([
      "R1",
      "R2",
    ]);
    expect(result.totalHeadMovement).toBe(30);
  });

  it("should wait until a request arrives", () => {
    const requests: DiskRequest[] = [
      { id: "R1", cylinder: 55, arrivalTime: 5 },
    ];

    const result = runFCFS(requests, {
      ...config,
      serviceTime: 2,
    });

    expect(result.steps[0]?.serviceStartTime).toBe(5);
    expect(result.steps[0]?.completionTime).toBe(15);
    expect(result.totalSeekTime).toBe(15);
  });

  it("should return an empty result when there are no requests", () => {
    const result = runFCFS([], config);

    expect(result.steps).toHaveLength(0);
    expect(result.totalHeadMovement).toBe(0);
    expect(result.totalSeekTime).toBe(0);
    expect(result.completedRequests).toBe(0);
  });
});
