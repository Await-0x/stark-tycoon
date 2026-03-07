import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { useGameTimer } from "@/hooks/useGameTimer";

export function GameTimer() {
  const { formatted, progress, isWarning, isExpired } = useGameTimer();

  const color = isExpired ? "#EF4444" : isWarning ? "#FFB74D" : "#42C6FF";

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "1.1rem",
          color,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "0.05em",
          flexShrink: 0,
          animation: isWarning && !isExpired ? "pulse-glow 1.5s ease-in-out infinite" : "none",
        }}
      >
        {formatted}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          flex: 1,
          height: 4,
          borderRadius: 2,
          bgcolor: "rgba(110, 190, 255, 0.12)",
          "& .MuiLinearProgress-bar": {
            bgcolor: color,
            borderRadius: 2,
            transition: "transform 1s linear",
          },
        }}
      />
    </Box>
  );
}
