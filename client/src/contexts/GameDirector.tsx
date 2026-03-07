import { useSystemCalls } from "@/dojo/useSystemCalls";
import type { TranslatedGameEvent } from "@/utils/translation";
import type {
  GameStateTranslation,
  BuildingTranslation,
} from "@/utils/translation";
import { useGameStore } from "@/stores/gameStore";
import type { GameAction } from "@/types/game";
import { BUILDING_SPECS, UPGRADE_SPECS } from "@/types/game";
import type { Call } from "starknet";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type PropsWithChildren,
} from "react";

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
    setGameId,
    setGameState,
    setBuildings,
    setActionInProgress,
    addNotification,
  } = useGameStore();
  const {
    executeAction,
    startGame,
    buyBuilding,
    upgradeBuilding,
    submitScore,
  } = useSystemCalls();

  const [actionFailed, setActionFailed] = useReducer(
    (x: number) => x + 1,
    0
  );

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
      setGameState(latest.state);
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
        txs.push(
          ...upgradeBuilding(action.gameId, action.positionId, action.upgradeId)
        );
        break;
      }

      case "submit_score":
        setActionInProgress(true);
        txs.push(...submitScore(action.gameId));
        break;
    }

    const events = await executeAction(txs, setActionFailed);

    if (!events) {
      // Revert optimistic updates by not applying — store still has stale state
      // The next get_game_state call will correct it
      setActionFailed();
      addNotification({ type: "error", message: "Action failed" });
      return false;
    }

    applyGameStateEvents(events);
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
