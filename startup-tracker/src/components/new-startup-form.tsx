'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createStartup } from '@/actions/startups';
import { PHASE_LABELS } from '@/lib/constants';
import type { Phase } from '@/lib/types';

const PHASE_OPTIONS: Phase[] = ['ideation', 'validation', 'traction', 'scale'];

export function NewStartupForm() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  function onSubmit(formData: FormData) {
    setFormError(null);
    setFieldErrors({});
    startTransition(async () => {
      const result = await createStartup(formData);
      if (!result.ok) {
        setFormError(result.error);
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        return;
      }
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        + Nova startup
      </Button>
    );
  }

  return (
    <form action={onSubmit} className="space-y-3 rounded-lg border p-4 bg-card">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Nova startup</h2>
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
      </div>

      <div className="space-y-1.5">
        <Label>Nome *</Label>
        <Input name="name" required placeholder="Ex.: Trilha" />
        {fieldErrors.name?.[0] && <p className="text-xs text-destructive">{fieldErrors.name[0]}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Segmento *</Label>
          <Input name="segment" required placeholder="Ex.: Edtech" />
          {fieldErrors.segment?.[0] && <p className="text-xs text-destructive">{fieldErrors.segment[0]}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Fase *</Label>
          <select
            name="phase"
            required
            defaultValue="validation"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {PHASE_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {PHASE_LABELS[p]}
              </option>
            ))}
          </select>
          {fieldErrors.phase?.[0] && <p className="text-xs text-destructive">{fieldErrors.phase[0]}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Descrição</Label>
        <Textarea name="description" rows={2} placeholder="Tese da startup em uma frase (opcional)" />
      </div>

      {formError && <p role="alert" className="text-sm text-destructive">{formError}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Criando…' : 'Criar startup'}
      </Button>
    </form>
  );
}
