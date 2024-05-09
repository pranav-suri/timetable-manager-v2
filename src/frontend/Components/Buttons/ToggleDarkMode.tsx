import { IconButton, Tooltip } from "@mui/material";
import React, { useContext } from "react";
import { ThemeModeContext } from "../../context/ThemeModeContext";
import { DarkMode as DarkModeIcon, LightMode as LightModeIcon } from "@mui/icons-material";

export default function DarkMode() {
    const { themeMode, setThemeMode } = useContext(ThemeModeContext);
    const handleOnClick = () => {
        setThemeMode(themeMode === "dark" ? "light" : "dark");
    };

    return (
        <Tooltip title={`Switch to ${themeMode === "dark" ? "light" : "dark"} mode`}>
            <IconButton onClick={handleOnClick}>
                {themeMode === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
        </Tooltip>
    );
}
