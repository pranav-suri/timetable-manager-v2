import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import {
    ClassroomResponse,
    TimetableResponse,
} from "../../../backend/api/routes/responseTypes";
import { edenFetch } from "../fetchAndSet";
import api from "../..";

// Implementing SubdivisionAutocomplete
type Classrooms = ClassroomResponse["classrooms"];

interface SubdivisionAutocompleteProps {
    slotDatas: TimetableResponse["timetable"]["slots"][0]["SlotDatas"];
    slotDataIndex: number;
    updateClassrooms: (classrooms: Classrooms, slotDataIndex: number) => void;
    setUpdate: (update: boolean) => void;
}

export function ClassroomAutocomplete({
    slotDatas,
    slotDataIndex,
    updateClassrooms,
    setUpdate,
}: SubdivisionAutocompleteProps) {
    const slotData = slotDatas![slotDataIndex];
    const subjectId = slotData.Subject?.id ?? null;
    const slotId = slotData.SlotId;
    const currentClassrooms: Classrooms = slotData.SlotDataClasses!.map(
        (slotDataClassroom) => slotDataClassroom.Classroom!,
    );
    const [inputValue, setInputValue] = useState("");
    const [value, setValue] = useState<Classrooms>([]);
    const [availableClassroomData, setAvailableClassroomData] = useState<Classrooms>([]);
    // const [allClassrooms, setAllClassrooms] = useState<Classrooms>([]);

    useEffect(() => {
        if (!subjectId) return;

        edenFetch<ClassroomResponse>(
            api.available.classrooms.get({ query: { subjectId, slotId } }),
        ).then((data) => {
            const availableClassrooms = data.classrooms ?? [];
            // console.log(slotData.id, availableClassrooms, currentClassrooms)
            const allClassrooms = availableClassrooms.concat(currentClassrooms ?? []);
            setAvailableClassroomData(allClassrooms);
            setValue(currentClassrooms);
        });
    }, [subjectId, currentClassrooms, slotId]);

    return (
        <Autocomplete
            multiple
            limitTags={1}
            sx={{ margin: "5px" }}
            disablePortal
            autoHighlight
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
                updateClassrooms(newValue, slotDataIndex);
                setUpdate(true);
            }}
            inputValue={inputValue} // CHANGE TO CURRENT SUBJECT ONCE PARENT FUNCTION CALLBACK IS ADDED
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            options={availableClassroomData}
            getOptionLabel={(option) => option.classroomName}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => <TextField {...params} label="Classrooms" />}
        />
    );
}
