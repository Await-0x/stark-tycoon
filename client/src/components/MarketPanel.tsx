import { useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AccountBalanceRounded from "@mui/icons-material/AccountBalanceRounded";
import GroupRounded from "@mui/icons-material/GroupRounded";
import ScienceRounded from "@mui/icons-material/ScienceRounded";
import SwapHorizRounded from "@mui/icons-material/SwapHorizRounded";
import TrendingUpRounded from "@mui/icons-material/TrendingUpRounded";
import { BUILDING_SPECS, UPGRADE_SPECS, getMarketBuildings, TX_SCALE } from "@/types/game";
import type { BuildingSpec, UpgradeSpec } from "@/types/game";
import { getBuildingImage } from "@/utils/buildingImages";
import { useGameStore } from "@/stores/gameStore";
import { useResourceTicker } from "@/hooks/useResourceTicker";
import { GlassPanel } from "./GlassPanel";

const IC = 13;

function Stat({ icon, value, color }: { icon: React.ReactElement; value: string; color: string }) {
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
      <Box sx={{ color, display: "flex", lineHeight: 0 }}>{icon}</Box>
      <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, color, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
        {value}
      </Typography>
    </Box>
  );
}

function prodStats(spec: BuildingSpec | UpgradeSpec): { icon: React.ReactElement; value: string; color: string }[] {
  const items: { icon: React.ReactElement; value: string; color: string }[] = [];
  if (spec.capitalProduction > 0)
    items.push({ icon: <AccountBalanceRounded sx={{ fontSize: IC }} />, value: `+${spec.capitalProduction}`, color: "#FFD54F" });
  if (spec.usersProduction > 0)
    items.push({ icon: <GroupRounded sx={{ fontSize: IC }} />, value: `+${spec.usersProduction}`, color: "#42C6FF" });
  if (spec.researchProduction > 0)
    items.push({ icon: <ScienceRounded sx={{ fontSize: IC }} />, value: `+${spec.researchProduction}`, color: "#8B5CF6" });
  if (spec.txProduction > 0)
    items.push({ icon: <SwapHorizRounded sx={{ fontSize: IC }} />, value: `+${(spec.txProduction / TX_SCALE).toFixed(1)}`, color: "#4ADE80" });
  if (spec.usersMultiplier > 0)
    items.push({ icon: <TrendingUpRounded sx={{ fontSize: IC }} />, value: `U+${(spec.usersMultiplier / 100).toFixed(0)}%`, color: "#42C6FF" });
  if (spec.researchMultiplier > 0)
    items.push({ icon: <TrendingUpRounded sx={{ fontSize: IC }} />, value: `R+${(spec.researchMultiplier / 100).toFixed(0)}%`, color: "#8B5CF6" });
  if (spec.txMultiplier > 0)
    items.push({ icon: <TrendingUpRounded sx={{ fontSize: IC }} />, value: `TX+${(spec.txMultiplier / 100).toFixed(0)}%`, color: "#4ADE80" });
  return items;
}

