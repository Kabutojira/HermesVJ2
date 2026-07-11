interface PerformanceBadgeProps {
  tier: string;
}

export function PerformanceBadge({ tier }: PerformanceBadgeProps) {
  return <span className="perf-badge">quality {tier}</span>;
}
