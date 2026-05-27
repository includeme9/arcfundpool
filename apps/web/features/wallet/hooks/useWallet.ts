"use client";

import { useCallback, useEffect, useState } from "react";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, listener: (...args: string[]) => void) => void;
  removeListener?: (event: string, listener: (...args: string[]) => void) => void;
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

  const refreshWallet = useCallback(async () => {
    if (!window.ethereum) return;
    const accounts = (await window.ethereum.request({ method: "eth_accounts" })) as string[] | undefined;
    const chainIdHex = (await window.ethereum.request({ method: "eth_chainId" })) as string | undefined;
    setAddress(accounts?.[0]);
    setChainId(chainIdHex ? Number.parseInt(chainIdHex, 16) : undefined);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      void refreshWallet();

      const handleAccountsChanged = () => void refreshWallet();
      const handleChainChanged = () => void refreshWallet();
      window.ethereum.on?.("accountsChanged", handleAccountsChanged);
      window.ethereum.on?.("chainChanged", handleChainChanged);

      return () => {
        window.ethereum?.removeListener?.("accountsChanged", handleAccountsChanged);
        window.ethereum?.removeListener?.("chainChanged", handleChainChanged);
      };
    }
  }, [refreshWallet]);

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
    refreshWallet,
    request,
    hasInjectedWallet: typeof window !== "undefined" && Boolean(window.ethereum)
  };
}
