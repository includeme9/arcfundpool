"use client";

import { AlertTriangle } from "lucide-react";
import { arcTestnet } from "@arcfundpool/config";
import { AddArcNetworkButton } from "@/features/network/components/AddArcNetworkButton";
import { isArcTestnet } from "@/features/network/utils/arcNetwork";
import { useWallet } from "@/features/wallet/hooks/useWallet";

export function NetworkBadge() {
  const { chainId, isConnected } = useWallet();
  const wrongNetwork = isConnected && !isArcTestnet(chainId);

  if (wrongNetwork) {
    return (
      <div className="hidden items-center gap-2 lg:flex">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-2 text-xs font-semibold text-amber-100">
          <AlertTriangle size={14} />
          Wrong Network
        </div>
        <AddArcNetworkButton className="[&_button]:min-h-0 [&_button]:px-3 [&_button]:py-2 [&_button]:text-xs [&_p]:hidden" label="Switch to Arc Testnet" />
      </div>
    );
  }

  return (
    <div className="hidden rounded-full border border-cyan-300/18 bg-cyan-300/[0.08] px-3 py-2 text-xs font-semibold text-cyan-100 lg:block">
      {arcTestnet.name} / USDC gas
    </div>
  );
}
