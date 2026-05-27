import type { Chain } from "viem";

export const arcTestnet = {
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: {
    decimals: 6,
    name: "USDC",
    symbol: "USDC"
  },
  // TODO: Replace with the official Arc Testnet RPC URL before deployment.
  rpcUrls: {
    default: { http: ["https://rpc.todo.arc-testnet.example"] },
    public: { http: ["https://rpc.todo.arc-testnet.example"] }
  },
  blockExplorers: {
    default: {
      name: "Arc Explorer",
      // TODO: Replace with the official Arc Testnet explorer URL.
      url: "https://explorer.todo.arc-testnet.example"
    }
  },
  testnet: true
} as const satisfies Chain;

export const supportedChains = [arcTestnet] as const;
