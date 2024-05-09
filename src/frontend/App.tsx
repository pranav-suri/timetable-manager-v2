import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Timetable from "./Pages/Timetable";
import { TimetableDataContextProvider } from "./context/TimetableDataContext";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.css";
import TimetableNewPage from "./Pages/TimetableNewPage";
import TimetableCombined from "./Pages/TimetableCombined";
import LandingPage from "./Pages/LandingPage";
import DataUpload from "./Pages/DataUpload";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppBar, PaletteMode, Toolbar } from "@mui/material";
import { ThemeModeContext } from "./context/ThemeModeContext";
import { DarkMode } from "./Components/Buttons";

const getTheme = (mode: PaletteMode) => {
    return createTheme({
        palette: {
            mode,
            ...(mode === "light"
                ? {
                      primary: {
                          main: "#6DBF6F",
                      },
                      secondary: {
                          main: "#5151d4",
                      },
                  }
                : {
                      primary: {
                          main: "#509a52",
                      },
                      secondary: {
                          main: "#5f5fff",
                      },
                  }),
        },
    });
};

export default function App() {
    const { themeMode } = useContext(ThemeModeContext);
    return (
        <ThemeProvider theme={getTheme(themeMode)}>
            <CssBaseline />
            <Router>
                <Routes>
                    <Route path="pranavTT" element={<TimetableNewPage />} />
                    <Route
                        path="/new"
                        element={
                            <TimetableDataContextProvider>
                                <Timetable />
                            </TimetableDataContextProvider>
                        }
                    />
                    <Route
                        path="/combined"
                        element={
                            <TimetableDataContextProvider>
                                <TimetableCombined />
                            </TimetableDataContextProvider>
                        }
                    />
                    <Route
                        path="/landing"
                        element={
                            <TimetableDataContextProvider>
                                <LandingPage />
                            </TimetableDataContextProvider>
                        }
                    />
                    <Route path="/" element={<TimetableNewPage />} />
                    <Route
                        path="/upload"
                        element={
                            <>
                                <AppBar color="transparent">
                                    <Toolbar>
                                        <div style={{ flexGrow: 1 }} />
                                        <DarkMode />
                                    </Toolbar>
                                </AppBar>
                                <div
                                    style={{
                                        minHeight: "100vh",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <DataUpload />
                                </div>
                            </>
                        }
                    />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}
