import { Slot, SlotDataSubdivisions, SlotDatas, Subdivision } from "../database";

async function getTimetableOfSlotBySubdivision(subdivisionId: number, slotId: number) {
    const slotsWithData = await Slot.findOne({
        order: [
            ["day", "ASC"],
            ["number", "ASC"],
        ],
        where: {
            id: slotId,
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
    return { slots: slotsWithData };
}

async function getTimetableOfSlotByDivision(divisionId: number, slotId: number) {
    const subdivisions = await Subdivision.findAll({
        where: { DivisionId: divisionId },
    });
    const subdivisionIds = subdivisions.map((subdivision) => subdivision.id);

    const slotsWithData = await Slot.findOne({
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
            id: slotId,
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
    return { slots: slotsWithData };
}

async function getTimetableOfSlotByTeacher(teacherId: number, slotId: number) {
    const slotsWithData = await Slot.findOne({
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
            id: slotId,
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
    return { slots: slotsWithData };
}

async function getTimetableOfSlotByClassroom(classroomId: number, slotId: number) {
    const slotsWithData = await Slot.findOne({
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
            id: slotId,
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
    return { slots: slotsWithData };
}

async function getTTOfSlotNested(
    searchId: number,
    searchBy: "subdivisions" | "teachers" | "classrooms" | "divisions",
    slotId: number,
) {
    switch (searchBy) {
        case "divisions":
            return await getTimetableOfSlotByDivision(searchId, slotId);
        case "subdivisions":
            return await getTimetableOfSlotBySubdivision(searchId, slotId);
        case "classrooms":
            return await getTimetableOfSlotByClassroom(searchId, slotId);
        case "teachers":
            return await getTimetableOfSlotByTeacher(searchId, slotId);
        default:
            throw new Error(`Unhandled case in getTTOfSlotNested function: ${searchBy}`);
    }
}

export default getTTOfSlotNested;
