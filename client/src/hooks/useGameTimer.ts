import { useState, useEffect, useCallback } from "react";
import { GAME_DURATION } from "@/types/game";
import { useGameStore } from "@/stores/gameStore";

interface GameTimerResult {
  remaining: number;
  formatted: string;
  progress: number;
  isWarning: boolean;
  isExpired: boolean;
}

export function useGameTimer(): GameTimerResult {
  const gameState = useGameStore((s) => s.gameState);

  const calcRemaining = useCallback(() => {
    if (!gameState) return GAME_DURATION;
    // Lag 1s behind wall clock so the timer expires only after the
    // contract considers the game over (block timestamp trails Date.now).
    const elapsed = Math.floor(Date.now() / 1000) - 1 - gameState.mintedAt;
    return Math.max(0, GAME_DURATION - elapsed);
  }, [gameState]);

  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    setRemaining(calcRemaining());
    const id = setInterval(() => setRemaining(calcRemaining()), 1000);
    return () => clearInterval(id);
  }, [calcRemaining]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const formatted = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  const progress = ((GAME_DURATION - remaining) / GAME_DURATION) * 100;

  return {
    remaining,
    formatted,
    progress,
    isWarning: remaining > 0 && remaining <= 120,
    isExpired: remaining <= 0,
  };
}
