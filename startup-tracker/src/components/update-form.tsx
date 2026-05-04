'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createUpdate } from '@/actions/updates';
import { RISK_LABELS } from '@/lib/constants';
import type { RiskLevel } from '@/lib/types';

const RISK_OPTIONS: RiskLevel[] = ['green', 'yellow', 'red'];

export function UpdateForm({ startupId }: { startupId: string }) {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  function onSubmit(formData: FormData) {
    setFormError(null);
    setFieldErrors({});
    startTransition(async () => {
      const result = await createUpdate(formData);
      if (!result.ok) {
        setFormError(result.error);
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        return;
      }
      // Reset form on success
      const form = document.getElementById('update-form') as HTMLFormElement | null;
      form?.reset();
    });
  }

  return (
    <form id="update-form" action={onSubmit} className="space-y-3 rounded-lg border p-4 bg-card">
      <h2 className="font-semibold">Novo update</h2>
      <input type="hidden" name="startup_id" value={startupId} />

      <Field label="Progresso *" error={fieldErrors.content?.[0]}>
        <Textarea
          name="content"
          required
          rows={3}
          placeholder="O que aconteceu desde o último update?"
        />
      </Field>

      <Field label="Bloqueios" error={fieldErrors.blockers?.[0]}>
        <Input name="blockers" placeholder="Algo travando? (opcional)" />
      </Field>

      <Field label="Próximos passos" error={fieldErrors.next_steps?.[0]}>
        <Input name="next_steps" placeholder="Plano para o próximo período (opcional)" />
      </Field>

      <Field label="Risco *" error={fieldErrors.risk_level?.[0]}>
        <select
          name="risk_level"
          required
          defaultValue="green"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {RISK_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {RISK_LABELS[r]}
            </option>
          ))}
        </select>
      </Field>

      {formError && (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Enviando…' : 'Salvar update'}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
