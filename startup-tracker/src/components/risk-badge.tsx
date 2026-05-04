import { cn } from '@/lib/utils';
import { RISK_LABELS, RISK_STYLES } from '@/lib/constants';
import type { RiskLevel } from '@/lib/types';

interface RiskBadgeProps {
  risk: RiskLevel;
  className?: string;
}

export function RiskBadge({ risk, className }: RiskBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        RISK_STYLES[risk],
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'mr-1 h-1.5 w-1.5 rounded-full',
          risk === 'green' && 'bg-emerald-500',
          risk === 'yellow' && 'bg-amber-500',
          risk === 'red' && 'bg-rose-500',
        )}
      />
      {RISK_LABELS[risk]}
    </span>
  );
}
