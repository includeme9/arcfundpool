import { arcTestnet } from "@arcfundpool/config";

export function NetworkBadge() {
  return (
    <div className="hidden rounded-full border border-cyan-300/18 bg-cyan-300/[0.08] px-3 py-2 text-xs font-semibold text-cyan-100 lg:block">
      {arcTestnet.name} · USDC gas
    </div>
  );
}
