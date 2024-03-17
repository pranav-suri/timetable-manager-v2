import {
    AcademicYear,
    Batch,
    Classroom,
    Department,
    Division,
    Group,
    Slot,
    Subdivision,
    Subject,
    Teach,
    Teacher,
    TeacherUnavailable,
    Timetable,
    TimetableClass,
} from "../../database";
import Papa from "papaparse";
import sequelize from "../../database/sequelize";

const batchAndSubdivisionData = {
    batch_name: "",
    department_name: "",
    division_name: "",
    subdivision_name: "",
};

type BatchAndSubdivisionData = typeof batchAndSubdivisionData;

const classroomData = {
    classroom_name: "",
    is_lab: "",
};

type ClassroomData = typeof classroomData;

const subjectAndTeacherData = {
    subject_name: "",
    department_name: "",
    batch_name: "",
    is_lab: "",
    group_name: "",
    group_allow_simultaneous: "",
    teacher_name: "",
    teacher_email: "",
};

type SubjectAndTeacherData = typeof subjectAndTeacherData;

const unavailabilityData = {
    teacher_email: "",
    day: "",
    slot_number: "",
};

type UnavailabilityData = typeof unavailabilityData;

const slotData = {
    day: "",
    number: "",
};
type SlotData = typeof slotData;

type CsvType =
    | "batchAndSubdivisionData"
    | "classroomData"
    | "subjectAndTeacherData"
    | "unavailabilityData"
    | "slotData";

function validateCsvData(
    parsedCsv: Papa.ParseResult<
        | BatchAndSubdivisionData
        | ClassroomData
        | SubjectAndTeacherData
        | UnavailabilityData
        | SlotData
    >,
    csvType: CsvType
) {
    // This function will parse csv data handle errors with missing headings
    // This does not validate missing data in each row
    let expectedKeys: string[] = [];
    let dataKeys: string[] = [];

    switch (csvType) {
        case "batchAndSubdivisionData":
            expectedKeys = Object.keys(batchAndSubdivisionData);
            dataKeys = Object.keys(parsedCsv.data[0]);
            break;
        case "classroomData":
            expectedKeys = Object.keys(classroomData);
            dataKeys = Object.keys(parsedCsv.data[0]);
            break;
        case "subjectAndTeacherData":
            expectedKeys = Object.keys(subjectAndTeacherData);
            dataKeys = Object.keys(parsedCsv.data[0]);
            break;
        case "unavailabilityData":
            expectedKeys = Object.keys(unavailabilityData);
            dataKeys = Object.keys(parsedCsv.data[0]);
            break;
        case "slotData":
            expectedKeys = Object.keys(slotData);
            dataKeys = Object.keys(parsedCsv.data[0]);
            break;
        default:
            console.log("Unhandled Validation in validateCsvData function");
            return false;
            break;
    }
    for (const error of parsedCsv.errors) {
        // This works for now but need to handle this better
        // This runs in case of missing headings (missing commas at the last row of the csv file)
        if (error.row !== undefined) {
            // Above if statement just to calm down TS compiler
            // console.log("Deleting row: ", error.row + 2); // +2 because top row is header and data starts from index 0
            // console.log("Row data: ", parsedCsv.data[error.row])
            parsedCsv.data.splice(error.row, 1);
        }
    }

    let valid = true;
    // Check if all expected keys are present in the data[0] object
    for (const key of expectedKeys) {
        if (!dataKeys.includes(key)) {
            valid = false;
            console.log("Header missing: ", key);
        }
    }
    if (!valid) return false;
    return true;
}

function validateRowData() {
    // This function will check for null values in the csv data
    return true;
}

async function uploadBatchAndSubdivsionData(
    csvData: string,
    acad_year_id: AcademicYear["id"]
) {
    const parsedCsv = Papa.parse<BatchAndSubdivisionData>(csvData, {
        header: true,
    });

    if (!validateCsvData(parsedCsv, "batchAndSubdivisionData")) return false;

    for (const row of parsedCsv.data) {
        const { batch_name, department_name, division_name, subdivision_name } =
            row;
        const [batch, isCreatedBatch] = await Batch.findOrCreate({
            where: { batchName: batch_name, AcademicYearId: acad_year_id },
        });
        const [department, isCreatedDepartment] = await Department.findOrCreate(
            {
                where: { departmentName: department_name, BatchId: batch.id },
            }
        );
        const [division, isCreatedDivision] = await Division.findOrCreate({
            where: { divisionName: division_name, DepartmentId: department.id },
        });
        const [subdivision, isCreatedSubdivision] =
            await Subdivision.findOrCreate({
                where: {
                    subdivisionName: subdivision_name,
                    DivisionId: division.id,
                },
            });
    }
    return true;
}

