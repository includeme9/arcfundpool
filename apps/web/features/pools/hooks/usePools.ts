"use client";

import { useCallback, useEffect, useState } from "react";
import type { Contribution, FundingPool, PoolTransaction } from "@arcfundpool/types";
import { loadPoolDataset, type PoolDataset } from "@/lib/onchain";
import { contributions, pools, transactions } from "@/lib/mock-data";

export function usePools() {
  const [dataset, setDataset] = useState<PoolDataset>({
    pools,
    contributions,
    transactions,
    isFallback: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setDataset(await loadPoolDataset());
    } catch {
      setError("Unable to load Arc Testnet pool data. Showing cached funding pools.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    data: dataset.pools,
    pools: dataset.pools,
    contributions: dataset.contributions,
    transactions: dataset.transactions,
    isFallback: dataset.isFallback,
    isLoading,
    error,
    refresh
  };
}

export type UsePoolsResult = {
  data: FundingPool[];
  pools: FundingPool[];
  contributions: Contribution[];
  transactions: PoolTransaction[];
  isFallback: boolean;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};
