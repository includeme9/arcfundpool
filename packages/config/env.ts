export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  arcTestnetRpcUrl: process.env.NEXT_PUBLIC_ARC_RPC_URL ?? process.env.NEXT_PUBLIC_ARC_TESTNET_RPC_URL ?? process.env.ARC_TESTNET_RPC_URL ?? "",
  arcChainId: Number(process.env.NEXT_PUBLIC_ARC_CHAIN_ID ?? 5042002),
  arcFundPoolAddress: process.env.NEXT_PUBLIC_ARC_FUND_POOL_ADDRESS ?? "",
  arcUsdcAddress: process.env.NEXT_PUBLIC_ARC_USDC_ADDRESS ?? "",
  arcExplorerUrl: process.env.NEXT_PUBLIC_ARC_EXPLORER_URL ?? ""
};
