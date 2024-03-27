import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import {
    AcademicYear,
    Batch,
    Classroom,
    Department,
    Division,
    Subject,
    Teacher,
} from "../database";

const app = new Elysia();
app.use(cors({ methods: ["GET", "POST"] }));

app.get("/academicYears", async (userId) => {
    return { academicYears: await AcademicYear.findAll() }; // add userId function
});

app.get("/subjects", async (departmentId) => {
    return {
        subjects: await Subject.findAll({
            where: {
                DepartmentId: departmentId, // add multi disc sub
            },
        }),
    };
});

app.get("/classrooms", async (academicYearId) => {
    return {
        classrooms: await Classroom.findAll({ where: { AcademicYearId: academicYearId } }),
    };
});

app.get("/teachers", async (academicYearId) => {
    return {
        teachers: await Teacher.findAll({
            where: {
                AcademicYearId: academicYearId,
            },
        }),
    };
});

app.get("/batches", async (academicYearId) => {
    return {
        batches: await Batch.findAll({
            where: {
                AcademicYearId: academicYearId,
            },
        }),
    };
});

app.get("/divisions", async (departmentId) => {
    return {
        divisions: await Division.findAll({
            where: {
                DepartmentId: departmentId,
            },
        }),
    };
});

app.get("/departments", async (batchId) => {
    return {
        departments: await Department.findAll({
            where: {
                BatchId: batchId,
            },
        }),
    };
});

app.get("/divisionTimetable", async () => {
    //return { academicYears: await AcademicYear.findAll() };
});

app.get("/teacherTimetable", async () => {
    //return { academicYears: await AcademicYear.findAll() };
});

app.get("/classroomTimetable", async () => {
    //return { academicYears: await AcademicYear.findAll() };
});

app.get("/availableTeachers", async () => {
    //return { academicYears: await AcademicYear.findAll() };
});

app.get("/availableClassrooms", async () => {
    //return { academicYears: await AcademicYear.findAll() };
});

app.put("/slotData", async () => {
    //return { academicYears: await AcademicYear.findAll() };
});

export default app;
