import {
  createPublicClient,
  custom,
  formatUnits,
  getAddress,
  http,
  isAddress,
  parseUnits,
  createWalletClient,
  decodeEventLog,
  type Address,
  type Hash
} from "viem";
import { arcTestnet, CONTRACTS, USDC_TOKEN } from "@arcfundpool/config";
import type { Contribution, FundingPool, PoolStatus, PoolTransaction, TransactionReceipt } from "@arcfundpool/types";
import { arcFundPoolAbi, erc20Abi } from "@arcfundpool/web3";
import { contributions as fallbackContributions, pools as fallbackPools, receipts as fallbackReceipts, transactions as fallbackTransactions } from "@/lib/mock-data";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export type OnchainConfig = {
  enabled: boolean;
  hasContract: boolean;
  canRead: boolean;
  canWrite: boolean;
  missing: string[];
  contractAddress?: Address;
  usdcAddress?: Address;
  rpcUrl?: string;
  explorerUrl: string;
  chainId: number;
  usdcDecimals: number;
};

export type PoolDataset = {
  pools: FundingPool[];
  contributions: Contribution[];
  transactions: PoolTransaction[];
  isFallback: boolean;
};

export type TxStep =
  | "idle"
  | "approvalRequired"
  | "approving"
  | "approvalConfirmed"
  | "wallet"
  | "pending"
  | "confirmed"
  | "failed";

export function getOnchainConfig(): OnchainConfig {
  const rpcUrl = arcTestnet.rpcUrls.default.http[0];
  const explorerUrl = arcTestnet.blockExplorers?.default.url ?? "";
  const contractAddress = CONTRACTS.arcFundPool.address;
  const usdcAddress = USDC_TOKEN.address;
  const missing: string[] = [];
  const hasContract = isAddress(contractAddress) && contractAddress !== ZERO_ADDRESS;
  const hasRpc = Boolean(rpcUrl && !rpcUrl.includes("todo"));
  const hasUsdc = isAddress(usdcAddress) && usdcAddress !== ZERO_ADDRESS;
  const hasExplorer = Boolean(explorerUrl && !explorerUrl.includes("todo"));

  if (!hasRpc) missing.push("NEXT_PUBLIC_ARC_RPC_URL");
  if (!hasContract) missing.push("NEXT_PUBLIC_ARC_FUND_POOL_ADDRESS");
  if (!hasUsdc) missing.push("NEXT_PUBLIC_ARC_USDC_ADDRESS");
  if (!hasExplorer) missing.push("NEXT_PUBLIC_ARC_EXPLORER_URL");

  return {
    enabled: hasContract && hasRpc && hasUsdc,
    hasContract,
    canRead: hasContract && hasRpc,
    canWrite: hasContract && hasRpc && hasUsdc,
    missing,
    contractAddress: hasContract ? getAddress(contractAddress) : undefined,
    usdcAddress: hasUsdc ? getAddress(usdcAddress) : undefined,
    rpcUrl,
    explorerUrl,
    chainId: arcTestnet.id,
    usdcDecimals: USDC_TOKEN.decimals
  };
}

export function getPublicClient() {
  const config = getOnchainConfig();
  if (!config.canRead || !config.rpcUrl) return null;
  return createPublicClient({
    chain: arcTestnet,
    transport: http(config.rpcUrl)
  });
}

export function getWalletClient(provider: NonNullable<Window["ethereum"]>) {
  return createWalletClient({
    chain: arcTestnet,
    transport: custom(provider)
  });
}

export function getExplorerTxUrl(txHash: string) {
  const config = getOnchainConfig();
  return config.explorerUrl ? `${config.explorerUrl.replace(/\/$/, "")}/tx/${txHash}` : "";
}

export function parseUSDCAmount(value: string, decimals: number = USDC_TOKEN.decimals) {
  return parseUnits(value || "0", decimals);
}

export function formatUSDCAmount(value: bigint, decimals: number = USDC_TOKEN.decimals) {
  return Number(formatUnits(value, decimals));
}

export function derivePoolStatus(pool: Pick<FundingPool, "targetAmount" | "totalRaised" | "deadline" | "withdrawn" | "cancelled">): PoolStatus {
  if (pool.cancelled) return "cancelled";
  if (pool.withdrawn) return "withdrawn";
  const deadlinePassed = Date.now() > new Date(pool.deadline).getTime();
  if (pool.totalRaised >= pool.targetAmount) return "funded";
  if (deadlinePassed) return "refundable";
  return "active";
}

