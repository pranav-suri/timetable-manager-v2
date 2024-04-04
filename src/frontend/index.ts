import { treaty } from "@elysiajs/eden";
import { AppType } from "../backend";

const backend = treaty<AppType>("http://localhost:3000");

export default backend;
