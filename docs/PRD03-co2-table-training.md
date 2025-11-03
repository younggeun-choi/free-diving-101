# PRD-03: CO2 테이블 훈련 기능

## 문서 정보

- **문서 번호**: PRD-03
- **버전**: 1.0
- **작성일**: 2025-11-03
- **목적**: CO2 테이블 숨 참기 훈련 기능 구현

---

## 1. 프로젝트 개요

**Free Diving 101** 앱의 두 번째 핵심 기능인 **CO2 테이블 훈련**을 구현합니다. CO2 테이블은 이산화탄소(CO2) 내성을 향상시키기 위한 숨 참기 훈련 프로그램으로, 호흡 시간(Breathe)은 점진적으로 줄어들고 숨 참기 시간(Hold)은 일정하게 유지하는 방식입니다.

### 핵심 목표

- CO2 테이블 타이머 기능 제공 (8 라운드)
- Hold time 커스터마이징 (±10초 조절)
- Breathe와 Hold 진행률 시각화 (Progress 바)
- TTS 음성 안내 (타이밍 알림)
- 백그라운드 타이머 실행 및 로컬 알림
- 훈련 완료 기록 저장 및 히스토리 추적
- 다국어 지원 (한국어, 영어)

### 사용자 스토리

**AS** 초보 프리다이버
**I WANT** CO2 테이블 훈련을 통해 이산화탄소 내성을 키우고
**SO THAT** 더 오래 숨을 참을 수 있는 능력을 향상시킨다

**주요 시나리오**:

1. **CO2 테이블 확인**: 사용자는 8 라운드의 Breathe/Hold 시간을 확인한다
2. **Hold time 조절**: 사용자는 자신의 수준에 맞게 Hold time을 ±10초 단위로 조절한다 (최소 0:40 ~ 최대 4:00)
3. **훈련 실행**: 사용자는 훈련을 시작하여 Round 1부터 순차적으로 진행한다
4. **음성 안내**: TTS가 "Breathe", "Hold", 시간 카운트를 안내한다
5. **일시정지/재개**: 필요 시 훈련을 일시정지하고 재개할 수 있다
6. **훈련 완료**: Round 8까지 완료하면 세션 기록이 저장되고 히스토리에 표시된다

---

## 2. 구현 범위

### 2.1 포함 사항

#### 2.1.1 CO2 테이블 구성

CO2 테이블은 8 라운드로 구성되며, 다음과 같은 기본 설정을 가집니다:

| Round | Breathe | Hold |
|-------|---------|------|
| 1 | 2:00 | 1:30 |
| 2 | 1:45 | 1:30 |
| 3 | 1:30 | 1:30 |
| 4 | 1:15 | 1:30 |
| 5 | 1:00 | 1:30 |
| 6 | 0:45 | 1:30 |
| 7 | 0:30 | 1:30 |
| 8 | 0:15 | 1:30 |

**특징**:
- **Breathe 시간**: 2:00에서 시작하여 라운드마다 15초씩 감소 (고정, 수정 불가)
- **Hold 시간**: 기본 1:30, 사용자가 ±10초 단위로 조절 가능 (최소 0:40, 최대 4:00)
- **총 훈련 시간**: 모든 라운드의 Breathe + Hold 시간 합계 (Hold time에 따라 변동)

#### 2.1.2 Hold Time 커스터마이징

- **기본값**: 1분 30초 (1:30)
- **조절 방법**: +/- 버튼으로 10초 단위 증감
- **범위**: 최소 0:40 ~ 최대 4:00
- **조절 가능 시점**: 훈련 시작 전 (초기화 상태)에만 가능
- **조절 불가 시점**: 훈련 시작 후 (실행 중, 일시정지 상태 포함)

#### 2.1.3 화면 구성 (통합 화면)

**app/(tabs)/co2-table.tsx** 하나의 화면에서 모든 기능 제공:

**초기 상태 (훈련 시작 전):**

1. **타이머 표시 섹션**:
   - 큰 타이머: Round 1 Breathe 시간 표시 (예: "2:00")
   - 작은 텍스트: "Breathe" / "Hold" 상태 표시

2. **Progress 섹션**:
   - Breathe Progress 바 (초기 상태: 100%)
   - Hold Progress 바 (초기 상태: 100%)

3. **훈련 시작 버튼**:
   - 큰 버튼: "훈련 시작"

4. **Hold Time 조절 섹션**:
   - 현재 Hold time 표시 (예: "1:30")
   - [-10초] [+10초] 버튼
   - 최소/최대 도달 시 해당 버튼 비활성화

5. **CO2 테이블 표시 섹션**:
   - 총 훈련 시간 표시 (예: "Total: 20:00")
   - 8 라운드 리스트:
     - Round 번호, Breathe 시간, Hold 시간
     - Hold time 변경에 따라 실시간 업데이트

**훈련 실행 중:**
1. **Hold Time 조절 섹션**: 비활성화 (숨김 또는 disabled)
2. **타이머 표시 섹션**:
   - 큰 타이머: 현재 시간 카운트다운 (예: "1:32")
   - 현재 Round 및 상태 표시 (예: "Round 3 - Hold")
3. **Progress 섹션**:
   - 활성 Progress 바가 실시간으로 감소 (Breathe 또는 Hold)
4. **컨트롤 버튼**:
   - [일시정지] [완료] [종료] 버튼
   - "훈련 시작" 버튼은 숨김

**일시정지 상태:**
1. **타이머**: 멈춘 시간 표시 + "(일시정지)" 텍스트
2. **Progress 바**: 멈춘 상태
3. **컨트롤 버튼**:
   - [재개] [완료] [종료] 버튼

#### 2.1.4 훈련 로직

**훈련 시작:**
1. "훈련 시작" 버튼 클릭
2. Round 1 Breathe 타이머 시작 (예: 2:00)
3. Breathe Progress 바 100%에서 0%로 감소
4. TTS: "Breathe" 발화

