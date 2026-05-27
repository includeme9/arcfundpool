import { ExternalLink } from "lucide-react";

export function ExplorerLink({ href, label = "Explorer" }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="tap-target inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
    >
      {label}
      <ExternalLink size={15} />
    </a>
  );
}
