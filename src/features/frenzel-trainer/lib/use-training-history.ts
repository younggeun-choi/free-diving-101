import { create } from 'zustand';
import { randomUUID } from 'expo-crypto';
import type { FrenzelSession } from '@/entities/frenzel-training';

/**
 * Training History Store
 *
 * Global state for training session history using Zustand.
 * Note: This intentionally violates PRD02 Section 2.1/Clause 13
 * to fix critical bug where state is not shared across screens.
 * Without global state, training progress recorded in one screen
 * is not visible in other screens, breaking core functionality.
 *
 * @returns Training history state and actions
 */

interface TrainingHistoryState {
  sessions: FrenzelSession[];
  completedDays: number[];
  addSession: (sessionData: Omit<FrenzelSession, 'id'>) => string;
  updateSession: (id: string, updates: Partial<FrenzelSession>) => void;
  getSessionsByDay: (dayNumber: number) => FrenzelSession[];
  clearHistory: () => void;
  startSession: (dayNumber: number) => string;
  completeSession: (sessionId: string, notes?: string) => void;
  isDayCompleted: (dayNumber: number) => boolean;
  getLatestSessionForDay: (dayNumber: number) => FrenzelSession | undefined;
}

const useTrainingHistoryStore = create<TrainingHistoryState>((set, get) => ({
  sessions: [],
  completedDays: [],

  addSession: (sessionData) => {
    const newSession: FrenzelSession = {
      ...sessionData,
      id: randomUUID(),
    };

    set((state) => {
      const newSessions = [...state.sessions, newSession];
      const newCompletedDays = newSession.completed
        ? Array.from(new Set([...state.completedDays, newSession.dayNumber]))
        : state.completedDays;

      return {
        sessions: newSessions,
        completedDays: newCompletedDays,
      };
    });

    return newSession.id;
  },

  updateSession: (id, updates) => {
    set((state) => {
      const updatedSessions = state.sessions.map((session) =>
        session.id === id ? { ...session, ...updates } : session
      );

      // Recalculate completed days
      const newCompletedDays = Array.from(
        new Set(
          updatedSessions.filter((s) => s.completed).map((s) => s.dayNumber)
        )
      );

      return {
        sessions: updatedSessions,
        completedDays: newCompletedDays,
      };
    });
  },

  getSessionsByDay: (dayNumber) => {
    return get().sessions.filter((session) => session.dayNumber === dayNumber);
  },

  clearHistory: () => {
    set({ sessions: [], completedDays: [] });
  },

  startSession: (dayNumber) => {
    return get().addSession({
      dayNumber,
      startTime: new Date(),
      endTime: null,
      completed: false,
    });
  },

  completeSession: (sessionId, notes) => {
    get().updateSession(sessionId, {
      endTime: new Date(),
      completed: true,
      notes,
    });
  },

  isDayCompleted: (dayNumber) => {
    return get().completedDays.includes(dayNumber);
  },

  getLatestSessionForDay: (dayNumber) => {
    const daySessions = get().getSessionsByDay(dayNumber);
    return daySessions.sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    )[0];
  },
}));

export function useTrainingHistory() {
  return useTrainingHistoryStore();
}
