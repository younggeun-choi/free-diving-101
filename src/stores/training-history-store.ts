import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';
import type { TrainingSession } from '@/entities/training-record';
import { TrainingSessionSchema } from '@/entities/training-record';

/**
 * Training History Store
 *
 * 통합 훈련 히스토리 스토어 (프렌젤 + CO₂ 테이블)
 * AsyncStorage를 통한 데이터 영속성 지원
 *
 * @returns Training history state and actions
 */

interface TrainingHistoryState {
  sessions: TrainingSession[];

  // 세션 추가
  addSession: (sessionData: Omit<TrainingSession, 'id'>) => string;

  // 세션 업데이트
  updateSession: (id: string, updates: Partial<TrainingSession>) => void;

  // 타입별 필터링
  getFrenzelSessions: () => TrainingSession[];
  getCO2Sessions: () => TrainingSession[];

  // 전체 기록 삭제
  clearHistory: () => void;
}

const useTrainingHistoryStore = create<TrainingHistoryState>()(
  persist(
    (set, get) => ({
      sessions: [],

      addSession: (sessionData) => {
        // ID 추가 후 런타임 검증 (discriminated union 타입 보장)
        const validated = TrainingSessionSchema.parse({
          ...sessionData,
          id: randomUUID(),
        });

        set((state) => ({
          sessions: [...state.sessions, validated],
        }));

        return validated.id;
      },

      updateSession: (id, updates) => {
        set((state) => ({
          sessions: state.sessions.map((session) => {
            if (session.id === id) {
              const updated = { ...session, ...updates };
              // 런타임 검증: 업데이트된 세션이 스키마에 맞는지 확인
              return TrainingSessionSchema.parse(updated);
            }
            return session;
          }),
        }));
      },

      getFrenzelSessions: () => {
        return get().sessions.filter((s) => s.type === 'frenzel');
      },

      getCO2Sessions: () => {
        return get().sessions.filter((s) => s.type === 'co2-table');
      },

      clearHistory: () => {
        set({ sessions: [] });
      },
    }),
    {
      name: 'training-history-storage',
      storage: createJSONStorage(() => AsyncStorage, {
        // 날짜 직렬화/역직렬화 처리
        replacer: (_key: string, value: unknown) => {
          if (value instanceof Date) {
            return value.toISOString();
          }
          return value;
        },
        reviver: (_key: string, value: unknown) => {
          // ISO 날짜 문자열을 Date 객체로 복원
          if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
            return new Date(value);
          }
          return value;
        },
      }),
    }
  )
);

export function useTrainingHistory() {
  return useTrainingHistoryStore();
}
