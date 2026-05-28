"use client";

import { create } from "zustand";
import { arcTestnet, env } from "@arcfundpool/config";

export type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
  disconnect?: () => Promise<void>;
};

type ConnectorKind = "injected" | "walletconnect";

type WalletState = {
  address?: string;
  chainId?: number;
  connector?: ConnectorKind;
  provider?: EthereumProvider;
  walletError?: string;
  isConnecting: boolean;
  connect: () => Promise<void>;
  connectInjected: () => Promise<void>;
  connectWalletConnect: () => Promise<void>;
  refreshWallet: () => Promise<void>;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

let warnedMissingProjectId = false;
let walletConnectProvider: EthereumProvider | undefined;

function warnMissingProjectId() {
  if (!warnedMissingProjectId) {
    console.warn("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not configured. WalletConnect is disabled; injected wallets still work.");
    warnedMissingProjectId = true;
  }
}

function walletConnectErrorMessage(error: unknown) {
  const maybeError = error as { message?: string; code?: number };
  console.warn("[ArcFundPool] WalletConnect connection failed", {
    code: maybeError?.code,
    message: maybeError?.message
  });

  if (maybeError?.message?.toLowerCase().includes("user rejected")) {
    return "Wallet request was rejected.";
  }

  return "WalletConnect could not be opened. Check the Project ID configuration and try again.";
}

function parseChainId(chainIdHex?: string) {
  return chainIdHex ? Number.parseInt(chainIdHex, 16) : undefined;
}

async function readProviderState(provider?: EthereumProvider) {
  if (!provider) return { address: undefined, chainId: undefined };
  const accounts = (await provider.request({ method: "eth_accounts" })) as string[] | undefined;
  const chainIdHex = (await provider.request({ method: "eth_chainId" })) as string | undefined;
  return {
    address: accounts?.[0],
    chainId: parseChainId(chainIdHex)
  };
}

function attachProviderEvents(provider: EthereumProvider, refreshWallet: () => Promise<void>) {
  const handleAccountsChanged = () => void refreshWallet();
  const handleChainChanged = () => void refreshWallet();
  provider.on?.("accountsChanged", handleAccountsChanged);
  provider.on?.("chainChanged", handleChainChanged);
}

async function getWalletConnectProvider() {
  if (!env.walletConnectProjectId) {
    warnMissingProjectId();
    return undefined;
  }

  if (walletConnectProvider) return walletConnectProvider;

  const EthereumProviderModule = await import("@walletconnect/ethereum-provider");
  const Provider = EthereumProviderModule.default;

  walletConnectProvider = (await Provider.init({
    projectId: env.walletConnectProjectId,
    chains: [arcTestnet.id],
    optionalChains: [arcTestnet.id],
    showQrModal: true,
    rpcMap: {
      [arcTestnet.id]: arcTestnet.rpcUrls.default.http[0]
    },
    metadata: {
      name: "ArcFundPool",
      description: "Transparent USDC funding pools on Arc Testnet.",
      url: env.appUrl,
      icons: []
    }
  })) as EthereumProvider;

  return walletConnectProvider;
}

const walletStore = create<WalletState>((set, get) => ({
  isConnecting: false,
  async refreshWallet() {
    const provider = get().provider ?? (typeof window !== "undefined" ? window.ethereum : undefined);
    const state = await readProviderState(provider);
    set({ ...state, provider });
  },
  async connectInjected() {
    if (!window.ethereum) return;
    set({ isConnecting: true, walletError: undefined });
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      set({ provider: window.ethereum, connector: "injected" });
      attachProviderEvents(window.ethereum, get().refreshWallet);
      await get().refreshWallet();
    } finally {
      set({ isConnecting: false });
    }
  },
  async connectWalletConnect() {
    set({ isConnecting: true, walletError: undefined });
    try {
      const provider = await getWalletConnectProvider();
      if (!provider) {
        set({ walletError: "WalletConnect Project ID is not configured." });
        return;
      }
      await provider.request({ method: "eth_requestAccounts" });
      set({ provider, connector: "walletconnect" });
      attachProviderEvents(provider, get().refreshWallet);
      await get().refreshWallet();
    } catch (error) {
      set({ walletError: walletConnectErrorMessage(error) });
    } finally {
      set({ isConnecting: false });
    }
  },
  async connect() {
    if (typeof window !== "undefined" && window.ethereum) {
      await get().connectInjected();
      return;
    }

    await get().connectWalletConnect();
  },
  async request(args) {
    const provider = get().provider ?? (typeof window !== "undefined" ? window.ethereum : undefined);
    return provider?.request(args);
  }
}));

export function useWallet() {
  const state = walletStore();
  const hasInjectedWallet = typeof window !== "undefined" && Boolean(window.ethereum);
  const hasWalletConnect = Boolean(env.walletConnectProjectId);

  if (!hasWalletConnect && typeof window !== "undefined") {
    warnMissingProjectId();
  }

  return {
    ...state,
    isConnected: Boolean(state.address),
    hasInjectedWallet,
    hasWalletConnect
  };
}
