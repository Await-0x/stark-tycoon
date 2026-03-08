import { useCallback, useEffect, useMemo, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import { useGameDirector } from "@/contexts/GameDirector";
import { useGameStore } from "@/stores/gameStore";
import { useController } from "@/contexts/controller";
import { useGameTimer } from "@/hooks/useGameTimer";
import { preloadBuildingImages } from "@/utils/buildingImages";
import { AppShell } from "./AppShell";
import { ResourceBar } from "./ResourceBar";
import { GameTimer } from "./GameTimer";
import { GameBoard } from "./GameBoard";
import { MarketPanel } from "./MarketPanel";
import { BuildingDetails } from "./BuildingDetails";
import { GameEndOverlay } from "./GameEndOverlay";

export function GameScreen() {
  const { account, address, playerName, isPending, openProfile, login } =
    useController();
  const { executeGameAction } = useGameDirector();
  const buildings = useGameStore((s) => s.buildings);
  const gameId = useGameStore((s) => s.gameId);
  const actionInProgress = useGameStore((s) => s.actionInProgress);
  const gamePhase = useGameStore((s) => s.gamePhase);
  const selectedPosition = useGameStore((s) => s.selectedPosition);
  const selectedMarketBuildingId = useGameStore((s) => s.selectedMarketBuildingId);
  const setSelectedPosition = useGameStore((s) => s.setSelectedPosition);
  const setSelectedMarketBuildingId = useGameStore((s) => s.setSelectedMarketBuildingId);
  const { isExpired } = useGameTimer();
  const submitFiredRef = useRef(false);

  useEffect(() => { preloadBuildingImages(); }, []);

  // Auto-submit score when timer expires (2s delay for block timestamp lag)
  useEffect(() => {
    if (isExpired && gamePhase === "playing" && gameId && !submitFiredRef.current) {
      submitFiredRef.current = true;
      const timer = setTimeout(() => {
        executeGameAction({ type: "submit_score", gameId });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isExpired, gamePhase, gameId, executeGameAction]);

  const selectedBuilding = useMemo(() => {
    if (selectedPosition === null) return null;
    return buildings.find((b) => b.positionId === selectedPosition) ?? null;
  }, [selectedPosition, buildings]);

  const handleTileClick = useCallback(
    (positionId: number) => {
      const building = buildings.find((b) => b.positionId === positionId);

      if (building) {
        setSelectedMarketBuildingId(null);
        setSelectedPosition(selectedPosition === positionId ? null : positionId);
      } else if (selectedMarketBuildingId !== null && gameId && !actionInProgress) {
        executeGameAction({
          type: "buy_building",
          gameId,
          buildingId: selectedMarketBuildingId,
          positionId,
        });
      }
    },
    [buildings, selectedPosition, selectedMarketBuildingId, setSelectedPosition, setSelectedMarketBuildingId, gameId, actionInProgress, executeGameAction]
  );

  return (
    <>
    <AppShell
      topBar={
        <Box sx={{ display: "flex", alignItems: "center", width: "100%", gap: 2 }}>
          <Typography
            variant="h6"
            sx={{
              background: "linear-gradient(135deg, #42C6FF, #8B5CF6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              flexShrink: 0,
            }}
          >
            Stark Tycoon
          </Typography>
          <GameTimer />
          {account && address ? (
            <Button
              loading={!playerName}
              onClick={() => openProfile()}
              variant="contained"
              color="secondary"
              size="small"
              startIcon={
                <SportsEsportsOutlinedIcon htmlColor="secondary.contrastText" />
              }
              sx={{
                flexShrink: 0,
                justifyContent: "center",
                color: "secondary.contrastText",
                opacity: 1,
                height: "36px",
              }}
            >
              {playerName || `${address.slice(0, 6)}...${address.slice(-4)}`}
            </Button>
          ) : (
            <Button
              loading={isPending}
              onClick={() => login()}
              variant="contained"
              color="secondary"
              size="small"
              startIcon={
                <SportsEsportsOutlinedIcon htmlColor="secondary.contrastText" />
              }
              sx={{
                flexShrink: 0,
                justifyContent: "center",
                color: "secondary.contrastText",
                height: "36px",
              }}
            >
              Log In
            </Button>
          )}
        </Box>
      }
      leftRail={
        <>
          <ResourceBar />
          {selectedBuilding && (
            <BuildingDetails
              building={selectedBuilding}
              onUpgrade={(positionId: number, upgradeIndex: number) => {
                if (gameId && !actionInProgress) {
                  executeGameAction({
                    type: "upgrade_building",
                    gameId,
                    positionId,
                    upgradeId: upgradeIndex + 1,
                  });
                }
              }}
            />
          )}
        </>
      }
      center={<GameBoard onTileClick={handleTileClick} />}
      rightRail={<MarketPanel />}
    />
    <GameEndOverlay />
    </>
  );
}
