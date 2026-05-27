import type { LucideIcon } from "lucide-react";

export function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <div className="min-w-0 rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.025))] p-4 shadow-lg shadow-black/10">
      <div className="mb-4 grid size-10 place-items-center rounded-2xl border border-blue-300/15 bg-blue-400/12 text-[var(--primary-strong)]">
        <Icon size={20} />
      </div>
      <p className="break-words text-2xl font-semibold leading-tight text-white">{value}</p>
      <p className="mt-1 text-sm text-[var(--muted)]">{label}</p>
    </div>
  );
}
