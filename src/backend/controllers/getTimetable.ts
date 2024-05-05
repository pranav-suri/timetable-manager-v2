import { ForeignKey } from "sequelize";
import { getAcademicYearId } from ".";
import {
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

async function getTimetableBySubdivision(subdivisionId: number) {
    const slots = await Slot.findAll({
        order: [
            ["day", "ASC"],
            ["number", "ASC"],
        ],
        where: {
            AcademicYearId: await getAcademicYearId("subdivision", subdivisionId),
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
    // Needs to be filtered because of the possibility of null values
    // Returns an array of numbers with null values filtered out.
    const teacherIdsFiltered = teacherIds.filter((teacherId) => teacherId) as ForeignKey<number[]>;
    const teachers = await Teacher.findAll({
        where: {
            id: teacherIdsFiltered,
        },
    });
    const subjectIds = slotDatas.map((slotData) => slotData.SubjectId);
    const subjectIdsFiltered = subjectIds.filter((subjectId) => subjectId) as ForeignKey<number[]>;
    const subjects = await Subject.findAll({
        where: {
            id: subjectIdsFiltered,
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
        slotsWithData: slotRefactor(slots, slotDatas, slotDataClasses, slotDataSubdivisions),
        classrooms,
        subjects,
        teachers,
        subdivisions,
        divisions,
        departments,
        batches,
    };
}

async function getTimetableByDivision(divisionId: number) {
    const slots = await Slot.findAll({
        order: [
            ["day", "ASC"],
            ["number", "ASC"],
        ],
        where: {
            AcademicYearId: await getAcademicYearId("division", divisionId),
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
    const teacherIdsFiltered = teacherIds.filter((teacherId) => teacherId) as ForeignKey<number[]>;
    const teachers = await Teacher.findAll({
        where: {
            id: teacherIdsFiltered,
        },
    });

    const subjectIds = slotDatas.map((slotData) => slotData.SubjectId);
    const subjectIdsFiltered = subjectIds.filter((subjectId) => subjectId) as ForeignKey<number[]>;
    const subjects = await Subject.findAll({
        where: {
            id: subjectIdsFiltered,
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
        slotsWithData: slotRefactor(slots, slotDatas, slotDataClasses, slotDataSubdivisions),
        classrooms,
        subjects,
        teachers,
        subdivisions,
        divisions,
        departments,
        batches,
    };
}

async function getTimetableByTeacher(teacherId: number) {
    const teachers = [await Teacher.findByPk(teacherId)];
    const slots = await Slot.findAll({
        order: [
            ["day", "ASC"],
            ["number", "ASC"],
        ],
        where: {
            AcademicYearId: await getAcademicYearId("teacher", teacherId),
        },
    });
    const slotDatas = await SlotDatas.findAll({
        where: {
            TeacherId: teacherId,
        },
    });
    const slotDataIds = slotDatas.map((slotData) => slotData.id);
    const subjectIds = slotDatas.map((slotData) => slotData.SubjectId);
    const subjectIdsFiltered = subjectIds.filter((subjectId) => subjectId) as ForeignKey<number[]>;
    const subjects = await Subject.findAll({
        where: {
            id: subjectIdsFiltered,
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
        slotsWithData: slotRefactor(slots, slotDatas, slotDataClasses, slotDataSubdivisions),
        classrooms,
        subjects,
        teachers,
        subdivisions,
        divisions,
        departments,
        batches,
    };
}

async function getTimetableByClassroom(classroomId: number) {
    const classroom = await Classroom.findByPk(classroomId);
    if (!classroom) throw new Error(`Classroom with id ${classroomId} not found.`);
    const classrooms = [classroom];
    const slots = await Slot.findAll({
        order: [
            ["day", "ASC"],
            ["number", "ASC"],
        ],
        where: {
            AcademicYearId: await getAcademicYearId("classroom", classroomId),
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
    const teacherIdsFiltered = teacherIds.filter((teacherId) => teacherId) as ForeignKey<number[]>;
    const teachers = await Teacher.findAll({
        where: {
            id: teacherIdsFiltered,
        },
    });
    const subjectIds = slotDatas.map((slotData) => slotData.SubjectId);
    const subjectIdsFiltered = subjectIds.filter((subjectId) => subjectId) as ForeignKey<number[]>;
    const subjects = await Subject.findAll({
        where: {
            id: subjectIdsFiltered,
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
        slotsWithData: slotRefactor(slots, slotDatas, slotDataClasses, slotDataSubdivisions),
        classrooms,
        subjects,
        teachers,
        subdivisions,
        divisions,
        departments,
        batches,
    };
}

function slotRefactor(
    slots: Slot[],
    slotDatas: SlotDatas[],
    slotDataClasses: SlotDataClasses[],
    slotDataSubdivisions: SlotDataSubdivisions[],
) {
    const slotRefactored = slots.map((slot) => {
        const slotDatasFiltered = slotDatas.filter((slotData) => slotData.SlotId === slot.id);
        const slotDatasRefactored = slotDatasFiltered.map((slotData) => {
            const subjectId = slotData.SubjectId as number;
            const teacherId = slotData.TeacherId as number | null;
            const slotDataClass = slotDataClasses.filter(
                (slotDataClass) => slotDataClass.SlotDataId === slotData.id,
            );
            const classroomIds = slotDataClass.map(
                (slotDataClass) => slotDataClass.ClassroomId,
            ) as number[];
            const slotDataSubdivision = slotDataSubdivisions.filter(
                (slotDataSubdivision) => slotDataSubdivision.SlotDataId === slotData.id,
            );
            const subdivisionIds = slotDataSubdivision.map(
                (slotDataSubdivision) => slotDataSubdivision.SubdivisionId,
            ) as number[];
            return {
                slotDataId: slotData.id as number,
                teacherId,
                subjectId,
                classroomIds,
                subdivisionIds,
            };
        });
        return {
            slotId: slot.id as number,
            day: slot.day,
            number: slot.number,
            slotDatas: slotDatasRefactored,
        };
    });
    return slotRefactored;
}

async function getTimetable(
    searchId: number,
    searchBy: "subdivisions" | "teachers" | "classrooms" | "divisions",
) {
    switch (searchBy) {
        case "divisions":
            return await getTimetableByDivision(searchId);
        case "subdivisions":
            return await getTimetableBySubdivision(searchId);
        case "classrooms":
            return await getTimetableByClassroom(searchId);
        case "teachers":
            return await getTimetableByTeacher(searchId);
        default:
            throw new Error(`Unhandled case in getTimetable function. ${searchBy}`);
    }
}

export default getTimetable;
