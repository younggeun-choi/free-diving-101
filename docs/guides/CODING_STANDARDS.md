# Coding Standards

이 문서는 Free Diving 101 프로젝트의 코딩 표준과 베스트 프랙티스를 정의합니다.

---

## TypeScript

### 기본 원칙

- **항상 TypeScript strict mode 사용**
- `any` 타입 피하기; 타입이 정말 알 수 없는 경우 `unknown` 사용
- 함수의 명시적 반환 타입 정의
- 명확한 경우 변수에 타입 추론 사용

### 예시

```typescript
// ✅ 좋음
function calculateDuration(start: Date, end: Date): number {
  return end.getTime() - start.getTime();
}

// ❌ 나쁨
function calculateDuration(start, end) {
  return end.getTime() - start.getTime();
}
```

---

## Zod 스키마

### 원칙

- `entities/`에 모든 데이터 모델을 Zod 스키마로 정의
- 런타임 검증에 Zod 사용
- 스키마에서 TypeScript 타입 추론

### 예시

```typescript
// src/entities/dive/model.ts
import { z } from 'zod';

export const DiveSchema = z.object({
  id: z.string().uuid(),
  date: z.date(),
  depth: z.number().positive(),
  duration: z.number().positive(),
});

// src/entities/dive/types.ts
import { z } from 'zod';
import { DiveSchema } from './model';

export type Dive = z.infer<typeof DiveSchema>;
```

---

## Zustand 스토어

### 원칙

- 앱 재시작 후에도 유지되어야 하는 데이터에 persist 미들웨어 사용
- 스토어를 특정 도메인에 집중
- 명확한 액션 메서드 정의

