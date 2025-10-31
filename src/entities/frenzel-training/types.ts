import { z } from 'zod';
import {
  FrenzelDaySchema,
  FrenzelSessionSchema,
  FrenzelTrainingProgramSchema,
} from './model';

export type FrenzelDay = z.infer<typeof FrenzelDaySchema>;
export type FrenzelSession = z.infer<typeof FrenzelSessionSchema>;
export type FrenzelTrainingProgram = z.infer<typeof FrenzelTrainingProgramSchema>;
