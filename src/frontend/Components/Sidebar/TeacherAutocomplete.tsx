import React, { Dispatch, useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { TeacherResponse, TimetableResponse } from "../../../backend/api/routes/responseTypes";
import { edenFetch } from "../fetchAndSet";
import api from "../../";

type Teacher = TeacherResponse["teachers"][0];

interface TeacherAutocompleteProps {
    slotDatas: TimetableResponse["timetable"]["slots"][0]["SlotDatas"];
    slotDataIndex: number;
    updateTeacher: (teacher: Teacher | null, slotDataIndex: number) => void;
    setUpdate: (update: boolean) => void;
    setSlotDataIndexToUpdate: Dispatch<number | null>;
}

export function TeacherAutocomplete({
    slotDatas,
    slotDataIndex,
    updateTeacher,
    setUpdate,
    setSlotDataIndexToUpdate,
}: TeacherAutocompleteProps) {
    const slotData = slotDatas![slotDataIndex];
    const currentTeacher = slotData.Teacher ?? null;
    const subjectId = slotData.Subject?.id;
    const slotId = slotData.SlotId;
    const [inputValue, setInputValue] = React.useState("");
    const [value, setValue] = React.useState<TeacherResponse["teachers"][0] | null>(currentTeacher);
    const [availableTeachersData, setAvailableTeachersData] = useState<TeacherResponse["teachers"]>(
        currentTeacher ? [currentTeacher] : [],
    );

    useEffect(() => {
        if (!subjectId) return;
        edenFetch<TeacherResponse>(
            api.available.teachers.get({ query: { subjectId, slotId } }),
        ).then((data) => {
            const subjectTeachers = data.teachers ?? [];
            const allTeachers = subjectTeachers.concat(currentTeacher ?? []);
            setAvailableTeachersData(allTeachers);
            setValue(currentTeacher ?? null);
        });
        // It is the only needed dependency, other dependencies are not needed
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slotDatas]);

    return (
        <Autocomplete
            sx={{ margin: "5px" }}
            disablePortal
            autoHighlight
            value={value}
            onChange={(event, newValue) => {
                // TODO: Update teacher in database. Call parent function here
                setValue(newValue);
                updateTeacher(newValue, slotDataIndex);
                setUpdate(true);
                setSlotDataIndexToUpdate(slotDataIndex);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            options={availableTeachersData}
            getOptionLabel={(option) => option.teacherName}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => <TextField {...params} label="Teacher" />}
        />
    );
}
