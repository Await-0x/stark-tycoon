import { translateGameEvent } from "@/utils/translation";
import type { TranslatedGameEvent } from "@/utils/translation";
import { VRF_PROVIDER } from "@/utils/networkConfig";
import { useAccount } from "@starknet-react/core";
import { useSnackbar } from "notistack";
import { CallData } from "starknet";
import type { Call } from "starknet";

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

export const useSystemCalls = () => {
  const { account } = useAccount();
  const { enqueueSnackbar } = useSnackbar();
  const GAME_ADDRESS = import.meta.env.VITE_PUBLIC_GAME_ADDRESS;

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

  // ── Read-only: get_game_state ──
  const getGameState = (gameId: string): Call => ({
    contractAddress: GAME_ADDRESS,
    entrypoint: "get_game_state",
    calldata: CallData.compile([gameId]),
  });

  return {
    executeAction,
    startGame,
    buyBuilding,
    upgradeBuilding,
    submitScore,
    getGameState,
  };
};
