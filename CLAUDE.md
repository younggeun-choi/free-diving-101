# CLAUDE.md

이 파일은 이 저장소에서 작업할 때 Claude Code (claude.ai/code)에게 가이드를 제공합니다.

## 프로젝트 개요

**Free Diving 101**은 초보 프리다이버를 위해 설계된 모바일 훈련 애플리케이션입니다. 이 앱은 사용자가 필수 프리다이빙 기술을 개발할 수 있도록 체계적인 훈련 프로그램을 제공합니다.

### 핵심 기능

1. **이퀄라이징 훈련**: 일일 운동이 포함된 7일 단계별 훈련 스케줄
2. **CO2 테이블 훈련**: 커스터마이징 가능한 CO2 테이블을 사용한 숨 참기 훈련
3. **훈련 기록**: 완료 이력 및 진행 통계 추적

자세한 기능 명세는 `docs/PRD.md`에서 관리됩니다.

---

## 기술 스택

### 확정된 버전 (최신 안정화 버전)

- **프레임워크**: Expo SDK 54+
- **언어**: TypeScript 5.3+
- **라우팅**: Expo Router 4+ (파일 기반 라우팅, 자동 코드 스플리팅)
- **상태 관리**: Zustand 5+ (AsyncStorage 영속성 지원)
- **스키마 검증**: Zod 3.23+
- **UI 프레임워크**: NativeWind 4.1+ (stable) + React Native Reusables
- **테스팅**: Jest 29.7+ with React Native Testing Library
- **코드 품질**: ESLint 8.57+ + Prettier 3.4+
- **배포**: EAS Build (latest)

---

## 프로젝트 구조

```
free-diving-101/
├── app/                          # Expo Router (파일 기반 라우팅)
│   ├── (tabs)/                   # 탭 네비게이션 화면
│   │   ├── index.tsx             # 홈/대시보드
│   │   ├── equalizing.tsx        # 이퀄라이징 훈련
│   │   ├── co2-table.tsx         # CO2 테이블 훈련
│   │   ├── history.tsx           # 훈련 기록
│   │   └── _layout.tsx           # 탭 레이아웃 설정
│   ├── training/
│   │   └── [id].tsx              # 훈련 실행 화면
│   ├── _layout.tsx               # 루트 레이아웃
│   └── +not-found.tsx            # 404 화면
│
├── src/
│   ├── entities/                 # 비즈니스 엔티티 (Zod 스키마 & 타입)
│   │   ├── user/
│   │   │   ├── model.ts          # Zod 스키마 정의
│   │   │   ├── types.ts          # TypeScript 타입
│   │   │   └── index.ts          # 공개 exports
│   │   ├── equalizing-training/
│   │   │   ├── model.ts
│   │   │   ├── types.ts
│   │   │   ├── constants.ts      # 7일 스케줄 데이터
│   │   │   └── index.ts
│   │   ├── co2-table/
│   │   │   ├── model.ts
│   │   │   ├── types.ts
│   │   │   ├── constants.ts      # CO2 테이블 설정
│   │   │   └── index.ts
│   │   └── training-record/
│   │       ├── model.ts
│   │       ├── types.ts
│   │       └── index.ts
│   │
│   ├── features/                 # 기능 모듈 (UI + 비즈니스 로직)
│   │   ├── equalizing-trainer/
│   │   │   ├── ui/               # React 컴포넌트
│   │   │   ├── lib/              # 비즈니스 로직 & 훅
│   │   │   └── index.ts
│   │   ├── co2-table-trainer/
│   │   │   ├── ui/
│   │   │   ├── lib/
│   │   │   └── index.ts
│   │   └── training-history/
│   │       ├── ui/
│   │       ├── lib/
│   │       └── index.ts
│   │
│   ├── widgets/                  # 복합 UI 블록
│   │   ├── training-dashboard/
│   │   ├── progress-tracker/
│   │   └── notification-banner/
│   │
│   ├── shared/                   # 공유 유틸리티
│   │   ├── ui/                   # React Native Reusables 컴포넌트
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── checkbox.tsx
│   │   │   └── ...
│   │   ├── lib/                  # 유틸리티 함수
│   │   │   ├── utils.ts          # cn() 헬퍼 등
│   │   │   ├── date-utils.ts
│   │   │   └── audio-utils.ts
│   │   ├── hooks/                # 커스텀 훅
│   │   │   ├── use-timer.ts
│   │   │   ├── use-haptics.ts
│   │   │   └── use-notifications.ts
│   │   └── constants/            # 앱 상수
│   │       ├── colors.ts
│   │       └── sounds.ts
│   │
│   └── stores/                   # Zustand 전역 스토어
│       ├── training-store.ts     # 훈련 데이터 & 완료 기록
│       ├── settings-store.ts     # 앱 설정 (소리, 알림)
│       └── index.ts              # 스토어 exports
│
├── __tests__/                    # 테스트 파일
│   ├── entities/
│   ├── features/
│   ├── stores/
│   └── setup.ts
│
├── docs/
│   └── PRD.md                    # 제품 요구사항 문서
│
├── assets/                       # 정적 리소스
│   ├── sounds/
│   ├── images/
│   └── fonts/
│
├── global.css                    # Tailwind/NativeWind 스타일
├── tailwind.config.js
├── metro.config.js
├── tsconfig.json
├── jest.config.js
├── .eslintrc.js
├── .prettierrc
├── app.json
└── package.json
```

