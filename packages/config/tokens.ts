import { arcTestnet } from "./chains";

export const USDC_TOKEN = {
  chainId: arcTestnet.id,
  symbol: "USDC",
  name: "USD Coin",
  decimals: 6,
  // TODO: Replace with the official Arc Testnet USDC contract address.
  address: "0x0000000000000000000000000000000000000000"
} as const;
