"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, CircleDollarSign, Clock3, Loader2, ShieldCheck, XCircle } from "lucide-react";
import { getAddress, type Hash } from "viem";
import { contributionSchema } from "@arcfundpool/validation";
import { arcFundPoolAbi, erc20Abi } from "@arcfundpool/web3";
import { cn } from "@/lib/cn";
import { useWallet } from "@/features/wallet/hooks/useWallet";
import {
  formatUSDCAmount,
  getOnchainConfig,
  getUsdcBalanceAndAllowance,
  getWalletClient,
  parseUSDCAmount,
  userFacingError,
  waitForReceipt
} from "@/lib/onchain";

type TxStep = "approvalRequired" | "approving" | "approvalConfirmed" | "wallet" | "pending" | "confirmed" | "failed";

const txSteps: { key: TxStep; label: string; helper: string }[] = [
  { key: "approvalRequired", label: "Approval required", helper: "Approve USDC spending for ArcFundPool." },
  { key: "approving", label: "Approving USDC", helper: "Confirm the USDC approval in your wallet." },
  { key: "approvalConfirmed", label: "Approval confirmed", helper: "USDC spending is approved for this contribution." },
  { key: "wallet", label: "Wallet confirmation", helper: "Review the Arc Testnet contribution in your wallet." },
  { key: "pending", label: "Contributing USDC", helper: "Contribution is being submitted on Arc Testnet." },
  { key: "confirmed", label: "Contribution confirmed", helper: "Your USDC contribution is recorded." },
  { key: "failed", label: "Transaction failed", helper: "No USDC was contributed. Review wallet details and retry." }
];

