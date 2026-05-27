import type { PoolStatus } from "@arcfundpool/types";

export function statusLabel(status: PoolStatus) {
  const labels: Record<PoolStatus, string> = {
    active: "Active",
    funded: "Funded",
    expired: "Expired",
    refundable: "Refundable",
    withdrawn: "Withdrawn",
    cancelled: "Cancelled"
  };
  return labels[status];
}
