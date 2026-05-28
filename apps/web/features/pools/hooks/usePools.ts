"use client";

import { useCallback, useEffect, useState } from "react";
import type { Contribution, FundingPool, PoolTransaction } from "@arcfundpool/types";
import { getOnchainConfig, loadPoolDataset, type PoolDataset } from "@/lib/onchain";
import { contributions, pools, transactions } from "@/lib/mock-data";

function initialDataset(): PoolDataset {
  const config = getOnchainConfig();
  if (config.hasContract) {
    return {
      pools: [],
      contributions: [],
      transactions: [],
      isFallback: false
    };
  }

  return {
    pools,
    contributions,
    transactions,
    isFallback: true
  };
}

export function usePools() {
  const [dataset, setDataset] = useState<PoolDataset>(initialDataset);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setDataset(await loadPoolDataset());
    } catch (error) {
      const config = getOnchainConfig();
      if (config.hasContract) {
        const maybeError = error as { name?: string; message?: string; shortMessage?: string };
        console.warn("[ArcFundPool] Pool dataset load failed", {
          name: maybeError?.name,
          message: maybeError?.message,
          shortMessage: maybeError?.shortMessage,
          rpcUrl: config.rpcUrl,
          contractAddress: config.contractAddress,
          chainId: config.chainId
        });
        setDataset({
          pools: [],
          contributions: [],
          transactions: [],
          isFallback: false
        });
        setError("Unable to read Arc Testnet pool data. Check RPC configuration and retry.");
      } else {
        setDataset({
          pools,
          contributions,
          transactions,
          isFallback: true
        });
        setError("Unable to load Arc Testnet pool data. Showing preview funding pools.");
      }
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
