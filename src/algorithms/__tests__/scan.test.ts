import { describe, expect, it } from "vitest";
import { runSCAN } from "../scan";
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

describe("SCAN Algorithm", () => {
  it("melayani request ke arah atas lalu berbalik di batas disk", () => {
    const requests: DiskRequest[] = [
      { id: "R1", cylinder: 82, arrivalTime: 0 },
      { id: "R2", cylinder: 170, arrivalTime: 0 },
      { id: "R3", cylinder: 43, arrivalTime: 0 },
      { id: "R4", cylinder: 140, arrivalTime: 0 },
      { id: "R5", cylinder: 24, arrivalTime: 0 },
      { id: "R6", cylinder: 16, arrivalTime: 0 },
      { id: "R7", cylinder: 190, arrivalTime: 0 },
    ];

    const result = runSCAN(requests, config);

    expect(
      result.steps
        .filter((step) => step.eventType === "request-served")
        .map((step) => step.requestId),
    ).toEqual(["R1", "R4", "R2", "R7", "R3", "R5", "R6"]);

    expect(result.totalHeadMovement).toBe(332);
    expect(result.completedRequests).toBe(7);
  });

  it("melayani request ke arah bawah lalu berbalik di batas disk", () => {
    const requests: DiskRequest[] = [
      { id: "R1", cylinder: 20, arrivalTime: 0 },
      { id: "R2", cylinder: 10, arrivalTime: 0 },
      { id: "R3", cylinder: 60, arrivalTime: 0 },
      { id: "R4", cylinder: 30, arrivalTime: 0 },
    ];

    const result = runSCAN(requests, {
      ...config,
      direction: "down",
    });

    expect(
      result.steps
        .filter((step) => step.eventType === "request-served")
        .map((step) => step.requestId),
    ).toEqual(["R4", "R1", "R2", "R3"]);

    expect(result.totalHeadMovement).toBe(110);
  });

  it("mencatat perubahan arah ketika mencapai batas disk", () => {
    const requests: DiskRequest[] = [
  { id: "R1", cylinder: 80, arrivalTime: 0 },
  { id: "R2", cylinder: 20, arrivalTime: 0 },
];

    const result = runSCAN(requests, config);

    const directionChange = result.steps.find(
      (step) => step.eventType === "direction-change",
    );

    expect(directionChange).toBeDefined();
    expect(directionChange?.headPosition).toBe(199);
  });

  it("menunggu jika request belum tiba", () => {
    const requests: DiskRequest[] = [
      { id: "R1", cylinder: 55, arrivalTime: 5 },
    ];

    const result = runSCAN(requests, config);

    expect(result.steps[0]?.serviceStartTime).toBe(5);
    expect(result.steps[0]?.completionTime).toBe(10);
  });

  it("mengembalikan hasil kosong jika tidak ada request", () => {
    const result = runSCAN([], config);

    expect(result.steps).toHaveLength(0);
    expect(result.totalHeadMovement).toBe(0);
    expect(result.completedRequests).toBe(0);
  });
});