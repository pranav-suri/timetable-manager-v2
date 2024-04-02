import timetable from "./timetable";
import getTables from "./getTables";
import available from "./available";
import editing from "./editing";
import validate from "./validate";
import Elysia, { Context } from "elysia";
import cors from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import Logger, { LogLevel } from "../../logging";

const app = new Elysia()
    .use(cors({ methods: ["GET", "POST"] }))
    .get("/", () => {
        return { message: `${Date.now()}` };
    })
    .use(getTables)
    .use(timetable)
    .use(available)
    .use(editing)
    .use(validate)
    .onError((ctx) => {
        const errorResponse = JSON.stringify({  message: ctx.error.toString(), ...ctx }, null, 2);
        Logger.log(errorResponse, LogLevel.ERROR, true, import.meta.path);
        
        if (ctx.code == "VALIDATION") {
            const parsedError = JSON.parse(JSON.stringify(ctx.error));
            // return parsedError;
            const customErrorResponse = {
                code: ctx.code,
                path: ctx.path,
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
        return JSON.parse(errorResponse);
    })
    .use(swagger());

export default app;
