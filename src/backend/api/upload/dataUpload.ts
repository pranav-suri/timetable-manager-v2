import { t } from "elysia";
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
    SlotDataSubdivisions,
} from "../../database";
import Papa from "papaparse";

// FIXME: #6 @pranav-suri Normalize variable names according to eslint rules

function removeDuplicates<T>(arr: T[]): T[] {
    const uniqueArray = arr.filter((value, index) => {
        const _value = JSON.stringify(value);
        return (
            index ===
            arr.findIndex((obj) => {
                return JSON.stringify(obj) === _value;
            })
        );
    });
    return uniqueArray;
}

function areEqual(a: string | undefined, b: string | undefined) {
    if (!a || !b) return false;
    return a.trim().toLowerCase() === b.trim().toLowerCase();
}

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
    // This function will handle errors with missing headings
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
        if (error.code === "UndetectableDelimiter") {
            console.log("Empty file uploaded");
            return false;
        }

        // This runs in case of missing headings (missing commas at the last row of the csv file)
        if (error.code === "TooFewFields" && error.row) {
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
    const parsedCsv = Papa.parse<T>(csvData, {
        header: true,
        skipEmptyLines: true,
        transform: (value: string, header: string) => {
            return value.trim();
        },
        transformHeader: (header: string) => {
            // This will convert the header to lowercase and replace spaces with underscores
            const new_header = header.trim().toLowerCase().split(" ").join("_");
            return new_header;
        },
    });
    parsedCsv.data = Array.from(new Set(parsedCsv.data));
    return parsedCsv;
}

async function uploadBatchAndSubdivsionData(csvData: string, academicYearId: AcademicYear["id"]) {
    const parsedCsv = await parseCsvData<BatchAndSubdivisionData>(csvData);

    if (!validateCsvData(parsedCsv, "batchAndSubdivision")) return false;

    // Creating batches
    let batchCreate = parsedCsv.data.map((row) => {
        return {
            batchName: row.batch_name,
            AcademicYearId: academicYearId,
        };
    });
    batchCreate = removeDuplicates(batchCreate);
    const batches = await Batch.bulkCreate(batchCreate);
    // Creating departments
    let departmentCreate: {
        departmentName: string;
        BatchId: number;
    }[] = [];
    for (const row of parsedCsv.data) {
        const { batch_name: batchName, department_name: departmentName } = row;
        const batch = batches.find(
            (batch) =>
                areEqual(batch.batchName, batchName) && batch.AcademicYearId === academicYearId,
        )!;
        departmentCreate.push({
            departmentName,
            BatchId: batch.id,
        });
    }
    departmentCreate = removeDuplicates(departmentCreate);
    const departments = await Department.bulkCreate(departmentCreate);

    // Creating divisions
    let divisionCreate: {
        divisionName: string;
        DepartmentId: number;
    }[] = [];
    for (const row of parsedCsv.data) {
        const {
            batch_name: batchName,
            department_name: departmentName,
            division_name: divisionName,
        } = row;

        const batch = batches.find(
            (batch) =>
                areEqual(batch.batchName, batchName) && batch.AcademicYearId === academicYearId,
        )!;
        const department = departments.find(
            (department) =>
                areEqual(department.departmentName, departmentName) &&
                department.BatchId === batch.id,
        )!;
        divisionCreate.push({
            divisionName,
            DepartmentId: department.id,
        });
    }
    divisionCreate = removeDuplicates(divisionCreate);
    const divisions = await Division.bulkCreate(divisionCreate);

    // Creating subdivisions
    let subdivisionCreate: {
        subdivisionName: string;
        DivisionId: number;
    }[] = [];
    for (const row of parsedCsv.data) {
        const {
            batch_name: batchName,
            department_name: departmentName,
            division_name: divisionName,
            subdivision_name: subdivisionName,
        } = row;

        const batch = batches.find(
            (batch) =>
                areEqual(batch.batchName, batchName) && batch.AcademicYearId === academicYearId,
        )!;
        const department = departments.find(
            (department) =>
                areEqual(department.departmentName, departmentName) &&
                department.BatchId === batch.id,
        )!;
        const division = divisions.find(
            (division) =>
                areEqual(division.divisionName, divisionName) &&
                division.DepartmentId === department.id,
        )!;
        subdivisionCreate.push({
            subdivisionName,
            DivisionId: division.id,
        });
    }
    subdivisionCreate = removeDuplicates(subdivisionCreate);
    await Subdivision.bulkCreate(subdivisionCreate);
    return true;
}

