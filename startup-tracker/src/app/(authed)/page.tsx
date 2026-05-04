import { listStartups } from '@/actions/startups';
import { StartupCard } from '@/components/startup-card';
import { SummaryStats } from '@/components/summary-stats';
import { NewStartupForm } from '@/components/new-startup-form';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const startups = await listStartups();

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Portfólio</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe progresso, risco e próximos passos.
          </p>
        </div>
        <NewStartupForm />
      </div>

      <SummaryStats startups={startups} />

      {startups.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          Nenhuma startup cadastrada ainda. Use “+ Nova startup” para começar.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {startups.map((s) => (
            <StartupCard key={s.id} startup={s} />
          ))}
        </div>
      )}
    </main>
  );
}
