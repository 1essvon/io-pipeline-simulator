import { PLAYBACK_SPEEDS } from "../../hooks/usePlayback";
import type { PlaybackSpeed } from "../../hooks/usePlayback";

interface PlaybackControlsProps {
  totalSteps: number;
  position: number;
  isPlaying: boolean;
  isFinished: boolean;
  speed: PlaybackSpeed;
  onPlay: () => void;
  onPause: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onReplay: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
}

export function PlaybackControls({
  totalSteps,
  position,
  isPlaying,
  isFinished,
  speed,
  onPlay,
  onPause,
  onStepBack,
  onStepForward,
  onReset,
  onReplay,
  onSpeedChange,
}: PlaybackControlsProps) {
  const hasSteps = totalSteps > 0;
  const shownStep = Math.max(position + 1, 0);

  return (
    <section className="playback-panel" aria-label="Kontrol simulasi">
      <h2>Kontrol Simulasi</h2>

      <div className="playback-buttons">
        <button
          type="button"
          onClick={onStepBack}
          disabled={!hasSteps || position < 0}
        >
          ◀ Sebelumnya
        </button>

        {isPlaying ? (
          <button type="button" className="playback-primary" onClick={onPause}>
            ⏸ Jeda
          </button>
        ) : (
          <button
            type="button"
            className="playback-primary"
            onClick={onPlay}
            disabled={!hasSteps}
          >
            ▶ {isFinished ? "Putar Ulang" : "Putar"}
          </button>
        )}

        <button
          type="button"
          onClick={onStepForward}
          disabled={!hasSteps || isFinished}
        >
          Berikutnya ▶
        </button>

        <button
          type="button"
          onClick={onReset}
          disabled={!hasSteps || position < 0}
        >
          ⟲ Reset
        </button>

        <button type="button" onClick={onReplay} disabled={!hasSteps}>
          ↻ Ulangi
        </button>
      </div>

      <div className="speed-options" role="group" aria-label="Kecepatan animasi">
        <span className="field-label">Kecepatan</span>
        {PLAYBACK_SPEEDS.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={speed === option}
            onClick={() => onSpeedChange(option)}
          >
            {option}x
          </button>
        ))}
      </div>

      <progress
        className="playback-progress"
        value={shownStep}
        max={Math.max(totalSteps, 1)}
        aria-label="Progres simulasi"
      />
      <p className="playback-status">
        {hasSteps
          ? `Langkah ${shownStep} dari ${totalSteps}`
          : "Jalankan simulasi untuk mengaktifkan kontrol."}
      </p>
    </section>
  );
}