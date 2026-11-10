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
  const pendingRequests = requests.map((request, index) => ({
    request,
    index,
    completed: false,
  }));

  const steps: SimulationStep[] = [];

  let headPosition = config.initialHead;
  let elapsedTime = 0;
  let totalHeadMovement = 0;

  // C-LOOK mempertahankan arah awal dan melakukan wrap,
  // bukan membalik arah seperti LOOK.
  const direction = config.direction;

  while (pendingRequests.some((item) => !item.completed)) {
    // Hanya request yang sudah tiba yang boleh dipilih.
    const availableRequests = pendingRequests.filter(
      (item) =>
        !item.completed &&
        item.request.arrivalTime <= elapsedTime,
    );

    // Jika belum ada request tersedia, tunggu kedatangan berikutnya.
    if (availableRequests.length === 0) {
      const nextArrivalTime = Math.min(
        ...pendingRequests
          .filter((item) => !item.completed)
          .map((item) => item.request.arrivalTime),
      );

      elapsedTime = Math.max(elapsedTime, nextArrivalTime);
      continue;
    }

    // Cari request yang berada pada arah pergerakan saat ini.
    const directionalRequests = availableRequests
      .filter((item) =>
        direction === "up"
          ? item.request.cylinder >= headPosition
          : item.request.cylinder <= headPosition,
      )
      .sort((a, b) => {
        const distanceA = Math.abs(
          a.request.cylinder - headPosition,
        );
        const distanceB = Math.abs(
          b.request.cylinder - headPosition,
        );

        return distanceA - distanceB || a.index - b.index;
      });

    let selectedRequest = directionalRequests[0];

    // Jika tidak ada request di arah saat ini,
    // lakukan wrap ke request terdekat pada sisi seberang.
    if (!selectedRequest) {
      const oppositeRequests = availableRequests.sort(
        (a, b) => {
          const cylinderDifference =
            direction === "up"
              ? a.request.cylinder - b.request.cylinder
              : b.request.cylinder - a.request.cylinder;

          return cylinderDifference || a.index - b.index;
        },
      );

      selectedRequest = oppositeRequests[0];

      if (!selectedRequest) continue;

      const wrapDestination =
        selectedRequest.request.cylinder;

      const distance = Math.abs(
        wrapDestination - headPosition,
      );

      totalHeadMovement += distance;
      elapsedTime += distance * config.serviceTime;
      headPosition = wrapDestination;

      steps.push({
        stepNumber: steps.length + 1,
        headPosition,
        distanceFromPrevious: distance,
        elapsedTime,
        eventType: "wrap-around",
        explanation: `C-LOOK melakukan wrap ke request terdekat pada sisi berlawanan di cylinder ${wrapDestination}.`,
      });

      // Request akan dilayani pada iterasi berikutnya.
      continue;
    }

    // Layani request terpilih.
    const request = selectedRequest.request;

    const distance = Math.abs(
      request.cylinder - headPosition,
    );

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
      explanation: `C-LOOK melayani request ${request.id} sesuai arah pergerakan head (${direction}).`,
    });
  }

  return {
    algorithm: "C-LOOK",
    steps,
    totalHeadMovement,
    totalSeekTime: elapsedTime,
    completedRequests: steps.filter(
      (step) => step.eventType === "request-served",
    ).length,
  };
}