import { describe, expect, it } from "vitest";
import { runCSCAN } from "../cscan";
import type { DiskRequest, SimulationConfig } from "../types";

const config: SimulationConfig = {
  initialHead: 50,
  minCylinder: 0,
  maxCylinder: 199,
  direction: "up",
  serviceTime: 1,
};

describe("C-SCAN Algorithm", () => {
  it("serves unsorted requests circularly in the upward direction", () => {
    const requests: DiskRequest[] = [
      { id: "R1", cylinder: 82, arrivalTime: 0 },
      { id: "R2", cylinder: 170, arrivalTime: 0 },
      { id: "R3", cylinder: 43, arrivalTime: 0 },
      { id: "R4", cylinder: 140, arrivalTime: 0 },
    ];

    const result = runCSCAN(requests, config);

    expect(
      result.steps
        .filter((step) => step.eventType === "request-served")
        .map((step) => step.requestId),
    ).toEqual(["R1", "R4", "R2", "R3"]);

    expect(result.totalHeadMovement).toBe(391);
    expect(result.completedRequests).toBe(4);
  });

  it("serves unsorted requests circularly in the downward direction", () => {
    const requests: DiskRequest[] = [
      { id: "R1", cylinder: 82, arrivalTime: 0 },
      { id: "R2", cylinder: 170, arrivalTime: 0 },
      { id: "R3", cylinder: 43, arrivalTime: 0 },
      { id: "R4", cylinder: 10, arrivalTime: 0 },
    ];

    const result = runCSCAN(requests, {
      ...config,
      direction: "down",
    });

    expect(
      result.steps
        .filter((step) => step.eventType === "request-served")
        .map((step) => step.requestId),
    ).toEqual(["R3", "R4", "R2", "R1"]);

    expect(result.totalHeadMovement).toBe(366);
    expect(result.completedRequests).toBe(4);
  });

  it("does not wrap when there are no requests on the other side", () => {
    const requests: DiskRequest[] = [
      { id: "R1", cylinder: 80, arrivalTime: 0 },
      { id: "R2", cylinder: 100, arrivalTime: 0 },
    ];

    const result = runCSCAN(requests, config);

    expect(
      result.steps.filter((step) => step.eventType === "wrap-around"),
    ).toHaveLength(0);

    expect(result.completedRequests).toBe(2);
  });

  it("serves the initial-head request and duplicate cylinders once each", () => {
    const requests: DiskRequest[] = [
      { id: "R1", cylinder: 50, arrivalTime: 0 },
      { id: "R2", cylinder: 80, arrivalTime: 0 },
      { id: "R3", cylinder: 80, arrivalTime: 0 },
    ];

    const result = runCSCAN(requests, config);

    expect(
      result.steps
        .filter((step) => step.eventType === "request-served")
        .map((step) => step.requestId),
    ).toEqual(["R1", "R2", "R3"]);

    expect(result.completedRequests).toBe(3);
  });

  it("wraps from an endpoint head and serves requests at both disk limits", () => {
    const requests: DiskRequest[] = [
      { id: "R1", cylinder: 0, arrivalTime: 0 },
      { id: "R2", cylinder: 199, arrivalTime: 0 },
    ];

    const result = runCSCAN(requests, {
      ...config,
      initialHead: 199,
    });

    expect(
      result.steps
        .filter((step) => step.eventType === "request-served")
        .map((step) => step.requestId),
    ).toEqual(["R2", "R1"]);

    expect(
      result.steps
        .filter((step) => step.eventType === "wrap-around")
        .map((step) => step.headPosition),
    ).toEqual([0]);

    expect(result.completedRequests).toBe(2);
  });

  it("returns zero movement for empty input and calculates a single request", () => {
    const emptyResult = runCSCAN([], config);

    expect(emptyResult.totalHeadMovement).toBe(0);
    expect(emptyResult.completedRequests).toBe(0);

    const singleResult = runCSCAN(
      [{ id: "R1", cylinder: 80, arrivalTime: 0 }],
      config,
    );

    expect(singleResult.completedRequests).toBe(1);
    expect(singleResult.totalHeadMovement).toBe(30);
  });

  it("considers requests that arrive during boundary movement and wrap-around", () => {
    const requests: DiskRequest[] = [
      { id: "R1", cylinder: 80, arrivalTime: 0 },
      { id: "R2", cylinder: 20, arrivalTime: 0 },
      { id: "R3", cylinder: 10, arrivalTime: 200 },
    ];

    const result = runCSCAN(requests, config);

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
      ["R3", 348, 358],
      ["R2", 358, 368],
    ]);

    expect(
      result.steps
        .filter((step) => step.eventType === "wrap-around")
        .map((step) => step.headPosition),
    ).toEqual([199, 0]);

    expect(result.totalHeadMovement).toBe(368);
    expect(result.totalSeekTime).toBe(368);
    expect(result.completedRequests).toBe(3);
  });
});
