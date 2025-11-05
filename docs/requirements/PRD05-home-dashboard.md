# PRD05: Home Dashboard & Progress Tracking

**Status**: Draft
**Created**: 2025-11-05
**Owner**: Product
**Dependencies**: PRD02, PRD03, PRD04

---

## 1. Overview

### 1.1 Purpose

홈 화면(`app/(tabs)/index.tsx`)을 앱의 중심 허브로 전환하여 사용자가:
- 즉시 훈련을 시작할 수 있고
- 진행 상황을 한눈에 파악하며
- 다음 액션이 명확히 보이도록 함

### 1.2 Background

**현재 상태:**
- 홈 화면이 빈 화면 ("Home" 제목만 표시)
- 사용자가 훈련을 시작하려면 다른 탭으로 이동 필요
- 진행 상황을 확인하려면 History 탭 방문 필요

**문제점:**
- "다음에 뭐하지?" - 명확한 가이드 부재
- "내가 얼마나 했지?" - 진행도 파악 어려움
- "계속하던 거 어디 있지?" - 컨텍스트 손실

**해결 방안:**
홈 대시보드를 통해 모든 정보를 한 화면에 제공

### 1.3 Success Metrics

- **Primary**: 홈 화면에서 훈련 시작까지 평균 탭 수 ≤ 2
- **Secondary**:
  - 신규 사용자의 첫 훈련 시작률 증가
  - 일일 활성 사용자 (DAU) 증가
  - 평균 세션 지속 시간 증가

---

## 2. User Goals

### 2.1 Primary Goals

1. **즉시 훈련 시작**
   - "Continue" 또는 "Start" 버튼으로 2탭 이내 시작
   - 진행 중인 훈련이 있으면 이어서 하기

2. **진행도 한눈에 파악**
   - 프렌젤 10일 중 몇 일 완료했는지
   - 총 얼마나 훈련했는지
   - 연속 훈련일 (streak) 확인

3. **동기부여 받기**
   - 시각적 진행도 (프로그레스 바)
   - Streak 카운터
   - 최근 성과 확인

### 2.2 User Personas

**페르소나 1: 신규 사용자 (Min-soo)**
- 프리다이빙 입문자
- 어디서부터 시작해야 할지 모름
- 명확한 가이드 필요

**페르소나 2: 진행 중 사용자 (Ji-young)**
- 프렌젤 Day 3 완료
- 꾸준히 훈련 중
- "다음은 Day 4"라는 컨텍스트 원함

**페르소나 3: 완료 사용자 (Dong-hyun)**
- 프렌젤 10일 완료
- CO₂ 테이블 위주로 훈련
- 빠른 CO₂ 세션 시작 원함

---

## 3. Core Features

### 3.1 Quick Action Cards

**3.1.1 Continue Frenzel Training (진행 중인 경우)**

**조건**: 프렌젤 훈련을 시작했지만 10일 미완료

**UI**:
```
┌─────────────────────────────────────┐
│ [▶] Continue Training               │
│  Day 3: Understanding Soft Palate   │
│  Progress: 2/10 days completed      │
└─────────────────────────────────────┘
```

**액션**: Equalizing 탭의 Day X 상세 화면으로 이동

**데이터**:
- `getCompletedDays()`: 완료된 Day 번호들
- `findNextDay()`: 다음 미완료 Day
- `FRENZEL_TRAINING_SCHEDULE[nextDay]`: Day 정보

---

**3.1.2 Start Frenzel Training (신규 사용자)**

**조건**: 프렌젤 세션이 하나도 없음

**UI**:
```
┌─────────────────────────────────────┐
│ [▶] Start Training                  │
│  Day 1: Understanding Glottis       │
│  10 minutes                          │
└─────────────────────────────────────┘
```

**액션**: Equalizing 탭의 Day 1 상세 화면으로 이동

---

**3.1.3 Quick CO₂ Session**

**조건**: 항상 표시

**UI**:
```
┌─────────────────────┐
│ [CO₂] Quick Session │
│  Last: 1:30 Hold    │
└─────────────────────┘
```

**액션**: CO₂ Table 탭으로 이동

