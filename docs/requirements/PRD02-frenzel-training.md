# PRD-02: 프렌젤 이퀄라이징 훈련 기능

## 문서 정보

- **문서 번호**: PRD-02
- **버전**: 1.1
- **작성일**: 2025-10-31
- **최종 수정일**: 2025-10-31
- **목적**: 10일 프렌젤 이퀄라이징 훈련 프로그램 구현 (React Native Reusables UI 컴포넌트 통합 포함)

---

## 1. 프로젝트 개요

**Free Diving 101** 앱의 핵심 기능인 **프렌젤 이퀄라이징 훈련 프로그램**을 구현합니다. 이 기능은 초보 프리다이버가 체계적으로 프렌젤 기술을 습득할 수 있도록 10일간의 단계별 훈련 프로그램을 제공합니다.

### 핵심 목표

- 프렌젤 이퀄라이징에 대한 교육 콘텐츠 제공 (개요, 원리, 발살바 비교)
- 10일 훈련 스케줄 제공 (Day 1 ~ Day 10)
- 각 Day별 훈련 타이머 기능
- 훈련 완료 기록 저장 및 히스토리 추적
- 다국어 지원 (한국어, 영어)

### 사용자 스토리

**AS** 초보 프리다이버
**I WANT** 프렌젤 이퀄라이징을 체계적으로 배우고
**SO THAT** 깊은 수심에서도 안전하게 귀 압력을 평형시킬 수 있다

**주요 시나리오**:

1. **교육 콘텐츠 확인**: 사용자는 프렌젤이 무엇인지, 왜 필요한지, 어떻게 작동하는지 앱에서 학습한다
2. **훈련 프로그램 탐색**: 사용자는 10일 훈련 프로그램의 각 Day별 목표와 단계를 확인한다
3. **훈련 실행**: 사용자는 특정 Day를 선택하여 타이머 기반 훈련을 실행한다
4. **기록 추적**: 사용자는 완료한 훈련을 히스토리에서 확인하고 진행 상황을 추적한다

---

## 2. 구현 범위

### 2.1 포함 사항

#### 2.1.1 교육 콘텐츠 (what-is-frenzel.md 기반)

Equalizing 메인 화면에 아코디언 형태로 제공:

1. **프렌젤의 개요**: 프렌젤 이퀄라이징이란 무엇인가?
2. **프렌젤의 원리**: 후두, 연부구개, 혀의 역할
3. **발살바와 프렌젤의 차이점**: 왜 프렌젤이 깊은 다이빙에 필수인가?

#### 2.1.2 10일 훈련 프로그램

Day 1 ~ Day 10까지의 체계적인 훈련 스케줄:

| Day | 제목 | 훈련 시간 | 목표 |
|-----|------|----------|------|
| 1 | 후두 감각 익히기 | 10분 | 후두(Glottis)를 닫는 감각을 명확히 인식 |
| 2 | 후두 제어 심화 | 15분 | 후두의 열림과 닫힘을 의식적으로 제어 |
| 3 | 연부구개 감각 익히기 | 10분 | 코로 가는 통로(연부구개)의 열림과 닫힘을 구분 |
| 4 | 연부구개 제어 심화 | 15분 | 연부구개 열림/닫힘을 자유롭게 전환 |
| 5 | 혀의 K/T 동작 기초 | 15분 | 혀의 위치와 공기 밀기 동작을 익힘 |
| 6 | 혀의 피스톤 압력 제어 | 15분 | 혀의 움직임으로 공기 압력을 일정하게 제어 |
| 7 | 감각 통합 1단계 | 20분 | 후두 닫힘 + 연부구개 열림 + 혀 피스톤 동시 수행 |
| 8 | 감각 통합 2단계 (리듬) | 20분 | 프렌젤 동작을 리듬감 있게 자동화 |
| 9 | Head-first 프렌젤 적응 1단계 | 15~20분 | 머리 아래(head-down) 자세에서 연부구개 유지 |
| 10 | Head-first 프렌젤 완성 | 20~25분 | 완전한 머리 아래 자세(90°)에서도 안정적 프렌젤 수행 |

#### 2.1.3 타이머 기능

- Day별 설정된 훈련 시간에 맞춘 카운트다운 타이머
- 타이머 시작/일시정지/재개/완료/취소 기능
- 백그라운드 실행 및 로컬 알림 (앱 종료 시에도 타이머 계속 실행)
- 훈련 완료 시 히스토리 자동 저장

#### 2.1.4 데이터 모델 (Zod 스키마)

