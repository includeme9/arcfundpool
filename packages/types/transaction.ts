export type TransactionKind = "created" | "contribution" | "withdraw" | "refund" | "cancel";
export type TransactionStatus = "pending" | "confirmed" | "failed";

export type PoolTransaction = {
  id: string;
  kind: TransactionKind;
  txHash: `0x${string}`;
  actor: `0x${string}`;
  amount?: number;
  timestamp: string;
  status: TransactionStatus;
};