---

## 필수 명령어

### 개발
```bash
# 의존성 설치
npm install

# Expo 개발 서버 시작 (Expo Go 앱 사용)
npx expo start

# 캐시 제거 후 재시작
npx expo start --clear
```

### 테스팅
```bash
# 모든 테스트 실행
npm test

# watch 모드로 테스트 실행
npm test -- --watch

# 커버리지와 함께 테스트 실행
npm test -- --coverage
```

### 코드 품질
```bash
# ESLint 실행
npm run lint

# ESLint 이슈 자동 수정
npm run lint -- --fix

# TypeScript 타입 체킹 실행
npx tsc --noEmit

# Prettier로 코드 포맷팅
npx prettier --write .
```

### 프로덕션 빌드 & 배포
```bash
# Android 빌드
eas build --platform android --profile production

# iOS 빌드
eas build --platform ios --profile production

# 앱 스토어 제출
eas submit --platform android
eas submit --platform ios
```

---

## Path Alias

TypeScript path alias는 `tsconfig.json`에 설정되어 있습니다:

```typescript
import { Button } from '@/shared/ui/button';
import { useDiveStore } from '@/stores/training-store';
import { DiveSchema } from '@/entities/dive';
import { EqualizingTrainer } from '@/features/equalizing-trainer';
```

사용 가능한 alias:
- `@/*` → `src/*`
- `@/entities/*` → `src/entities/*`
- `@/features/*` → `src/features/*`
- `@/widgets/*` → `src/widgets/*`
- `@/shared/*` → `src/shared/*`
- `@/stores/*` → `src/stores/*`

---

## 아키텍처 원칙

### Feature-Sliced Design

이 프로젝트는 Feature-Sliced Design (FSD) 원칙을 따릅니다:

