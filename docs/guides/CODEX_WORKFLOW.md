# Codex Workflow

이 문서는 Claude Code가 OpenAI Codex를 활용하는 워크플로우를 설명합니다.

---

## 개요

Claude Code는 OpenAI Codex를 활용하여 코드 분석, 패키지 검증, 복잡한 이슈 해결을 수행할 수 있습니다.

---

## Codex 사용 시기

### 1. 패키지 설치 전 검증 (필수)

- `package.json` 상태 분석
- 누락된 의존성 식별
- SDK 호환성 확인

### 2. 코드 리뷰 (권장)

- 기능 구현 후 코드 품질 검증
- 아키텍처 원칙 준수 확인
- 타입 안전성 및 베스트 프랙티스 검토

### 3. 복잡한 이슈 분석 (권장)

- 런타임 에러 원인 파악
- 플랫폼별 이슈 해결
- 성능 병목 지점 식별

---

## Codex 실행 방법

### 기본 명령어

```bash
# Background에서 Codex 실행 (비동기)
echo "분석할 내용 및 질문..." | codex exec \
  --skip-git-repo-check \
  -m gpt-5-codex \
  --config model_reasoning_effort="medium" \
  --sandbox read-only \
  --full-auto \
  2>/dev/null
```

### 실행 후 결과 확인

```bash
# 1. BashOutput으로 결과 확인
BashOutput(bash_id)

# 2. status: completed 확인 후 반드시 프로세스 종료
KillShell(shell_id)
```

---

## 리소스 관리 (필수)

**⚠️ 중요**: Codex 실행 후 반드시 프로세스를 정리해야 합니다.

### 프로세스 정리 절차

1. `BashOutput`으로 결과 확인
2. `status: completed` 확인 후 `KillShell`로 프로세스 종료
3. 여러 Codex 프로세스 실행 시 각각 개별적으로 종료

### 올바른 예시

```bash
# ✅ 올바른 예: 프로세스 종료까지 완료
BashOutput(bash_id)  # 결과 확인
# status: completed 확인
KillShell(shell_id)  # 프로세스 종료
```

### 잘못된 예시

```bash
# ❌ 잘못된 예: 프로세스를 종료하지 않음
BashOutput(bash_id)  # 결과만 확인하고 끝
```

---

## 사용 예시

### 예시 1: 패키지 설치 전 검증

```bash
echo "Analyze package.json and identify missing dependencies for i18n implementation.
Check Expo SDK 54 compatibility." | codex exec --skip-git-repo-check \
-m gpt-5-codex --config model_reasoning_effort="medium" \
--sandbox read-only --full-auto 2>/dev/null
```

**목적:**
- `package.json` 분석
- i18n 구현에 필요한 누락된 패키지 식별
- Expo SDK 54와의 호환성 확인

### 예시 2: 코드 리뷰

```bash
echo "Review src/features/frenzel-trainer implementation.
Criteria: React Compiler compliance, TypeScript strict mode, i18n usage,
FSD architecture." | codex exec --skip-git-repo-check \
-m gpt-5-codex --config model_reasoning_effort="medium" \
--sandbox read-only --full-auto 2>/dev/null
```

**목적:**
- 코드 품질 검증
- 아키텍처 원칙 준수 확인
- React Compiler 호환성 검토
- TypeScript strict mode 준수 검증

### 예시 3: 런타임 에러 분석

```bash
echo "Analyze runtime error: ReferenceError: Property 'crypto' doesn't exist.
File: use-training-history.ts:36
Environment: React Native (Expo SDK 54)
Provide solution with Expo-compatible UUID generation." | codex exec \
--skip-git-repo-check -m gpt-5-codex \
--config model_reasoning_effort="medium" \
--sandbox read-only --full-auto 2>/dev/null
```

**목적:**
- 런타임 에러 원인 파악
- React Native 환경 특성 고려
- Expo-compatible 솔루션 제시

---

## Codex 플래그 설명

| 플래그 | 설명 |
|--------|------|
| `--skip-git-repo-check` | Git 저장소 확인 건너뛰기 |
| `-m gpt-5-codex` | GPT-5 Codex 모델 사용 |
| `--config model_reasoning_effort="medium"` | 중간 수준의 추론 노력 |
| `--sandbox read-only` | 읽기 전용 샌드박스 (분석만 수행) |
| `--full-auto` | 완전 자동 모드 |
| `2>/dev/null` | 표준 에러 출력 억제 |

---

## 주의사항

### 1. Background 실행 필수

- Codex는 항상 background에서 실행
- 긴 분석 작업이 완료될 때까지 다른 작업 가능

### 2. 프로세스 정리

- 결과 확인 후 반드시 `KillShell` 실행
- 리소스 누수 방지

### 3. 여러 프로세스 관리

- 동시에 여러 Codex 실행 시 각각 개별 관리
- 각 프로세스의 `bash_id`와 `shell_id`를 추적

### 4. Read-only 샌드박스

- `--sandbox read-only`로 분석만 수행
- 파일 수정 방지

---

## 통합 워크플로우

### 패키지 설치 전 검증 프로세스

1. **Codex 실행**: Background에서 `package.json` 분석 시작
2. **Context7/WebSearch**: 패키지 호환성 검증
3. **결과 확인**: `BashOutput`으로 Codex 결과 확인
4. **프로세스 종료**: `KillShell`로 정리
5. **패키지 설치**: 검증된 버전으로 설치
6. **검증**: `npx expo-doctor` 실행

자세한 패키지 설치 워크플로우는 [의존성 관리](./DEPENDENCIES.md)를 참조하세요.

---

## 관련 문서

- [의존성 관리](./DEPENDENCIES.md) - 패키지 설치 워크플로우
- [아키텍처](./ARCHITECTURE.md) - FSD 원칙 및 코드 리뷰 기준
- [코딩 표준](./CODING_STANDARDS.md) - 코드 품질 기준