**Breathe → Hold 전이:**
1. Breathe 타이머가 0:00 도달
2. 자동으로 Hold 타이머로 전환 (예: 1:30)
3. Hold Progress 바 100%에서 0%로 감소
4. TTS: "Hold" 발화

**Hold → 다음 Round 전이:**
1. Hold 타이머가 0:00 도달
2. 다음 Round의 Breathe 타이머로 전환 (예: Round 2 Breathe 1:45)
3. Breathe Progress 바 초기화 (100%)
4. TTS: "Breathe" 발화

**훈련 완료:**
1. Round 8 Hold 타이머가 0:00 도달
2. TTS: "Training completed" 발화
3. CO2TableSession 생성 및 저장
4. 완료 메시지 표시 또는 히스토리 화면으로 이동

**일시정지/재개:**
- 일시정지: 타이머 멈춤, Progress 바 멈춤, TTS 중단
- 재개: 멈춘 시점부터 계속, TTS 재개

**훈련 종료:**
- "종료" 버튼 클릭 시 확인 다이얼로그 표시
- "예" 선택 시 훈련 중단, 세션 기록 저장하지 않음
- 초기 상태로 복귀

#### 2.1.5 TTS 음성 안내

**expo-speech**를 사용하여 다음 타이밍에 음성 발화:

| 타이밍 | 발화 내용 | 비고 |
|--------|----------|------|
| Breathe 시작 | "Breathe" | 각 Round Breathe 시작 시 |
| Hold 시작 | "Hold" | 각 Round Hold 시작 시 |
| 분 단위 변경 | "Three minutes", "Two minutes", "One minute" | 3:00, 2:00, 1:00 시 |
| 30초 | "Thirty seconds" | 0:30 시 |
| 10초 | "Ten seconds" | 0:10 시 |
| 5~1초 | "Five", "Four", "Three", "Two", "One" | 각 초마다 |
| 훈련 완료 | "Training completed" | Round 8 Hold 종료 시 |

**주의사항**:
- 일시정지 시 TTS 중단
- 재개 시 현재 시간에 맞는 TTS부터 계속

#### 2.1.6 백그라운드 실행

- 훈련 실행 중 앱이 백그라운드로 이동해도 타이머 계속 실행
- 백그라운드에서도 TTS 계속 발화 (플랫폼 제약 있을 수 있음)
- 훈련 완료 시 로컬 알림 발송 ("CO2 테이블 훈련 완료!")
- 알림 클릭 시 앱 재실행 및 완료 화면 표시

#### 2.1.7 데이터 모델 (Zod 스키마)

- **CO2TableConfig**: Hold time 설정
- **CO2TableRound**: 각 라운드 정보 (Breathe, Hold 시간)
- **CO2TableSession**: 훈련 세션 기록 (시작/종료 시간, 완료 여부, Hold time 설정)
- **CO2_TABLE_BREATHE_TIMES**: 8개 라운드의 Breathe 시간 (constants, 고정값)

#### 2.1.8 i18n 번역

- 화면 UI 텍스트 다국어 지원 (한국어, 영어)
- TTS 발화 내용 다국어 지원 (언어에 따라 "Breathe" 또는 "숨 쉬기" 등)

#### 2.1.9 React Native Reusables UI 컴포넌트

| 컴포넌트 | 용도 | 필수 여부 |
|---------|------|----------|
| **Button** | Hold time 조절, 훈련 시작/일시정지/재개/완료/종료 버튼 | ✅ 필수 |
| **Card** | CO2 테이블 라운드 리스트 아이템 | ✅ 필수 |
| **Badge** | Round 번호 표시 | ✅ 필수 |
| **Progress** | Breathe/Hold 진행률 표시 | ✅ 필수 |
| **Separator** | 섹션 구분선 | ⭕ 선택 |
| **AlertDialog** | 훈련 종료 확인 다이얼로그 | ✅ 필수 |

**설치 방법**:
```bash
# AlertDialog 추가 설치 (나머지는 PRD02에서 설치 완료)
npx @react-native-reusables/cli@latest add alert-dialog
```

### 2.2 제외 사항

다음 요소들은 **구현하지 않습니다** (다음 PRD에서 구현):

- ❌ 커스텀 CO2 테이블 생성 (Breathe 시간 변경, 라운드 수 변경 등)
- ❌ O2 테이블 훈련 (산소 테이블)
- ❌ 고급 히스토리 분석 (CO2 테이블 진행률 차트, 통계)
- ❌ 진동 피드백 (haptics)
- ❌ 테스트 코드 (PRD-08에서 추가)

---

## 3. 기술 스택

CLAUDE.md에 정의된 기술 스택을 기반으로 다음 패키지를 추가합니다:

| 카테고리 | 기술 | 버전 | 용도 |
|---------|------|------|------|
| **TTS** | expo-speech | ~14.0.0 | 음성 안내 |
| **타이머** | expo-background-fetch, expo-task-manager | 기존 사용 | 백그라운드 타이머 |
| **로컬 알림** | expo-notifications | 기존 사용 | 백그라운드 알림 |
| **UI 컴포넌트** | React Native Reusables | latest | Button, Card, Badge, Progress, AlertDialog |
| **상태 관리** | React useState/useReducer | - | 로컬 상태 관리 (Zustand는 PRD-04) |
| **검증** | Zod | 기존 사용 | 데이터 스키마 검증 |
| **i18n** | react-i18next | 기존 사용 | 다국어 지원 |

### 3.1 신규 패키지 설치

```bash
# TTS (음성 안내)
npx expo install expo-speech

# UI 컴포넌트 (AlertDialog 추가)
npx @react-native-reusables/cli@latest add alert-dialog
```

**주의**: expo-background-fetch, expo-task-manager, expo-notifications는 PRD-02에서 이미 설치됨

---

## 4. 디렉토리 구조

PRD-03 구현 후 추가되는 디렉토리 및 파일:

