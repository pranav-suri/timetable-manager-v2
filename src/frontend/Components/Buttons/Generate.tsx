import { Button } from "@mui/material";
import { SelectedValuesContext } from "../../context/SelectedValuesContext";
import React, { useContext, useEffect, useRef } from "react";
import api from "../..";
import { TimetableDataContext } from "../../context/TimetableDataContext";
import { TimetableResponse } from "../../../backend/api/routes/responseTypes";
import { edenFetch } from "../fetchAndSet";

export default function Generate() {
    const isDisabled = useRef(true);
    const { selectedValues } = useContext(SelectedValuesContext);
    const { setTimetable, setAvailable } = useContext(TimetableDataContext);
    const handleClick = () => {
        const divisionId = selectedValues.division.value;
        const departmentId = selectedValues.department.value;
        if (!divisionId || !departmentId) return;
        edenFetch(api.generateTT.department({ id: departmentId }).get()).then((data) => {
            console.log(data);
            api.divisions({ id: divisionId })
                .timetable.get()
                .then(({ data, error }) => {
                    if (error) return console.log(error);
                    setTimetable(data ?? ({} as TimetableResponse));
                    setAvailable(true);
                });
        });
    };

    useEffect(() => {
        if (!selectedValues.division.value || !selectedValues.department.value) {
            isDisabled.current = true;
        } else {
            isDisabled.current = false;
        }
    }, [selectedValues.division.value, selectedValues.department.value]);

    return (
        <Button
            variant="contained"
            sx={{ height: "3rem" }}
            onClick={handleClick}
            disabled={isDisabled.current}
        >
            Generate New
        </Button>
    );
}
