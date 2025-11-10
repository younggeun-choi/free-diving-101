import { act } from '@testing-library/react-native';

/**
 * Timer Testing Helpers
 *
 * Jest fake timers를 사용하는 테스트를 위한 헬퍼 함수들
 */

/**
 * Modern fake timers 설정
 * React Native Testing Library와 호환되는 타이머 설정
 */
export function setupModernTimers() {
  jest.useFakeTimers({
    legacyFakeTimers: false,
  });
}

/**
 * Legacy fake timers 설정 (필요한 경우)
 */
export function setupLegacyTimers() {
  jest.useFakeTimers({
    legacyFakeTimers: true,
  });
}

/**
 * 실제 타이머로 복원
 */
export function useRealTimers() {
  jest.useRealTimers();
}

/**
 * 타이머를 초 단위로 진행
 */
export function advanceTimersBySeconds(seconds: number) {
  jest.advanceTimersByTime(seconds * 1000);
}

/**
 * 타이머를 분 단위로 진행
 */
export function advanceTimersByMinutes(minutes: number) {
  jest.advanceTimersByTime(minutes * 60 * 1000);
}

/**
 * 타이머 진행과 함께 act로 래핑
 * React 상태 업데이트를 기다림
 */
export async function advanceTimersAndAct(ms: number) {
  await act(async () => {
    jest.advanceTimersByTime(ms);
  });
}

/**
 * 모든 pending 타이머 실행
 */
export async function runAllTimersAndAct() {
  await act(async () => {
    jest.runAllTimers();
  });
}

/**
 * 현재 pending 중인 타이머만 실행
 */
export async function runOnlyPendingTimersAndAct() {
  await act(async () => {
    jest.runOnlyPendingTimers();
  });
}

/**
 * 타이머 정리 (테스트 종료 시 사용)
 */
export function cleanupTimers() {
  jest.clearAllTimers();
  jest.useRealTimers();
}
