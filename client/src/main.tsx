import { createRoot } from "react-dom/client";
import { DynamicConnectorProvider } from "@/contexts/starknet";
import App from "./App";
import "./index.css";

async function main() {
  createRoot(document.getElementById("root")!).render(
    <DynamicConnectorProvider>
      <App />
    </DynamicConnectorProvider>
  );
}

main().catch((error) => {
  console.error("Failed to initialize the application:", error);
});
