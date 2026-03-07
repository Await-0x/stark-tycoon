import { useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { motion, AnimatePresence } from "framer-motion";
import { BUILDING_SPECS, BOARD_SIZE } from "@/types/game";
import { getBuildingImage } from "@/utils/buildingImages";
import { useGameStore } from "@/stores/gameStore";

interface GameBoardProps {
  onTileClick: (positionId: number) => void;
}

export function GameBoard({ onTileClick }: GameBoardProps) {
  const buildings = useGameStore((s) => s.buildings);
  const selectedPosition = useGameStore((s) => s.selectedPosition);
  const selectedMarketBuildingId = useGameStore((s) => s.selectedMarketBuildingId);

  const buildingMap = useMemo(() => {
    const map = new Map<number, (typeof buildings)[0]>();
    for (const b of buildings) map.set(b.positionId, b);
    return map;
  }, [buildings]);

  const gridSize = 5;

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
                </motion.div>
              )}
            </AnimatePresence>
            {!building && isPlacementTarget && (
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
