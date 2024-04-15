import sampleDataUpload from "./api/upload/sampleUpload";
import app from "./api/routes";

app.listen(3000);

console.log("Listening on port 3000\nhttp://localhost:3000/");

export type AppType = typeof app;

// This function will upload the sample data to the database, uncomment to run.
// await sampleDataUpload({ syncDatabase: true });
