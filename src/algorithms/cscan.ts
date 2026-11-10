
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
  const pending = requests.map((request, index) => ({
    request,
    index,
    completed: false,
  }));

  const steps: SimulationStep[] = [];
  let headPosition = config.initialHead;
  let elapsedTime = 0;
  let totalHeadMovement = 0;

  const isInCurrentDirection = (cylinder: number) =>
    config.direction === "up"
      ? cylinder >= headPosition
      : cylinder <= headPosition;

  const moveHead = (destination: number, explanation: string) => {
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
    const serviceStartTime = elapsedTime;
    const completionTime =
      serviceStartTime + distance * config.serviceTime;

    totalHeadMovement += distance;
    elapsedTime = completionTime;
    headPosition = request.cylinder;

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
      explanation: `C-SCAN melayani request ${request.id} sesuai arah pergerakan head.`,
    });
  };

  while (pending.some((item) => !item.completed)) {
    let available = pending.filter(
      (item) =>
        !item.completed && item.request.arrivalTime <= elapsedTime,
    );

    // Jika belum ada request yang tersedia, tunggu kedatangan berikutnya.
    if (available.length === 0) {
      const nextArrival = Math.min(
        ...pending
          .filter((item) => !item.completed)
          .map((item) => item.request.arrivalTime),
      );

      elapsedTime = Math.max(elapsedTime, nextArrival);
      continue;
    }

    // Layani request terdekat yang tersedia pada arah saat ini.
    const candidates = available
      .filter((item) =>
        isInCurrentDirection(item.request.cylinder),
      )
      .sort((a, b) => {
        const distanceA = Math.abs(a.request.cylinder - headPosition);
        const distanceB = Math.abs(b.request.cylinder - headPosition);

        return distanceA - distanceB || a.index - b.index;
      });

    if (candidates.length > 0) {
      const selected = candidates[0];

      serveRequest(selected.request);
      selected.completed = true;
      continue;
    }

    // Tidak ada request tersedia di arah saat ini.
    // Jika ada request di sisi seberang, lakukan perjalanan ke batas
    // disk lalu wrap ke batas yang berlawanan.
    const directionalBoundary =
      config.direction === "up"
        ? config.maxCylinder
        : config.minCylinder;

    const oppositeBoundary =
      config.direction === "up"
        ? config.minCylinder
        : config.maxCylinder;

    if (headPosition !== directionalBoundary) {
      moveHead(
        directionalBoundary,
        `C-SCAN bergerak ke batas cylinder ${directionalBoundary} sebelum wrap.`,
      );
    }

    moveHead(
      oppositeBoundary,
      `C-SCAN melakukan wrap ke batas cylinder ${oppositeBoundary}.`,
    );

    // Pemilihan request dilakukan kembali setelah wrap selesai,
    // sehingga request yang tiba selama perjalanan ikut diperhitungkan.
  }

  return {
    algorithm: "C-SCAN",
    steps,
    totalHeadMovement,
    totalSeekTime: elapsedTime,
    completedRequests: requests.length,
  };
}
