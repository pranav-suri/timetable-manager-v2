import { AppBar, Toolbar } from "@mui/material";
import React from "react";
import { Button } from "../Buttons";
import TTManagerTheme from "../TTManagerTheme";

const NavBar = () => {
    // TODO: #7 @MatricalDefunkt Implement the ability to select an academic year, batch, division and thus a timetable

    return (
        <AppBar position="static">
            <Toolbar>
                <Button />
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
