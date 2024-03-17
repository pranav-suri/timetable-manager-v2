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
} from "./database";
import {
    uploadBatchAndSubdivsionData,
    uploadClassroomData,
    uploadSubjectAndTeacherData,
    uploadUnavailabilityData,
} from "./api/upload/dataUpload";
import sampleDataUpload from "./api/upload/sampleUpload";
const app = new Elysia();

app.use(cors({ methods: ["GET"] }));

app.get("/", (request) => {
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

/**
 * Try visiting http://localhost:3000/slots: you should see an empty array.
 * Try visiting http://localhost:3000/teachers: you should see an empty array.
 * Try visiting http://localhost:3000/slots/1: you should see a 404 error.
 * Try visiting http://localhost:3000/teachers/1: you should see a 404 error.
 *
 * To use the post queries, you can install and use Postman from https://www.postman.com/downloads/.
 * Set the query type to POST and the URL to http://localhost:3000/slots?day=Monday&start=9:00&end=10:00.
 */
