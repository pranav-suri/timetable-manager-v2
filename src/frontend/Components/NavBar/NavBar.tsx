import React from "react";
import { AppBar, Toolbar } from "@mui/material";
import {
    AcademicYear as AcademicYearButton,
    Batch as BatchButton,
    Department as DepartmentButton,
    Division as DivisionButton,
    View as ViewButton,
} from "../Buttons";
import { SelectedValuesProvider } from "../../context/SelectedValuesContext";

const NavBar = () => {
    // TODO: #7 @MatricalDefunkt Implement the ability to select an academic year, batch, division and thus a timetable

    return (
        <SelectedValuesProvider>
            <AppBar position="static" sx={{ padding: "0.5rem" }}>
                <Toolbar>
                    <AcademicYearButton />
                    <BatchButton />
                    <DepartmentButton />
                    <DivisionButton />
                    {/* Spacer element to push the next elements to the right */}
                    <div style={{ flexGrow: 1 }}></div>
                    <ViewButton />
                </Toolbar>
            </AppBar>
        </SelectedValuesProvider>
    );
};

export default NavBar;
