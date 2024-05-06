import { Box, FormControl, MenuItem, TextField } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { DivisionResponse } from "../../../backend/api/routes/responseTypes";
import api from "../..";
import { SelectedValuesContext } from "../../context/SelectedValuesContext";
import { TimetableType } from "../../../utils/types";

export default function Division() {
    const [data, setData] = React.useState<DivisionResponse["divisions"]>([]);
    const { selectedValues, setSelectedValues } = useContext(SelectedValuesContext);

    useEffect(() => {
        const id = selectedValues.department.value;
        if (!id) {
            return;
        }
        api.departments({ id })
            .divisions.get()
            .then(({ data, error }) => {
                if (error) return console.log(error);
                setData(data.divisions);
            });
    }, [selectedValues.department.value]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const selectedValue = event.target.value as string;
        setSelectedValues({
            ...selectedValues,
            division: { selected: true, value: selectedValue },
        });
    };

    return (
        <Box
            width={150}
            mr={"0.5rem"}
            ml={"0.5rem"}
            sx={{
                display:
                    selectedValues.timetableType.value === TimetableType.DIVISION
                        ? "block"
                        : "none",
            }}
        >
            <FormControl fullWidth>
                <TextField
                    onChange={handleChange}
                    label="Division"
                    select
                    fullWidth
                    disabled={!selectedValues.department.selected}
                    value={selectedValues.division.value || ""}
                >
                    {data.map((division, i) => (
                        <MenuItem key={division.divisionName} value={division.id}>
                            {i + 1}: {division.divisionName}
                        </MenuItem>
                    ))}
                </TextField>
            </FormControl>
        </Box>
    );
}
