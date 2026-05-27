"use client";

import { Wallet } from "lucide-react";
import { shortenAddress } from "@arcfundpool/utils";
import { useWallet } from "@/features/wallet/hooks/useWallet";

export function WalletButton() {
  const { address, connect, connectWalletConnect, isConnected, isConnecting, hasInjectedWallet, hasWalletConnect } = useWallet();
  const label = isConnected ? shortenAddress(address) : isConnecting ? "Connecting" : "Connect Wallet";

  if (!isConnected && hasWalletConnect) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={connect}
          disabled={isConnecting || (!hasInjectedWallet && !hasWalletConnect)}
          className="tap-target inline-flex items-center justify-center gap-2 rounded-full border border-blue-300/20 bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[var(--primary-strong)] disabled:cursor-not-allowed disabled:bg-blue-500/25 disabled:text-blue-100/75"
        >
          <Wallet size={16} />
          {hasInjectedWallet ? label : "WalletConnect"}
        </button>
        {hasInjectedWallet && (
          <button
            type="button"
            onClick={connectWalletConnect}
            disabled={isConnecting}
            className="tap-target hidden items-center justify-center rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10 lg:inline-flex"
          >
            WalletConnect
          </button>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={connect}
      disabled={(!hasInjectedWallet && !hasWalletConnect) || isConnecting}
      className="tap-target inline-flex items-center justify-center gap-2 rounded-full border border-blue-300/20 bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[var(--primary-strong)] disabled:cursor-not-allowed disabled:bg-blue-500/25 disabled:text-blue-100/75"
    >
      <Wallet size={16} />
      {hasInjectedWallet || hasWalletConnect ? label : "Install Wallet"}
    </button>
  );
}
