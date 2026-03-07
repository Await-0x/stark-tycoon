import type { NetworkConfig } from "@/utils/networkConfig";
import { getNetworkConfig } from "@/utils/networkConfig";
import ControllerConnector from "@cartridge/connector/controller";
import { sepolia } from "@starknet-react/chains";
import {
  jsonRpcProvider,
  StarknetConfig,
  voyager
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
      namespace: controllerConfig.namespace,
      chains: controllerConfig.chains,
      propagateSessionErrors: true,
      shouldOverridePresetPolicies: true,
    })
    : null;

export function DynamicConnectorProvider({ children }: PropsWithChildren) {
  const [currentNetworkConfig, setCurrentNetworkConfig] =
    useState(controllerConfig);

  const rpc = useCallback(() => {
    return { nodeUrl: controllerConfig.chains[0].rpcUrl };
  }, []);

  return (
    <DynamicConnectorContext.Provider
      value={{ currentNetworkConfig, setCurrentNetworkConfig }}
    >
      <StarknetConfig
        chains={[sepolia]}
        provider={jsonRpcProvider({ rpc })}
        connectors={[cartridgeController as any]}
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
