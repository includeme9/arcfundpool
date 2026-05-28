"use client";

import { Check, ChevronDown, Copy, LogOut, Wallet } from "lucide-react";
import { useState } from "react";
import { shortenAddress } from "@arcfundpool/utils";
import { useWallet } from "@/features/wallet/hooks/useWallet";

export function WalletMenu({ compact = false }: { compact?: boolean }) {
  const { address, disconnect } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!address) return null;

  async function copyAddress() {
    await navigator.clipboard.writeText(address!);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  function disconnectWallet() {
    setIsOpen(false);
    disconnect();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className={`tap-target inline-flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.045] font-semibold text-white transition hover:bg-white/10 ${compact ? "px-2.5 py-1.5 text-[11px]" : "px-4 py-2 text-sm"}`}
      >
        <Wallet size={compact ? 13 : 16} />
        {shortenAddress(address)}
        <ChevronDown size={compact ? 12 : 14} />
      </button>

      {isOpen && (
        <div className={`absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-3xl border border-white/10 bg-[#081323] p-2 shadow-2xl shadow-black/35 ${compact ? "top-full" : ""}`}>
          <div className="px-3 py-2">
            <p className="text-xs text-[var(--muted)]">Connected wallet</p>
            <p className="mt-1 truncate text-sm font-semibold text-white" title={address}>{shortenAddress(address, 8)}</p>
          </div>
          <button
            type="button"
            onClick={copyAddress}
            className="tap-target flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm font-semibold text-white hover:bg-white/[0.06]"
          >
            {copied ? <Check size={16} className="text-emerald-300" /> : <Copy size={16} />}
            {copied ? "Copied" : "Copy address"}
          </button>
          <button
            type="button"
            onClick={disconnectWallet}
            className="tap-target flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm font-semibold text-rose-100 hover:bg-rose-400/10"
          >
            <LogOut size={16} />
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
