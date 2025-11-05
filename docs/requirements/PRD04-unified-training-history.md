# PRD-04: 통합 훈련 히스토리

## 문서 정보

- **문서 번호**: PRD-04
- **버전**: 1.0
- **작성일**: 2025-11-05
- **최종 수정일**: 2025-11-05
- **목적**: 프렌젤 훈련과 CO₂ 테이블 훈련의 기록을 통합 관리하는 히스토리 시스템 구현

---

## 1. 프로젝트 개요

**Free Diving 101** 앱의 모든 훈련 기록을 통합하여 관리하고 표시하는 **통합 훈련 히스토리** 기능을 구현합니다. 이 기능은 프렌젤 이퀄라이징 훈련과 CO₂ 테이블 훈련의 완료 기록을 하나의 타임라인으로 표시하며, 향후 대시보드에서 활용할 수 있도록 데이터 영속성을 제공합니다.

### 핵심 목표

- 프렌젤 훈련 기록과 CO₂ 테이블 훈련 기록을 통합 표시
- 최신순으로 정렬된 타임라인 제공
- AsyncStorage를 통한 데이터 영속성 보장
- 향후 대시보드 기능 확장을 위한 데이터 구조 설계
- 간결하고 직관적인 UI (필터링/분석 기능 제외)

### 사용자 스토리

**AS** 프리다이빙 훈련생
**I WANT** 내가 완료한 모든 훈련을 한곳에서 확인하고
**SO THAT** 나의 훈련 패턴과 진행 상황을 파악할 수 있다

**주요 시나리오**:

1. **통합 히스토리 확인**: 사용자는 프렌젤 훈련과 CO₂ 테이블 훈련을 구분 없이 시간순으로 확인한다
2. **훈련 세부 정보 확인**: 각 기록 카드에서 완료 시각, 훈련 타입, 제목, 소요 시간을 확인한다
3. **데이터 영속성**: 앱을 종료하고 재시작해도 기록이 유지된다
4. **대시보드 활용**: (향후) 홈 화면에서 최근 훈련 요약 정보를 확인한다

---

## 2. 구현 범위

### 2.1 포함 사항

#### 2.1.1 통합 데이터 모델

두 가지 훈련 타입을 하나의 스키마로 관리:

**훈련 타입**:
1. **프렌젤 세션** (Frenzel Session)
   - Day 번호 (1-10)
   - 훈련명 (예: "후두 감각 익히기")

2. **CO₂ 테이블 훈련** (CO₂ Table Training)
   - HOLD 시간 설정값 (예: "2:30")

#### 2.1.2 히스토리 화면 (app/(tabs)/history.tsx)

**기본 레이아웃**:
```
┌─────────────────────────────────┐
│ 훈련 기록                        │ (헤더)
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ [CO₂] CO₂ Table: 2:30 Hold  │ │ (최신 기록)
│ │ 2025-11-05 14:30             │ │
│ │ 소요: 15분 30초              │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ [프렌젤] Day 1: 후두 감각...│ │
│ │ 2025-11-05 09:15             │ │
│ │ 소요: 10분                   │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ [CO₂] CO₂ Table: 3:00 Hold  │ │
│ │ 2025-11-04 18:20             │ │
│ │ 소요: 20분 15초              │ │
│ └─────────────────────────────┘ │
│ ...                              │
└─────────────────────────────────┘
```

**표시 정보**:
- ✅ 훈련 타입 Badge (프렌젤/CO₂)
- ✅ 훈련 제목
  - 프렌젤: "Day {number}: {훈련명}"
  - CO₂: "CO₂ Table: {HOLD시간} Hold"
- ✅ 완료 시각 (날짜 + 시각)
- ✅ 총 소요 시간 (분:초)

#### 2.1.3 데이터 영속성

**Zustand persist 미들웨어** 사용:
- AsyncStorage에 자동 저장
- 앱 재시작 시 자동 복원
- 스토어 이름: `training-history-storage`

#### 2.1.4 Unified Training Store

기존 `use-training-history.ts`를 확장:
- 프렌젤 세션과 CO₂ 세션을 모두 관리
- 타입별 필터링 헬퍼 함수 제공
- 통합 정렬 (최신순)