**데이터**:
- `getCO2Sessions()`: CO₂ 세션 목록
- 마지막 세션의 `meta.holdTimeSeconds` 표시

---

**3.1.4 View History**

**조건**: 세션이 1개 이상 있을 때

**UI**:
```
┌─────────────────────┐
│ [History] View All  │
│  XX sessions        │
└─────────────────────┘
```

**액션**: History 탭으로 이동

---

### 3.2 Progress Overview

**3.2.1 Frenzel Progress Bar**

**UI**:
```
Frenzel Training
[████████░░] 70%
7/10 Days Completed
```

**계산**:
```typescript
const completedDays = getCompletedDays(frenzelSessions);
const progress = (completedDays.size / 10) * 100;
```

---

**3.2.2 Training Statistics**

**UI**:
```
Total Practice: 2h 15min
Current Streak: 5 days 🔥
Last Training: Today, 2:30 PM
```

**데이터**:
- `calculateTotalTime(sessions)`: 모든 세션 duration 합계
- `calculateStreak(sessions)`: 연속 훈련일
- `sessions[0].endTime`: 최근 훈련 날짜/시간

---

### 3.3 Recent Activity

**3.3.1 Activity Preview**

**조건**: 세션이 1개 이상 있을 때

**UI**:
```
RECENT ACTIVITY
┌─────────────────────────────────────┐
│ [CO₂] 2:00 Hold | Today 2:30PM      │
│ [프렌젤] Day 3  | Yesterday          │
│ [CO₂] 1:30 Hold | 2 days ago        │
└─────────────────────────────────────┘
View All →
```

**데이터**:
- `sessions.slice(0, 3)`: 최근 3개 세션
- 각 세션의 type badge, title, endTime 표시

---

### 3.4 Empty State (신규 사용자)

**조건**: 세션이 하나도 없음

**UI**:
```
┌─────────────────────────────────────┐
│ Welcome to Free Diving 101! 🌊      │
│                                      │
│ Ready to master freediving?         │
│                                      │
│ Start your journey with:            │
│                                      │
│ ┌─────────────────────┐            │
│ │ [▶] Start Day 1     │            │
│ │  Understanding Glottis            │
│ │  10 minutes         │            │
│ └─────────────────────┘            │
│                                      │
│ OR                                  │
│                                      │
│ ┌─────────────────────┐            │
│ │ [▶] CO₂ Table       │            │
│ │  Breath training    │            │
│ └─────────────────────┘            │
│                                      │
│ Learn what Frenzel is →             │
└─────────────────────────────────────┘
```

**액션**:
- Day 1 버튼 → Equalizing 탭
- CO₂ 버튼 → CO₂ Table 탭
- Learn more → Equalizing 탭 (교육 콘텐츠)

---

## 4. Data Requirements

### 4.1 Store Integration

```typescript
import { useTrainingHistory } from '@/stores/training-history-store';
import { FRENZEL_TRAINING_SCHEDULE } from '@/entities/frenzel-training';

const {
  sessions,
  getFrenzelSessions,
  getCO2Sessions
} = useTrainingHistory();
```

### 4.2 Helper Functions

**4.2.1 getCompletedDays()**

```typescript
function getCompletedDays(sessions: TrainingSession[]): Set<number> {
  return new Set(
    sessions
      .filter(s => s.type === 'frenzel' && s.completed)
      .map(s => s.meta.dayNumber)
  );
}
```

**4.2.2 findNextDay()**

```typescript
function findNextDay(completedDays: Set<number>): number {
  for (let i = 1; i <= 10; i++) {
    if (!completedDays.has(i)) return i;
  }
  return 10; // All completed
}
```

**4.2.3 calculateTotalTime()**

```typescript
function calculateTotalTime(sessions: TrainingSession[]): number {
  return sessions.reduce((total, session) => {
    const duration = session.endTime.getTime() - session.startTime.getTime();
    return total + duration;
  }, 0);
}
```

**4.2.4 calculateStreak()**

