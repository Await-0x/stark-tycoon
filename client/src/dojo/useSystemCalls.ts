import { useDynamicConnector } from "@/contexts/starknet";
import type { Building, GameState } from "@/types/game";
import { VRF_PROVIDER } from "@/utils/networkConfig";
import type { TranslatedGameEvent } from "@/utils/translation";
import { translateGameEvent } from "@/utils/translation";
import { useAccount } from "@starknet-react/core";
import { useSnackbar } from "notistack";
import type { Call } from "starknet";
import { CallData, hash } from "starknet";

export const useSystemCalls = () => {
  const { account } = useAccount();
  const { enqueueSnackbar } = useSnackbar();
  const { currentNetworkConfig } = useDynamicConnector();

  const GAME_ADDRESS = currentNetworkConfig.gameAddress;

  // ── Core execution ──
  const executeAction = async (
    calls: Call[],
    onFailure: () => void
  ): Promise<TranslatedGameEvent[] | null | undefined> => {
    if (!account) {
      onFailure();
      return null;
    }

    try {
      const tx = await account.execute(calls);
      const receipt = await waitForTransaction(tx.transaction_hash, 0);

      if (receipt.execution_status === "REVERTED") {
        enqueueSnackbar("Transaction reverted", {
          variant: "error",
        });
        onFailure();
        return undefined;
      }

      const translatedEvents = (receipt.events || [])
        .map((event) =>
          translateGameEvent(
            event as Parameters<typeof translateGameEvent>[0],
            account.address
          )
        )
        .flat()
        .filter(Boolean) as TranslatedGameEvent[];

      return translatedEvents;
    } catch (error) {
      console.error("Error executing action:", error);

      const executionError =
        typeof error === "object" &&
          error !== null &&
          "data" in error &&
          typeof (error as { data?: unknown }).data === "object" &&
          (error as { data?: unknown }).data !== null &&
          "execution_error" in
          (error as { data: Record<string, unknown> }).data
          ? (error as { data: { execution_error?: unknown } }).data
            .execution_error
          : undefined;

      enqueueSnackbar(parseExecutionError(executionError), {
        variant: "error",
      });
      onFailure();
      return null;
    }
  };

  // ── Transaction polling with retry ──
  const waitForTransaction = async (
    txHash: string,
    retries: number
  ): Promise<TransactionReceiptLike> => {
    if (retries > 9) throw new Error("Transaction failed");
    if (!account) throw new Error("Wallet not connected");

    try {
      const receipt = await account.waitForTransaction(txHash, {
        retryInterval: 500,
        successStates: ["PRE_CONFIRMED", "ACCEPTED_ON_L2", "ACCEPTED_ON_L1"],
      });
      return receipt as unknown as TransactionReceiptLike;
    } catch (error) {
      console.error("Error waiting for transaction:", error);
      await new Promise((r) => setTimeout(r, 500));
      return waitForTransaction(txHash, retries + 1);
    }
  };

  // ── VRF helper ──
  const requestRandom = (): Call => ({
    contractAddress: VRF_PROVIDER,
    entrypoint: "request_random",
    calldata: CallData.compile({
      caller: GAME_ADDRESS,
      source: { type: 0, address: account!.address },
    }),
  });

  // ── Action builders (pure, no side effects) ──

  const startGame = (playerName?: string): Call[] => {
    const calls: Call[] = [requestRandom()];
    calls.push({
      contractAddress: GAME_ADDRESS,
      entrypoint: "start_game",
      calldata: CallData.compile(
        playerName
          ? { player_name: { Some: playerName } }
          : { player_name: { None: true } }
      ),
    });
    return calls;
  };

  const buyBuilding = (
    gameId: string,
    buildingId: number,
    positionId: number
  ): Call[] => {
    const calls: Call[] = [requestRandom()];
    calls.push({
      contractAddress: GAME_ADDRESS,
      entrypoint: "buy_building",
      calldata: CallData.compile([gameId, buildingId, positionId]),
    });
    return calls;
  };

  const upgradeBuilding = (
    gameId: string,
    positionId: number,
    upgradeId: number
  ): Call[] => {
    return [
      {
        contractAddress: GAME_ADDRESS,
        entrypoint: "upgrade_building",
        calldata: CallData.compile([gameId, positionId, upgradeId]),
      },
    ];
  };

  const submitScore = (gameId: string): Call[] => {
    return [
      {
        contractAddress: GAME_ADDRESS,
        entrypoint: "submit_score",
        calldata: CallData.compile([gameId]),
      },
    ];
  };

  // ── Read-only: fetch game state via raw RPC ──
  const fetchGameState = async (
    gameId: string
  ): Promise<{ gameState: GameState; buildings: Building[] } | null> => {
    try {
      const response = await fetch(currentNetworkConfig.rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "starknet_call",
          params: [
            {
              contract_address: GAME_ADDRESS,
              entry_point_selector: hash.getSelectorFromName("get_game_state"),
              calldata: [gameId],
            },
            "latest",
          ],
          id: 0,
        }),
      });

      const data = await response.json();
      if (!data?.result || data.result.length < 16) return null;

      const r = data.result;
      const hex = (v: string) => parseInt(v, 16);

      const gameState: GameState = {
        mintedAt: 0,
        capital: hex(r[1]),
        users: hex(r[2]),
        research: hex(r[3]),
        transactions: hex(r[4]),
        capitalProduction: hex(r[5]),
        usersProduction: hex(r[6]),
        researchProduction: hex(r[7]),
        transactionsProduction: hex(r[8]),
        usersMultiplier: hex(r[9]),
        researchMultiplier: hex(r[10]),
        txMultiplier: hex(r[11]),
        gameTime: hex(r[12]),
        marketPacked: BigInt(r[14]),
      };

      const buildingsCount = hex(r[15]);
      const buildings: Building[] = [];
      for (let i = 0; i < buildingsCount; i++) {
        const base = 16 + i * 4;
        buildings.push({
          gameId: r[base],
          positionId: hex(r[base + 1]),
          buildingId: hex(r[base + 2]),
          upgradeLevel: hex(r[base + 3]),
        });
      }

      return { gameState, buildings };
    } catch (error) {
      console.error("Error fetching game state:", error);
      return null;
    }
  };

  // ── Start game and extract token ID from receipt ──
  const executeStartGame = async (
    playerName?: string
  ): Promise<{ events: TranslatedGameEvent[]; gameTokenId: string } | null> => {
    if (!account) return null;

    try {
      const calls = startGame(playerName);
      const tx = await account.execute(calls);
      const receipt = await waitForTransaction(tx.transaction_hash, 0);

      if (receipt.execution_status === "REVERTED") {
        enqueueSnackbar("Transaction reverted", { variant: "error" });
        return null;
      }

      // Extract game token ID: find event emitted by account, last data element
      const events = receipt.events || [];
      const tokenMetadataEvent = events.find(
        (event: any) => event.from_address === account.address
      ) as { data: string[]; from_address: string } | undefined;
      const gameTokenId = tokenMetadataEvent
        ? tokenMetadataEvent.data[tokenMetadataEvent.data.length - 1]
        : undefined;

      if (!gameTokenId) {
        enqueueSnackbar("Failed to get game ID", { variant: "error" });
        return null;
      }

      const translatedEvents = (receipt.events || [])
        .map((event) =>
          translateGameEvent(
            event as Parameters<typeof translateGameEvent>[0],
            account.address
          )
        )
        .flat()
        .filter(Boolean) as TranslatedGameEvent[];

      return { events: translatedEvents, gameTokenId };
    } catch (error) {
      console.error("Error starting game:", error);

      const executionError =
        typeof error === "object" &&
          error !== null &&
          "data" in error &&
          typeof (error as { data?: unknown }).data === "object" &&
          (error as { data?: unknown }).data !== null &&
          "execution_error" in
          (error as { data: Record<string, unknown> }).data
          ? (error as { data: { execution_error?: unknown } }).data
            .execution_error
          : undefined;

      enqueueSnackbar(parseExecutionError(executionError), {
        variant: "error",
      });
      return null;
    }
  };

  return {
    executeAction,
    executeStartGame,
    startGame,
    buyBuilding,
    upgradeBuilding,
    submitScore,
    fetchGameState,
  };
};

