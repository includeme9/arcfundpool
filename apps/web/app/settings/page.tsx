import { AlertTriangle, CircleDollarSign, Network, PlusCircle } from "lucide-react";
import { arcTestnet, USDC_TOKEN } from "@arcfundpool/config";

export default function SettingsPage() {
  return (
    <section className="app-container max-w-4xl py-8 md:py-12">
      <h1 className="text-3xl font-semibold text-white md:text-4xl">Settings and network helper</h1>
      <p className="mt-3 text-[var(--muted)]">Use Arc Testnet for USDC contributions, settlement, refunds, withdrawals, and gas-related wallet messaging.</p>

      <div className="card mt-8 p-5 md:p-6">
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
          <Info label="Network name" value={arcTestnet.name} />
          <Info label="Chain ID" value={String(arcTestnet.id)} />
          <Info label="Gas token" value="USDC" />
          <Info label="Settlement asset" value={USDC_TOKEN.symbol} />
        </div>
        <button className="tap-target mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-5 py-3 font-semibold text-white">
          <PlusCircle size={18} />
          Add Arc Network
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Message title="Wallet disconnected" text="Connect a wallet to create pools, approve USDC, contribute, withdraw, or refund." />
        <Message title="Wrong network" text="Switch to Arc Testnet before signing transactions." />
        <Message title="Insufficient USDC" text="Add USDC for both contribution amount and Arc gas-related costs." />
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

function Message({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
      <AlertTriangle className="text-amber-200" size={20} />
      <h3 className="mt-3 font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p>
    </div>
  );
}
