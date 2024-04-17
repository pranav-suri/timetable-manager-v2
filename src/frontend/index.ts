import { treaty } from "@elysiajs/eden";
import { AppType } from "../backend";

const api = treaty<AppType>("http://localhost:3000");

export default api;
