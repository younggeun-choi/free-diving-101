import { useState, useEffect, useRef } from 'react';
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

export function useCO2TableTimer(
  options: UseCO2TableTimerOptions
): UseCO2TableTimerReturn {
  const { holdTimeSeconds, onComplete, onCancel } = options;

  const [currentRound, setCurrentRound] = useState(1);
  const [isBreathing, setIsBreathing] = useState(true);
  const [remainingSeconds, setRemainingSeconds] = useState(
    CO2_TABLE_BREATHE_TIMES[0]
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [breatheProgress, setBreatheProgress] = useState(100);
  const [holdProgress, setHoldProgress] = useState(100);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPhaseStartRef = useRef(false);

  // 현재 단계의 총 시간 계산
  const getTotalSecondsForPhase = (round: number, breathing: boolean): number => {
    if (breathing) {
      return CO2_TABLE_BREATHE_TIMES[round - 1];
    }
    return holdTimeSeconds;
  };

  // Progress 업데이트
  const updateProgress = (round: number, breathing: boolean, remaining: number) => {
    const total = getTotalSecondsForPhase(round, breathing);
    const progress = (remaining / total) * 100;

    if (breathing) {
      setBreatheProgress(Math.max(0, Math.min(100, progress)));
      setHoldProgress(0);
    } else {
      setBreatheProgress(0);
      setHoldProgress(Math.max(0, Math.min(100, progress)));
    }
  };

  // 타이머 로직
  useEffect(() => {
    if (!isRunning || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // TTS 발화 (단계 시작 시)
    if (isPhaseStartRef.current) {
      const currentLanguage = getCurrentLanguage();
      speakForTimer(remainingSeconds, isBreathing, true, currentLanguage);
      isPhaseStartRef.current = false;
    }

    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        const newRemaining = prev - 1;

        // TTS 발화 (시간 마커)
        const currentLanguage = getCurrentLanguage();
        speakForTimer(newRemaining, isBreathing, false, currentLanguage);

        // 단계 종료 처리
        if (newRemaining <= 0) {
          if (isBreathing) {
            // Breathe -> Hold 전이
            setIsBreathing(false);
            setRemainingSeconds(holdTimeSeconds);
            updateProgress(currentRound, false, holdTimeSeconds);
            isPhaseStartRef.current = true;
          } else {
            // Hold 종료
            if (currentRound < CO2_TABLE_ROUNDS) {
              // 다음 Round로 전이
              const nextRound = currentRound + 1;
              setCurrentRound(nextRound);
              setIsBreathing(true);
              const nextBreatheTime = CO2_TABLE_BREATHE_TIMES[nextRound - 1];
              setRemainingSeconds(nextBreatheTime);
              updateProgress(nextRound, true, nextBreatheTime);
              isPhaseStartRef.current = true;
            } else {
              // 훈련 완료
              setIsRunning(false);
              const currentLanguage = getCurrentLanguage();
              speakTrainingComplete(currentLanguage);
              onComplete();
            }
          }
          return newRemaining <= 0 ? 0 : newRemaining;
        }

        // Progress 업데이트
        updateProgress(currentRound, isBreathing, newRemaining);

        return newRemaining;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    isRunning,
    isPaused,
    isBreathing,
    currentRound,
    holdTimeSeconds,
    onComplete,
    remainingSeconds,
  ]);

  // 초기화 시 Progress 설정
  useEffect(() => {
    if (!isRunning && currentRound === 1 && isBreathing) {
      setBreatheProgress(100);
      setHoldProgress(100);
    }
  }, [isRunning, currentRound, isBreathing]);

  const start = () => {
    setIsRunning(true);
    setIsPaused(false);
    isPhaseStartRef.current = true;
  };

  const pause = () => {
    setIsPaused(true);
    stopSpeech();
  };

  const resume = () => {
    setIsPaused(false);
  };

  const complete = () => {
    setIsRunning(false);
    stopSpeech();
    onComplete();
  };

  const cancel = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentRound(1);
    setIsBreathing(true);
    setRemainingSeconds(CO2_TABLE_BREATHE_TIMES[0]);
    setBreatheProgress(100);
    setHoldProgress(100);
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
