import { env } from "./env";

export const APP_NAME = "ArcFundPool";

export const CONTRACTS = {
  arcFundPool: {
    // TODO: Set NEXT_PUBLIC_ARC_FUND_POOL_ADDRESS to the deployed ArcFundPool contract address.
    address: env.arcFundPoolAddress || "0x0000000000000000000000000000000000000000"
  }
} as const;

export const POOL_CATEGORIES = [
  "Open Source",
  "Community",
  "Events",
  "Bounties",
  "Teams",
  "Infrastructure"
] as const;
