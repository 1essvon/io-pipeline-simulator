import { describe, expect, it } from "vitest";
import { runCSCAN } from "../cscan";
import type { DiskRequest, SimulationConfig } from "../types";
import { validateRequests } from "../../utils/validation";

describe("C-SCAN Algorithm", () => {
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
    runCSCAN(requests, config).steps
      .filter((step) => step.eventType === "request-served")
      .map((step) => step.requestId);

  it("serves unsorted requests circularly in the upward direction", () => {
    const requests = [
      request("R1", 10),
      request("R2", 80),
      request("R3", 20),
      request("R4", 60),
    ];
    const result = runCSCAN(requests, baseConfig);

    expect(servedIds(requests)).toEqual(["R4", "R2", "R1", "R3"]);
    expect(result.totalHeadMovement).toBe(368); // 10 + 20 + 119 + 199 + 10 + 10
    expect(
      result.steps
        .filter((step) => step.eventType === "wrap-around")
        .map((step) => [step.headPosition, step.distanceFromPrevious]),
    ).toEqual([[199, 119], [0, 199]]);
    expect(result.completedRequests).toBe(4);
  });

  it("serves unsorted requests circularly in the downward direction", () => {
    const requests = [
      request("R1", 10),
      request("R2", 80),
      request("R3", 20),
      request("R4", 60),
    ];
    const config = { ...baseConfig, direction: "down" as const };
    const result = runCSCAN(requests, config);

    expect(servedIds(requests, config)).toEqual(["R3", "R1", "R2", "R4"]);
    expect(result.totalHeadMovement).toBe(388); // 30 + 10 + 10 + 199 + 119 + 20
    expect(
      result.steps
        .filter((step) => step.eventType === "wrap-around")
        .map((step) => [step.headPosition, step.distanceFromPrevious]),
    ).toEqual([[0, 10], [199, 199]]);
  });

  it("does not wrap when there are no requests on the other side", () => {
    const requests = [request("R1", 90), request("R2", 80)];
    const result = runCSCAN(requests, baseConfig);

    expect(servedIds(requests)).toEqual(["R2", "R1"]);
    expect(result.totalHeadMovement).toBe(40);
    expect(result.steps.some((step) => step.eventType === "wrap-around")).toBe(
      false,
    );
  });

  it("serves the initial-head request and duplicate cylinders once each", () => {
    const requests = [
      request("R1", 50),
      request("R2", 50),
      request("R3", 60),
      request("R4", 40),
    ];
    const result = runCSCAN(requests, baseConfig);

    expect(servedIds(requests)).toEqual(["R1", "R2", "R3", "R4"]);
    expect(result.totalHeadMovement).toBe(388); // 0 + 0 + 10 + 139 + 199 + 40
    expect(result.completedRequests).toBe(4);
    expect(result.steps.filter((step) => step.eventType === "request-served"))
      .toHaveLength(4);
  });

  it("wraps from an endpoint head and serves requests at both disk limits", () => {
    const upwardRequests = [request("MIN", 0), request("MAX", 199), request("MID", 49)];
    const fromMaximum = { ...baseConfig, initialHead: 199 };
    const upwardResult = runCSCAN(upwardRequests, fromMaximum);
    expect(servedIds(upwardRequests, fromMaximum)).toEqual(["MAX", "MIN", "MID"]);
    expect(upwardResult.totalHeadMovement).toBe(248); // 0 + 199 + 0 + 49
    expect(
      upwardResult.steps
        .filter((step) => step.eventType === "wrap-around")
        .map((step) => step.headPosition),
    ).toEqual([0]);

    const downwardRequests = [request("MAX", 199), request("MIN", 0), request("MID", 150)];
    const fromMinimum = {
      ...baseConfig,
      initialHead: 0,
      direction: "down" as const,
    };
    const downwardResult = runCSCAN(downwardRequests, fromMinimum);
    expect(servedIds(downwardRequests, fromMinimum)).toEqual(["MIN", "MAX", "MID"]);
    expect(downwardResult.totalHeadMovement).toBe(248); // 0 + 199 + 0 + 49
    expect(
      downwardResult.steps
        .filter((step) => step.eventType === "wrap-around")
        .map((step) => step.headPosition),
    ).toEqual([199]);
  });

  it("returns zero movement for empty input and calculates a single request", () => {
    const empty = runCSCAN([], baseConfig);
    expect(empty.steps).toEqual([]);
    expect(empty.totalHeadMovement).toBe(0);
    expect(empty.totalSeekTime).toBe(0);
    expect(empty.completedRequests).toBe(0);

    const singleRequests = [request("ONLY", 70)];
    const single = runCSCAN(singleRequests, baseConfig);
    expect(servedIds(singleRequests)).toEqual(["ONLY"]);
    expect(single.totalHeadMovement).toBe(20);
    expect(single.completedRequests).toBe(1);
  });

  it("relies on project validation to reject requests outside cylinder bounds", () => {
    const invalid = validateRequests([request("INVALID", -1)], baseConfig);
    expect(invalid.valid).toBe(false);
    expect(invalid.errors).toContain(
      'Cylinder request "INVALID" berada di luar rentang.',
    );
  });
});
