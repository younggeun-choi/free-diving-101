# Architecture Guide

이 문서는 Free Diving 101 프로젝트의 아키텍처 설계 원칙을 설명합니다.

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
│   │   │   ├── constants.ts      # 10일 스케줄 데이터
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
│   ├── requirements/             # 제품 요구사항 문서
│   └── guides/                   # 개발 가이드
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

## Feature-Sliced Design (FSD)

이 프로젝트는 Feature-Sliced Design 원칙을 따릅니다:

### 1. entities/ - 도메인 데이터 모델

- 런타임 검증을 위한 Zod 스키마 정의
- 스키마에서 추론된 TypeScript 타입 export
- 도메인 상수 저장 (예: 훈련 스케줄)

**예시:**
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

### 2. features/ - 비즈니스 기능

- 각 기능은 UI와 로직을 포함하는 독립적인 모듈
- 기능 내 상태 관리를 위한 커스텀 훅 사용
- 데이터 검증을 위해 entities import

### 3. widgets/ - 복합 UI 컴포넌트

- 여러 기능 또는 UI 컴포넌트 결합
- 복잡한 사용자 상호작용 처리

### 4. shared/ - 재사용 가능한 유틸리티

- UI 컴포넌트 (React Native Reusables)
- 헬퍼 함수
- 커스텀 훅
- 상수

### 5. stores/ - 전역 상태 관리

- 기능 간 공유 상태를 위한 Zustand 스토어
- 데이터 영속성을 위한 persist 미들웨어 사용
- 스토어는 집중적이고 최소화하여 유지

**예시:**
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

---

## 의존성 규칙

FSD의 핵심은 명확한 의존성 방향입니다:

```
app (라우트)
  ↓ imports
widgets
  ↓ imports
features
  ↓ imports
entities ← imports ← stores
  ↓ imports
shared
```

**규칙:**
- **entities/** → 의존성 없음 (순수 도메인 로직)
- **features/** → entities/와 shared/에서 import 가능
- **widgets/** → features/, entities/, shared/에서 import 가능
- **stores/** → entities/에서 import 가능
- **app/** (라우트) → 모든 레이어에서 import 가능

---

## Path Alias

TypeScript path alias는 `tsconfig.json`에 설정되어 있습니다:

```typescript
import { Button } from '@/shared/ui/button';
import { useDiveStore } from '@/stores/training-store';
import { DiveSchema } from '@/entities/dive';
import { EqualizingTrainer } from '@/features/equalizing-trainer';
```

### 사용 가능한 alias

- `@/*` → `src/*`
- `@/entities/*` → `src/entities/*`
- `@/features/*` → `src/features/*`
- `@/widgets/*` → `src/widgets/*`
- `@/shared/*` → `src/shared/*`
- `@/stores/*` → `src/stores/*`

---

## 새 기능 추가 프로세스

1. **PRD 작성**: `docs/requirements/`에 기능 요구사항 문서화
2. **스키마 정의**: `src/entities/`에 Zod 스키마 생성
3. **기능 구현**: `src/features/`에 UI와 로직 구축
4. **스토어 추가**: 필요시 `src/stores/`에 Zustand 스토어 생성
5. **테스트 작성**: `__tests__/`에 테스트 추가
6. **라우트 업데이트**: Expo Router를 사용하여 `app/`에 화면 추가

---

## 상태 관리 원칙

### 전역 상태 (Zustand)

- 전역 상태에만 Zustand 사용
- 재시작 후에도 유지되어야 하는 데이터에 Zustand persist 미들웨어 사용
- 스토어를 최소화하고 집중적으로 유지

### 로컬 상태 (useState)

- 가능한 경우 로컬 상태(useState) 선호
- 컴포넌트 내부에서만 사용되는 UI 상태는 로컬로 관리

---

## 관련 문서

- [코딩 표준](./CODING_STANDARDS.md) - TypeScript, Zod, React Compiler 사용법
- [의존성 관리](./DEPENDENCIES.md) - Expo SDK 패키지 관리
- [다국어 지원](./I18N.md) - i18next 사용법
