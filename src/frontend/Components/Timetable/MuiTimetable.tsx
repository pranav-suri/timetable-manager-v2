import React, { useRef } from "react";
import { TimetableResponse } from "../../../backend/api/routes/responseTypes";
import { checkIfSlotDataExists } from "../fetchAndSet";
import { useReactToPrint } from "react-to-print";
import {
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";
import Button from "@mui/material/Button";

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
        <div>
            {/* Check if teacher exists */}
            {slotDataItem.Teacher?.teacherName} <br />
            {slotDataItem.Subject?.subjectName} <br />
            {printSubdivisions(slotDataItem.SlotDataSubdivisions)} <br />
            {printClasses(slotDataItem.SlotDataClasses)}
            <Divider/>
        </div>
    );
}
function Slot({ slotDatas }: { slotDatas: SlotDatas }) {
    const slotDatasFiltered = slotDatas!.filter(checkIfSlotDataExists);
    return (
        <React.Fragment>
            {/* <Table> */}
            {/* <TableBody> */}
            {slotDatasFiltered!.map((dataItem, slotDataIndex: number) => (
                // <TableRow key={slotDataIndex}>
                <Cell slotDataItem={dataItem} />
                // </TableRow>
            ))}
            {/* </TableBody> */}
            {/* </Table> */}
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
        <TableRow>
            {/* <TableHead> */}
            <TableCell>{day}</TableCell>
            {/* </TableHead> */}

            {Array.from(slotNumbers)
                .sort()
                .map((slotNumber) => {
                    const slotIndex = timetable.slots.findIndex(
                        (slot) => slot.day == day && slot.number == slotNumber,
                    );
                    return (
                        <TableCell
                            key={slotNumber}
                            onClick={() => {
                                handleDrawerOpen();
                                setSelectedSlotIndex(slotIndex);
                            }}
                        >
                            <Slot slotDatas={timetable.slots[slotIndex].SlotDatas} />
                        </TableCell>
                    );
                })}
        </TableRow>
    );
}

function Headers({ slotNumbers }: { slotNumbers: Set<Slots[0]["number"]> }) {
    const headers = (
        <>
            <TableCell key="days-slots-header">Days/Slots</TableCell>
            {Array.from(slotNumbers)
                .sort()
                .map((slotNumber) => (
                    <TableCell key={slotNumber}>{slotNumber}</TableCell>
                ))}
        </>
    );
    return headers;
}

export default function MuiTimetable({
    timetableData,
    handleDrawerOpen,
    setSelectedSlotIndex,
}: {
    timetableData: TimetableResponse | null;
    handleDrawerOpen: () => void;
    setSelectedSlotIndex: React.Dispatch<React.SetStateAction<number | null>>;
}) {
    const PDFComp = useRef<HTMLDivElement>(null); // Add type annotation to the useRef call
    const slotNumbers = new Set<Slots[0]["number"]>();
    const slotDays = new Set<Slots[0]["day"]>();
    const generatePdf = useReactToPrint({
        content: () => PDFComp.current, // Access the current property of the ref
        documentTitle: "insert title here",
    });

    if (!timetableData) return;
    timetableData.timetable?.slots.forEach((slot) => {
        slotNumbers.add(slot.number);
        slotDays.add(slot.day);
    });

    return (
        <div ref={PDFComp} style={{ width: "100%" }}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <Headers slotNumbers={slotNumbers} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
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
                    </TableBody>
                </Table>
            </TableContainer>

            <div className="d-grid d-md-flex justify-content-md-end mb-3">
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={generatePdf}
                    sx={{
                        borderRadius: "10px",
                        fontWeight: "bold",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        top: "50px",
                    }}
                >
                    Generate PDF
                </Button>
            </div>
        </div>
    );
}
