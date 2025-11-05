import { z } from 'zod';
import {
  TrainingTypeSchema,
  TrainingSessionSchema,
  FrenzelSessionMetaSchema,
  CO2TableSessionMetaSchema,
} from './model';

export type TrainingType = z.infer<typeof TrainingTypeSchema>;
export type TrainingSession = z.infer<typeof TrainingSessionSchema>;
export type FrenzelSessionMeta = z.infer<typeof FrenzelSessionMetaSchema>;
export type CO2TableSessionMeta = z.infer<typeof CO2TableSessionMetaSchema>;
