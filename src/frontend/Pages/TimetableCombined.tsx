import React, { useContext, useState } from "react";
import OldTimetable from "../Components/Timetable/OldTimetable";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

import { DrawerHeader, DrawerRight } from "../Components/Sidebar/Drawer";
import { NavBar } from "../Components";
import { TimetableDataContext } from "../context/TimetableDataContext";
import { SelectedValuesProvider } from "../context/SelectedValuesContext";
import MuiTimetable from "../Components/Timetable/MuiTimetable";

const drawerwidth = 300;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "drawerState" })<{
    drawerState?: boolean;
    drawerwidth: number;
}>(({ theme, drawerState, drawerwidth }) => ({
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
}));

export default function TimetableCombined() {
    const [drawerState, setDrawerState] = useState(false);
    const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
    const { timetable, setTimetable } = useContext(TimetableDataContext);
    const handleDrawerOpen = () => {
        setDrawerState(true);
    };

    const handleDrawerClose = () => {
        setDrawerState(false);
    };

    return (
        <>
            <Box sx={{ display: "flex" }}>
                <SelectedValuesProvider>
                    <NavBar />

                    <Main drawerState={drawerState} drawerwidth={drawerwidth}>
                        <DrawerHeader />
                        <MuiTimetable
                            timetableData={timetable.available ? timetable.timetableData : null}
                            handleDrawerOpen={handleDrawerOpen}
                            setSelectedSlotIndex={setSelectedSlotIndex}
                        />
                    </Main>
                    <DrawerRight
                        setTimetable={setTimetable}
                        drawerwidth={drawerwidth}
                        handleDrawerClose={handleDrawerClose}
                        setSelectedSlotIndex={setSelectedSlotIndex}
                        drawerState={drawerState}
                        selectedSlotIndex={selectedSlotIndex}
                        timetableData={timetable.available ? timetable.timetableData : null}
                    />
                </SelectedValuesProvider>
            </Box>
        </>
    );
}
