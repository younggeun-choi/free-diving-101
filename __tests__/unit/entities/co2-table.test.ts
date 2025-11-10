import {
  CO2_TABLE_BREATHE_TIMES,
  DEFAULT_HOLD_TIME_SECONDS,
  HOLD_TIME_STEP_SECONDS,
  MIN_HOLD_TIME_SECONDS,
  MAX_HOLD_TIME_SECONDS,
  CO2_TABLE_ROUNDS,
} from '@/entities/co2-table/constants';
import { CO2TableConfigSchema } from '@/entities/co2-table/model';

describe('CO2_TABLE_BREATHE_TIMES', () => {
  it('정확히 8개의 라운드가 있음', () => {
    expect(CO2_TABLE_BREATHE_TIMES).toHaveLength(8);
  });

  it('모든 값이 양수', () => {
    CO2_TABLE_BREATHE_TIMES.forEach((time) => {
      expect(time).toBeGreaterThan(0);
    });
  });

  it('첫 번째 시간이 120초 (2:00)', () => {
    expect(CO2_TABLE_BREATHE_TIMES[0]).toBe(120);
  });

  it('마지막 시간이 15초 (0:15)', () => {
    expect(CO2_TABLE_BREATHE_TIMES[7]).toBe(15);
  });

  it('시간이 점진적으로 감소', () => {
    for (let i = 1; i < CO2_TABLE_BREATHE_TIMES.length; i++) {
      expect(CO2_TABLE_BREATHE_TIMES[i]).toBeLessThan(CO2_TABLE_BREATHE_TIMES[i - 1]);
    }
  });

  it('각 라운드의 정확한 시간 값', () => {
    expect(CO2_TABLE_BREATHE_TIMES[0]).toBe(120); // 2:00
    expect(CO2_TABLE_BREATHE_TIMES[1]).toBe(105); // 1:45
    expect(CO2_TABLE_BREATHE_TIMES[2]).toBe(90); // 1:30
    expect(CO2_TABLE_BREATHE_TIMES[3]).toBe(75); // 1:15
    expect(CO2_TABLE_BREATHE_TIMES[4]).toBe(60); // 1:00
    expect(CO2_TABLE_BREATHE_TIMES[5]).toBe(45); // 0:45
    expect(CO2_TABLE_BREATHE_TIMES[6]).toBe(30); // 0:30
    expect(CO2_TABLE_BREATHE_TIMES[7]).toBe(15); // 0:15
  });

  it('15초씩 감소하는 패턴', () => {
    const expectedPattern = [120, 105, 90, 75, 60, 45, 30, 15];
    expect(CO2_TABLE_BREATHE_TIMES).toEqual(expectedPattern);
  });
});

describe('CO2 Table Constants', () => {
  it('DEFAULT_HOLD_TIME_SECONDS는 90초', () => {
    expect(DEFAULT_HOLD_TIME_SECONDS).toBe(90);
  });

  it('HOLD_TIME_STEP_SECONDS는 10초', () => {
    expect(HOLD_TIME_STEP_SECONDS).toBe(10);
  });

  it('MIN_HOLD_TIME_SECONDS는 40초', () => {
    expect(MIN_HOLD_TIME_SECONDS).toBe(40);
  });

  it('MAX_HOLD_TIME_SECONDS는 240초', () => {
    expect(MAX_HOLD_TIME_SECONDS).toBe(240);
  });

  it('CO2_TABLE_ROUNDS는 8', () => {
    expect(CO2_TABLE_ROUNDS).toBe(8);
  });

  it('DEFAULT_HOLD_TIME이 MIN과 MAX 사이에 있음', () => {
    expect(DEFAULT_HOLD_TIME_SECONDS).toBeGreaterThanOrEqual(MIN_HOLD_TIME_SECONDS);
    expect(DEFAULT_HOLD_TIME_SECONDS).toBeLessThanOrEqual(MAX_HOLD_TIME_SECONDS);
  });

  it('MIN_HOLD_TIME이 양수', () => {
    expect(MIN_HOLD_TIME_SECONDS).toBeGreaterThan(0);
  });

  it('MAX_HOLD_TIME이 MIN_HOLD_TIME보다 큼', () => {
    expect(MAX_HOLD_TIME_SECONDS).toBeGreaterThan(MIN_HOLD_TIME_SECONDS);
  });

  it('HOLD_TIME_STEP이 양수', () => {
    expect(HOLD_TIME_STEP_SECONDS).toBeGreaterThan(0);
  });
});

describe('Hold Time 범위 계산', () => {
  it('DEFAULT_HOLD_TIME에서 +10초 가능', () => {
    const nextValue = DEFAULT_HOLD_TIME_SECONDS + HOLD_TIME_STEP_SECONDS;
    expect(nextValue).toBeLessThanOrEqual(MAX_HOLD_TIME_SECONDS);
  });

  it('DEFAULT_HOLD_TIME에서 -10초 가능', () => {
    const prevValue = DEFAULT_HOLD_TIME_SECONDS - HOLD_TIME_STEP_SECONDS;
    expect(prevValue).toBeGreaterThanOrEqual(MIN_HOLD_TIME_SECONDS);
  });

  it('MIN_HOLD_TIME에서 MAX_HOLD_TIME까지 10초 단위로 조절 가능', () => {
    const steps = (MAX_HOLD_TIME_SECONDS - MIN_HOLD_TIME_SECONDS) / HOLD_TIME_STEP_SECONDS;
    expect(steps).toBeGreaterThan(0);
    expect(Number.isInteger(steps)).toBe(true);
  });
});

