
import { describe, expect, it } from "vitest";
import { runCLOOK } from "../clook";
import type { DiskRequest, SimulationConfig } from "../types";
import { validateRequests } from "../../utils/validation";

describe("C-LOOK Algorithm", () => {
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

  const servedIds = (
    requests: DiskRequest[],
    config = baseConfig,
  ) =>
    runCLOOK(requests, config).steps
      .filter((step) => step.eventType === "request-served")
      .map((step) => step.requestId);

  it("serves unsorted requests circularly upward and wraps to the smallest opposite request", () => {
    const requests = [
      request("R1", 10),
      request("R2", 80),
      request("R3", 20),
      request("R4", 60),
    ];

    const result = runCLOOK(requests, baseConfig);

    expect(servedIds(requests)).toEqual([
      "R4",
      "R2",
      "R1",
      "R3",
    ]);

    expect(
      result.steps
        .filter((step) => step.eventType === "wrap-around")
        .map((step) => [
          step.headPosition,
          step.distanceFromPrevious,
        ]),
    ).toEqual([[10, 70]]);

    expect(result.totalHeadMovement).toBe(110);
    expect(result.completedRequests).toBe(4);
  });

  it("serves unsorted requests circularly downward and wraps to the largest opposite request", () => {
    const requests = [
      request("R1", 10),
      request("R2", 80),
      request("R3", 20),
      request("R4", 60),
    ];

    const config = {
      ...baseConfig,
      direction: "down" as const,
    };

    const result = runCLOOK(requests, config);

    expect(servedIds(requests, config)).toEqual([
      "R3",
      "R1",
      "R2",
      "R4",
    ]);

    expect(
      result.steps
        .filter((step) => step.eventType === "wrap-around")
        .map((step) => [
          step.headPosition,
          step.distanceFromPrevious,
        ]),
    ).toEqual([[80, 70]]);

    expect(result.totalHeadMovement).toBe(130);
    expect(result.completedRequests).toBe(4);
  });

  it("does not wrap or travel to physical disk limits when requests are on one side", () => {
    const requests = [
      request("R1", 90),
      request("R2", 80),
    ];

    const result = runCLOOK(requests, baseConfig);

    expect(servedIds(requests)).toEqual(["R2", "R1"]);
    expect(result.totalHeadMovement).toBe(40);

    expect(
      result.steps.some(
        (step) => step.eventType === "wrap-around",
      ),
    ).toBe(false);
  });

  it("serves requests at the initial head first, including duplicate cylinders", () => {
    const requests = [
      request("R1", 50),
      request("R2", 40),
      request("R3", 50),
      request("R4", 60),
    ];

    const result = runCLOOK(requests, baseConfig);

    expect(servedIds(requests)).toEqual([
      "R1",
      "R3",
      "R4",
      "R2",
    ]);

    expect(result.totalHeadMovement).toBe(30);
    expect(result.completedRequests).toBe(4);
  });

  it("wraps between requests at cylinder bounds without visiting physical endpoints", () => {
    const requests = [
      request("MIN", 0),
      request("MAX", 199),
    ];

    const result = runCLOOK(requests, baseConfig);

    expect(servedIds(requests)).toEqual(["MAX", "MIN"]);

    expect(
      result.steps
        .filter((step) => step.eventType === "wrap-around")
        .map((step) => [
          step.headPosition,
          step.distanceFromPrevious,
        ]),
    ).toEqual([[0, 199]]);

    expect(result.totalHeadMovement).toBe(348);

    const endpointConfig = {
      ...baseConfig,
      initialHead: 0,
    };

    const endpointRequests = [
      request("MIN", 0),
      request("MAX", 199),
    ];

    const endpointResult = runCLOOK(
      endpointRequests,
      endpointConfig,
    );

    expect(
      servedIds(endpointRequests, endpointConfig),
    ).toEqual(["MIN", "MAX"]);

    expect(endpointResult.totalHeadMovement).toBe(199);
  });

  it("returns zero movement for empty input and calculates a single request", () => {
    const empty = runCLOOK([], baseConfig);

    expect(empty.steps).toEqual([]);
    expect(empty.totalHeadMovement).toBe(0);
    expect(empty.totalSeekTime).toBe(0);
    expect(empty.completedRequests).toBe(0);

    const singleRequests = [
      request("ONLY", 70),
    ];

    const single = runCLOOK(
      singleRequests,
      baseConfig,
    );

    expect(servedIds(singleRequests)).toEqual(["ONLY"]);
    expect(single.totalHeadMovement).toBe(20);
    expect(single.completedRequests).toBe(1);
  });

  it("relies on project validation to reject requests outside cylinder bounds", () => {
    const invalid = validateRequests(
      [request("INVALID", 200)],
      baseConfig,
    );

    expect(invalid.valid).toBe(false);

    expect(invalid.errors).toContain(
      'Cylinder 200 pada request ke-1 berada di luar rentang 0–199.',
    );
  });
});
