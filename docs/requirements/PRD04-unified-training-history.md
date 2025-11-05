# PRD-04: 통합 훈련 히스토리

## 문서 정보

- **문서 번호**: PRD-04
- **버전**: 2.0
- **작성일**: 2025-11-05
- **최종 수정일**: 2025-11-05
- **목적**: 프렌젤 훈련과 CO₂ 테이블 훈련의 기록을 통합 관리하는 히스토리 시스템 요구사항 명세

---

## 1. 프로젝트 개요

**Free Diving 101** 앱의 모든 훈련 기록을 통합하여 관리하고 표시하는 **통합 훈련 히스토리** 기능을 구현합니다. 이 기능은 프렌젤 이퀄라이징 훈련과 CO₂ 테이블 훈련의 완료 기록을 하나의 타임라인으로 표시하며, 향후 대시보드에서 활용할 수 있도록 데이터 영속성을 제공합니다.

### 핵심 목표

- 프렌젤 훈련 기록과 CO₂ 테이블 훈련 기록을 통합 표시
- 최신순으로 정렬된 타임라인 제공
- 날짜별 그룹핑 (오늘/어제/날짜)
- AsyncStorage를 통한 데이터 영속성 보장
- 향후 대시보드 기능 확장을 위한 데이터 구조 설계
- 간결하고 직관적인 UI

### 사용자 스토리

**AS** 프리다이빙 훈련생
**I WANT** 내가 완료한 모든 훈련을 한곳에서 확인하고
**SO THAT** 나의 훈련 패턴과 진행 상황을 파악할 수 있다

**주요 시나리오**:

1. **통합 히스토리 확인**: 사용자는 프렌젤 훈련과 CO₂ 테이블 훈련을 구분 없이 시간순으로 확인한다
2. **날짜별 그룹핑**: 오늘/어제/날짜별로 그룹화된 훈련 기록을 확인한다
3. **훈련 세부 정보 확인**: 각 기록 카드에서 완료 시각, 훈련 타입, 제목, 소요 시간을 확인한다
4. **데이터 영속성**: 앱을 종료하고 재시작해도 기록이 유지된다

---

## 2. 기능 명세

### 2.1 통합 타임라인 표시

**표시 정보**:
- ✅ 훈련 타입 Badge (프렌젤/CO₂)
- ✅ 훈련 제목
  - 프렌젤: "Day {number}: {훈련명}"
  - CO₂: "CO₂ Table: {HOLD시간} Hold"
- ✅ 완료 시각 (날짜 + 시각)
- ✅ 총 소요 시간 (분:초)
- ✅ 노트 (있는 경우)

**정렬 및 그룹핑**:
- 완료 시각 기준 최신순 정렬
- 날짜별 섹션 헤더 (오늘/어제/YYYY년 MM월 DD일)
- Sticky section headers

### 2.2 데이터 영속성

**Zustand persist 미들웨어** 사용:
- AsyncStorage에 자동 저장
- 앱 재시작 시 자동 복원
- 스토어 이름: `training-history-storage`
- 날짜 직렬화/역직렬화 처리

### 2.3 UI 컴포넌트

React Native Reusables를 사용한 UI 구현:
- Card (훈련 기록 카드)
- Badge (훈련 타입 표시)
- Text (텍스트 표시)
- SectionList (날짜별 그룹 리스트)
- Separator (구분선)

---

## 3. 데이터 모델 참조

### 3.1 엔티티 구조

| 엔티티 | 파일 위치 | 설명 |
|--------|----------|------|
| TrainingSession | `/src/entities/training-record/model.ts` | 통합 훈련 세션 (Discriminated Union) |
| TrainingType | `/src/entities/training-record/model.ts` | 훈련 타입 Enum ('frenzel' \| 'co2-table') |
| FrenzelSessionMeta | `/src/entities/training-record/model.ts` | 프렌젤 메타데이터 (dayNumber) |
| CO2TableSessionMeta | `/src/entities/training-record/model.ts` | CO₂ 메타데이터 (holdTimeSeconds, cycles) |

**Discriminated Union 구조**:
```typescript
type TrainingSession =
  | {
      type: 'frenzel'
      meta: { dayNumber: number }
    }
  | {
      type: 'co2-table'
      meta: { holdTimeSeconds: number, breathTimeSeconds: number, cycles: number }
    }
```

**공통 필드**:
- `id`: UUID
- `startTime`: Date
- `endTime`: Date
- `completed`: boolean
- `notes`: string (optional)

**참고**: 실제 스키마 정의는 해당 파일 참조

### 3.2 Zustand 스토어

**파일 위치**: `/src/stores/training-history-store.ts`

**주요 기능**:
- `addSession()`: 새 세션 추가
- `updateSession()`: 세션 업데이트
- `getFrenzelSessions()`: 프렌젤 세션만 필터링
- `getCO2Sessions()`: CO₂ 세션만 필터링
- `clearHistory()`: 전체 기록 삭제

**참고**: 실제 구현은 해당 파일 참조

---

## 4. i18n 키 구조

### 4.1 번역 키 구조

