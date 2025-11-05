# Product Requirements

이 폴더는 Free Diving 101의 제품 요구사항 문서(PRD)를 포함합니다.

---

## 문서 목록

### [PRD01: Skeleton App](./PRD01-skeleton-app.md)
- 프로젝트 초기 구조 및 기본 설정
- Expo SDK 54 환경 구성
- 기본 네비게이션 구조

### [PRD02: Frenzel Training](./PRD02-frenzel-training.md)
- 프렌젤 이퀄라이징 훈련 기능
- 10일 단계별 훈련 프로그램
- 훈련 진행 추적 및 완료 기록

### [PRD03: CO₂ Table Training](./PRD03-co2-table-training.md)
- CO₂ 테이블 기반 숨 참기 훈련
- 커스터마이징 가능한 훈련 설정
- 실시간 타이머 및 음성 안내
- 훈련 기록 및 통계

### [PRD04: Unified Training History](./PRD04-unified-training-history.md)
- 프렌젤 + CO₂ 훈련 기록 통합 관리
- 최신순 타임라인 표시
- AsyncStorage 데이터 영속성
- 향후 대시보드 확장 기반

### [What is Frenzel?](./what-is-frenzel.md)
- 프렌젤 이퀄라이징 기법 설명
- 생리학적 원리
- 프리다이빙에서의 중요성

---

## 기능 개발 프로세스

새로운 기능을 추가할 때는 다음 단계를 따릅니다:

1. **PRD 작성**: 이 폴더에 새로운 PRD 문서 작성
2. **설계 검토**: 아키텍처 및 기술 스택 적합성 확인
3. **구현**: [개발 가이드](../guides/)를 참고하여 구현
4. **테스트**: 요구사항 충족 여부 검증
5. **문서 업데이트**: PRD 및 관련 문서 최신화

---

## 관련 문서

- [개발 가이드](../guides/) - 아키텍처, 코딩 표준, 워크플로우
- [CLAUDE.md](../../CLAUDE.md) - 프로젝트 개요 및 빠른 시작
