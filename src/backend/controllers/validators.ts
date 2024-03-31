import { Classroom, Slot, SlotDataClasses, SlotDatas, Subdivision, Teacher } from "../database";
import { Sequelize, Op } from "sequelize";

// TODO: Make return type similar in all functions

async function teacherValidator(slotId: number) {
    const teachers = await Teacher.findAll({
        attributes: [["id", "TeacherId"]],
        include: [
            {
                association: "SlotDatas",
                where: { SlotId: slotId },
                attributes: [["id", "SlotDataId"]],
            },
        ],
    });
    // Only contains teachers in more than one slotData of a slot.
    const teacherCollisions = teachers.filter((teacher) => teacher.SlotDatas.length > 1);
    return { slotId, teacherCollisions };
}

async function classroomValidator(slotId: number) {
    const classrooms = await Classroom.findAll({
        attributes: [["id", "ClassroomId"]],
        include: [
            {
                association: "SlotDataClasses",
                attributes: ["SlotDataId"],
                required: true,
                include: [
                    {
                        association: "SlotData",
                        where: { SlotId: slotId },
                        attributes: [],
                    },
                ],
            },
        ],
    });
    const classroomCollisions = classrooms.filter(
        (classroom) => classroom.SlotDataClasses.length > 1,
    );
    return { slotId, classroomCollisions };
}

async function simpleSubdivisionValidator(slotId: number) {
    const subdivisions = await Subdivision.findAll({
        attributes: ["id"],
        include: [
            {
                association: "SlotDataSubdivisions",
                attributes: ["SlotDataId"],
                required: true,
                include: [
                    {
                        association: "SlotData",
                        where: { SlotId: slotId },
                        attributes: [],
                    },
                ],
            },
        ],
    });
    const subdivisionCollisions = subdivisions.filter(
        (subdivision) => subdivision.SlotDataSubdivisions.length > 1,
    );
    const finalSubDivisionCollisions = subdivisionCollisions.map((subdivision) => {
        const updatedSubdivision = {
            SubdivisionId: subdivision.id,
            SlotData: subdivision.SlotDataSubdivisions,
        };
        return updatedSubdivision;
    });

    return { slotId, subdivisionCollisions: finalSubDivisionCollisions };
}

async function complexSubdivisionValidator(slotId: number) {
    const subdivisions = await Subdivision.findAll({
        attributes: ["id"],
        include: [
            {
                association: "SlotDataSubdivisions",
                attributes: ["id"],
                required: true,
                include: [
                    {
                        association: "SlotData",
                        where: { SlotId: slotId },
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
                        ],
                    },
                ],
            },
        ],
    });

    // Only contains subdivisions in more than one slotData of a slot.
    const subdivisionCollisions = subdivisions.filter(
        (subdivision) => subdivision.SlotDataSubdivisions.length > 1,
    );

    // Refactoring the data to make it more readable.
    const finalSubDivisionCollisions = subdivisionCollisions.map((subdivision) => {
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
    const groupSubdivCollision = finalSubDivisionCollisions.filter((subdivision) => {
        const groupIdsSet = new Set(subdivision.SlotDatas.map((slotData) => slotData.GroupId));
        // Collisions if groupIds are different.
        if (groupIdsSet.size > 1) return true;

        // Collisions if all groupIds are the same but allowSimultaneous is false.
        if (!subdivision.SlotDatas[0].allowSimultaneous) return true;
    });

    return { slotId, subdivisionCollisions: groupSubdivCollision };
}

async function slotValidator(slotId: number) {}

async function slotValidatorSQL(slotId: number) {
    const teacherCollisions = await SlotDatas.findAll({
        group: ["TeacherId"],
        attributes: ["TeacherId", [Sequelize.fn("COUNT", "TeacherId"), "count"]],
        where: { SlotId: slotId },
        having: Sequelize.where(Sequelize.fn("COUNT", "TeacherId"), { [Op.gt]: 1 }),
    });

    const classroomCollisions = await SlotDatas.findAll({
        include: [{ association: "SlotDataClasses", attributes: ["ClassroomId"] }], // include the classrooms
        group: ["SlotDataClasses.ClassroomId"],
        attributes: [[Sequelize.fn("COUNT", "SlotDataClasses.ClassroomId"), "count"]],
        where: { SlotId: slotId },
        having: Sequelize.where(Sequelize.fn("COUNT", "SlotDataClasses.ClassroomId"), {
            [Op.gt]: 1,
        }),
    });

    const subdivisionCollisions = await SlotDatas.findAll({
        include: [{ association: "SlotDataSubdivisions", attributes: ["SubdivisionId"] }],
        group: ["SlotDataSubdivisions.SubdivisionId"],
        attributes: [[Sequelize.fn("COUNT", "SlotDataSubdivisions.SubdivisionId"), "count"]],
        where: { SlotId: slotId },
        having: Sequelize.where(Sequelize.fn("COUNT", "SlotDataSubdivisions.SubdivisionId"), {
            [Op.gt]: 1,
        }),
    });

    if (
        teacherCollisions.length > 0 ||
        classroomCollisions.length > 0 ||
        subdivisionCollisions.length > 0
    ) return {
        slotId,
        teacherCollisions,
        classroomCollisions,
        subdivisionCollisions,
    };
    return false;
}

async function timetableValidator(academicYearId: number) {
    const slots = await Slot.findAll({ where: { AcademicYearId: academicYearId } });
    const validator = [];
    for (const slot of slots) {
        const result = await slotValidatorSQL(slot.id);
        if (result) validator.push(result);
    }
    return validator;
}

