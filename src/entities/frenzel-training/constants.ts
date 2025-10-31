import { FrenzelDay } from './types';

/**
 * 10일 프렌젤 훈련 프로그램
 * 출처: docs/what-is-frenzel.md
 */
export const FRENZEL_TRAINING_SCHEDULE: FrenzelDay[] = [
  {
    dayNumber: 1,
    title: 'equalizing.day1.title',
    goal: 'equalizing.day1.goal',
    durationMinutes: 10,
    steps: [
      'equalizing.day1.step1',
      'equalizing.day1.step2',
      'equalizing.day1.step3',
      'equalizing.day1.step4',
      'equalizing.day1.step5',
    ],
    successCriteria: 'equalizing.day1.success',
  },
  {
    dayNumber: 2,
    title: 'equalizing.day2.title',
    goal: 'equalizing.day2.goal',
    durationMinutes: 15,
    steps: [
      'equalizing.day2.step1',
      'equalizing.day2.step2',
      'equalizing.day2.step3',
      'equalizing.day2.step4',
    ],
    successCriteria: 'equalizing.day2.success',
  },
  {
    dayNumber: 3,
    title: 'equalizing.day3.title',
    goal: 'equalizing.day3.goal',
    durationMinutes: 10,
    steps: [
      'equalizing.day3.step1',
      'equalizing.day3.step2',
      'equalizing.day3.step3',
      'equalizing.day3.step4',
    ],
    successCriteria: 'equalizing.day3.success',
  },
  {
    dayNumber: 4,
    title: 'equalizing.day4.title',
    goal: 'equalizing.day4.goal',
    durationMinutes: 15,
    steps: [
      'equalizing.day4.step1',
      'equalizing.day4.step2',
      'equalizing.day4.step3',
    ],
    successCriteria: 'equalizing.day4.success',
  },
  {
    dayNumber: 5,
    title: 'equalizing.day5.title',
    goal: 'equalizing.day5.goal',
    durationMinutes: 15,
    steps: [
      'equalizing.day5.step1',
      'equalizing.day5.step2',
      'equalizing.day5.step3',
      'equalizing.day5.step4',
    ],
    successCriteria: 'equalizing.day5.success',
  },
  {
    dayNumber: 6,
    title: 'equalizing.day6.title',
    goal: 'equalizing.day6.goal',
    durationMinutes: 15,
    steps: [
      'equalizing.day6.step1',
      'equalizing.day6.step2',
      'equalizing.day6.step3',
      'equalizing.day6.step4',
    ],
    successCriteria: 'equalizing.day6.success',
  },
  {
    dayNumber: 7,
    title: 'equalizing.day7.title',
    goal: 'equalizing.day7.goal',
    durationMinutes: 20,
    steps: [
      'equalizing.day7.step1',
      'equalizing.day7.step2',
      'equalizing.day7.step3',
      'equalizing.day7.step4',
      'equalizing.day7.step5',
    ],
    successCriteria: 'equalizing.day7.success',
  },
  {
    dayNumber: 8,
    title: 'equalizing.day8.title',
    goal: 'equalizing.day8.goal',
    durationMinutes: 20,
    steps: [
      'equalizing.day8.step1',
      'equalizing.day8.step2',
      'equalizing.day8.step3',
      'equalizing.day8.step4',
      'equalizing.day8.step5',
    ],
    successCriteria: 'equalizing.day8.success',
  },
  {
    dayNumber: 9,
    title: 'equalizing.day9.title',
    goal: 'equalizing.day9.goal',
    durationMinutes: 17.5, // 15~20분 평균
    steps: [
      'equalizing.day9.step1',
      'equalizing.day9.step2',
      'equalizing.day9.step3',
      'equalizing.day9.step4',
      'equalizing.day9.step5',
    ],
    successCriteria: 'equalizing.day9.success',
  },
  {
    dayNumber: 10,
    title: 'equalizing.day10.title',
    goal: 'equalizing.day10.goal',
    durationMinutes: 22.5, // 20~25분 평균
    steps: [
      'equalizing.day10.step1',
      'equalizing.day10.step2',
      'equalizing.day10.step3',
      'equalizing.day10.step4',
      'equalizing.day10.step5',
    ],
    successCriteria: 'equalizing.day10.success',
  },
];

/**
 * Day별 훈련 시간 (분)
 */
export const DAY_DURATIONS: Record<number, number> = {
  1: 10,
  2: 15,
  3: 10,
  4: 15,
  5: 15,
  6: 15,
  7: 20,
  8: 20,
  9: 17.5, // 15~20분 평균
  10: 22.5, // 20~25분 평균
};
