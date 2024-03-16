import Elysia from "elysia";
import cors from "@elysiajs/cors";
import {
    AcademicYear,
    Batch,
    Classroom,
    Department,
    Division,
    Group,
    Slot,
    Subdivision,
    Subject,
    Teach,
    Teacher,
    TeacherUnavailable,
    Timetable,
    TimetableClass,
    Slots,
    Teachers,
} from "./database";

const app = new Elysia();

app.use(cors({ methods: ["GET"] }));

app.get("/", (request) => {
    return { message: `${Date.now()}` };
});

app.get("/slots", async () => {
    const slots = await Slots.findAll();
    return slots;
});

app.get("/slots/:id", async (ctx) => {
    if (!ctx.params.id) {
        ctx.set.status = 400;
        return { message: "Missing id" };
    }
    const slot = await Slots.findOne({
        where: {
            id: ctx.params.id,
        },
    });
    return slot
        ? slot
        : ((ctx.set.status = 404), { message: "Slot not found" });
});

app.post("/slots", async (ctx) => {
    if (!ctx.query.day || !ctx.query.start || !ctx.query.end) {
        ctx.set.status = 400;
        return { message: "Missing day, start or end" };
    }
    const slot = await Slots.create({
        day: ctx.query.day,
        start: ctx.query.start,
        end: ctx.query.end,
    });
    ctx.set.status = 201;
    return slot;
});

app.get("/teachers", async () => {
    const teachers = await Teachers.findAll();
    return teachers;
});

app.get("/teachers/:id", async (ctx) => {
    if (!ctx.params.id) {
        ctx.set.status = 400;
        return { message: "Missing id" };
    }
    const teacher = await Teachers.findOne({
        where: {
            id: ctx.params.id,
        },
    });
    return teacher
        ? teacher
        : ((ctx.set.status = 404), { message: "Teacher not found" });
});

app.post("/teachers", async (ctx) => {
    if (!ctx.query.name || !ctx.query.email || !ctx.query.password) {
        ctx.set.status = 400;
        return { message: "Missing name, email or password" };
    }
    const teacher = await Teachers.create({
        name: ctx.query.name,
        email: ctx.query.email,
        password: ctx.query.password,
    });
    ctx.set.status = 201;
    return teacher;
});

app.listen(3000);

console.log("Listening on port 3000");

/**
 * Try visiting http://localhost:3000/slots: you should see an empty array.
 * Try visiting http://localhost:3000/teachers: you should see an empty array.
 * Try visiting http://localhost:3000/slots/1: you should see a 404 error.
 * Try visiting http://localhost:3000/teachers/1: you should see a 404 error.
 *
 * To use the post queries, you can install and use Postman from https://www.postman.com/downloads/.
 * Set the query type to POST and the URL to http://localhost:3000/slots?day=Monday&start=9:00&end=10:00.
 */
