import React, { useState, useEffect } from "react";
interface TimetableStructure {
    Timetables: [
        {
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
                                }
                            ];
                        }
                    ];
                }
            ];
        }
    ];
}
type Timetables = TimetableStructure["Timetables"];
type Slots = Timetables[0]["Slots"];
type SlotData = Slots[0]["SlotData"];
type SlotDataClasses = SlotData[0]["SlotDataClasses"];
type SlotDataClass = SlotDataClasses[0];
type Classroom = SlotDataClass["Classroom"];
function printClasses(
    slotDataClasses: SlotDataClasses
) {
    console.log(slotDataClasses);
    return slotDataClasses.map((slotDataClass, slotDataClassIndex) => (
        <React.Fragment key={slotDataClassIndex}> {slotDataClass.Classroom.classroomName} </React.Fragment>
    ));
}
function renderCell(slotDataItem: TimetableStructure["Timetables"][0]["Slots"][0]["SlotData"][0]) {
    return (
        <td>
            {slotDataItem.Teacher.teacherName} <br />
            {slotDataItem.Subject.subjectName} <br />
            {slotDataItem.Subdivision.subdivisionName} <br />
            {printClasses(slotDataItem.SlotDataClasses)}
        </td>
    );
}
function renderSubdivisionSlot(
    slotData: TimetableStructure["Timetables"][0]["Slots"][0]["SlotData"]
) {
    return (
        <React.Fragment>
            {slotData.map((dataItem, slotDataIndex: number) => (
                <tr key={slotDataIndex}>{renderCell(dataItem)}</tr>
            ))}
        </React.Fragment>
    );
}

function renderCompleteSlot(timetables: TimetableStructure["Timetables"], slotIndex: number) {
    return (
        <React.Fragment>
            <table>
                {timetables.map((timetable) => (
                    <React.Fragment>
                        {renderSubdivisionSlot(timetable.Slots[slotIndex].SlotData)}
                    </React.Fragment>
                ))}
            </table>
        </React.Fragment>
    );
}

function renderRow(
    timetables: TimetableStructure["Timetables"],
    day: number | string,
    slotNumbers: Set<TimetableStructure["Timetables"][0]["Slots"][0]["number"]>
) {
    return (
        <tr>
            <th>{day}</th>
            {Array.from(slotNumbers)
                .sort()
                .map((slotNumber) => {
                    const slotIndex = timetables[0].Slots.findIndex(
                        (slot) => slot.day == day && slot.number == slotNumber
                    );
                    return <td key={slotNumber}>{renderCompleteSlot(timetables, slotIndex)}</td>;
                })}
        </tr>
    );
}

function renderHeaders(
    slotNumbers: Set<TimetableStructure["Timetables"][0]["Slots"][0]["number"]>
) {
    const headers = (
        <>
            <th>Days/Slots</th>
            {Array.from(slotNumbers)
                .sort()
                .map((slotNumber) => (
                    <th>{slotNumber}</th>
                ))}
        </>
    );
    return headers;
}

function renderTimetable(data: TimetableStructure) {
    const slotNumbers = new Set<TimetableStructure["Timetables"][0]["Slots"][0]["number"]>();
    const slotDays = new Set<TimetableStructure["Timetables"][0]["Slots"][0]["day"]>();

    data.Timetables[0].Slots.forEach((slot) => {
        slotNumbers.add(slot.number);
        slotDays.add(slot.day);
    });
    return (
        <table>
            <thead>{renderHeaders(slotNumbers)}</thead>
            <tbody>
                {Array.from(slotDays)
                    .sort()
                    .map((day) => renderRow(data.Timetables, day, slotNumbers))}
            </tbody>
        </table>
    );
}
export default function Timetable() {
    const [data, setData] = useState<TimetableStructure | null>(null);

    useEffect(() => {
        fetch("http://localhost:3000/create/1/?departmentId=2&divisionId=2&batchId=2")
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
