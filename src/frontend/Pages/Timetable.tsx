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
                            SlotDataClass: [
                                {
                                    id: number;
                                    name: string;
                                    isLab: boolean;
                                }
                            ];
                        }
                    ];
                }
            ];
        }
    ];
}
function printClasses(
    slotDataClass: TimetableStructure["Timetables"][0]["Slots"][0]["SlotData"][0]["SlotDataClass"]
) {
    return slotDataClass.map((slotDataClass, slotDataClassIndex) => (
        <React.Fragment key={slotDataClassIndex}>
            {slotDataClass.name}
        </React.Fragment>
    ));
}
function renderCell(
    slotDataItem: TimetableStructure["Timetables"][0]["Slots"][0]["SlotData"][0]
) {
    return (
        <td>
            {slotDataItem.Teacher.teacherName} <br />
            {slotDataItem.Subject.subjectName} <br />
            {slotDataItem.Subdivision.subdivisionName} <br />
            {printClasses(slotDataItem.SlotDataClass)}
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

// Find index of a slot in Timetables
function findSlotIndex(
    slots: TimetableStructure["Timetables"][0]["Slots"],
    slotId: number
) {
    return slots.findIndex((slot) => slot.id == slotId);
}

function renderCompleteSlot(
    timetables: TimetableStructure["Timetables"],
    slotId: number
) {
    return (
        <React.Fragment>
            <table>
                {timetables.map((timetable) => (
                    <React.Fragment>
                        {renderSubdivisionSlot(
                            timetable.Slots[
                                findSlotIndex(timetable.Slots, slotId)
                            ].SlotData
                        )}
                    </React.Fragment>
                ))}
            </table>
        </React.Fragment>
    );
}

function renderRow(
    timetables: TimetableStructure["Timetables"],
    day: number | string
) {
    return (
        <tr>
            <th>{day}</th>
            {timetables[0].Slots.map((slot) => {
                if (slot.day == day) {
                    return <td>{renderCompleteSlot(timetables, slot.id)}</td>;
                }
                return null;
            })}
        </tr>
    );
}

function renderHeaders(
    slotNumbers: Set<TimetableStructure["Timetables"][0]["Slots"][0]["number"]>
) {
    const headers = (
        <>
            <th>Days</th>
            {Array.from(slotNumbers).map((slotNumber) => (
                <th>{slotNumber}</th>
            ))}
        </>
    );
    return headers;
}

function renderTimetable(data: TimetableStructure) {
    const slotNumbers = new Set<
        TimetableStructure["Timetables"][0]["Slots"][0]["number"]
    >();
    const slotDays = new Set<
        TimetableStructure["Timetables"][0]["Slots"][0]["day"]
    >();

    data.Timetables[0].Slots.forEach((slot) => {
        slotNumbers.add(slot.number);
        slotDays.add(slot.day);
    });
    return (
        <table>
            <thead>{renderHeaders(slotNumbers)}</thead>
            <tbody>
                {Array.from(slotDays).map((day) =>
                    renderRow(data.Timetables, day)
                )}
            </tbody>
        </table>
    );
}
export default function Timetable() {
    const [data, setData] = useState<TimetableStructure | null>(null);

    useEffect(() => {
        fetch(
            "http://localhost:3000/create/1/?departmentId=1&divisionId=1&batchId=1"
        )
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
