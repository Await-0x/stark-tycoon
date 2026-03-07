import { useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import { useGameMock } from "@/hooks/useGameMock";
import { useGameStore } from "@/stores/gameStore";
import { useController } from "@/contexts/controller";
import { AppShell } from "./AppShell";
import { ResourceBar } from "./ResourceBar";
import { GameTimer } from "./GameTimer";
import { GameBoard } from "./GameBoard";
import { MarketPanel } from "./MarketPanel";
import { BuildingDetails } from "./BuildingDetails";

export function GameScreen() {
  const { account, address, playerName, isPending, openProfile, login } =
    useController();
  const { mockBuyBuilding, mockUpgradeBuilding } = useGameMock();
  const buildings = useGameStore((s) => s.buildings);
  const selectedPosition = useGameStore((s) => s.selectedPosition);
  const selectedMarketBuildingId = useGameStore((s) => s.selectedMarketBuildingId);
  const setSelectedPosition = useGameStore((s) => s.setSelectedPosition);
  const setSelectedMarketBuildingId = useGameStore((s) => s.setSelectedMarketBuildingId);

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
      } else if (selectedMarketBuildingId !== null) {
        mockBuyBuilding(selectedMarketBuildingId, positionId);
      }
    },
    [buildings, selectedPosition, selectedMarketBuildingId, setSelectedPosition, setSelectedMarketBuildingId, mockBuyBuilding]
  );

  return (
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
              onUpgrade={mockUpgradeBuilding}
            />
          )}
        </>
      }
      center={<GameBoard onTileClick={handleTileClick} />}
      rightRail={<MarketPanel />}
    />
  );
}
