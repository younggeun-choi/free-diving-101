# Development Guides

이 폴더는 Free Diving 101 프로젝트의 개발 가이드를 포함합니다.

---

## 가이드 목록

### [Architecture](./ARCHITECTURE.md)
프로젝트 아키텍처 및 설계 원칙

- Feature-Sliced Design (FSD)
- 프로젝트 구조
- 의존성 규칙
- Path Alias
- 상태 관리 원칙

**언제 읽어야 하나요?**
- 새로운 기능을 추가할 때
- 코드 구조에 대한 의문이 생길 때
- 파일을 어디에 배치해야 할지 모를 때

---

### [Dependencies Management](./DEPENDENCIES.md)
Expo SDK 54 의존성 관리 가이드

- 패키지 설치 원칙
- Expo SDK 필수 의존성
- 버전 관리 규칙
- 문제 발생 시 복구 절차
- Claude Code 패키지 설치 워크플로우

**언제 읽어야 하나요?**
- 새 패키지를 설치하기 전
- 의존성 오류가 발생했을 때
- Expo SDK를 업데이트할 때

---

### [Coding Standards](./CODING_STANDARDS.md)
코딩 표준 및 베스트 프랙티스

- TypeScript 규칙
- Zod 스키마 사용법
- Zustand 스토어 패턴
- React Native Reusables 사용법
- NativeWind 스타일링
- React Compiler 가이드
- 테스팅 가이드라인

**언제 읽어야 하나요?**
- 코드를 작성하기 전
- 코드 리뷰를 받기 전
- 성능 최적화가 필요할 때

---

### [Internationalization](./I18N.md)
다국어 지원 가이드

- i18next 설정 및 사용법
- 번역 추가 방법
- 새 언어 추가 방법
- TTS (Text-to-Speech) 통합
- 트러블슈팅

**언제 읽어야 하나요?**
- 새로운 UI 텍스트를 추가할 때
- 번역을 업데이트할 때
- 새 언어를 추가할 때
- TTS 기능을 사용할 때

---

### [Codex Workflow](./CODEX_WORKFLOW.md)
Claude Code의 Codex 활용 워크플로우

- Codex 사용 시기
- Codex 실행 방법
- 리소스 관리
- 사용 예시
- 통합 워크플로우

**언제 읽어야 하나요?**
- 패키지 설치 전 검증이 필요할 때
- 코드 리뷰가 필요할 때
- 복잡한 이슈를 분석할 때

---

## 빠른 참조

### 새 기능 추가 체크리스트

1. [ ] [PRD 작성](../requirements/) - 요구사항 문서화
2. [ ] [아키텍처 확인](./ARCHITECTURE.md) - FSD 원칙 준수
3. [ ] [의존성 관리](./DEPENDENCIES.md) - 필요한 패키지 설치
4. [ ] [코딩 표준](./CODING_STANDARDS.md) - 코드 작성 규칙 준수
5. [ ] [i18n 추가](./I18N.md) - 번역 텍스트 추가
6. [ ] [Codex 리뷰](./CODEX_WORKFLOW.md) - 코드 품질 검증
7. [ ] 테스트 작성
8. [ ] 문서 업데이트

### 일반적인 작업

| 작업 | 참조 문서 |
|------|-----------|
| UI 컴포넌트 추가 | [Coding Standards](./CODING_STANDARDS.md#react-native-reusables) |
| 상태 관리 | [Architecture](./ARCHITECTURE.md#상태-관리-원칙) |
| 스타일링 | [Coding Standards](./CODING_STANDARDS.md#nativewind-스타일링) |
| 번역 추가 | [I18N](./I18N.md#새-번역-추가) |
| 패키지 설치 | [Dependencies](./DEPENDENCIES.md#claude-code-패키지-설치-워크플로우) |
| 성능 최적화 | [Coding Standards](./CODING_STANDARDS.md#react-compiler) |

---

## 관련 문서

- [제품 요구사항](../requirements/) - PRD 문서
- [CLAUDE.md](../../CLAUDE.md) - 프로젝트 개요 및 빠른 시작
