import { useMemo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import EmojiEventsRounded from "@mui/icons-material/EmojiEventsRounded";
import SwapHorizRounded from "@mui/icons-material/SwapHorizRounded";
import XIcon from "@mui/icons-material/X";
import { useTokens } from "@provable-games/denshokan-sdk/react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "@/stores/gameStore";
import { GAME_ADDRESS } from "@/utils/networkConfig";
import { GlassPanel } from "./GlassPanel";

export function GameEndOverlay() {
  const gamePhase = useGameStore((s) => s.gamePhase);
  const finalScore = useGameStore((s) => s.finalScore);
  const disconnect = useGameStore((s) => s.disconnect);
  const navigate = useNavigate();

  // Fetch completed games to compute rank (only when game ended)
  const { data: tokens, isLoading: rankLoading } = useTokens(
    gamePhase === "ended"
      ? { gameAddress: GAME_ADDRESS, gameOver: true, limit: 100 }
      : undefined
  );

  const rank = useMemo(() => {
    if (!tokens?.data || finalScore === null) return null;
    const higher = tokens.data.filter((t) => t.score > finalScore).length;
    return higher + 1;
  }, [tokens, finalScore]);

  if (gamePhase === "playing") return null;

  const handleShareOnX = () => {
    const rankText = rank ? ` Ranked #${rank}!` : "";
    const text = `I scored ${finalScore ?? 0} transactions in Stark Tycoon!${rankText}`;
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const handlePlayAgain = () => {
    disconnect();
    navigate("/");
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1300,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        bgcolor: "rgba(7, 10, 18, 0.92)",
        backdropFilter: "blur(8px)",
      }}
    >
      {gamePhase === "submitting" && (
        <>
          <CircularProgress size={56} sx={{ color: "#42C6FF" }} />
          <Typography
            variant="h6"
            sx={{
              background: "linear-gradient(135deg, #42C6FF, #8B5CF6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 600,
            }}
          >
            Submitting score...
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.5 }}>
            Confirming transaction on Starknet
          </Typography>
        </>
      )}

      {gamePhase === "ended" && (
        <GlassPanel
          sx={{
            maxWidth: 400,
            width: "90%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            p: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              background: "linear-gradient(135deg, #42C6FF, #8B5CF6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Game Over
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SwapHorizRounded sx={{ color: "#4ADE80", fontSize: 32 }} />
              <Typography
                variant="h3"
                sx={{ color: "#4ADE80", fontWeight: 700 }}
              >
                {finalScore ?? 0}
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              Transactions
            </Typography>
          </Box>

          {rankLoading ? (
            <CircularProgress size={24} sx={{ color: "#FFD54F" }} />
          ) : rank !== null ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EmojiEventsRounded
                sx={{
                  color: rank === 1 ? "#FFD54F" : rank === 2 ? "#B0BEC5" : rank === 3 ? "#CD7F32" : "text.secondary",
                  fontSize: 28,
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: rank === 1 ? "#FFD54F" : rank === 2 ? "#B0BEC5" : rank === 3 ? "#CD7F32" : "text.primary",
                }}
              >
                Rank #{rank}
              </Typography>
            </Box>
          ) : null}

          <Button
            variant="outlined"
            fullWidth
            startIcon={<XIcon />}
            onClick={handleShareOnX}
          >
            Share
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={handlePlayAgain}
          >
            Play Again
          </Button>
        </GlassPanel>
      )}
    </Box>
  );
}
