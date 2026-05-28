import { formatUSDC, poolFundingMath } from "@arcfundpool/utils";

export function PoolProgress({ raised, target, compact = false }: { raised: number; target: number; compact?: boolean }) {
  const { progress, remaining } = poolFundingMath(raised, target);

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <span className="shrink-0 text-sm font-semibold text-white">{progress}% funded</span>
        {!compact && (
          <span className="min-w-0 text-right text-xs text-[var(--muted)]">
            {target > 0 ? `${formatUSDC(remaining, 0)} remaining` : "No target"}
          </span>
        )}
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10 shadow-inner">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,var(--primary),var(--cyan))]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
