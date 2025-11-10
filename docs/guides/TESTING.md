# 🧪 React Native 테스트 코드 완벽 가이드
## 초보 개발자를 위한 단계별 설명

이 가이드는 Free Diving 101 프로젝트의 테스트 인프라를 처음부터 끝까지 설명합니다.

---

## 📚 목차

1. [테스트가 왜 필요한가?](#1-테스트가-왜-필요한가)
2. [프로젝트의 테스트 구조](#2-프로젝트의-테스트-구조)
3. [Jest 설정 이해하기](#3-jest-설정-이해하기)
4. [테스트 환경 설정 파일들](#4-테스트-환경-설정-파일들)
5. [실전 테스트 작성 패턴](#5-실전-테스트-작성-패턴)
6. [Mock 이해하기](#6-mock-이해하기)
7. [테스트 실행 방법](#7-테스트-실행-방법)
8. [나만의 첫 테스트 작성하기](#8-나만의-첫-테스트-작성하기)
9. [자주 하는 실수와 해결법](#9-자주-하는-실수와-해결법)
10. [추가 학습 자료](#10-추가-학습-자료)

---

## 1. 테스트가 왜 필요한가?

### 1.1 실생활 비유

테스트 코드는 **자동차 공장의 품질 검사**와 같습니다:

```
🏭 자동차 공장
├── 조립 라인 (코드 작성)
└── 품질 검사 (테스트)
    ├── 엔진 점검 ✅
    ├── 브레이크 점검 ✅
    └── 에어백 점검 ✅
```

**테스트 없이 개발하면:**
- 😰 수정할 때마다 모든 기능을 손으로 확인해야 함
- 🐛 버그를 나중에 발견 (비용 ↑↑)
- 😱 리팩토링이 두려움 ("어디가 깨질지 모름")

**테스트로 개발하면:**
- 😊 코드 수정 후 1초 만에 모든 기능 확인
- 🎯 버그를 즉시 발견 (비용 ↓↓)
- 💪 자신감 있게 리팩토링 가능

---

## 2. 프로젝트의 테스트 구조

### 2.1 전체 디렉토리 구조

```
free-diving-101/
├── src/                          # 실제 앱 코드
│   ├── entities/                 # 비즈니스 로직
│   ├── features/                 # 기능 모듈
│   └── stores/                   # 상태 관리
│
└── __tests__/                    # 🧪 테스트 코드
    ├── integration/              # 통합 테스트 (여러 모듈 함께)
    ├── unit/                     # 단위 테스트 (모듈 하나씩)
    │   ├── entities/             # entities 테스트
    │   ├── features/             # features 테스트
    │   └── stores/               # stores 테스트
    ├── setup/                    # ⚙️ 테스트 환경 설정
    │   ├── jest.setup.js         # 전역 설정
    │   ├── test-utils.tsx        # 헬퍼 함수들
    │   ├── helpers/              # 추가 헬퍼
    │   └── mocks/                # Mock 유틸리티
    └── sanity.test.ts           # 설정 확인 테스트
```

### 2.2 왜 이렇게 구성했나?

**원칙: "테스트는 소스 코드 구조를 따라간다"**

```
src/entities/co2-table/
├── constants.ts
└── model.ts

→ 테스트:

__tests__/unit/entities/
└── co2-table.test.ts  ✅
```

---

## 3. Jest 설정 이해하기

### 3.1 jest.config.js 핵심 설정

```javascript
// jest.config.js
module.exports = {
  // 1️⃣ React Native 전용 설정 사용
  preset: 'react-native',

  // 2️⃣ 테스트 시작 전 실행되는 설정 파일
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup/jest.setup.js'],

  // 3️⃣ 가짜 타이머 사용 (시간 흐름 제어 가능!)
  fakeTimers: {
    enableGlobally: true,  // 모든 테스트에서 자동으로 사용
  },

  // 4️⃣ 경로 단축키
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',  // @/ → src/
  },

  // 5️⃣ 커버리지 목표 (최소 80%)
  coverageThreshold: {
    global: {
      statements: 80,  // 코드의 80%가 실행되어야 함
      branches: 75,    // if/else의 75%를 테스트해야 함
      functions: 80,   // 함수의 80%를 테스트해야 함
      lines: 80,       // 코드 라인의 80%를 테스트해야 함
    },
  },
};
```

### 3.2 각 설정의 의미

#### 3.2.1 Preset: 'react-native'
React Native 앱 테스트에 필요한 모든 설정을 자동으로 가져옵니다.

```javascript
// 이 한 줄이 이런 복잡한 설정을 자동으로 해줍니다:
preset: 'react-native',
// ↓ ↓ ↓
// - React Native 모듈 변환
// - Metro bundler 설정
// - 이미지/폰트 같은 asset mock
// - 기타 등등...
```

#### 3.2.2 Fake Timers (가짜 타이머)

**문제:** 실제 시간으로 테스트하면 너무 느림
```javascript
// ❌ 나쁜 예: 실제로 10초 기다려야 함
test('10초 후 알림', () => {
  startTimer(10);
  await wait(10000);  // 😴 10초 대기...
  expect(알림).toBe('완료');
});
```

**해결:** Jest가 시간을 조작할 수 있게 함
```javascript
// ✅ 좋은 예: 가짜 타이머로 즉시 테스트
test('10초 후 알림', () => {
  startTimer(10);
  jest.advanceTimersByTime(10000);  // ⚡ 즉시 10초 점프!
  expect(알림).toBe('완료');
});
```

---

## 4. 테스트 환경 설정 파일들

### 4.1 jest.setup.js - 전역 설정

**위치:** `__tests__/setup/jest.setup.js`

**역할:** 모든 테스트 시작 전에 자동으로 실행됩니다.

```javascript
// __tests__/setup/jest.setup.js

// 1️⃣ React Native Testing Library 확장
import '@testing-library/react-native/extend-expect';
// → 특별한 matcher들을 추가 (toBeOnTheScreen 등)

// 2️⃣ AsyncStorage Mock (로컬 저장소)
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
// 왜? 테스트 환경에는 실제 AsyncStorage가 없으니까!

// 3️⃣ UUID 생성 Mock
jest.mock('expo-crypto', () => ({
  randomUUID: jest.fn(() => {
    // 유효한 UUID v4 형식 생성
    // 예: "b8146c26-d6b4-4b0b-5076-5332b8965345"
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000)
      .toString(16).substring(1);
    return `${s4()}${s4()}-${s4()}-4${s4().substring(1)}-${s4()}-${s4()}${s4()}${s4()}`;
  }),
}));

// 4️⃣ Text-to-Speech Mock
jest.mock('expo-speech', () => ({
  speak: jest.fn((text, options) => Promise.resolve()),
  stop: jest.fn(),
  isSpeakingAsync: jest.fn(() => Promise.resolve(false)),
}));
// 왜? 테스트 중에 실제로 소리가 나면 안 되니까!

// 5️⃣ 화면 깨우기 Mock
jest.mock('expo-keep-awake', () => ({
  activateKeepAwake: jest.fn(),
  deactivateKeepAwake: jest.fn(),
  activateKeepAwakeAsync: jest.fn(() => Promise.resolve()),
  deactivateKeepAwakeAsync: jest.fn(() => Promise.resolve()),
}));

// 6️⃣ AppState Mock (앱 포그라운드/백그라운드)
jest.mock('react-native/Libraries/AppState/AppState', () => ({
  currentState: 'active',
  addEventListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
  removeEventListener: jest.fn(),
}));
```

### 4.2 test-utils.tsx - 커스텀 렌더 함수

**위치:** `__tests__/setup/test-utils.tsx`

**역할:** 컴포넌트 테스트 시 필요한 Provider를 자동으로 감싸줍니다.

```typescript
// __tests__/setup/test-utils.tsx
import { render, RenderOptions } from '@testing-library/react-native';
import { ReactElement } from 'react';

// 나중에 i18n Provider, Theme Provider 등을 추가할 예정
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;  // 현재는 그냥 통과
};

// 커스텀 render 함수
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, { wrapper: AllTheProviders, ...options });
};

// Testing Library의 모든 함수를 재export
export * from '@testing-library/react-native';
```

**사용 예:**
```typescript
import { renderWithProviders } from '__tests__/setup/test-utils';

test('버튼 클릭', () => {
  // 나중에 Provider가 추가되어도 이 코드는 변경 안 해도 됨!
  const { getByText } = renderWithProviders(<MyComponent />);
});
```

### 4.3 timer-helpers.ts - 타이머 테스트 헬퍼

**위치:** `__tests__/setup/helpers/timer-helpers.ts`

**역할:** 타이머 관련 코드를 쉽게 테스트할 수 있게 해줍니다.

```typescript
// 5초를 밀리초로 바꾸는 게 귀찮다면?
export function advanceTimersBySeconds(seconds: number) {
  jest.advanceTimersByTime(seconds * 1000);
}

// 10분을 밀리초로 바꾸는 게 귀찮다면?
export function advanceTimersByMinutes(minutes: number) {
  jest.advanceTimersByTime(minutes * 60 * 1000);
}

// 타이머 + React 상태 업데이트를 동시에
export function advanceTimersAndAct(ms: number) {
  return act(() => {
    jest.advanceTimersByTime(ms);
  });
}
```

**사용 예:**
```typescript
import { advanceTimersBySeconds } from '__tests__/setup/helpers/timer-helpers';

test('5초 타이머', () => {
  startTimer();
  advanceTimersBySeconds(5);  // ✅ 직관적!
  // vs
  jest.advanceTimersByTime(5000);  // 🤔 5000이 뭐였더라?
});
```

---

## 5. 실전 테스트 작성 패턴

### 5.1 패턴 1: Entity/Schema 테스트

**목적:** Zod 스키마가 올바르게 동작하는지 검증

**예제:** `__tests__/unit/entities/co2-table.test.ts`

```typescript
import { CO2TableConfigSchema } from '@/entities/co2-table/model';

describe('CO2TableConfigSchema', () => {
  // ✅ 정상 케이스
  it('유효한 값을 파싱', () => {
    const config = { holdTimeSeconds: 90 };

    const result = CO2TableConfigSchema.parse(config);

    expect(result.holdTimeSeconds).toBe(90);
  });

  // ❌ 에러 케이스 - 범위 초과
  it('범위 밖 값은 에러', () => {
    const config = { holdTimeSeconds: 39 };  // 최소값 40보다 작음

    expect(() => CO2TableConfigSchema.parse(config)).toThrow();
  });

  // ❌ 에러 케이스 - 타입 오류
  it('문자열은 에러', () => {
    const config = { holdTimeSeconds: "90" };  // 숫자가 아님

    expect(() => CO2TableConfigSchema.parse(config)).toThrow();
  });
});
```

**체크리스트:**
- [ ] ✅ 정상 값이 통과하는가?
- [ ] ❌ 최소값보다 작으면 에러인가?
- [ ] ❌ 최대값보다 크면 에러인가?
- [ ] ❌ 잘못된 타입이면 에러인가?
- [ ] 🔄 타입 변환이 필요하면 제대로 변환되는가?

---

### 5.2 패턴 2: Hook 테스트 (간단한 타이머)

**목적:** Custom Hook이 올바르게 동작하는지 검증

**예제:** `__tests__/unit/features/frenzel-trainer/lib/use-timer.test.ts`

```typescript
import { renderHook, act } from '@testing-library/react-native';
import { useTimer } from '@/features/frenzel-trainer/lib/use-timer';

describe('useTimer', () => {
  // 🧹 각 테스트 전에 정리
  beforeEach(() => {
    jest.clearAllMocks();     // Mock 초기화
    jest.useFakeTimers();     // 가짜 타이머 활성화
  });

  // 🧹 각 테스트 후에 정리
  afterEach(() => {
    jest.runOnlyPendingTimers();  // 남은 타이머 실행
    jest.useRealTimers();          // 실제 타이머로 복원
  });

  // 📝 테스트 1: 초기 상태
  it('초기 상태가 올바름', () => {
    // Hook 렌더링
    const { result } = renderHook(() => useTimer({ durationMinutes: 10 }));

    // 검증
    expect(result.current.elapsedSeconds).toBe(0);
    expect(result.current.isRunning).toBe(false);
  });

  // 📝 테스트 2: 타이머 시작
  it('타이머를 시작하고 시간이 경과', () => {
    const { result } = renderHook(() => useTimer({ durationMinutes: 10 }));

    // 동작 1: 시작
    act(() => {
      result.current.start();
    });

    expect(result.current.isRunning).toBe(true);

    // 동작 2: 5초 경과
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // 검증
    expect(result.current.elapsedSeconds).toBe(5);
  });

  // 📝 테스트 3: 일시정지
  it('타이머를 일시정지', () => {
    const { result } = renderHook(() => useTimer({ durationMinutes: 10 }));

    // 시작 → 3초 경과 → 일시정지
    act(() => {
      result.current.start();
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.elapsedSeconds).toBe(3);

    act(() => {
      result.current.pause();
    });

    expect(result.current.isPaused).toBe(true);

    // 일시정지 중 5초 경과
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // 시간이 멈춰야 함!
    expect(result.current.elapsedSeconds).toBe(3);  // 여전히 3초
  });
});
```

**핵심 개념:**

1. **`renderHook()`**: Hook을 컴포넌트 없이 테스트
2. **`act()`**: React 상태 업데이트를 안전하게 실행
3. **`jest.advanceTimersByTime()`**: 시간을 빨리 감기

---

### 5.3 패턴 3: Store 테스트 (Zustand)

**목적:** 전역 상태 관리가 올바르게 동작하는지 검증

**예제:** `__tests__/unit/stores/training-history-store.test.ts`

```typescript
import { renderHook, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTrainingHistory } from '@/stores/training-history-store';

describe('useTrainingHistory', () => {
  // 🧹 각 테스트 전에 정리
  beforeEach(async () => {
    // AsyncStorage 초기화
    await AsyncStorage.clear();
    jest.clearAllMocks();

    // Store 초기화
    const { result } = renderHook(() => useTrainingHistory());
    act(() => {
      result.current.clearHistory();
    });
  });

  // 📝 테스트 1: 세션 추가
  it('프렌젤 세션을 추가하고 UUID를 반환', () => {
    const { result } = renderHook(() => useTrainingHistory());

    const mockSession = {
      type: 'frenzel',
      startTime: new Date('2025-01-01T10:00:00Z'),
      endTime: new Date('2025-01-01T10:10:00Z'),
      completed: true,
      meta: { dayNumber: 1 },
    };

    let sessionId: string = '';
    act(() => {
      sessionId = result.current.addSession(mockSession);
    });

    // 검증
    expect(sessionId).toBeDefined();
    expect(typeof sessionId).toBe('string');
    expect(result.current.sessions).toHaveLength(1);
    expect(result.current.sessions[0].type).toBe('frenzel');
  });

  // 📝 테스트 2: AsyncStorage 저장 확인
  it('세션 추가 시 AsyncStorage에 저장', async () => {
    const { result } = renderHook(() => useTrainingHistory());

    act(() => {
      result.current.addSession(mockSession);
    });

    // AsyncStorage.setItem이 호출되었는지 확인
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  // 📝 테스트 3: 필터링
  it('프렌젤 세션만 필터링', () => {
    const { result } = renderHook(() => useTrainingHistory());

    act(() => {
      result.current.addSession(mockFrenzelSession);
      result.current.addSession(mockCO2Session);
      result.current.addSession(mockFrenzelSession2);
    });

    const frenzelSessions = result.current.getFrenzelSessions();

    expect(frenzelSessions).toHaveLength(2);
    frenzelSessions.forEach((session) => {
      expect(session.type).toBe('frenzel');
    });
  });
});
```

**체크리스트:**
- [ ] CRUD 동작 (Create, Read, Update, Delete)
- [ ] AsyncStorage 저장 확인
- [ ] 필터링/정렬 로직
- [ ] Edge cases (빈 배열, 중복 등)

---

### 5.4 패턴 4: 복잡한 Hook 테스트 (Phase + AppState)

**목적:** 여러 상태와 외부 이벤트를 조합하여 테스트

**예제:** `__tests__/unit/features/co2-table-trainer/lib/useCO2TableTimer.test.ts`

```typescript
import { renderHook, act } from '@testing-library/react-native';
import type { AppStateStatus } from 'react-native';
import { useCO2TableTimer } from '@/features/co2-table-trainer/lib/useCO2TableTimer';
import * as TTS from '@/features/co2-table-trainer/lib/tts';

// 🎭 AppState Mock 설정
let mockAppStateListener: ((state: AppStateStatus) => void) | null = null;
jest.mock('react-native', () => ({
  AppState: {
    currentState: 'active',
    addEventListener: jest.fn((event, callback) => {
      if (event === 'change') {
        mockAppStateListener = callback;
      }
      return { remove: jest.fn() };
    }),
  },
}));

// 🎭 TTS Mock
jest.mock('@/features/co2-table-trainer/lib/tts', () => ({
  speakForTimer: jest.fn(),
  stopSpeech: jest.fn(),
  speakTrainingComplete: jest.fn(),
}));

describe('useCO2TableTimer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockAppStateListener = null;
  });

  // 📝 테스트 1: Phase 전환
  it('Breathe → Hold 전환', () => {
    const { result } = renderHook(() =>
      useCO2TableTimer({
        holdTimeSeconds: 90,
        onComplete: jest.fn(),
        onCancel: jest.fn(),
      })
    );

    // 시작: Breathe 페이즈
    act(() => {
      result.current.start();
    });

    expect(result.current.isBreathing).toBe(true);
    expect(result.current.remainingSeconds).toBe(120);  // 2분

    // Breathe 페이즈 완료 (120초)
    act(() => {
      jest.advanceTimersByTime(120 * 1000);
    });

    // Hold 페이즈로 전환되어야 함
    expect(result.current.isBreathing).toBe(false);
    expect(result.current.remainingSeconds).toBe(90);
  });

  // 📝 테스트 2: Background/Foreground 전환
  it('Background → Active 전환 시 시간 동기화', () => {
    const { result } = renderHook(() =>
      useCO2TableTimer({
        holdTimeSeconds: 90,
        onComplete: jest.fn(),
        onCancel: jest.fn(),
      })
    );

    act(() => {
      result.current.start();
      jest.advanceTimersByTime(5000);
    });

    const remainingBefore = result.current.remainingSeconds;

    // 백그라운드로 전환
    act(() => {
      mockAppStateListener?.('background');
    });

    // 백그라운드에서 10초 경과
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    // 다시 포그라운드로
    act(() => {
      mockAppStateListener?.('active');
    });

    // 시간이 계속 흘렀어야 함
    expect(result.current.remainingSeconds).toBeLessThan(remainingBefore);
    expect(TTS.speakForTimer).toHaveBeenCalled();
  });

  // 📝 테스트 3: TTS 통합
  it('Phase 시작 시 TTS 호출', () => {
    const { result } = renderHook(() =>
      useCO2TableTimer({
        holdTimeSeconds: 90,
        onComplete: jest.fn(),
        onCancel: jest.fn(),
      })
    );

    act(() => {
      result.current.start();
      jest.advanceTimersByTime(1000);
    });

    expect(TTS.speakForTimer).toHaveBeenCalled();
  });
});
```

---

## 6. Mock 이해하기

### 6.1 Mock이란?

**실생활 비유:** 영화 촬영 시 소품(prop)

```
🎬 실제 영화 촬영
├── 총 → 소품 총 (진짜 총이면 위험!)
├── 폭발 → CG (진짜 폭발시키면 안 됨!)
└── 비행기 → 모형 (진짜 비행기는 비쌈!)
```

**테스트에서 Mock:**
```
🧪 테스트 실행
├── AsyncStorage → Mock (파일 시스템 접근 불필요)
├── TTS → Mock (소리 나면 안 됨!)
└── AppState → Mock (실제 앱 상태 변경 불필요)
```

### 6.2 Mock 종류

#### 6.2.1 자동 Mock (jest.fn())

```typescript
// 빈 함수로 Mock
const mockFn = jest.fn();

// 호출
mockFn('hello');
mockFn('world');

// 검증
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith('hello');
```

#### 6.2.2 반환값 지정

```typescript
const mockFn = jest.fn(() => 'mocked value');

const result = mockFn();
console.log(result);  // "mocked value"
```

#### 6.2.3 모듈 전체 Mock

```typescript
// TTS 모듈 전체를 Mock
jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn(),
  isSpeakingAsync: jest.fn(() => Promise.resolve(false)),
}));

// 테스트에서 사용
import * as Speech from 'expo-speech';

test('TTS 호출', () => {
  Speech.speak('안녕하세요');

  expect(Speech.speak).toHaveBeenCalledWith('안녕하세요');
});
```

### 6.3 Mock 전략

#### 전역 Mock (jest.setup.js)
- 모든 테스트에 적용
- AsyncStorage, expo-crypto, AppState 등

#### 로컬 Mock (테스트 파일 상단)
- 특정 테스트에만 적용
- TTS, i18n 등

```typescript
// ✅ 좋은 예: 로컬 Mock
// useCO2TableTimer.test.ts
jest.mock('@/features/co2-table-trainer/lib/tts', () => ({
  speakForTimer: jest.fn(),
  stopSpeech: jest.fn(),
}));

describe('useCO2TableTimer', () => {
  // 이 테스트에서만 TTS가 Mock됨
});
```

---

## 7. 테스트 실행 방법

### 7.1 명령어

```bash
# 모든 테스트 1회 실행
npm test

# Watch 모드 (파일 변경 시 자동 재실행)
npm test -- --watch

# 특정 파일만 테스트
npm test -- co2-table.test.ts

# 특정 describe만 테스트
npm test -- -t "CO2TableConfigSchema"

# 커버리지 리포트
npm test -- --coverage
```

### 7.2 테스트 결과 읽기

```bash
PASS __tests__/unit/entities/co2-table.test.ts
  CO2_TABLE_BREATHE_TIMES
    ✓ 정확히 8개의 라운드가 있음 (3 ms)
    ✓ 모든 값이 양수 (1 ms)
    ✓ 첫 번째 시간이 120초 (2:00) (1 ms)

Test Suites: 1 passed, 1 total
Tests:       29 passed, 29 total
Snapshots:   0 total
Time:        2.456 s
```

**해석:**
- ✓ = 통과한 테스트
- Test Suites = 테스트 파일 수
- Tests = 개별 테스트(it) 수
- Time = 총 실행 시간

### 7.3 커버리지 리포트

```bash
npm test -- --coverage
```

```
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
All files             |   85.23 |    78.45 |   82.11 |   85.23 |
 entities/co2-table   |     100 |      100 |     100 |     100 |
  constants.ts        |     100 |      100 |     100 |     100 |
  model.ts            |     100 |      100 |     100 |     100 |
```

**의미:**
- % Stmts = 실행된 코드 라인 비율
- % Branch = 테스트된 if/else 분기 비율
- % Funcs = 테스트된 함수 비율
- % Lines = 테스트된 라인 비율

**목표:** 모두 80% 이상

---

## 8. 나만의 첫 테스트 작성하기

### 8.1 간단한 유틸리티 함수 테스트

**시나리오:** 숨 참기 시간을 포맷하는 함수 테스트

```typescript
// src/shared/lib/format-time.ts (가상의 파일)
export function formatBreathTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
```

**테스트 작성:**

```typescript
// __tests__/unit/shared/lib/format-time.test.ts
import { formatBreathTime } from '@/shared/lib/format-time';

describe('formatBreathTime', () => {
  // 📝 테스트 1: 정상 케이스
  it('90초를 "1:30"으로 포맷', () => {
    const result = formatBreathTime(90);
    expect(result).toBe('1:30');
  });

  // 📝 테스트 2: 경계값
  it('60초를 "1:00"으로 포맷', () => {
    const result = formatBreathTime(60);
    expect(result).toBe('1:00');
  });

  // 📝 테스트 3: 한 자리 초
  it('5초를 "0:05"로 포맷 (앞에 0 붙이기)', () => {
    const result = formatBreathTime(5);
    expect(result).toBe('0:05');
  });

  // 📝 테스트 4: 0초
  it('0초를 "0:00"으로 포맷', () => {
    const result = formatBreathTime(0);
    expect(result).toBe('0:00');
  });

  // 📝 테스트 5: 큰 숫자
  it('3661초를 "61:01"로 포맷', () => {
    const result = formatBreathTime(3661);
    expect(result).toBe('61:01');
  });
});
```

### 8.2 테스트 작성 프로세스

#### Step 1: describe 블록 작성
```typescript
describe('테스트할 대상', () => {
  // 여기에 테스트들
});
```

#### Step 2: it 블록으로 개별 테스트
```typescript
it('무엇을 테스트하는지 설명', () => {
  // 테스트 코드
});
```

#### Step 3: AAA 패턴
```typescript
it('설명', () => {
  // Arrange (준비)
  const input = 90;

  // Act (실행)
  const result = formatBreathTime(input);

  // Assert (검증)
  expect(result).toBe('1:30');
});
```

### 8.3 체크리스트

테스트를 작성할 때 확인할 것들:

**✅ 기본 동작**
- [ ] 정상 입력에 대한 정상 출력?

**✅ 경계값**
- [ ] 최소값은?
- [ ] 최대값은?
- [ ] 0은?

**✅ 에러 케이스**
- [ ] 잘못된 타입은?
- [ ] null/undefined는?
- [ ] 음수는?

**✅ Edge Cases**
- [ ] 빈 배열/객체는?
- [ ] 매우 큰 숫자는?
- [ ] 특수 문자는?

---

## 9. 자주 하는 실수와 해결법

### 9.1 실수 1: act() 경고

```typescript
// ❌ 나쁜 예
it('타이머 시작', () => {
  const { result } = renderHook(() => useTimer({ durationMinutes: 10 }));

  result.current.start();  // ⚠️ act() 없이 상태 변경!
  jest.advanceTimersByTime(1000);
});
```

```typescript
// ✅ 좋은 예
it('타이머 시작', () => {
  const { result } = renderHook(() => useTimer({ durationMinutes: 10 }));

  act(() => {
    result.current.start();  // ✅ act()로 감싸기
  });

  act(() => {
    jest.advanceTimersByTime(1000);
  });
});
```

### 9.2 실수 2: Mock 초기화 안 함

```typescript
// ❌ 나쁜 예
describe('useCO2TableTimer', () => {
  it('테스트 1', () => {
    // TTS.speak 호출
  });

  it('테스트 2', () => {
    expect(TTS.speak).toHaveBeenCalledTimes(1);
    // ⚠️ 실패! 테스트 1에서 호출한 것까지 카운트됨
  });
});
```

```typescript
// ✅ 좋은 예
describe('useCO2TableTimer', () => {
  beforeEach(() => {
    jest.clearAllMocks();  // ✅ 매 테스트마다 초기화
  });

  it('테스트 1', () => {
    // TTS.speak 호출
  });

  it('테스트 2', () => {
    expect(TTS.speak).toHaveBeenCalledTimes(1);
    // ✅ 성공! 이 테스트에서만 1번
  });
});
```

### 9.3 실수 3: 타이머 정리 안 함

```typescript
// ❌ 나쁜 예
it('타이머 테스트', () => {
  jest.useFakeTimers();

  // 테스트 코드

  // ⚠️ 타이머 정리 안 함!
});
```

```typescript
// ✅ 좋은 예
describe('타이머 테스트', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();  // 남은 타이머 실행
    jest.useRealTimers();          // 실제 타이머로 복원
  });

  it('테스트', () => {
    // 테스트 코드
  });
});
```

---

## 10. 추가 학습 자료

### 10.1 공식 문서
- [Jest 공식 문서](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Library 철학](https://testing-library.com/docs/guiding-principles)

### 10.2 프로젝트 내 참고 파일
- `__tests__/sanity.test.ts` - 가장 간단한 테스트 예제
- `__tests__/unit/entities/` - Zod 스키마 테스트 예제
- `__tests__/unit/features/` - Hook 테스트 예제
- `__tests__/unit/stores/` - Store 테스트 예제

### 10.3 관련 가이드
- [아키텍처 가이드](./ARCHITECTURE.md) - FSD 구조 이해
- [코딩 표준](./CODING_STANDARDS.md) - 코드 작성 원칙

---

## 📝 요약

이 프로젝트의 테스트 인프라는:

1. **Jest + React Native Testing Library** 기반
2. **자동화된 설정** (`jest.setup.js`에서 모든 Mock 설정)
3. **재사용 가능한 헬퍼** (timer-helpers, test-utils)
4. **FSD 구조 반영** (src/ 구조와 동일하게 구성)
5. **80% 커버리지 목표**

**첫 테스트를 작성할 때:**
1. 간단한 유틸리티 함수부터 시작
2. AAA 패턴 사용 (Arrange, Act, Assert)
3. 정상 케이스 → 에러 케이스 순서로
4. 하나의 it는 하나의 개념만 테스트

**테스트는 문서입니다!**
- 코드가 어떻게 동작해야 하는지 설명
- 새로운 개발자가 이해하는 데 도움
- 리팩토링 시 안전망 제공

---

## 현재 테스트 현황 (2025-01-10)

```
총 테스트: 163개 (모두 통과 ✅)

├── Sanity (6개)
│   └── Jest 설정 검증
│
├── Entities (85개)
│   ├── co2-table: 32개
│   ├── frenzel-training: 23개
│   └── training-record: 30개
│
├── Stores (25개)
│   └── training-history-store: 25개
│
└── Features (47개)
    ├── Frenzel timer: 21개
    └── CO₂ timer: 26개
```

### 최근 개선 사항 (2025-01-10)

**Codex를 활용한 체계적인 테스트 품질 검증 및 개선:**

1. **타입 안전성 강화**
   - `co2-table.test.ts`: 문자열, undefined, 소수점 입력 등 타입 오류 케이스 추가
   - 모든 필수 필드에 대한 타입 검증 테스트 보강

2. **문자열 검증 강화**
   - `frenzel-training.test.ts`: title, goal, successCriteria, steps 필드에 대한 빈 문자열 및 비문자열 입력 실패 테스트 추가
   - Zod의 `.min(1)` 검증 동작 확인

3. **날짜 처리 및 경계값 테스트**
   - `training-record.test.ts`: ISO 문자열 coercion 테스트 추가
   - FrenzelSessionMetaSchema: dayNumber 경계값 (0, 11) 테스트 추가
   - CO2TableSessionMetaSchema: 음수, 0, 소수점 입력 검증 테스트 추가

4. **비동기 테스트 안정성 개선**
   - `training-history-store.test.ts`: hydration 테스트의 조건문을 `waitFor`로 교체하여 assertion이 항상 실행되도록 수정
   - `act()` 래퍼로 모든 Zustand 상태 업데이트 감싸기

5. **리소스 정리 검증 강화**
   - `useCO2TableTimer.test.ts`: AppState 리스너 cleanup 검증 추가
   - Timer 복원을 보장하기 위해 try/finally 블록 사용
   - CO₂ timer의 모든 timer flush를 `act()`로 감싸 React 경고 제거

6. **React act() 경고 완전 제거**
   - `use-timer.test.ts`: Frenzel timer 테스트의 afterEach에서 timer flush를 `act()`로 감싸기
   - 모든 타이머 테스트에서 React 상태 업데이트 안전성 보장
   - **테스트 실행 시 React 경고 0개 달성 ✅**

**테스트 품질 향상:**
- 엣지 케이스 및 오류 케이스 체계적 보강
- 테스트 안정성 및 신뢰성 향상
- React act() 경고 완전 제거로 테스트 출력 깔끔함
- TESTING.md 가이드 준수율 개선