#### 2.1.5 React Native Reusables UI 컴포넌트

| 컴포넌트 | 용도 | 필수 여부 |
|---------|------|----------|
| **Card** | 훈련 기록 카드 | ✅ 필수 |
| **Badge** | 훈련 타입 표시 | ✅ 필수 |
| **Text** | 텍스트 표시 | ✅ 필수 |
| **ScrollView** | 리스트 스크롤 | ✅ 필수 |

### 2.2 제외 사항

다음 요소들은 **구현하지 않습니다**:

- ❌ 필터링 기능 (타입별, 날짜별)
- ❌ 검색 기능
- ❌ 통계 및 분석 (평균, 차트)
- ❌ 기록 편집/삭제 (개별)
- ❌ 기록 상세 화면
- ❌ 기록 공유 기능

---

## 3. 기술 스택

CLAUDE.md에 정의된 기술 스택을 기반으로 다음 패키지를 활용합니다:

| 카테고리 | 기술 | 버전 | 용도 |
|---------|------|------|------|
| **상태 관리** | Zustand | 5+ | 전역 상태 관리 |
| **영속성** | Zustand persist middleware | - | AsyncStorage 통합 |
| **스토리지** | @react-native-async-storage/async-storage | 2.2.0 | 로컬 데이터 저장 |
| **검증** | Zod | 3.23+ | 데이터 스키마 검증 |
| **UUID** | expo-crypto | latest | 고유 ID 생성 |
| **i18n** | react-i18next | 기존 사용 | 다국어 지원 |

### 3.1 신규 패키지 설치

기존 패키지를 활용하므로 **추가 설치 불필요**:
- `zustand`: 이미 설치됨
- `@react-native-async-storage/async-storage`: 이미 설치됨
- `expo-crypto`: 이미 설치됨

---

## 4. 데이터 모델

### 4.1 통합 훈련 세션 스키마

#### 4.1.1 `src/entities/training-record/model.ts`

```typescript
import { z } from 'zod';

/**
 * 훈련 타입 Enum
 */
export const TrainingTypeSchema = z.enum(['frenzel', 'co2-table']);

/**
 * 프렌젤 세션 메타데이터
 */
export const FrenzelSessionMetaSchema = z.object({
  dayNumber: z.number().int().min(1).max(10),
  dayTitle: z.string(), // i18n 키 또는 번역된 제목
});

/**
 * CO₂ 테이블 세션 메타데이터
 */
export const CO2TableSessionMetaSchema = z.object({
  holdTimeSeconds: z.number().positive(), // HOLD 시간 (초)
  breathTimeSeconds: z.number().positive(), // 호흡 시간 (초)
  cycles: z.number().int().positive(), // 사이클 수
});

/**
 * 통합 훈련 세션 스키마
 */
export const TrainingSessionSchema = z.object({
  id: z.string().uuid(),
  type: TrainingTypeSchema,
  startTime: z.date(),
  endTime: z.date(),
  completed: z.boolean(),

  // 타입별 메타데이터 (discriminated union)
  meta: z.discriminatedUnion('type', [
    z.object({ type: z.literal('frenzel'), data: FrenzelSessionMetaSchema }),
    z.object({ type: z.literal('co2-table'), data: CO2TableSessionMetaSchema }),
  ]),

  notes: z.string().optional(),
});
```

#### 4.1.2 `src/entities/training-record/types.ts`

```typescript
import { z } from 'zod';
import {
  TrainingTypeSchema,
  TrainingSessionSchema,
  FrenzelSessionMetaSchema,
  CO2TableSessionMetaSchema,
} from './model';

export type TrainingType = z.infer<typeof TrainingTypeSchema>;
export type TrainingSession = z.infer<typeof TrainingSessionSchema>;
export type FrenzelSessionMeta = z.infer<typeof FrenzelSessionMetaSchema>;
export type CO2TableSessionMeta = z.infer<typeof CO2TableSessionMetaSchema>;
```

#### 4.1.3 `src/entities/training-record/index.ts`

```typescript
export * from './model';
export * from './types';
```

### 4.2 데이터 구조 예시

