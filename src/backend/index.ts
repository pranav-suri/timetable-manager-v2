import Elysia from "elysia";
import cors from "@elysiajs/cors";
import { available, getTables, timetable } from "./api/routes";
import sampleDataUpload from "./api/upload/sampleUpload";
const app = new Elysia();

app.use(timetable);
app.use(getTables);
app.use(available);
app.use(cors({ methods: ["GET"] }));

app.get("/", () => {
    return { message: `${Date.now()}` };
});

app.listen(3000);

console.log("Listening on port 3000\nhttp://localhost:3000/");

// This function will upload the sample data to the database, uncomment to run.
// sampleDataUpload();
