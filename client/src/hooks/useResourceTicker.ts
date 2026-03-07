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
      const now = Math.floor(Date.now() / 1000);
      setResources(interpolateResources(gameState, now));
    };

    tick();
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, [gameState]);

  return resources;
}
