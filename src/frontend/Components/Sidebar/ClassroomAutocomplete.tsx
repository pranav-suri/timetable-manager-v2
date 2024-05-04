import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import {
    ClassroomResponse,
    SubdivisionResponse,
    SubjectResponse,
    TimetableResponse,
} from "../../../backend/api/routes/responseTypes";
import { fetchAndSet } from "../fetchAndSet";
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
    const subjectId = slotData.Subject!.id;
    const slotId = slotData.SlotId;
    const currentClassrooms: Classrooms = slotData.SlotDataClasses!.map(
        (slotDataClassroom) => slotDataClassroom.Classroom!,
    );
    const [inputValue, setInputValue] = useState("");
    const [value, setValue] = useState<Classrooms>(currentClassrooms ?? []);
    const [availableClassroomData, setAvailableClassroomData] =
        React.useState<ClassroomResponse | null>(null);

    useEffect(() => {
        
        if (!slotData || !subjectId) return;
        setValue(currentClassrooms);
        fetchAndSet(
            setAvailableClassroomData,
            api.available.classrooms.get({ query: { subjectId, slotId } }),
        );
    }, [slotData]);

    const availableClassrooms = availableClassroomData?.classrooms ?? [];
    const allClassrooms = availableClassrooms.concat(currentClassrooms ?? []);

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
            options={allClassrooms}
            getOptionLabel={(option) => option.classroomName}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => <TextField {...params} label="Classrooms" />}
        />
    );
}
