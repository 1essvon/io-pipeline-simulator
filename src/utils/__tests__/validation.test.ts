import { describe, expect, it } from "vitest";
import type { DiskRequest, SimulationConfig } from "../../algorithms/types";
import { validateConfig, validateRequests } from "../validation";

const config: SimulationConfig = {
  initialHead: 50,
  minCylinder: 0,
  maxCylinder: 199,
  direction: "up",
  serviceTime: 1,
};

const request: DiskRequest = {
  id: "R1",
  cylinder: 80,
  arrivalTime: 0,
};

describe("validateConfig", () => {
  it("menerima konfigurasi disk yang valid", () => {
    expect(validateConfig(config).valid).toBe(true);
  });

  it("menolak posisi head di luar batas dan rentang cylinder tidak valid", () => {
    expect(
      validateConfig({ ...config, initialHead: 200 }).errors,
    ).toContain("Posisi awal head harus berada dalam rentang cylinder.");
    expect(
      validateConfig({ ...config, minCylinder: 10, maxCylinder: 10 })
        .errors,
    ).toContain("Rentang cylinder tidak valid.");
  });

  it("menolak service time tidak valid", () => {
    expect(
      validateConfig({ ...config, serviceTime: 0 }).errors,
    ).toContain("Service time harus lebih besar dari 0.");
  });

  it("menolak konfigurasi kosong", () => {
    expect(validateConfig(undefined as unknown as SimulationConfig).valid)
      .toBe(false);
  });
});

describe("validateRequests", () => {
  it("menolak antrean kosong", () => {
    expect(validateRequests([], config).errors).toContain(
      "Minimal satu request harus disediakan.",
    );
  });

  it("menolak cylinder di luar rentang dan arrival time tidak valid", () => {
    const invalidRequest = {
      ...request,
      cylinder: 200,
      arrivalTime: -1,
    };

    const validation = validateRequests([invalidRequest], config);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain(
      'Cylinder request "R1" berada di luar rentang.',
    );
    expect(validation.errors).toContain(
      'Arrival time request "R1" tidak valid.',
    );
  });

  it("menolak ID kosong dan duplikat", () => {
    const validation = validateRequests(
      [
        { ...request, id: " " },
        { ...request, id: "R1" },
        { ...request, id: "R1" },
      ],
      config,
    );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain("Request ke-1 harus memiliki ID.");
    expect(validation.errors).toContain('ID request "R1" duplikat.');
  });

  it("menolak daftar request dengan bentuk tidak valid", () => {
    expect(
      validateRequests(undefined as unknown as DiskRequest[], config).valid,
    ).toBe(false);
  });

  it("menolak rentang konfigurasi tidak valid saat memvalidasi request", () => {
    const invalidConfig = { ...config, minCylinder: 20, maxCylinder: 10 };
    const validation = validateRequests([request], invalidConfig);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(["Rentang cylinder tidak valid."]);
  });

  it("menangani config yang tidak diberikan dengan aman", () => {
    const validation = validateRequests(
      [request],
      undefined as unknown as SimulationConfig,
    );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain("Rentang cylinder tidak valid.");
  });

  it("menerima processId yang tidak diberikan atau berupa string non-kosong", () => {
    expect(validateRequests([request], config).valid).toBe(true);
    expect(
      validateRequests([{ ...request, processId: " P1 " }], config).valid,
    ).toBe(true);
  });

  it.each(["", "   ", 42, null])(
    "menolak processId tidak valid: %s",
    (processId) => {
      const validation = validateRequests(
        [{ ...request, processId } as DiskRequest],
        config,
      );

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain(
        'Process ID request "R1" tidak valid.',
      );
    },
  );

  it.each([Number.NaN, Number.POSITIVE_INFINITY, -1, "1"])(
    "menolak arrivalTime tidak valid: %s",
    (arrivalTime) => {
      const validation = validateRequests(
        [{ ...request, arrivalTime } as DiskRequest],
        config,
      );

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain(
        'Arrival time request "R1" tidak valid.',
      );
    },
  );

  it.each([80.5, Number.NaN, -1, 200])(
    "menolak cylinder bukan integer atau di luar rentang: %s",
    (cylinder) => {
      const validation = validateRequests(
        [{ ...request, cylinder }],
        config,
      );

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain(
        'Cylinder request "R1" berada di luar rentang.',
      );
    },
  );

  it.each([config.minCylinder, config.maxCylinder])(
    "menerima cylinder pada batas rentang: %s",
    (cylinder) => {
      expect(
        validateRequests([{ ...request, cylinder }], config).valid,
      ).toBe(true);
    },
  );

  it("menolak ID bukan string dan duplikat setelah trim", () => {
    const validation = validateRequests(
      [
        { ...request, id: 12 } as unknown as DiskRequest,
        { ...request, id: "R2" },
        { ...request, id: " R2 " },
      ],
      config,
    );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain("Request ke-1 harus memiliki ID.");
    expect(validation.errors).toContain('ID request " R2 " duplikat.');
  });

  it("menangani elemen request null dengan aman", () => {
    const validation = validateRequests(
      [null as unknown as DiskRequest],
      config,
    );

    expect(validation.valid).toBe(false);
    expect(validation.errors).toEqual(["Request ke-1 tidak valid."]);
  });
});
