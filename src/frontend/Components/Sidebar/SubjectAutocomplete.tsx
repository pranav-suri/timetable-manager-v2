import React, { useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { SubjectResponse, TimetableResponse } from "../../../backend/api/routes/responseTypes";
import { fetchAndSet } from "../fetchAndSet";
import api from "../..";

type Subject = SubjectResponse["subjects"][0];

interface SubjectAutocompleteProps {
    subjects: SubjectResponse["subjects"];
    slotDatas: TimetableResponse["timetable"]["slots"][0]["SlotDatas"];
    slotDataIndex: number;
    updateSubject: (subject: Subject, slotDataIndex: number) => void;
}

export function SubjectAutocomplete({
    subjects,
    slotDatas,
    slotDataIndex,
    updateSubject
}: SubjectAutocompleteProps) {
    const slotData = slotDatas![slotDataIndex];
    const currentSubject = slotData.Subject;
    const [inputValue, setInputValue] = React.useState("");
    const [value, setValue] = React.useState<SubjectResponse["subjects"][0] | null>(
        currentSubject ?? null,
    );
    useEffect(() => {
        setValue(currentSubject ?? null);
    }, [slotData]);

    return (
        <Autocomplete
            sx={{ margin: "5px" }}
            disablePortal
            autoHighlight
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
                updateSubject(newValue, slotDataIndex);
            }}
            inputValue={inputValue} // CHANGE TO CURRENT SUBJECT ONCE PARENT FUNCTION CALLBACK IS ADDED
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            options={subjects}
            getOptionLabel={(option) => option.subjectName}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => <TextField {...params} label="Subject" />}
        />
    );
}
