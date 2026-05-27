import { formatNumber, progressPercent } from "@arcfundpool/utils";

export function PoolProgress({ raised, target, compact = false }: { raised: number; target: number; compact?: boolean }) {
  const percent = progressPercent(raised, target);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-white">{percent}% funded</span>
        {!compact && (
          <span className="text-xs text-[var(--muted)]">
            {target > 0 ? `${formatNumber(Math.max(0, target - raised), 0)} USDC remaining` : "No target"}
          </span>
        )}
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10 shadow-inner">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,var(--primary),var(--cyan))]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
