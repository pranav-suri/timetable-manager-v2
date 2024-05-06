import getTables from "./getTables";
import available from "./available";
import editing from "./editing";
import validate from "./validate";
import addCsv from "./addCsv";
import generate from './generate';
import Elysia from "elysia";
import cors from "@elysiajs/cors";

import { swagger } from "@elysiajs/swagger";
import Logger from "../../../utils/logging";

const app = new Elysia()
    .use(swagger())
    .use(cors({ methods: ["GET", "POST", "DELETE", "PUT", "PATCH"] }))
    .get("/", () => {
        return { message: `${Date.now()}` };
    })
    .use(getTables)
    .use(available)
    .use(editing)
    .use(validate)
    .use(addCsv)
    .use(generate)
    .onError((ctx) => {
        const errorResponse = JSON.stringify({ message: ctx.error.toString(), ...ctx }, null, 2);

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
        Logger.log(errorResponse, "WARN", true, __filename);
        return JSON.parse(errorResponse);
    });

export default app;
