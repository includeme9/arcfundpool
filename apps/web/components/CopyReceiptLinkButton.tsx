"use client";

import { CopyButton } from "@/components/CopyButton";

export function CopyReceiptLinkButton() {
  return <CopyButton value={window.location.href} label="Copy receipt link" />;
}
