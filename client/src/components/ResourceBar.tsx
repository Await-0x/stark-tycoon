import type { ReactElement } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AccountBalanceRounded from "@mui/icons-material/AccountBalanceRounded";
import GroupRounded from "@mui/icons-material/GroupRounded";
import ScienceRounded from "@mui/icons-material/ScienceRounded";
import SwapHorizRounded from "@mui/icons-material/SwapHorizRounded";
import { useResourceTicker } from "@/hooks/useResourceTicker";
import { useGameStore } from "@/stores/gameStore";
import { GlassPanel } from "./GlassPanel";

const RESOURCE_CONFIG: { key: "capital" | "users" | "research" | "transactions"; label: string; icon: ReactElement; color: string }[] = [
  { key: "capital", label: "Capital", icon: <AccountBalanceRounded sx={{ fontSize: 18 }} />, color: "#FFD54F" },
  { key: "users", label: "Users", icon: <GroupRounded sx={{ fontSize: 18 }} />, color: "#42C6FF" },
  { key: "research", label: "Research", icon: <ScienceRounded sx={{ fontSize: 18 }} />, color: "#8B5CF6" },
  { key: "transactions", label: "Transactions (score)", icon: <SwapHorizRounded sx={{ fontSize: 18 }} />, color: "#4ADE80" },
];

function getProductionRate(
  key: string,
  gameState: { capitalProduction: number; usersProduction: number; researchProduction: number; transactionsProduction: number; usersMultiplier: number; researchMultiplier: number; txMultiplier: number }
): string {
  switch (key) {
    case "capital":
      return `+${gameState.capitalProduction}/s`;
    case "users":
      return `+${Math.floor((gameState.usersProduction * (100 + gameState.usersMultiplier)) / 100)}/s`;
    case "research":
      return `+${Math.floor((gameState.researchProduction * (100 + gameState.researchMultiplier)) / 100)}/s`;
    case "transactions":
      return `+${Math.floor((gameState.transactionsProduction * (100 + gameState.txMultiplier)) / 100)}/s`;
    default:
      return "+0/s";
  }
}

export function ResourceBar({ compact = false }: { compact?: boolean }) {
  const resources = useResourceTicker();
  const gameState = useGameStore((s) => s.gameState);

  if (compact) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          px: 1,
          py: 0.75,
          borderBottom: "1px solid",
          borderColor: "line.0",
          bgcolor: "rgba(7, 10, 18, 0.6)",
          flexShrink: 0,
        }}
      >
        {RESOURCE_CONFIG.map((res) => (
          <Box key={res.key} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ color: res.color, display: "flex", lineHeight: 0, "& svg": { fontSize: 14 } }}>
              {res.icon}
            </Box>
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: res.color,
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
              }}
            >
              {Math.floor(resources[res.key]).toLocaleString()}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {RESOURCE_CONFIG.map((res) => (
        <GlassPanel key={res.key} sx={{ p: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: `${res.color}18`,
                border: `1px solid ${res.color}40`,
                flexShrink: 0,
              }}
            >
              <Box sx={{ color: res.color, display: "flex" }}>
                {res.icon}
              </Box>
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: "text.secondary", fontSize: "0.65rem", lineHeight: 1.2 }}
              >
                {res.label}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: res.color,
                    lineHeight: 1.3,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {Math.floor(resources[res.key]).toLocaleString()}
                </Typography>
                {gameState && (
                  <Typography
                    sx={{
                      fontSize: "0.65rem",
                      color: "text.secondary",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {getProductionRate(res.key, gameState)}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </GlassPanel>
      ))}
    </Box>
  );
}
