import type { FundingPool, PoolStatus } from "@arcfundpool/types";

export type PoolFilter = "all" | PoolStatus;

export function filterPools(pools: FundingPool[], filter: PoolFilter, query: string) {
  const normalized = query.trim().toLowerCase();

  return pools.filter((pool) => {
    const matchesFilter = filter === "all" || pool.status === filter;
    const matchesQuery =
      !normalized ||
      pool.title.toLowerCase().includes(normalized) ||
      pool.category.toLowerCase().includes(normalized);

    return matchesFilter && matchesQuery;
  });
}
