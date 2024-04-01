import { getAcademicYearId } from ".";
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

async function getTimetableByTeacher(teacherId: number) {
    const teachers = [await Teacher.findByPk(teacherId)];
    const slots = await Slot.findAll({
        order: [
            ["day", "ASC"],
            ["number", "ASC"],
        ],
        where: {
            AcademicYearId: await getAcademicYearId("teacher" , teacherId),
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

async function getTimetableByClassroom(classroomId: number) {
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
            throw new Error("Unhandled case in getTimetable function.");
    }
}

export default getTimetable;
