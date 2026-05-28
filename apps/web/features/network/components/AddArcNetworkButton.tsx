"use client";

import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useWallet } from "@/features/wallet/hooks/useWallet";

export function AddArcNetworkButton({ className = "", label = "Add / Switch to Arc Testnet" }: { className?: string; label?: string }) {
  const { isConnected, refreshWallet, switchToArcTestnet } = useWallet();
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<string>();

  async function addOrSwitch() {
    setIsPending(true);
    try {
      const result = await switchToArcTestnet();
      setMessage(result.message);
      await refreshWallet();
      window.setTimeout(() => {
        void refreshWallet();

        if (result.ok) {
          window.location.reload();
        }
      }, 750);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={addOrSwitch}
        disabled={!isConnected || isPending}
        className="tap-target inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
      >
        {isPending ? <Loader2 className="animate-spin" size={18} /> : <PlusCircle size={18} />}
        {isPending ? "Opening wallet" : label}
      </button>
      {message && <p className="mt-2 text-sm text-[var(--muted)]">{message}</p>}
      {!isConnected && <p className="mt-2 text-sm text-amber-100">Connect a wallet before switching networks.</p>}
    </div>
  );
}