#### 프렌젤 세션 예시:
```typescript
{
  id: "123e4567-e89b-12d3-a456-426614174000",
  type: "frenzel",
  startTime: new Date("2025-11-05T09:00:00"),
  endTime: new Date("2025-11-05T09:10:00"),
  completed: true,
  meta: {
    type: "frenzel",
    data: {
      dayNumber: 1,
      dayTitle: "equalizing.day1.title" // 또는 번역된 "후두 감각 익히기"
    }
  },
  notes: "오늘 처음 시도. 후두 감각을 찾는 게 어려웠음."
}
```

#### CO₂ 테이블 세션 예시:
```typescript
{
  id: "456e7890-e89b-12d3-a456-426614174001",
  type: "co2-table",
  startTime: new Date("2025-11-05T14:00:00"),
  endTime: new Date("2025-11-05T14:15:30"),
  completed: true,
  meta: {
    type: "co2-table",
    data: {
      holdTimeSeconds: 150, // 2:30
      breathTimeSeconds: 120, // 2:00
      cycles: 8
    }
  }
}
```

---

## 5. 화면 명세

### 5.1 History 탭 화면 (`app/(tabs)/history.tsx`)

#### 5.1.1 레이아웃 구조

```
┌─────────────────────────────────────┐
│ 훈련 기록                            │ (헤더)
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ [CO₂]                           │ │
│ │ CO₂ Table: 2:30 Hold            │ │ (제목)
│ │ 2025-11-05 14:30                │ │ (완료 시각)
│ │ 소요: 15분 30초                 │ │ (총 시간)
│ └─────────────────────────────────┘ │
│                                       │
│ ┌─────────────────────────────────┐ │
│ │ [프렌젤]                         │ │
│ │ Day 1: 후두 감각 익히기          │ │
│ │ 2025-11-05 09:15                │ │
│ │ 소요: 10분                       │ │
│ └─────────────────────────────────┘ │
│                                       │
│ ┌─────────────────────────────────┐ │
│ │ [CO₂]                           │ │
│ │ CO₂ Table: 3:00 Hold            │ │
│ │ 2025-11-04 18:20                │ │
│ │ 소요: 20분 15초                 │ │
│ └─────────────────────────────────┘ │
│                                       │
│ (스크롤...)                          │
└─────────────────────────────────────┘
```

#### 5.1.2 기록 카드 컴포넌트

**TrainingRecordCard.tsx**:

```tsx
import { Card, CardHeader, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Text } from '@/shared/ui/text';
import type { TrainingSession } from '@/entities/training-record';

interface Props {
  session: TrainingSession;
}

export function TrainingRecordCard({ session }: Props) {
  const title = getSessionTitle(session);
  const duration = calculateDuration(session.startTime, session.endTime);
  const typeLabel = session.type === 'frenzel' ? '프렌젤' : 'CO₂';
  const typeBadgeVariant = session.type === 'frenzel' ? 'default' : 'secondary';

  return (
    <Card className="mb-3">
      <CardHeader>
        <Badge variant={typeBadgeVariant}>
          <Text variant="small">{typeLabel}</Text>
        </Badge>
        <Text variant="h4" className="mt-2">{title}</Text>
      </CardHeader>
      <CardContent>
        <View className="gap-2">
          <View className="flex-row justify-between">
            <Text variant="small" className="text-muted-foreground">
              완료 시각
            </Text>
            <Text variant="small">
              {formatDateTime(session.endTime)}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text variant="small" className="text-muted-foreground">
              소요 시간
            </Text>
            <Text variant="small">{duration}</Text>
          </View>
          {session.notes && (
            <>
              <Separator className="my-2" />
              <View>
                <Text variant="small" className="font-semibold mb-1">
                  노트
                </Text>
                <Text variant="small" className="text-muted-foreground">
                  {session.notes}
                </Text>
              </View>
            </>
          )}
        </View>
      </CardContent>
    </Card>
  );
}
```

#### 5.1.3 제목 생성 로직

**헬퍼 함수**:

```typescript
function getSessionTitle(session: TrainingSession): string {
  if (session.meta.type === 'frenzel') {
    const { dayNumber, dayTitle } = session.meta.data;
    return `Day ${dayNumber}: ${dayTitle}`;
  } else {
    const { holdTimeSeconds } = session.meta.data;
    const holdTime = formatTime(holdTimeSeconds);
    return `CO₂ Table: ${holdTime} Hold`;
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
```

