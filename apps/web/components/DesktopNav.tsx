"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Compass, Droplets, PlusCircle, ReceiptText, Settings } from "lucide-react";
import { WalletButton } from "@/features/wallet/components/WalletButton";
import { cn } from "@/lib/cn";

const links = [
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/create", label: "Create", icon: PlusCircle },
  { href: "/dashboard", label: "Creator", icon: BarChart3 },
  { href: "/contributor", label: "Contributor", icon: ReceiptText },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 hidden border-b border-white/10 bg-[#06101f]/88 backdrop-blur-xl lg:block">
      <div className="app-container flex min-h-[72px] min-w-0 items-center justify-between gap-4 py-3">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3">
          <div className="grid size-9 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--cyan),var(--violet))] font-bold text-white">
            A
          </div>
          <div className="min-w-0">
            <p className="text-base font-semibold">ArcFundPool</p>
            <p className="text-xs text-[var(--muted)]">USDC funding pools on Arc</p>
          </div>
        </Link>
        <nav className="flex min-w-0 items-center gap-1 rounded-full border border-white/10 bg-white/[0.025] p-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-2 text-sm text-[var(--muted)] transition hover:bg-white/[0.05] hover:text-white xl:px-3.5",
                  active && "bg-white/10 text-white shadow-inner"
                )}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex min-w-0 shrink-0 items-center gap-2">
          <a
            href="https://faucet.circle.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
          >
            <Droplets size={15} />
            Get Faucet
          </a>
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
