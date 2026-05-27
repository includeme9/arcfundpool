"use client";

import { PlusCircle } from "lucide-react";
import { arcTestnet } from "@arcfundpool/config";
import { useWallet } from "@/features/wallet/hooks/useWallet";

export function AddArcNetworkButton() {
  const { hasInjectedWallet, request } = useWallet();

  async function addNetwork() {
    await request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: `0x${arcTestnet.id.toString(16)}`,
          chainName: arcTestnet.name,
          nativeCurrency: arcTestnet.nativeCurrency,
          rpcUrls: arcTestnet.rpcUrls.default.http,
          blockExplorerUrls: arcTestnet.blockExplorers?.default.url ? [arcTestnet.blockExplorers.default.url] : []
        }
      ]
    });
  }

  return (
    <button
      type="button"
      onClick={addNetwork}
      disabled={!hasInjectedWallet}
      className="tap-target mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
    >
      <PlusCircle size={18} />
      Add Arc Network
    </button>
  );
}
