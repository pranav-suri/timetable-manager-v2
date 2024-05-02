import { styled, useTheme } from "@mui/material/styles";
import {
    Drawer,
    AppBar as MuiAppBar,
    AppBarProps as MuiAppBarProps,
    Divider,
    IconButton,
} from "@mui/material";
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    MoveToInbox as InboxIcon,
    Mail as MailIcon,
} from "@mui/icons-material";
import {
    SubdivisionResponse,
    SubjectResponse,
    TeacherResponse,
    TimetableResponse,
    ClassroomResponse,
} from "../../../backend/api/routes/responseTypes";
import { fetchAndSet } from "../fetchAndSet";
import api from "../../index";
import OldTimetable from "../Timetable/OldTimetable";
import OldNavBar from "../NavBar/OldNavBar";
import { TeacherAutocomplete } from "./TeacherAutocomplete";
import { SubjectAutocomplete } from "./SubjectAutocomplete";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import React from "react";
import { SubdivisionAutocomplete } from "./SubdivisionAutocomplete";
import { ClassroomAutocomplete } from "./ClassroomAutocomplete";
import { SlotDataSubdivisions } from "../../../backend/database";

type Timetable = TimetableResponse["timetable"];
type Slots = Timetable["slots"];
type SlotDatas = Slots[0]["SlotDatas"];

export const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
}));

export function DrawerRight({
    drawerwidth,
    handleDrawerClose,
    drawerState,
    setTimetable,
    selectedSlotIndex,
    timetableData,
}: {
    drawerwidth: number;
    handleDrawerClose: () => void;
    drawerState: boolean;
    setTimetable: typeof useImmer<TimetableResponse | null>;
    selectedSlotIndex: number | null;
    timetableData: TimetableResponse | null;
}) {
    
    function updateSubject(subject: SubjectResponse["subjects"][0] | null, slotDataIndex: number) {
        setTimetable((draft) => {
            draft!.timetable.slots[selectedSlotIndex!].SlotDatas[slotDataIndex].Subject = subject;
            draft!.timetable.slots[selectedSlotIndex!].SlotDatas[slotDataIndex].Teacher = null;
        });
    }

    function updateTeacher(teacher: TeacherResponse["teachers"][0] | null, slotDataIndex: number) {
        setTimetable((draft) => {
            draft!.timetable.slots[selectedSlotIndex!].SlotDatas[slotDataIndex].Teacher = teacher;
        });
    }

    function updateSubdivisions(subdivisions: SubdivisionResponse["subdivisions"] | [], slotDataIndex: number) {
        const slotDataSubdivisions = subdivisions.map((subdivision) => ({ Subdivision: subdivision })); 
        setTimetable((draft) => {
            draft!.timetable.slots[selectedSlotIndex!].SlotDatas[slotDataIndex].SlotDataSubdivisions = slotDataSubdivisions;
        });
    }

    function updateClassrooms(classrooms: ClassroomResponse["classrooms"] | [], slotDataIndex: number) {
        const slotDataClasses = classrooms.map((classroom) => ({ Classroom: classroom }));
        setTimetable((draft) => {
            draft!.timetable.slots[selectedSlotIndex!].SlotDatas[slotDataIndex].SlotDataClasses = slotDataClasses;
        });
    }

    const [subjects, setSubjects] = useState<SubjectResponse>([]);
    const [subdivisions, setSubdivisions] = useState<SubdivisionResponse>([]);
    useEffect(() => {
        fetchAndSet(setSubjects, api.departments({ id: 2 }).subjects.get());
        fetchAndSet(setSubdivisions, api.divisions({ id: 2 }).subdivisions.get());
    }, []);
    const theme = useTheme();
    if (!selectedSlotIndex) return null;
    const slot = timetableData?.timetable.slots[selectedSlotIndex];
    if (!slot) return null;

    return (
        <Drawer
            sx={{
                width: drawerwidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerwidth,
                },
            }}
            variant="persistent"
            anchor="right"
            open={drawerState}
        >
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === "rtl" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </DrawerHeader>
            {selectedSlotIndex}
            <Divider />
            {slot.SlotDatas!.map((slotData, index) => (
                <React.Fragment key={index}>
                    <SubjectAutocomplete
                        subjects={subjects.subjects}
                        slotDatas={slot.SlotDatas}
                        slotDataIndex={index}
                        updateSubject={updateSubject}
                    />
                    <TeacherAutocomplete slotDatas={slot.SlotDatas} slotDataIndex={index} updateTeacher={updateTeacher} />
                    <ClassroomAutocomplete slotDatas={slot.SlotDatas} slotDataIndex={index} updateClassrooms={updateClassrooms}/>
                    <SubdivisionAutocomplete
                        slotDatas={slot.SlotDatas}
                        slotDataIndex={index}
                        subdivisions={subdivisions.subdivisions}
                        updateSubdivisions={updateSubdivisions}
                    />
                    <Divider sx={{ margin: "20px" }} />
                </React.Fragment>
            ))}
        </Drawer>
    );
}
