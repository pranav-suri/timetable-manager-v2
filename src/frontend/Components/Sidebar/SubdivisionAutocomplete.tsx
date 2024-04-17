import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { SubdivisionResponse, SubjectResponse, TimetableResponse } from "../../../backend/api/routes/responseTypes";
import { fetchAndSet } from "../fetchAndSet";
import api from "../..";

// Implementing SubdivisionAutocomplete
type Subdivision = SubdivisionResponse["subdivisions"][0];

interface SubdivisionAutocompleteProps {
    subdivisions: SubdivisionResponse["subdivisions"];
    slotData?: TimetableResponse["timetable"]["slots"][0]["SlotDatas"][0];
}

export function SubdivisionAutocomplete({ subdivisions, slotData }: SubdivisionAutocompleteProps) {
    const currentSubdivisions : Subdivision[] = [];
    for (const slotDataSubdivision of slotData?.SlotDataSubdivisions ?? []) {
        currentSubdivisions.push(slotDataSubdivision.Subdivision);
    }
    const [inputValue, setInputValue] = React.useState("");
    const [value, setValue] = React.useState<SubdivisionResponse["subdivisions"][0][]>(
        currentSubdivisions ?? [],
    );

    return (
        <Autocomplete
            multiple
            disablePortal
            autoHighlight
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            inputValue={inputValue} // CHANGE TO CURRENT SUBJECT ONCE PARENT FUNCTION CALLBACK IS ADDED
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            options={subdivisions}
            getOptionLabel={(option) => option.subdivisionName}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => <TextField {...params} label="Subdivision" />}
        />
    );
}