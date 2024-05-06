import { Box, FormControl, MenuItem, TextField } from "@mui/material";
import React, { useEffect, useContext } from "react";
import { SelectedValuesContext } from "../../context/SelectedValuesContext";
import { AcademicYearResponse } from "../../../backend/api/routes/responseTypes";
import api from "../..";

export default function AcademicYear() {
    const [data, setData] = React.useState<AcademicYearResponse["academicYears"]>([]);

    const { selectedValues, setSelectedValues } = useContext(SelectedValuesContext);

    useEffect(() => {
        api.academicYears.get().then(({ data, error }) => {
            if (error) return console.log(error);
            setData(data ? data.academicYears : []);
        });
    }, []);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setSelectedValues({
            ...selectedValues,
            academicYear: { selected: true, value: event.target.value },
        });
    };
    return (
        <Box width={150} mr={"0.5rem"} ml={"0.5rem"}>
            <FormControl fullWidth>
                <TextField
                    onChange={handleChange}
                    label="Academic Year"
                    select
                    fullWidth
                    defaultValue={""}
                >
                    {data.map((academicYear, i) => (
                        <MenuItem key={academicYear.name} value={academicYear.id}>
                            {i + 1}: {academicYear.name} - {academicYear.year}
                        </MenuItem>
                    ))}
                </TextField>
            </FormControl>
        </Box>
    );
}
