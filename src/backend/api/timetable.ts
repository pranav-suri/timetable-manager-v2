import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import {
    AcademicYear,
    Batch,
    Classroom,
    Department,
    Division,
    Subdivision,
    Subject,
    Teacher,
} from "../database";
import { getAvailableClassrooms, getAvailableTeachers, getTimetable } from "../controllers";

const app = new Elysia();
app.use(cors({ methods: ["GET", "POST"] }));

app.get("/academicYears", async () => {
    return { academicYears: await AcademicYear.findAll() }; // add userId function
});

app.get("/subjects", async (req) => {
    const { departmentId } = req.query;
    if (!departmentId) {
        req.set.status = 400;
        return "departmentId is required.";
    }
    return {
        subjects: await Subject.findAll({
            where: {
                DepartmentId: departmentId, // add multi disc sub
            },
        }),
    };
});

app.get("/classrooms", async (req) => {
    const { academicYearId } = req.query;
    if (!academicYearId) {
        req.set.status = 400;
        return "academicYearId is required.";
    }
    return {
        classrooms: await Classroom.findAll({ where: { AcademicYearId: academicYearId } }),
    };
});

app.get("/teachers", async (req) => {
    const { academicYearId } = req.query;
    if (!academicYearId) {
        req.set.status = 400;
        return "academicYearId is required.";
    }
    return {
        teachers: await Teacher.findAll({
            where: {
                AcademicYearId: academicYearId,
            },
        }),
    };
});

app.get("/batches", async (req) => {
    const { academicYearId } = req.query;
    if (!academicYearId) {
        req.set.status = 400;
        return "academicYearId is required.";
    }
    return {
        batches: await Batch.findAll({
            where: {
                AcademicYearId: academicYearId,
            },
        }),
    };
});

app.get("/divisions", async (req) => {
    const { departmentId } = req.query;
    if (!departmentId) {
        req.set.status = 400;
        return "departmentId is required.";
    }
    return {
        divisions: await Division.findAll({
            where: {
                DepartmentId: departmentId,
            },
        }),
    };
});

app.get("/departments", async (req) => {
    const { batchId } = req.query;
    if (!batchId) {
        req.set.status = 400;
        return "batchId is required.";
    }
    return {
        departments: await Department.findAll({
            where: {
                BatchId: batchId,
            },
        }),
    };
});

app.get("/divisionTimetable", async (req) => {
    const { divisionId } = req.query;
    if (!divisionId) {
        req.set.status = 400;
        return "divisionId is required.";
    }
    return { Timetable: await getTimetable(divisionId, "division") };
});

app.get("/subdivisionTimetable", async (req) => {
    const { subdivisionId } = req.query;
    if (!subdivisionId) {
        req.set.status = 400;
        return "subdivisionId is required.";
    }
    return { Timetable: await getTimetable(subdivisionId, "subdivision") };
});

app.get("/teacherTimetable", async (req) => {
    const { teacherId } = req.query;
    if (!teacherId) {
        req.set.status = 400;
        return "teacherId is required.";
    }
    return { Timetable: await getTimetable(teacherId, "teacher") };
});

app.get("/classroomTimetable", async (req) => {
    const { classroomId } = req.query;
    if (!classroomId) {
        req.set.status = 400;
        return "classroomId is required.";
    }
    return { Timetable: await getTimetable(classroomId, "classroom") };
});

app.get("/availableTeachers", async (req) => {
    const { subjectId, slotId } = req.query;
    if (!subjectId || !slotId) {
        req.set.status = 400;
        return "subjectId and slotId are required.";
    }
    return { teachers: await getAvailableTeachers(slotId, subjectId) };
});

app.get("/availableClassrooms", async (req) => {
    const { subjectId, slotId } = req.query;
    if (!subjectId || !slotId) {
        req.set.status = 400;
        return "subjectId and slotId are required.";
    } 
    return { classrooms: await getAvailableClassrooms(slotId, subjectId) };
});

app.put("/slotData", async (req) => {
    //return { academicYears: await AcademicYear.findAll() };
});

export default app;
