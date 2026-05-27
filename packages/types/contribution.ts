export type Contribution = {
  id: string;
  chainPoolId: bigint;
  txHash: `0x${string}`;
  contributorWallet: `0x${string}`;
  amount: number;
  timestamp: string;
};
