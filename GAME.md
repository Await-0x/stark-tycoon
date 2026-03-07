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
| **Transactions** | The score. Produced by Transaction buildings. Has a multiplier. |

## Board & Market

- **Board**: 5x5 grid (25 slots). Each slot holds one building.
- **Market**: 5 randomly selected buildings available at any time. When you buy one, it's replaced by a new random building (via on-chain VRF).
- Any building type can be bought multiple times (no uniqueness restrictions).

## Buildings

### Capital Buildings (1-5)

| ID | Name | Cost | Production |
|---|---|---|---|
| 1 | Treasury | 200 Capital | +3 Capital/sec |
| 2 | Angel Syndicate | 500 Capital | +6 Capital/sec |
| 3 | Venture Fund | 1,200 Capital | +10 Capital/sec |
| 4 | Trading Floor | 2,500 Capital | +16 Capital/sec |
| 5 | Capital Markets | 4,500 Capital | +22 Capital/sec |

### User Buildings (6-9)

| ID | Name | Cost | Production |
|---|---|---|---|
| 6 | Account Portal | 250 Capital | +8 Users/sec |
| 7 | Growth Hub | 800 Capital | +18 Users/sec |
| 8 | Community Hub | 1,800 Capital | +35 Users/sec |
| 9 | Developer Relations | 1,500 Capital | +22 Users/sec |

### Research Buildings (10-12)

| ID | Name | Cost | Production |
|---|---|---|---|
| 10 | R&D Lab | 300 Capital | +5 Research/sec |
| 11 | Cairo Lab | 1,000 Capital | +12 Research/sec |
| 12 | ZK Research | 3,000 Capital | +25 Research/sec |

### Transaction Buildings (13-17)

These cost Capital **and** Users (one-time). After purchase they produce Transactions for free.

| ID | Name | Capital Cost | User Cost | Production |
|---|---|---|---|---|
| 13 | NFT Marketplace | 1,200 | 150 Users | +1.0 TPS |
| 14 | Game Studio | 2,500 | 300 Users | +2.2 TPS |
| 15 | Decentralized Exchange | 4,000 | 500 Users | +3.8 TPS |
| 16 | Social Platform | 5,000 | 700 Users | +5.0 TPS |
| 17 | Appchain Network | 7,000 | 1,000 Users | +7.0 TPS |

### Global Buildings (18-20)

Multiplier buildings that boost all production of a given resource type (percentage-based).

| ID | Name | Cost | Effect |
|---|---|---|---|
| 18 | Starknet Foundation | 5,000 Capital | +20% Users production |
| 19 | Protocol Institute | 6,000 Capital | +20% Research production |
| 20 | Sequencer | 8,000 Capital | +20% Transactions production |

### Additional Buildings (21-25)

| ID | Name | Cost | Production |
|---|---|---|---|
| 21 | Starknet Bridge | 3,500 Capital | +20 Users/sec |
| 22 | RPC Provider | 2,200 Capital | +12 Research/sec |
| 23 | Wallet Provider | 2,800 Capital | +25 Users/sec |
| 24 | Arcade Machine | 1,000 Capital + 100 Users | +1 TPS |
| 25 | Identity Protocol | 3,200 Capital | +15 Users/sec |

## Upgrades

Every building has **2 sequential upgrades** that cost Research and permanently increase its production. Upgrade 1 must be applied before Upgrade 2.

### Capital Building Upgrades

| Building | Upgrade 1 | Cost | Effect | Upgrade 2 | Cost | Effect |
|---|---|---|---|---|---|---|
| Treasury | Financial Automation | 100 R | +2 Capital/sec | Yield Optimization | 300 R | +3 Capital/sec |
| Angel Syndicate | Syndicated Funding | 200 R | +4 Capital/sec | Anchor Investors | 500 R | +6 Capital/sec |
| Venture Fund | Portfolio Scaling | 400 R | +6 Capital/sec | Secondary Markets | 900 R | +10 Capital/sec |
| Trading Floor | Market Making Bots | 800 R | +8 Capital/sec | Cross-Chain Arbitrage | 1,500 R | +12 Capital/sec |
| Capital Markets | Institutional Liquidity | 1,200 R | +12 Capital/sec | Structured Products | 2,500 R | +18 Capital/sec |

