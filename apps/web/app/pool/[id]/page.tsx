"use client";

import { useEffect, useState } from "react";
import { CalendarDays, CircleDollarSign, LockKeyhole, RotateCcw, ShieldCheck } from "lucide-react";
import { getAddress, type Hash } from "viem";
import { arcFundPoolAbi } from "@arcfundpool/web3";
import { AddressPill } from "@/components/AddressPill";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { PoolProgress } from "@/components/PoolProgress";
import { StatusBadge } from "@/components/StatusBadge";
import { TransactionStatus } from "@/components/TransactionStatus";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { ContributionInput } from "@/features/contributions/components/ContributionInput";
import { usePools } from "@/features/pools/hooks/usePools";
import { useWallet } from "@/features/wallet/hooks/useWallet";
import { getContributionAmount, getOnchainConfig, getWalletClient, userFacingError, waitForReceipt } from "@/lib/onchain";
import { daysLeft, formatDate, formatUSDC, shortenAddress } from "@arcfundpool/utils";

export default function PoolDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { address, chainId, isConnected } = useWallet();
  const { pools, contributions, transactions, isLoading, isFallback, refresh } = usePools();
  const [actionError, setActionError] = useState<string>();
  const [actionHash, setActionHash] = useState<Hash>();
  const [refundAmount, setRefundAmount] = useState<bigint>(0n);
  const config = getOnchainConfig();
  const pool = pools.find((item) => item.id === id || item.chainPoolId.toString() === id);

  useEffect(() => {
    async function loadRefundAmount() {
      if (!pool) return;
      setRefundAmount(await getContributionAmount(pool.chainPoolId, address));
    }

    void loadRefundAmount();
  }, [address, pool]);

  if (isLoading) {
    return (
      <section className="app-container py-8 md:py-12">
        <LoadingState label="Loading Arc Testnet pool state" />
      </section>
    );
  }

  if (!pool) {
    return (
      <section className="app-container py-8 md:py-12">
        <ErrorState message="Pool not found. Check the pool id or contract configuration." />
      </section>
    );
  }

  const selectedPool = pool;
  const poolContributions = contributions.filter((item) => item.chainPoolId === pool.chainPoolId);
  const poolTransactions = transactions.filter((item) => item.chainPoolId === undefined || item.chainPoolId === pool.chainPoolId);
  const funded = pool.totalRaised >= pool.targetAmount;
  const refundable = pool.status === "refundable" || pool.cancelled;
  const isCreator = Boolean(address && address.toLowerCase() === pool.creatorWallet.toLowerCase());
  const wrongNetwork = isConnected && chainId !== undefined && chainId !== config.chainId;

  async function writePoolAction(kind: "withdraw" | "refund" | "cancelPool") {
    setActionError(undefined);

    if (!window.ethereum || !address) {
      setActionError("Connect a wallet before signing transactions.");
      return;
    }

    if (!config.canWrite || !config.contractAddress) {
      setActionError(`Contract config is missing: ${config.missing.join(", ")}.`);
      return;
    }

    if (wrongNetwork) {
      setActionError("Switch your wallet to Arc Testnet before signing transactions.");
      return;
    }

    try {
      const walletClient = getWalletClient(window.ethereum);
      const hash = await walletClient.writeContract({
        account: getAddress(address),
        address: config.contractAddress,
        abi: arcFundPoolAbi,
        functionName: kind,
        args: [selectedPool.chainPoolId]
      });
      setActionHash(hash);
      await waitForReceipt(hash);
      await refresh();
    } catch (error) {
      setActionError(userFacingError(error));
    }
  }

  return (
    <section className="app-container pb-36 pt-8 md:pb-12 md:pt-12">
      <div className="grid gap-6 lg:grid-cols-[1fr_390px]">
        <div className="space-y-6">
          <header className="card p-5 md:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={pool.status} />
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-[var(--muted)]">{pool.category}</span>
            </div>
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-white md:text-5xl">{pool.title}</h1>
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

          <section id="contribute" className="card p-5 md:p-6 lg:hidden">
            <h2 className="text-xl font-semibold text-white">Contribute USDC</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Approve USDC if needed, then contribute to this pool on Arc Testnet.</p>
            <div className="mt-5">
              <ContributionInput poolId={pool.chainPoolId} onSuccess={() => void refresh()} />
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
              {poolTransactions.map((tx) => (
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
          <div className="card sticky top-24 hidden p-5 md:p-6 lg:block">
            <h2 className="text-xl font-semibold text-white">Contribute USDC</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Approve USDC if needed, then contribute to this pool on Arc Testnet.</p>
            <div className="mt-5">
              <ContributionInput poolId={pool.chainPoolId} onSuccess={() => void refresh()} />
            </div>
          </div>
          <div className="card border-emerald-300/15 p-5">
            <div className="flex items-center gap-2">
              <LockKeyhole size={18} className="text-emerald-300" />
              <h2 className="font-semibold text-white">Creator actions</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Creator controls are available only when the pool rules allow them.</p>
            <div className="mt-4 grid gap-3">
              <button onClick={() => writePoolAction("withdraw")} disabled={!isCreator || !funded || pool.withdrawn || pool.cancelled || isFallback} className="tap-target rounded-full bg-emerald-500 px-5 py-3 font-semibold text-slate-950 disabled:opacity-45">
                Withdraw if funded
              </button>
              <button onClick={() => writePoolAction("cancelPool")} disabled={!isCreator || pool.status !== "active" || isFallback} className="tap-target rounded-full border border-white/10 px-5 py-3 font-semibold text-white disabled:opacity-45">
                Cancel pool
              </button>
            </div>
          </div>
          <div className="card border-cyan-300/15 p-5">
            <div className="flex items-center gap-2">
              <RotateCcw size={18} className="text-cyan-200" />
              <h2 className="font-semibold text-white">Contributor actions</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Refunds are available when a pool is cancelled or expires below target.</p>
            <button onClick={() => writePoolAction("refund")} disabled={!refundable || refundAmount === 0n || isFallback} className="tap-target mt-4 w-full rounded-full bg-cyan-300 px-5 py-3 font-semibold text-slate-950 disabled:opacity-45">
              Claim refund
            </button>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-2">
              <CircleDollarSign size={18} className="text-[var(--primary-strong)]" />
              <h2 className="font-semibold text-white">Arc and USDC</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Arc Testnet is the network for pool activity. USDC is used for contributions, settlement, refunds, withdrawals, and Arc gas.</p>
          </div>
          {actionError && <ErrorState message={actionError} />}
          {actionHash && <p className="break-all rounded-3xl border border-white/10 bg-white/[0.035] p-4 text-xs text-[var(--muted)]">Last transaction: {actionHash}</p>}
        </aside>
      </div>

      <StickyMobileCTA>
        <a href="#contribute" className="tap-target flex w-full items-center justify-center rounded-full bg-[var(--primary)] px-5 py-3 font-semibold text-white">Contribute USDC</a>
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
