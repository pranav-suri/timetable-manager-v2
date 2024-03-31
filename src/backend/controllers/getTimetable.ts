import {
    AcademicYear,
    Slot,
    Subdivision,
    Batch,
    Classroom,
    Department,
    Division,
    SlotDataClasses,
    SlotDataSubdivisions,
    SlotDatas,
    Subject,
    Teacher,
} from "../database";
async function getAcademicYearId(
    searchId: string | number,
    searchBy: "subdivision" | "teacher" | "classroom" | "division",
) {
    let academicYear;
    switch (searchBy) {
        case "division":
            academicYear = await AcademicYear.findOne({
                include: [
                    {
                        association: "Batch",
                        include: [
                            {
                                association: "Department",
                                include: [
                                    {
                                        association: "Division",
                                        where: { id: searchId },
                                        required: true,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
            break;
        case "subdivision":
            academicYear = await AcademicYear.findOne({
                include: [
                    {
                        association: "Batch",
                        include: [
                            {
                                association: "Department",
                                include: [
                                    {
                                        association: "Division",
                                        include: [
                                            {
                                                association: "Subdivision",
                                                where: { id: searchId },
                                                required: true,
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
            break;
        case "teacher":
            academicYear = await AcademicYear.findOne({
                include: [
                    {
                        association: "Teacher",
                        where: { id: searchId },
                        required: true,
                    },
                ],
            });
            break;
        case "classroom":
            academicYear = await AcademicYear.findOne({
                include: [
                    {
                        association: "Classroom",
                        where: { id: searchId },
                        required: true,
                    },
                ],
            });
            break;
        default:
            throw new Error("Unhandled case in getAcademicYearId function.");
    }
    if (academicYear) {
        return academicYear.id;
    }
}

async function getTimetableBySubdivision(subdivisionId: string | number) {
    const slots = await Slot.findAll({
        order: [
            ["day", "ASC"],
            ["number", "ASC"],
        ],
        where: {
            AcademicYearId: await getAcademicYearId(subdivisionId, "subdivision"),
        },
    });
    const subdivisions = await Subdivision.findAll({
        where: { id: subdivisionId },
        limit: 1,
    });
    const subdivisionIds = subdivisions.map((subdivision) => subdivision.id);
    const slotDataSubdivisions = await SlotDataSubdivisions.findAll({
        where: {
            SubdivisionId: subdivisionIds,
        },
    });
    const slotDataIds = slotDataSubdivisions.map(
        (slotDataSubdivision) => slotDataSubdivision.SlotDataId,
    );
    const slotDatas = await SlotDatas.findAll({
        where: {
            id: slotDataIds,
        },
    });
    const teacherIds = slotDatas.map((slotData) => slotData.TeacherId);
    const teachers = await Teacher.findAll({
        where: {
            id: teacherIds,
        },
    });
    const subjectIds = slotDatas.map((slotData) => slotData.SubjectId);
    const subjects = await Subject.findAll({
        where: {
            id: subjectIds,
        },
    });

    const slotDataClasses = await SlotDataClasses.findAll({
        where: {
            SlotDataId: slotDataIds,
        },
    });
    const classIds = slotDataClasses.map((slotDataClass) => slotDataClass.ClassroomId);

    const classrooms = await Classroom.findAll({
        where: {
            id: classIds,
        },
    });
    const divisionIds = subdivisions.map((subdivision) => subdivision.DivisionId);
    const divisions = await Division.findAll({
        where: {
            id: divisionIds,
        },
    });
    const departmentIds = divisions.map((division) => division.DepartmentId);
    const departments = await Department.findAll({
        where: {
            id: departmentIds,
        },
    });
    const batchIds = departments.map((department) => department.BatchId);
    const batches = await Batch.findAll({
        where: {
            id: batchIds,
        },
    });
    return {
        slots,
        slotDatas,
        slotDataClasses,
        slotDataSubdivisions,
        classrooms,
        subjects,
        teachers,
        subdivisions,
        divisions,
        departments,
        batches,
    };
}

async function getTimetableByDivision(divisionId: string | number) {
    const slots = await Slot.findAll({
        order: [
            ["day", "ASC"],
            ["number", "ASC"],
        ],
        where: {
            AcademicYearId: await getAcademicYearId(divisionId, "division"),
        },
    });
    const divisions = await Division.findAll({ where: { id: divisionId }, limit: 1 });

    const subdivisions = await Subdivision.findAll({
        where: { DivisionId: divisionId },
    });
    const subdivisionIds = subdivisions.map((subdivision) => subdivision.id);

    const slotDataSubdivisions = await SlotDataSubdivisions.findAll({
        where: {
            SubdivisionId: subdivisionIds,
        },
    });

    const slotDataIds = slotDataSubdivisions.map(
        (slotDataSubdivision) => slotDataSubdivision.SlotDataId,
    );
    const slotDatas = await SlotDatas.findAll({
        where: {
            id: slotDataIds,
        },
    });

    const teacherIds = slotDatas.map((slotData) => slotData.TeacherId);
    const teachers = await Teacher.findAll({
        where: {
            id: teacherIds,
        },
    });

    const subjectIds = slotDatas.map((slotData) => slotData.SubjectId);
    const subjects = await Subject.findAll({
        where: {
            id: subjectIds,
        },
    });

    const slotDataClasses = await SlotDataClasses.findAll({
        where: {
            SlotDataId: slotDataIds,
        },
    });
    const classIds = slotDataClasses.map((slotDataClass) => slotDataClass.ClassroomId);

    const classrooms = await Classroom.findAll({
        where: {
            id: classIds,
        },
    });
    const departmentIds = divisions.map((division) => division.DepartmentId);
    const departments = await Department.findAll({
        where: {
            id: departmentIds,
        },
    });
    const batchIds = departments.map((department) => department.BatchId);
    const batches = await Batch.findAll({
        where: {
            id: batchIds,
        },
    });
    return {
        slots,
        slotDatas,
        slotDataClasses,
        slotDataSubdivisions,
        classrooms,
        subjects,
        teachers,
        subdivisions,
        divisions,
        departments,
        batches,
    };
}

async function getTimetableByTeacher(teacherId: string | number) {
    const teachers = [await Teacher.findByPk(teacherId)];
    const slots = await Slot.findAll({
        order: [
            ["day", "ASC"],
            ["number", "ASC"],
        ],
        where: {
            AcademicYearId: await getAcademicYearId(teacherId, "teacher"),
        },
    });
    const slotDatas = await SlotDatas.findAll({
        where: {
            TeacherId: teacherId,
        },
    });
    const slotDataIds = slotDatas.map((slotData) => slotData.id);
    const subjectIds = slotDatas.map((slotData) => slotData.SubjectId);
    const subjects = await Subject.findAll({
        where: {
            id: subjectIds,
        },
    });
    const slotDataClasses = await SlotDataClasses.findAll({
        where: {
            SlotDataId: slotDataIds,
        },
    });
    const classIds = slotDataClasses.map((slotDataClass) => slotDataClass.ClassroomId);
    const classrooms = await Classroom.findAll({
        where: {
            id: classIds,
        },
    });
    const slotDataSubdivisions = await SlotDataSubdivisions.findAll({
        where: {
            SlotDataId: slotDataIds,
        },
    });
    const subdivisionIds = slotDataSubdivisions.map(
        (slotDataSubdivision) => slotDataSubdivision.SubdivisionId,
    );
    const subdivisions = await Subdivision.findAll({
        where: {
            id: subdivisionIds,
        },
    });
    const divisionIds = subdivisions.map((subdivision) => subdivision.DivisionId);
    const divisions = await Division.findAll({
        where: {
            id: divisionIds,
        },
    });
    const departmentIds = divisions.map((division) => division.DepartmentId);
    const departments = await Department.findAll({
        where: {
            id: departmentIds,
        },
    });
    const batchIds = departments.map((department) => department.BatchId);
    const batches = await Batch.findAll({
        where: {
            id: batchIds,
        },
    });
    return {
        slots,
        slotDatas,
        slotDataClasses,
        slotDataSubdivisions,
        classrooms,
        subjects,
        teachers,
        subdivisions,
        divisions,
        departments,
        batches,
    };
}

async function getTimetableByClassroom(classroomId: string | number) {
    const slots = await Slot.findAll({
        order: [
            ["day", "ASC"],
            ["number", "ASC"],
        ],
        where: {
            AcademicYearId: await getAcademicYearId(classroomId, "classroom"),
        },
    });
    const slotDataClasses = await SlotDataClasses.findAll({
        where: {
            ClassroomId: classroomId,
        },
    });
    const slotDataIds = slotDataClasses.map((slotDataClass) => slotDataClass.SlotDataId);
    const slotDatas = await SlotDatas.findAll({
        where: {
            id: slotDataIds,
        },
    });
    const teacherIds = slotDatas.map((slotData) => slotData.TeacherId);
    const teachers = await Teacher.findAll({
        where: {
            id: teacherIds,
        },
    });
    const subjectIds = slotDatas.map((slotData) => slotData.SubjectId);
    const subjects = await Subject.findAll({
        where: {
            id: subjectIds,
        },
    });
    const classrooms = [await Classroom.findByPk(classroomId)];
    const slotDataSubdivisions = await SlotDataSubdivisions.findAll({
        where: {
            SlotDataId: slotDataIds,
        },
    });
    const subdivisionIds = slotDataSubdivisions.map(
        (slotDataSubdivision) => slotDataSubdivision.SubdivisionId,
    );
    const subdivisions = await Subdivision.findAll({
        where: {
            id: subdivisionIds,
        },
    });
    const divisionIds = subdivisions.map((subdivision) => subdivision.DivisionId);
    const divisions = await Division.findAll({
        where: {
            id: divisionIds,
        },
    });
    const departmentIds = divisions.map((division) => division.DepartmentId);
    const departments = await Department.findAll({
        where: {
            id: departmentIds,
        },
    });
    const batchIds = departments.map((department) => department.BatchId);
    const batches = await Batch.findAll({
        where: {
            id: batchIds,
        },
    });

    return {
        slots,
        slotDatas,
        slotDataClasses,
        slotDataSubdivisions,
        classrooms,
        subjects,
        teachers,
        subdivisions,
        divisions,
        departments,
        batches,
    };
}

async function getTimetable(
    searchId: string | number,
    searchBy: "subdivision" | "teacher" | "classroom" | "division",
) {
    switch (searchBy) {
        case "division":
            return await getTimetableByDivision(searchId);
        case "subdivision":
            return await getTimetableBySubdivision(searchId);
        case "classroom":
            return await getTimetableByClassroom(searchId);
        case "teacher":
            return await getTimetableByTeacher(searchId);
        default:
            throw new Error("Unhandled case in getTimetable function.");
    }
}

export default getTimetable;
