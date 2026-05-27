"use client";

import { useEffect, useState } from "react";
import type { TransactionReceipt } from "@arcfundpool/types";
import { ReceiptCard } from "@/components/ReceiptCard";
import { LoadingState } from "@/components/LoadingState";
import { fallbackReceipt, loadReceiptFromChain } from "@/lib/onchain";

export default function ReceiptPage({ params }: { params: { txHash: string } }) {
  const { txHash } = params;
  const normalizedTxHash = txHash as `0x${string}`;
  const [receipt, setReceipt] = useState<TransactionReceipt>(() => fallbackReceipt(normalizedTxHash));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setIsLoading(true);
      const result = await loadReceiptFromChain(normalizedTxHash);
      if (!mounted) return;
      setReceipt(result);
      setIsLoading(false);
    }

    void load();
    return () => {
      mounted = false;
    };
  }, [normalizedTxHash]);

  return (
    <section className="app-container max-w-3xl py-8 md:py-12">
      {isLoading && <div className="mb-4"><LoadingState label="Reading transaction receipt" /></div>}
      <ReceiptCard receipt={receipt} />
    </section>
  );
}
