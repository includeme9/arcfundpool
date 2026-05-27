"use client";

import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useWallet } from "@/features/wallet/hooks/useWallet";
import { addOrSwitchArcTestnet } from "@/features/network/utils/arcNetwork";

export function AddArcNetworkButton({ className = "", label = "Add / Switch to Arc Testnet" }: { className?: string; label?: string }) {
  const { hasInjectedWallet, refreshWallet, request } = useWallet();
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<string>();

  async function addOrSwitch() {
    setIsPending(true);
    const result = await addOrSwitchArcTestnet(request);
    setMessage(result.message);
    await refreshWallet();
    setIsPending(false);
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={addOrSwitch}
        disabled={!hasInjectedWallet || isPending}
        className="tap-target inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
      >
        {isPending ? <Loader2 className="animate-spin" size={18} /> : <PlusCircle size={18} />}
        {isPending ? "Opening wallet" : label}
      </button>
      {message && <p className="mt-2 text-sm text-[var(--muted)]">{message}</p>}
      {!hasInjectedWallet && <p className="mt-2 text-sm text-amber-100">Wallet not installed.</p>}
    </div>
  );
}
