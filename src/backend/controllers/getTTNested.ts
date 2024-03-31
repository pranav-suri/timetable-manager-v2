import { AcademicYear, Slot, Subdivision } from "../database";
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
    const slotsWithData = await Slot.findAll({
        order: [
            ["day", "ASC"],
            ["number", "ASC"],
        ],
        where: {
            AcademicYearId: await getAcademicYearId(subdivisionId, "subdivision"),
        },
        include: [
            {
                association: "SlotDatas",
                required: false,
                include: [
                    {
                        association: "Teacher",
                    },
                    {
                        association: "Subject",
                    },
                    {
                        association: "SlotDataSubdivisions",
                        where: { SubdivisionId: subdivisionId },
                        include: [
                    {
                        association: "Subdivision",
                            },
                        ],
                    },
                    {
                        association: "SlotDataClasses",
                        include: [
                            {
                                association: "Classroom",
                            },
                        ],
                    },
                ],
            },
        ],
    });
    return { Slots: slotsWithData };
}

async function getTimetableByDivision(divisionId: string | number) {
    const subdivisions = await Subdivision.findAll({
        where: { DivisionId: divisionId },
    });
    const subdivisionIds = subdivisions.map((subdivision) => subdivision.id);

    const slotsWithData = await Slot.findAll({
        order: [
            ["day", "ASC"],
            ["number", "ASC"],
        ],
        where: {
            AcademicYearId: await getAcademicYearId(divisionId, "division"),
        },
        include: [
            {
                association: "SlotDatas",
                required: false,
                include: [
                    {
                        association: "Teacher",
                    },
                    {
                        association: "Subject",
                    },
                    {
                        association: "SlotDataSubdivisions",
                        where: { SubdivisionId: subdivisionIds },
                        include: [
                    {
                        association: "Subdivision",
                            },
                        ],
                    },
                    {
                        association: "SlotDataClasses",
                        include: [
                            {
                                association: "Classroom",
                            },
                        ],
                    },
                ],
            },
        ],
    });
    return { Slots: slotsWithData };
}

async function getTimetableByTeacher(teacherId: string | number) {
    const slotsWithData = await Slot.findAll({
        order: [
            ["day", "ASC"],
            ["number", "ASC"],
        ],
        where: {
            AcademicYearId: await getAcademicYearId(teacherId, "teacher"),
        },
        include: [
            {
                association: "SlotDatas",
                required: false,
                where: {
                    TeacherId: teacherId,
                },
                include: [
                    {
                        association: "Teacher",
                    },
                    {
                        association: "Subject",
                    },
                    {
                        association: "SlotDataSubdivisions",
                        include: [
                    {
                        association: "Subdivision",
                            },
                        ],
                    },
                    {
                        association: "SlotDataClasses",
                        include: [
                            {
                                association: "Classroom",
                            },
                        ],
                    },
                ],
            },
        ],
    });
    return { Slots: slotsWithData };
}

async function getTimetableByClassroom(classroomId: string | number) {
    const slotsWithData = await Slot.findAll({
        order: [
            ["day", "ASC"],
            ["number", "ASC"],
        ],
        where: {
            AcademicYearId: await getAcademicYearId(classroomId, "classroom"),
        },
        include: [
            {
                association: "SlotDatas",
                required: false,
                include: [
                    {
                        association: "Teacher",
                    },
                    {
                        association: "Subject",
                    },
                    {
                        association: "SlotDataSubdivisions",
                        include: [
                    {
                        association: "Subdivision",
                            },
                        ],
                    },
                    {
                        association: "SlotDataClasses",
                        where: {
                            ClassroomId: classroomId,
                        },
                        include: [
                            {
                                association: "Classroom",
                            },
                        ],
                    },
                ],
            },
        ],
    });
    return { Slots: slotsWithData };
}

async function getTTNested(
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
            throw new Error("Unhandled case in getTTNested function.");
    }
}

export default getTTNested;
