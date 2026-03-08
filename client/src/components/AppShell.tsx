import Box from "@mui/material/Box";
import type { ReactNode } from "react";

interface AppShellProps {
  topBar: ReactNode;
  leftRail: ReactNode;
  center: ReactNode;
  rightRail: ReactNode;
}

export function AppShell({ topBar, leftRail, center, rightRail }: AppShellProps) {
  return (
    <Box
      sx={{
        height: "100dvh",
        width: "100vw",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "240px 1fr 320px" },
        gridTemplateRows: { xs: "56px 1fr", md: "72px 1fr" },
        gap: 0,
        overflow: "hidden",
      }}
    >
      {/* Top bar spanning full width */}
      <Box
        sx={{
          gridColumn: "1 / -1",
          gridRow: "1",
          display: "flex",
          alignItems: "center",
          px: { xs: 1.5, md: 3 },
          borderBottom: "1px solid",
          borderColor: "line.0",
          bgcolor: "rgba(7, 10, 18, 0.85)",
          backdropFilter: "blur(8px)",
          zIndex: 10,
        }}
      >
        {topBar}
      </Box>

      {/* Left rail — desktop only */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          gridColumn: "1",
          gridRow: "2",
          overflow: "auto",
          p: 2,
          borderRight: "1px solid",
          borderColor: "line.0",
        }}
      >
        {leftRail}
      </Box>

      {/* Center board */}
      <Box
        sx={{
          gridColumn: { xs: "1", md: "2" },
          gridRow: "2",
          overflow: "hidden",
          display: "flex",
          alignItems: { xs: "stretch", md: "center" },
          justifyContent: "center",
          p: { xs: 0, md: 2 },
        }}
      >
        {center}
      </Box>

      {/* Right rail — desktop only */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          gridColumn: "3",
          gridRow: "2",
          overflow: "auto",
          p: 2,
          borderLeft: "1px solid",
          borderColor: "line.0",
        }}
      >
        {rightRail}
      </Box>
    </Box>
  );
}
