import { useSystemCalls } from "@/dojo/useSystemCalls";
import type { TranslatedGameEvent } from "@/utils/translation";
import type {
  GameStateTranslation,
  BuildingTranslation,
} from "@/utils/translation";
import { useGameStore } from "@/stores/gameStore";
import type { GameAction } from "@/types/game";
import { BUILDING_SPECS, UPGRADE_SPECS, GAME_DURATION, getMarketBuildings, unpackMintedAt } from "@/types/game";
import type { Call } from "starknet";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type PropsWithChildren,
} from "react";
import { useSearchParams } from "react-router-dom";

// ── Type guards ──
const isGameStateEvent = (
  e: TranslatedGameEvent
): e is GameStateTranslation => e.componentName === "GameState";

const isBuildingEvent = (
  e: TranslatedGameEvent
): e is BuildingTranslation => e.componentName === "Building";

interface GameDirectorContextType {
  executeGameAction: (action: GameAction) => Promise<boolean>;
  actionFailed: number;
}

const GameDirectorContext = createContext<GameDirectorContextType>(
  {} as GameDirectorContextType
);

export const GameDirector = ({ children }: PropsWithChildren) => {
  const {
    gameId,
    setGameId,
    setGameState,
    setBuildings,
    setActionInProgress,
    setGamePhase,
    setFinalScore,
    setLoadingMarketSlot,
    setSelectedMarketBuildingId,
    setSelectedPosition,
    addNotification,
  } = useGameStore();
  const {
    executeAction,
    fetchGameState,
    startGame,
    buyBuilding,
    upgradeBuilding,
    submitScore,
  } = useSystemCalls();
  const [searchParams] = useSearchParams();

  const [actionFailed, setActionFailed] = useReducer(
    (x: number) => x + 1,
    0
  );

  // Set gameId from URL params if not already set
  useEffect(() => {
    const urlGameId = searchParams.get("id");
    if (urlGameId && !gameId) {
      setGameId(urlGameId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Recover game state from RPC on page refresh
  useEffect(() => {
    const currentGameState = useGameStore.getState().gameState;
    if (!gameId || currentGameState) return;

    const recover = async () => {
      const result = await fetchGameState(gameId);
      if (!result) return;

      const mintedAt = unpackMintedAt(gameId);
      setGameState({ ...result.gameState, mintedAt });
      setBuildings(result.buildings);

      if (result.gameState.gameTime >= GAME_DURATION) {
        setGamePhase("ended");
        setFinalScore(result.gameState.transactions);
      }
    };

    recover();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  // Reset UI loading on failure
  useEffect(() => {
    setActionInProgress(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionFailed]);

  // ── Apply game state events to store ──
  const applyGameStateEvents = (events: TranslatedGameEvent[]) => {
    const gameStateEvents = events.filter(isGameStateEvent);
    if (gameStateEvents.length > 0) {
      const latest = gameStateEvents[gameStateEvents.length - 1];
      const existingMintedAt = useGameStore.getState().gameState?.mintedAt ?? 0;
      setGameState({ ...latest.state, mintedAt: existingMintedAt });
      setGameId(latest.gameId);
    }

    const buildingEvents = events.filter(isBuildingEvent);
    if (buildingEvents.length > 0) {
      setBuildings((prev) => {
        const updated = [...prev];
        for (const evt of buildingEvents) {
          const idx = updated.findIndex(
            (b) =>
              b.gameId === evt.building.gameId &&
              b.positionId === evt.building.positionId
          );
          if (idx >= 0) {
            updated[idx] = evt.building;
          } else {
            updated.push(evt.building);
          }
        }
        return updated;
      });
    }
  };

  // ── Central action dispatcher ──
  const executeGameAction = async (action: GameAction): Promise<boolean> => {
    const txs: Call[] = [];
    const prevGameState = useGameStore.getState().gameState;
    const prevBuildings = useGameStore.getState().buildings;

    switch (action.type) {
      case "start_game":
        setActionInProgress(true);
        txs.push(...startGame(action.playerName));
        break;

      case "buy_building": {
        setActionInProgress(true);
        // Optimistic: deduct costs locally
        const spec = BUILDING_SPECS[action.buildingId];
        if (spec) {
          setGameState((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              capital: prev.capital - spec.capitalCost,
              users: prev.users - spec.usersCost,
            };
          });
        }
        // Optimistic: place building on board
        setBuildings((prev) => [
          ...prev,
          { gameId: action.gameId, positionId: action.positionId, buildingId: action.buildingId, upgradeLevel: 0 },
        ]);

        // Clear selections
        setSelectedMarketBuildingId(null);
        setSelectedPosition(null);

        // Mark purchased market slot as loading (can't predict VRF replacement)
        const currentState = useGameStore.getState().gameState;
        if (currentState) {
          const marketIds = getMarketBuildings(currentState.marketPacked);
          const slotIndex = marketIds.indexOf(action.buildingId);
          if (slotIndex >= 0) setLoadingMarketSlot(slotIndex);
        }

        txs.push(
          ...buyBuilding(action.gameId, action.buildingId, action.positionId)
        );
        break;
      }

      case "upgrade_building": {
        setActionInProgress(true);
        // Optimistic: deduct research cost
        const building = useGameStore
          .getState()
          .buildings.find(
            (b) =>
              b.gameId === action.gameId &&
              b.positionId === action.positionId
          );
        if (building) {
          const upgrades = UPGRADE_SPECS[building.buildingId];
          const upgrade = upgrades?.[action.upgradeId - 1];
          if (upgrade) {
            setGameState((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                research: prev.research - upgrade.researchCost,
              };
            });
          }
        }
        // Optimistic: bump upgrade level
        setBuildings((prev) =>
          prev.map((b) =>
            b.gameId === action.gameId && b.positionId === action.positionId
              ? { ...b, upgradeLevel: action.upgradeId }
              : b
          )
        );

        txs.push(
          ...upgradeBuilding(action.gameId, action.positionId, action.upgradeId)
        );
        break;
      }

      case "submit_score":
        setActionInProgress(true);
        setGamePhase("submitting");
        txs.push(...submitScore(action.gameId));
        break;
    }

    const events = await executeAction(txs, setActionFailed);

    if (!events) {
      if (prevGameState) setGameState(prevGameState);
      setBuildings(prevBuildings);
      setLoadingMarketSlot(null);
      if (action.type === "submit_score") setGamePhase("playing");
      setActionFailed();
      addNotification({ type: "error", message: "Action failed" });
      return false;
    }

    applyGameStateEvents(events);
    setLoadingMarketSlot(null);
    setActionInProgress(false);

    if (action.type === "start_game") {
      addNotification({ type: "success", message: "Game started!" });
    } else if (action.type === "buy_building") {
      const spec = BUILDING_SPECS[action.buildingId];
      addNotification({
        type: "success",
        message: `Built ${spec?.name ?? "building"}`,
      });
    } else if (action.type === "upgrade_building") {
      addNotification({ type: "success", message: "Upgrade applied!" });
    } else if (action.type === "submit_score") {
      const finalState = useGameStore.getState().gameState;
      setFinalScore(finalState?.transactions ?? 0);
      setGamePhase("ended");
      addNotification({ type: "success", message: "Score submitted!" });
    }

    return true;
  };

  return (
    <GameDirectorContext.Provider value={{ executeGameAction, actionFailed }}>
      {children}
    </GameDirectorContext.Provider>
  );
};

export const useGameDirector = () => useContext(GameDirectorContext);
