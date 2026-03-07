# Stark Tycoon

An onchain idle tycoon game built on Starknet with Dojo. Grow a blockchain ecosystem by managing four resources over a 20-minute session. Your final score is total **Transactions** produced.

## Overview

Each game is a 20-minute (1200 second) session. You start with 200 Capital and 1 Capital/sec base production. Buy buildings from a rotating market, upgrade them with Research, and maximize your transaction throughput before time runs out.

## Resources

| Resource | Role |
|---|---|
| **Capital** | Primary currency. All buildings cost Capital. No multiplier — produced at a flat rate. |
| **Users** | Required as a one-time cost when buying Transaction buildings. Has a multiplier. |
| **Research** | Used exclusively to upgrade buildings. Has a multiplier. |
| **Transactions** | The score. Produced by Transaction buildings. Has a multiplier. Production values are stored at 10x scale internally (2.2 TPS = 22). |

## Board & Market

- **Board**: 5x5 grid (25 slots). Each slot holds one building.
- **Market**: 5 randomly selected buildings available at any time. When you buy one, it's replaced by a new random building (via on-chain VRF).
- Any building type can be bought multiple times (no uniqueness restrictions).

## Buildings

### Capital Buildings (1-5)

| ID | Name | Cost | Production |
|---|---|---|---|
| 1 | Treasury Desk | 200 Capital | +3 Capital/sec |
| 2 | Angel Syndicate | 500 Capital | +6 Capital/sec |
| 3 | Venture Office | 1,200 Capital | +10 Capital/sec |
| 4 | Trading Floor | 2,500 Capital | +16 Capital/sec |
| 5 | Capital Markets Hub | 4,500 Capital | +22 Capital/sec |

### User Buildings (6-9)

| ID | Name | Cost | Production |
|---|---|---|---|
| 6 | Wallet Gateway | 250 Capital | +8 Users/sec |
| 7 | Growth Hub | 800 Capital | +18 Users/sec |
| 8 | Community Platform | 1,800 Capital | +35 Users/sec |
| 9 | Developer Relations Center | 1,500 Capital | +22 Users/sec |

### Research Buildings (10-12)

| ID | Name | Cost | Production |
|---|---|---|---|
| 10 | R&D Lab | 300 Capital | +5 Research/sec |
| 11 | Cairo Facility | 1,000 Capital | +12 Research/sec |
| 12 | ZK Research Complex | 3,000 Capital | +25 Research/sec |

### Transaction Buildings (13-17)

These cost Capital **and** Users (one-time). After purchase they produce Transactions for free.

| ID | Name | Capital Cost | User Cost | Production |
|---|---|---|---|---|
| 13 | NFT Marketplace | 1,200 | 150 Users | +1.0 TPS |
| 14 | Gaming Studio | 2,500 | 300 Users | +2.2 TPS |
| 15 | DeFi Exchange | 4,000 | 500 Users | +3.8 TPS |
| 16 | Social Network | 5,000 | 700 Users | +5.0 TPS |
| 17 | Layer 3 Network | 7,000 | 1,000 Users | +7.0 TPS |

### Global Buildings (18-20)

Multiplier buildings that boost all production of a given resource type (percentage-based, stored as basis points).

| ID | Name | Cost | Effect |
|---|---|---|---|
| 18 | Network Effect Engine | 5,000 Capital | +20% Users production |
| 19 | Protocol Institute | 6,000 Capital | +20% Research production |
| 20 | Sequencer Cluster | 8,000 Capital | +20% Transactions production |

### Additional Buildings (21-25)

| ID | Name | Cost | Production |
|---|---|---|---|
| 21 | Starknet Bridge Hub | 3,500 Capital | +20 Users/sec |
| 22 | Infrastructure RPC Provider | 2,200 Capital | +12 Research/sec |
| 23 | Wallet Ecosystem | 2,800 Capital | +25 Users/sec |
| 24 | DeFi Aggregator | 5,000 Capital + 600 Users | +4.5 TPS |
| 25 | On-Chain Identity Service | 3,200 Capital | +15 Users/sec |

## Upgrades

Every building has **2 sequential upgrades** that cost Research and permanently increase its production. Upgrade 1 must be applied before Upgrade 2.

### Capital Building Upgrades

| Building | Upgrade 1 | Cost | Effect | Upgrade 2 | Cost | Effect |
|---|---|---|---|---|---|---|
| Treasury Desk | Financial Automation | 100 R | +2 Capital/sec | Yield Optimization | 300 R | +3 Capital/sec |
| Angel Syndicate | Syndicated Funding | 200 R | +4 Capital/sec | Strategic LPs | 500 R | +6 Capital/sec |
| Venture Office | Portfolio Scaling | 400 R | +6 Capital/sec | Secondary Markets | 900 R | +10 Capital/sec |
| Trading Floor | High Frequency Bots | 800 R | +8 Capital/sec | Cross-Chain Arbitrage | 1,500 R | +12 Capital/sec |
| Capital Markets Hub | Institutional Liquidity | 1,200 R | +12 Capital/sec | Structured Products | 2,500 R | +18 Capital/sec |

### User Building Upgrades

