import { Box, FormControl, MenuItem, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { AcademicYearResponse } from "../../../backend/api/routes/responseTypes";
import api from "../..";

export default function AcademicYear() {
    const [data, setData] = React.useState<AcademicYearResponse["academicYears"]>([]);
    const [selectedData, setSelectedData] = React.useState<string | null>(null);
    useEffect(() => {
        api.academicYears.get().then(({ data, error }) => {
            if (error) {
                throw error;
            }
            setData(data ? data.academicYears : []);
        });
    }, []);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setSelectedData(event.target.value as string);
    };
    return (
        <Box width={200}>
            <FormControl fullWidth>
                <TextField onChange={handleChange} label="Academic Year" select fullWidth>
                    {data.map((academicYear) => (
                        <MenuItem key={academicYear.name} value={academicYear.name}>
                            {academicYear.id}: {academicYear.name} -{" "}
                            {new Date(Date.parse(String(academicYear.createdAt))).getFullYear()}
                        </MenuItem>
                    ))}
                </TextField>
            </FormControl>
        </Box>
    );
}
