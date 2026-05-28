"use client";

import { env } from "@arcfundpool/config";
import { useWallet } from "@/features/wallet/hooks/useWallet";
import { ARC_TESTNET_CHAIN_ID } from "@/features/network/utils/arcNetwork";

export function SettingsDiagnostics() {
  const { address, chainId, isArcTestnet, isConnected } = useWallet();

  return (
    <>
      <Info label="Wallet connected" value={isConnected ? "Yes" : "No"} />
      <Info label="Wallet address" value={address ?? "Not connected"} />
      <Info label="WalletConnect project ID configured" value={env.walletConnectProjectId ? "Yes" : "No"} />
      <Info label="Current wallet chain ID" value={chainId ? String(chainId) : "Not connected"} />
      <Info label="Expected chain ID" value={String(ARC_TESTNET_CHAIN_ID)} />
      <Info label="Is Arc Testnet" value={isArcTestnet ? "Yes" : "No"} />
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className="mt-2 break-words font-semibold text-white">{value}</p>
    </div>
  );
}
