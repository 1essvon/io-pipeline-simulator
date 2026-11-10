import { describe, expect, it } from "vitest";
import { runSCAN } from "../scan";
import type { DiskRequest, SimulationConfig } from "../types";

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
    ];

    const result = runSCAN(requests, config);

    expect(
      result.steps
        .filter((step) => step.eventType === "request-served")
        .map((step) => step.requestId),
    ).toEqual(["R1", "R4", "R2", "R3"]);

    expect(result.totalHeadMovement).toBe(305);
    expect(result.completedRequests).toBe(4);
  });

  it("melayani request ke arah bawah lalu berbalik di batas disk", () => {
    const requests: DiskRequest[] = [
      { id: "R1", cylinder: 82, arrivalTime: 0 },
      { id: "R2", cylinder: 170, arrivalTime: 0 },
      { id: "R3", cylinder: 43, arrivalTime: 0 },
      { id: "R4", cylinder: 10, arrivalTime: 0 },
    ];

    const result = runSCAN(requests, {
      ...config,
      direction: "down",
    });

    expect(
      result.steps
        .filter((step) => step.eventType === "request-served")
        .map((step) => step.requestId),
    ).toEqual(["R3", "R4", "R1", "R2"]);

    expect(result.totalHeadMovement).toBe(220);
    expect(result.completedRequests).toBe(4);
  });

  it("mencatat perubahan arah ketika mencapai batas disk", () => {
    const requests: DiskRequest[] = [
      { id: "R1", cylinder: 80, arrivalTime: 0 },
      { id: "R2", cylinder: 20, arrivalTime: 0 },
    ];

    const result = runSCAN(requests, config);

    expect(
      result.steps
        .filter((step) => step.eventType === "direction-change")
        .map((step) => step.headPosition),
    ).toEqual([199]);
  });

  it("menunggu jika request belum tiba", () => {
    const requests: DiskRequest[] = [
      { id: "R1", cylinder: 80, arrivalTime: 100 },
    ];

    const result = runSCAN(requests, config);

    expect(
      result.steps
        .filter((step) => step.eventType === "request-served")
        .map((step) => step.requestId),
    ).toEqual(["R1"]);

    expect(
      result.steps
        .filter((step) => step.eventType === "request-served")
        .map((step) => [
          step.serviceStartTime,
          step.completionTime,
        ]),
    ).toEqual([[100, 130]]);

    expect(result.completedRequests).toBe(1);
  });

  it("mempertimbangkan request yang tiba selama perjalanan menuju batas disk", () => {
    const requests: DiskRequest[] = [
      { id: "R1", cylinder: 80, arrivalTime: 0 },
      { id: "R2", cylinder: 20, arrivalTime: 0 },
      { id: "R3", cylinder: 150, arrivalTime: 100 },
    ];

    const result = runSCAN(requests, config);

    expect(
      result.steps
        .filter((step) => step.eventType === "request-served")
        .map((step) => step.requestId),
    ).toEqual(["R1", "R3", "R2"]);

    expect(
      result.steps
        .filter((step) => step.eventType === "request-served")
        .map((step) => [
          step.requestId,
          step.serviceStartTime,
          step.completionTime,
        ]),
    ).toEqual([
      ["R1", 0, 30],
      ["R3", 149, 198],
      ["R2", 198, 328],
    ]);

    expect(
      result.steps
        .filter((step) => step.eventType === "direction-change")
        .map((step) => step.headPosition),
    ).toEqual([199]);

    expect(result.totalHeadMovement).toBe(328);
    expect(result.totalSeekTime).toBe(328);
    expect(result.completedRequests).toBe(3);
  });

  it("mengembalikan hasil kosong jika tidak ada request", () => {
    const result = runSCAN([], config);

    expect(result.completedRequests).toBe(0);
    expect(result.totalHeadMovement).toBe(0);
    expect(result.steps).toHaveLength(0);
  });
});
