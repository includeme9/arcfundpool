import type { TransactionReceipt } from "@arcfundpool/types";
import { formatDate, formatUSDC, shortenAddress } from "@arcfundpool/utils";
import { CopyButton } from "@/components/CopyButton";
import { ExplorerLink } from "@/components/ExplorerLink";
import { TransactionStatus } from "@/components/TransactionStatus";

export function ReceiptCard({ receipt }: { receipt: TransactionReceipt }) {
  return (
    <section className="card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--muted)]">USDC contribution receipt</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">{receipt.poolName}</h1>
        </div>
        <TransactionStatus status={receipt.status} />
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Row label="Contributor" value={shortenAddress(receipt.contributorAddress, 6)} />
        <Row label="Amount" value={formatUSDC(receipt.amount)} />
        <Row label="Timestamp" value={formatDate(receipt.timestamp)} />
        <Row label="Tx hash" value={shortenAddress(receipt.txHash, 8)} />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <ExplorerLink href={receipt.explorerUrl} />
        <CopyButton value={receipt.txHash} label="Copy tx hash" />
        <CopyButton value={typeof window === "undefined" ? receipt.txHash : window.location.href} label="Copy receipt link" />
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className="mt-2 break-all text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