async function uploadClassroomData(
    csvData: string,
    acad_year_id: AcademicYear["id"]
) {
    const parsedCsv = Papa.parse<ClassroomData>(csvData, {
        header: true,
    });
    if (!validateCsvData(parsedCsv, "classroomData")) {
        return false;
    }
    for (const row of parsedCsv.data) {
        const { classroom_name, is_lab } = row;

        const [classroom, isCreatedClassroom] = await Classroom.findOrCreate({
            where: {
                classroomName: classroom_name,
                isLab: is_lab,
                AcademicYearId: acad_year_id,
            },
        });
    }
    return true;
}

async function uploadTestSlotData(
    csvData: string,
    acad_year_id: AcademicYear["id"]
) {
    const parsedCsv = Papa.parse<SlotData>(csvData, {
        header: true,
    });
    if (!validateCsvData(parsedCsv, "slotData")) {
        console.log("Errors in CSV file");
        return false;
    }
    for (const row of parsedCsv.data) {
        const { day, number } = row;

        const [slot, isCreatedSlot] = await Slot.findOrCreate({
            where: {
                day: day,
                number: number,
                AcademicYearId: acad_year_id,
            },
        });
    }
    return true;
}

async function uploadSubjectAndTeacherData(
    csvData: string,
    acad_year_id: AcademicYear["id"]
) {
    const parsedCsv = Papa.parse<SubjectAndTeacherData>(csvData, {
        header: true,
    });
    if (!validateCsvData(parsedCsv, "subjectAndTeacherData")) {
        return false;
    }
    for (const row of parsedCsv.data) {
        const {
            batch_name,
            department_name,
            group_name,
            group_allow_simultaneous,
            is_lab,
            subject_name,
            teacher_email,
            teacher_name,
        } = row;

        const [batch, isCreatedBatch] = await Batch.findOrCreate({
            where: { batchName: batch_name, AcademicYearId: acad_year_id },
        });

        const [department, isCreatedDepartment] = await Department.findOrCreate(
            {
                where: { departmentName: department_name, BatchId: batch.id },
            }
        );
        const [group, isCreatedGroup] = await Group.findOrCreate({
            where: {
                groupName: group_name,
                allowSimultaneous: group_allow_simultaneous,
                AcademicYearId: acad_year_id,
            },
        });

        const [subject, isCreatedSubject] = await Subject.findOrCreate({
            where: {
                subjectName: subject_name,
                isLab: is_lab,
                DepartmentId: department.id,
                GroupId: group.id,
            },
        });

        const [teacher, isCreatedTeacher] = await Teacher.findOrCreate({
            where: {
                teacherName: teacher_name,
                teacherEmail: teacher_email,
                AcademicYearId: acad_year_id,
            },
        });

        const [teach, isCreatedTeach] = await Teach.findOrCreate({
            where: {
                TeacherId: teacher.id,
                SubjectId: subject.id,
            },
        });
    }

    return true;
}

async function uploadUnavailabilityData(
    csvData: string,
    acad_year_id: AcademicYear["id"]
) {
    const parsedCsv = Papa.parse<UnavailabilityData>(csvData, { header: true });

    if (!validateCsvData(parsedCsv, "unavailabilityData")) {
        console.log("Errors in CSV file");
        return false;
    }
    for (const row of parsedCsv.data) {
        const { day, slot_number, teacher_email } = row;

        const teacher = await Teacher.findOne({
            where: {
                teacherEmail: teacher_email,
                AcademicYearId: acad_year_id,
            },
        });
        const slot = await Slot.findOne({
            where: {
                day: day,
                number: slot_number,
                AcademicYearId: acad_year_id,
            },
        });

        if (!teacher) {
            console.log("Teacher not found");
            return false;
        }
        if (!slot) {
            console.log("Slot not found");
            return false;
        }

        const [unavailability, isCreatedUnavailability] =
            await TeacherUnavailable.findOrCreate({
                where: {
                    TeacherId: teacher.id,
                    SlotId: slot.id,
                },
            });
    }
    return true;
}

export {
    uploadBatchAndSubdivsionData,
    uploadClassroomData,
    uploadSubjectAndTeacherData,
    uploadTestSlotData,
    uploadUnavailabilityData,
};
