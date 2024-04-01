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
    .onError(({ code, error }) => {
        if (code == "VALIDATION") {
            const parsedError = JSON.parse(JSON.stringify(error));
            const customErrorResponse = {
                code: code,
                type: parsedError.type,
                // schema: parsedError.validator.schema,
                schema: {
                    type: parsedError.validator.schema.type,
                    required: parsedError.validator.schema.required,
                    properties: parsedError.validator.schema.properties,
                    additionalProperties: parsedError.validator.schema.additionalProperties,
                },
                value: parsedError.value,
            };
            return customErrorResponse;
        }
        // JSON.stringify returns empty object. This is likely Elysia specific.
        return error.toString();
    })
    .use(swagger());

export default app;
