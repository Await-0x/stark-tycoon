export const VRF_PROVIDER =
  "0x051fea4450da9d6aee758bdeba88b2f665bcbf549d2c61421aa724e9ac0ced8f";

export enum ChainId {
  SN_MAIN = "SN_MAIN",
  SN_SEPOLIA = "SN_SEPOLIA",
}

export interface TokenConfig {
  name: string;
  address: string;
  displayDecimals: number;
  decimals?: number;
  symbol?: string;
}

export interface NetworkConfig {
  chainId: ChainId;
  slot: string;
  preset: string;
  policies: Record<string, unknown>;
  rpcUrl: string;
  toriiUrl: string;
  apiUrl: string;
  wsUrl: string;
  chains: Array<{ rpcUrl: string }>;
  tokens: { erc20: TokenConfig[] };
  gameContract: string;
}

const NETWORKS = {
  SN_MAIN: {
    chainId: ChainId.SN_MAIN,
    slot: "starkcoon",
    rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet/rpc/v0_9",
    torii: "https://api.cartridge.gg/x/starkcoon-torii/torii",
    apiUrl: "https://api.cartridge.gg/x/starkcoon",
    wsUrl: "wss://api.cartridge.gg/x/starkcoon/ws",
  },
  SN_SEPOLIA: {
    chainId: ChainId.SN_SEPOLIA,
    slot: "starkcoon-sepolia",
    rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia/rpc/v0_9",
    torii: "https://api.cartridge.gg/x/starkcoon-sepolia-torii/torii",
    apiUrl: "https://api.cartridge.gg/x/starkcoon-sepolia",
    wsUrl: "wss://api.cartridge.gg/x/starkcoon-sepolia/ws",
  },
};

function buildPolicies(gameAddress: string) {
  return {
    contracts: {
      [gameAddress]: {
        name: "Starkcoon",
        description: "Stark Tycoon game contract",
        methods: [
          {
            name: "Start Game",
            description: "Start a new 20-minute tycoon session",
            entrypoint: "start_game",
          },
          {
            name: "Buy Building",
            description: "Purchase a building from the market",
            entrypoint: "buy_building",
          },
          {
            name: "Upgrade Building",
            description: "Apply a research upgrade to a building",
            entrypoint: "upgrade_building",
          },
          {
            name: "Submit Score",
            description: "Finalize game score after session ends",
            entrypoint: "submit_score",
          },
        ],
      },
      [VRF_PROVIDER]: {
        name: "VRF Provider",
        description: "On-chain randomness for market rotation",
        methods: [
          {
            name: "Request Random",
            description: "Request a random value for market refresh",
            entrypoint: "request_random",
          },
        ],
      },
    },
  };
}

export function getNetworkConfig(
  networkKey: string = import.meta.env.VITE_PUBLIC_CHAIN ?? "SN_MAIN"
): NetworkConfig {
  const network = NETWORKS[networkKey as keyof typeof NETWORKS];
  if (!network) throw new Error(`Network ${networkKey} not found`);

  const gameAddress = import.meta.env.VITE_PUBLIC_GAME_ADDRESS ?? "";
  const policies = buildPolicies(gameAddress);

  return {
    chainId: network.chainId,
    slot: network.slot,
    preset: "starkcoon",
    policies,
    rpcUrl: network.rpcUrl,
    toriiUrl: network.torii,
    apiUrl: network.apiUrl,
    wsUrl: network.wsUrl,
    chains: [{ rpcUrl: network.rpcUrl }],
    tokens: { erc20: [] },
    gameContract: gameAddress,
  };
}
