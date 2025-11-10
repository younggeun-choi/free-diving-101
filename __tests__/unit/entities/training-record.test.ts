import {
  TrainingSessionSchema,
  FrenzelSessionMetaSchema,
  CO2TableSessionMetaSchema,
} from '@/entities/training-record/model';
import type { TrainingSession } from '@/entities/training-record';

describe('TrainingSessionSchema', () => {
  describe('프렌젤 세션 검증', () => {
    it('유효한 프렌젤 세션 데이터를 파싱', () => {
      const validData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'frenzel' as const,
        startTime: new Date('2025-01-01T10:00:00Z'),
        endTime: new Date('2025-01-01T10:10:00Z'),
        completed: true,
        meta: {
          dayNumber: 1,
        },
      };

      const result = TrainingSessionSchema.parse(validData);

      expect(result.type).toBe('frenzel');
      expect(result.meta.dayNumber).toBe(1);
      expect(result.completed).toBe(true);
    });

    it('dayNumber가 1-10 범위를 벗어나면 에러', () => {
      const invalidData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'frenzel' as const,
        startTime: new Date('2025-01-01T10:00:00Z'),
        endTime: new Date('2025-01-01T10:10:00Z'),
        completed: true,
        meta: {
          dayNumber: 11, // ❌ 범위 초과
        },
      };

      expect(() => TrainingSessionSchema.parse(invalidData)).toThrow();
    });

    it('dayNumber가 0 이하이면 에러', () => {
      const invalidData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'frenzel' as const,
        startTime: new Date('2025-01-01T10:00:00Z'),
        endTime: new Date('2025-01-01T10:10:00Z'),
        completed: true,
        meta: {
          dayNumber: 0, // ❌
        },
      };

      expect(() => TrainingSessionSchema.parse(invalidData)).toThrow();
    });

    it('dayNumber가 소수이면 에러', () => {
      const invalidData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'frenzel' as const,
        startTime: new Date('2025-01-01T10:00:00Z'),
        endTime: new Date('2025-01-01T10:10:00Z'),
        completed: true,
        meta: {
          dayNumber: 1.5, // ❌ 정수 아님
        },
      };

      expect(() => TrainingSessionSchema.parse(invalidData)).toThrow();
    });

    it('notes 필드는 선택적', () => {
      const validData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'frenzel' as const,
        startTime: new Date('2025-01-01T10:00:00Z'),
        endTime: new Date('2025-01-01T10:10:00Z'),
        completed: true,
        meta: {
          dayNumber: 1,
        },
        notes: '첫 훈련 완료!',
      };

      const result = TrainingSessionSchema.parse(validData);
      expect(result.notes).toBe('첫 훈련 완료!');
    });

    it('notes가 없어도 파싱 성공', () => {
      const validData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'frenzel' as const,
        startTime: new Date('2025-01-01T10:00:00Z'),
        endTime: new Date('2025-01-01T10:10:00Z'),
        completed: true,
        meta: {
          dayNumber: 1,
        },
      };

      const result = TrainingSessionSchema.parse(validData);
      expect(result.notes).toBeUndefined();
    });
  });

  describe('CO₂ 세션 검증', () => {
    it('유효한 CO₂ 세션 데이터를 파싱', () => {
      const validData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'co2-table' as const,
        startTime: new Date('2025-01-01T10:00:00Z'),
        endTime: new Date('2025-01-01T10:30:00Z'),
        completed: true,
        meta: {
          holdTimeSeconds: 90,
          breathTimeSeconds: 120,
          cycles: 8,
        },
      };

      const result = TrainingSessionSchema.parse(validData);

      expect(result.type).toBe('co2-table');
      expect(result.meta.holdTimeSeconds).toBe(90);
      expect(result.meta.breathTimeSeconds).toBe(120);
      expect(result.meta.cycles).toBe(8);
    });

    it('holdTimeSeconds가 음수이면 에러', () => {
      const invalidData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'co2-table' as const,
        startTime: new Date('2025-01-01T10:00:00Z'),
        endTime: new Date('2025-01-01T10:30:00Z'),
        completed: true,
        meta: {
          holdTimeSeconds: -10, // ❌
          breathTimeSeconds: 120,
          cycles: 8,
        },
      };

      expect(() => TrainingSessionSchema.parse(invalidData)).toThrow();
    });

    it('breathTimeSeconds가 0이면 에러', () => {
      const invalidData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'co2-table' as const,
        startTime: new Date('2025-01-01T10:00:00Z'),
        endTime: new Date('2025-01-01T10:30:00Z'),
        completed: true,
        meta: {
          holdTimeSeconds: 90,
          breathTimeSeconds: 0, // ❌
          cycles: 8,
        },
      };

      expect(() => TrainingSessionSchema.parse(invalidData)).toThrow();
    });

    it('cycles가 소수이면 에러', () => {
      const invalidData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'co2-table' as const,
        startTime: new Date('2025-01-01T10:00:00Z'),
        endTime: new Date('2025-01-01T10:30:00Z'),
        completed: true,
        meta: {
          holdTimeSeconds: 90,
          breathTimeSeconds: 120,
          cycles: 7.5, // ❌
        },
      };

      expect(() => TrainingSessionSchema.parse(invalidData)).toThrow();
    });
  });

  describe('날짜 Coercion', () => {
    it('ISO 문자열을 Date 객체로 변환', () => {
      const data = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'frenzel' as const,
        startTime: '2025-01-01T10:00:00Z',
        endTime: '2025-01-01T10:10:00Z',
        completed: true,
        meta: {
          dayNumber: 1,
        },
      };

      const result = TrainingSessionSchema.parse(data);

      expect(result.startTime).toBeInstanceOf(Date);
      expect(result.endTime).toBeInstanceOf(Date);
      expect(result.startTime.toISOString()).toBe('2025-01-01T10:00:00.000Z');
    });

    it('유효하지 않은 날짜 문자열이면 에러', () => {
      const invalidData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'frenzel' as const,
        startTime: 'invalid-date', // ❌
        endTime: new Date('2025-01-01T10:10:00Z'),
        completed: true,
        meta: {
          dayNumber: 1,
        },
      };

      expect(() => TrainingSessionSchema.parse(invalidData)).toThrow();
    });

    it('숫자 timestamp를 Date로 변환', () => {
      const timestamp = new Date('2025-01-01T10:00:00Z').getTime();
      const data = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'frenzel' as const,
        startTime: timestamp,
        endTime: timestamp + 600000, // 10분 후
        completed: true,
        meta: {
          dayNumber: 1,
        },
      };

      const result = TrainingSessionSchema.parse(data);

      expect(result.startTime).toBeInstanceOf(Date);
      expect(result.startTime.getTime()).toBe(timestamp);
    });
  });

  describe('필수 필드 검증', () => {
    it('id가 없으면 에러', () => {
      const invalidData = {
        // id 없음 ❌
        type: 'frenzel' as const,
        startTime: new Date('2025-01-01T10:00:00Z'),
        endTime: new Date('2025-01-01T10:10:00Z'),
        completed: true,
        meta: {
          dayNumber: 1,
        },
      };

      expect(() => TrainingSessionSchema.parse(invalidData)).toThrow();
    });

    it('id가 UUID 형식이 아니면 에러', () => {
      const invalidData = {
        id: 'not-a-uuid', // ❌
        type: 'frenzel' as const,
        startTime: new Date('2025-01-01T10:00:00Z'),
        endTime: new Date('2025-01-01T10:10:00Z'),
        completed: true,
        meta: {
          dayNumber: 1,
        },
      };

      expect(() => TrainingSessionSchema.parse(invalidData)).toThrow();
    });

    it('type이 없으면 에러', () => {
      const invalidData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        // type 없음 ❌
        startTime: new Date('2025-01-01T10:00:00Z'),
        endTime: new Date('2025-01-01T10:10:00Z'),
        completed: true,
        meta: {
          dayNumber: 1,
        },
      };

      expect(() => TrainingSessionSchema.parse(invalidData)).toThrow();
    });

    it('meta가 없으면 에러', () => {
      const invalidData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'frenzel' as const,
        startTime: new Date('2025-01-01T10:00:00Z'),
        endTime: new Date('2025-01-01T10:10:00Z'),
        completed: true,
        // meta 없음 ❌
      };

      expect(() => TrainingSessionSchema.parse(invalidData)).toThrow();
    });
  });

  describe('Discriminated Union 검증', () => {
    it('frenzel type인데 co2-table meta를 가지면 에러', () => {
      const invalidData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'frenzel' as const,
        startTime: new Date('2025-01-01T10:00:00Z'),
        endTime: new Date('2025-01-01T10:10:00Z'),
        completed: true,
        meta: {
          // ❌ frenzel이지만 co2 meta
          holdTimeSeconds: 90,
          breathTimeSeconds: 120,
          cycles: 8,
        },
      };

      expect(() => TrainingSessionSchema.parse(invalidData)).toThrow();
    });

    it('co2-table type인데 frenzel meta를 가지면 에러', () => {
      const invalidData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'co2-table' as const,
        startTime: new Date('2025-01-01T10:00:00Z'),
        endTime: new Date('2025-01-01T10:10:00Z'),
        completed: true,
        meta: {
          // ❌ co2-table이지만 frenzel meta
          dayNumber: 1,
        },
      };

      expect(() => TrainingSessionSchema.parse(invalidData)).toThrow();
    });

    it('유효하지 않은 type이면 에러', () => {
      const invalidData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        type: 'invalid-type', // ❌
        startTime: new Date('2025-01-01T10:00:00Z'),
        endTime: new Date('2025-01-01T10:10:00Z'),
        completed: true,
        meta: {
          dayNumber: 1,
        },
      };

      expect(() => TrainingSessionSchema.parse(invalidData)).toThrow();
    });
  });
});

describe('FrenzelSessionMetaSchema', () => {
  it('유효한 dayNumber 파싱', () => {
    const result = FrenzelSessionMetaSchema.parse({ dayNumber: 5 });
    expect(result.dayNumber).toBe(5);
  });

  it('dayNumber 1-10 범위 경계값 테스트', () => {
    expect(() => FrenzelSessionMetaSchema.parse({ dayNumber: 1 })).not.toThrow();
    expect(() => FrenzelSessionMetaSchema.parse({ dayNumber: 10 })).not.toThrow();
  });
});

describe('CO2TableSessionMetaSchema', () => {
  it('유효한 meta 파싱', () => {
    const result = CO2TableSessionMetaSchema.parse({
      holdTimeSeconds: 90,
      breathTimeSeconds: 120,
      cycles: 8,
    });

    expect(result.holdTimeSeconds).toBe(90);
    expect(result.breathTimeSeconds).toBe(120);
    expect(result.cycles).toBe(8);
  });

  it('모든 필드가 양수여야 함', () => {
    expect(() =>
      CO2TableSessionMetaSchema.parse({
        holdTimeSeconds: 0, // ❌
        breathTimeSeconds: 120,
        cycles: 8,
      })
    ).toThrow();
  });
});
