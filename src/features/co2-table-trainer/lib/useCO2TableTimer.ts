import { useState, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { CO2_TABLE_BREATHE_TIMES, CO2_TABLE_ROUNDS } from '@/entities/co2-table';
import { speakForTimer, stopSpeech, speakTrainingComplete } from './tts';
import { getCurrentLanguage } from '@/shared/lib/i18n';

interface UseCO2TableTimerOptions {
  holdTimeSeconds: number;
  onComplete: () => void;
  onCancel: () => void;
}

interface UseCO2TableTimerReturn {
  currentRound: number;
  isBreathing: boolean; // true: Breathe, false: Hold
  remainingSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  breatheProgress: number; // 0 ~ 100
  holdProgress: number; // 0 ~ 100
  start: () => void;
  pause: () => void;
  resume: () => void;
  complete: () => void;
  cancel: () => void;
}

const TICK_INTERVAL_MS = 1000;

const isBackgroundState = (state: AppStateStatus) =>
  state === 'background' || state === 'inactive';

const msToSeconds = (ms: number) => Math.max(0, Math.ceil(ms / 1000));

export function useCO2TableTimer(options: UseCO2TableTimerOptions): UseCO2TableTimerReturn {
  const { holdTimeSeconds, onComplete, onCancel } = options;

  const [currentRound, setCurrentRound] = useState(1);
  const [isBreathing, setIsBreathing] = useState(true);
  const [remainingSeconds, setRemainingSeconds] = useState(CO2_TABLE_BREATHE_TIMES[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [breatheProgress, setBreatheProgress] = useState(100);
  const [holdProgress, setHoldProgress] = useState(100);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPhaseStartRef = useRef(false);
  const phaseEndsAtRef = useRef<number | null>(null);
  const pausedRemainingMsRef = useRef<number | null>(null);
  const currentRoundRef = useRef(1);
  const isBreathingRef = useRef(true);
  const isRunningRef = useRef(false);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState ?? 'active');
  const tickRef = useRef<() => void>(() => {});
  const reconcilePhaseAfterResumeRef = useRef<() => void>(() => {});

  const setRoundState = (round: number) => {
    currentRoundRef.current = round;
    setCurrentRound(round);
  };

  const setBreathingState = (breathing: boolean) => {
    isBreathingRef.current = breathing;
    setIsBreathing(breathing);
  };

  const resetTimerVisuals = () => {
    setRoundState(1);
    setBreathingState(true);
    setRemainingSeconds(CO2_TABLE_BREATHE_TIMES[0]);
    setBreatheProgress(100);
    setHoldProgress(100);
    phaseEndsAtRef.current = null;
    pausedRemainingMsRef.current = null;
    isPhaseStartRef.current = false;
  };

  const getTotalSecondsForPhase = (round: number, breathing: boolean): number => {
    if (breathing) {
      return CO2_TABLE_BREATHE_TIMES[round - 1];
    }
    return holdTimeSeconds;
  };

  const updateProgress = (
    round: number,
    breathing: boolean,
    remainingSecondsForPhase: number
  ) => {
    const total = getTotalSecondsForPhase(round, breathing);
    const progress = (remainingSecondsForPhase / total) * 100;

    if (breathing) {
      setBreatheProgress(Math.max(0, Math.min(100, progress)));
      setHoldProgress(0);
    } else {
      setBreatheProgress(0);
      setHoldProgress(Math.max(0, Math.min(100, progress)));
    }
  };

  const finishTraining = () => {
    if (!isRunningRef.current) {
      return;
    }

    isRunningRef.current = false;
    setIsRunning(false);
    setIsPaused(false);
    stopSpeech();
    resetTimerVisuals();
    const currentLanguage = getCurrentLanguage();
    speakTrainingComplete(currentLanguage);
    onComplete();
  };

  const startPhase = (round: number, breathing: boolean, skippedMs = 0) => {
    const totalSeconds = getTotalSecondsForPhase(round, breathing);
    const totalMs = totalSeconds * 1000;
    const remainingMs = totalMs - skippedMs;

    // Check if phase should be skipped before updating state
    if (remainingMs <= 0) {
      completePhase(Math.abs(remainingMs));
      return;
    }

    // Only update state if phase will actually run
    setRoundState(round);
    setBreathingState(breathing);

    const nextRemainingSeconds = msToSeconds(remainingMs);
    phaseEndsAtRef.current = Date.now() + remainingMs;
    pausedRemainingMsRef.current = null;
    setRemainingSeconds(nextRemainingSeconds);
    updateProgress(round, breathing, nextRemainingSeconds);
    isPhaseStartRef.current = true;
  };

  const completePhase = (carryMs = 0) => {
    if (!isRunningRef.current) {
      return;
    }

    if (isBreathingRef.current) {
      startPhase(currentRoundRef.current, false, carryMs);
      return;
    }

    if (currentRoundRef.current < CO2_TABLE_ROUNDS) {
      const nextRound = currentRoundRef.current + 1;
      startPhase(nextRound, true, carryMs);
      return;
    }

    finishTraining();
  };

  const reconcilePhaseAfterResume = () => {
    if (!isRunningRef.current || isPaused || !phaseEndsAtRef.current) {
      return;
    }

    const now = Date.now();
    const remainingMs = phaseEndsAtRef.current - now;

    if (remainingMs <= 0) {
      completePhase(Math.abs(remainingMs));
      tickRef.current();
      return;
    }

    const nextRemainingSeconds = msToSeconds(remainingMs);
    setRemainingSeconds(nextRemainingSeconds);
    updateProgress(currentRoundRef.current, isBreathingRef.current, nextRemainingSeconds);
    isPhaseStartRef.current = false;
    stopSpeech();
    const currentLanguage = getCurrentLanguage();
    speakForTimer(nextRemainingSeconds, isBreathingRef.current, true, currentLanguage);
  };

  const tick = () => {
    if (!isRunningRef.current || !phaseEndsAtRef.current) {
      return;
    }

    if (isPhaseStartRef.current) {
      const remainingMsForStart = phaseEndsAtRef.current - Date.now();
      const remainingSecondsForStart = msToSeconds(remainingMsForStart);
      const currentLanguage = getCurrentLanguage();
      speakForTimer(remainingSecondsForStart, isBreathingRef.current, true, currentLanguage);
      isPhaseStartRef.current = false;
    }

    const now = Date.now();
    const remainingMs = phaseEndsAtRef.current - now;

    if (remainingMs <= 0) {
      completePhase(Math.abs(remainingMs));
      return;
    }

    const nextRemainingSeconds = msToSeconds(remainingMs);

    setRemainingSeconds((prev) => {
      if (prev === nextRemainingSeconds) {
        return prev;
      }

      updateProgress(currentRoundRef.current, isBreathingRef.current, nextRemainingSeconds);
      const currentLanguage = getCurrentLanguage();
      speakForTimer(nextRemainingSeconds, isBreathingRef.current, false, currentLanguage);
      return nextRemainingSeconds;
    });
  };

  tickRef.current = tick;
  reconcilePhaseAfterResumeRef.current = reconcilePhaseAfterResume;

  useEffect(() => {
    if (!isRunning || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const runTick = () => tickRef.current();
    runTick();
    intervalRef.current = setInterval(runTick, TICK_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, isPaused]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const previousState = appStateRef.current;
      appStateRef.current = nextState;

      if (isBackgroundState(nextState)) {
        // Clear interval when going to background to avoid unnecessary work
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        stopSpeech();
        return;
      }

      if (previousState && isBackgroundState(previousState) && nextState === 'active') {
        stopSpeech();
        reconcilePhaseAfterResumeRef.current();

        // Restart interval when returning to foreground if training is active
        if (isRunningRef.current && !isPaused) {
          const runTick = () => tickRef.current();
          runTick();
          intervalRef.current = setInterval(runTick, TICK_INTERVAL_MS);
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!isRunning && currentRound === 1 && isBreathing) {
      setBreatheProgress(100);
      setHoldProgress(100);
    }
  }, [isRunning, currentRound, isBreathing]);

  const start = () => {
    if (isRunningRef.current) {
      return;
    }

    isRunningRef.current = true;
    setIsRunning(true);
    setIsPaused(false);
    startPhase(1, true);
  };

  const pause = () => {
    if (!isRunningRef.current || isPaused) {
      return;
    }

    if (phaseEndsAtRef.current) {
      pausedRemainingMsRef.current = Math.max(0, phaseEndsAtRef.current - Date.now());
    } else {
      pausedRemainingMsRef.current = remainingSeconds * 1000;
    }

    phaseEndsAtRef.current = null;
    setIsPaused(true);
    stopSpeech();
  };

  const resume = () => {
    if (!isRunningRef.current || !isPaused) {
      return;
    }

    const remainingMs =
      pausedRemainingMsRef.current ?? Math.max(0, remainingSeconds * 1000);

    phaseEndsAtRef.current = Date.now() + remainingMs;
    pausedRemainingMsRef.current = null;
    setIsPaused(false);
    isPhaseStartRef.current = false;
    stopSpeech();
    const currentLanguage = getCurrentLanguage();
    speakForTimer(msToSeconds(remainingMs), isBreathingRef.current, true, currentLanguage);
  };

  const complete = () => {
    if (!isRunningRef.current) {
      return;
    }

    isRunningRef.current = false;
    setIsRunning(false);
    setIsPaused(false);
    stopSpeech();
    resetTimerVisuals();
    onComplete();
  };

  const cancel = () => {
    isRunningRef.current = false;
    setIsRunning(false);
    setIsPaused(false);
    resetTimerVisuals();
    stopSpeech();
    onCancel();
  };

  return {
    currentRound,
    isBreathing,
    remainingSeconds,
    isRunning,
    isPaused,
    breatheProgress,
    holdProgress,
    start,
    pause,
    resume,
    complete,
    cancel,
  };
}
