# Dependency Management

이 문서는 Expo SDK 54+ 프로젝트의 의존성 관리 가이드입니다.

---

## ⚠️ 필수 준수 사항

Expo 프로젝트의 의존성은 매우 민감하며, 잘못된 설치 방법은 프로젝트 전체를 망가뜨릴 수 있습니다. 아래 규칙을 **반드시** 준수하세요.

---

## 1. 패키지 설치 원칙

### ✅ 올바른 방법

```bash
# Expo SDK 패키지 설치 (권장)
npx expo install [package-name]

# 일반 npm 패키지
npm install [package-name]
```

### ❌ 절대 사용 금지

```bash
# 이 플래그들은 의존성 트리를 파괴합니다
npm install --legacy-peer-deps  # 절대 사용 금지!
npm install --force             # 절대 사용 금지!
```

---

## 2. Expo SDK 54 필수 의존성

다음 패키지는 **반드시** devDependencies 또는 dependencies에 명시되어야 합니다:

### devDependencies (필수)

```json
{
  "babel-preset-expo": "~54.0.6"  // 가장 중요! 없으면 빌드 실패
}
```

### dependencies (SDK 54 표준)

```json
{
  "expo": "~54.0.0",
  "expo-asset": "~12.0.9",
  "expo-router": "~6.0.14",
  "expo-splash-screen": "~31.0.10",
  "expo-status-bar": "~3.0.8",
  "expo-system-ui": "~6.0.8",
  "react": "19.1.0",
  "react-dom": "19.1.0",
  "react-native": "0.81.5",
  "react-native-gesture-handler": "~2.28.0",
  "react-native-reanimated": "~4.1.1",
  "react-native-safe-area-context": "~5.6.0",
  "react-native-screens": "~4.16.0",
  "react-native-web": "~0.21.0"
}
```

---

## 3. 버전 관리 규칙

### ✅ 올바른 버전 지정

- `~54.0.0` - SDK 버전에 맞춰 마이너 업데이트 허용
- `19.1.0` - 정확한 버전 고정

### ❌ 잘못된 버전 지정

- `*` - 절대 사용 금지! 예측 불가능한 버전 설치
- `^54.0.0` - SDK 패키지에는 부적절

---

## 4. 문제 발생 시 복구 절차

의존성 오류가 발생하면 다음 순서로 진행:

```bash
# 1단계: 완전 초기화
rm -rf node_modules package-lock.json

# 2단계: 깨끗한 재설치
npm install

# 3단계: Expo 의존성 검증
npx expo-doctor

# 4단계: 개발 서버 재시작
npx expo start --clear
```

---

## 5. Claude Code 패키지 설치 워크플로우 (필수)

**⚠️ 중요**: Claude Code는 패키지를 설치하기 **전에** 반드시 다음 단계를 따라야 합니다.

### 단계 1: Codex와 상의

```bash
# Background에서 Codex 실행 중인지 확인
# Codex가 package.json 분석 및 누락된 패키지 식별
```

자세한 Codex 사용법은 [Codex 워크플로우](./CODEX_WORKFLOW.md)를 참조하세요.

### 단계 2: Context7 또는 WebSearch로 검증

새 패키지 설치 시:

#### 1. Context7 사용 (우선)

```
mcp__context7__resolve-library-id → 라이브러리 ID 확인
mcp__context7__get-library-docs → 문서 및 호환 버전 확인
```

#### 2. Context7 실패 시 WebSearch 사용

- Expo SDK 54 호환성 검색
- 공식 문서에서 권장 버전 확인
- npm 페이지에서 최신 안정 버전 확인

### 단계 3: 버전 검증

- Expo SDK 패키지: `npx expo install [package]` 사용 (자동 버전 매칭)
- Expo 공식 문서 또는 Context7에서 확인한 버전 사용
- `*` 버전 절대 사용 금지

### 단계 4: 설치 실행

```bash
# Expo SDK 패키지
npx expo install [package-name]

# 일반 npm 패키지 (검증된 버전으로)
npm install [package-name]@[verified-version]
```

### 단계 5: 설치 후 검증

```bash
# 의존성 검증
npx expo-doctor

# TypeScript 타입 체킹
npx tsc --noEmit
```

---

## 6. 예시: i18n 패키지 설치

### ❌ 잘못된 방법

```bash
# 검증 없이 바로 설치
npx expo install expo-localization i18next react-i18next
```

### ✅ 올바른 방법

```bash
# 1. Codex 결과 확인 (background bash 확인)
# 2. Context7/WebSearch로 검증:
#    - expo-localization: ~17.0.7 (SDK 54 bundled)
#    - i18next: latest stable
#    - react-i18next: latest stable
# 3. 검증된 버전으로 설치
npx expo install expo-localization  # Expo가 자동으로 ~17.0.7 설치
npm install i18next@23.16.8 react-i18next@15.1.3
# 4. 검증
npx expo-doctor
```

---

## 7. 새 패키지 추가 시 체크리스트

- [ ] Codex와 상의하여 현재 package.json 상태 확인
- [ ] Context7 또는 WebSearch로 SDK 54 호환 버전 검증
- [ ] `package.json`에 정확한 버전 범위 명시
- [ ] 설치 후 `npx expo-doctor` 실행
- [ ] TypeScript 타입 체킹 실행
- [ ] 개발 서버에서 정상 작동 확인

---

## 8. 금지 사항

### ❌ @expo/vector-icons를 직접 설치하지 마세요

- `expo` 패키지에 이미 포함되어 있습니다
- 직접 설치하면 버전 충돌 발생

### ❌ babel-preset-expo를 삭제하지 마세요

- Babel이 이 preset을 찾지 못하면 빌드가 실패합니다
- devDependencies에 **반드시** 존재해야 합니다

### ❌ `*` 버전을 사용하지 마세요

- 예측 불가능한 버전이 설치됩니다
- 프로덕션 환경에서 문제를 일으킬 수 있습니다

---

## 9. 의존성 업데이트

### Expo SDK 업데이트

```bash
# Expo SDK 전체 업데이트
npx expo install --fix

# 특정 패키지 업데이트
npx expo install [package-name]@latest
```

### 일반 패키지 업데이트

```bash
# 특정 패키지 업데이트
npm install [package-name]@latest

# package.json 버전 범위 내에서 업데이트
npm update
```

---

## 관련 문서

- [Codex 워크플로우](./CODEX_WORKFLOW.md) - Codex를 활용한 패키지 검증
- [Expo 공식 문서](https://docs.expo.dev/) - Expo SDK 호환성 확인
