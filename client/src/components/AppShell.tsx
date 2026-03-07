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
        height: "100vh",
        width: "100vw",
        display: "grid",
        gridTemplateColumns: "240px 1fr 320px",
        gridTemplateRows: "72px 1fr",
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
          px: 3,
          borderBottom: "1px solid",
          borderColor: "line.0",
          bgcolor: "rgba(7, 10, 18, 0.85)",
          backdropFilter: "blur(8px)",
          zIndex: 10,
        }}
      >
        {topBar}
      </Box>

      {/* Left rail */}
      <Box
        sx={{
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
          gridColumn: "2",
          gridRow: "2",
          overflow: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        {center}
      </Box>

      {/* Right rail */}
      <Box
        sx={{
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