1. **entities/**: 도메인 데이터 모델
   - 런타임 검증을 위한 Zod 스키마 정의
   - 스키마에서 추론된 TypeScript 타입 export
   - 도메인 상수 저장 (예: 훈련 스케줄)

2. **features/**: 비즈니스 기능
   - 각 기능은 UI와 로직을 포함하는 독립적인 모듈
   - 기능 내 상태 관리를 위한 커스텀 훅 사용
   - 데이터 검증을 위해 entities import

3. **widgets/**: 복합 UI 컴포넌트
   - 여러 기능 또는 UI 컴포넌트 결합
   - 복잡한 사용자 상호작용 처리

4. **shared/**: 재사용 가능한 유틸리티
   - UI 컴포넌트 (React Native Reusables)
   - 헬퍼 함수
   - 커스텀 훅
   - 상수

5. **stores/**: 전역 상태 관리
   - 기능 간 공유 상태를 위한 Zustand 스토어
   - 데이터 영속성을 위한 persist 미들웨어 사용
   - 스토어는 집중적이고 최소화하여 유지

### 의존성 규칙

- **entities/** → 의존성 없음 (순수 도메인 로직)
- **features/** → entities/와 shared/에서 import 가능
- **widgets/** → features/, entities/, shared/에서 import 가능
- **stores/** → entities/에서 import 가능
- **app/** (라우트) → 모든 레이어에서 import 가능

---

## 개발 워크플로우

### 1. 개발 단계 (Expo Go)

```bash
# 프로젝트 생성 (새로 시작하는 경우)
npx rn-new@latest --nativewind --expo-router

# 개발 서버 시작
npx expo start

# 기기에서 Expo Go 앱으로 QR 코드 스캔
# 네이티브 앱 빌드 없이 모든 개발 가능
```

**왜 Expo Go인가?**
- NativeWind 4는 Expo Go와 호환됨
- 개발 중 네이티브 빌드 불필요
- 핫 리로드를 통한 빠른 반복
- 모든 의존성이 Expo SDK에 포함됨

### 2. 프로덕션 배포 (EAS Build)

```bash
# EAS 설정 (최초 1회만)
eas build:configure

# 프로덕션 빌드 생성
eas build --platform android --profile production
eas build --platform ios --profile production

# 앱 스토어 제출
eas submit
```

### 3. 기능 개발 프로세스

1. **PRD 작성**: `docs/PRD.md`에 기능 요구사항 문서화
2. **스키마 정의**: `src/entities/`에 Zod 스키마 생성
3. **기능 구현**: `src/features/`에 UI와 로직 구축
4. **스토어 추가**: 필요시 `src/stores/`에 Zustand 스토어 생성
5. **테스트 작성**: `__tests__/`에 테스트 추가
6. **라우트 업데이트**: Expo Router를 사용하여 `app/`에 화면 추가

---

## 코딩 규칙

### TypeScript

- **항상 TypeScript strict mode 사용**
- `any` 타입 피하기; 타입이 정말 알 수 없는 경우 `unknown` 사용
- 함수의 명시적 반환 타입 정의
- 명확한 경우 변수에 타입 추론 사용

```typescript
// 좋음
function calculateDuration(start: Date, end: Date): number {
  return end.getTime() - start.getTime();
}

// 나쁨
function calculateDuration(start, end) {
  return end.getTime() - start.getTime();
}
```

### Zod 스키마

- `entities/`에 모든 데이터 모델을 Zod 스키마로 정의
- 런타임 검증에 Zod 사용
- 스키마에서 TypeScript 타입 추론

```typescript
// src/entities/dive/model.ts
import { z } from 'zod';

export const DiveSchema = z.object({
  id: z.string().uuid(),
  date: z.date(),
  depth: z.number().positive(),
  duration: z.number().positive(),
});

// src/entities/dive/types.ts
import { z } from 'zod';
import { DiveSchema } from './model';

export type Dive = z.infer<typeof DiveSchema>;
```

### Zustand 스토어

- 앱 재시작 후에도 유지되어야 하는 데이터에 persist 미들웨어 사용
- 스토어를 특정 도메인에 집중
- 명확한 액션 메서드 정의

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TrainingState {
  completedDays: number[];
  completeDay: (day: number) => void;
}

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set) => ({
      completedDays: [],
      completeDay: (day) => set((state) => ({
        completedDays: [...state.completedDays, day],
      })),
    }),
    {
      name: 'training-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### React Native Reusables

- **항상 React Native Reusables 컴포넌트 우선 사용**
- **React Native 기본 컴포넌트 대신 React Native Reusables 사용 필수**
  - ❌ `import { Text } from 'react-native'` (사용 금지)
  - ✅ `import { Text } from '@/shared/ui/text'` (올바름)
- 가능한 경우 CLI를 사용하여 컴포넌트 설치
- 컴포넌트를 `src/shared/ui/`에 배치
- NativeWind 클래스로 커스터마이징

```bash
# CLI를 사용하여 컴포넌트 설치 (올바른 공식 CLI)
npx @react-native-reusables/cli@latest add button
npx @react-native-reusables/cli@latest add text

# 또는 shadcn CLI 사용 (일부 컴포넌트)
npx shadcn add button card
```

**중요**: `npx react-native-reusables` 또는 `npx rnr`은 작동하지 않습니다. 반드시 `npx @react-native-reusables/cli@latest`를 사용하세요.

```tsx
// ✅ 올바른 사용 (React Native Reusables)
import { View } from 'react-native';
import { Text } from '@/shared/ui/text';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

export function TrainingCard() {
  return (
    <Card className="p-4 m-2">
      <Text variant="h3">훈련 제목</Text>
      <Text variant="p" className="mt-2">
        훈련 설명
      </Text>
      <Button className="bg-primary mt-4">
        <Text variant="small">훈련 시작</Text>
      </Button>
    </Card>
  );
}

// ❌ 잘못된 사용 (React Native 기본 컴포넌트)
import { View, Text } from 'react-native'; // Text 사용 금지!
```

**Text 컴포넌트 Variants**:
- `h1`, `h2`, `h3`, `h4`: 제목
- `p`: 본문
- `large`: 큰 텍스트
- `small`: 작은 텍스트
- `muted`: 흐린 텍스트
- `code`: 코드 스타일
- `blockquote`: 인용구
- `lead`: 리드 텍스트

### NativeWind 스타일링

- 스타일링에 NativeWind className 사용
- Tailwind utility-first 접근 방식 따르기
- 다크 모드 변형에 dark: 접두사 사용

```tsx
import { View, Text } from 'react-native';

export function Header() {
  return (
    <View className="bg-white dark:bg-black p-4">
      <Text className="text-xl font-bold text-black dark:text-white">
        Free Diving 101
      </Text>
    </View>
  );
}
```

---

## React Compiler

Expo SDK 54+부터 React Compiler를 공식 지원합니다. React Compiler는 컴포넌트와 훅을 자동으로 메모이제이션하여 성능을 최적화합니다.

### 활성화 방법 (SDK 54+)

`app.json`에 다음 설정만 추가하면 됩니다:

```json
{
  "expo": {
    "experiments": {
      "reactCompiler": true
    }
  }
}
```

**SDK 54+부터는 Babel이 자동으로 구성되어 별도 패키지 설치가 필요 없습니다.**

### 주요 원칙

1. **자동 최적화**: React Compiler가 자동으로 메모이제이션 수행
2. **수동 메모이제이션 금지**: `useMemo`와 `useCallback` 수동 사용 지양
3. **컴파일러 우선**: 수동 최적화는 컴파일러와 충돌하여 오히려 성능 저하 및 오작동 유발

### 올바른 사용법

```tsx
// ✅ 좋음: React Compiler에 맡기기
function ProductList({ products }) {
  const sortedProducts = products.sort((a, b) => a.price - b.price);

  return (
    <FlatList
      data={sortedProducts}
      renderItem={({ item }) => <ProductCard product={item} />}
    />
  );
}
```

```tsx
// ❌ 나쁨: 수동 메모이제이션 (React Compiler와 충돌)
function ProductList({ products }) {
  const sortedProducts = useMemo(
    () => products.sort((a, b) => a.price - b.price),
    [products]
  );

  const renderItem = useCallback(
    ({ item }) => <ProductCard product={item} />,
    []
  );

  return <FlatList data={sortedProducts} renderItem={renderItem} />;
}
```

### 특정 컴포넌트 최적화 제외

컴파일러 최적화가 문제를 일으키는 경우에만 `'use no memo'` 디렉티브 사용:

```tsx
function SpecialComponent() {
  'use no memo'; // 이 컴포넌트만 최적화 제외

  // 특별한 로직...
  return <View>...</View>;
}
```

### 주의사항

- Metro 번들러를 재시작해야 Babel 설정 변경사항이 반영됨
- 기존 `useMemo`/`useCallback` 코드는 단계적으로 제거 권장
- 성능 문제가 발생하면 React DevTools Profiler로 확인 후 `'use no memo'` 사용 고려

---

## 테스팅 가이드라인

### 유닛 테스트

- features/의 비즈니스 로직 테스트
- Zod 스키마 검증 테스트
- Zustand 스토어 액션 테스트

```typescript
// __tests__/entities/dive.test.ts
import { DiveSchema } from '@/entities/dive/model';

describe('Dive Schema Validation', () => {
  it('올바른 dive 데이터 검증', () => {
    const validDive = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      date: new Date(),
      depth: 30,
      duration: 45,
    };

    expect(() => DiveSchema.parse(validDive)).not.toThrow();
  });

  it('음수 깊이 거부', () => {
    const invalidDive = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      date: new Date(),
      depth: -10,
      duration: 45,
    };

    expect(() => DiveSchema.parse(invalidDive)).toThrow();
  });
});
```

### 컴포넌트 테스트

- React Native Testing Library 사용
- 사용자 상호작용 테스트
- 접근성 테스트

---

## 중요 사항

### 기능 구현

- **PRD 문서 없이 기능 구현 금지**
- 항상 `docs/PRD.md`에 PRD를 먼저 작성하거나 업데이트
- 복잡한 기능을 작고 테스트 가능한 단위로 분해
- 기능을 점진적으로 한 번에 하나씩 구현

### 상태 관리

- 전역 상태에만 Zustand 사용
- 가능한 경우 로컬 상태(useState) 선호
- 재시작 후에도 유지되어야 하는 데이터에 Zustand persist 미들웨어 사용
- 스토어를 최소화하고 집중적으로 유지

### UI 컴포넌트

- **React Native Reusables가 기본 UI 라이브러리**
- Reusables가 제공하지 않는 경우에만 커스텀 컴포넌트 생성
- 커스텀 컴포넌트를 Reusables 컴포넌트와 함께 shared/ui/에 유지
- 모든 스타일링에 NativeWind 사용

### 성능

- **React Compiler 활성화** (`app.json`에서 `experiments.reactCompiler: true` 설정)
- React Compiler가 자동으로 메모이제이션 최적화 수행
- **수동 useMemo/useCallback 사용 금지** (컴파일러와 충돌하여 오작동 가능)
- 최적화 제외가 필요한 특정 컴포넌트에만 `'use no memo'` 디렉티브 사용
- Expo Router의 자동 코드 스플리팅으로 화면 지연 로딩
- 적절한 키와 가상화로 FlatList/ScrollView 최적화

---

## 일반 작업

### 새 기능 추가

1. `docs/PRD.md`에 문서화
2. `src/entities/[feature]/`에 엔티티 정의
3. `src/features/[feature]/`에 기능 모듈 생성
4. 필요시 `src/stores/`에 스토어 추가
5. `app/`에 화면 추가
6. `__tests__/`에 테스트 작성

### UI 컴포넌트 추가

```bash
# React Native Reusables에서 설치 (올바른 공식 CLI)
npx @react-native-reusables/cli@latest add [component-name]

# 예시
npx @react-native-reusables/cli@latest add button
npx @react-native-reusables/cli@latest add text
npx @react-native-reusables/cli@latest add card

# 일부 컴포넌트는 shadcn CLI 사용 가능
npx shadcn add button card

# 컴포넌트가 src/shared/ui/에 추가됨
```

### 새 화면 추가

```bash
# app/ 디렉토리에 파일 생성
# Expo Router가 자동으로 라우트 생성
touch app/new-screen.tsx
```

### 의존성 업데이트

```bash
# Expo SDK 업데이트
npx expo install --fix

# 특정 패키지 업데이트
npx expo install [package-name]@latest
```

---

## 참고 자료

- [Expo 문서](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [NativeWind](https://www.nativewind.dev/)
- [React Native Reusables](https://rnr-docs.vercel.app/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Zod](https://zod.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)

---

## 지원

질문이나 문제가 있는 경우:
1. 이 CLAUDE.md 파일 확인
2. 기능 명세는 `docs/PRD.md` 검토
3. 공식 문서 참조 (위 링크)
4. 코드베이스의 기존 코드 패턴 확인
