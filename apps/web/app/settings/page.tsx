import { CheckCircle2, CircleDollarSign, Droplets, Network, Wallet, type LucideIcon } from "lucide-react";
import { arcTestnet, CONTRACTS, USDC_TOKEN } from "@arcfundpool/config";
import { AddArcNetworkButton } from "@/features/network/components/AddArcNetworkButton";
import { CopyButton } from "@/components/CopyButton";
import { SettingsDiagnostics } from "@/features/network/components/SettingsDiagnostics";
import { SettingsWalletConnectAction } from "@/features/wallet/components/SettingsWalletConnectAction";
import { getOnchainConfig } from "@/lib/onchain";

export default function SettingsPage() {
  const config = getOnchainConfig();

  return (
    <section className="app-container max-w-4xl py-8 md:py-12">
      <h1 className="text-3xl font-semibold text-white md:text-4xl">Settings and network helper</h1>
      <p className="mt-3 text-[var(--muted)]">Use Arc Testnet for USDC contributions, settlement, refunds, withdrawals, and gas-related wallet messaging.</p>

      <div className="mt-8 grid gap-5">
        <Section title="Network status" description="Use Arc Testnet for funding, settlement, refunds, withdrawals, and USDC gas.">
          <div className="flex items-start gap-4">
          <div className="grid size-12 place-items-center rounded-2xl bg-cyan-300/12 text-cyan-100">
            <Network size={22} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Arc Testnet</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Add Arc Testnet to your wallet before creating or contributing to pools.</p>
          </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Info label="Mode" value={config.hasContract ? "Onchain mode" : "Fallback preview mode"} />
          <Info label="Network" value="Arc Testnet" />
          <Info label="Chain ID" value={String(arcTestnet.id)} />
          <Info label="RPC" value={config.rpcUrl ?? "https://rpc.testnet.arc.network"} />
          <Info label="Explorer" value={config.explorerUrl || "https://testnet.arcscan.app"} />
          <Info label="Gas token" value="USDC" />
          <Info label="Settlement asset" value={USDC_TOKEN.symbol} />
          </div>
          <AddArcNetworkButton className="mt-5" label="Add / Switch to Arc Testnet" />
        </Section>

        <Section title="Contract configuration" description="Financial state is read from Arc Testnet. Supabase and metadata are only supporting layers.">
          <div className="grid gap-3 md:grid-cols-2">
          <Info label="ArcFundPool contract" value={CONTRACTS.arcFundPool.address} />
          <Info label="USDC address" value={USDC_TOKEN.address} />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <CopyButton value={CONTRACTS.arcFundPool.address} label="Copy contract" />
            <CopyButton value={USDC_TOKEN.address} label="Copy USDC address" />
          </div>
        </Section>

        <Section title="Wallet status" description="Connect a wallet to create pools, contribute USDC, withdraw, or claim refunds.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <SettingsDiagnostics />
          </div>
          <SettingsWalletConnectAction />
        </Section>

        <Section title="Need Arc Testnet USDC?" description="Use Circle Faucet to request testnet USDC for Arc gas and pool transactions.">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">Select Arc Testnet, choose USDC, and paste your wallet address.</p>
            <a
              href="https://faucet.circle.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="tap-target inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,var(--primary),var(--cyan))] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 sm:w-auto"
            >
              <Droplets size={17} />
              Get Testnet USDC
            </a>
          </div>
        </Section>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Message icon={Wallet} title="Wallet disconnected" text="Connect a wallet to create pools, approve USDC, contribute, withdraw, or refund." />
        <Message icon={Network} title="Wrong network" text="Switch to Arc Testnet before signing transactions." />
        <Message icon={CircleDollarSign} title="Insufficient USDC" text="Add USDC for both contribution amount and Arc gas-related costs." />
      </div>

      <div className="card mt-6 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-300" size={20} />
          <div>
            <h2 className="font-semibold text-white">Production-facing network copy</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              ArcFundPool currently targets Arc Testnet. USDC is shown consistently as the contribution asset, settlement asset, refund asset, withdrawal asset, and gas token.
              {config.hasContract ? " Live pool data is read from the configured ArcFundPool contract." : " Add the ArcFundPool contract address to leave fallback preview mode."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="card p-5 md:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{description}</p>
      </div>
      {children}
    </section>
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

function Message({ title, text, icon: Icon }: { title: string; text: string; icon: LucideIcon }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
      <Icon className="text-amber-200" size={20} />
      <h3 className="mt-3 font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p>
    </div>
  );
}
