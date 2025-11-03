import { z } from 'zod';
import {
  CO2TableConfigSchema,
  CO2TableRoundSchema,
  CO2TableSessionSchema,
} from './model';

export type CO2TableConfig = z.infer<typeof CO2TableConfigSchema>;
export type CO2TableRound = z.infer<typeof CO2TableRoundSchema>;
export type CO2TableSession = z.infer<typeof CO2TableSessionSchema>;
