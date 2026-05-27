import type { LucideIcon } from "lucide-react";

export function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <div className="min-w-[170px] rounded-3xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-4 grid size-10 place-items-center rounded-2xl bg-blue-400/12 text-[var(--primary-strong)]">
        <Icon size={20} />
      </div>
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-sm text-[var(--muted)]">{label}</p>
    </div>
  );
}
