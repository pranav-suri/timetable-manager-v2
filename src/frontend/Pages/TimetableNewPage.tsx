import React, { useState } from "react";
import { NavBar } from "../Components";
import OldNavBar from "../Components/NavBar/OldNavBar";
import OldTimetable from "../Components/Timetable/OldTimetable";
import { styled, useTheme } from "@mui/material/styles";
import { useImmer } from "use-immer";
import {
    Box,
    Drawer,
    AppBar as MuiAppBar,
    AppBarProps as MuiAppBarProps,
    Toolbar,
    CssBaseline,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Autocomplete,
    TextField,
} from "@mui/material";
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    MoveToInbox as InboxIcon,
    Mail as MailIcon,
} from "@mui/icons-material";
import {
    SubjectResponse,
    TeacherResponse,
    TimetableResponse,
} from "../../backend/api/routes/responseTypes";
import api from "../index";
import { DrawerHeader, DrawerRight } from "../Components/Sidebar/Drawer";

type Timetable = TimetableResponse["timetable"];
type Slots = Timetable["slots"];
type SlotDatas = Slots[0]["SlotDatas"];
type SlotDataClasses = SlotDatas[0]["SlotDataClasses"];
type SlotDataSubdivisions = SlotDatas[0]["SlotDataSubdivisions"];

const drawerwidth = 290;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "drawerState" })<{
    drawerState?: boolean;
    drawerwidth: number;
}>(
    ({
        theme,
        drawerState,
        drawerwidth
    }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: -drawerwidth,
        ...(drawerState && {
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: 0,
        }),
        /**
         * This is necessary to enable the selection of content. In the DOM, the stacking order is determined
         * by the order of appearance. Following this rule, elements appearing later in the markup will overlay
         * those that appear earlier. Since the Drawer comes after the Main content, this adjustment ensures
         * proper interaction with the underlying content.
         */
        position: "relative",
    }),
);

export default function TimetableNewPage() {
    const [timetableData, setTimetable] = useImmer<TimetableResponse | null>(null);
    const [drawerState, setDrawerState] = useState(false);
    const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
    const handleDrawerOpen = () => {
        setDrawerState(true);
    };

    const handleDrawerClose = () => {
        setDrawerState(false);
    };

    return (
        <>
            <Box sx={{ display: "flex" }}>
                <OldNavBar
                    setTimetable={setTimetable}
                    drawerState={drawerState}
                    drawerwidth={drawerwidth}
                />

                <Main drawerState={drawerState} drawerwidth={drawerwidth}>
                    <DrawerHeader />
                    <OldTimetable
                        timetableData={timetableData}
                        handleDrawerOpen={handleDrawerOpen}
                        setSelectedSlotIndex={setSelectedSlotIndex}
                    />
                </Main>
                <DrawerRight
                    setTimetable={setTimetable}
                    drawerwidth={drawerwidth}
                    handleDrawerClose={handleDrawerClose}
                    drawerState={drawerState}
                    selectedSlotIndex={selectedSlotIndex}
                    timetableData={timetableData}
                />
            </Box>
        </>
    );
}
