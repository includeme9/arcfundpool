import { CreatePoolForm } from "@/features/pools/components/CreatePoolForm";

export default function CreatePage() {
  return (
    <section className="app-container py-8 md:py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--cyan)]">Create pool</p>
        <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Launch a transparent USDC funding pool</h1>
        <p className="mt-3 text-[var(--muted)]">Keep the form short, publish metadata, and create the funding pool on Arc Testnet.</p>
      </div>
      <CreatePoolForm />
    </section>
  );
}
