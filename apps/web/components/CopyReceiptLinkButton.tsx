"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "@/components/CopyButton";

export function CopyReceiptLinkButton() {
  const [href, setHref] = useState("");

  useEffect(() => {
    setHref(window.location.href);
  }, []);

  return <CopyButton value={href} label="Copy receipt link" />;
}
