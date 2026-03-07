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
  actionInProgress: boolean;

  // UI state
  selectedPosition: number | null;
  selectedMarketBuildingId: number | null;
  notifications: GameNotification[];

  // Setters
  setGameId: (id: string | null) => void;
  setGameState: (
    state: GameState | null | ((prev: GameState | null) => GameState | null)
  ) => void;
  setBuildings: (
    buildings: Building[] | ((prev: Building[]) => Building[])
  ) => void;
  setActionInProgress: (inProgress: boolean) => void;
  setSelectedPosition: (pos: number | null) => void;
  setSelectedMarketBuildingId: (id: number | null) => void;
  addNotification: (notification: Omit<GameNotification, "id">) => void;
  removeNotification: (id: string) => void;

  // Reset
  disconnect: () => void;
}

export const useGameStore = create<GameStoreState>((set) => ({
  gameId: null,
  gameState: null,
  buildings: [],
  actionInProgress: false,
  selectedPosition: null,
  selectedMarketBuildingId: null,
  notifications: [],

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
  setSelectedPosition: (pos) => set({ selectedPosition: pos }),
  setSelectedMarketBuildingId: (id) => set({ selectedMarketBuildingId: id }),

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
      actionInProgress: false,
      selectedPosition: null,
      selectedMarketBuildingId: null,
      notifications: [],
    }),
}));
