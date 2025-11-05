# PRD-03: CO₂ 테이블 훈련 기능

## 문서 정보

- **문서 번호**: PRD-03
- **버전**: 2.0
- **작성일**: 2025-11-03
- **최종 수정일**: 2025-11-05
- **목적**: CO₂ 테이블 숨 참기 훈련 기능 요구사항 명세

---

## 1. 프로젝트 개요

**Free Diving 101** 앱의 두 번째 핵심 기능인 **CO₂ 테이블 훈련**을 구현합니다. CO₂ 테이블은 이산화탄소(CO₂) 내성을 향상시키기 위한 숨 참기 훈련 프로그램으로, 호흡 시간(Breathe)은 점진적으로 줄어들고 숨 참기 시간(Hold)은 일정하게 유지하는 방식입니다.

### 핵심 목표

- CO₂ 테이블 타이머 기능 제공 (8 라운드)
- Hold time 커스터마이징 (±10초 조절)
- Breathe와 Hold 진행률 시각화 (Progress 바)
- TTS 음성 안내 (타이밍 알림)
- 백그라운드 타이머 실행 및 로컬 알림
- 훈련 완료 기록 저장 및 히스토리 추적
- 다국어 지원 (한국어, 영어)

### 사용자 스토리

**AS** 초보 프리다이버
**I WANT** CO₂ 테이블 훈련을 통해 이산화탄소 내성을 키우고
**SO THAT** 더 오래 숨을 참을 수 있는 능력을 향상시킨다

**주요 시나리오**:

1. **CO₂ 테이블 확인**: 사용자는 8 라운드의 Breathe/Hold 시간을 확인한다
2. **Hold time 조절**: 사용자는 자신의 수준에 맞게 Hold time을 ±10초 단위로 조절한다
3. **훈련 실행**: 사용자는 훈련을 시작하여 Round 1부터 순차적으로 진행한다
4. **음성 안내**: TTS가 "Breathe", "Hold", 시간 카운트를 안내한다
5. **훈련 완료**: Round 8까지 완료하면 세션 기록이 저장되고 히스토리에 표시된다

---

## 2. 기능 명세

### 2.1 CO₂ 테이블 구성

CO₂ 테이블은 8 라운드로 구성되며, 다음과 같은 기본 설정을 가집니다:

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

### 2.2 Hold Time 커스터마이징

- **기본값**: 1분 30초 (1:30)
- **조절 방법**: +/- 버튼으로 10초 단위 증감
- **범위**: 최소 0:40 ~ 최대 4:00
- **조절 가능 시점**: 훈련 시작 전에만 가능
- **조절 불가 시점**: 훈련 시작 후 (실행 중, 일시정지 상태 포함)

### 2.3 훈련 화면 구성

통합 화면(`app/(tabs)/co2-table.tsx`)에서 모든 기능 제공:

**초기 상태 (훈련 시작 전)**:
- 타이머 표시 (Round 1 Breathe 시간)
- Breathe/Hold Progress 바 (초기 100%)
- 훈련 시작 버튼
- Hold Time 조절 버튼 (±10초)
- CO₂ 테이블 리스트 (8 라운드)
- 총 훈련 시간 표시

**훈련 실행 중**:
- 현재 Round 및 상태 표시 (예: "Round 3 - Hold")
- 타이머 카운트다운
- 실시간 Progress 바 업데이트
- 일시정지/완료/종료 버튼

### 2.4 TTS 음성 안내

**음성 발화 타이밍**:

| 타이밍 | 발화 내용 |
|--------|----------|
| Breathe 시작 | "Breathe" (각 Round 시작 시) |
| Hold 시작 | "Hold" (각 Round Hold 시작 시) |
| 3:00, 2:00, 1:00 | "Three minutes", "Two minutes", "One minute" |
| 0:30 | "Thirty seconds" |
| 0:10 | "Ten seconds" |
| 0:05-0:01 | "Five", "Four", "Three", "Two", "One" (각 초마다) |
| 훈련 완료 | "Training completed" (Round 8 Hold 종료 시) |

**주의사항**:
- 일시정지 시 TTS 중단
- 재개 시 현재 시간에 맞는 TTS부터 계속

### 2.5 UI 컴포넌트

React Native Reusables를 사용한 UI 구현:
- Button (Hold time 조절, 훈련 컨트롤)
- Card (라운드 리스트 아이템)
- Badge (Round 번호)
- Progress (Breathe/Hold 진행률)
- AlertDialog (훈련 종료 확인)

---

## 3. 데이터 모델 참조

### 3.1 엔티티 구조

| 엔티티 | 파일 위치 | 설명 |
|--------|----------|------|
| CO2TableConfig | `/src/entities/co2-table/model.ts` | Hold time 설정 |
| CO2TableRound | `/src/entities/co2-table/model.ts` | 각 라운드 정보 (Breathe, Hold 시간) |
| CO2TableSession | `/src/entities/co2-table/model.ts` | 훈련 세션 기록 |
| CO2_TABLE_BREATHE_TIMES | `/src/entities/co2-table/constants.ts` | 8개 라운드 Breathe 시간 (고정값) |

**주요 필드**:
- `CO2TableConfig`: holdTimeSeconds (40-240)
- `CO2TableRound`: roundNumber (1-8), breatheSeconds, holdSeconds
- `CO2TableSession`: id (UUID), startTime, endTime, completed, holdTimeSeconds, cycles, notes

**참고**: 실제 스키마 정의는 해당 파일 참조

---

## 4. i18n 키 구조

