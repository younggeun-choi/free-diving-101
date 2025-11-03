/**
 * CO2 테이블 Breathe 시간 (초 단위, 고정값)
 * Round 1: 2:00 (120초)
 * Round 2: 1:45 (105초)
 * Round 3: 1:30 (90초)
 * Round 4: 1:15 (75초)
 * Round 5: 1:00 (60초)
 * Round 6: 0:45 (45초)
 * Round 7: 0:30 (30초)
 * Round 8: 0:15 (15초)
 */
export const CO2_TABLE_BREATHE_TIMES: number[] = [
  120, // Round 1: 2:00
  105, // Round 2: 1:45
  90, // Round 3: 1:30
  75, // Round 4: 1:15
  60, // Round 5: 1:00
  45, // Round 6: 0:45
  30, // Round 7: 0:30
  15, // Round 8: 0:15
];

/**
 * 기본 Hold time (초)
 */
export const DEFAULT_HOLD_TIME_SECONDS = 90; // 1:30

/**
 * Hold time 조절 단위 (초)
 */
export const HOLD_TIME_STEP_SECONDS = 10;

/**
 * Hold time 최소값 (초)
 */
export const MIN_HOLD_TIME_SECONDS = 40; // 0:40

/**
 * Hold time 최대값 (초)
 */
export const MAX_HOLD_TIME_SECONDS = 240; // 4:00

/**
 * CO2 테이블 총 라운드 수
 */
export const CO2_TABLE_ROUNDS = 8;
