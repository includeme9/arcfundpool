"use client";

import { Wallet } from "lucide-react";
import { shortenAddress } from "@arcfundpool/utils";
import { useWallet } from "@/features/wallet/hooks/useWallet";

export function WalletButton() {
  const { address, connect, isConnected, isConnecting, hasInjectedWallet } = useWallet();
  const label = isConnected ? shortenAddress(address) : isConnecting ? "Connecting" : "Connect Wallet";

  return (
    <button
      type="button"
      onClick={connect}
      disabled={!hasInjectedWallet || isConnecting}
      className="tap-target inline-flex items-center justify-center gap-2 rounded-full border border-blue-300/20 bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[var(--primary-strong)] disabled:cursor-not-allowed disabled:bg-blue-500/25 disabled:text-blue-100/75"
    >
      <Wallet size={16} />
      {hasInjectedWallet ? label : "Install Wallet"}
    </button>
  );
}
