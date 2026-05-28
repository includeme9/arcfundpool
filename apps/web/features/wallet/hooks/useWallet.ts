"use client";

import { useMemo, useState } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useChainId, useConnectorClient, useDisconnect, useSwitchChain } from "wagmi";
import { env } from "@arcfundpool/config";
import { addOrSwitchArcTestnet, ARC_TESTNET_CHAIN_ID, isArcTestnet as isArcChain } from "@/features/network/utils/arcNetwork";

export type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
};

declare global {
  interface Window {
    ethereum?: any;
  }
}

function friendlyWalletError(error: unknown, connectorName: string) {
  const maybeError = error as { code?: number; message?: string };
  console.warn("[ArcFundPool] Wallet action failed", {
    connectorName,
    code: maybeError?.code,
    message: maybeError?.message
  });

  const message = maybeError?.message?.toLowerCase() ?? "";
  if (maybeError?.code === 4001 || message.includes("rejected")) return "Wallet request was rejected.";
  if (message.includes("not supported")) return "Your wallet app may not support this connection method.";
  return "Wallet connection is unavailable. Please try again.";
}

export function useWallet() {
  const account = useAccount();
  const activeChainId = useChainId();
  const { data: connectorClient } = useConnectorClient();
  const { disconnect } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();
  const { openConnectModal } = useConnectModal();
  const [walletError, setWalletError] = useState<string>();

  const provider = useMemo<EthereumProvider | undefined>(() => {
    if (connectorClient?.request) {
      return {
        request: connectorClient.request
      };
    }

    return typeof window !== "undefined" ? window.ethereum : undefined;
  }, [connectorClient]);

  const isConnected = account.isConnected;
  const address = account.address;
  const chainId = isConnected ? account.chainId ?? activeChainId : undefined;
  const isArcTestnet = isConnected && isArcChain(chainId);
  const isWrongNetwork = isConnected && !isArcTestnet;
  const hasInjectedWallet = typeof window !== "undefined" && Boolean(window.ethereum);
  const hasWalletConnect = Boolean(env.walletConnectProjectId);

  async function connect() {
    setWalletError(undefined);

    if (!openConnectModal) {
      const message = "Wallet connection is loading. Please try again.";
      console.warn("[ArcFundPool] RainbowKit connect modal is unavailable.");
      setWalletError(message);
      return;
    }

    try {
      openConnectModal();
    } catch (error) {
      setWalletError(friendlyWalletError(error, "RainbowKit"));
    }
  }

  async function connectWalletConnect() {
    if (!hasWalletConnect) {
      setWalletError("WalletConnect Project ID is not configured.");
      return;
    }

    await connect();
  }

  async function request(args: { method: string; params?: unknown[] }) {
    if (!provider) {
      throw new Error(hasWalletConnect ? "Use WalletConnect or open this site in your wallet browser." : "Wallet connection is unavailable. Please try again.");
    }

    return provider.request(args);
  }

  async function switchToArcTestnet() {
    setWalletError(undefined);

    try {
      if (switchChainAsync) {
        await switchChainAsync({ chainId: ARC_TESTNET_CHAIN_ID });
        return { ok: true, message: "Switched to Arc Testnet." };
      }
    } catch (error) {
      console.warn("[ArcFundPool] wagmi network switch failed; trying wallet_addEthereumChain fallback.", {
        message: error instanceof Error ? error.message : String(error)
      });
    }

    const result = await addOrSwitchArcTestnet(provider?.request.bind(provider));
    if (!result.ok) setWalletError(result.message);
    return result;
  }

  return {
    address,
    chainId,
    provider,
    walletError,
    isConnecting: account.status === "connecting" || account.status === "reconnecting",
    isConnected,
    isArcTestnet,
    isWrongNetwork,
    hasInjectedWallet,
    hasWalletConnect,
    connect,
    connectInjected: connect,
    connectWalletConnect,
    disconnect,
    refreshWallet: async () => undefined,
    request,
    switchToArcTestnet
  };
}
