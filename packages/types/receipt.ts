export type ReceiptStatus = "confirmed" | "pending" | "failed";

export type TransactionReceipt = {
  txHash: `0x${string}`;
  poolName: string;
  contributorAddress: `0x${string}`;
  amount: number;
  timestamp: string;
  status: ReceiptStatus;
  explorerUrl: string;
};
