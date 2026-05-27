import { DesktopNav } from "@/components/DesktopNav";
import { MobileNav } from "@/components/MobileNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <DesktopNav />
      <main>{children}</main>
      <MobileNav />
    </div>
  );
}