- `FrenzelDay`: 각 Day의 훈련 정보 (제목, 목표, 시간, 단계, 성공 감각)
- `FrenzelSession`: 훈련 기록 (시작 시간, 종료 시간, 완료 여부, Day 번호)
- `FRENZEL_TRAINING_SCHEDULE`: 10일 훈련 프로그램 전체 데이터 (constants)

#### 2.1.5 i18n 번역

- what-is-frenzel.md의 모든 콘텐츠를 한국어(ko.json)와 영어(en.json)로 번역
- 화면 UI 텍스트 다국어 지원

#### 2.1.6 React Native Reusables UI 컴포넌트

프렌젤 훈련 기능 구현에 필요한 UI 컴포넌트를 React Native Reusables에서 설치:

| 컴포넌트 | 용도 | 필수 여부 |
|---------|------|----------|
| **Accordion** | 교육 콘텐츠 (개요/원리/비교) 펼치기/접기 | ✅ 필수 |
| **Card** | Day 리스트 아이템, Day 상세 화면, 히스토리 아이템 | ✅ 필수 |
| **Button** | 훈련 시작, 일시정지, 재개, 완료, 취소 버튼 | ✅ 필수 |
| **Badge** | Day 번호 표시, 완료 상태 표시 | ✅ 필수 |
| **Progress** | 타이머 진행률 표시 | ⭕ 선택 |
| **Separator** | 섹션 구분선 | ⭕ 선택 |

**설치 방법**:
```bash
# React Native Reusables CLI로 필수 컴포넌트 설치
npx @react-native-reusables/cli@latest add accordion
npx @react-native-reusables/cli@latest add card
npx @react-native-reusables/cli@latest add button
npx @react-native-reusables/cli@latest add badge
npx @react-native-reusables/cli@latest add progress
npx @react-native-reusables/cli@latest add separator
```

**컴포넌트 위치**: `src/shared/ui/`

### 2.2 제외 사항

다음 요소들은 **구현하지 않습니다** (다음 PRD에서 구현):

- ❌ Zustand 전역 스토어 (PRD-03에서 추가 예정)
- ❌ AsyncStorage 영속성 (현재는 인메모리 상태만 사용)
- ❌ 고급 히스토리 분석 (진행률 차트, 통계)
- ❌ 푸시 알림 (expo-notifications 설치는 하지만 구현은 다음 PRD)
- ❌ 음성 안내 (TTS)
- ❌ 진동 피드백 (haptics)
- ❌ 테스트 코드 (PRD-08에서 추가)

---

## 3. 기술 스택

CLAUDE.md에 정의된 기술 스택을 기반으로 다음 패키지를 추가합니다:

| 카테고리 | 기술 | 버전 | 용도 |
|---------|------|------|------|
| **타이머** | expo-background-fetch, expo-task-manager | ~0.9.0, ~14.0.0 | 백그라운드 타이머 |
| **로컬 알림** | expo-notifications | ~0.31.0 | 백그라운드 알림 |
| **UI 컴포넌트** | React Native Reusables | latest | Accordion, Card, Button, Badge, Progress |
| **상태 관리** | React useState/useReducer | - | 로컬 상태 관리 (Zustand는 PRD-03) |
| **검증** | Zod | 3.23+ | 데이터 스키마 검증 |
| **i18n** | react-i18next | 기존 사용 | 다국어 지원 |

### 3.1 신규 패키지 설치

```bash
# 백그라운드 타이머
npx expo install expo-background-fetch expo-task-manager

# 로컬 알림
npx expo install expo-notifications

# Zod (검증)
npm install zod@^3.23.0

# React Native Reusables UI 컴포넌트
npx @react-native-reusables/cli@latest add accordion
npx @react-native-reusables/cli@latest add card
npx @react-native-reusables/cli@latest add button
npx @react-native-reusables/cli@latest add badge
npx @react-native-reusables/cli@latest add progress
npx @react-native-reusables/cli@latest add separator
```

---

## 4. 디렉토리 구조

PRD-02 구현 후 최종 디렉토리 구조:

