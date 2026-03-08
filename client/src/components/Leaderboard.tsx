import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import EmojiEventsRounded from "@mui/icons-material/EmojiEventsRounded";
import { useTokens } from "@provable-games/denshokan-sdk/react";
import { GAME_ADDRESS, DENSHOKAN_GAME_ID } from "@/utils/networkConfig";

interface LeaderboardProps {
  open: boolean;
  onClose: () => void;
}

export function Leaderboard({ open, onClose }: LeaderboardProps) {
  const { data: tokens, isLoading } = useTokens({
    gameAddress: GAME_ADDRESS,
    gameId: DENSHOKAN_GAME_ID,
    gameOver: true,
    limit: 100,
  });

  const sorted = tokens?.data
    .slice()
    .sort((a, b) => b.score - a.score) ?? [];

  const [usernames, setUsernames] = useState<Record<string, string>>({});

  useEffect(() => {
    if (sorted.length === 0) return;
    const addresses = [...new Set(sorted.map((t) => t.owner))].map((a) =>
      a.toLowerCase().replace(/^0x0+/, "0x")
    );
    fetch("https://api.cartridge.gg/accounts/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addresses }),
    })
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, string> = {};
        for (const result of data.results ?? []) {
          for (const addr of result.addresses ?? []) {
            map[addr.toLowerCase()] = result.username;
          }
        }
        setUsernames(map);
      })
      .catch(() => {});
  }, [sorted.length]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "line.0",
          borderRadius: "16px",
          backdropFilter: "blur(12px)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EmojiEventsRounded sx={{ color: "#FFD54F" }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Leaderboard
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={40} sx={{ color: "#42C6FF" }} />
          </Box>
        ) : sorted.length === 0 ? (
          <Typography variant="body2" sx={{ opacity: 0.5, textAlign: "center", py: 4 }}>
            No completed games yet
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {sorted.map((token, i) => (
              <Box
                key={token.tokenId}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 1.5,
                  borderRadius: "12px",
                  bgcolor: i < 3 ? "rgba(255, 213, 79, 0.06)" : "transparent",
                  border: "1px solid",
                  borderColor: i < 3 ? "rgba(255, 213, 79, 0.15)" : "line.0",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    width: 32,
                    textAlign: "center",
                    color: i === 0 ? "#FFD54F" : i === 1 ? "#B0BEC5" : i === 2 ? "#CD7F32" : "text.secondary",
                  }}
                >
                  #{i + 1}
                </Typography>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {usernames[token.owner.toLowerCase().replace(/^0x0+/, "0x")] || `${token.owner.slice(0, 6)}...${token.owner.slice(-4)}`}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#4ADE80",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {token.score.toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
