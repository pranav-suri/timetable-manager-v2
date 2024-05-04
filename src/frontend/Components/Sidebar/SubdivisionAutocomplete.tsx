import React, { useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import {
    SubdivisionResponse,
    SubjectResponse,
    TimetableResponse,
} from "../../../backend/api/routes/responseTypes";
import { fetchAndSet } from "../fetchAndSet";
import api from "../..";

// Implementing SubdivisionAutocomplete
type Subdivisions = SubdivisionResponse["subdivisions"];

interface SubdivisionAutocompleteProps {
    subdivisions: Subdivisions;
    slotDatas: TimetableResponse["timetable"]["slots"][0]["SlotDatas"];
    slotDataIndex: number;
    updateSubdivisions: (subdivisions: Subdivisions, slotDataIndex: number) => void;
    setUpdate: (update: boolean) => void;
}

export function SubdivisionAutocomplete({
    subdivisions,
    slotDatas,
    slotDataIndex,
    updateSubdivisions,
    setUpdate
}: SubdivisionAutocompleteProps) {
    const slotData = slotDatas![slotDataIndex];
    const currentSubdivisions: Subdivisions = slotData.SlotDataSubdivisions!.map(
        (slotDataSubdivision) => slotDataSubdivision.Subdivision!,
    );
    const [inputValue, setInputValue] = React.useState("");
    const [value, setValue] = React.useState<Subdivisions>(
        currentSubdivisions ?? [],
    );

    useEffect(() => {
        setValue(currentSubdivisions);
    }, [slotData]);

    return (
        <Autocomplete
            disableCloseOnSelect
            multiple
            limitTags={2}
            sx={{margin: "5px"}}
            disablePortal
            autoHighlight
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
                updateSubdivisions(newValue, slotDataIndex);
                setUpdate(true);
            }}
            inputValue={inputValue} // CHANGE TO CURRENT SUBJECT ONCE PARENT FUNCTION CALLBACK IS ADDED
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            options={subdivisions}
            getOptionLabel={(option) => option.subdivisionName}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => <TextField {...params} label="Subdivisions" />}
        />
    );
}
