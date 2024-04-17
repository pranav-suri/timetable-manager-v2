import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { TeacherResponse, TimetableResponse } from "../../../backend/api/routes/responseTypes";
import { fetchAndSet } from "../fetchAndSet";
import api from "../..";
import { SubjectAutocomplete } from "./SubjectAutocomplete";

type Teacher = TeacherResponse["teachers"][0];

interface TeacherAutocompleteProps {
    slotData?: TimetableResponse["timetable"]["slots"][0]["SlotDatas"][0] | null;
}

export function TeacherAutocomplete({ slotData }: TeacherAutocompleteProps) {
    const currentTeacher = slotData?.Teacher;
    const subjectId = slotData?.SubjectId;
    const slotId = slotData?.SlotId;
    const [inputValue, setInputValue] = React.useState("");
    const [value, setValue] = React.useState<TeacherResponse["teachers"][0] | null>(
        currentTeacher ?? null,
    );
    const [subjectTeachersData, setAllTeacherData] = React.useState<TeacherResponse | null>(null);
    React.useEffect(() => {
        if (!subjectId || !slotId) return;
        fetchAndSet(
            setAllTeacherData,
            api.available.teachers.get({ query: { subjectId, slotId } }),
        );
    }, []);
    
    if (!slotData)
        return <Autocomplete disabled options={[]} renderInput={(params) => <TextField {...params} label="Teacher" />} />;
    const subjectTeachers = subjectTeachersData?.teachers ?? [];
    const allTeachers = subjectTeachers.concat(currentTeacher ?? []);
    return (
        <Autocomplete
            disablePortal
            autoHighlight
            value={value}
            onChange={(event, newValue) => {
                // TODO: Update teacher in database. Call parent function here
                setValue(newValue);
            }}
            inputValue={inputValue} // CHANGE TO CURRENT TEACHER ONCE PARENT FUNCTION CALLBACK IS ADDED
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            options={allTeachers}
            getOptionLabel={(option) => option.teacherName}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => <TextField {...params} label="Teacher" />}
        />
    );
}
