# PRD-01: Skeleton 앱 구현 (프로젝트 설정 검증)

## 문서 정보

- **문서 번호**: PRD-01
- **버전**: 1.0
- **작성일**: 2025-10-30
- **목적**: CLAUDE.md에 정의된 테크 스택 설정 검증을 위한 최소 skeleton 앱 구현

---

## 1. 프로젝트 개요

**Free Diving 101** 프로젝트의 초기 skeleton 앱을 구현합니다. 이 단계의 목적은 비즈니스 로직이나 복잡한 기능을 구현하지 않고, CLAUDE.md에 명시된 테크 스택과 프로젝트 설정이 올바르게 동작하는지 검증하는 것입니다.

### 핵심 목표

- Expo SDK 54+ 프로젝트 초기화 및 설정
- Expo Router 파일 기반 라우팅 검증
- NativeWind + TypeScript 설정 검증
- 4개 탭 화면 기본 구조 구현
- 개발 환경 (Expo Go) 정상 동작 확인

---

## 2. 구현 범위

### 2.1 포함 사항

이 PRD에서는 **최소한의 UI 구조만** 구현합니다:

#### 2.1.1 탭 네비게이션 (4개 탭)

앱은 Expo Router의 탭 레이아웃을 사용하여 4개 화면으로 구성됩니다:

1. **홈/대시보드** (`app/(tabs)/index.tsx`)
   - 화면 중앙에 "홈" 텍스트 표시

2. **이퀄라이징 훈련** (`app/(tabs)/equalizing.tsx`)
   - 화면 중앙에 "이퀄라이징 훈련" 텍스트 표시

3. **CO2 테이블 훈련** (`app/(tabs)/co2-table.tsx`)
   - 화면 중앙에 "CO2 테이블 훈련" 텍스트 표시

4. **히스토리** (`app/(tabs)/history.tsx`)
   - 화면 중앙에 "히스토리" 텍스트 표시

#### 2.1.2 화면 구성

각 탭 화면은 다음과 같은 간단한 구조로 구성됩니다:

```tsx
// 예시: app/(tabs)/index.tsx
import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold">홈</Text>
    </View>
  );
}
```

- 화면 전체를 차지하는 `View` 컨테이너
- 중앙 정렬 (`justify-center items-center`)
- 제목 텍스트만 표시 (각 화면명)
- NativeWind className 사용

#### 2.1.3 레이아웃 설정

**탭 레이아웃** (`app/(tabs)/_layout.tsx`):
- Expo Router의 Tabs 컴포넌트 사용
- 4개 탭 아이콘 및 라벨 설정
- 기본 탭 스타일링 (선택적)

**루트 레이아웃** (`app/_layout.tsx`):
- 앱 전역 설정
- NativeWind 스타일 로드
- 폰트 로드 (선택적)

**404 페이지** (`app/+not-found.tsx`):
- 존재하지 않는 경로 접근 시 표시

### 2.2 제외 사항

다음 요소들은 **구현하지 않습니다**:

- ❌ 비즈니스 로직 (훈련 기능, 타이머 등)
- ❌ 상태 관리 (Zustand 스토어)
- ❌ 데이터 모델 (entities, Zod 스키마)
- ❌ 데이터 저장 (AsyncStorage, persist)
- ❌ API 통신 또는 네트워크 요청
- ❌ 복잡한 UI 컴포넌트 (버튼, 카드 등)
- ❌ features/, widgets/, stores/ 디렉토리
- ❌ 테스트 코드
- ❌ 상세한 스타일링

---

## 3. 기술 스택

CLAUDE.md에 정의된 최신 안정화 버전을 사용합니다:

| 카테고리 | 기술 | 버전 |
|---------|------|------|
| **프레임워크** | Expo SDK | 54+ |
| **언어** | TypeScript | 5.3+ |
| **라우팅** | Expo Router | 4+ |
| **스타일링** | NativeWind | 4.1+ (stable) |
| **린팅** | ESLint | 8.57+ |
| **포맷팅** | Prettier | 3.4+ |

### 3.1 필수 패키지