```
free-diving-101/
├── app/
│   ├── (tabs)/
│   │   ├── co2-table.tsx         # CO2 테이블 훈련 화면 (새로 구현)
│   │   └── ...
│
├── src/
│   ├── entities/
│   │   ├── frenzel-training/     # PRD-02에서 생성
│   │   └── co2-table/            # 새로 생성
│   │       ├── model.ts          # Zod 스키마
│   │       ├── types.ts          # TypeScript 타입
│   │       ├── constants.ts      # Breathe 시간 고정값
│   │       └── index.ts          # 공개 exports
│   │
│   ├── features/
│   │   ├── frenzel-trainer/      # PRD-02에서 생성
│   │   └── co2-table-trainer/    # 새로 생성
│   │       ├── ui/
│   │       │   ├── HoldTimeControl.tsx    # Hold time 조절 UI
│   │       │   ├── TimerDisplay.tsx       # 타이머 표시
│   │       │   ├── ProgressSection.tsx    # Breathe/Hold Progress 바
│   │       │   ├── CO2TableList.tsx       # 8 라운드 리스트
│   │       │   └── TrainingControls.tsx   # 시작/일시정지/재개/완료/종료 버튼
│   │       ├── lib/
│   │       │   ├── useCO2TableTimer.ts    # CO2 테이블 타이머 훅
│   │       │   ├── useCO2TableHistory.ts  # 히스토리 관리 훅
│   │       │   ├── tts.ts                 # TTS 유틸리티
│   │       │   └── notifications.ts       # 알림 유틸리티 (재사용)
│   │       └── index.ts
│   │
│   └── shared/
│       ├── ui/
│       │   ├── alert-dialog.tsx  # 새로 추가
│       │   └── ...
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
│   ├── PRD02-frenzel-training.md
│   ├── PRD03-co2-table-training.md  # 이 문서
│   └── what-is-frenzel.md
│
└── ...
```

---

## 5. 데이터 모델

### 5.1 Zod 스키마

#### 5.1.1 `src/entities/co2-table/model.ts`

```typescript
import { z } from 'zod';

/**
 * CO2 테이블 Hold time 설정 스키마
 */
export const CO2TableConfigSchema = z.object({
  holdTimeSeconds: z.number().int().min(40).max(240), // 0:40 ~ 4:00
});

/**
 * CO2 테이블 라운드 스키마
 */
export const CO2TableRoundSchema = z.object({
  roundNumber: z.number().int().min(1).max(8),
  breatheSeconds: z.number().int().positive(),
  holdSeconds: z.number().int().positive(),
});

/**
 * CO2 테이블 세션 스키마
 */
export const CO2TableSessionSchema = z.object({
  id: z.string().uuid(),
  startTime: z.date(),
  endTime: z.date().nullable(),
  completed: z.boolean(),
  holdTimeSeconds: z.number().int().min(40).max(240), // 훈련 시작 시 설정된 Hold time
  notes: z.string().optional(),
});
```

#### 5.1.2 `src/entities/co2-table/types.ts`

```typescript
import { z } from 'zod';
import {
  CO2TableConfigSchema,
  CO2TableRoundSchema,
  CO2TableSessionSchema,
} from './model';

export type CO2TableConfig = z.infer<typeof CO2TableConfigSchema>;
export type CO2TableRound = z.infer<typeof CO2TableRoundSchema>;
export type CO2TableSession = z.infer<typeof CO2TableSessionSchema>;
```

#### 5.1.3 `src/entities/co2-table/constants.ts`

```typescript
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
  90,  // Round 3: 1:30
  75,  // Round 4: 1:15
  60,  // Round 5: 1:00
  45,  // Round 6: 0:45
  30,  // Round 7: 0:30
  15,  // Round 8: 0:15
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
```

#### 5.1.4 `src/entities/co2-table/index.ts`

```typescript
export * from './model';
export * from './types';
export * from './constants';
```

---

## 6. 화면 명세

### 6.1 CO2 테이블 훈련 화면 (`app/(tabs)/co2-table.tsx`)

통합 화면으로, 모든 기능을 하나의 화면에서 제공합니다.

#### 6.1.1 레이아웃 구조

**초기 상태 (훈련 시작 전):**

