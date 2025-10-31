import { useState } from 'react';
import type { FrenzelSession } from '@/entities/frenzel-training';

/**
 * useTrainingHistory Hook
 *
 * Provides in-memory training history state and actions.
 * No persistence (AsyncStorage/Zustand) - that will be added in PRD-03.
 * Uses local state only as per PRD02 requirements.
 *
 * @returns Training history state and actions
 */
export function useTrainingHistory() {
  const [sessions, setSessions] = useState<FrenzelSession[]>([]);
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  const addSession = (sessionData: Omit<FrenzelSession, 'id'>): string => {
    const newSession: FrenzelSession = {
      ...sessionData,
      id: crypto.randomUUID(),
    };

    setSessions((prev) => [...prev, newSession]);

    if (newSession.completed) {
      setCompletedDays((prev) =>
        Array.from(new Set([...prev, newSession.dayNumber]))
      );
    }

    return newSession.id;
  };

  const updateSession = (id: string, updates: Partial<FrenzelSession>): void => {
    setSessions((prev) => {
      const updated = prev.map((session) =>
        session.id === id ? { ...session, ...updates } : session
      );

      // Recalculate completed days
      const newCompletedDays = Array.from(
        new Set(
          updated.filter((s) => s.completed).map((s) => s.dayNumber)
        )
      );
      setCompletedDays(newCompletedDays);

      return updated;
    });
  };

  const getSessionsByDay = (dayNumber: number): FrenzelSession[] => {
    return sessions.filter((session) => session.dayNumber === dayNumber);
  };

  const clearHistory = (): void => {
    setSessions([]);
    setCompletedDays([]);
  };

  const startSession = (dayNumber: number): string => {
    return addSession({
      dayNumber,
      startTime: new Date(),
      endTime: null,
      completed: false,
    });
  };

  const completeSession = (sessionId: string, notes?: string): void => {
    updateSession(sessionId, {
      endTime: new Date(),
      completed: true,
      notes,
    });
  };

  const isDayCompleted = (dayNumber: number): boolean => {
    return completedDays.includes(dayNumber);
  };

  const getLatestSessionForDay = (dayNumber: number): FrenzelSession | undefined => {
    const daySessions = getSessionsByDay(dayNumber);
    return daySessions.sort(
      (a, b) => b.startTime.getTime() - a.startTime.getTime()
    )[0];
  };

  return {
    sessions,
    completedDays,
    addSession,
    updateSession,
    getSessionsByDay,
    clearHistory,
    startSession,
    completeSession,
    isDayCompleted,
    getLatestSessionForDay,
  };
}
