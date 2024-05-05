import React, { useRef } from "react";
import { TimetableResponse } from "../../../backend/api/routes/responseTypes";
import { checkIfSlotDataExists } from "../fetchAndSet";
import { useReactToPrint } from "react-to-print";

type Timetable = TimetableResponse["timetable"];
type Slots = Timetable["slots"];
type SlotDatas = Slots[0]["SlotDatas"];
type SlotDataClasses = Exclude<SlotDatas, undefined>[0]["SlotDataClasses"];
type SlotDataSubdivisions = Exclude<SlotDatas, undefined>[0]["SlotDataSubdivisions"];

function printClasses(slotDataClasses: SlotDataClasses) {
    return slotDataClasses?.map((slotDataClass, slotDataClassIndex) => (
        <React.Fragment key={slotDataClassIndex}>
            {" "}
            {slotDataClass.Classroom?.classroomName}
            {","}
        </React.Fragment>
    ));
}
function printSubdivisions(slotDataSubdivisions: SlotDataSubdivisions) {
    return slotDataSubdivisions?.map((slotDataSubdivision, slotDataSubdivisionIndex) => (
        <React.Fragment key={slotDataSubdivisionIndex}>
            {" "}
            {slotDataSubdivision.Subdivision?.subdivisionName}
            {","}
        </React.Fragment>
    ));
}
function Cell({ slotDataItem }: { slotDataItem: Exclude<SlotDatas, undefined>[0] }) {
    return (
        <td>
            {/* Check if teacher exists */}
            {slotDataItem.Teacher?.teacherName} <br />
            {slotDataItem.Subject?.subjectName} <br />
            {printSubdivisions(slotDataItem.SlotDataSubdivisions)} <br />
            {printClasses(slotDataItem.SlotDataClasses)}
        </td>
    );
}
function Slot({ slotDatas }: { slotDatas: SlotDatas }) {
    const slotDatasFiltered = slotDatas!.filter(checkIfSlotDataExists);
    return (
        <React.Fragment>
            <table>
                <tbody>
                    {slotDatasFiltered!.map((dataItem, slotDataIndex: number) => (
                        <tr key={slotDataIndex}>
                            <Cell slotDataItem={dataItem} />
                        </tr>
                    ))}
                </tbody>
            </table>
        </React.Fragment>
    );
}

function Row({
    timetable,
    day,
    slotNumbers,
    handleDrawerOpen,
    setSelectedSlotIndex,
}: {
    timetable: Timetable;
    day: number | string;
    slotNumbers: Set<Slots[0]["number"]>;
    handleDrawerOpen: () => void;
    setSelectedSlotIndex: React.Dispatch<React.SetStateAction<number | null>>;
}) {
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
                        <td
                            key={slotNumber}
                            onClick={() => {
                                handleDrawerOpen();
                                setSelectedSlotIndex(slotIndex);
                            }}
                        >
                            <Slot slotDatas={timetable.slots[slotIndex].SlotDatas} />
                        </td>
                    );
                })}
        </tr>
    );
}

function Headers({ slotNumbers }: { slotNumbers: Set<Slots[0]["number"]> }) {
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

export default function OldTimetable({
    timetableData,
    handleDrawerOpen,
    setSelectedSlotIndex,
}: {
    timetableData: TimetableResponse | null;
    handleDrawerOpen: () => void;
    setSelectedSlotIndex: React.Dispatch<React.SetStateAction<number | null>>;
}) {
    const PDFComp = useRef();
    const slotNumbers = new Set<Slots[0]["number"]>();
    const slotDays = new Set<Slots[0]["day"]>();
    const generatePdf = useReactToPrint({
        content: () => PDFComp.current,
        documentTitle: "insert title here",
    });

    if (!timetableData) return;
    timetableData.timetable?.slots.forEach((slot) => {
        slotNumbers.add(slot.number);
        slotDays.add(slot.day);
    });

    return (
        <div ref={PDFComp} style={{ width: "100%" }}>
            <table>
                <thead>
                    <tr>
                        <Headers slotNumbers={slotNumbers} />
                    </tr>
                </thead>
                <tbody>
                    {Array.from(slotDays)
                        .sort()
                        .map((day) => (
                            <Row
                                key={day}
                                timetable={timetableData.timetable}
                                day={day}
                                slotNumbers={slotNumbers}
                                handleDrawerOpen={handleDrawerOpen}
                                setSelectedSlotIndex={setSelectedSlotIndex}
                            />
                        ))}
                </tbody>
            </table>
            <div className="d-grid d-md-flex justify-content-md-end mb-3">
                <button className="btn btn-success" onClick={generatePdf}>
                    Generate PDF
                </button>
            </div>
        </div>
    );
}
