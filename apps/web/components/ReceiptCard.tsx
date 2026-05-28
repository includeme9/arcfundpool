import type { TransactionReceipt } from "@arcfundpool/types";
import { BadgeCheck } from "lucide-react";
import { formatDate, formatUSDC, shortenAddress } from "@arcfundpool/utils";
import { CopyButton } from "@/components/CopyButton";
import { CopyReceiptLinkButton } from "@/components/CopyReceiptLinkButton";
import { ExplorerLink } from "@/components/ExplorerLink";
import { TransactionStatus } from "@/components/TransactionStatus";

export function ReceiptCard({ receipt }: { receipt: TransactionReceipt }) {
  return (
    <section className="card overflow-hidden p-5 sm:p-6">
      <div className="-mx-5 -mt-5 mb-6 flex items-center justify-between bg-[linear-gradient(90deg,rgba(39,117,202,0.22),rgba(55,213,255,0.12))] px-5 py-4 sm:-mx-6 sm:-mt-6 sm:px-6">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-100">
          <BadgeCheck size={18} />
          Arc Testnet receipt
        </span>
        <span className="text-xs font-semibold text-[var(--muted)]">USDC settlement</span>
      </div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--muted)]">Contribution receipt</p>
          <h1 className="mt-2 text-2xl font-semibold leading-tight text-white">{receipt.poolName}</h1>
        </div>
        <TransactionStatus status={receipt.status} />
      </div>
      <div className="mt-6 rounded-3xl border border-blue-300/20 bg-blue-400/10 p-5">
        <p className="text-sm text-blue-100/80">Amount</p>
        <p className="mt-1 text-4xl font-semibold text-white">{formatUSDC(receipt.amount)}</p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Row label="Wallet address" value={shortenAddress(receipt.contributorAddress, 6)} />
        <Row label="Amount" value={formatUSDC(receipt.amount)} />
        <Row label="Timestamp" value={formatDate(receipt.timestamp)} />
        <Row label="Tx hash" value={shortenAddress(receipt.txHash, 8)} />
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <ExplorerLink href={receipt.explorerUrl} />
        <CopyButton value={receipt.txHash} label="Copy tx hash" />
        <CopyReceiptLinkButton />
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className="mt-2 min-w-0 truncate text-sm font-semibold text-white" title={value}>{value}</p>
    </div>
  );
}
