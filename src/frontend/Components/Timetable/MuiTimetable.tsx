import React, { useContext } from "react";
import { TimetableResponse } from "../../../backend/api/routes/responseTypes";
import { checkIfSlotDataExists } from "../fetchAndSet";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Card,
    CardHeader,
    CardContent,
} from "@mui/material";
import { ViewAllDataContext } from "../../context/ViewAllDataContext";
import getColor from "../../../utils/getColor";
import { ThemeModeContext } from "../../context/ThemeModeContext";

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
    return slotDataSubdivisions?.map((slotDataSubdivision, slotDataSubdivisionIndex) => (
        <React.Fragment key={slotDataSubdivisionIndex}>
            {" "}
            {slotDataSubdivision.Subdivision?.subdivisionName}
            {slotDataSubdivisionIndex !== slotDataSubdivisions.length - 1 && ","}
        </React.Fragment>
    ));
}

function Cell({
    slotDataItem,
    viewAllData,
}: {
    slotDataItem: Exclude<SlotDatas, undefined>[0];
    viewAllData: boolean;
}) {
    const { themeMode } = useContext(ThemeModeContext);
    return (
        <Card
            sx={{
                backgroundColor: getColor(slotDataItem.Subject?.subjectName ?? "", themeMode),
                margin: "0.5rem",
            }}
        >
            <CardHeader
                title={
                    viewAllData
                        ? slotDataItem.Subject?.subjectName
                        : getInitials(slotDataItem.Subject?.subjectName || "")
                }
                titleTypographyProps={{ fontWeight: "500", fontSize: "1rem" }}
                sx={{ padding: 0, margin: "8px" }}
            />
            <CardContent sx={{ padding: 0, margin: "8px" }} style={{ padding: 0 }}>
                {viewAllData ? slotDataItem.Teacher?.teacherName : ""}
                {viewAllData ? <br /> : ""}
                {printSubdivisions(slotDataItem.SlotDataSubdivisions, viewAllData)}{" "}
                {viewAllData ? <br /> : <></>}
                {printClasses(slotDataItem.SlotDataClasses)}
            </CardContent>
        </Card>
    );
}

function Slot({ slotDatas, viewAllData }: { slotDatas: SlotDatas; viewAllData: boolean }) {
    const slotDatasFiltered = slotDatas!.filter(checkIfSlotDataExists);
    return (
        <div>
            {slotDatasFiltered!.map((dataItem, slotDataIndex: number) => (
                <Cell key={slotDataIndex} slotDataItem={dataItem} viewAllData={viewAllData} />
            ))}
        </div>
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
    day: number;
    slotNumbers: Set<Slots[0]["number"]>;
    viewAllData: boolean;
    handleDrawerOpen: () => void;
    setSelectedSlotIndex: React.Dispatch<React.SetStateAction<number | null>>;
}) {
    const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return (
        <TableRow>
            {/* <TableHead> */}
            <TableCell>{DAYS[day - 1]}</TableCell>
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
        <React.Fragment>
            <TableCell key="days-slots-header">Days/Slots</TableCell>
            {Array.from(slotNumbers)
                .sort()
                .map((slotNumber) => (
                    <TableCell key={slotNumber}>{slotNumber}</TableCell>
                ))}
        </React.Fragment>
    );
    return headers;
}

export default function MuiTimetable({
    timetableData,
    pdfComponent,
    handleDrawerOpen,
    setSelectedSlotIndex,
}: {
    timetableData: TimetableResponse | null;
    pdfComponent: React.RefObject<HTMLDivElement>;
    handleDrawerOpen: () => void;

    setSelectedSlotIndex: React.Dispatch<React.SetStateAction<number | null>>;
}) {
    const slotNumbers = new Set<Slots[0]["number"]>();
    const slotDays = new Set<Slots[0]["day"]>();
    const { viewAllData } = useContext(ViewAllDataContext);

    if (!timetableData) return;
    timetableData.timetable?.slots.forEach((slot) => {
        slotNumbers.add(slot.number);
        slotDays.add(slot.day);
    });

    return (
        <TableContainer component={Paper} className="printable">
            <div ref={pdfComponent}>
                <Table size="small">
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
            </div>
        </TableContainer>
    );
}
