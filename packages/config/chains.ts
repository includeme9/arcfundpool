import type { Chain } from "viem";
import { env } from "./env";

const fallbackRpcUrl = "https://rpc.testnet.arc.network";
const fallbackExplorerUrl = "https://testnet.arcscan.app";

export const arcTestnet = {
  id: env.arcChainId,
  name: "Arc Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "USDC",
    symbol: "USDC"
  },
  rpcUrls: {
    // TODO: Set NEXT_PUBLIC_ARC_RPC_URL before enabling live onchain reads.
    default: { http: [env.arcTestnetRpcUrl || fallbackRpcUrl] },
    public: { http: [env.arcTestnetRpcUrl || fallbackRpcUrl] }
  },
  blockExplorers: {
    default: {
      name: "Arcscan",
      // TODO: Set NEXT_PUBLIC_ARC_EXPLORER_URL before deployment.
      url: env.arcExplorerUrl || fallbackExplorerUrl
    }
  },
  testnet: true
} as const satisfies Chain;

export const supportedChains = [arcTestnet] as const;
