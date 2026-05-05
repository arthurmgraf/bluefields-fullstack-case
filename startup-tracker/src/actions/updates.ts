'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CreateUpdateSchema } from '@/lib/schemas';
import type { ActionResult } from '@/lib/types';
import type { Database } from '@/lib/database.types';

type UpdateInsert = Database['public']['Tables']['startup_updates']['Insert'];
type StartupUpdateValues = Database['public']['Tables']['startups']['Update'];

export async function createUpdate(formData: FormData): Promise<ActionResult> {
  const parsed = CreateUpdateSchema.safeParse({
    startup_id: formData.get('startup_id'),
    content: formData.get('content'),
    blockers: formData.get('blockers') ?? '',
    next_steps: formData.get('next_steps') ?? '',
    risk_level: formData.get('risk_level'),
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

  const insertValue: UpdateInsert = {
    startup_id: parsed.data.startup_id,
    author_id: user.id,
    content: parsed.data.content,
    blockers: parsed.data.blockers ?? '',
    next_steps: parsed.data.next_steps ?? '',
    risk_level: parsed.data.risk_level,
  };

  const { error: insertErr } = await supabase.from('startup_updates').insert(insertValue);

  if (insertErr) {
    console.error('createUpdate insert failed:', insertErr.message, {
      startup_id: parsed.data.startup_id,
    });
    return { ok: false, error: 'Erro ao criar update.' };
  }

  // Mirror latest risk + bump updated_at on the parent startup
  const mirrorValue: StartupUpdateValues = {
    risk_level: parsed.data.risk_level,
    updated_at: new Date().toISOString(),
  };

  const { error: updateErr } = await supabase
    .from('startups')
    .update(mirrorValue)
    .eq('id', parsed.data.startup_id);

  if (updateErr) {
    // Update succeeded; mirror failed. Log but don't fail user-facing.
    console.error('createUpdate mirror failed:', updateErr.message, {
      startup_id: parsed.data.startup_id,
    });
  }

  revalidatePath(`/startups/${parsed.data.startup_id}`);
  revalidatePath('/');
  return { ok: true };
}
