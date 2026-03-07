# Starknet Game Infrastructure Guide

A reference architecture for building a React game client that interacts with Starknet contracts. This guide covers everything from scaffolding the Vite project to the six core infrastructure files that handle: network configuration, wallet connection, contract calls, event translation, game orchestration, and state management.

Use this guide to scaffold the contract-interaction layer for **any** Starknet game.

---

## Table of Contents

0. [Project Setup](#0-project-setup)
1. [Architecture Overview](#1-architecture-overview)
2. [File Dependency Graph](#2-file-dependency-graph)
3. [File 1: Network Config](#3-file-1-network-config)
4. [File 2: Starknet Provider](#4-file-2-starknet-provider)
5. [File 3: System Calls](#5-file-3-system-calls)
6. [File 4: Event Translation](#6-file-4-event-translation)
7. [File 5: Game Store](#7-file-5-game-store)
8. [File 6: Game Director](#8-file-6-game-director)
9. [Supporting Files](#9-supporting-files)
10. [Integration Checklist](#10-integration-checklist)

---

## 0. Project Setup

### 0.1 Scaffold the Vite + React + TypeScript project

```bash
pnpm create vite my-game --template react-ts
cd my-game
```

This creates the base structure:
```
my-game/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
└── src/
    ├── main.tsx
    ├── App.tsx
    └── ...
```

### 0.2 Install dependencies

**Core dependencies** (required for contract interaction):

```bash
pnpm add \
  react@^18.2.0 \
  react-dom@^18.2.0 \
  starknet@8.5.2 \
  @starknet-react/core@^5.0.1 \
  @starknet-react/chains@5.0.1 \
  @cartridge/connector@^0.12.1 \
  @cartridge/controller@^0.12.1 \
  zustand@^4.5.6
```

**UI framework** (MUI + Emotion — do NOT use Tailwind):

```bash
pnpm add \
  @mui/material@^7.0.2 \
  @mui/icons-material@^7.0.2 \
  @emotion/react@^11.14.0 \
  @emotion/styled@^11.14.0
```

**Recommended utilities:**

```bash
pnpm add \
  notistack@^3.0.2 \
  framer-motion@^12.7.4 \
  react-router-dom@6.22.1
```

**Vite plugins** (required for WASM and top-level await used by Starknet libs):

```bash
pnpm add \
  vite-plugin-wasm@^3.4.1 \
  vite-plugin-top-level-await@^1.5.0 \
  vite-plugin-mkcert@^1.17.8
```

**Dev dependencies:**

```bash
pnpm add -D \
  @vitejs/plugin-react@^4.3.4 \
  @types/react@^18.2.0 \
  @types/react-dom@^18.2.0 \
  typescript@^5.8.3 \
  vite@^5.4.21 \
  vitest@^3.1.1 \
  @vitest/coverage-v8@^3.1.1 \
  eslint@^9.24.0 \
  typescript-eslint@^8.30.1 \
  eslint-plugin-react@^7.37.5 \
  eslint-plugin-react-hooks@^5.2.0 \
  eslint-plugin-react-refresh@^0.4.19
```

**pnpm overrides** (add to `package.json` to pin Starknet ecosystem versions):

```jsonc
{
  "pnpm": {
    "overrides": {
      "@cartridge/controller": "0.12.1",
      "@cartridge/connector": "0.12.1"
      // Add any Dojo overrides if using Dojo:
      // "@dojoengine/sdk": "1.7.3",
      // "@dojoengine/core": "1.7.2",
      // "@dojoengine/torii-client": "1.7.2"
    }
  }
}
```

### 0.3 Configure `package.json` scripts

```jsonc
{
  "name": "my-game",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint . --cache",
    "typecheck": "tsc --noEmit"
  }
}
```

### 0.4 Configure Vite

**`vite.config.ts`:**

```ts
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait(), mkcert()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

**Why each plugin is needed:**
| Plugin | Purpose |
|--------|---------|
| `@vitejs/plugin-react` | JSX transform, Fast Refresh |
| `vite-plugin-wasm` | Starknet libs use WASM modules (e.g., `@scure/starknet`) |
| `vite-plugin-top-level-await` | Required by WASM and some Starknet packages |
| `vite-plugin-mkcert` | HTTPS in dev (Cartridge Controller requires secure context) |

### 0.5 Configure TypeScript

**`tsconfig.json`:**

```jsonc
{
  "compilerOptions": {
    "lib": ["dom", "es2020"],
    "target": "es2020",
    "useDefineForClassFields": true,
    "module": "esnext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "allowJs": true,

    /* Path alias */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },

    /* Strict mode */
    "strict": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

**Key settings:**
- `target: "es2020"` — needed for BigInt literals used in felt manipulation.
- `moduleResolution: "bundler"` — required for Vite compatibility.
- `paths: { "@/*": ["src/*"] }` — must match the `resolve.alias` in vite.config.ts.
- `strict: true` — enforced for type safety.

### 0.6 Environment variables

Create **`.env`** at the project root:

```bash
VITE_PUBLIC_CHAIN=SN_MAIN
VITE_PUBLIC_GAME_ADDRESS=0x<your_game_contract_address>
```

All env vars exposed to the client **must** be prefixed with `VITE_`. Access them via `import.meta.env.VITE_PUBLIC_*`.

Create **`.env.example`** (committed to git) as a template:

```bash
VITE_PUBLIC_CHAIN=SN_MAIN
VITE_PUBLIC_GAME_ADDRESS=
```

Add `.env` to `.gitignore`.

### 0.7 `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <meta name="theme-color" content="#000000" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="description" content="My Starknet Game" />
  <link rel="icon" href="/favicon.png" type="image/png" />
  <title>My Game</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./src/main.tsx"></script>
</body>
</html>
```

### 0.8 Create the directory structure

```bash
mkdir -p src/{api,components,contexts,dojo,hooks,stores,types,utils}
```

Final directory layout:

```
src/
├── api/           # REST/RPC integration helpers
├── components/    # React UI components
├── contexts/      # React context providers (starknet, controller, GameDirector)
├── dojo/          # Contract call builders (useSystemCalls)
├── hooks/         # Custom hooks (useWebSocket, etc.)
├── stores/        # Zustand stores (gameStore)
├── types/         # TypeScript domain types (game.ts)
├── utils/         # Pure helpers (networkConfig, translation, themes)
├── main.tsx       # App entrypoint + provider composition
├── App.tsx        # Root component with routing + theme
└── index.css      # Global styles
```

### 0.9 Entrypoint files

**`src/main.tsx`:**

```tsx
import { createRoot } from "react-dom/client";
import { DynamicConnectorProvider } from "@/contexts/starknet";
import App from "./App";
import "./index.css";

async function main() {
  createRoot(document.getElementById("root")!).render(
    <DynamicConnectorProvider>
      <App />
    </DynamicConnectorProvider>
  );
}

main().catch((error) => {
  console.error("Failed to initialize the application:", error);
});
```

**`src/App.tsx`:**

```tsx
import { StyledEngineProvider, ThemeProvider, createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";
import { ControllerProvider } from "@/contexts/controller";
import { GameDirector } from "@/contexts/GameDirector";

const theme = createTheme({
  // Your MUI theme customization
});

function App() {
  return (
    <BrowserRouter>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <SnackbarProvider anchorOrigin={{ vertical: "top", horizontal: "center" }} preventDuplicate>
            <ControllerProvider>
              <GameDirector>
                <Box>{/* Your game pages/routes here */}</Box>
              </GameDirector>
            </ControllerProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </BrowserRouter>
  );
}

export default App;
```

**Provider nesting order (outermost → innermost):**

```
main.tsx:  DynamicConnectorProvider (Starknet + wallet)
App.tsx:     BrowserRouter (routing)
               StyledEngineProvider (MUI CSS injection order)
                 ThemeProvider (MUI theme)
                   SnackbarProvider (toast notifications)
                     ControllerProvider (account, balances, login/logout)
                       GameDirector (orchestration, WS, action dispatch)
                         <Your Game UI>
```

This order matters because:
1. `DynamicConnectorProvider` wraps `StarknetConfig` which provides `useAccount()`.
2. `ControllerProvider` needs `useAccount()` from above.
3. `GameDirector` needs both `useAccount()` and controller context.
4. `SnackbarProvider` must wrap anything that calls `enqueueSnackbar`.

---

## 1. Architecture Overview

```
User Action
    │
    ▼
┌─────────────────┐     ┌──────────────────┐
│  Game Director   │────▶│  System Calls    │──── account.execute(calls) ───▶ Starknet
│  (orchestrator)  │     │  (tx builder)    │                                    │
└────────┬────────┘     └──────────────────┘                                    │
         │                                                              Transaction Receipt
         │                                                                      │
         │              ┌──────────────────┐                                    │
         │◀─────────────│  Translation     │◀───── decode events ───────────────┘
         │              │  (event decoder)  │
         │              └──────────────────┘
         │
         ▼
┌─────────────────┐
│   Game Store    │──────▶ React Components
│   (Zustand)     │
└─────────────────┘

Parallel realtime path:
  Contract Event → Indexer → DB → API WebSocket → Game Director → Game Store → UI
```

**Data flow summary:**
1. **Network Config** defines endpoints, contract addresses, tokens, and session policies.
2. **Starknet Provider** initializes wallet connectors (Cartridge Controller, Argent, Braavos) using config.
3. **System Calls** builds `Call[]` arrays for each game action and executes them via the connected account.
4. **Translation** decodes transaction receipt events into typed game events.
5. **Game Director** orchestrates: dispatches actions, processes translated events, manages optimistic updates, handles WebSocket events.
6. **Game Store** (Zustand) holds all game state that React components consume.

---

## 2. File Dependency Graph

```
networkConfig.ts          ← standalone, no internal deps
        │
        ▼
starknet.tsx              ← imports networkConfig
        │
        ▼
useSystemCalls.ts         ← imports networkConfig (via starknet context)
        │
        ▼
translation.ts            ← standalone, pure decoding functions
        │
        ▼
gameStore.ts              ← standalone Zustand store
        │
        ▼
GameDirector.tsx          ← imports ALL of the above
```

**Build order: Create files in this order** — networkConfig → starknet → translation → gameStore → useSystemCalls → GameDirector.

---

## 3. File 1: Network Config

**Path:** `src/utils/networkConfig.ts`
**Purpose:** Single source of truth for all network-specific values.

### What to define

```ts
// ── Token addresses ──
// Map every game token (ERC20/ERC721) to its on-chain address.
export const TOKEN_ADDRESS = {
  TOKEN_A: "0x...",
  TOKEN_B: "0x...",
  STRK: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
} as const;

// ── Token config type ──
export interface TokenConfig {
  name: string;        // Display name
  address: string;     // Contract address
  displayDecimals: number; // Decimals to show in UI
  decimals?: number;   // On-chain decimals (default 18)
  symbol?: string;     // Optional ticker
  price?: number;      // Optional USD price for payment selection
}

// ── Network config type ──
export interface NetworkConfig {
  chainId: ChainId;
  slot: string;                        // Cartridge slot name
  preset: string;                      // Cartridge preset name
  policies: Record<string, unknown>;   // Session key policies (see below)
  rpcUrl: string;
  toriiUrl: string;                    // Torii/indexer query endpoint
  apiUrl: string;                      // REST API base URL
  wsUrl: string;                       // WebSocket URL for realtime events
  chains: Array<{ rpcUrl: string }>;   // Passed to Cartridge connector
  tokens: { erc20: TokenConfig[] };    // Tokens to track balances for
  // Add game-specific contract addresses as top-level fields:
  // e.g. gameContract: string; nftContract: string;
}

// ── Chain enum ──
export enum ChainId {
  SN_MAIN = "SN_MAIN",
  SN_SEPOLIA = "SN_SEPOLIA",
  WP_PG_SLOT = "WP_PG_SLOT",  // Local/slot devnet
}

// ── Network definitions ──
// One entry per supported network.
export const NETWORKS = {
  SN_MAIN: {
    chainId: ChainId.SN_MAIN,
    slot: "my-game-slot",
    rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet/rpc/v0_9",
    torii: "https://api.cartridge.gg/x/my-torii/torii",
    apiUrl: "https://my-api.example.com",
    wsUrl: "wss://my-api.example.com/ws",
    tokens: { erc20: [/* TokenConfig entries */] },
    // game-specific addresses:
    // gameContract: "0x...",
  },
};
```

### Session Key Policies

Policies tell the Cartridge Controller which contract methods the session key is allowed to call without re-prompting the user. Structure:

```ts
const policies = {
  contracts: {
    [GAME_CONTRACT_ADDRESS]: {
      name: "My Game",
      description: "Main game contract",
      methods: [
        {
          name: "Human-readable Action Name",
          description: "What this does",
          entrypoint: "cairo_function_name",
        },
        // For approve methods, include amount and spender:
        {
          name: "Approve Token",
          amount: "50000000000000000000000",  // Max allowance
          spender: GAME_CONTRACT_ADDRESS,
          description: "Approve token spending",
          entrypoint: "approve",
        },
      ],
    },
    // Add one entry per contract the game interacts with
    // (game contract, each token contract, VRF provider, etc.)
  },
};
```

### `getNetworkConfig()` function

```ts
export function getNetworkConfig(networkKey: ChainId): NetworkConfig {
  const network = NETWORKS[networkKey as keyof typeof NETWORKS];
  if (!network) throw new Error(`Network ${networkKey} not found`);

  // Build policies here (can reference env vars for contract addresses)
  const GAME_ADDRESS = import.meta.env.VITE_PUBLIC_GAME_ADDRESS;
  const policies = { /* ... */ };

  return {
    chainId: network.chainId,
    slot: network.slot,
    preset: "my-game-preset",
    policies,
    rpcUrl: network.rpcUrl,
    toriiUrl: network.torii,
    apiUrl: network.apiUrl,
    wsUrl: network.wsUrl,
    chains: [{ rpcUrl: network.rpcUrl }],
    tokens: network.tokens,
    // spread game-specific fields
  };
}
```

### Key rules
- Contract addresses come from env vars (`VITE_PUBLIC_*`) or are hardcoded constants.
- Every contract entrypoint the game calls MUST have a policy entry or the Cartridge session will prompt users.
- Token display decimals are for UI only; on-chain decimals default to 18 unless overridden.

---

## 4. File 2: Starknet Provider

**Path:** `src/contexts/starknet.tsx`
**Purpose:** Wrap the app in Starknet + Cartridge wallet providers.

### Pattern

```tsx
import type { NetworkConfig } from "@/utils/networkConfig";
import { getNetworkConfig } from "@/utils/networkConfig";
import ControllerConnector from "@cartridge/connector/controller";
import { mainnet, sepolia } from "@starknet-react/chains";
import {
  argent, braavos, jsonRpcProvider, StarknetConfig,
  useInjectedConnectors, voyager,
} from "@starknet-react/core";
import { createContext, useCallback, useContext, useState, type PropsWithChildren } from "react";

// ── Context for runtime network switching ──
interface DynamicConnectorContext {
  currentNetworkConfig: NetworkConfig;
  setCurrentNetworkConfig: (config: NetworkConfig) => void;
}
const DynamicConnectorContext = createContext<DynamicConnectorContext | null>(null);

// ── Initialize Cartridge Controller at module scope ──
const controllerConfig = getNetworkConfig(import.meta.env.VITE_PUBLIC_CHAIN);
const cartridgeController =
  typeof window !== "undefined"
    ? new ControllerConnector({
        policies: controllerConfig.policies,
        slot: controllerConfig.slot,
        preset: controllerConfig.preset,
        chains: controllerConfig.chains,
        propagateSessionErrors: true,
      })
    : null;

export function DynamicConnectorProvider({ children }: PropsWithChildren) {
  const [currentNetworkConfig, setCurrentNetworkConfig] =
    useState(controllerConfig);

  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "onlyIfNoConnectors",
  });

  const rpc = useCallback(
    () => ({ nodeUrl: controllerConfig.chains[0].rpcUrl }),
    []
  );

  const allConnectors = cartridgeController
    ? [...connectors, cartridgeController]
    : connectors;

  return (
    <DynamicConnectorContext.Provider
      value={{ currentNetworkConfig, setCurrentNetworkConfig }}
    >
      <StarknetConfig
        chains={[mainnet, sepolia]}
        provider={jsonRpcProvider({ rpc })}
        connectors={allConnectors}
        explorer={voyager}
        autoConnect
      >
        {children}
      </StarknetConfig>
    </DynamicConnectorContext.Provider>
  );
}

export function useDynamicConnector() {
  const ctx = useContext(DynamicConnectorContext);
  if (!ctx) throw new Error("useDynamicConnector must be within DynamicConnectorProvider");
  return ctx;
}
```

### Key rules
- Controller is created once at module scope (not in a render cycle).
- `typeof window !== "undefined"` guard prevents SSR crashes.
- The `DynamicConnectorContext` exposes the active `NetworkConfig` so downstream hooks can access endpoints, token lists, etc.

---

## 5. File 3: System Calls

**Path:** `src/dojo/useSystemCalls.ts`
**Purpose:** Build and execute Starknet transactions for every game action.

### Architecture

This hook returns:
1. **Action builders** — pure functions that return `Call[]` (no side effects).
2. **`executeAction`** — the single execution path that submits `Call[]`, waits for receipt, translates events, and handles errors.

```ts
import { useDynamicConnector } from "@/contexts/starknet";
import { translateGameEvent } from "@/utils/translation";
import type { TranslatedGameEvent } from "@/utils/translation";
import { useAccount } from "@starknet-react/core";
import { useSnackbar } from "notistack";
import { CallData } from "starknet";
import type { Call } from "starknet";

type TransactionReceiptLike = {
  execution_status?: string;
  actual_fee?: { amount?: string | number | bigint } | string | number | bigint;
  events?: unknown[];
};

/**
 * Extracts a human-readable error message from a Starknet execution error.
 * Looks for quoted strings that aren't standard error codes.
 */
const parseExecutionError = (error: unknown): string => {
  const fallback = "Error executing action";
  const isValidMessage = (m: string) =>
    m.length > 3 && !m.includes("FAILED") && !m.includes("argent/") && !m.startsWith("0x");
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  try {
    if (!error || typeof error !== "string") return fallback;

    // Try single quotes in parentheses: ('message')
    const singleQuoteMatches = error.match(/\('([^']+)'\)/g);
    if (singleQuoteMatches) {
      const message = singleQuoteMatches
        .map(m => m.slice(2, -2))
        .find(isValidMessage);
      if (message) return capitalize(message);
    }

    // Try escaped double quotes: \"message\"
    const escapedMatches = error.match(/\\"([^"\\]+)\\"/g);
    if (escapedMatches) {
      const message = escapedMatches
        .map(m => m.replace(/\\"/g, ""))
        .find(isValidMessage);
      if (message) return capitalize(message);
    }

    // Try regular double quotes: "message"
    const doubleQuoteMatches = error.match(/"([^"]+)"/g);
    if (doubleQuoteMatches) {
      const message = doubleQuoteMatches
        .map(m => m.slice(1, -1))
        .find(isValidMessage);
      if (message) return capitalize(message);
    }

    return fallback;
  } catch {
    return fallback;
  }
};

export const useSystemCalls = () => {
  const { account } = useAccount();
  const { currentNetworkConfig } = useDynamicConnector();
  const { enqueueSnackbar } = useSnackbar();
  const GAME_ADDRESS = import.meta.env.VITE_PUBLIC_GAME_ADDRESS;

  // ── Core execution ──
  const executeAction = async (
    calls: Call[],
    onFailure: () => void
  ): Promise<TranslatedGameEvent[] | null | undefined> => {
    if (!account) { onFailure(); return null; }

    try {
      const tx = await account.execute(calls);
      const receipt = await waitForTransaction(tx.transaction_hash, 0);

      if (receipt.execution_status === "REVERTED") {
        onFailure();
        return undefined;
      }

      // Translate receipt events using your game's decoder
      const translatedEvents = (receipt.events || [])
        .map((event) =>
          translateGameEvent(
            event as Parameters<typeof translateGameEvent>[0],
            account.address
          )
        )
        .flat()
        .filter(Boolean) as TranslatedGameEvent[];

      return translatedEvents;
    } catch (error) {
      console.error("Error executing action:", error);

      // Extract and display user-friendly error
      const executionError =
        typeof error === "object" && error !== null && "data" in error &&
        typeof (error as { data?: unknown }).data === "object" &&
        (error as { data?: unknown }).data !== null &&
        "execution_error" in ((error as { data: Record<string, unknown> }).data)
          ? (error as { data: { execution_error?: unknown } }).data.execution_error
          : undefined;

      enqueueSnackbar(parseExecutionError(executionError), { variant: "error" });
      onFailure();
      return null;
    }
  };

  // ── Transaction polling with retry ──
  const waitForTransaction = async (
    txHash: string,
    retries: number
  ): Promise<TransactionReceiptLike> => {
    if (retries > 9) throw new Error("Transaction failed");
    if (!account) throw new Error("Wallet not connected");

    try {
      const receipt = await account.waitForTransaction(txHash, {
        retryInterval: 500,
        successStates: ["PRE_CONFIRMED", "ACCEPTED_ON_L2", "ACCEPTED_ON_L1"],
      });
      return receipt as unknown as TransactionReceiptLike;
    } catch (error) {
      console.error("Error waiting for transaction:", error);
      await new Promise(r => setTimeout(r, 500));
      return waitForTransaction(txHash, retries + 1);
    }
  };

  // ── Action builders ──
  // Each returns Call[] — NO execution, NO side effects.

  const doSomething = (param1: number, param2: number): Call[] => {
    return [{
      contractAddress: GAME_ADDRESS,
      entrypoint: "do_something",
      calldata: CallData.compile([param1, param2]),
    }];
  };

  // For actions needing token approval first:
  const actionWithApproval = (tokenAddress: string, amount: number): Call[] => {
    const txs: Call[] = [];

    // 1. Approve token spend
    txs.push({
      contractAddress: tokenAddress,
      entrypoint: "approve",
      calldata: CallData.compile([GAME_ADDRESS, BigInt(amount * 1e18), "0"]),
    });

    // 2. Actual game action
    txs.push({
      contractAddress: GAME_ADDRESS,
      entrypoint: "game_action",
      calldata: CallData.compile([amount]),
    });

    return txs;
  };

  // For actions needing VRF randomness:
  const VRF_PROVIDER = "0x051fea4450da9d6aee758bdeba88b2f665bcbf549d2c61421aa724e9ac0ced8f";

  const requestRandom = (): Call => ({
    contractAddress: VRF_PROVIDER,
    entrypoint: "request_random",
    calldata: CallData.compile({
      caller: GAME_ADDRESS,
      source: { type: 0, address: account!.address },
    }),
  });

  return {
    executeAction,
    doSomething,
    actionWithApproval,
    requestRandom,
  };
};
```

### Key rules
- **Action builders are pure** — they construct calls but never execute. The Game Director decides when to execute.
- **`CallData.compile()`** handles felt serialization; pass arrays, objects, or primitives.
- **Multi-call batching**: Multiple calls in one `account.execute(calls)` are atomic — if any reverts, all revert.
- **VRF pattern**: If your game uses Cartridge VRF, prepend `requestRandom()` to the calls array.
- **Token approvals**: When the game contract needs to spend user tokens, prepend an `approve` call.
- **Error handling**: Always call `onFailure` so the Game Director can reset UI state (loading spinners, optimistic updates, etc.).
- **`parseExecutionError`**: Starknet execution errors are deeply nested strings with quoted messages. This parser extracts the human-readable part.

---

## 6. File 4: Event Translation

**Path:** `src/utils/translation.ts`
**Purpose:** Decode raw Starknet transaction receipt events into typed game objects.

### How Starknet events work

A receipt event looks like:
```ts
{
  keys: ["0x<selector>", ...extra_keys],
  data: ["0x<felt>", "0x<felt>", ...],
  from_address: "0x<contract_address>",
}
```

- `keys[0]` is the event selector: `starknet.hash.getSelectorFromName("EventName")`.
- `data` contains the event payload as hex-encoded felts.

### Pattern

```ts
import { hash } from "starknet";

// ── 1. Register events ──
const EVENT_NAMES = ["MyBattleEvent", "MyStateUpdate"] as const;
type SupportedEventName = (typeof EVENT_NAMES)[number];

// Build selector → name lookup at module load time
const SELECTOR_TO_NAME = new Map<string, SupportedEventName>();
for (const name of EVENT_NAMES) {
  const selector = hash.getSelectorFromName(name);
  const normalized = `0x${BigInt(selector).toString(16).padStart(64, "0")}`;
  SELECTOR_TO_NAME.set(normalized, name);
}

const normalizeSelector = (sel: string | bigint): string => {
  const v = typeof sel === "string" ? BigInt(sel) : sel;
  return `0x${v.toString(16).padStart(64, "0")}`;
};

// ── 2. Define typed event interfaces ──
// Every interface has a `componentName` string literal for discrimination.
export interface MyBattleEventTranslation {
  componentName: "MyBattleEvent";
  attacker_id: number;
  defender_id: number;
  damage: number;
}

export interface MyStateUpdateTranslation {
  componentName: "MyStateUpdate";
  entity_id: number;
  health: number;
  level: number;
}

export type TranslatedGameEvent =
  | MyBattleEventTranslation
  | MyStateUpdateTranslation;

// ── 3. Decode functions (one per event type) ──
function hexToNumber(hex: string | undefined): number {
  return Number(BigInt(hex || "0x0"));
}

function decodeMyBattleEvent(data: string[]): MyBattleEventTranslation | null {
  if (data.length < 3) return null;
  return {
    componentName: "MyBattleEvent",
    attacker_id: hexToNumber(data[0]),
    defender_id: hexToNumber(data[1]),
    damage: hexToNumber(data[2]),
  };
}

// ── 4. For packed data (bit-packed felt252 from Cairo) ──
// If your contract packs multiple fields into a single felt252,
// use BigInt bit operations to unpack:
export function unpackEntityStats(packedFelt: string): MyStateUpdateTranslation {
  const packed = BigInt(packedFelt);
  const MASK_16 = 0xFFFFn;
  const MASK_12 = 0xFFFn;

  const entity_id = Number(packed & MASK_16);
  const health = Number((packed >> 16n) & MASK_12);
  const level = Number((packed >> 28n) & MASK_12);

  return { componentName: "MyStateUpdate", entity_id, health, level };
}

// ── 5. Main dispatcher ──
type StarknetEventLike = {
  keys?: Array<string | bigint>;
  data?: string[];
  from_address?: string;
};

export const translateGameEvent = (
  event: StarknetEventLike,
  accountAddress: string
): TranslatedGameEvent[] => {
  let name: SupportedEventName | null = null;

  // Match keys[0] selector to registered event name
  if (event.keys?.[0]) {
    name = SELECTOR_TO_NAME.get(normalizeSelector(event.keys[0])) || null;
  }

  const data = event.data ?? [];

  // Fallback: handle events from user's own account address
  // (e.g., transfer events that don't have a known selector)
  if (!name && event.from_address === accountAddress) {
    // Handle account-specific events here
    return [];
  }

  if (!name) return [];

  switch (name) {
    case "MyBattleEvent": {
      const d = decodeMyBattleEvent(data);
      return d ? [d] : [];
    }
    case "MyStateUpdate": {
      if (data.length < 1) return [];
      return [unpackEntityStats(data[0])];
    }
    default:
      return [];
  }
};
```

### Key rules
- **Selector normalization** is critical — always zero-pad to 64 hex chars for comparison.
- **Packed felts**: If the Cairo contract packs data into felt252 using bit shifts, the TS decoder must use identical masks and shift amounts. This is parity-critical across contract/indexer/client.
- **Return arrays** from `translateGameEvent` since one receipt event can decode to multiple logical events (e.g., a batch update event containing N entity updates).
- **Guard on data length** before indexing to avoid out-of-bounds.
- **Account address fallback**: Events from the user's own account (e.g., transfer events) may need special handling by checking `from_address === accountAddress`.

---

## 7. File 5: Game Store

**Path:** `src/stores/gameStore.ts`
**Purpose:** Zustand store holding all game state consumed by React components.

### Pattern

```ts
import { create } from "zustand";

// ── Domain types ──
// Import or define your game's entity types
interface Entity {
  id: number;
  health: number;
  level: number;
  // ...
}

// ── Notification system ──
export interface GameNotification {
  id: string;
  type: string;
  value?: number | string;
  playerName?: string;
}

interface GameState {
  // ── Core game state ──
  entities: Entity[];
  selectedEntities: Entity[];
  actionInProgress: boolean;

  // ── Realtime state ──
  battleEvents: BattleEvent[];
  notifications: GameNotification[];

  // ── UI state ──
  sortMethod: string;
  filterActive: boolean;

  // ── Setters ──
  // Use functional updater pattern for state that depends on previous value
  setEntities: (entities: Entity[] | ((prev: Entity[]) => Entity[])) => void;
  setSelectedEntities: (selected: Entity[]) => void;
  setActionInProgress: (inProgress: boolean) => void;
  setBattleEvents: (events: BattleEvent[]) => void;
  addNotification: (notification: Omit<GameNotification, "id">) => void;
  removeNotification: (id: string) => void;

  // ── Reset ──
  disconnect: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  // ── Initial values ──
  entities: [],
  selectedEntities: [],
  actionInProgress: false,
  battleEvents: [],
  notifications: [],
  sortMethod: "power",
  filterActive: false,

  // ── Setters ──
  // IMPORTANT: Accept both direct values and functional updaters
  // for any state that can be updated from multiple sources
  // (tx results + WebSocket events concurrently)
  setEntities: (entities) =>
    set((state) => ({
      entities: typeof entities === "function" ? entities(state.entities) : entities,
    })),

  setSelectedEntities: (selected) => set({ selectedEntities: selected }),
  setActionInProgress: (inProgress) => set({ actionInProgress: inProgress }),
  setBattleEvents: (events) => set({ battleEvents: events }),

  addNotification: (notification) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }],
    }));
    // Auto-remove after display duration
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 3000);
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  // ── Reset all state on disconnect ──
  disconnect: () =>
    set({
      entities: [],
      selectedEntities: [],
      actionInProgress: false,
      battleEvents: [],
      notifications: [],
    }),
}));
```

### Key rules
- **Functional updaters** (`(prev) => next`) are essential for setters where multiple callers may update the same slice concurrently (e.g., collection updates from both tx results and WebSocket events).
- **Split stores** if you have high-frequency state (e.g., autopilot counters) — keep it in a separate store so it doesn't trigger re-renders on the main game tree.
- **Auto-removing notifications** via `setTimeout` inside the store keeps component code clean.
- **`disconnect()`** resets all state back to defaults when a user logs out.
- **Persist user preferences** (sort method, filters) to `localStorage` if desired.

---

## 8. File 6: Game Director

**Path:** `src/contexts/GameDirector.tsx`
**Purpose:** Central orchestrator that connects everything: dispatches actions, processes results, handles WebSocket events, manages optimistic updates.

### Pattern

```tsx
import { useSystemCalls } from "@/dojo/useSystemCalls";
import type { TranslatedGameEvent } from "@/utils/translation";
import { useGameStore } from "@/stores/gameStore";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useDynamicConnector } from "@/contexts/starknet";
import { useAccount } from "@starknet-react/core";
import type { Call } from "starknet";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  type PropsWithChildren,
} from "react";

// ── Import your typed event interfaces ──
import type {
  MyBattleEventTranslation,
  MyStateUpdateTranslation,
} from "@/utils/translation";

// ── Type guards for event discrimination ──
const isBattleEvent = (e: TranslatedGameEvent): e is MyBattleEventTranslation =>
  e.componentName === "MyBattleEvent";
const isStateUpdate = (e: TranslatedGameEvent): e is MyStateUpdateTranslation =>
  e.componentName === "MyStateUpdate";

// ── Define the union of all actions your game supports ──
// (import from src/types/game.ts in practice)
type GameAction =
  | { type: "attack"; entityIds: number[]; useVrf: boolean; pauseUpdates?: boolean }
  | { type: "claim_reward"; entityIds: number[] }
  | { type: "upgrade"; entityId: number; stats: Record<string, number> };

interface GameDirectorContext {
  executeGameAction: (action: GameAction) => Promise<boolean>;
  actionFailed: number;   // Increment counter — components useEffect on this to reset UI
  pauseUpdates: boolean;
  setPauseUpdates: (pause: boolean) => void;
}

const GameDirectorContext = createContext<GameDirectorContext>({} as GameDirectorContext);

export const GameDirector = ({ children }: PropsWithChildren) => {
  const { account } = useAccount();
  const { currentNetworkConfig } = useDynamicConnector();
  const {
    setEntities, setActionInProgress, setBattleEvents, addNotification,
  } = useGameStore();
  const { executeAction, doSomething, actionWithApproval } = useSystemCalls();

  // actionFailed is an incrementing counter — components useEffect on changes
  const [actionFailed, setActionFailed] = useReducer((x: number) => x + 1, 0);
  const [pauseUpdates, setPauseUpdates] = useState(false);

  // ── Reset UI loading states on any failure ──
  useEffect(() => {
    setActionInProgress(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionFailed]);

  // ── WebSocket: handle realtime events from other players ──
  const handleRealtimeGameState = (data: unknown) => {
    if (pauseUpdates) return; // Don't overwrite during attack animations
    // Update entities from WebSocket data
  };

  const handleRealtimeEvent = (data: unknown) => {
    // Show notifications for other players' actions
    // Update shared game state (e.g., who controls the objective)
  };

  useWebSocket({
    url: currentNetworkConfig.wsUrl,
    channels: ["game_state", "events"],
    onGameState: handleRealtimeGameState,
    onEvent: handleRealtimeEvent,
  });

  // ── Fetch initial state on mount ──
  useEffect(() => {
    // Fetch initial game state from API
    // e.g., fetchGameState().then(data => setEntities(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Apply state updates from translated events to local entities ──
  const updateEntitiesFromEvents = (events: MyStateUpdateTranslation[]) => {
    if (events.length === 0) return;

    setEntities((prevEntities) =>
      prevEntities.map((entity) => {
        const update = events.find((e) => e.entity_id === entity.id);
        return update ? { ...entity, health: update.health, level: update.level } : entity;
      })
    );
  };

  // ── Central action dispatcher ──
  const executeGameAction = async (action: GameAction): Promise<boolean> => {
    const txs: Call[] = [];
    const shouldPauseUpdates = "pauseUpdates" in action && action.pauseUpdates === true;

    // 1. Build calls based on action type
    switch (action.type) {
      case "attack":
        setActionInProgress(true);
        setBattleEvents([]);
        txs.push(...doSomething(action.entityIds[0], action.entityIds.length));
        break;

      case "claim_reward":
        txs.push(...doSomething(0, action.entityIds.length));
        break;

      case "upgrade":
        // Optimistic update BEFORE execution
        setEntities((prev) =>
          prev.map((e) =>
            e.id === action.entityId ? { ...e, ...action.stats } : e
          )
        );
        txs.push(...doSomething(action.entityId, 0));
        break;
    }

    if (shouldPauseUpdates) {
      setPauseUpdates(true);
    }

    // 2. Execute all calls as one multicall
    const events = await executeAction(txs, setActionFailed);

    if (!events) {
      // 3a. Revert optimistic updates on failure
      if (action.type === "upgrade") {
        // Undo the optimistic state change
        setEntities((prev) =>
          prev.map((e) =>
            e.id === action.entityId
              ? { ...e, /* restore original values */ }
              : e
          )
        );
      }
      setActionFailed();
      return false;
    }

    // 3b. Process successful events
    updateEntitiesFromEvents(events.filter(isStateUpdate));

    if (action.type === "attack") {
      if (shouldPauseUpdates) {
        // Store battle events for animation playback
        setBattleEvents(events.filter(isBattleEvent));
      } else {
        setActionInProgress(false);
      }
    }

    return true;
  };

  return (
    <GameDirectorContext.Provider
      value={{ executeGameAction, actionFailed, pauseUpdates, setPauseUpdates }}
    >
      {children}
    </GameDirectorContext.Provider>
  );
};

export const useGameDirector = () => useContext(GameDirectorContext);
```

### Key patterns

**Optimistic updates with rollback:**
```
User clicks upgrade
  → Immediately update store (optimistic)
  → Execute transaction
  → On success: events confirm/correct the state
  → On failure: revert the optimistic update
```

**Pause updates during animations:**
```
Some actions (like attack animations) need to pause WebSocket-driven updates
so the UI can show a battle sequence without being overwritten.
Use a `pauseUpdates` flag that the WS handler checks before applying state.
```

**Event flow for own actions vs. other players:**
```
Own actions:     executeGameAction → receipt events → translate → update store
Other players:   WebSocket message → handleRealtimeEvent → update store + notifications
```

### Key rules
- **Single execution path**: All game writes go through `executeGameAction`. Components never call `useSystemCalls` directly.
- **`actionFailed` counter**: Using `useReducer(x => x + 1, 0)` provides a stable incrementing signal that components can `useEffect` on to reset loading states.
- **Separate own-action processing from WebSocket events** — your tx results come from the receipt, WebSocket events come from other players.
- **Revert optimistic updates** on any failure — partial state is worse than stale state.

---

## 9. Supporting Files

These files complete the infrastructure but are simpler to implement:

### `src/types/game.ts` — Domain types

Define TypeScript interfaces for every game entity and action:

```ts
// Entities
export interface Entity { id: number; health: number; level: number; /* ... */ }

// Actions — discriminated union with BaseAction for shared flags
interface BaseAction { pauseUpdates?: boolean; }
export type AttackAction = BaseAction & { type: "attack"; entityIds: number[]; useVrf: boolean };
export type ClaimAction = BaseAction & { type: "claim_reward"; entityIds: number[] };
export type UpgradeAction = BaseAction & { type: "upgrade"; entityId: number; stats: Record<string, number> };
export type GameAction = AttackAction | ClaimAction | UpgradeAction;

// Events from chain (matches Cairo struct layout)
export interface BattleEvent { attacker_id: number; defender_id: number; damage: number; }
```

### `src/hooks/useWebSocket.ts` — Realtime subscription

```ts
// Manages WebSocket lifecycle: connect, subscribe to channels, auto-reconnect.
//
// Key features:
// - Exponential backoff on disconnect (1s, 2s, 4s, 8s, 16s then 30s cap)
// - Ping/pong keepalive every 30s
// - Channel-based message routing via typed callbacks (onGameState, onEvent, etc.)
// - Refs for callbacks to avoid reconnect on handler changes
// - mountedRef guard to prevent setState after unmount
//
// Usage:
//   useWebSocket({
//     url: networkConfig.wsUrl,
//     channels: ["game_state", "events"],
//     onGameState: (data) => { /* update state */ },
//     onEvent: (data) => { /* show notification */ },
//   });
//
// Message protocol (JSON over WebSocket):
//   Client → Server: { type: "subscribe", channels: ["game_state", "events"] }
//   Client → Server: { type: "ping" }
//   Server → Client: { type: "game_state", data: { ... } }
//   Server → Client: { type: "event", data: { ... } }
//   Server → Client: { type: "pong" }
```

### `src/contexts/controller.tsx` — Wallet session management

```ts
// Wraps account connection state, token balance fetching, and user profile.
//
// Key responsibilities:
// - Fetch token balances on connect using networkConfig.tokens.erc20
// - Fetch user's NFT/entity collection on connect
// - Provide login() and logout() bound to the Cartridge Controller connector
// - Expose playerName from the Cartridge connector
// - Track gasSpent for fee display animations
// - Manage terms-of-service acceptance flow
//
// Provides via context:
//   playerName, tokenBalances, setTokenBalances, fetchTokenBalances,
//   fetchCollection, login, logout, openProfile, gasSpent, triggerGasSpent
```

### `src/utils/themes.ts` — MUI theme

```ts
import { createTheme } from "@mui/material/styles";

export const mainTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#your-primary-color" },
    background: { default: "#your-bg-color", paper: "#your-paper-color" },
  },
  typography: {
    fontFamily: "'Your Font', sans-serif",
  },
  // component overrides...
});
```

---

## 10. Integration Checklist

Use this checklist when scaffolding a new game:

### Project Setup
- [ ] Scaffold with `pnpm create vite my-game --template react-ts`
- [ ] Install all core dependencies (starknet, @starknet-react/*, @cartridge/*, zustand)
- [ ] Install Vite plugins (wasm, top-level-await, mkcert)
- [ ] Install UI framework (MUI + Emotion)
- [ ] Install utilities (notistack, framer-motion, react-router-dom)
- [ ] Configure `vite.config.ts` with all plugins and `@` path alias
- [ ] Configure `tsconfig.json` with `es2020` target, `bundler` resolution, `strict` mode, and `@/*` paths
- [ ] Create `.env` with `VITE_PUBLIC_CHAIN` and `VITE_PUBLIC_GAME_ADDRESS`
- [ ] Create directory structure: `src/{api,components,contexts,dojo,hooks,stores,types,utils}`
- [ ] Set up `pnpm.overrides` to pin `@cartridge/*` versions

### Network Config
- [ ] Define all contract addresses in `TOKEN_ADDRESS`
- [ ] Configure `NETWORKS` with correct RPC, Torii, API, and WS URLs
- [ ] List every contract entrypoint in session key policies
- [ ] `getNetworkConfig()` returns a complete `NetworkConfig`

### Starknet Provider
- [ ] Controller created at module scope with `typeof window` guard
- [ ] `DynamicConnectorProvider` wraps `StarknetConfig`
- [ ] `useDynamicConnector()` hook exports `currentNetworkConfig`

### System Calls
- [ ] One builder function per game action (returns `Call[]`)
- [ ] Builders are pure — no execution, no side effects
- [ ] Token approval calls prepended where needed
- [ ] VRF request prepended for randomness-dependent actions
- [ ] `executeAction` handles REVERTED receipts
- [ ] `parseExecutionError` extracts user-friendly messages

### Event Translation
- [ ] Register every emitted event name in `EVENT_NAMES`
- [ ] Typed interface per event with `componentName` discriminator
- [ ] Bit-packed felt decoders match Cairo layout exactly
- [ ] `translateGameEvent` returns `TranslatedGameEvent[]`

### Game Store
- [ ] Every piece of game state has a setter
- [ ] Collection/entity setters accept functional updaters
- [ ] `disconnect()` resets all state
- [ ] Notifications auto-remove via setTimeout

### Game Director
- [ ] `executeGameAction` is the single write entry point
- [ ] Optimistic updates are reverted on failure
- [ ] WebSocket events update state for other players
- [ ] `actionFailed` counter drives UI reset
- [ ] Initial data fetched on mount
- [ ] `pauseUpdates` flag prevents WS overwriting during animations

### Provider Tree
- [ ] Correct nesting: DynamicConnectorProvider → ControllerProvider → GameDirector → App
- [ ] Each context has a custom hook with a guard (`if (!ctx) throw`)
- [ ] MUI ThemeProvider + SnackbarProvider wrap game content

---

## Adapting This for Your Game

1. **Replace entity types**: Swap `Beast`/`Summit` for your game's entities (characters, tiles, cards, etc.).
2. **Replace action types**: Define your game's actions (move, build, trade, etc.) as the `GameAction` union.
3. **Replace events**: Map your Cairo contract's emitted events to TypeScript interfaces.
4. **Replace WebSocket channels**: Use whatever channel names your API emits.
5. **Scale the store**: Add slices for each feature area (inventory, chat, matchmaking, etc.).

The architecture — project setup → network config → provider → system calls → translation → store → director — stays the same regardless of game genre.
