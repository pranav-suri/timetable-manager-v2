import { ThemeProvider, createTheme } from "@mui/material";
import React from "react";

const theme = createTheme({
    palette: {
        primary: {
            main: "hsl(63, 100%, 85%)",
        },
        secondary: {
            main: "#00ff00",
        },
    },
});

function TTManagerTheme({ children }: { children: React.ReactNode }) {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default TTManagerTheme;
