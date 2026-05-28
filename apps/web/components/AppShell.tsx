import { DesktopNav } from "@/components/DesktopNav";
import { MobileNav } from "@/components/MobileNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden pb-20 lg:pb-0">
      <DesktopNav />
      <main className="min-w-0">{children}</main>
      <MobileNav />
    </div>
  );
}