### 4.1 번역 키 구조

```json
{
  "co2Table": {
    "title": "CO₂ 테이블 훈련",
    "holdTime": {
      "label": "Hold Time 설정",
      "decrease": "-10초",
      "increase": "+10초",
      "min": "최소 시간에 도달했습니다",
      "max": "최대 시간에 도달했습니다"
    },
    "timer": {
      "breathe": "숨 쉬기",
      "hold": "숨 참기",
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
      "breathe": "숨 쉬기: {{time}}",
      "hold": "숨 참기: {{time}}"
    }
  },
  "tts": {
    "breathe": "숨 쉬세요",
    "hold": "참으세요",
    "minutes": {
      "three": "삼분",
      "two": "이분",
      "one": "일분"
    },
    "seconds": {
      "thirty": "삼십초",
      "ten": "십초",
      "five": "오",
      "four": "사",
      "three": "삼",
      "two": "이",
      "one": "일"
    },
    "completed": "훈련 완료"
  }
}
```

**참고**: 전체 번역은 `/src/shared/locales/ko.json`, `/src/shared/locales/en.json` 참조

---

## 5. 검증 기준

### 5.1 데이터 모델
- [ ] Zod 스키마 검증이 정상 동작
- [ ] CO2TableConfig, CO2TableRound, CO2TableSession 타입이 올바르게 추론됨
- [ ] CO2_TABLE_BREATHE_TIMES에 8개 값 정의됨

### 5.2 화면 구현
- [ ] CO₂ 테이블 훈련 화면:
  - [ ] Hold time 조절 기능 (±10초, 범위 0:40-4:00)
  - [ ] 8 라운드 CO₂ 테이블 표시
  - [ ] 타이머 정상 동작 (Breathe → Hold 자동 전환)
  - [ ] Breathe/Hold Progress 바 실시간 업데이트
  - [ ] 일시정지/재개/완료/종료 기능 동작
  - [ ] 총 훈련 시간 계산 및 표시

### 5.3 TTS 음성 안내
- [ ] "Breathe", "Hold" TTS 정확한 타이밍
- [ ] 분 단위 TTS (3:00, 2:00, 1:00)
- [ ] 30초, 10초 TTS
- [ ] 5-1초 카운트다운 TTS
- [ ] 훈련 완료 TTS
- [ ] 일시정지 시 TTS 중단

### 5.4 UI 컴포넌트
- [ ] AlertDialog, Progress 정상 동작
- [ ] NativeWind 스타일링 호환
- [ ] 다크 모드 지원

### 5.5 i18n
- [ ] 모든 UI 텍스트가 i18n 키로 관리됨
- [ ] 한국어(ko) 번역 완료
- [ ] 영어(en) 번역 완료
- [ ] TTS 발화 내용도 다국어 지원

### 5.6 코드 품질
- [ ] TypeScript 컴파일 오류 없음
- [ ] ESLint 오류 없음
- [ ] React Compiler 호환 (수동 메모이제이션 미사용)

---

## 6. 비기능 요구사항

### 6.1 성능
- 타이머 정확도: ±1초 이내
- Progress 바 애니메이션: 부드러운 60fps
- 화면 전환 딜레이: < 300ms
- 백그라운드 타이머 오차: ±5초 이내

### 6.2 접근성
- 모든 버튼에 접근 가능한 레이블
- 타이머 숫자는 큰 폰트 (48px 이상)
- Progress 바는 시각적으로 명확하게 구분
- 색상 대비 WCAG AA 준수

### 6.3 호환성
- iOS 13+ 지원
- Android 5.0+ 지원
- Expo Go 환경에서 테스트

### 6.4 보안
- 사용자 데이터는 로컬에만 저장 (AsyncStorage 또는 Zustand persist)
- 외부 네트워크 요청 없음

---

## 7. 제외 사항

다음 요소들은 **구현하지 않습니다**:

- ❌ 커스텀 CO₂ 테이블 생성 (Breathe 시간 변경, 라운드 수 변경 등)
- ❌ O₂ 테이블 훈련 (산소 테이블)
- ❌ 고급 히스토리 분석 (CO₂ 테이블 진행률 차트, 통계)
- ❌ 진동 피드백 (haptics)
- ❌ 테스트 코드 (별도 PRD에서 추가)

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
- React Native Reusables UI 컴포넌트 우선 사용

### 8.2 CO₂ 테이블이란?

CO₂ 테이블(CO₂ Table)은 프리다이빙에서 사용하는 숨 참기 훈련 방법 중 하나로, **이산화탄소(CO₂) 내성**을 향상시키는 것을 목표로 합니다.

**원리**:
- 호흡 시간(Breathe)을 점진적으로 줄이고, 숨 참기 시간(Hold)은 일정하게 유지
- 호흡 시간이 줄어들면 체내 CO₂ 농도가 점점 높아짐
- 일정한 Hold 시간 동안 높은 CO₂ 농도를 견디는 훈련
- CO₂ 내성이 향상되면 "숨을 쉬고 싶다"는 충동을 더 오래 참을 수 있음

**O₂ 테이블과의 차이**:
- **CO₂ 테이블**: Breathe 시간 감소, Hold 시간 고정 → CO₂ 내성 향상
- **O₂ 테이블**: Breathe 시간 고정, Hold 시간 증가 → 산소 효율 향상

### 8.3 TTS 구현 시 주의사항

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
| 2.0 | 2025-11-05 | 문서 간소화 - 구현 세부사항 제거, 요구사항 중심으로 재구성 | Claude |
