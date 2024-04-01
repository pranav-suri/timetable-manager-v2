import { timetable } from "../api/routes";
import {
    AcademicYear,
    Classroom,
    Slot,
    Subdivision,
    Teacher,
} from "../database";
import { getAcademicYearId } from ".";

// TODO: Make return type similar in all functions

type TimetableType = "subdivision" | "division" | "teacher" | "classroom" | "academicYear";

// Checks for teacher collisions in a slot
async function teacherValidator(slotId: number, timetableType: TimetableType, searchId: number) {
    let whereClassroomClause = {};
    let whereSubdivisionClause = {};
    let whereTeacherClause = {};
    switch (timetableType) {
        case "subdivision":
            whereSubdivisionClause = { SubdivisionId: searchId };
            break;
        case "division":
            const subdivisions = await Subdivision.findAll({
                where: { DivisionId: searchId },
            });
            const subdivisionIds = subdivisions.map((subdivision) => subdivision.id);
            whereSubdivisionClause = { SubdivisionId: subdivisionIds };
            break;
        case "teacher":
            whereTeacherClause = { id: searchId };
            break;
        case "classroom":
            whereClassroomClause = { ClassroomId: searchId };
            break;
        case "academicYear":
            // Do nothing, data will be filtered by only SlotId in the query
            break;
        default:
            throw new Error("Invalid timetable type");
    }
    const teachers = await Teacher.findAll({
        attributes: [["id", "TeacherId"]],
        where: { ...whereTeacherClause },
        include: [
            {
                association: "SlotDatas",
                where: { SlotId: slotId },
                required: true,
                attributes: [["id", "SlotDataId"]],
                include: [
                    {
                        association: "SlotDataClasses",
                        where: { ...whereClassroomClause },
                        attributes: [],
                        required: true,
                    },
                    {
                        association: "SlotDataSubdivisions",
                        where: { ...whereSubdivisionClause },
                        attributes: [],
                        required: true,
                    },
                ],
            },
        ],
    });
    // Only contains teachers in more than one slotData of a slot.
    const teacherCollisions = teachers.filter((teacher) => teacher.SlotDatas.length > 1);
    return { teacherCollisions };
}

// Checks for classroom collisions in a slot
async function classroomValidator(slotId: number, timetableType: TimetableType, searchId: number) {
    let whereSubdivisionClause = {};
    let whereClassroomClause = {};
    let whereTeacherClause = {};
    switch (timetableType) {
        case "subdivision":
            whereSubdivisionClause = { SubdivisionId: searchId };
            break;
        case "division":
            const subdivisions = await Subdivision.findAll({
                where: { DivisionId: searchId },
            });
            const subdivisionIds = subdivisions.map((subdivision) => subdivision.id);
            whereSubdivisionClause = { SubdivisionId: subdivisionIds };
            break;
        case "teacher":
            whereTeacherClause = { TeacherId: searchId };
            break;
        case "classroom":
            whereClassroomClause = { id: searchId };
            break;
        case "academicYear":
            // Do nothing, data will be filtered by only SlotId in the query
            break;
        default:
            throw new Error("Invalid timetable type");
    }
    const classrooms = await Classroom.findAll({
        attributes: [["id", "ClassroomId"]],
        where: { ...whereClassroomClause },
        include: [
            {
                association: "SlotDataClasses",
                attributes: ["SlotDataId"],
                include: [
                    {
                        association: "SlotData",
                        required: true,
                        where: { SlotId: slotId, ...whereTeacherClause },
                        attributes: [],
                        include: [
                            {
                                required: true,
                                association: "SlotDataSubdivisions",
                                where: { ...whereSubdivisionClause },
                            },
                        ],
                    },
                ],
            },
        ],
    });
    const classroomCollisions = classrooms.filter(
        (classroom) => classroom.SlotDataClasses.length > 1,
    );
    return { classroomCollisions };
}

