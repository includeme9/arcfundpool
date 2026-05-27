export function LoadingState({ label = "Loading onchain state" }: { label?: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
        <span className="size-3 animate-pulse rounded-full bg-[var(--cyan)]" />
        {label}
      </div>
    </div>
  );
}
