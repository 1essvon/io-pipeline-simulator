export type AlgorithmId =
  | "FCFS"
  | "SSTF"
  | "SCAN"
  | "C-SCAN"
  | "LOOK"
  | "C-LOOK";

export type Direction = "up" | "down";

export interface DiskRequest {
  id: string;
  cylinder: number;
  arrivalTime: number;
  processId?: string;
}

export interface SimulationConfig {
  initialHead: number;
  minCylinder: number;
  maxCylinder: number;
  direction: Direction;
  serviceTime: number;
}

export type SimulationEventType =
  | "request-served"
  | "direction-change"
  | "wrap-around";

export interface SimulationStep {
  stepNumber: number;
  headPosition: number;
  requestId?: string;
  cylinder?: number;
  distanceFromPrevious: number;
  elapsedTime: number;
  serviceStartTime?: number;
  completionTime?: number;
  eventType: SimulationEventType;
  explanation: string;
}

export interface SimulationResult {
  algorithm: AlgorithmId;
  steps: SimulationStep[];
  totalHeadMovement: number;
  totalSeekTime: number;
  completedRequests: number;
}

export interface SimulationMetrics {
  totalHeadMovement: number;
  totalSeekTime: number;
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  averageResponseTime: number;
  throughput: number;
  maxWaitingTime: number;
}

export interface DiskSchedulingAlgorithm {
  id: AlgorithmId;
  name: string;
  run(
    requests: DiskRequest[],
    config: SimulationConfig,
  ): SimulationResult;
}