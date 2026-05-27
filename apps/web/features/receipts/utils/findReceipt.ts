import { receipts } from "@/lib/mock-data";

export function findReceipt(txHash: string) {
  return receipts.find((receipt) => receipt.txHash.toLowerCase() === txHash.toLowerCase()) ?? receipts[0];
}
