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
    SlotDatas,
    SlotDataClasses,
    SlotDataSubdivisions
} from "../../database";
import Papa from "papaparse";

// FIXME: #6 @pranav-suri Normalize variable names according to eslint rules

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

const slotInfo = {
    day: "",
    number: "",
};
type SlotInfo = typeof slotInfo;

const timetableData = {
    day: "",
    slot_number: "",
    batch_name: "",
    department_name: "",
    subdivision_name: "",
    subject_name: "",
    group_name: "",
    teacher_email: "",
    classroom_name: "",
};

type TimetableData = typeof timetableData;

function validateCsvData(
    parsedCsv: Papa.ParseResult<
        | BatchAndSubdivisionData
        | ClassroomData
        | SubjectAndTeacherData
        | UnavailabilityData
        | SlotInfo
        | TimetableData
    >,
    csvType:
        | "batchAndSubdivision"
        | "classroom"
        | "subjectAndTeacher"
        | "unavailability"
        | "slot"
        | "timetable",
) {
    // This function will parse csv data handle errors with missing headings
    // This does not validate missing data in each row
    let expectedKeys: string[] = [];
    let dataKeys: string[] = [];

    switch (csvType) {
        // This switch case is for assigning values of expectedKeys and dataKeys variable
        case "batchAndSubdivision":
            expectedKeys = Object.keys(batchAndSubdivisionData);
            dataKeys = Object.keys(parsedCsv.data[0]);
            break;
        case "classroom":
            expectedKeys = Object.keys(classroomData);
            dataKeys = Object.keys(parsedCsv.data[0]);
            break;
        case "subjectAndTeacher":
            expectedKeys = Object.keys(subjectAndTeacherData);
            dataKeys = Object.keys(parsedCsv.data[0]);
            break;
        case "unavailability":
            expectedKeys = Object.keys(unavailabilityData);
            dataKeys = Object.keys(parsedCsv.data[0]);
            break;
        case "slot":
            expectedKeys = Object.keys(slotInfo);
            dataKeys = Object.keys(parsedCsv.data[0]);
            break;
        case "timetable":
            expectedKeys = Object.keys(timetableData);
            dataKeys = Object.keys(parsedCsv.data[0]);
            break;
        default:
            throw new Error(`Unhandled case in validateCsvData function: ${csvType}`);
            break;
    }

    // This loop will remove the row with missing data
    for (const error of parsedCsv.errors) {
        // This runs in case of missing headings (missing commas at the last row of the csv file)
        if (error.type === "Delimiter") {
            console.log("Empty file uploaded");
            return false;
        }
        if (error.row) {
            // console.log("Deleting row: ", error.row + 2); // +2 because top row is header and data starts from index 0
            // console.log("Row data: ", parsedCsv.data[error.row])
            parsedCsv.data.splice(error.row, 1);
        }
    }

    let valid = true;
    // This loop will check if all expected keys are present in the data[0] object
    for (const key of expectedKeys) {
        if (!dataKeys.includes(key)) {
            valid = false;
            console.log("Header missing: ", key);
        }
    }
    if (!valid) return false;
    return true;
}

async function parseCsvData<T>(csvData: string) {
    const csvParsingOptions = {
        header: true,
        skipEmptyLines: true,
        transform: (value: string, header: string) => {
            if (header) {
                return value.trim();
            }
            return value;
        },
    };
    return Papa.parse<T>(csvData, csvParsingOptions);
}

async function uploadBatchAndSubdivsionData(csvData: string, academicYearId: AcademicYear["id"]) {
    const parsedCsv = await parseCsvData<BatchAndSubdivisionData>(csvData);

    if (!validateCsvData(parsedCsv, "batchAndSubdivision")) return false;

    for (const row of parsedCsv.data) {
        const {
            batch_name: batchName,
            department_name: departmentName,
            division_name: divisionName,
            subdivision_name: subdivisionName,
        } = row;
        const [batch, isCreatedBatch] = await Batch.findOrCreate({
            where: { batchName, AcademicYearId: academicYearId },
        });
        const [department, isCreatedDepartment] = await Department.findOrCreate({
            where: { departmentName, BatchId: batch.id },
        });
        const [division, isCreatedDivision] = await Division.findOrCreate({
            where: { divisionName, DepartmentId: department.id },
        });
        const [subdivision, isCreatedSubdivision] = await Subdivision.findOrCreate({
            where: {
                subdivisionName,
                DivisionId: division.id,
            },
        });
    }
    return true;
}

