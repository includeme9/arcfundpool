import { CheckCircle2, CircleDollarSign, Network, Wallet, type LucideIcon } from "lucide-react";
import { arcTestnet, CONTRACTS, USDC_TOKEN } from "@arcfundpool/config";
import { AddArcNetworkButton } from "@/features/network/components/AddArcNetworkButton";
import { getOnchainConfig } from "@/lib/onchain";

export default function SettingsPage() {
  const config = getOnchainConfig();

  return (
    <section className="app-container max-w-4xl py-8 md:py-12">
      <h1 className="text-3xl font-semibold text-white md:text-4xl">Settings and network helper</h1>
      <p className="mt-3 text-[var(--muted)]">Use Arc Testnet for USDC contributions, settlement, refunds, withdrawals, and gas-related wallet messaging.</p>

      <div className="card mt-8 overflow-hidden p-5 md:p-6">
        <div className="-mx-5 -mt-5 mb-6 bg-[linear-gradient(90deg,rgba(39,117,202,0.24),rgba(55,213,255,0.12))] px-5 py-4 md:-mx-6 md:-mt-6 md:px-6">
          <p className="text-sm font-semibold text-cyan-100">Arc Testnet network helper</p>
          <p className="mt-1 text-xs text-[var(--muted)]">Use this network for funding, settlement, refunds, withdrawals, and USDC gas.</p>
        </div>
        <div className="flex items-start gap-4">
          <div className="grid size-12 place-items-center rounded-2xl bg-cyan-300/12 text-cyan-100">
            <Network size={22} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Arc Testnet</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Add Arc Testnet to your wallet before creating or contributing to pools.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Info label="Mode" value={config.hasContract ? "Onchain mode" : "Fallback preview mode"} />
          <Info label="Network" value={arcTestnet.name} />
          <Info label="Chain ID" value={String(arcTestnet.id)} />
          <Info label="Gas token" value="USDC" />
          <Info label="Settlement asset" value={USDC_TOKEN.symbol} />
          <Info label="ArcFundPool contract" value={CONTRACTS.arcFundPool.address} />
          <Info label="USDC address" value={USDC_TOKEN.address} />
          <Info label="Explorer URL" value={arcTestnet.blockExplorers?.default.url ?? "Not configured"} />
        </div>
        <AddArcNetworkButton />
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <p className="mt-2 font-semibold text-white">{value}</p>
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
