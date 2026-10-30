import type {
  DiskRequest,
  SimulationConfig,
  SimulationResult,
  SimulationStep,
} from "./types";

export function runSSTF(
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

  while (pendingRequests.some((item) => !item.completed)) {
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

    // Pilih request dengan jarak terdekat dari posisi head.
    let selectedRequest = availableRequests[0];

    if (!selectedRequest) {
      continue;
    }

    for (const candidate of availableRequests) {
      const candidateDistance = Math.abs(
        candidate.request.cylinder - headPosition,
      );

      const selectedDistance = Math.abs(
        selectedRequest.request.cylinder - headPosition,
      );

      // Jika jarak sama, pilih request yang lebih dahulu di antrean.
      if (
        candidateDistance < selectedDistance ||
        (candidateDistance === selectedDistance &&
          candidate.index < selectedRequest.index)
      ) {
        selectedRequest = candidate;
      }
    }

    const request = selectedRequest.request;

    const distance = Math.abs(request.cylinder - headPosition);

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
      explanation: `SSTF memilih request ${request.id} karena memiliki jarak terdekat dari posisi head saat ini.`,
    });

    selectedRequest.completed = true;
    headPosition = request.cylinder;
  }

  return {
    algorithm: "SSTF",
    steps,
    totalHeadMovement,
    totalSeekTime: elapsedTime,
    completedRequests: steps.length,
  };
}