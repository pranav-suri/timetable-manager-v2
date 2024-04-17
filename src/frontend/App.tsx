import {
    AppBar,
    Button,
    CircularProgress,
    Toolbar,
    ButtonGroup,
    Paper,
    ClickAwayListener,
    MenuList,
    MenuItem,
    Popper,
    Grow,
    Typography,
} from "@mui/material";
import {
    ArrowDropDown as ArrowDropDownIcon,
    ArrowDropUp as ArrowDropUpIcon,
} from "@mui/icons-material";
import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { TimetableResponse } from "../backend/api/routes/responseTypes";
import Timetable from "./Pages/Timetable";
import { TimetableDataContext } from "./context/TimetableDataContext";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.css";
import OldNavBar from "./Components/NavBar/OldNavBar";
import OldTimetable from "./Components/Timetable/OldTimetable";
import { PersistentDrawerRight } from "./Components/Sidebar/Drawer";

export default function App() {
    const data = useContext(TimetableDataContext);
    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <OldNavBar>
                            <OldTimetable />
                        </OldNavBar>
                    }
                />
                <Route path="new" element={<Timetable />} />
                <Route path="/" element={<Timetable />} />
                <Route path="drawer" element={<PersistentDrawerRight />} />
            </Routes>
        </Router>
    );
}