export async function loadPoolDataset(): Promise<PoolDataset> {
  const config = getOnchainConfig();
  const client = getPublicClient();
  if (!config.hasContract) {
    return {
      pools: fallbackPools,
      contributions: fallbackContributions,
      transactions: fallbackTransactions,
      isFallback: true
    };
  }

  if (!client || !config.contractAddress) {
    throw new Error(`Arc Testnet RPC is not configured. Missing: ${config.missing.join(", ")}`);
  }

  try {
    const count = await client.readContract({
      address: config.contractAddress,
      abi: arcFundPoolAbi,
      functionName: "poolCount"
    });

    const poolIds = Array.from({ length: Number(count) }, (_, index) => BigInt(index));
    const pools = await Promise.all(
      poolIds.map(async (poolId) => {
        const raw = await client.readContract({
          address: config.contractAddress!,
          abi: arcFundPoolAbi,
          functionName: "pools",
          args: [poolId]
        });

        const pool: FundingPool = {
          id: poolId.toString(),
          chainPoolId: poolId,
          title: raw[1] || `Pool ${poolId.toString()}`,
          description: raw[2] ? "Metadata is available onchain. Offchain metadata loading can be enabled after deployment." : "Transparent USDC funding pool on Arc Testnet.",
          category: "Community",
          creatorWallet: raw[0],
          targetAmount: formatUSDCAmount(raw[3], config.usdcDecimals),
          totalRaised: formatUSDCAmount(raw[4], config.usdcDecimals),
          deadline: new Date(Number(raw[5]) * 1000).toISOString(),
          metadataURI: raw[2],
          status: "active",
          withdrawn: raw[6],
          cancelled: raw[7],
          createdAt: new Date(Number(raw[5]) * 1000).toISOString()
        };

        return {
          ...pool,
          status: derivePoolStatus(pool)
        };
      })
    );

    const contributions = await loadContributionEvents(config.contractAddress, config.usdcDecimals);
    const transactions = await loadTransactionEvents(config.contractAddress, config.usdcDecimals);

    return {
      pools,
      contributions,
      transactions,
      isFallback: false
    };
  } catch (error) {
    console.error("ArcFundPool read failed", error);
    throw error;
  }
}

export async function loadContributionEvents(contractAddress: Address, decimals: number): Promise<Contribution[]> {
  const client = getPublicClient();
  if (!client) return fallbackContributions;

  const logs = await client.getContractEvents({
    address: contractAddress,
    abi: arcFundPoolAbi,
    eventName: "Contributed",
    fromBlock: 0n,
    toBlock: "latest"
  });

  return Promise.all(
    logs.map(async (log, index) => {
      const block = log.blockNumber ? await client.getBlock({ blockNumber: log.blockNumber }) : undefined;
      return {
        id: `${log.transactionHash}-${index}`,
        chainPoolId: log.args.poolId ?? 0n,
        txHash: log.transactionHash!,
        contributorWallet: log.args.contributor!,
        amount: formatUSDCAmount(log.args.amount ?? 0n, decimals),
        timestamp: block ? new Date(Number(block.timestamp) * 1000).toISOString() : new Date().toISOString()
      };
    })
  );
}

export async function loadTransactionEvents(contractAddress: Address, decimals: number): Promise<PoolTransaction[]> {
  const client = getPublicClient();
  if (!client) return fallbackTransactions;

  const [created, contributed, withdrawn, refunded, cancelled] = await Promise.all([
    client.getContractEvents({ address: contractAddress, abi: arcFundPoolAbi, eventName: "PoolCreated", fromBlock: 0n, toBlock: "latest" }),
    client.getContractEvents({ address: contractAddress, abi: arcFundPoolAbi, eventName: "Contributed", fromBlock: 0n, toBlock: "latest" }),
    client.getContractEvents({ address: contractAddress, abi: arcFundPoolAbi, eventName: "Withdrawn", fromBlock: 0n, toBlock: "latest" }),
    client.getContractEvents({ address: contractAddress, abi: arcFundPoolAbi, eventName: "Refunded", fromBlock: 0n, toBlock: "latest" }),
    client.getContractEvents({ address: contractAddress, abi: arcFundPoolAbi, eventName: "PoolCancelled", fromBlock: 0n, toBlock: "latest" })
  ]);

  const logs = [
    ...created.map((log) => ({ kind: "created" as const, log, actor: log.args.creator, amount: undefined })),
    ...contributed.map((log) => ({ kind: "contribution" as const, log, actor: log.args.contributor, amount: log.args.amount })),
    ...withdrawn.map((log) => ({ kind: "withdraw" as const, log, actor: log.args.creator, amount: log.args.amount })),
    ...refunded.map((log) => ({ kind: "refund" as const, log, actor: log.args.contributor, amount: log.args.amount })),
    ...cancelled.map((log) => ({ kind: "cancel" as const, log, actor: log.args.creator, amount: undefined }))
  ].sort((a, b) => Number((b.log.blockNumber ?? 0n) - (a.log.blockNumber ?? 0n)));

  return Promise.all(
    logs.map(async (entry, index) => {
      const block = entry.log.blockNumber ? await client.getBlock({ blockNumber: entry.log.blockNumber }) : undefined;
      return {
        id: `${entry.log.transactionHash}-${index}`,
        chainPoolId: "poolId" in entry.log.args ? entry.log.args.poolId : undefined,
        kind: entry.kind,
        txHash: entry.log.transactionHash!,
        actor: entry.actor!,
        amount: entry.amount ? formatUSDCAmount(entry.amount, decimals) : undefined,
        timestamp: block ? new Date(Number(block.timestamp) * 1000).toISOString() : new Date().toISOString(),
        status: "confirmed"
      };
    })
  );
}

