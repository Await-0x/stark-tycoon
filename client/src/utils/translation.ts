import type { GameState, Building } from "@/types/game";
import { hash } from "starknet";

// ── Register events emitted by the contract ──
// Dojo model writes are captured as StoreSetRecord events.
// The Game and Building models are the primary state-carrying events.
const EVENT_NAMES = ["StoreSetRecord"] as const;
type SupportedEventName = (typeof EVENT_NAMES)[number];

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

// ── Model selectors for Dojo StoreSetRecord events ──
const GAME_MODEL_SELECTOR = hash.getSelectorFromName("Game");
const GAME_MODEL_NORMALIZED = `0x${BigInt(GAME_MODEL_SELECTOR).toString(16).padStart(64, "0")}`;

const BUILDING_MODEL_SELECTOR = hash.getSelectorFromName("Building");
const BUILDING_MODEL_NORMALIZED = `0x${BigInt(BUILDING_MODEL_SELECTOR).toString(16).padStart(64, "0")}`;

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

export type TranslatedGameEvent = GameStateTranslation | BuildingTranslation;

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
//   tx_multiplier(u16), game_time(u16), market_size(u8), market_packed(u64)
function decodeGameState(
  keys: string[],
  values: string[]
): GameStateTranslation | null {
  if (values.length < 14) return null;

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
      // market_size at values[12], market_packed at values[13]
      marketPacked: hexToBigInt(values[13]),
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

  const eventName = SELECTOR_TO_NAME.get(
    normalizeSelector(event.keys[0])
  );

  if (!eventName) return [];
  if (eventName !== "StoreSetRecord") return [];

  // StoreSetRecord keys layout: [selector, model_selector, ...entity_keys]
  // StoreSetRecord data layout: [...field_values]
  const modelSelector =
    event.keys?.[1] != null ? normalizeSelector(event.keys[1]) : "";
  const entityKeys = (event.keys?.slice(2) ?? []).map((k) =>
    typeof k === "bigint" ? `0x${k.toString(16)}` : String(k)
  );
  const data = event.data ?? [];

  if (modelSelector === GAME_MODEL_NORMALIZED) {
    const result = decodeGameState(entityKeys, data);
    return result ? [result] : [];
  }

  if (modelSelector === BUILDING_MODEL_NORMALIZED) {
    const result = decodeBuildingUpdate(entityKeys, data);
    return result ? [result] : [];
  }

  return [];
};