```
┌─────────────────────────────────┐
│ CO2 테이블 훈련                  │ (헤더)
├─────────────────────────────────┤
│                                  │
│           2:00                   │ (큰 타이머)
│          Breathe                 │ (상태)
│                                  │
├─────────────────────────────────┤
│ Breathe Progress                 │
│ [████████████████████] 100%      │
│ Hold Progress                    │
│ [████████████████████] 100%      │
├─────────────────────────────────┤
│ [     훈련 시작     ]            │ (큰 버튼)
├─────────────────────────────────┤
│ 총 훈련 시간: 20:00              │
├─────────────────────────────────┤
│ Hold Time 설정                   │
│ [-10초]  1:30  [+10초]          │ (Hold time 조절)
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ Round 1                     │ │
│ │ Breathe: 2:00 | Hold: 1:30  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Round 2                     │ │
│ │ Breathe: 1:45 | Hold: 1:30  │ │
│ └─────────────────────────────┘ │
│ ...                              │
│ ┌─────────────────────────────┐ │
│ │ Round 8                     │ │
│ │ Breathe: 0:15 | Hold: 1:30  │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

**훈련 실행 중:**

```
┌─────────────────────────────────┐
│ CO2 테이블 훈련                  │
├─────────────────────────────────┤
│ Round 3 - Hold                   │ (현재 상태)
├─────────────────────────────────┤
│                                  │
│           1:12                   │ (타이머)
│           Hold                   │
│                                  │
├─────────────────────────────────┤
│ Breathe Progress                 │
│ [░░░░░░░░░░░░░░░░░░░░] 0%        │
│ Hold Progress                    │
│ [██████████░░░░░░░░░░] 60%       │
├─────────────────────────────────┤
│ [일시정지]  [완료]  [종료]      │ (버튼)
├─────────────────────────────────┤
│ (CO2 테이블 리스트는 하단에)    │
└─────────────────────────────────┘
```

**일시정지 상태:**

```
┌─────────────────────────────────┐
│ CO2 테이블 훈련                  │
├─────────────────────────────────┤
│ Round 3 - Hold                   │
├─────────────────────────────────┤
│                                  │
│           0:47                   │
│           Hold                   │
│        (일시정지)                │
│                                  │
├─────────────────────────────────┤
│ Breathe Progress                 │
│ [░░░░░░░░░░░░░░░░░░░░] 0%        │
│ Hold Progress                    │
│ [████░░░░░░░░░░░░░░░░] 30%       │
├─────────────────────────────────┤
│ [ 재개 ]     [완료]  [종료]     │
└─────────────────────────────────┘
```

#### 6.1.2 주요 컴포넌트

1. **HoldTimeControl**: Hold time 조절 UI
   - **사용 컴포넌트**: `@/shared/ui/button` (React Native Reusables)
   - [-10초] 버튼, 현재 시간 표시, [+10초] 버튼
   - 최소/최대 도달 시 버튼 비활성화
   - 훈련 시작 후 전체 섹션 숨김 또는 비활성화

   **사용 예시**:
   ```tsx
   import { Button } from '@/shared/ui/button';
   import { Text } from '@/shared/ui/text';

   <View className="flex-row items-center justify-center gap-4 p-4">
     <Button
       variant="outline"
       onPress={decreaseHoldTime}
       disabled={holdTime <= MIN_HOLD_TIME_SECONDS || isTraining}
     >
       <Text>-10초</Text>
     </Button>
     <Text className="text-2xl font-bold">{formatTime(holdTime)}</Text>
     <Button
       variant="outline"
       onPress={increaseHoldTime}
       disabled={holdTime >= MAX_HOLD_TIME_SECONDS || isTraining}
     >
       <Text>+10초</Text>
     </Button>
   </View>
   ```

2. **TimerDisplay**: 타이머 표시
   - 큰 폰트로 시간 표시 (예: "1:32")
   - 현재 Round 및 상태 표시 (예: "Round 3 - Hold")
   - 일시정지 시 "(일시정지)" 텍스트 추가

3. **ProgressSection**: Breathe/Hold Progress 바
   - **사용 컴포넌트**: `@/shared/ui/progress` (React Native Reusables)
   - Breathe Progress 바
   - Hold Progress 바
   - 실시간으로 진행률 업데이트

   **사용 예시**:
   ```tsx
   import { Progress } from '@/shared/ui/progress';
   import { Text } from '@/shared/ui/text';

   <View className="gap-4 p-4">
     <View>
       <Text className="mb-2">Breathe Progress</Text>
       <Progress value={breatheProgress} />
     </View>
     <View>
       <Text className="mb-2">Hold Progress</Text>
       <Progress value={holdProgress} />
     </View>
   </View>
   ```

4. **CO2TableList**: 8 라운드 리스트
   - **사용 컴포넌트**: `@/shared/ui/card`, `@/shared/ui/badge` (React Native Reusables)
   - FlatList로 구현
   - 각 아이템: Round 번호, Breathe 시간, Hold 시간
   - Hold time 변경 시 리스트 실시간 업데이트
   - 총 훈련 시간 표시

   **사용 예시**:
   ```tsx
   import { Card, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
   import { Badge } from '@/shared/ui/badge';

   <Card>
     <CardHeader>
       <View className="flex-row items-center gap-2">
         <Badge variant="default">Round {round.roundNumber}</Badge>
         <CardTitle>Breathe: {formatTime(round.breatheSeconds)}</CardTitle>
       </View>
       <CardDescription>
         Hold: {formatTime(round.holdSeconds)}
       </CardDescription>
     </CardHeader>
   </Card>
   ```

5. **TrainingControls**: 훈련 컨트롤 버튼
   - **사용 컴포넌트**: `@/shared/ui/button`, `@/shared/ui/alert-dialog` (React Native Reusables)
   - 훈련 시작 버튼 (초기 상태)
   - 일시정지/재개/완료/종료 버튼 (훈련 중)
   - 종료 시 AlertDialog 표시

   **사용 예시**:
   ```tsx
   import { Button } from '@/shared/ui/button';
   import {
     AlertDialog,
     AlertDialogAction,
     AlertDialogCancel,
     AlertDialogContent,
     AlertDialogDescription,
     AlertDialogFooter,
     AlertDialogHeader,
     AlertDialogTitle,
   } from '@/shared/ui/alert-dialog';

   {!isTraining && (
     <Button onPress={startTraining} size="lg">
       <Text>훈련 시작</Text>
     </Button>
   )}

   {isTraining && (
     <View className="flex-row gap-2">
       <Button onPress={isPaused ? resume : pause}>
         <Text>{isPaused ? '재개' : '일시정지'}</Text>
       </Button>
       <Button onPress={complete} variant="secondary">
         <Text>완료</Text>
       </Button>
       <Button onPress={() => setShowCancelDialog(true)} variant="destructive">
         <Text>종료</Text>
       </Button>
     </View>
   )}

   <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
     <AlertDialogContent>
       <AlertDialogHeader>
         <AlertDialogTitle>훈련을 종료하시겠습니까?</AlertDialogTitle>
         <AlertDialogDescription>
           진행 중인 훈련이 저장되지 않습니다.
         </AlertDialogDescription>
       </AlertDialogHeader>
       <AlertDialogFooter>
         <AlertDialogCancel>
           <Text>취소</Text>
         </AlertDialogCancel>
         <AlertDialogAction onPress={confirmCancel}>
           <Text>예, 종료</Text>
         </AlertDialogAction>
       </AlertDialogFooter>
     </AlertDialogContent>
   </AlertDialog>
   ```

---

## 7. i18n 번역

### 7.1 번역 키 구조

CO2 테이블 훈련 관련 모든 텍스트를 i18n 키로 관리:

```json
{
  "co2Table": {
    "title": "CO2 테이블 훈련",
    "holdTime": {
      "label": "Hold Time 설정",
      "decrease": "-10초",
      "increase": "+10초",
      "min": "최소 시간에 도달했습니다",
      "max": "최대 시간에 도달했습니다"
    },
    "timer": {
      "breathe": "Breathe",
      "hold": "Hold",
      "paused": "(일시정지)",
      "round": "Round {{number}}"
    },
    "controls": {
      "start": "훈련 시작",
      "pause": "일시정지",
      "resume": "재개",
      "complete": "완료",
      "cancel": "종료"
    },
    "cancelDialog": {
      "title": "훈련을 종료하시겠습니까?",
      "description": "진행 중인 훈련이 저장되지 않습니다.",
      "confirm": "예, 종료",
      "cancel": "취소"
    },
    "table": {
      "totalTime": "총 훈련 시간: {{time}}",
      "round": "Round {{number}}",
      "breathe": "Breathe: {{time}}",
      "hold": "Hold: {{time}}"
    },
    "completed": {
      "title": "훈련 완료!",
      "message": "CO2 테이블 훈련을 완료했습니다."
    }
  },
  "tts": {
    "breathe": "Breathe",
    "hold": "Hold",
    "minutes": {
      "three": "Three minutes",
      "two": "Two minutes",
      "one": "One minute"
    },
    "seconds": {
      "thirty": "Thirty seconds",
      "ten": "Ten seconds",
      "five": "Five",
      "four": "Four",
      "three": "Three",
      "two": "Two",
      "one": "One"
    },
    "completed": "Training completed"
  }
}
```

### 7.2 영어 번역 (en.json)

```json
{
  "co2Table": {
    "title": "CO2 Table Training",
    "holdTime": {
      "label": "Hold Time Setting",
      "decrease": "-10s",
      "increase": "+10s",
      "min": "Minimum time reached",
      "max": "Maximum time reached"
    },
    "timer": {
      "breathe": "Breathe",
      "hold": "Hold",
      "paused": "(Paused)",
      "round": "Round {{number}}"
    },
    "controls": {
      "start": "Start Training",
      "pause": "Pause",
      "resume": "Resume",
      "complete": "Complete",
      "cancel": "Cancel"
    },
    "cancelDialog": {
      "title": "Cancel Training?",
      "description": "Progress will not be saved.",
      "confirm": "Yes, Cancel",
      "cancel": "No"
    },
    "table": {
      "totalTime": "Total Time: {{time}}",
      "round": "Round {{number}}",
      "breathe": "Breathe: {{time}}",
      "hold": "Hold: {{time}}"
    },
    "completed": {
      "title": "Training Completed!",
      "message": "You have completed the CO2 table training."
    }
  },
  "tts": {
    "breathe": "Breathe",
    "hold": "Hold",
    "minutes": {
      "three": "Three minutes",
      "two": "Two minutes",
      "one": "One minute"
    },
    "seconds": {
      "thirty": "Thirty seconds",
      "ten": "Ten seconds",
      "five": "Five",
      "four": "Four",
      "three": "Three",
      "two": "Two",
      "one": "One"
    },
    "completed": "Training completed"
  }
}
```

---

## 8. 타이머 및 TTS 기능 명세

### 8.1 CO2 테이블 타이머 훅 (`src/features/co2-table-trainer/lib/useCO2TableTimer.ts`)

```typescript
interface UseCO2TableTimerOptions {
  holdTimeSeconds: number;
  onComplete: () => void;
  onCancel: () => void;
}

interface UseCO2TableTimerReturn {
  currentRound: number;
  isBreathing: boolean; // true: Breathe, false: Hold
  remainingSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  breatheProgress: number; // 0 ~ 100
  holdProgress: number; // 0 ~ 100
  start: () => void;
  pause: () => void;
  resume: () => void;
  complete: () => void;
  cancel: () => void;
}

export function useCO2TableTimer(options: UseCO2TableTimerOptions): UseCO2TableTimerReturn;
```

**동작 방식**:
1. `start()`: Round 1 Breathe 시작
2. 매 1초마다 `remainingSeconds` 감소
3. Breathe 타이머 종료 → Hold 타이머로 전이
4. Hold 타이머 종료 → 다음 Round Breathe로 전이
5. Round 8 Hold 종료 → `onComplete()` 호출
6. `pause()`: 타이머 멈춤
7. `resume()`: 멈춘 시점부터 계속
8. `cancel()`: 타이머 중단, `onCancel()` 호출

### 8.2 TTS 유틸리티 (`src/features/co2-table-trainer/lib/tts.ts`)

```typescript
import * as Speech from 'expo-speech';

/**
 * TTS 발화 함수
 */
export async function speak(text: string, language: string = 'en-US'): Promise<void> {
  await Speech.speak(text, {
    language,
    pitch: 1.0,
    rate: 1.0,
  });
}

/**
 * TTS 중단
 */
export async function stopSpeech(): Promise<void> {
  await Speech.stop();
}

/**
 * TTS 가능 여부 확인
 */
export async function isSpeechAvailable(): Promise<boolean> {
  const voices = await Speech.getAvailableVoicesAsync();
  return voices.length > 0;
}

/**
 * 타이머에 맞춘 TTS 발화
 */
export function speakForTimer(
  remainingSeconds: number,
  isBreathing: boolean,
  language: string = 'en-US'
): void {
  const text = getTTSTextForTime(remainingSeconds, isBreathing, language);
  if (text) {
    speak(text, language);
  }
}

/**
 * 시간에 맞는 TTS 텍스트 반환
 */
function getTTSTextForTime(
  remainingSeconds: number,
  isBreathing: boolean,
  language: string
): string | null {
  // Breathe/Hold 시작
  if (remainingSeconds === getTotalSeconds(isBreathing)) {
    return isBreathing ? t('tts.breathe') : t('tts.hold');
  }

  // 분 단위
  if (remainingSeconds === 180) return t('tts.minutes.three');
  if (remainingSeconds === 120) return t('tts.minutes.two');
  if (remainingSeconds === 60) return t('tts.minutes.one');

  // 30초
  if (remainingSeconds === 30) return t('tts.seconds.thirty');

  // 10초
  if (remainingSeconds === 10) return t('tts.seconds.ten');

  // 5~1초
  if (remainingSeconds === 5) return t('tts.seconds.five');
  if (remainingSeconds === 4) return t('tts.seconds.four');
  if (remainingSeconds === 3) return t('tts.seconds.three');
  if (remainingSeconds === 2) return t('tts.seconds.two');
  if (remainingSeconds === 1) return t('tts.seconds.one');

  return null;
}
```

### 8.3 백그라운드 타이머

- `expo-background-fetch` + `expo-task-manager` 사용 (PRD-02와 동일)
- 앱이 백그라운드로 이동해도 타이머 계속 실행
- 백그라운드에서도 TTS 발화 (플랫폼 제약 있을 수 있음)
- 훈련 완료 시 로컬 알림 발송

### 8.4 로컬 알림 (`src/features/co2-table-trainer/lib/notifications.ts`)

```typescript
import * as Notifications from 'expo-notifications';

/**
 * CO2 테이블 훈련 완료 알림 예약
 */
export async function scheduleCO2TableCompleteNotification(
  delaySeconds: number
): Promise<string> {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: 'CO2 테이블 훈련 완료!',
      body: '훈련을 성공적으로 완료했습니다.',
      sound: true,
    },
    trigger: {
      seconds: delaySeconds,
    },
  });
}

