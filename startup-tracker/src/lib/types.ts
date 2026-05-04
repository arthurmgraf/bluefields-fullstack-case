import type { RiskLevel, Phase } from '@/lib/schemas';
import type { StartupRow, StartupUpdateRow, ProfileRow } from '@/lib/database.types';

export type { RiskLevel, Phase };

export interface StartupCardData {
  id: string;
  name: string;
  segment: string;
  phase: Phase;
  risk_level: RiskLevel;
  responsible_name: string | null;
  updated_at: string;
}

export interface StartupDetail extends StartupCardData {
  description: string | null;
  founded_at: string | null;
}

export interface StartupUpdateView {
  id: string;
  content: string;
  blockers: string;
  next_steps: string;
  risk_level: RiskLevel;
  created_at: string;
  author_name: string | null;
}

export type ActionResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export type { StartupRow, StartupUpdateRow, ProfileRow };
