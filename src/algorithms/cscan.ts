import type {
  DiskRequest,
  SimulationConfig,
  SimulationResult,
  SimulationStep,
} from "./types";

export function runCSCAN(
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
        ? a.cylinder - b.cylinder
        : b.cylinder - a.cylinder,
    );

  const steps: SimulationStep[] = [];
  let headPosition = config.initialHead;
  let elapsedTime = 0;
  let totalHeadMovement = 0;

  const addMovementStep = (
    destination: number,
    explanation: string,
  ) => {
    const distance = Math.abs(destination - headPosition);
    totalHeadMovement += distance;
    elapsedTime += distance * config.serviceTime;
    headPosition = destination;

    steps.push({
      stepNumber: steps.length + 1,
      headPosition,
      distanceFromPrevious: distance,
      elapsedTime,
      eventType: "wrap-around",
      explanation,
    });
  };

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
      explanation: `C-SCAN melayani request ${request.id} sesuai arah pergerakan head.`,
    });

    headPosition = request.cylinder;
  };

  atInitialHead.forEach(serveRequest);
  ahead.forEach(serveRequest);

  if (afterWrap.length > 0) {
    const directionalBoundary =
      config.direction === "up" ? config.maxCylinder : config.minCylinder;
    const oppositeBoundary =
      config.direction === "up" ? config.minCylinder : config.maxCylinder;

    if (headPosition !== directionalBoundary) {
      addMovementStep(
        directionalBoundary,
        `C-SCAN bergerak ke batas cylinder ${directionalBoundary} sebelum wrap.`,
      );
    }

    addMovementStep(
      oppositeBoundary,
      `C-SCAN melakukan wrap ke batas cylinder ${oppositeBoundary}.`,
    );
    afterWrap.forEach(serveRequest);
  }

  return {
    algorithm: "C-SCAN",
    steps,
    totalHeadMovement,
    totalSeekTime: elapsedTime,
    completedRequests: requests.length,
  };
}