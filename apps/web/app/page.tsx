import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleDollarSign, LockKeyhole, ReceiptText, RotateCcw, Smartphone } from "lucide-react";
import { PoolCard } from "@/components/PoolCard";
import type { FundingPool } from "@arcfundpool/types";

const features = [
  { title: "USDC Contributions", text: "Contributors fund pools with USDC, with clear wallet and balance states.", icon: CircleDollarSign },
  { title: "Onchain Progress", text: "Targets, raised amounts, creator wallets, and events are designed to stay verifiable.", icon: ReceiptText },
  { title: "Refundable Pools", text: "If a pool expires under target, contributors can claim their USDC back.", icon: RotateCcw },
  { title: "Creator Withdrawals", text: "Creators can withdraw only after the pool reaches its target amount.", icon: LockKeyhole }
];

const steps = ["Create a pool", "Share the link", "Receive USDC contributions", "Withdraw when funded or refund if failed"];

const previewPool: FundingPool = {
  id: "preview",
  chainPoolId: 0n,
  title: "Example funding pool",
  description: "A mobile preview of how a transparent Arc Testnet USDC pool appears after it is created onchain.",
  category: "Community",
  creatorWallet: "0x0000000000000000000000000000000000000000",
  targetAmount: 10000,
  totalRaised: 6400,
  deadline: "2026-07-20T00:00:00.000Z",
  metadataURI: "",
  status: "active",
  withdrawn: false,
  cancelled: false,
  createdAt: "2026-05-20T00:00:00.000Z"
};

export default function LandingPage() {
  return (
    <div>
      <section className="app-container grid min-h-[calc(100vh-80px)] gap-10 py-10 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-100">
            Stablecoin-native funding on Arc Testnet
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Create transparent USDC funding pools on Arc.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            Launch a pool, accept USDC contributions, and let your community track funding progress with onchain records.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/create" className="tap-target inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 font-semibold text-white sm:w-auto">
              Create Pool
              <ArrowRight size={18} />
            </Link>
            <Link href="/explore" className="tap-target inline-flex w-full items-center justify-center rounded-full border border-white/10 px-6 py-3 font-semibold text-white sm:w-auto">
              Explore Pools
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[360px]">
          <div className="absolute inset-5 rounded-[42px] bg-[linear-gradient(135deg,var(--primary),var(--cyan),var(--violet))] blur-2xl opacity-30" />
          <div className="relative rounded-[42px] border border-white/14 bg-[#071426] p-3 shadow-2xl">
            <div className="rounded-[32px] border border-white/10 bg-[#09172a] p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--muted)]">ArcFundPool</p>
                  <p className="font-semibold text-white">Mobile funding view</p>
                </div>
                <Smartphone className="text-[var(--cyan)]" size={20} />
              </div>
              <PoolCard pool={previewPool} />
            </div>
          </div>
        </div>
      </section>

      <section className="app-container grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="card p-5">
              <div className="grid size-11 place-items-center rounded-2xl bg-blue-400/12 text-[var(--primary-strong)]">
                <Icon size={21} />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-white">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{feature.text}</p>
            </div>
          );
        })}
      </section>

      <section className="app-container py-10">
        <div className="card p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-white">How transparent funding works</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step} className="rounded-3xl border border-white/10 bg-white/[0.035] p-4">
                <div className="mb-4 flex size-9 items-center justify-center rounded-full bg-cyan-300/12 text-sm font-bold text-cyan-100">{index + 1}</div>
                <p className="font-semibold text-white">{step}</p>
                <CheckCircle2 className="mt-4 text-emerald-300" size={18} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
