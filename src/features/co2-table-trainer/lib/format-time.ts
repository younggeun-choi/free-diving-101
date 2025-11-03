/**
 * 초를 MM:SS 포맷으로 변환
 * @param seconds 초
 * @returns "MM:SS" 포맷 문자열
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * CO2 테이블 라운드의 총 시간 계산
 * @param breatheTimes Breathe 시간 배열 (초)
 * @param holdTime Hold 시간 (초)
 * @returns 총 시간 (초)
 */
export function calculateTotalTime(
  breatheTimes: number[],
  holdTime: number
): number {
  const totalBreathe = breatheTimes.reduce((sum, time) => sum + time, 0);
  const totalHold = holdTime * breatheTimes.length;
  return totalBreathe + totalHold;
}
