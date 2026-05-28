"use client";

import { Wallet } from "lucide-react";
import { useWallet } from "@/features/wallet/hooks/useWallet";
import { WalletMenu } from "@/features/wallet/components/WalletMenu";

export function WalletButton() {
  const { connect, isConnected, isConnecting, hasInjectedWallet, hasWalletConnect, walletError, clearWalletError } = useWallet();
  const label = isConnecting ? "Connecting" : "Connect Wallet";

  if (isConnected) {
    return <WalletMenu />;
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => {
          clearWalletError();
          void connect();
        }}
        disabled={(!hasInjectedWallet && !hasWalletConnect) || isConnecting}
        title={!hasInjectedWallet && !hasWalletConnect ? "Install an injected wallet or configure WalletConnect." : undefined}
        className="tap-target inline-flex items-center justify-center gap-2 rounded-full border border-blue-300/20 bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[var(--primary-strong)] disabled:cursor-not-allowed disabled:bg-blue-500/25 disabled:text-blue-100/75"
      >
        <Wallet size={16} />
        {hasInjectedWallet || hasWalletConnect ? label : "Install Wallet"}
      </button>
      {walletError && <p className="max-w-64 text-xs text-amber-100">{walletError}</p>}
    </div>
  );
}
