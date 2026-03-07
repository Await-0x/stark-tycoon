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
import { GAME_ADDRESS } from "@/utils/networkConfig";

interface LeaderboardProps {
  open: boolean;
  onClose: () => void;
}

export function Leaderboard({ open, onClose }: LeaderboardProps) {
  const { data: tokens, isLoading } = useTokens({
    gameAddress: GAME_ADDRESS,
    gameOver: true,
    limit: 50,
  });

  const sorted = tokens?.data
    .slice()
    .sort((a, b) => b.score - a.score) ?? [];

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
                    {token.playerName || `${token.owner.slice(0, 6)}...${token.owner.slice(-4)}`}
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
