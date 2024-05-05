import React, { useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { SubjectResponse, TimetableResponse } from "../../../backend/api/routes/responseTypes";

type Subject = SubjectResponse["subjects"][0];

interface SubjectAutocompleteProps {
    subjects: SubjectResponse["subjects"];
    slotDatas: TimetableResponse["timetable"]["slots"][0]["SlotDatas"];
    slotDataIndex: number;
    updateSubject: (subject: Subject | null, slotDataIndex: number) => void;
    setUpdate: (update: boolean) => void;
}

export function SubjectAutocomplete({
    subjects,
    slotDatas,
    slotDataIndex,
    updateSubject,
    setUpdate,
}: SubjectAutocompleteProps) {
    const slotData = slotDatas![slotDataIndex];
    const currentSubject = slotData.Subject;
    const [inputValue, setInputValue] = React.useState("");
    const [value, setValue] = React.useState<SubjectResponse["subjects"][0] | null>(
        currentSubject ?? null,
    );
    useEffect(() => {
        setValue(currentSubject ?? null);
    }, [currentSubject, slotData]);

    return (
        <Autocomplete
            sx={{ margin: "5px" }}
            disablePortal
            autoHighlight
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
                updateSubject(newValue, slotDataIndex);
                setUpdate(true);
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
