export type PoolStatus = "active" | "funded" | "expired" | "refundable" | "withdrawn" | "cancelled";

export type PoolCategory =
  | "Open Source"
  | "Community"
  | "Events"
  | "Bounties"
  | "Teams"
  | "Infrastructure";

export type FundingPool = {
  id: string;
  chainPoolId: bigint;
  title: string;
  description: string;
  category: PoolCategory;
  imageUrl?: string;
  externalLink?: string;
  creatorWallet: `0x${string}`;
  targetAmount: number;
  totalRaised: number;
  deadline: string;
  metadataURI: string;
  status: PoolStatus;
  withdrawn: boolean;
  cancelled: boolean;
  createdAt: string;
};
