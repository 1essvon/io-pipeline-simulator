import { describe, expect, it } from "vitest";
import { runLOOK } from "../look";
import type { DiskRequest, SimulationConfig } from "../types";
import { validateRequests } from "../../utils/validation";

describe("LOOK Algorithm", () => {
  const baseConfig: SimulationConfig = {
    initialHead: 50,
    direction: "up",
    minCylinder: 0,
    maxCylinder: 199,
    serviceTime: 1,
  };

  const request = (id: string, cylinder: number): DiskRequest => ({
    id,
    cylinder,
    arrivalTime: 0,
  });

  const servedIds = (requests: DiskRequest[], config = baseConfig) =>
    runLOOK(requests, config).steps
      .filter((step) => step.eventType === "request-served")
      .map((step) => step.requestId);

  it("serves unsorted requests on both sides in LOOK order", () => {
    const requests = [
      request("R1", 10),
      request("R2", 80),
      request("R3", 20),
      request("R4", 60),
    ];
    const result = runLOOK(requests, baseConfig);

    expect(servedIds(requests)).toEqual(["R4", "R2", "R3", "R1"]);
    expect(result.totalHeadMovement).toBe(100); // 10 + 20 + 60 + 10
    expect(result.completedRequests).toBe(4);
    expect(result.steps.some((step) => step.eventType === "direction-change"))
      .toBe(true);
  });

  it("starts downward and reverses only after the furthest lower request", () => {
    const requests = [
      request("R1", 80),
      request("R2", 10),
      request("R3", 60),
      request("R4", 20),
    ];
    const result = runLOOK(requests, { ...baseConfig, direction: "down" });

    expect(servedIds(requests, { ...baseConfig, direction: "down" })).toEqual([
      "R4", "R2", "R3", "R1",
    ]);
    expect(result.totalHeadMovement).toBe(110); // 30 + 10 + 50 + 20
  });

  it("does not travel to a disk boundary when requests occupy one side", () => {
    const requests = [request("R1", 90), request("R2", 80)];
    const result = runLOOK(requests, baseConfig);

    expect(servedIds(requests)).toEqual(["R2", "R1"]);
    expect(result.totalHeadMovement).toBe(40);
    expect(result.steps.some((step) => step.eventType === "direction-change"))
      .toBe(false);
  });

  it("serves requests at the initial head first, including same-cylinder requests", () => {
    const requests = [
      request("R1", 50),
      request("R2", 40),
      request("R3", 50),
      request("R4", 60),
    ];
    const result = runLOOK(requests, baseConfig);

    expect(servedIds(requests)).toEqual(["R1", "R3", "R4", "R2"]);
    expect(result.totalHeadMovement).toBe(30); // 0 + 0 + 10 + 20
    expect(result.completedRequests).toBe(4);
  });

  it("handles minimum and maximum cylinder requests and heads at either endpoint", () => {
    const fromMinimum = [request("MIN", 0), request("MAX", 199)];
    const minimumConfig = { ...baseConfig, initialHead: 0 };
    const minimumResult = runLOOK(fromMinimum, minimumConfig);
    expect(servedIds(fromMinimum, minimumConfig)).toEqual(["MIN", "MAX"]);
    expect(minimumResult.totalHeadMovement).toBe(199);

    const fromMaximum = [request("MAX", 199), request("MIN", 0)];
    const maximumConfig = {
      ...baseConfig,
      initialHead: 199,
      direction: "down" as const,
    };
    const maximumResult = runLOOK(fromMaximum, maximumConfig);
    expect(servedIds(fromMaximum, maximumConfig)).toEqual(["MAX", "MIN"]);
    expect(maximumResult.totalHeadMovement).toBe(199);
  });

  it("returns zero movement for empty input and calculates a single request", () => {
    const empty = runLOOK([], baseConfig);
    expect(empty.steps).toEqual([]);
    expect(empty.totalHeadMovement).toBe(0);
    expect(empty.totalSeekTime).toBe(0);
    expect(empty.completedRequests).toBe(0);

    const single = runLOOK([request("ONLY", 70)], baseConfig);
    expect(servedIds([request("ONLY", 70)])).toEqual(["ONLY"]);
    expect(single.totalHeadMovement).toBe(20);
    expect(single.completedRequests).toBe(1);
  });

  it("relies on project validation to reject requests outside cylinder bounds", () => {
    const invalid = validateRequests([request("INVALID", 200)], baseConfig);
    expect(invalid.valid).toBe(false);
    expect(invalid.errors).toContain(
      'Cylinder request "INVALID" berada di luar rentang.',
    );
  });
});
