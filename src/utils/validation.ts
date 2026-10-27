
import type { DiskRequest, SimulationConfig } from "../algorithms/types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateConfig(
  config: SimulationConfig,
): ValidationResult {
  const errors: string[] = [];

  if (
    !Number.isInteger(config.minCylinder) ||
    !Number.isInteger(config.maxCylinder) ||
    config.minCylinder < 0 ||
    config.maxCylinder <= config.minCylinder
  ) {
    errors.push("Rentang cylinder tidak valid.");
  }

  if (
    !Number.isInteger(config.initialHead) ||
    config.initialHead < config.minCylinder ||
    config.initialHead > config.maxCylinder
  ) {
    errors.push("Posisi awal head harus berada dalam rentang cylinder.");
  }

  if (!Number.isFinite(config.serviceTime) || config.serviceTime <= 0) {
    errors.push("Service time harus lebih besar dari 0.");
  }

  if (config.direction !== "up" && config.direction !== "down") {
    errors.push("Arah pergerakan head tidak valid.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateRequests(
  requests: DiskRequest[],
  config: SimulationConfig,
): ValidationResult {
  const errors: string[] = [];
  const seenIds = new Set<string>();

  requests.forEach((request, index) => {
    if (!request.id.trim()) {
      errors.push(`Request ke-${index + 1} harus memiliki ID.`);
    } else if (seenIds.has(request.id)) {
      errors.push(`ID request "${request.id}" duplikat.`);
    }

    seenIds.add(request.id);

    if (
      !Number.isInteger(request.cylinder) ||
      request.cylinder < config.minCylinder ||
      request.cylinder > config.maxCylinder
    ) {
      errors.push(
        `Cylinder request "${request.id}" berada di luar rentang.`,
      );
    }

    if (!Number.isFinite(request.arrivalTime) || request.arrivalTime < 0) {
      errors.push(
        `Arrival time request "${request.id}" tidak valid.`,
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
