import { useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { motion, AnimatePresence } from "framer-motion";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import { BUILDING_SPECS, BOARD_SIZE, deriveTileBonus } from "@/types/game";
import type { TileBonus } from "@/types/game";
import { getBuildingImage } from "@/utils/buildingImages";
import { useGameStore } from "@/stores/gameStore";

interface GameBoardProps {
  onTileClick: (positionId: number) => void;
}

export function GameBoard({ onTileClick }: GameBoardProps) {
  const buildings = useGameStore((s) => s.buildings);
  const selectedPosition = useGameStore((s) => s.selectedPosition);
  const selectedMarketBuildingId = useGameStore((s) => s.selectedMarketBuildingId);
  const boardSeed = useGameStore((s) => s.boardSeed);

  const buildingMap = useMemo(() => {
    const map = new Map<number, (typeof buildings)[0]>();
    for (const b of buildings) map.set(b.positionId, b);
    return map;
  }, [buildings]);

  const gridSize = 4;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gap: 1,
        width: "min(100%, 520px)",
        aspectRatio: "1",
      }}
    >
      {Array.from({ length: BOARD_SIZE }, (_, i) => {
        const building = buildingMap.get(i);
        const isSelected = selectedPosition === i;
        const isPlacementTarget = !building && selectedMarketBuildingId !== null;
        const bonus: TileBonus | null = boardSeed != null ? deriveTileBonus(boardSeed, i) : null;
        const hasBonusDisplay = bonus != null && bonus.bonusType !== 0;

        return (
          <Box
            key={i}
            onClick={() => onTileClick(i)}
            sx={{
              position: "relative",
              aspectRatio: "1",
              borderRadius: "12px",
              border: "1px solid",
              borderColor: isSelected
                ? "#42C6FF"
                : isPlacementTarget
                  ? "rgba(66, 198, 255, 0.4)"
                  : "line.0",
              bgcolor: building
                ? "rgba(14, 22, 40, 0.6)"
                : "rgba(10, 16, 30, 0.4)",
              cursor: "pointer",
              overflow: "hidden",
              transition: "all 0.2s ease",
              boxShadow: isSelected
                ? "0 0 16px rgba(66, 198, 255, 0.3), inset 0 0 16px rgba(66, 198, 255, 0.08)"
                : "none",
              "&:hover": {
                borderColor: "#42C6FF",
                boxShadow: "0 0 12px rgba(66, 198, 255, 0.2)",
              },
              ...(isPlacementTarget && !building
                ? {
                    borderStyle: "dashed",
                    animation: "pulse-glow 2s ease-in-out infinite",
                  }
                : {}),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AnimatePresence>
              {building && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    padding: "4px",
                  }}
                >
                  <Box
                    component="img"
                    src={getBuildingImage(building.buildingId)}
                    alt={BUILDING_SPECS[building.buildingId]?.name}
                    sx={{
                      width: "92%",
                      height: "auto",
                      maxHeight: "92%",
                      objectFit: "contain",
                      filter: "drop-shadow(0 2px 8px rgba(66, 198, 255, 0.2))",
                    }}
                  />
                  {building.upgradeLevel > 0 && (
                    <Box sx={{
                      position: "absolute",
                      bottom: 6,
                      right: 6,
                      display: "flex",
                      gap: "3px",
                    }}>
                      {Array.from({ length: building.upgradeLevel }, (_, j) => (
                        <Box
                          key={j}
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            bgcolor: "#8B5CF6",
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  {hasBonusDisplay && (
                    <TileBonusBadge bonus={bonus} position="bottom-left" />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            {!building && hasBonusDisplay && (
              <TileBonusBadge bonus={bonus} position="center" />
            )}
            {!building && !hasBonusDisplay && isPlacementTarget && (
              <Typography
                sx={{
                  fontSize: "1.2rem",
                  color: "rgba(66, 198, 255, 0.4)",
                  fontWeight: 300,
                }}
              >
                +
              </Typography>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

const BONUS_CONFIG: Record<number, { color: string; icon: typeof AccountBalanceRoundedIcon; isProduction: boolean }> = {
  1: { color: "#FFD54F", icon: AccountBalanceRoundedIcon, isProduction: true },
  2: { color: "#42C6FF", icon: GroupRoundedIcon, isProduction: true },
  3: { color: "#8B5CF6", icon: ScienceRoundedIcon, isProduction: true },
  4: { color: "#FFD54F", icon: AccountBalanceRoundedIcon, isProduction: false },
  5: { color: "#42C6FF", icon: GroupRoundedIcon, isProduction: false },
  6: { color: "#8B5CF6", icon: ScienceRoundedIcon, isProduction: false },
  7: { color: "#4ADE80", icon: SwapHorizRoundedIcon, isProduction: false },
};

function TileBonusBadge({ bonus, position }: { bonus: TileBonus; position: "center" | "bottom-left" }) {
  const config = BONUS_CONFIG[bonus.bonusType];
  if (!config) return null;

  const Icon = config.icon;
  const label = config.isProduction ? `+${bonus.bonusValue}/s` : `+${bonus.bonusValue}`;

  return (
    <Box
      sx={{
        ...(position === "bottom-left"
          ? { position: "absolute", bottom: 4, left: 4 }
          : {}),
        display: "flex",
        alignItems: "center",
        gap: "2px",
        bgcolor: "rgba(0,0,0,0.5)",
        borderRadius: "6px",
        px: 0.5,
        py: 0.25,
      }}
    >
      <Icon sx={{ fontSize: 12, color: config.color }} />
      <Typography sx={{ fontSize: "0.6rem", color: config.color, fontWeight: 700, lineHeight: 1 }}>
        {label}
      </Typography>
    </Box>
  );
}