async function uploadClassroomData(csvData: string, academicYearId: AcademicYear["id"]) {
    const parsedCsv = await parseCsvData<ClassroomData>(csvData);
    if (!validateCsvData(parsedCsv, "classroom")) {
        return false;
    }
    let classroomCreate: {
        classroomName: string;
        isLab: boolean;
        AcademicYearId: number;
    }[] = [];
    for (const row of parsedCsv.data) {
        const { classroom_name: classroomName, is_lab: isLab } = row;
        classroomCreate.push({
            classroomName,
            isLab: Number(isLab) ? true : false,
            AcademicYearId: academicYearId,
        });
    }
    classroomCreate = removeDuplicates(classroomCreate);
    await Classroom.bulkCreate(classroomCreate);
    return true;
}

async function uploadTestSlotData(csvData: string, academicYearId: AcademicYear["id"]) {
    const parsedCsv = await parseCsvData<SlotInfo>(csvData);
    if (!validateCsvData(parsedCsv, "slot")) {
        return false;
    }
    let slotCreate: {
        day: number;
        number: number;
        AcademicYearId: number;
    }[] = [];
    for (const row of parsedCsv.data) {
        const { day, number } = row;

        slotCreate.push({
            day: Number(day),
            number: Number(number),
            AcademicYearId: academicYearId,
        });
    }
    slotCreate = removeDuplicates(slotCreate);
    await Slot.bulkCreate(slotCreate);
    return true;
}

async function uploadSubjectAndTeacherData(csvData: string, academicYearId: AcademicYear["id"]) {
    const parsedCsv = await parseCsvData<SubjectAndTeacherData>(csvData);
    if (!validateCsvData(parsedCsv, "subjectAndTeacher")) {
        return false;
    }

    let teacherCreate = parsedCsv.data.map((row) => {
        return {
            teacherName: row.teacher_name,
            teacherEmail: row.teacher_email,
            AcademicYearId: academicYearId,
        };
    });
    teacherCreate = removeDuplicates(teacherCreate);
    const teachers = await Teacher.bulkCreate(teacherCreate);

    let groupCreate = parsedCsv.data.map((row) => {
        return {
            groupName: row.group_name,
            allowSimultaneous: Number(row.group_allow_simultaneous) ? true : false,
            AcademicYearId: academicYearId,
        };
    });
    groupCreate = removeDuplicates(groupCreate);
    const groups = await Group.bulkCreate(groupCreate);
    const batches = await Batch.findAll({
        where: {
            AcademicYearId: academicYearId,
        },
    });
    const departments = await Department.findAll();

    let teachCreate: {
        TeacherId: number;
        SubjectId: number;
    }[] = [];

    let subjectCreate: {
        subjectName: string;
        isLab: boolean;
        DepartmentId: number;
        GroupId: number;
    }[] = [];

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

        const batch = batches.find((batch) => areEqual(batch.batchName, batchName));
        if (!batch) {
            console.log(row);
            console.log("Batch not found");
            throw new Error("Batch not found");
            continue;
            return false;
        }
        const department = departments.find(
            (department) =>
                areEqual(department.departmentName, departmentName) &&
                department.BatchId === batch.id,
        );
        if (!department) {
            console.log(row);
            console.log("Department not found");
            throw new Error("Department not found");
            continue;
            return false;
        }

        const group = groups.find(
            (group) =>
                areEqual(group.groupName, groupName) && group.AcademicYearId === academicYearId,
        );

        if (!group) {
            console.log(row);
            console.log("Group not found");
            throw new Error("Group not found");
            continue;
            return false;
        }

        subjectCreate.push({
            subjectName,
            isLab: Number(isLab) ? true : false,
            DepartmentId: department.id,
            GroupId: group.id,
        });
    }
    subjectCreate = removeDuplicates(subjectCreate);
    const subjects = await Subject.bulkCreate(subjectCreate);

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
        const batch = batches.find((batch) => areEqual(batch.batchName, batchName));
        if (!batch) {
            console.log(row);
            console.log("Batch not found");
            throw new Error("Batch not found");
            continue;
            return false;
        }

        const department = departments.find((department) => {
            return (
                areEqual(department.departmentName, departmentName) &&
                department.BatchId === batch.id
            );
        });
        if (!department) {
            console.log(row);
            console.log("Department not found");
            throw new Error("Department not found");
            continue;
            return false;
        }

        const subject = subjects.find((subject) => {
            return (
                areEqual(subject.subjectName, subjectName) && subject.DepartmentId === department.id
            );
        });

        if (!subject) {
            // console.log("Subject not found");
            throw new Error("Subject not found");
            continue;
            return false;
        }
        const teacher = teachers.find(
            (teacher) =>
                areEqual(teacher.teacherName, teacherName) &&
                areEqual(teacher.teacherEmail, teacherEmail) &&
                teacher.AcademicYearId === academicYearId,
        )!;

        teachCreate.push({
            TeacherId: teacher.id,
            SubjectId: subject.id,
        });
    }
    teachCreate = removeDuplicates(teachCreate);
    await Teach.bulkCreate(teachCreate);

    return true;
}

