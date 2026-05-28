"use client";

import { CheckCircle2, Wallet } from "lucide-react";
import { shortenAddress } from "@arcfundpool/utils";
import { AddArcNetworkButton } from "@/features/network/components/AddArcNetworkButton";
import { isArcTestnet } from "@/features/network/utils/arcNetwork";
import { useWallet } from "@/features/wallet/hooks/useWallet";

export function CreateWalletStatus() {
  const { address, chainId, connect, isConnected, isConnecting, hasInjectedWallet, hasWalletConnect } = useWallet();
  const wrongNetwork = isConnected && !isArcTestnet(chainId);
  const canConnect = hasInjectedWallet || hasWalletConnect;

  if (!isConnected) {
    return (
      <section className="mt-6 rounded-3xl border border-blue-300/20 bg-blue-400/10 p-4 lg:hidden">
        <div className="flex items-start gap-3">
          <Wallet className="mt-0.5 shrink-0 text-blue-100" size={20} />
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-white">Connect your wallet to create a pool.</h2>
            <p className="mt-1 text-sm leading-6 text-slate-200">Use an injected wallet or WalletConnect to create your funding pool on Arc Testnet.</p>
            <button
              type="button"
              onClick={connect}
              disabled={!canConnect || isConnecting}
              className="tap-target mt-4 inline-flex w-full items-center justify-center rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-55"
            >
              {isConnecting ? "Opening wallet" : "Connect Wallet"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (wrongNetwork) {
    return (
      <section className="mt-6 rounded-3xl border border-amber-300/25 bg-amber-300/10 p-4 lg:hidden">
        <h2 className="font-semibold text-white">Switch to Arc Testnet before creating a pool.</h2>
        <p className="mt-1 text-sm leading-6 text-amber-50/90">ArcFundPool uses Arc Testnet with USDC for funding, settlement, and gas.</p>
        <AddArcNetworkButton className="mt-4" label="Switch to Arc Testnet" />
      </section>
    );
  }

  return (
    <section className="mt-6 rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-4 lg:hidden">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="shrink-0 text-emerald-200" size={20} />
        <div className="min-w-0">
          <h2 className="font-semibold text-white">Wallet ready on Arc Testnet.</h2>
          <p className="mt-1 truncate text-sm text-emerald-50/90">{shortenAddress(address)} / USDC gas</p>
        </div>
      </div>
    </section>
  );
}
