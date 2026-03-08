// ── Game Constants ──

export const BOARD_SIZE = 16;
export const GAME_DURATION = 900;
export const MARKET_SIZE = 6;
export const TOTAL_BUILDINGS = 25;
export const START_CAPITAL = 2000;
export const START_CAPITAL_PRODUCTION = 5;


// ── Resource Types ──

export type ResourceType = "capital" | "users" | "research" | "transactions";

// ── Building Categories ──

export type BuildingCategory =
  | "capital"
  | "users"
  | "research"
  | "transactions"
  | "global"
  | "additional";

// ── Building Spec (mirrors Cairo BuildingSpec) ──

export interface BuildingSpec {
  id: number;
  name: string;
  category: BuildingCategory;
  capitalCost: number;
  usersCost: number;
  capitalProduction: number;
  usersProduction: number;
  researchProduction: number;
  txProduction: number;
  usersMultiplier: number;
  researchMultiplier: number;
  txMultiplier: number;
}

// ── Upgrade Spec (mirrors Cairo UpgradeSpec) ──

export interface UpgradeSpec {
  name: string;
  researchCost: number;
  capitalProduction: number;
  usersProduction: number;
  researchProduction: number;
  txProduction: number;
  usersMultiplier: number;
  researchMultiplier: number;
  txMultiplier: number;
}

// ── Building on the board ──

export interface Building {
  gameId: string;
  positionId: number;
  buildingId: number;
  upgradeLevel: number;
  bonusConsumed: number;
}

// ── Game State (mirrors Cairo GameState) ──

export interface GameState {
  mintedAt: number;
  capital: number;
  users: number;
  research: number;
  transactions: number;
  capitalProduction: number;
  usersProduction: number;
  researchProduction: number;
  transactionsProduction: number;
  usersMultiplier: number;
  researchMultiplier: number;
  txMultiplier: number;
  gameTime: number;
  marketPacked: bigint;
  refreshCount: number;
}

// ── Game Actions ──

export interface StartGameAction {
  type: "start_game";
  playerName?: string;
}

export interface BuyBuildingAction {
  type: "buy_building";
  gameId: string;
  buildingId: number;
  positionId: number;
}

export interface UpgradeBuildingAction {
  type: "upgrade_building";
  gameId: string;
  positionId: number;
  upgradeId: number;
}

export interface RefreshMarketAction {
  type: "refresh_market";
  gameId: string;
}

export interface SubmitScoreAction {
  type: "submit_score";
  gameId: string;
}

export interface DestroyBuildingAction {
  type: "destroy_building";
  gameId: string;
  positionId: number;
}

export type GameAction =
  | StartGameAction
  | BuyBuildingAction
  | UpgradeBuildingAction
  | RefreshMarketAction
  | SubmitScoreAction
  | DestroyBuildingAction;

// ── Building Specs (all 25 buildings) ──

