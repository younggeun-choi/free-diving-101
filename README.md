# Free Diving 101

초보 프리다이버를 위한 모바일 훈련 애플리케이션

## 프로젝트 개요

Free Diving 101은 초보 프리다이버를 위해 설계된 모바일 훈련 애플리케이션입니다. 이 앱은 사용자가 필수 프리다이빙 기술을 개발할 수 있도록 체계적인 훈련 프로그램을 제공합니다.

### 핵심 기능

1. **이퀄라이징 훈련**: 일일 운동이 포함된 7일 단계별 훈련 스케줄
2. **CO2 테이블 훈련**: 커스터마이징 가능한 CO2 테이블을 사용한 숨 참기 훈련
3. **훈련 기록**: 완료 이력 및 진행 통계 추적

## 기술 스택

- **프레임워크**: Expo SDK 52+
- **언어**: TypeScript 5.3+
- **라우팅**: Expo Router 4+
- **스타일링**: NativeWind 4.1+ (Tailwind CSS for React Native)
- **린팅**: ESLint 8.57+
- **포맷팅**: Prettier 3.4+

## 시작하기

### 필수 요구사항

- Node.js 18 이상
- npm 또는 yarn
- Expo Go 앱 (iOS/Android)

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npx expo start
```

### 개발

```bash
# TypeScript 타입 체크
npm run type-check

# ESLint 실행
npm run lint

# 코드 포맷팅
npm run format
```

## 프로젝트 구조

```
free-diving-101/
├── app/                     # Expo Router (파일 기반 라우팅)
│   ├── (tabs)/              # 탭 네비게이션 화면
│   │   ├── index.tsx        # 홈/대시보드
│   │   ├── equalizing.tsx   # 이퀄라이징 훈련
│   │   ├── co2-table.tsx    # CO2 테이블 훈련
│   │   ├── history.tsx      # 히스토리
│   │   └── _layout.tsx      # 탭 레이아웃
│   ├── _layout.tsx          # 루트 레이아웃
│   └── +not-found.tsx       # 404 페이지
├── docs/                    # 문서
│   └── PRD01-skeleton-app.md
├── assets/                  # 정적 리소스
├── global.css               # NativeWind 전역 스타일
└── CLAUDE.md                # 개발 가이드
```

## 개발 가이드

자세한 개발 가이드는 [CLAUDE.md](./CLAUDE.md)를 참조하세요.

## 라이선스

MIT
