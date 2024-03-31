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
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

function printClasses(slotDataClasses: SlotDataClasses) {
    return slotDataClasses.map((slotDataClass, slotDataClassIndex) => (
        <React.Fragment key={slotDataClassIndex}>
            {" "}
            {slotDataClass.Classroom.classroomName}
            {","}
        </React.Fragment>
    ));
}
function printSubdivisions(slotDataSubdivisions: SlotDataSubdivisions) {
    return slotDataSubdivisions.map((slotDataSubdivision, slotDataSubdivisionIndex) => (
        <React.Fragment key={slotDataSubdivisionIndex}>
            {" "}
            {slotDataSubdivision.Subdivision.subdivisionName}
            {","}
        </React.Fragment>
    ));
}
function renderCell(slotDataItem: SlotDatas[0]) {
    return (
        <td>
            {slotDataItem.Teacher.teacherName} <br />
            {slotDataItem.Subject.subjectName} <br />
            {printSubdivisions(slotDataItem.SlotDataSubdivisions)} <br />
            {printClasses(slotDataItem.SlotDataClasses)}
        </td>
    );
}
function renderSlot(slotDatas: SlotDatas) {
    return (
        <React.Fragment>
            <table>
                {slotDatas.map((dataItem, slotDataIndex: number) => (
                    <tr key={slotDataIndex}>{renderCell(dataItem)}</tr>
                ))}
            </table>
        </React.Fragment>
    );
}

function renderRow(
    timetable: Timetable,
    day: number | string,
    slotNumbers: Set<Slots[0]["number"]>,
) {
    return (
        <tr>
            <th>{day}</th>
            {Array.from(slotNumbers)
                .sort()
                .map((slotNumber) => {
                    const slotIndex = timetable.Slots.findIndex(
                        (slot) => slot.day == day && slot.number == slotNumber,
                    );
                    return (
                        <td key={slotNumber}>{renderSlot(timetable.Slots[slotIndex].SlotDatas)}</td>
                    );
                })}
        </tr>
    );
}

function renderHeaders(slotNumbers: Set<Slots[0]["number"]>) {
    const headers = (
        <>
            <th key="days-slots-header">Days/Slots</th>
            {Array.from(slotNumbers)
                .sort()
                .map((slotNumber) => (
                    <th key={slotNumber}>{slotNumber}</th>
                ))}
        </>
    );
    return headers;
}

function renderTimetable(data: TimetableStructure) {
    const slotNumbers = new Set<Slots[0]["number"]>();
    const slotDays = new Set<Slots[0]["day"]>();

    data.Timetable.Slots.forEach((slot) => {
        slotNumbers.add(slot.number);
        slotDays.add(slot.day);
    });
    return (
        <table>
            <thead>{renderHeaders(slotNumbers)}</thead>
            <tbody>
                {Array.from(slotDays)
                    .sort()
                    .map((day) => renderRow(data.Timetable, day, slotNumbers))}
            </tbody>
        </table>
    );
}

const fetchAcademicYears = async () => {
    const response = await fetch("http://localhost:3000/academicYears");
    return response.json();
};

export default function Timetable() {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const [data, setData] = useState<TimetableStructure | null>(null);

    const fetchTimetable = (
        setData: React.Dispatch<React.SetStateAction<TimetableStructure | null>>,
        url: string,
    ) => {
        if (!url) return;
        fetch(url)
            .then((response) => response.json())
            .then((data) => setData(data));
    };

    const options: { label: string; url: string }[] = [
        { label: "Division", url: "http://localhost:3000/divisionTimetable/?divisionId=2" },
        { label: "Teacher", url: "http://localhost:3000/teacherTimetable/?teacherId=1" },
        { label: "Classroom", url: "http://localhost:3000/classroomTimetable/?classroomId=1" },
    ];

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setOpen(false);
        fetchTimetable(setData, options[index].url);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: Event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }

        setOpen(false);
    };

    if (!data) {
        fetchTimetable(setData, options[selectedIndex].url);
    }

    return (
        <Router>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="button" mr={2}>
                        <Paper variant="elevation">Timetable Type:</Paper>
                    </Typography>
                    <ButtonGroup
                        variant="contained"
                        aria-label="Button group with a nested menu"
                        id="split-button-menu"
                        ref={anchorRef}
                    >
                        <Button onClick={handleToggle}>{options[selectedIndex].label}</Button>
                        <Button
                            size="small"
                            aria-controls={open ? "split-button-menu" : undefined}
                            aria-expanded={open ? "true" : undefined}
                            aria-label="select timetable type"
                            aria-haspopup="menu"
                            onClick={handleToggle}
                        >
                            {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                        </Button>
                    </ButtonGroup>
                    <Popper
                        sx={{
                            zIndex: 1,
                        }}
                        open={open}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        transition
                        disablePortal
                    >
                        {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            ({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin:
                                            placement === "bottom" ? "center top" : "center bottom",
                                    }}
                                >
                                    <Paper>
                                        <ClickAwayListener onClickAway={handleClose}>
                                            <MenuList id="split-button-menu" autoFocusItem>
                                                {options.map((option, index) => (
                                                    <MenuItem
                                                        key={option.label}
                                                        selected={index === selectedIndex}
                                                        onClick={(event) =>
                                                            handleMenuItemClick(event, index)
                                                        }
                                                    >
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )
                        }
                    </Popper>
                </Toolbar>
            </AppBar>
            <Routes>
                <Route path="*" element={<Navigate to={"division"} />} />
                <Route
                    path="division"
                    element={data ? renderTimetable(data) : <CircularProgress />}
                />
                <Route
                    path="teacher"
                    element={data ? renderTimetable(data) : <CircularProgress />}
                />
                <Route
                    path="classroom"
                    element={data ? renderTimetable(data) : <CircularProgress />}
                />
            </Routes>
        </Router>
    );
}
