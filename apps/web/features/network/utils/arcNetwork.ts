export const ARC_TESTNET_CHAIN_ID = 5042002;
export const ARC_TESTNET_CHAIN_ID_HEX = "0x4cef52";

type EthereumRequest = (args: { method: string; params?: unknown[] }) => Promise<unknown>;

type NetworkActionResult = {
  ok: boolean;
  message: string;
};

function warnWalletError(context: string, error: unknown) {
  const maybeError = error as { code?: number; message?: string };
  console.warn(`[ArcFundPool] ${context}`, {
    code: maybeError?.code,
    message: maybeError?.message
  });
}

function friendlyWalletError(error: unknown, context: string): NetworkActionResult {
  warnWalletError(context, error);
  const maybeError = error as { code?: number; message?: string };
  const message = maybeError?.message?.toLowerCase() ?? "";

  if (maybeError?.code === 4001 || message.includes("rejected")) {
    return { ok: false, message: "Wallet request was rejected." };
  }

  if (
    maybeError?.code === -32601 ||
    maybeError?.code === 4200 ||
    message.includes("unsupported") ||
    message.includes("not supported") ||
    message.includes("method not found")
  ) {
    return { ok: false, message: "Your wallet does not support automatic network switching." };
  }

  return { ok: false, message: "Unable to switch networks. Please switch to Arc Testnet in your wallet." };
}

export async function addOrSwitchArcTestnet(request?: EthereumRequest): Promise<NetworkActionResult> {
  const walletRequest = request ?? (typeof window !== "undefined" ? window.ethereum?.request.bind(window.ethereum) : undefined);

  if (!walletRequest) {
    return { ok: false, message: "Wallet not installed." };
  }

  try {
    await walletRequest({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ARC_TESTNET_CHAIN_ID_HEX }]
    });

    return { ok: true, message: "Switched to Arc Testnet." };
  } catch (switchError) {
    const maybeError = switchError as { code?: number };

    if (maybeError?.code !== 4902) {
      return friendlyWalletError(switchError, "Failed to switch to Arc Testnet");
    }

    warnWalletError("Arc Testnet is not available in the wallet yet", switchError);

    try {
      await walletRequest({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: ARC_TESTNET_CHAIN_ID_HEX,
            chainName: "Arc Testnet",
            nativeCurrency: {
              name: "USDC",
              symbol: "USDC",
              decimals: 18
            },
            rpcUrls: ["https://rpc.testnet.arc.network"],
            blockExplorerUrls: ["https://testnet.arcscan.app"]
          }
        ]
      });

      try {
        await walletRequest({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ARC_TESTNET_CHAIN_ID_HEX }]
        });

        return { ok: true, message: "Switched to Arc Testnet." };
      } catch (secondSwitchError) {
        const friendly = friendlyWalletError(secondSwitchError, "Failed to switch after adding Arc Testnet");
        return friendly.ok ? friendly : { ok: true, message: "Arc Testnet was added. Please switch to it in your wallet." };
      }
    } catch (addError) {
      return friendlyWalletError(addError, "Failed to add Arc Testnet");
    }
  }
}

export function isArcTestnet(chainId?: number) {
  return chainId === ARC_TESTNET_CHAIN_ID;
}
