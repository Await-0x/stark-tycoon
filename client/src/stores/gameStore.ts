import { create } from "zustand";
import type { GameState, Building } from "@/types/game";

export interface GameNotification {
  id: string;
  type: string;
  value?: number | string;
  message?: string;
}

interface GameStoreState {
  // Core game state
  gameId: string | null;
  gameState: GameState | null;
  buildings: Building[];
  boardSeed: bigint | null;
  actionInProgress: boolean;
  gamePhase: "playing" | "submitting" | "ended";
  finalScore: number | null;

  // UI state
  selectedPosition: number | null;
  selectedMarketBuildingId: number | null;
  loadingMarketSlot: number | null;
  loadingMarketRefresh: boolean;
  notifications: GameNotification[];

  // Setters
  setBoardSeed: (seed: bigint | null) => void;
  setGameId: (id: string | null) => void;
  setGameState: (
    state: GameState | null | ((prev: GameState | null) => GameState | null)
  ) => void;
  setBuildings: (
    buildings: Building[] | ((prev: Building[]) => Building[])
  ) => void;
  setActionInProgress: (inProgress: boolean) => void;
  setGamePhase: (phase: "playing" | "submitting" | "ended") => void;
  setFinalScore: (score: number | null) => void;
  setSelectedPosition: (pos: number | null) => void;
  setSelectedMarketBuildingId: (id: number | null) => void;
  setLoadingMarketSlot: (slot: number | null) => void;
  setLoadingMarketRefresh: (loading: boolean) => void;
  addNotification: (notification: Omit<GameNotification, "id">) => void;
  removeNotification: (id: string) => void;

  // Reset
  disconnect: () => void;
}

export const useGameStore = create<GameStoreState>((set) => ({
  gameId: null,
  gameState: null,
  buildings: [],
  boardSeed: null,
  actionInProgress: false,
  gamePhase: "playing",
  finalScore: null,
  selectedPosition: null,
  selectedMarketBuildingId: null,
  loadingMarketSlot: null,
  loadingMarketRefresh: false,
  notifications: [],

  setBoardSeed: (seed) => set({ boardSeed: seed }),
  setGameId: (id) => set({ gameId: id }),

  setGameState: (state) =>
    set((s) => ({
      gameState: typeof state === "function" ? state(s.gameState) : state,
    })),

  setBuildings: (buildings) =>
    set((s) => ({
      buildings:
        typeof buildings === "function" ? buildings(s.buildings) : buildings,
    })),

  setActionInProgress: (inProgress) => set({ actionInProgress: inProgress }),
  setGamePhase: (phase) => set({ gamePhase: phase }),
  setFinalScore: (score) => set({ finalScore: score }),
  setSelectedPosition: (pos) => set({ selectedPosition: pos }),
  setSelectedMarketBuildingId: (id) => set({ selectedMarketBuildingId: id }),
  setLoadingMarketSlot: (slot) => set({ loadingMarketSlot: slot }),
  setLoadingMarketRefresh: (loading) => set({ loadingMarketRefresh: loading }),

  addNotification: (notification) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    set((s) => ({
      notifications: [...s.notifications, { ...notification, id }],
    }));
    setTimeout(() => {
      set((s) => ({
        notifications: s.notifications.filter((n) => n.id !== id),
      }));
    }, 3000);
  },

  removeNotification: (id) =>
    set((s) => ({
      notifications: s.notifications.filter((n) => n.id !== id),
    })),

  disconnect: () =>
    set({
      gameId: null,
      gameState: null,
      buildings: [],
      boardSeed: null,
      actionInProgress: false,
      gamePhase: "playing",
      finalScore: null,
      selectedPosition: null,
      selectedMarketBuildingId: null,
      loadingMarketSlot: null,
      loadingMarketRefresh: false,
      notifications: [],
    }),
}));
