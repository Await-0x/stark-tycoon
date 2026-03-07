import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CheckRounded from "@mui/icons-material/CheckRounded";
import AccountBalanceRounded from "@mui/icons-material/AccountBalanceRounded";
import GroupRounded from "@mui/icons-material/GroupRounded";
import ScienceRounded from "@mui/icons-material/ScienceRounded";
import SwapHorizRounded from "@mui/icons-material/SwapHorizRounded";
import TrendingUpRounded from "@mui/icons-material/TrendingUpRounded";
import { BUILDING_SPECS, UPGRADE_SPECS } from "@/types/game";
import type { Building, BuildingSpec, UpgradeSpec } from "@/types/game";
import { getBuildingImage } from "@/utils/buildingImages";
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
    items.push({ icon: <AccountBalanceRounded sx={{ fontSize: IC }} />, value: `+${spec.capitalProduction}/s`, color: "#FFD54F" });
  if (spec.usersProduction > 0)
    items.push({ icon: <GroupRounded sx={{ fontSize: IC }} />, value: `+${spec.usersProduction}/s`, color: "#42C6FF" });
  if (spec.researchProduction > 0)
    items.push({ icon: <ScienceRounded sx={{ fontSize: IC }} />, value: `+${spec.researchProduction}/s`, color: "#8B5CF6" });
  if (spec.txProduction > 0)
    items.push({ icon: <SwapHorizRounded sx={{ fontSize: IC }} />, value: `+${spec.txProduction}/s`, color: "#4ADE80" });
  if (spec.usersMultiplier > 0)
    items.push({ icon: <TrendingUpRounded sx={{ fontSize: IC }} />, value: `U+${spec.usersMultiplier}%`, color: "#42C6FF" });
  if (spec.researchMultiplier > 0)
    items.push({ icon: <TrendingUpRounded sx={{ fontSize: IC }} />, value: `R+${spec.researchMultiplier}%`, color: "#8B5CF6" });
  if (spec.txMultiplier > 0)
    items.push({ icon: <TrendingUpRounded sx={{ fontSize: IC }} />, value: `TX+${spec.txMultiplier}%`, color: "#4ADE80" });
  return items;
}

interface BuildingDetailsProps {
  building: Building;
  onUpgrade: (positionId: number, upgradeIndex: number) => void;
}

export function BuildingDetails({ building, onUpgrade }: BuildingDetailsProps) {
  const spec = BUILDING_SPECS[building.buildingId];
  const upgrades = UPGRADE_SPECS[building.buildingId];
  const resources = useResourceTicker();

  if (!spec) return null;

  const production = prodStats(spec);

  return (
    <GlassPanel sx={{ mt: 2, p: 0, borderRadius: "10px", overflow: "hidden" }}>
      {/* Header: image + name + production */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1, pb: 0.75 }}>
        <Box
          component="img"
          src={getBuildingImage(building.buildingId)}
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
          {production.length > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.375 }}>
              <Box sx={{
                display: "flex", alignItems: "center", gap: 0.5,
                bgcolor: "rgba(74, 222, 128, 0.08)", border: "1px solid rgba(74, 222, 128, 0.15)",
                borderRadius: "6px", px: 0.75, py: 0.25,
              }}>
                <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: "#4ADE80", lineHeight: 1, mr: 0.125 }}>+</Typography>
                {production.map((p, i) => (
                  <Stat key={i} icon={p.icon} value={p.value} color={p.color} />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Upgrades */}
      {upgrades && (
        <Box sx={{ borderTop: "1px solid rgba(110, 190, 255, 0.08)", px: 1, pt: 0.75, pb: 1, display: "flex", flexDirection: "column", gap: 0.75 }}>
          <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Upgrades
          </Typography>
          {upgrades.map((upgrade, idx) => {
            const isApplied = building.upgradeLevel > idx;
            const isNext = building.upgradeLevel === idx;
            const canAfford = resources.research >= upgrade.researchCost;
            const effects = prodStats(upgrade);

            return (
              <Box
                key={idx}
                sx={{
                  borderRadius: "8px",
                  border: "1px solid",
                  borderColor: isApplied
                    ? "rgba(139, 92, 246, 0.3)"
                    : isNext
                      ? "rgba(110, 190, 255, 0.18)"
                      : "rgba(110, 190, 255, 0.08)",
                  bgcolor: isApplied
                    ? "rgba(139, 92, 246, 0.04)"
                    : "rgba(14, 22, 40, 0.4)",
                  opacity: !isApplied && !isNext ? 0.45 : 1,
                  p: 1,
                }}
              >
                {/* Upgrade name */}
                <Typography sx={{ fontWeight: 600, fontSize: "0.8rem", lineHeight: 1.2, mb: 0.75 }}>
                  {upgrade.name}
                </Typography>

                {/* Cost & gain pills */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.75 }}>
                  <Box sx={{
                    display: "inline-flex", alignItems: "center", gap: 0.375,
                    bgcolor: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.15)",
                    borderRadius: "5px", px: 0.75, py: 0.25,
                  }}>
                    <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: "#EF4444", lineHeight: 1 }}>-</Typography>
                    <Stat icon={<ScienceRounded sx={{ fontSize: IC }} />} value={upgrade.researchCost.toLocaleString()} color="#8B5CF6" />
                  </Box>
                  <Box sx={{
                    display: "inline-flex", alignItems: "center", gap: 0.375,
                    bgcolor: "rgba(74, 222, 128, 0.08)", border: "1px solid rgba(74, 222, 128, 0.15)",
                    borderRadius: "5px", px: 0.75, py: 0.25,
                  }}>
                    <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: "#4ADE80", lineHeight: 1 }}>+</Typography>
                    {effects.map((e, j) => (
                      <Stat key={j} icon={e.icon} value={e.value} color={e.color} />
                    ))}
                  </Box>
                </Box>

                {/* Action */}
                {isApplied ? (
                  <Chip
                    icon={<CheckRounded sx={{ fontSize: 14 }} />}
                    label="Applied"
                    size="small"
                    sx={{
                      bgcolor: "rgba(139, 92, 246, 0.15)",
                      color: "#8B5CF6",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      height: 26,
                      "& .MuiChip-icon": { color: "#8B5CF6" },
                    }}
                  />
                ) : isNext ? (
                  <Button
                    variant="contained"
                    size="small"
                    disabled={!canAfford}
                    onClick={() => onUpgrade(building.positionId, idx)}
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      px: 2.5,
                      py: 0.5,
                      minWidth: 0,
                      borderRadius: "8px",
                    }}
                  >
                    {canAfford ? "Upgrade" : "Not enough research"}
                  </Button>
                ) : null}
              </Box>
            );
          })}
        </Box>
      )}
    </GlassPanel>
  );
}
