import React, { useContext, useEffect, useRef } from "react";
import { ViewAllDataContext } from "../../context/ViewAllDataContext";
import { CloseFullscreen, OpenInFull } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { SelectedValuesContext } from "../../context/SelectedValuesContext";
import { TimetableType } from "../../../utils/types";

export default function ToggleAllData() {
    const { viewAllData, setViewAllData } = useContext(ViewAllDataContext);
    const { selectedValues } = useContext(SelectedValuesContext);
    const isDisabled = useRef(true);

    const handleChange = () => {
        setViewAllData(!viewAllData);
    };

    useEffect(() => {
        if (selectedValues.timetableType.value === TimetableType.CLASSROOM) {
            if (!selectedValues.academicYear.selected || !selectedValues.classroom.selected) {
                isDisabled.current = true;
            } else isDisabled.current = false;
        } else if (selectedValues.timetableType.value === TimetableType.DIVISION) {
            if (
                !selectedValues.academicYear.selected ||
                !selectedValues.batch.selected ||
                !selectedValues.department.selected ||
                !selectedValues.division.selected
            ) {
                isDisabled.current = true;
            } else {
                isDisabled.current = false;
            }
        } else if (selectedValues.timetableType.value === TimetableType.TEACHER) {
            if (!selectedValues.academicYear.selected || !selectedValues.teacher.selected) {
                isDisabled.current = true;
            } else {
                isDisabled.current = false;
            }
        }
    }, [selectedValues]);

    return (
        <Tooltip title="Show All Data">
            <IconButton onClick={handleChange} disabled={isDisabled.current}>
                {viewAllData ? <CloseFullscreen /> : <OpenInFull />}
            </IconButton>
        </Tooltip>
    );
}
