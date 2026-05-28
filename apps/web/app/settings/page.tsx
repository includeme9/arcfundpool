"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { CheckCircle2, Droplets, ExternalLink, FileCode2, Network, Wallet } from "lucide-react";
import { arcTestnet, CONTRACTS, env, USDC_TOKEN } from "@arcfundpool/config";
import { shortenAddress } from "@arcfundpool/utils";
import { AddArcNetworkButton } from "@/features/network/components/AddArcNetworkButton";
import { CopyButton } from "@/components/CopyButton";
import { getOnchainConfig } from "@/lib/onchain";
import { useWallet } from "@/features/wallet/hooks/useWallet";

export default function SettingsPage() {
  const config = getOnchainConfig();
  const { address, chainId, connect, disconnect, hasInjectedWallet, hasWalletConnect, isArcTestnet, isConnected, isConnecting, isWrongNetwork } = useWallet();
  const contractExplorerUrl = config.explorerUrl ? `${config.explorerUrl.replace(/\/$/, "")}/address/${CONTRACTS.arcFundPool.address}` : "";
  const networkStatus = !isConnected ? "Not connected" : isWrongNetwork ? "Wrong network" : "Connected";

  return (
    <section className="app-container max-w-3xl py-8 md:py-12">
      <h1 className="text-3xl font-semibold text-white md:text-4xl">Settings</h1>
      <p className="mt-3 text-[var(--muted)]">Manage Arc Testnet connection, wallet status, and testnet USDC.</p>

      <div className="mt-8 grid gap-5">
        <Card icon={Network} title="Arc Testnet">
          <div className="grid gap-3 sm:grid-cols-3">
            <Info label="Status" value={networkStatus} tone={isArcTestnet ? "good" : isWrongNetwork ? "warn" : undefined} />
            <Info label="Chain ID" value={String(arcTestnet.id)} />
            <Info label="Gas token" value="USDC" />
          </div>
          <div className="mt-5">
            {!isConnected && (
              <button
                type="button"
                onClick={() => void connect()}
                disabled={isConnecting || (!hasInjectedWallet && !hasWalletConnect)}
                className="tap-target inline-flex w-full items-center justify-center rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
              >
                {isConnecting ? "Opening wallet" : "Connect Wallet"}
              </button>
            )}
            {isConnected && isWrongNetwork && <AddArcNetworkButton label="Switch to Arc Testnet" />}
            {isConnected && isArcTestnet && (
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-100">
                <CheckCircle2 size={16} />
                Connected
              </div>
            )}
          </div>
        </Card>

        <Card icon={Wallet} title="Wallet">
          {isConnected && address ? (
            <div className="space-y-4">
              <div className="rounded-2xl bg-white/[0.035] p-4">
                <p className="text-xs text-[var(--muted)]">Connected address</p>
                <p className="mt-1 truncate font-semibold text-white" title={address}>{shortenAddress(address, 8)}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <CopyButton value={address} label="Copy address" />
                <button
                  type="button"
                  onClick={() => disconnect()}
                  className="tap-target inline-flex w-full items-center justify-center rounded-full border border-rose-300/20 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/10"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => void connect()}
              disabled={isConnecting || (!hasInjectedWallet && !hasWalletConnect)}
              className="tap-target inline-flex w-full items-center justify-center rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
            >
              {isConnecting ? "Opening wallet" : "Connect Wallet"}
            </button>
          )}
        </Card>

        <Card icon={Droplets} title="Need testnet USDC?">
          <p className="text-sm leading-6 text-[var(--muted)]">Request testnet USDC from the Circle Faucet for Arc gas and pool transactions.</p>
          <a
            href="https://faucet.circle.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,var(--primary),var(--cyan))] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 sm:w-auto"
          >
            Get Testnet USDC
            <ExternalLink size={16} />
          </a>
        </Card>

        <Card icon={FileCode2} title="Onchain contract">
          <div className="grid gap-3 sm:grid-cols-2">
            <Info label="ArcFundPool" value={shortenAddress(CONTRACTS.arcFundPool.address, 8)} title={CONTRACTS.arcFundPool.address} />
            <Info label="USDC" value={shortenAddress(USDC_TOKEN.address, 8)} title={USDC_TOKEN.address} />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <CopyButton value={CONTRACTS.arcFundPool.address} label="Copy contract" />
            <CopyButton value={USDC_TOKEN.address} label="Copy USDC address" />
          </div>
          {contractExplorerUrl && (
            <a href={contractExplorerUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-100">
              View contract on Arcscan
              <ExternalLink size={15} />
            </a>
          )}
        </Card>

        <details className="card p-5 md:p-6">
          <summary className="cursor-pointer text-lg font-semibold text-white">Advanced details</summary>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Info label="RPC URL" value={config.rpcUrl ?? "https://rpc.testnet.arc.network"} />
            <Info label="Explorer URL" value={config.explorerUrl || "https://testnet.arcscan.app"} />
            <Info label="WalletConnect configured" value={env.walletConnectProjectId ? "Yes" : "No"} />
            <Info label="Current wallet chain ID" value={chainId ? String(chainId) : "Not connected"} />
            <Info label="Expected chain ID" value={String(arcTestnet.id)} />
            <Info label="Full contract address" value={CONTRACTS.arcFundPool.address} />
            <Info label="Full USDC address" value={USDC_TOKEN.address} />
          </div>
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">If transactions fail, confirm your wallet is on Arc Testnet and has enough testnet USDC for gas and pool actions.</p>
        </details>
      </div>
    </section>
  );
}

function Card({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <section className="card p-5 md:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-blue-400/12 text-[var(--primary-strong)]">
          <Icon size={19} />
        </div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Info({ label, value, title, tone }: { label: string; value: string; title?: string; tone?: "good" | "warn" }) {
  return (
    <div className="min-w-0 rounded-2xl bg-white/[0.035] p-4">
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className={`mt-2 truncate font-semibold ${tone === "good" ? "text-emerald-100" : tone === "warn" ? "text-amber-100" : "text-white"}`} title={title ?? value}>
        {value}
      </p>
    </div>
  );
}
