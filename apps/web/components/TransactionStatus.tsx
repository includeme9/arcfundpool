import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import type { TransactionStatus as TxStatus } from "@arcfundpool/types";

const meta = {
  pending: { icon: Clock3, label: "Transaction pending", className: "text-amber-100 bg-amber-400/10 border-amber-400/25" },
  confirmed: { icon: CheckCircle2, label: "Transaction confirmed", className: "text-emerald-100 bg-emerald-400/10 border-emerald-400/25" },
  failed: { icon: XCircle, label: "Transaction failed", className: "text-rose-100 bg-rose-400/10 border-rose-400/25" }
};

export function TransactionStatus({ status }: { status: TxStatus }) {
  const item = meta[status];
  const Icon = item.icon;
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${item.className}`}>
      <Icon size={14} />
      {item.label}
    </div>
  );
}
