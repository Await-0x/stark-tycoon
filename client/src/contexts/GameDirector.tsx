import { useSystemCalls, fetchGameState } from "@/dojo/useSystemCalls";
import type { TranslatedGameEvent } from "@/utils/translation";
import type {
  GameStateTranslation,
  BuildingTranslation,
  BoardTranslation,
} from "@/utils/translation";
import { useGameStore } from "@/stores/gameStore";
import type { GameAction, SubmitScoreAction } from "@/types/game";
import { BUILDING_SPECS, UPGRADE_SPECS, GAME_DURATION, getMarketBuildings, unpackMintedAt, deriveTileBonus } from "@/types/game";
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

const isBoardEvent = (
  e: TranslatedGameEvent
): e is BoardTranslation => e.componentName === "Board";

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
    setBoardSeed,
    setActionInProgress,
    setGamePhase,
    setFinalScore,
    setLoadingMarketSlot,
    setLoadingMarketRefresh,
    setSelectedMarketBuildingId,
    setSelectedPosition,
    addNotification,
  } = useGameStore();
  const {
    executeAction,
    startGame,
    buyBuilding,
    upgradeBuilding,
    destroyBuilding,
    refreshMarket,
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
      setBoardSeed(result.boardSeed);

      if (result.gameState.gameTime >= GAME_DURATION) {
        setGamePhase("ended");
        setFinalScore(result.gameState.transactions);
      }
    };

    recover();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

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

    const boardEvents = events.filter(isBoardEvent);
    if (boardEvents.length > 0) {
      const latest = boardEvents[boardEvents.length - 1];
      setBoardSeed(latest.seed);
    }
  };

  // ── Central action dispatcher ──
  const executeGameAction = async (action: GameAction): Promise<boolean> => {
    const txs: Call[] = [];
    const prevGameState = useGameStore.getState().gameState;
    const prevBuildings = useGameStore.getState().buildings;
    // Only lock UI for actions that must be sequential
    const needsLock = action.type === "upgrade_building" || action.type === "start_game";
    if (needsLock) setActionInProgress(true);

    switch (action.type) {
      case "start_game":
        txs.push(...startGame(action.playerName));
        break;

      case "buy_building": {
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
        // Optimistic: place building on board (upsert in case consumed empty tile exists)
        setBuildings((prev) => {
          const idx = prev.findIndex(
            (b) => b.gameId === action.gameId && b.positionId === action.positionId
          );
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], buildingId: action.buildingId, upgradeLevel: 0, bonusConsumed: 1 };
            return updated;
          }
          return [...prev, { gameId: action.gameId, positionId: action.positionId, buildingId: action.buildingId, upgradeLevel: 0, bonusConsumed: 1 }];
        });

        // Optimistic: apply tile placement bonus
        const boardSeed = useGameStore.getState().boardSeed;
        const existingEntry = prevBuildings.find(
          (b) => b.gameId === action.gameId && b.positionId === action.positionId
        );
        if (boardSeed != null && existingEntry?.bonusConsumed !== 1) {
          const bonus = deriveTileBonus(boardSeed, action.positionId);
          if (bonus.bonusType !== 0) {
            setGameState((prev) => {
              if (!prev) return prev;
              switch (bonus.bonusType) {
                case 1: return { ...prev, capitalProduction: prev.capitalProduction + bonus.bonusValue };
                case 2: return { ...prev, usersProduction: prev.usersProduction + bonus.bonusValue };
                case 3: return { ...prev, researchProduction: prev.researchProduction + bonus.bonusValue };
                case 4: return { ...prev, capital: prev.capital + bonus.bonusValue };
                case 5: return { ...prev, users: prev.users + bonus.bonusValue };
                case 6: return { ...prev, research: prev.research + bonus.bonusValue };
                case 7: return { ...prev, transactions: prev.transactions + bonus.bonusValue };
                default: return prev;
              }
            });
          }
        }

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

      case "destroy_building": {
        // Optimistic: zero building on board (preserve bonusConsumed)
        setBuildings((prev) =>
          prev.map((b) =>
            b.gameId === action.gameId && b.positionId === action.positionId
              ? { ...b, buildingId: 0, upgradeLevel: 0 }
              : b
          )
        );
        // Optimistic: subtract production (base + upgrades)
        const bld = prevBuildings.find(
          (b) => b.gameId === action.gameId && b.positionId === action.positionId
        );
        if (bld) {
          const dSpec = BUILDING_SPECS[bld.buildingId];
          if (dSpec) {
            let capProd = dSpec.capitalProduction;
            let usrProd = dSpec.usersProduction;
            let resProd = dSpec.researchProduction;
            let txProd = dSpec.txProduction;
            let usrMul = dSpec.usersMultiplier;
            let resMul = dSpec.researchMultiplier;
            let txMul = dSpec.txMultiplier;
            const upgrades = UPGRADE_SPECS[bld.buildingId];
            if (upgrades) {
              for (let i = 0; i < bld.upgradeLevel; i++) {
                capProd += upgrades[i].capitalProduction;
                usrProd += upgrades[i].usersProduction;
                resProd += upgrades[i].researchProduction;
                txProd += upgrades[i].txProduction;
                usrMul += upgrades[i].usersMultiplier;
                resMul += upgrades[i].researchMultiplier;
                txMul += upgrades[i].txMultiplier;
              }
            }
            setGameState((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                capitalProduction: prev.capitalProduction - capProd,
                usersProduction: prev.usersProduction - usrProd,
                researchProduction: prev.researchProduction - resProd,
                transactionsProduction: prev.transactionsProduction - txProd,
                usersMultiplier: prev.usersMultiplier - usrMul,
                researchMultiplier: prev.researchMultiplier - resMul,
                txMultiplier: prev.txMultiplier - txMul,
              };
            });
          }
        }
        setSelectedPosition(null);
        txs.push(...destroyBuilding(action.gameId, action.positionId));
        break;
      }

      case "refresh_market": {
        // Optimistic: deduct cost
        const refreshCount = prevGameState?.refreshCount ?? 0;
        const refreshCost = refreshCount * 500;
        if (refreshCost > 0) {
          setGameState((prev) => {
            if (!prev) return prev;
            return { ...prev, capital: prev.capital - refreshCost };
          });
        }
        setLoadingMarketRefresh(true);
        txs.push(...refreshMarket(action.gameId));
        break;
      }

      case "submit_score":
        setGamePhase("submitting");
        txs.push(...submitScore(action.gameId));
        break;
    }

    const isSubmit = action.type === "submit_score";
    const events = await executeAction(txs, setActionFailed, isSubmit ? { silent: true } : undefined);

    if (!events) {
      // Retry submit_score up to 3 times with 3s delay (block timestamp may lag)
      if (isSubmit) {
        const attempt = (action as SubmitScoreAction & { _retry?: number })._retry ?? 0;
        if (attempt < 3) {
          await new Promise((r) => setTimeout(r, 3000));
          return executeGameAction({ ...action, _retry: attempt + 1 } as GameAction);
        }
        setGamePhase("playing");
      }
      if (prevGameState) setGameState(prevGameState);
      setBuildings(prevBuildings);
      setLoadingMarketSlot(null);
      setLoadingMarketRefresh(false);
      if (needsLock) setActionInProgress(false);
      setActionFailed();
      if (!isSubmit) {
        addNotification({ type: "error", message: "Action failed" });
      }
      return false;
    }

    applyGameStateEvents(events);
    setLoadingMarketSlot(null);
    setLoadingMarketRefresh(false);
    if (needsLock) setActionInProgress(false);

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
    } else if (action.type === "destroy_building") {
      addNotification({ type: "success", message: "Building destroyed" });
    } else if (action.type === "refresh_market") {
      addNotification({ type: "success", message: "Market refreshed!" });
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
