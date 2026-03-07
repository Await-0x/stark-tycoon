import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export function GlassPanel({ children, sx }: GlassPanelProps) {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "line.0",
        borderRadius: "16px",
        backdropFilter: "blur(12px)",
        p: 2,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
