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
        const parsedError = JSON.parse(JSON.stringify(error));
        // return parsedError;
        if ((code = "VALIDATION")) {
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
        return parsedError;
    })
    .use(swagger());

export default app;
