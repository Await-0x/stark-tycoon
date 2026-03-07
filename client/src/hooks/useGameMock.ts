import { useEffect, useCallback } from "react";
import { useSnackbar } from "notistack";
import {
  BUILDING_SPECS,
  UPGRADE_SPECS,
  TOTAL_BUILDINGS,
  MARKET_SIZE,
  START_CAPITAL,
  START_CAPITAL_PRODUCTION,
  interpolateResources,
  getMarketBuildings,
} from "@/types/game";
import type { GameState, Building } from "@/types/game";
import { useGameStore } from "@/stores/gameStore";
import { preloadBuildingImages } from "@/utils/buildingImages";

function randomBuildingId(): number {
  return Math.floor(Math.random() * TOTAL_BUILDINGS) + 1;
}

function packMarket(ids: number[]): bigint {
  return ids.reduce(
    (acc, id, i) => acc + BigInt(id) * 32n ** BigInt(i),
    0n
  );
}

function generateMarket(): bigint {
  const ids = Array.from({ length: MARKET_SIZE }, () => randomBuildingId());
  return packMarket(ids);
}

function replaceMarketSlot(packed: bigint, slot: number): bigint {
  const ids = getMarketBuildings(packed);
  ids[slot] = randomBuildingId();
  return packMarket(ids);
}