```typescript
function calculateStreak(sessions: TrainingSession[]): number {
  const sorted = [...sessions].sort((a, b) =>
    b.endTime.getTime() - a.endTime.getTime()
  );

  let streak = 0;
  let currentDate = new Date();

  for (const session of sorted) {
    const sessionDate = new Date(session.endTime);
    const dayDiff = getDaysDifference(sessionDate, currentDate);

    if (dayDiff === 0 || dayDiff === 1) {
      streak++;
      currentDate = sessionDate;
    } else {
      break;
    }
  }

  return streak;
}
```

**4.2.5 formatDuration()**

```typescript
function formatDuration(ms: number, t: TFunction): string {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return t('home.durationHoursMinutes', { hours, minutes });
  }
  return t('home.durationMinutes', { minutes });
}
```

**4.2.6 getTimeBasedGreeting()**

```typescript
function getTimeBasedGreeting(t: TFunction): string {
  const hour = new Date().getHours();

  if (hour < 12) return t('home.greeting.morning');
  if (hour < 18) return t('home.greeting.afternoon');
  return t('home.greeting.evening');
}
```

---

## 5. Screen Specifications

### 5.1 Layout Structure

```
┌─────────────────────────────────────┐
│ [Safe Area Top]                     │
├─────────────────────────────────────┤
│ [Greeting Section]                  │
│ Good afternoon! 🌊                  │
│ 3 day streak 🔥                     │
├─────────────────────────────────────┤
│ [Quick Actions]                     │
│ ┌─────────────────────┐            │
│ │ [▶] Continue Day 3  │ (Hero)     │
│ └─────────────────────┘            │
│ ┌───────────┬───────────┐          │
│ │ [CO₂]     │ [History] │          │
│ └───────────┴───────────┘          │
├─────────────────────────────────────┤
│ [Progress Overview]                 │
│ Frenzel Training                    │
│ [████░░░░░░] 30%                   │
│ 3/10 Days Completed                │
│                                      │
│ Total Practice: 45min               │
│ Current Streak: 3 days 🔥          │
├─────────────────────────────────────┤
│ [Recent Activity]                   │
│ ┌─────────────────────────────────┐│
│ │ [CO₂] 2:00 Hold | Today 2:30PM ││
│ │ [프렌젤] Day 3 | Yesterday      ││
│ │ [CO₂] 1:30 Hold | 2 days ago   ││
│ └─────────────────────────────────┘│
│ View All →                          │
├─────────────────────────────────────┤
│ [Safe Area Bottom]                  │
└─────────────────────────────────────┘
```

### 5.2 Component Hierarchy

```
HomeScreen
├── ScrollView (with safe area)
│   ├── GreetingSection
│   │   ├── TimeBasedGreeting (Text)
│   │   └── StreakIndicator (Text with icon)
│   │
│   ├── QuickActionsSection
│   │   ├── PrimaryActionCard (Card)
│   │   │   └── Button (Continue/Start Training)
│   │   └── SecondaryActionsRow (View)
│   │       ├── CO2QuickButton (Card)
│   │       └── HistoryButton (Card)
│   │
│   ├── ProgressSection
│   │   ├── SectionTitle (Text)
│   │   ├── FrenzelProgressBar (Progress)
│   │   ├── ProgressText (Text)
│   │   ├── TotalTimeText (Text)
│   │   └── StreakText (Text)
│   │
│   └── RecentActivitySection
│       ├── SectionTitle (Text)
│       ├── ActivityList (FlatList with 3 items)
│       │   └── ActivityCard (Card)
│       └── ViewAllLink (Button/Link)
```

### 5.3 UI Components

**From React Native Reusables:**
- `Card` - Action cards, progress cards
- `CardHeader` / `CardContent` - Card sections
- `Button` - Primary/secondary actions
- `Badge` - Training type indicators
- `Progress` - Frenzel progress bar
- `Text` - All typography (variant: h1, h2, h3, p, small)
- `Separator` - Section dividers

### 5.4 Responsive Behavior

- Safe area insets 적용 (top/bottom)
- ScrollView로 콘텐츠 스크롤 지원
- Card 간격: 16px (p-4)
- 섹션 간격: 24px (gap-6)
- 터치 영역: 최소 44x44px

---

## 6. Internationalization (i18n)

### 6.1 New i18n Keys

