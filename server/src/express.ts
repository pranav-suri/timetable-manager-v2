import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import cors from "cors";
import { appRouter } from "./trpc/appRouter";

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.send(Date.now().toString());
});

app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        onError: ({ error }) => {
            console.error(error);
        },
    }),
);

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
