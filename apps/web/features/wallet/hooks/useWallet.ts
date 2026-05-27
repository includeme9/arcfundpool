"use client";

import { useEffect, useState } from "react";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export function useWallet() {
  const [address, setAddress] = useState<string>();
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    async function loadAccounts() {
      const accounts = (await window.ethereum?.request({ method: "eth_accounts" })) as string[] | undefined;
      setAddress(accounts?.[0]);
    }

    if (typeof window !== "undefined" && window.ethereum) {
      void loadAccounts();
    }
  }, []);

  async function connect() {
    if (!window.ethereum) return;
    setIsConnecting(true);
    try {
      const accounts = (await window.ethereum.request({ method: "eth_requestAccounts" })) as string[];
      setAddress(accounts[0]);
    } finally {
      setIsConnecting(false);
    }
  }

  return {
    address,
    isConnected: Boolean(address),
    isConnecting,
    connect,
    hasInjectedWallet: typeof window !== "undefined" && Boolean(window.ethereum)
  };
}
