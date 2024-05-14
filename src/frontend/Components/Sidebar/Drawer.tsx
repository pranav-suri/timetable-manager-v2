import { styled, useTheme } from "@mui/material/styles";
import { Drawer, Divider, IconButton, Typography } from "@mui/material";
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import {
    SubdivisionResponse,
    SubjectResponse,
    TeacherResponse,
    TimetableResponse,
    ClassroomResponse,
} from "../../../backend/api/routes/responseTypes";
import { checkIfSlotDataExists } from "../fetchAndSet";
import api from "../../index";
import { TeacherAutocomplete } from "./TeacherAutocomplete";
import { SubjectAutocomplete } from "./SubjectAutocomplete";
import { useEffect, useState } from "react";
import { Updater } from "use-immer";
import React from "react";
import { SubdivisionAutocomplete } from "./SubdivisionAutocomplete";
import { ClassroomAutocomplete } from "./ClassroomAutocomplete";
import { SlotDataClasses, SlotDataSubdivisions, Subject, Teacher } from "../../../backend/database";

type Timetable = TimetableResponse["timetable"];
type Slots = Timetable["slots"];
type SlotDatas = Exclude<Slots[0]["SlotDatas"], undefined>;
type SlotData = Exclude<SlotDatas, undefined>[0];

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
    setSelectedSlotIndex,
}: {
    drawerwidth: number;
    handleDrawerClose: () => void;
    drawerState: boolean;
    setTimetable: Updater<TimetableResponse>;
    setSelectedSlotIndex: React.Dispatch<React.SetStateAction<number | null>>;
    selectedSlotIndex: number | null;
    timetableData: TimetableResponse | null;
}) {
    const [update, setUpdate] = useState(false);
    const [slotDataIndexToUpdate, setSlotDataIndexToUpdate] = useState<number | null>(null);

    function updateSubject(subject: SubjectResponse["subjects"][0] | null, slotDataIndex: number) {
        setTimetable((draft) => {
            draft!.timetable.slots[selectedSlotIndex!].SlotDatas![slotDataIndex].Subject! =
                subject as Subject;
            draft!.timetable.slots[selectedSlotIndex!].SlotDatas![slotDataIndex].Teacher! =
                null as unknown as Teacher;
        });
    }

    function updateTeacher(teacher: TeacherResponse["teachers"][0] | null, slotDataIndex: number) {
        setTimetable((draft) => {
            draft!.timetable.slots[selectedSlotIndex!].SlotDatas![slotDataIndex].Teacher =
                teacher as Teacher;
        });
    }

    function updateSubdivisions(
        subdivisions: SubdivisionResponse["subdivisions"] | [],
        slotDataIndex: number,
    ) {
        const slotDataSubdivisions = subdivisions.map((subdivision) => ({
            Subdivision: subdivision,
        })) as SlotDataSubdivisions[];
        setTimetable((draft) => {
            draft!.timetable.slots[selectedSlotIndex!].SlotDatas![
                slotDataIndex
            ].SlotDataSubdivisions = slotDataSubdivisions;
        });
    }

    function updateClassrooms(
        classrooms: ClassroomResponse["classrooms"] | [],
        slotDataIndex: number,
    ) {
        const slotDataClasses = classrooms.map((classroom) => ({
            Classroom: classroom,
        })) as SlotDataClasses[];
        setTimetable((draft) => {
            draft!.timetable.slots[selectedSlotIndex!].SlotDatas![slotDataIndex].SlotDataClasses =
                slotDataClasses;
        });
    }

    function updateSlotData(slotDataIndex: number) {
        const slot = timetableData!.timetable.slots[selectedSlotIndex!];
        const slotId = slot.id;
        const slotData = slot.SlotDatas![slotDataIndex];
        const slotDataId = slotData.id;
        const subjectId = slotData.Subject?.id ?? null;
        const teacherId = slotData.Teacher?.id ?? null;
        const subdivisionIds = slotData.SlotDataSubdivisions!.map(
            (slotDataSubdiv) => slotDataSubdiv.Subdivision!.id,
        );
        const classroomIds = slotData.SlotDataClasses!.map(
            (slotDataClass) => slotDataClass.Classroom!.id,
        );
        // console.log("SlotId: ", slotId);
        // console.log("SlotDataId: ", slotDataId);
        // console.log("SubjectId: ", subjectId);
        // console.log("TeacherId: ", teacherId);
        // console.log("SubdivIds: : ", subdivisionIds);
        // console.log("ClassIds: ", classroomIds);
        // console.log("Rendered");

        // if (!subjectId || !subdivisionIds.length) return;

        api.slotDatas.update
            .post({
                slotDataId,
                slotId,
                subjectId,
                teacherId,
                subdivisionIds,
                classroomIds,
            })
            .then(({ data }) => {
                const slotDataId = data!.slotData.id;
                // console.log("Updated")
                setTimetable((draft) => {
                    draft!.timetable.slots[selectedSlotIndex!].SlotDatas![slotDataIndex].id =
                        slotDataId;
                });
            });
    }

    const slot = timetableData?.timetable?.slots[selectedSlotIndex!];
    const slotDatas = slot?.SlotDatas?.filter(checkIfSlotDataExists) || ([] as SlotDatas);
    useEffect(() => {
        if (!update || slotDataIndexToUpdate == null) return;
        updateSlotData(slotDataIndexToUpdate);
        setUpdate(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slotDatas, update, slotDataIndexToUpdate]);

    useEffect(() => {
        if (selectedSlotIndex == null || !slot) return;
        // Create a new slotData
        setTimetable((draft) => {
            draft!.timetable!.slots[selectedSlotIndex!].SlotDatas = [
                ...slotDatas,
                {
                    id: 0,
                    SlotId: slot!.id,
                    SlotDataClasses: [],
                    SlotDataSubdivisions: [],
                    Subject: null,
                    Teacher: null,
                } as unknown as SlotData,
            ];
        });
        setUpdate(false);

        // Remove extra slotData at the end
        return () => {
            if (selectedSlotIndex == null) return;
            setTimetable((draft) => {
                draft!.timetable!.slots[selectedSlotIndex!].SlotDatas = slotDatas as SlotDatas;
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSlotIndex, update]);

    const theme = useTheme();
    if (!slot) return null;

    const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
                <IconButton
                    onClick={() => {
                        handleDrawerClose();
                        setSelectedSlotIndex(null);
                    }}
                >
                    {theme.direction === "rtl" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </DrawerHeader>
            <Typography
                variant="h6"
                sx={{ fontWeight: "bold", marginLeft: "10px", marginTop: "10px" }}
            >
                {DAYS[slot.day - 1]}, Slot: {slot.number}
                <br />
                <br />
                {/* , Index: {selectedSlotIndex} */}
            </Typography>
            <Divider />
            {slot.SlotDatas!.map((_, index) => (
                <React.Fragment key={index}>
                    <SubjectAutocomplete
                        slotDatas={slot.SlotDatas}
                        slotDataIndex={index}
                        updateSubject={updateSubject}
                        setSlotDataIndexToUpdate={setSlotDataIndexToUpdate}
                        setUpdate={setUpdate}
                    />
                    <TeacherAutocomplete
                        slotDatas={slot.SlotDatas}
                        slotDataIndex={index}
                        updateTeacher={updateTeacher}
                        setSlotDataIndexToUpdate={setSlotDataIndexToUpdate}
                        setUpdate={setUpdate}
                    />
                    <ClassroomAutocomplete
                        slotDatas={slot.SlotDatas}
                        slotDataIndex={index}
                        updateClassrooms={updateClassrooms}
                        setSlotDataIndexToUpdate={setSlotDataIndexToUpdate}
                        setUpdate={setUpdate}
                    />
                    <SubdivisionAutocomplete
                        slotDatas={slot.SlotDatas}
                        slotDataIndex={index}
                        // subdivisions={subdivisions.subdivisions}
                        updateSubdivisions={updateSubdivisions}
                        setSlotDataIndexToUpdate={setSlotDataIndexToUpdate}
                        setUpdate={setUpdate}
                    />
                    <Divider sx={{ margin: "20px" }} />
                </React.Fragment>
            ))}
        </Drawer>
    );
}
