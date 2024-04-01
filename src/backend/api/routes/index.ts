import timetable from "./timetable";
import getTables from "./getTables";
import available from "./available";
import editing from "./editing";
import validators from "./validators";
import Elysia from "elysia";
import cors from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";

const app = new Elysia()
    .use(cors({ methods: ["GET", "POST"] }))
    .get("/", () => {
        return { message: `${Date.now()}` };
    })
    .use(getTables)
    .use(timetable)
    .use(available)
    .use(editing)
    .use(validators)
    .use(swagger());

export default app;
