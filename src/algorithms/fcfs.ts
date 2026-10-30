import type {
  DiskRequest,
  SimulationConfig,
  SimulationResult,
  SimulationStep,
} from "./types";

export function runFCFS(
  requests: DiskRequest[],
  config: SimulationConfig,
): SimulationResult {
  const sortedRequests = [...requests].sort(
    (a, b) => a.arrivalTime - b.arrivalTime,
  );

  const steps: SimulationStep[] = [];
  let headPosition = config.initialHead;
  let elapsedTime = 0;
  let totalHeadMovement = 0;

  for (const request of sortedRequests) {
    const distance = Math.abs(request.cylinder - headPosition);

    totalHeadMovement += distance;

    const serviceStartTime = Math.max(
      elapsedTime,
      request.arrivalTime,
    );

    const completionTime =
      serviceStartTime + distance * config.serviceTime;

    elapsedTime = completionTime;

    steps.push({
      stepNumber: steps.length + 1,
      headPosition: request.cylinder,
      requestId: request.id,
      cylinder: request.cylinder,
      distanceFromPrevious: distance,
      elapsedTime: completionTime,
      serviceStartTime,
      completionTime,
      eventType: "request-served",
      explanation: `FCFS melayani request ${request.id} sesuai urutan kedatangan.`,
    });

    headPosition = request.cylinder;
  }

  return {
    algorithm: "FCFS",
    steps,
    totalHeadMovement,
    totalSeekTime: elapsedTime,
    completedRequests: steps.length,
  };
}
