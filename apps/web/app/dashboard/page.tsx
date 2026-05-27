import { Activity, CircleDollarSign, Layers3, PlusCircle, ReceiptText, Trophy } from "lucide-react";
import { pools, contributions } from "@/lib/mock-data";
import { PoolCard } from "@/components/PoolCard";
import { StatCard } from "@/components/StatCard";
import { EmptyState } from "@/components/EmptyState";
import { formatDate, formatUSDC, shortenAddress } from "@arcfundpool/utils";

export default function DashboardPage() {
  const active = pools.filter((pool) => pool.status === "active").length;
  const funded = pools.filter((pool) => pool.status === "funded").length;
  const withdrawn = pools.filter((pool) => pool.status === "withdrawn").length;
  const totalRaised = pools.reduce((sum, pool) => sum + pool.totalRaised, 0);

  return (
    <section className="app-container py-8 md:py-12">
      <h1 className="text-3xl font-semibold text-white md:text-4xl">Creator dashboard</h1>
      <p className="mt-3 text-[var(--muted)]">Monitor your pools, funding progress, and recent USDC contribution activity.</p>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard icon={CircleDollarSign} label="Total raised" value={formatUSDC(totalRaised, 0)} />
        <StatCard icon={Layers3} label="Active pools" value={String(active)} />
        <StatCard icon={Trophy} label="Funded pools" value={String(funded)} />
        <StatCard icon={Activity} label="Withdrawn pools" value={String(withdrawn)} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-white">My pool list</h2>
            <a href="/create" className="tap-target hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white sm:inline-flex">
              <PlusCircle size={16} />
              Create pool
            </a>
          </div>
          {pools.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {pools.slice(0, 3).map((pool) => (
                <PoolCard key={pool.id} pool={pool} />
              ))}
            </div>
          ) : (
            <EmptyState icon={PlusCircle} title="No pools yet" message="Create your first Arc Testnet USDC pool when you are ready to collect transparent funding." />
          )}
        </section>
        <aside className="card p-5">
          <h2 className="text-xl font-semibold text-white">Recent contributions</h2>
          {contributions.length ? (
            <div className="mt-4 space-y-3">
              {contributions.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                  <p className="font-semibold text-white">{formatUSDC(item.amount)}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{shortenAddress(item.contributorWallet)} · {formatDate(item.timestamp)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState icon={ReceiptText} title="No contributions yet" message="New USDC contributions will appear here after they are confirmed on Arc Testnet." />
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
