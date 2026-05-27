import { shortenAddress } from "@arcfundpool/utils";

export function AddressPill({ address }: { address: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-[var(--muted)]">
      {shortenAddress(address)}
    </span>
  );
}
