import React from "react";
import { AppBar, Toolbar } from "@mui/material";
import {
    AcademicYear as AcademicYearButton,
    Batch as BatchButton,
    Department as DepartmentButton,
    Division as DivisionButton,
    View as ViewButton,
    TimetableType as TimetableTypeButton,
    Teacher as TeacherButton,
    Classroom as ClassroomButton,
} from "../Buttons";

const NavBar = () => {
    // TODO: #7 @MatricalDefunkt Implement the ability to select an academic year, batch, division and thus a timetable
    // TODO: #8 @MatricalDefunkt Add the feature to remove selected values if a previous value is changed
    return (
        <AppBar position="fixed" sx={{ padding: "0.5rem" }}>
            <Toolbar>
                <TimetableTypeButton />
                <AcademicYearButton />
                <TeacherButton />
                <ClassroomButton />
                <BatchButton />
                <DepartmentButton />
                <DivisionButton />
                {/* Spacer element to push the next elements to the right */}
                <div style={{ flexGrow: 1 }}></div>
                <ViewButton />
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