**영어 (en.json)**:
```json
{
  "home": {
    "greeting": {
      "morning": "Good morning!",
      "afternoon": "Good afternoon!",
      "evening": "Good evening!"
    },
    "streak": "{{count}} day streak",
    "quickActions": "Quick Actions",
    "continueTraining": "Continue Training",
    "startTraining": "Start Training",
    "quickCO2": "Quick CO₂ Session",
    "lastHold": "Last: {{time}} Hold",
    "viewHistory": "View History",
    "sessionsCount": "{{count}} sessions",
    "progress": "Your Progress",
    "frenzelTraining": "Frenzel Training",
    "daysCompleted": "{{completed}}/{{total}} Days Completed",
    "totalPractice": "Total Practice: {{time}}",
    "currentStreak": "Current Streak: {{count}} days",
    "lastTraining": "Last Training: {{time}}",
    "recentActivity": "Recent Activity",
    "viewAll": "View All",
    "welcome": "Welcome to Free Diving 101!",
    "readyToStart": "Ready to master freediving?",
    "startJourney": "Start your journey with:",
    "or": "OR",
    "learnMore": "Learn what Frenzel is",
    "durationHoursMinutes": "{{hours}}h {{minutes}}min",
    "durationMinutes": "{{minutes}}min",
    "today": "Today",
    "yesterday": "Yesterday",
    "daysAgo": "{{count}} days ago"
  }
}
```

**한국어 (ko.json)**:
```json
{
  "home": {
    "greeting": {
      "morning": "좋은 아침이에요!",
      "afternoon": "좋은 오후에요!",
      "evening": "좋은 저녁이에요!"
    },
    "streak": "{{count}}일 연속",
    "quickActions": "빠른 시작",
    "continueTraining": "훈련 이어하기",
    "startTraining": "훈련 시작하기",
    "quickCO2": "CO₂ 빠른 시작",
    "lastHold": "최근: {{time}} 홀드",
    "viewHistory": "기록 보기",
    "sessionsCount": "{{count}}개 세션",
    "progress": "진행 상황",
    "frenzelTraining": "프렌젤 훈련",
    "daysCompleted": "{{completed}}/{{total}}일 완료",
    "totalPractice": "총 연습 시간: {{time}}",
    "currentStreak": "현재 연속: {{count}}일",
    "lastTraining": "마지막 훈련: {{time}}",
    "recentActivity": "최근 활동",
    "viewAll": "전체 보기",
    "welcome": "프리다이빙 101에 오신 걸 환영합니다!",
    "readyToStart": "프리다이빙을 마스터할 준비가 되셨나요?",
    "startJourney": "여정을 시작하세요:",
    "or": "또는",
    "learnMore": "프렌젤이 무엇인지 배우기",
    "durationHoursMinutes": "{{hours}}시간 {{minutes}}분",
    "durationMinutes": "{{minutes}}분",
    "today": "오늘",
    "yesterday": "어제",
    "daysAgo": "{{count}}일 전"
  }
}
```

---

## 7. Technical Implementation

### 7.1 Architecture (FSD)

```
src/
├── widgets/
│   └── home-dashboard/          # NEW
│       ├── ui/
│       │   ├── greeting-section.tsx
│       │   ├── quick-actions-section.tsx
│       │   ├── progress-section.tsx
│       │   ├── recent-activity-section.tsx
│       │   └── empty-state.tsx
│       ├── lib/
│       │   ├── use-training-stats.ts
│       │   └── date-helpers.ts
│       └── index.ts
│
├── shared/
│   └── lib/
│       └── training-helpers.ts  # NEW (helper functions)
```

**또는 간단한 구조:**
```
app/(tabs)/
└── index.tsx                    # 모든 로직 포함
```

### 7.2 React Compiler Compliance

**✅ 허용:**
```typescript
// React Compiler가 자동 최적화
function HomeScreen() {
  const { sessions } = useTrainingHistory();
  const completedDays = getCompletedDays(sessions);
  const streak = calculateStreak(sessions);

  return <View>...</View>;
}
```

**❌ 금지:**
```typescript
// useMemo/useCallback 사용하지 않음
const completedDays = useMemo(() =>
  getCompletedDays(sessions), [sessions]
);
```

### 7.3 TypeScript Strict Mode

