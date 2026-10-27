import type {
  DiskRequest,
  SimulationMetrics,
  SimulationStep,
} from "../algorithms/types";

export function calculateMetrics(
  requests: DiskRequest[],
  steps: SimulationStep[],
  totalHeadMovement: number,
): SimulationMetrics {
  const requestById = new Map(
    requests.map((request) => [request.id, request]),
  );

  const servedByRequestId = new Map<string, SimulationStep>();

  for (const step of steps) {
    if (
      step.eventType === "request-served" &&
      step.requestId !== undefined &&
      requestById.has(step.requestId)
    ) {
      servedByRequestId.set(step.requestId, step);
    }
  }

  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  let maxWaitingTime = 0;

  for (const [requestId, step] of servedByRequestId) {
    const request = requestById.get(requestId);
    if (!request) continue;

    const completionTime = step.completionTime ?? step.elapsedTime;
    const serviceStartTime = step.serviceStartTime ?? completionTime;

    const waitingTime = Math.max(
      0,
      serviceStartTime - request.arrivalTime,
    );

    const turnaroundTime = Math.max(
      0,
      completionTime - request.arrivalTime,
    );

    const responseTime = Math.max(
      0,
      serviceStartTime - request.arrivalTime,
    );

    totalWaitingTime += waitingTime;
    totalTurnaroundTime += turnaroundTime;
    totalResponseTime += responseTime;
    maxWaitingTime = Math.max(maxWaitingTime, waitingTime);
  }

  const completedRequests = servedByRequestId.size;

  const averageWaitingTime =
    completedRequests > 0 ? totalWaitingTime / completedRequests : 0;

  const averageTurnaroundTime =
    completedRequests > 0 ? totalTurnaroundTime / completedRequests : 0;

  const averageResponseTime =
    completedRequests > 0 ? totalResponseTime / completedRequests : 0;

  const totalSeekTime = steps.reduce(
    (maximum, step) => Math.max(maximum, step.elapsedTime),
    0,
  );

  const throughput =
    totalSeekTime > 0 ? completedRequests / totalSeekTime : 0;

  return {
    totalHeadMovement,
    totalSeekTime,
    averageWaitingTime,
    averageTurnaroundTime,
    averageResponseTime,
    throughput,
    maxWaitingTime,
  };
}
