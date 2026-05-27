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
  const [chainId, setChainId] = useState<number>();
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    async function loadAccounts() {
      const accounts = (await window.ethereum?.request({ method: "eth_accounts" })) as string[] | undefined;
      const chainIdHex = (await window.ethereum?.request({ method: "eth_chainId" })) as string | undefined;
      setAddress(accounts?.[0]);
      setChainId(chainIdHex ? Number.parseInt(chainIdHex, 16) : undefined);
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
      const chainIdHex = (await window.ethereum.request({ method: "eth_chainId" })) as string;
      setAddress(accounts[0]);
      setChainId(Number.parseInt(chainIdHex, 16));
    } finally {
      setIsConnecting(false);
    }
  }

  async function request(args: { method: string; params?: unknown[] }) {
    return window.ethereum?.request(args);
  }

  return {
    address,
    chainId,
    isConnected: Boolean(address),
    isConnecting,
    connect,
    request,
    hasInjectedWallet: typeof window !== "undefined" && Boolean(window.ethereum)
  };
}
