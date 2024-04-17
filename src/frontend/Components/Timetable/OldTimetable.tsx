import React, { useContext } from "react";
import { TimetableResponse } from "../../../backend/api/routes/responseTypes";
import { TimetableDataContext } from "../../context/TimetableDataContext";

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
                <tbody>
                    {slotDatas.map((dataItem, slotDataIndex: number) => (
                        <tr key={slotDataIndex}>{renderCell(dataItem)}</tr>
                    ))}
                </tbody>
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

export default function OldTimetable() {
    const data = useContext(TimetableDataContext) ?? timetableJson;
    const slotNumbers = new Set<Slots[0]["number"]>();
    const slotDays = new Set<Slots[0]["day"]>();

    data.timetable.slots.forEach((slot) => {
        slotNumbers.add(slot.number);
        slotDays.add(slot.day);
    });
    return (
        <table>
            <thead>
                <tr>{renderHeaders(slotNumbers)}</tr>
            </thead>
            <tbody>
                {Array.from(slotDays)
                    .sort()
                    .map((day) => (
                        <React.Fragment key={day}>
                            {renderRow(data.timetable, day, slotNumbers)}
                        </React.Fragment>
                    ))}
            </tbody>
        </table>
    );
}