#### 5.1.4 빈 상태

**완료한 기록이 없을 때**:

```
┌─────────────────────────────────┐
│ 훈련 기록                        │
├─────────────────────────────────┤
│                                  │
│     아직 완료한 훈련이           │
│     없습니다.                    │
│                                  │
│     첫 훈련을 시작해보세요!      │
│                                  │
└─────────────────────────────────┘
```

---

## 6. 영속성 구현

### 6.1 Zustand Persist 미들웨어

#### 6.1.1 `src/stores/training-history-store.ts`

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';
import type { TrainingSession } from '@/entities/training-record';

interface TrainingHistoryState {
  sessions: TrainingSession[];

  // 세션 추가
  addSession: (sessionData: Omit<TrainingSession, 'id'>) => string;

  // 세션 업데이트
  updateSession: (id: string, updates: Partial<TrainingSession>) => void;

  // 타입별 필터링
  getFrenzelSessions: () => TrainingSession[];
  getCO2Sessions: () => TrainingSession[];

  // 전체 기록 삭제
  clearHistory: () => void;
}

export const useTrainingHistoryStore = create<TrainingHistoryState>()(
  persist(
    (set, get) => ({
      sessions: [],

      addSession: (sessionData) => {
        const newSession: TrainingSession = {
          ...sessionData,
          id: randomUUID(),
        };

        set((state) => ({
          sessions: [...state.sessions, newSession],
        }));

        return newSession.id;
      },

      updateSession: (id, updates) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === id ? { ...session, ...updates } : session
          ),
        }));
      },

      getFrenzelSessions: () => {
        return get().sessions.filter((s) => s.type === 'frenzel');
      },

      getCO2Sessions: () => {
        return get().sessions.filter((s) => s.type === 'co2-table');
      },

      clearHistory: () => {
        set({ sessions: [] });
      },
    }),
    {
      name: 'training-history-storage',
      storage: createJSONStorage(() => AsyncStorage),

      // 날짜 직렬화/역직렬화 처리
      serialize: (state) => {
        const serialized = {
          ...state,
          state: {
            ...state.state,
            sessions: state.state.sessions.map((s) => ({
              ...s,
              startTime: s.startTime.toISOString(),
              endTime: s.endTime.toISOString(),
            })),
          },
        };
        return JSON.stringify(serialized);
      },

      deserialize: (str) => {
        const parsed = JSON.parse(str);
        return {
          ...parsed,
          state: {
            ...parsed.state,
            sessions: parsed.state.sessions.map((s: any) => ({
              ...s,
              startTime: new Date(s.startTime),
              endTime: new Date(s.endTime),
            })),
          },
        };
      },
    }
  )
);

export function useTrainingHistory() {
  return useTrainingHistoryStore();
}
```

### 6.2 데이터 마이그레이션

기존 `use-training-history.ts` (프렌젤 전용)에서 통합 스토어로 마이그레이션:

#### 6.2.1 마이그레이션 함수

```typescript
// src/stores/migration.ts
import type { FrenzelSession } from '@/entities/frenzel-training';
import type { TrainingSession } from '@/entities/training-record';

