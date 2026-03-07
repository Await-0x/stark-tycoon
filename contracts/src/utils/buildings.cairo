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
        // Treasury Desk
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
        // Venture Office
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
        // Capital Markets Hub
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
        // Wallet Gateway
        BuildingSpec {
            capital_cost: 250,
            users_cost: 0,
            capital_production: 0,
            users_production: 8,
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
            users_production: 18,
            research_production: 0,
            tx_production: 0,
            users_multiplier: 0,
            research_multiplier: 0,
            tx_multiplier: 0,
        }
    } else if building_id == 8 {
        // Community Platform
        BuildingSpec {
            capital_cost: 1800,
            users_cost: 0,
            capital_production: 0,
            users_production: 35,
            research_production: 0,
            tx_production: 0,
            users_multiplier: 0,
            research_multiplier: 0,
            tx_multiplier: 0,
        }
    } else if building_id == 9 {
        // Developer Relations Center
        BuildingSpec {
            capital_cost: 1500,
            users_cost: 0,
            capital_production: 0,
            users_production: 22,
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
        // Cairo Facility
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
        // ZK Research Complex
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
        // Social Network — 1.0 TPS
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
        // NFT Marketplace — 2.2 TPS
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
        // DeFi Exchange — 3.8 TPS
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
        // Gaming Studio — 5.0 TPS
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
        // Layer 3 Network — 7.0 TPS
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
        // Network Effect Engine — +20% Users production
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
        // Sequencer Cluster — +20% Transactions production
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
        // Starknet Bridge — +20 Users/sec
        BuildingSpec {
            capital_cost: 3500,
            users_cost: 0,
            capital_production: 0,
            users_production: 20,
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
        // Wallet Ecosystem — +25 Users/sec
        BuildingSpec {
            capital_cost: 2800,
            users_cost: 0,
            capital_production: 0,
            users_production: 25,
            research_production: 0,
            tx_production: 0,
            users_multiplier: 0,
            research_multiplier: 0,
            tx_multiplier: 0,
        }
    } else if building_id == 24 {
        // DeFi Aggregator — 4.5 TPS
        BuildingSpec {
            capital_cost: 5000,
            users_cost: 600,
            capital_production: 0,
            users_production: 0,
            research_production: 0,
            tx_production: 45,
            users_multiplier: 0,
            research_multiplier: 0,
            tx_multiplier: 0,
        }
    } else if building_id == 25 {
        // On-Chain Identity Service — +15 Users/sec
        BuildingSpec {
            capital_cost: 3200,
            users_cost: 0,
            capital_production: 0,
            users_production: 15,
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
        // Treasury Desk
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
            // Strategic LPs
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
        // Venture Office
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
            // High Frequency Bots
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
        // Capital Markets Hub
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
        // Wallet Gateway
        if upgrade_id == 1 {
            // Burner Wallets
            UpgradeSpec {
                research_cost: 200,
                capital_production: 0,
                users_production: 6,
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
                users_production: 10,
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
                users_production: 10,
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
                users_production: 15,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } else if building_id == 8 {
        // Community Platform
        if upgrade_id == 1 {
            // Ambassador Program
            UpgradeSpec {
                research_cost: 600,
                capital_production: 0,
                users_production: 20,
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
                users_production: 30,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } else if building_id == 9 {
        // Developer Relations Center
        if upgrade_id == 1 {
            // Dev Grants
            UpgradeSpec {
                research_cost: 500,
                capital_production: 0,
                users_production: 12,
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
                users_production: 20,
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
        // Cairo Facility
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
            // Native AA Extensions
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
        // ZK Research Complex
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
        // Gaming Studio
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
        // DeFi Exchange
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
        // Social Network
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
        // Layer 3 Network
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
        // Network Effect Engine
        if upgrade_id == 1 {
            // Viral Loops — +10% Users
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
            // Ecosystem Incentives — +15% Users
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
        // Sequencer Cluster
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
            // Block Compression — +15% Transactions
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
        // Starknet Bridge Hub
        if upgrade_id == 1 {
            // Liquidity Mining Campaign
            UpgradeSpec {
                research_cost: 1200,
                capital_production: 0,
                users_production: 15,
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
                users_production: 25,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } else if building_id == 22 {
        // Infrastructure RPC Provider
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
        // Wallet Ecosystem
        if upgrade_id == 1 {
            // Embedded Wallet SDK
            UpgradeSpec {
                research_cost: 900,
                capital_production: 0,
                users_production: 18,
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
                users_production: 28,
                research_production: 0,
                tx_production: 0,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } else if building_id == 24 {
        // DeFi Aggregator
        if upgrade_id == 1 {
            // DEX Routing — +3.0 TPS
            UpgradeSpec {
                research_cost: 1800,
                capital_production: 0,
                users_production: 0,
                research_production: 0,
                tx_production: 3,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        } else {
            // MEV Protection Layer — +4.0 TPS
            UpgradeSpec {
                research_cost: 3500,
                capital_production: 0,
                users_production: 0,
                research_production: 0,
                tx_production: 4,
                users_multiplier: 0,
                research_multiplier: 0,
                tx_multiplier: 0,
            }
        }
    } else if building_id == 25 {
        // On-Chain Identity Service
        if upgrade_id == 1 {
            // Human Verification Layer
            UpgradeSpec {
                research_cost: 1200,
                capital_production: 0,
                users_production: 12,
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
                users_production: 20,
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
