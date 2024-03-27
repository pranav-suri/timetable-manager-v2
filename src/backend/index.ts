import Elysia from "elysia";
import cors from "@elysiajs/cors";
import { AcademicYear, Batch, Department, Division, Subdivision } from "./database";
import { getTimetable } from "./controllers";
import timetable from "./api/timetable";
const app = new Elysia();

app.use(timetable);
app.use(cors({ methods: ["GET"] }));

app.get("/", () => {
    return { message: `${Date.now()}` };
});

app.post("/upload/:type", async (ctx) => {
    const { type } = ctx.params;
    const body = ctx.body;

    if (!body) {
        ctx.set.status = 400;
        return { message: "Invalid body" };
    }

    if (type === "timetable") {
        return;
    }
    return { message: "Invalid type" };
});

app.listen(3000);

console.log("Listening on port 3000\nhttp://localhost:3000/");

// This function will upload the sample data to the database, uncomment to run.
// sampleDataUpload();