async function uploadClassroomData(csvData: string, academicYearId: AcademicYear["id"]) {
    const parsedCsv = await parseCsvData<ClassroomData>(csvData);
    if (!validateCsvData(parsedCsv, "classroom")) {
        return false;
    }
    for (const row of parsedCsv.data) {
        const { classroom_name: classroomName, is_lab: isLab } = row;

        const [classroom, isCreatedClassroom] = await Classroom.findOrCreate({
            where: {
                classroomName,
                isLab,
                AcademicYearId: academicYearId,
            },
        });
    }
    return true;
}

async function uploadTestSlotData(csvData: string, academicYearId: AcademicYear["id"]) {
    const parsedCsv = await parseCsvData<SlotInfo>(csvData);
    if (!validateCsvData(parsedCsv, "slot")) {
        console.log("Errors in CSV file");
        return false;
    }
    for (const row of parsedCsv.data) {
        const { day, number } = row;

        const [slot, isCreatedSlot] = await Slot.findOrCreate({
            where: {
                day: day,
                number: number,
                AcademicYearId: academicYearId,
            },
        });
    }
    return true;
}

async function uploadSubjectAndTeacherData(csvData: string, academicYearId: AcademicYear["id"]) {
    const parsedCsv = await parseCsvData<SubjectAndTeacherData>(csvData);
    if (!validateCsvData(parsedCsv, "subjectAndTeacher")) {
        return false;
    }
    for (const row of parsedCsv.data) {
        const {
            batch_name: batchName,
            department_name: departmentName,
            group_name: groupName,
            group_allow_simultaneous: groupAllowSimultaneous,
            is_lab: isLab,
            subject_name: subjectName,
            teacher_email: teacherEmail,
            teacher_name: teacherName,
        } = row;

        const batch = await Batch.findOne({
            where: { batchName, AcademicYearId: academicYearId },
        });
        if (!batch) {
            console.log(row);
            console.log("Batch not found");
            return false;
        }
        const department = await Department.findOne({
            where: { departmentName, BatchId: batch.id },
        });
        if (!department) {
            console.log(row);
            console.log("Department not found");
            return false;
        }

        const [group, isCreatedGroup] = await Group.findOrCreate({
            where: {
                groupName,
                allowSimultaneous: groupAllowSimultaneous,
                AcademicYearId: academicYearId,
            },
        });

        const [subject, isCreatedSubject] = await Subject.findOrCreate({
            where: {
                subjectName,
                isLab,
                DepartmentId: department.id,
                GroupId: group.id,
            },
        });

        const [teacher, isCreatedTeacher] = await Teacher.findOrCreate({
            where: {
                teacherName,
                teacherEmail,
                AcademicYearId: academicYearId,
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

async function uploadUnavailabilityData(csvData: string, academicYearId: AcademicYear["id"]) {
    const parsedCsv = await parseCsvData<UnavailabilityData>(csvData);

    if (!validateCsvData(parsedCsv, "unavailability")) {
        console.log("Errors in CSV file");
        return false;
    }
    for (const row of parsedCsv.data) {
        const { day, slot_number: slotNumber, teacher_email: teacherEmail } = row;

        const teacher = await Teacher.findOne({
            where: {
                teacherEmail,
                AcademicYearId: academicYearId,
            },
        });
        const slot = await Slot.findOne({
            where: {
                day: day,
                number: slotNumber,
                AcademicYearId: academicYearId,
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

        const [unavailability, isCreatedUnavailability] = await TeacherUnavailable.findOrCreate({
            where: {
                TeacherId: teacher.id,
                SlotId: slot.id,
            },
        });
    }
    return true;
}

async function uploadTimetableData(csvData: string, academicYearId: AcademicYear["id"]) {
    const parsedCsv = await parseCsvData<TimetableData>(csvData);

    if (!validateCsvData(parsedCsv, "timetable")) {
        console.log("Errors in CSV file");
        return false;
    }

    for (const row of parsedCsv.data) {
        const {
            day,
            slot_number: slotNumber,
            department_name: departmentName,
            batch_name: batchName,
            subdivision_name: subdivisionName,
            subject_name: subjectName,
            group_name: groupName,
            teacher_email: teacherEmail,
            classroom_name: classroomName,
        } = row;
        /*
        Alternative approach with errors at each step -----------

        const batch = await Batch.findOne({
            where: {
                batchName,
                AcademicYearId: academicYearId,
            },
        });

        const department = await Department.findOne({
            where: {
                departmentName,
                BatchId: batch.id,
            },
        });

        const division = await Division.findOne({
            where: {
                divisionName,
                DepartmentId: department.id,
            },
        });

        const subdivision = await Subdivision.findOne({
            where: {
                subdivisionName,
                DivisionId: division.id,
            },
        });
        */

        const subdivision = await Subdivision.findOne({
            where: {
                subdivisionName,
            },
            include: [
                {
                    association: "Division",
                    required: true,

                    include: [
                        {
                            association: "Department",
                            required: true,
                            where: {
                                departmentName,
                            },
                            include: [
                                {
                                    association: "Batch",
                                    required: true,
                                    where: {
                                        batchName,
                                        AcademicYearId: academicYearId,
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        if (!subdivision) {
            console.log("Subdivision not found");
            console.log({
                batchName,
                departmentName,
                subdivisionName,
            });
            return false;
        }
        const subject = await Subject.findOne({
            where: {
                subjectName,
            },
            include: [
                {
                    association: "Department",
                    required: true,
                    where: {
                        departmentName,
                    },
                },
                {
                    association: "Group",
                    required: true,
                    where: {
                        groupName,
                        academicYearId: academicYearId,
                    },
                },
            ],
        });
        if (!subject) {
            console.log("Subject not found");
            console.log({
                subjectName,
                departmentName,
                groupName,
            });
            return false;
        }
        const teacher = await Teacher.findOne({
            where: {
                teacherEmail,
                AcademicYearId: academicYearId,
            },
        });

        if (!teacher) {
            console.log("Teacher not found");
            console.log({
                teacherEmail,
            });
            return false;
        }

        const classroom = await Classroom.findOne({
            where: {
                classroomName,
                AcademicYearId: academicYearId,
            },
        });
        if (!classroom) {
            console.log("Classroom not found");
            console.log({
                classroomName,
            });
            return false;
        }

        const slot = await Slot.findOne({
            where: {
                day: day,
                number: slotNumber,
                AcademicYearId: academicYearId,
            },
        });
        if (!slot) {
            console.log("Slot not found");
            console.log({
                day,
                slotNumber,
            });
            return false;
        }

        const [slotData, isCreatedSlotData] = await SlotDatas.findOrCreate({
            where: {
                SubjectId: subject.id,
                TeacherId: teacher.id,
                SlotId: slot.id,
            },
        });

        const [slotDataSubdivisions, isCreatedSlotDataSubdivisions] = await SlotDataSubdivisions.findOrCreate({
            where: {
                SlotDataId: slotData.id,
                SubdivisionId: subdivision.id,
            },
        });

        const [slotDataClasses, isCreatedSlotDataClasses] = await SlotDataClasses.findOrCreate({
            where: {
                SlotDataId: slotData.id,
                ClassroomId: classroom.id,
            },
        });
    }
}

export {
    uploadBatchAndSubdivsionData,
    uploadClassroomData,
    uploadSubjectAndTeacherData,
    uploadTestSlotData,
    uploadUnavailabilityData,
    uploadTimetableData,
};
