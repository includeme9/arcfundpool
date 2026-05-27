import type { Chain } from "viem";
import { env } from "./env";

const fallbackRpcUrl = "https://rpc.todo.arc-testnet.example";
const fallbackExplorerUrl = "https://explorer.todo.arc-testnet.example";

export const arcTestnet = {
  id: env.arcChainId,
  name: "Arc Testnet",
  nativeCurrency: {
    decimals: 6,
    name: "USDC",
    symbol: "USDC"
  },
  rpcUrls: {
    // TODO: Set NEXT_PUBLIC_ARC_TESTNET_RPC_URL before enabling live onchain reads.
    default: { http: [env.arcTestnetRpcUrl || fallbackRpcUrl] },
    public: { http: [env.arcTestnetRpcUrl || fallbackRpcUrl] }
  },
  blockExplorers: {
    default: {
      name: "Arc Explorer",
      // TODO: Set NEXT_PUBLIC_ARC_EXPLORER_URL before deployment.
      url: env.arcExplorerUrl || fallbackExplorerUrl
    }
  },
  testnet: true
} as const satisfies Chain;

export const supportedChains = [arcTestnet] as const;
