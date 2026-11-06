import { useCallback, useEffect, useState } from "react";

export type PlaybackSpeed = 0.5 | 1 | 2 | 4;

export const PLAYBACK_SPEEDS: PlaybackSpeed[] = [0.5, 1, 2, 4];

const BASE_INTERVAL_MS = 1000;

/**
 * position: -1 = kondisi awal (belum ada langkah),
 * 0..totalSteps-1 = indeks langkah yang sedang ditampilkan.
 */
export function usePlayback(totalSteps: number) {
  const [position, setPosition] = useState(-1);
  const [playRequested, setPlayRequested] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);

  const lastIndex = totalSteps - 1;
  const isPlaying = playRequested && position < lastIndex;
  const isFinished = totalSteps > 0 && position >= lastIndex;

  useEffect(() => {
    if (!isPlaying) return;

    const timer = window.setTimeout(() => {
      setPosition((current) => Math.min(current + 1, lastIndex));
    }, BASE_INTERVAL_MS / speed);

    return () => window.clearTimeout(timer);
  }, [isPlaying, position, speed, lastIndex]);

  const play = useCallback(() => {
    if (totalSteps === 0) return;
    setPosition((current) => (current >= lastIndex ? -1 : current));
    setPlayRequested(true);
  }, [totalSteps, lastIndex]);

  const pause = useCallback(() => {
    setPlayRequested(false);
  }, []);

  const stepForward = useCallback(() => {
    setPlayRequested(false);
    setPosition((current) => Math.min(current + 1, lastIndex));
  }, [lastIndex]);

  const stepBack = useCallback(() => {
    setPlayRequested(false);
    setPosition((current) => Math.max(current - 1, -1));
  }, []);

  const seek = useCallback(
    (index: number) => {
      setPlayRequested(false);
      setPosition(Math.max(-1, Math.min(index, lastIndex)));
    },
    [lastIndex],
  );

  // Reset hanya mengembalikan progres, konfigurasi pengguna tidak disentuh.
  const reset = useCallback(() => {
    setPlayRequested(false);
    setPosition(-1);
  }, []);

  const replay = useCallback(() => {
    if (totalSteps === 0) return;
    setPosition(-1);
    setPlayRequested(true);
  }, [totalSteps]);

  return {
    position,
    isPlaying,
    isFinished,
    speed,
    setSpeed,
    play,
    pause,
    stepForward,
    stepBack,
    seek,
    reset,
    replay,
  };
}