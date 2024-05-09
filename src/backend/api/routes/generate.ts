import { Elysia } from "elysia";
import { t } from "elysia";
import { getAcademicYearId } from "../../controllers";

const PYTHON_SERVER_URL = "http://localhost:5000";

const app = new Elysia({ prefix: "/generateTT" })
    .get(
        "/department/:id",
        async ({ params }) => {
            const { id } = params;
            const academicYearId = await getAcademicYearId("department", id);
            return await fetch(`${PYTHON_SERVER_URL}/generate/department/${id}/${academicYearId}`);
        },
        {
            detail: {
                summary: "Generate division timetable",
                tags: ["Generate Timetable"],
            },
            params: t.Object({
                id: t.Numeric(),
            }),
        },
    )
    .get(
        "/loading",
        async () => {
            return await fetch(`${PYTHON_SERVER_URL}/loading`);
        },
        {
            detail: {
                summary: "Get loading status",
                tags: ["Generate Timetable"],
            },
        },
    );

export default app;