| Building | Upgrade 1 | Cost | Effect | Upgrade 2 | Cost | Effect |
|---|---|---|---|---|---|---|
| Wallet Gateway | Burner Wallets | 200 R | +6 Users/sec | Account Abstraction | 400 R | +10 Users/sec |
| Growth Hub | Referral Engine | 300 R | +10 Users/sec | Regional Expansion | 700 R | +15 Users/sec |
| Community Platform | Ambassador Program | 600 R | +20 Users/sec | Global Campaign | 1,200 R | +30 Users/sec |
| Dev Relations Center | Dev Grants | 500 R | +12 Users/sec | Hackathon Series | 1,000 R | +20 Users/sec |

### Research Building Upgrades

| Building | Upgrade 1 | Cost | Effect | Upgrade 2 | Cost | Effect |
|---|---|---|---|---|---|---|
| R&D Lab | Cairo Compiler Optimizations | 150 R | +4 Research/sec | Proving Improvements | 500 R | +8 Research/sec |
| Cairo Facility | Starknet OS Improvements | 400 R | +8 Research/sec | Native AA Extensions | 900 R | +14 Research/sec |
| ZK Research Complex | Recursive Proof Systems | 1,000 R | +15 Research/sec | Proof Compression | 2,500 R | +25 Research/sec |

### Transaction Building Upgrades

| Building | Upgrade 1 | Cost | Effect | Upgrade 2 | Cost | Effect |
|---|---|---|---|---|---|---|
| NFT Marketplace | Royalty Engine | 500 R | +0.8 TPS | Batch Minting | 1,000 R | +1.2 TPS |
| Gaming Studio | Session Keys | 800 R | +1.5 TPS | Paymaster Integration | 1,500 R | +2.0 TPS |
| DeFi Exchange | On-Chain Orderbook | 1,200 R | +2.0 TPS | Liquidity Aggregator | 2,500 R | +3.0 TPS |
| Social Network | Social Graph Protocol | 1,500 R | +3.0 TPS | Creator Monetization | 3,000 R | +4.0 TPS |
| Layer 3 Network | App-Specific Rollups | 2,000 R | +4.0 TPS | Custom DA Layer | 4,000 R | +6.0 TPS |

### Global Building Upgrades

| Building | Upgrade 1 | Cost | Effect | Upgrade 2 | Cost | Effect |
|---|---|---|---|---|---|---|
| Network Effect Engine | Viral Loops | 2,000 R | +10% Users | Ecosystem Incentives | 4,000 R | +15% Users |
| Protocol Institute | Core Protocol Grants | 2,500 R | +10% Research | Ecosystem Standards | 5,000 R | +15% Research |
| Sequencer Cluster | Parallel Execution | 3,000 R | +10% Transactions | Block Compression | 6,000 R | +15% Transactions |

### Additional Building Upgrades

| Building | Upgrade 1 | Cost | Effect | Upgrade 2 | Cost | Effect |
|---|---|---|---|---|---|---|
| Starknet Bridge Hub | Liquidity Mining Campaign | 1,200 R | +15 Users/sec | Fast Withdrawal System | 2,800 R | +25 Users/sec |
| Infrastructure RPC | High Throughput RPC | 800 R | +10 Research/sec | Geo-Distributed Nodes | 2,000 R | +18 Research/sec |
| Wallet Ecosystem | Embedded Wallet SDK | 900 R | +18 Users/sec | Smart Account Recovery | 2,200 R | +28 Users/sec |
| DeFi Aggregator | DEX Routing | 1,800 R | +3.0 TPS | MEV Protection Layer | 3,500 R | +4.0 TPS |
| On-Chain Identity | Human Verification Layer | 1,200 R | +12 Users/sec | Universal Profile System | 2,800 R | +20 Users/sec |

## Production Formula

Production is calculated on each action (buy, upgrade, submit score) based on elapsed time since last tick:

```
Capital:      capital_production * elapsed_seconds
Users:        users_production * (10000 + users_multiplier) / 10000 * elapsed_seconds
Research:     research_production * (10000 + research_multiplier) / 10000 * elapsed_seconds
Transactions: transactions_production * (10000 + tx_multiplier) / 10000 * elapsed_seconds / 10
```

The `/10` on Transactions accounts for the 10x internal scaling of TPS values.

Production is capped at the game end time — no resources accrue past 1200 seconds.

## Game Flow

1. **start_game** — Mints a game token, initializes 200 Capital + 1 Capital/sec, generates market
2. **buy_building** — Pick a building from the market, place it on the board. Costs Capital (+ Users for TX buildings). Blocked after game ends.
3. **upgrade_building** — Spend Research to apply an upgrade to a placed building. Sequential (1 then 2). Blocked after game ends.
4. **submit_score** — Can only be called once, only after the 20-minute duration has elapsed. Finalizes production up to end time.
5. **get_game_state** — View function returning raw stored state (resources, production rates, multipliers, game_time, minted_at, market). Client interpolates production locally.

## Technical Details

- Built with **Dojo** (onchain game engine) on **Starknet**
- Game tokens managed via **Denshokan** (minigame standard)
- Market randomness via **on-chain VRF**
- Market packing: 5 building slots encoded in a single `u64` (5 bits per slot)
- Multipliers stored as basis points (2000 = 20%)
- Score = total Transactions accumulated
