import type {
  DiskRequest,
  SimulationConfig,
  SimulationResult,
  SimulationStep,
} from "./types";

export function runCLOOK(
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
  const afterWrap = requests
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

  const steps: SimulationStep[] = [];
  let headPosition = config.initialHead;
  let elapsedTime = 0;
  let totalHeadMovement = 0;

  const serveRequest = (request: DiskRequest) => {
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
      explanation: `C-LOOK melayani request ${request.id} sesuai arah pergerakan head.`,
    });

    headPosition = request.cylinder;
  };

  atInitialHead.forEach(serveRequest);
  ahead.forEach(serveRequest);

  if (afterWrap.length > 0) {
    const wrapDestination = afterWrap[0].cylinder;
    const distance = Math.abs(wrapDestination - headPosition);
    totalHeadMovement += distance;
    elapsedTime += distance * config.serviceTime;
    headPosition = wrapDestination;

    steps.push({
      stepNumber: steps.length + 1,
      headPosition,
      distanceFromPrevious: distance,
      elapsedTime,
      eventType: "wrap-around",
      explanation: `C-LOOK melakukan wrap ke request terjauh pada sisi berlawanan di cylinder ${wrapDestination}.`,
    });

    afterWrap.forEach(serveRequest);
  }

  return {
    algorithm: "C-LOOK",
    steps,
    totalHeadMovement,
    totalSeekTime: elapsedTime,
    completedRequests: requests.length,
  };
}