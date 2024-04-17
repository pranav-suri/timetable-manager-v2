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
import OldNavBar from "./Components/OldNavBar";

type Timetable = TimetableResponse["timetable"];
type Slots = Timetable["slots"];
type SlotDatas = Slots[0]["SlotDatas"];
type SlotDataClasses = SlotDatas[0]["SlotDataClasses"];
type SlotDataSubdivisions = SlotDatas[0]["SlotDataSubdivisions"];

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
            {/* Check if teacher exists */}
            {slotDataItem.Teacher?.teacherName} <br />
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
                    const slotIndex = timetable.slots.findIndex(
                        (slot) => slot.day == day && slot.number == slotNumber,
                    );
                    return (
                        <td key={slotNumber}>{renderSlot(timetable.slots[slotIndex].SlotDatas)}</td>
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

const timetableJson = await (await fetch("http://localhost:3000/divisions/2/timetable")).json();

function RenderTimetable() {
    const data = useContext(TimetableDataContext) ?? timetableJson;
    const slotNumbers = new Set<Slots[0]["number"]>();
    const slotDays = new Set<Slots[0]["day"]>();

    console.log(data);

    data.timetable.slots.forEach((slot) => {
        slotNumbers.add(slot.number);
        slotDays.add(slot.day);
    });
    return (
        <table>
            <thead>{renderHeaders(slotNumbers)}</thead>
            <tbody>
                {Array.from(slotDays)
                    .sort()
                    .map((day) => renderRow(data.timetable, day, slotNumbers))}
            </tbody>
        </table>
    );
}

export default function App() {
    const data = useContext(TimetableDataContext);
    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <OldNavBar>
                            <RenderTimetable />
                        </OldNavBar>
                    }
                />
                <Route path="new" element={<Timetable />} />
            </Routes>
        </Router>
    );
}
