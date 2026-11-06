
import type {
  AlgorithmId,
  DiskRequest,
  SimulationConfig,
  SimulationResult,
} from "../algorithms/types";
import { validateConfig, validateRequests } from "../utils/validation";
import { runFCFS } from "../algorithms/fcfs";
import { runSSTF } from "../algorithms/sstf";
import { runSCAN } from "../algorithms/scan";
import { runCSCAN } from "../algorithms/cscan";
import { runLOOK } from "../algorithms/look";
import { runCLOOK } from "../algorithms/clook";

export interface SimulationInput {
  algorithm: AlgorithmId;
  requests: DiskRequest[];
  config: SimulationConfig;
}

export interface SimulationOutput {
  success: boolean;
  result?: SimulationResult;
  errors: string[];
}

export type AlgorithmRunner = (
  requests: DiskRequest[],
  config: SimulationConfig,
) => SimulationResult;

const algorithmRegistry = new Map<AlgorithmId, AlgorithmRunner>();

// Daftarkan algoritma yang sudah tersedia.
registerAlgorithm("FCFS", runFCFS);
registerAlgorithm("SSTF", runSSTF);
registerAlgorithm("SCAN", runSCAN);
registerAlgorithm("C-SCAN", runCSCAN);
registerAlgorithm("LOOK", runLOOK);
registerAlgorithm("C-LOOK", runCLOOK);

export function registerAlgorithm(
  id: AlgorithmId,
  runner: AlgorithmRunner,
): void {
  algorithmRegistry.set(id, runner);
}

/**
 * Memvalidasi input sebelum simulasi dijalankan.
 */
export function validateSimulationInput(
  input: SimulationInput,
): string[] {
  if (!input || typeof input !== "object") {
    return ["Input simulasi tidak valid."];
  }

  const configValidation = validateConfig(input.config);
  const requestValidation = validateRequests(
    input.requests,
    input.config,
  );

  return [...new Set([
    ...configValidation.errors,
    ...requestValidation.errors,
  ])];
}

export function runSimulation(
  input: SimulationInput,
): SimulationOutput {
  const errors = validateSimulationInput(input);

  if (errors.length > 0) {
    return {
      success: false,
      errors,
    };
  }

  const runner = algorithmRegistry.get(input.algorithm);

  if (!runner) {
    return {
      success: false,
      errors: [
        `Algoritma ${input.algorithm} belum didaftarkan.`,
      ],
    };
  }

  try {
    const result = runner(input.requests, input.config);

    return {
      success: true,
      result,
      errors: [],
    };
  } catch (error) {
    return {
      success: false,
      errors: [
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menjalankan simulasi.",
      ],
    };
  }
}
