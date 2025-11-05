import { z } from 'zod';

/**
 * 훈련 타입 Enum
 */
export const TrainingTypeSchema = z.enum(['frenzel', 'co2-table']);

/**
 * 프렌젤 세션 메타데이터
 */
export const FrenzelSessionMetaSchema = z.object({
  dayNumber: z.number().int().min(1).max(10),
  // dayTitle은 dayNumber로부터 재구성 가능하므로 저장하지 않음
});

/**
 * CO₂ 테이블 세션 메타데이터
 */
export const CO2TableSessionMetaSchema = z.object({
  holdTimeSeconds: z.number().positive(), // HOLD 시간 (초)
  breathTimeSeconds: z.number().positive(), // 호흡 시간 (초)
  cycles: z.number().int().positive(), // 사이클 수
});

/**
 * 공통 세션 필드
 */
const BaseSessionSchema = z.object({
  id: z.string().uuid(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  completed: z.boolean(),
  notes: z.string().optional(),
});

/**
 * 통합 훈련 세션 스키마 (루트 레벨 discriminated union)
 * type과 meta가 항상 일치하도록 보장
 */
export const TrainingSessionSchema = z.discriminatedUnion('type', [
  BaseSessionSchema.extend({
    type: z.literal('frenzel'),
    meta: FrenzelSessionMetaSchema,
  }),
  BaseSessionSchema.extend({
    type: z.literal('co2-table'),
    meta: CO2TableSessionMetaSchema,
  }),
]);
