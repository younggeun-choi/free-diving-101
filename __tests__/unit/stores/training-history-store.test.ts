import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTrainingHistory, useTrainingHistoryStore } from '@/stores/training-history-store';
import type { TrainingSession } from '@/entities/training-record';

// Mock data
const mockFrenzelSession: Omit<TrainingSession, 'id'> = {
  type: 'frenzel',
  startTime: new Date('2025-01-01T10:00:00Z'),
  endTime: new Date('2025-01-01T10:10:00Z'),
  completed: true,
  meta: {
    dayNumber: 1,
  },
};

const mockCO2Session: Omit<TrainingSession, 'id'> = {
  type: 'co2-table',
  startTime: new Date('2025-01-01T11:00:00Z'),
  endTime: new Date('2025-01-01T11:30:00Z'),
  completed: true,
  meta: {
    holdTimeSeconds: 90,
    breathTimeSeconds: 120,
    cycles: 8,
  },
};

describe('useTrainingHistory', () => {
  beforeEach(async () => {
    // Clear AsyncStorage mock
    await AsyncStorage.clear();
    jest.clearAllMocks();

    // Reset Zustand store state
    const { result } = renderHook(() => useTrainingHistory());
    act(() => {
      result.current.clearHistory();
    });
  });

  describe('addSession', () => {
    it('프렌젤 세션을 추가하고 UUID를 반환', () => {
      const { result } = renderHook(() => useTrainingHistory());

      let sessionId: string = '';
      act(() => {
        sessionId = result.current.addSession(mockFrenzelSession);
      });

      expect(sessionId).toBeDefined();
      expect(typeof sessionId).toBe('string');
      expect(result.current.sessions).toHaveLength(1);
      expect(result.current.sessions[0].type).toBe('frenzel');
      expect(result.current.sessions[0].id).toBe(sessionId);
    });

    it('CO₂ 세션을 추가', () => {
      const { result } = renderHook(() => useTrainingHistory());

      act(() => {
        result.current.addSession(mockCO2Session);
      });

      expect(result.current.sessions).toHaveLength(1);
      expect(result.current.sessions[0].type).toBe('co2-table');
    });

    it('여러 세션을 추가하면 최신순으로 정렬', () => {
      const { result } = renderHook(() => useTrainingHistory());

      let id1: string, id2: string, id3: string;

      act(() => {
        id1 = result.current.addSession(mockFrenzelSession);
        id2 = result.current.addSession(mockCO2Session);
        id3 = result.current.addSession({
          ...mockFrenzelSession,
          meta: { dayNumber: 2 },
        });
      });

      expect(result.current.sessions).toHaveLength(3);
      // 최신 세션이 먼저 (reverse chronological)
      expect(result.current.sessions[0].id).toBe(id3);
      expect(result.current.sessions[1].id).toBe(id2);
      expect(result.current.sessions[2].id).toBe(id1);
    });

    it('유효하지 않은 세션 데이터는 에러', () => {
      const { result } = renderHook(() => useTrainingHistory());

      const invalidSession = {
        type: 'frenzel',
        startTime: new Date('2025-01-01T10:00:00Z'),
        endTime: new Date('2025-01-01T10:10:00Z'),
        completed: true,
        meta: {
          dayNumber: 11, // ❌ 범위 초과
        },
      } as any;

      expect(() => {
        act(() => {
          result.current.addSession(invalidSession);
        });
      }).toThrow();
    });

    it('notes 필드가 있는 세션 추가', () => {
      const { result } = renderHook(() => useTrainingHistory());

      act(() => {
        result.current.addSession({
          ...mockFrenzelSession,
          notes: '첫 훈련 완료!',
        });
      });

      expect(result.current.sessions[0].notes).toBe('첫 훈련 완료!');
    });
  });

  describe('updateSession', () => {
    it('세션의 notes를 업데이트', () => {
      const { result } = renderHook(() => useTrainingHistory());

      let sessionId: string;
      act(() => {
        sessionId = result.current.addSession(mockFrenzelSession);
      });

      act(() => {
        result.current.updateSession(sessionId, {
          notes: '업데이트된 노트',
        });
      });

      const updatedSession = result.current.sessions.find((s) => s.id === sessionId);
      expect(updatedSession?.notes).toBe('업데이트된 노트');
    });

    it('세션의 completed 상태를 업데이트', () => {
      const { result } = renderHook(() => useTrainingHistory());

      let sessionId: string;
      act(() => {
        sessionId = result.current.addSession({
          ...mockFrenzelSession,
          completed: false,
        });
      });

      act(() => {
        result.current.updateSession(sessionId, {
          completed: true,
        });
      });

      const updatedSession = result.current.sessions.find((s) => s.id === sessionId);
      expect(updatedSession?.completed).toBe(true);
    });

    it('존재하지 않는 ID로 업데이트하면 변화 없음', () => {
      const { result } = renderHook(() => useTrainingHistory());

      act(() => {
        result.current.addSession(mockFrenzelSession);
      });

      const beforeLength = result.current.sessions.length;

      act(() => {
        result.current.updateSession('non-existent-id', {
          notes: 'test',
        });
      });

      expect(result.current.sessions).toHaveLength(beforeLength);
    });

    it('유효하지 않은 업데이트는 스키마 검증 에러', () => {
      const { result } = renderHook(() => useTrainingHistory());

      let sessionId: string;
      act(() => {
        sessionId = result.current.addSession(mockFrenzelSession);
      });

      expect(() => {
        act(() => {
          result.current.updateSession(sessionId, {
            meta: {
              dayNumber: 11, // ❌ 범위 초과
            },
          } as any);
        });
      }).toThrow();
    });
  });

  describe('getFrenzelSessions', () => {
    it('프렌젤 세션만 필터링', () => {
      const { result } = renderHook(() => useTrainingHistory());

      act(() => {
        result.current.addSession(mockFrenzelSession);
        result.current.addSession(mockCO2Session);
        result.current.addSession({
          ...mockFrenzelSession,
          meta: { dayNumber: 2 },
        });
      });

      const frenzelSessions = result.current.getFrenzelSessions();

      expect(frenzelSessions).toHaveLength(2);
      frenzelSessions.forEach((session) => {
        expect(session.type).toBe('frenzel');
      });
    });

    it('프렌젤 세션이 없으면 빈 배열', () => {
      const { result } = renderHook(() => useTrainingHistory());

      act(() => {
        result.current.addSession(mockCO2Session);
      });

      const frenzelSessions = result.current.getFrenzelSessions();
      expect(frenzelSessions).toHaveLength(0);
    });

    it('최신순으로 정렬 (endTime 기준)', () => {
      const { result } = renderHook(() => useTrainingHistory());

      act(() => {
        result.current.addSession({
          ...mockFrenzelSession,
          endTime: new Date('2025-01-01T10:00:00Z'),
          meta: { dayNumber: 1 },
        });
        result.current.addSession({
          ...mockFrenzelSession,
          endTime: new Date('2025-01-02T10:00:00Z'),
          meta: { dayNumber: 2 },
        });
        result.current.addSession({
          ...mockFrenzelSession,
          endTime: new Date('2025-01-03T10:00:00Z'),
          meta: { dayNumber: 3 },
        });
      });

      const sessions = result.current.getFrenzelSessions();

      expect(sessions[0].meta.dayNumber).toBe(3); // 최신
      expect(sessions[1].meta.dayNumber).toBe(2);
      expect(sessions[2].meta.dayNumber).toBe(1); // 가장 오래된
    });
  });

  describe('getCO2Sessions', () => {
    it('CO₂ 세션만 필터링', () => {
      const { result } = renderHook(() => useTrainingHistory());

      act(() => {
        result.current.addSession(mockFrenzelSession);
        result.current.addSession(mockCO2Session);
        result.current.addSession({
          ...mockCO2Session,
          meta: {
            holdTimeSeconds: 100,
            breathTimeSeconds: 120,
            cycles: 8,
          },
        });
      });

      const co2Sessions = result.current.getCO2Sessions();

      expect(co2Sessions).toHaveLength(2);
      co2Sessions.forEach((session) => {
        expect(session.type).toBe('co2-table');
      });
    });

    it('CO₂ 세션이 없으면 빈 배열', () => {
      const { result } = renderHook(() => useTrainingHistory());

      act(() => {
        result.current.addSession(mockFrenzelSession);
      });

      const co2Sessions = result.current.getCO2Sessions();
      expect(co2Sessions).toHaveLength(0);
    });

    it('최신순으로 정렬 (endTime 기준)', () => {
      const { result } = renderHook(() => useTrainingHistory());

      act(() => {
        result.current.addSession({
          ...mockCO2Session,
          endTime: new Date('2025-01-01T10:00:00Z'),
          meta: { holdTimeSeconds: 80, breathTimeSeconds: 120, cycles: 8 },
        });
        result.current.addSession({
          ...mockCO2Session,
          endTime: new Date('2025-01-02T10:00:00Z'),
          meta: { holdTimeSeconds: 90, breathTimeSeconds: 120, cycles: 8 },
        });
      });

      const sessions = result.current.getCO2Sessions();

      expect(sessions[0].meta.holdTimeSeconds).toBe(90); // 최신
      expect(sessions[1].meta.holdTimeSeconds).toBe(80);
    });
  });

  describe('clearHistory', () => {
    it('모든 세션을 삭제', () => {
      const { result } = renderHook(() => useTrainingHistory());

      act(() => {
        result.current.addSession(mockFrenzelSession);
        result.current.addSession(mockCO2Session);
      });

      expect(result.current.sessions).toHaveLength(2);

      act(() => {
        result.current.clearHistory();
      });

      expect(result.current.sessions).toHaveLength(0);
    });

    it('빈 상태에서 clearHistory 호출해도 에러 없음', () => {
      const { result } = renderHook(() => useTrainingHistory());

      expect(() => {
        act(() => {
          result.current.clearHistory();
        });
      }).not.toThrow();

      expect(result.current.sessions).toHaveLength(0);
    });
  });

  describe('AsyncStorage 영속성', () => {
    it('세션 추가 시 AsyncStorage에 저장', async () => {
      const { result } = renderHook(() => useTrainingHistory());

      act(() => {
        result.current.addSession(mockFrenzelSession);
      });

      // AsyncStorage.setItem이 호출되었는지 확인
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('clearHistory 시 AsyncStorage도 업데이트', async () => {
      const { result } = renderHook(() => useTrainingHistory());

      act(() => {
        result.current.addSession(mockFrenzelSession);
      });

      jest.clearAllMocks();

      act(() => {
        result.current.clearHistory();
      });

      // AsyncStorage.setItem이 호출되어 빈 상태 저장
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('날짜 직렬화/역직렬화', () => {
    it('Date 객체가 ISO 문자열로 직렬화', () => {
      const { result } = renderHook(() => useTrainingHistory());

      act(() => {
        result.current.addSession(mockFrenzelSession);
      });

      const session = result.current.sessions[0];
      expect(session.startTime).toBeInstanceOf(Date);
      expect(session.endTime).toBeInstanceOf(Date);
    });

    it('ISO 문자열이 Date 객체로 역직렬화', async () => {
      // AsyncStorage에서 복원된 데이터 시뮬레이션
      const storedData = {
        state: {
          sessions: [
            {
              id: 'test-uuid-123',
              type: 'frenzel',
              startTime: '2025-01-01T10:00:00.000Z',
              endTime: '2025-01-01T10:10:00.000Z',
              completed: true,
              meta: { dayNumber: 1 },
            },
          ],
        },
        version: 0,
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(storedData));

      await act(async () => {
        await useTrainingHistoryStore.persist.rehydrate();
      });

      const { result } = renderHook(() => useTrainingHistory());

      await waitFor(() => {
        expect(result.current.sessions.length).toBeGreaterThan(0);
      });

      expect(result.current.sessions[0].startTime).toBeInstanceOf(Date);
      expect(result.current.sessions[0].endTime).toBeInstanceOf(Date);
    });
  });

  describe('엣지 케이스', () => {
    it('동시에 여러 세션 추가', () => {
      const { result } = renderHook(() => useTrainingHistory());

      act(() => {
        result.current.addSession(mockFrenzelSession);
        result.current.addSession(mockCO2Session);
        result.current.addSession({
          ...mockFrenzelSession,
          meta: { dayNumber: 2 },
        });
      });

      expect(result.current.sessions).toHaveLength(3);
    });

    it('동일한 dayNumber를 가진 프렌젤 세션 여러 개 추가 가능', () => {
      const { result } = renderHook(() => useTrainingHistory());

      act(() => {
        result.current.addSession(mockFrenzelSession);
        result.current.addSession(mockFrenzelSession);
      });

      const frenzelSessions = result.current.getFrenzelSessions();
      expect(frenzelSessions).toHaveLength(2);
      expect(frenzelSessions[0].meta.dayNumber).toBe(1);
      expect(frenzelSessions[1].meta.dayNumber).toBe(1);
    });

    it('completed: false인 세션도 추가 가능', () => {
      const { result } = renderHook(() => useTrainingHistory());

      act(() => {
        result.current.addSession({
          ...mockFrenzelSession,
          completed: false,
        });
      });

      expect(result.current.sessions[0].completed).toBe(false);
    });

    it('빈 notes로 세션 추가', () => {
      const { result } = renderHook(() => useTrainingHistory());

      act(() => {
        result.current.addSession({
          ...mockFrenzelSession,
          notes: '',
        });
      });

      expect(result.current.sessions[0].notes).toBe('');
    });
  });
});
