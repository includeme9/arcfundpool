"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { WagmiProvider } from "wagmi";
import { defineChain, http } from "viem";
import { env } from "@arcfundpool/config";

const arcTestnet = defineChain({
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.arc.network"]
    },
    public: {
      http: ["https://rpc.testnet.arc.network"]
    }
  },
  blockExplorers: {
    default: {
      name: "Arcscan",
      url: "https://testnet.arcscan.app"
    }
  },
  testnet: true
});

const walletConnectProjectId = env.walletConnectProjectId || "WALLETCONNECT_PROJECT_ID_NOT_CONFIGURED";

if (!env.walletConnectProjectId && typeof window !== "undefined") {
  console.warn("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not configured. WalletConnect will be unavailable until it is set.");
}

const wagmiConfig = getDefaultConfig({
  appName: "ArcFundPool",
  projectId: walletConnectProjectId,
  chains: [arcTestnet],
  transports: {
    [arcTestnet.id]: http("https://rpc.testnet.arc.network")
  },
  ssr: true
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({ accentColor: "#2775CA", borderRadius: "large" })}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
