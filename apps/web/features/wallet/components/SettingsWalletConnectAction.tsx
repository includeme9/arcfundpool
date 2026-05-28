"use client";

import { Wallet } from "lucide-react";
import { useWallet } from "@/features/wallet/hooks/useWallet";

export function SettingsWalletConnectAction() {
  const { connect, connectWalletConnect, hasInjectedWallet, hasWalletConnect, isConnected, isConnecting, walletError } = useWallet();

  return (
    <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.035] p-4">
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-blue-400/12 text-[var(--primary-strong)]">
          <Wallet size={18} />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-white">Wallet connection</p>
          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
            {isConnected ? "Wallet connection is active." : "Connect an injected wallet or open WalletConnect to manage Arc Testnet actions."}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={connect}
          disabled={isConnecting || (!hasInjectedWallet && !hasWalletConnect)}
          className="tap-target inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-55"
        >
          {isConnecting ? "Opening wallet" : "Connect Wallet"}
        </button>
        <button
          type="button"
          onClick={connectWalletConnect}
          disabled={isConnecting || !hasWalletConnect}
          className="tap-target inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-55"
        >
          WalletConnect
        </button>
      </div>
      {!hasWalletConnect && <p className="mt-3 text-sm text-amber-100">WalletConnect Project ID is not configured. Injected wallets still work.</p>}
      {walletError && <p className="mt-3 text-sm text-amber-100">{walletError}</p>}
    </div>
  );
}