```typescript
// 모든 함수 타입 명시
function getCompletedDays(
  sessions: TrainingSession[]
): Set<number> {
  // ...
}

function calculateStreak(
  sessions: TrainingSession[]
): number {
  // ...
}
```

### 7.4 Navigation

**Expo Router 사용:**
```typescript
import { router } from 'expo-router';

// Equalizing 탭으로 이동
router.push('/(tabs)/equalizing');

// History 탭으로 이동
router.push('/(tabs)/history');

// CO₂ Table 탭으로 이동
router.push('/(tabs)/co2-table');
```

---

## 8. Testing Scenarios

### 8.1 Empty State (신규 사용자)

**Given**: 세션이 하나도 없음
**When**: 홈 화면 진입
**Then**:
- Welcome 메시지 표시
- "Start Day 1" 버튼 표시
- "CO₂ Table" 버튼 표시
- "Learn what Frenzel is" 링크 표시

### 8.2 In-Progress State (진행 중)

**Given**: 프렌젤 Day 1-3 완료
**When**: 홈 화면 진입
**Then**:
- "Continue Training" 버튼 표시
- "Day 4: ..." 제목 표시
- Progress bar 30% (3/10)
- Recent Activity에 Day 3, 2, 1 표시

### 8.3 Completed State (10일 완료)

**Given**: 프렌젤 Day 1-10 모두 완료
**When**: 홈 화면 진입
**Then**:
- "Continue Training" 버튼 숨김 또는 "Completed!" 표시
- Progress bar 100% (10/10)
- CO₂ Quick Session 버튼 강조

### 8.4 Streak Calculation

**Given**: 오늘, 어제, 그제 훈련함
**When**: Streak 계산
**Then**: "3 day streak" 표시

**Given**: 오늘, 3일 전 훈련함
**When**: Streak 계산
**Then**: "1 day streak" (오늘만)

### 8.5 Time-based Greeting

**Given**: 현재 시간 오전 9시
**When**: 화면 렌더링
**Then**: "Good morning!" 표시

**Given**: 현재 시간 오후 3시
**When**: 화면 렌더링
**Then**: "Good afternoon!" 표시

### 8.6 Navigation

**Given**: "Continue Training" 버튼 클릭
**When**: 액션 실행
**Then**: Equalizing 탭의 Day X 화면으로 이동

**Given**: "Quick CO₂ Session" 버튼 클릭
**When**: 액션 실행
**Then**: CO₂ Table 탭으로 이동

---

## 9. Out of Scope (미래 PRD)

다음 기능들은 **명시적으로 제외**하며 미래 PRD로 연기:

### 9.1 Advanced Analytics (PRD06)
- 주간/월간 진행도 차트
- 훈련 패턴 분석
- CO₂ HOLD time 증가 추이 그래프
- 개인 기록 (Personal Records)

### 9.2 Achievement System (PRD07)
- 배지/트로피 시스템
- 마일스톤 알림
- 10일 완주 축하 애니메이션
- 소셜 공유 기능

### 9.3 Notifications & Reminders (PRD08)
- 일일 훈련 리마인더
- Streak 유지 알림
- 푸시 알림
- 백그라운드 알림

### 9.4 Personalization
- AI 추천 시스템
- 맞춤형 훈련 계획
- 개인화된 메시지

### 9.5 Complex UI
- 복잡한 차트/그래프
- 필터링/검색 UI
- 설정 화면
- 프로필 관리

---

## 10. Validation Criteria

### 10.1 Functional Requirements

- [ ] Empty state가 신규 사용자에게 명확한 가이드 제공
- [ ] Continue/Start 버튼이 올바른 Day로 네비게이션
- [ ] Progress bar가 실제 완료된 Day 수 반영
- [ ] Streak이 정확히 계산됨 (연속일 체크)
- [ ] Total training time이 모든 세션 duration 합계
- [ ] Recent activity가 최근 3개 세션 표시
- [ ] i18n이 ko/en 모두 지원
- [ ] Time-based greeting이 시간대별로 변경

### 10.2 Technical Requirements

