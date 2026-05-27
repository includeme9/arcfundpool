import { notFound } from "next/navigation";
import { CalendarDays, CheckCircle2, ShieldCheck, Wallet } from "lucide-react";
import { contributions, pools, transactions } from "@/lib/mock-data";
import { AddressPill } from "@/components/AddressPill";
import { PoolProgress } from "@/components/PoolProgress";
import { StatusBadge } from "@/components/StatusBadge";
import { TransactionStatus } from "@/components/TransactionStatus";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { ContributionInput } from "@/features/contributions/components/ContributionInput";
import { daysLeft, formatDate, formatUSDC, shortenAddress } from "@arcfundpool/utils";

export default function PoolDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const pool = pools.find((item) => item.id === id);
  if (!pool) notFound();

  const poolContributions = contributions.filter((item) => item.chainPoolId === pool.chainPoolId);
  const funded = pool.totalRaised >= pool.targetAmount;
  const refundable = pool.status === "refundable" || pool.cancelled;

  return (
    <section className="app-container pb-36 pt-8 md:pb-12 md:pt-12">
      <div className="grid gap-6 lg:grid-cols-[1fr_390px]">
        <div className="space-y-6">
          <header className="card p-5 md:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={pool.status} />
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-[var(--muted)]">{pool.category}</span>
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-white md:text-5xl">{pool.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--muted)]">{pool.description}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <AddressPill address={pool.creatorWallet} />
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-[var(--muted)]">
                <CalendarDays size={14} />
                {pool.status === "active" ? `${daysLeft(pool.deadline)} days left` : formatDate(pool.deadline)}
              </span>
            </div>
          </header>

          <section className="card p-5 md:p-6">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-sm text-[var(--muted)]">Total raised</p>
                <p className="mt-1 text-3xl font-semibold text-white">{formatUSDC(pool.totalRaised)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[var(--muted)]">Target</p>
                <p className="mt-1 font-semibold text-white">{formatUSDC(pool.targetAmount)}</p>
              </div>
            </div>
            <div className="mt-6">
              <PoolProgress raised={pool.totalRaised} target={pool.targetAmount} />
            </div>
          </section>

          <section className="card p-5 md:p-6">
            <h2 className="text-xl font-semibold text-white">Pool rules</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Rule text="Creator can withdraw only after target is reached." />
              <Rule text="Contributors can refund if the pool expires without reaching target." />
              <Rule text="Pools stop receiving contributions after deadline, cancellation, or withdrawal." />
              <Rule text="Financial state should be verified from Arc onchain records." />
            </div>
          </section>

          <section className="card p-5 md:p-6">
            <h2 className="text-xl font-semibold text-white">Contributors</h2>
            <div className="mt-4 space-y-3">
              {poolContributions.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-white">{formatUSDC(item.amount)}</span>
                    <AddressPill address={item.contributorWallet} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
                    <span>{shortenAddress(item.txHash, 8)}</span>
                    <span>{formatDate(item.timestamp)}</span>
                  </div>
                </div>
              ))}
              {!poolContributions.length && <p className="text-sm text-[var(--muted)]">No contributions yet.</p>}
            </div>
          </section>

          <section className="card p-5 md:p-6">
            <h2 className="text-xl font-semibold text-white">Transaction history</h2>
            <div className="mt-4 space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold capitalize text-white">{tx.kind}</p>
                    <TransactionStatus status={tx.status} />
                  </div>
                  <p className="mt-2 break-all text-xs text-[var(--muted)]">{tx.txHash}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="card sticky top-24 p-5 md:p-6">
            <h2 className="text-xl font-semibold text-white">Contribute USDC</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Approve USDC if needed, then contribute to this pool on Arc Testnet.</p>
            <div className="mt-5">
              <ContributionInput />
            </div>
          </div>
          <div className="card p-5">
            <h2 className="font-semibold text-white">Creator actions</h2>
            <div className="mt-4 grid gap-3">
              <button disabled={!funded || pool.withdrawn} className="tap-target rounded-full bg-emerald-500 px-5 py-3 font-semibold text-slate-950 disabled:opacity-45">
                Withdraw if funded
              </button>
              <button disabled={pool.status !== "active"} className="tap-target rounded-full border border-white/10 px-5 py-3 font-semibold text-white disabled:opacity-45">
                Cancel pool
              </button>
            </div>
          </div>
          <div className="card p-5">
            <h2 className="font-semibold text-white">Contributor actions</h2>
            <button disabled={!refundable} className="tap-target mt-4 w-full rounded-full bg-cyan-300 px-5 py-3 font-semibold text-slate-950 disabled:opacity-45">
              Claim refund
            </button>
          </div>
        </aside>
      </div>

      <StickyMobileCTA>
        <button className="tap-target w-full rounded-full bg-[var(--primary)] px-5 py-3 font-semibold text-white">Contribute USDC</button>
      </StickyMobileCTA>
    </section>
  );
}

function Rule({ text }: { text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-[var(--muted)]">
      <ShieldCheck className="mt-0.5 shrink-0 text-[var(--cyan)]" size={18} />
      {text}
    </div>
  );
}
