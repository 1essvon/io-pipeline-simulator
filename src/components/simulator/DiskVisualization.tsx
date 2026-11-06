import type {
  DiskRequest,
  SimulationConfig,
  SimulationStep,
} from "../../algorithms/types";

interface DiskVisualizationProps {
  config: SimulationConfig;
  requests: DiskRequest[];
  steps: SimulationStep[];
  activeIndex: number | null;
  totalHeadMovement: number | null;
}

const CHART_WIDTH = 1000;
const CHART_PADDING = 40;
const ROW_HEIGHT = 32;
const TOP_OFFSET = 24;

export function DiskVisualization({
  config,
  requests,
  steps,
  activeIndex,
  totalHeadMovement,
}: DiskVisualizationProps) {
  const { minCylinder, maxCylinder, initialHead } = config;
  const span = Math.max(1, maxCylinder - minCylinder);

  const toPercent = (cylinder: number) =>
    ((cylinder - minCylinder) / span) * 100;

  const toX = (cylinder: number) =>
    CHART_PADDING +
    ((cylinder - minCylinder) / span) * (CHART_WIDTH - 2 * CHART_PADDING);

  const visibleSteps =
    activeIndex === null ? [] : steps.slice(0, activeIndex + 1);

  const headPosition =
    visibleSteps.length > 0
      ? visibleSteps[visibleSteps.length - 1].headPosition
      : initialHead;

  const servedIds = new Set<string>();
  const servedOrder: number[] = [];

  for (const step of visibleSteps) {
    if (step.eventType === "request-served") {
      if (step.requestId !== undefined) servedIds.add(step.requestId);
      servedOrder.push(step.cylinder ?? step.headPosition);
    }
  }

  const pathPoints = [
    initialHead,
    ...visibleSteps.map((step) => step.headPosition),
  ];

  const chartHeight = TOP_OFFSET * 2 + steps.length * ROW_HEIGHT;
  const polyline = pathPoints
    .map((cylinder, index) => `${toX(cylinder)},${TOP_OFFSET + index * ROW_HEIGHT}`)
    .join(" ");

  const ticks = [0, 1, 2, 3, 4].map((index) =>
    Math.round(minCylinder + (span * index) / 4),
  );

  return (
    <section className="disk-panel">
      <h2>Visualisasi Disk</h2>

      <ul className="disk-legend">
        <li>▼ Head</li>
        <li>○ Menunggu</li>
        <li>✓ Dilayani</li>
      </ul>

      <div className="disk-track-wrap">
        <div
          className="disk-track"
          role="img"
          aria-label={`Head berada di silinder ${headPosition}`}
        >
          <div className="disk-bar" />

          <span
            className="disk-head"
            style={{ left: `${toPercent(headPosition)}%` }}
          >
            ▼ Head {headPosition}
          </span>

          {requests.map((request) => {
            const served = servedIds.has(request.id);
            return (
              <span
                key={request.id}
                className={`disk-marker ${served ? "is-served" : "is-pending"}`}
                style={{ left: `${toPercent(request.cylinder)}%` }}
                title={`${request.id}: silinder ${request.cylinder} (${
                  served ? "dilayani" : "menunggu"
                })`}
              >
                {served ? "✓" : "○"} {request.cylinder}
              </span>
            );
          })}
        </div>

        <div className="disk-ticks">
          {ticks.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
      </div>

      <div className="disk-summary">
        <div className="disk-order">
          <span className="field-label">Urutan Pelayanan</span>
          <p>
            {servedOrder.length > 0
              ? servedOrder.join(" → ")
              : "Belum ada permintaan yang dilayani."}
          </p>
        </div>
        <div>
          <span className="field-label">Total Head Movement</span>
          <p className="disk-total">
            {totalHeadMovement !== null ? totalHeadMovement : "-"}
          </p>
        </div>
        <div>
          <span className="field-label">Jumlah Permintaan</span>
          <p className="disk-total">{requests.length}</p>
        </div>
      </div>

      {steps.length > 0 && (
        <div className="table-scroll">
          <svg
            className="disk-path"
            viewBox={`0 0 ${CHART_WIDTH} ${chartHeight}`}
            role="img"
            aria-label="Grafik lintasan head dari atas ke bawah menurut urutan langkah"
          >
            <polyline className="disk-path-line" points={polyline} />
            {pathPoints.map((cylinder, index) => (
              <g key={`${index}-${cylinder}`}>
                <circle
                  className="disk-path-dot"
                  cx={toX(cylinder)}
                  cy={TOP_OFFSET + index * ROW_HEIGHT}
                  r={5}
                />
                <text
                  className="disk-path-label"
                  x={toX(cylinder)}
                  y={TOP_OFFSET + index * ROW_HEIGHT - 10}
                  textAnchor="middle"
                >
                  {cylinder}
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}
    </section>
  );
}