describe('CO2TableConfigSchema', () => {
  it('유효한 holdTimeSeconds를 파싱', () => {
    const config = {
      holdTimeSeconds: 90,
    };

    const result = CO2TableConfigSchema.parse(config);
    expect(result.holdTimeSeconds).toBe(90);
  });

  it('MIN_HOLD_TIME_SECONDS (40초) 파싱 성공', () => {
    const config = {
      holdTimeSeconds: MIN_HOLD_TIME_SECONDS,
    };

    const result = CO2TableConfigSchema.parse(config);
    expect(result.holdTimeSeconds).toBe(40);
  });

  it('MAX_HOLD_TIME_SECONDS (240초) 파싱 성공', () => {
    const config = {
      holdTimeSeconds: MAX_HOLD_TIME_SECONDS,
    };

    const result = CO2TableConfigSchema.parse(config);
    expect(result.holdTimeSeconds).toBe(240);
  });

  it('범위 밖 값 (39초)은 에러', () => {
    const config = {
      holdTimeSeconds: 39, // ❌ MIN보다 작음
    };

    expect(() => CO2TableConfigSchema.parse(config)).toThrow();
  });

  it('범위 밖 값 (241초)은 에러', () => {
    const config = {
      holdTimeSeconds: 241, // ❌ MAX보다 큼
    };

    expect(() => CO2TableConfigSchema.parse(config)).toThrow();
  });

  it('음수는 에러', () => {
    const config = {
      holdTimeSeconds: -10, // ❌
    };

    expect(() => CO2TableConfigSchema.parse(config)).toThrow();
  });

  it('0은 에러', () => {
    const config = {
      holdTimeSeconds: 0, // ❌
    };

    expect(() => CO2TableConfigSchema.parse(config)).toThrow();
  });

  it('문자열 입력은 에러', () => {
    const config = {
      holdTimeSeconds: '90', // ❌ 문자열
    };

    expect(() => CO2TableConfigSchema.parse(config as any)).toThrow();
  });

  it('undefined 입력은 에러', () => {
    const config = {
      holdTimeSeconds: undefined, // ❌ 설정되지 않음
    };

    expect(() => CO2TableConfigSchema.parse(config as any)).toThrow();
  });

  it('소수점 입력은 에러', () => {
    const config = {
      holdTimeSeconds: 90.5, // ❌ 정수 아님
    };

    expect(() => CO2TableConfigSchema.parse(config)).toThrow();
  });
});

describe('총 훈련 시간 계산', () => {
  it('DEFAULT_HOLD_TIME으로 총 시간 계산', () => {
    const totalBreatheTime = CO2_TABLE_BREATHE_TIMES.reduce((sum, time) => sum + time, 0);
    const totalHoldTime = DEFAULT_HOLD_TIME_SECONDS * CO2_TABLE_ROUNDS;
    const totalTime = totalBreatheTime + totalHoldTime;

    // 총 Breathe: 120+105+90+75+60+45+30+15 = 540초
    expect(totalBreatheTime).toBe(540);
    // 총 Hold: 90 * 8 = 720초
    expect(totalHoldTime).toBe(720);
    // 총: 1260초 = 21분
    expect(totalTime).toBe(1260);
    expect(totalTime / 60).toBe(21); // 21분
  });

  it('MIN_HOLD_TIME으로 총 시간 계산', () => {
    const totalBreatheTime = CO2_TABLE_BREATHE_TIMES.reduce((sum, time) => sum + time, 0);
    const totalHoldTime = MIN_HOLD_TIME_SECONDS * CO2_TABLE_ROUNDS;
    const totalTime = totalBreatheTime + totalHoldTime;

    // 총 Hold: 40 * 8 = 320초
    expect(totalHoldTime).toBe(320);
    // 총: 540 + 320 = 860초 ≈ 14.3분
    expect(totalTime).toBe(860);
  });

  it('MAX_HOLD_TIME으로 총 시간 계산', () => {
    const totalBreatheTime = CO2_TABLE_BREATHE_TIMES.reduce((sum, time) => sum + time, 0);
    const totalHoldTime = MAX_HOLD_TIME_SECONDS * CO2_TABLE_ROUNDS;
    const totalTime = totalBreatheTime + totalHoldTime;

    // 총 Hold: 240 * 8 = 1920초
    expect(totalHoldTime).toBe(1920);
    // 총: 540 + 1920 = 2460초 = 41분
    expect(totalTime).toBe(2460);
    expect(totalTime / 60).toBe(41);
  });
});
