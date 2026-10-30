
import type {
  DiskRequest,
  SimulationConfig,
  SimulationResult,
  SimulationStep,
} from "./types";

export function runSCAN(
  requests: DiskRequest[],
  config: SimulationConfig,
): SimulationResult {
  const pendingRequests = requests.map((request, index) => ({
    request,
    index,
    completed: false,
  }));

  const steps: SimulationStep[] = [];

  let headPosition = config.initialHead;
  let elapsedTime = 0;
  let totalHeadMovement = 0;
  let direction = config.direction;

  while (pendingRequests.some((item) => !item.completed)) {
    // Ambil request yang sudah tiba.
    const availableRequests = pendingRequests.filter(
      (item) =>
        !item.completed &&
        item.request.arrivalTime <= elapsedTime,
    );

    // Tunggu jika belum ada request yang tiba.
    if (availableRequests.length === 0) {
      const nextArrivalTime = Math.min(
        ...pendingRequests
          .filter((item) => !item.completed)
          .map((item) => item.request.arrivalTime),
      );

      elapsedTime = Math.max(elapsedTime, nextArrivalTime);
      continue;
    }

    // Pilih request yang berada pada arah pergerakan head.
    const directionalRequests = availableRequests.filter(
      (item) =>
        direction === "up"
          ? item.request.cylinder >= headPosition
          : item.request.cylinder <= headPosition,
    );

    if (directionalRequests.length > 0) {
      let selectedRequest = directionalRequests[0];

      if (!selectedRequest) {
        continue;
      }

      // Pilih request terdekat dalam arah pergerakan.
      for (const candidate of directionalRequests) {
        const candidateDistance =
          direction === "up"
            ? candidate.request.cylinder - headPosition
            : headPosition - candidate.request.cylinder;

        const selectedDistance =
          direction === "up"
            ? selectedRequest.request.cylinder - headPosition
            : headPosition - selectedRequest.request.cylinder;

        // Jika jarak sama, pilih yang lebih awal di antrean.
        if (
          candidateDistance < selectedDistance ||
          (candidateDistance === selectedDistance &&
            candidate.index < selectedRequest.index)
        ) {
          selectedRequest = candidate;
        }
      }

      const request = selectedRequest.request;

      const distance = Math.abs(
        request.cylinder - headPosition,
      );

      totalHeadMovement += distance;

      const serviceStartTime = elapsedTime;

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
        explanation: `SCAN melayani request ${request.id} sesuai arah pergerakan head (${direction}).`,
      });

      selectedRequest.completed = true;
      headPosition = request.cylinder;
    } else {
      // Jika tidak ada request di depan, bergerak ke batas disk.
      const boundary =
        direction === "up"
          ? config.maxCylinder
          : config.minCylinder;

      const distance = Math.abs(boundary - headPosition);

      totalHeadMovement += distance;

      const completionTime =
        elapsedTime + distance * config.serviceTime;

      elapsedTime = completionTime;
      headPosition = boundary;

      // Balik arah setelah mencapai batas disk.
      const previousDirection = direction;

      direction = direction === "up" ? "down" : "up";

      steps.push({
        stepNumber: steps.length + 1,
        headPosition: boundary,
        distanceFromPrevious: distance,
        elapsedTime: completionTime,
        eventType: "direction-change",
        explanation: `SCAN mencapai batas silinder ${boundary} dan berbalik arah dari ${previousDirection} ke ${direction}.`,
      });
    }
  }

  return {
    algorithm: "SCAN",
    steps,
    totalHeadMovement,
    totalSeekTime: elapsedTime,
    completedRequests: steps.filter(
      (step) => step.eventType === "request-served",
    ).length,
  };
}
