import { Box, FormControl, MenuItem, TextField } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { TeacherResponse } from "../../../backend/api/routes/responseTypes";
import api from "../..";
import { SelectedValuesContext } from "../../context/SelectedValuesContext";
import { TimetableType } from "../../../utils/types";

export default function Teacher() {
    const [data, setData] = React.useState<TeacherResponse["teachers"]>([]);
    const { selectedValues, setSelectedValues } = useContext(SelectedValuesContext);

    useEffect(() => {
        const id = selectedValues.academicYear.value;
        if (!id) {
            return;
        }
        api.academicYears({ id })
            .teachers.get()
            .then(({ data, error }) => {
                if (error) return console.log(error);
                setData(data.teachers);
            });
    }, [selectedValues.academicYear.value]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const selectedValue = event.target.value as string;
        setSelectedValues({
            ...selectedValues,
            teacher: { selected: true, value: selectedValue },
        });
    };

    return (
        <Box
            width={150}
            mr={"0.5rem"}
            ml={"0.5rem"}
            sx={{
                display:
                    selectedValues.timetableType.value === TimetableType.TEACHER ? "block" : "none",
            }}
        >
            <FormControl fullWidth>
                <TextField
                    onChange={handleChange}
                    label="Teacher"
                    select
                    fullWidth
                    disabled={!selectedValues.academicYear.selected}
                    value={selectedValues.teacher.value || ""}
                >
                    {data.map((teacher, i) => (
                        <MenuItem key={teacher.teacherName} value={teacher.id}>
                            {i + 1}: {teacher.teacherName}
                        </MenuItem>
                    ))}
                </TextField>
            </FormControl>
        </Box>
    );
}