async function uploadUnavailabilityData(csvData: string, academicYearId: AcademicYear["id"]) {
    const parsedCsv = await parseCsvData<UnavailabilityData>(csvData);

    if (!validateCsvData(parsedCsv, "unavailability")) {
        return false;
    }
    let unavailabilityCreate: {
        TeacherId: number;
        SlotId: number;
    }[] = [];

    for (const row of parsedCsv.data) {
        const { day, slot_number: slotNumber, teacher_email: teacherEmail } = row;

        const teacher = await Teacher.findOne({
            where: {
                teacherEmail,
                AcademicYearId: academicYearId,
            },
            attributes: ["id"],
        });
        const slot = await Slot.findOne({
            where: {
                day: day,
                number: slotNumber,
                AcademicYearId: academicYearId,
            },
            attributes: ["id"],
        });

        if (!teacher) {
            console.log("Teacher not found");
            return false;
        }
        if (!slot) {
            console.log("Slot not found");
            return false;
        }

        unavailabilityCreate.push({
            TeacherId: teacher.id,
            SlotId: slot.id,
        });
    }
    unavailabilityCreate = removeDuplicates(unavailabilityCreate);
    await TeacherUnavailable.bulkCreate(unavailabilityCreate);
    return true;
}

async function uploadTimetableData(csvData: string, academicYearId: AcademicYear["id"]) {
    const parsedCsv = await parseCsvData<TimetableData>(csvData);

    if (!validateCsvData(parsedCsv, "timetable")) {
        return false;
    }

    let slotDataCreate: {
        SubjectId: number;
        TeacherId: number;
        SlotId: number;
    }[] = [];

    const teachers = await Teacher.findAll({
        where: {
            AcademicYearId: academicYearId,
        },
    });

    const classrooms = await Classroom.findAll({
        where: {
            AcademicYearId: academicYearId,
        },
    });

    const slots = await Slot.findAll({
        where: {
            AcademicYearId: academicYearId,
        },
    });

    const subjects = await Subject.findAll({
        include: [
            {
                association: "Group",
                attributes: [],
                where: { academicYearId: academicYearId },
                required: true,
            },
        ],
    });
    const subdivisions = await Subdivision.findAll({
        include: [
            {
                association: "Division",
                required: true,
                include: [
                    {
                        association: "Department",
                        required: true,
                        include: [
                            {
                                association: "Batch",
                                required: true,
                                where: {
                                    AcademicYearId: academicYearId,
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    });

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
        const subdivision = subdivisions.find(
            (subdivision) =>
                areEqual(subdivision.subdivisionName, subdivisionName) &&
                areEqual(subdivision.Division?.Department?.departmentName, departmentName) &&
                areEqual(subdivision.Division?.Department?.Batch?.batchName, batchName),
        );

        if (!subdivision) {
            console.log("Subdivision not found");
            console.log({
                batchName,
                departmentName,
                subdivisionName,
            });
            // throw new Error("Subdivision not found");
            continue;
        }

        const subject = subjects.find(
            (subject) =>
                areEqual(subject.subjectName, subjectName) &&
                subject.DepartmentId === subdivision.Division?.Department?.id,
        );

        if (!subject) {
            // console.log("Subject not found");
            // console.log({
            //     subjectName,
            //     departmentName,
            //     groupName,
            // });
            // throw new Error("Subject not found");
            continue;
        }
        const teacher = teachers.find((teacher) => areEqual(teacher.teacherEmail, teacherEmail));
        if (!teacher) {
            console.log("Teacher not found");
            console.log({
                teacherEmail,
            });
            // throw new Error("Teacher not found");
            continue;
        }

        const classroom = classrooms.find((classroom) =>
            areEqual(classroom.classroomName, classroomName),
        );
        if (!classroom) {
            console.log("Classroom not found");
            console.log({
                classroomName,
            });
            // throw new Error("Classroom not found");
            continue;
        }

        const slot = slots.find(
            (slot) => slot.day === Number(day) && slot.number === Number(slotNumber),
        );
        if (!slot) {
            console.log("Slot not found");
            console.log({
                day,
                slotNumber,
            });
            // throw new Error("Slot not found");
            continue;
        }

        slotDataCreate.push({
            SubjectId: subject.id,
            TeacherId: teacher.id,
            SlotId: slot.id,
        });
    }
    slotDataCreate = removeDuplicates(slotDataCreate);
    const slotDatas = await SlotDatas.bulkCreate(slotDataCreate);

    let slotDataClassesCreate: {
        SlotDataId: number;
        ClassroomId: number;
    }[] = [];

    let slotDataSubdivisionsCreate: {
        SlotDataId: number;
        SubdivisionId: number;
    }[] = [];

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
        const subdivision = subdivisions.find(
            (subdivision) =>
                areEqual(subdivision.subdivisionName, subdivisionName) &&
                areEqual(subdivision.Division?.Department?.departmentName, departmentName) &&
                areEqual(subdivision.Division?.Department?.Batch?.batchName, batchName),
        );

        if (!subdivision) {
            console.log("Subdivision not found");
            console.log({
                batchName,
                departmentName,
                subdivisionName,
            });
            // throw new Error("Subdivision not found");
            continue;
        }
        const teacher = teachers.find((teacher) => areEqual(teacher.teacherEmail, teacherEmail));
        if (!teacher) {
            console.log("Teacher not found");
            console.log({
                teacherEmail,
            });
            // throw new Error("Teacher not found");
            continue;
        }

        const slot = slots.find(
            (slot) => slot.day === Number(day) && slot.number === Number(slotNumber),
        );

        if (!slot) {
            console.log("Slot not found");
            console.log({
                day,
                slotNumber,
            });
            // throw new Error("Slot not found");
            continue;
        }

        const classroom = classrooms.find((classroom) =>
            areEqual(classroom.classroomName, classroomName),
        );

        if (!classroom) {
            console.log("Classroom not found");
            console.log({
                classroomName,
            });
            // throw new Error("Classroom not found");
            continue;
        }

        const subject = subjects.find(
            (subject) =>
                areEqual(subject.subjectName, subjectName) &&
                subject.DepartmentId === subdivision.Division?.Department?.id,
        );

        if (!subject) continue;

        const slotData = slotDatas.find(
            (slotData) =>
                slotData.TeacherId === teacher.id &&
                slotData.SubjectId === subject.id &&
                slotData.SlotId === slot.id,
        );

        if (!slotData) {
            console.log("SlotData not found");
            console.log({
                subdivisionId: subdivision.Division?.Department?.Batch?.id,
                TeacherId: teacher.id,
                SlotId: slot.id,
            });
            // throw new Error("SlotData not found");
            continue;
        }

        slotDataSubdivisionsCreate.push({
            SlotDataId: slotData.id,
            SubdivisionId: subdivision.id,
        });

        slotDataClassesCreate.push({
            SlotDataId: slotData.id,
            ClassroomId: classroom.id,
        });
    }
    slotDataClassesCreate = removeDuplicates(slotDataClassesCreate);
    slotDataSubdivisionsCreate = removeDuplicates(slotDataSubdivisionsCreate);
    await SlotDataClasses.bulkCreate(slotDataClassesCreate);
    await SlotDataSubdivisions.bulkCreate(slotDataSubdivisionsCreate);
}

export {
    uploadBatchAndSubdivsionData,
    uploadClassroomData,
    uploadSubjectAndTeacherData,
    uploadTestSlotData,
    uploadUnavailabilityData,
    uploadTimetableData,
};
