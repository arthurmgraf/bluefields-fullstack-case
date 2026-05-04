import { Card, CardContent } from '@/components/ui/card';
import { RiskBadge } from '@/components/risk-badge';
import type { StartupCardData, RiskLevel } from '@/lib/types';

export function SummaryStats({ startups }: { startups: StartupCardData[] }) {
  const counts = startups.reduce<Record<RiskLevel, number>>(
    (acc, s) => {
      acc[s.risk_level] += 1;
      return acc;
    },
    { green: 0, yellow: 0, red: 0 },
  );

  return (
    <Card>
      <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-2xl font-semibold">{startups.length}</div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Startups</div>
        </div>
        <div className="flex items-center gap-3">
          <Stat label={counts.green} risk="green" />
          <Stat label={counts.yellow} risk="yellow" />
          <Stat label={counts.red} risk="red" />
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, risk }: { label: number; risk: RiskLevel }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xl font-semibold">{label}</span>
      <RiskBadge risk={risk} />
    </div>
  );
}
