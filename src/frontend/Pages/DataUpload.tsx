import React from "react";
import { Card, CardContent, CardHeader, List, ListItem, Paper, Typography } from "@mui/material";
import {
    BatchAndSubdivisionUpload,
    ClassroomUpload,
    SubjectAndTeacherUpload,
} from "../Components/CSV";

export default function DataUpload() {
    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                maxWidth: "35rem",
            }}
            variant="outlined"
        >
            <CardHeader title={"DATA UPLOAD"} />
            <CardContent>
                <Typography>
                    Use this page to upload the required data for the timetable generation. The data
                    required is as follows:{" "}
                    <List>
                        <ListItem>1. Batch and Subdivision Data </ListItem>
                        <ListItem>2. Classroom Data</ListItem>
                        <ListItem>3. Subject and Teacher Data</ListItem>
                    </List>
                </Typography>
            </CardContent>
            <Paper
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: "25rem",
                    margin: "1rem",
                    padding: "1rem",
                }}
                variant="outlined"
            >
                <BatchAndSubdivisionUpload />
                <ClassroomUpload />
                <SubjectAndTeacherUpload />
            </Paper>
        </Card>
    );
}
