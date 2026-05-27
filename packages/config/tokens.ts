import { arcTestnet } from "./chains";
import { env } from "./env";

export const USDC_TOKEN = {
  chainId: arcTestnet.id,
  symbol: "USDC",
  name: "USD Coin",
  decimals: 6,
  // TODO: Set NEXT_PUBLIC_ARC_USDC_ADDRESS to the official Arc Testnet USDC contract address.
  address: env.arcUsdcAddress || "0x0000000000000000000000000000000000000000"
} as const;
