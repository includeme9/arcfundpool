import type { Contribution, FundingPool, PoolTransaction, TransactionReceipt } from "@arcfundpool/types";

export const pools: FundingPool[] = [
  {
    id: "open-indexer",
    chainPoolId: 0n,
    title: "Open Arc Indexer Toolkit",
    description: "A shared indexing toolkit for builders shipping transparent funding, receipts, and analytics on Arc.",
    category: "Open Source",
    creatorWallet: "0x9A84233B0fE4a2A716D9fA715502fCfd0B40dA9E",
    targetAmount: 25000,
    totalRaised: 18640,
    deadline: "2026-07-20T00:00:00.000Z",
    metadataURI: "ipfs://open-arc-indexer",
    status: "active",
    withdrawn: false,
    cancelled: false,
    createdAt: "2026-05-10T10:20:00.000Z",
    externalLink: "https://example.com"
  },
  {
    id: "community-hacknight",
    chainPoolId: 1n,
    title: "Arc Community Hacknight",
    description: "Venue, food, builder prizes, and livestream costs for a stablecoin-native builder night.",
    category: "Events",
    creatorWallet: "0x3B76d2c52b872B2Cf54D9D4a0Aa698D9377AFa11",
    targetAmount: 9000,
    totalRaised: 9000,
    deadline: "2026-06-18T00:00:00.000Z",
    metadataURI: "ipfs://arc-community-hacknight",
    status: "funded",
    withdrawn: false,
    cancelled: false,
    createdAt: "2026-05-16T16:10:00.000Z"
  },
  {
    id: "auditor-bounty",
    chainPoolId: 2n,
    title: "Stable Pool Audit Bounty",
    description: "A collective bounty for security review of community-maintained Arc USDC pool contracts.",
    category: "Bounties",
    creatorWallet: "0x65cE1eC63a21d13Aa885739B395332027e195A8C",
    targetAmount: 15000,
    totalRaised: 4200,
    deadline: "2026-05-18T00:00:00.000Z",
    metadataURI: "ipfs://audit-bounty",
    status: "refundable",
    withdrawn: false,
    cancelled: false,
    createdAt: "2026-04-28T11:00:00.000Z"
  },
  {
    id: "builder-os",
    chainPoolId: 3n,
    title: "Builder OS Grants Sprint",
    description: "A focused funding pool for small teams building primitives that improve Arc onboarding.",
    category: "Teams",
    creatorWallet: "0x2717Aa44eE64045756d8F35280C9659825F1b187",
    targetAmount: 40000,
    totalRaised: 40000,
    deadline: "2026-06-01T00:00:00.000Z",
    metadataURI: "ipfs://builder-os",
    status: "withdrawn",
    withdrawn: true,
    cancelled: false,
    createdAt: "2026-04-19T09:00:00.000Z"
  }
];

export const contributions: Contribution[] = [
  {
    id: "c1",
    chainPoolId: 0n,
    txHash: "0x9eac4f11b83714b659bba9fffd212e5a1c7f021e7dfb8db76df778a2b5510a01",
    contributorWallet: "0xA781B7f401B48178d8a12e5d77Dd8bD550Ac77d1",
    amount: 2500,
    timestamp: "2026-05-22T14:35:00.000Z"
  },
  {
    id: "c2",
    chainPoolId: 0n,
    txHash: "0x5e09bb3f613c0b574352becc75361e169adfd81acd189d5f0f0e547f581a31bf",
    contributorWallet: "0xE4E5A60219B02c17A2E56c75B6f59acC99c9BeF4",
    amount: 6140,
    timestamp: "2026-05-24T08:15:00.000Z"
  },
  {
    id: "c3",
    chainPoolId: 1n,
    txHash: "0x34c617a9f41e19ef87bd84f751ac827bafcbdb034237e311af609e6c80021acf",
    contributorWallet: "0x71c6B3Ef6eD563dAF3115E12b4F911205cbDaC13",
    amount: 9000,
    timestamp: "2026-05-23T17:22:00.000Z"
  }
];

export const transactions: PoolTransaction[] = [
  {
    id: "t1",
    kind: "created",
    txHash: "0x4b8c1a28390740bdcae9278ae97ff85b4723f31500442d024c72e5f048927501",
    actor: pools[0].creatorWallet,
    timestamp: pools[0].createdAt,
    status: "confirmed"
  },
  {
    id: "t2",
    kind: "contribution",
    txHash: contributions[0].txHash,
    actor: contributions[0].contributorWallet,
    amount: contributions[0].amount,
    timestamp: contributions[0].timestamp,
    status: "confirmed"
  },
  {
    id: "t3",
    kind: "contribution",
    txHash: contributions[1].txHash,
    actor: contributions[1].contributorWallet,
    amount: contributions[1].amount,
    timestamp: contributions[1].timestamp,
    status: "confirmed"
  }
];

export const receipts: TransactionReceipt[] = [
  {
    txHash: contributions[0].txHash,
    poolName: pools[0].title,
    contributorAddress: contributions[0].contributorWallet,
    amount: contributions[0].amount,
    timestamp: contributions[0].timestamp,
    status: "confirmed",
    explorerUrl: `https://explorer.todo.arc-testnet.example/tx/${contributions[0].txHash}`
  }
];
