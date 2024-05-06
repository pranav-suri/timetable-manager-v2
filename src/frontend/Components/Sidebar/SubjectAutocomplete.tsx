import React, { Dispatch, useContext, useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { SubjectResponse, TimetableResponse } from "../../../backend/api/routes/responseTypes";
import { edenFetch } from "../fetchAndSet";
import api from "../..";
import { SelectedValuesContext } from "../../context/SelectedValuesContext";

type Subject = SubjectResponse["subjects"][0];

interface SubjectAutocompleteProps {
    slotDatas: TimetableResponse["timetable"]["slots"][0]["SlotDatas"];
    slotDataIndex: number;
    updateSubject: (subject: Subject | null, slotDataIndex: number) => void;
    setUpdate: (update: boolean) => void;
    setSlotDataIndexToUpdate: Dispatch<number | null>;
}

export function SubjectAutocomplete({
    slotDatas,
    slotDataIndex,
    updateSubject,
    setSlotDataIndexToUpdate,
    setUpdate,
}: SubjectAutocompleteProps) {
    const { selectedValues } = useContext(SelectedValuesContext);
    const slotData = slotDatas![slotDataIndex];
    const currentSubject = slotData.Subject ?? null;
    const departmentId = Number(selectedValues.department.value);

    const [subjectData, setSubjects] = useState<SubjectResponse["subjects"]>(
        currentSubject ? [currentSubject] : [],
    );

    const [inputValue, setInputValue] = React.useState("");
    const [value, setValue] = React.useState<SubjectResponse["subjects"][0] | null>(currentSubject);
    useEffect(() => {
        setValue(currentSubject);
    }, [currentSubject]);

    useEffect(() => {
        // This has to be changed, department can divisionId must come from props or somewhere
        if (!departmentId) return;
        edenFetch<SubjectResponse>(api.departments({ id: departmentId }).subjects.get()).then(
            (data) => {
                setSubjects(data.subjects);
            },
        );
    }, [departmentId]);

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
                setSlotDataIndexToUpdate(slotDataIndex);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            options={subjectData}
            getOptionLabel={(option) => option.subjectName}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => <TextField {...params} label="Subject" />}
        />
    );
}
