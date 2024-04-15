import { AcademicYear, Slot, SlotDataSubdivisions, SlotDatas, Subdivision } from "../database";
import { getAcademicYearId } from ".";

async function getTimetableBySubdivision(subdivisionId: number) {
    const slotsWithData = await Slot.findAll({
        order: [
            ["day", "ASC"],
            ["number", "ASC"],
        ],
        where: {
            AcademicYearId: await getAcademicYearId("subdivision", subdivisionId),
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

async function getTimetableByDivision(divisionId: number) {
    const subdivisions = await Subdivision.findAll({
        where: { DivisionId: divisionId },
    });
    const subdivisionIds = subdivisions.map((subdivision) => subdivision.id);

    const slotsWithData = await Slot.findAll({
        order: [
            ["day", "ASC"],
            ["number", "ASC"],
            [
                { model: SlotDatas, as: "SlotDatas" },
                { model: SlotDataSubdivisions, as: "SlotDataSubdivisions" },
                { model: Subdivision, as: "Subdivision" },
                "subdivisionName",
                "ASC",
            ],
        ],
        where: {
            AcademicYearId: await getAcademicYearId("division", divisionId),
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

async function getTimetableByTeacher(teacherId: number) {
    const slotsWithData = await Slot.findAll({
        order: [
            ["day", "ASC"],
            ["number", "ASC"],
            [
                { model: SlotDatas, as: "SlotDatas" },
                { model: SlotDataSubdivisions, as: "SlotDataSubdivisions" },
                { model: Subdivision, as: "Subdivision" },
                "subdivisionName",
                "ASC",
            ],
        ],
        where: {
            AcademicYearId: await getAcademicYearId("teacher", teacherId),
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

async function getTimetableByClassroom(classroomId: number) {
    const slotsWithData = await Slot.findAll({
        order: [
            ["day", "ASC"],
            ["number", "ASC"],
            [
                { model: SlotDatas, as: "SlotDatas" },
                { model: SlotDataSubdivisions, as: "SlotDataSubdivisions" },
                { model: Subdivision, as: "Subdivision" },
                "subdivisionName",
                "ASC",
            ],
        ],
        where: {
            AcademicYearId: await getAcademicYearId("classroom", classroomId),
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
    searchId: number,
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
            throw new Error(`Unhandled case in getTTNested function: ${searchBy}`);
    }
}

export default getTTNested;
