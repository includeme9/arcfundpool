import type { PoolStatus } from "@arcfundpool/types";
import { statusLabel } from "@arcfundpool/utils";
import { cn } from "@/lib/cn";

const statusClass: Record<PoolStatus, string> = {
  active: "border-blue-400/30 bg-blue-400/12 text-blue-100",
  funded: "border-emerald-400/30 bg-emerald-400/12 text-emerald-100",
  expired: "border-amber-400/30 bg-amber-400/12 text-amber-100",
  refundable: "border-cyan-400/30 bg-cyan-400/12 text-cyan-100",
  withdrawn: "border-violet-400/30 bg-violet-400/12 text-violet-100",
  cancelled: "border-rose-400/30 bg-rose-400/12 text-rose-100"
};

export function StatusBadge({ status }: { status: PoolStatus }) {
  return (
    <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-semibold", statusClass[status])}>
      {statusLabel(status)}
    </span>
  );
}
