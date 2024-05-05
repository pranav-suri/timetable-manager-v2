import { Button } from "@mui/material";
import { SelectedValuesContext } from "../../context/SelectedValuesContext";
import React, { useContext } from "react";
import api from "../..";
import { TimetableDataContext } from "../../context/TimetableDataContext";
import { TimetableResponse } from "../../../backend/api/routes/responseTypes";

export default function View() {
    const { selectedValues } = useContext(SelectedValuesContext);
    const { setTimetable, setAvailable } = useContext(TimetableDataContext);
    const handleClick = () => {
        const id = selectedValues.division.value;
        api.divisions({ id })
            .timetable.get()
            .then(({ data, error }) => {
                if (error) return console.log(error);
                setTimetable(data ?? ({} as TimetableResponse));
                setAvailable(true);
            });
    };
    return (
        <Button variant="contained" sx={{ height: "3rem" }} onClick={handleClick}>
            View
        </Button>
    );
}
