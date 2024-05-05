import React, { useContext, useState } from "react";
import { NavBar } from "../Components";
import OldTimetable from "../Components/Timetable/OldTimetable";
import { TimetableResponse } from "../../backend/api/routes/responseTypes";
import { useImmer } from "use-immer";
import { TimetableDataContext } from "../context/TimetableDataContext";

export default function Timetable() {
    const [drawerState, setDrawerState] = useState(false);
    const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
    const { timetable, setTimetable, setAvailable } = useContext(TimetableDataContext);
    const handleDrawerOpen = () => {
        setDrawerState(true);
    };

    const handleDrawerClose = () => {
        setDrawerState(false);
    };

    return (
        <React.Fragment>
            <NavBar />
            <OldTimetable
                handleDrawerOpen={() => console.log("Called handler")}
                setSelectedSlotIndex={setSelectedSlotIndex}
                timetableData={timetable.available ? timetable.timetableData : null}
            />
        </React.Fragment>
    );
}