export const BUILDING_SPECS: Record<number, BuildingSpec> = {
  // Capital Buildings (1-5)
  1: {
    id: 1, name: "Treasury", category: "capital",
    capitalCost: 200, usersCost: 0,
    capitalProduction: 3, usersProduction: 0, researchProduction: 0, txProduction: 0,
    usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0,
  },
  2: {
    id: 2, name: "Angel Syndicate", category: "capital",
    capitalCost: 500, usersCost: 0,
    capitalProduction: 6, usersProduction: 0, researchProduction: 0, txProduction: 0,
    usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0,
  },
  3: {
    id: 3, name: "Venture Fund", category: "capital",
    capitalCost: 1200, usersCost: 0,
    capitalProduction: 10, usersProduction: 0, researchProduction: 0, txProduction: 0,
    usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0,
  },
  4: {
    id: 4, name: "Trading Floor", category: "capital",
    capitalCost: 2500, usersCost: 0,
    capitalProduction: 16, usersProduction: 0, researchProduction: 0, txProduction: 0,
    usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0,
  },
  5: {
    id: 5, name: "Capital Markets", category: "capital",
    capitalCost: 4500, usersCost: 0,
    capitalProduction: 22, usersProduction: 0, researchProduction: 0, txProduction: 0,
    usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0,
  },

  // User Buildings (6-9)
  6: {
    id: 6, name: "Account Portal", category: "users",
    capitalCost: 250, usersCost: 0,
    capitalProduction: 0, usersProduction: 2, researchProduction: 0, txProduction: 0,
    usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0,
  },
  7: {
    id: 7, name: "Growth Hub", category: "users",
    capitalCost: 800, usersCost: 0,
    capitalProduction: 0, usersProduction: 5, researchProduction: 0, txProduction: 0,
    usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0,
  },
  8: {
    id: 8, name: "Community Hub", category: "users",
    capitalCost: 1800, usersCost: 0,
    capitalProduction: 0, usersProduction: 11, researchProduction: 0, txProduction: 0,
    usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0,
  },
  9: {
    id: 9, name: "Developer Relations", category: "users",
    capitalCost: 1500, usersCost: 0,
    capitalProduction: 0, usersProduction: 7, researchProduction: 0, txProduction: 0,
    usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0,
  },

  // Research Buildings (10-12)
  10: {
    id: 10, name: "R&D Lab", category: "research",
    capitalCost: 300, usersCost: 0,
    capitalProduction: 0, usersProduction: 0, researchProduction: 5, txProduction: 0,
    usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0,
  },
  11: {
    id: 11, name: "Cairo Lab", category: "research",
    capitalCost: 1000, usersCost: 0,
    capitalProduction: 0, usersProduction: 0, researchProduction: 12, txProduction: 0,
    usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0,
  },
  12: {
    id: 12, name: "ZK Research", category: "research",
    capitalCost: 3000, usersCost: 0,
    capitalProduction: 0, usersProduction: 0, researchProduction: 25, txProduction: 0,
    usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0,
  },

  // Transaction Buildings (13-17)
  13: {
    id: 13, name: "NFT Marketplace", category: "transactions",
    capitalCost: 1200, usersCost: 450,
    capitalProduction: 0, usersProduction: 0, researchProduction: 0, txProduction: 1,
    usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0,
  },
  14: {
    id: 14, name: "Game Studio", category: "transactions",
    capitalCost: 2500, usersCost: 900,
    capitalProduction: 0, usersProduction: 0, researchProduction: 0, txProduction: 2,
    usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0,
  },
  15: {
    id: 15, name: "Decentralized Exchange", category: "transactions",
    capitalCost: 4000, usersCost: 1500,
    capitalProduction: 0, usersProduction: 0, researchProduction: 0, txProduction: 4,
    usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0,
  },
  16: {
    id: 16, name: "Social Platform", category: "transactions",
    capitalCost: 5000, usersCost: 2100,
    capitalProduction: 0, usersProduction: 0, researchProduction: 0, txProduction: 5,
    usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0,
  },
  17: {
    id: 17, name: "Appchain Network", category: "transactions",
    capitalCost: 7000, usersCost: 3000,
    capitalProduction: 0, usersProduction: 0, researchProduction: 0, txProduction: 7,
    usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0,
  },

  // Global Multiplier Buildings (18-20)
  18: {
    id: 18, name: "Starknet Foundation", category: "global",
    capitalCost: 5000, usersCost: 0,
    capitalProduction: 0, usersProduction: 0, researchProduction: 0, txProduction: 0,
    usersMultiplier: 20, researchMultiplier: 0, txMultiplier: 0,
  },
  19: {
    id: 19, name: "Protocol Institute", category: "global",
    capitalCost: 6000, usersCost: 0,
    capitalProduction: 0, usersProduction: 0, researchProduction: 0, txProduction: 0,
    usersMultiplier: 0, researchMultiplier: 20, txMultiplier: 0,
  },
  20: {
    id: 20, name: "Sequencer", category: "global",
    capitalCost: 8000, usersCost: 0,
    capitalProduction: 0, usersProduction: 0, researchProduction: 0, txProduction: 0,
    usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 20,
  },

  // Additional Buildings (21-25)
  21: {
    id: 21, name: "Starknet Bridge", category: "additional",
    capitalCost: 1200, usersCost: 0,
    capitalProduction: 0, usersProduction: 6, researchProduction: 0, txProduction: 0,
    usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0,
  },
  22: {
    id: 22, name: "RPC Provider", category: "additional",
    capitalCost: 2200, usersCost: 0,
    capitalProduction: 0, usersProduction: 0, researchProduction: 12, txProduction: 0,
    usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0,
  },
  23: {
    id: 23, name: "Wallet Provider", category: "additional",
    capitalCost: 1600, usersCost: 0,
    capitalProduction: 0, usersProduction: 8, researchProduction: 0, txProduction: 0,
    usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0,
  },
  24: {
    id: 24, name: "Arcade Machine", category: "additional",
    capitalCost: 1000, usersCost: 300,
    capitalProduction: 0, usersProduction: 0, researchProduction: 0, txProduction: 1,
    usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0,
  },
  25: {
    id: 25, name: "Identity Protocol", category: "additional",
    capitalCost: 3200, usersCost: 0,
    capitalProduction: 0, usersProduction: 5, researchProduction: 0, txProduction: 0,
    usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0,
  },
};