export function migrateFrenzelSessionToUnified(
  frenzelSession: FrenzelSession,
  dayTitle: string
): TrainingSession {
  return {
    id: frenzelSession.id,
    type: 'frenzel',
    startTime: frenzelSession.startTime,
    endTime: frenzelSession.endTime || new Date(),
    completed: frenzelSession.completed,
    meta: {
      type: 'frenzel',
      data: {
        dayNumber: frenzelSession.dayNumber,
        dayTitle,
      },
    },
    notes: frenzelSession.notes,
  };
}
```

---

## 7. i18n 번역

### 7.1 번역 키 추가

```json
// src/shared/locales/ko.json
{
  "history": {
    "title": "훈련 기록",
    "empty": "아직 완료한 훈련이 없습니다.",
    "emptySubtitle": "첫 훈련을 시작해보세요!",
    "completedAt": "완료 시각",
    "duration": "소요 시간",
    "notes": "노트",
    "clearAll": "전체 삭제",
    "frenzelBadge": "프렌젤",
    "co2Badge": "CO₂",
    "co2TableTitle": "CO₂ Table: {{holdTime}} Hold"
  }
}
```

```json
// src/shared/locales/en.json
{
  "history": {
    "title": "Training History",
    "empty": "No completed training sessions yet.",
    "emptySubtitle": "Start your first training!",
    "completedAt": "Completed At",
    "duration": "Duration",
    "notes": "Notes",
    "clearAll": "Clear All",
    "frenzelBadge": "Frenzel",
    "co2Badge": "CO₂",
    "co2TableTitle": "CO₂ Table: {{holdTime}} Hold"
  }
}
```

---

## 8. 테스트 시나리오

### 8.1 데이터 영속성

**TC-01: 세션 저장 및 복원**
- **Given**: 프렌젤 훈련 1개, CO₂ 훈련 1개 완료
- **When**: 앱 완전 종료 후 재시작
- **Then**: 히스토리 화면에 2개 기록이 정상 표시됨

**TC-02: 세션 추가**
- **Given**: 기존 기록 3개 존재
- **When**: 새로운 CO₂ 훈련 완료
- **Then**: 히스토리 최상단에 새 기록 추가됨

**TC-03: 전체 삭제**
- **Given**: 기록 10개 존재
- **When**: "전체 삭제" 버튼 클릭
- **Then**: 모든 기록 삭제되고 빈 상태 메시지 표시

### 8.2 통합 히스토리 표시

**TC-04: 혼합 타입 정렬**
- **Given**: 프렌젤 3개, CO₂ 2개 기록 (시간순 섞여있음)
- **When**: 히스토리 화면 진입
- **Then**: 완료 시각 기준 최신순으로 정렬되어 표시

**TC-05: 프렌젤 세션 표시**
- **Given**: Day 1 프렌젤 훈련 완료
- **When**: 히스토리 확인
- **Then**:
  - Badge: "프렌젤"
  - 제목: "Day 1: 후두 감각 익히기"
  - 완료 시각: "2025-11-05 09:15"
  - 소요: "10분"

**TC-06: CO₂ 세션 표시**
- **Given**: 2:30 HOLD CO₂ 훈련 완료
- **When**: 히스토리 확인
- **Then**:
  - Badge: "CO₂"
  - 제목: "CO₂ Table: 2:30 Hold"
  - 완료 시각: "2025-11-05 14:30"
  - 소요: "15분 30초"

**TC-07: 빈 히스토리**
- **Given**: 완료한 훈련 없음
- **When**: 히스토리 탭 진입
- **Then**: 빈 상태 메시지 표시

### 8.3 다국어 지원

**TC-08: 영어 표시**
- **Given**: 앱 언어가 영어
- **When**: 히스토리 화면 진입
- **Then**: 모든 레이블이 영어로 표시됨
  - "Training History"
  - "Frenzel" / "CO₂"
  - "Completed At", "Duration"

---

## 9. 검증 기준

### 9.1 데이터 모델

- [ ] TrainingSession 스키마 검증이 정상 동작
- [ ] 프렌젤/CO₂ 타입별 메타데이터 구분 정상
- [ ] Zod discriminated union 타입 추론 정상

### 9.2 영속성

- [ ] AsyncStorage에 세션 데이터 저장됨
- [ ] 앱 재시작 시 데이터 복원됨
- [ ] 날짜 직렬화/역직렬화 정상 동작
- [ ] 전체 삭제 시 AsyncStorage에서도 삭제됨

### 9.3 화면 구현

- [ ] 히스토리 화면:
  - [ ] 최신순 정렬 정상 동작
  - [ ] 프렌젤/CO₂ 타입 Badge 정상 표시
  - [ ] 제목 생성 로직 정상 동작
  - [ ] 완료 시각 포맷팅 정상
  - [ ] 소요 시간 계산 정상
  - [ ] 노트 표시 (있을 경우)
  - [ ] 빈 상태 메시지 표시

### 9.4 i18n

- [ ] 모든 UI 텍스트가 i18n 키로 관리됨
- [ ] 한국어(ko) 번역 완료
- [ ] 영어(en) 번역 완료
- [ ] 언어 변경 시 즉시 반영

### 9.5 코드 품질

- [ ] TypeScript 컴파일 오류 없음
- [ ] ESLint 오류 없음
- [ ] React Compiler 호환 (수동 메모이제이션 미사용)

---

## 10. 개발 워크플로우

### 10.1 1단계: 엔티티 생성

```bash
# 디렉토리 생성
mkdir -p src/entities/training-record

