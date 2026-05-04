import type { Phase, RiskLevel } from '@/lib/schemas';

export const PHASE_LABELS: Record<Phase, string> = {
  ideation: 'Ideação',
  validation: 'Validação',
  traction: 'Tração',
  scale: 'Escala',
};

export const RISK_LABELS: Record<RiskLevel, string> = {
  green: 'Saudável',
  yellow: 'Atenção',
  red: 'Em risco',
};

export const RISK_STYLES: Record<RiskLevel, string> = {
  green: 'bg-emerald-100 text-emerald-800 ring-emerald-600/20',
  yellow: 'bg-amber-100 text-amber-800 ring-amber-600/20',
  red: 'bg-rose-100 text-rose-800 ring-rose-600/20',
};

export const SEGMENT_SUGGESTIONS = [
  'Fintech',
  'Healthtech',
  'Edtech',
  'Agtech',
  'Foodtech',
  'Retailtech',
  'Logtech',
  'Insurtech',
  'Proptech',
  'B2B SaaS',
] as const;
