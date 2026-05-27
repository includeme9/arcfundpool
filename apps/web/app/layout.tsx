import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { Web3Provider } from "@/features/wallet/components/Web3Provider";

export const metadata: Metadata = {
  title: "ArcFundPool",
  description: "Create transparent USDC funding pools on Arc."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          <AppShell>{children}</AppShell>
        </Web3Provider>
      </body>
    </html>
  );
}
