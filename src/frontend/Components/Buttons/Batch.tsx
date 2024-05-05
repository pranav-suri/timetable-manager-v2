import { Box, FormControl, MenuItem, TextField } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { BatchResponse } from "../../../backend/api/routes/responseTypes";
import api from "../..";
import { SelectedValuesContext } from "../../context/SelectedValuesContext";

export default function Batch() {
    const [data, setData] = React.useState<BatchResponse["batches"]>([]);
    const { selectedValues, setSelectedValues } = useContext(SelectedValuesContext);

    useEffect(() => {
        const id = selectedValues.academicYear.value;
        if (!id) {
            return;
        }
        api.academicYears({ id })
            .batches.get()
            .then(({ data, error }) => {
                if (error) return console.log(error);
                setData(data.batches);
            });
    }, [selectedValues.academicYear.value]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const selectedValue = event.target.value as string;
        setSelectedValues({
            ...selectedValues,
            batch: { selected: true, value: selectedValue },
        });
    };

    return (
        <Box width={150} mr={"0.5rem"} ml={"0.5rem"}>
            <FormControl fullWidth>
                <TextField
                    onChange={handleChange}
                    label="Batch"
                    select
                    fullWidth
                    disabled={!selectedValues.academicYear.selected}
                    value={selectedValues.batch.value || ""}
                >
                    {data.map((batch, i) => (
                        <MenuItem key={batch.batchName} value={batch.id}>
                            {i + 1}: {batch.batchName}
                        </MenuItem>
                    ))}
                </TextField>
            </FormControl>
        </Box>
    );
}
