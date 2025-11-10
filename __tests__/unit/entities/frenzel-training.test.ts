import { FRENZEL_TRAINING_SCHEDULE } from '@/entities/frenzel-training/constants';
import { FrenzelDaySchema } from '@/entities/frenzel-training/model';

describe('FRENZEL_TRAINING_SCHEDULE', () => {
  it('정확히 10일의 훈련 프로그램이 있음', () => {
    expect(FRENZEL_TRAINING_SCHEDULE).toHaveLength(10);
  });

  it('각 Day의 dayNumber가 1부터 10까지 순차적', () => {
    FRENZEL_TRAINING_SCHEDULE.forEach((day, index) => {
      expect(day.dayNumber).toBe(index + 1);
    });
  });

  it('모든 Day가 필수 필드를 가짐', () => {
    FRENZEL_TRAINING_SCHEDULE.forEach((day) => {
      expect(day.dayNumber).toBeDefined();
      expect(day.title).toBeDefined();
      expect(day.goal).toBeDefined();
      expect(day.durationMinutes).toBeDefined();
      expect(day.steps).toBeDefined();
      expect(day.successCriteria).toBeDefined();
    });
  });

  it('모든 Day의 durationMinutes가 양수', () => {
    FRENZEL_TRAINING_SCHEDULE.forEach((day) => {
      expect(day.durationMinutes).toBeGreaterThan(0);
    });
  });

  it('모든 Day의 steps 배열이 비어있지 않음', () => {
    FRENZEL_TRAINING_SCHEDULE.forEach((day) => {
      expect(day.steps.length).toBeGreaterThan(0);
    });
  });

  it('모든 Day의 title이 i18n 키 형식', () => {
    FRENZEL_TRAINING_SCHEDULE.forEach((day) => {
      expect(day.title).toMatch(/^equalizing\.day\d+\.title$/);
    });
  });

  it('모든 Day의 goal이 i18n 키 형식', () => {
    FRENZEL_TRAINING_SCHEDULE.forEach((day) => {
      expect(day.goal).toMatch(/^equalizing\.day\d+\.goal$/);
    });
  });

  it('모든 Day의 successCriteria가 i18n 키 형식', () => {
    FRENZEL_TRAINING_SCHEDULE.forEach((day) => {
      expect(day.successCriteria).toMatch(/^equalizing\.day\d+\.success$/);
    });
  });

  it('각 step이 i18n 키 형식', () => {
    FRENZEL_TRAINING_SCHEDULE.forEach((day) => {
      day.steps.forEach((step) => {
        expect(step).toMatch(/^equalizing\.day\d+\.step\d+$/);
      });
    });
  });

  describe('Day별 상세 검증', () => {
    it('Day 1: 후두 감각 익히기 - 10분', () => {
      const day1 = FRENZEL_TRAINING_SCHEDULE[0];
      expect(day1.dayNumber).toBe(1);
      expect(day1.durationMinutes).toBe(10);
      expect(day1.steps.length).toBeGreaterThan(0);
    });

    it('Day 2: 후두 제어 심화 - 15분', () => {
      const day2 = FRENZEL_TRAINING_SCHEDULE[1];
      expect(day2.dayNumber).toBe(2);
      expect(day2.durationMinutes).toBe(15);
    });

    it('Day 10: Head-first 프렌젤 완성', () => {
      const day10 = FRENZEL_TRAINING_SCHEDULE[9];
      expect(day10.dayNumber).toBe(10);
      expect(day10.durationMinutes).toBeGreaterThanOrEqual(20);
    });
  });

  describe('특정 Day 조회', () => {
    it('dayNumber로 Day를 찾을 수 있음', () => {
      const day5 = FRENZEL_TRAINING_SCHEDULE.find((d) => d.dayNumber === 5);
      expect(day5).toBeDefined();
      expect(day5?.dayNumber).toBe(5);
    });

    it('존재하지 않는 dayNumber는 undefined 반환', () => {
      const invalidDay = FRENZEL_TRAINING_SCHEDULE.find((d) => d.dayNumber === 11);
      expect(invalidDay).toBeUndefined();
    });
  });
});

describe('FrenzelDaySchema', () => {
  it('유효한 FrenzelDay 객체를 파싱', () => {
    const validDay = {
      dayNumber: 1,
      title: 'equalizing.day1.title',
      goal: 'equalizing.day1.goal',
      durationMinutes: 10,
      steps: ['equalizing.day1.step1', 'equalizing.day1.step2'],
      successCriteria: 'equalizing.day1.success',
    };

    const result = FrenzelDaySchema.parse(validDay);
    expect(result.dayNumber).toBe(1);
    expect(result.durationMinutes).toBe(10);
  });

  it('dayNumber가 1-10 범위를 벗어나면 에러', () => {
    const invalidDay = {
      dayNumber: 11, // ❌
      title: 'equalizing.day11.title',
      goal: 'equalizing.day11.goal',
      durationMinutes: 10,
      steps: ['step1'],
      successCriteria: 'success',
    };

    expect(() => FrenzelDaySchema.parse(invalidDay)).toThrow();
  });

  it('durationMinutes가 음수이면 에러', () => {
    const invalidDay = {
      dayNumber: 1,
      title: 'equalizing.day1.title',
      goal: 'equalizing.day1.goal',
      durationMinutes: -10, // ❌
      steps: ['step1'],
      successCriteria: 'success',
    };

    expect(() => FrenzelDaySchema.parse(invalidDay)).toThrow();
  });

  it('steps가 빈 배열이면 에러', () => {
    const invalidDay = {
      dayNumber: 1,
      title: 'equalizing.day1.title',
      goal: 'equalizing.day1.goal',
      durationMinutes: 10,
      steps: [], // ❌
      successCriteria: 'success',
    };

    expect(() => FrenzelDaySchema.parse(invalidDay)).toThrow();
  });

  it('필수 필드가 누락되면 에러', () => {
    const invalidDay = {
      dayNumber: 1,
      title: 'equalizing.day1.title',
      // goal 누락 ❌
      durationMinutes: 10,
      steps: ['step1'],
      successCriteria: 'success',
    };

    expect(() => FrenzelDaySchema.parse(invalidDay)).toThrow();
  });
});
