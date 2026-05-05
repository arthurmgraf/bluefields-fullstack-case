'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CreateStartupSchema } from '@/lib/schemas';
import type {
  ActionResult,
  StartupCardData,
  StartupDetail,
  StartupUpdateView,
  Phase,
  RiskLevel,
} from '@/lib/types';
import type { Database } from '@/lib/database.types';

type StartupInsert = Database['public']['Tables']['startups']['Insert'];

interface UpdateRowWithAuthor {
  id: string;
  content: string;
  blockers: string;
  next_steps: string;
  risk_level: string;
  created_at: string;
  profiles: { full_name: string | null } | null;
}

export async function listStartups(): Promise<StartupCardData[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('startups')
    .select('id, name, segment, phase, risk_level, updated_at, profiles:responsible_id(full_name)')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('listStartups failed:', error.message);
    throw new Error('Não foi possível carregar as startups.');
  }

  return (data ?? []).map((row) => {
    // PostgREST returns the FK target as a single object for many-to-one;
    // the loosely-typed client infers it as an array, so we cast through unknown.
    const profile = row.profiles as unknown as { full_name: string | null } | null;
    return {
      id: row.id,
      name: row.name,
      segment: row.segment,
      phase: row.phase as Phase,
      risk_level: row.risk_level as RiskLevel,
      responsible_name: profile?.full_name ?? null,
      updated_at: row.updated_at,
    };
  });
}

export async function getStartup(
  id: string,
): Promise<{ startup: StartupDetail; updates: StartupUpdateView[] } | null> {
  const supabase = await createClient();

  const { data: startup, error: sErr } = await supabase
    .from('startups')
    .select(
      'id, name, segment, phase, risk_level, description, founded_at, updated_at, profiles:responsible_id(full_name)',
    )
    .eq('id', id)
    .maybeSingle();

  if (sErr) {
    console.error('getStartup failed:', sErr.message, { id });
    throw new Error('Erro ao carregar startup.');
  }
  if (!startup) return null;

  const { data: updates, error: uErr } = await supabase
    .from('startup_updates')
    .select('id, content, blockers, next_steps, risk_level, created_at, profiles:author_id(full_name)')
    .eq('startup_id', id)
    .order('created_at', { ascending: false })
    .returns<UpdateRowWithAuthor[]>();

  if (uErr) {
    console.error('getStartup updates failed:', uErr.message, { id });
    throw new Error('Erro ao carregar updates.');
  }

  const profile = startup.profiles as unknown as { full_name: string | null } | null;

  return {
    startup: {
      id: startup.id,
      name: startup.name,
      segment: startup.segment,
      phase: startup.phase as Phase,
      risk_level: startup.risk_level as RiskLevel,
      description: startup.description,
      founded_at: startup.founded_at,
      responsible_name: profile?.full_name ?? null,
      updated_at: startup.updated_at,
    },
    updates: (updates ?? []).map((u) => ({
      id: u.id,
      content: u.content,
      blockers: u.blockers,
      next_steps: u.next_steps,
      risk_level: u.risk_level as RiskLevel,
      created_at: u.created_at,
      author_name: u.profiles?.full_name ?? null,
    })),
  };
}

export async function createStartup(formData: FormData): Promise<ActionResult> {
  const parsed = CreateStartupSchema.safeParse({
    name: formData.get('name'),
    segment: formData.get('segment'),
    phase: formData.get('phase'),
    description: formData.get('description') ?? '',
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: 'Dados inválidos.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const insertValue: StartupInsert = {
    name: parsed.data.name,
    segment: parsed.data.segment,
    phase: parsed.data.phase,
    description: parsed.data.description,
    responsible_id: user.id,
  };

  const { error } = await supabase.from('startups').insert(insertValue);

  if (error) {
    console.error('createStartup failed:', error.message);
    return { ok: false, error: 'Erro ao criar startup.' };
  }

  revalidatePath('/');
  return { ok: true };
}