```
free-diving-101/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx             # 홈/대시보드
│   │   ├── equalizing.tsx        # 프렌젤 훈련 메인 화면 (새로 구현)
│   │   ├── co2-table.tsx         # CO2 테이블 (기존)
│   │   ├── history.tsx           # 히스토리 (새로 구현)
│   │   └── _layout.tsx           # 탭 레이아웃
│   ├── training/
│   │   └── [id].tsx              # 훈련 타이머 화면 (새로 추가)
│   ├── _layout.tsx               # 루트 레이아웃
│   └── +not-found.tsx            # 404
│
├── src/
│   ├── entities/                 # 도메인 엔티티 (새로 생성)
│   │   └── frenzel-training/
│   │       ├── model.ts          # Zod 스키마
│   │       ├── types.ts          # TypeScript 타입
│   │       ├── constants.ts      # 10일 훈련 프로그램 데이터
│   │       └── index.ts          # 공개 exports
│   │
│   ├── features/                 # 기능 모듈 (새로 생성)
│   │   └── frenzel-trainer/
│   │       ├── ui/
│   │       │   ├── EducationAccordion.tsx    # 교육 콘텐츠 아코디언
│   │       │   ├── DayList.tsx               # 10일 훈련 리스트
│   │       │   ├── DayDetailCard.tsx         # Day 상세 정보 카드
│   │       │   └── TrainingTimer.tsx         # 타이머 컴포넌트
│   │       ├── lib/
│   │       │   ├── useTimer.ts               # 타이머 훅
│   │       │   ├── useTrainingHistory.ts     # 히스토리 관리 훅
│   │       │   └── notifications.ts          # 알림 유틸리티
│   │       └── index.ts
│   │
│   └── shared/
│       ├── ui/                   # React Native Reusables 컴포넌트
│       │   ├── text.tsx          # 기존
│       │   ├── accordion.tsx     # 새로 추가
│       │   ├── card.tsx          # 새로 추가
│       │   ├── button.tsx        # 새로 추가
│       │   ├── badge.tsx         # 새로 추가
│       │   ├── progress.tsx      # 새로 추가
│       │   └── separator.tsx     # 새로 추가
│       ├── locales/
│       │   ├── en.json           # 영어 번역 (확장)
│       │   ├── ko.json           # 한국어 번역 (확장)
│       │   └── index.ts
│       └── lib/
│           └── i18n/
│               ├── config.ts
│               └── index.ts
│
├── docs/
│   ├── PRD01-skeleton-app.md
│   ├── PRD02-frenzel-training.md  # 이 문서
│   └── what-is-frenzel.md         # 참고 자료
│
├── global.css
├── tailwind.config.js
├── metro.config.js
├── tsconfig.json
├── app.json
├── package.json
└── CLAUDE.md
```

---

## 5. 데이터 모델

### 5.1 Zod 스키마

#### 5.1.1 `src/entities/frenzel-training/model.ts`

```typescript
import { z } from 'zod';

/**
 * 프렌젤 훈련 Day 스키마
 */
export const FrenzelDaySchema = z.object({
  dayNumber: z.number().int().min(1).max(10),
  title: z.string(),
  goal: z.string(),
  durationMinutes: z.number().positive(),
  steps: z.array(z.string()),
  successCriteria: z.string(),
});

/**
 * 프렌젤 훈련 세션 스키마
 */
export const FrenzelSessionSchema = z.object({
  id: z.string().uuid(),
  dayNumber: z.number().int().min(1).max(10),
  startTime: z.date(),
  endTime: z.date().nullable(),
  completed: z.boolean(),
  notes: z.string().optional(),
});

/**
 * 훈련 프로그램 전체 스키마
 */
export const FrenzelTrainingProgramSchema = z.object({
  overview: z.string(),
  principle: z.string(),
  comparison: z.string(),
  schedule: z.array(FrenzelDaySchema),
});
```

#### 5.1.2 `src/entities/frenzel-training/types.ts`

```typescript
import { z } from 'zod';
import {
  FrenzelDaySchema,
  FrenzelSessionSchema,
  FrenzelTrainingProgramSchema,
} from './model';

export type FrenzelDay = z.infer<typeof FrenzelDaySchema>;
export type FrenzelSession = z.infer<typeof FrenzelSessionSchema>;
export type FrenzelTrainingProgram = z.infer<typeof FrenzelTrainingProgramSchema>;
```

#### 5.1.3 `src/entities/frenzel-training/constants.ts`

```typescript
import { FrenzelDay } from './types';

/**
 * 10일 프렌젤 훈련 프로그램
 * 출처: docs/what-is-frenzel.md
 */
export const FRENZEL_TRAINING_SCHEDULE: FrenzelDay[] = [
  {
    dayNumber: 1,
    title: 'equalizing.day1.title', // i18n 키
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
  // ... Day 3~10 동일 패턴
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
  9: 17.5, // 15~20분 → 평균 17.5분
  10: 22.5, // 20~25분 → 평균 22.5분
};
```

#### 5.1.4 `src/entities/frenzel-training/index.ts`

```typescript
export * from './model';
export * from './types';
export * from './constants';
```

---

## 6. 화면 명세

### 6.1 Equalizing 메인 화면 (`app/(tabs)/equalizing.tsx`)

