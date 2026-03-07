import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeBackground {
    bg2: string;
  }
  interface Palette {
    line: { 0: string; 1: string };
    resource: {
      capital: string;
      users: string;
      research: string;
      transactions: string;
    };
  }
  interface PaletteOptions {
    line?: { 0: string; 1: string };
    resource?: {
      capital: string;
      users: string;
      research: string;
      transactions: string;
    };
  }
}

export const mainTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#42C6FF" },
    secondary: { main: "#8B5CF6" },
    background: {
      default: "#070A12",
      paper: "rgba(10, 16, 30, 0.72)",
      bg2: "rgba(14, 22, 40, 0.82)",
    },
    text: {
      primary: "#E8ECF4",
      secondary: "#7B8BA5",
    },
    success: { main: "#4ADE80" },
    warning: { main: "#FFB74D" },
    info: { main: "#42C6FF" },
    error: { main: "#EF4444" },
    line: {
      0: "rgba(110, 190, 255, 0.18)",
      1: "rgba(110, 190, 255, 0.32)",
    },
    resource: {
      capital: "#FFD54F",
      users: "#42C6FF",
      research: "#8B5CF6",
      transactions: "#4ADE80",
    },
  },
  typography: {
    fontFamily: "'Space Grotesk', 'Inter', sans-serif",
    h4: { fontWeight: 700, letterSpacing: "-0.02em" },
    h5: { fontWeight: 700, letterSpacing: "-0.01em" },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500, letterSpacing: "0.02em" },
    subtitle2: { fontWeight: 500, fontSize: "0.75rem", letterSpacing: "0.06em", textTransform: "uppercase" },
    body2: { color: "#7B8BA5" },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(10, 16, 30, 0.72)",
          border: "1px solid rgba(110, 190, 255, 0.18)",
          borderRadius: 16,
          backdropFilter: "blur(12px)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 10,
          fontFamily: "'Space Grotesk', 'Inter', sans-serif",
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #42C6FF 0%, #8B5CF6 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #5DD4FF 0%, #9D73FF 100%)",
          },
          "&.Mui-disabled": {
            background: "rgba(110, 190, 255, 0.12)",
            color: "rgba(232, 236, 244, 0.3)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: "'Space Grotesk', 'Inter', sans-serif",
          fontWeight: 500,
          borderRadius: 8,
          height: 24,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "rgba(14, 22, 40, 0.95)",
          border: "1px solid rgba(110, 190, 255, 0.18)",
          borderRadius: 8,
          fontFamily: "'Space Grotesk', 'Inter', sans-serif",
          fontSize: "0.75rem",
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 6,
          backgroundColor: "rgba(110, 190, 255, 0.12)",
        },
      },
    },
  },
});
