import { Box, FormControl, MenuItem, TextField } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { ClassroomResponse } from "../../../backend/api/routes/responseTypes";
import api from "../..";
import { SelectedValuesContext } from "../../context/SelectedValuesContext";
import { TimetableType } from "../../../utils/types";

export default function Classroom() {
    const [data, setData] = React.useState<ClassroomResponse["classrooms"]>([]);
    const { selectedValues, setSelectedValues } = useContext(SelectedValuesContext);

    useEffect(() => {
        const id = selectedValues.academicYear.value;
        if (!id) {
            return;
        }
        api.academicYears({ id })
            .classrooms.get()
            .then(({ data, error }) => {
                if (error) return console.log(error);
                setData(data.classrooms);
            });
    }, [selectedValues.academicYear.value]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const selectedValue = event.target.value as string;
        setSelectedValues({
            ...selectedValues,
            classroom: { selected: true, value: selectedValue },
        });
    };

    return (
        <Box
            width={150}
            mr={"0.5rem"}
            ml={"0.5rem"}
            sx={{
                display:
                    selectedValues.timetableType.value === TimetableType.CLASSROOM
                        ? "block"
                        : "none",
            }}
        >
            <FormControl fullWidth>
                <TextField
                    onChange={handleChange}
                    label="Classroom"
                    select
                    fullWidth
                    disabled={!selectedValues.academicYear.selected}
                    value={selectedValues.classroom.value || ""}
                >
                    {data.map((classroom, i) => (
                        <MenuItem key={classroom.classroomName} value={classroom.id}>
                            {i + 1}: {classroom.classroomName}
                        </MenuItem>
                    ))}
                </TextField>
            </FormControl>
        </Box>
    );
}
