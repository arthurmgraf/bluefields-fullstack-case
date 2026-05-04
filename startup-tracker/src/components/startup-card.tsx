import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RiskBadge } from '@/components/risk-badge';
import { PHASE_LABELS } from '@/lib/constants';
import { formatRelativeTime } from '@/lib/utils';
import type { StartupCardData } from '@/lib/types';

export function StartupCard({ startup }: { startup: StartupCardData }) {
  return (
    <Link
      href={`/startups/${startup.id}`}
      className="block transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
    >
      <Card className="hover:shadow-md transition-shadow h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-1">{startup.name}</CardTitle>
            <RiskBadge risk={startup.risk_level} />
          </div>
          <p className="text-sm text-muted-foreground">{startup.segment}</p>
        </CardHeader>
        <CardContent className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Fase: <span className="text-foreground">{PHASE_LABELS[startup.phase]}</span></span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Resp.: <span className="text-foreground">{startup.responsible_name ?? '—'}</span>
            </span>
            <span title={startup.updated_at}>
              Atualizada {formatRelativeTime(startup.updated_at)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
