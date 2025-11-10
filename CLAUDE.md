# Free Diving 101

이 파일은 이 저장소에서 작업할 때 Claude Code (claude.ai/code)에게 가이드를 제공합니다.

---

## 프로젝트 개요

**Free Diving 101**은 초보 프리다이버를 위해 설계된 모바일 훈련 애플리케이션입니다.

### 핵심 기능

1. **프렌젤 훈련**: 10일 단계별 이퀄라이징 훈련 프로그램
2. **CO₂ 테이블 훈련**: 커스터마이징 가능한 숨 참기 훈련
3. **훈련 기록**: 완료 이력 및 진행 통계 추적

---

## 기술 스택

- **프레임워크**: Expo SDK 54+
- **언어**: TypeScript 5.3+
- **라우팅**: Expo Router 4+ (파일 기반 라우팅)
- **상태 관리**: Zustand 5+ (AsyncStorage 영속성)
- **스키마 검증**: Zod 3.23+
- **UI**: NativeWind 4.1+ + React Native Reusables
- **테스팅**: Jest 29.7+ with React Native Testing Library
- **배포**: EAS Build

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

## 📚 문서

프로젝트의 상세 문서는 주제별로 분리되어 있습니다:

### 제품 요구사항 (Product Requirements)

제품 기능 명세 및 요구사항은 [docs/requirements/](./docs/requirements/)에서 관리됩니다.

- [전체 개요](./docs/requirements/README.md)
- [PRD01: Skeleton App](./docs/requirements/PRD01-skeleton-app.md)
- [PRD02: Frenzel Training](./docs/requirements/PRD02-frenzel-training.md)
- [PRD03: CO₂ Table Training](./docs/requirements/PRD03-co2-table-training.md)
- [PRD04: Unified Training History](./docs/requirements/PRD04-unified-training-history.md)
- [PRD05: Home Dashboard & Progress](./docs/requirements/PRD05-home-dashboard.md)
- [What is Frenzel?](./docs/requirements/what-is-frenzel.md)

### 개발 가이드 (Development Guides)

개발 관련 가이드는 [docs/guides/](./docs/guides/)에서 제공됩니다.

- [전체 가이드 인덱스](./docs/guides/README.md)
- [아키텍처](./docs/guides/ARCHITECTURE.md) - FSD, 프로젝트 구조, 의존성 규칙
- [의존성 관리](./docs/guides/DEPENDENCIES.md) - Expo SDK 패키지 설치 및 관리
- [코딩 표준](./docs/guides/CODING_STANDARDS.md) - TypeScript, Zod, React Compiler
- [다국어 지원](./docs/guides/I18N.md) - i18next 사용법
- [테스팅](./docs/guides/TESTING.md) - Jest, 테스트 패턴, Mock 전략
- [Codex 워크플로우](./docs/guides/CODEX_WORKFLOW.md) - Codex 활용 가이드

---

## 빠른 시작

### 1. 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npx expo start

# 기기에서 Expo Go 앱으로 QR 코드 스캔
```

### 2. 프로젝트 구조 파악

프로젝트는 Feature-Sliced Design (FSD) 원칙을 따릅니다:

```
free-diving-101/
├── app/                    # Expo Router (파일 기반 라우팅)
├── src/
│   ├── entities/           # 비즈니스 엔티티 (Zod 스키마)
│   ├── features/           # 기능 모듈 (UI + 로직)
│   ├── widgets/            # 복합 UI 블록
│   ├── shared/             # 공유 유틸리티 & UI 컴포넌트
│   └── stores/             # Zustand 전역 스토어
├── docs/
│   ├── requirements/       # PRD 문서
│   └── guides/             # 개발 가이드
└── __tests__/              # 테스트 파일
```

자세한 구조는 [아키텍처 가이드](./docs/guides/ARCHITECTURE.md)를 참조하세요.

### 3. 개발 워크플로우

1. **요구사항 확인**: [docs/requirements/](./docs/requirements/)에서 PRD 검토
2. **아키텍처 이해**: [아키텍처 가이드](./docs/guides/ARCHITECTURE.md) 참조
3. **코딩 표준 준수**: [코딩 표준](./docs/guides/CODING_STANDARDS.md) 준수
4. **패키지 설치**: [의존성 관리](./docs/guides/DEPENDENCIES.md) 가이드 따르기
5. **번역 추가**: [i18n 가이드](./docs/guides/I18N.md) 참조
6. **테스트 작성**: [테스팅 가이드](./docs/guides/TESTING.md) 참조
7. **코드 리뷰**: [Codex 워크플로우](./docs/guides/CODEX_WORKFLOW.md) 활용

---

## 중요 원칙

### 기능 구현

- **PRD 문서 없이 기능 구현 금지**
- 항상 `docs/requirements/`에 PRD를 먼저 작성하거나 업데이트
- 복잡한 기능을 작고 테스트 가능한 단위로 분해
- 기능을 점진적으로 한 번에 하나씩 구현

### 의존성 관리

- **Expo SDK 패키지**: `npx expo install [package]` 사용
- **일반 npm 패키지**: `npm install [package]` 사용
- **절대 금지**: `--legacy-peer-deps`, `--force` 플래그 사용
- 패키지 설치 전 반드시 [의존성 관리 가이드](./docs/guides/DEPENDENCIES.md) 참조

### UI 컴포넌트

- **React Native Reusables가 기본 UI 라이브러리**
- React Native 기본 `Text` 대신 `@/shared/ui/text` 사용
- 모든 스타일링에 NativeWind 사용
- 컴포넌트 설치: `npx @react-native-reusables/cli@latest add [component]`

### 성능

- **React Compiler 활성화** (`app.json`에서 `experiments.reactCompiler: true`)
- **수동 useMemo/useCallback 사용 금지** (컴파일러와 충돌)
- React Compiler가 자동으로 메모이제이션 수행

---

## 일반 작업

### 새 기능 추가

1. `docs/requirements/`에 PRD 문서화
2. `src/entities/`에 Zod 스키마 정의
3. `src/features/`에 UI와 로직 구축
4. 필요시 `src/stores/`에 Zustand 스토어 생성
5. `app/`에 화면 추가
6. `__tests__/`에 테스트 작성

### UI 컴포넌트 추가

```bash
# React Native Reusables 컴포넌트 설치
npx @react-native-reusables/cli@latest add button
npx @react-native-reusables/cli@latest add text
npx @react-native-reusables/cli@latest add card
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
2. [개발 가이드](./docs/guides/) 검토
3. [제품 요구사항](./docs/requirements/) 검토
4. 공식 문서 참조 (위 링크)
5. 코드베이스의 기존 코드 패턴 확인