#### 6.1.1 레이아웃 구조

```
┌─────────────────────────────────┐
│ 프렌젤 이퀄라이징 훈련           │ (헤더)
├─────────────────────────────────┤
│ [▼] 프렌젤의 개요                │ (아코디언 1)
│     혀로 공기를 밀어...          │
├─────────────────────────────────┤
│ [▼] 프렌젤의 원리                │ (아코디언 2)
│     후두, 연부구개, 혀...        │
├─────────────────────────────────┤
│ [▼] 발살바와 프렌젤의 차이점      │ (아코디언 3)
│     표로 비교...                 │
├─────────────────────────────────┤
│ 10일 훈련 프로그램               │ (제목)
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ Day 1 | 후두 감각 익히기     │ │ (리스트 아이템)
│ │ 10분 | 후두를 닫는 감각...  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Day 2 | 후두 제어 심화       │ │
│ │ 15분 | 열림과 닫힘 제어...  │ │
│ └─────────────────────────────┘ │
│ ...                              │
│ ┌─────────────────────────────┐ │
│ │ Day 10 | Head-first 완성     │ │
│ │ 20-25분 | 90° 자세 프렌젤... │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

#### 6.1.2 주요 컴포넌트

1. **EducationAccordion**: 교육 콘텐츠 아코디언
   - **사용 컴포넌트**: `@/shared/ui/accordion` (React Native Reusables)
   - 3개 섹션: 개요, 원리, 비교
   - 펼치기/접기 애니메이션
   - 마크다운 형식 지원 (표, 리스트)

   **사용 예시**:
   ```tsx
   import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion';
   import { Text } from '@/shared/ui/text';

   <Accordion type="multiple">
     <AccordionItem value="overview">
       <AccordionTrigger>
         <Text>{t('equalizing.overview.title')}</Text>
       </AccordionTrigger>
       <AccordionContent>
         <Text>{t('equalizing.overview.content')}</Text>
       </AccordionContent>
     </AccordionItem>
     {/* 원리, 비교 섹션도 동일 패턴 */}
   </Accordion>
   ```

2. **DayList**: 10일 훈련 리스트
   - **사용 컴포넌트**: `@/shared/ui/card`, `@/shared/ui/badge` (React Native Reusables)
   - FlatList로 구현
   - 각 아이템은 Day 번호, 제목, 시간, 간단한 목표 표시
   - 클릭 시 Day 상세 화면으로 이동

   **사용 예시**:
   ```tsx
   import { Card, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
   import { Badge } from '@/shared/ui/badge';

   <Card onPress={() => router.push(`/training/${day.dayNumber}`)}>
     <CardHeader>
       <Badge variant="default">Day {day.dayNumber}</Badge>
       <CardTitle>{t(day.title)}</CardTitle>
       <CardDescription>
         {day.durationMinutes}분 | {t(day.goal)}
       </CardDescription>
     </CardHeader>
   </Card>
   ```

#### 6.1.3 네비게이션

- Day 아이템 클릭 → `app/training/[id].tsx`로 이동 (id는 dayNumber)

### 6.2 Day 상세/타이머 화면 (`app/training/[id].tsx`)

#### 6.2.1 레이아웃 구조

**훈련 시작 전:**

```
┌─────────────────────────────────┐
│ ← Day 1 | 후두 감각 익히기      │ (헤더)
├─────────────────────────────────┤
│ 목표                            │
│ 후두(Glottis)를 닫는 감각을...  │
├─────────────────────────────────┤
│ 훈련 시간: 10분                 │
├─────────────────────────────────┤
│ 트레이닝 단계                    │
│ 1. 입으로 깊게 들이마신 후...   │
│ 2. 목구멍이 잠기는 느낌을...    │
│ 3. 손으로 목을 만지며...        │
│ 4. 숨을 멈춘 상태에서...        │
│ 5. "하~" 소리를 내며...         │
├─────────────────────────────────┤
│ 성공 감각                        │
│ 숨이 멈췄는데 목이 편안하고...  │
├─────────────────────────────────┤
│ [  훈련 시작  ]                 │ (버튼)
└─────────────────────────────────┘
```

**훈련 실행 중:**

```
┌─────────────────────────────────┐
│ ← Day 1 | 후두 감각 익히기      │ (헤더)
├─────────────────────────────────┤
│                                  │
│           10:00                  │ (큰 타이머)
│                                  │
├─────────────────────────────────┤
│  [일시정지]    [완료]   [취소]  │ (버튼)
└─────────────────────────────────┘
```

**일시정지 상태:**

```
┌─────────────────────────────────┐
│ ← Day 1 | 후두 감각 익히기      │
├─────────────────────────────────┤
│                                  │
│           07:32                  │ (일시정지된 시간)
│         (일시정지)               │
│                                  │
├─────────────────────────────────┤
│  [ 재개 ]       [완료]   [취소] │
└─────────────────────────────────┘
```

#### 6.2.2 타이머 동작

1. **시작**: "훈련 시작" 버튼 클릭 → 타이머 카운트다운 시작
2. **일시정지**: 타이머 멈춤, 재개 가능
3. **재개**: 일시정지한 시점부터 계속
4. **완료**:
   - 타이머 종료 (자동 또는 수동)
   - FrenzelSession 생성 및 저장
   - 히스토리 화면으로 이동 (또는 완료 메시지 표시)
5. **취소**: 타이머 중단, 기록 저장하지 않음

#### 6.2.3 백그라운드 동작

- 앱이 백그라운드로 이동해도 타이머 계속 실행
- 백그라운드에서 타이머 완료 시 로컬 알림 발송
- 알림 클릭 시 앱 재실행 및 완료 화면 표시

### 6.3 히스토리 화면 (`app/(tabs)/history.tsx`)

#### 6.3.1 레이아웃 구조

```
┌─────────────────────────────────┐
│ 훈련 기록                        │ (헤더)
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ Day 1 | 후두 감각 익히기     │ │ (히스토리 아이템)
│ │ 2025-10-31 14:30             │ │
│ │ 완료: 10분                   │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Day 2 | 후두 제어 심화       │ │
│ │ 2025-10-30 09:15             │ │
│ │ 완료: 15분                   │ │
│ └─────────────────────────────┘ │
│ ...                              │
└─────────────────────────────────┘
```

#### 6.3.2 기능

- 완료한 훈련 세션 리스트 표시 (최신순)
- 각 아이템: Day 번호, 제목, 완료 시간, 훈련 시간
- 필터링 (선택적): Day별, 날짜별

---

## 7. i18n 번역

### 7.1 번역 키 구조

what-is-frenzel.md의 모든 콘텐츠를 i18n 키로 변환:

```json
{
  "equalizing": {
    "title": "프렌젤 이퀄라이징 훈련",
    "overview": {
      "title": "프렌젤의 개요",
      "content": "프렌젤(Frenzel) 이퀄라이징은..."
    },
    "principle": {
      "title": "프렌젤의 원리",
      "content": "프렌젤은 세 가지 주요 근육의 협응으로...",
      "glottis": "후두 (Glottis): 폐로 가는 문...",
      "softPalate": "연부구개 (Soft Palate): 코로 가는 문...",
      "tongue": "혀 (Tongue): 피스톤 역할..."
    },
    "comparison": {
      "title": "발살바와 프렌젤의 차이점",
      "valsalva": "발살바(Valsalva)",
      "frenzel": "프렌젤(Frenzel)",
      "airSource": "공기 사용원",
      "glottisState": "후두 상태",
      "..."
    },
    "day1": {
      "title": "후두 감각 익히기",
      "goal": "후두(Glottis)를 닫는 감각을 명확히 인식한다.",
      "step1": "입으로 깊게 들이마신 후 숨을 참는다.",
      "step2": "목구멍이 잠기는 느낌을 느껴본다.",
      "..."
    },
    "...": "Day 2~10도 동일 패턴"
  },
  "timer": {
    "start": "훈련 시작",
    "pause": "일시정지",
    "resume": "재개",
    "complete": "완료",
    "cancel": "취소",
    "paused": "(일시정지)"
  },
  "history": {
    "title": "훈련 기록",
    "completed": "완료: {{duration}}분",
    "empty": "아직 완료한 훈련이 없습니다."
  }
}
```

### 7.2 영어 번역 (en.json)

```json
{
  "equalizing": {
    "title": "Frenzel Equalizing Training",
    "overview": {
      "title": "What is Frenzel?",
      "content": "Frenzel Equalizing is a technique..."
    },
    "day1": {
      "title": "Understanding Glottis",
      "goal": "Recognize the sensation of closing the glottis.",
      "..."
    }
  }
}
```

---

## 8. 타이머 기능 명세

### 8.1 타이머 훅 (`src/features/frenzel-trainer/lib/useTimer.ts`)

```typescript
interface UseTimerOptions {
  durationMinutes: number;
  onComplete: () => void;
  onCancel: () => void;
}

interface UseTimerReturn {
  remainingSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  complete: () => void;
  cancel: () => void;
}

export function useTimer(options: UseTimerOptions): UseTimerReturn;
```

### 8.2 백그라운드 타이머

- `expo-background-fetch` + `expo-task-manager` 사용
- 앱이 백그라운드로 이동해도 타이머 계속 실행
- 백그라운드에서 완료 시 로컬 알림 발송

### 8.3 로컬 알림 (`src/features/frenzel-trainer/lib/notifications.ts`)

```typescript
/**
 * 훈련 완료 알림 예약
 */
export async function scheduleTrainingCompleteNotification(
  dayNumber: number,
  delaySeconds: number
): Promise<string>;

/**
 * 알림 취소
 */
export async function cancelNotification(notificationId: string): Promise<void>;

/**
 * 알림 권한 요청
 */
export async function requestNotificationPermissions(): Promise<boolean>;
```

---

## 9. 테스트 시나리오

### 9.1 교육 콘텐츠 표시

**TC-01: 아코디언 펼치기/접기**
- **Given**: Equalizing 메인 화면 진입
- **When**: "프렌젤의 개요" 아코디언 클릭
- **Then**: 콘텐츠가 펼쳐지고 애니메이션 실행
- **And**: 다시 클릭하면 접힘

**TC-02: 다국어 지원**
- **Given**: 앱 언어가 영어로 설정됨
- **When**: Equalizing 메인 화면 진입
- **Then**: 모든 텍스트가 영어로 표시됨

### 9.2 훈련 프로그램

**TC-03: 10일 리스트 표시**
- **Given**: Equalizing 메인 화면 진입
- **When**: 아래로 스크롤
- **Then**: Day 1 ~ Day 10이 순서대로 표시됨

**TC-04: Day 상세 화면 이동**
- **Given**: Equalizing 메인 화면
- **When**: "Day 1" 아이템 클릭
- **Then**: Day 1 상세 화면으로 이동
- **And**: 목표, 단계, 성공 감각이 표시됨

### 9.3 타이머 기능

**TC-05: 타이머 시작**
- **Given**: Day 1 상세 화면
- **When**: "훈련 시작" 버튼 클릭
- **Then**: 타이머가 10:00에서 시작하여 카운트다운
- **And**: 일시정지/완료/취소 버튼이 표시됨

**TC-06: 타이머 일시정지/재개**
- **Given**: 타이머 실행 중 (예: 07:32 남음)
- **When**: "일시정지" 버튼 클릭
- **Then**: 타이머가 멈추고 "(일시정지)" 표시
- **When**: "재개" 버튼 클릭
- **Then**: 07:32부터 계속 카운트다운

**TC-07: 타이머 완료**
- **Given**: 타이머 실행 중
- **When**: "완료" 버튼 클릭 (또는 00:00까지 자동 완료)
- **Then**: FrenzelSession이 생성되고 저장됨
- **And**: 완료 메시지 표시 또는 히스토리 화면으로 이동

**TC-08: 타이머 취소**
- **Given**: 타이머 실행 중
- **When**: "취소" 버튼 클릭
- **Then**: 타이머 중단
- **And**: 세션 기록이 저장되지 않음
- **And**: Day 상세 화면으로 돌아감

**TC-09: 백그라운드 타이머**
- **Given**: 타이머 실행 중 (예: 05:00 남음)
- **When**: 앱을 백그라운드로 이동 (홈 버튼)
- **Then**: 타이머가 백그라운드에서 계속 실행
- **When**: 5분 후 (타이머 완료)
- **Then**: 로컬 알림이 발송됨 ("Day 1 훈련 완료!")
- **When**: 알림 클릭
- **Then**: 앱이 포어그라운드로 복귀하고 완료 화면 표시

**TC-10: 백그라운드 중 취소**
- **Given**: 타이머 실행 중, 앱 백그라운드 상태
- **When**: 앱을 다시 포어그라운드로 가져옴
- **And**: "취소" 버튼 클릭
- **Then**: 타이머 중단 및 알림 예약 취소

### 9.4 히스토리

**TC-11: 히스토리 표시**
- **Given**: Day 1, Day 2 훈련을 완료함
- **When**: 히스토리 탭 진입
- **Then**: 완료한 2개의 세션이 최신순으로 표시됨

**TC-12: 빈 히스토리**
- **Given**: 완료한 훈련이 없음
- **When**: 히스토리 탭 진입
- **Then**: "아직 완료한 훈련이 없습니다." 메시지 표시

---

## 10. 검증 기준

### 10.1 데이터 모델

- [ ] Zod 스키마 검증이 정상 동작
- [ ] FrenzelDay, FrenzelSession 타입이 올바르게 추론됨
- [ ] FRENZEL_TRAINING_SCHEDULE에 10개 Day 데이터 정의됨

### 10.2 화면 구현

- [ ] Equalizing 메인 화면:
  - [ ] 3개 아코디언(개요/원리/비교) 정상 표시
  - [ ] 10일 리스트가 스크롤 가능하게 표시됨
  - [ ] Day 클릭 시 상세 화면으로 이동
- [ ] Day 상세/타이머 화면:
  - [ ] 목표, 단계, 성공 감각 정상 표시
  - [ ] "훈련 시작" 버튼으로 타이머 시작
  - [ ] 타이머 카운트다운 정상 동작
  - [ ] 일시정지/재개 기능 동작
  - [ ] 완료 시 히스토리 저장
  - [ ] 취소 시 기록 미저장
- [ ] 히스토리 화면:
  - [ ] 완료한 세션 리스트 표시
  - [ ] 빈 상태 메시지 표시

### 10.3 React Native Reusables UI 컴포넌트

- [ ] Accordion 컴포넌트 설치 및 동작 확인
- [ ] Card 컴포넌트 설치 및 동작 확인
- [ ] Button 컴포넌트 설치 및 동작 확인
- [ ] Badge 컴포넌트 설치 및 동작 확인
- [ ] Progress 컴포넌트 설치 및 동작 확인 (선택적)
- [ ] Separator 컴포넌트 설치 및 동작 확인 (선택적)
- [ ] 모든 컴포넌트가 NativeWind 스타일링과 호환됨
- [ ] 다크 모드 지원 확인

### 10.4 타이머 기능

- [ ] 백그라운드에서 타이머 계속 실행
- [ ] 백그라운드 완료 시 로컬 알림 발송
- [ ] 알림 클릭 시 앱 재실행 및 완료 화면 표시
- [ ] 타이머 취소 시 알림 예약 취소

### 10.5 i18n

- [ ] 모든 UI 텍스트가 i18n 키로 관리됨
- [ ] 한국어(ko) 번역 완료
- [ ] 영어(en) 번역 완료
- [ ] 언어 변경 시 즉시 반영

### 10.6 코드 품질

- [ ] TypeScript 컴파일 오류 없음
- [ ] ESLint 오류 없음
- [ ] 모든 컴포넌트가 React Compiler와 호환 (수동 메모이제이션 미사용)

---

## 11. 개발 워크플로우

### 11.1 1단계: 엔티티 생성

```bash
# 디렉토리 생성
mkdir -p src/entities/frenzel-training

# 파일 생성
touch src/entities/frenzel-training/model.ts
touch src/entities/frenzel-training/types.ts
touch src/entities/frenzel-training/constants.ts
touch src/entities/frenzel-training/index.ts
```

1. `model.ts`에 Zod 스키마 정의
2. `types.ts`에 TypeScript 타입 추론
3. `constants.ts`에 10일 프로그램 데이터 정의 (i18n 키 사용)
4. `index.ts`에서 공개 API export

### 11.2 2단계: React Native Reusables UI 컴포넌트 설치

```bash
# React Native Reusables CLI로 필수 컴포넌트 설치
npx @react-native-reusables/cli@latest add accordion
npx @react-native-reusables/cli@latest add card
npx @react-native-reusables/cli@latest add button
npx @react-native-reusables/cli@latest add badge
npx @react-native-reusables/cli@latest add progress
npx @react-native-reusables/cli@latest add separator
```

**설치 후 확인**:
- [ ] `src/shared/ui/accordion.tsx` 생성됨
- [ ] `src/shared/ui/card.tsx` 생성됨
- [ ] `src/shared/ui/button.tsx` 생성됨
- [ ] `src/shared/ui/badge.tsx` 생성됨
- [ ] `src/shared/ui/progress.tsx` 생성됨
- [ ] `src/shared/ui/separator.tsx` 생성됨

### 11.3 3단계: i18n 번역 추가

```bash
# what-is-frenzel.md 내용을 ko.json/en.json에 추가
```

1. `src/shared/locales/ko.json` 업데이트
2. `src/shared/locales/en.json` 업데이트
3. 번역 키 구조 일관성 확인

### 11.4 4단계: 피처 모듈 생성

```bash
# 디렉토리 생성
mkdir -p src/features/frenzel-trainer/ui
mkdir -p src/features/frenzel-trainer/lib

# UI 컴포넌트
touch src/features/frenzel-trainer/ui/EducationAccordion.tsx
touch src/features/frenzel-trainer/ui/DayList.tsx
touch src/features/frenzel-trainer/ui/DayDetailCard.tsx
touch src/features/frenzel-trainer/ui/TrainingTimer.tsx

# 비즈니스 로직
touch src/features/frenzel-trainer/lib/useTimer.ts
touch src/features/frenzel-trainer/lib/useTrainingHistory.ts
touch src/features/frenzel-trainer/lib/notifications.ts

# Export
touch src/features/frenzel-trainer/index.ts
```

### 11.5 5단계: 화면 구현

```bash
# 라우트 생성
mkdir -p app/training
touch app/training/[id].tsx
```

1. `app/(tabs)/equalizing.tsx` 업데이트
2. `app/training/[id].tsx` 생성
3. `app/(tabs)/history.tsx` 업데이트

### 11.6 6단계: 타이머 및 알림 설정

```bash
# 패키지 설치
npx expo install expo-background-fetch expo-task-manager
npx expo install expo-notifications
```

1. `app.json`에 백그라운드 모드 권한 추가
2. 알림 권한 요청 로직 구현
3. 백그라운드 타이머 태스크 등록

### 11.7 7단계: 테스트

```bash
# 개발 서버 시작
npx expo start

# TypeScript 체크
npx tsc --noEmit

# ESLint 체크
npm run lint
```

---

## 12. 비기능 요구사항

### 12.1 성능

- 타이머 정확도: ±1초 이내
- 화면 전환 딜레이: < 300ms
- 백그라운드 타이머 오차: ±5초 이내

### 12.2 접근성

- 모든 버튼에 접근 가능한 레이블
- 타이머 숫자는 큰 폰트 (48px 이상)
- 색상 대비 WCAG AA 준수

### 12.3 호환성

- iOS 13+ 지원
- Android 5.0+ 지원
- Expo Go 환경에서 테스트

### 12.4 보안

- 사용자 데이터는 로컬에만 저장 (인메모리, 향후 AsyncStorage)
- 외부 네트워크 요청 없음

---

## 13. 제외 사항 (다음 PRD에서 구현)

- **PRD-03**: Zustand 전역 스토어 및 AsyncStorage 영속성
- **PRD-04**: CO2 테이블 훈련 기능
- **PRD-05**: 고급 히스토리 분석 (진행률, 통계, 차트)
- **PRD-06**: 음성 안내 (TTS) 및 진동 피드백
- **PRD-07**: 테스트 코드 (Jest + React Native Testing Library)
- **PRD-08**: 프로덕션 빌드 및 배포

---

## 14. 다음 단계

PRD-02 구현 완료 후:

1. **검증 기준 체크리스트 완료**: 모든 항목 통과 확인
2. **테스트 시나리오 실행**: TC-01 ~ TC-12 전체 테스트
3. **스크린샷 캡처**:
   - Equalizing 메인 화면 (아코디언 펼침/접힘)
   - Day 상세 화면
   - 타이머 실행 화면
   - 히스토리 화면
4. **Git 커밋**:
   ```bash
   git add .
   git commit -m "feat: implement Frenzel equalizing training with 10-day program (PRD-02)"
   ```
5. **PRD-03 작성**: Zustand 스토어 및 영속성 추가

---

## 15. 참고사항

### 15.1 CLAUDE.md 준수

이 PRD는 CLAUDE.md의 다음 원칙을 따릅니다:

- Feature-Sliced Design: entities → features → app 계층 구조
- React Compiler 사용 (수동 useMemo/useCallback 금지)
- TypeScript strict mode
- Zod 스키마 우선 검증
- i18n 다국어 지원
- NativeWind 스타일링

### 15.2 what-is-frenzel.md 통합

- 모든 교육 콘텐츠를 i18n 키로 변환하여 앱 내 통합
- 10일 훈련 프로그램 데이터를 constants로 정의
- 마크다운 콘텐츠를 React Native에서 표시 가능하도록 변환

### 15.3 CLAUDE.md 업데이트

- "7일 훈련 스케줄" → "10일 훈련 스케줄"로 수정 완료 ✅

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|-----|------|---------|--------|
| 1.0 | 2025-10-31 | 초안 작성 | Claude |
| 1.1 | 2025-10-31 | React Native Reusables UI 컴포넌트를 제외 사항에서 포함 사항으로 변경<br>- Accordion, Card, Button, Badge, Progress, Separator 추가<br>- 기술 스택 섹션 업데이트<br>- 화면 명세에 UI 컴포넌트 사용 예시 추가<br>- 개발 워크플로우에 UI 컴포넌트 설치 단계 추가<br>- 검증 기준에 UI 컴포넌트 체크리스트 추가<br>- 제외 사항 PRD 번호 재정렬 | Claude |
