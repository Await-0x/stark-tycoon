#[derive(Copy, Drop, Serde)]
pub struct BuildingSpec {
    pub capital_cost: u16,
    pub users_cost: u16,
    pub capital_production: u16,
    pub users_production: u16,
    pub research_production: u16,
    pub tx_production: u16,
    pub users_multiplier: u8,
    pub research_multiplier: u8,
    pub tx_multiplier: u8,
}

#[derive(Copy, Drop, Serde)]
pub struct UpgradeSpec {
    pub research_cost: u16,
    pub capital_production: u16,
    pub users_production: u16,
    pub research_production: u16,
    pub tx_production: u16,
    pub users_multiplier: u8,
    pub research_multiplier: u8,
    pub tx_multiplier: u8,
}

// ──────────────────────────────────────────────
// BUILDING SPECS
// ──────────────────────────────────────────────

pub fn building_spec(building_id: u8) -> BuildingSpec {
    // ── CAPITAL BUILDINGS (1-5) ──
    if building_id == 1 {
        // Treasury
        BuildingSpec {
            capital_cost: 200,
            users_cost: 0,
            capital_production: 3,
            users_production: 0,
            research_production: 0,
            tx_production: 0,
            users_multiplier: 0,
            research_multiplier: 0,
            tx_multiplier: 0,
        }
    } else if building_id == 2 {
        // Angel Syndicate
        BuildingSpec {
            capital_cost: 500,
            users_cost: 0,
            capital_production: 6,
            users_production: 0,
            research_production: 0,
            tx_production: 0,
            users_multiplier: 0,
            research_multiplier: 0,
            tx_multiplier: 0,
        }
    } else if building_id == 3 {
        // Venture Fund
        BuildingSpec {
            capital_cost: 1200,
            users_cost: 0,
            capital_production: 10,
            users_production: 0,
            research_production: 0,
            tx_production: 0,
            users_multiplier: 0,
            research_multiplier: 0,
            tx_multiplier: 0,
        }
    } else if building_id == 4 {
        // Trading Floor
        BuildingSpec {
            capital_cost: 2500,
            users_cost: 0,
            capital_production: 16,
            users_production: 0,
            research_production: 0,
            tx_production: 0,
            users_multiplier: 0,
            research_multiplier: 0,
            tx_multiplier: 0,
        }
    } else if building_id == 5 {
        // Capital Markets
        BuildingSpec {
            capital_cost: 4500,
            users_cost: 0,
            capital_production: 22,
            users_production: 0,
            research_production: 0,
            tx_production: 0,
            users_multiplier: 0,
            research_multiplier: 0,
            tx_multiplier: 0,
        }
    } // ── USER BUILDINGS (6-9) ──
    else if building_id == 6 {
        // Account Portal
        BuildingSpec {
            capital_cost: 250,
            users_cost: 0,
            capital_production: 0,
            users_production: 2,
            research_production: 0,
            tx_production: 0,
            users_multiplier: 0,
            research_multiplier: 0,
            tx_multiplier: 0,
        }
    } else if building_id == 7 {
        // Growth Hub
        BuildingSpec {
            capital_cost: 800,
            users_cost: 0,
            capital_production: 0,
            users_production: 5,
            research_production: 0,
            tx_production: 0,
            users_multiplier: 0,
            research_multiplier: 0,
            tx_multiplier: 0,
        }
    } else if building_id == 8 {
        // Community Hub
        BuildingSpec {
            capital_cost: 1800,
            users_cost: 0,
            capital_production: 0,
            users_production: 11,
            research_production: 0,
            tx_production: 0,
            users_multiplier: 0,
            research_multiplier: 0,
            tx_multiplier: 0,
        }
    } else if building_id == 9 {
        // Developer Relations
        BuildingSpec {
            capital_cost: 1500,
            users_cost: 0,
            capital_production: 0,
            users_production: 7,
            research_production: 0,
            tx_production: 0,
            users_multiplier: 0,
            research_multiplier: 0,
            tx_multiplier: 0,
        }
    } // ── RESEARCH BUILDINGS (10-12) ──
    else if building_id == 10 {
        // R&D Lab
        BuildingSpec {
            capital_cost: 300,
            users_cost: 0,
            capital_production: 0,
            users_production: 0,
            research_production: 5,
            tx_production: 0,
            users_multiplier: 0,
            research_multiplier: 0,
            tx_multiplier: 0,
        }
    } else if building_id == 11 {
        // Cairo Lab
        BuildingSpec {
            capital_cost: 1000,
            users_cost: 0,
            capital_production: 0,
            users_production: 0,
            research_production: 12,
            tx_production: 0,
            users_multiplier: 0,
            research_multiplier: 0,
            tx_multiplier: 0,
        }
    } else if building_id == 12 {
        // ZK Research
        BuildingSpec {
            capital_cost: 3000,
            users_cost: 0,
            capital_production: 0,
            users_production: 0,
            research_production: 25,
            tx_production: 0,
            users_multiplier: 0,
            research_multiplier: 0,
            tx_multiplier: 0,
        }
    } // ── TRANSACTION BUILDINGS (13-17) — require Users at purchase ──
    else if building_id == 13 {
        // NFT Marketplace — 1.0 TPS
        BuildingSpec {
            capital_cost: 1200,
            users_cost: 150,
            capital_production: 0,
            users_production: 0,
            research_production: 0,
            tx_production: 1,
            users_multiplier: 0,
            research_multiplier: 0,
            tx_multiplier: 0,
        }
    } else if building_id == 14 {
        // Game Studio — 2.2 TPS
        BuildingSpec {
            capital_cost: 2500,
            users_cost: 300,
            capital_production: 0,
            users_production: 0,
            research_production: 0,
            tx_production: 2,
            users_multiplier: 0,
            research_multiplier: 0,
            tx_multiplier: 0,
        }
    } else if building_id == 15 {
        // Decentralized Exchange — 3.8 TPS
        BuildingSpec {
            capital_cost: 4000,
            users_cost: 500,
            capital_production: 0,
            users_production: 0,
            research_production: 0,
            tx_production: 4,
            users_multiplier: 0,
            research_multiplier: 0,
            tx_multiplier: 0,
        }
    } else if building_id == 16 {
        // Social Platform — 5.0 TPS
        BuildingSpec {
            capital_cost: 5000,
            users_cost: 700,
            capital_production: 0,
            users_production: 0,
            research_production: 0,
            tx_production: 5,
            users_multiplier: 0,
            research_multiplier: 0,
            tx_multiplier: 0,
        }
    } else if building_id == 17 {
        // Appchain Network — 7.0 TPS
        BuildingSpec {
            capital_cost: 7000,
            users_cost: 1000,
            capital_production: 0,
            users_production: 0,
            research_production: 0,
            tx_production: 7,
            users_multiplier: 0,
            research_multiplier: 0,
            tx_multiplier: 0,
        }
    } // ── GLOBAL BUILDINGS (18-20) —-
    else if building_id == 18 {
        // Starknet Foundation — +20% Users production
        BuildingSpec {
            capital_cost: 5000,
            users_cost: 0,
            capital_production: 0,
            users_production: 0,
            research_production: 0,
            tx_production: 0,
            users_multiplier: 20,
            research_multiplier: 0,
            tx_multiplier: 0,
        }
    } else if building_id == 19 {
        // Protocol Institute — +20% Research production
        BuildingSpec {
            capital_cost: 6000,
            users_cost: 0,
            capital_production: 0,
            users_production: 0,
            research_production: 0,
            tx_production: 0,
            users_multiplier: 0,
            research_multiplier: 20,
            tx_multiplier: 0,
        }
    } else if building_id == 20 {
        // Sequencer — +20% Transactions production
        BuildingSpec {
            capital_cost: 8000,
            users_cost: 0,
            capital_production: 0,
            users_production: 0,
            research_production: 0,
            tx_production: 0,
            users_multiplier: 0,
            research_multiplier: 0,
            tx_multiplier: 20,
        }
    } // ── ADDITIONAL BUILDINGS (21-25) ──
    else if building_id == 21 {
        // Starknet Bridge — +6 Users/sec
        BuildingSpec {
            capital_cost: 3500,
            users_cost: 0,
            capital_production: 0,
            users_production: 6,
            research_production: 0,
            tx_production: 0,
            users_multiplier: 0,
            research_multiplier: 0,
            tx_multiplier: 0,
        }
    } else if building_id == 22 {
        // RPC Provider — +12 Research/sec
        BuildingSpec {
            capital_cost: 2200,
            users_cost: 0,
            capital_production: 0,
            users_production: 0,
            research_production: 12,
            tx_production: 0,
            users_multiplier: 0,
            research_multiplier: 0,
            tx_multiplier: 0,
        }
    } else if building_id == 23 {
        // Wallet Provider — +8 Users/sec
        BuildingSpec {
            capital_cost: 2800,
            users_cost: 0,
            capital_production: 0,
            users_production: 8,
            research_production: 0,
            tx_production: 0,
            users_multiplier: 0,
            research_multiplier: 0,
            tx_multiplier: 0,
        }
    } else if building_id == 24 {
        // Arcade Machine — 1 TPS
        BuildingSpec {
            capital_cost: 1000,
            users_cost: 100,
            capital_production: 0,
            users_production: 0,
            research_production: 0,
            tx_production: 1,
            users_multiplier: 0,
            research_multiplier: 0,
            tx_multiplier: 0,
        }
    } else if building_id == 25 {
        // Identity Protocol — +5 Users/sec
        BuildingSpec {
            capital_cost: 3200,
            users_cost: 0,
            capital_production: 0,
            users_production: 5,
            research_production: 0,
            tx_production: 0,
            users_multiplier: 0,
            research_multiplier: 0,
            tx_multiplier: 0,
        }
    } else {
        panic!("Unknown building")
    }
}

