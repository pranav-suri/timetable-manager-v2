import React, { useContext, useState } from "react";
import { NavBar } from "../Components";
import OldTimetable from "../Components/Timetable/OldTimetable";
import { TimetableDataContext } from "../context/TimetableDataContext";
import { DrawerHeader } from "../Components/Sidebar/Drawer";

export default function Timetable() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setSelectedSlotIndex] = useState<number | null>(null);
    const { timetable } = useContext(TimetableDataContext);

    return (
        <React.Fragment>
            <NavBar />
            <DrawerHeader />
            <OldTimetable
                handleDrawerOpen={() => console.log("Called handler")}
                setSelectedSlotIndex={setSelectedSlotIndex}
                timetableData={timetable.available ? timetable.timetableData : null}
            />
        </React.Fragment>
    );
}