type TransactionReceiptLike = {
  execution_status?: string;
  actual_fee?: { amount?: string | number | bigint } | string | number | bigint;
  events?: unknown[];
};

const parseExecutionError = (error: unknown): string => {
  const fallback = "Error executing action";
  const isValidMessage = (m: string) =>
    m.length > 3 &&
    !m.includes("FAILED") &&
    !m.includes("argent/") &&
    !m.startsWith("0x");
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  try {
    if (!error || typeof error !== "string") return fallback;

    const singleQuoteMatches = error.match(/\('([^']+)'\)/g);
    if (singleQuoteMatches) {
      const message = singleQuoteMatches
        .map((m) => m.slice(2, -2))
        .find(isValidMessage);
      if (message) return capitalize(message);
    }

    const escapedMatches = error.match(/\\"([^"\\]+)\\"/g);
    if (escapedMatches) {
      const message = escapedMatches
        .map((m) => m.replace(/\\"/g, ""))
        .find(isValidMessage);
      if (message) return capitalize(message);
    }

    const doubleQuoteMatches = error.match(/"([^"]+)"/g);
    if (doubleQuoteMatches) {
      const message = doubleQuoteMatches
        .map((m) => m.slice(1, -1))
        .find(isValidMessage);
      if (message) return capitalize(message);
    }

    return fallback;
  } catch {
    return fallback;
  }
};