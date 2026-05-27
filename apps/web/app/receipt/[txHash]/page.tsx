import { ReceiptCard } from "@/components/ReceiptCard";
import { findReceipt } from "@/features/receipts/utils/findReceipt";

export default function ReceiptPage({ params }: { params: { txHash: string } }) {
  const { txHash } = params;
  const receipt = findReceipt(txHash);

  return (
    <section className="app-container max-w-3xl py-8 md:py-12">
      <ReceiptCard receipt={receipt} />
    </section>
  );
}
