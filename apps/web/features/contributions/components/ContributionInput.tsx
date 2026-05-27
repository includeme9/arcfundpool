"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, CircleDollarSign, Clock3, Loader2, ShieldCheck, XCircle } from "lucide-react";
import { contributionSchema } from "@arcfundpool/validation";
import { cn } from "@/lib/cn";

type TxStep = "approval" | "wallet" | "pending" | "confirmed" | "failed";

const txSteps: { key: TxStep; label: string; helper: string }[] = [
  { key: "approval", label: "Waiting for approval", helper: "Approve USDC spending if required." },
  { key: "wallet", label: "Wallet confirmation", helper: "Review the Arc Testnet transaction in your wallet." },
  { key: "pending", label: "Transaction pending", helper: "Contribution is being submitted on Arc Testnet." },
  { key: "confirmed", label: "Transaction confirmed", helper: "Your USDC contribution is recorded." },
  { key: "failed", label: "Transaction failed", helper: "No USDC was contributed. Review wallet details and retry." }
];

export function ContributionInput({ defaultAmount = "" }: { defaultAmount?: string }) {
  const [amount, setAmount] = useState(defaultAmount);
  const [txStep, setTxStep] = useState<TxStep>("approval");
  const parsed = contributionSchema.safeParse({ amount });
  const needsApproval = Number(amount || 0) > 0;

  function cycleTxState() {
    const currentIndex = txSteps.findIndex((step) => step.key === txStep);
    setTxStep(txSteps[(currentIndex + 1) % txSteps.length].key);
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
        <span className="rounded-full bg-white/[0.035] px-3 py-2">Balance: 4,820.00 USDC</span>
        <span className="rounded-full bg-white/[0.035] px-3 py-2">Arc gas is paid in USDC</span>
      </div>
      {!parsed.success && amount && (
        <p className="flex items-center gap-2 text-sm text-rose-200">
          <AlertCircle size={16} />
          {parsed.error.issues[0]?.message}
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={!needsApproval}
          className="tap-target rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          Approve USDC
        </button>
        <button
          type="button"
          disabled={!parsed.success}
          className="tap-target rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          Contribute USDC
        </button>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={17} className="text-[var(--cyan)]" />
            <p className="text-sm font-semibold text-white">Transaction state</p>
          </div>
          <button type="button" onClick={cycleTxState} className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-[var(--muted)]">
            Preview states
          </button>
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
  const Icon = state === "confirmed" ? CheckCircle2 : state === "failed" ? XCircle : active ? Loader2 : Clock3;

  return (
    <div
      className={cn(
        "flex gap-3 rounded-2xl border border-white/8 p-3 text-sm",
        active ? "bg-blue-400/10 text-white" : "bg-white/[0.02] text-[var(--muted)]"
      )}
    >
      <Icon className={cn("mt-0.5 shrink-0", active && state !== "failed" && state !== "confirmed" && "animate-spin text-cyan-200", state === "confirmed" && "text-emerald-300", state === "failed" && "text-rose-300")} size={17} />
      <div>
        <p className="font-semibold">{label}</p>
        {active && <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{helper}</p>}
      </div>
    </div>
  );
}
