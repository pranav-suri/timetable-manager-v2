import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import { getAvailableClassrooms, getAvailableTeachers, getTimetable } from "../../controllers";

const app = new Elysia();
app.use(cors({ methods: ["GET", "POST"] }));

app.get("/availableTeachers", async (req) => {
    const { subjectId, slotId } = req.query;
    if (!subjectId || !slotId) {
        req.set.status = 400;
        return { error: { message: "subjectId and slotId are required." } };
    }
    return { teachers: await getAvailableTeachers(slotId, subjectId) };
});

app.get("/availableClassrooms", async (req) => {
    const { subjectId, slotId } = req.query;
    if (!subjectId || !slotId) {
        req.set.status = 400;
        return { error: { message: "subjectId and slotId are required." } };
    }
    return { classrooms: await getAvailableClassrooms(slotId, subjectId) };
});

export default app;