// ──────────────────────────────────────────────
// UPGRADE SPECS
// Each building has 2 sequential upgrades costing Research.
// upgrade_id: 1 = first upgrade, 2 = second upgrade
// ──────────────────────────────────────────────

pub fn upgrade_spec(building_id: u8, upgrade_id: u8) -> UpgradeSpec {
    // ── CAPITAL BUILDINGS (1-5) ──
    if building_id == 1 {
        // Treasury
        if upgrade_id == 1 {
            // Financial Automation
            UpgradeSpec {
                research_cost: 100,
                capital_production: 2,
                users_production: 0,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        } else {
            // Yield Optimization
            UpgradeSpec {
                research_cost: 300,
                capital_production: 3,
                users_production: 0,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } else if building_id == 2 {
        // Angel Syndicate
        if upgrade_id == 1 {
            // Syndicated Funding
            UpgradeSpec {
                research_cost: 200,
                capital_production: 4,
                users_production: 0,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        } else {
            // Anchor Investors
            UpgradeSpec {
                research_cost: 500,
                capital_production: 6,
                users_production: 0,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } else if building_id == 3 {
        // Venture Fund
        if upgrade_id == 1 {
            // Portfolio Scaling
            UpgradeSpec {
                research_cost: 400,
                capital_production: 6,
                users_production: 0,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        } else {
            // Secondary Markets
            UpgradeSpec {
                research_cost: 900,
                capital_production: 10,
                users_production: 0,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } else if building_id == 4 {
        // Trading Floor
        if upgrade_id == 1 {
            // Market Making Bots
            UpgradeSpec {
                research_cost: 800,
                capital_production: 8,
                users_production: 0,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        } else {
            // Cross-Chain Arbitrage
            UpgradeSpec {
                research_cost: 1500,
                capital_production: 12,
                users_production: 0,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } else if building_id == 5 {
        // Capital Markets
        if upgrade_id == 1 {
            // Institutional Liquidity
            UpgradeSpec {
                research_cost: 1200,
                capital_production: 12,
                users_production: 0,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        } else {
            // Structured Products
            UpgradeSpec {
                research_cost: 2500,
                capital_production: 18,
                users_production: 0,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } // ── USER BUILDINGS (6-9) ──
    else if building_id == 6 {
        // Account Portal
        if upgrade_id == 1 {
            // Burner Wallets
            UpgradeSpec {
                research_cost: 200,
                capital_production: 0,
                users_production: 2,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        } else {
            // Account Abstraction
            UpgradeSpec {
                research_cost: 400,
                capital_production: 0,
                users_production: 3,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } else if building_id == 7 {
        // Growth Hub
        if upgrade_id == 1 {
            // Referral Engine
            UpgradeSpec {
                research_cost: 300,
                capital_production: 0,
                users_production: 3,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        } else {
            // Regional Expansion
            UpgradeSpec {
                research_cost: 700,
                capital_production: 0,
                users_production: 5,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } else if building_id == 8 {
        // Community Hub
        if upgrade_id == 1 {
            // Ambassador Program
            UpgradeSpec {
                research_cost: 600,
                capital_production: 0,
                users_production: 6,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        } else {
            // Global Campaign
            UpgradeSpec {
                research_cost: 1200,
                capital_production: 0,
                users_production: 9,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } else if building_id == 9 {
        // Developer Relations
        if upgrade_id == 1 {
            // Dev Grants
            UpgradeSpec {
                research_cost: 500,
                capital_production: 0,
                users_production: 4,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        } else {
            // Hackathon Series
            UpgradeSpec {
                research_cost: 1000,
                capital_production: 0,
                users_production: 6,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } // ── RESEARCH BUILDINGS (10-12) ──
    else if building_id == 10 {
        // R&D Lab
        if upgrade_id == 1 {
            // Cairo Compiler Optimizations
            UpgradeSpec {
                research_cost: 150,
                capital_production: 0,
                users_production: 0,
                research_production: 4,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        } else {
            // Proving Improvements
            UpgradeSpec {
                research_cost: 500,
                capital_production: 0,
                users_production: 0,
                research_production: 8,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } else if building_id == 11 {
        // Cairo Lab
        if upgrade_id == 1 {
            // Starknet OS Improvements
            UpgradeSpec {
                research_cost: 400,
                capital_production: 0,
                users_production: 0,
                research_production: 8,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        } else {
            // Smart Account Modules
            UpgradeSpec {
                research_cost: 900,
                capital_production: 0,
                users_production: 0,
                research_production: 14,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } else if building_id == 12 {
        // ZK Research
        if upgrade_id == 1 {
            // Recursive Proof Systems
            UpgradeSpec {
                research_cost: 1000,
                capital_production: 0,
                users_production: 0,
                research_production: 15,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        } else {
            // Proof Compression
            UpgradeSpec {
                research_cost: 2500,
                capital_production: 0,
                users_production: 0,
                research_production: 25,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } // ── TRANSACTION BUILDINGS (13-17) ──
    else if building_id == 13 {
        // NFT Marketplace
        if upgrade_id == 1 {
            // Royalty Engine — +0.8 TPS
            UpgradeSpec {
                research_cost: 500,
                capital_production: 0,
                users_production: 0,
                research_production: 0,
                tx_production: 1,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        } else {
            // Batch Minting — +1.2 TPS
            UpgradeSpec {
                research_cost: 1000,
                capital_production: 0,
                users_production: 0,
                research_production: 0,
                tx_production: 2,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } else if building_id == 14 {
        // Game Studio
        if upgrade_id == 1 {
            // Session Keys — +1.5 TPS
            UpgradeSpec {
                research_cost: 800,
                capital_production: 0,
                users_production: 0,
                research_production: 0,
                tx_production: 2,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        } else {
            // Paymaster Integration — +2.0 TPS
            UpgradeSpec {
                research_cost: 1500,
                capital_production: 0,
                users_production: 0,
                research_production: 0,
                tx_production: 4,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } else if building_id == 15 {
        // Decentralized Exchange
        if upgrade_id == 1 {
            // On-Chain Orderbook — +2.0 TPS
            UpgradeSpec {
                research_cost: 1200,
                capital_production: 0,
                users_production: 0,
                research_production: 0,
                tx_production: 2,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        } else {
            // Liquidity Aggregator — +3.0 TPS
            UpgradeSpec {
                research_cost: 2500,
                capital_production: 0,
                users_production: 0,
                research_production: 0,
                tx_production: 3,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } else if building_id == 16 {
        // Social Platform
        if upgrade_id == 1 {
            // Social Graph Protocol — +3.0 TPS
            UpgradeSpec {
                research_cost: 1500,
                capital_production: 0,
                users_production: 0,
                research_production: 0,
                tx_production: 3,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        } else {
            // Creator Monetization — +4.0 TPS
            UpgradeSpec {
                research_cost: 3000,
                capital_production: 0,
                users_production: 0,
                research_production: 0,
                tx_production: 4,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } else if building_id == 17 {
        // Appchain Network
        if upgrade_id == 1 {
            // App-Specific Rollups — +4.0 TPS
            UpgradeSpec {
                research_cost: 2000,
                capital_production: 0,
                users_production: 0,
                research_production: 0,
                tx_production: 4,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        } else {
            // Custom DA Layer — +6.0 TPS
            UpgradeSpec {
                research_cost: 4000,
                capital_production: 0,
                users_production: 0,
                research_production: 0,
                tx_production: 6,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } // ── GLOBAL BUILDINGS (18-20) — multiplier upgrades ──
    else if building_id == 18 {
        // Starknet Foundation
        if upgrade_id == 1 {
            // Ecosystem Incentives — +10% Users
            UpgradeSpec {
                research_cost: 2000,
                capital_production: 0,
                users_production: 0,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 5,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        } else {
            // Strategic Grants — +15% Users
            UpgradeSpec {
                research_cost: 4000,
                capital_production: 0,
                users_production: 0,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 10,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } else if building_id == 19 {
        // Protocol Institute
        if upgrade_id == 1 {
            // Core Protocol Grants — +10% Research
            UpgradeSpec {
                research_cost: 2500,
                capital_production: 0,
                users_production: 0,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 5,
                tx_multiplier: 0,
            }
        } else {
            // Ecosystem Standards — +15% Research
            UpgradeSpec {
                research_cost: 5000,
                capital_production: 0,
                users_production: 0,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 10,
                tx_multiplier: 0,
            }
        }
    } else if building_id == 20 {
        // Sequencer
        if upgrade_id == 1 {
            // Parallel Execution — +10% Transactions
            UpgradeSpec {
                research_cost: 3000,
                capital_production: 0,
                users_production: 0,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 5,
            }
        } else {
            // State Diff Compression — +15% Transactions
            UpgradeSpec {
                research_cost: 6000,
                capital_production: 0,
                users_production: 0,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 10,
            }
        }
    } // ── ADDITIONAL BUILDINGS (21-25) ──
    else if building_id == 21 {
        // Starknet Bridge
        if upgrade_id == 1 {
            // Shared Liquidity Network
            UpgradeSpec {
                research_cost: 1200,
                capital_production: 0,
                users_production: 5,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        } else {
            // Fast Withdrawal System
            UpgradeSpec {
                research_cost: 2800,
                capital_production: 0,
                users_production: 8,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } else if building_id == 22 {
        // RPC Provider
        if upgrade_id == 1 {
            // High Throughput RPC
            UpgradeSpec {
                research_cost: 800,
                capital_production: 0,
                users_production: 0,
                research_production: 10,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        } else {
            // Geo-Distributed Nodes
            UpgradeSpec {
                research_cost: 2000,
                capital_production: 0,
                users_production: 0,
                research_production: 18,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } else if building_id == 23 {
        // Wallet Provider
        if upgrade_id == 1 {
            // Embedded Wallet SDK
            UpgradeSpec {
                research_cost: 900,
                capital_production: 0,
                users_production: 5,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        } else {
            // Smart Account Recovery
            UpgradeSpec {
                research_cost: 2200,
                capital_production: 0,
                users_production: 8,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } else if building_id == 24 {
        // Arcade Machine
        if upgrade_id == 1 {
            // Traditional Payments — +2.0 TPS
            UpgradeSpec {
                research_cost: 1800,
                capital_production: 0,
                users_production: 0,
                research_production: 0,
                tx_production: 2,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        } else {
            // No Token Onboarding — +3.0 TPS
            UpgradeSpec {
                research_cost: 3500,
                capital_production: 0,
                users_production: 0,
                research_production: 0,
                tx_production: 3,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } else if building_id == 25 {
        // Identity Protocol
        if upgrade_id == 1 {
            // Human Verification Layer
            UpgradeSpec {
                research_cost: 1200,
                capital_production: 0,
                users_production: 4,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        } else {
            // Universal Profile System
            UpgradeSpec {
                research_cost: 2800,
                capital_production: 0,
                users_production: 6,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } else {
        panic!("Unknown building")
    }
}
