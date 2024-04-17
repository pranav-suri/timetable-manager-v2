import React, { useEffect, useState } from "react";
import {
    AppBar,
    Button,
    CircularProgress,
    Toolbar,
    ButtonGroup,
    Paper,
    ClickAwayListener,
    MenuList,
    MenuItem,
    Popper,
    Grow,
    Typography,
} from "@mui/material";
import {
    ArrowDropDown as ArrowDropDownIcon,
    ArrowDropUp as ArrowDropUpIcon,
} from "@mui/icons-material";
import { TimetableResponse } from "../../backend/api/routes/responseTypes";
import { TimetableDataContext } from "../context/TimetableDataContext";

export default function OldNavBar({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [data, setData] = useState<TimetableResponse | null>(null);

    const fetchTimetable = (
        setData: React.Dispatch<React.SetStateAction<TimetableResponse | null>>,
        url: string,
    ) => {
        fetch(url)
            .then((response) => response.json())
            .then((data) => setData(data));
    };

    const options: { label: string; url: string }[] = [
        { label: "Division", url: "http://localhost:3000/divisions/2/timetable" },
        { label: "Teacher", url: "http://localhost:3000/teachers/1/timetable" },
        { label: "Classroom", url: "http://localhost:3000/classrooms/1/timetable" },
    ];

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setOpen(false);
        fetchTimetable(setData, options[index].url);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: Event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }

        setOpen(false);
    };

    useEffect(() => {
        fetchTimetable(setData, options[selectedIndex].url);
    }, []);
    console.log("Rerendered");  
    return (
        <TimetableDataContext.Provider value={data as TimetableResponse}>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography mr={2}>Timetable Type:</Typography>
                    <ButtonGroup
                        variant="contained"
                        aria-label="Button group with a nested menu"
                        id="split-button-menu"
                        ref={anchorRef}
                    >
                        <Button onClick={handleToggle}>{options[selectedIndex].label}</Button>
                        <Button
                            size="small"
                            aria-controls={open ? "split-button-menu" : undefined}
                            aria-expanded={open ? "true" : undefined}
                            aria-label="select timetable type"
                            aria-haspopup="menu"
                            onClick={handleToggle}
                        >
                            {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                        </Button>
                    </ButtonGroup>
                    <Popper
                        sx={{
                            zIndex: 1,
                        }}
                        open={open}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        transition
                        disablePortal
                    >
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin:
                                        placement === "bottom" ? "center top" : "center bottom",
                                }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList id="split-button-menu" autoFocusItem>
                                            {options.map((option, index) => (
                                                <MenuItem
                                                    key={option.label}
                                                    selected={index === selectedIndex}
                                                    onClick={(event) =>
                                                        handleMenuItemClick(event, index)
                                                    }
                                                >
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </Toolbar>
            </AppBar>
            {children}
        </TimetableDataContext.Provider>
    );
}
