import React, { createContext, useState } from "react";
import { PaletteMode } from "@mui/material";

type ThemeModeContextType = {
    themeMode: PaletteMode;
    setThemeMode: React.Dispatch<React.SetStateAction<PaletteMode>>;
};

const ThemeModeContext = createContext<ThemeModeContextType>({
    themeMode: "dark",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setThemeMode: () => {},
});

const ThemeModeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [themeMode, setThemeMode] = useState<PaletteMode>("dark");

    return (
        <ThemeModeContext.Provider value={{ themeMode, setThemeMode }}>
            {children}
        </ThemeModeContext.Provider>
    );
};

export { ThemeModeContext, ThemeModeContextProvider };
