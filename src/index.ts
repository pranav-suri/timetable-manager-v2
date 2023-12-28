import Elysia from "elysia";
import cors from "@elysiajs/cors";

const app = new Elysia();

app.use(cors({ methods: ["GET"] }));

app.get("/", (request) => {
  return { message: `${Date.now()}` };
});

app.listen(3000);

console.log("Listening on port 3000");
