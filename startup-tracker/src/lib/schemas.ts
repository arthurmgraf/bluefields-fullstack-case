import { z } from 'zod';

export const RiskLevelEnum = z.enum(['green', 'yellow', 'red']);
export type RiskLevel = z.infer<typeof RiskLevelEnum>;

export const PhaseEnum = z.enum(['ideation', 'validation', 'traction', 'scale']);
export type Phase = z.infer<typeof PhaseEnum>;

export const EmailSchema = z.object({
  email: z.string().email('Email inválido'),
});

export const CreateStartupSchema = z.object({
  name: z.string().min(2, 'Nome muito curto').max(100, 'Máximo 100 caracteres'),
  segment: z.string().min(2).max(60),
  phase: PhaseEnum,
  description: z.string().max(2000).optional().default(''),
});
export type CreateStartupInput = z.infer<typeof CreateStartupSchema>;

export const CreateUpdateSchema = z.object({
  startup_id: z.string().uuid('ID de startup inválido'),
  content: z.string().min(5, 'Conteúdo muito curto').max(5000, 'Máximo 5000 caracteres'),
  blockers: z.string().max(2000).optional().default(''),
  next_steps: z.string().max(2000).optional().default(''),
  risk_level: RiskLevelEnum,
});
export type CreateUpdateInput = z.infer<typeof CreateUpdateSchema>;
