import Link from "next/link";
import { CalendarDays, ShieldCheck, Wallet } from "lucide-react";
import type { FundingPool } from "@arcfundpool/types";
import { daysLeft, formatUSDC, shortenAddress } from "@arcfundpool/utils";
import { PoolProgress } from "@/components/PoolProgress";
import { StatusBadge } from "@/components/StatusBadge";

export function PoolCard({ pool, href }: { pool: FundingPool; href?: string | false }) {
  const content = (
    <>
      <div className="mb-4 h-1 rounded-full bg-[linear-gradient(90deg,var(--primary),var(--cyan),var(--violet))] opacity-80" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--cyan)]">{pool.category}</p>
          <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-snug text-white sm:text-xl">{pool.title}</h3>
        </div>
        <StatusBadge status={pool.status} />
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{pool.description}</p>
      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <Metric label="Raised" value={formatUSDC(pool.totalRaised, 0)} />
        <Metric label="Target" value={formatUSDC(pool.targetAmount, 0)} />
      </div>
      <div className="mt-5">
        <PoolProgress raised={pool.totalRaised} target={pool.targetAmount} />
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.035] px-2.5 py-1">
          <CalendarDays size={14} />
          {pool.status === "active" ? `${daysLeft(pool.deadline)} days left` : "Deadline passed"}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.035] px-2.5 py-1">
          <Wallet size={14} />
          {shortenAddress(pool.creatorWallet)}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.035] px-2.5 py-1 text-cyan-100">
          <ShieldCheck size={14} />
          Onchain
        </span>
      </div>
    </>
  );

  if (href === false) {
    return <article className="card block overflow-hidden p-4 sm:p-5">{content}</article>;
  }

  return (
    <Link href={href ?? `/pool/${pool.id}`} className="card group block min-w-0 overflow-hidden p-4 transition hover:-translate-y-1 hover:border-blue-300/35 sm:p-5">
      {content}
    </Link>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-white" title={value}>{value}</p>
    </div>
  );
}
