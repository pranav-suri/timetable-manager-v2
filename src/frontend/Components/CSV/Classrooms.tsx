import React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

export default function InputFileUpload() {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        if (file === null) return;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("academicYearId", "1");
        fetch("http://localhost:3000/csv/classrooms", {
            method: "POST",
            body: formData,
        });
    };
    return (
        <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            sx={{margin: "0.5rem"}}

        >
            Classroom Upload
            <VisuallyHiddenInput type="file" accept=".csv" onChange={handleFileChange} />
        </Button>
    );
}
