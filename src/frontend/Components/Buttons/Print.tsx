import { IconButton, Tooltip } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import React, { useContext, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { SelectedValuesContext } from "../../context/SelectedValuesContext";
import { TimetableType } from "../../../utils/types";

const getName = (selectedValues: {
    timetableType: {
        selected: boolean;
        value: TimetableType;
    };
    academicYear: {
        selected: boolean;
        value: string;
    };
    batch: {
        selected: boolean;
        value: string;
    };
    department: {
        selected: boolean;
        value: string;
    };
    division: {
        selected: boolean;
        value: string;
    };
    teacher: {
        selected: boolean;
        value: string;
    };
    subject: {
        selected: boolean;
        value: string;
    };
    classroom: {
        selected: boolean;
        value: string;
    };
}) => {
    if (selectedValues.timetableType.value === TimetableType.DIVISION) {
        return `${selectedValues.academicYear.value}-${selectedValues.batch.value}-${selectedValues.department.value}-${selectedValues.division.value}-timetable`;
    } else if (selectedValues.timetableType.value === TimetableType.TEACHER) {
        return `${selectedValues.academicYear.value}-${selectedValues.teacher.value}-timetable`;
    } else if (selectedValues.timetableType.value === TimetableType.CLASSROOM) {
        return `${selectedValues.academicYear.value}-${selectedValues.classroom.value}-timetable`;
    } else return "Insert Name Here";
};

export default function Print({ pdfComponent }: { pdfComponent: React.RefObject<HTMLDivElement> }) {
    const { selectedValues } = useContext(SelectedValuesContext);
    const isDisabled = useRef(true);

    const generatePdf = useReactToPrint({
        content: () => pdfComponent.current,
        documentTitle: getName(selectedValues),
    });

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
        <Tooltip title="Generate PDF">
            <IconButton onClick={generatePdf} disabled={isDisabled.current}>
                <PrintIcon />
            </IconButton>
        </Tooltip>
    );
}
