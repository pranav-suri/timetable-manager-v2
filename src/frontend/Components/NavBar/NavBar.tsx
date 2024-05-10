import React, { useContext } from "react";
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
    Generate as GenerateButton,
    ToggleAllData as AllDataSwitch,
    Print as PrintButton,
    DarkMode as DarkModeSwitch,
} from "../Buttons";
import { ThemeModeContext } from "../../context/ThemeModeContext";

export const NavBar = ({ pdfComponent }: { pdfComponent: React.RefObject<HTMLDivElement> }) => {
    // TODO: #7 @MatricalDefunkt Implement the ability to select an academic year, batch, division and thus a timetable
    // TODO: #8 @MatricalDefunkt Add the feature to remove selected values if a previous value is changed
    const { themeMode } = useContext(ThemeModeContext);
    return (
        <AppBar
            position="fixed"
            sx={{
                padding: "0.5rem",
                backdropFilter: "blur(16px)",
                backgroundColor: `hsla(0, 0%, ${themeMode === "dark" ? "30%" : "60%"}, 50%)`,
            }}
            color="transparent"
        >
            <Toolbar>
                <TimetableTypeButton />
                <AcademicYearButton />
                <TeacherButton />
                <ClassroomButton />
                <BatchButton />
                <DepartmentButton />
                <DivisionButton />
                <ViewButton />
                {/* Spacer element to push the next elements to the right */}
                <div style={{ flexGrow: 1 }}></div>
                <GenerateButton />
                <PrintButton pdfComponent={pdfComponent} />
                <AllDataSwitch />
                <DarkModeSwitch />
            </Toolbar>
        </AppBar>
    );
};
