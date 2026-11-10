
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
    const availableRequests = pendingRequests.filter(
      (item) =>
        !item.completed &&
        item.request.arrivalTime <= elapsedTime,
    );

    // Tunggu sampai request berikutnya tiba jika antrean kosong.
    if (availableRequests.length === 0) {
      const nextArrivalTime = Math.min(
        ...pendingRequests
          .filter((item) => !item.completed)
          .map((item) => item.request.arrivalTime),
      );

      elapsedTime = Math.max(elapsedTime, nextArrivalTime);
      continue;
    }

    // Cari request yang tersedia pada arah saat ini.
    let directionalRequests = availableRequests.filter(
      (item) =>
        direction === "up"
          ? item.request.cylinder >= headPosition
          : item.request.cylinder <= headPosition,
    );

    // Jika tidak ada request pada arah saat ini,
    // LOOK berbalik menuju request yang tersedia di sisi lain.
    if (directionalRequests.length === 0) {
      const previousDirection = direction;
      direction = direction === "up" ? "down" : "up";

      directionalRequests = availableRequests.filter(
        (item) =>
          direction === "up"
            ? item.request.cylinder >= headPosition
            : item.request.cylinder <= headPosition,
      );

      steps.push({
        stepNumber: steps.length + 1,
        headPosition,
        distanceFromPrevious: 0,
        elapsedTime,
        eventType: "direction-change",
        explanation: `LOOK mengubah arah dari ${previousDirection} ke ${direction} karena tidak ada request tersedia pada arah sebelumnya.`,
      });
    }

    // Pilih request terdekat pada arah yang aktif.
    directionalRequests.sort((a, b) => {
      const distanceA = Math.abs(
        a.request.cylinder - headPosition,
      );
      const distanceB = Math.abs(
        b.request.cylinder - headPosition,
      );

      return distanceA - distanceB || a.index - b.index;
    });

    const selectedRequest = directionalRequests[0];

    if (!selectedRequest) {
      continue;
    }

    const request = selectedRequest.request;
    const distance = Math.abs(request.cylinder - headPosition);

    const serviceStartTime = elapsedTime;
    const completionTime =
      serviceStartTime + distance * config.serviceTime;

    totalHeadMovement += distance;
    elapsedTime = completionTime;
    headPosition = request.cylinder;
    selectedRequest.completed = true;

    steps.push({
      stepNumber: steps.length + 1,
      headPosition,
      requestId: request.id,
      cylinder: request.cylinder,
      distanceFromPrevious: distance,
      elapsedTime: completionTime,
      serviceStartTime,
      completionTime,
      eventType: "request-served",
      explanation: `LOOK melayani request ${request.id} sesuai arah pergerakan head (${direction}).`,
    });
  }

  return {
    algorithm: "LOOK",
    steps,
    totalHeadMovement,
    totalSeekTime: elapsedTime,
    completedRequests: steps.filter(
      (step) => step.eventType === "request-served",
    ).length,
  };
}