```json
{
  "dependencies": {
    "expo": "^54.0.0",
    "expo-router": "^4.0.0",
    "react": "18.3.1",
    "react-native": "0.76.5",
    "nativewind": "^4.1.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "@types/react": "~18.3.0",
    "typescript": "~5.3.0",
    "eslint": "^8.57.0",
    "prettier": "^3.4.0"
  }
}
```

### 3.2 필수 설정 파일

- `app.json`: Expo 설정, React Compiler 활성화
- `tsconfig.json`: TypeScript 설정, path alias
- `tailwind.config.js`: Tailwind/NativeWind 설정
- `metro.config.js`: Metro 번들러 설정
- `.eslintrc.js`: ESLint 규칙
- `.prettierrc`: Prettier 설정

---

## 4. 디렉토리 구조

skeleton 앱의 최소 디렉토리 구조:

```
free-diving-101/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx           # 홈/대시보드
│   │   ├── equalizing.tsx      # 이퀄라이징 훈련
│   │   ├── co2-table.tsx       # CO2 테이블 훈련
│   │   ├── history.tsx         # 히스토리
│   │   └── _layout.tsx         # 탭 레이아웃
│   ├── _layout.tsx             # 루트 레이아웃
│   └── +not-found.tsx          # 404 페이지
│
├── docs/
│   └── PRD01-skeleton-app.md   # 이 문서
│
├── assets/                     # 아이콘, 이미지 (선택적)
│
├── global.css                  # NativeWind 전역 스타일
├── tailwind.config.js
├── metro.config.js
├── tsconfig.json
├── app.json
├── package.json
├── .eslintrc.js
├── .prettierrc
├── .gitignore
├── CLAUDE.md
└── README.md
```

**주의**: `src/` 디렉토리는 아직 생성하지 않습니다. 비즈니스 로직이 필요한 다음 PRD에서 생성됩니다.

---

## 5. 구현 요구사항

### 5.1 프로젝트 초기화

```bash
# Expo 프로젝트 생성 (NativeWind + Expo Router 템플릿)
npx rn-new@latest --nativewind --expo-router

# 또는 기존 프로젝트에서
npx create-expo-app@latest -t tabs
```

### 5.2 React Compiler 활성화

`app.json`에 다음 설정 추가:

```json
{
  "expo": {
    "experiments": {
      "reactCompiler": true
    }
  }
}
```

