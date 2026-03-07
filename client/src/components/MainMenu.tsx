import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import GitHubIcon from "@mui/icons-material/GitHub";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import XIcon from "@mui/icons-material/X";
import SvgIcon from "@mui/material/SvgIcon";
import { useNavigate } from "react-router-dom";
import { useController } from "@/contexts/controller";
import { useSystemCalls } from "@/dojo/useSystemCalls";
import { useGameStore } from "@/stores/gameStore";
import type { TranslatedGameEvent } from "@/utils/translation";
import type { GameStateTranslation, BuildingTranslation } from "@/utils/translation";
import { unpackMintedAt } from "@/types/game";
import { GlassPanel } from "./GlassPanel";
import { Leaderboard } from "./Leaderboard";

const isGameStateEvent = (
  e: TranslatedGameEvent
): e is GameStateTranslation => e.componentName === "GameState";

const isBuildingEvent = (
  e: TranslatedGameEvent
): e is BuildingTranslation => e.componentName === "Building";

export function MainMenu() {
  const navigate = useNavigate();
  const { account, address, playerName, isPending, openProfile, login } =
    useController();
  const { executeStartGame } = useSystemCalls();
  const { setGameId, setGameState, setBuildings } = useGameStore();
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    document.body.classList.add("main-menu");
    return () => document.body.classList.remove("main-menu");
  }, []);

  const handleStartGame = async () => {
    if (!account) {
      login();
      return;
    }

    setIsStarting(true);
    const result = await executeStartGame(playerName || undefined);

    if (!result) {
      setIsStarting(false);
      return;
    }

    // Apply game state events to store before navigating
    const mintedAt = unpackMintedAt(result.gameTokenId);
    const gameStateEvents = result.events.filter(isGameStateEvent);
    if (gameStateEvents.length > 0) {
      const latest = gameStateEvents[gameStateEvents.length - 1];
      setGameState({ ...latest.state, mintedAt });
      setGameId(latest.gameId);
    }

    const buildingEvents = result.events.filter(isBuildingEvent);
    if (buildingEvents.length > 0) {
      setBuildings(buildingEvents.map((e) => e.building));
    }

    navigate(`/play?id=${result.gameTokenId}`);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        backgroundImage: "url(/background.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Gradient overlay for readability */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(7, 10, 18, 0.85) 0%, rgba(7, 10, 18, 0.4) 25%, transparent 100%)",
        }}
      />

      <GlassPanel
        sx={{
          position: "absolute",
          top: 32,
          left: 32,
          width: 340,
          minHeight: 520,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          zIndex: 1,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            background: "linear-gradient(135deg, #42C6FF, #8B5CF6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            textAlign: "center",
          }}
        >
          STARK TYCOON
        </Typography>

        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            opacity: 0.7,
            mt: -1.5,
          }}
        >
          Build The Perfect Network
        </Typography>

        <Button
          sx={{ mt: 1 }}
          variant="contained"
          size="large"
          fullWidth
          disabled={isStarting}
          onClick={handleStartGame}
        >
          Start Game
        </Button>

        <Button
          variant="outlined"
          size="large"
          fullWidth
          onClick={() => setHowToPlayOpen(true)}
        >
          How to Play
        </Button>

        <Button
          variant="outlined"
          size="large"
          fullWidth
          onClick={() => setLeaderboardOpen(true)}
        >
          Leaderboard
        </Button>


        <Box sx={{ mt: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Divider sx={{ borderColor: "line.0", mb: 2, width: "75%" }} />
          {account && address ? (
            <Button
              loading={!playerName}
              onClick={() => openProfile()}
              variant="contained"
              color="secondary"
              size="small"
              fullWidth
              startIcon={
                <SportsEsportsOutlinedIcon htmlColor="secondary.contrastText" />
              }
              sx={{
                justifyContent: "center",
                color: "secondary.contrastText",
                opacity: 1,
                height: "40px",
              }}
            >
              {playerName.charAt(0).toUpperCase() + playerName.slice(1) || `${address.slice(0, 6)}...${address.slice(-4)}`}
            </Button>
          ) : (
            <Button
              loading={isPending}
              onClick={() => login()}
              variant="contained"
              color="secondary"
              size="small"
              fullWidth
              startIcon={
                <SportsEsportsOutlinedIcon htmlColor="secondary.contrastText" />
              }
              sx={{
                justifyContent: "center",
                color: "secondary.contrastText",
                height: "40px",
              }}
            >
              Log In
            </Button>
          )}

          <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 1 }}>
            <IconButton
              size="small"
              sx={{ opacity: 0.6, "&:hover": { opacity: 1 } }}
              onClick={() =>
                window.open("https://github.com/provable-games", "_blank")
              }
            >
              <GitHubIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              sx={{ opacity: 0.6, "&:hover": { opacity: 1 } }}
              onClick={() =>
                window.open("https://x.com/await_0x", "_blank")
              }
            >
              <XIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              sx={{ opacity: 0.6, "&:hover": { opacity: 1 } }}
              onClick={() =>
                window.open("https://discord.gg/BF53UFyEbr", "_blank")
              }
            >
              <DiscordIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </GlassPanel>

      <Dialog
        open={howToPlayOpen}
        onClose={() => setHowToPlayOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "line.0",
            borderRadius: "16px",
            backdropFilter: "blur(12px)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            How to Play
          </Typography>
          <IconButton size="small" onClick={() => setHowToPlayOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Section title="Goal">
            Maximize amount of Transactions produced in a 20-minute session. Start with
            200 Capital, buy buildings, upgrade them, and build the most
            productive network ecosystem you can.
          </Section>

          <Section title="Resources">
            <BulletList
              items={[
                "Capital — Primary currency used to buy all buildings",
                "Users — Required to buy Transaction buildings",
                "Research — Spent to upgrade placed buildings",
                "Transactions — Your score! Produced by Transaction buildings",
              ]}
            />
          </Section>

          <Section title="Board & Market">
            Place buildings on a 5×5 grid (25 slots). Pick from 5 randomly
            available buildings in the market — each purchase refreshes that
            slot with a new random option.
          </Section>

          <Section title="Building Types">
            <BulletList
              items={[
                "Capital buildings — generate Capital per second",
                "User buildings — generate Users per second",
                "Research buildings — generate Research per second",
                "Transaction buildings — cost Capital + Users, produce TPS (your score)",
                "Global buildings — boost all production of a resource type by a percentage",
              ]}
            />
          </Section>

          <Section title="Upgrades">
            Every building has 2 sequential upgrades that cost Research and
            permanently boost its output. Apply Upgrade 1 before Upgrade 2.
          </Section>
        </DialogContent>
      </Dialog>

      <Leaderboard open={leaderboardOpen} onClose={() => setLeaderboardOpen(false)} />

      {/* Loading overlay while game is being prepared */}
      {isStarting && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 1300,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            bgcolor: "rgba(7, 10, 18, 0.92)",
            backdropFilter: "blur(8px)",
          }}
        >
          <CircularProgress
            size={56}
            sx={{
              color: "#42C6FF",
            }}
          />
          <Typography
            variant="h6"
            sx={{
              background: "linear-gradient(135deg, #42C6FF, #8B5CF6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 600,
            }}
          >
            Preparing your game...
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.5 }}>
            Confirming transaction on Starknet
          </Typography>
        </Box>
      )}
    </Box>
  );
}

function DiscordIcon(props: React.ComponentProps<typeof SvgIcon>) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </SvgIcon>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.85 }} component="div">
        {children}
      </Typography>
    </Box>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </Box>
  );
}