export async function getContributionAmount(poolId: bigint, contributor?: string) {
  const config = getOnchainConfig();
  const client = getPublicClient();
  if (!config.canRead || !client || !config.contractAddress || !contributor || !isAddress(contributor)) return 0n;

  return client.readContract({
    address: config.contractAddress,
    abi: arcFundPoolAbi,
    functionName: "contributions",
    args: [poolId, getAddress(contributor)]
  });
}

export async function getUsdcBalanceAndAllowance(owner?: string) {
  const config = getOnchainConfig();
  const client = getPublicClient();
  if (!config.canWrite || !client || !config.usdcAddress || !config.contractAddress || !owner || !isAddress(owner)) {
    return { balance: 0n, allowance: 0n };
  }

  const [balance, allowance] = await Promise.all([
    client.readContract({ address: config.usdcAddress, abi: erc20Abi, functionName: "balanceOf", args: [getAddress(owner)] }),
    client.readContract({ address: config.usdcAddress, abi: erc20Abi, functionName: "allowance", args: [getAddress(owner), config.contractAddress] })
  ]);

  return { balance, allowance };
}

export function userFacingError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (message.toLowerCase().includes("user rejected")) return "Transaction was rejected in the wallet.";
  if (message.toLowerCase().includes("insufficient")) return "Insufficient USDC balance or gas amount.";
  if (message.toLowerCase().includes("network")) return "Check that your wallet is connected to Arc Testnet.";
  return "The transaction could not be completed. Review wallet details and try again.";
}

export async function waitForReceipt(txHash: Hash) {
  const client = getPublicClient();
  if (!client) throw new Error("RPC client is not configured.");
  return client.waitForTransactionReceipt({ hash: txHash });
}

export function fallbackReceipt(txHash: `0x${string}`): TransactionReceipt {
  return {
    ...(fallbackReceipts[0] ?? {
      poolName: "ArcFundPool transaction",
      contributorAddress: ZERO_ADDRESS as `0x${string}`,
      amount: 0,
      timestamp: new Date().toISOString(),
      status: "confirmed" as const,
      txHash
    }),
    txHash,
    explorerUrl: getExplorerTxUrl(txHash)
  };
}

export async function loadReceiptFromChain(txHash: `0x${string}`): Promise<TransactionReceipt> {
  const client = getPublicClient();
  const config = getOnchainConfig();
  if (!config.canRead || !client) return fallbackReceipt(txHash);

  try {
    const receipt = await client.getTransactionReceipt({ hash: txHash });
    const block = await client.getBlock({ blockNumber: receipt.blockNumber });
    let amount = 0;
    let contributorAddress = ZERO_ADDRESS as `0x${string}`;
    let poolName = `ArcFundPool transaction`;

    for (const log of receipt.logs) {
      try {
        const decoded = decodeEventLog({ abi: arcFundPoolAbi, data: log.data, topics: log.topics });
        if (decoded.eventName === "Contributed") {
          amount = formatUSDCAmount(decoded.args.amount, config.usdcDecimals);
          contributorAddress = decoded.args.contributor;
          poolName = `Pool #${decoded.args.poolId.toString()}`;
          break;
        }
        if (decoded.eventName === "Refunded") {
          amount = formatUSDCAmount(decoded.args.amount, config.usdcDecimals);
          contributorAddress = decoded.args.contributor;
          poolName = `Refund from pool #${decoded.args.poolId.toString()}`;
          break;
        }
        if (decoded.eventName === "Withdrawn") {
          amount = formatUSDCAmount(decoded.args.amount, config.usdcDecimals);
          contributorAddress = decoded.args.creator;
          poolName = `Creator withdrawal from pool #${decoded.args.poolId.toString()}`;
          break;
        }
        if (decoded.eventName === "PoolCreated") {
          contributorAddress = decoded.args.creator;
          poolName = decoded.args.title || `Pool #${decoded.args.poolId.toString()}`;
          break;
        }
      } catch {
        // Ignore unrelated logs in the same transaction.
      }
    }

    return {
      txHash,
      poolName,
      contributorAddress,
      amount,
      timestamp: new Date(Number(block.timestamp) * 1000).toISOString(),
      status: receipt.status === "success" ? "confirmed" : "failed",
      explorerUrl: getExplorerTxUrl(txHash)
    };
  } catch {
    return fallbackReceipt(txHash);
  }
}
