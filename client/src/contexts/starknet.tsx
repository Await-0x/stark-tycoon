import type { NetworkConfig } from "@/utils/networkConfig";
import { getNetworkConfig } from "@/utils/networkConfig";
import ControllerConnector from "@cartridge/connector/controller";
import { mainnet, sepolia } from "@starknet-react/chains";
import {
  argent,
  braavos,
  jsonRpcProvider,
  StarknetConfig,
  useInjectedConnectors,
  voyager,
} from "@starknet-react/core";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

interface DynamicConnectorContextType {
  currentNetworkConfig: NetworkConfig;
  setCurrentNetworkConfig: (config: NetworkConfig) => void;
}

const DynamicConnectorContext =
  createContext<DynamicConnectorContextType | null>(null);

const controllerConfig = getNetworkConfig();

const cartridgeController =
  typeof window !== "undefined"
    ? new ControllerConnector({
        policies: controllerConfig.policies,
        slot: controllerConfig.slot,
        preset: controllerConfig.preset,
        chains: controllerConfig.chains,
        propagateSessionErrors: true,
      })
    : null;

export function DynamicConnectorProvider({ children }: PropsWithChildren) {
  const [currentNetworkConfig, setCurrentNetworkConfig] =
    useState(controllerConfig);

  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "onlyIfNoConnectors",
  });

  const rpc = useCallback(
    () => ({ nodeUrl: controllerConfig.chains[0].rpcUrl }),
    []
  );

  const allConnectors = cartridgeController
    ? [...connectors, cartridgeController]
    : connectors;

  return (
    <DynamicConnectorContext.Provider
      value={{ currentNetworkConfig, setCurrentNetworkConfig }}
    >
      <StarknetConfig
        chains={[mainnet, sepolia]}
        provider={jsonRpcProvider({ rpc })}
        connectors={allConnectors}
        explorer={voyager}
        autoConnect
      >
        {children}
      </StarknetConfig>
    </DynamicConnectorContext.Provider>
  );
}

export function useDynamicConnector() {
  const ctx = useContext(DynamicConnectorContext);
  if (!ctx)
    throw new Error(
      "useDynamicConnector must be used within DynamicConnectorProvider"
    );
  return ctx;
}
