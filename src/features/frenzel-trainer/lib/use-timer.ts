import { useState, useEffect, useRef } from 'react';

export interface UseTimerOptions {
  durationMinutes: number;
  onComplete?: () => void;
}

export interface UseTimerReturn {
  elapsedSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  complete: () => void;
  cancel: () => void;
  reset: () => void;
}

/**
 * useTimer Hook
 *
 * Manages timer state and lifecycle for training sessions.
 * Provides start, pause, resume, complete, and cancel controls.
 * React Compiler will optimize this automatically - no manual memoization needed.
 *
 * @param options - Timer configuration
 * @param options.durationMinutes - Total duration in minutes
 * @param options.onComplete - Callback when timer completes naturally or manually
 * @returns Timer state and control functions
 */
export function useTimer({ durationMinutes, onComplete }: UseTimerOptions): UseTimerReturn {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  const totalSeconds = durationMinutes * 60;

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const complete = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setIsPaused(false);
    onComplete?.();
  };

  // Auto-complete when time is up
  useEffect(() => {
    if (isRunning && !isPaused && elapsedSeconds >= totalSeconds) {
      complete();
    }
  }, [elapsedSeconds, isRunning, isPaused, totalSeconds]);

  const start = () => {
    setIsRunning(true);
    setIsPaused(false);
    setElapsedSeconds(0);
    startTimeRef.current = Date.now();
    pausedTimeRef.current = 0;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTimeRef.current - pausedTimeRef.current) / 1000);
      setElapsedSeconds(elapsed);
    }, 100); // Update every 100ms for smooth UI
  };

  const pause = () => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const resume = () => {
    if (isRunning && isPaused) {
      setIsPaused(false);
      const pauseEndTime = Date.now();
      const pauseStartTime = startTimeRef.current + pausedTimeRef.current + elapsedSeconds * 1000;
      pausedTimeRef.current += pauseEndTime - pauseStartTime;

      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimeRef.current - pausedTimeRef.current) / 1000);
        setElapsedSeconds(elapsed);
      }, 100);
    }
  };

  const cancel = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setIsPaused(false);
    setElapsedSeconds(0);
    startTimeRef.current = 0;
    pausedTimeRef.current = 0;
  };

  const reset = () => {
    cancel();
    setElapsedSeconds(0);
  };

  return {
    elapsedSeconds,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    complete,
    cancel,
    reset,
  };
}