// ── Upgrade Specs (2 upgrades per building) ──

export const UPGRADE_SPECS: Record<number, [UpgradeSpec, UpgradeSpec]> = {
  // Capital Buildings
  1: [
    { name: "Financial Automation", researchCost: 100, capitalProduction: 2, usersProduction: 0, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
    { name: "Yield Optimization", researchCost: 300, capitalProduction: 3, usersProduction: 0, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
  ],
  2: [
    { name: "Syndicated Funding", researchCost: 200, capitalProduction: 4, usersProduction: 0, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
    { name: "Anchor Investors", researchCost: 500, capitalProduction: 6, usersProduction: 0, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
  ],
  3: [
    { name: "Portfolio Scaling", researchCost: 400, capitalProduction: 6, usersProduction: 0, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
    { name: "Secondary Markets", researchCost: 900, capitalProduction: 10, usersProduction: 0, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
  ],
  4: [
    { name: "Market Making Bots", researchCost: 800, capitalProduction: 8, usersProduction: 0, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
    { name: "Cross-Chain Arbitrage", researchCost: 1500, capitalProduction: 12, usersProduction: 0, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
  ],
  5: [
    { name: "Institutional Liquidity", researchCost: 1200, capitalProduction: 12, usersProduction: 0, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
    { name: "Structured Products", researchCost: 2500, capitalProduction: 18, usersProduction: 0, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
  ],

  // User Buildings
  6: [
    { name: "Burner Wallets", researchCost: 200, capitalProduction: 0, usersProduction: 2, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
    { name: "Account Abstraction", researchCost: 400, capitalProduction: 0, usersProduction: 3, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
  ],
  7: [
    { name: "Referral Engine", researchCost: 300, capitalProduction: 0, usersProduction: 3, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
    { name: "Regional Expansion", researchCost: 700, capitalProduction: 0, usersProduction: 5, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
  ],
  8: [
    { name: "Ambassador Program", researchCost: 600, capitalProduction: 0, usersProduction: 6, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
    { name: "Global Campaign", researchCost: 1200, capitalProduction: 0, usersProduction: 9, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
  ],
  9: [
    { name: "Dev Grants", researchCost: 500, capitalProduction: 0, usersProduction: 4, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
    { name: "Hackathon Series", researchCost: 1000, capitalProduction: 0, usersProduction: 6, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
  ],

  // Research Buildings
  10: [
    { name: "Cairo Compiler Optimizations", researchCost: 150, capitalProduction: 0, usersProduction: 0, researchProduction: 4, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
    { name: "Proving Improvements", researchCost: 500, capitalProduction: 0, usersProduction: 0, researchProduction: 8, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
  ],
  11: [
    { name: "Starknet OS Improvements", researchCost: 400, capitalProduction: 0, usersProduction: 0, researchProduction: 8, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
    { name: "Smart Account Modules", researchCost: 900, capitalProduction: 0, usersProduction: 0, researchProduction: 14, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
  ],
  12: [
    { name: "Recursive Proof Systems", researchCost: 1000, capitalProduction: 0, usersProduction: 0, researchProduction: 15, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
    { name: "Proof Compression", researchCost: 2500, capitalProduction: 0, usersProduction: 0, researchProduction: 25, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
  ],

  // Transaction Buildings
  13: [
    { name: "Royalty Engine", researchCost: 500, capitalProduction: 0, usersProduction: 0, researchProduction: 0, txProduction: 1, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
    { name: "Batch Minting", researchCost: 1000, capitalProduction: 0, usersProduction: 0, researchProduction: 0, txProduction: 2, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
  ],
  14: [
    { name: "Session Keys", researchCost: 800, capitalProduction: 0, usersProduction: 0, researchProduction: 0, txProduction: 2, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
    { name: "Paymaster Integration", researchCost: 1500, capitalProduction: 0, usersProduction: 0, researchProduction: 0, txProduction: 4, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
  ],
  15: [
    { name: "On-Chain Orderbook", researchCost: 1200, capitalProduction: 0, usersProduction: 0, researchProduction: 0, txProduction: 2, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
    { name: "Liquidity Aggregator", researchCost: 2500, capitalProduction: 0, usersProduction: 0, researchProduction: 0, txProduction: 3, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
  ],
  16: [
    { name: "Social Graph Protocol", researchCost: 1500, capitalProduction: 0, usersProduction: 0, researchProduction: 0, txProduction: 3, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
    { name: "Creator Monetization", researchCost: 3000, capitalProduction: 0, usersProduction: 0, researchProduction: 0, txProduction: 4, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
  ],
  17: [
    { name: "App-Specific Rollups", researchCost: 2000, capitalProduction: 0, usersProduction: 0, researchProduction: 0, txProduction: 4, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
    { name: "Custom DA Layer", researchCost: 4000, capitalProduction: 0, usersProduction: 0, researchProduction: 0, txProduction: 6, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
  ],

  // Global Multiplier Buildings
  18: [
    { name: "Ecosystem Incentives", researchCost: 2000, capitalProduction: 0, usersProduction: 0, researchProduction: 0, txProduction: 0, usersMultiplier: 5, researchMultiplier: 0, txMultiplier: 0 },
    { name: "Strategic Grants", researchCost: 4000, capitalProduction: 0, usersProduction: 0, researchProduction: 0, txProduction: 0, usersMultiplier: 10, researchMultiplier: 0, txMultiplier: 0 },
  ],
  19: [
    { name: "Core Protocol Grants", researchCost: 2500, capitalProduction: 0, usersProduction: 0, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 5, txMultiplier: 0 },
    { name: "Ecosystem Standards", researchCost: 5000, capitalProduction: 0, usersProduction: 0, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 10, txMultiplier: 0 },
  ],
  20: [
    { name: "Parallel Execution", researchCost: 3000, capitalProduction: 0, usersProduction: 0, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 5 },
    { name: "State Diff Compression", researchCost: 6000, capitalProduction: 0, usersProduction: 0, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 10 },
  ],

  // Additional Buildings
  21: [
    { name: "Shared Liquidity Network", researchCost: 1200, capitalProduction: 0, usersProduction: 5, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
    { name: "Fast Withdrawal System", researchCost: 2800, capitalProduction: 0, usersProduction: 8, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
  ],
  22: [
    { name: "High Throughput RPC", researchCost: 800, capitalProduction: 0, usersProduction: 0, researchProduction: 10, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
    { name: "Geo-Distributed Nodes", researchCost: 2000, capitalProduction: 0, usersProduction: 0, researchProduction: 18, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
  ],
  23: [
    { name: "Embedded Wallet SDK", researchCost: 900, capitalProduction: 0, usersProduction: 5, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
    { name: "Smart Account Recovery", researchCost: 2200, capitalProduction: 0, usersProduction: 8, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
  ],
  24: [
    { name: "Traditional Payments", researchCost: 1800, capitalProduction: 0, usersProduction: 0, researchProduction: 0, txProduction: 2, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
    { name: "No Token Onboarding", researchCost: 3500, capitalProduction: 0, usersProduction: 0, researchProduction: 0, txProduction: 3, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
  ],
  25: [
    { name: "Human Verification Layer", researchCost: 1200, capitalProduction: 0, usersProduction: 4, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
    { name: "Universal Profile System", researchCost: 2800, capitalProduction: 0, usersProduction: 6, researchProduction: 0, txProduction: 0, usersMultiplier: 0, researchMultiplier: 0, txMultiplier: 0 },
  ],
};

// ── Tile Bonus (mirrors Cairo board.cairo) ──

export interface TileBonus {
  bonusType: number;
  bonusValue: number;
}

export function deriveTileBonus(seed: bigint, positionId: number): TileBonus {
  let entropy = seed;
  for (let i = 0; i < positionId; i++) {
    entropy = entropy / 40n;
  }
  const bonusType = Number(entropy % 8n);
  const rawValue = Number((entropy / 8n) % 5n);

  let bonusValue = 0;
  switch (bonusType) {
    case 0: bonusValue = 0; break;
    case 1: bonusValue = rawValue + 1; break;
    case 2: bonusValue = (rawValue % 3) + 1; break;
    case 3: bonusValue = (rawValue % 3) + 1; break;
    case 4: bonusValue = (rawValue + 1) * 100; break;
    case 5: bonusValue = (rawValue % 3 + 1) * 100; break;
    case 6: bonusValue = (rawValue % 3 + 1) * 100; break;
    case 7: bonusValue = (rawValue % 3 + 1) * 100; break;
  }

  return { bonusType, bonusValue };
}

export function getAllTileBonuses(seed: bigint): TileBonus[] {
  return Array.from({ length: BOARD_SIZE }, (_, i) => deriveTileBonus(seed, i));
}

// ── Token ID Helpers (mirrors Cairo token_id.cairo) ──

export function unpackMintedAt(tokenId: string): number {
  const packed = BigInt(tokenId);
  const high = packed >> 128n;
  return Number(high & ((1n << 35n) - 1n));
}

// ── Market Helpers (mirrors Cairo market.cairo) ──

export function getMarketSlot(packed: bigint, slot: number): number {
  const divisor = 32n ** BigInt(slot);
  return Number((packed / divisor) % 32n);
}

export function getMarketBuildings(packed: bigint, marketSize: number = MARKET_SIZE): number[] {
  const buildings: number[] = [];
  for (let i = 0; i < marketSize; i++) {
    buildings.push(getMarketSlot(packed, i));
  }
  return buildings;
}

// ── Production Interpolation (mirrors Cairo tick_production) ──

export function interpolateResources(
  state: GameState,
  currentTimestamp: number
): { capital: number; users: number; research: number; transactions: number } {
  const elapsed = Math.min(
    Math.max(0, currentTimestamp - state.mintedAt - state.gameTime),
    GAME_DURATION - state.gameTime
  );

  const capital = state.capital + state.capitalProduction * elapsed;
  const users =
    state.users +
    Math.floor(
      (state.usersProduction * (100 + state.usersMultiplier) * elapsed) / 100
    );
  const research =
    state.research +
    Math.floor(
      (state.researchProduction * (100 + state.researchMultiplier) * elapsed) / 100
    );
  const transactions =
    state.transactions +
    Math.floor(
      (state.transactionsProduction * (100 + state.txMultiplier) * elapsed) / 100
    );

  return { capital, users, research, transactions };
}
