import React, { useContext } from "react";
import { Box, FormControl, MenuItem, TextField } from "@mui/material";
import { SelectedValuesContext } from "../../context/SelectedValuesContext";
import { TimetableType as ETimetableType } from "../../../utils/types";

export default function TimetableType() {
    const { selectedValues, setSelectedValues } = useContext(SelectedValuesContext);

    const data: { name: string; value: ETimetableType }[] = [
        { name: "Division", value: 0 },
        { name: "Teacher", value: 1 },
        { name: "Classroom", value: 2 },
    ];

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setSelectedValues({
            ...selectedValues,
            timetableType: { selected: true, value: Number(event.target.value) as ETimetableType },
        });
    };
    return (
        <Box width={150} mr={"0.5rem"} ml={"0.5rem"}>
            <FormControl fullWidth>
                <TextField
                    onChange={handleChange}
                    label="Timetable Type"
                    select
                    fullWidth
                    defaultValue={""}
                >
                    {data.map((timetableType, i) => (
                        <MenuItem key={timetableType.name} value={timetableType.value}>
                            {i + 1}: {timetableType.name}
                        </MenuItem>
                    ))}
                </TextField>
            </FormControl>
        </Box>
    );
}
