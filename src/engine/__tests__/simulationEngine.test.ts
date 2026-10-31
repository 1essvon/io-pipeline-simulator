import { describe, expect, it } from "vitest";
import {
  runSimulation,
} from "../simulationEngine";
import type {
  DiskRequest,
  SimulationConfig,
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

describe("simulationEngine", () => {
  it.each(["FCFS", "SSTF", "SCAN", "C-SCAN", "LOOK", "C-LOOK"] as const)(
    "menjalankan %s melalui jalur simulationEngine yang dipakai UI",
    (algorithm) => {
      const output = runSimulation({
        algorithm,
        requests,
        config,
      });

      expect(output.success).toBe(true);
      expect(output.result?.algorithm).toBe(algorithm);
      expect(output.result?.completedRequests).toBe(1);
      expect(output.result?.totalHeadMovement).toBe(32);
      expect(output.errors).toEqual([]);
    },
  );

  it("menolak algoritma yang tidak terdaftar dengan pesan yang jelas", () => {
    const output = runSimulation({
      algorithm: "UNKNOWN" as "FCFS",
      requests,
      config,
    });

    expect(output.success).toBe(false);
    expect(output.errors[0]).toContain(
      "Algoritma UNKNOWN belum didaftarkan.",
    );
  });

  it("menolak daftar request kosong sebelum menjalankan algoritma", () => {
    const output = runSimulation({
      algorithm: "FCFS",
      requests: [],
      config,
    });

    expect(output.success).toBe(false);
    expect(output.errors).toContain("Minimal satu request harus disediakan.");
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

  it("tidak menggandakan pesan rentang cylinder tidak valid", () => {
    const output = runSimulation({
      algorithm: "FCFS",
      requests,
      config: { ...config, minCylinder: 20, maxCylinder: 10 },
    });

    expect(output.success).toBe(false);
    expect(
      output.errors.filter((error) => error === "Rentang cylinder tidak valid."),
    ).toHaveLength(1);
  });
});
