import { useState, useEffect } from "react";
import { interpolateResources } from "@/types/game";
import { useGameStore } from "@/stores/gameStore";

interface InterpolatedResources {
  capital: number;
  users: number;
  research: number;
  transactions: number;
}

export function useResourceTicker(): InterpolatedResources {
  const gameState = useGameStore((s) => s.gameState);

  const [resources, setResources] = useState<InterpolatedResources>({
    capital: 0,
    users: 0,
    research: 0,
    transactions: 0,
  });

  useEffect(() => {
    if (!gameState) return;

    const tick = () => {
      // Lag 1s behind wall clock so the client never shows values
      // the contract hasn't reached yet (block timestamp trails Date.now).
      const now = Math.floor(Date.now() / 1000) - 1;
      setResources(interpolateResources(gameState, now));
    };

    tick();
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, [gameState]);

  return resources;
}
