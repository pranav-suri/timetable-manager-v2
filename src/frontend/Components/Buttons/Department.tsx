import { Box, FormControl, MenuItem, TextField } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { DepartmentResponse } from "../../../backend/api/routes/responseTypes";
import api from "../..";
import { SelectedValuesContext } from "../../context/SelectedValuesContext";

export default function Department() {
    const [data, setData] = React.useState<DepartmentResponse["departments"]>([]);
    const { selectedValues, setSelectedValues } = useContext(SelectedValuesContext);

    useEffect(() => {
        const id = selectedValues.batch.value;
        if (!id) {
            return;
        }
        api.batches({ id })
            .departments.get()
            .then(({ data, error }) => {
                if (error) return console.log(error);
                setData(data.departments);
            });
    }, [selectedValues.batch.value]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const selectedValue = event.target.value as string;
        setSelectedValues({
            ...selectedValues,
            department: { selected: true, value: selectedValue },
        });
    };

    return (
        <Box width={150} mr={"0.5rem"} ml={"0.5rem"}>
            <FormControl fullWidth>
                <TextField
                    onChange={handleChange}
                    label="Department"
                    select
                    fullWidth
                    disabled={!selectedValues.batch.selected}
                    value={selectedValues.department.value || ""}
                >
                    {data.map((department, i) => (
                        <MenuItem key={department.departmentName} value={department.id}>
                            {i + 1}: {department.departmentName.toUpperCase()}
                        </MenuItem>
                    ))}
                </TextField>
            </FormControl>
        </Box>
    );
}
