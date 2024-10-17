import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import cors from "cors";
import { appRouter } from "./trpc/appRouter";

const app = express();

app.use(cors());

app.use("/trpc", trpcExpress.createExpressMiddleware({ router: appRouter }));

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
