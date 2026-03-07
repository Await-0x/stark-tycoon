import { useDynamicConnector } from "@/contexts/starknet";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

interface ControllerContextType {
  account: ReturnType<typeof useAccount>["account"];
  address: string | undefined;
  playerName: string;
  isPending: boolean;
  openProfile: () => void;
  login: () => void;
  logout: () => void;
}

const ControllerContext = createContext<ControllerContextType>(
  {} as ControllerContextType
);

export function ControllerProvider({ children }: PropsWithChildren) {
  const { account, address, isConnecting } = useAccount();
  const { connector, connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { currentNetworkConfig: _ } = useDynamicConnector();
  const [playerName, setPlayerName] = useState<string>("");

  useEffect(() => {
    const getUsername = async () => {
      try {
        const name = await (connector as any)?.username();
        if (name) setPlayerName(name);
      } catch {
        // connector may not support username
      }
    };
    if (connector) getUsername();
  }, [connector]);

  return (
    <ControllerContext.Provider
      value={{
        account,
        address,
        playerName,
        isPending: isConnecting || isPending,
        openProfile: () => (connector as any)?.controller?.openProfile(),
        login: () =>
          connect({
            connector: connectors.find((c) => c.id === "controller") ?? connectors[0],
          }),
        logout: () => disconnect(),
      }}
    >
      {children}
    </ControllerContext.Provider>
  );
}

export function useController() {
  const ctx = useContext(ControllerContext);
  if (!ctx)
    throw new Error("useController must be used within ControllerProvider");
  return ctx;
}