### User Building Upgrades

| Building | Upgrade 1 | Cost | Effect | Upgrade 2 | Cost | Effect |
|---|---|---|---|---|---|---|
| Account Portal | Burner Wallets | 200 R | +6 Users/sec | Account Abstraction | 400 R | +10 Users/sec |
| Growth Hub | Referral Engine | 300 R | +10 Users/sec | Regional Expansion | 700 R | +15 Users/sec |
| Community Hub | Ambassador Program | 600 R | +20 Users/sec | Global Campaign | 1,200 R | +30 Users/sec |
| Developer Relations | Dev Grants | 500 R | +12 Users/sec | Hackathon Series | 1,000 R | +20 Users/sec |

### Research Building Upgrades

| Building | Upgrade 1 | Cost | Effect | Upgrade 2 | Cost | Effect |
|---|---|---|---|---|---|---|
| R&D Lab | Cairo Compiler Optimizations | 150 R | +4 Research/sec | Proving Improvements | 500 R | +8 Research/sec |
| Cairo Lab | Starknet OS Improvements | 400 R | +8 Research/sec | Smart Account Modules | 900 R | +14 Research/sec |
| ZK Research | Recursive Proof Systems | 1,000 R | +15 Research/sec | Proof Compression | 2,500 R | +25 Research/sec |

### Transaction Building Upgrades

| Building | Upgrade 1 | Cost | Effect | Upgrade 2 | Cost | Effect |
|---|---|---|---|---|---|---|
| NFT Marketplace | Royalty Engine | 500 R | +0.8 TPS | Batch Minting | 1,000 R | +1.2 TPS |
| Game Studio | Session Keys | 800 R | +1.5 TPS | Paymaster Integration | 1,500 R | +2.0 TPS |
| Decentralized Exchange | On-Chain Orderbook | 1,200 R | +2.0 TPS | Liquidity Aggregator | 2,500 R | +3.0 TPS |
| Social Platform | Social Graph Protocol | 1,500 R | +3.0 TPS | Creator Monetization | 3,000 R | +4.0 TPS |
| Appchain Network | App-Specific Rollups | 2,000 R | +4.0 TPS | Custom DA Layer | 4,000 R | +6.0 TPS |

### Global Building Upgrades

| Building | Upgrade 1 | Cost | Effect | Upgrade 2 | Cost | Effect |
|---|---|---|---|---|---|---|
| Starknet Foundation | Ecosystem Incentives | 2,000 R | +10% Users | Strategic Grants | 4,000 R | +15% Users |
| Protocol Institute | Core Protocol Grants | 2,500 R | +10% Research | Ecosystem Standards | 5,000 R | +15% Research |
| Sequencer | Parallel Execution | 3,000 R | +10% Transactions | State Diff Compression | 6,000 R | +15% Transactions |

### Additional Building Upgrades

| Building | Upgrade 1 | Cost | Effect | Upgrade 2 | Cost | Effect |
|---|---|---|---|---|---|---|
| Starknet Bridge | Shared Liquidity Network | 1,200 R | +15 Users/sec | Fast Withdrawal System | 2,800 R | +25 Users/sec |
| RPC Provider | High Throughput RPC | 800 R | +10 Research/sec | Geo-Distributed Nodes | 2,000 R | +18 Research/sec |
| Wallet Provider | Embedded Wallet SDK | 900 R | +18 Users/sec | Smart Account Recovery | 2,200 R | +28 Users/sec |
| Arcade Machine | DEX Routing | 1,800 R | +3.0 TPS | MEV Protection Layer | 3,500 R | +4.0 TPS |
| Identity Protocol | Human Verification Layer | 1,200 R | +12 Users/sec | Universal Profile System | 2,800 R | +20 Users/sec |

## Production Formula

Production is calculated on each action (buy, upgrade, submit score) based on elapsed time since last tick:

```
Capital:      capital_production * elapsed_seconds
Users:        users_production * (100 + users_multiplier) / 100 * elapsed_seconds
Research:     research_production * (100 + research_multiplier) / 100 * elapsed_seconds
Transactions: transactions_production * (100 + tx_multiplier) / 100 * elapsed_seconds
```

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
- Multipliers stored as percentages (20 = 20%)
- Score = total Transactions accumulated
