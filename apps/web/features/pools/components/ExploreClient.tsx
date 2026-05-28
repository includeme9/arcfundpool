"use client";

import Link from "next/link";
import { PlusCircle, Search, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";
import { PoolCard } from "@/components/PoolCard";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { filterPools, type PoolFilter } from "@/features/pools/utils/filterPools";
import { usePools } from "@/features/pools/hooks/usePools";
import { cn } from "@/lib/cn";

const filters: { label: string; value: PoolFilter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Funded", value: "funded" },
  { label: "Expired", value: "expired" },
  { label: "Refundable", value: "refundable" }
];

export function ExploreClient() {
  const { data, isFallback, isLoading, error, refresh } = usePools();
  const [filter, setFilter] = useState<PoolFilter>("all");
  const [query, setQuery] = useState("");
  const visiblePools = useMemo(() => filterPools(data, filter, query), [data, filter, query]);

  return (
    <section className="app-container py-8 md:py-12">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--cyan)]">Explore pools</p>
          <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Find transparent USDC funding pools</h1>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">Track targets, deadlines, creator wallets, and contribution activity before you fund.</p>
        </div>
        <label className="flex h-12 items-center rounded-full border border-white/10 bg-white/[0.04] px-4 md:w-80">
          <Search size={18} className="text-[var(--muted)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title or category"
            className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-slate-500"
          />
        </label>
      </div>

      <div className="scrollbar-hide mt-6 flex gap-2 overflow-x-auto pb-2">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            className={cn(
              "tap-target shrink-0 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-[var(--muted)]",
              filter === item.value && "border-blue-300/40 bg-blue-400/14 text-white"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="mt-6">
          <LoadingState label="Loading Arc Testnet pools" />
        </div>
      )}
      {error && (
        <div className="mt-6 space-y-4">
          <ErrorState message={error} />
          <button type="button" onClick={() => void refresh()} className="tap-target rounded-full bg-[var(--primary)] px-5 py-3 font-semibold text-white">
            Retry Arc Testnet read
          </button>
        </div>
      )}
      {isFallback && (
        <p className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
          ArcFundPool contract address is not configured, so preview pool data is shown.
        </p>
      )}

      {!isLoading && !error && visiblePools.length ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visiblePools.map((pool) => (
            <PoolCard key={pool.id} pool={pool} />
          ))}
        </div>
      ) : !isLoading && !error ? (
        <div className="mt-8">
          <EmptyState
            icon={isFallback ? WalletCards : PlusCircle}
            title={isFallback ? "No pools found" : "No funding pools have been created yet."}
            message={isFallback ? "Try another status filter or search term." : "Create the first Arc Testnet USDC funding pool and it will appear here from onchain state."}
          />
          {!isFallback && (
            <Link href="/create" className="tap-target mx-auto mt-4 flex w-full max-w-xs items-center justify-center rounded-full bg-[var(--primary)] px-5 py-3 font-semibold text-white">
              Create the first pool
            </Link>
          )}
        </div>
      ) : null}
    </section>
  );
}
