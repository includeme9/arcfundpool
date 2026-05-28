"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";
import { shortenAddress } from "@arcfundpool/utils";
import { AddArcNetworkButton } from "@/features/network/components/AddArcNetworkButton";
import { isArcTestnet } from "@/features/network/utils/arcNetwork";
import { useWallet } from "@/features/wallet/hooks/useWallet";

export function MobileHeader() {
  const { address, chainId, connect, isConnected, isConnecting, hasInjectedWallet, hasWalletConnect } = useWallet();
  const wrongNetwork = isConnected && !isArcTestnet(chainId);
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
            <p className="truncate text-[11px] text-[var(--muted)]">Arc Testnet USDC</p>
          </div>
        </Link>

        <div className="flex min-w-0 shrink-0 items-center gap-2">
          {!isConnected && (
            <button
              type="button"
              onClick={connect}
              disabled={!canConnect || isConnecting}
              className="tap-target inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-55"
            >
              <Wallet size={14} />
              {isConnecting ? "Connecting" : "Connect Wallet"}
            </button>
          )}

          {isConnected && wrongNetwork && (
            <AddArcNetworkButton className="[&_button]:min-h-[40px] [&_button]:px-3 [&_button]:py-2 [&_button]:text-xs [&_p]:hidden" label="Switch to Arc" />
          )}

          {isConnected && !wrongNetwork && (
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="rounded-full border border-cyan-300/18 bg-cyan-300/[0.08] px-2.5 py-1.5 text-[11px] font-semibold text-cyan-100">
                Arc / USDC
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.045] px-2.5 py-1.5 text-[11px] font-semibold text-white">
                {shortenAddress(address)}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
