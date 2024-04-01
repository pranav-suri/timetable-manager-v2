import Elysia from "elysia";
import cors from "@elysiajs/cors";
import sampleDataUpload from "./api/upload/sampleUpload";
import app from "./api/routes";

app.listen(3000);

console.log("Listening on port 3000\nhttp://localhost:3000/");

// This function will upload the sample data to the database, uncomment to run.
// sampleDataUpload();
