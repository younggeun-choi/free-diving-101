import { z } from 'zod';

/**
 * CO2 테이블 Hold time 설정 스키마
 */
export const CO2TableConfigSchema = z.object({
  holdTimeSeconds: z.number().int().min(40).max(240), // 0:40 ~ 4:00
});

/**
 * CO2 테이블 라운드 스키마
 */
export const CO2TableRoundSchema = z.object({
  roundNumber: z.number().int().min(1).max(8),
  breatheSeconds: z.number().int().positive(),
  holdSeconds: z.number().int().positive(),
});

/**
 * CO2 테이블 세션 스키마
 */
export const CO2TableSessionSchema = z.object({
  id: z.string().uuid(),
  startTime: z.date(),
  endTime: z.date().nullable(),
  completed: z.boolean(),
  holdTimeSeconds: z.number().int().min(40).max(240), // 훈련 시작 시 설정된 Hold time
  notes: z.string().optional(),
});
