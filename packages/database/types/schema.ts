export type PoolRow = {
  id: string;
  chain_pool_id: string;
  creator_wallet: string;
  title: string;
  description: string;
  category: string;
  image_url: string | null;
  target_amount: string;
  deadline: string;
  metadata_uri: string;
  created_at: string;
};

export type ContributionCacheRow = {
  id: string;
  chain_pool_id: string;
  tx_hash: string;
  contributor_wallet: string;
  amount: string;
  created_at: string;
};