### 예시

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TrainingState {
  completedDays: number[];
  completeDay: (day: number) => void;
}

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set) => ({
      completedDays: [],
      completeDay: (day) => set((state) => ({
        completedDays: [...state.completedDays, day],
      })),
    }),
    {
      name: 'training-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

---

## React Native Reusables

### 원칙

- **항상 React Native Reusables 컴포넌트 우선 사용**
- **React Native 기본 컴포넌트 대신 React Native Reusables 사용 필수**
  - ❌ `import { Text } from 'react-native'` (사용 금지)
  - ✅ `import { Text } from '@/shared/ui/text'` (올바름)
- 가능한 경우 CLI를 사용하여 컴포넌트 설치
- 컴포넌트를 `src/shared/ui/`에 배치
- NativeWind 클래스로 커스터마이징

### 컴포넌트 설치

```bash
# CLI를 사용하여 컴포넌트 설치 (올바른 공식 CLI)
npx @react-native-reusables/cli@latest add button
npx @react-native-reusables/cli@latest add text

# 또는 shadcn CLI 사용 (일부 컴포넌트)
npx shadcn add button card
```

**중요**: `npx react-native-reusables` 또는 `npx rnr`은 작동하지 않습니다. 반드시 `npx @react-native-reusables/cli@latest`를 사용하세요.

### 올바른 사용법

```tsx
// ✅ 올바른 사용 (React Native Reusables)
import { View } from 'react-native';
import { Text } from '@/shared/ui/text';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

export function TrainingCard() {
  return (
    <Card className="p-4 m-2">
      <Text variant="h3">훈련 제목</Text>
      <Text variant="p" className="mt-2">
        훈련 설명
      </Text>
      <Button className="bg-primary mt-4">
        <Text variant="small">훈련 시작</Text>
      </Button>
    </Card>
  );
}

// ❌ 잘못된 사용 (React Native 기본 컴포넌트)
import { View, Text } from 'react-native'; // Text 사용 금지!
```

### Text 컴포넌트 Variants

- `h1`, `h2`, `h3`, `h4`: 제목
- `p`: 본문
- `large`: 큰 텍스트
- `small`: 작은 텍스트
- `muted`: 흐린 텍스트
- `code`: 코드 스타일
- `blockquote`: 인용구
- `lead`: 리드 텍스트

---

## NativeWind 스타일링

### 원칙

- 스타일링에 NativeWind className 사용
- Tailwind utility-first 접근 방식 따르기
- 다크 모드 변형에 dark: 접두사 사용

### 예시

```tsx
import { View } from 'react-native';
import { Text } from '@/shared/ui/text';

export function Header() {
  return (
    <View className="bg-white dark:bg-black p-4">
      <Text className="text-xl font-bold text-black dark:text-white">
        Free Diving 101
      </Text>
    </View>
  );
}
```

---

## React Compiler

Expo SDK 54+부터 React Compiler를 공식 지원합니다. React Compiler는 컴포넌트와 훅을 자동으로 메모이제이션하여 성능을 최적화합니다.

### 활성화 방법 (SDK 54+)

`app.json`에 다음 설정만 추가하면 됩니다:

```json
{
  "expo": {
    "experiments": {
      "reactCompiler": true
    }
  }
}
```

**SDK 54+부터는 Babel이 자동으로 구성되어 별도 패키지 설치가 필요 없습니다.**

### 주요 원칙

1. **자동 최적화**: React Compiler가 자동으로 메모이제이션 수행
2. **수동 메모이제이션 금지**: `useMemo`와 `useCallback` 수동 사용 지양
3. **컴파일러 우선**: 수동 최적화는 컴파일러와 충돌하여 오히려 성능 저하 및 오작동 유발

### 올바른 사용법

```tsx
// ✅ 좋음: React Compiler에 맡기기
function ProductList({ products }) {
  const sortedProducts = products.sort((a, b) => a.price - b.price);

  return (
    <FlatList
      data={sortedProducts}
      renderItem={({ item }) => <ProductCard product={item} />}
    />
  );
}
```

```tsx
// ❌ 나쁨: 수동 메모이제이션 (React Compiler와 충돌)
function ProductList({ products }) {
  const sortedProducts = useMemo(
    () => products.sort((a, b) => a.price - b.price),
    [products]
  );

  const renderItem = useCallback(
    ({ item }) => <ProductCard product={item} />,
    []
  );

  return <FlatList data={sortedProducts} renderItem={renderItem} />;
}
```

### 특정 컴포넌트 최적화 제외

컴파일러 최적화가 문제를 일으키는 경우에만 `'use no memo'` 디렉티브 사용:

```tsx
function SpecialComponent() {
  'use no memo'; // 이 컴포넌트만 최적화 제외

  // 특별한 로직...
  return <View>...</View>;
}
```

### 주의사항

- Metro 번들러를 재시작해야 Babel 설정 변경사항이 반영됨
- 기존 `useMemo`/`useCallback` 코드는 단계적으로 제거 권장
- 성능 문제가 발생하면 React DevTools Profiler로 확인 후 `'use no memo'` 사용 고려

---

## 테스팅

### 유닛 테스트

- features/의 비즈니스 로직 테스트
- Zod 스키마 검증 테스트
- Zustand 스토어 액션 테스트

```typescript
// __tests__/entities/dive.test.ts
import { DiveSchema } from '@/entities/dive/model';

describe('Dive Schema Validation', () => {
  it('올바른 dive 데이터 검증', () => {
    const validDive = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      date: new Date(),
      depth: 30,
      duration: 45,
    };

    expect(() => DiveSchema.parse(validDive)).not.toThrow();
  });

  it('음수 깊이 거부', () => {
    const invalidDive = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      date: new Date(),
      depth: -10,
      duration: 45,
    };

    expect(() => DiveSchema.parse(invalidDive)).toThrow();
  });
});
```

### 컴포넌트 테스트

- React Native Testing Library 사용
- 사용자 상호작용 테스트
- 접근성 테스트

---

## 성능 최적화

### 원칙

- **React Compiler 활성화** (`app.json`에서 `experiments.reactCompiler: true` 설정)
- React Compiler가 자동으로 메모이제이션 최적화 수행
- **수동 useMemo/useCallback 사용 금지** (컴파일러와 충돌하여 오작동 가능)
- 최적화 제외가 필요한 특정 컴포넌트에만 `'use no memo'` 디렉티브 사용
- Expo Router의 자동 코드 스플리팅으로 화면 지연 로딩
- 적절한 키와 가상화로 FlatList/ScrollView 최적화

---

## 관련 문서

- [아키텍처](./ARCHITECTURE.md) - FSD 원칙 및 프로젝트 구조
- [다국어 지원](./I18N.md) - i18next 사용법
- [의존성 관리](./DEPENDENCIES.md) - Expo SDK 패키지 관리
