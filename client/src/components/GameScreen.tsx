import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import StorefrontRounded from "@mui/icons-material/StorefrontRounded";
import { useGameDirector } from "@/contexts/GameDirector";
import { useGameStore } from "@/stores/gameStore";
import { useController } from "@/contexts/controller";
import { useGameTimer } from "@/hooks/useGameTimer";
import { GAME_DURATION } from "@/types/game";
import { preloadBuildingImages } from "@/utils/buildingImages";
import { AppShell } from "./AppShell";
import { ResourceBar } from "./ResourceBar";
import { GameTimer } from "./GameTimer";
import { GameBoard } from "./GameBoard";
import { MarketPanel } from "./MarketPanel";
import { BuildingDetails } from "./BuildingDetails";
import { GameEndOverlay } from "./GameEndOverlay";

export function GameScreen() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { account, address, playerName, isPending, openProfile, login } =
    useController();
  const { executeGameAction } = useGameDirector();
  const executeRef = useRef(executeGameAction);
  executeRef.current = executeGameAction;
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

  // Mobile drawer state
  const [marketOpen, setMarketOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => { preloadBuildingImages(); }, []);

  // Auto-submit score once wall clock passes mintedAt + GAME_DURATION + 2s
  // (the +2s buffer accounts for block timestamp lagging behind real time)
  const gameState = useGameStore((s) => s.gameState);
  useEffect(() => {
    if (!isExpired || gamePhase !== "playing" || !gameId || !gameState || submitFiredRef.current) return;
    submitFiredRef.current = true;
    const deadline = (gameState.mintedAt + GAME_DURATION + 2) * 1000;
    const delay = Math.max(0, deadline - Date.now());
    const timer = setTimeout(() => {
      executeRef.current({ type: "submit_score", gameId });
    }, delay);
    return () => clearTimeout(timer);
  }, [isExpired, gamePhase, gameId, gameState]);

  const selectedBuilding = useMemo(() => {
    if (selectedPosition === null) return null;
    return buildings.find((b) => b.positionId === selectedPosition) ?? null;
  }, [selectedPosition, buildings]);

  // Mobile: auto-open details drawer when a building is selected
  useEffect(() => {
    if (isMobile && selectedBuilding) {
      setDetailsOpen(true);
    }
  }, [isMobile, selectedBuilding]);

  // Mobile: auto-close market drawer when a building is picked
  useEffect(() => {
    if (isMobile && selectedMarketBuildingId !== null) {
      setMarketOpen(false);
    }
  }, [isMobile, selectedMarketBuildingId]);

  const handleDetailsClose = useCallback(() => {
    setDetailsOpen(false);
    setSelectedPosition(null);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTileClick = useCallback(
    (positionId: number) => {
      const building = buildings.find((b) => b.positionId === positionId && b.buildingId > 0);

      if (building) {
        setSelectedMarketBuildingId(null);
        setSelectedPosition(selectedPosition === positionId ? null : positionId);
      } else if (selectedMarketBuildingId !== null && gameId) {
        executeRef.current({
          type: "buy_building",
          gameId,
          buildingId: selectedMarketBuildingId,
          positionId,
        });
      }
    },
    [buildings, selectedPosition, selectedMarketBuildingId, gameId]
  );

  const handleUpgrade = useCallback(
    (positionId: number, upgradeIndex: number) => {
      if (gameId && !actionInProgress) {
        executeRef.current({
          type: "upgrade_building",
          gameId,
          positionId,
          upgradeId: upgradeIndex + 1,
        });
      }
    },
    [gameId, actionInProgress]
  );

  const handleDestroy = useCallback(
    (positionId: number) => {
      if (gameId) {
        if (isMobile) setDetailsOpen(false);
        executeRef.current({
          type: "destroy_building",
          gameId,
          positionId,
        });
      }
    },
    [gameId, isMobile]
  );

  const drawerPaperSx = {
    bgcolor: "rgba(10, 16, 30, 0.95)",
    borderTop: "1px solid",
    borderColor: "line.0",
    borderRadius: "16px 16px 0 0",
    backdropFilter: "blur(12px)",
    maxHeight: "70vh",
  };

  return (
    <>
    <AppShell
      topBar={
        <Box sx={{ display: "flex", alignItems: "center", width: "100%", gap: { xs: 1, md: 2 } }}>
          <Typography
            variant="h6"
            sx={{
              background: "linear-gradient(135deg, #42C6FF, #8B5CF6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              flexShrink: 0,
              display: { xs: "none", md: "block" },
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
                isMobile ? undefined : <SportsEsportsOutlinedIcon htmlColor="secondary.contrastText" />
              }
              sx={{
                flexShrink: 0,
                justifyContent: "center",
                color: "secondary.contrastText",
                opacity: 1,
                height: { xs: "32px", md: "36px" },
                fontSize: { xs: "0.75rem", md: "0.875rem" },
                minWidth: 0,
                px: { xs: 1.5, md: 2 },
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
                isMobile ? undefined : <SportsEsportsOutlinedIcon htmlColor="secondary.contrastText" />
              }
              sx={{
                flexShrink: 0,
                justifyContent: "center",
                color: "secondary.contrastText",
                height: { xs: "32px", md: "36px" },
                fontSize: { xs: "0.75rem", md: "0.875rem" },
                minWidth: 0,
                px: { xs: 1.5, md: 2 },
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
              onUpgrade={handleUpgrade}
              onDestroy={handleDestroy}
            />
          )}
        </>
      }
      center={
        isMobile ? (
          <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
            <ResourceBar compact />
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 1, overflow: "auto" }}>
              <GameBoard onTileClick={handleTileClick} />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                p: 1,
                pb: 2,
                borderTop: "1px solid",
                borderColor: "line.0",
                bgcolor: "rgba(7, 10, 18, 0.85)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Button
                variant={selectedMarketBuildingId !== null ? "outlined" : "contained"}
                onClick={() => setMarketOpen(true)}
                startIcon={<StorefrontRounded />}
                sx={{ borderRadius: "10px", px: 3, fontWeight: 700 }}
              >
                {selectedMarketBuildingId !== null ? "Change Selection" : "Market"}
              </Button>
            </Box>
          </Box>
        ) : (
          <GameBoard onTileClick={handleTileClick} />
        )
      }
      rightRail={<MarketPanel />}
    />

    {/* Mobile: Market Drawer */}
    {isMobile && (
      <Drawer
        anchor="bottom"
        open={marketOpen}
        onClose={() => setMarketOpen(false)}
        PaperProps={{ sx: drawerPaperSx }}
      >
        <Box sx={{ width: 32, height: 4, borderRadius: 2, bgcolor: "rgba(110, 190, 255, 0.3)", mx: "auto", mt: 1, mb: 0.5 }} />
        <Box sx={{ p: 2, pt: 0.5, overflow: "auto" }}>
          <MarketPanel />
        </Box>
      </Drawer>
    )}

    {/* Mobile: Building Details Drawer */}
    {isMobile && (
      <Drawer
        anchor="bottom"
        open={detailsOpen && selectedBuilding !== null}
        onClose={handleDetailsClose}
        PaperProps={{ sx: drawerPaperSx }}
      >
        <Box sx={{ width: 32, height: 4, borderRadius: 2, bgcolor: "rgba(110, 190, 255, 0.3)", mx: "auto", mt: 1, mb: 0.5 }} />
        <Box sx={{ px: 2, pb: 2 }}>
          {selectedBuilding && (
            <BuildingDetails
              building={selectedBuilding}
              onUpgrade={handleUpgrade}
              onDestroy={handleDestroy}
            />
          )}
        </Box>
      </Drawer>
    )}

    <GameEndOverlay />
    </>
  );
}