/**
 * 알림 취소
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
```

---

## 9. 테스트 시나리오

### 9.1 Hold Time 조절

**TC-01: Hold time 증가**
- **Given**: 초기 상태, Hold time = 1:30
- **When**: [+10초] 버튼 클릭
- **Then**: Hold time이 1:40으로 증가
- **And**: CO2 테이블 리스트의 모든 Hold 시간이 1:40으로 업데이트
- **And**: 총 훈련 시간이 재계산되어 표시됨

**TC-02: Hold time 감소**
- **Given**: Hold time = 1:30
- **When**: [-10초] 버튼 클릭
- **Then**: Hold time이 1:20으로 감소

**TC-03: Hold time 최소값**
- **Given**: Hold time = 0:40 (최소값)
- **When**: [-10초] 버튼 클릭
- **Then**: Hold time이 변경되지 않음
- **And**: [-10초] 버튼이 비활성화됨

**TC-04: Hold time 최대값**
- **Given**: Hold time = 4:00 (최대값)
- **When**: [+10초] 버튼 클릭
- **Then**: Hold time이 변경되지 않음
- **And**: [+10초] 버튼이 비활성화됨

**TC-05: 훈련 중 Hold time 조절 불가**
- **Given**: 훈련 실행 중
- **When**: Hold time 조절 섹션 확인
- **Then**: [-10초], [+10초] 버튼이 비활성화되거나 숨겨짐

### 9.2 타이머 기능

**TC-06: 훈련 시작**
- **Given**: 초기 상태, Hold time = 1:30
- **When**: "훈련 시작" 버튼 클릭
- **Then**: Round 1 Breathe 타이머 시작 (2:00)
- **And**: TTS: "Breathe" 발화
- **And**: Breathe Progress 바가 100%에서 감소 시작
- **And**: 일시정지/완료/종료 버튼이 표시됨

**TC-07: Breathe → Hold 전이**
- **Given**: Round 1 Breathe 타이머 실행 중
- **When**: 타이머가 0:00 도달
- **Then**: 자동으로 Round 1 Hold 타이머로 전환 (1:30)
- **And**: TTS: "Hold" 발화
- **And**: Breathe Progress 바가 0%로 고정
- **And**: Hold Progress 바가 100%에서 감소 시작

**TC-08: Hold → 다음 Round 전이**
- **Given**: Round 1 Hold 타이머 실행 중
- **When**: 타이머가 0:00 도달
- **Then**: Round 2 Breathe 타이머로 전환 (1:45)
- **And**: TTS: "Breathe" 발화
- **And**: Hold Progress 바가 0%로 고정
- **And**: Breathe Progress 바가 100%로 초기화 후 감소 시작

**TC-09: 훈련 완료**
- **Given**: Round 8 Hold 타이머 실행 중
- **When**: 타이머가 0:00 도달
- **Then**: TTS: "Training completed" 발화
- **And**: CO2TableSession 생성 및 저장
- **And**: 완료 메시지 표시
- **And**: 히스토리 탭에 세션 기록 추가됨

**TC-10: 일시정지/재개**
- **Given**: Round 3 Hold 타이머 실행 중 (예: 0:47 남음)
- **When**: "일시정지" 버튼 클릭
- **Then**: 타이머가 멈추고 "(일시정지)" 표시
- **And**: Progress 바가 멈춤
- **And**: TTS가 중단됨
- **When**: "재개" 버튼 클릭
- **Then**: 0:47부터 타이머 계속
- **And**: Progress 바 애니메이션 재개
- **And**: TTS 재개

**TC-11: 훈련 종료**
- **Given**: 훈련 실행 중
- **When**: "종료" 버튼 클릭
- **Then**: 확인 다이얼로그 표시 ("훈련을 종료하시겠습니까?")
- **When**: "예, 종료" 선택
- **Then**: 타이머 중단
- **And**: 세션 기록이 저장되지 않음
- **And**: 초기 상태로 복귀

**TC-12: 수동 완료**
- **Given**: Round 5 Breathe 타이머 실행 중
- **When**: "완료" 버튼 클릭
- **Then**: 타이머 중단
- **And**: CO2TableSession 생성 및 저장 (completed: true, 조기 완료 표시)
- **And**: 완료 메시지 표시

### 9.3 TTS 음성 안내

**TC-13: Breathe/Hold TTS**
- **Given**: 훈련 시작
- **When**: Round 1 Breathe 시작
- **Then**: TTS: "Breathe" 발화
- **When**: Breathe 종료 후 Hold 시작
- **Then**: TTS: "Hold" 발화

**TC-14: 분 단위 TTS**
- **Given**: Round 1 Breathe 타이머 2:00에서 시작
- **When**: 타이머가 정확히 3:00 (다른 Round에서 가능)
- **Then**: TTS: "Three minutes" 발화
- **When**: 타이머가 2:00
- **Then**: TTS: "Two minutes" 발화
- **When**: 타이머가 1:00
- **Then**: TTS: "One minute" 발화

**TC-15: 30초/10초 TTS**
- **Given**: Hold 타이머 실행 중
- **When**: 타이머가 0:30
- **Then**: TTS: "Thirty seconds" 발화
- **When**: 타이머가 0:10
- **Then**: TTS: "Ten seconds" 발화

**TC-16: 5~1초 카운트다운 TTS**
- **Given**: Hold 타이머 실행 중
- **When**: 타이머가 0:05
- **Then**: TTS: "Five" 발화
- **When**: 타이머가 0:04
- **Then**: TTS: "Four" 발화
- **When**: 타이머가 0:03
- **Then**: TTS: "Three" 발화
- **When**: 타이머가 0:02
- **Then**: TTS: "Two" 발화
- **When**: 타이머가 0:01
- **Then**: TTS: "One" 발화

**TC-17: 훈련 완료 TTS**
- **Given**: Round 8 Hold 타이머 종료
- **Then**: TTS: "Training completed" 발화

**TC-18: 일시정지 시 TTS 중단**
- **Given**: 훈련 실행 중, TTS 발화 중
- **When**: "일시정지" 버튼 클릭
- **Then**: TTS가 즉시 중단됨

### 9.4 백그라운드 동작

**TC-19: 백그라운드 타이머**
- **Given**: 훈련 실행 중 (예: Round 3 Hold 1:00 남음)
- **When**: 앱을 백그라운드로 이동 (홈 버튼)
- **Then**: 타이머가 백그라운드에서 계속 실행
- **When**: 1분 후 앱을 포어그라운드로 복귀
- **Then**: Round 3 Hold가 완료되고 Round 4 Breathe가 실행 중임을 확인

**TC-20: 백그라운드 완료 알림**
- **Given**: 훈련 실행 중, 앱 백그라운드 상태
- **When**: Round 8 Hold 완료
- **Then**: 로컬 알림 발송 ("CO2 테이블 훈련 완료!")
- **When**: 알림 클릭
- **Then**: 앱이 포어그라운드로 복귀하고 완료 화면 표시

### 9.5 히스토리

**TC-21: 히스토리 저장**
- **Given**: CO2 테이블 훈련 완료 (Hold time = 1:40)
- **When**: 히스토리 탭 진입
- **Then**: 완료한 세션이 표시됨
- **And**: 세션 정보: "CO2 테이블 | Hold: 1:40 | 완료 시간 | 총 시간"

**TC-22: 조기 완료 기록**
- **Given**: Round 5에서 "완료" 버튼으로 조기 완료
- **When**: 히스토리 탭 진입
- **Then**: 세션이 "조기 완료" 표시와 함께 저장됨

---

## 10. 검증 기준

### 10.1 데이터 모델

- [ ] Zod 스키마 검증이 정상 동작
- [ ] CO2TableConfig, CO2TableRound, CO2TableSession 타입이 올바르게 추론됨
- [ ] CO2_TABLE_BREATHE_TIMES에 8개 값 정의됨

### 10.2 화면 구현

- [ ] CO2 테이블 훈련 화면:
  - [ ] Hold time 조절 섹션 정상 표시 및 동작
  - [ ] 타이머 표시 (시간, Round, 상태)
  - [ ] Breathe/Hold Progress 바 정상 동작
  - [ ] 훈련 시작/일시정지/재개/완료/종료 버튼 동작
  - [ ] CO2 테이블 리스트 표시 및 실시간 업데이트
  - [ ] 총 훈련 시간 계산 및 표시

### 10.3 React Native Reusables UI 컴포넌트

- [ ] AlertDialog 컴포넌트 설치 및 동작 확인
- [ ] 모든 컴포넌트가 NativeWind 스타일링과 호환됨
- [ ] 다크 모드 지원 확인

### 10.4 타이머 기능

- [ ] 타이머 정확도 (±1초 이내)
- [ ] Breathe → Hold 자동 전이
- [ ] Hold → 다음 Round 자동 전이
- [ ] Round 8 완료 후 세션 저장
- [ ] 일시정지/재개 기능 정상 동작
- [ ] 백그라운드에서 타이머 계속 실행
- [ ] 완료 시 로컬 알림 발송

### 10.5 TTS 음성 안내

- [ ] "Breathe" TTS 정확한 타이밍
- [ ] "Hold" TTS 정확한 타이밍
- [ ] 분 단위 TTS (3:00, 2:00, 1:00)
- [ ] 30초, 10초 TTS
- [ ] 5~1초 카운트다운 TTS
- [ ] "Training completed" TTS
- [ ] 일시정지 시 TTS 중단

### 10.6 i18n

- [ ] 모든 UI 텍스트가 i18n 키로 관리됨
- [ ] 한국어(ko) 번역 완료
- [ ] 영어(en) 번역 완료
- [ ] 언어 변경 시 즉시 반영
- [ ] TTS 발화 내용도 다국어 지원

### 10.7 코드 품질

- [ ] TypeScript 컴파일 오류 없음
- [ ] ESLint 오류 없음
- [ ] 모든 컴포넌트가 React Compiler와 호환 (수동 메모이제이션 미사용)

---

## 11. 개발 워크플로우

### 11.1 1단계: 엔티티 생성

```bash
# 디렉토리 생성
mkdir -p src/entities/co2-table

# 파일 생성
touch src/entities/co2-table/model.ts
touch src/entities/co2-table/types.ts
touch src/entities/co2-table/constants.ts
touch src/entities/co2-table/index.ts
```

1. `model.ts`에 Zod 스키마 정의
2. `types.ts`에 TypeScript 타입 추론
3. `constants.ts`에 Breathe 시간 고정값 및 상수 정의
4. `index.ts`에서 공개 API export

### 11.2 2단계: 패키지 설치

```bash
# TTS (expo-speech)
npx expo install expo-speech

# UI 컴포넌트 (AlertDialog 추가)
npx @react-native-reusables/cli@latest add alert-dialog
```

**확인**:
- [ ] `expo-speech` 설치됨
- [ ] `src/shared/ui/alert-dialog.tsx` 생성됨

### 11.3 3단계: i18n 번역 추가

```bash
# ko.json, en.json 파일 업데이트
```

1. `src/shared/locales/ko.json` 업데이트 (CO2 테이블 관련 키 추가)
2. `src/shared/locales/en.json` 업데이트
3. 번역 키 구조 일관성 확인

### 11.4 4단계: 피처 모듈 생성

```bash
# 디렉토리 생성
mkdir -p src/features/co2-table-trainer/ui
mkdir -p src/features/co2-table-trainer/lib

# UI 컴포넌트
touch src/features/co2-table-trainer/ui/HoldTimeControl.tsx
touch src/features/co2-table-trainer/ui/TimerDisplay.tsx
touch src/features/co2-table-trainer/ui/ProgressSection.tsx
touch src/features/co2-table-trainer/ui/CO2TableList.tsx
touch src/features/co2-table-trainer/ui/TrainingControls.tsx

# 비즈니스 로직
touch src/features/co2-table-trainer/lib/useCO2TableTimer.ts
touch src/features/co2-table-trainer/lib/useCO2TableHistory.ts
touch src/features/co2-table-trainer/lib/tts.ts
touch src/features/co2-table-trainer/lib/notifications.ts

# Export
touch src/features/co2-table-trainer/index.ts
```

### 11.5 5단계: 화면 구현

```bash
# app/(tabs)/co2-table.tsx 업데이트
```

1. `app/(tabs)/co2-table.tsx` 파일 열기
2. 기존 "CO2 테이블 훈련" 텍스트만 표시하던 코드 제거
3. 새로운 통합 화면 구현:
   - HoldTimeControl
   - TimerDisplay
   - ProgressSection
   - CO2TableList
   - TrainingControls
4. useCO2TableTimer 훅 통합

### 11.6 6단계: TTS 및 알림 설정

```bash
# app.json 확인 (백그라운드 모드 권한이 PRD-02에서 이미 추가됨)
```

1. 알림 권한 요청 로직 확인 (PRD-02에서 구현됨)
2. TTS 권한 요청 로직 구현 (필요 시)
3. 백그라운드 타이머 태스크 등록 확인

### 11.7 7단계: 테스트

```bash
# 개발 서버 시작
npx expo start

# TypeScript 체크
npx tsc --noEmit

# ESLint 체크
npm run lint
```

1. Hold time 조절 테스트
2. 타이머 실행 테스트
3. TTS 발화 테스트
4. 백그라운드 동작 테스트
5. 히스토리 저장 테스트

---

## 12. 비기능 요구사항

### 12.1 성능

- 타이머 정확도: ±1초 이내
- Progress 바 애니메이션: 부드러운 60fps
- 화면 전환 딜레이: < 300ms
- 백그라운드 타이머 오차: ±5초 이내

### 12.2 접근성

- 모든 버튼에 접근 가능한 레이블
- 타이머 숫자는 큰 폰트 (48px 이상)
- Progress 바는 시각적으로 명확하게 구분
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

- **PRD-04**: Zustand 전역 스토어 및 AsyncStorage 영속성
- **PRD-05**: 커스텀 CO2/O2 테이블 생성 기능
- **PRD-06**: 고급 히스토리 분석 (진행률 차트, 통계)
- **PRD-07**: 진동 피드백 (haptics)
- **PRD-08**: 테스트 코드 (Jest + React Native Testing Library)
- **PRD-09**: 프로덕션 빌드 및 배포

---

## 14. 다음 단계

PRD-03 구현 완료 후:

1. **검증 기준 체크리스트 완료**: 모든 항목 통과 확인
2. **테스트 시나리오 실행**: TC-01 ~ TC-22 전체 테스트
3. **스크린샷 캡처**:
   - CO2 테이블 초기 화면 (Hold time 조절)
   - 훈련 실행 화면 (타이머, Progress 바)
   - 일시정지 상태
   - CO2 테이블 리스트
   - 히스토리 화면 (CO2 테이블 세션)
4. **Git 커밋**:
   ```bash
   git add .
   git commit -m "feat: implement CO2 table training with TTS and background timer (PRD-03)"
   ```
5. **PRD-04 작성**: Zustand 스토어 및 영속성 추가

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
- React Native Reusables UI 컴포넌트 우선 사용

### 15.2 CO2 테이블이란?

CO2 테이블(CO2 Table)은 프리다이빙에서 사용하는 숨 참기 훈련 방법 중 하나로, **이산화탄소(CO2) 내성**을 향상시키는 것을 목표로 합니다.

**원리**:
- 호흡 시간(Breathe)을 점진적으로 줄이고, 숨 참기 시간(Hold)은 일정하게 유지
- 호흡 시간이 줄어들면 체내 CO2 농도가 점점 높아짐
- 일정한 Hold 시간 동안 높은 CO2 농도를 견디는 훈련
- CO2 내성이 향상되면 "숨을 쉬고 싶다"는 충동을 더 오래 참을 수 있음

**O2 테이블과의 차이**:
- **CO2 테이블**: Breathe 시간 감소, Hold 시간 고정 → CO2 내성 향상
- **O2 테이블**: Breathe 시간 고정, Hold 시간 증가 → 산소 효율 향상

### 15.3 TTS 구현 시 주의사항

- `expo-speech`는 플랫폼별로 제약이 있을 수 있음 (특히 백그라운드)
- iOS: 백그라운드에서 TTS 발화 가능 (오디오 세션 설정 필요)
- Android: 백그라운드에서 TTS 발화 제약이 있을 수 있음
- 일시정지 시 TTS 중단 처리 필수
- 다국어 음성 지원 확인 (언어별 음성 엔진)

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|-----|------|---------|--------|
| 1.0 | 2025-11-03 | 초안 작성 | Claude |
