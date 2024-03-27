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
                association: "SlotData",
                required: false,
                where: {
                    SubdivisionId: subdivisionId,
                },
                include: [
                    {
                        association: "Teacher",
                    },
                    {
                        association: "Subject",
                    },
                    {
                        association: "Subdivision",
                        include: ["Division"],
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
    /*      
        const slots = await Slot.findAll({
            where: {
                AcademicYearId: academicYearId,
            },
        });
        const slotDatas = await SlotData.findAll({
            where: {
                SubdivisionId: {
                    [Op.in]: subdivisionIds,
                },
            },
        });

        const teacherIds = slotDatas.map((slotData) => slotData.TeacherId);
        const teachers = await Teacher.findAll({
            where: {
                id: {
                    [Op.in]: teacherIds,
                },
            },
        });
        const subjectIds = slotDatas.map((slotData) => slotData.SubjectId);
        const subjects = await Subject.findAll({
            where: {
                id: {
                    [Op.in]: subjectIds,
                },
            },
        });

        const slotDataIds = slotDatas.map((slotData) => slotData.id);
        const slotDataClasses = await SlotDataClasses.findAll({
            where: {
                SlotDataId: {
                    [Op.in]: slotDataIds,
                },
            },
        });
        const classIds = slotDataClasses.map(
            (slotDataClass) => slotDataClass.ClassroomId
        );

        const classrooms = await Classroom.findAll({
            where: {
                id: {
                    [Op.in]: classIds,
                },
            },
        });
        */

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
                association: "SlotData",
                required: false,
                where: {
                    SubdivisionId: subdivisionIds,
                },
                include: [
                    {
                        association: "Teacher",
                    },
                    {
                        association: "Subject",
                    },
                    {
                        association: "Subdivision",
                        include: ["Division"],
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
                association: "SlotData",
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
                        association: "Subdivision",
                        include: ["Division"],
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
                association: "SlotData",
                required: false,
                include: [
                    {
                        association: "Teacher",
                    },
                    {
                        association: "Subject",
                    },
                    {
                        association: "Subdivision",
                        include: ["Division"],
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

/*
async function getTimetable(searchId: string | number, searchBy: "subdivision" | "teacher") {
    const searchByColumnMap = {
        subdivision: "SubdivisionId",
        teacher: "TeacherId",
    };
    const searchColumn = searchByColumnMap[searchBy];

    const slotsWithData = await Slot.findAll({
        order: [
            ["day", "ASC"],
            ["number", "ASC"],
        ],
        where: {
            AcademicYearId: await getAcademicYearId(searchId, searchBy),
        },
        include: [
            {
                association: "SlotData",
                required: false,
                where: {
                    [searchColumn]: searchId,
                },
                include: [
                    {
                        association: "Teacher",
                    },
                    {
                        association: "Subject",
                    },
                    {
                        association: "Subdivision",
                        include: ["Division"],
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
*/
export default getTimetable;
