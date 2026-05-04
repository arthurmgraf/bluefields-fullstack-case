import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RiskBadge } from '@/components/risk-badge';
import { UpdateForm } from '@/components/update-form';
import { UpdateTimeline } from '@/components/update-timeline';
import { getStartup } from '@/actions/startups';
import { PHASE_LABELS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StartupDetailPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getStartup(id);

  if (!result) notFound();
  const { startup, updates } = result;

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link href="/">← Voltar para o portfólio</Link>
      </Button>

      <header className="space-y-2">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h1 className="text-3xl font-semibold tracking-tight">{startup.name}</h1>
          <RiskBadge risk={startup.risk_level} />
        </div>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <Item term="Segmento" def={startup.segment} />
          <Item term="Fase" def={PHASE_LABELS[startup.phase]} />
          <Item term="Responsável" def={startup.responsible_name ?? '—'} />
          <Item term="Fundada em" def={startup.founded_at ? formatDate(startup.founded_at) : '—'} />
        </dl>
        {startup.description && (
          <p className="text-sm text-muted-foreground pt-2">{startup.description}</p>
        )}
      </header>

      <UpdateForm startupId={startup.id} />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Histórico de updates</h2>
        <UpdateTimeline updates={updates} />
      </section>
    </main>
  );
}

function Item({ term, def }: { term: string; def: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{term}</dt>
      <dd className="text-foreground">{def}</dd>
    </div>
  );
}
