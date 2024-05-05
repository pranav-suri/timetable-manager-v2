import React, { Dispatch, useContext, useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { SubdivisionResponse, TimetableResponse } from "../../../backend/api/routes/responseTypes";
import { SelectedValuesContext } from "../../context/SelectedValuesContext";
import { edenFetch } from "../fetchAndSet";
import api from "../..";

// Implementing SubdivisionAutocomplete
type Subdivisions = SubdivisionResponse["subdivisions"];

interface SubdivisionAutocompleteProps {
    slotDatas: TimetableResponse["timetable"]["slots"][0]["SlotDatas"];
    slotDataIndex: number;
    updateSubdivisions: (subdivisions: Subdivisions, slotDataIndex: number) => void;
    setUpdate: (update: boolean) => void;
    setSlotDataIndexToUpdate: Dispatch<number | null>;
}

export function SubdivisionAutocomplete({
    slotDatas,
    slotDataIndex,
    updateSubdivisions,
    setUpdate,
    setSlotDataIndexToUpdate,
}: SubdivisionAutocompleteProps) {
    const { selectedValues } = useContext(SelectedValuesContext);
    const divisionId = Number(selectedValues.division.value);
    const slotData = slotDatas![slotDataIndex];
    const slotId = slotData.SlotId;
    const currentSubdivisions: Subdivisions = slotData.SlotDataSubdivisions!.map(
        (slotDataSubdivision) => slotDataSubdivision.Subdivision!,
    );
    const [inputValue, setInputValue] = React.useState("");
    const [value, setValue] = React.useState<Subdivisions>(currentSubdivisions);
    const [availableSubdivisionData, setAvailableSubdivisionData] = useState<
        SubdivisionResponse["subdivisions"]
    >([...currentSubdivisions]);

    // useEffect(() => {
    //     setValue(currentSubdivisions);
    // }, [currentSubdivisions]);

    useEffect(() => {
        setValue(currentSubdivisions);
        setAvailableSubdivisionData([...currentSubdivisions]);
        if (!divisionId) return;
        edenFetch<SubdivisionResponse>(
            api.available.subdivisions.get({ query: { slotId, divisionId } }),
        ).then((data) => {
            const subdivisions = data.subdivisions;
            const allSubdivisions = subdivisions.concat(currentSubdivisions ?? []);
            setValue(currentSubdivisions);
            setAvailableSubdivisionData(allSubdivisions);
        });
        // It is the only needed dependency, other dependencies are not needed
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slotDatas]);

    return (
        <Autocomplete
            // disableCloseOnSelect
            multiple
            limitTags={2}
            sx={{ margin: "5px" }}
            disablePortal
            autoHighlight
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
                updateSubdivisions(newValue, slotDataIndex);
                setUpdate(true);
                setSlotDataIndexToUpdate(slotDataIndex);
            }}
            inputValue={inputValue} // CHANGE TO CURRENT SUBJECT ONCE PARENT FUNCTION CALLBACK IS ADDED
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            options={availableSubdivisionData}
            getOptionLabel={(option) => option.subdivisionName}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => <TextField {...params} label="Subdivisions" />}
        />
    );
}
