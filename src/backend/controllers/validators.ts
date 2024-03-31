import { timetable } from "../api/routes";
import { Classroom, Slot, SlotDataClasses, SlotDatas, Subdivision, Teacher } from "../database";
import { Sequelize, Op } from "sequelize";

// TODO: Make return type similar in all functions

interface ValidatorInput {
    slotId: number;
    teacherIds?: number | number[];
    classroomIds?: number | number[];
    subdivisionIds?: number | number[];
}

// Checks for teacher collisions in a slot
async function teacherValidator(ids: ValidatorInput) {
    const { slotId, teacherIds, classroomIds, subdivisionIds } = ids;
    const whereTeacherClause = teacherIds ? { id: teacherIds } : {};

    const includeClassroomClause = classroomIds
        ? {
              association: "SlotDataClasses",
              where: { ClassroomId: classroomIds },
              attributes: [],
              required: true,
          }
        : {};
    const includeSubdivisionClause = subdivisionIds
        ? {
              association: "SlotDataSubdivisions",
              where: { SubdivisionId: subdivisionIds },
              attributes: [],
              required: true,
          }
        : {};

    const teachers = await Teacher.findAll({
        attributes: [["id", "TeacherId"]],
        where: { ...whereTeacherClause },
        include: [
            {
                association: "SlotDatas",
                where: { SlotId: slotId },
                required: true,
                attributes: [["id", "SlotDataId"]],
                include: [{ ...includeClassroomClause }, { ...includeSubdivisionClause }],
            },
        ],
    });
    // Only contains teachers in more than one slotData of a slot.
    const teacherCollisions = teachers.filter((teacher) => teacher.SlotDatas.length > 1);
    return { teacherCollisions };
}

// Checks for classroom collisions in a slot
async function classroomValidator(ids: ValidatorInput) {
    const { slotId, teacherIds, classroomIds, subdivisionIds } = ids;
    const whereClassroomClause = classroomIds ? { id: classroomIds } : {};
    const whereTeacherClause = teacherIds ? { TeacherId: teacherIds } : {};
    const includeSubdivisionClause = subdivisionIds
        ? {
              association: "SlotDataSubdivisions",
              attributes: [],
              required: true,
              where: { SubdivisionId: subdivisionIds },
          }
        : {};
    const classrooms = await Classroom.findAll({
        attributes: [["id", "ClassroomId"]],
        where: { ...whereClassroomClause },
        include: [
            {
                association: "SlotDataClasses",
                attributes: ["SlotDataId"],
                required: true,
                include: [
                    {
                        association: "SlotData",
                        where: { SlotId: slotId, ...whereTeacherClause },
                        attributes: [],
                        include: [{ ...includeSubdivisionClause }],
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
async function subdivisionValidator(ids: ValidatorInput) {
    const { slotId, teacherIds, classroomIds, subdivisionIds } = ids;
    const whereSubdivisionClause = subdivisionIds ? { id: subdivisionIds } : {};
    const whereTeacherClause = teacherIds ? { TeacherId: teacherIds } : {};
    const includeClassroomClause = classroomIds
        ? {
              association: "SlotDataClasses",
              where: { ClassroomId: classroomIds },
              attributes: [],
              required: true,
          }
        : {};
    const subdivisions = await Subdivision.findAll({
        attributes: ["id"],
        where: { ...whereSubdivisionClause },
        include: [
            {
                association: "SlotDataSubdivisions",
                attributes: ["id"],
                required: true,
                include: [
                    {
                        association: "SlotData",
                        where: { SlotId: slotId, ...whereTeacherClause },
                        attributes: ["id"],
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
                                ...includeClassroomClause,
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

async function slotValidator(ids: ValidatorInput) {
    const { teacherCollisions } = await teacherValidator(ids);
    const { classroomCollisions } = await classroomValidator(ids);
    const { subdivisionCollisions } = await subdivisionValidator(ids);
    return { teacherCollisions, classroomCollisions, subdivisionCollisions };
}

async function timetablesValidator(
    academicYearId: number,
    ids: {
        teacherIds?: number | number[];
        classroomIds?: number | number[];
        subdivisionIds?: number | number[];
    },
) {
    const { teacherIds, classroomIds, subdivisionIds } = ids;
    const slots = await Slot.findAll({
        where: { AcademicYearId: academicYearId },
    });
    const validator = [];
    for (const slot of slots) {
        const result = {
            slotId: slot.id,
            ...(await slotValidator({ slotId: slot.id, teacherIds, classroomIds, subdivisionIds })),
        };
        const hasCollision =
            result.teacherCollisions.length ||
            result.classroomCollisions.length ||
            result.subdivisionCollisions.length;

        if (hasCollision) validator.push(result);
    }
    return validator;
}