// Checks for all subdivision collisions in a slot
async function subdivisionValidator(
    slotId: number,
    timetableType: TimetableType,
    searchId: number,
) {
    let whereSubdivisionClause = {};
    let whereClassroomClause = {};
    let whereTeacherClause = {};
    switch (timetableType) {
        case "subdivision":
            whereSubdivisionClause = { id: searchId };
            break;
        case "division":
            const subdivisions = await Subdivision.findAll({
                where: { DivisionId: searchId },
            });
            const subdivisionIds = subdivisions.map((subdivision) => subdivision.id);
            whereSubdivisionClause = { id: subdivisionIds };
            break;
        case "teacher":
            whereTeacherClause = { TeacherId: searchId };
            break;
        case "classroom":
            whereClassroomClause = { ClassroomId: searchId };
            break;
        case "academicYear":
            // Do nothing, data will be filtered by only SlotId in the query
            break;
        default:
    }
    const subdivisions = await Subdivision.findAll({
        attributes: ["id"],
        where: { ...whereSubdivisionClause },
        include: [
            {
                association: "SlotDataSubdivisions",
                attributes: ["id"],
                include: [
                    {
                        association: "SlotData",
                        where: { SlotId: slotId, ...whereTeacherClause },
                        attributes: ["id"],
                        required: true,
                        include: [
                            {
                                association: "Subject",
                                attributes: ["id"],
                                include: [
                                    {
                                        association: "Group",
                                        attributes: ["id", "allowSimultaneous"],
                                    },
                                ],
                            },
                            {
                                association: "SlotDataClasses",
                                where: { ...whereClassroomClause },
                                attributes: [],
                                required: true,
                            },
                        ],
                    },
                ],
            },
        ],
    });

    // Only contains subdivisions in more than one slotData of a slot.
    const possibleSubdivCollisions = subdivisions.filter(
        (subdivision) => subdivision.SlotDataSubdivisions.length > 1,
    );

    // Redoing logic without refactoring
    const subdivCollisions = possibleSubdivCollisions.filter((subdivision) => {
        const groupIdsSet = new Set(
            subdivision.SlotDataSubdivisions.map((slotDataSubdivision) => {
                return slotDataSubdivision.SlotData.Subject.Group.id;
            }),
        );
        // Collision if groupIds are different.
        if (groupIdsSet.size > 1) return true;

        // Collision if all groupIds are the same but allowSimultaneous is false.
        if (!subdivision.SlotDataSubdivisions[0].SlotData.allowSimultaneous) return true;
    });

    // Refactoring the data to make it more readable.
    const refactoredSubdiv = possibleSubdivCollisions.map((subdivision) => {
        const updatedSubdivision = {
            SubdivisionId: subdivision.id,
            SlotDatas: subdivision.SlotDataSubdivisions.map((slotDataSubdivision) => {
                return {
                    SlotDataId: slotDataSubdivision.SlotData.id,
                    SubjectId: slotDataSubdivision.SlotData.Subject.id,
                    GroupId: slotDataSubdivision.SlotData.Subject.Group.id,
                    allowSimultaneous: slotDataSubdivision.SlotData.Subject.Group.allowSimultaneous,
                };
            }),
        };
        return updatedSubdivision;
    });
    // Subjects from different groups cannot be at the same time.
    const groupSubdivCollision = refactoredSubdiv.filter((subdivision) => {
        const groupIdsSet = new Set(subdivision.SlotDatas.map((slotData) => slotData.GroupId));
        // Collision if groupIds are different.
        if (groupIdsSet.size) return true;

        // Collision if all groupIds are the same but allowSimultaneous is false.
        if (!subdivision.SlotDatas[0].allowSimultaneous) return true;
    });

    return { subdivisionCollisions: subdivCollisions };
}

async function slotValidator(slotId: number, timetableType: TimetableType, searchId: number) {
    const { teacherCollisions } = await teacherValidator(slotId, timetableType, searchId);
    const { classroomCollisions } = await classroomValidator(slotId, timetableType, searchId);
    const { subdivisionCollisions } = await subdivisionValidator(slotId, timetableType, searchId);
    return { teacherCollisions, classroomCollisions, subdivisionCollisions };
}

export async function timetablesValidator(
    timetableType: TimetableType,
    searchId: number,
): Promise<
    {
        teacherCollisions: Teacher[];
        classroomCollisions: Classroom[];
        subdivisionCollisions: Subdivision[];
        slotId: number;
    }[]
> {
    let academicYearId: AcademicYear["id"];
    if (timetableType === "academicYear") {
        academicYearId = searchId;
    } else {
        academicYearId = await getAcademicYearId(searchId, timetableType);
    }
    const slots = await Slot.findAll({
        where: { AcademicYearId: academicYearId },
    });
    const collisions = [];
    for (const slot of slots) {
        const result = {
            slotId: slot.id,
            ...(await slotValidator(slot.id, timetableType, searchId)),
        };
        const hasCollision =
            result.teacherCollisions.length ||
            result.classroomCollisions.length ||
            result.subdivisionCollisions.length;

        if (hasCollision) collisions.push(result);
    }
    return collisions;
}
