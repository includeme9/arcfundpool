import { progressPercent } from "@arcfundpool/utils";

export function PoolProgress({ raised, target }: { raised: number; target: number }) {
  const percent = progressPercent(raised, target);

  return (
    <div className="space-y-2">
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,var(--primary),var(--cyan))]"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
        <span>{percent}% funded</span>
        <span>{target > 0 ? `${Math.max(0, target - raised).toLocaleString("en-US")} USDC remaining` : "No target"}</span>
      </div>
    </div>
  );
}
