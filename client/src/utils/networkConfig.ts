import manifest from "../../manifest.json";
import { getContractByName } from "@dojoengine/core";

export const VRF_PROVIDER =
  "0x051fea4450da9d6aee758bdeba88b2f665bcbf549d2c61421aa724e9ac0ced8f";

export enum ChainId {
  SN_MAIN = "SN_MAIN",
  SN_SEPOLIA = "SN_SEPOLIA",
}

export interface NetworkConfig {
  chainId: ChainId;
  manifest: any;
  namespace: string;
  policies: Record<string, unknown>;
  rpcUrl: string;
  chains: Array<{ rpcUrl: string }>;
  gameAddress: string;
}

const NETWORKS = {
  SN_SEPOLIA: {
    chainId: ChainId.SN_SEPOLIA,
    manifest,
    namespace: "ST_0_0_2",
    rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia",
  },
};

function buildPolicies(gameAddress: string) {
  return {
    contracts: {
      [gameAddress]: {
        name: "Starktycoon",
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
            name: "Refresh Market",
            description: "Refresh all market buildings",
            entrypoint: "refresh_market",
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

// Pre-resolved game address for use outside React (e.g. denshokan queries)
const _resolved = (() => {
  const network = NETWORKS.SN_SEPOLIA;
  return getContractByName(network.manifest, network.namespace, "starktycoon")?.address ?? "";
})();
export const GAME_ADDRESS = _resolved;

export function getNetworkConfig(
  networkKey: string = ChainId.SN_SEPOLIA
): NetworkConfig {
  const network = NETWORKS[networkKey as keyof typeof NETWORKS];
  if (!network) throw new Error(`Network ${networkKey} not found`);

  const gameAddress = getContractByName(network.manifest, network.namespace, "starktycoon")?.address
  const policies = buildPolicies(gameAddress);

  return {
    chainId: network.chainId,
    manifest: network.manifest,
    namespace: network.namespace,
    policies,
    rpcUrl: network.rpcUrl,
    chains: [{ rpcUrl: network.rpcUrl }],
    gameAddress: gameAddress,
  };
}
