import React, { SyntheticEvent, useContext, useEffect } from "react";
import Switch from "@mui/material/Switch";
import { FormControlLabel } from "@mui/material";
import { ViewAllDataContext } from "../../context/ViewAllDataContext";

export default function ToggleAllData() {
    const { setViewAllData } = useContext(ViewAllDataContext);
    const handleChange = (event: SyntheticEvent<Element, Event>, checked: boolean) => {
        setViewAllData(checked);
    };

    return (
        <FormControlLabel
            onChange={handleChange}
            control={<Switch />}
            label="View all data"
            labelPlacement="bottom"
        />
    );
}
