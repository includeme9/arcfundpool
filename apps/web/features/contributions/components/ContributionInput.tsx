"use client";

import { useState } from "react";
import { AlertCircle, CircleDollarSign } from "lucide-react";
import { contributionSchema } from "@arcfundpool/validation";

export function ContributionInput({ defaultAmount = "" }: { defaultAmount?: string }) {
  const [amount, setAmount] = useState(defaultAmount);
  const parsed = contributionSchema.safeParse({ amount });
  const needsApproval = Number(amount || 0) > 0;

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-white">Contribution amount</span>
        <div className="mt-2 flex items-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 focus-within:border-blue-300/50">
          <CircleDollarSign size={20} className="text-[var(--primary-strong)]" />
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            inputMode="decimal"
            placeholder="250.00"
            className="h-14 min-w-0 flex-1 bg-transparent px-3 text-lg font-semibold text-white outline-none placeholder:text-slate-500"
          />
          <span className="text-sm font-semibold text-[var(--muted)]">USDC</span>
        </div>
      </label>
      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
        <span>Balance: 4,820.00 USDC</span>
        <span>Arc gas is paid in USDC</span>
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
    </div>
  );
}