export function useGameMock() {
  const {
    gameState,
    buildings,
    setGameId,
    setGameState,
    setBuildings,
    setSelectedPosition,
    setSelectedMarketBuildingId,
  } = useGameStore();
  const { enqueueSnackbar } = useSnackbar();

  // Initialize mock game on mount
  useEffect(() => {
    preloadBuildingImages();

    const now = Math.floor(Date.now() / 1000);
    const mockState: GameState = {
      mintedAt: now,
      capital: START_CAPITAL,
      users: 0,
      research: 0,
      transactions: 0,
      capitalProduction: START_CAPITAL_PRODUCTION,
      usersProduction: 0,
      researchProduction: 0,
      transactionsProduction: 0,
      usersMultiplier: 0,
      researchMultiplier: 0,
      txMultiplier: 0,
      gameTime: 0,
      marketPacked: generateMarket(),
    };

    setGameId("mock-game-1");
    setGameState(mockState);

    // Place 2 starter buildings
    const starterBuildings: Building[] = [
      { gameId: "mock-game-1", positionId: 6, buildingId: 1, upgradeLevel: 0 },
      { gameId: "mock-game-1", positionId: 18, buildingId: 10, upgradeLevel: 0 },
    ];
    setBuildings(starterBuildings);

    // Apply starter building production
    const spec1 = BUILDING_SPECS[1];
    const spec10 = BUILDING_SPECS[10];
    setGameState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        capitalProduction: prev.capitalProduction + spec1.capitalProduction,
        usersProduction: prev.usersProduction + spec1.usersProduction + spec10.usersProduction,
        researchProduction: prev.researchProduction + spec1.researchProduction + spec10.researchProduction,
        transactionsProduction: prev.transactionsProduction + spec1.txProduction + spec10.txProduction,
        usersMultiplier: prev.usersMultiplier + spec1.usersMultiplier + spec10.usersMultiplier,
        researchMultiplier: prev.researchMultiplier + spec1.researchMultiplier + spec10.researchMultiplier,
        txMultiplier: prev.txMultiplier + spec1.txMultiplier + spec10.txMultiplier,
      };
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const snapshotAndGetState = useCallback((): GameState | null => {
    const state = useGameStore.getState().gameState;
    if (!state) return null;
    const now = Math.floor(Date.now() / 1000);
    const interpolated = interpolateResources(state, now);
    const elapsed = Math.min(
      Math.max(0, now - state.mintedAt - state.gameTime),
      1200 - state.gameTime
    );
    return {
      ...state,
      capital: interpolated.capital,
      users: interpolated.users,
      research: interpolated.research,
      transactions: interpolated.transactions,
      gameTime: state.gameTime + elapsed,
    };
  }, []);

  const mockBuyBuilding = useCallback(
    (buildingId: number, positionId: number) => {
      const snapped = snapshotAndGetState();
      if (!snapped) return;

      const spec = BUILDING_SPECS[buildingId];
      if (!spec) return;

      if (snapped.capital < spec.capitalCost || snapped.users < spec.usersCost) {
        enqueueSnackbar("Not enough resources!", { variant: "error" });
        return;
      }

      // Find which market slot this building was in
      const marketIds = getMarketBuildings(snapped.marketPacked);
      const slotIndex = marketIds.indexOf(buildingId);

      const newState: GameState = {
        ...snapped,
        capital: snapped.capital - spec.capitalCost,
        users: snapped.users - spec.usersCost,
        capitalProduction: snapped.capitalProduction + spec.capitalProduction,
        usersProduction: snapped.usersProduction + spec.usersProduction,
        researchProduction: snapped.researchProduction + spec.researchProduction,
        transactionsProduction: snapped.transactionsProduction + spec.txProduction,
        usersMultiplier: snapped.usersMultiplier + spec.usersMultiplier,
        researchMultiplier: snapped.researchMultiplier + spec.researchMultiplier,
        txMultiplier: snapped.txMultiplier + spec.txMultiplier,
        marketPacked:
          slotIndex >= 0
            ? replaceMarketSlot(snapped.marketPacked, slotIndex)
            : snapped.marketPacked,
      };

      setGameState(newState);
      setBuildings((prev) => [
        ...prev,
        {
          gameId: "mock-game-1",
          positionId,
          buildingId,
          upgradeLevel: 0,
        },
      ]);
      setSelectedMarketBuildingId(null);
      setSelectedPosition(null);
      enqueueSnackbar(`Built ${spec.name}!`, { variant: "success" });
    },
    [snapshotAndGetState, setGameState, setBuildings, setSelectedMarketBuildingId, setSelectedPosition, enqueueSnackbar]
  );

  const mockUpgradeBuilding = useCallback(
    (positionId: number, upgradeIndex: number) => {
      const snapped = snapshotAndGetState();
      if (!snapped) return;

      const currentBuildings = useGameStore.getState().buildings;
      const building = currentBuildings.find((b) => b.positionId === positionId);
      if (!building) return;

      const upgrades = UPGRADE_SPECS[building.buildingId];
      if (!upgrades || upgradeIndex >= upgrades.length) return;

      const upgrade = upgrades[upgradeIndex];
      if (snapped.research < upgrade.researchCost) {
        enqueueSnackbar("Not enough research!", { variant: "error" });
        return;
      }

      // Required upgrade level: upgradeIndex + 1
      if (building.upgradeLevel < upgradeIndex) {
        enqueueSnackbar("Apply previous upgrade first!", { variant: "warning" });
        return;
      }
      if (building.upgradeLevel > upgradeIndex) {
        enqueueSnackbar("Already upgraded!", { variant: "info" });
        return;
      }

      const newState: GameState = {
        ...snapped,
        research: snapped.research - upgrade.researchCost,
        capitalProduction: snapped.capitalProduction + upgrade.capitalProduction,
        usersProduction: snapped.usersProduction + upgrade.usersProduction,
        researchProduction: snapped.researchProduction + upgrade.researchProduction,
        transactionsProduction: snapped.transactionsProduction + upgrade.txProduction,
        usersMultiplier: snapped.usersMultiplier + upgrade.usersMultiplier,
        researchMultiplier: snapped.researchMultiplier + upgrade.researchMultiplier,
        txMultiplier: snapped.txMultiplier + upgrade.txMultiplier,
      };

      setGameState(newState);
      setBuildings((prev) =>
        prev.map((b) =>
          b.positionId === positionId
            ? { ...b, upgradeLevel: upgradeIndex + 1 }
            : b
        )
      );
      enqueueSnackbar(`Applied ${upgrade.name}!`, { variant: "success" });
    },
    [snapshotAndGetState, setGameState, setBuildings, enqueueSnackbar]
  );

  return {
    gameState,
    buildings,
    mockBuyBuilding,
    mockUpgradeBuilding,
  };
}
