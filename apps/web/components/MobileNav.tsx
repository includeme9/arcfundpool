"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Compass, Home, PlusCircle, Settings } from "lucide-react";
import { cn } from "@/lib/cn";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/create", label: "Create", icon: PlusCircle },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/settings", label: "Network", icon: Settings }
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#06101f]/96 px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-5 gap-1 rounded-[22px] border border-white/8 bg-white/[0.025] p-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative flex min-w-0 flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-medium text-[var(--muted)] transition",
                active && "bg-blue-400/14 text-white"
              )}
            >
              {active && <span className="absolute top-1 h-0.5 w-5 rounded-full bg-[var(--cyan)]" />}
              <Icon size={link.href === "/create" ? 22 : 20} className={link.href === "/create" ? "text-[var(--primary-strong)]" : ""} />
              <span className="max-w-full truncate">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
