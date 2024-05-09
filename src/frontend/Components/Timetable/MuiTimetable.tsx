import React, { useContext, useRef } from "react";
import { TimetableResponse } from "../../../backend/api/routes/responseTypes";
import { checkIfSlotDataExists } from "../fetchAndSet";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import {
    Divider,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Box,
} from "@mui/material";
import { ViewAllDataContext } from "../../context/ViewAllDataContext";
import getPastelColor from "../../../utils/pastelColor";

type Timetable = TimetableResponse["timetable"];
type Slots = Timetable["slots"];
type SlotDatas = Slots[0]["SlotDatas"];
type SlotDataClasses = Exclude<SlotDatas, undefined>[0]["SlotDataClasses"];
type SlotDataSubdivisions = Exclude<SlotDatas, undefined>[0]["SlotDataSubdivisions"];

const getInitials = (name: string) => {
    // get all initials (eg: Dr. Nilima Zade = DNZ)
    const initials = name.match(/\b\w/g) || [];
    return initials.map((initial) => initial.toUpperCase()).join("");
};

function printClasses(slotDataClasses: SlotDataClasses) {
    return slotDataClasses?.map((slotDataClass, slotDataClassIndex) => (
        <React.Fragment key={slotDataClassIndex}>
            {" "}
            {slotDataClass.Classroom?.classroomName}
            {slotDataClassIndex !== slotDataClasses.length - 1 && ","}
        </React.Fragment>
    ));
}
function printSubdivisions(slotDataSubdivisions: SlotDataSubdivisions, viewAllData: boolean) {
    return viewAllData ? (
        slotDataSubdivisions?.map((slotDataSubdivision, slotDataSubdivisionIndex) => (
            <React.Fragment key={slotDataSubdivisionIndex}>
                {" "}
                {slotDataSubdivision.Subdivision?.subdivisionName}
                {slotDataSubdivisionIndex !== slotDataSubdivisions.length - 1 && ","}
            </React.Fragment>
        ))
    ) : (
        <></>
    );
}

function Cell({
    slotDataItem,
    viewAllData,
}: {
    slotDataItem: Exclude<SlotDatas, undefined>[0];
    viewAllData: boolean;
}) {
    return (
        <Box
            sx={{
                backgroundColor: getPastelColor(slotDataItem.Subject?.subjectName ?? ""),
            }}
        >
            {/* Check if teacher exists */}
            {viewAllData ? slotDataItem.Teacher?.teacherName : ""}
            {viewAllData ? <br /> : ""}
            {viewAllData
                ? slotDataItem.Subject?.subjectName
                : getInitials(slotDataItem.Subject?.subjectName || "")}{" "}
            <br />
            {printSubdivisions(slotDataItem.SlotDataSubdivisions, viewAllData)}{" "}
            {viewAllData ? <br /> : <></>}
            {printClasses(slotDataItem.SlotDataClasses)}
            <Divider />
        </Box>
    );
}

function Slot({ slotDatas, viewAllData }: { slotDatas: SlotDatas; viewAllData: boolean }) {
    const slotDatasFiltered = slotDatas!.filter(checkIfSlotDataExists);
    return (
        <React.Fragment>
            {/* <Table> */}
            {/* <TableBody> */}
            {slotDatasFiltered!.map((dataItem, slotDataIndex: number) => (
                // <TableRow key={slotDataIndex}>
                <Cell key={slotDataIndex} slotDataItem={dataItem} viewAllData={viewAllData} />
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
    viewAllData,
    handleDrawerOpen,
    setSelectedSlotIndex,
}: {
    timetable: Timetable;
    day: number | string;
    slotNumbers: Set<Slots[0]["number"]>;
    viewAllData: boolean;
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
                            <Slot
                                slotDatas={timetable.slots[slotIndex].SlotDatas}
                                viewAllData={viewAllData}
                            />
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
    const { viewAllData } = useContext(ViewAllDataContext);
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
                                    viewAllData={viewAllData}
                                />
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
