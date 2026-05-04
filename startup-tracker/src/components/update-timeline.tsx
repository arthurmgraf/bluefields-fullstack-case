import { Card, CardContent } from '@/components/ui/card';
import { RiskBadge } from '@/components/risk-badge';
import { formatDate } from '@/lib/utils';
import type { StartupUpdateView } from '@/lib/types';

export function UpdateTimeline({ updates }: { updates: StartupUpdateView[] }) {
  if (updates.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          Nenhum update ainda. Use o formulário acima para registrar o primeiro.
        </CardContent>
      </Card>
    );
  }

  return (
    <ol className="space-y-3">
      {updates.map((u) => (
        <li key={u.id}>
          <Card>
            <CardContent className="p-4 space-y-3">
              <header className="flex items-start justify-between gap-2 flex-wrap">
                <div className="text-sm">
                  <span className="font-medium">{u.author_name ?? 'Usuário'}</span>
                  <span className="text-muted-foreground"> · {formatDate(u.created_at)}</span>
                </div>
                <RiskBadge risk={u.risk_level} />
              </header>
              <Field label="Progresso" value={u.content} />
              {u.blockers && <Field label="Bloqueios" value={u.blockers} />}
              {u.next_steps && <Field label="Próximos passos" value={u.next_steps} />}
            </CardContent>
          </Card>
        </li>
      ))}
    </ol>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <p className="text-sm whitespace-pre-wrap">{value}</p>
    </div>
  );
}