```json
{
  "history": {
    "title": "훈련 기록",
    "today": "오늘",
    "yesterday": "어제",
    "empty": "아직 완료한 훈련이 없습니다.",
    "emptySubtitle": "첫 훈련을 시작해보세요!",
    "completedAt": "완료 시각",
    "duration": "소요 시간",
    "notes": "노트",
    "frenzelBadge": "프렌젤",
    "co2Badge": "CO₂",
    "frenzelTitle": "Day {{dayNumber}}: {{dayTitle}}",
    "co2TableTitle": "CO₂ Table: {{holdTime}} Hold",
    "durationMinutes": "{{mins}}분",
    "durationSeconds": "{{secs}}초",
    "durationMinutesSeconds": "{{mins}}분 {{secs}}초",
    "unknownDuration": "알 수 없음"
  }
}
```

**참고**: 전체 번역은 `/src/shared/locales/ko.json`, `/src/shared/locales/en.json` 참조

---

## 5. 검증 기준

### 5.1 데이터 모델
- [ ] TrainingSession 스키마 검증이 정상 동작
- [ ] 프렌젤/CO₂ 타입별 메타데이터 구분 정상
- [ ] Zod discriminated union 타입 추론 정상

### 5.2 영속성
- [ ] AsyncStorage에 세션 데이터 저장됨
- [ ] 앱 재시작 시 데이터 복원됨
- [ ] 날짜 직렬화/역직렬화 정상 동작
- [ ] 전체 삭제 시 AsyncStorage에서도 삭제됨

### 5.3 화면 구현
- [ ] 히스토리 화면:
  - [ ] 최신순 정렬 정상 동작
  - [ ] 날짜별 그룹핑 (오늘/어제/날짜)
  - [ ] 프렌젤/CO₂ 타입 Badge 정상 표시
  - [ ] 제목 생성 로직 정상 동작
  - [ ] 완료 시각 포맷팅 정상
  - [ ] 소요 시간 계산 정상
  - [ ] 노트 표시 (있을 경우)
  - [ ] 빈 상태 메시지 표시

### 5.4 i18n
- [ ] 모든 UI 텍스트가 i18n 키로 관리됨
- [ ] 한국어(ko) 번역 완료
- [ ] 영어(en) 번역 완료
- [ ] 언어 변경 시 즉시 반영

### 5.5 코드 품질
- [ ] TypeScript 컴파일 오류 없음
- [ ] ESLint 오류 없음
- [ ] React Compiler 호환 (수동 메모이제이션 미사용)

---

## 6. 비기능 요구사항

### 6.1 성능
- 히스토리 렌더링: < 500ms (100개 기록 기준)
- AsyncStorage 읽기/쓰기: < 100ms
- 스크롤 성능: 60fps 유지

### 6.2 데이터 제한
- 최대 저장 기록 수: 1000개
- 1000개 초과 시 오래된 기록부터 자동 삭제 (FIFO)

### 6.3 호환성
- iOS 13+ 지원
- Android 5.0+ 지원
- Expo Go 환경 호환

### 6.4 보안
- 데이터는 로컬에만 저장 (AsyncStorage)
- 외부 네트워크 요청 없음
- 사용자 개인 정보 미포함

---

## 7. 제외 사항

다음 기능들은 **구현하지 않습니다**:

### 7.1 필터링 & 검색
- ❌ 타입별 필터 (프렌젤만/CO₂만 보기)
- ❌ 날짜 범위 필터
- ❌ 완료/미완료 필터
- ❌ 텍스트 검색

### 7.2 통계 & 분석
- ❌ 평균 훈련 시간
- ❌ 완료율 차트
- ❌ 진행률 트렌드
- ❌ 연속 훈련 일수 (streak)

### 7.3 고급 기능
- ❌ 기록 편집
- ❌ 개별 기록 삭제
- ❌ 기록 상세 화면
- ❌ 기록 공유/내보내기
- ❌ 기록 백업/복원

---

## 8. 참고사항

### 8.1 CLAUDE.md 준수

이 PRD는 CLAUDE.md의 다음 원칙을 따릅니다:

- Feature-Sliced Design: entities → features → app 계층 구조
- React Compiler 사용 (수동 useMemo/useCallback 금지)
- TypeScript strict mode
- Zod 스키마 우선 검증
- i18n 다국어 지원
- NativeWind 스타일링

### 8.2 Discriminated Union 사용 이유

타입별로 다른 메타데이터를 안전하게 관리하기 위해 Discriminated Union을 사용합니다:

**장점**:
- TypeScript 타입 안정성 확보
- `type` 필드로 타입 가드 자동 적용
- 런타임 타입 체크 (Zod)
- 확장성 (향후 새로운 훈련 타입 추가 용이)

**예시**:
```typescript
if (session.type === 'frenzel') {
  // TypeScript가 자동으로 session.meta.dayNumber 존재를 보장
  console.log(session.meta.dayNumber);
} else {
  // TypeScript가 자동으로 session.meta.holdTimeSeconds 존재를 보장
  console.log(session.meta.holdTimeSeconds);
}
```

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|-----|------|---------|--------|
| 1.0 | 2025-11-05 | 초안 작성 | Claude |
| 2.0 | 2025-11-05 | 문서 간소화 - 구현 세부사항 제거, 요구사항 중심으로 재구성 | Claude |
