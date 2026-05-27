import type { LucideIcon } from "lucide-react";

export function EmptyState({ title, message, icon: Icon }: { title: string; message: string; icon: LucideIcon }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/16 bg-white/[0.03] p-8 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-white/10 text-[var(--cyan)]">
        <Icon size={22} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">{message}</p>
    </div>
  );
}
