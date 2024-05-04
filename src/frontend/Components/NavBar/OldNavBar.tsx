import React, { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
    AppBar as MuiAppBar,
    AppBarProps as MuiAppBarProps,
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
    IconButton,
} from "@mui/material";
import {
    ArrowDropDown as ArrowDropDownIcon,
    ArrowDropUp as ArrowDropUpIcon,
    Menu as MenuIcon,
} from "@mui/icons-material";
import { TimetableResponse } from "../../../backend/api/routes/responseTypes";
import { TimetableDataContext } from "../../context/TimetableDataContext";
import { useImmer } from "use-immer";
import { SetTimtableType } from "../../Pages/TimetableNewPage";

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

export default function OldNavBar({
    setTimetable,
    drawerState,
    drawerwidth,
}: {
    drawerState: boolean;
    drawerwidth: number;
    setTimetable: SetTimtableType;
}) {
    const [timetableSelector, setTimetableSelector] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const fetchTimetable = (
        setTimetable: SetTimtableType,
        url: string,
    ) => {
        fetch(url)
            .then((response) => response.json())
            .then((data) => setTimetable(data));
    };
    // ----- BELOW CODE ENABLES RESIZING NAVBAR BUT POPPER IS NO LONGER IN PLACE, ALSO UNCOMMENT APPBAR IN RETURN WITH OPEN PROP -----
    // const AppBar = styled(MuiAppBar, {
    //     shouldForwardProp: (prop) => prop !== "open",
    // })<AppBarProps>(({ theme, open }) => ({
    //     transition: theme.transitions.create(["margin", "width"], {
    //         easing: theme.transitions.easing.sharp,
    //         duration: theme.transitions.duration.leavingScreen,
    //     }),
    //     ...(open && {
    //         width: `calc(100% - ${drawerwidth}px)`,
    //         transition: theme.transitions.create(["margin", "width"], {
    //             easing: theme.transitions.easing.easeOut,
    //             duration: theme.transitions.duration.enteringScreen,
    //         }),
    //         marginRight: drawerwidth,
    //     }),
    // }));

    const AppBar = MuiAppBar;

    const options: { label: string; url: string }[] = [
        { label: "Division", url: "http://localhost:3000/divisions/2/timetable" },
        { label: "Teacher", url: "http://localhost:3000/teachers/1/timetable" },
        { label: "Classroom", url: "http://localhost:3000/classrooms/39/timetable" },
    ];

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setTimetableSelector(false);
        fetchTimetable(setTimetable, options[index].url);
    };

    const handleToggle = () => {
        setTimetableSelector((prevOpen) => !prevOpen);
    };

    const handleClose = (event: Event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }

        setTimetableSelector(false);
    };

    useEffect(() => {
        fetchTimetable(setTimetable, options[selectedIndex].url);
    }, []);

    return (
        // <AppBar position="fixed" color="primary" open={drawerState}>
        <AppBar position="fixed" color="primary">
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
                        aria-controls={timetableSelector ? "split-button-menu" : undefined}
                        aria-expanded={timetableSelector ? "true" : undefined}
                        aria-label="select timetable type"
                        aria-haspopup="menu"
                        onClick={handleToggle}
                    >
                        {timetableSelector ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                    </Button>
                </ButtonGroup>
                <Popper
                    sx={{
                        zIndex: 1,
                    }}
                    open={timetableSelector}
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
    );
}
