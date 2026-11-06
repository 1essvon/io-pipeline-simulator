import type {
  DiskRequest,
  SimulationConfig,
  SimulationResult,
  SimulationStep,
} from "./types";

export function runLOOK(
  requests: DiskRequest[],
  config: SimulationConfig,
): SimulationResult {
  const atInitialHead = requests.filter(
    (request) => request.cylinder === config.initialHead,
  );
  const ahead = requests
    .filter((request) =>
      config.direction === "up"
        ? request.cylinder > config.initialHead
        : request.cylinder < config.initialHead,
    )
    .sort((a, b) =>
      config.direction === "up"
        ? a.cylinder - b.cylinder
        : b.cylinder - a.cylinder,
    );
  const remaining = requests
    .filter((request) =>
      config.direction === "up"
        ? request.cylinder < config.initialHead
        : request.cylinder > config.initialHead,
    )
    .sort((a, b) =>
      config.direction === "up"
        ? b.cylinder - a.cylinder
        : a.cylinder - b.cylinder,
    );
  const orderedRequests = [...atInitialHead, ...ahead, ...remaining];

  const steps: SimulationStep[] = [];
  let headPosition = config.initialHead;
  let elapsedTime = 0;
  let totalHeadMovement = 0;

  for (let index = 0; index < orderedRequests.length; index += 1) {
    const request = orderedRequests[index];

    if (index === atInitialHead.length + ahead.length && remaining.length > 0) {
      steps.push({
        stepNumber: steps.length + 1,
        headPosition,
        distanceFromPrevious: 0,
        elapsedTime,
        eventType: "direction-change",
        explanation: "LOOK mengubah arah setelah mencapai request terjauh.",
      });
    }

    const distance = Math.abs(request.cylinder - headPosition);
    totalHeadMovement += distance;

    const serviceStartTime = Math.max(elapsedTime, request.arrivalTime);
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
      explanation: `LOOK melayani request ${request.id} sesuai arah pergerakan head.`,
    });

    headPosition = request.cylinder;
  }

  return {
    algorithm: "LOOK",
    steps,
    totalHeadMovement,
    totalSeekTime: elapsedTime,
    completedRequests: orderedRequests.length,
  };
}