export function ContributionInput({
  defaultAmount = "",
  poolId,
  onSuccess
}: {
  defaultAmount?: string;
  poolId?: bigint;
  onSuccess?: (txHash: Hash) => void;
}) {
  const { address, chainId, connect, isConnected, provider } = useWallet();
  const [amount, setAmount] = useState(defaultAmount);
  const [txStep, setTxStep] = useState<TxStep>("approvalRequired");
  const [balance, setBalance] = useState<bigint>(0n);
  const [allowance, setAllowance] = useState<bigint>(0n);
  const [error, setError] = useState<string>();
  const [receiptTxHash, setReceiptTxHash] = useState<Hash>();
  const parsed = contributionSchema.safeParse({ amount });
  const config = getOnchainConfig();
  const amountUnits = parsed.success ? parseUSDCAmount(String(parsed.data.amount), config.usdcDecimals) : 0n;
  const needsApproval = amountUnits > allowance;
  const wrongNetwork = isConnected && chainId !== undefined && chainId !== config.chainId;

  useEffect(() => {
    let mounted = true;

    async function loadBalance() {
      const result = await getUsdcBalanceAndAllowance(address);
      if (!mounted) return;
      setBalance(result.balance);
      setAllowance(result.allowance);
    }

    void loadBalance();
    return () => {
      mounted = false;
    };
  }, [address, receiptTxHash]);

  async function approveUsdc() {
    setError(undefined);

    if (!isConnected) {
      await connect();
      return;
    }

    if (!config.canWrite || !config.contractAddress || !config.usdcAddress) {
      setError(`Contract config is missing: ${config.missing.join(", ")}.`);
      return;
    }

    if (wrongNetwork) {
      setError("Switch your wallet to Arc Testnet before approving USDC.");
      return;
    }

    if (!provider || !address || !parsed.success) return;

    try {
      setTxStep("approving");
      const walletClient = getWalletClient(provider);
      const hash = await walletClient.writeContract({
        account: getAddress(address),
        address: config.usdcAddress,
        abi: erc20Abi,
        functionName: "approve",
        args: [config.contractAddress, amountUnits]
      });
      await waitForReceipt(hash);
      setTxStep("approvalConfirmed");
      const result = await getUsdcBalanceAndAllowance(address);
      setAllowance(result.allowance);
      setBalance(result.balance);
    } catch (approvalError) {
      setTxStep("failed");
      setError(userFacingError(approvalError));
    }
  }

  async function contributeUsdc() {
    setError(undefined);

    if (!isConnected) {
      await connect();
      return;
    }

    if (!config.canWrite || !config.contractAddress) {
      setError(`Contract config is missing: ${config.missing.join(", ")}.`);
      return;
    }

    if (poolId === undefined) {
      setError("Pool id is unavailable for this contribution.");
      return;
    }

    if (wrongNetwork) {
      setError("Switch your wallet to Arc Testnet before contributing USDC.");
      return;
    }

    if (amountUnits > balance) {
      setError("Insufficient USDC balance for this contribution.");
      return;
    }

    if (needsApproval) {
      setTxStep("approvalRequired");
      setError("Approve USDC before contributing.");
      return;
    }

    if (!provider || !address || !parsed.success) return;

    try {
      setTxStep("wallet");
      const walletClient = getWalletClient(provider);
      const hash = await walletClient.writeContract({
        account: getAddress(address),
        address: config.contractAddress,
        abi: arcFundPoolAbi,
        functionName: "contribute",
        args: [poolId, amountUnits]
      });
      setTxStep("pending");
      const receipt = await waitForReceipt(hash);
      setReceiptTxHash(hash);
      setTxStep(receipt.status === "success" ? "confirmed" : "failed");
      onSuccess?.(hash);
    } catch (contributionError) {
      setTxStep("failed");
      setError(userFacingError(contributionError));
    }
  }

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-white">Contribution amount</span>
        <div className="mt-2 flex items-center rounded-3xl border border-white/10 bg-white/[0.045] px-4 shadow-inner focus-within:border-blue-300/50">
          <CircleDollarSign size={20} className="text-[var(--primary-strong)]" />
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            inputMode="decimal"
            placeholder="250.00"
            className="h-16 min-w-0 flex-1 bg-transparent px-3 text-2xl font-semibold text-white outline-none placeholder:text-slate-500"
          />
          <span className="text-sm font-semibold text-[var(--muted)]">USDC</span>
        </div>
      </label>
      <div className="grid gap-2 text-xs text-[var(--muted)] sm:grid-cols-2">
        <span className="rounded-full bg-white/[0.035] px-3 py-2">
          Balance: {formatUSDCAmount(balance, config.usdcDecimals).toLocaleString("en-US")} USDC
        </span>
        <span className="rounded-full bg-white/[0.035] px-3 py-2">Arc gas is paid in USDC</span>
      </div>
      {!config.canWrite && (
        <p className="flex items-center gap-2 text-sm text-amber-100">
          <AlertCircle size={16} />
          Live contribution requires Arc contract, USDC, RPC, and explorer env config.
        </p>
      )}
      {wrongNetwork && (
        <p className="flex items-center gap-2 text-sm text-amber-100">
          <AlertCircle size={16} />
          Switch your wallet to Arc Testnet.
        </p>
      )}
      {!parsed.success && amount && (
        <p className="flex items-center gap-2 text-sm text-rose-200">
          <AlertCircle size={16} />
          {parsed.error.issues[0]?.message}
        </p>
      )}
      {error && (
        <p className="flex items-center gap-2 text-sm text-rose-200">
          <AlertCircle size={16} />
          {error}
        </p>
      )}
      {receiptTxHash && (
        <a href={`/receipt/${receiptTxHash}`} className="tap-target flex items-center justify-center rounded-full border border-emerald-300/25 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-100">
          View receipt
        </a>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={approveUsdc}
          disabled={!parsed.success || !needsApproval}
          className="tap-target rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          Approve USDC
        </button>
        <button
          type="button"
          onClick={contributeUsdc}
          disabled={!parsed.success}
          className="tap-target rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          Contribute USDC
        </button>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4">
        <div className="mb-3 flex items-center gap-2">
          <ShieldCheck size={17} className="text-[var(--cyan)]" />
          <p className="text-sm font-semibold text-white">Transaction state</p>
        </div>
        <div className="space-y-2">
          {txSteps.map((step) => (
            <TxStateRow key={step.key} active={txStep === step.key} state={step.key} label={step.label} helper={step.helper} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TxStateRow({ active, state, label, helper }: { active: boolean; state: TxStep; label: string; helper: string }) {
  const Icon = state === "confirmed" || state === "approvalConfirmed" ? CheckCircle2 : state === "failed" ? XCircle : active ? Loader2 : Clock3;

  return (
    <div
      className={cn(
        "flex gap-3 rounded-2xl border border-white/8 p-3 text-sm",
        active ? "bg-blue-400/10 text-white" : "bg-white/[0.02] text-[var(--muted)]"
      )}
    >
      <Icon
        className={cn(
          "mt-0.5 shrink-0",
          active && state !== "failed" && state !== "confirmed" && state !== "approvalConfirmed" && "animate-spin text-cyan-200",
          (state === "confirmed" || state === "approvalConfirmed") && "text-emerald-300",
          state === "failed" && "text-rose-300"
        )}
        size={17}
      />
      <div>
        <p className="font-semibold">{label}</p>
        {active && <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{helper}</p>}
      </div>
    </div>
  );
}
