import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import { getTimetable } from "../../controllers";

const app = new Elysia();
app.use(cors({ methods: ["GET", "POST"] }));

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

app.put("/slotData", async (req) => {
    //return { academicYears: await AcademicYear.findAll() };
});

export default app;