function MarketCard({
  spec,
  isSelected,
  canAfford,
  resources,
  onClick,
}: {
  spec: BuildingSpec;
  isSelected: boolean;
  canAfford: boolean;
  resources: { capital: number; users: number };
  onClick: () => void;
}) {
  const upgrades = UPGRADE_SPECS[spec.id];
  const production = prodStats(spec);
  const capitalOk = resources.capital >= spec.capitalCost;
  const usersOk = resources.users >= spec.usersCost;
  const dim = canAfford ? 1 : 0.45;

  return (
    <GlassPanel
      sx={{
        p: 0,
        borderRadius: "10px",
        cursor: canAfford ? "pointer" : "default",
        borderColor: isSelected
          ? "#42C6FF"
          : canAfford
            ? undefined
            : "rgba(123, 139, 165, 0.18)",
        boxShadow: isSelected
          ? "0 0 16px rgba(66, 198, 255, 0.25), inset 0 0 12px rgba(66, 198, 255, 0.06)"
          : "none",
        transition: "all 0.2s ease",
        overflow: "hidden",
        "&:hover": canAfford
          ? { borderColor: "line.1", boxShadow: "0 0 8px rgba(66, 198, 255, 0.15)" }
          : {},
      }}
    >
      <Box onClick={canAfford ? onClick : undefined} sx={{ opacity: dim }}>
        {/* Row 1: image + name + cost → production */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1, pb: 0.75 }}>
          <Box
            component="img"
            src={getBuildingImage(spec.id)}
            alt={spec.name}
            sx={{
              width: 36,
              height: 36,
              objectFit: "contain",
              borderRadius: "6px",
              bgcolor: "rgba(14, 22, 40, 0.6)",
              border: "1px solid",
              borderColor: "line.0",
              flexShrink: 0,
            }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {spec.name}
            </Typography>
            {/* Cost | Gain */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.375 }}>
              {/* Cost pills */}
              <Box sx={{
                display: "flex", alignItems: "center", gap: 0.375,
                bgcolor: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.15)",
                borderRadius: "6px", px: 0.75, py: 0.25,
              }}>
                <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: "#EF4444", lineHeight: 1, mr: 0.125 }}>-</Typography>
                <Stat
                  icon={<AccountBalanceRounded sx={{ fontSize: IC }} />}
                  value={spec.capitalCost.toLocaleString()}
                  color={capitalOk ? "#FFD54F" : "#EF4444"}
                />
              </Box>
              {spec.usersCost > 0 && (
                <Box sx={{
                  display: "flex", alignItems: "center", gap: 0.375,
                  bgcolor: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.15)",
                  borderRadius: "6px", px: 0.75, py: 0.25,
                }}>
                  <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: "#EF4444", lineHeight: 1, mr: 0.125 }}>-</Typography>
                  <Stat
                    icon={<GroupRounded sx={{ fontSize: IC }} />}
                    value={spec.usersCost.toLocaleString()}
                    color={usersOk ? "#42C6FF" : "#EF4444"}
                  />
                </Box>
              )}
              {/* Gain pill */}
              <Box sx={{
                display: "flex", alignItems: "center", gap: 0.5,
                bgcolor: "rgba(74, 222, 128, 0.08)", border: "1px solid rgba(74, 222, 128, 0.15)",
                borderRadius: "6px", px: 0.75, py: 0.25,
              }}>
                <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: "#4ADE80", lineHeight: 1, mr: 0.125 }}>+</Typography>
                {production.map((p, i) => (
                  <Stat key={i} icon={p.icon} value={`${p.value}/s`} color={p.color} />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Upgrade rows */}
        {upgrades && (
          <Box sx={{ borderTop: "1px solid rgba(110, 190, 255, 0.08)", px: 1, py: 0.5, display: "flex", flexDirection: "column", gap: 0.25 }}>
            <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Upgrades
            </Typography>
            {upgrades.map((u, i) => {
              const effects = prodStats(u);
              return (
                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography sx={{ fontSize: "0.65rem", color: "text.secondary", flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {u.name}
                  </Typography>
                  <Box sx={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 0.375,
                    bgcolor: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.15)",
                    borderRadius: "5px", px: 0.5, py: 0.25, width: 60, flexShrink: 0,
                  }}>
                    <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: "#EF4444", lineHeight: 1 }}>-</Typography>
                    <Stat icon={<ScienceRounded sx={{ fontSize: IC }} />} value={u.researchCost.toLocaleString()} color="#8B5CF6" />
                  </Box>
                  <Box sx={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 0.375,
                    bgcolor: "rgba(74, 222, 128, 0.08)", border: "1px solid rgba(74, 222, 128, 0.15)",
                    borderRadius: "5px", px: 0.5, py: 0.25, width: 60, flexShrink: 0,
                  }}>
                    <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: "#4ADE80", lineHeight: 1 }}>+</Typography>
                    {effects.map((e, j) => (
                      <Stat key={j} icon={e.icon} value={e.value} color={e.color} />
                    ))}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </GlassPanel>
  );
}

export function MarketPanel() {
  const gameState = useGameStore((s) => s.gameState);
  const selectedMarketBuildingId = useGameStore((s) => s.selectedMarketBuildingId);
  const setSelectedMarketBuildingId = useGameStore((s) => s.setSelectedMarketBuildingId);
  const setSelectedPosition = useGameStore((s) => s.setSelectedPosition);
  const resources = useResourceTicker();

  const marketBuildings = useMemo(() => {
    if (!gameState) return [];
    return getMarketBuildings(gameState.marketPacked)
      .map((id) => BUILDING_SPECS[id])
      .filter(Boolean);
  }, [gameState]);

  const handleCardClick = (spec: BuildingSpec) => {
    setSelectedPosition(null);
    if (selectedMarketBuildingId === spec.id) {
      setSelectedMarketBuildingId(null);
    } else {
      setSelectedMarketBuildingId(spec.id);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography variant="subtitle2" sx={{ color: "text.secondary", px: 0.5 }}>
        Market
      </Typography>

      {marketBuildings.map((spec, idx) => {
        const canAfford =
          resources.capital >= spec.capitalCost && resources.users >= spec.usersCost;
        return (
          <MarketCard
            key={`${spec.id}-${idx}`}
            spec={spec}
            isSelected={selectedMarketBuildingId === spec.id}
            canAfford={canAfford}
            resources={resources}
            onClick={() => handleCardClick(spec)}
          />
        );
      })}
    </Box>
  );
}