# 파일 생성
touch src/entities/training-record/model.ts
touch src/entities/training-record/types.ts
touch src/entities/training-record/index.ts
```

1. `model.ts`에 통합 스키마 정의
2. `types.ts`에 TypeScript 타입 추론
3. `index.ts`에서 공개 API export

### 10.2 2단계: Zustand 스토어 생성

```bash
# 디렉토리 생성 (없는 경우)
mkdir -p src/stores

# 파일 생성
touch src/stores/training-history-store.ts
touch src/stores/migration.ts
touch src/stores/index.ts
```

1. `training-history-store.ts`에 persist 미들웨어 적용
2. `migration.ts`에 마이그레이션 함수 추가
3. `index.ts`에서 스토어 export

### 10.3 3단계: i18n 번역 추가

1. `src/shared/locales/ko.json` 업데이트
2. `src/shared/locales/en.json` 업데이트

### 10.4 4단계: 히스토리 화면 업데이트

```bash
# app/(tabs)/history.tsx 업데이트
```

1. 통합 스토어 사용으로 전환
2. TrainingRecordCard 컴포넌트 구현
3. 빈 상태 처리

### 10.5 5단계: 기존 코드 마이그레이션

```bash
# 기존 use-training-history.ts 업데이트
```

1. 프렌젤 전용 훅을 통합 스토어 래퍼로 변경
2. 기존 FrenzelSession → TrainingSession 변환

### 10.6 6단계: 테스트

```bash
# TypeScript 체크
npx tsc --noEmit

# ESLint 체크
npm run lint

# 개발 서버 시작
npx expo start
```

---

## 11. 향후 확장 계획

이 PRD는 기본적인 통합 히스토리 기능만 제공합니다. 향후 다음 기능들을 추가할 수 있습니다:

### PRD-05: 대시보드 & 통계 (향후)
- 홈 화면 대시보드 위젯
- 최근 7일 훈련 요약
- 훈련 타입별 통계
- 주간/월간 진행률

### PRD-06: 고급 히스토리 기능 (향후)
- 필터링 (타입별, 날짜별)
- 검색 기능
- 기록 편집/삭제 (개별)
- 기록 상세 화면
- CSV 내보내기

### PRD-07: 분석 & 인사이트 (향후)
- 훈련 패턴 분석
- 진행률 차트
- 개인 기록 하이라이트
- 추천 훈련 일정

---

## 12. 비기능 요구사항

### 12.1 성능

- 히스토리 렌더링: < 500ms (100개 기록 기준)
- AsyncStorage 읽기/쓰기: < 100ms
- 스크롤 성능: 60fps 유지

### 12.2 데이터 제한

- 최대 저장 기록 수: 1000개
- 1000개 초과 시 오래된 기록부터 자동 삭제 (FIFO)

### 12.3 호환성

- iOS 13+ 지원
- Android 5.0+ 지원
- Expo Go 환경 호환

### 12.4 보안

- 데이터는 로컬에만 저장 (AsyncStorage)
- 외부 네트워크 요청 없음
- 사용자 개인 정보 미포함

---

## 13. 제외 사항 명확화

다음 기능들은 **이번 PRD에서 구현하지 않습니다**:

### 13.1 필터링 & 검색
- ❌ 타입별 필터 (프렌젤만/CO₂만 보기)
- ❌ 날짜 범위 필터
- ❌ 완료/미완료 필터
- ❌ 텍스트 검색

### 13.2 통계 & 분석
- ❌ 평균 훈련 시간
- ❌ 완료율 차트
- ❌ 진행률 트렌드
- ❌ 연속 훈련 일수 (streak)

### 13.3 고급 기능
- ❌ 기록 편집
- ❌ 개별 기록 삭제
- ❌ 기록 상세 화면
- ❌ 기록 공유/내보내기
- ❌ 기록 백업/복원

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|-----|------|---------|--------|
| 1.0 | 2025-11-05 | 초안 작성 | Claude |
