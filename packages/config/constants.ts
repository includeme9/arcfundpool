export const APP_NAME = "ArcFundPool";

export const CONTRACTS = {
  arcFundPool: {
    // TODO: Replace with the deployed ArcFundPool contract address.
    address: "0x0000000000000000000000000000000000000000"
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