### 5.3 Path Alias 설정

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/entities/*": ["src/entities/*"],
      "@/features/*": ["src/features/*"],
      "@/widgets/*": ["src/widgets/*"],
      "@/shared/*": ["src/shared/*"],
      "@/stores/*": ["src/stores/*"]
    }
  }
}
```

**주의**: 현재 skeleton에서는 `@/*` alias를 사용하지 않지만, 향후 확장을 위해 미리 설정합니다.

### 5.4 탭 화면 구현

각 탭 화면은 동일한 패턴을 따릅니다:

```tsx
import { View, Text } from 'react-native';

export default function ScreenName() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold">[화면 제목]</Text>
    </View>
  );
}
```

### 5.5 탭 레이아웃 구현

`app/(tabs)/_layout.tsx`:

```tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          // 아이콘 추가 가능 (선택적)
        }}
      />
      <Tabs.Screen
        name="equalizing"
        options={{
          title: '이퀄라이징',
        }}
      />
      <Tabs.Screen
        name="co2-table"
        options={{
          title: 'CO2 테이블',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: '히스토리',
        }}
      />
    </Tabs>
  );
}
```

---

## 6. 검증 기준

skeleton 앱이 올바르게 구현되었는지 확인하기 위한 체크리스트:

### 6.1 프로젝트 설정

- [ ] `package.json`에 모든 필수 의존성 설치됨
- [ ] TypeScript 컴파일 오류 없음 (`npx tsc --noEmit`)
- [ ] ESLint 오류 없음 (`npm run lint`)
- [ ] Prettier 설정 적용됨

### 6.2 Expo 실행

- [ ] `npx expo start` 명령어로 개발 서버 정상 실행
- [ ] Expo Go 앱에서 QR 코드 스캔하여 앱 로드
- [ ] 앱이 크래시 없이 정상 실행

### 6.3 탭 네비게이션

- [ ] 4개 탭이 하단에 정상 표시됨
- [ ] 각 탭을 클릭하면 해당 화면으로 이동
- [ ] 각 화면 중앙에 제목 텍스트 정상 표시:
  - 홈: "홈"
  - 이퀄라이징: "이퀄라이징 훈련"
  - CO2 테이블: "CO2 테이블 훈련"
  - 히스토리: "히스토리"

### 6.4 NativeWind 스타일

- [ ] `className` prop이 정상 동작
- [ ] Tailwind CSS 유틸리티 클래스 적용됨
- [ ] 화면 레이아웃 (flex-1, justify-center, items-center) 정상 표시

### 6.5 React Compiler

- [ ] `app.json`에 React Compiler 활성화 설정 확인
- [ ] Metro 번들러 재시작 후 정상 빌드

---

## 7. 개발 워크플로우

### 7.1 초기 설정

```bash
# 1. 프로젝트 생성 (이미 생성된 경우 생략)
cd free-diving-101

# 2. 의존성 설치
npm install

# 3. TypeScript 타입 체크
npx tsc --noEmit

# 4. ESLint 실행
npm run lint

# 5. 개발 서버 시작
npx expo start
```

### 7.2 개발 중

- Expo Go 앱에서 실시간으로 변경사항 확인
- 핫 리로드 활용
- TypeScript 오류 즉시 수정

### 7.3 문제 해결

```bash
# 캐시 제거 후 재시작
npx expo start --clear

# 의존성 재설치
rm -rf node_modules
npm install

# TypeScript 타입 체크
npx tsc --noEmit
```

---

## 8. 비기능 요구사항

### 8.1 성능

- 앱 초기 로딩 시간 < 3초 (Expo Go)
- 탭 전환 시 딜레이 없음

### 8.2 접근성

- 텍스트가 읽기 쉬운 크기 (text-2xl)
- 충분한 대비 (흰색 배경, 검정 텍스트)

### 8.3 호환성

- iOS 13+ 지원
- Android 5.0+ 지원

---

## 9. 제외 사항 (다음 PRD에서 구현)

다음 기능들은 이후 PRD에서 단계적으로 구현됩니다:

- **PRD-02**: entities/ 디렉토리 및 Zod 스키마 정의
- **PRD-03**: 이퀄라이징 훈련 기능 구현
- **PRD-04**: CO2 테이블 훈련 기능 구현
- **PRD-05**: 훈련 기록 기능 구현
- **PRD-06**: React Native Reusables UI 컴포넌트 추가
- **PRD-07**: Zustand 상태 관리 및 영속성
- **PRD-08**: 테스트 코드 작성
- **PRD-09**: 프로덕션 빌드 및 배포

---

## 10. 다음 단계

skeleton 앱 구현 완료 후:

1. **검증 기준 체크리스트 완료**: 모든 항목이 통과하는지 확인
2. **스크린샷 캡처**: 4개 탭 화면 각각의 스크린샷 저장
3. **Git 커밋**:
   ```bash
   git add .
   git commit -m "feat: implement skeleton app with 4 tabs (PRD-01)"
   ```
4. **PRD-02 작성 준비**: entities/ 디렉토리 구조 및 Zod 스키마 설계

---

## 11. 참고사항

### 11.1 CLAUDE.md 준수

이 PRD는 CLAUDE.md의 다음 원칙을 따릅니다:

- Feature-Sliced Design 아키텍처 (향후 확장 준비)
- React Compiler 사용 (수동 메모이제이션 금지)
- NativeWind + React Native Reusables 우선 사용
- TypeScript strict mode
- Expo Router 파일 기반 라우팅

### 11.2 코딩 스타일

- 함수형 컴포넌트 사용
- 명시적 export default
- NativeWind className으로 스타일링
- 한국어 주석 및 변수명 (필요시)

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|-----|------|---------|--------|
| 1.0 | 2025-10-30 | 초안 작성 | Claude |
