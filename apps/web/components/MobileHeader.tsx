"use client";

import Link from "next/link";
import { AlertTriangle, Wallet } from "lucide-react";
import { AddArcNetworkButton } from "@/features/network/components/AddArcNetworkButton";
import { WalletMenu } from "@/features/wallet/components/WalletMenu";
import { useWallet } from "@/features/wallet/hooks/useWallet";

export function MobileHeader() {
  const { connect, isArcTestnet, isConnected, isConnecting, isWrongNetwork, hasInjectedWallet, hasWalletConnect, clearWalletError } = useWallet();
  const canConnect = hasInjectedWallet || hasWalletConnect;
  const subtitle = !isConnected ? "Connect wallet" : isArcTestnet ? "Arc Testnet USDC" : "Wrong network";

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#06101f]/95 backdrop-blur-xl lg:hidden">
      <div className="app-container flex min-h-[60px] min-w-0 items-center justify-between gap-3 py-2">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--cyan),var(--violet))] text-sm font-bold text-white">
            A
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">ArcFundPool</p>
            <p className="truncate text-[11px] text-[var(--muted)]">{subtitle}</p>
          </div>
        </Link>

        <div className="flex min-w-0 shrink-0 items-center gap-2">
          {!isConnected && (
            <button
              type="button"
              onClick={() => {
                clearWalletError();
                void connect();
              }}
              disabled={!canConnect || isConnecting}
              className="tap-target inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-55"
            >
              <Wallet size={14} />
              {isConnecting ? "Connecting" : "Connect Wallet"}
            </button>
          )}

          {isConnected && isWrongNetwork && (
            <div className="flex items-center gap-1.5">
              <span className="hidden items-center gap-1 rounded-full border border-amber-300/25 bg-amber-300/10 px-2.5 py-1.5 text-[11px] font-semibold text-amber-100 sm:inline-flex">
                <AlertTriangle size={12} />
                Wrong Network
              </span>
              <AddArcNetworkButton className="[&_button]:min-h-[40px] [&_button]:px-3 [&_button]:py-2 [&_button]:text-xs [&_p]:hidden" label="Switch to Arc Testnet" />
            </div>
          )}

          {isConnected && isArcTestnet && (
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="rounded-full border border-cyan-300/18 bg-cyan-300/[0.08] px-2.5 py-1.5 text-[11px] font-semibold text-cyan-100">
                Arc Testnet / USDC gas
              </span>
              <WalletMenu compact />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
