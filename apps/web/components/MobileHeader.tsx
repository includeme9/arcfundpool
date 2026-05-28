"use client";

import Link from "next/link";
import { Droplets, Wallet } from "lucide-react";
import { AddArcNetworkButton } from "@/features/network/components/AddArcNetworkButton";
import { WalletMenu } from "@/features/wallet/components/WalletMenu";
import { useWallet } from "@/features/wallet/hooks/useWallet";

export function MobileHeader() {
  const { connect, isArcTestnet, isConnected, isConnecting, isWrongNetwork, hasInjectedWallet, hasWalletConnect, clearWalletError } = useWallet();
  const canConnect = hasInjectedWallet || hasWalletConnect;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#06101f]/95 backdrop-blur-xl lg:hidden">
      <div className="app-container flex min-h-[60px] min-w-0 items-center justify-between gap-3 py-2">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--cyan),var(--violet))] text-sm font-bold text-white">
            A
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">ArcFundPool</p>
          </div>
        </Link>

        <div className="flex min-w-0 shrink-0 items-center gap-2">
          <a
            href="https://faucet.circle.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Get testnet USDC from the Circle Faucet"
            title="Get Faucet"
            className="tap-target grid size-10 shrink-0 place-items-center rounded-full border border-white/10 text-cyan-100 transition hover:bg-white/10"
          >
            <Droplets size={16} />
          </a>

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
            <AddArcNetworkButton className="[&_button]:min-h-[40px] [&_button]:px-3 [&_button]:py-2 [&_button]:text-xs [&_p]:hidden" label="Switch to Arc Testnet" />
          )}

          {isConnected && isArcTestnet && (
            <WalletMenu compact />
          )}
        </div>
      </div>
    </header>
  );
}
