
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

  const servedSteps = steps.filter(
    (step) =>
      step.eventType === "request-served" &&
      step.requestId !== undefined &&
      requestById.has(step.requestId),
  );

  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  let totalResponseTime = 0;
  let maxWaitingTime = 0;

  for (const step of servedSteps) {
    const request = requestById.get(step.requestId!);
    if (!request) continue;

    const completionTime = step.completionTime ?? step.elapsedTime;
    const serviceStartTime =
      step.serviceStartTime ?? completionTime;

    const waitingTime = Math.max(
      0,
      serviceStartTime - request.arrivalTime,
    );

    const turnaroundTime = Math.max(
      0,
      completionTime - request.arrivalTime,
    );

    const responseTime = waitingTime;

    totalWaitingTime += waitingTime;
    totalTurnaroundTime += turnaroundTime;
    totalResponseTime += responseTime;
    maxWaitingTime = Math.max(maxWaitingTime, waitingTime);
  }

  const completedRequests = servedSteps.length;

  const averageWaitingTime =
    completedRequests > 0
      ? totalWaitingTime / completedRequests
      : 0;

  const averageTurnaroundTime =
    completedRequests > 0
      ? totalTurnaroundTime / completedRequests
      : 0;

  const averageResponseTime =
    completedRequests > 0
      ? totalResponseTime / completedRequests
      : 0;

  const totalSeekTime =
    steps.length > 0
      ? steps[steps.length - 1].elapsedTime
      : 0;

  const throughput =
    totalSeekTime > 0
      ? completedRequests / totalSeekTime
      : 0;

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
