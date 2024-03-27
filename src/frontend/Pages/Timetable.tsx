import React, { useState, useEffect } from "react";
interface TimetableStructure {
    Timetable: {
        Slots: [
            {
                id: number;
                day: number;
                number: number;
                AcademicYearId: number;
                SlotData: [
                    {
                        id: number;
                        Teacher: {
                            id: number;
                            teacherName: string;
                            teacherEmail: string;
                        };
                        Subject: {
                            id: number;
                            isLab: boolean;
                            subjectName: string;
                        };
                        Subdivision: {
                            id: number;
                            subdivisionName: string;
                        };
                        SlotDataClasses: [
                            {
                                id: number;
                                ClassroomId: number;
                                SlotDataId: number;
                                Classroom: {
                                    id: number;
                                    classroomName: string;
                                    isLab: boolean;
                                };
                            },
                        ];
                    },
                ];
            },
        ];
    };
}
type Timetable = TimetableStructure["Timetable"];
type Slots = Timetable["Slots"];
type SlotData = Slots[0]["SlotData"];
type SlotDataClasses = SlotData[0]["SlotDataClasses"];
type SlotDataClass = SlotDataClasses[0];
type Classroom = SlotDataClass["Classroom"];
function printClasses(slotDataClasses: SlotDataClasses) {
    console.log(slotDataClasses);
    return slotDataClasses.map((slotDataClass, slotDataClassIndex) => (
        <React.Fragment key={slotDataClassIndex}>
            {" "}
            {slotDataClass.Classroom.classroomName}{" "}
        </React.Fragment>
    ));
}
function renderCell(slotDataItem: SlotData[0]) {
    return (
        <td>
            {slotDataItem.Teacher.teacherName} <br />
            {slotDataItem.Subject.subjectName} <br />
            {slotDataItem.Subdivision.subdivisionName} <br />
            {printClasses(slotDataItem.SlotDataClasses)}
        </td>
    );
}
function renderSlot(slotData: SlotData) {
    return (
        <React.Fragment>
            <table>
                {slotData.map((dataItem, slotDataIndex: number) => (
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
                        <td key={slotNumber}>{renderSlot(timetable.Slots[slotIndex].SlotData)}</td>
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
export default function Timetable() {
    const [data, setData] = useState<TimetableStructure | null>(null);

    useEffect(() => {
        fetch("http://localhost:3000/divisionTimetable/?divisionId=2")
            .then((response) => response.json())
            .then((json: TimetableStructure) => setData(json))
            .catch((error) => console.error(error));
    }, []);
    let renderedTT = null;
    if (data) {
        renderedTT = renderTimetable(data);
    }
    return <table>{renderedTT}</table>;
}
