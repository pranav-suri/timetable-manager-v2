import { Elysia, t } from "elysia";
import { getAvailableClassrooms, getAvailableTeachers, getTimetable } from "../../controllers";

const app = new Elysia({ prefix: "available" })
    .get(
        "/availableTeachers",
        async ({ query }) => {
            const { subjectId, slotId } = query;
            return { teachers: await getAvailableTeachers(slotId, subjectId) };
        },
        {
            query: t.Object({
                subjectId: t.Numeric(),
                slotId: t.Numeric(),
            }),
            // response: t.Object({
            //     teachers: t.Array(
            //         t.Object({
            //             id: t.Numeric(),
            //             teacherName: t.String(),
            //         }),
            //     ),
            // }),
        },
    )
    .get(
        "/availableClassrooms",
        async ({ query, set }) => {
            const { subjectId, slotId } = query;
            return { classrooms: await getAvailableClassrooms(slotId, subjectId) };
        },
        {
            query: t.Object({
                subjectId: t.Numeric(),
                slotId: t.Numeric(),
            }),
        },
    );
export default app;
