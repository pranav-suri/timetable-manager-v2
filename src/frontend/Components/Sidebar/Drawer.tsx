import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
    Box,
    Drawer,
    AppBar as MuiAppBar,
    AppBarProps as MuiAppBarProps,
    Toolbar,
    CssBaseline,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Autocomplete,
    TextField,
} from "@mui/material";
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    MoveToInbox as InboxIcon,
    Mail as MailIcon,
} from "@mui/icons-material";
import { SubjectResponse, TeacherResponse, TimetableResponse } from "../../../backend/api/routes/responseTypes";
import { fetchAndSet } from "../fetchAndSet";
import api from "../..";
import OldTimetable from "../Timetable/OldTimetable";
import OldNavBar from "../NavBar/OldNavBar";
import { TeacherAutocomplete } from "./TeacherAutocomplete";
import { SubjectAutocomplete } from "./SubjectAutocomplete";

type Timetable = TimetableResponse["timetable"];
type Slots = Timetable["slots"];
type SlotDatas = Slots[0]["SlotDatas"];
type SlotDataClasses = SlotDatas[0]["SlotDataClasses"];
type SlotDataSubdivisions = SlotDatas[0]["SlotDataSubdivisions"];

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
    }),
    /**
     * This is necessary to enable the selection of content. In the DOM, the stacking order is determined
     * by the order of appearance. Following this rule, elements appearing later in the markup will overlay
     * those that appear earlier. Since the Drawer comes after the Main content, this adjustment ensures
     * proper interaction with the underlying content.
     */
    position: "relative",
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: drawerWidth,
    }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
}));

export function PersistentDrawerRight() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const [inputValue, setInputValue] = React.useState("");
    const [sidebarData, setSidebarData] = React.useState<Slots[0] | null>(null);
    const [allTeachersData, setAllTeacherData] = React.useState<TeacherResponse | null>(null);
    const [timetableData, setTimetable] = React.useState<TimetableResponse | null>(null);
    const [subjectsData, setSubjects] = React.useState<SubjectResponse | null>(null);
    const [subjectTeachersData, setSubjectTeacherData] = React.useState<TeacherResponse | null>(
        null,
    );
    const [slotData, setSlotData] = React.useState<SlotDatas[0] | null>(null);
    const [currentTeacher, setValue] = React.useState<TeacherResponse["teachers"][0] | null>(null);
    React.useEffect(() => {
        fetchAndSet(setTimetable, api.divisions({ id: 2 }).timetable.get());
    }, []);
    React.useEffect(() => {
        fetchAndSet(setSubjectTeacherData, api.subjects({ id: 1 }).teachers.get());
        fetchAndSet(setSubjects, api.departments({ id: 2 }).subjects.get());
        setSidebarData(timetableData?.timetable.slots[4] ?? null);
        setSlotData(timetableData?.timetable.slots[4].SlotDatas[0] ?? null);
        const currentTeacher = timetableData?.timetable.slots[4].SlotDatas[0]?.Teacher;
        setValue(currentTeacher ?? null);
    }, [timetableData]);
    const allTeacher = allTeachersData?.teachers;
    const subjectTeachers = subjectTeachersData?.teachers ?? [];
    const {subjects} = subjectsData ?? {subjects: []};
    const slots = timetableData?.timetable.slots;
    
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const getTeacherLabels = (teacher: TeacherResponse["teachers"][0]) => {
        return teacher.teacherName;
    };
    
    if (!slots) return "Data missing or invalid in drawer";
    // if (!slotData) return "SlotData missing or invalid in drawer";
    if (!subjects) return "SubjectData missing or invalid in drawer";

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
                        Persistent drawer
                    </Typography>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={handleDrawerOpen}
                        sx={{ ...(open && { display: "none" }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Main open={open}>
                <DrawerHeader />
                <OldNavBar>
                    <OldTimetable />
                </OldNavBar>
            </Main>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                    },
                }}
                variant="persistent"
                anchor="right"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === "rtl" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <div>{`value: ${currentTeacher !== null ? `'${currentTeacher}'` : "null"}`}</div>
                <div>{`inputValue: '${inputValue}'`}</div>
                {/* <Autocomplete
                    disablePortal
                    autoHighlight
                    value={currentTeacher}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                    }}
                    id="combo-box-demo"
                    getOptionLabel={getTeacherLabels}
                    options={subjectTeachers}
                    sx={{ width: drawerWidth - 40 }}
                    renderInput={(params) => <TextField {...params} label="Movie" />}
                /> */}
                <TeacherAutocomplete slotData={slotData} />
                <SubjectAutocomplete subjects={subjects} slotData={slotData} />

            </Drawer>
        </Box>
    );
}
