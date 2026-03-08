import {
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material/styles";
import { DenshokanProvider } from "@provable-games/denshokan-sdk/react";
import { SnackbarProvider } from "notistack";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ControllerProvider } from "@/contexts/controller";
import { GameDirector } from "@/contexts/GameDirector";
import { mainTheme } from "@/utils/themes";
import { GameScreen } from "@/components/GameScreen";
import { MainMenu } from "@/components/MainMenu";

function App() {
  return (
    <BrowserRouter>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={mainTheme}>
          <DenshokanProvider config={{ chain: "sepolia" }}>
            <SnackbarProvider
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              preventDuplicate
            >
              <ControllerProvider>
                <Routes>
                  <Route path="/" element={<MainMenu />} />
                  <Route
                    path="/play"
                    element={
                      <GameDirector>
                        <GameScreen />
                      </GameDirector>
                    }
                  />
                </Routes>
              </ControllerProvider>
            </SnackbarProvider>
          </DenshokanProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </BrowserRouter>
  );
}

export default App;
