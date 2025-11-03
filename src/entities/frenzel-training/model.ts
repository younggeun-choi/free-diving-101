import { z } from 'zod';

/**
 * 프렌젤 훈련 Day 스키마
 */
export const FrenzelDaySchema = z.object({
  dayNumber: z.number().int().min(1).max(10),
  title: z.string().min(1),
  goal: z.string().min(1),
  durationMinutes: z.number().positive(),
  steps: z.array(z.string().min(1)).nonempty(),
  successCriteria: z.string().min(1),
});

/**
 * 프렌젤 훈련 세션 스키마
 */
export const FrenzelSessionSchema = z.object({
  id: z.string().uuid(),
  dayNumber: z.number().int().min(1).max(10),
  startTime: z.date(),
  endTime: z.date().nullable(),
  completed: z.boolean(),
  notes: z.string().optional(),
});

/**
 * 훈련 프로그램 전체 스키마
 */
export const FrenzelTrainingProgramSchema = z.object({
  overview: z.string().min(1),
  principle: z.string().min(1),
  comparison: z.string().min(1),
  schedule: z.array(FrenzelDaySchema).length(10),
});