- [ ] TypeScript strict mode 통과
- [ ] ESLint 에러 없음
- [ ] React Compiler 호환 (no useMemo/useCallback)
- [ ] FSD 아키텍처 준수
- [ ] Safe area insets 올바르게 적용
- [ ] Expo Router 네비게이션 작동
- [ ] AsyncStorage에서 데이터 로드 성공

### 10.3 UI/UX Requirements

- [ ] 터치 영역이 44x44px 이상
- [ ] 로딩 상태 없음 (즉시 렌더링)
- [ ] 스크롤이 부드럽게 작동
- [ ] 카드 간격이 일관됨
- [ ] 다크 모드 지원 (NativeWind)
- [ ] 텍스트가 명확하게 읽힘
- [ ] 버튼 액션이 즉시 반응

### 10.4 Performance Requirements

- [ ] 초기 렌더링 < 100ms
- [ ] 네비게이션 지연 < 50ms
- [ ] 메모리 누수 없음
- [ ] 불필요한 리렌더 없음

---

## 11. Implementation Plan

### Phase 1: Core Structure (1-2 hours)

1. **Helper Functions**
   - `getCompletedDays()`
   - `findNextDay()`
   - `calculateTotalTime()`
   - `calculateStreak()`
   - `formatDuration()`
   - `getTimeBasedGreeting()`

2. **i18n Keys**
   - en.json 업데이트
   - ko.json 업데이트

### Phase 2: UI Components (2-3 hours)

3. **Greeting Section**
   - Time-based greeting
   - Streak indicator

4. **Quick Actions**
   - Primary action card (Continue/Start)
   - CO₂ quick button
   - History button

5. **Progress Section**
   - Frenzel progress bar
   - Statistics (time, streak)

6. **Recent Activity**
   - Activity cards (last 3)
   - View All link

7. **Empty State**
   - Welcome message
   - Training options
   - Learn more link

### Phase 3: Integration & Testing (1 hour)

8. **Store Integration**
   - useTrainingHistory() hook
   - Data flow verification

9. **Navigation**
   - Expo Router links
   - Tab switching

10. **Testing**
    - Empty state
    - In-progress state
    - Completed state
    - i18n switching

### Phase 4: Polish (1 hour)

11. **UI Polish**
    - Spacing/alignment
    - Typography
    - Colors/contrast

12. **Code Quality**
    - TypeScript check
    - ESLint
    - Code review

---

## 12. Success Criteria

### 12.1 User Experience

✅ 사용자가 홈 화면에서 훈련을 2탭 이내 시작 가능
✅ 진행도가 즉시 파악 가능
✅ 다음 액션이 명확히 보임
✅ Empty state가 신규 사용자를 안내
✅ 동기부여 요소 (streak, progress) 효과적

### 12.2 Technical Quality

✅ TypeScript strict mode 통과
✅ ESLint 에러 없음
✅ React Compiler 호환
✅ FSD 아키텍처 준수
✅ 완전한 i18n 지원

### 12.3 Performance

✅ 빠른 초기 로딩
✅ 부드러운 스크롤
✅ 즉각적인 네비게이션
✅ 메모리 효율적

---

## 13. Appendix

### 13.1 Design References

**유사 앱 패턴:**
- Strava: Hero action + recent activity feed
- Headspace: Continue + streak counter
- Duolingo: Daily goal + streak flame
- Nike Training: Continue workout + achievements

### 13.2 Technical References

- [Expo Router Navigation](https://docs.expo.dev/router/navigating-pages/)
- [React Native Reusables](https://rnr-docs.vercel.app/)
- [Zustand Best Practices](https://zustand-demo.pmnd.rs/)
- [i18next React Integration](https://react.i18next.com/)

### 13.3 Related Documents

- [PRD02: Frenzel Training](./PRD02-frenzel-training.md) - 프렌젤 10일 프로그램
- [PRD03: CO₂ Table Training](./PRD03-co2-table-training.md) - CO₂ 테이블 훈련
- [PRD04: Unified Training History](./PRD04-unified-training-history.md) - 통합 히스토리
- [Architecture Guide](../guides/ARCHITECTURE.md) - FSD 원칙
- [i18n Guide](../guides/I18N.md) - 다국어 가이드

---

**Document Version**: 1.0
**Last Updated**: 2025-11-05
**Status**: Ready for Implementation
