import { arcTestnet } from "@arcfundpool/config";

const ARC_TESTNET_CHAIN_ID_HEX = `0x${arcTestnet.id.toString(16)}`;

type EthereumRequest = (args: { method: string; params?: unknown[] }) => Promise<unknown>;

type NetworkActionResult = {
  ok: boolean;
  message: string;
};

function friendlyWalletError(error: unknown): NetworkActionResult {
  const maybeError = error as { code?: number; message?: string };
  const message = maybeError?.message?.toLowerCase() ?? "";

  if (maybeError?.code === 4001 || message.includes("rejected")) {
    return { ok: false, message: "Wallet request was rejected." };
  }

  if (message.includes("unsupported") || message.includes("not supported")) {
    return { ok: false, message: "Your wallet does not support automatic network switching." };
  }

  return { ok: false, message: "Unable to switch networks. Please switch to Arc Testnet in your wallet." };
}

export async function addOrSwitchArcTestnet(request?: EthereumRequest): Promise<NetworkActionResult> {
  if (!request) {
    return { ok: false, message: "Wallet not installed." };
  }

  try {
    await request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ARC_TESTNET_CHAIN_ID_HEX }]
    });

    return { ok: true, message: "Switched to Arc Testnet." };
  } catch (switchError) {
    const maybeError = switchError as { code?: number };

    if (maybeError?.code !== 4902) {
      return friendlyWalletError(switchError);
    }

    try {
      await request({
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

      return { ok: true, message: "Arc Testnet was added. Please switch to it in your wallet." };
    } catch (addError) {
      return friendlyWalletError(addError);
    }
  }
}

export function isArcTestnet(chainId?: number) {
  return chainId === arcTestnet.id;
}
