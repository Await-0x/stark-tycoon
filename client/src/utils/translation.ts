import type { GameState, Building } from "@/types/game";
import { hash } from "starknet";

// ── Register events emitted by the contract ──
// Dojo model writes are captured as StoreSetRecord events.
// The Game and Building models are the primary state-carrying events.
const STORE_SET_RECORD_SELECTOR = (() => {
  const sel = hash.getSelectorFromName("StoreSetRecord");
  return `0x${BigInt(sel).toString(16).padStart(64, "0")}`;
})();

const normalizeSelector = (sel: string | bigint): string => {
  const v = typeof sel === "string" ? BigInt(sel) : sel;
  return `0x${v.toString(16).padStart(64, "0")}`;
};

// ── Model selectors from manifest (namespaced by Dojo) ──
const GAME_MODEL_NORMALIZED = normalizeSelector("0x00210d04d219dd4aa700834162315f55ec5a1014afe479ada396a4c702307683");
const BUILDING_MODEL_NORMALIZED = normalizeSelector("0x070449f70d2647d4d914350435ed6702dca99bc46cb55f81de792de4cdfeb301");
const BOARD_MODEL_NORMALIZED = normalizeSelector("0x06f312b28cca0b15dc92182ef22763f751285892c73b969b6cc15f6b10f7c604");

// ── Translated event types ──

export interface GameStateTranslation {
  componentName: "GameState";
  gameId: string;
  state: GameState;
}

export interface BuildingTranslation {
  componentName: "Building";
  building: Building;
}

export interface BoardTranslation {
  componentName: "Board";
  gameId: string;
  seed: bigint;
}

export type TranslatedGameEvent = GameStateTranslation | BuildingTranslation | BoardTranslation;

// ── Helpers ──

function hexToNumber(hex: string | undefined): number {
  return Number(BigInt(hex || "0x0"));
}

function hexToBigInt(hex: string | undefined): bigint {
  return BigInt(hex || "0x0");
}

// ── Decode Game model from StoreSetRecord data ──
// Layout mirrors the Cairo Game model fields:
//   game_id, capital(u32), users(u32), research(u32), transactions(u32),
//   capital_production(u16), users_production(u16), research_production(u16),
//   transactions_production(u16), users_multiplier(u16), research_multiplier(u16),
//   tx_multiplier(u16), game_time(u16), market_size(u8), market_packed(u32)
function decodeGameState(
  keys: string[],
  values: string[]
): GameStateTranslation | null {
  if (values.length < 15) return null;

  return {
    componentName: "GameState",
    gameId: keys[0] || "0x0",
    state: {
      mintedAt: 0, // extracted from token ID externally
      capital: hexToNumber(values[0]),
      users: hexToNumber(values[1]),
      research: hexToNumber(values[2]),
      transactions: hexToNumber(values[3]),
      capitalProduction: hexToNumber(values[4]),
      usersProduction: hexToNumber(values[5]),
      researchProduction: hexToNumber(values[6]),
      transactionsProduction: hexToNumber(values[7]),
      usersMultiplier: hexToNumber(values[8]),
      researchMultiplier: hexToNumber(values[9]),
      txMultiplier: hexToNumber(values[10]),
      gameTime: hexToNumber(values[11]),
      // market_size at values[12], market_packed at values[13], refresh_count at values[14]
      marketPacked: hexToBigInt(values[13]),
      refreshCount: hexToNumber(values[14]),
    },
  };
}

// ── Decode Building model from StoreSetRecord data ──
// Layout: game_id, position_id (keys), building_id(u8), upgrade_level(u8) (values)
function decodeBuildingUpdate(
  keys: string[],
  values: string[]
): BuildingTranslation | null {
  if (keys.length < 2 || values.length < 2) return null;

  return {
    componentName: "Building",
    building: {
      gameId: keys[0] || "0x0",
      positionId: hexToNumber(keys[1]),
      buildingId: hexToNumber(values[0]),
      upgradeLevel: hexToNumber(values[1]),
    },
  };
}

// ── Decode Board model from StoreSetRecord data ──
// Layout: game_id (key), seed(u64) (value)
function decodeBoardState(
  keys: string[],
  values: string[]
): BoardTranslation | null {
  if (values.length < 1) return null;

  return {
    componentName: "Board",
    gameId: keys[0] || "0x0",
    seed: hexToBigInt(values[0]),
  };
}

// ── Main dispatcher ──

type StarknetEventLike = {
  keys?: Array<string | bigint>;
  data?: string[];
  from_address?: string;
};

export const translateGameEvent = (
  event: StarknetEventLike,
  _accountAddress: string
): TranslatedGameEvent[] => {
  if (!event.keys?.[0]) return [];

  const eventSelector = normalizeSelector(event.keys[0]);
  if (eventSelector !== STORE_SET_RECORD_SELECTOR) return [];

  // StoreSetRecord keys layout: [event_selector, model_selector, ...entity_key_hashes]
  // StoreSetRecord data layout: [keys_len, ...entity_keys, values_len, ...field_values]
  const modelSelector =
    event.keys?.[1] != null ? normalizeSelector(event.keys[1]) : "";
  const data = event.data ?? [];

  // Parse data: extract entity keys and field values
  const keysLen = Number(BigInt(data[0] || "0x0"));
  const entityKeys = data.slice(1, 1 + keysLen);
  const valuesLen = Number(BigInt(data[1 + keysLen] || "0x0"));
  const values = data.slice(2 + keysLen, 2 + keysLen + valuesLen);

  if (modelSelector === GAME_MODEL_NORMALIZED) {
    const result = decodeGameState(entityKeys, values);
    return result ? [result] : [];
  }

  if (modelSelector === BUILDING_MODEL_NORMALIZED) {
    const result = decodeBuildingUpdate(entityKeys, values);
    return result ? [result] : [];
  }

  if (modelSelector === BOARD_MODEL_NORMALIZED) {
    const result = decodeBoardState(entityKeys, values);
    return result ? [result] : [];
  }

  return [];
};
