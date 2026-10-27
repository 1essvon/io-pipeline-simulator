
import type {
  AlgorithmId,
  DiskRequest,
  SimulationConfig,
  SimulationResult,
} from "../algorithms/types";
import { validateConfig, validateRequests } from "../utils/validation";

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

/**
 * Memvalidasi input sebelum simulasi dijalankan.
 */
export function validateSimulationInput(
  input: SimulationInput,
): string[] {
  const configValidation = validateConfig(input.config);
  const requestValidation = validateRequests(
    input.requests,
    input.config,
  );

  return [
    ...configValidation.errors,
    ...requestValidation.errors,
  ];
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

  return {
    success: false,
    errors: [
      `Algoritma ${input.algorithm} belum tersedia.`,
    ],
  };
}
