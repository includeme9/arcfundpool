export const arcFundPoolAbi = [
  {
    type: "constructor",
    inputs: [{ name: "usdcAddress", type: "address" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "poolCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "nextPoolId",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "pools",
    stateMutability: "view",
    inputs: [{ name: "poolId", type: "uint256" }],
    outputs: [
      { name: "creator", type: "address" },
      { name: "title", type: "string" },
      { name: "metadataURI", type: "string" },
      { name: "targetAmount", type: "uint256" },
      { name: "totalRaised", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "withdrawn", type: "bool" },
      { name: "cancelled", type: "bool" }
    ]
  },
  {
    type: "function",
    name: "contributions",
    stateMutability: "view",
    inputs: [
      { name: "poolId", type: "uint256" },
      { name: "contributor", type: "address" }
    ],
    outputs: [{ name: "amount", type: "uint256" }]
  },
  {
    type: "function",
    name: "createPool",
    stateMutability: "nonpayable",
    inputs: [
      { name: "title", type: "string" },
      { name: "metadataURI", type: "string" },
      { name: "targetAmount", type: "uint256" },
      { name: "deadline", type: "uint256" }
    ],
    outputs: [{ name: "poolId", type: "uint256" }]
  },
  {
    type: "function",
    name: "contribute",
    stateMutability: "nonpayable",
    inputs: [
      { name: "poolId", type: "uint256" },
      { name: "amount", type: "uint256" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "withdraw",
    stateMutability: "nonpayable",
    inputs: [{ name: "poolId", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "refund",
    stateMutability: "nonpayable",
    inputs: [{ name: "poolId", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "cancelPool",
    stateMutability: "nonpayable",
    inputs: [{ name: "poolId", type: "uint256" }],
    outputs: []
  },
  {
    type: "event",
    name: "PoolCreated",
    inputs: [
      { name: "poolId", type: "uint256", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "title", type: "string", indexed: false },
      { name: "metadataURI", type: "string", indexed: false },
      { name: "targetAmount", type: "uint256", indexed: false },
      { name: "deadline", type: "uint256", indexed: false }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "Contributed",
    inputs: [
      { name: "poolId", type: "uint256", indexed: true },
      { name: "contributor", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "Withdrawn",
    inputs: [
      { name: "poolId", type: "uint256", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "Refunded",
    inputs: [
      { name: "poolId", type: "uint256", indexed: true },
      { name: "contributor", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "PoolCancelled",
    inputs: [
      { name: "poolId", type: "uint256", indexed: true },
      { name: "creator", type: "address", indexed: true }
    ],
    anonymous: false
  }
] as const;
