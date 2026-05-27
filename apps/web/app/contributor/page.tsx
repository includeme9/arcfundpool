"use client";

import { ReceiptText, RotateCcw, WalletCards } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import { usePools } from "@/features/pools/hooks/usePools";
import { useWallet } from "@/features/wallet/hooks/useWallet";
import { formatDate, formatUSDC, shortenAddress } from "@arcfundpool/utils";

export default function ContributorPage() {
  const { address } = useWallet();
  const { contributions: allContributions, pools, isFallback, isLoading } = usePools();
  const contributions = isFallback || !address ? allContributions : allContributions.filter((item) => item.contributorWallet.toLowerCase() === address.toLowerCase());
  const total = contributions.reduce((sum, item) => sum + item.amount, 0);
  const refundablePoolIds = new Set(pools.filter((pool) => pool.status === "refundable").map((pool) => pool.chainPoolId.toString()));
  const refundable = contributions.filter((item) => refundablePoolIds.has(item.chainPoolId.toString())).reduce((sum, item) => sum + item.amount, 0);

  if (isLoading) {
    return (
      <section className="app-container py-8 md:py-12">
        <LoadingState label="Loading contributor activity" />
      </section>
    );
  }

  return (
    <section className="app-container py-8 md:py-12">
      <h1 className="text-3xl font-semibold text-white md:text-4xl">Contributor dashboard</h1>
      <p className="mt-3 text-[var(--muted)]">Track pools you have funded, contribution receipts, and available refund actions.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <StatCard icon={WalletCards} label="Pools contributed to" value={String(new Set(contributions.map((item) => item.chainPoolId.toString())).size)} />
        <StatCard icon={ReceiptText} label="Total contributed" value={formatUSDC(total, 0)} />
        <StatCard icon={RotateCcw} label="Refundable amount" value={formatUSDC(refundable, 0)} />
      </div>
      <section className="card mt-8 p-5 md:p-6">
        <h2 className="text-xl font-semibold text-white">Contribution history</h2>
        {contributions.length ? (
          <div className="mt-4 grid gap-3">
            {contributions.map((item) => {
              const pool = pools.find((poolItem) => poolItem.chainPoolId === item.chainPoolId);
              const canRefund = pool?.status === "refundable";
              return (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 md:flex md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-white">{pool?.title ?? "Funding pool"}</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{formatUSDC(item.amount)} / {formatDate(item.timestamp)} / {shortenAddress(item.txHash, 8)}</p>
                    {!canRefund && <p className="mt-2 text-xs text-[var(--muted)]">No refund action is available for this contribution.</p>}
                  </div>
                  <button disabled={!canRefund} className="tap-target mt-4 w-full rounded-full bg-cyan-300 px-5 py-2 text-sm font-semibold text-slate-950 disabled:opacity-45 md:mt-0 md:w-auto">
                    Claim refund
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-4">
            <EmptyState icon={ReceiptText} title="No contributions yet" message="Pools you fund with USDC will appear here with receipts and refund availability." />
          </div>
        )}
      </section>

      {refundable === 0 && (
        <section className="mt-6">
          <EmptyState icon={RotateCcw} title="No refundable pools" message="Refund actions appear when a pool is cancelled or expires below its USDC target." />
        </section>
      )}
    </section>
  );
}
